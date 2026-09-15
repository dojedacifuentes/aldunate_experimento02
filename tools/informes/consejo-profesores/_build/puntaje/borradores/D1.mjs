/**
 * D1 · Índice de formalización por dimensiones (IFD)
 *
 * Misma rúbrica que el anexo D del Informe 01 v3.2.0: diez capacidades, siete
 * estados, NC fuera del piso y con 2 puntos en el techo. Lo que cambia es sólo
 * la agregación: las diez capacidades se agrupan en cuatro dimensiones, cada
 * dimensión se lleva a 0-100 y el índice es el promedio ponderado de las cuatro
 * con pesos declarados antes de calcular.
 *
 * Aritmética exacta. Con pesos enteros que suman 100, el índice multiplicado
 * por 18 es un entero: IFD = Σ (6·w/n)·P / 18, donde P son los puntos de la
 * dimensión, n su número de capacidades y w su peso. Los órdenes se deciden
 * sobre ese entero y nunca sobre un redondeo.
 *
 * No usa cobertura.csv, número de fuentes ni rutas recorridas (H-6).
 * La P. U. Católica de Valparaíso se calcula con el mismo sistema y se imprime
 * aparte, sin posición, en todos los escenarios.
 *
 *   node puntaje/borradores/D1.mjs          salida legible
 *   node puntaje/borradores/D1.mjs --json   resultados en JSON por stdout
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const INSUMOS = path.resolve(aquí, '../../insumos/informe-01');
const M = JSON.parse(fs.readFileSync(path.join(INSUMOS, 'matriz-v2.json'), 'utf8'));
const MATRIZ = M.v2;
const CAPS = M.caps;

/* ── La rúbrica, copiada del anexo D (no se reinterpreta) ─────────────────── */
const PUNTOS = { OPF: 3, OP: 2, INC: 1, ENT: 1, ADY: 1, NL: 0, NC: null };
const NC_TECHO = 2;
const APARTADA = 'P. U. Católica de Valparaíso';

/* ── Dimensiones y pesos · fijados antes de ejecutar este cálculo ──────────
   Criterio: cercanía de la capacidad al aprendizaje jurídico del estudiante.
   Tres escalones separados por 10 puntos de peso:
     directa   (35) · la IA está dentro de la enseñanza que recibe el estudiante
     mediata   (25) · rige cómo la usa, sostiene la enseñanza, o dice a quién
                      alcanzó y si mejoró el aprendizaje
     indirecta (15) · puede existir sin que ningún estudiante la toque       */
const DIMENSIONES = [
  { id: 'GOB', nombre: 'Gobierno y reglas', caps: ['Unidad', 'Norma'], cercanía: 'mediata', peso: 25 },
  { id: 'DOC', nombre: 'Docencia', caps: ['Presencia', 'Formacion', 'Adopcion'], cercanía: 'directa', peso: 35 },
  { id: 'REC', nombre: 'Recursos, investigación y vínculo', caps: ['Herramienta', 'Investigacion', 'Transferencia'], cercanía: 'indirecta', peso: 15 },
  { id: 'RES', nombre: 'Alcance y efecto', caps: ['Alcance', 'Evaluacion'], cercanía: 'mediata', peso: 25 },
];
const PESOS_IFD = Object.fromEntries(DIMENSIONES.map((d) => [d.id, d.peso]));
/* Pesos iguales por capacidad = 10 por capacidad: 20/30/30/20 por dimensión. */
const PESOS_IGUALES = Object.fromEntries(DIMENSIONES.map((d) => [d.id, 10 * d.caps.length]));
/* Criterio alternativo para robustez: compromiso institucional que exige la
   capacidad (H-2: la regla compromete más que la estructura, y ambas son actos
   de autoridad de la Facultad). Gobierno y docencia intercambian pesos. */
const PESOS_COMPROMISO = { GOB: 35, DOC: 25, REC: 15, RES: 25 };

