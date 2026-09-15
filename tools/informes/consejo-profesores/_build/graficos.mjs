// Biblioteca de gráficos de barras para documentos impresos (Word/PDF).
// Genera SVG con medidas de página (586 px = ancho de caja de texto a 96 ppp) y los
// rasteriza a PNG con Edge a escala 3. Sin interacción: es papel. La vista en tabla
// de cada gráfico va en los anexos del documento.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

export const ANCHO_CAJA = 586;
const FUENTE = "'Segoe UI', Calibri, Arial, sans-serif";

// Paleta de referencia de la guía dataviz, validada con validate_palette.js sobre fondo blanco:
// categórica de 4 (pasa; contraste bajo en aqua y amarillo -> rótulos directos y tabla en anexo)
// y rampa ordinal de 3 azules (pasa).
/**
 * Un color por institución, estable en todos los gráficos del documento.
 * La barra de una universidad conserva su color aunque cambie el orden de la tabla,
 * de modo que el lector pueda seguir a la misma institución de un gráfico a otro.
 * Paleta cualitativa de once tonos, legible en pantalla y en impresión.
 */
export const COLOR_UNIVERSIDAD = {
  'puc-chile': '#4269d0',
  uchile: '#e45756',
  udp: '#efb118',
  uandes: '#97bbf5',
  uai: '#3ca951',
  unab: '#a463f2',
  udd: '#ff8ab7',
  uautonoma: '#ff725c',
  ucentral: '#6cc5b0',
  udec: '#9c6b4e',
  pucv: '#1c3f94',
  promedio: '#b8b6ae',
};

export const colorDe = (id) => COLOR_UNIVERSIDAD[id] || '#2a78d6';

export const COLOR = {
  serie: '#2a78d6',
  categorica: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
  gris: '#c3c2b7',
  ordinal: { bajo: '#86b6ef', medio: '#2a78d6', alto: '#104281' },
  cero: '#e6e5df',
  tinta: '#1f1f1f',
  tinta2: '#52514e',
  tenue: '#898781',
  grilla: '#e1e0d9',
  eje: '#c3c2b7',
};

export const num = (v, d = 1) => (v === null || v === undefined ? '—' : Number(v).toFixed(d).replace('.', ','));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Estimación conservadora del ancho de texto en Segoe UI.
export const anchoTexto = (t, px) => String(t).length * px * 0.56;

function barraRedondeadaH(x0, y, ancho, alto, color, r = 3) {
  if (ancho <= 0) return '';
  if (ancho <= r) return `<rect x="${x0}" y="${y}" width="${ancho}" height="${alto}" fill="${color}"/>`;
  const x1 = x0 + ancho;
  return `<path d="M${x0},${y} H${x1 - r} Q${x1},${y} ${x1},${y + r} V${y + alto - r} Q${x1},${y + alto} ${x1 - r},${y + alto} H${x0} Z" fill="${color}"/>`;
}

function barraRedondeadaV(x, yBase, ancho, alto, color, r = 3) {
  if (alto <= 0) return '';
  if (alto <= r) return `<rect x="${x}" y="${yBase - alto}" width="${ancho}" height="${alto}" fill="${color}"/>`;
  const y1 = yBase - alto;
  return `<path d="M${x},${yBase} V${y1 + r} Q${x},${y1} ${x + r},${y1} H${x + ancho - r} Q${x + ancho},${y1} ${x + ancho},${y1 + r} V${yBase} Z" fill="${color}"/>`;
}

// Leyenda que salta de línea cuando no cabe en anchoMax.
function leyenda(items, x, y, anchoMax, px = 11) {
  let s = '';
  let cx = x;
  let cy = y;
  let lineas = 1;
  for (const it of items) {
    const w = 15 + anchoTexto(it.nombre, px) + 18;
    if (cx > x && cx + w - 18 > x + anchoMax) { cx = x; cy += 17; lineas += 1; }
    s += `<rect x="${cx}" y="${cy - 9}" width="10" height="10" rx="2" fill="${it.color}"/>`;
    s += `<text x="${cx + 15}" y="${cy}" font-size="${px}" fill="${COLOR.tinta2}">${esc(it.nombre)}</text>`;
    cx += w;
  }
  return { svg: s, alto: lineas * 17 + 1 };
}

