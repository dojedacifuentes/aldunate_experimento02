/**
 * Recálculo del comparador ordinal · v1.0.0 + Ronda 2
 *
 * La rúbrica NO se toca: es la misma de la v1.0.0, cerrada antes de calcular.
 * Lo único que cambia son las celdas, y sólo donde la Ronda 2 aporta fuente.
 * Recorrer una ruta convierte «no concluyente» en un estado; nunca la sube sola.
 */

const PUNTOS = { OPF: 3, OP: 2, INC: 1, ENT: 1, ADY: 1, NL: 0, NC: null };

const CAPS = [
  'Unidad', 'Norma', 'Presencia', 'Formacion', 'Herramienta',
  'Adopcion', 'Alcance', 'Investigacion', 'Transferencia', 'Evaluacion',
];

// Matriz de la v1.0.0, transcrita de su anexo «Las capacidades, celda por celda».
const V1 = {
  'P. U. Católica de Chile':            ['OPF','OPF','NC','OP','ENT','OPF','OP','OPF','INC','NL'],
  'P. U. Católica de Valparaíso':       ['OP','ENT','OP','OP','OPF','ENT','OP','OP','OPF','NL'],
  'U. Adolfo Ibáñez':                   ['NC','NC','NC','OP','NL','NC','NL','OPF','INC','NL'],
  'U. Andrés Bello':                    ['NC','NC','OP','INC','OP','ENT','OP','NL','OP','NL'],
  'U. Autónoma de Chile':               ['NC','NC','OP','OPF','NC','OP','OP','OPF','NC','NL'],
  'U. Central de Chile':                ['OP','NC','NC','NC','OP','OP','OP','NL','NC','NL'],
  'U. de Chile':                        ['OP','ENT','NC','OP','NL','ENT','OP','OPF','INC','NL'],
  'U. de Concepción':                   ['NC','NC','NC','INC','ENT','INC','ENT','NL','INC','NL'],
  'U. de los Andes':                    ['NC','NC','NC','OP','ENT','NC','NL','ENT','INC','NL'],
  'U. del Desarrollo':                  ['NC','NC','INC','NC','ENT','NC','NL','NL','ENT','NL'],
  'U. Diego Portales':                  ['OP','NC','INC','NC','NC','NC','OP','NL','INC','NL'],
};

// Tabla 3 de la Ronda 2 · sólo cierres con fuente declarada.
// [institución, capacidad, código nuevo, fuente, nota]
const RONDA2 = [
  ['P. U. Católica de Chile', 'Presencia',     'OP',  'R2-UC-01',              'Seminario DER201H-3 íntegramente de IA y Derecho, 2025. No obligatorio.'],
  ['U. Adolfo Ibáñez',        'Unidad',        'ADY', 'R2-UAI-01',             'Laboratorio de Justicia Centrada en las Personas: usa IA, su objeto no es IA.'],
  ['U. Adolfo Ibáñez',        'Norma',         'NL',  '—',                     'Rutas recorridas sin localizar norma propia de Facultad.'],
  ['U. Adolfo Ibáñez',        'Presencia',     'OP',  'R2-UAI-01; R2-UAI-02',  'Curso de pregrado con prototipos que incorporan IA.'],
  ['U. Adolfo Ibáñez',        'Adopcion',      'OP',  'R2-UAI-01',             'IA utilizada dentro de proyectos formativos del curso 2025.'],
  ['U. Andrés Bello',         'Unidad',        'NL',  '—',                     'No se localizó estructura de Derecho dedicada a IA o LegalTech.'],
  ['U. Andrés Bello',         'Norma',         'ENT', 'R2-UNAB-01',            'Lineamientos de la universidad, no norma propia de Derecho.'],
  ['U. Autónoma de Chile',    'Unidad',        'OPF', 'R2-UAUT-01; R2-UAUT-02','IA+D creado por Resolución VRIP 118/2020 y adscrito a Derecho.'],
  ['U. Autónoma de Chile',    'Norma',         'NL',  '—',                     'No se localizó regla propia de Facultad.'],
  ['U. Autónoma de Chile',    'Herramienta',   'NL',  'R2-UAUT-05; R2-UAUT-06','Usa herramientas de terceros; sin sistema propio desplegado.'],
  ['U. Autónoma de Chile',    'Transferencia', 'OP',  'R2-UAUT-07',            'Convenio Legalfit: prácticas con automatización e IA.'],
  ['U. Central de Chile',     'Norma',         'OPF', 'R2-UCEN-01',            'Resolución 13/2025 del decano aprueba instructivo de uso académico de IA.'],
  ['U. Central de Chile',     'Presencia',     'OP',  'R2-UCEN-03',            'Academia y Laboratorio LegalTech selecciona desde segundo año.'],
  ['U. Central de Chile',     'Formacion',     'OP',  'R2-UCEN-03',            'Ciclos semestrales, mentoring y certificación.'],
  ['U. Central de Chile',     'Transferencia', 'OP',  'R2-UCEN-02',            'Convenio con la Cámara de Comercio de Sevilla para IA y LegalTech.'],
  ['U. de Concepción',        'Unidad',        'NL',  '—',                     'Se localizaron actividades, no una unidad especializada.'],
  ['U. de Concepción',        'Norma',         'NL',  '—',                     'No se localizó instrumento propio de Facultad.'],
  ['U. de los Andes',         'Unidad',        'NL',  '—',                     'No se localizó unidad de IA o LegalTech dependiente de Derecho.'],
  ['U. de los Andes',         'Norma',         'NL',  '—',                     'No se localizó norma propia de Derecho.'],
  ['U. del Desarrollo',       'Unidad',        'OP',  'R2-UDD-01',             'Observatorio de Derecho y Tecnología, dependiente de un centro de Facultad.'],
  ['U. del Desarrollo',       'Norma',         'ENT', 'R2-UDD-04',             'Política y reglamento de la universidad, no de Derecho.'],
  ['U. del Desarrollo',       'Formacion',     'OP',  'R2-UDD-02; R2-UDD-03',  'II Versión del curso de IA para Abogados en 2026: continuidad verificable.'],
  ['U. Diego Portales',       'Norma',         'NL',  'R2-UDP-02',             'Declara orientación al uso de IA; no se localizó norma publicada.'],
  ['U. Diego Portales',       'Formacion',     'INC', 'R2-UDP-02',             'Taller y curso anunciados; falta programa de ejecución.'],
  ['U. Diego Portales',       'Herramienta',   'NL',  '—',                     'No se localizó sistema de IA de Facultad.'],
  ['U. Diego Portales',       'Adopcion',      'INC', 'R2-UDP-02',             'Incorporación anunciada desde primer y penúltimo semestre; falta ejecución.'],
];

