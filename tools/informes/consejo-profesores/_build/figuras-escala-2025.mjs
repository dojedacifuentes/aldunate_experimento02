/**
 * Gráficos de la escala de cinco dimensiones para el Documento A.
 * Todas las cifras salen de puntaje/escala-2025.json.
 *
 * Cada universidad conserva su color en todos los gráficos, de modo que el lector
 * pueda seguir a una misma institución de una figura a otra.
 *
 *   node figuras-escala-2025.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { barrasH, matrizBarras, renderizar, COLOR, colorDe, num } from './graficos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const E = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'escala-2025.json'), 'utf8'));

const diez = E.orden.map((o) => E.universidades[o.id]);
const pucv = E.universidades.pucv;
const corto = (u) => u.nombre_corto || u.nombre;

/* Comprobaciones: si el corpus cambia, el gráfico no se dibuja con cifras viejas. */
if (diez.length !== 10) throw new Error(`Se esperaban diez instituciones en el orden, hay ${diez.length}`);
if (!pucv) throw new Error('Falta la PUCV en escala-2025.json');
for (const u of [...diez, pucv]) {
  const suma = Number(Object.values(u.dimensiones).reduce((s, d) => s + d.puntaje, 0).toFixed(2));
  if (suma !== u.total) throw new Error(`${u.nombre}: las dimensiones suman ${suma} y el total dice ${u.total}`);
}

const graficos = [];
const dec2 = (v) => num(v, 2);

/* Cuando la capacidad no consta, el rótulo muestra el rango y no solo el mínimo. */
const rotulo = (f) => (f.max !== undefined && f.max > f.valor ? `${dec2(f.valor)} a ${dec2(f.max)}` : dec2(f.valor));

/* ------------------------------------------------------------------ */
/* g01 · Puntaje total por universidad                                 */
/* ------------------------------------------------------------------ */

graficos.push({
  id: 'g01-total',
  ...barrasH(
    diez.map((u) => ({
      etiqueta: `${u.posicion}. ${corto(u)}`,
      valor: u.total,
      color: colorDe(u.id),
      ...(u.tiene_banda ? { min: u.total, max: u.total_techo } : {}),
    })),
    {
      maximo: 15,
      marcas: [0, 3, 6, 9, 12, 15],
      formatoValor: rotulo,
      derecha: 112,
      fila: 30,
      grosor: 19,
      notaEje: 'Puntaje total sobre 15 · la línea indica hasta dónde llegaría si se acreditara lo que no consta',
    }
  ),
});

/* ------------------------------------------------------------------ */
/* g02 a g06 · una por dimensión                                       */
/* ------------------------------------------------------------------ */

const DIMS = [
  { id: 'pregrado', num: 'g02', titulo: 'Formación Académica (Pregrado)' },
  { id: 'continua', num: 'g03', titulo: 'Formación Continua y Postgrado' },
  { id: 'investigacion', num: 'g04', titulo: 'Investigación y Desarrollo' },
  { id: 'vinculacion', num: 'g05', titulo: 'Vinculación con el Medio' },
  { id: 'uso', num: 'g06', titulo: 'Uso Interno Institucional de IA' },
];

for (const d of DIMS) {
  const filas = diez
    .map((u) => ({ u, d: u.dimensiones[d.id] }))
    .sort((a, b) => b.d.puntaje - a.d.puntaje || corto(a.u).localeCompare(corto(b.u), 'es'))
    .map(({ u, d: dim }) => ({
      etiqueta: corto(u),
      valor: dim.puntaje,
      color: colorDe(u.id),
      ...(dim.tiene_banda ? { min: dim.puntaje, max: dim.techo } : {}),
    }));
  filas.push({ etiqueta: 'Promedio de las diez', valor: E.promedios[d.id], color: colorDe('promedio') });
  graficos.push({
    id: `${d.num}-${d.id}`,
    ...barrasH(filas, {
      maximo: 3,
      marcas: [0, 1, 2, 3],
      formatoValor: rotulo,
      derecha: 100,
      fila: 28,
      grosor: 18,
      notaEje: `${d.titulo} · puntaje de 0 a 3`,
    }),
  });
}

