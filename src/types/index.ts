/**
 * Tipos del dominio. El contenido vive como datos tipados en `src/data`,
 * nunca incrustado dentro de un componente visual.
 *
 * Regla transversal del proyecto: nada académico se afirma sin respaldo.
 * Por eso casi toda entidad admite `sources` y un estado de verificación.
 */

/* ────────────────────────────── Trazabilidad ────────────────────────────── */

/**
 * Nivel epistémico de una afirmación. Distinguirlos es el punto: un informe
 * que mezcla hecho e hipótesis no es un informe, es una opinión larga.
 */
export type EvidenceLevel =
  | 'FACT'
  | 'SIGNAL'
  | 'INFERENCE'
  | 'HYPOTHESIS'
  | 'PENDING';

/**
 * Cuatro dimensiones que antes viajaban juntas bajo la palabra «VERIFICADO».
 *
 * Que una fuente exista y diga lo que se le atribuye (`documentaryStatus`) no
 * dice nada sobre si su hallazgo se sostiene (`robustness`), ni sobre qué
 * demuestra su diseño (`demonstrativeLevel`), ni sobre hasta dónde puede
 * llevarse (`generalizationScope`). Colapsarlas en una sola etiqueta convertía
 * un estudio único no replicado en un hecho establecido.
 */

/** ¿La fuente existe, es accesible y dice lo que se le atribuye? */
export type DocumentaryStatus = 'verified' | 'incomplete' | 'unverifiable' | 'corrected';

/** ¿Cuánto se sostiene el hallazgo frente al resto de la literatura? */
export type Robustness = 'single_study' | 'convergent' | 'replicated' | 'contested' | 'retracted';

/**
 * Qué demuestra el diseño. D5 no es «causalidad establecida»: es identificación
 * causal **dentro de un contexto experimental**, que es cosa distinta y mucho
 * más modesta.
 */
export type DemonstrativeLevel =
  | 'D1_existence'
  | 'D2_implementation'
  | 'D3_adoption'
  | 'D4_measured_outcome'
  | 'D5_causal_identification';

/** Hasta dónde puede llevarse el hallazgo. Es independiente del nivel: un D5 puede ser estrictamente local. */
export type GeneralizationScope =
  | 'local'
  | 'similar_population'
  | 'disciplinary'
  | 'multi_context'
  | 'not_established';

/** Fuente pública citable. Espeja `content/research/source-registry.csv`. */
export interface Source {
  id: string;
  title: string;
  organization: string;
  url?: string;
  publishedDate?: string;
  accessedDate?: string;
  geography?: string;
  evidenceType?: string;
  /** 0–100. Cuánto sostiene realmente esta fuente lo que se le atribuye. */
  confidence?: number;
  notes?: string;

  /* ── Taxonomía epistemológica (auditoría v0.3.0) ── */
  documentaryStatus?: DocumentaryStatus;
  robustness?: Robustness;
  demonstrativeLevel?: DemonstrativeLevel;
  generalizationScope?: GeneralizationScope;
  /** Fecha en que se contrastó contra la publicación original. */
  lastVerified?: string;
  /**
   * Aviso editorial del propio publicador: corrección, fe de erratas o
   * retractación, con su fecha. Una fuente corregida sigue siendo utilizable;
   * lo que no es aceptable es citarla sin decir que lo está.
   */
  correction?: { date: string; url?: string; note: string };
}

/** Afirmación vinculada a evidencia. Espeja `content/research/evidence-matrix.csv`. */
export interface EvidenceClaim {
  id: string;
  claim: string;
  classification: EvidenceLevel;
  sourceIds: string[];
  note?: string;
  confidence?: number;
  report?: string;
  lastVerified?: string;
}

/**
 * Marca de contenido aún no confirmado. Su existencia es deliberada: es
 * preferible un hueco declarado a un dato inventado.
 */
export interface Placeholder {
  id: string;
  label: string;
  detail: string;
}

