/**
 * character-art.mjs — fachada única de generación de arte.
 *
 * Es el ÚNICO módulo que el resto del proyecto debería importar del directorio
 * de arte. Recibe ids de personaje y devuelve lienzos; nadie fuera de aquí
 * necesita saber que existen `figure-sprite`, `figure-portrait` o `glitch`.
 *
 * Todo es determinista y cacheado: el mismo id produce siempre exactamente la
 * misma imagen, en el navegador y en Node.
 */

import { PixelCanvas } from './pixel-canvas.mjs';
import { buildSpriteSheet, drawSpriteCell, SHEET_LAYOUT, CELL } from './figure-sprite.mjs';
import { buildPortraitBase, PORTRAIT_SCALE, PORTRAIT_SIZE, MOODS } from './figure-portrait.mjs';
import { applyDigitalSkin, applyGlitch, buildAppearFrames, buildEvaIdleFrames } from './glitch.mjs';
import { getSpec, CHARACTER_SPECS } from './character-specs.mjs';

const cache = new Map();

function memo(key, make) {
  const hit = cache.get(key);
  if (hit) return hit;
  const made = make();
  cache.set(key, made);
  return made;
}

/** Vacía la caché de arte. Útil al recargar en desarrollo. */
export function clearArtCache() {
  cache.clear();
}

function isDigital(spec) {
  return Boolean(spec.digital);
}

/**
 * Hoja de sprites de un personaje: 288x288 (6 columnas x 6 filas de 48 px).
 * @param {string} id
 * @returns {PixelCanvas}
 */
export function spriteSheetFor(id) {
  return memo(`sheet:${id}`, () => {
    const spec = getSpec(id);
    const sheet = buildSpriteSheet(spec);
    // EVA arrastra su trama de barrido también en el mapa, no sólo en diálogo.
    if (isDigital(spec)) applyDigitalSkin(sheet, 0);
    return sheet;
  });
}

/**
 * Una celda suelta, sin pasar por la hoja. Útil para previews y para el
 * renderizador procedural de respaldo.
 */
export function spriteCellFor(id, direction, pose, frame) {
  return memo(`cell:${id}:${direction}:${pose}:${frame}`, () => {
    const spec = getSpec(id);
    const cell = drawSpriteCell(spec, direction, pose, frame);
    if (isDigital(spec)) applyDigitalSkin(cell, frame);
    return cell;
  });
}

/**
 * Retrato de 512x512, fondo transparente.
 *
 * @param {string} id
 * @param {string} mood uno de MOODS, o 'eva_glitch' para EVA
 * @returns {PixelCanvas}
 */
export function portraitFor(id, mood = 'neutral') {
  return memo(`portrait:${id}:${mood}`, () => {
    const spec = getSpec(id);
    const glitching = mood === 'eva_glitch';
    // El glitch se aplica sobre el retrato neutro a 128, ANTES de escalar: así
    // los cortes caen en la retícula del pixel art y no en píxeles sueltos de
    // 512, que se verían como suciedad en vez de como interferencia.
    const base = buildPortraitBase(spec, glitching ? 'eva_glitch' : mood);
    if (glitching) {
      return applyGlitch(base, { seed: `${id}:${mood}`, intensity: 0.75, bands: 6 }).scale(PORTRAIT_SCALE);
    }
    if (isDigital(spec)) applyDigitalSkin(base, 0);
    return base.scale(PORTRAIT_SCALE);
  });
}

/** Fotogramas de la animación de aparición de EVA (retrato). */
export function evaAppearFrames(steps = 5) {
  return memo(`eva:appear:${steps}`, () =>
    buildAppearFrames(buildPortraitBase(getSpec('eva'), 'neutral'), steps).map((f) => f.scale(PORTRAIT_SCALE)),
  );
}

/** Fotogramas del idle especial de EVA en el mapa (48x48). */
export function evaIdleFrames(direction = 'down') {
  return memo(`eva:idle:${direction}`, () =>
    buildEvaIdleFrames(drawSpriteCell(getSpec('eva'), direction, 'idle', 0), 4),
  );
}

/**
 * Tira horizontal con el idle de EVA, para hornear como hoja aparte.
 * @returns {PixelCanvas} 192x48
 */
export function evaIdleStrip(direction = 'down') {
  return memo(`eva:idlestrip:${direction}`, () => {
    const frames = evaIdleFrames(direction);
    const strip = new PixelCanvas(CELL * frames.length, CELL);
    frames.forEach((f, i) => strip.blit(f, i * CELL, 0));
    return strip;
  });
}

/**
 * Tira horizontal con la aparición de EVA, para hornear como hoja aparte.
 * @returns {PixelCanvas} (512*steps) x 512
 */
export function evaAppearStrip(steps = 5) {
  return memo(`eva:appearstrip:${steps}`, () => {
    const frames = evaAppearFrames(steps);
    const size = PORTRAIT_SIZE * PORTRAIT_SCALE;
    const strip = new PixelCanvas(size * frames.length, size);
    frames.forEach((f, i) => strip.blit(f, i * size, 0));
    return strip;
  });
}

/** Ids con arte disponible. */
export function artIds() {
  return Object.keys(CHARACTER_SPECS);
}

export { SHEET_LAYOUT, CELL, PORTRAIT_SIZE, PORTRAIT_SCALE, MOODS, getSpec, CHARACTER_SPECS };
