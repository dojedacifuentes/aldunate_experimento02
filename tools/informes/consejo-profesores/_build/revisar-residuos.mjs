// Revisión automática previa a la maquetación: residuos heredados, jerga interna, metáforas vetadas
// y coherencia de ids de gráficos, tablas y notas.
//   node revisar-residuos.mjs <carpeta-redaccion> <carpeta-figuras> [--doc a|b]
import fs from 'node:fs';
import path from 'node:path';

const [carpetaArg, figurasArg] = process.argv.slice(2);
const doc = (process.argv.includes('--doc') ? process.argv[process.argv.indexOf('--doc') + 1] : 'a').toLowerCase();
const carpeta = path.resolve(carpetaArg);
const figuras = path.resolve(figurasArg);
const archivos = fs.readdirSync(carpeta).filter((f) => f.endsWith('.md') && !/^(plan|revision)/.test(f)).sort();

const RESIDUOS = [
  [/primera posici[oó]n/i, 'posición atribuida a la PUCV o residuo de la v3.2.0'],
  [/segunda de once/i, 'posición que habría ocupado la PUCV'],
  [/encabeza(ría)? el (comparador|orden|ranking)/i, 'residuo de la matriz antigua'],
  [/18 sobre 30/i, 'máximo erróneo de la v3.2.0'],
  [/\b44 ?%/, 'cifra del sesgo del piloto no reproducible'],
  [/banda de 12 a 20/i, 'cifra de la matriz antigua'],
];
const JERGA_A = [/\bceldas?\b/i, /\brutas?\b del protocolo/i, /\bOPF\b/, /\bNC\b/, /\bpiso\b/i, /\btecho\b/i, /\bcomparador\b/i];
const METAFORAS = [/\bventana\b/i, /\bcostura\b/i, /\beslab[oó]n\b/i, /punta del iceberg/i, /hoja de ruta/i, /\becosistema\b/i, /\bpelda[ñn]o que se erosiona\b/i];
const ETIQUETAS_B = [/\bVERIFICADO\b/, /\bCONTROVERTIDO\b/, /\bINSUFICIENTE\b/, /revisi[oó]n sistem[aá]tica/i, /cinco profundidades/i];

const hallazgos = [];
const idsGrafico = new Map();
const idsTabla = new Map();
const refs = [];

for (const f of archivos) {
  const texto = fs.readFileSync(path.join(carpeta, f), 'utf8').replace(/\r\n/g, '\n');
  const lineas = texto.split('\n');
  const defs = new Set();
  const llamadas = new Set();
  lineas.forEach((l, i) => {
    const n = i + 1;
    const esDefinicion = /^\[\^[^\]]+\]:/.test(l);
    const esDirectiva = /^::/.test(l.trim());
    if (esDefinicion) defs.add(l.match(/^\[\^([^\]]+)\]/)[1]);
    for (const m of l.matchAll(/\[\^([^\]]+)\](?!:)/g)) llamadas.add(m[1]);
    for (const [re, motivo] of RESIDUOS) if (re.test(l)) hallazgos.push(`${f}:${n} · residuo · ${motivo} · «${l.trim().slice(0, 90)}»`);
    if (!esDefinicion && !esDirectiva) {
      for (const re of METAFORAS) if (re.test(l)) hallazgos.push(`${f}:${n} · metáfora vetada ${re} · «${l.trim().slice(0, 90)}»`);
      if (doc === 'a' && !/^[A-C]-/.test(f)) for (const re of JERGA_A) if (re.test(l)) hallazgos.push(`${f}:${n} · jerga interna ${re} · «${l.trim().slice(0, 90)}»`);
      if (doc === 'b') for (const re of ETIQUETAS_B) if (re.test(l) && !/no (es|puede llamarse|constituye)/i.test(l)) hallazgos.push(`${f}:${n} · etiqueta o denominación del informe experto ${re} · «${l.trim().slice(0, 90)}»`);
    }
    let m;
    if ((m = l.match(/^::grafico\s+.*?id="([^"]+)"/))) {
      if (idsGrafico.has(m[1])) hallazgos.push(`${f}:${n} · gráfico repetido ${m[1]} (ya en ${idsGrafico.get(m[1])})`);
      idsGrafico.set(m[1], `${f}:${n}`);
      if (!fs.existsSync(path.join(figuras, `${m[1]}.png`))) hallazgos.push(`${f}:${n} · no existe la figura ${m[1]}.png`);
    }
    if ((m = l.match(/^::tabla\s+.*?id="([^"]+)"/))) {
      if (idsTabla.has(m[1])) hallazgos.push(`${f}:${n} · tabla repetida ${m[1]} (ya en ${idsTabla.get(m[1])})`);
      idsTabla.set(m[1], `${f}:${n}`);
    }
    for (const r of l.matchAll(/\{\{(grafico|tabla):([^}]+)\}\}/g)) refs.push({ tipo: r[1], id: r[2], donde: `${f}:${n}` });
    if (/^#{1,3}\s.*:/.test(l)) hallazgos.push(`${f}:${n} · título con dos puntos · «${l.trim()}»`);
    if (/\*\*[^*]+\*\*/.test(l) && !esDirectiva) hallazgos.push(`${f}:${n} · negrita · «${l.trim().slice(0, 90)}»`);
  });
  for (const c of llamadas) if (!defs.has(c)) hallazgos.push(`${f} · nota llamada sin definición [^${c}]`);
  for (const d of defs) if (!llamadas.has(d)) hallazgos.push(`${f} · nota definida y no llamada [^${d}]`);
}
for (const r of refs) {
  const mapa = r.tipo === 'grafico' ? idsGrafico : idsTabla;
  if (!mapa.has(r.id)) hallazgos.push(`${r.donde} · referencia a ${r.tipo} inexistente ${r.id}`);
}
const figurasDisponibles = fs.existsSync(figuras) ? fs.readdirSync(figuras).filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, '')) : [];
for (const id of figurasDisponibles) if (!idsGrafico.has(id)) hallazgos.push(`figura sin usar: ${id}`);

console.log(`${archivos.length} archivos · ${idsGrafico.size} gráficos · ${idsTabla.size} tablas`);
console.log(hallazgos.length ? hallazgos.join('\n') : 'Sin hallazgos.');
process.exit(hallazgos.length ? 1 : 0);
