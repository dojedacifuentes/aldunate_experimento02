/**
 * Compila el comparador ordinal a datos tipados para el sitio.
 *
 * **Por qué existe.** D-039 fijó que una figura derivada de un dato no se
 * dibuja aparte del dato, y la razón fue costosa: la v2.0.0 estuvo dos días
 * publicada con las tablas leyendo una matriz y las figuras dibujando otra,
 * con la institución apartada encabezando un orden del que estaba excluida.
 * La fase 4 del encargo v3 extiende esa regla a la web. Un componente React
 * con las cifras escritas a mano reproduce el mismo defecto con otra sintaxis.
 *
 * Fuente de verdad: `tools/informes/informe-01/comparador/matriz-v2.json`,
 * matriz `.v2` (la canónica, D-039), con la rúbrica del anexo D.
 * Salida: `src/data/informe01Comparador.ts`.
 *
 * Uso: `npm run informe01:comparador`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const RAÍZ = path.resolve(aquí, '../..');
const MATRIZ = path.join(RAÍZ, 'tools/informes/informe-01/comparador/matriz-v2.json');
const SALIDA = path.join(RAÍZ, 'src/data/informe01Comparador.ts');

const D = JSON.parse(fs.readFileSync(MATRIZ, 'utf8'));

/* La rúbrica se cerró antes de calcular y ésa es la razón de que el comparador
   sea defendible. No se toca aquí: se copia. */
const PUNTOS = { OPF: 3, OP: 2, INC: 1, ENT: 1, ADY: 1, NL: 0, NC: null };

const RÚBRICA = [
  { codigo: 'OPF', significa: 'En operación, con instrumento formal publicado', puntos: 3 },
  { codigo: 'OP', significa: 'En operación', puntos: 2 },
  { codigo: 'INC', significa: 'Incipiente', puntos: 1 },
  { codigo: 'ENT', significa: 'Sólo en el entorno', puntos: 1 },
  { codigo: 'ADY', significa: 'Sólo adyacente', puntos: 1 },
  { codigo: 'NL', significa: 'No localizada', puntos: 0 },
  { codigo: 'NC', significa: 'No concluyente', puntos: null },
];

/* Rótulos y preguntas literales del anexo C. Las claves son las de la matriz.
   El rótulo corto es para la cabecera de la matriz en pantalla: por D-042 una
   cabecera no se parte, y si no cabe se acorta y se declara la abreviatura. */
const CAPACIDADES = [
  ['Unidad', 'Unidad', 'Unidad especializada', '¿Existe una estructura dedicada dentro de la Facultad?'],
  ['Norma', 'Norma', 'Norma propia', '¿La Facultad dictó reglas sobre el uso de inteligencia artificial?'],
  ['Presencia', 'Pregrado', 'Presencia en pregrado', '¿La IA aparece dentro de la enseñanza de pregrado?'],
  ['Formacion', 'Formación', 'Formación estructurada', '¿Hay diplomados, minors, cursos o capacitaciones con IA?'],
  ['Herramienta', 'Herram.', 'Herramienta desplegada', '¿Hay un sistema de IA efectivamente a disposición?'],
  ['Adopcion', 'Adopción', 'Adopción en la enseñanza', '¿Consta que la IA se usa dentro de la enseñanza del Derecho?'],
  ['Alcance', 'Alcance', 'Alcance declarado', '¿El registro declara a quién alcanza lo que se hace?'],
  ['Investigacion', 'Investig.', 'Investigación', '¿Hay proyectos o publicaciones sobre inteligencia artificial?'],
  ['Transferencia', 'Transf.', 'Transferencia', '¿Hay convenios o servicios hacia fuera de la Facultad?'],
  ['Evaluacion', 'Evaluación', 'Evaluación de efecto', '¿Se midió si algo de esto mejoró el aprendizaje jurídico?'],
];

/* El generador no acepta que la matriz cambie de forma en silencio: si alguien
   añade una capacidad y no la rotula aquí, el sitio la dibujaría sin nombre. */
if (CAPACIDADES.length !== D.caps.length) {
  throw new Error(
    `La matriz trae ${D.caps.length} capacidades y este generador rotula ${CAPACIDADES.length}.`,
  );
}
for (const [i, [clave]] of CAPACIDADES.entries()) {
  if (D.caps[i] !== clave) {
    throw new Error(`Capacidad ${i}: la matriz dice "${D.caps[i]}" y el generador dice "${clave}".`);
  }
}

