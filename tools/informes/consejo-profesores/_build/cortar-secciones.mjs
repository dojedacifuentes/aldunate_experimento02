// Corta los insumos largos en piezas que un redactor pueda leer sin cargar el documento entero.
//   node cortar-secciones.mjs
// Informe 01: una pieza por sección del texto de la v3.2.0 y una ficha por institución (anexo A).
// Informe 02: un capítulo por archivo, desde el modelo de contenido JSON, en .json y en .txt legible.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const I01 = path.join(aqui, 'insumos', 'informe-01');
const I02 = path.join(aqui, 'insumos', 'informe-02');
const slug = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- Informe 01 ----------
const lineas = fs.readFileSync(path.join(I01, 'informe-01-v3.2.0.txt'), 'utf8').replace(/^﻿/, '').split(/\r?\n/);
const SECCIONES = [
  ['00-ficha', 'Ficha del documento'],
  ['01-resumen-ejecutivo', 'Resumen ejecutivo'],
  ['02-ocho-hallazgos', 'Los ocho hallazgos principales'],
  ['03-como-leer', 'Cómo leer este documento'],
  ['04-introduccion-y-objetivos', '1 · Introducción'],
  ['05-metodologia', '3 · Metodología'],
  ['06-panorama', 'Panorama del conjunto'],
  ['07-cobertura', 'Cobertura de la investigación'],
  ['08-capacidades-comparadas', 'Capacidades institucionales comparadas'],
  ['09-comparador', '4 · El comparador ordinal'],
  ['10-comprobacion', 'La comprobación que impide leer mal todo lo anterior'],
  ['11-discusion', '5 · Discusión'],
  ['12-contraste-externo', '6 · Contraste externo: qué dicen los terceros'],
  ['13-escala-internacional', '7 · La escala internacional'],
  ['14-institucion-apartada', '8 · La institución que no está en el comparador'],
  ['15-conclusiones', '9 · Conclusiones'],
  ['16-implicancias', '10 · Implicancias y decisiones'],
  ['17-limitaciones', '11 · Limitaciones'],
  ['18-agenda', '12 · Agenda de investigación'],
  ['19-nota-metodologica', 'Nota metodológica'],
  ['A-fichas', 'Las once instituciones, una por una'],
  ['B-divergencias', 'Registro de divergencias de la verificación'],
  ['C-celdas', 'Las capacidades, celda por celda'],
  ['D-rubrica', 'Comparador ordinal: rúbrica y cálculo'],
  ['E-contraste-anid', 'Contraste externo: proyectos ANID y fuentes de terceros'],
  ['F-internacional', 'Referencia internacional: normas, currículos y estudios'],
  ['G-candidatas', 'Candidatas fuera de cohorte'],
  ['H-registro-fuentes', 'Registro completo de fuentes'],
  ['I-ronda-2', 'Ampliación del corpus: las fuentes de la segunda ronda'],
];
const esCabecera = (l) => /^Informe 01 · IA en Escuelas y Facultades de Derecho en Chile/.test(l);
const inicios = [];
let desde = 0;
for (const [id, titulo] of SECCIONES) {
  let k = lineas.findIndex((l, i) => i >= desde && l.trim() === titulo);
  if (k < 0) throw new Error(`No se encontró la sección «${titulo}»`);
  inicios.push({ id, titulo, k });
  desde = id === '00-ficha' ? 157 : k + 1;
}
const dirSec = path.join(I01, 'secciones');
fs.mkdirSync(path.join(dirSec, 'fichas'), { recursive: true });
const indice = [];
inicios.forEach((s, n) => {
  const fin = n + 1 < inicios.length ? inicios[n + 1].k : lineas.length;
  const cuerpo = lineas.slice(s.k, fin).filter((l) => !esCabecera(l)).join('\n').replace(/\n{3,}/g, '\n\n');
  const archivo = path.join(dirSec, `${s.id}.txt`);
  fs.writeFileSync(archivo, `[Informe 01 v3.2.0 · líneas ${s.k + 1}-${fin} del texto completo]\n\n${cuerpo}\n`);
  indice.push({ archivo: path.relative(aqui, archivo), titulo: s.titulo, lineas: [s.k + 1, fin], palabras: (cuerpo.match(/[\p{L}\p{N}]+/gu) || []).length });
});

