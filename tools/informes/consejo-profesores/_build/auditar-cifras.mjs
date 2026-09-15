/**
 * Auditoría de las cifras del Documento A contra puntaje/escala-2025.json.
 * Comprueba que cada puntaje escrito en los títulos de dimensión y en los totales
 * coincide con el dato calculado, y que los promedios citados en las conclusiones
 * son los del cálculo.
 *
 *   node auditar-cifras.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const E = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'escala-2025.json'), 'utf8'));
const dir = path.join(aqui, 'redaccion', 'informe-01');

const coma = (n) => n.toFixed(2).replace('.', ',');
const problemas = [];
const comprobados = [];

/* Orden de aparición de las fichas: las diez del ranking por su puntaje y la PUCV al final.
   Se deriva del cálculo para que el auditor no dependa de una lista escrita a mano. */
const ORDEN_FICHAS = [...E.orden.map((o) => o.id), 'pucv'];

const DIMS = ['pregrado', 'continua', 'investigacion', 'vinculacion', 'uso'];
const ETIQUETA = {
  pregrado: 'Formación académica (pregrado)',
  continua: 'Formación continua y postgrado',
  investigacion: 'Investigación y desarrollo',
  vinculacion: 'Vinculación con el medio',
  uso: 'Uso interno institucional de IA',
};

const texto = ['03-fichas-a.md', '03-fichas-b.md']
  .map((f) => fs.readFileSync(path.join(dir, f), 'utf8'))
  .join('\n');

/* Cada título de dimensión debe traer el puntaje que corresponde a su institución */
const titulos = [...texto.matchAll(/^### (.+?) · (.+)$/gm)]
  .map((m) => ({ dim: m[1], valor: m[2] }))
  .filter((t) => t.dim !== 'Total');
const totales = [...texto.matchAll(/^### Total · (.+?) de 15$/gm)].map((m) => m[1]);

let i = 0;
for (const id of ORDEN_FICHAS) {
  const u = E.universidades[id];
  for (const d of DIMS) {
    const esperado = u.dimensiones[d];
    const t = titulos[i++];
    if (!t) { problemas.push(`Falta el título de ${ETIQUETA[d]} en ${u.nombre}`); continue; }
    if (t.dim !== ETIQUETA[d]) {
      problemas.push(`Orden inesperado en ${u.nombre}: se esperaba «${ETIQUETA[d]}» y viene «${t.dim}»`);
      continue;
    }
    const sinConcluir = esperado.capacidades.every((c) => c.sin_informacion_concluyente);
    const valorEsperado = sinConcluir
      ? 'sin información concluyente'
      : esperado.tiene_banda
        ? `${coma(esperado.puntaje)} a ${coma(esperado.techo)} de 3`
        : `${coma(esperado.puntaje)} de 3`;
    if (t.valor !== valorEsperado) {
      problemas.push(`${u.nombre} · ${ETIQUETA[d]}: dice «${t.valor}» y corresponde «${valorEsperado}»`);
    } else {
      comprobados.push(`${u.nombre_corto} · ${ETIQUETA[d]} = ${t.valor}`);
    }
  }
}

ORDEN_FICHAS.forEach((id, k) => {
  const u = E.universidades[id];
  const esperado = u.tiene_banda ? `${coma(u.total)} a ${coma(u.total_techo)}` : coma(u.total);
  if (totales[k] !== esperado) {
    problemas.push(`${u.nombre} · total: dice «${totales[k]}» y corresponde «${esperado}»`);
  } else {
    comprobados.push(`${u.nombre_corto} · total = ${totales[k]}`);
  }
});

/* Promedios citados en las conclusiones */
const concl = fs.readFileSync(path.join(dir, '05-mapeo.md'), 'utf8');
/* Cada promedio debe aparecer en las conclusiones con el valor que arroja el cálculo.
   Se busca la cifra, no una frase fija, para que el auditor no dependa de la redacción. */
for (const d of DIMS) {
  const valor = coma(E.promedios[d]);
  if (!concl.includes(`${valor} sobre 3`)) {
    problemas.push(`El promedio de ${ETIQUETA[d]} es ${valor} y esa cifra no aparece en las conclusiones`);
  } else comprobados.push(`promedio ${d} = ${valor}`);
}

/* El promedio total, en el resumen */
const resumen = fs.readFileSync(path.join(dir, '00-resumen.md'), 'utf8');
if (!resumen.includes(`${coma(E.promedios.total)} puntos sobre 15`)) {
  problemas.push(`El promedio total es ${coma(E.promedios.total)} y esa cifra no aparece en el resumen`);
} else comprobados.push(`promedio total = ${coma(E.promedios.total)}`);

/* Evaluación de efecto en cero en las once */
const ceros = Object.values(E.universidades).filter((u) => u.fuera_de_la_escala[0].puntos === 0).length;
if (ceros !== 11) problemas.push(`Evaluación de efecto: ${ceros} instituciones en cero, se afirma que son once`);
else comprobados.push('evaluación de efecto = 0 en las once');

console.log(`Comprobaciones correctas: ${comprobados.length}`);
if (problemas.length) {
  console.log(`\nPROBLEMAS (${problemas.length}):`);
  for (const p of problemas) console.log('  - ' + p);
  process.exitCode = 1;
} else {
  console.log('\nTodas las cifras del capítulo IV y los promedios del capítulo VI coinciden con el cálculo.');
}
