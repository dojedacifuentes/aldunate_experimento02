/**
 * Gráficos del Informe 02, edición de decisiones.
 *
 * El gráfico maestro enfrenta, para cada función pedagógica, lo que sabemos del
 * problema con lo que sabemos de la respuesta, en la misma escala de cero a cinco.
 * Cada capítulo de función lleva además su propia versión, con esa función
 * destacada y las otras cinco en gris de referencia.
 *
 *   node figuras-funciones.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderizar, COLOR, ANCHO_CAJA } from './graficos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const F = JSON.parse(fs.readFileSync(path.join(aqui, 'puntaje', 'funciones-pedagogicas.json'), 'utf8'));

const C_DIAG = '#2a78d6';
const C_RESP = '#eda100';
const C_APAGADO_DIAG = '#cfd9e6';
const C_APAGADO_RESP = '#e8e0c8';

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const un = (v) => String(v).replace('.', ',');

/** Barra redondeada horizontal; devuelve cadena vacía si no hay ancho. */
function barra(x0, y, ancho, alto, color, r = 3) {
  const w = Math.max(0, ancho);
  if (w <= 0.5) return '';
  const rr = Math.min(r, w / 2, alto / 2);
  return `<path d="M${x0} ${y + rr} a${rr} ${rr} 0 0 1 ${rr} ${-rr} h${w - rr} a${rr} ${rr} 0 0 1 ${rr} ${rr} v${alto - 2 * rr} a${rr} ${rr} 0 0 1 ${-rr} ${rr} h${-(w - rr)} a${rr} ${rr} 0 0 1 ${-rr} ${-rr} Z" fill="${color}"/>`;
}

/**
 * Gráfico de brecha. `destacada` es el id de la función que va en color;
 * si es null, todas van en color.
 */
function brecha(destacada, opciones = {}) {
  const ancho = ANCHO_CAJA;
  const izq = 176;
  const der = 54;
  const filaAlto = 46;
  const grosor = 15;
  const sep = 3;
  const top = 42;
  const w = ancho - izq - der;
  const x = (v) => izq + (w * v) / 5;

  let cuerpo = '';

  // Leyenda
  cuerpo += barra(izq, 12, 13, 11, C_DIAG, 2);
  cuerpo += `<text x="${izq + 19}" y="${21}" font-size="11" fill="${COLOR.tinta2}">Lo que sabemos del problema</text>`;
  cuerpo += barra(izq + 196, 12, 13, 11, C_RESP, 2);
  cuerpo += `<text x="${izq + 215}" y="${21}" font-size="11" fill="${COLOR.tinta2}">Lo que sabemos de la respuesta</text>`;

  // Rejilla vertical
  for (let m = 0; m <= 5; m++) {
    cuerpo += `<line x1="${x(m)}" y1="${top - 6}" x2="${x(m)}" y2="${top + F.funciones.length * filaAlto - 8}" stroke="${m === 0 ? COLOR.eje : COLOR.grilla}" stroke-width="1"/>`;
    cuerpo += `<text x="${x(m)}" y="${top + F.funciones.length * filaAlto + 8}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="middle">${m}</text>`;
  }

  F.funciones.forEach((f, i) => {
    const y0 = top + i * filaAlto;
    const activa = !destacada || f.id === destacada;
    const cd = activa ? C_DIAG : C_APAGADO_DIAG;
    const cr = activa ? C_RESP : C_APAGADO_RESP;
    const tinta = activa ? COLOR.tinta : COLOR.tenue;

    cuerpo += `<text x="${izq - 12}" y="${y0 + grosor + 2}" font-size="12" fill="${tinta}" text-anchor="end"${activa && destacada ? ' font-weight="600"' : ''}>${esc(f.nombre)}</text>`;

    const d = f.diagnostico.nivel;
    const r = f.respuesta.nivel;

    cuerpo += barra(izq, y0, x(d) - izq, grosor, cd);
    cuerpo += `<text x="${x(d) + 6}" y="${y0 + grosor - 3}" font-size="11" fill="${tinta}">${un(d)}</text>`;

    const y1 = y0 + grosor + sep;
    if (r === 0) {
      cuerpo += `<text x="${izq + 3}" y="${y1 + grosor - 3}" font-size="11" fill="${activa ? COLOR.tinta2 : COLOR.tenue}">sin respuesta identificada</text>`;
    } else {
      cuerpo += barra(izq, y1, x(r) - izq, grosor, cr);
      cuerpo += `<text x="${x(r) + 6}" y="${y1 + grosor - 3}" font-size="11" fill="${tinta}">${un(r)}</text>`;
    }
  });

  const alto = top + F.funciones.length * filaAlto + 20;
  const pie = opciones.pie || 'Escala de nivel demostrativo, de 0 a 5. Mide qué acredita la mejor fuente disponible, no la calidad de la institución.';
  const altoTotal = alto + 16;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${altoTotal}" viewBox="0 0 ${ancho} ${altoTotal}" font-family="'Segoe UI', Calibri, Arial, sans-serif"><rect width="${ancho}" height="${altoTotal}" fill="#fff"/>${cuerpo}<text x="0" y="${altoTotal - 4}" font-size="10" fill="${COLOR.tenue}">${esc(pie)}</text></svg>`;
  return { svg, ancho, alto: altoTotal };
}

