/**
 * character-specs.mjs — parámetros de dibujo de cada personaje.
 *
 * Esto es la CAPA DE ARTE, no la capa de juego. Aquí sólo vive cómo se dibuja
 * un personaje. Quién es, qué dice y cómo se llama vive en data/rpg/characters.ts.
 * La única cosa que ambas capas comparten es el `id`.
 *
 * Todos los diseños son originales y se construyen a partir de la paleta cerrada
 * del proyecto. Ninguno se basa en personas reales ni en obras protegidas.
 *
 * Lectura de casting:
 *   - Los dos juniors comparten el traje de la casa (carbón). Es deliberado:
 *     visualmente son "los nuevos", intercambiables para el estudio.
 *   - Sofía Aldana rompe con tinta + plata + oro: jerarquía.
 *   - Ignacio Bravo usa gris piedra claro y oro: viene de fuera, y se nota.
 *   - Marta Quiroga y Héctor Solís no son abogados: arena y burdeos, fuera del
 *     uniforme profesional.
 *   - EVA no tiene tela: tiene interfaz.
 */

import { SKIN, HAIR, CLOTH, SHIRT, ACCENT, EVA_PALETTE } from './palette.mjs';

/** @type {Record<string, import('./figure-sprite.mjs').SpriteSpec>} */
export const CHARACTER_SPECS = {
  // --- Personaje jugador -----------------------------------------------------
  player_tomas: {
    skin: SKIN.light,
    hair: HAIR.darkBrown,
    hairStyle: 'sidePart',
    cloth: CLOTH.charcoalSuit,
    shirt: SHIRT.ivory,
    accent: ACCENT.burgundy,
    neckwear: 'tie',
    build: 'regular',
    glasses: false,
    prop: 'folder',
    heightOffset: 0,
  },
  player_renata: {
    skin: SKIN.warm,
    hair: HAIR.jet,
    hairStyle: 'ponytail',
    cloth: CLOTH.charcoalSuit,
    shirt: SHIRT.bone,
    accent: ACCENT.gold,
    neckwear: 'scarf',
    build: 'slim',
    glasses: false,
    prop: 'folder',
    heightOffset: 1,
  },

  // --- Socia directora -------------------------------------------------------
  director_sofia: {
    skin: SKIN.porcelain,
    hair: HAIR.silver,
    hairStyle: 'bob',
    cloth: CLOTH.inkSuit,
    shirt: SHIRT.ivory,
    accent: ACCENT.gold,
    neckwear: 'openCollar',
    build: 'regular',
    glasses: true,
    prop: 'none',
    heightOffset: 0,
  },

  // --- Abogado rival ---------------------------------------------------------
  rival_ignacio: {
    skin: SKIN.olive,
    hair: HAIR.jet,
    hairStyle: 'swept',
    cloth: CLOTH.stoneSuit,
    shirt: SHIRT.ivory,
    accent: ACCENT.gold,
    neckwear: 'tie',
    build: 'broad',
    glasses: false,
    prop: 'briefcase',
    heightOffset: -1,
  },

  // --- Clienta ---------------------------------------------------------------
  client_marta: {
    skin: SKIN.tan,
    hair: HAIR.auburn,
    hairStyle: 'long',
    cloth: CLOTH.sandSuit,
    shirt: SHIRT.ivory,
    accent: ACCENT.burgundy,
    neckwear: 'scarf',
    build: 'regular',
    glasses: false,
    prop: 'none',
    heightOffset: 0,
  },

  // --- Contraparte -----------------------------------------------------------
  counterparty_hector: {
    skin: SKIN.light,
    hair: HAIR.silver,
    hairStyle: 'balding',
    cloth: CLOTH.burgundySuit,
    shirt: SHIRT.paleStone,
    accent: ACCENT.ink,
    neckwear: 'tie',
    build: 'broad',
    glasses: false,
    prop: 'none',
    heightOffset: -1,
  },

  // --- Sala de audiencias ----------------------------------------------------
  // Tres incorporaciones del Capítulo 0. Lectura de casting: el tribunal viste
  // tinta (autoridad, como Sofía); la fiscalía viste pizarra (institución, no
  // estudio); la testigo no es abogada y se nota — arena, fuera del uniforme.
  //
  // PENDIENTE DE ARTE: la toga no existe todavía como prenda en el motor. La
  // presidenta se dibuja con traje tinta y acento oro. Ver docs/rpg/ART_DIRECTION.md.
  judge_achurra: {
    skin: SKIN.porcelain,
    hair: HAIR.silver,
    hairStyle: 'bun',
    cloth: CLOTH.inkSuit,
    shirt: SHIRT.ivory,
    accent: ACCENT.gold,
    neckwear: 'openCollar',
    build: 'regular',
    glasses: true,
    prop: 'none',
    heightOffset: 0,
  },
  prosecutor_naveas: {
    skin: SKIN.warm,
    hair: HAIR.jet,
    hairStyle: 'swept',
    cloth: CLOTH.slateSuit,
    shirt: SHIRT.paleBlue,
    accent: ACCENT.slate,
    neckwear: 'tie',
    build: 'broad',
    glasses: false,
    prop: 'folder',
    heightOffset: 0,
  },
  witness_zapata: {
    skin: SKIN.light,
    hair: HAIR.brown,
    hairStyle: 'ponytail',
    cloth: CLOTH.sandSuit,
    shirt: SHIRT.bone,
    accent: ACCENT.stone,
    neckwear: 'openCollar',
    build: 'slim',
    glasses: true,
    prop: 'none',
    heightOffset: 0,
  },

  // --- EVA -------------------------------------------------------------------
  // EVA se dibuja con la misma anatomía que el resto: es lo que la mantiene
  // dentro del mundo. Lo que la separa es la capa de interferencia, no el diseño.
  eva: {
    skin: EVA_PALETTE.skin,
    hair: EVA_PALETTE.hair,
    hairStyle: 'bob',
    cloth: EVA_PALETTE.suit,
    shirt: EVA_PALETTE.shirt,
    accent: EVA_PALETTE.accent,
    neckwear: 'openCollar',
    build: 'slim',
    glasses: false,
    prop: 'none',
    heightOffset: 0,
    digital: true,
  },

  // --- NPC ambientales -------------------------------------------------------
  amb_procurador: {
    skin: SKIN.olive,
    hair: HAIR.brown,
    hairStyle: 'short',
    cloth: CLOTH.stoneSuit,
    shirt: SHIRT.bone,
    accent: ACCENT.stone,
    neckwear: 'openCollar',
    build: 'slim',
    glasses: false,
    prop: 'satchel',
    heightOffset: 0,
  },
  amb_administrativa: {
    skin: SKIN.warm,
    hair: HAIR.darkBrown,
    hairStyle: 'bob',
    cloth: CLOTH.slateSuit,
    shirt: SHIRT.paleStone,
    accent: ACCENT.burgundy,
    neckwear: 'lanyard',
    build: 'regular',
    glasses: false,
    prop: 'mug',
    heightOffset: 0,
  },
  amb_estudiante: {
    skin: SKIN.deep,
    hair: HAIR.jet,
    hairStyle: 'curls',
    cloth: CLOTH.sandSuit,
    shirt: SHIRT.ivory,
    accent: ACCENT.slate,
    neckwear: 'openCollar',
    build: 'slim',
    glasses: true,
    prop: 'satchel',
    heightOffset: 1,
  },
  amb_funcionario: {
    skin: SKIN.light,
    hair: HAIR.ash,
    hairStyle: 'balding',
    cloth: CLOTH.stoneSuit,
    shirt: SHIRT.paleBlue,
    accent: ACCENT.slate,
    neckwear: 'tie',
    build: 'broad',
    glasses: true,
    prop: 'folder',
    heightOffset: 0,
  },
  amb_senior: {
    skin: SKIN.warm,
    hair: HAIR.ash,
    hairStyle: 'swept',
    cloth: CLOTH.charcoalSuit,
    shirt: SHIRT.ivory,
    accent: ACCENT.burgundy,
    neckwear: 'tie',
    build: 'regular',
    glasses: false,
    prop: 'briefcase',
    heightOffset: 0,
  },
  amb_visita: {
    skin: SKIN.porcelain,
    hair: HAIR.white,
    hairStyle: 'bun',
    cloth: CLOTH.stoneSuit,
    shirt: SHIRT.bone,
    accent: ACCENT.gold,
    neckwear: 'scarf',
    build: 'regular',
    glasses: true,
    prop: 'none',
    heightOffset: 1,
  },
};

/** Ayuda para NPC ambientales generados: variantes deterministas por semilla. */
export const AMBIENT_POOL = Object.keys(CHARACTER_SPECS).filter((k) => k.startsWith('amb_'));

/** @param {string} id */
export function getSpec(id) {
  return CHARACTER_SPECS[id] ?? CHARACTER_SPECS.amb_procurador;
}
