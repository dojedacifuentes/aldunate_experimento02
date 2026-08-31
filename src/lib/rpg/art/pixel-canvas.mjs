/**
 * PixelCanvas — buffer RGBA mínimo, sin dependencias, isomórfico.
 *
 * Se usa igual en el navegador (render procedural en tiempo real) y en Node
 * (para hornear los PNG definitivos en /public/rpg/characters).
 * No conoce React, Canvas2D ni el sistema de archivos.
 */

const HEX_CACHE = new Map();

/**
 * Convierte '#RRGGBB' o '#RRGGBBAA' a [r,g,b,a].
 * @param {string|number[]} color
 * @returns {number[]}
 */
export function parseColor(color) {
  if (Array.isArray(color)) return color.length === 4 ? color : [color[0], color[1], color[2], 255];
  const hit = HEX_CACHE.get(color);
  if (hit) return hit;
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex.replace(/./g, (c) => c + c);
  const rgba = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
    hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) : 255,
  ];
  HEX_CACHE.set(color, rgba);
  return rgba;
}

/**
 * Mezcla lineal entre dos colores. Permite sombrear sin introducir tonos nuevos
 * fuera de la paleta cerrada del proyecto.
 */
export function mixColor(a, b, t) {
  const ca = parseColor(a);
  const cb = parseColor(b);
  const k = Math.max(0, Math.min(1, t));
  return [
    Math.round(ca[0] + (cb[0] - ca[0]) * k),
    Math.round(ca[1] + (cb[1] - ca[1]) * k),
    Math.round(ca[2] + (cb[2] - ca[2]) * k),
    Math.round(ca[3] + (cb[3] - ca[3]) * k),
  ];
}