// Fichas del anexo A: cada bloque empieza con «NN/30» seguido del nombre.
const a = inicios.find((s) => s.id === 'A-fichas');
const b = inicios.find((s) => s.id === 'B-divergencias');
const bloque = lineas.slice(a.k, b.k);
const AVISO = 'ATENCIÓN: esta ficha conserva cifras de la matriz anterior (v1): el «NN/30», el piso, el techo y frases como «encabeza el comparador» o «banda de 12 a 20» NO son vigentes. Las cifras vigentes están en puntaje/resultados.json. El texto cualitativo sí es utilizable.';
const fichas = [];
for (let i = 0; i < bloque.length; i++) {
  if (/^\d+\/30$/.test(bloque[i].trim())) {
    let j = i + 1;
    while (j < bloque.length && !bloque[j].trim()) j++;
    fichas.push({ i, nombre: bloque[j].trim() });
  }
}
fichas.forEach((f, n) => {
  const fin = n + 1 < fichas.length ? fichas[n + 1].i : bloque.length;
  const texto = bloque.slice(f.i, fin).filter((l) => !esCabecera(l)).join('\n').replace(/\n{3,}/g, '\n\n');
  const archivo = path.join(dirSec, 'fichas', `${slug(f.nombre)}.txt`);
  fs.writeFileSync(archivo, `${AVISO}\n\n${texto}\n`);
  indice.push({ archivo: path.relative(aqui, archivo), titulo: `Ficha · ${f.nombre}` });
});

// ---------- Informe 02 ----------
const partes = fs.readdirSync(I02).filter((f) => /^contenido-.*\.json$/.test(f)).sort();
const items = partes.flatMap((f) => JSON.parse(fs.readFileSync(path.join(I02, f), 'utf8').replace(/^﻿/, '')));
const dirCap = path.join(I02, 'capitulos');
fs.mkdirSync(dirCap, { recursive: true });

function legible(it) {
  switch (it.t) {
    case 'h1': return `\n# ${it.n ? `${it.n} · ` : ''}${it.x}`;
    case 'h2': return `\n## ${it.x}`;
    case 'h3': return `\n### ${it.x}`;
    case 'p': case 'lead': return it.x;
    case 'callout': return `[RECUADRO${it.h ? `: ${it.h}` : ''}] ${it.x}`;
    case 'quote': return `> ${it.x}${it.a ? ` (${it.a})` : ''}`;
    case 'fig': return `[FIGURA ${it.id}] ${it.cap || ''}`;
    case 'table': return [`[TABLA] ${it.cap || ''}`, `| ${(it.head || []).join(' | ')} |`, ...(it.rows || []).map((r) => `| ${r.join(' | ')} |`)].join('\n');
    case 'numbers': case 'bullets': case 'list': return (it.items || []).map((x, k) => `${it.t === 'numbers' ? `${k + 1}.` : '-'} ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n');
    default: return `[${it.t}] ${JSON.stringify(it)}`;
  }
}

const capitulos = [];
for (const it of items) {
  if (it.t === 'h1' || !capitulos.length) capitulos.push({ titulo: it.t === 'h1' ? `${it.n ? `${it.n} · ` : ''}${it.x}` : 'Inicio', items: [] });
  capitulos[capitulos.length - 1].items.push(it);
}
capitulos.forEach((c, n) => {
  const base = `${String(n).padStart(2, '0')}-${slug(c.titulo).slice(0, 60)}`;
  fs.writeFileSync(path.join(dirCap, `${base}.json`), JSON.stringify(c.items, null, 1));
  const txt = c.items.map(legible).join('\n\n');
  fs.writeFileSync(path.join(dirCap, `${base}.txt`), `${txt}\n`);
  indice.push({ archivo: path.relative(aqui, path.join(dirCap, `${base}.txt`)), titulo: `Informe 02 · ${c.titulo}`, palabras: (txt.match(/[\p{L}\p{N}]+/gu) || []).length });
});
const resumen = JSON.parse(fs.readFileSync(path.join(I02, 'resumen-01.json'), 'utf8').replace(/^﻿/, ''));
fs.writeFileSync(path.join(dirCap, 'resumen-ejecutivo.txt'), `${resumen.map(legible).join('\n\n')}\n`);

fs.writeFileSync(path.join(aqui, 'insumos', 'indice-de-piezas.json'), JSON.stringify(indice, null, 1));
for (const p of indice) console.log(`${String(p.palabras ?? '').padStart(6)}  ${p.archivo}  ·  ${p.titulo}`);
