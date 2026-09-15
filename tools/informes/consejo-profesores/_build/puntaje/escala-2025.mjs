/**
 * Escala de cinco dimensiones del informe 2025, recalculada con la evidencia de 2026.
 *
 * El Consejo de Profesores aprobó en 2025 un informe que puntuaba cada facultad en cinco
 * dimensiones de 0 a 3 puntos, con un total sobre 15. Este módulo reproduce esa escala
 * sobre la matriz verificada de 2026, de modo que la comparación entre un año y otro sea
 * posible y que cada punto quede ligado a una capacidad con su estado y su fuente.
 *
 * Por qué la matriz y no el registro de actividades: el informe de 2025 puntuó actividades
 * sueltas recogidas de páginas institucionales, y la cantidad de actividades encontradas
 * depende de cuánto se buscó en cada facultad. La matriz de 2026 evalúa las mismas diez
 * capacidades en las once instituciones, con el mismo criterio y la misma rúbrica, y por eso
 * no premia a la institución mejor investigada.
 *
 * Salida: puntaje/escala-2025.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..');

const resultados = JSON.parse(fs.readFileSync(path.join(AQUI, 'resultados.json'), 'utf8'));

/* ------------------------------------------------------------------ */
/* Correspondencia entre las diez capacidades y las cinco dimensiones  */
/* ------------------------------------------------------------------ */

/**
 * Cada dimensión de 2025 se expresa de 0 a 3, igual que entonces. Cuando le corresponde
 * más de una capacidad, la dimensión es el promedio de ellas, de modo que el máximo siga
 * siendo 3 y el total siga siendo 15.
 *
 * La capacidad «Evaluación de efecto» no tiene equivalente en la escala de 2025, que no
 * preguntaba si la institución había medido el resultado de lo que hacía. Queda fuera del
 * total y se informa aparte.
 */

export const DIMENSIONES = [
  {
    id: 'pregrado',
    nombre: 'Formación Académica (Pregrado)',
    capacidades: ['Presencia en pregrado'],
    definicion2025: 'Cursos obligatorios y optativos, talleres y otras instancias formativas sobre IA o materias afines, dirigidas a estudiantes de pregrado.',
  },
  {
    id: 'continua',
    nombre: 'Formación Continua y Postgrado',
    capacidades: ['Formación estructurada'],
    definicion2025: 'Diplomados y cursos de IA o materias afines para abogados, o abiertos a estudiantes de Derecho.',
  },
  {
    id: 'investigacion',
    nombre: 'Investigación y Desarrollo',
    capacidades: ['Unidad especializada', 'Investigación'],
    definicion2025: 'Laboratorios, centros o programas relacionados con la IA, producción de publicaciones y proyectos, y participación en concursos o fondos.',
  },
  {
    id: 'vinculacion',
    nombre: 'Vinculación con el Medio',
    capacidades: ['Transferencia', 'Alcance declarado'],
    definicion2025: 'Convenios con tribunales, fiscalías, estudios jurídicos o empresas de tecnología legal; seminarios, conferencias y talleres abiertos.',
  },
  {
    id: 'uso',
    nombre: 'Uso Interno Institucional de IA',
    capacidades: ['Herramienta desplegada', 'Adopción en la enseñanza', 'Norma propia'],
    definicion2025: 'IA aplicada a la enseñanza y al trabajo jurídico, y protocolos institucionales para su uso responsable.',
  },
];

export const FUERA_DE_LA_ESCALA = ['Evaluación de efecto'];
export const TOPE_DIMENSION = 3;

/**
 * Capacidades sobre las que la búsqueda no permitió concluir. El informe de 2025 no
 * distinguía entre «no existe» y «no se pudo determinar», y anotaba un cero en ambos casos.
 * Aquí se mantienen separadas: el puntaje que se informa cuenta solo lo que consta, y la
 * ficha advierte hasta dónde podría llegar la dimensión si esa capacidad se acreditara.
 * El valor del techo, 2 puntos, es el que usa el informe de 2026 para el mismo fin.
 */
const PUNTOS_TECHO_NC = 2;

const TRAMOS = [
  { desde: 10, nombre: 'institución líder, con desarrollo robusto y consistente' },
  { desde: 7, nombre: 'desarrollo sólido, con varias áreas activas y continuidad evidente' },
  { desde: 4, nombre: 'avance inicial, con iniciativas parciales o esporádicas' },
  { desde: 0, nombre: 'desarrollo incipiente' },
];

