/**
 * figure-sprite.mjs — figura de mapa, 48x48 por celda.
 *
 * Proporción objetivo ~4 cabezas: adulto estilizado, no chibi, no anime.
 * Todo se dibuja con formas planas + una sombra + contorno de tinta, que es lo
 * que le da el aire de novela gráfica impresa en lugar de pixel art retro.
 *
 * Sistema de coordenadas de una celda (48x48), pies apoyados en y=45:
 *
 *    y 6..15   cabeza (9 px de ancho)
 *    y 16..17  cuello
 *    y 18..30  torso (trapecio, hombros arriba)
 *    y 19..30  brazos
 *    y 30..33  cadera
 *    y 33..42  piernas
 *    y 43..45  zapatos
 */

import { PixelCanvas } from './pixel-canvas.mjs';
import { OUTLINE } from './palette.mjs';

export const CELL = 48;

const CX = 24;
const HEAD_TOP = 5;
const CHIN = 15;
const HEAD_HALF = 4; // cabeza de 9 px: x 20..28
const NECK_TOP = 16;
const SHOULDER = 18;
const WAIST = 30;
const HIP_BOTTOM = 33;
const KNEE = 38;
const ANKLE = 42;
const SHOE_TOP = 43;
const FOOT = 45;

const BUILD_SHOULDER = { slim: 15, regular: 17, broad: 19 };

/** Longitudes y volúmenes por peinado. Cada uno debe dar una silueta distinta. */
const HAIR_STYLES = {
  buzz: { cap: 2, side: 1, widen: 0, back: 0, fringe: 'none', extra: 'none' },
  short: { cap: 3, side: 2, widen: 0, back: 0, fringe: 'straight', extra: 'none' },
  sidePart: { cap: 3, side: 2, widen: 0, back: 0, fringe: 'part', extra: 'none' },
  swept: { cap: 3, side: 2, widen: 0, back: 1, fringe: 'swept', extra: 'none' },
  balding: { cap: 2, side: 3, widen: 0, back: 0, fringe: 'receded', extra: 'none' },
  bob: { cap: 3, side: 6, widen: 1, back: 1, fringe: 'straight', extra: 'none' },
  bun: { cap: 3, side: 2, widen: 0, back: 1, fringe: 'part', extra: 'bun' },
  ponytail: { cap: 3, side: 1, widen: 0, back: 1, fringe: 'swept', extra: 'tail' },
  long: { cap: 3, side: 11, widen: 1, back: 2, fringe: 'part', extra: 'none' },
  wavy: { cap: 3, side: 9, widen: 1, back: 2, fringe: 'swept', extra: 'wave' },
  curls: { cap: 4, side: 4, widen: 1, back: 1, fringe: 'straight', extra: 'volume' },
};

/**
 * @typedef {Object} SpriteSpec
 * @property {{base:string,shade:string,deep:string}} skin
 * @property {{base:string,light:string}} hair
 * @property {keyof typeof HAIR_STYLES} hairStyle
 * @property {{base:string,shade:string,light:string}} cloth
 * @property {string} shirt
 * @property {string} accent
 * @property {'tie'|'scarf'|'openCollar'|'lanyard'|'none'} neckwear
 * @property {'slim'|'regular'|'broad'} build
 * @property {boolean} [glasses]
 * @property {'none'|'folder'|'briefcase'|'tablet'|'mug'|'satchel'} [prop]
 * @property {number} [heightOffset] desplazamiento vertical entero (-1, 0, 1)
 */

function shoulderWidth(spec) {
  return BUILD_SHOULDER[spec.build] ?? BUILD_SHOULDER.regular;
}

// ---------------------------------------------------------------------------
// Piezas
// ---------------------------------------------------------------------------

