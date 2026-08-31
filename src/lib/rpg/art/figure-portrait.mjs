/**
 * figure-portrait.mjs — retrato de diálogo.
 *
 * Se dibuja a 128x128 y se escala ×4 a 512x512 con vecino más cercano. Dibujar
 * directamente a 512 daría una ilustración pintada que no casaría con los
 * sprites del mapa; a 128 el retrato es el mismo lenguaje visual, sólo con
 * espacio para una cara de verdad.
 *
 * Composición (rostro, hombros, vestuario, expresión):
 *
 *    y  18..86   cabeza
 *    y  78..104  cuello
 *    y 100..128  hombros, cuello de la camisa, solapas
 *
 * La expresión vive en una tabla, no en código repetido: añadir un mood nuevo
 * es añadir una fila.
 */

import { PixelCanvas, mixColor } from './pixel-canvas.mjs';
import { OUTLINE } from './palette.mjs';

export const PORTRAIT_SIZE = 128;
export const PORTRAIT_SCALE = 4; // 128 × 4 = 512

const CX = 64;
const HEAD_TOP = 18;
const CHIN = 86;
const NECK_TOP = 78;
const SHOULDER_TOP = 100;

/** Perfil de la cabeza: [y, ancho]. Entre puntos se interpola linealmente. */
const HEAD_PROFILE = [
  [18, 26],
  [24, 40],
  [32, 50],
  [58, 50],
  [70, 44],
  [80, 32],
  [86, 20],
];

function headWidthAt(y) {
  if (y < HEAD_PROFILE[0][0] || y > HEAD_PROFILE[HEAD_PROFILE.length - 1][0]) return 0;
  for (let i = 0; i < HEAD_PROFILE.length - 1; i++) {
    const [y0, w0] = HEAD_PROFILE[i];
    const [y1, w1] = HEAD_PROFILE[i + 1];
    if (y >= y0 && y <= y1) {
      const t = y1 === y0 ? 0 : (y - y0) / (y1 - y0);
      return Math.round(w0 + (w1 - w0) * t);
    }
  }
  return 0;
}

/** Geometría de peinados a escala de retrato. Mismos nombres que el sprite. */
const PORTRAIT_HAIR = {
  buzz: { cap: 10, side: 4, widen: 0, fringe: 'none', extra: 'none' },
  short: { cap: 17, side: 12, widen: 1, fringe: 'straight', extra: 'none' },
  sidePart: { cap: 17, side: 12, widen: 1, fringe: 'part', extra: 'none' },
  swept: { cap: 17, side: 10, widen: 1, fringe: 'swept', extra: 'none' },
  balding: { cap: 9, side: 20, widen: 0, fringe: 'receded', extra: 'none' },
  bob: { cap: 18, side: 44, widen: 5, fringe: 'straight', extra: 'none' },
  bun: { cap: 17, side: 12, widen: 1, fringe: 'part', extra: 'bun' },
  ponytail: { cap: 17, side: 8, widen: 1, fringe: 'swept', extra: 'tail' },
  long: { cap: 18, side: 62, widen: 6, fringe: 'part', extra: 'none' },
  wavy: { cap: 18, side: 54, widen: 6, fringe: 'swept', extra: 'wave' },
  curls: { cap: 21, side: 26, widen: 5, fringe: 'straight', extra: 'volume' },
};

/**
 * Tabla de expresiones. Todo lo que distingue un mood de otro está aquí.
 *
 * browY      desplazamiento vertical de las cejas (negativo = más arriba)
 * browTilt   px que baja el extremo interior (positivo = ceño)
 * browSplit  desnivel entre ceja izquierda y derecha (escepticismo)
 * eyeOpen    altura de la apertura del ojo
 * pupil      [dx, dy] de la mirada
 * mouth      forma
 * crease     arruga entre cejas
 * flush      rubor de tensión en pómulos
 */