function envolver(ancho, alto, cuerpo) {
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" font-family="${FUENTE}"><rect width="${ancho}" height="${alto}" fill="#ffffff"/>${cuerpo}</svg>`,
    ancho,
    alto,
  };
}

/**
 * Barras horizontales. filas: [{ etiqueta, valor, min?, max?, enfasis?, color?, anotacion? }]
 * opciones: { maximo=100, marcas=[0,25,50,75,100], decimales=1, leyenda=[{nombre,color}], notaEje, formatoValor, formatoMarca }
 */
export function barrasH(filas, o = {}) {
  const ancho = o.ancho || ANCHO_CAJA;
  const maximo = o.maximo ?? 100;
  const marcas = o.marcas || [0, 25, 50, 75, 100];
  const px = 12;
  const hayEnfasis = filas.some((f) => f.enfasis);
  const izq = Math.min(o.maxEtiqueta || 250, Math.max(...filas.map((f) => anchoTexto(f.etiqueta, px))) + 14);
  const hayAnot = filas.some((f) => f.anotacion);
  const der = o.derecha ?? (hayAnot ? 120 : 46);
  const fila = o.fila || 26;
  const grosor = o.grosor || 14;
  let cuerpo = '';
  let top = 6;
  if (o.leyenda) {
    const l = leyenda(o.leyenda, izq, top + 10, ancho - izq - 8);
    cuerpo += l.svg;
    top += l.alto + 6;
  }
  const altoPlot = filas.length * fila;
  const w = ancho - izq - der;
  const x = (v) => izq + (w * Math.max(0, Math.min(v, maximo))) / maximo;
  for (const m of marcas) {
    cuerpo += `<line x1="${x(m)}" y1="${top}" x2="${x(m)}" y2="${top + altoPlot}" stroke="${m === 0 ? COLOR.eje : COLOR.grilla}" stroke-width="1"/>`;
    cuerpo += `<text x="${x(m)}" y="${top + altoPlot + 15}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="middle">${esc(o.formatoMarca ? o.formatoMarca(m) : m)}</text>`;
  }
  filas.forEach((f, i) => {
    const y = top + i * fila + (fila - grosor) / 2;
    const color = f.color || (hayEnfasis ? (f.enfasis ? COLOR.serie : COLOR.gris) : COLOR.serie);
    cuerpo += `<text x="${izq - 10}" y="${y + grosor - 2.5}" font-size="${px}" fill="${COLOR.tinta}" text-anchor="end">${esc(f.etiqueta)}</text>`;
    cuerpo += barraRedondeadaH(izq, y, x(f.valor) - izq, grosor, color);
    let fin = x(f.valor);
    if (f.min !== undefined && f.max !== undefined && f.max > f.min) {
      const yc = y + grosor / 2;
      cuerpo += `<line x1="${x(f.min)}" y1="${yc}" x2="${x(f.max)}" y2="${yc}" stroke="${COLOR.tinta2}" stroke-width="1.5"/>`;
      cuerpo += `<line x1="${x(f.min)}" y1="${yc - 5}" x2="${x(f.min)}" y2="${yc + 5}" stroke="${COLOR.tinta2}" stroke-width="1.5"/>`;
      cuerpo += `<line x1="${x(f.max)}" y1="${yc - 5}" x2="${x(f.max)}" y2="${yc + 5}" stroke="${COLOR.tinta2}" stroke-width="1.5"/>`;
      fin = Math.max(fin, x(f.max));
    }
    const valorTxt = o.formatoValor ? o.formatoValor(f) : num(f.valor, o.decimales ?? 1);
    cuerpo += `<text x="${fin + 6}" y="${y + grosor - 2.5}" font-size="11.5" fill="${COLOR.tinta}">${esc(valorTxt)}${f.anotacion ? `<tspan fill="${COLOR.tenue}"> · ${esc(f.anotacion)}</tspan>` : ''}</text>`;
  });
  let alto = top + altoPlot + 22;
  if (o.notaEje) {
    cuerpo += `<text x="${izq + w / 2}" y="${alto + 8}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="middle">${esc(o.notaEje)}</text>`;
    alto += 14;
  }
  return envolver(ancho, alto, cuerpo);
}

