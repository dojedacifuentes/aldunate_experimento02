/**
 * Las decisiones del complemento PUCV, con su efecto derivado de la matriz.
 *
 * **Por qué existe.** El complemento v1.1 escribía a mano el efecto de cada
 * decisión —«+1 a +2 puntos en presencia en pregrado»— y esa forma de escribir
 * cifras es la que D-039 prohibió para las figuras y la v3.1.0 extendió a la
 * web. Aquí se comprueba lo que ya se sabía que pasaría: una de las seis
 * prometía un punto que la rúbrica no puede dar, otra declaraba su efecto en
 * una capacidad distinta de la que su propio texto describe, y tres capacidades
 * se quedaban sin ninguna decisión que las cerrara.
 *
 * Lo que este archivo declara es sólo el **mapa**: qué capacidad toca cada
 * decisión y hasta qué estado la lleva. Los puntos los calcula la rúbrica del
 * anexo D sobre `matriz-v2.json`, y si el mapa promete algo que la matriz no
 * sostiene, el guion se detiene.
 *
 *   node tools/informes/informe-01/complemento/decisiones.mjs
 *
 * Ver `docs/informes/CHECKPOINT-complemento-pucv.md` para los tres defectos
 * verificados que motivan esto.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const MATRIZ = JSON.parse(
  fs.readFileSync(path.join(aquí, '../comparador/matriz-v2.json'), 'utf8'),
);

/* La rúbrica del anexo D. Se copia, no se importa: el complemento debe poder
   comprobarse contra la rúbrica publicada y no contra otra copia del código. */
const PUNTOS = { OPF: 3, OP: 2, INC: 1, ENT: 1, ADY: 1, NL: 0, NC: null };

export const INSTITUCIÓN = 'P. U. Católica de Valparaíso';

const estados = MATRIZ.v2[INSTITUCIÓN];
export const estadoDe = (capacidad) => estados[MATRIZ.caps.indexOf(capacidad)];

const RÓTULO = {
  Unidad: 'unidad especializada',
  Norma: 'norma propia',
  Presencia: 'presencia en pregrado',
  Formacion: 'formación estructurada',
  Herramienta: 'herramienta desplegada',
  Adopcion: 'adopción en la enseñanza',
  Alcance: 'alcance declarado',
  Investigacion: 'investigación',
  Transferencia: 'transferencia',
  Evaluacion: 'evaluación de efecto',
};

/**
 * El mapa. `destino` es el estado al que la decisión lleva la capacidad si se
 * ejecuta y se acredita; el delta lo calcula la rúbrica.
 *
 * `clase` es la del §4 del complemento y no es decorativa: dice qué cuesta.
 *   instrumento — la capacidad ya opera y falta publicar el objeto citable
 *   nivel       — existe en la Universidad y no en la Escuela; exige decidir
 *   inexistente — no hay nada que publicar; exige producir evidencia
 */
export const DECISIONES = [
  {
    id: 'D-1',
    capacidad: 'Unidad',
    destino: 'OPF',
    clase: 'instrumento',
    título: 'Publicar el instrumento que crea la unidad, con denominación estable y dependencia orgánica.',
  },
  {
    id: 'D-2',
    capacidad: 'Norma',
    destino: 'OPF',
    clase: 'nivel',
    título: 'Dictar una norma de Facultad sobre uso de IA generativa en trabajos y evaluaciones.',
  },
  {
    id: 'D-3',
    capacidad: 'Presencia',
    destino: 'OPF',
    clase: 'instrumento',
    título: 'Convertir la experiencia de aula en una asignatura con código, créditos y matrícula, o en una certificación declarada.',
  },
  {
    /* Corregida. El título, la evidencia y el indicador de esta decisión son
       íntegramente sobre alcance declarado —cifras desagregadas, serie de dos
       años—; su efecto declaraba adopción en la enseñanza, que es otra
       capacidad y se cierra con otro acto. */
    id: 'D-4',
    capacidad: 'Alcance',
    destino: 'OPF',
    clase: 'instrumento',
    título: 'Declarar el alcance real de lo que ya se ejecuta, separando lo interno de lo externo.',
  },
  {
    id: 'D-5',
    capacidad: 'Evaluacion',
    destino: 'OPF',
    clase: 'inexistente',
    título: 'Medir, una sola vez, el efecto de una sola actividad sobre una competencia declarada.',
  },
  {
    /* No toca ninguna capacidad: es condición de que las demás sean
       verificables por un tercero. El mapa lo admite y el recuento lo respeta. */
    id: 'D-6',
    capacidad: null,
    destino: null,
    clase: 'instrumento',
    título: 'Alojar el Programa y el Laboratorio en el dominio institucional de la universidad.',
  },
  {
    id: 'D-7',
    capacidad: 'Formacion',
    destino: 'OPF',
    clase: 'instrumento',
    título: 'Publicar el acto del programa formativo: código, horas, créditos y registro de participantes.',
  },
  {
    id: 'D-8',
    capacidad: 'Investigacion',
    destino: 'OPF',
    clase: 'instrumento',
    título: 'Publicar el código y el instrumento de los proyectos adjudicados con objeto de IA.',
  },
  {
    id: 'D-9',
    capacidad: 'Adopcion',
    destino: 'OPF',
    clase: 'nivel',
    título: 'Declarar la adopción de IA en la enseñanza como decisión de la Escuela, y no como orientación de la Universidad.',
  },
];