export const EXPRESSIONS = {
  neutral: { browY: 0, browTilt: 0, browSplit: 0, eyeOpen: 6, pupil: [0, 0], mouth: 'line', crease: false, flush: 0 },
  friendly: { browY: -2, browTilt: -1, browSplit: 0, eyeOpen: 5, pupil: [0, 0], mouth: 'smile', crease: false, flush: 0.12 },
  skeptical: { browY: -1, browTilt: 0, browSplit: 5, eyeOpen: 4, pupil: [2, 0], mouth: 'slant', crease: false, flush: 0 },
  angry: { browY: 3, browTilt: 4, browSplit: 0, eyeOpen: 4, pupil: [0, 1], mouth: 'tight', crease: true, flush: 0.22 },
  thinking: { browY: -2, browTilt: 1, browSplit: 2, eyeOpen: 5, pupil: [-2, -2], mouth: 'small', crease: false, flush: 0 },
  surprised: { browY: -6, browTilt: -2, browSplit: 0, eyeOpen: 10, pupil: [0, 0], mouth: 'open', crease: false, flush: 0 },
  /** Estado propio de EVA: la cara se mantiene, la señal no. */
  eva_glitch: { browY: -1, browTilt: 0, browSplit: 1, eyeOpen: 7, pupil: [0, 0], mouth: 'line', crease: false, flush: 0 },
};

export const MOODS = Object.keys(EXPRESSIONS).filter((m) => m !== 'eva_glitch');

// ---------------------------------------------------------------------------

function drawNeck(c, spec) {
  const { skin } = spec;
  c.rect(CX - 12, NECK_TOP, 24, SHOULDER_TOP - NECK_TOP + 6, skin.base);
  // La sombra bajo la mandíbula es lo que separa cabeza de cuello. Sin ella el
  // retrato parece un busto de una sola pieza.
  c.rect(CX - 12, NECK_TOP, 24, 7, skin.deep);
  c.rect(CX - 12, NECK_TOP + 7, 24, 4, skin.shade);
  c.rect(CX + 6, NECK_TOP, 6, 26, skin.shade);
}

function drawShoulders(c, spec) {
  const { cloth, shirt, accent } = spec;
  const top = SHOULDER_TOP;
  const h = PORTRAIT_SIZE - top;

  // Hombros: la curva del trapecio se abre rápido y luego se aplana, que es
  // como cae una chaqueta. Una rampa lineal da un triángulo de cartón.
  const shoulderWidthAt = (i) => Math.round(44 + 84 * Math.min(1, Math.pow((i / h) * 1.7, 0.7)));
  for (let i = 0; i < h; i++) {
    c.rectC(CX, top + i, shoulderWidthAt(i), 1, cloth.base);
  }
  // luz en el hombro izquierdo, sombra en el derecho
  for (let i = 0; i < h; i++) {
    const w = shoulderWidthAt(i);
    const x0 = CX - Math.floor(w / 2);
    c.rect(x0, top + i, 3, 1, cloth.light);
    c.rect(x0 + w - 4, top + i, 4, 1, cloth.shade);
  }

  // Camisa: escote en V. Con corbata puede ser amplio porque la corbata lo
  // tapa; con cuello abierto tiene que ser corto, o parece un babero.
  const vW = spec.neckwear === 'tie' ? 22 : 16;
  const vH = spec.neckwear === 'tie' ? 20 : 13;
  for (let i = 0; i < vH; i++) {
    c.rectC(CX, top + i, Math.max(2, vW - i * (vW / vH)), 1, shirt);
  }
  // solapas
  c.line(CX - 14, top, CX - 3, top + 24, cloth.shade);
  c.line(CX - 15, top, CX - 4, top + 24, cloth.shade);
  c.line(CX - 16, top, CX - 5, top + 24, cloth.shade);
  c.line(CX + 13, top, CX + 2, top + 24, cloth.shade);
  c.line(CX + 14, top, CX + 3, top + 24, cloth.shade);
  c.line(CX + 15, top, CX + 4, top + 24, cloth.shade);

  switch (spec.neckwear) {
    case 'tie':
      c.rectC(CX, top + 2, 10, 8, accent);
      for (let i = 0; i < 18; i++) c.rectC(CX, top + 10 + i, 8 + Math.round(i * 0.4), 1, accent);
      c.rect(CX - 5, top + 2, 2, 8, mixColor(accent, OUTLINE, 0.35));
      break;
    case 'scarf':
      c.rectC(CX, top - 2, 34, 7, accent);
      c.rectC(CX, top + 5, 12, 16, accent);
      c.rect(CX - 17, top - 2, 4, 7, mixColor(accent, OUTLINE, 0.3));
      break;
    case 'lanyard':
      c.line(CX - 13, top, CX - 4, top + 20, cloth.shade);
      c.line(CX + 12, top, CX + 3, top + 20, cloth.shade);
      c.rectC(CX, top + 20, 12, 8, accent);
      break;
    case 'openCollar':
      // cuello abierto: dos puntas de camisa sobre la solapa
      c.line(CX - 13, top, CX - 4, top + 16, shirt);
      c.line(CX - 12, top, CX - 3, top + 16, shirt);
      c.line(CX + 12, top, CX + 3, top + 16, shirt);
      c.line(CX + 11, top, CX + 2, top + 16, shirt);
      break;
    default:
      break;
  }
}

