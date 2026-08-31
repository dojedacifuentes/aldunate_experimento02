/** Declaraciones de la tabla de rutas de assets. */

export interface AssetLocation {
  group: string;
  slug: string;
}

export declare const ASSET_BASE: string;
export declare const ASSET_LOCATION: Record<string, AssetLocation>;
export declare const ASSET_IDS: string[];
export declare const MANIFEST_PATH: string;

export declare function spritePath(id: string): string;
export declare function portraitPath(id: string, mood: string): string;
export declare function animationPath(id: string): string;
export declare function evaStripPath(kind: 'idle' | 'appear'): string;
