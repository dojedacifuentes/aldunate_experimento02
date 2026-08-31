/**
 * Dirección artística — ALDUNATE / RPG
 *
 * PIXEL ART CONTEMPORÁNEO x NOVELA GRÁFICA x DRAMA JURÍDICO x ESTÉTICA EDITORIAL.
 *
 * La paleta es cerrada a propósito: carbón, marfil, burdeos oscuro, dorado
 * apagado y gris piedra. Todo tono de piel, cabello o vestuario se elige dentro
 * de esa familia cromática para que los personajes se lean como un mismo libro
 * ilustrado y no como un set de assets sueltos.
 *
 * Prohibido en esta paleta: neón, cyan saturado, magenta, verde fosforescente.
 */

/** Núcleo de la dirección artística. */
export const ART = {
  ink: '#12100F',
  charcoal: '#1B1917',
  charcoalSoft: '#2A2724',
  charcoalLift: '#3A3632',

  ivory: '#EDE6D6',
  ivoryDim: '#D6CDB9',
  ivoryDeep: '#B9AF99',

  burgundy: '#8A2432',
  burgundyDeep: '#5A1620',
  burgundyLift: '#A84150',

  gold: '#B78C30',
  goldDim: '#8A6A24',
  goldLift: '#D6AE58',

  stone: '#6E6A63',
  stoneDim: '#4C4945',
  stoneLight: '#9A958C',
  stonePale: '#C2BCB1',

  /** Azul pizarra desaturado: familia carbón, nunca "azul tecnológico". */
  slate: '#2E3A4A',
  slateDim: '#1F2833',
  slateLift: '#46566B',
};

/** Tonos de piel. Apagados, editoriales, nunca saturados. */
export const SKIN = {
  porcelain: { base: '#E2C6AC', shade: '#C2A183', deep: '#9E7E60' },
  light: { base: '#D9B694', shade: '#B89273', deep: '#946F52' },
  warm: { base: '#C79C77', shade: '#A57A57', deep: '#83603F' },
  olive: { base: '#B08A66', shade: '#8F6B4B', deep: '#6F5136' },
  tan: { base: '#9A6E4C', shade: '#7C5537', deep: '#5E3F27' },
  deep: { base: '#714C33', shade: '#583924', deep: '#3F2717' },
};

/** Cabello. Sin colores imposibles: el mundo es un estudio jurídico. */
export const HAIR = {
  jet: { base: '#221D1A', light: '#38302B' },
  darkBrown: { base: '#3A2A20', light: '#54402F' },
  brown: { base: '#573F2D', light: '#755740' },
  ash: { base: '#6E6257', light: '#8B7E70' },
  auburn: { base: '#6B2E22', light: '#8C4433' },
  sand: { base: '#9A8666', light: '#B7A183' },
  silver: { base: '#8E8880', light: '#B3ADA4' },
  white: { base: '#B9B4AB', light: '#D8D3C9' },
};

/** Vestuario: familia carbón / piedra / burdeos, con marfil para camisería. */
export const CLOTH = {
  charcoalSuit: { base: '#35322F', shade: '#252220', light: '#474340' },
  slateSuit: { base: '#2E3A4A', shade: '#1F2833', light: '#435266' },
  stoneSuit: { base: '#5A5650', shade: '#403D39', light: '#736E66' },
  burgundySuit: { base: '#5F2028', shade: '#41151B', light: '#7C2F39' },
  sandSuit: { base: '#8A7C63', shade: '#665B47', light: '#A79781' },
  inkSuit: { base: '#262422', shade: '#171615', light: '#3A3735' },
};

/** Camisería / blusas. */
export const SHIRT = {
  ivory: '#EDE6D6',
  bone: '#DCD3C0',
  paleStone: '#C7C2B7',
  paleBlue: '#B9C4CE',
  burgundy: '#7A2230',
};

/** Acentos: corbatas, pañuelos, carpetas, detalles metálicos. */
export const ACCENT = {
  burgundy: '#7A2230',
  gold: '#B78C30',
  stone: '#6E6A63',
  ink: '#1B1917',
  slate: '#2E3A4A',
};

/** Contorno tipo tinta de novela gráfica. */
export const OUTLINE = '#100E0D';

/** Identidad cromática de EVA: marfil frío, carbón y oro. Nunca cyan. */
export const EVA_PALETTE = {
  skin: { base: '#DED6C6', shade: '#BEB6A6', deep: '#9C9484' },
  hair: { base: '#1E1C1B', light: '#33302D' },
  suit: { base: '#241F22', shade: '#171416', light: '#3A3237' },
  shirt: '#E7E0D0',
  accent: '#B78C30',
  /** Desplazamientos de canal para el glitch: burdeos y oro, no RGB neón. */
  glitchA: '#8A2432',
  glitchB: '#B78C30',
  scanline: '#EDE6D6',
};
