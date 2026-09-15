// metricas-S1.mjs — Métricas de estilo del lote S1 (Eduardo Aldunate Lizana)
//
// Artículos (texto en ./raw):
//   2009-fuerza-normativa.txt        Revista de Derecho PUCV 32 (2009)  — llamadas a nota como [N]
//   2010-neoconstitucionalismo.txt   Revista de Derecho (Valdivia) 23(1) — llamadas como [^N], cursivas ‹…›
//   2010-tratados.txt                Ius et Praxis 16(2)                 — llamadas como [^N], cursivas ‹…›
//
// Qué mide: el CUERPO de cada artículo (desde la primera sección o párrafo de apertura hasta NOTAS).
// Quedan fuera: cabecera y pie de SciELO, título, resúmenes (español e inglés), palabras clave,
// notas y bibliografía. Se descartan los encabezados de sección y subsección.
//
// Dos bloques:
//   A) cuerpo completo, como pide el encargo;
//   B) prosa propia: sin las oraciones cuyo 50 % o más de palabras está dentro de una cita textual
//      de 12 palabras o más (entre "…", “…”, «…» o ‹…›), y sin los ítems de enumeración que terminan
//      en coma, punto y coma, dos puntos o «y». Es una aproximación: las citas sin comillas no se detectan.
//
// Uso:  node metricas-S1.mjs             -> tablas Markdown
//       node metricas-S1.mjs --detalle   -> además: secciones, formas de primera persona, conectores y marcadores
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(AQUI, 'raw');
const DETALLE = process.argv.includes('--detalle');

const ARTICULOS = [
  { id: '2009', corto: 'Fuerza normativa (2009)', archivo: '2009-fuerza-normativa.txt',
    inicio: /^I\. PLANTEAMIENTO DEL PROBLEMA/, cursivas: false },
  { id: '2010n', corto: 'Neoconstitucionalismo (2010)', archivo: '2010-neoconstitucionalismo.txt',
    inicio: /^El término neoconstitucionalismo es uno/, cursivas: true },
  { id: '2010t', corto: 'Tratados (2010)', archivo: '2010-tratados.txt',
    inicio: /^INTRODUCCI[OÓ]N\s*$/, cursivas: true },
];

