// Construye un .docx de informe tradicional a partir de capítulos en formato de borrador
// (ver formato-borrador.md) y de una configuración JSON.
//   node construir-docx.mjs <config.json>
// El resultado se ajusta para Word 2007 (compat2007.mjs), que es el que exporta el PDF.
import fs from 'node:fs';
import path from 'node:path';
import {
  Document, Packer, Paragraph, TextRun, TableOfContents, Header, Footer, PageNumber,
  AlignmentType, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  FootnoteReferenceRun, PageBreak, LevelFormat, SectionType, NumberFormat, HeadingLevel,
} from 'docx';
import { compat2007 } from './compat2007.mjs';

const cfgPath = path.resolve(process.argv[2]);
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const base = path.dirname(cfgPath);
const ruta = (p) => path.resolve(base, p);

const FUENTE = cfg.fuente || 'Cambria';
const CAJA_DXA = 8788; // A4 con márgenes 3 cm izquierda y 2,5 cm derecha
const CAJA_PX = 586;
const avisos = [];

// ---------- lectura y numeración previa ----------

const archivosCuerpo = cfg.cuerpo.map(ruta);
const archivosAnexos = (cfg.anexos || []).map(ruta);
const todos = [...archivosCuerpo, ...archivosAnexos];
const textos = new Map(todos.map((f) => {
  if (!fs.existsSync(f)) { avisos.push(`falta el archivo ${f}`); return [f, '']; }
  return [f, fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')];
}));

const numeroGrafico = new Map();
const numeroTabla = new Map();
for (const f of todos) {
  for (const m of textos.get(f).matchAll(/^::(grafico|tabla)\s+.*?id="([^"]+)"/gm)) {
    const mapa = m[1] === 'grafico' ? numeroGrafico : numeroTabla;
    if (mapa.has(m[2])) avisos.push(`id repetido: ${m[2]}`);
    else mapa.set(m[2], mapa.size + 1);
  }
}
for (const f of todos) {
  textos.set(f, textos.get(f).replace(/\{\{(grafico|tabla):([^}]+)\}\}/g, (_, t, id) => {
    const n = (t === 'grafico' ? numeroGrafico : numeroTabla).get(id);
    if (!n) { avisos.push(`referencia a ${t} inexistente: ${id}`); return `[${t} ${id}]`; }
    return String(n);
  }));
}

// ---------- notas al pie ----------

const notas = {};
let contadorNotas = 0;

function atributos(linea) {
  const a = {};
  for (const m of linea.matchAll(/(\w+)="([^"]*)"/g)) a[m[1]] = m[2];
  return a;
}

// ---------- texto en línea ----------

function runs(texto, ctx, opciones = {}) {
  const out = [];
  const partes = texto.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[\^[^\]]+\])/g).filter((p) => p !== '');
  for (const p of partes) {
    if (p.startsWith('[^')) {
      const clave = p.slice(2, -1);
      if (!ctx) { out.push(new TextRun({ text: p, ...opciones })); continue; }
      const def = ctx.defs.get(clave);
      if (def === undefined) { avisos.push(`nota sin definición [^${clave}] en ${path.basename(ctx.archivo)}`); continue; }
      const id = ++contadorNotas;
      ctx.usadas.add(clave);
      notas[id] = { children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 40, line: 240 }, children: [new TextRun({ text: ' ', size: 18 }), ...runs(def, null, { size: 18 })] })] };
      out.push(new FootnoteReferenceRun(id));
    } else if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
      out.push(new TextRun({ text: p.slice(2, -2), bold: true, ...opciones }));
    } else if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
      out.push(new TextRun({ text: p.slice(1, -1), italics: true, ...opciones }));
    } else {
      out.push(new TextRun({ text: p, ...opciones }));
    }
  }
  return out;
}

// ---------- bloques ----------

// Cifra, rango de cifras («39,2–46,9», «12–14», «2 a 3») o raya de dato ausente.
const esNumero = (t) => /^[\s−–+-]*[\d.,]+(\s*(–|-|a)\s*[\d.,]+)?\s*(%|pts?\.?)?\s*$/.test(t) || /^—$/.test(t.trim());
let instanciaLista = 0;