/* Las diez referencias que la Ronda 2 repetía y que ya constaban en el corpus
   con identificador anterior: ésas sí están contrastadas. Las demás fuentes de
   la ronda, no —lo dice el propio anexo de ampliación—, y el sitio lo declara
   celda por celda en vez de dejar que el número parezca igual de firme que
   los otros. */
const YA_EN_CORPUS = new Set([
  'R2-UC-02', 'R2-UNAB-02', 'R2-UAUT-05', 'R2-UAUT-06', 'R2-UCEN-02',
  'R2-UCH-01', 'R2-UDEC-01', 'R2-UDP-01', 'R2-UDP-02', 'R2-PUCV-03',
]);

/* Índice de cierres por institución y capacidad, para colgarlos de su celda. */
const cierres = new Map();
for (const [institución, capacidad, , , fuentesCrudas, nota] of D.aplicados) {
  const fuentes = fuentesCrudas === '—'
    ? []
    : fuentesCrudas.split(';').map((s) => s.trim()).filter(Boolean);
  cierres.set(`${institución}|${capacidad}`, {
    nota,
    fuentes,
    /* Sin fuente que contrastar es una ruta del protocolo recorrida sin hallar
       nada: no es una afirmación apoyada en documento sin verificar. */
    contrastada: fuentes.length === 0 || fuentes.every((f) => YA_EN_CORPUS.has(f)),
  });
}

const APARTADA = 'P. U. Católica de Valparaíso';

function fila(institución, estados) {
  let piso = 0;
  let sinConcluir = 0;
  let puntosExpuestos = 0;
  const celdas = estados.map((estado, i) => {
    const capacidad = D.caps[i];
    const puntos = PUNTOS[estado];
    if (estado === 'NC') sinConcluir += 1;
    else piso += puntos;
    const cierre = cierres.get(`${institución}|${capacidad}`) ?? null;
    if (cierre && !cierre.contrastada) puntosExpuestos += puntos ?? 0;
    return { capacidad, estado, puntos, cierre };
  });
  return { institucion: institución, celdas, piso, techo: piso + sinConcluir * 2, sinConcluir, puntosExpuestos };
}

const todas = Object.entries(D.v2).map(([inst, estados]) => fila(inst, estados));
const apartada = todas.find((f) => f.institucion === APARTADA) ?? null;
const filas = todas
  .filter((f) => f.institucion !== APARTADA)
  .sort((a, b) => b.piso - a.piso || b.techo - a.techo || a.institucion.localeCompare(b.institucion, 'es'));

const expuestos = [...cierres.values()].filter((c) => !c.contrastada);
const datos = {
  capacidades: CAPACIDADES.map(([clave, corto, rotulo, pregunta]) => ({ clave, corto, rotulo, pregunta })),
  rubrica: RÚBRICA,
  filas,
  apartada,
  maximo: CAPACIDADES.length * 3,
  cierres: {
    total: cierres.size,
    expuestos: expuestos.length,
    puntosExpuestos: filas.reduce((s, f) => s + f.puntosExpuestos, 0)
      + (apartada?.puntosExpuestos ?? 0),
  },
};

const cabecera = `/**
 * ARCHIVO GENERADO. No lo edites a mano: la siguiente compilación lo sobrescribe.
 *
 * Fuente de verdad: \`tools/informes/informe-01/comparador/matriz-v2.json\`, matriz
 * \`.v2\` — la canónica por D-039 — con la rúbrica del anexo D del Informe 01.
 * Generador: \`scripts/informe-01/08-compilar-comparador.mjs\`.
 *
 * Existe para que el comparador de la web y las tablas del documento no puedan
 * divergir. Mientras la figura y la tabla salgan de sitios distintos, divergir
 * no es un accidente: es cuestión de tiempo.
 */
import type { Informe01Comparador } from '@/types';

export const informe01Comparador: Informe01Comparador = `;

fs.writeFileSync(SALIDA, cabecera + JSON.stringify(datos, null, 2) + ';\n', 'utf8');

console.log(`✓ ${path.relative(RAÍZ, SALIDA)}`);
console.log(`  ${filas.length} instituciones en el orden · apartada: ${apartada ? '1' : '0'}`);
console.log(`  techo real ${Math.max(...filas.map((f) => f.piso))}/${datos.maximo}`);
console.log(`  cierres ${datos.cierres.total} · sin contrastar ${datos.cierres.expuestos} · puntos expuestos ${datos.cierres.puntosExpuestos}`);
