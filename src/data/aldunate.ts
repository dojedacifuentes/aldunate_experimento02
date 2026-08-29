import type { Course, Placeholder, Publication, ResearchLine } from '@/types';

/**
 * Capa académica del profesor Eduardo Aldunate Lizana.
 *
 * REGLA DURA — no se inventa nada.
 * `publications` y `courses` arrancan vacíos a propósito. Un título plausible
 * puesto "de muestra" sobrevive a la muestra: termina citado. Mientras no
 * exista respaldo documental cargado por el equipo, la interfaz declara el
 * hueco en vez de rellenarlo.
 *
 * Para incorporar contenido: ver `content/aldunate/` y `docs/CONTENT_PIPELINE.md`.
 */

export const profile = {
  name: 'Eduardo Aldunate Lizana',
  /** Descriptor de campo, no un cargo. Los cargos requieren verificación. */
  field: 'Derecho constitucional',
  /** Redactado en términos de qué hace el sitio, no de quién es la persona. */
  intro:
    'Este laboratorio reúne, ordena y pone a prueba material asociado al trabajo del profesor Aldunate en Derecho constitucional, lenguaje jurídico, investigación y enseñanza. No es una biografía ni un currículum: es un espacio de trabajo abierto.',
  note:
    'La ficha biográfica, los cargos, la afiliación institucional y la trayectoria se incorporarán únicamente a partir de fuentes verificadas.',
} as const;

/**
 * Ejes temáticos declarados para el proyecto. Son el mapa del sitio, no una
 * atribución de obra: describen qué territorios recorre este laboratorio.
 */
export const researchLines: ResearchLine[] = [
  {
    id: 'constitucional',
    title: 'Derecho constitucional',
    summary:
      'Estructura, interpretación y límites del texto constitucional. Qué hace una constitución cuando nadie la está mirando.',
    related: ['lenguaje', 'interpretacion'],
    status: 'activa',
  },
  {
    id: 'lenguaje',
    title: 'Lenguaje y Derecho',
    summary:
      'La norma como acto de lenguaje. Ambigüedad, vaguedad, textura abierta y las decisiones que se esconden en una coma.',
    related: ['constitucional', 'interpretacion', 'ia-derecho'],
    status: 'activa',
  },
  {
    id: 'interpretacion',
    title: 'Interpretación',
    summary:
      'Reglas sobre cómo seguir reglas. El punto donde la teoría del Derecho y la filosofía del lenguaje dejan de ser disciplinas distintas.',
    related: ['lenguaje', 'constitucional'],
    status: 'activa',
  },
  {
    id: 'ensenanza',
    title: 'Enseñanza del Derecho',
    summary:
      'Métodos, evaluación y competencias. Qué se transmite realmente en una sala de clases de Derecho y qué solo se supone transmitido.',
    related: ['ia-derecho', 'lenguaje'],
    status: 'activa',
  },
  {
    id: 'ia-derecho',
    title: 'Inteligencia artificial y Derecho',
    summary:
      'Uso, límites y trazabilidad de sistemas generativos en trabajo jurídico y en formación jurídica. Verificación antes que entusiasmo.',
    related: ['ensenanza', 'lenguaje', 'experimentacion'],
    status: 'activa',
  },
  {
    id: 'experimentacion',
    title: 'Experimentación',
    summary:
      'Prototipos, juegos y visualizaciones como forma de argumentar. Un experimento que se puede tocar discute mejor que un párrafo.',
    related: ['ia-derecho', 'interpretacion'],
    status: 'en-formacion',
  },
];

/** Vacío por diseño. Ver regla dura arriba. */
export const publications: Publication[] = [];

/** Vacío por diseño. Ver regla dura arriba. */
export const courses: Course[] = [];

/** Huecos declarados. La interfaz los muestra tal cual, sin maquillarlos. */
export const pendingContent: Placeholder[] = [
  {
    id: 'bio',
    label: 'Ficha biográfica y afiliación',
    detail:
      'Formación, cargos, afiliación institucional y trayectoria docente. Requiere fuente oficial o confirmación directa antes de publicarse.',
  },
  {
    id: 'publicaciones',
    label: 'Publicaciones',
    detail:
      'Libros, capítulos, artículos y ponencias. Cada entrada necesita título exacto, año, sede de publicación y enlace o referencia de respaldo.',
  },
  {
    id: 'cursos',
    label: 'Cursos y docencia',
    detail:
      'Asignaturas, programas y materiales. Se cargarán solo cursos confirmados, con institución y período.',
  },
  {
    id: 'destacados',
    label: 'Trabajos destacados',
    detail:
      'Selección curada de trabajos con contexto y comentario. Depende de que exista primero el catálogo de publicaciones.',
  },
  {
    id: 'timeline',
    label: 'Línea de tiempo intelectual',
    detail:
      'Hitos, giros temáticos y obras de referencia. Se construirá a partir del catálogo verificado, no al revés.',
  },
];