const tramo = (total) => TRAMOS.find((t) => total >= t.desde).nombre;
const red2 = (n) => Number(n.toFixed(2));

/* ------------------------------------------------------------------ */
/* Cálculo                                                             */
/* ------------------------------------------------------------------ */

const universidades = {};

for (const inst of resultados.instituciones) {
  const porCapacidad = Object.fromEntries(inst.celdas.map((c) => [c.capacidad, c]));
  const dims = {};
  let total = 0;
  let totalTecho = 0;

  for (const d of DIMENSIONES) {
    const celdas = d.capacidades.map((nombre) => {
      const c = porCapacidad[nombre];
      if (!c) throw new Error(`Capacidad ausente en ${inst.id}: ${nombre}`);
      const nc = c.puntos === null || c.puntos === undefined;
      return {
        capacidad: c.capacidad,
        estado: c.estado_nombre,
        puntos: nc ? 0 : c.puntos,
        sin_informacion_concluyente: nc,
        sin_contrastar: !!c.sin_contrastar,
        url_caida: !!c.url_caida,
        nota: c.nota_r2 || null,
      };
    });
    const n = celdas.length;
    const puntaje = red2(celdas.reduce((s, c) => s + c.puntos, 0) / n);
    const techo = red2(celdas.reduce((s, c) => s + (c.sin_informacion_concluyente ? PUNTOS_TECHO_NC : c.puntos), 0) / n);
    dims[d.id] = {
      nombre: d.nombre,
      puntaje,
      techo,
      tiene_banda: techo !== puntaje,
      capacidades: celdas,
      sin_informacion_concluyente: celdas.filter((c) => c.sin_informacion_concluyente).map((c) => c.capacidad),
      apoyada_en_fuente_sin_contrastar: celdas.some((c) => c.sin_contrastar),
    };
    total += puntaje;
    totalTecho += techo;
  }

  const aparte = FUERA_DE_LA_ESCALA.map((nombre) => {
    const c = porCapacidad[nombre];
    return { capacidad: nombre, estado: c.estado_nombre, puntos: c.puntos };
  });

  universidades[inst.id] = {
    id: inst.id,
    nombre: inst.nombre,
    nombre_corto: inst.nombre_corto,
    sigla: inst.sigla,
    en_ranking: inst.en_ranking,
    dimensiones: dims,
    fuera_de_la_escala: aparte,
    total: red2(total),
    total_techo: red2(totalTecho),
    tiene_banda: red2(totalTecho) !== red2(total),
    tramo: tramo(red2(total)),
    celdas_sin_informacion_concluyente: inst.celdas.filter((c) => c.puntos === null || c.puntos === undefined).length,
    celdas_sin_contrastar: inst.celdas.filter((c) => c.sin_contrastar).length,
    celdas_url_caida: inst.celdas.filter((c) => c.url_caida).length,
    indice_2026: inst.indice.piso,
    indice_2026_techo: inst.indice.techo,
  };
}

/* La PUCV se informa aparte: el autor trabaja en su Programa DIAT. */
const orden = Object.values(universidades)
  .filter((u) => u.en_ranking)
  .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, 'es'));

orden.forEach((u, i) => { universidades[u.id].posicion = i + 1; });
for (const u of Object.values(universidades)) if (!u.en_ranking) u.posicion = null;

/* Empates: el informe de 2025 los dejaba visibles, sin desempate artificial. */
const empates = [];
for (let i = 1; i < orden.length; i++) {
  if (orden[i].total === orden[i - 1].total) empates.push([orden[i - 1].nombre, orden[i].nombre, orden[i].total]);
}

const promedios = {};
for (const d of DIMENSIONES) {
  promedios[d.id] = red2(orden.reduce((s, u) => s + u.dimensiones[d.id].puntaje, 0) / orden.length);
}
promedios.total = red2(orden.reduce((s, u) => s + u.total, 0) / orden.length);

