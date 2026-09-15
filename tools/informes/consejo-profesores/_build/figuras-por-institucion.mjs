/**
 * Un gráfico por institución, para insertar dentro de su ficha.
 * Muestra sus cinco dimensiones en el color propio de la institución, con el
 * promedio de la cohorte como referencia gris detrás de cada barra.
 *
 *   node figuras-por-institucion.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderizar, colorDe, COLOR, num } from './graficos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const E = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'escala-2025.json'), 'utf8'));

const DIMS = [
  { id: 'pregrado', nombre: 'Pregrado' },
  { id: 'continua', nombre: 'Formación continua' },
  { id: 'investigacion', nombre: 'Investigación y desarrollo' },
  { id: 'vinculacion', nombre: 'Vinculación con el medio' },
  { id: 'uso', nombre: 'Uso interno de IA' },
];

const ANCHO = 586;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const dec2 = (v) => num(v, 2);

/** Barra redondeada horizontal. */
function barra(x0, y, ancho, alto, color, r = 3) {
  const w = Math.max(0, ancho);
  const rr = Math.min(r, w / 2, alto / 2);
  if (w <= 0.5) return '';
  return `<path d="M${x0} ${y + rr} a${rr} ${rr} 0 0 1 ${rr} ${-rr} h${w - rr} a${rr} ${rr} 0 0 1 ${rr} ${rr} v${alto - 2 * rr} a${rr} ${rr} 0 0 1 ${-rr} ${rr} h${-(w - rr)} a${rr} ${rr} 0 0 1 ${-rr} ${-rr} Z" fill="${color}"/>`;
}

function ficha(u) {
  const izq = 168;
  const der = 128;
  const fila = 27;
  const grosor = 15;
  const grosorProm = 5;
  const top = 26;
  const w = ANCHO - izq - der;
  const x = (v) => izq + (w * Math.min(v, 3)) / 3;

  let c = '';

  /* Encabezado del gráfico */
  c += `<text x="0" y="13" font-size="12" font-weight="600" fill="${COLOR.tinta}">${esc(u.nombre_corto || u.nombre)}</text>`;
  c += `<text x="${ANCHO}" y="13" font-size="12" fill="${COLOR.tinta2}" text-anchor="end">Total ${esc(dec2(u.total).replace('.', ','))}${u.tiene_banda ? ' a ' + esc(dec2(u.total_techo)) : ''} de 15</text>`;
  c += `<line x1="0" y1="19" x2="${ANCHO}" y2="19" stroke="${COLOR.grilla}" stroke-width="1"/>`;

  const altoPlot = DIMS.length * fila;

  /* Rejilla vertical */
  for (const m of [0, 1, 2, 3]) {
    c += `<line x1="${x(m)}" y1="${top}" x2="${x(m)}" y2="${top + altoPlot}" stroke="${m === 0 ? COLOR.eje : COLOR.grilla}" stroke-width="1"/>`;
    c += `<text x="${x(m)}" y="${top + altoPlot + 14}" font-size="10" fill="${COLOR.tenue}" text-anchor="middle">${m}</text>`;
  }

  DIMS.forEach((d, i) => {
    const dim = u.dimensiones[d.id];
    const prom = E.promedios[d.id];
    const y = top + i * fila + (fila - grosor) / 2;

    /* Referencia del promedio, detrás */
    c += barra(izq, y + (grosor - grosorProm) / 2 + grosor / 2 + 2, x(prom) - izq, grosorProm, COLOR.cero, 2);

    /* Barra de la institución */
    c += `<text x="${izq - 10}" y="${y + grosor - 2.5}" font-size="11.5" fill="${COLOR.tinta}" text-anchor="end">${esc(d.nombre)}</text>`;
    c += barra(izq, y - 2, x(dim.puntaje) - izq, grosor, colorDe(u.id));

    /* Banda cuando la capacidad no consta */
    let fin = x(dim.puntaje);
    if (dim.tiene_banda) {
      const yc = y + grosor / 2 - 2;
      c += `<line x1="${x(dim.puntaje)}" y1="${yc}" x2="${x(dim.techo)}" y2="${yc}" stroke="${COLOR.tinta2}" stroke-width="1.2"/>`;
      c += `<line x1="${x(dim.techo)}" y1="${yc - 4}" x2="${x(dim.techo)}" y2="${yc + 4}" stroke="${COLOR.tinta2}" stroke-width="1.2"/>`;
      fin = x(dim.techo);
    }

    const texto = dim.tiene_banda
      ? `${dec2(dim.puntaje)} a ${dec2(dim.techo)}`
      : dec2(dim.puntaje);
    c += `<text x="${fin + 7}" y="${y + grosor - 3}" font-size="11" fill="${COLOR.tinta}">${esc(texto)}</text>`;
  });

  const alto = top + altoPlot + 34;
  c += `<rect x="${izq}" y="${alto - 12}" width="16" height="4" rx="2" fill="${COLOR.cero}"/>`;
  c += `<text x="${izq + 22}" y="${alto - 8}" font-size="10" fill="${COLOR.tenue}">promedio de las diez instituciones comparadas</text>`;

  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${alto}" viewBox="0 0 ${ANCHO} ${alto}" font-family="Segoe UI, Helvetica, Arial, sans-serif"><rect width="${ANCHO}" height="${alto}" fill="#fff"/>${c}</svg>`,
    ancho: ANCHO,
    alto,
  };
}

/* Orden de las fichas: las diez del ranking y la PUCV al final */
const orden = [...E.orden.map((o) => E.universidades[o.id]), E.universidades.pucv];

const graficos = orden.map((u, k) => ({
  id: `f${String(k + 1).padStart(2, '0')}-${u.id}`,
  ...ficha(u),
}));

const carpeta = path.join(aqui, 'figuras', 'informe-01');
const ids = await renderizar(graficos, carpeta, 3);

console.log(`Gráficos por institución escritos en figuras/informe-01:\n`);
for (const id of ids) console.log('  ' + id);