function drawHead(c, spec) {
  const { skin } = spec;
  for (let y = HEAD_TOP; y <= CHIN; y++) {
    const w = headWidthAt(y);
    if (w > 0) c.rectC(CX, y, w, 1, skin.base);
  }
  // modelado: sien y mejilla derechas en sombra, mandíbula inferior más oscura
  for (let y = HEAD_TOP + 6; y <= CHIN; y++) {
    const w = headWidthAt(y);
    if (w <= 0) continue;
    const x1 = CX + Math.ceil(w / 2) - 1;
    c.rect(x1 - 3, y, 4, 1, skin.shade);
    if (y > 70) c.rectC(CX, y, w - 6, 1, skin.shade, 0.5);
  }
  // orejas
  c.ellipse(CX - 26, 56, 4, 8, skin.shade);
  c.ellipse(CX + 26, 56, 4, 8, skin.shade);
  c.ellipse(CX - 26, 56, 2, 5, skin.deep, 0.6);
  c.ellipse(CX + 26, 56, 2, 5, skin.deep, 0.6);
}

function drawEyes(c, spec, ex) {
  const { skin } = spec;
  const y = 54;
  const open = ex.eyeOpen;
  const [pdx, pdy] = ex.pupil;

  [-1, 1].forEach((side) => {
    const cx = CX + side * 13;
    const ry = Math.max(2.5, open / 2);
    // Cuenca. El blanco del ojo va roto hacia marfil, no a blanco puro: en una
    // paleta apagada, dos óvalos blancos se comen la cara entera.
    c.ellipse(cx, y, 7, ry, '#DCD3C0');
    c.ellipse(cx, y, 7, ry, skin.shade, 0.2);
    // iris + pupila
    const ix = cx + pdx;
    const iy = y + pdy;
    c.ellipse(ix, iy, 3.4, Math.min(3.4, ry), mixColor(spec.hair.base, '#4C4945', 0.35));
    c.ellipse(ix, iy, 1.8, Math.min(2, ry), OUTLINE);
    c.px(ix - 1, iy - 1, '#EDE6D6', 0.8); // brillo
    // párpado superior: recorta la apertura desde arriba
    c.rect(cx - 8, y - Math.ceil(ry) - 3, 17, Math.max(0, 4 - Math.round(open / 3)), skin.base);
    c.rect(cx - 7, y - Math.round(ry) - 1, 15, 1, mixColor(skin.deep, OUTLINE, 0.45));
    // pliegue inferior
    c.rect(cx - 6, y + Math.round(ry) + 2, 13, 1, skin.shade, 0.5);
  });
}

function drawBrows(c, spec, ex) {
  const hair = mixColor(spec.hair.base, OUTLINE, 0.25);
  const baseY = 40 + ex.browY;

  [-1, 1].forEach((side) => {
    const cx = CX + side * 13;
    // browSplit levanta una ceja y baja la otra: es lo que convierte una cara
    // neutra en una cara escéptica sin tocar nada más.
    const split = side < 0 ? -ex.browSplit : ex.browSplit;
    for (let i = -10; i <= 10; i++) {
      const inner = side < 0 ? i > 0 : i < 0;
      const tilt = inner ? ex.browTilt : 0;
      const arc = Math.round(Math.abs(i) * 0.18);
      const y = baseY + split + tilt + arc;
      c.rect(cx + i, y, 1, 3, hair);
    }
  });

  if (ex.crease) {
    c.rect(CX - 2, baseY + 4, 1, 6, mixColor(spec.skin.deep, OUTLINE, 0.3), 0.7);
    c.rect(CX + 1, baseY + 4, 1, 6, mixColor(spec.skin.deep, OUTLINE, 0.3), 0.7);
  }
}