function drawLegs(c, spec, dy, phase, view) {
  const { cloth } = spec;
  const shoe = OUTLINE;
  const legTop = HIP_BOTTOM + dy;

  if (view === 'side') {
    // En perfil las piernas tijeran: una adelante, otra atrás. Es lo que hace
    // legible el ciclo de caminata sin necesitar más frames.
    const front = phase * 2;
    const back = -phase * 2;
    // pierna trasera (más oscura, queda detrás del cuerpo)
    c.rect(CX - 3 + back, legTop, 5, ANKLE - legTop + 1, cloth.shade);
    c.rect(CX - 4 + back, SHOE_TOP + dy, 7, FOOT - SHOE_TOP + 1, shoe);
    // pierna delantera
    c.rect(CX - 2 + front, legTop, 5, ANKLE - legTop + 1, cloth.base);
    c.rect(CX - 3 + front, SHOE_TOP + dy, 7, FOOT - SHOE_TOP + 1, shoe);
    return;
  }

  // De frente el paso se lee levantando una pierna y abriéndola hacia fuera.
  // Con 1 px no se percibe nada; con 2 px el ciclo se lee de un vistazo.
  const lift = 2;
  const lLifted = phase > 0;
  const rLifted = phase < 0;

  // Separación de 4 px entre perneras: el contorno de tinta se come 1 px por
  // cada lado, así que un hueco menor deja las piernas fundidas en un bloque.
  const lx = 18 - (lLifted ? 2 : 0);
  const rx = 26 + (rLifted ? 2 : 0);
  const lBottom = ANKLE - (lLifted ? lift : 0);
  const rBottom = ANKLE - (rLifted ? lift : 0);

  const lH = lBottom - HIP_BOTTOM + 1;
  const rH = rBottom - HIP_BOTTOM + 1;
  // El pantalón va un tono por debajo de la chaqueta: marca la cintura sin
  // necesidad de una línea dura.
  c.rect(lx, legTop, 4, lH, cloth.shade);
  c.rect(rx, legTop, 4, rH, cloth.shade);
  c.rect(lx, legTop, 1, lH, cloth.base);
  c.rect(rx + 3, legTop, 1, rH, cloth.base);

  const lShoeTop = lBottom + 1 + dy;
  const rShoeTop = rBottom + 1 + dy;
  c.rect(lx - 1, lShoeTop, 5, FOOT - SHOE_TOP + 1, shoe);
  c.rect(rx, rShoeTop, 5, FOOT - SHOE_TOP + 1, shoe);
  // fila superior más clara para que el zapato no se funda con el pantalón
  c.rect(lx - 1, lShoeTop, 5, 1, cloth.base);
  c.rect(rx, rShoeTop, 5, 1, cloth.base);
}

