/**
 * asset-paths.mjs — dónde vive el archivo de cada personaje.
 *
 * Lo importan DOS consumidores que no comparten lenguaje: `data/rpg/characters.ts`
 * (TypeScript, navegador) y `scripts/rpg-art/bake.mjs` (Node). Tener la tabla
 * aquí, en JavaScript plano, es lo que garantiza que el horneado escriba
 * exactamente en las rutas que el registro va a pedir.
 *
 * Duplicar esta tabla en el script de horneado sería la forma más rápida de
 * acabar con PNG correctos en rutas que nadie consulta.
 */

export const ASSET_BASE = '/rpg/characters';

/** id de personaje -> carpeta y nombre de archivo. */
export const ASSET_LOCATION = {
  player_tomas: { group: 'player', slug: 'tomas' },
  player_renata: { group: 'player', slug: 'renata' },
  director_sofia: { group: 'director', slug: 'sofia' },
  rival_ignacio: { group: 'rival', slug: 'ignacio' },
  client_marta: { group: 'client', slug: 'marta' },
  counterparty_hector: { group: 'counterparty', slug: 'hector' },
  // Sala de audiencias. Se suman para el Capítulo 0, que es penal.
  judge_achurra: { group: 'court', slug: 'achurra' },
  prosecutor_naveas: { group: 'court', slug: 'naveas' },
  witness_zapata: { group: 'court', slug: 'zapata' },
  eva: { group: 'eva', slug: 'eva' },
  amb_procurador: { group: 'ambient', slug: 'procurador' },
  amb_administrativa: { group: 'ambient', slug: 'administrativa' },
  amb_estudiante: { group: 'ambient', slug: 'estudiante' },
  amb_funcionario: { group: 'ambient', slug: 'funcionario' },
  amb_senior: { group: 'ambient', slug: 'senior' },
  amb_visita: { group: 'ambient', slug: 'visita' },
};

export const ASSET_IDS = Object.keys(ASSET_LOCATION);

function locate(id) {
  const found = ASSET_LOCATION[id];
  if (!found) throw new Error(`[rpg/art] sin ubicación de assets para: ${id}`);
  return found;
}

/** Hoja de sprites. */
export function spritePath(id) {
  const { group, slug } = locate(id);
  return `${ASSET_BASE}/${group}/sprites/${slug}.png`;
}

/** Retrato de una expresión. */
export function portraitPath(id, mood) {
  const { group, slug } = locate(id);
  return `${ASSET_BASE}/${group}/portraits/${slug}-${mood}.png`;
}

/** Definición de clips que acompaña a la hoja. */
export function animationPath(id) {
  const { group, slug } = locate(id);
  return `${ASSET_BASE}/${group}/animations/${slug}.json`;
}

/** Tiras propias de EVA: idle especial y aparición. */
export function evaStripPath(kind) {
  return `${ASSET_BASE}/eva/animations/eva-${kind}.png`;
}

export const MANIFEST_PATH = `${ASSET_BASE}/manifest.json`;