const salida = {
  generado: new Date().toISOString().slice(0, 10),
  escala: {
    origen: 'Informe mapeo sobre IA y Derecho en Universidades, edición 2, aprobado por el Consejo de Profesores en 2025.',
    base: 'Matriz de capacidades del Informe 01 v3.2.0, corte de la evidencia 6 de septiembre de 2026.',
    dimensiones: DIMENSIONES.map((d) => ({ id: d.id, nombre: d.nombre, capacidades: d.capacidades, definicion2025: d.definicion2025 })),
    fuera_de_la_escala: FUERA_DE_LA_ESCALA,
    tope_dimension: TOPE_DIMENSION,
    total_maximo: DIMENSIONES.length * TOPE_DIMENSION,
    regla: 'Cada capacidad se evalúa de 0 a 3 con la rúbrica del informe de 2026. La dimensión es el promedio de las capacidades que le corresponden, de modo que conserve el máximo de 3 de la escala de 2025. El total es la suma de las cinco dimensiones, sobre 15.',
    tramos: TRAMOS,
  },
  promedios,
  empates,
  orden: orden.map((u) => ({ posicion: u.posicion, id: u.id, nombre: u.nombre, sigla: u.sigla, total: u.total, tramo: u.tramo })),
  universidades,
};

fs.writeFileSync(path.join(AQUI, 'escala-2025.json'), JSON.stringify(salida, null, 2), 'utf8');

/* ------------------------------------------------------------------ */
/* Informe por consola                                                 */
/* ------------------------------------------------------------------ */

const etiqueta = { pregrado: 'Pregrado', continua: 'Continua', investigacion: 'I+D', vinculacion: 'Vinculac.', uso: 'Uso int.' };
const ancho = 46;
const coma = (n) => n.toFixed(2).replace('.', ',');

console.log('\nEscala de cinco dimensiones (2025) recalculada con la matriz de 2026\n');
console.log('Pos  ' + 'Institución'.padEnd(ancho) + DIMENSIONES.map((d) => etiqueta[d.id].padStart(10)).join('') + 'Total'.padStart(8) + '   ICIA');
console.log('-'.repeat(5 + ancho + 50 + 8 + 7));

for (const u of orden) {
  console.log(
    String(u.posicion).padEnd(5) + u.nombre.slice(0, ancho - 1).padEnd(ancho) +
    DIMENSIONES.map((d) => (coma(u.dimensiones[d.id].puntaje) + (d.id && u.dimensiones[d.id].tiene_banda ? '~' : ' ')).padStart(10)).join('') +
    (coma(u.total) + (u.tiene_banda ? ' a ' + coma(u.total_techo) : '')).padStart(u.tiene_banda ? 16 : 8) +
    coma(u.indice_2026).padStart(7)
  );
}
console.log('-'.repeat(5 + ancho + 50 + 8 + 7));
const p = universidades.pucv;
console.log(
  '--   ' + (p.nombre + ' (aparte)').slice(0, ancho - 1).padEnd(ancho) +
  DIMENSIONES.map((d) => coma(p.dimensiones[d.id].puntaje).padStart(10)).join('') +
  coma(p.total).padStart(8) + coma(p.indice_2026).padStart(7)
);
console.log(
  '     ' + 'Promedio de las diez'.padEnd(ancho) +
  DIMENSIONES.map((d) => coma(promedios[d.id]).padStart(10)).join('') + coma(promedios.total).padStart(8)
);

/* ¿Cambia el orden si las capacidades sin información concluyente se acreditaran? */
const ordenTecho = [...orden].sort((a, b) => b.total_techo - a.total_techo || a.nombre.localeCompare(b.nombre, 'es'));
const mueve = ordenTecho
  .map((u, i) => ({ nombre: u.nombre, base: u.posicion, techo: i + 1 }))
  .filter((x) => x.base !== x.techo);
console.log('\nSi las capacidades sin información concluyente se acreditaran, cambian de lugar: ' +
  (mueve.length ? mueve.map((x) => `${x.nombre} (${x.base} a ${x.techo})`).join('; ') : 'ninguna'));

console.log('\nEvaluación de efecto (fuera de la escala de 2025): ' +
  Object.values(universidades).map((u) => u.fuera_de_la_escala[0].puntos).join(', ') + ' — once instituciones.');
if (empates.length) {
  console.log('\nEmpates en el total:');
  for (const e of empates) console.log(`  ${coma(e[2])}: ${e[0]} y ${e[1]}`);
}
console.log('\nEscrito: puntaje/escala-2025.json');
