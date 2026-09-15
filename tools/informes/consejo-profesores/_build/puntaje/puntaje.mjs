/**
 * Índice de capacidades institucionales en inteligencia artificial (ICIA) · Documento A
 *
 * Conserva la lógica del Informe 01 v3.2.0 (anexo D): diez capacidades, siete estados,
 * 3-2-1-0 puntos, las celdas no concluyentes fuera del piso y con 2 puntos en el techo.
 * Añade tres cosas, sin juicios nuevos sobre ninguna institución:
 *   1. Agregación en cuatro dimensiones con pesos declarados según la cercanía de cada
 *      capacidad al aprendizaje del estudiante (base: borrador D1).
 *   2. Solidez: qué parte del índice descansa en celdas cerradas con fuentes de la ronda 2
 *      que no pasaron el contraste sustantivo (índice verificado frente a índice acreditado).
 *   3. Robustez: pesos iguales, criterio alternativo, grilla de 231 ponderaciones y los
 *      escenarios en que las fuentes caídas o sin contrastar dejan de contar.
 * No usa cobertura, número de fuentes ni rutas recorridas (hallazgo H-6).
 * La P. U. Católica de Valparaíso se calcula igual y queda fuera del ranking.
 *
 *   node puntaje/puntaje.mjs      escribe puntaje/resultados.json e imprime el resumen
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.resolve(aqui, '..', 'insumos', 'informe-01', 'matriz-v2.json'), 'utf8'));
const MATRIZ = M.v2;
const CAPS = M.caps;

const PUNTOS = { OPF: 3, OP: 2, INC: 1, ENT: 1, ADY: 1, NL: 0, NC: null };
const NC_TECHO = 2;
const APARTADA = 'P. U. Católica de Valparaíso';

const NOMBRE_CAP = {
  Unidad: 'Unidad especializada', Norma: 'Norma propia', Presencia: 'Presencia en pregrado',
  Formacion: 'Formación estructurada', Herramienta: 'Herramienta desplegada', Adopcion: 'Adopción en la enseñanza',
  Alcance: 'Alcance declarado', Investigacion: 'Investigación', Transferencia: 'Transferencia', Evaluacion: 'Evaluación de efecto',
};
const NOMBRE_ESTADO = {
  OPF: 'En operación con instrumento formal', OP: 'En operación', INC: 'Incipiente',
  ENT: 'Solo en el entorno institucional', ADY: 'Solo adyacente', NL: 'No localizada', NC: 'No concluyente',
};
const INST = {
  'P. U. Católica de Chile': { id: 'puc-chile', nombre: 'Pontificia Universidad Católica de Chile', sigla: 'UC' },
  'P. U. Católica de Valparaíso': { id: 'pucv', nombre: 'Pontificia Universidad Católica de Valparaíso', sigla: 'PUCV' },
  'U. Adolfo Ibáñez': { id: 'uai', nombre: 'Universidad Adolfo Ibáñez', sigla: 'UAI' },
  'U. Andrés Bello': { id: 'unab', nombre: 'Universidad Andrés Bello', sigla: 'UNAB' },
  'U. Autónoma de Chile': { id: 'uautonoma', nombre: 'Universidad Autónoma de Chile', sigla: 'U. Autónoma' },
  'U. Central de Chile': { id: 'ucentral', nombre: 'Universidad Central de Chile', sigla: 'U. Central' },
  'U. de Chile': { id: 'uchile', nombre: 'Universidad de Chile', sigla: 'U. de Chile' },
  'U. de Concepción': { id: 'udec', nombre: 'Universidad de Concepción', sigla: 'UdeC' },
  'U. de los Andes': { id: 'uandes', nombre: 'Universidad de los Andes', sigla: 'U. de los Andes' },
  'U. del Desarrollo': { id: 'udd', nombre: 'Universidad del Desarrollo', sigla: 'UDD' },
  'U. Diego Portales': { id: 'udp', nombre: 'Universidad Diego Portales', sigla: 'UDP' },
};

/* Dimensiones y pesos. Criterio: cercanía de la capacidad al aprendizaje jurídico del estudiante.
   directa (35): la IA está dentro de la enseñanza que recibe el estudiante.
   mediata (25): rige cómo se usa, o dice a quién alcanzó y si mejoró el aprendizaje.
   indirecta (15): puede existir sin que ningún estudiante la toque. */
