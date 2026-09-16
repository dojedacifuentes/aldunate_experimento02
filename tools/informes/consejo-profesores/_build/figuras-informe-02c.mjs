/**
 * Figuras del Informe 02, edición reestructurada.
 *
 * Cinco figuras, cada una resuelve una pregunta visual concreta. Paleta de tres
 * tonos como máximo, legible en escala de grises y en impresión.
 *
 *   node figuras-informe-02c.mjs
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderizar, COLOR, ANCHO_CAJA } from './graficos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));

const AZUL = '#1f4e8c';
const AZUL_MEDIO = '#5b8ac4';
const AZUL_CLARO = '#a9c3e0';
const AMBAR = '#c8860d';
const GRIS = '#c3c2b7';
const FUENTE = "'Segoe UI', Calibri, Arial, sans-serif";

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function barra(x0, y, ancho, alto, color, r = 2.5) {
  const w = Math.max(0, ancho);
  if (w <= 0.5) return '';
  const rr = Math.min(r, w / 2, alto / 2);
  return `<path d="M${x0} ${y + rr} a${rr} ${rr} 0 0 1 ${rr} ${-rr} h${w - rr} a${rr} ${rr} 0 0 1 ${rr} ${rr} v${alto - 2 * rr} a${rr} ${rr} 0 0 1 ${-rr} ${rr} h${-(w - rr)} a${rr} ${rr} 0 0 1 ${-rr} ${-rr} Z" fill="${color}"/>`;
}

const envolver = (cuerpo, alto, pie) => {
  const h = alto + (pie ? 16 : 0);
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO_CAJA}" height="${h}" viewBox="0 0 ${ANCHO_CAJA} ${h}" font-family="${FUENTE}"><rect width="${ANCHO_CAJA}" height="${h}" fill="#fff"/>${cuerpo}${pie ? `<text x="0" y="${h - 4}" font-size="10" fill="${COLOR.tenue}">${esc(pie)}</text>` : ''}</svg>`,
    ancho: ANCHO_CAJA,
    alto: h,
  };
};

/* ---------- G1. Adopción: uso general frente a entrega directa ---------- */
function g1() {
  const izq = 84, der = 58, top = 34;
  const w = ANCHO_CAJA - izq - der;
  const x = (v) => izq + (w * v) / 100;
  const datos = [
    { anio: '2024', uso: 53, directa: 3 },
    { anio: '2025', uso: 88, directa: 8 },
    { anio: '2026', uso: 94, directa: 12 },
  ];
  let c = '';
  c += barra(izq, 10, 13, 11, AZUL, 2);
  c += `<text x="${izq + 19}" y="19" font-size="11" fill="${COLOR.tinta2}">Usa IA generativa para trabajos evaluados</text>`;
  c += barra(izq + 262, 10, 13, 11, AMBAR, 2);
  c += `<text x="${izq + 281}" y="19" font-size="11" fill="${COLOR.tinta2}">Entrega texto generado sin modificar</text>`;

  const filaAlto = 54, grosor = 16;
  for (let m = 0; m <= 100; m += 25) {
    const yFin = top + datos.length * filaAlto - 10;
    c += `<line x1="${x(m)}" y1="${top - 4}" x2="${x(m)}" y2="${yFin}" stroke="${m === 0 ? COLOR.eje : COLOR.grilla}"/>`;
    c += `<text x="${x(m)}" y="${yFin + 15}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="middle">${m} %</text>`;
  }
  datos.forEach((d, i) => {
    const y0 = top + i * filaAlto;
    c += `<text x="${izq - 12}" y="${y0 + grosor + 4}" font-size="12.5" fill="${COLOR.tinta}" text-anchor="end">${d.anio}</text>`;
    c += barra(izq, y0, x(d.uso) - izq, grosor, AZUL);
    c += `<text x="${x(d.uso) + 6}" y="${y0 + grosor - 3}" font-size="11" fill="${COLOR.tinta}">${d.uso} %</text>`;
    const y1 = y0 + grosor + 4;
    c += barra(izq, y1, x(d.directa) - izq, grosor, AMBAR);
    c += `<text x="${x(d.directa) + 6}" y="${y1 + grosor - 3}" font-size="11" fill="${COLOR.tinta}">${d.directa} %</text>`;
  });
  return envolver(c, top + datos.length * filaAlto + 14, 'Estudiantes de grado del Reino Unido. Las dos series proceden de la misma encuesta y la misma muestra.');
}

