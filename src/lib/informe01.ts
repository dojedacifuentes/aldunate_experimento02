import {
  informe01Afirmaciones,
  informe01Cobertura,
  informe01Evidencias,
  informe01Fuentes,
  informe01Iniciativas,
  informe01Recuento,
  informe01Universidades,
} from '@/data/informe01';
import type {
  Informe01Atribucion,
  Informe01Cobertura,
  Informe01Dimension,
  Informe01Direccion,
  Informe01Escalon,
  Informe01Evidencia,
  Informe01Fuente,
  Informe01Iniciativa,
  Informe01Universidad,
} from '@/types';

/**
 * Selectores del Informe 01.
 *
 * Aquí no hay ninguna función que sume niveles por universidad, y la ausencia es
 * deliberada: la escalera se aplica a la iniciativa y no se promedia (DEC-109).
 * Un `maturityScore(university)` es exactamente el atajo que produciría el
 * ranking que la cobertura desigual prohíbe.
 */

export const DIMENSIONES: { id: Informe01Dimension; label: string; short: string }[] = [
  { id: 'pregrado', label: 'Formación de pregrado', short: 'Pregrado' },
  { id: 'formacion-continua', label: 'Formación continua y postgrado', short: 'Continua' },
  { id: 'investigacion', label: 'Investigación y desarrollo', short: 'I+D' },
  { id: 'vinculacion', label: 'Vinculación con el medio', short: 'Vinculación' },
  { id: 'uso-institucional', label: 'Uso institucional de IA', short: 'Uso' },
  { id: 'gobernanza', label: 'Gobernanza y estrategia', short: 'Gobernanza' },
  { id: 'recursos', label: 'Recursos y capacidades', short: 'Recursos' },
  {
    id: 'continuidad-resultados',
    label: 'Continuidad, cobertura y resultados',
    short: 'Resultados',
  },
];

export const DIRECCIONES: {
  id: Informe01Direccion;
  label: string;
  definition: string;
}[] = [
  {
    id: 'IA_PARA_DERECHO',
    label: 'IA para el Derecho',
    definition:
      'La IA se usa para enseñar, investigar, redactar, litigar o atender. Es la dirección donde una Facultad cambia lo que hace.',
  },
  {
    id: 'DERECHO_DE_IA',
    label: 'Derecho de la IA',
    definition:
      'La IA es el objeto jurídico: regulación, responsabilidad, datos, propiedad intelectual, debido proceso.',
  },
  {
    id: 'AMBOS',
    label: 'Ambas direcciones',
    definition: 'La iniciativa integra las dos de forma sustantiva, no de nombre.',
  },
  {
    id: 'ADYACENTE',
    label: 'Adyacente',
    definition:
      'Innovación, datos, legaltech o tecnología donde la IA no es un componente central verificable. Se conserva como contexto y no eleva la lectura.',
  },
];

export const ESCALONES: { nivel: Informe01Escalon; label: string; condition: string }[] = [
  {
    nivel: 0,
    label: 'Sin evidencia pública',
    condition:
      'El protocolo se recorrió y no se localizó evidencia verificable. No significa que la actividad no exista.',
  },
  {
    nivel: 1,
    label: 'Exploración',
    condition: 'Anuncio, evento, piloto o iniciativa aislada.',
  },
  {
    nivel: 2,
    label: 'Operación',
    condition:
      'Actividad recurrente, curso activo o proyecto en ejecución. Varios eventos no producen este nivel por acumulación.',
  },
  {
    nivel: 3,
    label: 'Institucionalización',
    condition:
      'Responsable formal, continuidad, cobertura, política, recursos o integración curricular. Exige al menos una señal formal.',
  },
  {
    nivel: 4,
    label: 'Evaluación',
    condition:
      'Productos, resultados o efectos públicamente revisables. Contar asistentes no basta.',
  },
];

export const ATRIBUCIONES: Record<Informe01Atribucion, { label: string; note: string }> = {
  INSTITUCIONAL_UNIVERSIDAD: {
    label: 'Universidad',
    note: 'Capacidad de la institución completa. Disponible para Derecho, no desarrollada por Derecho.',
  },
  FACULTAD_DERECHO: {
    label: 'Facultad de Derecho',
    note: 'La unidad que la fuente identifica es la propia Facultad o Escuela.',
  },
  CENTRO_PROGRAMA: {
    label: 'Centro o programa',
    note: 'Una unidad especializada dentro de la Facultad.',
  },
  EQUIPO: { label: 'Equipo', note: 'Un grupo académico, sin estructura formal declarada.' },
  INDIVIDUAL: { label: 'Individual', note: 'Adjudicación o autoría de una persona.' },
  ESTUDIANTIL: {
    label: 'Estudiantil',
    note: 'Iniciativa de estudiantes. No es una capacidad de la Facultad.',
  },
  EXTERNA_CON_PARTICIPACION: {
    label: 'Externa con participación',
    note: 'La conduce otra institución y la Facultad participa.',
  },
};

/** Orden alfabético estable. Nunca por cantidad de evidencia: eso sería un ranking. */
export const universidadesOrdenadas: Informe01Universidad[] = [...informe01Universidades].sort(
  (a, b) => a.officialName.localeCompare(b.officialName, 'es'),
);

export function universidad(id: string): Informe01Universidad | undefined {
  return informe01Universidades.find((u) => u.id === id);
}

export function coberturaDe(id: string): Informe01Cobertura | undefined {
  return informe01Cobertura.find((c) => c.universityId === id);
}

export function fuentesDe(id: string): Informe01Fuente[] {
  return informe01Fuentes.filter((f) => f.universityId === id);
}

