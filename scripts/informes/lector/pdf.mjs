/**
 * Imprime a PDF los documentos publicados, desde el mismo HTML que se lee.
 *
 * Es la pieza que garantiza que el PDF y la web no puedan divergir: no hay un
 * segundo original en Word ni una exportación aparte, sólo este HTML impreso
 * por un navegador con la hoja de `impresion.css` aplicada.
 *
 *   node scripts/informes/lector/pdf.mjs
 *
 * `printBackground` va en `true` a propósito, pero la hoja de impresión está
 * escrita para no depender de ello: la portada de papel es tinta sobre blanco
 * y los siete estados de la matriz se distinguen por su filete, no por su
 * relleno. Una impresión doméstica con los fondos desactivados —que es como
 * se produjo el PDF que se publicó el 06-09-2026— seguía dejando el título de
 * portada en blanco sobre blanco.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

import { DOCUMENTOS } from './documentos.mjs';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..');

/** Chrome del sistema: no se descarga un navegador para imprimir un PDF. */
const CANDIDATOS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

const navegadorEnDisco = CANDIDATOS.find((c) => fs.existsSync(c));
if (!navegadorEnDisco) {
  console.error(
    '✗ No se encontró Chrome ni Edge. El PDF se imprime con el navegador del sistema.',
  );
  process.exit(1);
}

const navegador = await chromium.launch({ executablePath: navegadorEnDisco });

let fallos = 0;

for (const doc of DOCUMENTOS) {
  const html = path.join(raíz, doc.destino);
  const pdf = html.replace(/\.html$/, '.pdf');

  if (!fs.existsSync(html)) {
    console.error(`✗ falta ${doc.destino} — ejecuta antes construir.mjs`);
    fallos += 1;
    continue;
  }

  const pág = await navegador.newPage();
  await pág.goto('file:///' + html.split(path.sep).join('/'), {
    waitUntil: 'networkidle',
    timeout: 180000,
  });

  /* Las fuentes de Google llegan por red y el texto se mide con ellas: sin
     esta espera, el PDF sale maquetado con la fuente de reserva. */
  await pág.evaluate(() => document.fonts.ready);
  await pág.waitForTimeout(1200);

  await pág.pdf({
    path: pdf,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });

  await pág.close();

  const kb = Math.round(fs.statSync(pdf).size / 1024);
  console.log(`✓ ${path.relative(raíz, pdf).split(path.sep).join('/')} · ${kb} KB`);
}

await navegador.close();
process.exit(fallos > 0 ? 1 : 0);