// ---------------------------------------------------------------- utilidades
const RE_PAL = /[\p{L}\p{N}]+(?:['’\-–—][\p{L}\p{N}]+)*/gu;
const palabras = (s) => s.match(RE_PAL) || [];
const W = (s) => `(?<![\\p{L}\\p{N}])(?:${s})(?![\\p{L}\\p{N}])`;
const cuenta = (t, re) => (t.match(re) || []).length;
const media = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const mediana = (a) => {
  if (!a.length) return NaN;
  const s = [...a].sort((x, y) => x - y);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const pct = (a, f) => (a.length ? (100 * a.filter(f).length) / a.length : NaN);

// ---------------------------------------------------------------- cortes del texto
function partes(texto, cfg) {
  const lineas = texto.replace(/\r/g, '').split('\n');
  const iIni = lineas.findIndex((l) => cfg.inicio.test(l.trim()));
  const iNot = lineas.findIndex((l, i) => i > iIni && /^NOTAS\s*$/.test(l.trim()));
  const iBib = lineas.findIndex((l, i) => i > iNot && /^BIBLIOGRAF/.test(l.trim()));
  if (iIni < 0 || iNot < 0 || iBib < 0) throw new Error(`${cfg.archivo}: cortes no hallados (${iIni}, ${iNot}, ${iBib})`);
  return { cuerpo: lineas.slice(iIni, iNot), notas: lineas.slice(iNot + 1, iBib) };
}

function limpiar(l) {
  return l
    .replace(/\s?\[\^(?:\d+|\*+)\]/g, '') // llamadas [^N]
    .replace(/\s?\[\s?\d+\s?\]/g, '') // llamadas [N]
    .replace(/\s+/g, ' ')
    .trim();
}

function tipoEncabezado(l) {
  const letras = l.replace(/[^\p{L}]/gu, '');
  const mayus = letras.replace(/[^\p{Lu}]/gu, '');
  if (letras.length >= 6 && mayus.length / letras.length > 0.85) return 'seccion';
  if (/^\d+\.\s/.test(l) && palabras(l).length <= 24 && !/[.;:?!]\s+\S/.test(l.replace(/^\d+\.\s+/, ''))) return 'subseccion';
  if (/^[a-z]\)\s*‹[^›]*›\s*$/.test(l)) return 'subseccion';
  return null;
}

function parrafos(lineasCuerpo) {
  const out = [];
  let seccion = '(apertura sin título)';
  for (const bruto of lineasCuerpo) {
    const l = bruto.trim();
    if (!l) continue;
    const tipo = tipoEncabezado(l);
    if (tipo === 'seccion') { seccion = l.replace(/[‹›]/g, ''); continue; }
    if (tipo) continue;
    const t = limpiar(l);
    if (!t) continue;
    // Un salto espurio del HTML deja líneas que empiezan en minúscula: se unen al párrafo anterior.
    if (out.length && /^\p{Ll}/u.test(t) && !/^[a-z]{1,3}\d?\)/.test(t)) out[out.length - 1].texto += ' ' + t;
    else out.push({ texto: t, seccion });
  }
  return out;
}

// ---------------------------------------------------------------- oraciones
const ABREV = new Set(['art', 'arts', 'inc', 'i', 'ii', 'iii', 'p', 'pp', 'cfr', 'cf', 'sr', 'sra', 'dr', 'drs',
  'coord', 'vol', 'cons', 'lit', 'ej', 'c', 's', 'ss', 'cit', 'vid', 'ed', 'núm', 'nro', 'prof', 'profs', 'lic']);
const ABREV_EXACTA = new Set(['No', 'Nº', 'Nos', 'Nºs', 'N']);

function oraciones(t) {
  const cortes = [];
  const re = /[.?!…]+["”»›)\]'’]*(?=\s+[¿¡"“«‹(\[]*\p{Lu})/gu;
  let m;
  while ((m = re.exec(t))) {
    if (m[0][0] === '.' && !m[0].startsWith('..')) {
      const tok = (t.slice(0, m.index).match(/([\p{L}\p{N}º]+)$/u) || ['', ''])[1];
      if (ABREV_EXACTA.has(tok) || ABREV.has(tok.toLowerCase()) || /^\p{Lu}$/u.test(tok)) continue;
    }
    cortes.push(m.index + m[0].length);
  }
  const out = [];
  let ini = 0;
  for (const c of cortes) { out.push([ini, c]); ini = c; }
  out.push([ini, t.length]);
  return out.filter(([a, b]) => t.slice(a, b).trim());
}

// ---------------------------------------------------------------- citas textuales
function rangosCita(t, minPal = 12) {
  const rangos = [];
  const pila = [];
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== '"') continue;
    const p = i > 0 ? t[i - 1] : ' ';
    const n = i + 1 < t.length ? t[i + 1] : ' ';
    const abre = i === 0 || /[\s(\[\/¿¡:—–-]/.test(p);
    const cierra = /[\p{L}\p{N}.,;:?!)\]›…'’]/u.test(p) && (i === t.length - 1 || /[\s.,;:)\]\[?!—–-]/.test(n));
    const cerrar = () => { const a = pila.pop(); if (!pila.length) rangos.push([a, i]); };
    if (abre && !cierra) pila.push(i);
    else if (cierra && !abre) { if (pila.length) cerrar(); }
    else if (pila.length) cerrar();
    else pila.push(i);
  }
  for (const [a, b] of [['“', '”'], ['«', '»'], ['‹', '›']]) {
    for (const m of t.matchAll(new RegExp(`${a}[^${b}]*${b}`, 'g'))) rangos.push([m.index, m.index + m[0].length - 1]);
  }
  return rangos.filter(([a, b]) => palabras(t.slice(a, b + 1)).length >= minPal);
}

// ---------------------------------------------------------------- contadores
function contarRayas(t) {
  let n = 0;
  for (const m of t.matchAll(/[-–—]/g)) {
    const i = m.index;
    const a = i > 0 ? t[i - 1] : ' ';
    const b = i + 1 < t.length ? t[i + 1] : ' ';
    if (/[\p{L}\p{N}]/u.test(a) && /[\p{L}\p{N}]/u.test(b)) continue; // compuesto o rango
    if (/[ivx]\.$/i.test(t.slice(Math.max(0, i - 2), i))) continue; // numeración «i.-»
    if (/[-–—]/.test(a) || /[-–—]/.test(b)) continue;
    n++;
  }
  return n;
}

const P1_SING = ['creo', 'estimo', 'sostengo', 'propongo', 'propondría', 'pienso', 'considero', 'entiendo', 'remito',
  'quedo', 'agradezco', 'insisto', 'comparto', 'discrepo', 'advierto', 'reitero', 'prefiero', 'denomino', 'he',
  'habérmelo', 'mí', 'mi', 'mis', 'mío', 'mía', 'míos', 'mías', 'me', 'conmigo', 'yo'];
const NO_VERBOS_AMOS = new Set(['mismos', 'términos', 'extremos', 'supremos', 'legítimos', 'ilegítimos', 'íntimos',
  'últimos', 'próximos', 'mínimos', 'máximos', 'ramos', 'reclamos', 'ánimos', 'décimos', 'primos', 'óptimos', 'anónimos',
  'sinónimos', 'homónimos', 'préstamos', 'tramos', 'amos', 'gamos', 'remos', 'blasfemos', 'legitimos', 'minimos', 'maximos']);
const RE_P1_SING = new RegExp(W(P1_SING.join('|')), 'giu');
const RE_P1_PLUR_VERBO = /(?<![\p{L}\p{N}])(\p{L}+(?:amos|emos|imos))(?![\p{L}\p{N}])/giu;
const RE_P1_NOS = new RegExp(W('nos|nosotros|nosotras'), 'giu');
const RE_P1_POSES = new RegExp(W('nuestro|nuestra|nuestros|nuestras'), 'giu');
const RE_NO_ES_SINO = new RegExp(W('no') + '\\s+(?:es|son|era|eran|fue|fueron|será|sería|serían|está|están|se trata)(?![\\p{L}])[^.?!]*?' + W('sino'), 'giu');
const RE_NO_SINO = new RegExp(W('no') + '[^.?!]*?' + W('sino'), 'giu');
const RE_Y_NO = new RegExp(W('y\\s+no'), 'giu');
const RE_SINO_QUE = new RegExp(W('sino\\s+que'), 'giu');

function formasP1(t, mapa) {
  const anotar = (clave, forma) => { const k = `${clave}: ${forma.toLowerCase()}`; mapa.set(k, (mapa.get(k) || 0) + 1); };
  let sing = 0, plur = 0, poses = 0;
  for (const m of t.matchAll(RE_P1_SING)) { sing++; anotar('sing', m[0]); }
  for (const m of t.matchAll(RE_P1_PLUR_VERBO)) {
    if (NO_VERBOS_AMOS.has(m[1].toLowerCase())) continue;
    plur++; anotar('plur', m[1]);
  }
  for (const m of t.matchAll(RE_P1_NOS)) { plur++; anotar('plur', m[0]); }
  for (const m of t.matchAll(RE_P1_POSES)) { poses++; anotar('poses', m[0]); }
  return { sing, plur, poses };
}

function conteos(t, mapaP1) {
  const p1 = formasP1(t, mapaP1);
  return {
    palabras: palabras(t).length,
    rayas: contarRayas(t),
    dosPuntos: cuenta(t, /:/g) - cuenta(t, /https?:/g),
    puntoComa: cuenta(t, /;(?!\p{L})/gu), // «;» pegado a una letra es ruido de OCR
    noEsSino: cuenta(t, RE_NO_ES_SINO),
    noSino: cuenta(t, RE_NO_SINO),
    yNo: cuenta(t, RE_Y_NO),
    sinoQue: cuenta(t, RE_SINO_QUE),
    p1sing: p1.sing,
    p1plur: p1.plur,
    p1poses: p1.poses,
    preguntas: cuenta(t, /¿/g),
    exclamaciones: cuenta(t, /¡[^!¡]{1,300}!/g), // exige cierre: el OCR de 2010t convierte «i» en «¡»
    parentesis: cuenta(t, /\(/g),
    cursivas: cuenta(t, /‹[^›]*\p{L}[^›]*›/gu),
  };
}
const sumar = (a, b) => Object.fromEntries(Object.keys(a).map((k) => [k, a[k] + b[k]]));

const CONECTORES = ['sin embargo', 'de este modo', 'dicho de otro modo', 'dicho de otra manera', 'en efecto', 'por lo pronto',
  'por otro lado', 'por otra parte', 'por su parte', 'a su vez', 'en cambio', 'así por ejemplo', 'es así como', 'pues bien',
  'empero', 'con ello', 'por tanto', 'por lo tanto', 'en consecuencia', 'en definitiva', 'en síntesis', 'por último',
  'en primer lugar', 'en segundo lugar', 'a la inversa', 'más bien', 'al menos', 'a lo menos', 'si se quiere',
  'desde el momento en que', 'en la medida en que', 'en cuanto', 'a fin de', 'en vistas a', 'no obstante', 'además',
  'asimismo', 'en este sentido', 'es decir', 'esto es', 'o sea', 'a saber', 'amén de', 'sin más', 'por ejemplo', 'ahora bien',
  'por ende', 'cabe', 'parece', 'puede decirse', 'resulta', 'se sostiene', 'aquí', 'de manera', 'en términos'];
const MARCADORES = ['crucial', 'clave', 'fundamental', 'esencial', 'en resumen', 'en conclusión', 'cabe destacar',
  'cabe señalar', 'es importante', 'vale la pena', 'no solo', 'no sólo', 'sino también', 'finalmente', 'robust\\p{L}*',
  'abord\\p{L}*', 'desaf\\p{L}*', 'herramienta\\p{L}*', 'impacto\\p{L}*', 'en el marco de', 'rol', 'significativ\\p{L}*',
  'fomentar', 'potenciar', 'integral', 'transversal', 'sólo', 'solo', 'éste', 'ésta', 'éstos', 'éstas', 'aquél', 'aquélla'];

// ---------------------------------------------------------------- análisis por artículo
function analizar(cfg) {
  const texto = fs.readFileSync(path.join(RAW, cfg.archivo), 'utf8');
  const { cuerpo, notas } = partes(texto, cfg);
  const pars = parrafos(cuerpo);

  const llamadas = new Set();
  for (const l of cuerpo) for (const m of l.matchAll(/\[\^?\s?(\d+)\s?\]/g)) llamadas.add(+m[1]);
  const notasNum = new Set();
  for (const l of notas) {
    const m = l.trim().match(/^\[(\d+)\]/) || l.trim().match(/^(\d+)[\s;]/);
    if (m) notasNum.add(+m[1]);
  }

  const orTodas = [], orPropias = [], parTodos = [], parPropios = [], unaOracion = [];
  const mapaP1 = new Map(), mapaP1Propio = new Map();
  let cTodo = null, cPropio = null;
  const secciones = new Map();
  let textoTodo = '';

  for (const p of pars) {
    const t = p.texto;
    textoTodo += t + '\n';
    const rangos = rangosCita(t);
    const esItem = /^[a-z]{1,3}\d?\)\s/.test(t) && /(?:[;,:]|\sy|\se)$/.test(t);
    let palPar = 0, palCita = 0, nOr = 0;
    for (const [s, e] of oraciones(t)) {
      let n = 0, enCita = 0;
      for (const m of t.slice(s, e).matchAll(RE_PAL)) {
        n++;
        const pos = s + m.index;
        if (rangos.some(([a, b]) => pos >= a && pos <= b)) enCita++;
      }
      if (!n) continue;
      nOr++;
      orTodas.push(n);
      if (!esItem && enCita / n < 0.5) orPropias.push(n);
      palPar += n; palCita += enCita;
    }
    parTodos.push(palPar);
    unaOracion.push(nOr === 1);
    const propio = !esItem && palCita / Math.max(palPar, 1) < 0.5;
    if (propio) parPropios.push(palPar);
    secciones.set(p.seccion, (secciones.get(p.seccion) || 0) + palPar);

    const c = conteos(t, mapaP1);
    cTodo = cTodo ? sumar(cTodo, c) : c;
    // prosa propia: se blanquean las citas largas y se omiten los ítems de enumeración
    if (!esItem) {
      let tp = t.split('');
      for (const [a, b] of rangos) for (let i = a; i <= b; i++) tp[i] = ' ';
      const cp = conteos(tp.join(''), mapaP1Propio);
      cPropio = cPropio ? sumar(cPropio, cp) : cp;
    }
  }

  const conectores = CONECTORES.map((k) => [k, cuenta(textoTodo, new RegExp(W(k.replace(/ /g, '\\s+')), 'giu'))]);
  const marcadores = MARCADORES.map((k) => [k.replace(/\\p\{L\}\*/g, '…'), cuenta(textoTodo, new RegExp(W(k.replace(/ /g, '\\s+')), 'giu'))]);

  return { cfg, orTodas, orPropias, parTodos, parPropios, unaOracion, cTodo, cPropio, notasNum, llamadas,
    secciones, mapaP1, mapaP1Propio, conectores, marcadores };
}

// ---------------------------------------------------------------- salida
const fmt = (x, d = 1) => (Number.isFinite(x) ? x.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d }) : 'n/d');
const ent = (x) => fmt(x, 0);

