/**
 * Tipos del dominio del RPG.
 *
 * Regla transversal: el contenido narrativo y jurídico vive en `src/data/rpg`
 * como datos tipados. Ningún componente visual —ni ninguna escena Phaser—
 * contiene una línea de diálogo. Cambiar el guion no debe ser cambiar código.
 *
 * La identidad visual y el reparto viven en `src/types/rpg.ts` y
 * `src/data/rpg/characters.ts`. Aquí sólo se los referencia por `CharacterId`:
 * este archivo no conoce ninguna ruta de asset.
 */

import type { CharacterId, EvaMood } from '@/types/rpg';

/* ─────────────────────────────── Personaje ─────────────────────────────── */

export type Especialidad = 'litigacion' | 'investigacion' | 'negociacion';

/** Los dos avatares jugables del registro de personajes. */
export type AvatarId = Extract<CharacterId, 'player_tomas' | 'player_renata'>;

/** Las seis estadísticas del §15 del documento de visión. */
export interface Stats {
  argumentacion: number;
  investigacion: number;
  negociacion: number;
  estrategia: number;
  integridad: number;
  prestigio: number;
}

export interface Player {
  nombre: string;
  avatar: AvatarId;
  especialidad: Especialidad;
  stats: Stats;
  xp: number;
  nivel: number;
}

export type SkillId = 'analizar' | 'presionar' | 'objetar' | 'prueba' | 'negociar';

export interface Skill {
  id: SkillId;
  tecla: string;
  nombre: string;
  descripcion: string;
  stat: keyof Stats;
}

/* ─────────────────────────────── Evidencia ─────────────────────────────── */

export interface EvidenceItem {
  id: string;
  nombre: string;
  resumen: string;
  detalle: string;
  /** Identificador en `legalSources`, cuando la pieza se apoya en una norma. */
  legalSourceId?: string;
}

/* ───────────────────────── Fuentes jurídicas ───────────────────────── */

/**
 * Estado de verificación de una referencia normativa.
 *
 * Regla dura: **nada se muestra como Derecho vigente sin verificar**. Mientras
 * `estado` sea `UNVERIFIED`, la interfaz lo rotula y no lo presenta como cita.
 */
export type EstadoVerificacion = 'VERIFIED' | 'UNVERIFIED';

export interface LegalSource {
  id: string;
  jurisdiccion: 'CL';
  cuerpo: string;
  articulo?: string;
  resumen: string;
  urlOficial?: string;
  estado: EstadoVerificacion;
  /** Qué falta para poder marcarla `VERIFIED`. */
  pendiente?: string;
}

/* ─────────────────── Puestos de la sala de audiencias ─────────────────── */

/**
 * A qué mira la cámara. Son puestos de la sala, no personajes: si mañana
 * cambia quién ocupa la testigo, el guion no se toca.
 */
export type FocusTarget =
  | 'estrado'
  | 'fiscalia'
  | 'defensa'
  | 'testigo'
  | 'publico'
  | 'sala';

/* ────────────────────────── Guion ────────────────────────── */

/**
 * Una línea con dirección de escena.
 *
 * Antes una línea era una cadena y el nodo entero tenía un solo hablante y un
 * solo encuadre: la cámara se plantaba al entrar y no se movía aunque
 * respondieran tres personas distintas. Por eso las transiciones no cuajaban.
 *
 * Ahora cada línea puede decir quién la dice, a quién se la dice y con qué
 * cara. La cámara se entera y hace su trabajo; el guion se lee como un guion.
 */
export interface ScriptLine {
  text: string;
  /** Quién la dice. Por defecto, el `speaker` del nodo. */
  quien?: CharacterId;
  /**
   * A quién se la dice. La cámara abre para encuadrar a los dos.
   *
   * Admite un puesto además de una persona porque quién ocupa la defensa
   * depende del avatar que se haya elegido, y el guion no puede saberlo.
   */
  a?: CharacterId | FocusTarget;
  /** Con qué cara. Por defecto, la del estilo del personaje. */
  mood?: EvaMood;
}

/** Texto pelado o línea dirigida. Las dos formas conviven. */
export type Linea = string | ScriptLine;

/* ────────────────────────── Grafo de escena ────────────────────────── */

export type NodeId = string;

export interface Effects {
  xp?: number;
  stats?: Partial<Stats>;
  flag?: string;
  otorgaEvidencia?: string;
}

interface BaseNode {
  id: NodeId;
  /** A qué punto de la sala mira la cámara al entrar en el nodo. */
  focus?: FocusTarget;
  /** Comentario de EVA al entrar. Uno por nodo como máximo. */
  eva?: string;
}

export interface DialogueNode extends BaseNode {
  kind: 'dialogo';
  /** Quién lleva la voz del nodo. Cada línea puede cedérsela a otro. */
  speaker: CharacterId;
  mood?: EvaMood;
  lines: Linea[];
  next: NodeId;
}

export interface ChoiceOption {
  id: string;
  label: string;
  skill?: SkillId;
  /** Si acertar suma impulso y rompe combo al fallar. */
  acierta?: boolean;
  efectos?: Effects;
  /**
   * Lo que pasa al elegir. Una cadena es narración; una línea con `quien` es
   * alguien contestando, que es como se consigue que la sala reaccione en el
   * acto en vez de en el nodo siguiente.
   */
  respuesta: Linea[];
  next: NodeId;
}

export interface ChoiceNode extends BaseNode {
  kind: 'decision';
  speaker?: CharacterId;
  mood?: EvaMood;
  prompt: string;
  opciones: ChoiceOption[];
}

export interface ScanTarget {
  id: string;
  label: string;
  acierta?: boolean;
  revela: string;
  otorgaEvidencia?: string;
}

export interface ScanNode extends BaseNode {
  kind: 'scan';
  prompt: string;
  objetivos: ScanTarget[];
  next: NodeId;
}

export interface EvidenceNode extends BaseNode {
  kind: 'prueba';
  prompt: string;
  afirmacion: string;
  evidenciaCorrecta: string;
  aciertoTexto: string[];
  falloTexto: string[];
  next: NodeId;
}

export type SlotId = 'hecho' | 'prueba' | 'norma';

export interface ClosingSlot {
  id: SlotId;
  label: string;
  ayuda: string;
  correcta: string;
  opciones: { id: string; label: string }[];
}

export interface ClosingNode extends BaseNode {
  kind: 'alegato';
  prompt: string;
  slots: ClosingSlot[];
  next: NodeId;
}

export interface EndNode extends BaseNode {
  kind: 'fin';
  desenlace: 'absolucion' | 'condena';
  titulo: string;
  cuerpo: string[];
  /** Golpe narrativo posterior al veredicto. */
  epilogo: string[];
}

export type SceneNode =
  | DialogueNode
  | ChoiceNode
  | ScanNode
  | EvidenceNode
  | ClosingNode
  | EndNode;

export interface Chapter {
  id: string;
  titulo: string;
  subtitulo: string;
  entorno: string;
  objetivo: string;
  inicio: NodeId;
  nodos: Record<NodeId, SceneNode>;
}
