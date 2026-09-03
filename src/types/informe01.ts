/**
 * Tipos del Informe 01 · IA en Escuelas y Facultades de Derecho en Chile.
 *
 * Espejan los seis CSV canónicos de
 * `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/`, que son la
 * fuente de verdad. `src/data/informe01.ts` se **genera** desde ellos con
 * `scripts/informe-01/06-compilar-a-typescript.mjs`: no se edita a mano.
 *
 * Los vocabularios vienen del kit canónico v1.0.0 y no se amplían por
 * conveniencia de un componente. Si un valor nuevo hace falta, primero entra al
 * kit y a `docs/report-01/DECISIONS.md`.
 */

/** Las dos direcciones de la relación IA–Derecho, más sus dos bordes (kit §8). */
export type Informe01Direccion =
  | 'IA_PARA_DERECHO'
  | 'DERECHO_DE_IA'
  | 'AMBOS'
  /** Derecho digital, datos o tecnología donde la IA no es sustantiva. No eleva madurez. */
  | 'ADYACENTE';

/** Cinco dimensiones históricas más tres transversales de la metodología 2.0 (kit §9). */
export type Informe01Dimension =
  | 'pregrado'
  | 'formacion-continua'
  | 'investigacion'
  | 'vinculacion'
  | 'uso-institucional'
  | 'gobernanza'
  | 'recursos'
  | 'continuidad-resultados';

/**
 * A quién pertenece la capacidad. Es el campo que impide el error más frecuente
 * del corpus: contar una licencia de toda la universidad como capacidad de su
 * Facultad de Derecho.
 */
export type Informe01Atribucion =
  | 'INSTITUCIONAL_UNIVERSIDAD'
  | 'FACULTAD_DERECHO'
  | 'CENTRO_PROGRAMA'
  | 'EQUIPO'
  | 'INDIVIDUAL'
  | 'ESTUDIANTIL'
  | 'EXTERNA_CON_PARTICIPACION';

/** Estados editoriales del kit §22. Sólo `ACEPTADO` alimenta conclusiones publicadas. */
export type Informe01EstadoEditorial =
  | 'PROPUESTO'
  | 'FUENTE_ABIERTA'
  | 'CONTRASTADO'
  | 'ACEPTADO'
  | 'RECHAZADO'
  | 'SUPERADO';

/**
 * Escalera de institucionalización (kit §11). **Se aplica a la iniciativa, no a
 * la universidad, y no se promedia** (DEC-109). Un promedio por institución
 * borra justo la diferencia que el informe existe para conservar.
 */
export type Informe01Escalon = 0 | 1 | 2 | 3 | 4;

/** Trayectoria 2025–2026 (kit §12). `NO_LOCALIZADA` nunca equivale a `DISCONTINUADA`. */
export type Informe01Trayectoria =
  | 'NUEVA'
  | 'CONTINUA'
  | 'AMPLIADA'
  | 'INSTITUCIONALIZADA'
  | 'EVALUADA'
  | 'REDUCIDA'
  | 'DISCONTINUADA'
  | 'NO_LOCALIZADA'
  | 'DESCONOCIDA';

/** Jerarquía de fuentes del kit §14, de la que se deriva la confianza documental. */
export type Informe01TipoFuente =
  | 'politica'
  | 'base-oficial'
  | 'curricular'
  | 'programa-postgrado'
  | 'repositorio'
  | 'pagina-institucional'
  | 'proyecto-financiado'
  | 'resultado-institucional'
  | 'noticia-institucional'
  | 'prensa-externa';

export type Informe01EstadoDocumental =
  | 'vigente'
  | 'historico'
  | 'inaccesible'
  | 'sustituido';

/** Precisión real de la fecha. No se inventan día ni mes (kit §14). */
export type Informe01PrecisionFecha = 'dia' | 'mes' | 'anio' | 'FECHA_NO_DECLARADA';

export interface Informe01Universidad {
  id: string;
  officialName: string;
  /** Nombre de la Facultad, Escuela o carrera tal como lo escribe su propia fuente. */
  unitName: string;
  cohortId: string;
  cohortVersion: string;
  status: string;
  notes: string;
}

