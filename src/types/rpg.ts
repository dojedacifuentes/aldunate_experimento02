/**
 * types/rpg.ts — contrato de personajes del RPG.
 *
 * Regla estructural del sistema: la lógica de juego NUNCA nombra un archivo.
 * Las escenas y los diálogos hablan de `id` y de `mood`; los nombres de archivo
 * existen en un solo sitio (data/rpg/characters.ts) y se resuelven en un solo
 * sitio (lib/rpg/characterArt.ts). Sustituir todo el arte definitivo no debería
 * tocar ni una escena ni una línea de diálogo.
 */

// ---------------------------------------------------------------------------
// Identidad
// ---------------------------------------------------------------------------

export type CharacterId =
  | 'player_tomas'
  | 'player_renata'
  | 'director_sofia'
  | 'rival_ignacio'
  | 'client_marta'
  | 'counterparty_hector'
  | 'judge_achurra'
  | 'prosecutor_naveas'
  | 'witness_zapata'
  | 'eva'
  | 'amb_procurador'
  | 'amb_administrativa'
  | 'amb_estudiante'
  | 'amb_funcionario'
  | 'amb_senior'
  | 'amb_visita';

export type CharacterRole =
  | 'player'
  | 'director'
  | 'rival'
  | 'client'
  | 'counterparty'
  | 'judge'
  | 'prosecutor'
  | 'witness'
  | 'guide'
  | 'ambient';

// ---------------------------------------------------------------------------
// Expresiones
// ---------------------------------------------------------------------------

/** Expresiones de los NPC principales. */
export type Mood = 'neutral' | 'friendly' | 'skeptical' | 'angry' | 'thinking' | 'surprised';

/** Estado especial de EVA: sólo ella lo admite. */
export type EvaMood = Mood | 'eva_glitch';

/** Cualquier mood aceptable en una línea de diálogo. */
export type AnyMood = EvaMood;

export const MOODS: readonly Mood[] = [
  'neutral',
  'friendly',
  'skeptical',
  'angry',
  'thinking',
  'surprised',
] as const;

// ---------------------------------------------------------------------------
// Arte
// ---------------------------------------------------------------------------

export type Direction = 'down' | 'up' | 'left' | 'right';

export type AnimationName =
  | 'idle_down'
  | 'idle_up'
  | 'idle_left'
  | 'idle_right'
  | 'walk_down'
  | 'walk_up'
  | 'walk_left'
  | 'walk_right'
  | 'talk'
  | 'thinking';

/**
 * Un clip es una fila de la hoja de sprites y una lista de columnas.
 * Nunca una lista de archivos: cambiar de 4 a 8 frames es cambiar este array.
 */
export interface AnimationClip {
  /** Fila de la hoja. */
  row: number;
  /** Columnas, en orden de reproducción. */
  frames: number[];
  fps: number;
  loop: boolean;
}

/** Geometría de una hoja de sprites. El runtime no asume nada: lo lee de aquí. */
export interface SpriteSheetRef {
  /** Ruta pública del PNG horneado, si existe. */
  src: string;
  /** Lado de la celda en px (48 o 64). */
  cell: number;
  columns: number;
  rows: number;
}

/** Retratos por expresión. Las rutas viven aquí y sólo aquí. */
export interface PortraitRef {
  /** Retrato por defecto: el que se usa si falta el mood pedido. */
  src: string;
  /** Lado del PNG en px (≈512). */
  size: number;
  /** Ruta por expresión. Puede estar incompleta: hay cadena de respaldo. */
  byMood: Partial<Record<EvaMood, string>>;
}

/**
 * Origen efectivo de una imagen, ya resuelto.
 * `procedural` significa que el asset definitivo aún no existe y el arte se
 * genera en el cliente con el mismo motor con el que se hornearía el PNG:
 * el respaldo es idéntico al asset, no un muñeco genérico.
 */
export type ResolvedArt =
  | { kind: 'baked'; src: string }
  | { kind: 'procedural'; artId: string };

// ---------------------------------------------------------------------------
// Diálogo
// ---------------------------------------------------------------------------

export type DialogueVoice = 'measured' | 'clipped' | 'warm' | 'dry' | 'formal' | 'synthetic';

/**
 * Cómo suena y cómo se ve este personaje cuando habla. Lo consume DialogueBox;
 * ninguna escena debería fijar colores de diálogo a mano.
 */
export interface DialogueStyle {
  /** Color del nombre en la caja. */
  nameColor: string;
  /** Filete/acento del cuadro. */
  accent: string;
  family: 'serif' | 'sans' | 'mono';
  /** ms por carácter en el efecto de escritura. */
  charDelay: number;
  voice: DialogueVoice;
  /** Variante visual del cuadro. */
  variant: 'default' | 'authority' | 'opposing' | 'client' | 'eva';
  /** Expresión con la que aparece si la línea no indica ninguna. */
  defaultMood: EvaMood;
}

/**
 * Una línea de diálogo.
 *
 * `portrait` es opcional a propósito: por defecto el retrato es el del hablante.
 * Se indica sólo cuando alguien habla mostrando otra cara (una llamada, un
 * recuerdo, EVA interviniendo sobre la escena de otro).
 */
export interface DialogueLine {
  /** Nombre mostrado. Si se omite, se toma del registro. */
  speaker?: string;
  /** Personaje que habla. */
  characterId: CharacterId;
  /** Retrato a mostrar, si no es el del hablante. */
  portrait?: CharacterId;
  mood?: EvaMood;
  text: string;
  /** Animación a forzar en el sprite del mapa mientras dura la línea. */
  pose?: AnimationName;
}

// ---------------------------------------------------------------------------
// NPC ambientales
// ---------------------------------------------------------------------------

export type AmbientActivity = 'walk' | 'sit' | 'work' | 'wait' | 'chat' | 'idle';

/** Un NPC ambiental colocado en el mapa. */
export interface AmbientNpc {
  /** Identificador de instancia, no de personaje: puede haber varios iguales. */
  key: string;
  characterId: CharacterId;
  x: number;
  y: number;
  /** Guion de comportamiento; se recorre en bucle. */
  routine: AmbientStep[];
  /** Frase breve al interactuar. No todos necesitan diálogo complejo. */
  line?: string;
  facing?: Direction;
}

export interface AmbientStep {
  activity: AmbientActivity;
  /** Duración en ms. */
  duration: number;
  /** Destino para `walk`, en coordenadas de mapa. */
  to?: { x: number; y: number };
  facing?: Direction;
}

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  /** Cargo/función legible. Se muestra en la ficha, no en el diálogo. */
  title: string;
  role: CharacterRole;
  sprite: SpriteSheetRef;
  portrait: PortraitRef;
  /** Expresiones que este personaje admite realmente. */
  expressions: readonly EvaMood[];
  animations: Record<AnimationName, AnimationClip>;
  dialogueStyle: DialogueStyle;
  /**
   * Clave del arte procedural. Es lo que une el registro con el motor de
   * dibujo cuando aún no hay PNG horneado. Coincide con el id por convención,
   * pero se declara explícitamente para poder romper esa coincidencia sin
   * tocar la lógica (p. ej. dos personajes que comparten diseño base).
   */
  artId: string;
  /** true mientras el arte sea procedural provisional. */
  provisionalArt: boolean;
}

/** Opción de avatar en la pantalla de inicio. */
export interface PlayerAvatarOption {
  id: CharacterId;
  label: string;
  blurb: string;
}