const DIMENSIONES = [
  { id: 'GOB', nombre: 'Gobierno y reglas', caps: ['Unidad', 'Norma'], cercania: 'mediata', peso: 25 },
  { id: 'DOC', nombre: 'Docencia', caps: ['Presencia', 'Formacion', 'Adopcion'], cercania: 'directa', peso: 35 },
  { id: 'REC', nombre: 'Recursos, investigación y vínculo', caps: ['Herramienta', 'Investigacion', 'Transferencia'], cercania: 'indirecta', peso: 15 },
  { id: 'RES', nombre: 'Alcance y efecto', caps: ['Alcance', 'Evaluacion'], cercania: 'mediata', peso: 25 },
];
const PESOS = Object.fromEntries(DIMENSIONES.map((d) => [d.id, d.peso]));
const PESOS_IGUALES = Object.fromEntries(DIMENSIONES.map((d) => [d.id, 10 * d.caps.length]));
const PESOS_COMPROMISO = { GOB: 35, DOC: 25, REC: 15, RES: 25 };

/* Solidez de la evidencia (anexo I de la v3.2.0). De las 32 referencias de la ronda 2, diez ya
   estaban en el corpus contrastado; las otras 22 no pasaron el contraste sustantivo. */
const YA_EN_CORPUS = new Set(['R2-UC-02', 'R2-UNAB-02', 'R2-UAUT-05', 'R2-UAUT-06', 'R2-UCEN-02', 'R2-UCH-01', 'R2-UDEC-01', 'R2-UDP-01', 'R2-UDP-02', 'R2-PUCV-03']);
const DIRECCIONES_CAIDAS = new Set(['R2-UCEN-01', 'R2-UC-01', 'R2-UDD-02']);
const ESCANEADAS = new Set(['R2-UAUT-02']);

const idx = (c) => CAPS.indexOf(c);
const dimDe = Object.fromEntries(DIMENSIONES.flatMap((d) => d.caps.map((c) => [c, d.id])));
const fuentesDe = (a) => (a[4] === '—' ? [] : a[4].split(';').map((s) => s.trim()).filter(Boolean));
const aplicado = new Map(M.aplicados.map((a) => [`${a[0]}|${a[1]}`, a]));

function infoCelda(inst, cap) {
  const a = aplicado.get(`${inst}|${cap}`);
  if (!a) return { cerrada_en_ronda2: false, fuentes_r2: [], sin_contrastar: false, url_caida: false, escaneada: false, nota_r2: null };
  const f = fuentesDe(a);
  return {
    cerrada_en_ronda2: true,
    fuentes_r2: f,
    sin_contrastar: f.length > 0 && f.some((x) => !YA_EN_CORPUS.has(x)),
    url_caida: f.some((x) => DIRECCIONES_CAIDAS.has(x)),
    escaneada: f.some((x) => ESCANEADAS.has(x)),
    nota_r2: a[5],
  };
}

/* Integridad */
{
  const asignadas = DIMENSIONES.flatMap((d) => d.caps);
  if (asignadas.length !== CAPS.length || !CAPS.every((c) => asignadas.includes(c))) throw new Error('Cada capacidad debe estar en una sola dimensión.');
  for (const p of [PESOS, PESOS_IGUALES, PESOS_COMPROMISO]) if (Object.values(p).reduce((s, v) => s + v, 0) !== 100) throw new Error('Pesos que no suman 100.');
  if (Object.keys(MATRIZ).length !== 11) throw new Error('Se esperaban 11 instituciones.');
}