function drawTorso(c, spec, dy, view) {
  const { cloth, shirt, accent } = spec;
  // De perfil el cuerpo es mucho más estrecho. Sin esto, el sprite lateral es
  // el frontal sin cara y el personaje parece caminar de lado como un cangrejo.
  const sw = view === 'side' ? Math.round(shoulderWidth(spec) * 0.62) : shoulderWidth(spec);
  const bw = view === 'side' ? 8 : 12;
  const top = SHOULDER + dy;
  const bottom = WAIST + dy;

  // chaqueta
  c.taper(CX, top, bottom - top + 1, sw, bw, cloth.base);
  // cadera / falda de la chaqueta
  c.rectC(CX, bottom + 1, bw, HIP_BOTTOM - WAIST, cloth.shade);
  // volumen: lado izquierdo iluminado, derecho en sombra
  for (let y = top; y <= bottom; y++) {
    const t = (y - top) / Math.max(1, bottom - top);
    const w = Math.round(sw + (bw - sw) * t);
    const x0 = CX - Math.floor(w / 2);
    c.rect(x0, y, 1, 1, cloth.light);
    c.rect(x0 + w - 1, y, 1, 1, cloth.shade);
  }

  if (view === 'back') {
    // costura central y cuello de la chaqueta por detrás
    c.rect(CX, top + 2, 1, bottom - top - 1, cloth.shade);
    c.rect(CX - 3, top, 7, 1, cloth.light);
    return;
  }

  if (view === 'side') {
    c.rect(CX - 1, top + 1, 3, 4, shirt);
    c.rect(CX + 1, top + 1, 1, 5, cloth.shade);
    return;
  }

  // Frente: escote en V + solapas + prenda de cuello.
  // La camisa se dibuja en V y no como rectángulo: un bloque de marfil de 5x5
  // en mitad del pecho se lee como un babero, no como una camisa.
  c.rect(CX - 2, top, 5, 2, shirt);
  c.rect(CX - 1, top + 2, 3, 2, shirt);
  c.px(CX, top + 4, shirt);
  c.rect(CX - 4, top, 2, 6, cloth.shade);
  c.rect(CX + 3, top, 2, 6, cloth.shade);

  switch (spec.neckwear) {
    case 'tie':
      c.rect(CX - 1, top + 1, 2, 2, accent); // nudo
      c.rect(CX - 1, top + 3, 2, 7, accent); // pala
      c.px(CX - 1, top + 1, accent, 0.6);
      c.px(CX, top + 9, OUTLINE, 0.5);
      break;
    case 'scarf':
      c.rect(CX - 2, top, 5, 1, accent);
      c.rect(CX - 1, top + 1, 2, 4, accent);
      c.px(CX - 1, top + 1, accent, 0.55);
      break;
    case 'lanyard':
      c.px(CX - 2, top + 1, cloth.shade);
      c.px(CX + 2, top + 1, cloth.shade);
      c.px(CX - 1, top + 2, cloth.shade);
      c.px(CX + 1, top + 2, cloth.shade);
      c.rect(CX - 1, top + 4, 2, 3, accent); // credencial
      break;
    case 'openCollar':
      // sólo las puntas del cuello sobre la solapa
      c.px(CX - 2, top + 2, shirt);
      c.px(CX + 2, top + 2, shirt);
      break;
    default:
      break;
  }
}

function drawArms(c, spec, dy, swing, view, gesture) {
  const { cloth, skin } = spec;
  const sw = shoulderWidth(spec);
  const half = Math.floor(sw / 2);
  const top = SHOULDER + dy + 1;
  const len = 10;

  if (view === 'side') {
    // sólo el brazo cercano; el otro queda implícito tras el torso
    const y = top + (swing > 0 ? -1 : swing < 0 ? 1 : 0);
    c.rect(CX + 1, y, 3, len, cloth.light);
    c.rect(CX + 1, y + len, 3, 2, skin.base);
    return;
  }

  const lTop = top + (swing > 0 ? 1 : swing < 0 ? -1 : 0);
  const rTop = top + (swing > 0 ? -1 : swing < 0 ? 1 : 0);

  // Los brazos se apoyan sobre el borde del torso, no flotan al lado: sin este
  // solape la figura queda en pose de T y pierde el aire de persona de pie.
  const lx = CX - half - 1;
  const rx = CX + half - 2;

  /** Brazo con hombrera, manga que estrecha en el antebrazo, y mano. */
  const arm = (x, y, height, inward) => {
    c.rect(x, y, 3, 2, cloth.light); // sólo la hombrera capta luz
    c.rect(x, y + 2, 3, 3, cloth.base);
    c.rect(x + inward, y + 5, 2, height - 5, cloth.base);
    c.rect(x + inward, y + height, 2, 2, skin.base);
    c.px(x + inward, y + height + 1, skin.shade);
  };

  arm(lx, lTop, len, 1);

  if (gesture === 'raised') {
    // mano a la altura del pecho, para hablar
    c.rect(rx, rTop, 3, 4, cloth.light);
    c.rect(rx - 1, rTop + 4, 2, 3, cloth.base);
    c.rect(rx - 2, rTop + 6, 2, 2, skin.base);
  } else if (gesture === 'chin') {
    // codo pegado, mano al mentón, para pensar
    c.rect(rx, rTop, 3, 4, cloth.light);
    c.rect(rx - 1, rTop + 3, 2, 3, cloth.base);
    c.rect(CX + 4, CHIN + dy - 1, 2, 2, cloth.base);
    c.rect(CX + 3, CHIN + dy - 2, 2, 2, skin.base);
  } else {
    arm(rx, rTop, len, 0);
  }
}

