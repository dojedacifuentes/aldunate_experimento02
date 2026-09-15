/**
 * Recalcula la tabla de sensibilidad del anexo B desde la matriz vigente.
 *
 * Variantes: base (pesos 25/35/15/25), pesos iguales, pesos por compromiso
 * institucional (más peso a gobierno y reglas), sin las capacidades cuya fuente
 * tiene la dirección caída, y solo con fuentes contrastadas. Además, el rango de
 * posiciones en una grilla de combinaciones de pesos, con cada dimensión entre
 * 10 y 40 puntos en pasos de 5 y suma 100.
 *
 *   node regenerar-sensibilidad.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const R = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'resultados.json'), 'utf8'));

const DIM_CAP = {
  GOB: ['Unidad especializada', 'Norma propia'],
  DOC: ['Presencia en pregrado', 'Formación estructurada', 'Adopción en la enseñanza'],
  REC: ['Herramienta desplegada', 'Investigación', 'Transferencia'],
  RES: ['Alcance declarado', 'Evaluación de efecto'],
};
const DIMS = ['GOB', 'DOC', 'REC', 'RES'];
const diez = R.instituciones.filter((i) => i.en_ranking);

/** Índice de una institución con un conjunto de pesos y un filtro de celdas. */
function indice(inst, pesos, excluir = () => false) {
  const porCap = Object.fromEntries(inst.celdas.map((c) => [c.capacidad, c]));
  let total = 0;
  for (const d of DIMS) {
    const caps = DIM_CAP[d];
    const suma = caps.reduce((s, k) => {
      const c = porCap[k];
      if (excluir(c)) return s;
      return s + (c.puntos ?? 0);
    }, 0);
    total += ((suma / (caps.length * 3)) * 100) * pesos[d];
  }
  return total / 100;
}

/** Posiciones a partir de una función de puntaje. */
function posiciones(fn) {
  const con = diez.map((i) => ({ sigla: i.sigla, v: fn(i) }));
  con.sort((a, b) => b.v - a.v || a.sigla.localeCompare(b.sigla, 'es'));
  const pos = {};
  let anterior = null;
  let lugar = 0;
  con.forEach((x, k) => {
    if (anterior === null || Math.abs(x.v - anterior) > 1e-9) lugar = k + 1;
    pos[x.sigla] = lugar;
    anterior = x.v;
  });
  return pos;
}

const BASE = { GOB: 25, DOC: 35, REC: 15, RES: 25 };
const IGUALES = { GOB: 25, DOC: 25, REC: 25, RES: 25 };
const COMPROMISO = { GOB: 40, DOC: 25, REC: 15, RES: 20 };

const pBase = posiciones((i) => indice(i, BASE));
const pIguales = posiciones((i) => indice(i, IGUALES));
const pCompromiso = posiciones((i) => indice(i, COMPROMISO));
const pSinCaidas = posiciones((i) => indice(i, BASE, (c) => c.url_caida));
const pContrastadas = posiciones((i) => indice(i, BASE, (c) => c.sin_contrastar));

/* Grilla de combinaciones de pesos */
const valores = [10, 15, 20, 25, 30, 35, 40];
const combinaciones = [];
for (const g of valores) for (const d of valores) for (const r of valores) {
  const res = 100 - g - d - r;
  if (valores.includes(res)) combinaciones.push({ GOB: g, DOC: d, REC: r, RES: res });
}

const rango = {};
for (const i of diez) rango[i.sigla] = { min: 99, max: 0 };
for (const pesos of combinaciones) {
  const p = posiciones((i) => indice(i, pesos));
  for (const [sigla, lugar] of Object.entries(p)) {
    rango[sigla].min = Math.min(rango[sigla].min, lugar);
    rango[sigla].max = Math.max(rango[sigla].max, lugar);
  }
}

const orden = [...diez].sort((a, b) => a.posicion - b.posicion);
const celdaRango = (s) => (rango[s].min === rango[s].max ? String(rango[s].min) : `${rango[s].min} a ${rango[s].max}`);

const filas = orden.map((i) =>
  `| ${i.sigla} | ${pBase[i.sigla]} | ${pIguales[i.sigla]} | ${pCompromiso[i.sigla]} | ${pSinCaidas[i.sigla]} | ${pContrastadas[i.sigla]} | ${celdaRango(i.sigla)} |`
);

/* Primeras posiciones estables en toda la grilla */
const primerasEstables = orden.filter((i) => rango[i.sigla].max <= 3).map((i) => i.sigla);

const p = path.join(aqui, 'redaccion', 'informe-01', 'B-matriz-y-resultados.md');
let s = fs.readFileSync(p, 'utf8');

const inicio = s.indexOf('| Institución | Base | Pesos iguales |');
const fin = s.indexOf('\n\n', inicio);
if (inicio < 0) throw new Error('cabecera de la tabla de sensibilidad no encontrada');
const cabecera = '| Institución | Base | Pesos iguales | Pesos por compromiso institucional | Sin direcciones caídas | Solo fuentes contrastadas | Rango en la grilla |\n|---|---|---|---|---|---|---|';
s = s.slice(0, inicio) + cabecera + '\n' + filas.join('\n') + s.slice(fin);

/* Párrafo introductorio con el número real de combinaciones */
s = s.replace(
  /La tabla muestra la posición de cada institución bajo cuatro variantes del cálculo y el rango de posiciones que ocupa en \d+ combinaciones de pesos, con cada dimensión entre 10 y 40 puntos\. Las tres primeras posiciones corresponden a las mismas instituciones en todas esas combinaciones\./,
  `La tabla muestra la posición de cada institución bajo cinco variantes del cálculo y el rango de posiciones que ocupa en ${combinaciones.length} combinaciones de pesos, con cada dimensión entre 10 y 40 puntos y suma 100. ${primerasEstables.length >= 2 ? `Las instituciones que ocupan los primeros lugares en todas esas combinaciones son ${primerasEstables.join(', ')}.` : 'El orden de cabeza varía según la ponderación empleada.'}`
);

fs.writeFileSync(p, s, 'utf8');

console.log(`Combinaciones evaluadas: ${combinaciones.length}`);
console.log(`Instituciones siempre entre los tres primeros: ${primerasEstables.join(', ') || 'ninguna'}\n`);
for (const f of filas) console.log('  ' + f);
