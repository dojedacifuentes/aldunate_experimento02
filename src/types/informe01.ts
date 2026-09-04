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
 * Qué **clase de mecanismo institucional** es la iniciativa (metodología 2.1,
 * §M-2). Es un eje ortogonal a la dimensión: la dimensión dice en qué ámbito
 * académico ocurre algo, y el mecanismo dice con qué instrumento se hace.
 *
 * Existe porque la pregunta comparativa útil no es «¿cuántas iniciativas tiene
 * cada Facultad?» sino «¿qué instrumentos ha puesto en pie?». Un diplomado, una
 * guía ética y un seminario son tres cosas distintas, y sumarlas produce un
 * recuento que no significa nada.
 *
 * La clasificación **no aporta evidencia nueva**: reordena la que ya está
 * verificada en `name`, `responsible_unit` y `products`. Por eso no reabre la
 * cadena de verificación de ninguna fuente.
 */
export type Informe01Mecanismo =
  /** Centro, programa, departamento, dirección, laboratorio o núcleo. */
  | 'UNIDAD'
  /** Política, guía, lineamiento, decálogo o regla de integridad académica. */
  | 'NORMA'
  /** Diplomado, diploma, minor, curso, taller o capacitación. */
  | 'PROGRAMA_FORMATIVO'
  /** Actividad dentro de una asignatura o línea declarada de la malla. */
  | 'ASIGNATURA'
  /** Sistema, asistente, plataforma o licencia puesta a disposición. */
  | 'HERRAMIENTA'
  /** Investigación, I+D o adjudicación de fondo concursable. */
  | 'PROYECTO'
  /** Seminario, workshop, jornada o encuentro de una sola ocurrencia. */
  | 'ACTIVIDAD'
  /** Acuerdo o alianza con un tercero. */
  | 'CONVENIO'
  /** Revista, número monográfico o línea editorial. */
  | 'PUBLICACION';

/**
 * Las diez capacidades institucionales de la metodología 2.1 (§M-3). Son un eje
 * **derivado**: ninguna se registra a mano, todas se calculan desde iniciativas,
 * atribución, escalón, mecanismo y rutas del protocolo, en
 * `src/lib/informe01-capacidades.ts`.
 */
export type Informe01Capacidad =
  | 'unidad'
  | 'norma'
  | 'curriculo'
  | 'formacion'
  | 'herramienta'
  | 'adopcion'
  | 'cobertura'
  | 'investigacion'
  | 'transferencia'
  | 'evaluacion';

/**
 * Estado de una capacidad en una institución (metodología 2.1 §M-4).
 *
 * Los cinco valores responden **una sola pregunta**: qué capacidad demuestra la
 * Facultad. Cuánto hemos comprobado nosotros ese registro es una pregunta
 * distinta y viaja aparte, en `CeldaCapacidad.contrastada`. Un primer diseño de
 * esta escala metía la verificación dentro del estado, y el resultado premiaba a
 * la institución con más fuentes contrastadas —la PUCV— por una propiedad del
 * trabajo de campo. Era el mismo error de la matriz de la v0.6.0 con otra ropa.
 *
 * Los dos últimos valores son la razón de ser de la escala. `NO_LOCALIZADA` dice
 * que se buscó y no había; `NO_CONCLUYENTE` dice que no se buscó. Una cruz que
 * signifique las dos cosas a la vez convierte la desigualdad de cobertura en un
 * juicio sobre la institución, que es el error que ISSUE-018 describe.
 */
export type Informe01CapacidadEstado =
  /** Mecanismo de la Facultad, en operación o institucionalizado (escalón ≥ 2). */
  | 'EN_OPERACION'
  /** Mecanismo de la Facultad en exploración: actividad aislada o anuncio (escalón 1). */
  | 'INCIPIENTE'
  /** Lo que consta es capacidad de la universidad, de un individuo o del centro de alumnos. */
  | 'SOLO_ENTORNO'
  /** Se recorrieron las rutas que la habrían encontrado y no se localizó evidencia. */
  | 'NO_LOCALIZADA'
  /** La ruta del protocolo que la acreditaría no se recorrió en esta institución. */
  | 'NO_CONCLUYENTE';

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
  mechanism: Informe01Mecanismo;
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
  /** Fecha del contraste contra la publicación original. Vacío mientras no exista. */
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
  /** Cuántas fuentes tienen verificación sustantiva. Se muestra siempre, verificadas y no. */
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
