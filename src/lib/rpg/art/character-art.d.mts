/**
 * Declaraciones de la fachada de arte.
 *
 * Es el único módulo de `lib/rpg/art/` que el resto del proyecto debería
 * importar. Todo lo que devuelve son lienzos: nada aquí sabe de rutas, de React
 * ni del sistema de archivos.
 */

import type { PixelCanvas } from './pixel-canvas.mjs';

export type ArtDirection = 'down' | 'up' | 'left' | 'right';
export type ArtPose = 'walk' | 'idle' | 'talk' | 'think';
export type ArtMood =
  | 'neutral'
  | 'friendly'
  | 'skeptical'
  | 'angry'
  | 'thinking'
  | 'surprised'
  | 'eva_glitch';

export interface SheetLayout {
  cell: number;
  columns: number;
  rows: number;
  rowsMap: { key: string; direction: ArtDirection }[];
}

/** Hoja completa de un personaje: 288×288 con la geometría por defecto. */
export declare function spriteSheetFor(artId: string): PixelCanvas;

/** Una celda suelta de 48×48, sin pasar por la hoja. */
export declare function spriteCellFor(
  artId: string,
  direction: ArtDirection,
  pose: ArtPose,
  frame: number,
): PixelCanvas;

/** Retrato de 512×512 con fondo transparente. */
export declare function portraitFor(artId: string, mood?: ArtMood): PixelCanvas;

/** Fotogramas de la aparición de EVA, ya escalados a 512. */
export declare function evaAppearFrames(steps?: number): PixelCanvas[];

/** Fotogramas del idle especial de EVA en el mapa (48×48). */
export declare function evaIdleFrames(direction?: ArtDirection): PixelCanvas[];

/** Los mismos fotogramas dispuestos en una tira horizontal, para hornear. */
export declare function evaIdleStrip(direction?: ArtDirection): PixelCanvas;
export declare function evaAppearStrip(steps?: number): PixelCanvas;

/** Ids con arte disponible en el motor. */
export declare function artIds(): string[];

/** Vacía la caché de lienzos. */
export declare function clearArtCache(): void;

export declare const SHEET_LAYOUT: SheetLayout;
export declare const CELL: number;
export declare const PORTRAIT_SIZE: number;
export declare const PORTRAIT_SCALE: number;
export declare const MOODS: string[];
export declare function getSpec(artId: string): Record<string, unknown>;
export declare const CHARACTER_SPECS: Record<string, Record<string, unknown>>;