/** Columnas verticales. barras: [{ etiqueta, valor, enfasis? }] */
export function columnas(barras, o = {}) {
  const ancho = o.ancho || ANCHO_CAJA;
  const alto = o.alto || 230;
  const maximo = o.maximo ?? Math.max(...barras.map((b) => b.valor)) * 1.15;
  const izq = 34, der = 10, top = 18, abajo = 26;
  const w = ancho - izq - der;
  const h = alto - top - abajo;
  const paso = w / barras.length;
  const grosor = Math.min(o.grosor || 24, paso * 0.6);
  const y = (v) => top + h - (h * v) / maximo;
  const hayEnfasis = barras.some((b) => b.enfasis);
  let cuerpo = '';
  for (const m of o.marcas || []) {
    cuerpo += `<line x1="${izq}" y1="${y(m)}" x2="${ancho - der}" y2="${y(m)}" stroke="${m === 0 ? COLOR.eje : COLOR.grilla}"/>`;
    cuerpo += `<text x="${izq - 6}" y="${y(m) + 4}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="end">${m}</text>`;
  }
  cuerpo += `<line x1="${izq}" y1="${top + h}" x2="${ancho - der}" y2="${top + h}" stroke="${COLOR.eje}"/>`;
  barras.forEach((b, i) => {
    const cx = izq + paso * i + paso / 2;
    const color = b.color || (hayEnfasis ? (b.enfasis ? COLOR.serie : COLOR.gris) : COLOR.serie);
    cuerpo += barraRedondeadaV(cx - grosor / 2, top + h, grosor, top + h - y(b.valor), color);
    if (b.valor > 0 || o.mostrarCeros) cuerpo += `<text x="${cx}" y="${y(b.valor) - 5}" font-size="11.5" fill="${COLOR.tinta}" text-anchor="middle">${esc(o.formatoValor ? o.formatoValor(b) : b.valor)}</text>`;
    cuerpo += `<text x="${cx}" y="${top + h + 17}" font-size="11" fill="${COLOR.tinta2}" text-anchor="middle">${esc(b.etiqueta)}</text>`;
  });
  return envolver(ancho, alto, cuerpo);
}

/**
 * Barras horizontales apiladas por categorías ordenadas.
 * filas: [{ etiqueta, valores: { clave: n } }]; claves: [{ clave, nombre, color, textoClaro? }]
 */
export function apiladas(filas, claves, o = {}) {
  const ancho = o.ancho || ANCHO_CAJA;
  const px = 12;
  const izq = Math.min(230, Math.max(...filas.map((f) => anchoTexto(f.etiqueta, px))) + 14);
  const der = 12;
  const fila = o.fila || 26;
  const grosor = o.grosor || 16;
  const total = o.total ?? Math.max(...filas.map((f) => claves.reduce((s, c) => s + (f.valores[c.clave] || 0), 0)));
  let cuerpo = '';
  let top = 6;
  const l = leyenda(claves.map((c) => ({ nombre: c.nombre, color: c.color })), izq, top + 10, ancho - izq - der);
  cuerpo += l.svg;
  top += l.alto + 8;
  const w = ancho - izq - der;
  filas.forEach((f, i) => {
    const y = top + i * fila + (fila - grosor) / 2;
    cuerpo += `<text x="${izq - 10}" y="${y + grosor - 3}" font-size="${px}" fill="${COLOR.tinta}" text-anchor="end">${esc(f.etiqueta)}</text>`;
    let x = izq;
    for (const c of claves) {
      const n = f.valores[c.clave] || 0;
      if (!n) continue;
      const seg = (w * n) / total;
      const gap = 2;
      cuerpo += `<rect x="${x}" y="${y}" width="${Math.max(0, seg - gap)}" height="${grosor}" fill="${c.color}"/>`;
      if (seg - gap >= 16) {
        cuerpo += `<text x="${x + (seg - gap) / 2}" y="${y + grosor - 4}" font-size="10.5" fill="${c.textoClaro ? '#ffffff' : COLOR.tinta}" text-anchor="middle">${esc(o.formatoSegmento ? o.formatoSegmento(n) : n)}</text>`;
      }
      x += seg;
    }
  });
  return envolver(ancho, top + filas.length * fila + 8, cuerpo);
}