function tabla(attrs, lineas, ctx) {
  const filas = lineas
    .filter((l) => !/^\|\s*:?-{2,}/.test(l))
    .map((l) => l.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));
  const ncol = Math.max(...filas.map((f) => f.length));
  let anchos = attrs.anchos ? attrs.anchos.split(',').map(Number) : Array(ncol).fill(100 / ncol);
  if (anchos.length !== ncol) { avisos.push(`tabla ${attrs.id}: anchos no coincide con columnas`); anchos = Array(ncol).fill(100 / ncol); }
  const suma = anchos.reduce((s, v) => s + v, 0);
  const dxa = anchos.map((a) => Math.round((CAJA_DXA * a) / suma));
  const borde = { style: BorderStyle.SINGLE, size: 8, color: '404040' };
  const fino = { style: BorderStyle.SINGLE, size: 2, color: 'BFBFBF' };
  const nada = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const rows = filas.map((f, i) => new TableRow({
    tableHeader: i === 0,
    cantSplit: true,
    children: Array.from({ length: ncol }, (_, j) => {
      const t = f[j] ?? '';
      return new TableCell({
        width: { size: dxa[j], type: WidthType.DXA },
        margins: { top: 45, bottom: 45, left: 90, right: 90 },
        shading: i === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: 'F2F1ED' } : undefined,
        borders: { top: i === 0 ? borde : nada, bottom: i === 0 || i === filas.length - 1 ? borde : fino, left: nada, right: nada },
        children: [new Paragraph({
          alignment: j > 0 && filas.length > 1 && filas.slice(1).every((g) => !(g[j] ?? '').trim() || esNumero(g[j])) ? AlignmentType.RIGHT : AlignmentType.LEFT,
          spacing: { after: 0, line: 240 },
          children: runs(t, ctx, { size: 19, bold: i === 0 }),
        })],
      });
    }),
  }));
  const n = numeroTabla.get(attrs.id);
  const out = [
    new Paragraph({ keepNext: true, spacing: { before: 200, after: 80 }, children: [new TextRun({ text: `Tabla ${n}. `, bold: true, size: 20 }), ...runs(attrs.titulo || '', ctx, { size: 20 })] }),
    new Table({ width: { size: CAJA_DXA, type: WidthType.DXA }, columnWidths: dxa, rows }),
  ];
  if (attrs.fuente) out.push(new Paragraph({ spacing: { before: 60, after: 220 }, children: runs(`Fuente: ${attrs.fuente}`, ctx, { size: 17, italics: true, color: '52514E' }) }));
  else out.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  return out;
}

function grafico(attrs, ctx) {
  const n = numeroGrafico.get(attrs.id);
  const png = path.join(ruta(cfg.figuras), `${attrs.id}.png`);
  const med = path.join(ruta(cfg.figuras), `${attrs.id}.json`);
  const out = [new Paragraph({ keepNext: true, spacing: { before: 220, after: 80 }, children: [new TextRun({ text: `Gráfico ${n}. `, bold: true, size: 20 }), ...runs(attrs.titulo || '', ctx, { size: 20 })] })];
  if (fs.existsSync(png) && fs.existsSync(med)) {
    const { ancho, alto } = JSON.parse(fs.readFileSync(med, 'utf8'));
    const w = Math.min(ancho, CAJA_PX);
    out.push(new Paragraph({ keepNext: !!attrs.fuente, alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new ImageRun({ type: 'png', data: fs.readFileSync(png), transformation: { width: w, height: Math.round((w * alto) / ancho) } })] }));
  } else {
    avisos.push(`falta la figura ${attrs.id}`);
    out.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `[FALTA GRÁFICO ${attrs.id}]`, color: 'C00000', bold: true })] }));
  }
  if (attrs.fuente) out.push(new Paragraph({ spacing: { before: 40, after: 240 }, children: runs(`Fuente: ${attrs.fuente}`, ctx, { size: 17, italics: true, color: '52514E' }) }));
  return out;
}

