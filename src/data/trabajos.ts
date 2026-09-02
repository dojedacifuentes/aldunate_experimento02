import type { WorkItem, WorkStage, WorkKind } from '@/types';
import { reports } from './reports';
import type { ReportStatus } from '@/types';

/**
 * Estado del arte del laboratorio: en qué punto va cada línea de trabajo.
 *
 * Esta es la respuesta a una pregunta que el sitio no contestaba y que es la
 * primera que se hace quien llega: **¿qué se está haciendo aquí ahora mismo, y
 * cuánto le falta?** Había informes, experimentos y fichas de Lab, cada uno con
 * su estado, pero ninguna vista que los pusiera juntos en una línea de tiempo
 * de trabajo. Se resolvía leyendo cuatro secciones y sumando de cabeza.
 *
 * ── Reglas de este registro ──
 *
 * 1. **Cada entrada declara su siguiente paso.** No es adorno: un estado sin
 *    siguiente paso es una etiqueta que nadie puede auditar. Con él, cualquiera
 *    comprueba en un mes si la línea avanzó o sólo cambió de rótulo.
 * 2. **Los informes no declaran estado aquí.** Lo derivan de `reports.ts` con
 *    `reportSlug`. Es la misma regla de fuente única que el resto del sitio, y
 *    existe porque ya se rompió una vez.
 * 3. **`comprometido` obliga a `caveat`.** Un compromiso publicado sin decir
 *    que no está formalizado se lee como anuncio, y este sitio no anuncia en
 *    nombre de ninguna institución. Lo verifica una prueba.
 * 4. **`href` sólo si hay algo que abrir.** Misma regla que el botón de
 *    descarga de los informes: un enlace que promete una página inexistente es
 *    peor que no tener enlace.
 * 5. **Nada de fechas inventadas.** El horizonte va en palabras —«próximo
 *    semestre»— porque es lo que se sabe. Una fecha exacta puesta para que la
 *    ficha parezca completa es un dato falso.
 */

/* ────────────────────────── Vocabulario de estado ────────────────────────── */

/**
 * Los cuatro estados de la recta, en orden. El medidor cuenta posiciones aquí.
 * `comprometido` y `supeditado` quedan fuera a propósito: no son puntos de una
 * progresión, son otra clase de hecho.
 */
export const workPipeline = [
  'en-estudio',
  'en-desarrollo',
  'en-revision',
  'publicado',
] as const satisfies readonly WorkStage[];

/**
 * Los seis estados en orden de lectura: primero la recta, después lo que queda
 * fuera de ella. Es el orden en que se cuenta el laboratorio de un vistazo.
 */
export const workStageOrder = [
  ...workPipeline,
  'comprometido',
  'supeditado',
] as const satisfies readonly WorkStage[];

export const workStageMeta: Record<
  WorkStage,
  { label: string; meaning: string; tone: 'muted' | 'signal' | 'warning' | 'success' }
> = {
  'en-estudio': {
    label: 'En estudio',
    meaning: 'Se está aprendiendo el terreno. Todavía no hay entregable definido.',
    tone: 'muted',
  },
  'en-desarrollo': {
    label: 'En desarrollo',
    meaning: 'Hay entregable definido y trabajo en curso sobre él.',
    tone: 'signal',
  },
  'en-revision': {
    label: 'En revisión',
    meaning: 'Existe y se está revisando. Puede cambiar antes de ser estable.',
    tone: 'warning',
  },
  publicado: {
    label: 'Publicado',
    meaning: 'Disponible y citable. Las correcciones van como versión nueva.',
    tone: 'success',
  },
  comprometido: {
    label: 'Comprometido',
    meaning: 'Hay compromiso con fecha. El trámite formal no está cerrado.',
    tone: 'warning',
  },
  supeditado: {
    label: 'Supeditado',
    meaning: 'Depende de conversación y de hechos posteriores. Sin fecha.',
    tone: 'muted',
  },
};

export const workKindMeta: Record<WorkKind, { label: string }> = {
  informe: { label: 'Informe' },
  curso: { label: 'Curso' },
  proyecto: { label: 'Proyecto' },
};

/**
 * Traducción del estado editorial de un informe a estado de trabajo.
 *
 * `en-investigacion` cae en `en-desarrollo` y no en `en-estudio`, y la
 * diferencia es real: un informe que existe en `reports.ts` tiene por
 * construcción ejes, método y versiones, o sea **entregable definido**. Eso es
 * exactamente lo que separa desarrollar de estudiar.
 */
const desdeEstadoEditorial: Record<ReportStatus, WorkStage> = {
  'en-investigacion': 'en-desarrollo',
  borrador: 'en-desarrollo',
  'en-revision': 'en-revision',
  publicado: 'publicado',
};