function perfil(fila) {
  const dims = {};
  let piso30 = 0;
  let nc = 0;
  for (const d of DIMENSIONES) {
    let P = 0;
    let ncD = 0;
    for (const c of d.caps) {
      const e = fila[idx(c)];
      if (!(e in PUNTOS)) throw new Error(`Estado desconocido: ${e}`);
      if (e === 'NC') ncD++;
      else P += PUNTOS[e];
    }
    dims[d.id] = { P, nc: ncD, n: d.caps.length };
    piso30 += P;
    nc += ncD;
  }
  return { dims, piso30, techo30: piso30 + NC_TECHO * nc, nc };
}

/* Índice en dieciochoavos: con pesos enteros y 2 o 3 capacidades por dimensión, 18·ICIA es entero. */
function indice(pf, pesos) {
  let piso18 = 0;
  let techo18 = 0;
  for (const d of DIMENSIONES) {
    const coef = (6 * pesos[d.id]) / d.caps.length;
    if (!Number.isInteger(coef)) throw new Error('Coeficiente no entero.');
    const { P, nc } = pf.dims[d.id];
    piso18 += coef * P;
    techo18 += coef * (P + NC_TECHO * nc);
  }
  return { piso18, techo18, piso: piso18 / 18, techo: techo18 / 18 };
}
const subindice = (pf, id) => {
  const { P, nc, n } = pf.dims[id];
  return { piso: (100 * P) / (3 * n), techo: (100 * (P + NC_TECHO * nc)) / (3 * n) };
};
const calcular = (matriz, pesos) => Object.fromEntries(Object.entries(matriz).map(([k, f]) => { const pf = perfil(f); return [k, { pf, ix: indice(pf, pesos) }]; }));

function ordenar(res) {
  const filas = Object.entries(res)
    .filter(([n]) => n !== APARTADA)
    .sort((a, b) => b[1].ix.piso18 - a[1].ix.piso18 || b[1].ix.techo18 - a[1].ix.techo18 || a[0].localeCompare(b[0]));
  return filas.map(([n, r]) => ({ inst: n, r, pos: 1 + filas.filter(([, x]) => x.ix.piso18 > r.ix.piso18).length }));
}

function rangosPromedio(orden) {
  // rango promedio para empates de piso, para la correlación de Spearman
  const out = {};
  const grupos = new Map();
  orden.forEach((o, k) => { const key = o.r.ix.piso18; if (!grupos.has(key)) grupos.set(key, []); grupos.get(key).push(k + 1); });
  for (const o of orden) { const g = grupos.get(o.r.ix.piso18); out[o.inst] = g.reduce((s, v) => s + v, 0) / g.length; }
  return out;
}
function spearman(ordenA, ordenB) {
  const ra = rangosPromedio(ordenA);
  const rb = rangosPromedio(ordenB);
  const ks = Object.keys(ra);
  const ma = ks.reduce((s, k) => s + ra[k], 0) / ks.length;
  const mb = ks.reduce((s, k) => s + rb[k], 0) / ks.length;
  let num = 0, da = 0, db = 0;
  for (const k of ks) { num += (ra[k] - ma) * (rb[k] - mb); da += (ra[k] - ma) ** 2; db += (rb[k] - mb) ** 2; }
  return Math.round((num / Math.sqrt(da * db)) * 1000) / 1000;
}

const clonar = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, [...v]]));
function aNC(matriz, filtro) {
  const c = clonar(matriz);
  for (const [inst, fila] of Object.entries(c)) CAPS.forEach((cap, i) => { if (filtro(inst, cap)) fila[i] = 'NC'; });
  return c;
}

const r1 = (x) => Math.round(x * 10) / 10;

