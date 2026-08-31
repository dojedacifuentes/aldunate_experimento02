/**
 * data/rpg/characters.ts — REGISTRO CENTRAL DE PERSONAJES.
 *
 * Este archivo es el único lugar del proyecto donde aparecen rutas de assets de
 * personaje. Escenas, diálogos, mapas y componentes trabajan con `CharacterId` y
 * `Mood`; nunca con nombres de archivo. Consecuencia práctica: se puede sustituir
 * todo el arte definitivo editando sólo este archivo, sin tocar una sola escena.
 *
 * TODO: FINAL CHARACTER ART — todo el reparto usa arte procedural provisional
 * (`provisionalArt: true`). Es original y coherente con la dirección artística,
 * pero está pensado para ser reemplazado. Para sustituir a un personaje:
 *
 *   1. dejar los PNG en /public/rpg/characters/<grupo>/sprites|portraits/
 *   2. ajustar aquí `sprite.src`, `portrait.src` y `portrait.byMood`
 *   3. poner `provisionalArt: false`
 *
 * Si la hoja nueva no es de 6x6 celdas de 48 px, basta ajustar `sprite` y los
 * `animations`: el runtime no asume ninguna geometría.
 *
 * NOTA DE DERECHOS: todos los diseños son originales. Ninguno deriva de actores,
 * personajes de ficción ajenos, imágenes protegidas ni del parecido de personas
 * reales.
 */

import type {
  AnimationClip,
  AnimationName,
  CharacterDefinition,
  CharacterId,
  DialogueStyle,
  EvaMood,
  Mood,
  PlayerAvatarOption,
} from '@/types/rpg';
import { portraitPath, spritePath } from '@/lib/rpg/art/asset-paths.mjs';

const ART = {
  charcoal: '#1B1917',
  ivory: '#EDE6D6',
  ivoryDim: '#B9AF99',
  burgundy: '#8A2432',
  gold: '#B78C30',
  stone: '#6E6A63',
  stoneLight: '#9A958C',
} as const;

/** Geometría por defecto de las hojas horneadas: 6 columnas x 6 filas de 48 px. */
const SHEET = { cell: 48, columns: 6, rows: 6 } as const;

const ALL_MOODS: readonly Mood[] = ['neutral', 'friendly', 'skeptical', 'angry', 'thinking', 'surprised'];

/**
 * Animaciones estándar.
 *
 * Filas de la hoja: 0 down, 1 up, 2 left, 3 right, 4 talk, 5 thinking.
 * En las filas direccionales, las columnas 0-3 son el ciclo de caminata y las
 * columnas 4-5 el idle. Cambiar el número de frames es cambiar estos arrays.
 */
function standardAnimations(): Record<AnimationName, AnimationClip> {
  const idle = (row: number): AnimationClip => ({ row, frames: [4, 5], fps: 2, loop: true });
  const walk = (row: number): AnimationClip => ({ row, frames: [0, 1, 2, 3], fps: 8, loop: true });
  return {
    idle_down: idle(0),
    idle_up: idle(1),
    idle_left: idle(2),
    idle_right: idle(3),
    walk_down: walk(0),
    walk_up: walk(1),
    walk_left: walk(2),
    walk_right: walk(3),
    talk: { row: 4, frames: [0, 1, 2, 3], fps: 6, loop: true },
    thinking: { row: 5, frames: [0, 1, 2, 3], fps: 3, loop: true },
  };
}

/**
 * Las rutas salen de `lib/rpg/art/asset-paths.mjs`, que también usa el script de
 * horneado. Es la única forma de garantizar que los PNG se escriban exactamente
 * donde este registro los va a buscar.
 */
function portraits(id: CharacterId, moods: readonly EvaMood[]) {
  const byMood: Partial<Record<EvaMood, string>> = {};
  for (const m of moods) byMood[m] = portraitPath(id, m);
  return { src: portraitPath(id, 'neutral'), size: 512, byMood };
}

function sheet(id: CharacterId) {
  return { src: spritePath(id), ...SHEET };
}

/** Estilos de diálogo. Definen cómo suena cada quien antes de escribir una línea. */
const STYLE: Record<string, DialogueStyle> = {
  junior: {
    nameColor: ART.ivory,
    accent: ART.stone,
    family: 'serif',
    charDelay: 12,
    voice: 'measured',
    variant: 'default',
    defaultMood: 'neutral',
  },
  authority: {
    nameColor: ART.gold,
    accent: ART.gold,
    family: 'serif',
    charDelay: 15,
    voice: 'dry',
    variant: 'authority',
    defaultMood: 'skeptical',
  },
  opposing: {
    nameColor: ART.ivoryDim,
    accent: ART.burgundy,
    family: 'serif',
    charDelay: 10,
    voice: 'clipped',
    variant: 'opposing',
    defaultMood: 'neutral',
  },
  client: {
    nameColor: ART.ivory,
    accent: ART.stoneLight,
    family: 'serif',
    charDelay: 13,
    voice: 'warm',
    variant: 'client',
    defaultMood: 'neutral',
  },
  eva: {
    nameColor: ART.gold,
    accent: ART.gold,
    family: 'mono',
    charDelay: 9,
    voice: 'synthetic',
    variant: 'eva',
    defaultMood: 'neutral',
  },
  ambient: {
    nameColor: ART.stoneLight,
    accent: ART.stone,
    family: 'serif',
    charDelay: 11,
    voice: 'formal',
    variant: 'default',
    defaultMood: 'neutral',
  },
};