/* ── Cálculo ─────────────────────────────────────────────────────────────── */

export function calcular() {
  const filas = DECISIONES.map((d) => {
    if (!d.capacidad) return { ...d, ahora: null, gana: 0, rotulo: null };
    const ahora = estadoDe(d.capacidad);
    const gana = (PUNTOS[d.destino] ?? 0) - (PUNTOS[ahora] ?? 0);
    return { ...d, ahora, gana, rotulo: RÓTULO[d.capacidad] };
  });

  const faltanPorCapacidad = Object.fromEntries(
    MATRIZ.caps.map((c) => [c, 3 - (PUNTOS[estadoDe(c)] ?? 0)]),
  );
  const piso = MATRIZ.caps.reduce((s, c) => s + (PUNTOS[estadoDe(c)] ?? 0), 0);
  const faltan = MATRIZ.caps.length * 3 - piso;

  const cerradoPorCapacidad = {};
  for (const f of filas) {
    if (!f.capacidad) continue;
    cerradoPorCapacidad[f.capacidad] = (cerradoPorCapacidad[f.capacidad] ?? 0) + f.gana;
  }

  const errores = [];
  for (const f of filas) {
    if (!f.capacidad) continue;
    if (f.gana < 0) errores.push(`${f.id} rebaja ${f.rotulo}: de ${f.ahora} a ${f.destino}.`);
    if (f.gana === 0) errores.push(`${f.id} no cambia nada: ${f.rotulo} ya está en ${f.ahora}.`);
  }
  for (const [cap, cerrado] of Object.entries(cerradoPorCapacidad)) {
    if (cerrado > faltanPorCapacidad[cap]) {
      errores.push(
        `Las decisiones prometen ${cerrado} puntos en ${RÓTULO[cap]} y sólo faltan ` +
          `${faltanPorCapacidad[cap]}: la rúbrica no puede darlos.`,
      );
    }
  }

  const huérfanas = MATRIZ.caps.filter(
    (c) => faltanPorCapacidad[c] > (cerradoPorCapacidad[c] ?? 0),
  );

  return {
    filas,
    piso,
    faltan,
    faltanPorCapacidad,
    cierra: Object.values(cerradoPorCapacidad).reduce((s, n) => s + n, 0),
    huérfanas: huérfanas.map((c) => ({
      capacidad: c,
      rotulo: RÓTULO[c],
      puntos: faltanPorCapacidad[c] - (cerradoPorCapacidad[c] ?? 0),
    })),
    errores,
    porClase: ['instrumento', 'nivel', 'inexistente'].map((clase) => ({
      clase,
      puntos: filas.filter((f) => f.clase === clase).reduce((s, f) => s + f.gana, 0),
    })),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = calcular();
  console.log(`${INSTITUCIÓN} · piso ${r.piso}/30 · faltan ${r.faltan}\n`);
  for (const f of r.filas) {
    const efecto = f.capacidad
      ? `${f.ahora} → ${f.destino}   +${f.gana} en ${f.rotulo}`
      : 'no suma puntos · condición de verificabilidad';
    console.log(`  ${f.id}  ${f.clase.padEnd(12)}${efecto}`);
  }
  console.log(`\n  cierran ${r.cierra} de los ${r.faltan} puntos que faltan`);
  for (const { clase, puntos } of r.porClase) console.log(`    ${clase.padEnd(12)}${puntos}`);
  if (r.huérfanas.length) {
    console.log('\n  capacidades sin decisión que las cierre:');
    for (const h of r.huérfanas) console.log(`    ${h.rotulo} · faltan ${h.puntos}`);
  } else {
    console.log('\n  ninguna capacidad queda sin decisión que la cierre.');
  }
  if (r.errores.length) {
    console.error('\n✗ El mapa promete lo que la rúbrica no da:\n');
    for (const e of r.errores) console.error(`  · ${e}`);
    process.exit(1);
  }
  console.log('\n✓ Cada decisión promete exactamente lo que su capacidad puede dar.');
}