/* ────────────────────────── El registro ────────────────────────── */

export const workItems: WorkItem[] = [
  {
    id: 'informe-01',
    kind: 'informe',
    title: 'IA en Escuelas y Facultades de Derecho de Chile',
    summary:
      'Mapeo de evidencia pública sobre once universidades chilenas: qué enseñan, qué usan y qué han publicado.',
    reportSlug: 'ia-escuelas-derecho-chile',
    nextStep:
      'Verificar una por una las 43 fuentes del corpus: abrirlas y contrastar lo que dicen contra lo que se les atribuye. Es lo que desbloquea todo lo demás.',
    caveat:
      'La cobertura es desigual por diseño —nueve fuentes en cada universidad del piloto y dos en las otras ocho—, así que no se publica ninguna comparación nacional.',
    href: '/informes/ia-escuelas-derecho-chile',
    updatedAt: '2026-09-02',
  },
  {
    id: 'informe-02',
    kind: 'informe',
    title: 'La universidad ante la automatización del trabajo cognitivo',
    summary:
      'Qué le pasa a la enseñanza del Derecho cuando la máquina hace barato el trabajo que la carrera enseñaba a hacer.',
    reportSlug: 'transformacion-ensenanza-derecho',
    nextStep:
      'Revisar la maquetación del PDF v0.3.0 página a página y clasificar las ocho recomendaciones según si las respalda la evidencia o son decisión normativa.',
    href: '/informes/transformacion-ensenanza-derecho',
    updatedAt: '2026-09-02',
  },
  {
    id: 'curso-alfabetizacion-ia',
    kind: 'curso',
    title: 'Alfabetización en IA para estudiantes de Derecho',
    summary:
      'Diseño de un curso de fundamentos: qué es y qué no es un modelo de lenguaje, qué puede comprobarse y qué no, y cómo se cita lo que produce.',
    stage: 'en-estudio',
    nextStep:
      'Acotar el temario y los resultados de aprendizaje. El diseño está en fase de estudio del propio campo, antes de fijar contenidos.',
    updatedAt: '2026-09-02',
  },
  {
    id: 'optativo-ia-derecho',
    kind: 'curso',
    title: 'Optativo «IA y Derecho»',
    summary:
      'Curso electivo sobre inteligencia artificial y Derecho para la Escuela de Derecho.',
    stage: 'comprometido',
    horizon: 'Próximo semestre',
    nextStep: 'Cerrar el trámite de formalización y fijar programa y cupos.',
    caveat:
      'Comprometido, no formalizado. Esta ficha registra el estado del trabajo de su autor y no constituye anuncio ni programación oficial de la Escuela de Derecho.',
    updatedAt: '2026-09-02',
  },
  {
    id: 'otros-proyectos',
    kind: 'proyecto',
    title: 'Otras líneas',
    summary:
      'Vinculación con el medio, herramientas del Lab y colaboraciones. Existen como posibilidad, no como plan.',
    stage: 'supeditado',
    nextStep:
      'Quedan supeditadas a conversación y a hechos posteriores. No se anuncian hasta que haya algo comprobable.',
    href: '/laboratorio',
    updatedAt: '2026-09-02',
  },
];

/* ────────────────────────── Derivación ────────────────────────── */

export interface ResolvedWorkItem extends WorkItem {
  /** Estado efectivo: el declarado, o el derivado de la ficha del informe. */
  resolvedStage: WorkStage;
  /** Versión vigente del informe, cuando la entrada es un informe. */
  version?: string;
  /** Posición en la recta, o `null` si el estado no está en ella. */
  pipelineIndex: number | null;
}

/**
 * Resuelve el estado de cada entrada una sola vez, aquí, y no en el componente.
 *
 * El componente pinta; no decide de dónde sale un dato. Además así la
 * derivación se puede probar sin montar React, que es lo que hace
 * `sitio.test.ts`.
 */
export function resolveWorkItems(items: WorkItem[] = workItems): ResolvedWorkItem[] {
  return items.map((item) => {
    const informe = item.reportSlug
      ? reports.find((r) => r.slug === item.reportSlug)
      : undefined;

    const resolvedStage: WorkStage = informe
      ? desdeEstadoEditorial[informe.status]
      : (item.stage ?? 'en-estudio');

    // La versión vigente es la última declarada, no una escrita a mano.
    const version = informe?.versions.at(-1)?.version;

    const idx = (workPipeline as readonly string[]).indexOf(resolvedStage);

    return {
      ...item,
      resolvedStage,
      version,
      pipelineIndex: idx === -1 ? null : idx,
    };
  });
}