/**
 * Matriz de barras: una fila por entidad y una columna por medida, cada celda con su barra
 * en escala común 0-maximo. Sirve para subíndices por dimensión sin repetir nombres.
 * filas: [{ etiqueta, valores: { colId: n }, enfasis? }]; cols: [{ id, nombre }]
 */
export function matrizBarras(filas, cols, o = {}) {
  const ancho = o.ancho || ANCHO_CAJA;
  const maximo = o.maximo ?? 100;
  const px = 12;
  const izq = Math.min(o.maxEtiqueta || 200, Math.max(...filas.map((f) => anchoTexto(f.etiqueta, px))) + 14);
  const hayEnfasis = filas.some((f) => f.enfasis);
  const anchoCol = (ancho - izq) / cols.length;
  const fila = o.fila || 23;
  const grosor = o.grosor || 11;
  const valorW = 34;
  let cuerpo = '';
  // encabezados en una o dos líneas
  const partir = (t) => {
    if (anchoTexto(t, 11.5) <= anchoCol - 8) return [t];
    const palabras = t.split(' ');
    let a = '';
    let b = '';
    for (const p of palabras) { if (!b && anchoTexto(`${a} ${p}`.trim(), 11.5) <= anchoCol - 8) a = `${a} ${p}`.trim(); else b = `${b} ${p}`.trim(); }
    return b ? [a, b] : [a];
  };
  const encab = cols.map((c) => partir(c.nombre));
  const lineasEnc = Math.max(...encab.map((e) => e.length));
  const top = 8 + lineasEnc * 14 + 6;
  cols.forEach((c, j) => {
    const x0 = izq + j * anchoCol;
    encab[j].forEach((t, k) => {
      cuerpo += `<text x="${x0 + 4}" y="${8 + (k + 1) * 14 - 3}" font-size="11.5" font-weight="600" fill="${COLOR.tinta}">${esc(t)}</text>`;
    });
    cuerpo += `<line x1="${x0}" y1="${top - 2}" x2="${x0}" y2="${top + filas.length * fila}" stroke="${COLOR.eje}"/>`;
  });
  filas.forEach((f, i) => {
    const y = top + i * fila + (fila - grosor) / 2;
    if (i % 2 === 1) cuerpo += `<rect x="0" y="${top + i * fila}" width="${ancho}" height="${fila}" fill="#f7f6f2"/>`;
  });
  filas.forEach((f, i) => {
    const y = top + i * fila + (fila - grosor) / 2;
    cuerpo += `<text x="${izq - 10}" y="${y + grosor - 1.5}" font-size="${px}" fill="${COLOR.tinta}" text-anchor="end">${esc(f.etiqueta)}</text>`;
    cols.forEach((c, j) => {
      const x0 = izq + j * anchoCol + 1;
      const wBarra = anchoCol - valorW - 8;
      const v = f.valores[c.id];
      const color = f.color || (hayEnfasis ? (f.enfasis ? COLOR.serie : COLOR.gris) : COLOR.serie);
      if (v !== null && v !== undefined) {
        cuerpo += barraRedondeadaH(x0, y, (wBarra * Math.max(0, Math.min(v, maximo))) / maximo, grosor, color, 2.5);
        cuerpo += `<text x="${x0 + (wBarra * Math.max(0, Math.min(v, maximo))) / maximo + 5}" y="${y + grosor - 1.5}" font-size="11" fill="${COLOR.tinta}">${esc(o.formatoValor ? o.formatoValor(v) : num(v, o.decimales ?? 0))}</text>`;
      } else {
        cuerpo += `<text x="${x0 + 4}" y="${y + grosor - 1.5}" font-size="11" fill="${COLOR.tenue}">—</text>`;
      }
    });
  });
  let alto = top + filas.length * fila + 6;
  if (o.notaEje) {
    cuerpo += `<text x="${izq}" y="${alto + 10}" font-size="10.5" fill="${COLOR.tenue}">${esc(o.notaEje)}</text>`;
    alto += 16;
  }
  return envolver(ancho, alto, cuerpo);
}

