// Base de hechos por institución para el Documento A, construida sin agentes:
// matriz vigente (v2) + CSV del corpus + fuentes de la ronda 2 + instrumentos del anexo D
// + texto cualitativo del anexo A (con aviso de cifras no vigentes) + resultados del ICIA.
//   node hechos-instituciones.mjs     (correr después de cortar-secciones.mjs y puntaje/puntaje.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const I01 = path.join(aqui, 'insumos', 'informe-01');
const SEC = path.join(I01, 'secciones');
const leer = (p) => fs.readFileSync(p, 'utf8').replace(/^﻿/, '');
const slug = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function csv(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let q = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (q) {
      if (c === '"') { if (texto[i + 1] === '"') { campo += '"'; i++; } else q = false; } else campo += c;
    } else if (c === '"') q = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo.replace(/\r$/, '')); filas.push(fila); fila = []; campo = ''; }
    else campo += c;
  }
  if (campo.length || fila.length) { fila.push(campo.replace(/\r$/, '')); filas.push(fila); }
  const utiles = filas.filter((f) => !(f.length === 1 && f[0] === ''));
  const [cab, ...resto] = utiles;
  return resto.map((f) => Object.fromEntries(cab.map((h, k) => [h, f[k] ?? ''])));
}

const universidades = csv(leer(path.join(I01, 'universidades.csv')));
const fuentes = csv(leer(path.join(I01, 'fuentes.csv')));
const evidencias = csv(leer(path.join(I01, 'evidencias.csv')));
const iniciativas = csv(leer(path.join(I01, 'iniciativas.csv')));
const cobertura = csv(leer(path.join(I01, 'cobertura.csv')));
const afirmaciones = csv(leer(path.join(I01, 'afirmaciones.csv')));
const resultados = JSON.parse(leer(path.join(aqui, 'puntaje', 'resultados.json')));

const CORTO = {
  'puc-chile': 'P. U. Católica de Chile', uchile: 'U. de Chile', udp: 'U. Diego Portales', uandes: 'U. de los Andes',
  uai: 'U. Adolfo Ibáñez', unab: 'U. Andrés Bello', udd: 'U. del Desarrollo', uautonoma: 'U. Autónoma de Chile',
  ucentral: 'U. Central de Chile', pucv: 'P. U. Católica de Valparaíso', udec: 'U. de Concepción',
};

// Fuentes de la ronda 2 (anexo I)
const textoI = leer(path.join(SEC, 'I-ronda-2.txt'));
const r2 = {};
for (const m of textoI.matchAll(/(R2-[A-Z]+-\d+)\s*\n\s*\n([^\n]+)\n([^\n·]+?) · grado ([A-E]) · ([^\n]*?)(https?:\/\/\S+)/g)) {
  r2[m[1]] = { titulo: m[2].trim(), institucion: m[3].trim(), grado: m[4], tipo: m[5].trim(), url: m[6].trim(), verificacion: 'ronda2_sin_contraste' };
}

// Instrumentos formales (anexo D): filas «Institución | Capacidad | Instrumento |»
const textoD = leer(path.join(SEC, 'D-rubrica.txt'));
const instrumentos = [];
for (const l of textoD.split('\n')) {
  const c = l.split('|').map((x) => x.trim()).filter((x, k, a) => k < a.length - 1 || x);
  if (c.length >= 3 && /^(P\. U\.|U\.)/.test(c[0]) && !/Piso|Techo/.test(l)) instrumentos.push({ inst: c[0], capacidad: c[1], instrumento: c[2] });
}
const normalizarInst = (t) => t.replace(/^U\. Autónoma de Chile$/, 'U. Autónoma de Chile');

// Divergencias (anexo B): líneas que mencionan a la institución
const textoB = leer(path.join(SEC, 'B-divergencias.txt')).split('\n').filter((l) => l.trim().length > 40);

const salida = [];
fs.mkdirSync(path.join(aqui, 'hechos', 'instituciones'), { recursive: true });

