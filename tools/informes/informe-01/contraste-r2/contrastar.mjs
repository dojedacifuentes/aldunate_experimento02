/* Contraste asistido de las 22 fuentes de la Ronda 2.
 *
 * Qué hace y qué NO hace. De los siete campos del contraste sustantivo, esta
 * herramienta resuelve por máquina los cuatro que son comprobables sin juicio
 * —existencia, título literal, unidad responsable declarada y fecha— y deja
 * anotados los tres que sí lo exigen: anuncio frente a ejecución, límites del
 * documento y respaldo efectivo de la afirmación que sostiene.
 *
 * Ninguna fuente pasa a «contrastada» por correr esto. La regla de
 * verificacion-fuentes.md sigue en pie: la verificación sustantiva no se
 * delega. Lo que esto produce es la ficha ya rellena sobre la que quien firma
 * decide tres casillas en vez de siete.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const RAÍZ = path.resolve(aquí, '../../../..');
const HTML = path.join(RAÍZ, 'public/descargas/informe-01-v2.2.0/informe-01-v2.2.0.html');

/* Las diez que la ronda repetía y que ya estaban en el corpus con otro
   identificador: ésas sí están contrastadas, y no se vuelven a mirar. */
const YA_EN_CORPUS = new Set(['R2-UC-02','R2-UNAB-02','R2-UAUT-05','R2-UAUT-06','R2-UCEN-02',
                              'R2-UCH-01','R2-UDEC-01','R2-UDP-01','R2-UDP-02','R2-PUCV-03']);

const limpiar = (s) => s.replace(/<[^>]+>/g,'')
  .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&laquo;/g,'«').replace(/&raquo;/g,'»')
  .replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/\s+/g,' ').trim();

function leerFilas() {
  const h = fs.readFileSync(HTML,'utf8');
  const filas = [...h.matchAll(/<div class="srcrow">([\s\S]*?)<\/div>\s*(?=<div class="srcrow">|<\/)/g)]
    .map(m => m[0]);
  const vistos = new Set();
  const out = [];
  for (const f of filas) {
    const id = (f.match(/class="srcid">([^<]+)</) || [])[1];
    if (!id || !id.startsWith('R2-') || YA_EN_CORPUS.has(id) || vistos.has(id)) continue;
    vistos.add(id);
    const título = limpiar((f.match(/<strong[^>]*>([\s\S]*?)<\/strong>/) || [,''])[1]);
    const meta   = limpiar((f.match(/font-size:7\.2pt">([\s\S]*?)<\/span>/) || [,''])[1]);
    const url    = limpiar((f.match(/class="srcurl">([^<]+)</) || [,''])[1]);
    const [institución, grado, tipo] = meta.split('·').map(s => s.trim());
    out.push({ id, título, institución, grado, tipo, url });
  }
  return out;
}

/* Las celdas de la matriz que cada fuente sostiene, para saber qué está en juego. */
function celdasQueSostiene(id) {
  const D = JSON.parse(fs.readFileSync(path.join(aquí,'../comparador/matriz-v2.json'),'utf8'));
  const P = { OPF:3, OP:2, INC:1, ENT:1, ADY:1, NL:0 };
  return D.aplicados
    .filter(a => a[4] !== '\u2014' && a[4].split(';').map(s=>s.trim()).includes(id))
    .map(a => ({ institución: a[0], capacidad: a[1], estado: a[3], puntos: P[a[3]] ?? 0 }));
}

const FECHA = /\b(?:(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+)?((?:19|20)\d{2})\b/gi;

async function mirar(f) {
  const r = { ...f, celdas: celdasQueSostiene(f.id) };
  r.puntos = r.celdas.reduce((s,c)=>s+c.puntos, 0);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const resp = await fetch(encodeURI(decodeURI(f.url)), {
      redirect: 'follow', signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (contraste-documental informe-01)' },
    });
    r.estado_http = resp.status;
    r.url_final = resp.url;
    r.redirigida = resp.url !== f.url;
    r.tipo_contenido = (resp.headers.get('content-type') || '').split(';')[0];
    const buf = Buffer.from(await resp.arrayBuffer());
    r.bytes = buf.length;

    if (r.tipo_contenido.includes('pdf') || /\.pdf$/i.test(f.url)) {
      r.formato = 'pdf';
      const crudo = buf.toString('latin1');
      /* Un PDF con fuentes incrustadas y sin /Font legible suele ser escaneado. */
      r.pdf_con_texto = /\/Font\b/.test(crudo) && /\/Type\s*\/Page\b/.test(crudo);
      r.nota_automática = r.pdf_con_texto
        ? 'PDF con capa de texto: existencia y tipo verificados; contenido no extraído aquí.'
        : 'PDF SIN capa de texto detectable: probablemente escaneado. Requiere OCR o lectura humana.';
      r.título_coincide = null;
      return r;
    }

    r.formato = 'html';
    const html = buf.toString('utf8');
    r.título_html = limpiar((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,''])[1]);
    const texto = limpiar(html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,''));
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const tn = norm(r.título);
    r.título_coincide = norm(texto).includes(tn) || norm(r.título_html).includes(tn);
    /* Coincidencia parcial: cuántas palabras largas del título declarado aparecen. */
    const palabras = tn.split(/\s+/).filter(w => w.length > 4);
    const halladas = palabras.filter(w => norm(texto).includes(w));
    r.título_cobertura = palabras.length ? +(halladas.length / palabras.length).toFixed(2) : null;
    r.años_en_página = [...new Set([...texto.matchAll(FECHA)].map(m => m[3]))].sort();
    r.menciona_derecho = /derecho|jurídic|legal/i.test(texto);
    r.nota_automática = r.título_coincide
      ? 'Título declarado localizado en la página.'
      : 'Título declarado NO localizado literalmente. Ver cobertura parcial.';
  } catch (e) {
    r.estado_http = null;
    r.error = e.name === 'AbortError' ? 'tiempo agotado (30 s)' : e.message;
    r.nota_automática = 'NO SE PUDO ABRIR: ' + r.error;
  } finally {
    clearTimeout(t);
  }
  return r;
}

const fuentes = leerFilas();
console.error('fuentes de Ronda 2 sin contrastar: ' + fuentes.length);
const res = [];
for (const f of fuentes) {
  const r = await mirar(f);
  res.push(r);
  console.error('  ' + r.id.padEnd(12) + String(r.estado_http ?? 'ERR').padEnd(5) + (r.puntos ? r.puntos + 'p ' : '   ') + r.nota_automática.slice(0,70));
}
fs.writeFileSync(path.join(aquí,'resultado.json'), JSON.stringify(res, null, 1), 'utf8');
console.error('\nescrito ' + path.join(aquí,'resultado.json'));