export function fuente(id: string): Informe01Fuente | undefined {
  return informe01Fuentes.find((f) => f.id === id);
}

export function iniciativasDe(id: string): Informe01Iniciativa[] {
  return informe01Iniciativas.filter((i) => i.universityId === id);
}

export function evidenciasDe(id: string): Informe01Evidencia[] {
  return informe01Evidencias.filter((e) => e.universityId === id);
}

export function evidenciasDeIniciativa(id: string): Informe01Evidencia[] {
  return informe01Evidencias.filter((e) => e.initiativeId === id);
}

export function evidencia(id: string) {
  return informe01Evidencias.find((e) => e.id === id);
}

export function afirmacionesDe(id: string) {
  return informe01Afirmaciones.filter((c) => c.universityId === id);
}

/** Afirmaciones que alcanzan a la cohorte entera o al método, no a una institución. */
export const afirmacionesDeCohorte = informe01Afirmaciones.filter((c) => !c.universityId);

/**
 * Celda de la matriz: qué se localizó de una universidad en una dimensión.
 *
 * Devuelve **cuánta evidencia se localizó** y el escalón más alto alcanzado por
 * alguna de sus iniciativas en esa dimensión. Son dos lecturas distintas y se
 * publican juntas justamente para que no se confundan: mucha evidencia con
 * escalón bajo y poca evidencia con escalón alto son estados diferentes, y
 * cualquiera de los dos números por separado los volvería indistinguibles.
 */
export interface CeldaMatriz {
  universityId: string;
  dimension: Informe01Dimension;
  evidencias: number;
  iniciativas: number;
  /** `null` cuando no se localizó ninguna iniciativa en esa dimensión. */
  escalonMaximo: Informe01Escalon | null;
  /** Sólo capacidades de la universidad, sin ninguna atribuida a Derecho. */
  soloUniversidad: boolean;
  direcciones: Informe01Direccion[];
}

export function celda(universityId: string, dimension: Informe01Dimension): CeldaMatriz {
  const inis = informe01Iniciativas.filter(
    (i) => i.universityId === universityId && i.dimension === dimension,
  );
  const evs = informe01Evidencias.filter(
    (e) => e.universityId === universityId && e.dimension === dimension,
  );
  return {
    universityId,
    dimension,
    evidencias: evs.length,
    iniciativas: inis.length,
    escalonMaximo: inis.length
      ? (Math.max(...inis.map((i) => i.ladder)) as Informe01Escalon)
      : null,
    soloUniversidad:
      inis.length > 0 && inis.every((i) => i.attribution === 'INSTITUCIONAL_UNIVERSIDAD'),
    direcciones: [...new Set(inis.map((i) => i.direction))],
  };
}

/** Distribución de iniciativas por escalón. El nivel 4 sale vacío y ése es el punto. */
export function distribucionEscalera(): { nivel: Informe01Escalon; iniciativas: Informe01Iniciativa[] }[] {
  return ESCALONES.map(({ nivel }) => ({
    nivel,
    iniciativas: informe01Iniciativas.filter((i) => i.ladder === nivel),
  }));
}

export function distribucionDirecciones() {
  return DIRECCIONES.map((d) => ({
    ...d,
    iniciativas: informe01Iniciativas.filter((i) => i.direction === d.id),
  }));
}

/** Dimensiones sin una sola evidencia en las once. Se declaran, no se ocultan. */
export function dimensionesVacias() {
  const conEvidencia = new Set(informe01Evidencias.map((e) => e.dimension));
  return DIMENSIONES.filter((d) => !conEvidencia.has(d.id));
}

/** Hitos fechados, para la línea de tiempo. Las fuentes sin fecha no se inventan. */
export function hitos() {
  return informe01Fuentes
    .filter((f) => f.publishedDate && f.universityId)
    .map((f) => ({ ...f, year: Number(f.publishedDate!.slice(0, 4)) }))
    .sort((a, b) => a.publishedDate!.localeCompare(b.publishedDate!));
}

export function fuentesSinFecha() {
  return informe01Fuentes.filter((f) => !f.publishedDate);
}

/* ── Cifras para la capa narrativa ──────────────────────────────────────────
 * La prosa del borrador cita números con marcas `{clave}` y nunca a mano. Esta
 * es la única tabla que las resuelve, de modo que la web, el Markdown, el HTML
 * y el PDF no puedan decir cifras distintas, y de modo que una verificación
 * futura que cambie el recuento cambie también el texto.                     */

export const CORTE_INFORME_01 = '1 de septiembre de 2026';

export function cifrasInforme01(): Record<string, string | number> {
  const r = informe01Recuento;
  const noVerificadas = r.fuentes - r.fuentesVerificadas;
  const universitarios = informe01Evidencias.filter(
    (e) => e.attribution === 'INSTITUCIONAL_UNIVERSIDAD',
  ).length;
  return {
    corte: CORTE_INFORME_01,
    universidades: r.universidades,
    fuentes: r.fuentes,
    iniciativas: r.iniciativas,
    evidencias: r.evidencias,
    afirmaciones: r.afirmaciones,
    verificadas: r.fuentesVerificadas,
    noVerificadas,
    porcentajeVerificado: Math.round((r.fuentesVerificadas / r.fuentes) * 100),
    razonCobertura: r.razonCobertura,
    universitarios,
    evaluadas: r.iniciativasEvaluadas,
    escalon1: r.iniciativasPorEscalon['1'] ?? 0,
    escalon2: r.iniciativasPorEscalon['2'] ?? 0,
    escalon3: r.iniciativasPorEscalon['3'] ?? 0,
  };
}