/* ---------- G2. Instrumentos evaluativos, escala ordinal de tres grados ---------- */
function g2() {
  const izq = 262, der = 96, top = 34;
  const w = ANCHO_CAJA - izq - der;
  const paso = w / 3;
  const filas = [
    { n: 'Examen oral', g: 3 },
    { n: 'Defensa de un escrito propio ante preguntas', g: 3 },
    { n: 'Audiencia o alegato simulado', g: 3 },
    { n: 'Control de lectura presencial', g: 3 },
    { n: 'Trabajo escrito con etapas supervisadas', g: 2 },
    { n: 'Informe preparado fuera del aula', g: 1 },
    { n: 'Test de respuesta cerrada en línea', g: 1 },
  ];
  const tono = { 3: AZUL, 2: AZUL_MEDIO, 1: AZUL_CLARO };
  const rotulo = { 3: 'Alta', 2: 'Media', 1: 'Limitada' };
  let c = '';
  c += `<text x="${izq}" y="19" font-size="11" fill="${COLOR.tenue}">Capacidad para verificar desempeño individual</text>`;
  const filaAlto = 27, grosor = 15;
  filas.forEach((f, i) => {
    const y0 = top + i * filaAlto;
    c += `<text x="${izq - 12}" y="${y0 + grosor - 2}" font-size="11.5" fill="${COLOR.tinta}" text-anchor="end">${esc(f.n)}</text>`;
    c += barra(izq, y0, paso * f.g, grosor, tono[f.g]);
    c += `<text x="${izq + paso * f.g + 7}" y="${y0 + grosor - 3}" font-size="11" fill="${COLOR.tinta2}">${rotulo[f.g]}</text>`;
  });
  const yFin = top + filas.length * filaAlto - 8;
  c += `<line x1="${izq}" y1="${top - 4}" x2="${izq}" y2="${yFin}" stroke="${COLOR.eje}"/>`;
  return envolver(c, yFin + 12, 'Tres grados ordinales. La longitud expresa el grado, no una magnitud medida.');
}

/* ---------- G3. Dos experimentos, dos diseños, resultados opuestos ---------- */
function g3() {
  const mitad = ANCHO_CAJA / 2;
  const anchoCaja = mitad - 14;
  const top = 6, altoCaja = 150;
  let c = '';

  const panel = (x0, titulo, diseno, resultado, color, hacia) => {
    let s = `<rect x="${x0}" y="${top}" width="${anchoCaja}" height="${altoCaja}" fill="none" stroke="${COLOR.grilla}" stroke-width="1.2"/>`;
    s += `<text x="${x0 + 14}" y="${top + 24}" font-size="12.5" font-weight="600" fill="${COLOR.tinta}">${esc(titulo)}</text>`;
    s += `<text x="${x0 + 14}" y="${top + 45}" font-size="11" fill="${COLOR.tinta2}">${esc(diseno)}</text>`;
    // flecha
    const cx = x0 + anchoCaja / 2, cy = top + 88;
    if (hacia === 'arriba') {
      s += `<path d="M${cx} ${cy - 22} l14 22 h-9 v16 h-10 v-16 h-9 Z" fill="${color}"/>`;
    } else {
      s += `<path d="M${cx} ${cy + 22} l14 -22 h-9 v-16 h-10 v16 h-9 Z" fill="${color}"/>`;
    }
    const lineas = resultado.split('|');
    lineas.forEach((l, i) => {
      s += `<text x="${x0 + anchoCaja / 2}" y="${top + 128 + i * 14}" font-size="11.5" fill="${COLOR.tinta}" text-anchor="middle">${esc(l)}</text>`;
    });
    return s;
  };

  c += panel(0, 'Acceso libre, sin diseño', 'La herramienta entrega la solución', 'Por debajo del punto de partida|una vez retirada la herramienta', AMBAR, 'abajo');
  c += panel(mitad + 14, 'Tutor con andamiaje', 'Retiene la respuesta y pide los pasos', 'Ganancias de aprendizaje duplicadas|frente a clase activa', AZUL, 'arriba');
  c += `<text x="${mitad}" y="${top + altoCaja + 18}" font-size="11" fill="${COLOR.tinta2}" text-anchor="middle">La misma clase de tecnología. Lo que cambia es el diseño de la actividad.</text>`;
  return envolver(c, top + altoCaja + 26, 'Bastani et al., PNAS (2025), n ≈ 1.000. Kestin et al., Scientific Reports (2025), n ≈ 180. Magnitudes no comparables entre sí.');
}