export interface Informe01Fuente {
  id: string;
  /** Vacío en las bases de universo nacional: no se atribuyen a ninguna institución. */
  universityId: string;
  title: string;
  publisher: string;
  type: Informe01TipoFuente;
  url: string;
  archivedUrl?: string;
  publishedDate?: string;
  datePrecision: Informe01PrecisionFecha;
  accessedDate: string;
  documentStatus: Informe01EstadoDocumental;
  /** Confianza **documental**, derivada de la jerarquía de fuentes. No es madurez. */
  confidence: number;
  workflowStatus: Informe01EstadoEditorial;
  /** Qué documento de investigación profunda la aportó. */
  createdBy: string;
  /** Vacío mientras la verificación sustantiva no exista (DEC-108). */
  verifiedBy: string;
  notes: string;
}

export interface Informe01Iniciativa {
  id: string;
  universityId: string;
  name: string;
  attribution: Informe01Atribucion;
  direction: Informe01Direccion;
  dimension: Informe01Dimension;
  startDate?: string;
  endDate?: string;
  ladder: Informe01Escalon;
  trajectory: Informe01Trayectoria;
  audience: string;
  coverage: string;
  responsibleUnit: string;
  products: string;
  outcomes: string;
  workflowStatus: Informe01EstadoEditorial;
  sourceIds: string[];
  notes: string;
}

export interface Informe01Evidencia {
  id: string;
  sourceId: string;
  initiativeId: string;
  universityId: string;
  direction: Informe01Direccion;
  dimension: Informe01Dimension;
  /** Descripción factual acotada de lo que la fuente prueba. Nunca interpretación. */
  statement: string;
  attribution: Informe01Atribucion;
  temporalStatus: Informe01Trayectoria;
  /** Vacío en las 75: la verificación sustantiva sigue pendiente. */
  lastVerified: string;
  workflowStatus: Informe01EstadoEditorial;
  createdBy: string;
  verifiedBy: string;
  /** Qué mide exactamente esta evidencia y con qué sesgo conocido. */
  limitations: string;
}

/**
 * Cobertura de investigación: cuánto se investigó una institución, **no** cuánto
 * hace. Se publica separada de cualquier lectura de evidencia porque una
 * universidad con más comunicación institucional parece más madura sin serlo.
 */
export interface Informe01Cobertura {
  universityId: string;
  /** Las tres del piloto de profundidad se miran desde información privilegiada. */
  inPilot: boolean;
  routesCompleted: number;
  routesTotal: number;
  coveragePercent: number;
  sources: number;
  evidence: number;
  initiatives: number;
  dimensionsCovered: number;
  dimensionsTotal: number;
  routesMissing: string[];
  substantivelyVerifiedSources: number;
  notes: string;
}

export interface Informe01Afirmacion {
  id: string;
  /** Vacío en las afirmaciones de cohorte y en las metodológicas. */
  universityId: string;
  text: string;
  classification: 'FACT' | 'SIGNAL' | 'INFERENCE' | 'HYPOTHESIS' | 'PENDING';
  evidenceIds: string[];
  counterevidenceIds: string[];
  reasoning: string;
  limitations: string;
  confidence: number;
  lastVerified: string;
  workflowStatus: Informe01EstadoEditorial;
  createdBy: string;
  verifiedBy: string;
}

/**
 * Contadores derivados. Existen para que ninguna cifra del sitio se escriba a
 * mano: el hero, el changelog y las descargas leen de aquí, y por eso no pueden
 * contradecirse entre sí.
 */
export interface Informe01Recuento {
  universidades: number;
  fuentes: number;
  fuentesInstitucionales: number;
  fuentesUniversoNacional: number;
  iniciativas: number;
  evidencias: number;
  afirmaciones: number;
  /** Cuántas fuentes tienen verificación sustantiva. Hoy es cero, y se muestra. */
  fuentesVerificadas: number;
  /** Cuántas iniciativas alcanzan el nivel 4 de la escalera. Hoy es cero. */
  iniciativasEvaluadas: number;
  afirmacionesPorNivel: Record<string, number>;
  iniciativasPorEscalon: Record<string, number>;
  iniciativasPorDireccion: Record<string, number>;
  dimensionesConEvidencia: number;
  dimensionesTotales: number;
  /** Media de fuentes por institución dentro y fuera del piloto, y su razón. */
  coberturaPiloto: number;
  coberturaResto: number;
  razonCobertura: number;
  rutasPiloto: number;
  rutasResto: number;
}