function calcular(matriz) {
  const r = {};
  for (const [inst, fila] of Object.entries(matriz)) {
    let piso = 0, nc = 0;
    for (const c of fila) {
      if (c === 'NC') nc++;
      else piso += PUNTOS[c];
    }
    r[inst] = { piso, techo: piso + nc * 2, nc };
  }
  return r;
}

const antes = calcular(V1);

// Aplicar Ronda 2
const V2 = Object.fromEntries(Object.entries(V1).map(([k, v]) => [k, [...v]]));
const aplicados = [];
const rechazados = [];
for (const [inst, cap, nuevo, fuente, nota] of RONDA2) {
  const i = CAPS.indexOf(cap);
  if (i < 0 || !V2[inst]) { rechazados.push([inst, cap, 'no existe en la matriz']); continue; }
  const previo = V2[inst][i];
  // Regla dura: sólo se mueve una celda no concluyente. Nunca se pisa un estado ya establecido.
  if (previo !== 'NC') {
    rechazados.push([inst, cap, `ya estaba en ${previo}; la Ronda 2 propone ${nuevo}`]);
    continue;
  }
  V2[inst][i] = nuevo;
  aplicados.push([inst, cap, previo, nuevo, fuente, nota]);
}

const despues = calcular(V2);

const orden = (r) => Object.entries(r).sort((a, b) =>
  b[1].piso - a[1].piso || b[1].techo - a[1].techo || a[0].localeCompare(b[0]));

console.log('CIERRES APLICADOS: ' + aplicados.length + ' de ' + RONDA2.length);
if (rechazados.length) {
  console.log('\nNO APLICADOS (la celda ya tenía estado; no se pisa):');
  for (const [i, c, m] of rechazados) console.log('  · ' + i + ' / ' + c + ' — ' + m);
}

console.log('\n===== COMPARADOR =====');
console.log('#  Institución                        v1.0.0        v2.0.0        Δpiso  s/c');
const oA = orden(antes), oD = orden(despues);
const posA = Object.fromEntries(oA.map(([k], i) => [k, i + 1]));
oD.forEach(([inst, v], i) => {
  const a = antes[inst];
  const mov = posA[inst] - (i + 1);
  const flecha = mov > 0 ? `▲${mov}` : mov < 0 ? `▼${-mov}` : '  =';
  console.log(
    String(i + 1).padStart(2) + ' ' + inst.padEnd(34) +
    (a.piso + '–' + a.techo).padEnd(14) +
    (v.piso + '–' + v.techo).padEnd(14) +
    String(v.piso - a.piso).padStart(4) + '   ' +
    String(v.nc).padStart(2) + '  ' + flecha
  );
});

const ncA = Object.values(antes).reduce((s, v) => s + v.nc, 0);
const ncD = Object.values(despues).reduce((s, v) => s + v.nc, 0);
console.log('\nCeldas sin concluir: ' + ncA + ' → ' + ncD + '  (de 110)');

console.log('\n===== MATRIZ v2.0.0 =====');
console.log('Institución'.padEnd(34) + CAPS.map(c => c.slice(0, 4).padStart(5)).join('') + '  piso');
for (const [inst, fila] of Object.entries(V2))
  console.log(inst.padEnd(34) + fila.map(c => c.padStart(5)).join('') + String(despues[inst].piso).padStart(6));

import('node:fs').then(fs => fs.writeFileSync(
  new URL('./matriz-v2.json', import.meta.url),
  JSON.stringify({ caps: CAPS, puntos: PUNTOS, v1: V1, v2: V2, antes, despues, aplicados, rechazados }, null, 1)
));
