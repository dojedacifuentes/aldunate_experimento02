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

export type ReportArtifactFormat = 'PDF' | 'Word' | 'HTML' | 'Markdown' | 'ZIP';

export interface ReportArtifact {
  format: ReportArtifactFormat;
  label: string;
  href: string;
  description: string;
}

/** Paquete operativo asociado a un informe; no se confunde con sus resultados. */
export interface ReportResearchKit {
  title: string;
  summary: string;
  version: string;
  publishedAt: string;
  status: string;
  artifacts: ReportArtifact[];
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
  researchKit?: ReportResearchKit;
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

/* ───────────────────── Perfil académico verificable ───────────────────── */

/**
 * Fuente bibliográfica citable del perfil académico.
 *
 * Distinta de `Source` (que espeja el registro de investigación de los
 * informes): aquí lo que se cita es una obra, un índice bibliográfico o una
 * ficha institucional, no un estudio con diseño y hallazgo.
 *
 * `tier` no es un adorno: ordena la jerarquía del §27 del encargo. Una ficha
 * de wiki y un índice bibliográfico no sostienen lo mismo, y la interfaz debe
 * poder decirlo sin que nadie tenga que abrir el enlace.
 */
export type AcademicSourceTier =
  /** Índice bibliográfico o repositorio académico (Dialnet, SciELO, DOI). */
  | 'indice'
  /** La publicación original, accesible. */
  | 'publicacion'
  /** Sitio de la institución que emite el dato. */
  | 'institucional'
  /** Ficha colaborativa o secundaria. Se usa, pero se declara. */
  | 'secundaria';

export interface AcademicSource {
  id: string;
  title: string;
  publisher: string;
  tier: AcademicSourceTier;
  url?: string;
  /** Qué sostiene esta fuente, en una línea. Evita citarla para todo. */
  supports: string;
  accessedDate: string;
  /** Reserva conocida sobre la fuente. Se muestra, no se esconde. */
  caveat?: string;
}

/**
 * Dato biográfico o de trayectoria, con su nivel epistémico.
 *
 * Reutiliza `EvidenceLevel` en vez de inventar una escala paralela: el sitio
 * ya distingue cinco niveles en toda la capa de investigación y una segunda
 * taxonomía solo para esta página convertiría la comparación en imposible.
 */
export interface ProfileFact {
  id: string;
  label: string;
  value: string;
  classification: EvidenceLevel;
  sourceIds: string[];
  /** Matiz, discrepancia entre fuentes o alcance de lo afirmado. */
  note?: string;
}

/** Concepto del corpus. Se deriva de obras reales, nunca se propone a priori. */
export interface CorpusConcept {
  id: string;
  title: string;
  /** Descripción del territorio, no atribución de tesis. */
  summary: string;
  /** Ids de conceptos con los que comparte obras. Dibuja el grafo. */
  related: string[];
}

export type TimelineKind = 'formacion' | 'cargo' | 'obra' | 'institucional';

export interface TimelineEvent {
  id: string;
  year: number;
  /** Año final, para tramos. */
  endYear?: number;
  title: string;
  detail?: string;
  kind: TimelineKind;
  classification: EvidenceLevel;
  sourceIds: string[];
}

/**
 * Pregunta doctrinal documentada.
 *
 * `position` describe **qué problema aborda la obra**, en lenguaje de obra
 * («en X se examina…»), no qué piensa la persona. La diferencia no es
 * cosmética: sin acceso al texto completo, atribuir una convicción a alguien a
 * partir de un título es inventar despacio.
 */
export interface DoctrinalTopic {
  id: string;
  conceptId: string;
  question: string;
  position: string;
  classification: EvidenceLevel;
  /** Ids de publicaciones que sostienen la entrada. */
  publicationIds: string[];
  note?: string;
}

/* ────────────────────────── Estado del arte del trabajo ────────────────────────── */

/**
 * Cuarta familia de estado, y la razón de que sea una familia aparte.
 *
 * El sitio ya distinguía tres vocabularios (ver `components/common/status.tsx`):
 * madurez del artefacto, estado editorial de un informe y nivel epistémico de
 * una afirmación. Este responde a una cuarta pregunta, que ninguno de los tres
 * contesta: **¿en qué punto del trabajo va esta línea, y qué falta para el
 * siguiente?**
 *
 * Un informe puede estar `en-revision` como documento —familia editorial— y ser
 * a la vez la línea de trabajo más atrasada del laboratorio. Son dos hechos
 * distintos sobre la misma cosa, y mezclarlos es el error que la auditoría del
 * 31-08-2026 encontró en U-13.
 *
 * ── Las cuatro primeras son una recta; las dos últimas, no ──
 *
 * `en-estudio` → `en-desarrollo` → `en-revision` → `publicado` es una
 * progresión: cada estado supone el anterior, y por eso se puede dibujar como
 * un medidor de cuatro tramos que se lee de un vistazo.
 *
 * `comprometido` y `supeditado` **no están en esa recta** y no se pintan con el
 * medidor. Un compromiso no es «más avanzado» que un desarrollo: es otra clase
 * de hecho —una fecha dada— y merece su propia marca. Meterlos en la recta
 * sugeriría un progreso que nadie ha medido.
 */
export type WorkStage =
  /** Se está aprendiendo el terreno. No hay entregable definido todavía. */
  | 'en-estudio'
  /** Hay entregable definido y trabajo en curso sobre él. */
  | 'en-desarrollo'
  /** Existe y se está revisando. Puede cambiar antes de ser estable. */
  | 'en-revision'
  /** Disponible y citable. Las correcciones van como versión nueva. */
  | 'publicado'
  /**
   * Hay compromiso con fecha, sin trámite formal cerrado.
   *
   * Obliga a `caveat`: publicar un compromiso sin decir que no está formalizado
   * lo convierte en un anuncio, y este sitio no anuncia por nadie.
   */
  | 'comprometido'
  /** Depende de conversación o de hechos posteriores. No tiene fecha. */
  | 'supeditado';

export type WorkKind = 'informe' | 'curso' | 'proyecto';

/**
 * Una línea de trabajo del laboratorio, tal como se muestra en la portada.
 *
 * **Los informes no declaran aquí su estado.** Lo derivan de `reports.ts`, que
 * es su fuente única. Duplicarlo permitiría que la portada dijera «en revisión»
 * mientras la ficha dice otra cosa —exactamente lo que ya pasó una vez, cuando
 * el sitio afirmaba a la vez «v0.2.0 publicada» y «los hallazgos todavía no
 * están definidos»—. Por eso `reportSlug` y `stage` son excluyentes.
 */
export interface WorkItem {
  id: string;
  kind: WorkKind;
  title: string;
  /** Una línea. Qué es esto, para quien no lo sabe. */
  summary: string;
  /**
   * Estado declarado. Sólo para lo que no es un informe: los informes lo
   * derivan de su ficha mediante `reportSlug`.
   */
  stage?: WorkStage;
  /** Informe del que se deriva el estado. Excluyente con `stage`. */
  reportSlug?: string;
  /**
   * Qué falta para el siguiente estado.
   *
   * Obligatorio, y es la mitad del valor de esta sección: un estado sin
   * siguiente paso es una etiqueta. Con él, cualquiera puede comprobar dentro
   * de un mes si la línea avanzó o sólo cambió de rótulo.
   */
  nextStep: string;
  /** Salvedad. Obligatoria en `comprometido`; opcional en el resto. */
  caveat?: string;
  /** Ruta interna, sólo si hay algo que abrir. Nunca una promesa. */
  href?: string;
  /** Horizonte declarado, en palabras y no en fecha falsa: «próximo semestre». */
  horizon?: string;
  updatedAt: string;
}
