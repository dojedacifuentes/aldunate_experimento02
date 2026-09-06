/**
 * Calibrador de figuras.
 *
 * Los rótulos de las figuras caen a 4-5 pt en papel y hay que agrandarlos,
 * pero las figuras están dibujadas con posiciones absolutas calculadas para su
 * tamaño original: pasado cierto punto, los rótulos se montan unos sobre
 * otros. Ese punto es distinto en cada figura y no se puede adivinar.
 *
 * Aquí se mide. Para cada factor candidato se construye el documento, se abre
 * en un navegador con la hoja de impresión aplicada y se comparan las cajas de
 * todos los `<text>` de cada SVG. Se elige, figura por figura, el factor más
 * alto que **no añade ni un solapamiento** sobre los que el documento ya
 * traía —que son nueve, y no son cosa nuestra—.
 *
 *   node scripts/informes/lector/calibrar-figuras.mjs
 *
 * Escribe `escalas.json`, que lee `construir.mjs`. Hay que volver a pasarlo
 * cuando cambien las figuras de un informe o entre una versión nueva.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

import { DOCUMENTOS } from './documentos.mjs';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..');

const CANDIDATOS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const navegadorEnDisco = CANDIDATOS.find((c) => fs.existsSync(c));
if (!navegadorEnDisco) {
  console.error('✗ No se encontró Chrome ni Edge.');
  process.exit(1);
}

/** De menor a mayor: se prueba de mayor a menor y gana el primero que pasa. */
const FACTORES = [1.34, 1.26, 1.19, 1.13, 1.07, 1.0];

/** Ancho de A4 a 96 ppp, que es la caja en la que se imprimirá. */
const ANCHO = 794;

const navegador = await chromium.launch({ executablePath: navegadorEnDisco });

/** Mide, para un documento ya construido, cuántos rótulos chocan en cada SVG. */
async function medirChoques(archivo) {
  const pág = await navegador.newPage({ viewport: { width: ANCHO, height: 1123 } });
  await pág.goto('file:///' + archivo.split(path.sep).join('/'), {
    waitUntil: 'networkidle',
    timeout: 180000,
  });
  await pág.emulateMedia({ media: 'print' });
  await pág.evaluate(() => document.fonts.ready);
  await pág.waitForTimeout(900);

  const medida = await pág.evaluate(() => {
    const porFigura = [];
    // Sólo las figuras del documento: el icono del alternador de tema también
    // es un SVG y no tiene rótulos que medir.
    document.querySelectorAll('figure svg').forEach((svg) => {
      const textos = [...svg.querySelectorAll('text')]
        .map((t) => ({ r: t.getBoundingClientRect(), s: t.textContent.trim() }))
        .filter((t) => t.r.width > 0 && t.s);
      let choques = 0;
      for (let a = 0; a < textos.length; a += 1) {
        for (let b = a + 1; b < textos.length; b += 1) {
          const A = textos[a].r;
          const B = textos[b].r;
          const solapeX = Math.min(A.right, B.right) - Math.max(A.left, B.left);
          const solapeY = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
          if (solapeX > 1.5 && solapeY > 1.5) choques += 1;
        }
      }
      porFigura.push(choques);
    });
    return porFigura;
  });

  await pág.close();
  return medida;
}

/* El constructor lee `escalas.json`; para probar un factor se escribe el
   archivo, se reconstruye y se mide. Es más lento que inyectar el factor por
   variable de entorno, y a cambio mide exactamente lo que se va a publicar. */
const rutaEscalas = path.join(aquí, 'escalas.json');
const previo = fs.existsSync(rutaEscalas) ? fs.readFileSync(rutaEscalas, 'utf8') : null;

async function construirCon(escalas) {
  fs.writeFileSync(rutaEscalas, JSON.stringify(escalas, null, 2));
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, [path.join(aquí, 'construir.mjs')], {
    cwd: raíz,
    stdio: 'pipe',
  });
}

const resultado = {};

for (const doc of DOCUMENTOS) {
  const archivo = path.join(raíz, doc.destino);
  console.log(`\n── ${doc.destino}`);

  // Línea base: sin agrandar nada.
  await construirCon({ ...resultado, [doc.destino]: [] });
  const base = await medirChoques(archivo);
  if (!base.length) {
    console.log('  sin figuras');
    resultado[doc.destino] = [];
    continue;
  }
  console.log(`  ${base.length} figuras · choques de origen: ${base.reduce((a, b) => a + b, 0)}`);

  // Se prueba cada factor en todas a la vez y se anota, por figura, el mayor
  // que no empeora su línea base.
  const elegido = new Array(base.length).fill(1);
  for (const f of FACTORES) {
    if (f === 1) break;
    await construirCon({ ...resultado, [doc.destino]: new Array(base.length).fill(f) });
    const m = await medirChoques(archivo);
    for (let i = 0; i < base.length; i += 1) {
      if (elegido[i] === 1 && m[i] <= base[i]) elegido[i] = f;
    }
  }

  resultado[doc.destino] = elegido;
  console.log('  factor por figura: ' + elegido.map((f) => f.toFixed(2)).join(' '));
}

/* Comprobación final: se construye con lo elegido y se vuelve a medir. */
await construirCon(resultado);
console.log('\n── COMPROBACIÓN ──');
let totalBase = 0;
let totalFinal = 0;
for (const doc of DOCUMENTOS) {
  const m = await medirChoques(path.join(raíz, doc.destino));
  totalFinal += m.reduce((a, b) => a + b, 0);
}
await construirCon(Object.fromEntries(DOCUMENTOS.map((d) => [d.destino, []])));
for (const doc of DOCUMENTOS) {
  const m = await medirChoques(path.join(raíz, doc.destino));
  totalBase += m.reduce((a, b) => a + b, 0);
}
await construirCon(resultado);

console.log(`  solapamientos de origen: ${totalBase}`);
console.log(`  solapamientos tras calibrar: ${totalFinal}`);
console.log(
  totalFinal <= totalBase
    ? '  ✓ no se añadió ninguno'
    : `  ✗ se añadieron ${totalFinal - totalBase} — revisa FACTORES`,
);

if (previo && totalFinal > totalBase) {
  fs.writeFileSync(rutaEscalas, previo);
  console.log('  escalas anteriores restauradas');
}

await navegador.close();