function capitulo(archivo) {
  const texto = textos.get(archivo);
  const defs = new Map();
  const cuerpo = [];
  const lineas = texto.split('\n');
  for (let i = 0; i < lineas.length; i++) {
    const m = lineas[i].match(/^\[\^([^\]]+)\]:\s*(.*)$/);
    if (m) {
      let def = m[2];
      while (i + 1 < lineas.length && /^( {2,}|\t)\S/.test(lineas[i + 1])) def += ' ' + lineas[++i].trim();
      defs.set(m[1], def);
    } else cuerpo.push(lineas[i]);
  }
  const ctx = { archivo, defs, usadas: new Set() };
  const out = [];
  let parrafo = [];
  const francesa = (cfg.sangria_francesa || []).includes(path.basename(archivo));
  const cerrar = () => {
    if (!parrafo.length) return;
    out.push(francesa
      ? new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 567, hanging: 567 }, spacing: { after: 100 }, children: runs(parrafo.join(' '), ctx) })
      : new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: runs(parrafo.join(' '), ctx) }));
    parrafo = [];
  };
  for (let i = 0; i < cuerpo.length; i++) {
    const l = cuerpo[i];
    const t = l.trim();
    if (!t) { cerrar(); continue; }
    let m;
    if ((m = t.match(/^(#{1,3})\s+(.*)$/))) {
      cerrar();
      const nivel = m[1].length;
      out.push(new Paragraph({ heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][nivel - 1], children: runs(m[2], ctx) }));
    } else if (t.startsWith('::grafico')) { cerrar(); out.push(...grafico(atributos(t), ctx)); }
    else if (t.startsWith('::tabla')) {
      cerrar();
      const attrs = atributos(t);
      const filas = [];
      while (i + 1 < cuerpo.length && cuerpo[i + 1].trim().startsWith('|')) filas.push(cuerpo[++i].trim());
      out.push(...tabla(attrs, filas, ctx));
    } else if (t === '::salto') { cerrar(); out.push(new Paragraph({ children: [new PageBreak()] })); }
    else if (t.startsWith('> ')) {
      cerrar();
      const cita = [t.slice(2)];
      while (i + 1 < cuerpo.length && cuerpo[i + 1].trim().startsWith('> ')) cita.push(cuerpo[++i].trim().slice(2));
      out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { left: 709, right: 425 }, spacing: { line: 250, after: 160 }, children: runs(cita.join(' '), ctx, { size: 20 }) }));
    } else if (/^(- |\d+\. )/.test(t)) {
      cerrar();
      const ordenada = /^\d+\. /.test(t);
      instanciaLista += 1;
      const items = [t];
      while (i + 1 < cuerpo.length && (ordenada ? /^\d+\. /.test(cuerpo[i + 1].trim()) : cuerpo[i + 1].trim().startsWith('- '))) items.push(cuerpo[++i].trim());
      for (const it of items) {
        out.push(new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          numbering: { reference: ordenada ? 'numerada' : 'vinetas', level: 0, instance: instanciaLista },
          spacing: { after: 60 },
          children: runs(it.replace(/^(- |\d+\. )/, ''), ctx),
        }));
      }
    } else if (t.startsWith('::')) { avisos.push(`directiva desconocida en ${path.basename(archivo)}: ${t.slice(0, 40)}`); }
    else parrafo.push(t);
  }
  cerrar();
  for (const clave of defs.keys()) if (!ctx.usadas.has(clave)) avisos.push(`nota definida y no llamada [^${clave}] en ${path.basename(archivo)}`);
  return out;
}

// ---------- portada ----------

