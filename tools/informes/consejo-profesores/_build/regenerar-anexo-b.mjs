/**
 * Regenera las dos primeras tablas del anexo B desde puntaje/resultados.json,
 * para que la matriz publicada y los resultados del índice no queden desfasados
 * cuando cambia un estado.
 *
 *   node regenerar-anexo-b.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const R = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'resultados.json'), 'utf8'));
const p = path.join(aqui, 'redaccion', 'informe-01', 'B-matriz-y-resultados.md');
let s = fs.readFileSync(p, 'utf8');

const LETRA = { OPF: 'F', OP: 'O', INC: 'I', ENT: 'U', ADY: 'A', NL: 'N', NC: 'S' };
const CAPS = [
  'Unidad especializada', 'Norma propia', 'Presencia en pregrado', 'Formación estructurada',
  'Herramienta desplegada', 'Adopción en la enseñanza', 'Alcance declarado', 'Investigación',
  'Transferencia', 'Evaluación de efecto',
];

const coma = (n) => String(n).replace('.', ',');
const rango = (a, b) => (a === b ? coma(a) : `${coma(a)}–${coma(b)}`);

const orden = [
  ...R.instituciones.filter((i) => i.en_ranking).sort((a, b) => a.posicion - b.posicion),
  R.instituciones.find((i) => !i.en_ranking),
];

/* ---- Tabla 1: estado de cada capacidad ---- */
const filas1 = orden.map((i) => {
  const porCap = Object.fromEntries(i.celdas.map((c) => [c.capacidad, c]));
  const letras = CAPS.map((k) => LETRA[porCap[k].estado]).join(' | ');
  return `| ${i.sigla} | ${letras} |`;
});

const inicio1 = s.indexOf('| Institución | Unid. |');
const fin1 = s.indexOf('\n\n', inicio1);
if (inicio1 < 0) throw new Error('cabecera de la tabla de capacidades no encontrada');
const cabecera1 = '| Institución | Unid. | Norma | Pregr. | Form. | Herr. | Adop. | Alc. | Inv. | Transf. | Eval. |\n|---|---|---|---|---|---|---|---|---|---|---|';
s = s.slice(0, inicio1) + cabecera1 + '\n' + filas1.join('\n') + s.slice(fin1);

/* ---- Tabla 2: resultados del índice ---- */
const filas2 = orden.map((i) => {
  const sub = i.subindices;
  const pos = i.en_ranking ? String(i.posicion) : '—';
  const v = i.indice_verificado;
  return `| ${pos} | ${i.sigla} | ${rango(i.indice.piso, i.indice.techo)} | ${rango(sub.GOB.piso, sub.GOB.techo)} | ${rango(sub.DOC.piso, sub.DOC.techo)} | ${rango(sub.REC.piso, sub.REC.techo)} | ${rango(sub.RES.piso, sub.RES.techo)} | ${rango(v.piso, v.techo)} | ${rango(i.indice_simple.piso, i.indice_simple.techo)} |`;
});

const inicio2 = s.indexOf('| Pos. | Institución | Índice |');
const fin2 = s.indexOf('\n\n', inicio2);
if (inicio2 < 0) throw new Error('cabecera de la tabla de resultados no encontrada');
const cabecera2 = '| Pos. | Institución | Índice | Gobierno y reglas | Docencia | Recursos, investigación y vínculo | Alcance y efecto | Índice verificado | Índice simple (0-30) |\n|---|---|---|---|---|---|---|---|---|';
s = s.slice(0, inicio2) + cabecera2 + '\n' + filas2.join('\n') + s.slice(fin2);

fs.writeFileSync(p, s, 'utf8');
console.log('Anexo B regenerado desde la matriz vigente.\n');
console.log('Estado por capacidad:');
for (const f of filas1) console.log('  ' + f);