// ---------------------------------------------------------------------------
// El reparto
// ---------------------------------------------------------------------------

export const CHARACTERS: Record<CharacterId, CharacterDefinition> = {
  // --- Jugador -------------------------------------------------------------
  player_tomas: {
    id: 'player_tomas',
    name: 'Tomás Iriarte',
    title: 'Abogado junior',
    role: 'player',
    artId: 'player_tomas',
    provisionalArt: true,
    sprite: sheet('player_tomas'),
    portrait: portraits('player_tomas', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.junior,
  },
  player_renata: {
    id: 'player_renata',
    name: 'Renata Vergara',
    title: 'Abogada junior',
    role: 'player',
    artId: 'player_renata',
    provisionalArt: true,
    sprite: sheet('player_renata'),
    portrait: portraits('player_renata', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.junior,
  },

  // --- Socia directora -----------------------------------------------------
  director_sofia: {
    id: 'director_sofia',
    name: 'Sofía Aldana',
    title: 'Socia directora',
    role: 'director',
    artId: 'director_sofia',
    provisionalArt: true,
    sprite: sheet('director_sofia'),
    portrait: portraits('director_sofia', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.authority,
  },

  // --- Abogado rival -------------------------------------------------------
  rival_ignacio: {
    id: 'rival_ignacio',
    name: 'Ignacio Bravo',
    title: 'Abogado de la contraria',
    role: 'rival',
    artId: 'rival_ignacio',
    provisionalArt: true,
    sprite: sheet('rival_ignacio'),
    portrait: portraits('rival_ignacio', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.opposing,
  },

  // --- Clienta -------------------------------------------------------------
  client_marta: {
    id: 'client_marta',
    name: 'Marta Quiroga',
    title: 'Clienta',
    role: 'client',
    artId: 'client_marta',
    provisionalArt: true,
    sprite: sheet('client_marta'),
    portrait: portraits('client_marta', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.client,
  },

  // --- Contraparte ---------------------------------------------------------
  counterparty_hector: {
    id: 'counterparty_hector',
    name: 'Héctor Solís',
    title: 'Contraparte',
    role: 'counterparty',
    artId: 'counterparty_hector',
    provisionalArt: true,
    sprite: sheet('counterparty_hector'),
    portrait: portraits('counterparty_hector', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.opposing,
  },

  // --- Sala de audiencias --------------------------------------------------
  // Incorporados para el Capítulo 0. Ninguno corresponde a una persona real,
  // a un tribunal real ni a una causa real.
  judge_achurra: {
    id: 'judge_achurra',
    name: 'Isabel Achurra',
    title: 'Presidenta del tribunal',
    role: 'judge',
    artId: 'judge_achurra',
    provisionalArt: true,
    sprite: sheet('judge_achurra'),
    portrait: portraits('judge_achurra', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.authority,
  },
  judge_pinilla: {
    id: 'judge_pinilla',
    name: 'Óscar Pinilla',
    title: 'Juez · toma nota de todo',
    role: 'judge',
    artId: 'judge_pinilla',
    provisionalArt: true,
    sprite: sheet('judge_pinilla'),
    portrait: portraits('judge_pinilla', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.authority,
  },
  judge_riquelme: {
    id: 'judge_riquelme',
    name: 'Amanda Riquelme',
    title: 'Jueza · hace la pregunta incómoda',
    role: 'judge',
    artId: 'judge_riquelme',
    provisionalArt: true,
    sprite: sheet('judge_riquelme'),
    portrait: portraits('judge_riquelme', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.authority,
  },
  prosecutor_naveas: {
    id: 'prosecutor_naveas',
    name: 'Rodrigo Naveas',
    title: 'Fiscal adjunto',
    role: 'prosecutor',
    artId: 'prosecutor_naveas',
    provisionalArt: true,
    sprite: sheet('prosecutor_naveas'),
    portrait: portraits('prosecutor_naveas', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.opposing,
  },
  witness_zapata: {
    id: 'witness_zapata',
    name: 'Rocío Zapata',
    title: 'Testigo de cargo · contadora',
    role: 'witness',
    artId: 'witness_zapata',
    provisionalArt: true,
    sprite: sheet('witness_zapata'),
    portrait: portraits('witness_zapata', ALL_MOODS),
    expressions: ALL_MOODS,
    animations: standardAnimations(),
    dialogueStyle: STYLE.client,
  },

  // --- EVA -----------------------------------------------------------------
  // Único personaje con `eva_glitch`. Su idle y su aparición son hojas aparte:
  // el runtime las pide por nombre de animación, no por ruta.
  eva: {
    id: 'eva',
    name: 'EVA',
    title: 'Representante legal de tecnologías obsoletas',
    role: 'guide',
    artId: 'eva',
    provisionalArt: true,
    sprite: sheet('eva'),
    portrait: portraits('eva', [...ALL_MOODS, 'eva_glitch']),
    expressions: [...ALL_MOODS, 'eva_glitch'],
    animations: standardAnimations(),
    dialogueStyle: STYLE.eva,
  },

  // --- NPC ambientales -----------------------------------------------------
  amb_procurador: {
    id: 'amb_procurador',
    name: 'Nico Fuentes',
    title: 'Procurador',
    role: 'ambient',
    artId: 'amb_procurador',
    provisionalArt: true,
    sprite: sheet('amb_procurador'),
    portrait: portraits('amb_procurador', ['neutral']),
    expressions: ['neutral'],
    animations: standardAnimations(),
    dialogueStyle: STYLE.ambient,
  },
  amb_administrativa: {
    id: 'amb_administrativa',
    name: 'Paula Mesa',
    title: 'Administración',
    role: 'ambient',
    artId: 'amb_administrativa',
    provisionalArt: true,
    sprite: sheet('amb_administrativa'),
    portrait: portraits('amb_administrativa', ['neutral']),
    expressions: ['neutral'],
    animations: standardAnimations(),
    dialogueStyle: STYLE.ambient,
  },
  amb_estudiante: {
    id: 'amb_estudiante',
    name: 'Emilia Rojas',
    title: 'Estudiante en práctica',
    role: 'ambient',
    artId: 'amb_estudiante',
    provisionalArt: true,
    sprite: sheet('amb_estudiante'),
    portrait: portraits('amb_estudiante', ['neutral', 'friendly']),
    expressions: ['neutral', 'friendly'],
    animations: standardAnimations(),
    dialogueStyle: STYLE.ambient,
  },
  amb_funcionario: {
    id: 'amb_funcionario',
    name: 'Óscar Peña',
    title: 'Funcionario judicial',
    role: 'ambient',
    artId: 'amb_funcionario',
    provisionalArt: true,
    sprite: sheet('amb_funcionario'),
    portrait: portraits('amb_funcionario', ['neutral', 'skeptical']),
    expressions: ['neutral', 'skeptical'],
    animations: standardAnimations(),
    dialogueStyle: STYLE.ambient,
  },
  amb_senior: {
    id: 'amb_senior',
    name: 'Álvaro Ferrán',
    title: 'Abogado senior',
    role: 'ambient',
    artId: 'amb_senior',
    provisionalArt: true,
    sprite: sheet('amb_senior'),
    portrait: portraits('amb_senior', ['neutral', 'thinking']),
    expressions: ['neutral', 'thinking'],
    animations: standardAnimations(),
    dialogueStyle: STYLE.ambient,
  },
  amb_visita: {
    id: 'amb_visita',
    name: 'Sra. Bustos',
    title: 'Visita en espera',
    role: 'ambient',
    artId: 'amb_visita',
    provisionalArt: true,
    sprite: sheet('amb_visita'),
    portrait: portraits('amb_visita', ['neutral']),
    expressions: ['neutral'],
    animations: standardAnimations(),
    dialogueStyle: STYLE.ambient,
  },
};

// ---------------------------------------------------------------------------
// Accesos
// ---------------------------------------------------------------------------

export const CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];

export function getCharacter(id: CharacterId): CharacterDefinition {
  const found = CHARACTERS[id];
  if (!found) throw new Error(`[rpg] personaje desconocido: ${id}`);
  return found;
}

export function charactersByRole(role: CharacterDefinition['role']): CharacterDefinition[] {
  return CHARACTER_IDS.map((id) => CHARACTERS[id]).filter((c) => c.role === role);
}

/**
 * Resuelve el mood efectivo de un personaje.
 *
 * Cadena de respaldo: mood pedido -> neutral -> primera expresión declarada.
 * Así una línea puede pedir `angry` a un NPC ambiental que sólo tiene `neutral`
 * sin romper nada: se degrada, no falla.
 */
export function resolveMood(id: CharacterId, mood?: EvaMood): EvaMood {
  const character = getCharacter(id);
  if (mood && character.expressions.includes(mood)) return mood;
  if (character.expressions.includes('neutral')) return 'neutral';
  return character.expressions[0];
}

/** Opciones del selector de avatar al empezar la partida. */
export const PLAYER_AVATARS: PlayerAvatarOption[] = [
  {
    id: 'player_tomas',
    label: 'Tomás Iriarte',
    blurb: 'Metódico. Lee dos veces antes de firmar una vez.',
  },
  {
    id: 'player_renata',
    label: 'Renata Vergara',
    blurb: 'Rápida. Encuentra la cláusula antes de que le expliquen el contrato.',
  },
];

export const DEFAULT_PLAYER_ID: CharacterId = 'player_tomas';

/** Personajes que aún usan arte provisional. Alimenta el aviso de la ficha. */
export function provisionalArtIds(): CharacterId[] {
  return CHARACTER_IDS.filter((id) => CHARACTERS[id].provisionalArt);
}