function headBox(dy) {
  return {
    x0: CX - HEAD_HALF,
    x1: CX + HEAD_HALF,
    top: HEAD_TOP + dy,
    chin: CHIN + dy,
    cx: CX,
  };
}

function drawHead(c, spec, dy, view, tilt = 0) {
  const { skin } = spec;
  const b = headBox(dy);
  const x0 = b.x0 + tilt;
  const top = b.top;
  const h = b.chin - b.top + 1;

  // cuello
  c.rect(CX - 2, NECK_TOP + dy, 4, 2, skin.shade);
  c.rect(CX - 2, NECK_TOP + dy, 4, 1, skin.deep);

  if (view === 'side') {
    // perfil mirando a la derecha; el llamador refleja para la izquierda
    c.roundRect(x0 + 1, top, 8, h, 2, skin.base);
    c.px(x0 + 9, top + 6, skin.base); // nariz
    c.px(x0 + 9, top + 7, skin.shade);
    c.px(x0 + 1, top + 6, skin.shade); // oreja
    c.px(x0 + 1, top + 7, skin.deep);
    c.px(x0 + 6, top + 6, OUTLINE); // ojo en perfil
    c.rect(x0 + 2, b.chin, 5, 1, skin.shade);
    return;
  }

  c.roundRect(x0, top, 9, h, 2, skin.base);
  // orejas
  c.px(x0 - 1, top + 5, skin.shade);
  c.px(x0 + 9, top + 5, skin.shade);
  // sien en sombra y mentón: sólo los extremos, para no cerrar la cara con una
  // banda oscura que a esta escala se lee como una mueca.
  c.vline(x0 + 8, top + 3, h - 4, skin.shade);
  c.px(x0 + 1, b.chin, skin.shade);
  c.px(x0 + 7, b.chin, skin.shade);

  if (view === 'back') return; // de espaldas no hay cara

  // Cejas y ojos separados por una fila de piel. Pegados se funden en una sola
  // mancha y la cara pierde toda lectura.
  c.rect(x0 + 1, top + 4, 2, 1, spec.hair.base, 0.4);
  c.rect(x0 + 6, top + 4, 2, 1, spec.hair.base, 0.4);
  // Ojos de 1 px. A 9 px de ancho de cabeza, dos píxeles por ojo ya se leen
  // como gafas de sol.
  c.px(x0 + 2, top + 6, OUTLINE);
  c.px(x0 + 6, top + 6, OUTLINE);
  // nariz: un solo píxel de sombra
  c.px(x0 + 4, top + 8, skin.deep, 0.6);
}

function drawMouth(c, spec, dy, tilt, state) {
  const b = headBox(dy);
  const x0 = b.x0 + tilt;
  const y = b.top + 8;
  c.rect(x0 + 2, y, 5, 1, spec.skin.base); // limpia la boca base
  if (state === 'closed') {
    c.rect(x0 + 3, y, 3, 1, spec.skin.deep, 0.55);
  } else if (state === 'open') {
    c.rect(x0 + 3, y, 3, 1, OUTLINE, 0.8);
  } else if (state === 'wide') {
    c.rect(x0 + 3, y, 3, 2, OUTLINE, 0.85);
  } else if (state === 'small') {
    c.rect(x0 + 4, y, 2, 1, OUTLINE, 0.7);
  }
}

