/**
 * Aplica a resultados.json los cambios de estado acreditados en la tercera ronda
 * de búsqueda (hechos/ronda-4-revision-pucv.json) y recalcula el índice de cada
 * institución afectada.
 *
 * Deja constancia del estado anterior en cada celda modificada, de modo que el
 * cambio sea auditable.
 *
 *   node puntaje/aplicar-ronda-4.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..');

const R = JSON.parse(fs.readFileSync(path.join(AQUI, 'resultados.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(path.join(RAIZ, 'hechos', 'ronda-4-revision-pucv.json'), 'utf8'));

const ESTADO_CLAVE = {
  'En operación con instrumento formal': 'OPF',
  'En operación': 'OP',
  'Incipiente': 'INC',
  'Solo en el entorno institucional': 'ENT',
  'Solo adyacente': 'ADY',
  'No localizada': 'NL',
};

/* Pesos del índice: cercanía de la dimensión al aprendizaje del estudiante */
const DIM_CAP = {
  GOB: ['Unidad especializada', 'Norma propia'],
  DOC: ['Presencia en pregrado', 'Formación estructurada', 'Adopción en la enseñanza'],
  REC: ['Herramienta desplegada', 'Investigación', 'Transferencia'],
  RES: ['Alcance declarado', 'Evaluación de efecto'],
};
const PESO = { GOB: 25, DOC: 35, REC: 15, RES: 25 };
const red1 = (n) => Number(n.toFixed(1));

function recalcular(inst) {
  const porCap = Object.fromEntries(inst.celdas.map((c) => [c.capacidad, c]));
  const sub = {};
  for (const [dim, caps] of Object.entries(DIM_CAP)) {
    const piso = caps.reduce((s, k) => s + (porCap[k].puntos ?? 0), 0);
    const techo = caps.reduce((s, k) => s + (porCap[k].puntos ?? 2), 0);
    const max = caps.length * 3;
    sub[dim] = { piso: red1((piso / max) * 100), techo: red1((techo / max) * 100) };
  }
  inst.subindices = sub;
  const ponderar = (lado) =>
    red1(Object.entries(PESO).reduce((s, [d, p]) => s + sub[d][lado] * p, 0) / 100);
  inst.indice = { ...inst.indice, piso: ponderar('piso'), techo: ponderar('techo') };
  const simplePiso = inst.celdas.reduce((s, c) => s + (c.puntos ?? 0), 0);
  const simpleTecho = inst.celdas.reduce((s, c) => s + (c.puntos ?? 2), 0);
  inst.indice_simple = { ...inst.indice_simple, piso: simplePiso, techo: simpleTecho };
  return inst;
}

const aplicados = [];

for (const cambio of H.cambios_propuestos) {
  const inst = R.instituciones.find((i) => i.id === cambio.universidad);
  if (!inst) throw new Error(`Institución no encontrada: ${cambio.universidad}`);
  const celda = inst.celdas.find((c) => c.capacidad === cambio.capacidad);
  if (!celda) throw new Error(`Capacidad no encontrada en ${inst.id}: ${cambio.capacidad}`);

  if (celda.puntos !== cambio.puntos_anterior) {
    throw new Error(
      `${inst.nombre_corto} · ${cambio.capacidad}: el corpus tiene ${celda.puntos} puntos y el cambio declara ${cambio.puntos_anterior}. Revisar antes de aplicar.`
    );
  }

  celda.estado_anterior = celda.estado;
  celda.estado_nombre_anterior = celda.estado_nombre;
  celda.puntos_anterior = celda.puntos;
  celda.estado = ESTADO_CLAVE[cambio.estado_propuesto];
  celda.estado_nombre = cambio.estado_propuesto;
  celda.puntos = cambio.puntos_propuesto;
  celda.ronda4 = { motivo: cambio.motivo, origen: H._meta.tipo };
  

  aplicados.push(
    `${inst.nombre_corto.padEnd(26)} ${cambio.capacidad.padEnd(26)} ${cambio.puntos_anterior} -> ${cambio.puntos_propuesto}`
  );
}

/* Recalcular las instituciones tocadas */
const tocadas = new Set(H.cambios_propuestos.map((c) => c.universidad));
for (const inst of R.instituciones) if (tocadas.has(inst.id)) recalcular(inst);

/* Rehacer el orden del ranking por el índice piso */
const enRanking = R.instituciones.filter((i) => i.en_ranking).sort((a, b) => b.indice.piso - a.indice.piso);
enRanking.forEach((i, k) => { i.posicion = k + 1; });
R.ranking = enRanking.map((i) => ({
  posicion: i.posicion, nombre_corto: i.nombre_corto, sigla: i.sigla,
  piso: i.indice.piso, techo: i.indice.techo,
}));

/* Rehacer la distribución de capacidades de las diez del orden */
for (const d of R.distribucion_capacidades) {
  const c = { OPF: 0, OP: 0, INC: 0, ENT: 0, ADY: 0, NL: 0, NC: 0 };
  for (const i of enRanking) {
    const celda = i.celdas.find((x) => x.capacidad === d.capacidad);
    c[celda.estado] = (c[celda.estado] || 0) + 1;
  }
  d.conteo = c;
}

R.ronda4 = {
  fecha: H._meta.fecha,
  tipo: H._meta.tipo,
  alcance: H._meta.alcance,
  cambios: H.cambios_propuestos.length,
  nota: 'Revisión interna de la Dirección sobre la propia Escuela. Corrige a la baja y solo alcanza a la PUCV.',
};

fs.writeFileSync(path.join(AQUI, 'resultados.json'), JSON.stringify(R, null, 2), 'utf8');

console.log(`Cambios aplicados: ${aplicados.length}\n`);
for (const a of aplicados) console.log('  ' + a);
console.log('\nNuevo orden por el índice:');
for (const i of enRanking) {
  console.log(`  ${String(i.posicion).padStart(2)}. ${i.nombre_corto.padEnd(26)} ${String(i.indice.piso).padStart(5)}`);
}
