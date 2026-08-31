/**
 * glitch.mjs — identidad gráfica de EVA.
 *
 * EVA es un avatar digital, no un holograma. La diferencia importa y es toda la
 * dirección de arte de este archivo:
 *
 *   - NO se pinta de cyan ni de magenta. Los desplazamientos de canal usan
 *     burdeos y dorado apagado, los mismos colores que el resto del proyecto.
 *   - NO lleva glow, ni wireframe, ni transparencia de holograma de ciencia
 *     ficción. Es opaca, tiene volumen y viste como quien trabaja en el estudio.
 *   - Su capa digital es una interferencia de *impresión*: líneas de barrido
 *     como una trama de fotograbado, desplazamientos horizontales como un
 *     registro de color mal alineado, y una nitidez que se recompone.
 *
 * El resultado tiene que leerse como "una lámina que se está reimprimiendo mal",
 * no como "un personaje de cyberpunk".
 */

import { PixelCanvas, seededRandom, mixColor } from './pixel-canvas.mjs';
import { EVA_PALETTE } from './palette.mjs';

/**
 * Trama de barrido: una línea marfil muy tenue cada 3 px, desplazable.
 * Es la firma permanente de EVA, presente incluso en reposo.
 */
export function applyScanlines(c, { spacing = 3, offset = 0, alpha = 0.1 } = {}) {
  for (let y = 0; y < c.height; y++) {
    if ((y + offset) % spacing !== 0) continue;
    for (let x = 0; x < c.width; x++) {
      if (c.solid(x, y)) c.px(x, y, EVA_PALETTE.scanline, alpha);
    }
  }
  return c;
}

/**
 * Desplazamiento de bandas horizontales + desalineación de color.
 *
 * @param {PixelCanvas} src
 * @param {object} opts
 * @param {string|number} opts.seed        determinista: mismo seed, mismo glitch
 * @param {number} [opts.intensity]        0..1
 * @param {number} [opts.bands]            número de bandas desplazadas
 * @returns {PixelCanvas}
 */
export function applyGlitch(src, { seed = 'eva', intensity = 0.5, bands = 5 } = {}) {
  const rnd = seededRandom(seed);
  const out = new PixelCanvas(src.width, src.height);
  const maxShift = Math.max(1, Math.round(src.width * 0.05 * intensity));

  // 1. Registro de color desalineado: dos copias tenues, una burdeos y otra
  //    dorada, separadas 1-2 px. Es el "mal registro" de una imprenta.
  const ghost = Math.max(1, Math.round(2 * intensity));
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      if (!src.solid(x, y)) continue;
      out.px(x - ghost, y, EVA_PALETTE.glitchA, 0.28 * intensity);
      out.px(x + ghost, y, EVA_PALETTE.glitchB, 0.22 * intensity);
    }
  }

  // 2. La figura, cortada en bandas horizontales desplazadas.
  const cuts = [0];
  for (let i = 0; i < bands; i++) cuts.push(Math.floor(rnd() * src.height));
  cuts.push(src.height);
  cuts.sort((a, b) => a - b);

  for (let i = 0; i < cuts.length - 1; i++) {
    const y0 = cuts[i];
    const y1 = cuts[i + 1];
    // La mayoría de las bandas no se mueve: el glitch se lee por contraste con
    // lo que sigue en su sitio. Desplazarlas todas da ruido, no interferencia.
    const move = rnd() < 0.45;
    const shift = move ? Math.round((rnd() * 2 - 1) * maxShift) : 0;
    for (let y = y0; y < y1; y++) {
      for (let x = 0; x < src.width; x++) {
        const i4 = src.idx(x, y);
        if (src.data[i4 + 3] === 0) continue;
        out.px(x + shift, y, [src.data[i4], src.data[i4 + 1], src.data[i4 + 2], src.data[i4 + 3]]);
      }
    }
    // 3. Línea de corte: una fila dorada al borde de la banda desplazada.
    if (move && shift !== 0) {
      for (let x = 0; x < src.width; x++) {
        if (out.solid(x, y0)) out.px(x, y0, EVA_PALETTE.glitchB, 0.5 * intensity);
      }
    }
  }

  // 4. Filas perdidas: la señal se cae del todo en una o dos líneas.
  const drops = Math.round(2 * intensity);
  for (let i = 0; i < drops; i++) {
    const y = Math.floor(rnd() * src.height);
    for (let x = 0; x < src.width; x++) {
      if (out.solid(x, y)) out.px(x, y, EVA_PALETTE.glitchA, 0.55);
    }
  }

  return applyScanlines(out, { spacing: 3, offset: Math.floor(rnd() * 3), alpha: 0.14 });
}