function drawNose(c, spec) {
  const { skin } = spec;
  c.rect(CX + 1, 56, 3, 12, skin.shade, 0.5);
  c.rect(CX - 3, 66, 9, 3, skin.shade);
  c.rect(CX - 4, 68, 2, 2, skin.deep, 0.8);
  c.rect(CX + 5, 68, 2, 2, skin.deep, 0.8);
  c.rect(CX - 1, 69, 4, 1, skin.deep, 0.45);
}

function drawMouth(c, spec, ex) {
  const { skin } = spec;
  const y = 76;
  const lip = mixColor(skin.deep, OUTLINE, 0.35);
  switch (ex.mouth) {
    case 'smile':
      for (let i = -8; i <= 8; i++) {
        c.px(CX + i, y + Math.round(Math.abs(i) * -0.22) + 1, lip);
        c.px(CX + i, y + Math.round(Math.abs(i) * -0.22) + 2, lip, 0.5);
      }
      c.px(CX - 9, y - 1, lip);
      c.px(CX + 9, y - 1, lip);
      break;
    case 'slant':
      for (let i = -7; i <= 7; i++) c.px(CX + i, y + Math.round(i * 0.22), lip);
      c.px(CX + 8, y + 1, lip);
      break;
    case 'tight':
      c.rect(CX - 8, y, 16, 1, lip);
      c.rect(CX - 6, y - 1, 12, 1, lip, 0.5);
      c.px(CX - 9, y + 1, lip);
      c.px(CX + 8, y + 1, lip);
      break;
    case 'small':
      c.rect(CX - 4, y, 8, 1, lip);
      break;
    case 'open':
      c.ellipse(CX, y + 2, 4.5, 4.5, lip);
      c.ellipse(CX, y + 3, 2.8, 2.8, mixColor(lip, OUTLINE, 0.45));
      break;
    default: // line
      c.rect(CX - 7, y, 14, 1, lip);
      c.rect(CX - 5, y + 1, 10, 1, lip, 0.35);
      break;
  }
}

function drawHair(c, spec) {
  const style = PORTRAIT_HAIR[spec.hairStyle] ?? PORTRAIT_HAIR.short;
  const { hair } = spec;
  const widen = style.widen;

  // casquete: sigue el perfil del cráneo, no un rectángulo
  for (let y = HEAD_TOP - 3; y < HEAD_TOP + style.cap; y++) {
    const w = headWidthAt(Math.max(HEAD_TOP, y)) + widen * 2;
    if (w <= 0) continue;
    c.rectC(CX, y, w, 1, hair.base);
  }
  // laterales
  for (let y = HEAD_TOP + style.cap; y < HEAD_TOP + style.cap + style.side; y++) {
    const ref = Math.min(CHIN, Math.max(HEAD_TOP, y));
    const w = headWidthAt(ref) + widen * 2;
    if (w <= 0) continue;
    const sideW = 5 + widen;
    c.rectC(CX - Math.floor(w / 2) + Math.floor(sideW / 2), y, sideW, 1, hair.base);
    c.rectC(CX + Math.floor(w / 2) - Math.floor(sideW / 2), y, sideW, 1, hair.base);
  }

  // flequillo
  const fy = HEAD_TOP + style.cap;
  const fw = headWidthAt(fy + 2);
  switch (style.fringe) {
    case 'straight':
      c.rectC(CX, fy, fw, 3, hair.base);
      break;
    case 'part':
      // Los dos lados se solapan en la raya. Si sólo se tocan, queda una franja
      // de piel bajando por la frente que parece una cicatriz.
      c.rect(CX - Math.floor(fw / 2), fy, Math.round(fw * 0.56), 5, hair.base);
      c.rect(CX - 2, fy, Math.round(fw * 0.5) + 2, 3, hair.base);
      c.rect(CX + 3, fy, 2, 4, mixColor(hair.base, OUTLINE, 0.4), 0.5); // la raya
      break;
    case 'swept':
      for (let i = 0; i < fw; i++) {
        const h = Math.round(6 * (1 - i / fw)) + 1;
        c.rect(CX - Math.floor(fw / 2) + i, fy, 1, h, hair.base);
      }
      break;
    case 'receded':
      c.rect(CX - Math.floor(fw / 2), fy - 2, 9, 6, hair.base);
      c.rect(CX + Math.floor(fw / 2) - 9, fy - 2, 9, 6, hair.base);
      break;
    default:
      break;
  }

  // brillo: dos trazos, nunca un degradado. Es lo que mantiene el aire impreso.
  c.rect(CX - 14, HEAD_TOP + 2, 15, 2, hair.light, 0.5);
  c.rect(CX - 17, HEAD_TOP + 5, 8, 2, hair.light, 0.28);

  switch (style.extra) {
    case 'bun':
      c.ellipse(CX - 2, HEAD_TOP - 8, 13, 10, hair.base);
      c.rect(CX - 10, HEAD_TOP - 12, 8, 3, hair.light, 0.5);
      break;
    case 'tail':
      // La coleta tiene que solapar el cráneo. Separada 2 px, el contorno de
      // tinta la aisla y se lee como un auricular.
      c.ellipse(CX + 24, 70, 9, 22, hair.base);
      c.ellipse(CX + 22, 50, 7, 9, hair.base);
      c.rect(CX + 17, 46, 9, 3, mixColor(hair.base, OUTLINE, 0.5));
      c.rect(CX + 21, 62, 3, 14, hair.light, 0.3);
      break;
    case 'wave':
      c.ellipse(CX - 30, HEAD_TOP + 62, 8, 10, hair.base);
      c.ellipse(CX + 30, HEAD_TOP + 58, 8, 10, hair.base);
      break;
    case 'volume':
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI;
        c.ellipse(CX - Math.cos(a) * 30, HEAD_TOP + 6 - Math.sin(a) * 9, 6, 6, hair.base);
      }
      break;
    default:
      break;
  }
}