export class PixelCanvas {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }

  clone() {
    const out = new PixelCanvas(this.width, this.height);
    out.data.set(this.data);
    return out;
  }

  /** @returns {number} índice del canal rojo, o -1 si cae fuera del lienzo. */
  idx(x, y) {
    const px = x | 0;
    const py = y | 0;
    if (px < 0 || py < 0 || px >= this.width || py >= this.height) return -1;
    return (py * this.width + px) * 4;
  }

  get(x, y) {
    const i = this.idx(x, y);
    if (i < 0) return [0, 0, 0, 0];
    const d = this.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]];
  }

  solid(x, y, threshold = 8) {
    const i = this.idx(x, y);
    return i >= 0 && this.data[i + 3] > threshold;
  }

  /** Escribe un píxel con composición source-over. */
  px(x, y, color, alpha = 1) {
    const i = this.idx(x, y);
    if (i < 0) return this;
    const c = parseColor(color);
    const a = (c[3] / 255) * alpha;
    if (a <= 0) return this;
    const d = this.data;
    if (a >= 1) {
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
      return this;
    }
    const da = d[i + 3] / 255;
    const outA = a + da * (1 - a);
    if (outA <= 0) return this;
    d[i] = (c[0] * a + d[i] * da * (1 - a)) / outA;
    d[i + 1] = (c[1] * a + d[i + 1] * da * (1 - a)) / outA;
    d[i + 2] = (c[2] * a + d[i + 2] * da * (1 - a)) / outA;
    d[i + 3] = outA * 255;
    return this;
  }

  /** Sombrea sólo donde ya hay silueta: nunca ensancha la figura. */
  shade(x, y, color, alpha = 1) {
    if (this.solid(x, y)) this.px(x, y, color, alpha);
    return this;
  }

  clearPx(x, y) {
    const i = this.idx(x, y);
    if (i < 0) return this;
    this.data[i] = 0;
    this.data[i + 1] = 0;
    this.data[i + 2] = 0;
    this.data[i + 3] = 0;
    return this;
  }

  /** Vacía una región a transparente. `rect` con alfa 0 no sirve: no borra. */
  clearRect(x, y, w, h) {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) this.clearPx(xx, yy);
    }
    return this;
  }

  rect(x, y, w, h, color, alpha = 1) {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    for (let yy = y0; yy < y0 + h; yy++) {
      for (let xx = x0; xx < x0 + w; xx++) this.px(xx, yy, color, alpha);
    }
    return this;
  }

  /** Rectángulo centrado horizontalmente en cx. */
  rectC(cx, y, w, h, color, alpha = 1) {
    return this.rect(Math.round(cx - w / 2), y, Math.round(w), h, color, alpha);
  }

  hline(x, y, w, color, alpha = 1) {
    return this.rect(x, y, w, 1, color, alpha);
  }

  vline(x, y, h, color, alpha = 1) {
    return this.rect(x, y, 1, h, color, alpha);
  }

  /** Línea de Bresenham. */
  line(x0, y0, x1, y1, color, alpha = 1) {
    let x = Math.round(x0);
    let y = Math.round(y0);
    const ex = Math.round(x1);
    const ey = Math.round(y1);
    const dx = Math.abs(ex - x);
    const dy = -Math.abs(ey - y);
    const sx = x < ex ? 1 : -1;
    const sy = y < ey ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.px(x, y, color, alpha);
      if (x === ex && y === ey) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
    return this;
  }

  /** Elipse rellena. */
  ellipse(cx, cy, rx, ry, color, alpha = 1) {
    if (rx <= 0 || ry <= 0) return this;
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      const dy = (y + 0.5 - cy) / ry;
      const inner = 1 - dy * dy;
      if (inner < 0) continue;
      const half = Math.sqrt(inner) * rx;
      const x0 = Math.round(cx - half);
      const x1 = Math.round(cx + half) - 1;
      for (let x = x0; x <= x1; x++) this.px(x, y, color, alpha);
    }
    return this;
  }

  /**
   * Rectángulo con esquinas recortadas en diagonal: la forma base de casi todo
   * el pixel art del proyecto (hombros, mandíbulas, carpetas, escritorios).
   */
  roundRect(x, y, w, h, r, color, alpha = 1) {
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const dx = Math.min(xx, w - 1 - xx);
        const dy = Math.min(yy, h - 1 - yy);
        if (dx + dy < r) continue;
        this.px(x + xx, y + yy, color, alpha);
      }
    }
    return this;
  }

  /** Trapecio vertical centrado: ancho wTop arriba, wBottom abajo. */
  taper(cx, y, h, wTop, wBottom, color, alpha = 1) {
    for (let i = 0; i < h; i++) {
      const t = h === 1 ? 0 : i / (h - 1);
      const w = Math.round(wTop + (wBottom - wTop) * t);
      this.rectC(cx, y + i, w, 1, color, alpha);
    }
    return this;
  }

  blit(src, dx, dy) {
    for (let y = 0; y < src.height; y++) {
      for (let x = 0; x < src.width; x++) {
        const i = src.idx(x, y);
        const a = src.data[i + 3];
        if (a === 0) continue;
        this.px(dx + x, dy + y, [src.data[i], src.data[i + 1], src.data[i + 2], a]);
      }
    }
    return this;
  }

  crop(x, y, w, h) {
    const out = new PixelCanvas(w, h);
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const i = this.idx(x + xx, y + yy);
        if (i < 0) continue;
        const o = out.idx(xx, yy);
        out.data[o] = this.data[i];
        out.data[o + 1] = this.data[i + 1];
        out.data[o + 2] = this.data[i + 2];
        out.data[o + 3] = this.data[i + 3];
      }
    }
    return out;
  }

  /** Desplaza el contenido completo (bobs de animación, glitch de EVA). */
  offset(dx, dy) {
    const out = new PixelCanvas(this.width, this.height);
    out.blit(this, dx, dy);
    return out;
  }

  /**
   * Contorno de tinta: pinta los píxeles transparentes que tocan la silueta
   * desde fuera. Se resuelve con flood fill desde el borde para no ensuciar
   * huecos interiores (entre las piernas, dentro del asa de un maletín).
   */
  inkOutline(color, alpha = 1) {
    const w = this.width;
    const h = this.height;
    const exterior = new Uint8Array(w * h);
    const stack = [];
    const push = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      const k = y * w + x;
      if (exterior[k]) return;
      if (this.data[k * 4 + 3] > 8) return;
      exterior[k] = 1;
      stack.push(k);
    };
    for (let x = 0; x < w; x++) {
      push(x, 0);
      push(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      push(0, y);
      push(w - 1, y);
    }
    while (stack.length) {
      const k = stack.pop();
      const x = k % w;
      const y = (k / w) | 0;
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
    const edges = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!exterior[y * w + x]) continue;
        if (this.solid(x + 1, y) || this.solid(x - 1, y) || this.solid(x, y + 1) || this.solid(x, y - 1)) {
          edges.push(x, y);
        }
      }
    }
    for (let i = 0; i < edges.length; i += 2) this.px(edges[i], edges[i + 1], color, alpha);
    return this;
  }

  /**
   * Mapa de píxeles transparentes conectados con el borde del lienzo.
   * Distingue "fuera de la figura" de "hueco interior".
   */
  exteriorMask() {
    const w = this.width;
    const h = this.height;
    const mask = new Uint8Array(w * h);
    const stack = [];
    const push = (x, y) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;
      const k = y * w + x;
      if (mask[k]) return;
      if (this.data[k * 4 + 3] > 8) return;
      mask[k] = 1;
      stack.push(k);
    };
    for (let x = 0; x < w; x++) {
      push(x, 0);
      push(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      push(0, y);
      push(w - 1, y);
    }
    while (stack.length) {
      const k = stack.pop();
      const x = k % w;
      const y = (k / w) | 0;
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
    return mask;
  }

  /**
   * Luz de contorno sobre el borde superior-izquierdo de la silueta.
   *
   * Es lo que salva a un personaje de traje carbón sobre un suelo oscuro: sin
   * este pase, la figura se disuelve en el fondo y sólo se ve la camisa. Se
   * aplica ANTES del contorno de tinta, para que quede por dentro de la línea.
   */
  rimLight(color, alpha = 0.3) {
    const w = this.width;
    const mask = this.exteriorMask();
    const isOut = (x, y) => {
      if (x < 0 || y < 0 || x >= this.width || y >= this.height) return true;
      return mask[y * w + x] === 1;
    };
    const hits = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.solid(x, y)) continue;
        if (isOut(x - 1, y) || isOut(x, y - 1)) hits.push(x, y);
      }
    }
    for (let i = 0; i < hits.length; i += 2) this.px(hits[i], hits[i + 1], color, alpha);
    return this;
  }

  /** Escalado nearest-neighbor: el pixel art no se interpola nunca. */
  scale(factor) {
    const n = Math.max(1, Math.round(factor));
    if (n === 1) return this.clone();
    const out = new PixelCanvas(this.width * n, this.height * n);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = this.idx(x, y);
        if (this.data[i + 3] === 0) continue;
        for (let dy = 0; dy < n; dy++) {
          for (let dx = 0; dx < n; dx++) {
            const o = out.idx(x * n + dx, y * n + dy);
            out.data[o] = this.data[i];
            out.data[o + 1] = this.data[i + 1];
            out.data[o + 2] = this.data[i + 2];
            out.data[o + 3] = this.data[i + 3];
          }
        }
      }
    }
    return out;
  }

  toRGBA() {
    return this.data;
  }
}

/**
 * Generador determinista. La variedad de los NPC ambientales debe ser
 * reproducible: el mismo id produce siempre exactamente el mismo personaje.
 */
export function seededRandom(seed) {
  let s = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
  s = (s ^ 0x9e3779b9) >>> 0;
  if (s === 0) s = 0x1a2b3c4d;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}