/**
 * Marca digital permanente sobre cualquier lienzo de EVA (sprite o retrato).
 * Barrido tenue + un borde de refracción en el lado derecho.
 */
export function applyDigitalSkin(c, frame = 0) {
  // Espaciado 4 y alfa muy baja. A espaciado 3 la trama deja de ser una textura
  // y se convierte en rayas: EVA pasa de avatar sobrio a codigo de barras.
  applyScanlines(c, { spacing: 4, offset: frame % 4, alpha: 0.06 });
  // canto derecho ligeramente desalineado: la figura nunca termina de fijarse
  for (let y = 0; y < c.height; y++) {
    for (let x = c.width - 1; x >= 1; x--) {
      if (c.solid(x, y) && !c.solid(x + 1, y)) {
        c.px(x, y, EVA_PALETTE.glitchB, 0.16);
        break;
      }
    }
  }
  return c;
}

/**
 * Fotogramas de la animación de aparición de EVA.
 *
 * Materializa por bandas: al principio sólo se han "impreso" algunas franjas,
 * y el registro va cuadrando. Al llegar al último fotograma queda su idle normal.
 *
 * @param {PixelCanvas} target retrato o celda de sprite ya dibujada
 * @param {number} steps
 * @returns {PixelCanvas[]}
 */
export function buildAppearFrames(target, steps = 5) {
  const frames = [];
  for (let s = 0; s < steps; s++) {
    const t = s / (steps - 1);
    const f = new PixelCanvas(target.width, target.height);
    const rnd = seededRandom(`eva-appear-${s}`);
    const bandH = Math.max(2, Math.round(6 - t * 4));
    for (let y = 0; y < target.height; y += bandH) {
      // cuántas bandas ya se han impreso
      if (rnd() > t * 0.85 + 0.15) continue;
      const shift = Math.round((rnd() * 2 - 1) * (1 - t) * 6);
      for (let yy = y; yy < Math.min(target.height, y + bandH); yy++) {
        for (let x = 0; x < target.width; x++) {
          const i = target.idx(x, yy);
          if (target.data[i + 3] === 0) continue;
          f.px(x + shift, yy, [target.data[i], target.data[i + 1], target.data[i + 2], target.data[i + 3]], 0.4 + t * 0.6);
        }
      }
    }
    applyScanlines(f, { spacing: 3, offset: s % 3, alpha: 0.2 - t * 0.11 });
    frames.push(f);
  }
  frames[frames.length - 1] = target.clone();
  applyDigitalSkin(frames[frames.length - 1], 0);
  return frames;
}

/**
 * Idle propio de EVA: la trama de barrido va a la deriva y cada tanto una banda
 * se desliza. Cuatro fotogramas bastan para que se lea "viva" sin ruido.
 *
 * @param {PixelCanvas} base celda ya dibujada
 * @param {number} frames
 */
export function buildEvaIdleFrames(base, frames = 4) {
  const out = [];
  for (let i = 0; i < frames; i++) {
    const f = base.clone();
    applyScanlines(f, { spacing: 3, offset: i, alpha: 0.1 });
    if (i === 2) {
      // un solo micro-desplazamiento por ciclo: la interferencia es puntual
      const y0 = Math.floor(base.height * 0.42);
      const band = f.crop(0, y0, base.width, 4);
      f.clearRect(0, y0, base.width, 4);
      f.blit(band, 1, y0);
    }
    // canto derecho dorado
    for (let y = 0; y < f.height; y++) {
      for (let x = f.width - 1; x >= 1; x--) {
        if (f.solid(x, y) && !f.solid(x + 1, y)) {
          f.px(x, y, mixColor(EVA_PALETTE.glitchB, EVA_PALETTE.scanline, 0.3), 0.18);
          break;
        }
      }
    }
    out.push(f);
  }
  return out;
}