/* Resultado base y escenarios */
const BASE = calcular(MATRIZ, PESOS);
const IGUALES = calcular(MATRIZ, PESOS_IGUALES);
const COMPROMISO = calcular(MATRIZ, PESOS_COMPROMISO);
const SIN_CAIDAS = calcular(aNC(MATRIZ, (i, c) => infoCelda(i, c).url_caida), PESOS);
const VERIFICADO = calcular(aNC(MATRIZ, (i, c) => infoCelda(i, c).sin_contrastar), PESOS);
const ordenBase = ordenar(BASE);
const posBase = new Map(ordenBase.map((o) => [o.inst, o.pos]));

/* Validación contra el índice simple de 30 puntos publicado (anexo D y complemento v1.2) */
const PUBLICADO = {
  'P. U. Católica de Chile': [20, 20], 'U. Autónoma de Chile': [17, 17], 'U. Central de Chile': [17, 17],
  'U. de Chile': [12, 14], 'U. Adolfo Ibáñez': [11, 11], 'U. Andrés Bello': [11, 11], 'U. del Desarrollo': [8, 10],
  'U. Diego Portales': [8, 8], 'U. de los Andes': [5, 9], 'U. de Concepción': [5, 7], 'P. U. Católica de Valparaíso': [18, 18],
};
const validacion = Object.entries(IGUALES).map(([inst, r]) => {
  const pub = PUBLICADO[inst];
  const ok = r.pf.piso30 === pub[0] && r.pf.techo30 === pub[1] && r.ix.piso18 === 60 * r.pf.piso30 && r.ix.techo18 === 60 * r.pf.techo30 && M.despues[inst].piso === pub[0] && M.despues[inst].techo === pub[1];
  return { institucion: inst, piso30: r.pf.piso30, techo30: r.pf.techo30, iguales_0a100: [r1(r.ix.piso), r1(r.ix.techo)], coincide: ok };
});
const ordenSimple = Object.entries(IGUALES).filter(([n]) => n !== APARTADA)
  .sort((a, b) => b[1].pf.piso30 - a[1].pf.piso30 || b[1].pf.techo30 - a[1].pf.techo30 || a[0].localeCompare(b[0])).map(([n]) => n);
const ordenIguales = ordenar(IGUALES);
const ordenIdenticoSimple = ordenSimple.every((n, k) => ordenIguales[k].inst === n);
if (!validacion.every((v) => v.coincide) || !ordenIdenticoSimple) {
  console.error(validacion);
  throw new Error('El índice con pesos iguales no reproduce el índice simple de la v3.2.0.');
}

/* Grilla de ponderaciones: múltiplos de 5, cada dimensión entre 10 y 40, suma 100 */
const grilla = [];
for (let g = 10; g <= 40; g += 5) for (let d = 10; d <= 40; d += 5) for (let r = 10; r <= 40; r += 5) {
  const s = 100 - g - d - r;
  if (s >= 10 && s <= 40) grilla.push({ GOB: g, DOC: d, REC: r, RES: s });
}
const perfiles = Object.fromEntries(Object.entries(MATRIZ).map(([k, f]) => [k, perfil(f)]));
const rango = Object.fromEntries(ordenBase.map((o) => [o.inst, { min: Infinity, max: -Infinity }]));
const top3Base = new Set(ordenBase.filter((o) => o.pos <= 3).map((o) => o.inst));
let top3Igual = 0, primeroIgual = 0, ordenIdentico = 0;
for (const w of grilla) {
  const res = Object.fromEntries(Object.entries(perfiles).map(([k, pf]) => [k, { pf, ix: indice(pf, w) }]));
  const o = ordenar(res);
  for (const x of o) { rango[x.inst].min = Math.min(rango[x.inst].min, x.pos); rango[x.inst].max = Math.max(rango[x.inst].max, x.pos); }
  const t3 = o.filter((x) => x.pos <= 3).map((x) => x.inst);
  if (t3.length === 3 && t3.every((n) => top3Base.has(n))) top3Igual++;
  if (o[0].inst === ordenBase[0].inst && o[1].pos === 2) primeroIgual++;
  if (o.every((x, k) => x.inst === ordenBase[k].inst) && new Set(o.map((x) => x.pos)).size === o.length) ordenIdentico++;
}

