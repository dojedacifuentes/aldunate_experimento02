// Compone en una sola imagen todos los PNG de una carpeta de figuras, con su id, para revisarlos a la vista.
//   node hoja-figuras.mjs <carpeta-figuras> <salida.png> [columnas=2]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const [carpetaArg, salidaArg, colsArg = '2'] = process.argv.slice(2);
const carpeta = path.resolve(carpetaArg);
const salida = path.resolve(salidaArg);
const cols = Number(colsArg);
const pngs = fs.readdirSync(carpeta).filter((f) => f.endsWith('.png')).sort();
const celdas = pngs.map((f) => {
  const med = JSON.parse(fs.readFileSync(path.join(carpeta, f.replace(/\.png$/, '.json')), 'utf8'));
  const data = fs.readFileSync(path.join(carpeta, f)).toString('base64');
  return `<figure style="margin:0;background:#fff;padding:10px;border:1px solid #ccc"><figcaption style="font:bold 13px sans-serif;color:#b00;margin-bottom:6px">${f.replace(/\.png$/, '')}</figcaption><img src="data:image/png;base64,${data}" width="${med.ancho}" height="${med.alto}"></figure>`;
});
const html = `<html><body style="margin:0;background:#888"><div style="display:grid;grid-template-columns:repeat(${cols},608px);gap:10px;padding:10px;align-items:start">${celdas.join('')}</div></body></html>`;
const nav = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const pag = await nav.newPage({ viewport: { width: cols * 618 + 10, height: 800 }, deviceScaleFactor: 1 });
await pag.setContent(html);
await pag.screenshot({ path: salida, fullPage: true });
await nav.close();
console.log(`${pngs.length} figuras en ${salida}`);