function drawGlasses(c, spec) {
  if (!spec.glasses) return;
  const frame = mixColor(OUTLINE, spec.hair.base, 0.3);
  [-1, 1].forEach((side) => {
    const cx = CX + side * 13;
    // montura rectangular de esquinas suaves: sobria, editorial
    c.rect(cx - 11, 46, 22, 1, frame);
    c.rect(cx - 11, 62, 22, 1, frame);
    c.rect(cx - 11, 47, 1, 15, frame);
    c.rect(cx + 10, 47, 1, 15, frame);
    // reflejo
    c.line(cx - 8, 60, cx + 4, 48, '#EDE6D6', 0.14);
  });
  c.rect(CX - 3, 52, 6, 1, frame);
  c.rect(CX - 24, 47, 1, 6, frame);
  c.rect(CX + 23, 47, 1, 6, frame);
}

function drawFlush(c, spec, amount) {
  if (amount <= 0) return;
  c.ellipse(CX - 19, 66, 8, 5, '#8A2432', amount);
  c.ellipse(CX + 19, 66, 8, 5, '#8A2432', amount);
}

/**
 * Construye un retrato de 512x512 con fondo transparente.
 *
 * @param {import('./figure-sprite.mjs').SpriteSpec} spec
 * @param {keyof typeof EXPRESSIONS} mood
 * @returns {PixelCanvas} 512x512
 */
export function buildPortrait(spec, mood = 'neutral') {
  const ex = EXPRESSIONS[mood] ?? EXPRESSIONS.neutral;
  const c = new PixelCanvas(PORTRAIT_SIZE, PORTRAIT_SIZE);

  drawNeck(c, spec);
  drawShoulders(c, spec);
  drawHead(c, spec);
  drawFlush(c, spec, ex.flush);
  drawEyes(c, spec, ex);
  drawBrows(c, spec, ex);
  drawNose(c, spec);
  drawMouth(c, spec, ex);
  drawHair(c, spec);
  drawGlasses(c, spec);

  c.rimLight('#9A958C', 0.22);
  c.inkOutline(OUTLINE, 0.9);

  return c.scale(PORTRAIT_SCALE);
}

/** Retrato sin escalar, para composición interna (glitch de EVA). */
export function buildPortraitBase(spec, mood = 'neutral') {
  const ex = EXPRESSIONS[mood] ?? EXPRESSIONS.neutral;
  const c = new PixelCanvas(PORTRAIT_SIZE, PORTRAIT_SIZE);
  drawNeck(c, spec);
  drawShoulders(c, spec);
  drawHead(c, spec);
  drawFlush(c, spec, ex.flush);
  drawEyes(c, spec, ex);
  drawBrows(c, spec, ex);
  drawNose(c, spec);
  drawMouth(c, spec, ex);
  drawHair(c, spec);
  drawGlasses(c, spec);
  c.rimLight('#9A958C', 0.22);
  c.inkOutline(OUTLINE, 0.9);
  return c;
}

export { PORTRAIT_HAIR };