const escenario = (id, descripcion, res) => {
  const o = ordenar(res);
  return {
    id, descripcion,
    ranking: o.map((x) => ({ nombre_corto: x.inst, piso: r1(x.r.ix.piso), techo: r1(x.r.ix.techo), posicion: x.pos })),
    cambios: o.filter((x) => posBase.get(x.inst) !== x.pos).map((x) => ({ nombre_corto: x.inst, de: posBase.get(x.inst), a: x.pos })),
    spearman: spearman(ordenBase, o),
    pucv: { piso: r1(res[APARTADA].ix.piso), techo: r1(res[APARTADA].ix.techo) },
  };
};

/* Solapes de banda en el resultado base */
const solapes = [];
for (let i = 0; i < ordenBase.length; i++) for (let j = i + 1; j < ordenBase.length; j++) {
  if (ordenBase[j].r.ix.techo18 >= ordenBase[i].r.ix.piso18) solapes.push([ordenBase[i].inst, ordenBase[j].inst]);
}

/* Distribución de estados por capacidad (solo las diez del ranking) */
const diez = Object.keys(MATRIZ).filter((k) => k !== APARTADA);
const distribucion = CAPS.map((cap) => {
  const conteo = { OPF: 0, OP: 0, INC: 0, ENT: 0, ADY: 0, NL: 0, NC: 0 };
  for (const inst of diez) conteo[MATRIZ[inst][idx(cap)]]++;
  return { clave: cap, capacidad: NOMBRE_CAP[cap], dimension: dimDe[cap], conteo };
});
const campo = DIMENSIONES.map((d) => {
  const v = diez.map((inst) => subindice(perfiles[inst], d.id));
  return { dimension: d.id, nombre: d.nombre, piso: r1(v.reduce((s, x) => s + x.piso, 0) / v.length), techo: r1(v.reduce((s, x) => s + x.techo, 0) / v.length) };
});

/* Instituciones */
const instituciones = Object.entries(BASE).map(([inst, r]) => {
  const ver = VERIFICADO[inst].ix;
  const sinContrastar = r.ix.piso - ver.piso;
  return {
    id: INST[inst].id,
    nombre: INST[inst].nombre,
    nombre_corto: inst,
    sigla: INST[inst].sigla,
    en_ranking: inst !== APARTADA,
    posicion: inst === APARTADA ? null : posBase.get(inst),
    indice: { piso: r1(r.ix.piso), techo: r1(r.ix.techo), piso18: r.ix.piso18, techo18: r.ix.techo18 },
    tiene_banda: r.ix.techo18 > r.ix.piso18,
    subindices: Object.fromEntries(DIMENSIONES.map((d) => { const s = subindice(r.pf, d.id); return [d.id, { piso: r1(s.piso), techo: r1(s.techo) }]; })),
    indice_pesos_iguales: { piso: r1(IGUALES[inst].ix.piso), techo: r1(IGUALES[inst].ix.techo) },
    indice_verificado: { piso: r1(ver.piso), techo: r1(ver.techo) },
    puntos_sobre_fuentes_sin_contrastar: r1(sinContrastar),
    pct_sobre_fuentes_sin_contrastar: r.ix.piso > 0 ? r1((100 * sinContrastar) / r.ix.piso) : 0,
    indice_sin_direcciones_caidas: { piso: r1(SIN_CAIDAS[inst].ix.piso), techo: r1(SIN_CAIDAS[inst].ix.techo) },
    rango_posiciones_grilla: inst === APARTADA ? null : rango[inst],
    celdas: CAPS.map((cap, i) => {
      const estado = MATRIZ[inst][i];
      const d = DIMENSIONES.find((x) => x.id === dimDe[cap]);
      return {
        clave: cap, capacidad: NOMBRE_CAP[cap], dimension: d.id, estado, estado_nombre: NOMBRE_ESTADO[estado], puntos: PUNTOS[estado],
        aporte_al_indice: PUNTOS[estado] === null ? null : r1((PUNTOS[estado] * d.peso) / (3 * d.caps.length)),
        ...infoCelda(inst, cap),
      };
    }),
    indice_simple: { piso: r.pf.piso30, techo: r.pf.techo30, nc: r.pf.nc },
  };
});

