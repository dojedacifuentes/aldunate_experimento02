// Anexos con tablas del Documento A, generados desde los datos (no se escriben a mano).
//   node anexos-informe-01.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const R = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'resultados.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(path.join(aqui, 'hechos', 'i01-instituciones.json'), 'utf8'));
const T = JSON.parse(fs.readFileSync(path.join(aqui, 'hechos', 'i01-transversal.json'), 'utf8').replace(/^﻿/, ''));
const P = JSON.parse(fs.readFileSync(path.join(aqui, 'hechos', 'i01-pucv-y-metodo.json'), 'utf8').replace(/^﻿/, ''));
const salida = path.join(aqui, 'redaccion', 'informe-01');
fs.mkdirSync(salida, { recursive: true });

const num = (v, d = 1) => (v === null || v === undefined ? '—' : Number(v).toFixed(d).replace('.', ','));
const banda = (p, t) => (p === t ? num(p) : `${num(p)}–${num(t)}`);
const miles = (n) => Number(n).toLocaleString('es-CL');
const LETRA = { OPF: 'F', OP: 'O', INC: 'I', ENT: 'U', ADY: 'A', NL: 'N', NC: 'S' };
const ABREV = ['Unid.', 'Norma', 'Pregr.', 'Form.', 'Herr.', 'Adop.', 'Alc.', 'Inv.', 'Transf.', 'Eval.'];

const orden = [...R.ranking.map((r) => r.nombre_corto), 'P. U. Católica de Valparaíso'];
const inst = orden.map((n) => R.instituciones.find((i) => i.nombre_corto === n));

// ---------- Anexo B ----------
const B = [];
B.push('# Anexo B. Matriz de capacidades y resultados del índice');
B.push('');
B.push('## 1. Estado de cada capacidad');
B.push('');
B.push('La tabla registra el estado de las diez capacidades en las once instituciones, según la matriz vigente del informe experto. Las letras significan: F, formalizada con instrumento publicado (3 puntos); O, en funcionamiento (2); I, incipiente (1); U, existente solo a nivel de la universidad (1); A, adyacente (1); N, no localizada tras la búsqueda (0); S, sin información concluyente, que no suma y amplía el margen superior del índice. Las columnas siguen el orden de las capacidades: unidad especializada, norma propia, presencia en pregrado, formación estructurada, herramienta desplegada, adopción en la enseñanza, alcance declarado, investigación, transferencia y evaluación de efecto.');
B.push('');
B.push(`::tabla id="t-anexo-matriz" titulo="Estado de las diez capacidades por institución" fuente="Matriz de capacidades del informe experto v3.2.0, con los cierres de la segunda ronda de búsqueda." anchos="${[20, ...Array(10).fill(8)].join(',')}"`);
B.push(`| Institución | ${ABREV.join(' | ')} |`);
B.push(`|${Array(11).fill('---').join('|')}|`);
for (const i of inst) B.push(`| ${i.sigla} | ${i.celdas.map((c) => LETRA[c.estado]).join(' | ')} |`);
B.push('');
B.push('## 2. Resultados del índice');
B.push('');
B.push('El índice va de 0 a 100. Cuando una institución tiene capacidades sin información concluyente, se informa el valor mínimo acreditado y el máximo posible. La columna del índice verificado repite el cálculo sin las capacidades cuya acreditación descansa en fuentes de la segunda ronda que no pasaron el contraste con su publicación original. La Pontificia Universidad Católica de Valparaíso se calcula con el mismo sistema y no recibe posición.');
B.push('');
B.push('::tabla id="t-anexo-resultados" titulo="Índice de capacidades institucionales en inteligencia artificial por institución" fuente="Elaboración propia a partir de la matriz de capacidades." anchos="6,13,14,10,12,11,10,13,11"');
B.push('| Pos. | Institución | Índice | Gobierno y reglas | Docencia | Recursos, investigación y vínculo | Alcance y efecto | Índice verificado | Índice simple (0-30) |');
B.push('|---|---|---|---|---|---|---|---|---|');
for (const i of inst) {
  const s = i.subindices;
  B.push(`| ${i.posicion ?? '—'} | ${i.sigla} | ${banda(i.indice.piso, i.indice.techo)} | ${banda(s.GOB.piso, s.GOB.techo)} | ${banda(s.DOC.piso, s.DOC.techo)} | ${banda(s.REC.piso, s.REC.techo)} | ${banda(s.RES.piso, s.RES.techo)} | ${banda(i.indice_verificado.piso, i.indice_verificado.techo)} | ${i.indice_simple.piso}${i.indice_simple.nc ? `–${i.indice_simple.techo}` : ''} |`);
}
B.push('');
B.push('## 3. Sensibilidad del orden');
B.push('');
const esc = Object.fromEntries(R.sensibilidad.escenarios.map((e) => [e.id, Object.fromEntries(e.ranking.map((r) => [r.nombre_corto, r.posicion]))]));
const g = R.sensibilidad.grilla;
B.push(`La tabla muestra la posición de cada institución bajo cuatro variantes del cálculo y el rango de posiciones que ocupa en ${g.vectores} combinaciones de pesos, con cada dimensión entre 10 y 40 puntos. ${g.mismas_tres_primeras === g.vectores ? 'Las tres primeras posiciones corresponden a las mismas instituciones en todas esas combinaciones.' : `Las tres primeras posiciones corresponden a las mismas instituciones en ${g.mismas_tres_primeras} de ellas.`}`);
B.push('');
B.push('::tabla id="t-anexo-sensibilidad" titulo="Posición según variantes del cálculo" fuente="Elaboración propia." anchos="22,10,13,13,14,14,14"');
B.push('| Institución | Base | Pesos iguales | Pesos por compromiso institucional | Sin direcciones caídas | Solo fuentes contrastadas | Rango en la grilla |');
B.push('|---|---|---|---|---|---|---|');
for (const i of inst.filter((x) => x.en_ranking)) {
  const n = i.nombre_corto;
  B.push(`| ${i.sigla} | ${i.posicion} | ${esc.E1[n]} | ${esc.E2[n]} | ${esc.E3[n]} | ${esc.E4[n]} | ${i.rango_posiciones_grilla.min === i.rango_posiciones_grilla.max ? i.rango_posiciones_grilla.min : `${i.rango_posiciones_grilla.min} a ${i.rango_posiciones_grilla.max}`} |`);
}
fs.writeFileSync(path.join(salida, 'B-matriz-y-resultados.md'), `${B.join('\n')}\n`);