/* ── Controles de integridad ──────────────────────────────────────────────── */
{
  const asignadas = DIMENSIONES.flatMap((d) => d.caps);
  if (asignadas.length !== CAPS.length || new Set(asignadas).size !== CAPS.length || !CAPS.every((c) => asignadas.includes(c))) {
    throw new Error('Cada capacidad debe pertenecer a exactamente una dimensión.');
  }
  for (const p of [PESOS_IFD, PESOS_IGUALES, PESOS_COMPROMISO]) {
    const s = Object.values(p).reduce((a, b) => a + b, 0);
    if (s !== 100) throw new Error('Los pesos deben sumar 100: suman ' + s);
  }
  if (Object.keys(MATRIZ).length !== 11) throw new Error('Se esperaban 11 instituciones en la clave v2.');
}

/* ── Cálculo ──────────────────────────────────────────────────────────────── */
const idx = (c) => CAPS.indexOf(c);

function perfil(fila) {
  const dims = {};
  let piso30 = 0;
  let nc = 0;
  for (const d of DIMENSIONES) {
    let P = 0;
    let ncD = 0;
    for (const c of d.caps) {
      const e = fila[idx(c)];
      if (!(e in PUNTOS)) throw new Error('Estado desconocido: ' + e);
      if (e === 'NC') ncD++;
      else P += PUNTOS[e];
    }
    dims[d.id] = { P, nc: ncD, n: d.caps.length };
    piso30 += P;
    nc += ncD;
  }
  return { dims, piso30, techo30: piso30 + NC_TECHO * nc, nc };
}

/* Índice en dieciochoavos: entero exacto. */
function indice(pf, pesos) {
  let piso18 = 0;
  let techo18 = 0;
  for (const d of DIMENSIONES) {
    const coef = (6 * pesos[d.id]) / d.caps.length;
    if (!Number.isInteger(coef)) throw new Error('Coeficiente no entero; use pesos enteros.');
    const { P, nc } = pf.dims[d.id];
    piso18 += coef * P;
    techo18 += coef * (P + NC_TECHO * nc);
  }
  return { piso18, techo18, piso: piso18 / 18, techo: techo18 / 18 };
}

const subíndice = (pf, id) => {
  const { P, nc, n } = pf.dims[id];
  return { piso: (100 * P) / (3 * n), techo: (100 * (P + NC_TECHO * nc)) / (3 * n) };
};

function calcular(matriz, pesos) {
  return Object.fromEntries(
    Object.entries(matriz).map(([inst, fila]) => {
      const pf = perfil(fila);
      return [inst, { pf, ix: indice(pf, pesos) }];
    }),
  );
}

/* Orden: piso exacto, luego techo, luego nombre (mismo criterio que
   sensibilidad.mjs). Posición = 1 + instituciones con piso estrictamente mayor:
   los empates de piso comparten número. La apartada nunca entra. */
function ordenar(res) {
  const filas = Object.entries(res)
    .filter(([n]) => n !== APARTADA)
    .sort((a, b) => b[1].ix.piso18 - a[1].ix.piso18 || b[1].ix.techo18 - a[1].ix.techo18 || a[0].localeCompare(b[0]));
  return filas.map(([n, r]) => ({
    inst: n,
    r,
    pos: 1 + filas.filter(([, x]) => x.ix.piso18 > r.ix.piso18).length,
  }));
}

const clonar = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, [...v]]));
const aNC = (m, cierres) => {
  const c = clonar(m);
  for (const a of cierres) c[a[0]][idx(a[1])] = 'NC';
  return c;
};

/* ── Solidez de la evidencia: datos existentes, sin juicio nuevo ─────────── */
/* Anexo I, última línea: las diez referencias de la ronda 2 que ya estaban en
   el corpus contrastado. */
const YA_EN_CORPUS = new Set([
  'R2-UC-02', 'R2-UNAB-02', 'R2-UAUT-05', 'R2-UAUT-06', 'R2-UCEN-02',
  'R2-UCH-01', 'R2-UDEC-01', 'R2-UDP-01', 'R2-UDP-02', 'R2-PUCV-03',
]);
const DIRECCIONES_CAÍDAS = ['R2-UCEN-01', 'R2-UC-01', 'R2-UDD-02'];
const fuentesDe = (a) => (a[4] === '—' ? [] : a[4].split(';').map((s) => s.trim()).filter(Boolean));
const EXPUESTOS = M.aplicados.filter((a) => {
  const f = fuentesDe(a);
  return f.length > 0 && f.some((x) => !YA_EN_CORPUS.has(x));
});
const CAÍDOS = M.aplicados.filter((a) => fuentesDe(a).some((x) => DIRECCIONES_CAÍDAS.includes(x)));