const resultados = {
  metodo: {
    nombre: 'Índice de capacidades institucionales en inteligencia artificial',
    sigla: 'ICIA',
    version: '1.0',
    matriz: 'matriz-v2.json, clave v2 (Informe 01 v3.2.0, corte 06-09-2026)',
    resumen: 'Diez capacidades evaluadas con la rúbrica del Informe 01 (3, 2, 1 o 0 puntos) y agrupadas en cuatro dimensiones. Cada dimensión se expresa de 0 a 100 y el índice es su promedio ponderado. Las celdas no concluyentes se excluyen del piso y suman 2 puntos al techo, de modo que la incertidumbre se muestra como banda.',
    dimensiones: DIMENSIONES.map((d) => ({ id: d.id, nombre: d.nombre, capacidades: d.caps.map((c) => NOMBRE_CAP[c]), peso: d.peso, cercania: d.cercania })),
    criterio_pesos: 'Cercanía de la capacidad al aprendizaje jurídico del estudiante: directa 35, mediata 25, indirecta 15.',
    formula: 'ICIA = (75·GOB + 70·DOC + 30·REC + 75·RES) / 18, donde cada sigla es la suma de puntos de la dimensión; equivale al promedio ponderado de los subíndices 0-100.',
    estados: Object.fromEntries(Object.entries(PUNTOS).map(([k, v]) => [k, { nombre: NOMBRE_ESTADO[k], puntos: v }])),
    reglas_nc: 'NC no suma al piso y suma 2 puntos al techo, valor medio de los estados distintos de cero.',
    solidez: 'Índice verificado: el mismo índice si las celdas cerradas con fuentes de la ronda 2 sin contraste se tratan como no concluyentes. La diferencia con el índice acreditado mide cuánto descansa en evidencia pendiente de contraste.',
    reglas_empate: 'Se ordena por piso; a igual piso, por techo y luego alfabéticamente. Dos instituciones con el mismo piso comparten posición.',
    apartada: 'La Pontificia Universidad Católica de Valparaíso se calcula con el mismo sistema y no recibe posición, por el conflicto de interés declarado del autor.',
    ronda2: { referencias: 32, ya_en_corpus: [...YA_EN_CORPUS], direcciones_caidas: [...DIRECCIONES_CAIDAS], escaneadas: [...ESCANEADAS] },
  },
  instituciones,
  ranking: ordenBase.map((o) => ({ posicion: o.pos, nombre_corto: o.inst, sigla: INST[o.inst].sigla, piso: r1(o.r.ix.piso), techo: r1(o.r.ix.techo) })),
  empates: [...new Set(ordenBase.map((o) => o.pos))].map((p) => ordenBase.filter((o) => o.pos === p).map((o) => o.inst)).filter((g) => g.length > 1),
  solapes,
  campo,
  distribucion_capacidades: distribucion,
  ronda2: {
    cierres: M.aplicados.length,
    cierres_sin_contrastar: M.aplicados.filter((a) => infoCelda(a[0], a[1]).sin_contrastar).length,
    puntos_rubrica_sin_contrastar: M.aplicados.filter((a) => infoCelda(a[0], a[1]).sin_contrastar).reduce((s, a) => s + (PUNTOS[a[3]] ?? 0), 0),
    cierres_con_direccion_caida: M.aplicados.filter((a) => infoCelda(a[0], a[1]).url_caida).length,
    puntos_rubrica_con_direccion_caida: M.aplicados.filter((a) => infoCelda(a[0], a[1]).url_caida).reduce((s, a) => s + (PUNTOS[a[3]] ?? 0), 0),
  },
  sensibilidad: {
    escenarios: [
      escenario('E1', 'Pesos iguales por capacidad (equivale al índice de 30 puntos de la v3.2.0 llevado a 0-100)', IGUALES),
      escenario('E2', 'Criterio alternativo de pesos: compromiso institucional (Gobierno 35, Docencia 25, Recursos 15, Alcance y efecto 25)', COMPROMISO),
      escenario('E3', 'Las tres direcciones que hoy devuelven error dejan de contar (R2-UCEN-01, R2-UC-01, R2-UDD-02)', SIN_CAIDAS),
      escenario('E4', 'Todas las celdas cerradas con fuentes de la ronda 2 sin contraste dejan de contar', VERIFICADO),
    ],
    grilla: {
      vectores: grilla.length,
      descripcion: 'Toda combinación de pesos en múltiplos de 5, con cada dimensión entre 10 y 40 y suma 100.',
      mismas_tres_primeras: top3Igual,
      mismo_primer_lugar: primeroIgual,
      orden_identico: ordenIdentico,
      rangos: Object.fromEntries(ordenBase.map((o) => [o.inst, rango[o.inst]])),
    },
  },
  validacion: { indice_simple_reproduce_v320: true, orden_identico_con_pesos_iguales: ordenIdenticoSimple, detalle: validacion },
};