function drawHair(c, spec, dy, view, tilt = 0) {
  const style = HAIR_STYLES[spec.hairStyle] ?? HAIR_STYLES.short;
  const { hair } = spec;
  const b = headBox(dy);
  const x0 = b.x0 + tilt;
  const top = b.top;
  const widen = style.widen;

  // Volumen superior: el casquete sigue la curva del cráneo (r=2). Con r=1 el
  // pelo se convierte en una losa y la cabeza parece un champiñón.
  c.roundRect(x0 - widen, top - 1, 9 + widen * 2, style.cap + 1, 2, hair.base);
  c.hline(x0 + 2, top - 1, 4, hair.light);

  // laterales
  const sideTop = top + style.cap;
  const sideLen = style.side;
  if (sideLen > 0) {
    c.rect(x0 - widen, sideTop, 1 + widen, sideLen, hair.base);
    c.rect(x0 + 8, sideTop, 1 + widen, sideLen, hair.base);
    if (widen > 0) {
      c.rect(x0 - widen, sideTop + sideLen - 2, 1 + widen, 2, hair.light, 0.4);
      c.rect(x0 + 8, sideTop + sideLen - 2, 1 + widen, 2, hair.light, 0.4);
    }
  }

  if (view === 'back') {
    // De espaldas el pelo cubre el cráneo entero hasta la nuca. Dejar piel a la
    // vista ahí convierte al personaje en una cara vuelta del revés.
    const backLen = Math.max(9, style.cap + 5 + Math.min(sideLen, 6));
    c.roundRect(x0 - widen, top - 1, 9 + widen * 2, backLen, 2, hair.base);
    c.hline(x0 + 2, top, 4, hair.light, 0.6);
  } else {
    switch (style.fringe) {
      case 'straight':
        c.rect(x0, top + style.cap, 9, 1, hair.base);
        break;
      case 'part':
        c.rect(x0, top + style.cap, 4, 1, hair.base);
        c.rect(x0 + 6, top + style.cap, 3, 1, hair.base);
        c.px(x0 + 4, top + style.cap - 1, hair.light);
        break;
      case 'swept':
        c.rect(x0, top + style.cap, 6, 1, hair.base);
        c.px(x0 + 6, top + style.cap - 1, hair.base);
        break;
      case 'receded':
        c.rect(x0, top + style.cap - 1, 2, 2, hair.base);
        c.rect(x0 + 7, top + style.cap - 1, 2, 2, hair.base);
        break;
      default:
        break;
    }
  }

  if (style.extra === 'bun') {
    const bx = view === 'side' ? x0 - 2 : x0 + 3;
    c.ellipse(bx + 1, top - 2, 2.4, 2, hair.base);
    c.px(bx, top - 3, hair.light);
  } else if (style.extra === 'tail') {
    const tx = view === 'side' ? x0 - 1 : x0 + 8;
    c.rect(tx, top + 2, 2, 8, hair.base);
    c.px(tx, top + 9, hair.light);
  } else if (style.extra === 'wave') {
    c.px(x0 - widen, top + style.cap + sideLen, hair.base);
    c.px(x0 + 8 + widen, top + style.cap + sideLen - 1, hair.base);
  } else if (style.extra === 'volume') {
    // Volumen como una silueta redonda y continua, no como píxeles sueltos
    // alrededor de la cabeza: el contorno de tinta rodea cada píxel aislado y
    // lo que debería ser pelo con cuerpo acaba pareciendo antenas.
    c.roundRect(x0 - widen - 1, top - 2, 11 + widen * 2, style.cap + 3, 3, hair.base);
    c.px(x0 + 2, top - 1, hair.light);
    c.px(x0 + 5, top - 1, hair.light, 0.6);
  }
}