/* ── Formato ──────────────────────────────────────────────────────────────── */
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');
const banda = (ix) => (ix.piso18 === ix.techo18 ? f1(ix.piso) : f1(ix.piso) + '–' + f1(ix.techo));
const sub = (pf, id) => {
  const s = subíndice(pf, id);
  return s.piso === s.techo ? f1(s.piso) : f1(s.piso) + '–' + f1(s.techo);
};
const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);

/* ── 1 · Resultado base ───────────────────────────────────────────────────── */
const BASE = calcular(MATRIZ, PESOS_IFD);
const IGUALES = calcular(MATRIZ, PESOS_IGUALES);
const SIN_CONTRASTAR = calcular(aNC(MATRIZ, EXPUESTOS), PESOS_IFD);
const ordenBase = ordenar(BASE);
const posBase = new Map(ordenBase.map((o) => [o.inst, o.pos]));
const ordenIguales = ordenar(IGUALES);
const posIguales = new Map(ordenIguales.map((o) => [o.inst, o.pos]));

/* ── 2 · Validación contra el índice simple de 30 puntos ─────────────────── */
/* Tabla publicada en el anexo D (líneas 2637-2655) y, para la apartada, el
   complemento v1.2 (18 puntos, banda cerrada). */
const PUBLICADO = {
  'P. U. Católica de Chile': [20, 20],
  'U. Autónoma de Chile': [17, 17],
  'U. Central de Chile': [17, 17],
  'U. de Chile': [12, 14],
  'U. Adolfo Ibáñez': [11, 11],
  'U. Andrés Bello': [11, 11],
  'U. del Desarrollo': [8, 10],
  'U. Diego Portales': [8, 8],
  'U. de los Andes': [5, 9],
  'U. de Concepción': [5, 7],
  'P. U. Católica de Valparaíso': [18, 18],
};
const validación = [];
for (const [inst, r] of Object.entries(IGUALES)) {
  const pub = PUBLICADO[inst];
  const des = M.despues[inst];
  const okSuma = r.pf.piso30 === pub[0] && r.pf.techo30 === pub[1] && r.pf.piso30 === des.piso && r.pf.techo30 === des.techo;
  /* Con pesos iguales, 18·IFD = 60·piso30, es decir IFD = (10/3)·piso30. */
  const okProp = r.ix.piso18 === 60 * r.pf.piso30 && r.ix.techo18 === 60 * r.pf.techo30;
  validación.push({ inst, piso30: r.pf.piso30, techo30: r.pf.techo30, ifdIguales: [r.ix.piso, r.ix.techo], okSuma, okProp });
}
/* Mismo orden: la posición con pesos iguales coincide con la del piso de 30. */
const ordenSimple = Object.entries(IGUALES)
  .filter(([n]) => n !== APARTADA)
  .sort((a, b) => b[1].pf.piso30 - a[1].pf.piso30 || b[1].pf.techo30 - a[1].pf.techo30 || a[0].localeCompare(b[0]))
  .map(([n]) => n);
const okOrden = ordenSimple.every((n, k) => ordenIguales[k].inst === n);
const validaciónOK = validación.every((v) => v.okSuma && v.okProp) && okOrden;

/* ── 3 · Robustez ─────────────────────────────────────────────────────────── */
const escenarios = [
  { id: 'E1', nombre: 'Pesos iguales por capacidad (20/30/30/20), el índice de la v3.2.0 llevado a 0-100', res: IGUALES },
  { id: 'E2', nombre: 'Criterio alternativo: compromiso institucional (35/25/15/25)', res: calcular(MATRIZ, PESOS_COMPROMISO) },
  { id: 'E4', nombre: 'Las tres direcciones que devuelven 404 pasan a NC (R2-UCEN-01, R2-UC-01, R2-UDD-02)', res: calcular(aNC(MATRIZ, CAÍDOS), PESOS_IFD) },
  { id: 'E5', nombre: 'Cota: los 13 cierres apoyados en fuente de la ronda 2 sin contrastar pasan a NC', res: SIN_CONTRASTAR },
];