const res = ARTICULOS.map(analizar);
const conj = {
  cfg: { corto: 'Conjunto', cursivas: false },
  orTodas: res.flatMap((r) => r.orTodas),
  orPropias: res.flatMap((r) => r.orPropias),
  parTodos: res.flatMap((r) => r.parTodos),
  parPropios: res.flatMap((r) => r.parPropios),
  unaOracion: res.flatMap((r) => r.unaOracion),
  cTodo: res.map((r) => r.cTodo).reduce(sumar),
  cPropio: res.map((r) => r.cPropio).reduce(sumar),
  notasNum: { size: res.reduce((s, r) => s + r.notasNum.size, 0) },
};
const cols = [...res, conj];

function tabla(titulo, filas) {
  const out = [`**${titulo}**`, '', `| Métrica | ${cols.map((c) => c.cfg.corto).join(' | ')} |`, `|---|${cols.map(() => '---:').join('|')}|`];
  for (const [nombre, f] of filas) out.push(`| ${nombre} | ${cols.map(f).join(' | ')} |`);
  return out.join('\n');
}
const por1000 = (c, k) => (c.palabras ? (c[k] * 1000) / c.palabras : NaN);

const filasComunes = (or, par, cc) => [
  ['Palabras', (r) => ent(r[cc].palabras)],
  ['Oraciones', (r) => ent(r[or].length)],
  ['Palabras por oración: media', (r) => fmt(media(r[or]))],
  ['Palabras por oración: mediana', (r) => fmt(mediana(r[or]))],
  ['Oraciones de más de 40 palabras (%)', (r) => fmt(pct(r[or], (n) => n > 40))],
  ['Oraciones de menos de 8 palabras (%)', (r) => fmt(pct(r[or], (n) => n < 8))],
  ['Párrafos', (r) => ent(r[par].length)],
  ['Palabras por párrafo: media', (r) => fmt(media(r[par]))],
  ['Palabras por párrafo: mediana', (r) => fmt(mediana(r[par]))],
  ['Rayas (signos) por 1000 palabras', (r) => fmt(por1000(r[cc], 'rayas'))],
  ['Dos puntos por 1000', (r) => fmt(por1000(r[cc], 'dosPuntos'))],
  ['Punto y coma por 1000', (r) => fmt(por1000(r[cc], 'puntoComa'))],
  ['«no es … sino» por 1000 (estricto: no + ser/estar/se trata)', (r) => fmt(por1000(r[cc], 'noEsSino'), 2)],
  ['«no … sino» por 1000 (amplio, dentro de la oración)', (r) => fmt(por1000(r[cc], 'noSino'), 2)],
  ['«sino que» por 1000', (r) => fmt(por1000(r[cc], 'sinoQue'), 2)],
  ['«y no» por 1000', (r) => fmt(por1000(r[cc], 'yNo'), 2)],
  ['Primera persona por 1000 (total)', (r) => fmt(((r[cc].p1sing + r[cc].p1plur + r[cc].p1poses) * 1000) / r[cc].palabras, 2)],
  ['· singular (verbos y pronombres)', (r) => fmt(por1000(r[cc], 'p1sing'), 2)],
  ['· plural (verbos y «nos»)', (r) => fmt(por1000(r[cc], 'p1plur'), 2)],
  ['· posesivo «nuestro/a/os/as»', (r) => fmt(por1000(r[cc], 'p1poses'), 2)],
  ['Signos de interrogación (¿) por 1000', (r) => fmt(por1000(r[cc], 'preguntas'), 2)],
  ['Exclamaciones por 1000', (r) => fmt(por1000(r[cc], 'exclamaciones'), 2)],
  ['Paréntesis abiertos por 1000', (r) => fmt(por1000(r[cc], 'parentesis'))],
  ['Segmentos en cursiva por 1000', (r) => (r.cfg.cursivas ? fmt(por1000(r[cc], 'cursivas')) : 'n/d')],
];

