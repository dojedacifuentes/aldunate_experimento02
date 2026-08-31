/**
 * Declaraciones del búfer de píxeles.
 *
 * El motor de arte está escrito en `.mjs` a propósito: tiene que ejecutarse tal
 * cual en Node (para hornear los PNG) y en el navegador (para el render
 * procedural), sin pasar por el compilador. Estas declaraciones son el puente
 * para que el resto del proyecto, que sí es TypeScript, lo consuma con tipos.
 */

export type ColorInput = string | number[];

export declare function parseColor(color: ColorInput): number[];
export declare function mixColor(a: ColorInput, b: ColorInput, t: number): number[];
export declare function seededRandom(seed: string | number): () => number;

export declare class PixelCanvas {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;

  constructor(width: number, height: number);

  clone(): PixelCanvas;
  idx(x: number, y: number): number;
  get(x: number, y: number): number[];
  solid(x: number, y: number, threshold?: number): boolean;

  px(x: number, y: number, color: ColorInput, alpha?: number): this;
  shade(x: number, y: number, color: ColorInput, alpha?: number): this;
  clearPx(x: number, y: number): this;
  clearRect(x: number, y: number, w: number, h: number): this;

  rect(x: number, y: number, w: number, h: number, color: ColorInput, alpha?: number): this;
  rectC(cx: number, y: number, w: number, h: number, color: ColorInput, alpha?: number): this;
  hline(x: number, y: number, w: number, color: ColorInput, alpha?: number): this;
  vline(x: number, y: number, h: number, color: ColorInput, alpha?: number): this;
  line(x0: number, y0: number, x1: number, y1: number, color: ColorInput, alpha?: number): this;
  ellipse(cx: number, cy: number, rx: number, ry: number, color: ColorInput, alpha?: number): this;
  roundRect(x: number, y: number, w: number, h: number, r: number, color: ColorInput, alpha?: number): this;
  taper(cx: number, y: number, h: number, wTop: number, wBottom: number, color: ColorInput, alpha?: number): this;

  blit(src: PixelCanvas, dx: number, dy: number): this;
  crop(x: number, y: number, w: number, h: number): PixelCanvas;
  offset(dx: number, dy: number): PixelCanvas;

  exteriorMask(): Uint8Array;
  rimLight(color: ColorInput, alpha?: number): this;
  inkOutline(color: ColorInput, alpha?: number): this;

  scale(factor: number): PixelCanvas;
  toRGBA(): Uint8ClampedArray;
}
