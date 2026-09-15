// Renderiza paginas de un PDF a PNG con pdf.js dentro de Edge, para revisarlas a la vista.
// Uso: node pdf-a-png.mjs <archivo.pdf> <carpeta-salida> [paginas: "1-3,7" | "todas"] [escala] [--hoja N]
//   --hoja N  compone ademas una hoja de contactos con N paginas por fila.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const pdf = path.resolve(args[0]);
const salida = path.resolve(args[1]);
const paginas = args[2] || 'todas';
const escala = Number(args[3] || '1.4');
const hojaIdx = args.indexOf('--hoja');
const porFila = hojaIdx >= 0 ? Number(args[hojaIdx + 1]) : 0;
fs.mkdirSync(salida, { recursive: true });

const tipos = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.pdf': 'application/pdf', '.html': 'text/html' };
const servidor = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/doc.pdf') { res.writeHead(200, { 'Content-Type': 'application/pdf' }); return fs.createReadStream(pdf).pipe(res); }
  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(`<!doctype html><html><body><script type="module">
      import * as pdfjs from '/node_modules/pdfjs-dist/build/pdf.min.mjs';
      pdfjs.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
      window.renderizar = async (lista, escala) => {
        const doc = await pdfjs.getDocument({ url: '/doc.pdf' }).promise;
        const n = doc.numPages;
        const pags = lista === 'todas' ? Array.from({ length: n }, (_, i) => i + 1) : lista;
        const out = [];
        for (const k of pags) {
          if (k < 1 || k > n) continue;
          const p = await doc.getPage(k);
          const vp = p.getViewport({ scale: escala });
          const c = document.createElement('canvas');
          c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
          const cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
          await p.render({ canvasContext: cx, viewport: vp }).promise;
          out.push({ k, url: c.toDataURL('image/png'), w: c.width, h: c.height });
        }
        return { n, out };
      };
      window.listo = true;
    </script></body></html>`);
  }
  const archivo = path.join(aqui, url);
  if (!archivo.startsWith(aqui) || !fs.existsSync(archivo)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': tipos[path.extname(archivo)] || 'application/octet-stream' });
  fs.createReadStream(archivo).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const puerto = servidor.address().port;

function parsear(txt) {
  if (txt === 'todas') return 'todas';
  const r = [];
  for (const parte of txt.split(',')) {
    const [a, b] = parte.split('-').map(Number);
    for (let i = a; i <= (b || a); i++) r.push(i);
  }
  return r;
}

const nav = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const pag = await nav.newPage();
await pag.goto(`http://127.0.0.1:${puerto}/`);
await pag.waitForFunction('window.listo === true', null, { timeout: 60000 });
const { n, out } = await pag.evaluate(([l, e]) => window.renderizar(l, e), [parsear(paginas), escala]);
for (const o of out) {
  fs.writeFileSync(path.join(salida, `pag-${String(o.k).padStart(3, '0')}.png`), Buffer.from(o.url.split(',')[1], 'base64'));
}
console.log(`paginas_pdf=${n} renderizadas=${out.length}`);

if (porFila > 0 && out.length) {
  const w = out[0].w, h = out[0].h;
  const filas = Math.ceil(out.length / porFila);
  const html = `<html><body style="margin:0;background:#999"><div style="display:grid;grid-template-columns:repeat(${porFila},${w}px);gap:8px;padding:8px">${out.map((o) => `<div style="position:relative"><img src="${o.url}" width="${w}" height="${h}"><span style="position:absolute;top:4px;left:6px;font:bold 28px sans-serif;color:#c00">${o.k}</span></div>`).join('')}</div></body></html>`;
  await pag.setViewportSize({ width: porFila * (w + 8) + 8, height: filas * (h + 8) + 8 });
  await pag.setContent(html);
  await pag.screenshot({ path: path.join(salida, 'hoja-contactos.png'), fullPage: true });
  console.log('hoja-contactos.png');
}
await nav.close();
servidor.close();