function drawGlasses(c, spec, dy, view, tilt = 0) {
  if (!spec.glasses) return;
  const b = headBox(dy);
  const x0 = b.x0 + tilt;
  // Las lentes van centradas en la fila de los ojos (top+6). Con las cejas en
  // top+4, montarlas una fila más arriba las convierte en un entrecejo.
  const y = b.top + 6;
  if (view === 'back') return;
  if (view === 'side') {
    c.rect(x0 + 5, y, 4, 1, OUTLINE, 0.8);
    return;
  }
  c.rect(x0 + 1, y - 1, 3, 3, OUTLINE, 0.5);
  c.rect(x0 + 5, y - 1, 3, 3, OUTLINE, 0.5);
  c.px(x0 + 2, y, spec.skin.base, 0.85);
  c.px(x0 + 6, y, spec.skin.base, 0.85);
  c.px(x0 + 4, y, OUTLINE, 0.45); // puente
}

function drawProp(c, spec, dy, view, gesture) {
  const prop = spec.prop ?? 'none';
  // Si esa mano está gesticulando, no puede estar sujetando nada.
  if (prop === 'none' || (gesture !== 'none' && prop !== 'satchel')) return;
  const sw = shoulderWidth(spec);
  const half = Math.floor(sw / 2);
  const handY = SHOULDER + dy + 11;
  const x = view === 'side' ? CX + 2 : CX + half - 2;

  switch (prop) {
    case 'folder':
      // Carpeta pequeña y sujeta contra el costado. Más grande se lee como una
      // fiambrera y le roba la silueta al personaje.
      c.rect(x - 1, handY - 2, 4, 6, '#B9AF99');
      c.rect(x - 1, handY - 2, 4, 1, '#8A8274');
      c.rect(x - 1, handY, 4, 1, '#8A2432', 0.85);
      break;
    case 'briefcase':
      c.rect(x - 2, handY + 1, 8, 6, '#3A2A20');
      c.rect(x - 2, handY + 1, 8, 1, '#54402F');
      c.rect(x + 1, handY, 2, 1, '#B78C30');
      break;
    case 'tablet':
      c.rect(x - 1, handY - 2, 5, 7, '#2A2724');
      c.rect(x, handY - 1, 3, 5, '#6E6A63');
      break;
    case 'mug':
      c.rect(x, handY, 4, 4, '#EDE6D6');
      c.px(x + 4, handY + 1, '#EDE6D6');
      c.rect(x + 1, handY, 2, 1, '#8A6A24');
      break;
    case 'satchel':
      c.line(CX - half, SHOULDER + dy + 1, CX + half - 2, WAIST + dy - 2, '#3A2A20');
      c.rect(CX + half - 4, WAIST + dy - 2, 6, 5, '#3A2A20');
      c.rect(CX + half - 4, WAIST + dy - 2, 6, 1, '#54402F');
      break;
    default:
      break;
  }
}

function drawGroundShadow(c, dy) {
  // Sombra elíptica bajo los pies: ancla la figura al suelo del mapa.
  c.ellipse(CX, FOOT + dy, 8, 2.2, '#12100F', 0.22);
  c.ellipse(CX, FOOT + dy, 5, 1.4, '#12100F', 0.16);
}