/* ---------- F4. Tres modalidades de incorporación curricular ---------- */
function f4() {
  const n = 3, sep = 12;
  const anchoCaja = (ANCHO_CAJA - sep * (n - 1)) / n;
  const top = 6, altoCaja = 204;
  const mod = [
    { t: 'SOBRE la IA', q: 'Añadir contenido sobre qué es, cómo funciona y qué implica', e: 'Crear una asignatura y encontrarle hueco', s: 'Domina: 7 de 8 casos avanzados', color: AZUL },
    { t: 'CON la IA', q: 'Usarla dentro de las asignaturas existentes como instrumento', e: 'Que cada docente rediseñe sus tareas y su evaluación', s: 'Se atasca: 1 de 8 casos', color: AZUL_MEDIO },
    { t: 'PARA entornos mediados', q: 'Redefinir qué hace un profesional cuando parte del oficio se automatiza', e: 'Revisar resultados de aprendizaje y secuencia', s: 'Sin casos localizados', color: AZUL_CLARO },
  ];
  const envolverTexto = (t, max) => {
    const p = t.split(' ');
    const out = [];
    let l = '';
    for (const w of p) {
      if ((l + ' ' + w).trim().length > max) { out.push(l.trim()); l = w; } else l += ' ' + w;
    }
    if (l.trim()) out.push(l.trim());
    return out;
  };
  let c = '';
  mod.forEach((m, i) => {
    const x0 = i * (anchoCaja + sep);
    c += `<rect x="${x0}" y="${top}" width="${anchoCaja}" height="${altoCaja}" fill="none" stroke="${COLOR.grilla}" stroke-width="1.2"/>`;
    c += `<rect x="${x0}" y="${top}" width="${anchoCaja}" height="5" fill="${m.color}"/>`;
    c += `<text x="${x0 + 12}" y="${top + 28}" font-size="12.5" font-weight="600" fill="${COLOR.tinta}">${esc(m.t)}</text>`;
    let y = top + 50;
    c += `<text x="${x0 + 12}" y="${y}" font-size="10" fill="${COLOR.tenue}">EN QUÉ CONSISTE</text>`;
    envolverTexto(m.q, 27).forEach((l, k) => { c += `<text x="${x0 + 12}" y="${y + 16 + k * 13}" font-size="11" fill="${COLOR.tinta}">${esc(l)}</text>`; });
    y = top + 112;
    c += `<text x="${x0 + 12}" y="${y}" font-size="10" fill="${COLOR.tenue}">QUÉ EXIGE</text>`;
    envolverTexto(m.e, 27).forEach((l, k) => { c += `<text x="${x0 + 12}" y="${y + 16 + k * 13}" font-size="11" fill="${COLOR.tinta}">${esc(l)}</text>`; });
    c += `<line x1="${x0 + 12}" y1="${top + altoCaja - 38}" x2="${x0 + anchoCaja - 12}" y2="${top + altoCaja - 34}" stroke="${COLOR.grilla}"/>`;
    envolverTexto(m.s, 30).forEach((l, k) => { c += `<text x="${x0 + 12}" y="${top + altoCaja - 20 + k * 12}" font-size="10.5" fill="${COLOR.tinta2}">${esc(l)}</text>`; });
  });
  return envolver(c, top + altoCaja + 10, 'El orden no expresa jerarquía ni secuencia. Ninguna modalidad conduce automáticamente a la siguiente.');
}

/* ---------- G5. Lo que declara el profesorado ---------- */
function g5() {
  const izq = 300, der = 58, top = 12;
  const w = ANCHO_CAJA - izq - der;
  const x = (v) => izq + (w * v) / 100;
  const filas = [
    { n: 'Preocupado por el criterio crítico de sus estudiantes', v: 83, color: AZUL },
    { n: 'Percibe falta de claridad institucional', v: 80, color: AZUL },
    { n: 'Participó en el diseño de la política que aplica', v: 31, color: AMBAR },
    { n: 'Se sitúa en nivel avanzado o experto', v: 17, color: AMBAR },
  ];
  const filaAlto = 32, grosor = 17;
  let c = '';
  for (let m = 0; m <= 100; m += 25) {
    const yFin = top + filas.length * filaAlto - 8;
    c += `<line x1="${x(m)}" y1="${top - 4}" x2="${x(m)}" y2="${yFin}" stroke="${m === 0 ? COLOR.eje : COLOR.grilla}"/>`;
    c += `<text x="${x(m)}" y="${yFin + 15}" font-size="10.5" fill="${COLOR.tenue}" text-anchor="middle">${m} %</text>`;
  }
  filas.forEach((f, i) => {
    const y0 = top + i * filaAlto;
    c += `<text x="${izq - 12}" y="${y0 + grosor - 2}" font-size="11.5" fill="${COLOR.tinta}" text-anchor="end">${esc(f.n)}</text>`;
    c += barra(izq, y0, x(f.v) - izq, grosor, f.color);
    c += `<text x="${x(f.v) + 6}" y="${y0 + grosor - 3}" font-size="11" fill="${COLOR.tinta}">${f.v} %</text>`;
  });
  return envolver(c, top + filas.length * filaAlto + 14, 'Ninguno de los cuatro indicadores mide adopción. La adopción docente alcanza el 77 %.');
}

const graficos = [
  { id: 'g1-adopcion', ...g1() },
  { id: 'g2-instrumentos', ...g2() },
  { id: 'g3-ensayos', ...g3() },
  { id: 'f4-curriculo', ...f4() },
  { id: 'g5-docentes', ...g5() },
];

const ids = await renderizar(graficos, path.join(aqui, 'figuras', 'informe-02c'), 3);
console.log(`${ids.length} figuras en figuras/informe-02c/: ${ids.join('  ')}`);