/* E3 · grilla de ponderaciones: todo vector de múltiplos de 5, cada dimensión
   entre 10 y 40, suma 100. Es decir, cada capacidad entre 0,33 y 2 veces el
   peso que tendría con pesos iguales. */
const grilla = [];
for (let g = 10; g <= 40; g += 5)
  for (let d = 10; d <= 40; d += 5)
    for (let r = 10; r <= 40; r += 5) {
      const s = 100 - g - d - r;
      if (s >= 10 && s <= 40) grilla.push({ GOB: g, DOC: d, REC: r, RES: s });
    }
const perfiles = Object.fromEntries(Object.entries(MATRIZ).map(([k, f]) => [k, perfil(f)]));
const rango = Object.fromEntries(ordenBase.map((o) => [o.inst, { min: Infinity, max: -Infinity }]));
const top3Base = new Set(ordenBase.filter((o) => o.pos <= 3).map((o) => o.inst));
let top3Igual = 0;
let ordenIdéntico = 0;
const pares = ordenBase.slice(0, -1).map((o, k) => ({ a: o.inst, b: ordenBase[k + 1].inst, mayor: 0, igual: 0, menor: 0 }));
const primeroIgual = { n: 0 };
for (const w of grilla) {
  const res = Object.fromEntries(Object.entries(perfiles).map(([k, pf]) => [k, { pf, ix: indice(pf, w) }]));
  const o = ordenar(res);
  for (const x of o) {
    rango[x.inst].min = Math.min(rango[x.inst].min, x.pos);
    rango[x.inst].max = Math.max(rango[x.inst].max, x.pos);
  }
  const t3 = o.filter((x) => x.pos <= 3).map((x) => x.inst);
  if (t3.length === 3 && t3.every((n) => top3Base.has(n))) top3Igual++;
  if (o.every((x, k) => x.inst === ordenBase[k].inst) && new Set(o.map((x) => x.pos)).size === o.length) ordenIdéntico++;
  if (o[0].inst === ordenBase[0].inst && o[0].pos === 1 && o[1].pos === 2) primeroIgual.n++;
  for (const p of pares) {
    const A = res[p.a].ix.piso18;
    const B = res[p.b].ix.piso18;
    if (A > B) p.mayor++;
    else if (A === B) p.igual++;
    else p.menor++;
  }
}

/* Bandas que se solapan en el resultado base: el techo de la de abajo alcanza
   o supera el piso de la de arriba. Ese par no está ordenado por la evidencia. */
const solapes = [];
for (let i = 0; i < ordenBase.length; i++)
  for (let j = i + 1; j < ordenBase.length; j++)
    if (ordenBase[j].r.ix.techo18 >= ordenBase[i].r.ix.piso18) solapes.push([ordenBase[i].inst, ordenBase[j].inst]);

/* Promedio del campo por dimensión (sólo el comparador de diez). */
const campo = DIMENSIONES.map((d) => {
  const v = ordenBase.map((o) => subíndice(o.r.pf, d.id));
  return { id: d.id, nombre: d.nombre, piso: v.reduce((s, x) => s + x.piso, 0) / v.length, techo: v.reduce((s, x) => s + x.techo, 0) / v.length };
});

/* ── Salida ───────────────────────────────────────────────────────────────── */
const filaJSON = (inst, r) => ({
  institucion: inst,
  posicion: inst === APARTADA ? null : posBase.get(inst),
  ifd: { piso: +r.ix.piso.toFixed(2), techo: +r.ix.techo.toFixed(2), piso18: r.ix.piso18, techo18: r.ix.techo18 },
  subindices: Object.fromEntries(DIMENSIONES.map((d) => {
    const s = subíndice(r.pf, d.id);
    return [d.id, { piso: +s.piso.toFixed(2), techo: +s.techo.toFixed(2) }];
  })),
  indice30: { piso: r.pf.piso30, techo: r.pf.techo30, nc: r.pf.nc },
  ifdPesosIguales: { piso: +IGUALES[inst].ix.piso.toFixed(2), techo: +IGUALES[inst].ix.techo.toFixed(2) },
  sobreFuenteSinContrastar: +(r.ix.piso - SIN_CONTRASTAR[inst].ix.piso).toFixed(2),
});

