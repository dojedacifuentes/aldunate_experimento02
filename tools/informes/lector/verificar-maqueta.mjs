import fs from 'node:fs';
import { chromium } from 'playwright-core';
const CAND = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const b = await chromium.launch({ executablePath: CAND.find((c) => fs.existsSync(c)) });
const p = await b.newPage();
await p.setViewportSize({ width: 605, height: 1000 });
await p.goto('file:///' + process.argv[2], { waitUntil: 'networkidle', timeout: 180000 });
await p.evaluate(() => document.fonts.ready);
await p.emulateMedia({ media: 'print' });
await p.waitForTimeout(1500);

const r = await p.evaluate(() => {
  const mm = (v) => +(v / (96 / 25.4)).toFixed(1);
  const CAJA = 160;

  /* Una palabra partida se detecta contando cajas de línea: si una celda
     produce más líneas que palabras tiene, alguna palabra se rompió. */
  const partidas = [];
  for (const c of document.querySelectorAll('th, td')) {
    const t = (c.textContent || '').trim();
    if (!t || c.querySelector('*')) continue;
    if (c.classList.contains('srcurl') || /https?:|\.(cl|com|org)\//.test(t)) continue; /* una URL sin espacios sí debe partirse */
    const nodo = c.firstChild;
    if (!nodo || nodo.nodeType !== 3) continue;
    const rango = document.createRange();
    rango.selectNodeContents(c);
    const líneas = rango.getClientRects().length;
    const palabras = t.split(/\s+/).length;
    if (líneas > palabras) partidas.push({ t: t.slice(0, 30), líneas, palabras });
  }

  const tablas = [...document.querySelectorAll('table')].map((t, i) => {
    let estrecha = 999;
    for (const c of t.querySelectorAll('td, th')) estrecha = Math.min(estrecha, mm(c.getBoundingClientRect().width));
    return { i, ancho: mm(t.getBoundingClientRect().width), estrecha };
  });

  /* Rótulos que se salen de su columna y se meten bajo la barra siguiente. */
  const choques = [];
  for (const svg of document.querySelectorAll('svg')) {
    const textos = [...svg.querySelectorAll('text')];
    const rects = [...svg.querySelectorAll('rect')];
    for (const t of textos) {
      const a = t.getBoundingClientRect();
      if (a.width < 30) continue;
      for (const rc of rects) {
        const c = rc.getBoundingClientRect();
        if (c.width < 20) continue;
        const solapa = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const alto = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        /* Un rótulo contenido entero dentro de un rectángulo es la etiqueta
           de ese rectángulo —una tarjeta, una banda— y no un choque. Choca el
           que se mete sólo a medias. */
        const dentro = a.left >= c.left - 1 && a.right <= c.right + 1;
        if (!dentro && solapa > 8 && alto > 3 && !rc.hasAttribute('data-fondo') && rc.getAttribute('opacity') !== '0.75' && !/rect/.test(rc.getAttribute('class') || '')) {
          choques.push({ t: (t.textContent || '').slice(0, 34), solapa: Math.round(solapa) });
          break;
        }
      }
    }
  }

  const secciones = [...document.querySelectorAll('.page')].map((e) => mm(e.getBoundingClientRect().height));
  return {
    partidas,
    excede: tablas.filter((t) => t.ancho > CAJA + 0.5),
    estrechas: tablas.filter((t) => t.estrecha < 8),
    choques,
    contenido: Math.round(secciones.reduce((a, h) => a + h, 0) / 245),
    paginas: secciones.reduce((a, h) => a + Math.ceil(h / 245), 0),
  };
});

const ok = (n, s) => console.log(`${n === 0 ? '✓' : '✗'} ${s}: ${n}`);
ok(r.partidas.length, 'celdas con una palabra partida');
for (const x of r.partidas.slice(0, 8)) console.log(`    «${x.t}» ${x.palabras} palabras en ${x.líneas} líneas`);
ok(r.excede.length, 'tablas que se salen de la caja de 160 mm');
ok(r.estrechas.length, 'tablas con una columna bajo 10 mm');
for (const x of r.estrechas) console.log(`    tabla ${x.i}: ${x.estrecha} mm`);
ok(r.choques.length, 'rótulos de figura que pisan una barra');
for (const x of r.choques.slice(0, 6)) console.log(`    «${x.t}» solapa ${x.solapa} px`);
console.log(`· contenido ${r.contenido} páginas · impresas ${r.paginas}`);
await b.close();