function portada() {
  const p = (texto, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: o.after ?? 120, before: o.before ?? 0 }, children: [new TextRun({ text: texto, size: o.size || 24, bold: o.bold, italics: o.italics, color: o.color, smallCaps: o.smallCaps })] });
  return [
    p(cfg.institucion || '', { size: 22, smallCaps: true, color: '52514E', before: 600 }),
    p(cfg.unidad || '', { size: 20, color: '52514E', after: 2400 }),
    p(cfg.titulo, { size: 40, bold: true, after: 240 }),
    p(cfg.subtitulo || '', { size: 26, italics: true, after: 1800 }),
    p(cfg.preparado_para || '', { size: 21, color: '52514E', after: 1200 }),
    p(cfg.autor || '', { size: 24, after: 40 }),
    p(cfg.autor_titulo || '', { size: 20, color: '52514E', after: 1000 }),
    p(cfg.lugar_fecha || '', { size: 21 }),
  ];
}

// ---------- documento ----------

const encabezado = (texto) => new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0 }, children: [new TextRun({ text: texto, size: 16, color: '898781', smallCaps: true })] })] });
const pie = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '52514E' })] })] });
const pagina = { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1418, left: 1701, right: 1418, header: 708, footer: 708 } };

const cuerpoHijos = [
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: 'Índice', bold: true, size: 30 })] }),
  new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-2' }),
];
for (const f of archivosCuerpo) cuerpoHijos.push(...capitulo(f));
const anexosHijos = [];
for (const f of archivosAnexos) anexosHijos.push(...capitulo(f));

const titulo = (id, name, size, nivel, extra = {}) => ({
  id, name, basedOn: 'Normal', next: 'Normal', quickFormat: true,
  run: { font: FUENTE, size, bold: true, color: '1F1F1F', ...(extra.run || {}) },
  paragraph: { outlineLevel: nivel, keepNext: true, keepLines: true, ...(extra.paragraph || {}) },
});

const secciones = [
  { properties: { page: pagina }, children: portada() },
  {
    properties: { type: SectionType.NEXT_PAGE, page: { ...pagina, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
    headers: { default: encabezado(cfg.encabezado || cfg.titulo) },
    footers: { default: pie() },
    children: cuerpoHijos,
  },
];
if (anexosHijos.length) {
  secciones.push({
    properties: { type: SectionType.NEXT_PAGE, page: pagina },
    headers: { default: encabezado(`${cfg.encabezado || cfg.titulo} · Anexos`) },
    footers: { default: pie() },
    children: anexosHijos,
  });
}

const doc = new Document({
  creator: cfg.autor,
  title: cfg.titulo,
  description: cfg.subtitulo,
  features: { updateFields: true },
  numbering: {
    config: [
      { reference: 'vinetas', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 284 } } } }] },
      { reference: 'numerada', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 340 } } } }] },
    ],
  },
  styles: {
    default: { document: { run: { font: FUENTE, size: cfg.cuerpo_pt ? cfg.cuerpo_pt * 2 : 22 }, paragraph: { spacing: { line: 288, after: 140 } } } },
    paragraphStyles: [
      titulo('Heading1', 'Heading 1', 30, 0, { paragraph: { pageBreakBefore: cfg.capitulo_en_pagina_nueva !== false, spacing: { before: 0, after: 280 } } }),
      titulo('Heading2', 'Heading 2', 24, 1, { paragraph: { spacing: { before: 300, after: 120 } } }),
      titulo('Heading3', 'Heading 3', 22, 2, { run: { italics: true }, paragraph: { spacing: { before: 220, after: 80 } } }),
    ],
  },
  footnotes: notas,
  sections: secciones,
});

const salida = ruta(cfg.salida);
fs.mkdirSync(path.dirname(salida), { recursive: true });
const { buffer, cambios } = await compat2007(await Packer.toBuffer(doc));
fs.writeFileSync(salida, buffer);

const palabras = [...textos.values()].join(' ').replace(/\[\^[^\]]+\]:.*$/gm, '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
console.log(JSON.stringify({ salida, notas: contadorNotas, graficos: numeroGrafico.size, tablas: numeroTabla.size, palabras_borrador: palabras, ajustes_2007: cambios.length, avisos }, null, 1));