if (process.argv.includes('--json')) {
  const esc = Object.fromEntries(escenarios.map((e) => [e.id, Object.fromEntries(Object.entries(e.res).map(([k, r]) => [k, {
    posicion: k === APARTADA ? null : ordenar(e.res).find((o) => o.inst === k).pos,
    piso: +r.ix.piso.toFixed(2), techo: +r.ix.techo.toFixed(2),
  }]))]));
  console.log(JSON.stringify({
    sistema: 'IFD · Índice de formalización por dimensiones (D1)',
    dimensiones: DIMENSIONES,
    ranking: ordenBase.map((o) => filaJSON(o.inst, o.r)),
    fueraDelRanking: filaJSON(APARTADA, BASE[APARTADA]),
    validacion: { ok: validaciónOK, ordenIdentico: okOrden, filas: validación },
    escenarios: esc,
    grilla: { vectores: grilla.length, top3Igual, ordenIdentico: ordenIdéntico, rango, pares },
    solapes,
    campo,
  }, null, 1));
  process.exit(validaciónOK ? 0 : 1);
}

const L = (s = '') => console.log(s);
L('IFD · Índice de formalización por dimensiones (enfoque D1)');
L('Matriz: matriz-v2.json, clave v2 · 11 instituciones × 10 capacidades');
L();
L('Dimensiones y pesos (declarados antes del cálculo)');
for (const d of DIMENSIONES) {
  const porPunto = d.peso / (3 * d.caps.length);
  L('  ' + pad(d.id, 4) + pad(d.nombre, 36) + pad(d.caps.join(', '), 40) + 'peso ' + lpad(d.peso, 2) +
    ' · cercanía ' + pad(d.cercanía, 10) + ' · 1 punto de rúbrica = ' + f1(porPunto * 100 / 100 * 1) + ' (con 1 decimal: ' + (porPunto).toFixed(2).replace('.', ',') + ')');
}
L('  Con pesos iguales, 1 punto de rúbrica = 3,33 en cualquier dimensión.');
L('  Fórmula exacta: IFD = (' + DIMENSIONES.map((d) => (6 * d.peso) / d.caps.length + '·' + d.id).join(' + ') + ') / 18');
L();
L('1 · Resultado · comparador de diez (ordenado por piso; empate de piso comparte posición)');
L('  ' + pad('Pos', 4) + pad('Institución', 30) + pad('IFD', 12) + pad('GOB', 7) + pad('DOC', 12) + pad('REC', 7) + pad('RES', 7) + pad('Iguales', 12) + pad('Δ piso', 8) + pad('Rúbrica 30', 11) + 'Sin contrastar');
const imprimirFila = (pos, inst, r) => {
  const ig = IGUALES[inst].ix;
  const delta = r.ix.piso - ig.piso;
  L('  ' + pad(pos, 4) + pad(inst, 30) + pad(banda(r.ix), 12) + pad(sub(r.pf, 'GOB'), 7) + pad(sub(r.pf, 'DOC'), 12) +
    pad(sub(r.pf, 'REC'), 7) + pad(sub(r.pf, 'RES'), 7) + pad(banda(ig), 12) + pad((delta >= 0 ? '+' : '') + f1(delta), 8) +
    pad(r.pf.piso30 + (r.pf.nc ? '–' + r.pf.techo30 : ''), 11) + f1(r.ix.piso - SIN_CONTRASTAR[inst].ix.piso));
};
for (const o of ordenBase) imprimirFila(o.pos, o.inst, o.r);
L('  ' + '─'.repeat(120));
L('  Fuera del orden, sin posición (conflicto de interés del autor, sección 8):');
imprimirFila('—', APARTADA, BASE[APARTADA]);
L('  Iguales = el mismo índice con pesos iguales por capacidad. «Sin contrastar» = puntos del IFD que descansan en');
L('  cierres de la ronda 2 cuya fuente no pasó el contraste sustantivo. No se asignan niveles de madurez: la escalera');
L('  del informe se aplica a la iniciativa y nunca a la universidad.');
L();
L('  Cambios de posición respecto de pesos iguales:');
for (const o of ordenBase) {
  if (posIguales.get(o.inst) !== o.pos) L('    ' + pad(o.inst, 30) + posIguales.get(o.inst) + ' → ' + o.pos);
}
L();
L('  Promedio del campo por dimensión (diez instituciones, piso–techo):');
for (const c of campo) L('    ' + pad(c.nombre, 36) + (c.piso === c.techo ? f1(c.piso) : f1(c.piso) + '–' + f1(c.techo)));
L();
L('  Pares cuyas bandas se solapan (el orden entre ellos no lo fija la evidencia):');
for (const [a, b] of solapes) L('    ' + a + ' (' + banda(BASE[a].ix) + ')  ·  ' + b + ' (' + banda(BASE[b].ix) + ')');
L();