/* ────────────────────────────── Aldunate ────────────────────────────── */

export type PublicationKind =
  | 'libro'
  | 'capitulo'
  | 'articulo'
  | 'ponencia'
  | 'informe'
  | 'otro';

/**
 * Publicación.
 *
 * El esquema va más allá de la ficha bibliográfica a propósito: un catálogo que
 * solo guarda título, año y enlace es un cementerio de referencias. Los campos
 * `question`, `thesis`, `concepts` y `relatedAuthors` son los que convierten el
 * archivo en algo navegable por ideas y no solo por fechas.
 *
 * `thesis` solo se completa cuando el argumento central puede extraerse del
 * texto con cita. Resumir una tesis de memoria es inventarla despacio.
 */
export interface Publication {
  id: string;
  title: string;
  kind: PublicationKind;
  year?: number;
  venue?: string;
  authors?: string[];
  coauthors?: string[];
  abstract?: string;
  /** La pregunta que el trabajo intenta responder. */
  question?: string;
  /** Argumento central, solo si se puede extraer con fuente. */
  thesis?: string;
  concepts?: string[];
  relatedAuthors?: string[];
  /** Ids de otras publicaciones con las que conversa. */
  relatedWorks?: string[];
  openQuestions?: string[];
  url?: string;
  /** Ruta al PDF bajo /public, cuando exista y esté autorizado. */
  pdf?: string;
  status?: 'publicado' | 'en-prensa' | 'inedito';
  /** Solo `true` cuando existe respaldo documental cargado por el equipo. */
  verified: boolean;
  sourceIds?: string[];
}

export interface Course {
  id: string;
  title: string;
  institution?: string;
  year?: string;
  audience?: string;
  summary?: string;
  materials?: { label: string; href: string }[];
  status: 'confirmado' | 'pendiente';
  sourceIds?: string[];
}

/** Nodo del mapa intelectual: una línea de trabajo, no un tema decorativo. */
export interface ResearchLine {
  id: string;
  title: string;
  summary: string;
  /** Ids de otras líneas con las que conversa. Dibuja el grafo. */
  related: string[];
  status: 'activa' | 'en-formacion' | 'pendiente';
}

/* ────────────────────────────── Laboratorio ────────────────────────────── */

export type ToolStatus = 'idea' | 'prototype' | 'beta' | 'stable' | 'archived';
export type ToolMaturity = 'exploratoria' | 'en-prueba' | 'operativa';

export type LabCategory =
  | 'prompting-juridico'
  | 'flujos-verificables'
  | 'analisis-documental'
  | 'comparacion-modelos'
  | 'prototipos'
  | 'visualizacion-juridica'
  | 'agentes-automatizacion'
  | 'evaluacion-trazabilidad'
  | 'seguridad-privacidad'
  | 'ensenanza-asistida';

export interface LabTool {
  id: string;
  title: string;
  summary: string;
  status: ToolStatus;
  category: LabCategory;
  maturity: ToolMaturity;
  inputs: string[];
  outputs: string[];
  /** Lo que la herramienta NO hace. Se muestra siempre, no en letra chica. */
  limitations: string[];
  source?: string;
  demoUrl?: string;
  repoUrl?: string;
  updatedAt: string;
}

/* ────────────────────────────── Informes ────────────────────────────── */

export type ReportStatus =
  | 'en-investigacion'
  | 'borrador'
  | 'publicado'
  | 'en-revision';

/** Una versión publicada nunca se sobrescribe: se agrega y se registra. */
/**
 * Cambio a nivel de afirmación, no de archivo.
 *
 * «Se actualizaron fuentes» no permite a nadie saber si la frase que citó el
 * mes pasado sigue diciendo lo mismo. Esto sí: qué decía, qué dice y por qué
 * cambió.
 */