// ---------- Anexo C ----------
const C = [];
C.push('# Anexo C. Instrumentos formales y proyectos de investigación');
C.push('');
C.push('## 1. Instrumentos que acreditan capacidades formalizadas');
C.push('');
C.push('Una capacidad se considera formalizada cuando existe un documento citable que la sostiene: un acto administrativo, un acuerdo de un órgano colegiado, un código de asignatura con créditos, un código de proyecto adjudicado por un fondo público, un registro de propiedad intelectual, un convenio firmado o una unidad listada en el organigrama publicado.');
C.push('');
C.push('::tabla id="t-anexo-instrumentos" titulo="Capacidades formalizadas y documento que las acredita" fuente="Anexo D del informe experto v3.2.0 y documento complementario sobre la PUCV." anchos="18,22,60"');
C.push('| Institución | Capacidad | Instrumento |');
C.push('|---|---|---|');
for (const h of H) for (const x of h.instrumentos_formales_anexo_d) C.push(`| ${h.sigla} | ${x.capacidad} | ${x.instrumento.replace(/\|/g, '/')} |`);
// PUCV: texto del complemento v1.2 (sección 4), sin las anotaciones internas que dejó la extracción.
if (!(P.pucv.capacidades_completas || []).length) throw new Error('Faltan las capacidades completas de la PUCV en la base de hechos.');
C.push('| PUCV | Herramienta desplegada | Registro de propiedad intelectual de ScribeClaroPUCV, certificado n.º 2026-A-6558, de 23 de junio de 2026 |');
C.push('| PUCV | Transferencia | Convenio con la Corte Suprema de agosto de 2020, con actividad derivada documentada |');
C.push('');
C.push('## 2. Proyectos ANID de la disciplina Derecho con objeto de inteligencia artificial');
C.push('');
C.push(`La consulta abarcó los ${miles(T.anid.registros_consultados.valor)} proyectos adjudicados que registra la base histórica de ANID. Los siete proyectos siguientes, con fallo en 2025 y 2026, tienen la inteligencia artificial como objeto de estudio jurídico. Ninguno versa sobre la enseñanza del Derecho. La base recoge adjudicaciones, de modo que no informa sobre postulaciones rechazadas.`);
C.push('');
C.push('::tabla id="t-anexo-anid" titulo="Proyectos Fondecyt de la disciplina Derecho con objeto de IA, 2025-2026" fuente="ANID, histórico de proyectos adjudicados, según el anexo E del informe experto." anchos="12,18,24,22,14,10"');
C.push('| Código | Instrumento | Investigador responsable | Institución | Monto (pesos) | Meses |');
C.push('|---|---|---|---|---|---|');
for (const p of T.anid.proyectos_derecho_con_objeto_ia.proyectos) C.push(`| ${p.codigo} | ${p.instrumento} | ${p.responsable} | ${p.institucion} | ${miles(p.monto)} | ${p.meses} |`);
fs.writeFileSync(path.join(salida, 'C-instrumentos-y-anid.md'), `${C.join('\n')}\n`);

console.log('Anexo B y anexo C escritos en', path.relative(aqui, salida));