L('2 · Validación contra el índice simple de 30 puntos (v3.2.0)');
for (const v of validación) {
  L('  ' + pad(v.inst, 30) + pad(v.piso30 + '–' + v.techo30, 8) + ' IFD con pesos iguales ' + pad(f1(v.ifdIguales[0]) + '–' + f1(v.ifdIguales[1]), 12) +
    ' × 0,3 = ' + pad(f1(v.ifdIguales[0] * 0.3) + '–' + f1(v.ifdIguales[1] * 0.3), 10) + (v.okSuma && v.okProp ? 'coincide' : 'NO COINCIDE'));
}
L('  Suma de la rúbrica = anexo D publicado = matriz.despues: ' + (validación.every((v) => v.okSuma) ? 'sí, en las 11' : 'NO'));
L('  18·IFD(iguales) = 60·piso30 en entero exacto: ' + (validación.every((v) => v.okProp) ? 'sí, en las 11' : 'NO'));
L('  Orden de las diez idéntico al publicado: ' + (okOrden ? 'sí' : 'NO'));
L();

L('3 · Robustez');
L('  Cierres de la ronda 2: ' + M.aplicados.length + ' · con fuente sin contrastar: ' + EXPUESTOS.length +
  ' (' + EXPUESTOS.reduce((s, a) => s + (PUNTOS[a[3]] ?? 0), 0) + ' puntos de rúbrica) · con dirección caída: ' + CAÍDOS.length +
  ' (' + CAÍDOS.reduce((s, a) => s + (PUNTOS[a[3]] ?? 0), 0) + ' puntos)');
for (const e of escenarios) {
  const o = ordenar(e.res);
  L();
  L('  ■ ' + e.id + ' · ' + e.nombre);
  for (const x of o) {
    const mueve = posBase.get(x.inst) !== x.pos ? '   IFD ' + posBase.get(x.inst) + ' → ' + x.pos : '';
    L('     ' + lpad(x.pos, 2) + '. ' + pad(x.inst, 30) + pad(banda(x.r.ix), 12) + mueve);
  }
  L('     apartada, sin posición: ' + APARTADA + ' ' + banda(e.res[APARTADA].ix));
  L('     posiciones distintas del IFD: ' + o.filter((x) => posBase.get(x.inst) !== x.pos).length + ' de 10');
}
L();
L('  ■ E3 · Grilla de ponderaciones: ' + grilla.length + ' vectores (múltiplos de 5, cada dimensión entre 10 y 40)');
L('     mismas tres primeras: ' + top3Igual + ' de ' + grilla.length + ' · mismo primer lugar sin empate: ' + primeroIgual.n +
  ' · orden de las diez idéntico al IFD: ' + ordenIdéntico);
L('     rango de posiciones posibles:');
for (const o of ordenBase) L('       ' + pad(o.inst, 30) + 'IFD ' + lpad(o.pos, 2) + '   entre ' + rango[o.inst].min + ' y ' + rango[o.inst].max);
L('     pares contiguos del IFD · en cuántas ponderaciones se sostiene el orden (arriba > abajo · empate · se invierte):');
for (const p of pares) {
  L('       ' + pad(p.a + ' / ' + p.b, 60) + lpad(Math.round((100 * p.mayor) / grilla.length) + ' %', 6) +
    lpad(Math.round((100 * p.igual) / grilla.length) + ' %', 6) + lpad(Math.round((100 * p.menor) / grilla.length) + ' %', 6));
}
L();
L(validaciónOK ? '✓ El IFD con pesos iguales reproduce exactamente el índice de 30 puntos de la v3.2.0.' : '✗ La validación falló.');
process.exit(validaciónOK ? 0 : 1);