/** Pequeños múltiplos de barras horizontales con escala común. paneles: [{ titulo, filas }] */
export function multiples(paneles, o = {}) {
  const ancho = o.ancho || ANCHO_CAJA;
  const cols = o.columnas || 2;
  const gap = 22;
  const anchoPanel = (ancho - gap * (cols - 1)) / cols;
  const partes = paneles.map((p) => {
    const g = barrasH(p.filas, { ...o, ancho: anchoPanel, leyenda: undefined, notaEje: undefined, fila: o.fila || 22, grosor: o.grosor || 12, maxEtiqueta: o.maxEtiqueta || anchoPanel * 0.42 });
    return { ...g, titulo: p.titulo };
  });
  const filasGrid = Math.ceil(partes.length / cols);
  let cuerpo = '';
  let y = 0;
  for (let r = 0; r < filasGrid; r++) {
    const fila = partes.slice(r * cols, r * cols + cols);
    const altoFila = Math.max(...fila.map((p) => p.alto)) + 24;
    fila.forEach((p, c) => {
      const x = c * (anchoPanel + gap);
      cuerpo += `<text x="${x}" y="${y + 15}" font-size="12.5" font-weight="600" fill="${COLOR.tinta}">${esc(p.titulo)}</text>`;
      cuerpo += `<g transform="translate(${x},${y + 22})">${p.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>`;
    });
    y += altoFila + 8;
  }
  return envolver(ancho, y, cuerpo);
}

/** Columnas agrupadas. grupos: [{ etiqueta, valores: { serieId: n } }]; series: [{ id, nombre, color }] */
export function columnasAgrupadas(grupos, series, o = {}) {
  const ancho = o.ancho || ANCHO_CAJA;
  const alto = o.alto || 260;
  const maximo = o.maximo ?? Math.max(...grupos.flatMap((g) => series.map((s) => g.valores[s.id] ?? 0))) * 1.15;
  const izq = 34, der = 10, abajo = 26;
  let top = 6;
  let cuerpo = '';
  const l = leyenda(series.map((s) => ({ nombre: s.nombre, color: s.color })), izq, top + 10, ancho - izq - der);
  cuerpo += l.svg;
  top += l.alto + 14;
  const w = ancho - izq - der;
  const h = alto - top - abajo;
  const paso = w / grupos.length;
  const grosor = Math.min(o.grosor || 24, (paso * 0.7) / series.length);
  const y = (v) => top + h - (h * v) / maximo;
  for (const m of o.marcas || []) {
    cuerpo += `<line x1="${izq}" y1="${y(m)}" x2="${ancho - der}" y2="${y(m)}" stroke="${m === 0 ? COLOR.eje : COLOR.grilla}"/>`;
    cuerpo += `<text x="${izq - 6}" y="${y(m) + 4}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="end">${esc(o.formatoMarca ? o.formatoMarca(m) : m)}</text>`;
  }
  cuerpo += `<line x1="${izq}" y1="${top + h}" x2="${ancho - der}" y2="${top + h}" stroke="${COLOR.eje}"/>`;
  grupos.forEach((g, i) => {
    const cx = izq + paso * i + paso / 2;
    const total = grosor * series.length + 2 * (series.length - 1);
    series.forEach((s, k) => {
      const v = g.valores[s.id];
      if (v === null || v === undefined) return;
      const x = cx - total / 2 + k * (grosor + 2);
      cuerpo += barraRedondeadaV(x, top + h, grosor, top + h - y(v), s.color);
      cuerpo += `<text x="${x + grosor / 2}" y="${y(v) - 5}" font-size="11" fill="${COLOR.tinta}" text-anchor="middle">${esc(o.formatoValor ? o.formatoValor(v) : v)}</text>`;
    });
    cuerpo += `<text x="${cx}" y="${top + h + 17}" font-size="11" fill="${COLOR.tinta2}" text-anchor="middle">${esc(g.etiqueta)}</text>`;
  });
  return envolver(ancho, alto, cuerpo);
}