/** Barras horizontales simples, para las figuras de evidencia. */
function simple(filas, o = {}) {
  const ancho = ANCHO_CAJA;
  const izq = o.izq || 200;
  const der = o.der || 56;
  const filaAlto = o.filaAlto || 30;
  const grosor = o.grosor || 16;
  const maximo = o.maximo || Math.max(...filas.map((f) => f.valor)) * 1.12;
  const top = 10;
  const w = ancho - izq - der;
  const x = (v) => izq + (w * Math.max(0, v)) / maximo;
  let cuerpo = `<line x1="${izq}" y1="${top - 4}" x2="${izq}" y2="${top + filas.length * filaAlto - 6}" stroke="${COLOR.eje}"/>`;
  filas.forEach((f, i) => {
    const y0 = top + i * filaAlto;
    const color = f.color || COLOR.serie;
    cuerpo += `<text x="${izq - 10}" y="${y0 + grosor - 2}" font-size="11.5" fill="${COLOR.tinta}" text-anchor="end">${esc(f.etiqueta)}</text>`;
    cuerpo += barra(izq, y0, x(f.valor) - izq, grosor, color);
    cuerpo += `<text x="${x(f.valor) + 6}" y="${y0 + grosor - 3}" font-size="11" fill="${COLOR.tinta2}">${esc(f.texto ?? un(f.valor))}</text>`;
  });
  const alto = top + filas.length * filaAlto + 18;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" font-family="'Segoe UI', Calibri, Arial, sans-serif"><rect width="${ancho}" height="${alto}" fill="#fff"/>${cuerpo}<text x="0" y="${alto - 4}" font-size="10" fill="${COLOR.tenue}">${esc(o.pie || '')}</text></svg>`;
  return { svg, ancho, alto };
}

const graficos = [];

// Maestro y una versión por capítulo de función
graficos.push({ id: 'g01-brecha', ...brecha(null) });
for (const f of F.funciones) {
  graficos.push({ id: `b${String(f.orden).padStart(2, '0')}-${f.id}`, ...brecha(f.id) });
}

// Figuras de evidencia
graficos.push({
  id: 'e01-evaluacion',
  ...simple(
    [
      { etiqueta: 'Entregas generadas sin detectar', valor: 94, texto: '94 %', color: COLOR.categorica[1] },
      { etiqueta: 'Entregas detectadas', valor: 6, texto: '6 %', color: COLOR.gris },
    ],
    { maximo: 100, pie: 'Scarfe, Watcham, Clarke y Roesch, PLOS ONE 19(6): e0305354 (2024). Examen real, sin aviso a los correctores.' }
  ),
});

graficos.push({
  id: 'e02-detectores',
  ...simple(
    [
      { etiqueta: 'Textos de hablantes no nativos', valor: 61.3, texto: '61,3 %', color: COLOR.categorica[1] },
    ],
    { maximo: 100, pie: 'Falsos positivos medios en siete detectores. Estudio de Stanford (2023).' }
  ),
});