export interface ClaimChange {
  claimId?: string;
  /** Qué clase de cambio: acotar alcance, corregir dato, reformular taxonomía… */
  changeType:
    | 'narrowed_scope'
    | 'corrected_data'
    | 'retaxonomised'
    | 'added_context'
    | 'editorial';
  previous: string;
  current: string;
  reason: string;
}

export interface ReportVersion {
  version: string;
  date: string;
  status: ReportStatus;
  changelog: string[];
  /** Cambios a nivel de afirmación. Vacío en versiones que no tocaron claims. */
  claimChanges?: ClaimChange[];
  /** Ruta bajo /public. Vacío mientras no exista el archivo. */
  pdf?: string;
  /**
   * Versión web del documento, autónoma y legible sin descargar.
   * Misma regla que `pdf`: vacío mientras el archivo no exista.
   */
  html?: string;
}

/**
 * Cuántas piezas hay en cada eslabón de la cadena, y qué relación tienen.
 *
 * Existe porque las cifras 24, 38 y 18 aparecían sueltas en sitios distintos y
 * parecían contradecirse. No lo hacían: contaban cosas distintas. Publicar la
 * ontología cuesta una línea y ahorra la sospecha de que los números están
 * inflados.
 */
export interface ReportCounts {
  /** Documentos públicos verificados uno a uno contra su publicación original. */
  sources: number;
  /** Hallazgos extraídos de esas fuentes, cada uno con su nivel demostrativo. */
  findings: number;
  /** Afirmaciones sintéticas: varios hallazgos condensados en una proposición. */
  claims: number;
  /** Recomendaciones, que además de evidencia incorporan una decisión normativa. */
  recommendations: number;
}

export interface Report {
  slug: string;
  code: string;
  title: string;
  subtitle?: string;
  /** Descriptor secundario. No es parte del título: lo acota. */
  descriptor?: string;
  counts?: ReportCounts;
  executiveSummary: string;
  authors: string[];
  status: ReportStatus;
  folder: string;
  axes: string[];
  methodology: string[];
  limitations: string[];
  variables?: string[];
  versions: ReportVersion[];
  sourceIds: string[];
  claimIds: string[];
  openQuestions: string[];
  updatedAt: string;
}

/* ────────────────────────────── Experimentos ────────────────────────────── */

export type ExperimentStatus = 'idea' | 'prototipo' | 'jugable' | 'archivado';

export interface Experiment {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: ExperimentStatus;
  /** `true` cuando lo que se muestra es material de demostración, no evidencia. */
  demoContent: boolean;
  family: 'constitucion' | 'gramatiquerias' | 'juegos' | 'lectura';
  href?: string;
  /**
   * Ruta donde la pieza se juega de verdad, si existe.
   *
   * El botón sólo se pinta cuando este campo tiene valor: una ficha que promete
   * una pieza jugable inexistente es peor que una ficha sin botón. Misma regla
   * que la descarga de los informes.
   */
  jugableEn?: string;
}

/* ────────────────────────────── EVA ────────────────────────────── */

export type EvaPortraitKey =
  | 'cyberpunk'
  | 'desk'
  | 'presenter'
  | 'lifestyle'
  | 'neutral'
  | 'smile'
  | 'cafe'
  | 'sunset'
  | 'studio';

/** Un mensaje de EVA se ancla a una ruta, no a un temporizador aleatorio. */
export interface EvaMessage {
  id: string;
  /** Prefijo de ruta al que responde. `/` solo coincide con la portada. */
  route: string;
  title: string;
  body: string;
  portrait: EvaPortraitKey;
  /** Aviso operativo: límites, prototipo, contenido pendiente. */
  caveat?: string;
  action?: { label: string; href: string };
}

/* ────────────────────────────── Presentación ────────────────────────────── */

/**
 * Tono semántico compartido por badges, avisos y estados. Vive aquí —y no en
 * un componente— porque las capas de datos lo declaran junto al contenido.
 */
export type Tone = 'muted' | 'signal' | 'success' | 'warning' | 'danger' | 'accent';
