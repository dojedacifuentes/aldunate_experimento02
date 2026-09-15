// Gráficos del Documento A, desde puntaje/resultados.json y los CSV del corpus.
//   node figuras-informe-01.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { barrasH, columnas, apiladas, matrizBarras, renderizar, COLOR, colorDe, num } from './graficos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const R = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'resultados.json'), 'utf8'));

function csv(texto) {
  const filas = [];
  let fila = [], campo = '', q = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (q) { if (c === '"') { if (texto[i + 1] === '"') { campo += '"'; i++; } else q = false; } else campo += c; }
    else if (c === '"') q = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo.replace(/\r$/, '')); filas.push(fila); fila = []; campo = ''; }
    else campo += c;
  }
  if (campo.length || fila.length) { fila.push(campo.replace(/\r$/, '')); filas.push(fila); }
  const [cab, ...resto] = filas.filter((f) => !(f.length === 1 && f[0] === ''));
  return resto.map((f) => Object.fromEntries(cab.map((h, k) => [h, f[k] ?? ''])));
}
const iniciativas = csv(fs.readFileSync(path.join(aqui, 'insumos', 'informe-01', 'iniciativas.csv'), 'utf8'));

// a01 · iniciativas por año de inicio declarado
const porAnio = {};
let sinFecha = 0;
for (const i of iniciativas) {
  const a = (i.start_date || '').slice(0, 4);
  if (/^\d{4}$/.test(a)) porAnio[a] = (porAnio[a] || 0) + 1; else sinFecha++;
}
const antes2020 = Object.entries(porAnio).filter(([a]) => Number(a) < 2020).reduce((s, [, n]) => s + n, 0);
const barrasAnio = [
  { etiqueta: 'Antes de 2020', valor: antes2020 },
  ...['2020', '2021', '2022', '2023', '2024', '2025', '2026'].map((a) => ({ etiqueta: a, valor: porAnio[a] || 0, enfasis: a === '2025' || a === '2026' })),
  { etiqueta: '2027 (anunciada)', valor: porAnio['2027'] || 0 },
];
const fechadas = Object.values(porAnio).reduce((s, n) => s + n, 0);
if (iniciativas.length !== 53 || fechadas !== 49 || (porAnio['2025'] || 0) + (porAnio['2026'] || 0) + (porAnio['2027'] || 0) !== 41 || sinFecha !== 4) {
  throw new Error(`Recuentos de iniciativas inesperados: total ${iniciativas.length}, fechadas ${fechadas}, sin fecha ${sinFecha}`);
}

// a03 · escalera de institucionalización (current_status 1-4)
const escalera = [1, 2, 3, 4].map((n) => iniciativas.filter((i) => String(i.current_status).trim().startsWith(String(n))).length);
if (escalera.join(',') !== '19,21,13,0') throw new Error(`Escalera inesperada: ${escalera.join(',')} (se esperaba 19,21,13,0)`);

const diez = R.ranking.map((r) => R.instituciones.find((i) => i.nombre_corto === r.nombre_corto));
const pucv = R.instituciones.find((i) => i.id === 'pucv');
const banda = (p, t) => (p === t ? num(p) : `${num(p)}–${num(t)}`);
const ESTADO_CORTO = { OPF: 'formalizada', OP: 'en funcionamiento', INC: 'incipiente', ENT: 'solo en la universidad', ADY: 'adyacente', NL: 'no localizada', NC: 'sin información concluyente' };

const distrib = [...R.distribucion_capacidades]
  .sort((a, b) => (b.conteo.OPF + b.conteo.OP) - (a.conteo.OPF + a.conteo.OP) || b.conteo.OPF - a.conteo.OPF)
  .map((d) => ({ etiqueta: d.capacidad, valores: { alto: d.conteo.OPF, medio: d.conteo.OP, bajo: d.conteo.INC + d.conteo.ENT + d.conteo.ADY, cero: d.conteo.NL, nc: d.conteo.NC } }));

// Nombres breves para las cabeceras de columna de los gráficos (el texto usa los nombres completos).
const NOMBRE_BREVE = { GOB: 'Gobierno y reglas', DOC: 'Docencia', REC: 'Recursos y vínculo', RES: 'Alcance y efecto' };
const dims = R.metodo.dimensiones.map((d) => ({ id: d.id, nombre: NOMBRE_BREVE[d.id] || d.nombre }));
const filasDim = diez.map((i) => ({ etiqueta: i.nombre_corto, color: colorDe(i.id), valores: Object.fromEntries(dims.map((d) => [d.id, i.subindices[d.id].piso])) }));
filasDim.push({ etiqueta: 'Promedio de las diez', color: colorDe('promedio'), valores: Object.fromEntries(R.campo.map((c) => [c.dimension, c.piso])) });