console.log(tabla('A. Cuerpo completo', [
  ...filasComunes('orTodas', 'parTodos', 'cTodo'),
  ['Párrafos de una sola oración (%)', (r) => fmt(pct(r.unaOracion, (x) => x))],
  ['Notas numeradas', (r) => ent(r.notasNum.size)],
  ['Notas por 1000 palabras de cuerpo', (r) => fmt((r.notasNum.size * 1000) / r.cTodo.palabras)],
]));
console.log('');
console.log(tabla('B. Prosa propia (sin citas textuales de 12 palabras o más ni ítems de enumeración)', filasComunes('orPropias', 'parPropios', 'cPropio')));

if (DETALLE) {
  for (const r of res) {
    console.log(`\n### ${r.cfg.corto}`);
    console.log(`Llamadas a nota distintas en el cuerpo: ${r.llamadas.size}; notas numeradas en la lista: ${r.notasNum.size}`);
    const total = [...r.secciones.values()].reduce((a, b) => a + b, 0);
    console.log('Secciones (palabras, % del cuerpo):');
    for (const [s, n] of r.secciones) console.log(`  ${fmt((100 * n) / total)} %  ${ent(n)}  ${s.slice(0, 90)}`);
    console.log('Primera persona (prosa propia):', [...r.mapaP1Propio].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}×${v}`).join('; ') || 'ninguna');
    console.log('Conectores (cuerpo, conteo bruto):', r.conectores.filter(([, v]) => v).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join('; '));
    console.log('Marcadores (cuerpo, conteo bruto):', r.marcadores.map(([k, v]) => `${k} ${v}`).join('; '));
  }
}