function mirrorHorizontal(c) {
  const out = new PixelCanvas(c.width, c.height);
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const i = c.idx(x, y);
      const o = out.idx(c.width - 1 - x, y);
      out.data[o] = c.data[i];
      out.data[o + 1] = c.data[i + 1];
      out.data[o + 2] = c.data[i + 2];
      out.data[o + 3] = c.data[i + 3];
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Celdas
// ---------------------------------------------------------------------------

/**
 * Dibuja una celda de 48x48.
 *
 * @param {SpriteSpec} spec
 * @param {'down'|'up'|'left'|'right'} direction
 * @param {'walk'|'idle'|'talk'|'think'} pose
 * @param {number} frame índice dentro de la pose
 * @returns {PixelCanvas}
 */
export function drawSpriteCell(spec, direction, pose, frame) {
  const c = new PixelCanvas(CELL, CELL);
  const view = direction === 'up' ? 'back' : direction === 'down' ? 'front' : 'side';
  const base = spec.heightOffset ?? 0;

  let dy = base;
  let legPhase = 0;
  let swing = 0;
  let gesture = 'none';
  let tilt = 0;
  let mouth = null;

  if (pose === 'walk') {
    // 0 y 2 son pasadas neutras; 1 y 3 son los apoyos alternados.
    legPhase = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    swing = -legPhase;
    dy = base + (frame === 1 || frame === 3 ? -1 : 0);
  } else if (pose === 'idle') {
    // Respiración de 2 frames: el torso baja 1 px, las piernas no se mueven.
    dy = base + (frame === 1 ? 1 : 0);
  } else if (pose === 'talk') {
    gesture = 'raised';
    dy = base + (frame === 1 || frame === 2 ? -1 : 0);
    mouth = ['closed', 'open', 'wide', 'open'][frame % 4];
  } else if (pose === 'think') {
    gesture = 'chin';
    tilt = frame >= 2 ? 1 : 0;
    dy = base + (frame === 1 || frame === 2 ? -1 : 0);
    mouth = 'small';
  }

  drawGroundShadow(c, base);
  drawLegs(c, spec, pose === 'idle' ? base : dy, legPhase, view);
  drawTorso(c, spec, dy, view);
  drawProp(c, spec, dy, view, gesture);
  drawArms(c, spec, dy, swing, view, gesture);
  drawHead(c, spec, dy, view, tilt);
  if (mouth) drawMouth(c, spec, dy, tilt, mouth);
  drawGlasses(c, spec, dy, view, tilt);
  drawHair(c, spec, dy, view, tilt);

  if (pose === 'think' && frame > 0) {
    // Puntos suspensivos en dorado apagado: el "está pensando" legible a
    // distancia, sin globo de diálogo.
    const b = headBox(dy);
    for (let i = 0; i < Math.min(frame, 3); i++) {
      c.px(b.x1 + 2 + i * 2, b.top - 3, '#B78C30');
    }
  }

  // Luz de contorno primero (queda por dentro), tinta despues (queda por fuera).
  // Ese orden es el que da el aire de vineta impresa.
  c.rimLight('#8B857A', 0.30);
  c.inkOutline(OUTLINE, 0.85);

  return direction === 'left' ? mirrorHorizontal(c) : c;
}

/** Filas y columnas de la hoja de sprites. Es el contrato con characters.ts. */
export const SHEET_LAYOUT = {
  cell: CELL,
  columns: 6,
  rows: 6,
  /** fila -> definición */
  rowsMap: [
    { key: 'down', direction: 'down' },
    { key: 'up', direction: 'up' },
    { key: 'left', direction: 'left' },
    { key: 'right', direction: 'right' },
    { key: 'talk', direction: 'down' },
    { key: 'think', direction: 'down' },
  ],
};

/**
 * Construye la hoja completa: 6 columnas x 6 filas de celdas de 48 px.
 *
 * Filas 0-3 (down/up/left/right): columnas 0-3 = ciclo de caminata,
 * columnas 4-5 = idle direccional.
 * Fila 4: talk. Fila 5: thinking. En ambas, columnas 4-5 repiten 0-1 para que
 * cualquier lector de la hoja pueda asumir 6 columnas sin casos especiales.
 *
 * @param {SpriteSpec} spec
 * @returns {PixelCanvas} 288x288
 */
export function buildSpriteSheet(spec) {
  const { columns, rows, rowsMap } = SHEET_LAYOUT;
  const sheet = new PixelCanvas(CELL * columns, CELL * rows);

  rowsMap.forEach((row, r) => {
    for (let col = 0; col < columns; col++) {
      let pose;
      let frame;
      if (r <= 3) {
        pose = col <= 3 ? 'walk' : 'idle';
        frame = col <= 3 ? col : col - 4;
      } else {
        pose = r === 4 ? 'talk' : 'think';
        frame = col % 4;
      }
      sheet.blit(drawSpriteCell(spec, row.direction, pose, frame), col * CELL, r * CELL);
    }
  });

  return sheet;
}

export { HAIR_STYLES };