graficos.push({
  id: 'e03-ensayos',
  ...simple(
    [
      { etiqueta: 'Tutor con andamiaje (Harvard)', valor: 2, texto: 'ganancias duplicadas', color: COLOR.categorica[2] },
      { etiqueta: 'Acceso libre sin diseño (Turquía)', valor: 1, texto: 'por debajo del inicio', color: COLOR.categorica[1] },
    ],
    { maximo: 2.6, izq: 216, der: 150, pie: 'Los dos ensayos aleatorizados de 2025. La misma tecnología, resultados opuestos según el diseño de la tarea.' }
  ),
});

graficos.push({
  id: 'e04-calibracion',
  ...simple(
    [
      { etiqueta: 'Lo que predijeron antes', valor: 24, texto: '24 % más rápidos', color: COLOR.ordinal.bajo },
      { etiqueta: 'Lo que recordaron después', valor: 20, texto: '20 % más rápidos', color: COLOR.ordinal.medio },
      { etiqueta: 'Lo que midió el cronómetro', valor: 19, texto: '19 % más lentos', color: COLOR.categorica[1] },
    ],
    { maximo: 28, izq: 196, der: 130, pie: 'METR (2025). Dieciséis desarrolladores expertos, 246 tareas reales en sus propios repositorios.' }
  ),
});

graficos.push({
  id: 'e05-alucinaciones',
  ...simple(
    [
      { etiqueta: 'Lexis+ AI', valor: 17, texto: '17 %', color: COLOR.ordinal.bajo },
      { etiqueta: 'Westlaw AI-Assisted Research', valor: 33, texto: '33 %', color: COLOR.ordinal.medio },
      { etiqueta: 'GPT-4 sin recuperación jurídica', valor: 43, texto: '43 %', color: COLOR.categorica[1] },
    ],
    { maximo: 50, pie: 'Consultas con contenido inventado. Magesh, Surani, Dahl, Suzgun, Manning y Ho, Journal of Empirical Legal Studies.' }
  ),
});

graficos.push({
  id: 'e06-citas',
  ...simple(
    [
      { etiqueta: 'Enero de 2026', valor: 1200, texto: '1.200', color: COLOR.ordinal.bajo },
      { etiqueta: 'Julio de 2026', valor: 1668, texto: '1.668', color: COLOR.ordinal.medio },
      { etiqueta: '28 de agosto de 2026', valor: 1981, texto: '1.981', color: COLOR.ordinal.alto },
    ],
    { maximo: 2200, izq: 170, pie: 'Resoluciones en que un tribunal constató uso de contenido inventado. Base de Charlotin, Smart Law Hub de HEC Paris. Es un mínimo.' }
  ),
});

graficos.push({
  id: 'e07-empleo',
  ...simple(
    [
      { etiqueta: 'Jóvenes de 22 a 25 años', valor: 19, texto: '19 % por debajo', color: COLOR.categorica[1] },
      { etiqueta: 'Trabajadores experimentados', valor: 0.4, texto: 'sin brecha comparable', color: COLOR.gris },
    ],
    { maximo: 24, izq: 196, der: 140, pie: 'Ocupaciones expuestas a inteligencia artificial, frente a pares menos expuestos. Brynjolfsson, Chandar y Chen, Stanford Digital Economy Lab, agosto de 2026.' }
  ),
});

graficos.push({
  id: 'e08-docentes',
  ...simple(
    [
      { etiqueta: 'Preocupado por el criterio de sus estudiantes', valor: 83, texto: '83 %', color: COLOR.categorica[1] },
      { etiqueta: 'Percibe falta de claridad institucional', valor: 80, texto: '80 %', color: COLOR.categorica[1] },
      { etiqueta: 'Participó en el diseño de la política', valor: 31, texto: '31 %', color: COLOR.ordinal.bajo },
      { etiqueta: 'Se sitúa en nivel avanzado o experto', valor: 17, texto: '17 %', color: COLOR.ordinal.bajo },
    ],
    { maximo: 100, izq: 268, pie: 'Digital Education Council, oleada 2025: 1.681 docentes de 52 instituciones en 28 países.' }
  ),
});

const carpeta = path.join(aqui, 'figuras', 'informe-02b');
const ids = await renderizar(graficos, carpeta, 3);
console.log(`${ids.length} figuras en figuras/informe-02b/`);
console.log(ids.join('  '));