if (resultados.instituciones.find((i) => i.nombre_corto === APARTADA).posicion !== null) throw new Error('La PUCV no debe tener posición.');
fs.writeFileSync(path.join(aqui, 'resultados.json'), JSON.stringify(resultados, null, 1));

const f1 = (x) => x.toFixed(1).replace('.', ',');
const banda = (p, t) => (p === t ? f1(p) : `${f1(p)}–${f1(t)}`);
console.log('ICIA · resultados base');
for (const o of ordenBase) {
  const i = instituciones.find((x) => x.nombre_corto === o.inst);
  console.log(`${String(o.pos).padStart(2)}  ${o.inst.padEnd(30)} ${banda(i.indice.piso, i.indice.techo).padEnd(11)} GOB ${f1(i.subindices.GOB.piso).padStart(5)}  DOC ${banda(i.subindices.DOC.piso, i.subindices.DOC.techo).padEnd(10)} REC ${f1(i.subindices.REC.piso).padStart(5)}  RES ${f1(i.subindices.RES.piso).padStart(5)}  verificado ${banda(i.indice_verificado.piso, i.indice_verificado.techo).padEnd(11)} sin contrastar ${f1(i.pct_sobre_fuentes_sin_contrastar)} %  grilla ${i.rango_posiciones_grilla.min}-${i.rango_posiciones_grilla.max}`);
}
const p = instituciones.find((x) => x.nombre_corto === APARTADA);
console.log(` —  ${APARTADA.padEnd(30)} ${banda(p.indice.piso, p.indice.techo).padEnd(11)} (fuera del ranking)`);
console.log(`Grilla: ${grilla.length} ponderaciones · mismas tres primeras en ${top3Igual} · mismo primer lugar en ${primeroIgual} · orden idéntico en ${ordenIdentico}`);
for (const e of resultados.sensibilidad.escenarios) console.log(`${e.id} spearman ${e.spearman} · cambios ${e.cambios.map((c) => `${c.nombre_corto} ${c.de}→${c.a}`).join(', ') || 'ninguno'}`);
console.log('Validación con pesos iguales: coincide en las 11 instituciones y en el orden publicado.');