/* ------------------------------------------------------------------ */
/* g07 · Perfil de las cinco dimensiones                               */
/* ------------------------------------------------------------------ */

const cols = DIMS.map((d) => ({
  id: d.id,
  nombre: d.titulo
    .replace(' (Pregrado)', '')
    .replace('Formación Continua y Postgrado', 'Formación continua')
    .replace('Uso Interno Institucional de IA', 'Uso interno')
    .replace('Vinculación con el Medio', 'Vinculación')
    .replace('Investigación y Desarrollo', 'Investigación'),
}));

graficos.push({
  id: 'g07-perfil',
  ...matrizBarras(
    [
      ...diez.map((u) => ({
        etiqueta: corto(u),
        color: colorDe(u.id),
        valores: Object.fromEntries(DIMS.map((d) => [d.id, u.dimensiones[d.id].puntaje])),
      })),
      {
        etiqueta: 'Promedio de las diez',
        color: colorDe('promedio'),
        valores: Object.fromEntries(DIMS.map((d) => [d.id, E.promedios[d.id]])),
      },
    ],
    cols,
    { maximo: 3, decimales: 2, fila: 26, grosor: 13, notaEje: 'Puntaje de 0 a 3 en cada dimensión' }
  ),
});

/* ------------------------------------------------------------------ */
/* g08 · La Escuela de Derecho de la PUCV frente al promedio           */
/* ------------------------------------------------------------------ */

graficos.push({
  id: 'g08-pucv',
  ...matrizBarras(
    [
      { etiqueta: 'PUCV', color: colorDe('pucv'), valores: Object.fromEntries(DIMS.map((d) => [d.id, pucv.dimensiones[d.id].puntaje])) },
      { etiqueta: 'Promedio de las diez', color: colorDe('promedio'), valores: Object.fromEntries(DIMS.map((d) => [d.id, E.promedios[d.id]])) },
    ],
    cols,
    { maximo: 3, decimales: 2, fila: 28, grosor: 15, notaEje: 'Puntaje de 0 a 3 en cada dimensión' }
  ),
});

/* ------------------------------------------------------------------ */
/* g09 · Comparación con el informe de 2025                            */
/* ------------------------------------------------------------------ */

/* Puntajes publicados en el informe aprobado en 2025, para el contraste año a año. */
const PUNTAJE_2025 = {
  'puc-chile': 12, uchile: 10, unab: 8.75, ucentral: 8.5, udp: 7.75,
  uai: 6.2, uautonoma: 5.5, udd: 4.25, uandes: 3.5, pucv: 3.25, udec: 1.25,
};

const comparacion = [...diez, pucv]
  .filter((u) => PUNTAJE_2025[u.id] !== undefined)
  .map((u) => ({ etiqueta: corto(u), id: u.id, n2025: PUNTAJE_2025[u.id], n2026: u.total }))
  .sort((a, b) => b.n2026 - a.n2026);

graficos.push({
  id: 'g09-2025-2026',
  ...matrizBarras(
    comparacion.map((c) => ({ etiqueta: c.etiqueta, color: colorDe(c.id), valores: { n2025: c.n2025, n2026: c.n2026 } })),
    [{ id: 'n2025', nombre: 'Informe 2025' }, { id: 'n2026', nombre: 'Informe 2026' }],
    { maximo: 15, decimales: 2, fila: 27, grosor: 14, notaEje: 'Puntaje total sobre 15 en cada edición' }
  ),
});

/* ------------------------------------------------------------------ */

const carpeta = path.join(aqui, 'figuras', 'informe-01');
const ids = await renderizar(graficos, carpeta, 3);

console.log(`\nGráficos escritos en figuras/informe-01:\n`);
for (const id of ids) console.log('  ' + id);
console.log(`\nPuntaje total 2026 (sobre 15):`);
for (const u of diez) console.log(`  ${String(u.posicion).padStart(2)}. ${corto(u).padEnd(28)} ${dec2(u.total)}${u.tiene_banda ? ` a ${dec2(u.total_techo)}` : ''}`);
console.log(`  --  ${corto(pucv).padEnd(28)} ${dec2(pucv.total)} (aparte)`);
