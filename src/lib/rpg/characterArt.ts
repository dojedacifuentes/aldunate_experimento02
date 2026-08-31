/**
 * lib/rpg/characterArt.ts — resolutor de arte de personajes.
 *
 * Es la ÚNICA pieza que convierte un `(id, mood)` en una imagen concreta, y la
 * única que decide entre las dos fuentes posibles:
 *
 *   1. PNG horneado en /public/rpg/characters/… (lo declara characters.ts)
 *   2. render procedural con el motor de lib/rpg/art
 *
 * Las dos producen exactamente el mismo dibujo. El respaldo procedural no es un
 * placeholder de relleno: es el mismo arte, generado en el cliente en lugar de
 * leído de disco. Por eso se puede desarrollar sin ejecutar el horneado y aun
 * así ver el juego terminado.
 *
 * Todo lo que sale de aquí es una URL utilizable en `<img src>` o en
 * `background-image`, así que los componentes tienen un único camino de render
 * y no les importa de dónde vino el píxel.
 */

import type { CSSProperties } from 'react';

import { CHARACTERS, getCharacter } from '@/data/rpg/characters';
import type {
  AnimationClip,
  AnimationName,
  CharacterDefinition,
  CharacterId,
  EvaMood,
  ResolvedArt,
} from '@/types/rpg';
import {
  evaAppearFrames,
  evaIdleFrames,
  portraitFor,
  spriteSheetFor,
} from './art/character-art.mjs';
import type { PixelCanvas } from './art/pixel-canvas.mjs';

// ---------------------------------------------------------------------------
// Manifiesto
// ---------------------------------------------------------------------------

/**
 * Lo escribe `scripts/rpg-art/bake.mjs`. Lista qué archivos existen DE VERDAD,
 * para no pedir al navegador rutas que darían 404 y no tener que mantener a mano
 * una lista de "qué está horneado".
 */
export interface ArtManifest {
  generatedAt: string;
  /** rutas públicas presentes, como conjunto plano */
  files: string[];
}

const MANIFEST_URL = '/rpg/characters/manifest.json';

let manifestPromise: Promise<Set<string>> | null = null;

/**
 * Carga el manifiesto una sola vez. Si no existe —el caso normal mientras el
 * arte sea procedural— devuelve un conjunto vacío sin ruido en consola: la
 * ausencia de manifiesto no es un error, es el estado por defecto.
 */
export function loadArtManifest(): Promise<Set<string>> {
  if (manifestPromise) return manifestPromise;
  if (typeof fetch === 'undefined') {
    manifestPromise = Promise.resolve(new Set<string>());
    return manifestPromise;
  }
  manifestPromise = fetch(MANIFEST_URL, { cache: 'force-cache' })
    .then((r) => (r.ok ? (r.json() as Promise<ArtManifest>) : null))
    .then((m) => new Set(m?.files ?? []))
    .catch(() => new Set<string>());
  return manifestPromise;
}

/** Permite reevaluar el manifiesto tras hornear, sin recargar la página. */
export function invalidateArtManifest(): void {
  manifestPromise = null;
  urlCache.clear();
}

// ---------------------------------------------------------------------------
// Render procedural -> URL
// ---------------------------------------------------------------------------

const urlCache = new Map<string, string>();

/** Vuelca un PixelCanvas en un <canvas> del DOM. Sólo en cliente. */
export function paintToCanvas(pc: PixelCanvas): HTMLCanvasElement {
  const el = document.createElement('canvas');
  el.width = pc.width;
  el.height = pc.height;
  const ctx = el.getContext('2d');
  if (!ctx) return el;
  ctx.putImageData(new ImageData(new Uint8ClampedArray(pc.data), pc.width, pc.height), 0, 0);
  return el;
}

/**
 * Convierte un lienzo procedural en un data URL cacheado.
 *
 * Se usa data URL y no blob URL a propósito: sobrevive a recargas de HMR sin
 * quedar revocado y no hay que gestionar ciclo de vida ni fugas de memoria.
 */
function proceduralUrl(key: string, make: () => PixelCanvas): string {
  const hit = urlCache.get(key);
  if (hit) return hit;
  if (typeof document === 'undefined') return '';
  const url = paintToCanvas(make()).toDataURL('image/png');
  urlCache.set(key, url);
  return url;
}

// ---------------------------------------------------------------------------
// Resolución
// ---------------------------------------------------------------------------

/**
 * Decide el origen de la hoja de sprites de un personaje.
 * Síncrono: consulta el manifiesto ya cargado. Antes de que cargue, procedural.
 */
export function resolveSprite(id: CharacterId, baked: Set<string>): ResolvedArt {
  const def = getCharacter(id);
  if (baked.has(def.sprite.src)) return { kind: 'baked', src: def.sprite.src };
  return { kind: 'procedural', artId: def.artId };
}

/**
 * Decide el origen del retrato para un mood.
 *
 * Cadena: mood pedido -> retrato por defecto del personaje -> procedural.
 * Nunca lanza: un mood no horneado se degrada a procedural del mismo mood, que
 * es visualmente idéntico.
 */