for (const u of universidades) {
  const id = u.university_id;
  const corto = CORTO[id];
  const res = resultados.instituciones.find((x) => x.id === id);
  if (!res) throw new Error(`Sin resultados para ${id}`);
  const fichaArchivo = path.join(SEC, 'fichas', `${slug(u.official_name)}.txt`);
  const ficha = fs.existsSync(fichaArchivo) ? leer(fichaArchivo) : null;
  const fts = fuentes.filter((f) => f.university_id === id);
  const evs = evidencias.filter((e) => e.university_id === id);
  const ins = iniciativas.filter((i) => i.university_id === id);
  const cob = cobertura.find((c) => c.university_id === id) || null;
  const afs = afirmaciones.filter((a) => a.university_id === id);
  const r2propias = Object.fromEntries(Object.entries(r2).filter(([, v]) => normalizarInst(v.institucion) === corto));
  const instr = instrumentos.filter((x) => normalizarInst(x.inst) === corto);
  const variantes = [corto, u.official_name, res.sigla].filter(Boolean);
  const divergencias = textoB.filter((l) => variantes.some((v) => l.includes(v)));

  const obj = {
    id, nombre_oficial: u.official_name, nombre_corto: corto, sigla: res.sigla, unidad: u.unit_name, nota_cohorte: u.notes,
    en_ranking: res.en_ranking, posicion: res.posicion, icia: { indice: res.indice, subindices: res.subindices, indice_verificado: res.indice_verificado, pct_sobre_fuentes_sin_contrastar: res.pct_sobre_fuentes_sin_contrastar, indice_simple: res.indice_simple, rango_posiciones_grilla: res.rango_posiciones_grilla },
    capacidades: res.celdas,
    instrumentos_formales_anexo_d: instr,
    cobertura: cob,
    ficha_anexo_a: ficha,
    iniciativas: ins,
    evidencias: evs,
    afirmaciones: afs,
    fuentes_corpus: fts,
    fuentes_ronda2: r2propias,
    divergencias_anexo_b: divergencias,
  };
  salida.push(obj);

  // Resumen legible para redactores
  const f1 = (x) => (x === null || x === undefined ? '—' : String(x).replace('.', ','));
  const L = [];
  L.push(`# ${u.official_name} (${res.sigla})`);
  L.push('');
  L.push(`Unidad observada: ${u.unit_name}. ${u.notes}`);
  L.push(`Ranking: ${res.en_ranking ? `posición ${res.posicion} de 10` : 'fuera del ranking (conflicto de interés del autor)'} · ICIA ${f1(res.indice.piso)}${res.tiene_banda ? `–${f1(res.indice.techo)}` : ''} sobre 100 · verificado ${f1(res.indice_verificado.piso)} · ${f1(res.pct_sobre_fuentes_sin_contrastar)} % del índice sobre fuentes sin contrastar · índice simple ${res.indice_simple.piso}${res.indice_simple.nc ? `–${res.indice_simple.techo}` : ''} de 30.`);
  L.push(`Subíndices: Gobierno y reglas ${f1(res.subindices.GOB.piso)}; Docencia ${f1(res.subindices.DOC.piso)}${res.subindices.DOC.techo !== res.subindices.DOC.piso ? `–${f1(res.subindices.DOC.techo)}` : ''}; Recursos, investigación y vínculo ${f1(res.subindices.REC.piso)}; Alcance y efecto ${f1(res.subindices.RES.piso)}${res.subindices.RES.techo !== res.subindices.RES.piso ? `–${f1(res.subindices.RES.techo)}` : ''}.`);
  L.push('');
  L.push('## Estado por capacidad (matriz vigente v2)');
  L.push('| Capacidad | Estado | Puntos | Ronda 2 | Nota |');
  L.push('|---|---|---|---|---|');
  for (const c of res.celdas) {
    const r2txt = c.cerrada_en_ronda2 ? `${c.fuentes_r2.join('; ') || 'sin fuente'}${c.sin_contrastar ? ' · sin contrastar' : ' · ya en corpus'}${c.url_caida ? ' · DIRECCIÓN CAÍDA' : ''}${c.escaneada ? ' · documento escaneado' : ''}` : '—';
    L.push(`| ${c.capacidad} | ${c.estado_nombre} | ${c.puntos ?? 'NC'} | ${r2txt} | ${c.nota_r2 || ''} |`);
  }
  if (instr.length) {
    L.push('');
    L.push('## Instrumentos formales que acreditan capacidades (anexo D)');
    for (const x of instr) L.push(`- ${x.capacidad}: ${x.instrumento}`);
  }
  if (cob) {
    L.push('');
    L.push(`## Cobertura de la investigación (no mide capacidad)`);
    L.push(`Rutas ${cob.routes_completed} de ${cob.routes_total}; fuentes ${cob.sources}; contrastadas ${cob.substantively_verified_sources}; piloto: ${cob.in_pilot}. ${cob.notes}`);
  }
  if (ficha) {
    L.push('');
    L.push('## Ficha cualitativa del anexo A');
    L.push(ficha.trim());
  }
  L.push('');
  L.push('## Iniciativas (iniciativas.csv)');
  for (const i of ins) L.push(`- ${i.name} · inicio ${i.start_date} · ${i.current_status} · ${i.mechanism_type} · nivel ${i.institutional_level} · responsable: ${i.responsible_unit}. Productos: ${i.products || '—'}. Resultados: ${i.outcomes || '—'}. Fuentes: ${i.source_ids}. ${i.notes}`);
  L.push('');
  L.push('## Evidencias (evidencias.csv)');
  for (const e of evs) L.push(`- [${e.evidence_id} · ${e.dimension} · ${e.institutional_level} · ${e.temporal_status}] ${e.factual_statement} (fuente ${e.source_id}; ${e.workflow_status}). Límite: ${e.limitations || '—'}`);
  if (afs.length) {
    L.push('');
    L.push('## Afirmaciones (afirmaciones.csv)');
    for (const a of afs) L.push(`- [${a.claim_id} · ${a.classification} · confianza ${a.confidence}] ${a.claim_text} Límite: ${a.limitations}`);
  }
  L.push('');
  L.push('## Fuentes del corpus contrastado (fuentes.csv)');
  for (const f of fts) L.push(`- ${f.source_id} · ${f.title} · ${f.publisher} · ${f.published_date} · ${f.url} · ${f.workflow_status}${f.verified_by ? ` (${f.verified_by})` : ''}. ${f.notes}`);
  if (Object.keys(r2propias).length) {
    L.push('');
    L.push('## Fuentes de la ronda 2 (sin contraste sustantivo)');
    for (const [k, v] of Object.entries(r2propias)) L.push(`- ${k} · ${v.titulo} · grado ${v.grado} · ${v.tipo} · ${v.url}`);
  }
  if (divergencias.length) {
    L.push('');
    L.push('## Divergencias de la verificación (anexo B, líneas que la mencionan)');
    for (const d of divergencias) L.push(`- ${d.trim()}`);
  }
  fs.writeFileSync(path.join(aqui, 'hechos', 'instituciones', `${id}.md`), `${L.join('\n')}\n`);
  console.log(`${id.padEnd(10)} capacidades ${res.celdas.length} · iniciativas ${ins.length} · evidencias ${evs.length} · fuentes ${fts.length} + R2 ${Object.keys(r2propias).length} · instrumentos ${instr.length} · ficha ${ficha ? 'sí' : 'NO'} · divergencias ${divergencias.length}`);
}

fs.writeFileSync(path.join(aqui, 'hechos', 'i01-instituciones.json'), JSON.stringify(salida, null, 1));
console.log(`Fuentes R2 leídas del anexo I: ${Object.keys(r2).length} (se esperaban 22)`);