/** Barras horizontales divergentes desde cero (azul positivo, rojo negativo). filas: [{ etiqueta, valor }] */
export function barrasDivergentes(filas, o = {}) {
  const ancho = o.ancho || ANCHO_CAJA;
  const px = 12;
  const izq = Math.min(o.maxEtiqueta || 270, Math.max(...filas.map((f) => anchoTexto(f.etiqueta, px))) + 14);
  const der = 52;
  const fila = o.fila || 30;
  const grosor = o.grosor || 14;
  const min = o.minimo ?? Math.min(0, ...filas.map((f) => f.valor)) * 1.4;
  const max = o.maximo ?? Math.max(0, ...filas.map((f) => f.valor)) * 1.1;
  const w = ancho - izq - der;
  const x = (v) => izq + (w * (v - min)) / (max - min);
  const top = 6;
  const altoPlot = filas.length * fila;
  let cuerpo = '';
  for (const m of o.marcas || []) {
    cuerpo += `<line x1="${x(m)}" y1="${top}" x2="${x(m)}" y2="${top + altoPlot}" stroke="${m === 0 ? COLOR.tinta2 : COLOR.grilla}" stroke-width="1"/>`;
    cuerpo += `<text x="${x(m)}" y="${top + altoPlot + 15}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="middle">${esc(o.formatoMarca ? o.formatoMarca(m) : m)}</text>`;
  }
  filas.forEach((f, i) => {
    const y = top + i * fila + (fila - grosor) / 2;
    cuerpo += `<text x="${izq - 10}" y="${y + grosor - 2.5}" font-size="${px}" fill="${COLOR.tinta}" text-anchor="end">${esc(f.etiqueta)}</text>`;
    const x0 = x(0);
    const x1 = x(f.valor);
    const texto = esc(o.formatoValor ? o.formatoValor(f) : num(f.valor, o.decimales ?? 0));
    if (f.valor >= 0) {
      cuerpo += barraRedondeadaH(x0, y, x1 - x0, grosor, COLOR.serie);
      cuerpo += `<text x="${x1 + 6}" y="${y + grosor - 2.5}" font-size="11.5" fill="${COLOR.tinta}">${texto}</text>`;
    } else {
      const ancho1 = x0 - x1;
      const r = Math.min(3, ancho1);
      cuerpo += `<path d="M${x0},${y} H${x1 + r} Q${x1},${y} ${x1},${y + r} V${y + grosor - r} Q${x1},${y + grosor} ${x1 + r},${y + grosor} H${x0} Z" fill="#e34948"/>`;
      cuerpo += `<text x="${x1 - 6}" y="${y + grosor - 2.5}" font-size="11.5" fill="${COLOR.tinta}" text-anchor="end">${texto}</text>`;
    }
  });
  return envolver(ancho, top + altoPlot + 24, cuerpo);
}

/** Rasteriza una lista de gráficos { id, svg, ancho, alto } a PNG + JSON de medidas. */
export async function renderizar(graficos, carpeta, escala = 3) {
  fs.mkdirSync(carpeta, { recursive: true });
  const nav = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const ctx = await nav.newContext({ deviceScaleFactor: escala });
  const pag = await ctx.newPage();
  for (const g of graficos) {
    await pag.setContent(`<html><body style="margin:0;background:#fff">${g.svg}</body></html>`);
    await pag.evaluate(() => document.fonts.ready);
    await (await pag.$('svg')).screenshot({ path: path.join(carpeta, `${g.id}.png`) });
    fs.writeFileSync(path.join(carpeta, `${g.id}.json`), JSON.stringify({ ancho: g.ancho, alto: g.alto }));
    fs.writeFileSync(path.join(carpeta, `${g.id}.svg`), g.svg);
  }
  await nav.close();
  return graficos.map((g) => g.id);
}