export function resolvePortrait(id: CharacterId, mood: EvaMood, baked: Set<string>): ResolvedArt {
  const def = getCharacter(id);
  const path = def.portrait.byMood[mood];
  if (path && baked.has(path)) return { kind: 'baked', src: path };
  return { kind: 'procedural', artId: def.artId };
}

/** URL final de la hoja de sprites, horneada o procedural. */
export function spriteSheetUrl(id: CharacterId, baked: Set<string>): string {
  const art = resolveSprite(id, baked);
  if (art.kind === 'baked') return art.src;
  return proceduralUrl(`sheet:${art.artId}`, () => spriteSheetFor(art.artId));
}

/** URL final del retrato, horneado o procedural. */
export function portraitUrl(id: CharacterId, mood: EvaMood, baked: Set<string>): string {
  const art = resolvePortrait(id, mood, baked);
  if (art.kind === 'baked') return art.src;
  return proceduralUrl(`portrait:${art.artId}:${mood}`, () => portraitFor(art.artId, mood));
}

/** Fotogramas de la aparición de EVA como URLs, en orden. */
export function evaAppearUrls(steps = 5): string[] {
  return evaAppearFrames(steps).map((f, i) => proceduralUrl(`eva:appear:${steps}:${i}`, () => f));
}

/** Fotogramas del idle especial de EVA como URLs, en orden. */
export function evaIdleUrls(direction: 'down' | 'up' | 'left' | 'right' = 'down'): string[] {
  return evaIdleFrames(direction).map((f, i) => proceduralUrl(`eva:idle:${direction}:${i}`, () => f));
}

// ---------------------------------------------------------------------------
// Geometría de la hoja
// ---------------------------------------------------------------------------

/**
 * Clip de animación de un personaje, con respaldo.
 *
 * Si un personaje no declara la animación pedida —por ejemplo un NPC ambiental
 * al que se le pide `thinking`— se cae a `idle_down` en vez de romper la escena.
 */
export function clipFor(def: CharacterDefinition, name: AnimationName): AnimationClip {
  return def.animations[name] ?? def.animations.idle_down;
}

/** Nombre de animación a partir de dirección y estado. */
export function animationName(
  direction: 'down' | 'up' | 'left' | 'right',
  moving: boolean,
): AnimationName {
  return (moving ? `walk_${direction}` : `idle_${direction}`) as AnimationName;
}

/**
 * Posición de un fotograma dentro de la hoja, en píxeles de la hoja.
 * Los componentes no calculan esto: lo piden aquí, y así cambiar la geometría
 * de la hoja no obliga a tocar ni un componente.
 */
export function frameRect(def: CharacterDefinition, clip: AnimationClip, step: number) {
  const { cell } = def.sprite;
  const column = clip.frames[step % clip.frames.length] ?? 0;
  return { x: column * cell, y: clip.row * cell, size: cell };
}

/**
 * Estilo CSS que recorta un fotograma de la hoja.
 *
 * Usa `background-position` negativo sobre un elemento del tamaño de la celda:
 * es la técnica más barata para animar sprites sin canvas ni un `<img>` por
 * fotograma, y respeta `image-rendering: pixelated`.
 */
export function frameStyle(
  def: CharacterDefinition,
  clip: AnimationClip,
  step: number,
  url: string,
  scale = 1,
): CSSProperties {
  const { cell, columns, rows } = def.sprite;
  const { x, y } = frameRect(def, clip, step);
  return {
    width: cell * scale,
    height: cell * scale,
    backgroundImage: url ? `url(${url})` : undefined,
    backgroundPosition: `${-x * scale}px ${-y * scale}px`,
    backgroundSize: `${cell * columns * scale}px ${cell * rows * scale}px`,
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated',
  };
}

// ---------------------------------------------------------------------------
// Precarga
// ---------------------------------------------------------------------------

/**
 * Genera por adelantado el arte de una lista de personajes.
 *
 * El render procedural de un retrato cuesta unos pocos ms, pero hacerlo en el
 * fotograma en que aparece el cuadro de diálogo se nota. Conviene llamar a esto
 * al entrar en una escena, con los personajes que van a hablar en ella.
 */
export function preloadCharacters(ids: CharacterId[], moods: EvaMood[] = ['neutral']): void {
  if (typeof document === 'undefined') return;
  for (const id of ids) {
    const def = CHARACTERS[id];
    if (!def) continue;
    proceduralUrl(`sheet:${def.artId}`, () => spriteSheetFor(def.artId));
    for (const mood of moods) {
      if (!def.expressions.includes(mood)) continue;
      proceduralUrl(`portrait:${def.artId}:${mood}`, () => portraitFor(def.artId, mood));
    }
  }
}

/** Precarga todas las expresiones declaradas de un personaje. */
export function preloadAllMoods(id: CharacterId): void {
  const def = CHARACTERS[id];
  if (!def) return;
  preloadCharacters([id], [...def.expressions]);
}