const graficos = [
  { id: 'a01-iniciativas-anio', ...columnas(barrasAnio, { maximo: 25, marcas: [0, 5, 10, 15, 20, 25], alto: 230, mostrarCeros: true }) },
  {
    id: 'a02-estados-capacidad',
    ...apiladas(distrib, [
      { clave: 'alto', nombre: 'Formalizada con instrumento', color: COLOR.ordinal.alto, textoClaro: true },
      { clave: 'medio', nombre: 'En funcionamiento', color: COLOR.ordinal.medio, textoClaro: true },
      { clave: 'bajo', nombre: 'Incipiente o solo en la universidad', color: COLOR.ordinal.bajo },
      { clave: 'cero', nombre: 'No localizada', color: COLOR.cero },
      { clave: 'nc', nombre: 'Sin información concluyente', color: COLOR.gris },
    ], { total: 10 }),
  },
  {
    id: 'a03-escalera',
    ...barrasH([
      { etiqueta: '1. Exploración', valor: escalera[0] },
      { etiqueta: '2. Operación', valor: escalera[1] },
      { etiqueta: '3. Institucionalización', valor: escalera[2] },
      { etiqueta: '4. Resultados evaluados', valor: escalera[3] },
    ], { maximo: 25, marcas: [0, 5, 10, 15, 20, 25], decimales: 0 }),
  },
  {
    id: 'a04-anid',
    ...barrasH([
      { etiqueta: 'Derecho con objeto de IA (2025-2026)', valor: 7 },
      { etiqueta: 'IA y enseñanza, otras disciplinas (2024-2026)', valor: 10 },
      { etiqueta: 'Enseñanza del Derecho con IA (1982-2026)', valor: 0 },
    ], { maximo: 12, marcas: [0, 3, 6, 9, 12], decimales: 0, maxEtiqueta: 300 }),
  },
  {
    id: 'a05-ranking-icia',
    ...barrasH(diez.map((i) => ({ etiqueta: `${i.posicion}. ${i.nombre_corto}`, valor: i.indice.piso, color: colorDe(i.id), ...(i.tiene_banda ? { min: i.indice.piso, max: i.indice.techo } : {}) })), {
      maximo: 100, notaEje: 'Índice sobre 100 · la línea indica el margen por información no concluyente', derecha: 80,
      formatoValor: (f) => banda(f.valor, f.max ?? f.valor),
    }),
  },
  { id: 'a06-subindices', ...matrizBarras(filasDim, dims, { maxEtiqueta: 190, notaEje: 'Subíndice sobre 100 en cada dimensión (valor mínimo acreditado)' }) },
  {
    id: 'a07-solidez',
    ...apiladas(diez.map((i) => ({ etiqueta: i.nombre_corto, valores: { verif: i.indice_verificado.piso, pend: Math.round((i.indice.piso - i.indice_verificado.piso) * 10) / 10 } })), [
      { clave: 'verif', nombre: 'Sostenido por fuentes contrastadas', color: COLOR.ordinal.alto, textoClaro: true },
      { clave: 'pend', nombre: 'Sostenido por fuentes de la segunda ronda sin contrastar', color: COLOR.ordinal.bajo },
    ], { total: 100, formatoSegmento: (v) => num(v) }),
  },
  {
    id: 'a09-pucv-perfil',
    ...barrasH(pucv.celdas.map((c) => ({ etiqueta: c.capacidad, valor: c.puntos ?? 0, anotacion: ESTADO_CORTO[c.estado] })), {
      maximo: 3, marcas: [0, 1, 2, 3], formatoValor: (f) => `${f.valor} de 3`, derecha: 190, maxEtiqueta: 175,
    }),
  },
  {
    id: 'a10-pucv-dimensiones',
    ...matrizBarras([
      { etiqueta: 'PUCV', enfasis: true, valores: Object.fromEntries(dims.map((d) => [d.id, pucv.subindices[d.id].piso])) },
      { etiqueta: 'Promedio de las diez', valores: Object.fromEntries(R.campo.map((c) => [c.dimension, c.piso])) },
    ], dims, { maxEtiqueta: 150, notaEje: 'Subíndice sobre 100 en cada dimensión' }),
  },
];

await renderizar(graficos, path.join(aqui, 'figuras', 'informe-01'));
console.log(graficos.map((g) => `${g.id} ${g.ancho}x${Math.round(g.alto)}`).join('\n'));
console.log(`iniciativas: ${iniciativas.length} · fechadas ${fechadas} · sin fecha ${sinFecha} · por año ${JSON.stringify(porAnio)} · escalera ${escalera.join('/')}`);
