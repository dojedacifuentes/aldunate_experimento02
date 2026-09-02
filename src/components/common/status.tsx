import { cn } from '@/lib/utils';
import { evidenceLevels } from '@/data/research';
import { statusMeta, maturityMeta } from '@/data/lab';
import { reportStatusMeta } from '@/data/reports';
import { workPipeline, workStageMeta } from '@/data/trabajos';
import type { EvidenceLevel, ReportStatus, ToolMaturity, ToolStatus, WorkStage } from '@/types';

/**
 * Las tres familias de estado, y por qué no comparten componente.
 *
 * El sitio maneja tres vocabularios que responden a preguntas distintas:
 *
 *   A · MADUREZ      ¿cuánto se ha construido?     idea · prototipo · estable
 *   B · EDITORIAL    ¿en qué punto del ciclo va?   investigación · revisión · publicado
 *   C · EPISTÉMICO   ¿cuánto sostiene la evidencia? hecho · señal · inferencia…
 *
 * Hasta ahora los tres se pintaban con el mismo `<Badge>` y un tono de color.
 * Consecuencia: «Prototipo» y «En revisión» y «Señal» eran indistinguibles de
 * un vistazo, y el lector tenía que deducir por contexto de qué se le hablaba.
 * Un artefacto estable con evidencia débil se leía igual que lo contrario.
 *
 * La separación es de **forma**, no de color: cada familia tiene una silueta
 * propia que se reconoce antes de leer la palabra.
 *
 *   MADUREZ     píldora con punto        ● PROTOTIPO
 *   EDITORIAL   sello con filo izquierdo ▏EN REVISIÓN
 *   EPISTÉMICO  código entre corchetes   [SEÑAL]
 *
 * Ninguna depende sólo del color: las tres llevan siempre su palabra, y la
 * forma sigue distinguiéndolas en escala de grises.
 */

/* ─────────────────────────── A · Madurez del artefacto ─────────────────────────── */

const maturityShape =
  'mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ' +
  'text-[0.6875rem] font-medium uppercase tracking-wider';

const maturityTone: Record<ToolStatus, string> = {
  idea: 'text-muted-foreground border-border bg-muted/60',
  prototype: 'text-signal border-signal/35 bg-signal/10',
  beta: 'text-warning border-warning/35 bg-warning/10',
  stable: 'text-success border-success/35 bg-success/10',
  archived: 'text-muted-foreground border-border bg-muted/60',
};

const maturityDot: Record<ToolStatus, string> = {
  idea: 'bg-muted-foreground',
  prototype: 'bg-signal',
  beta: 'bg-warning',
  stable: 'bg-success',
  archived: 'bg-muted-foreground',
};

/** Cuánto se ha construido de un artefacto. No dice nada sobre su evidencia. */
export function MaturityBadge({
  status,
  className,
}: {
  status: ToolStatus;
  className?: string;
}) {
  return (
    <span className={cn(maturityShape, maturityTone[status], className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', maturityDot[status])} aria-hidden />
      {statusMeta[status].label}
    </span>
  );
}

/**
 * Grado de prueba de un artefacto: cuánto uso real acumula.
 *
 * Vive junto a la madurez y responde a otra pregunta —«¿está construido?» no es
 * «¿se ha usado?»—, así que se pinta como metadato y no como insignia. Antes se
 * imprimía en crudo («madurez: en-prueba»), con guion y todo.
 */
export function MaturityLevel({
  maturity,
  className,
}: {
  maturity: ToolMaturity;
  className?: string;
}) {
  return (
    <span className={cn('mono text-[0.6875rem] text-muted-foreground', className)}>
      {maturityMeta[maturity].label}
    </span>
  );
}

/* ─────────────────────────── B · Estado editorial ─────────────────────────── */

const editorialTone: Record<ReportStatus, string> = {
  'en-investigacion': 'border-l-signal text-signal bg-signal/[0.07]',
  borrador: 'border-l-warning text-warning bg-warning/[0.07]',
  'en-revision': 'border-l-warning text-warning bg-warning/[0.07]',
  publicado: 'border-l-success text-success bg-success/[0.07]',
};

/**
 * En qué punto del ciclo editorial está un documento. Un informe «publicado»
 * puede apoyarse en evidencia débil: esta familia no habla de eso.
 */
export function EditorialStatus({
  status,
  className,
}: {
  status: ReportStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'mono inline-flex items-center rounded-sm border-l-2 px-2 py-0.5',
        'text-[0.6875rem] font-medium uppercase tracking-wider',
        editorialTone[status],
        className,
      )}
    >
      {reportStatusMeta[status].label}
    </span>
  );
}

/* ─────────────────────────── C · Estado epistemológico ─────────────────────────── */

const epistemicTone: Record<EvidenceLevel, string> = {
  FACT: 'text-success',
  SIGNAL: 'text-signal',
  INFERENCE: 'text-warning',
  HYPOTHESIS: 'text-accent',
  PENDING: 'text-muted-foreground',
};

/**
 * Cuánto sostiene la evidencia. Es la única familia que habla de verdad, y por
 * eso se pinta como código: corchetes, monoespaciada, sin fondo ni píldora. No
 * es una insignia de progreso; es una clasificación.
 *
 * `code` añade el identificador técnico —`[HECHO · FACT]`— para las fichas
 * donde el lector necesita el término del esquema, no la traducción.
 */
export function EpistemicTag({
  level,
  code = false,
  className,
}: {
  level: EvidenceLevel;
  code?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'mono text-[0.6875rem] font-medium uppercase tracking-wider',
        epistemicTone[level],
        className,
      )}
      title={evidenceLevels[level].definition}
    >
      [{evidenceLevels[level].label}
      {code && <span className="text-muted-foreground"> · {level}</span>}]
    </span>
  );
}

/* ─────────────────────────── D · Estado del trabajo ─────────────────────────── */

/**
 * Cuarta familia: **¿en qué punto va esta línea de trabajo?**
 *
 * Es una pregunta que ninguna de las tres anteriores contesta. Un informe puede
 * estar `en-revision` como documento —familia editorial— y ser a la vez la
 * línea más atrasada del laboratorio. Son dos hechos distintos sobre la misma
 * cosa.
 *
 * **Silueta propia: un medidor de cuatro tramos.** No es un capricho de estilo;
 * es lo que la información pide. Las otras tres familias responden «qué es
 * esto», y una etiqueta basta. Ésta responde «cuánto falta», que es una
 * posición en una recta, y una posición se lee mejor dibujada que escrita.
 *
 *   MADUREZ     píldora con punto        ● PROTOTIPO
 *   EDITORIAL   sello con filo izquierdo ▏EN REVISIÓN
 *   EPISTÉMICO  código entre corchetes   [SEÑAL]
 *   TRABAJO     medidor de tramos        ▰▰▱▱ EN DESARROLLO
 *
 * **Los estados fuera de la recta no reciben medidor.** `comprometido` y
 * `supeditado` no son «más avanzados» que un desarrollo: son otra clase de
 * hecho —una fecha dada, una condición pendiente— y llevan una marca distinta.
 * Dibujarlos en la recta sugeriría un progreso que nadie ha medido.
 *
 * El medidor no depende del color: los tramos llenos se distinguen de los
 * vacíos por opacidad y borde, así que sobrevive en escala de grises. Y el
 * recuento va además en texto para lectores de pantalla, porque cuatro
 * rectángulos no se leen en voz alta.
 */

const stageTone: Record<'muted' | 'signal' | 'warning' | 'success', string> = {
  muted: 'text-muted-foreground',
  signal: 'text-signal',
  warning: 'text-warning',
  success: 'text-success',
};

const stageFill: Record<'muted' | 'signal' | 'warning' | 'success', string> = {
  muted: 'bg-muted-foreground',
  signal: 'bg-signal',
  warning: 'bg-warning',
  success: 'bg-success',
};

export function StageMeter({
  stage,
  pipelineIndex,
  className,
}: {
  stage: WorkStage;
  /** Posición en la recta, o `null` si el estado está fuera de ella. */
  pipelineIndex: number | null;
  className?: string;
}) {
  const meta = workStageMeta[stage];
  const total = workPipeline.length;

  /** Sólo estas dos avanzan ahora mismo. Ver `.stage-live` en globals.css. */
  const enMarcha = stage === 'en-desarrollo' || stage === 'en-revision';

  return (
    <span className={cn('inline-flex items-center gap-2', className)} title={meta.meaning}>
      {pipelineIndex === null ? (
        /*
          Fuera de la recta. Un trazo discontinuo dice «esto no avanza por
          etapas» sin necesidad de explicarlo: es una condición, no un progreso.
        */
        <span
          aria-hidden
          className={cn(
            'h-[3px] w-11 rounded-full border-t-2 border-dashed',
            stage === 'comprometido' ? 'border-warning/70' : 'border-muted-foreground/50',
          )}
        />
      ) : (
        <span aria-hidden className="inline-flex items-center gap-[3px]">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-[3px] w-2.5 rounded-full transition-opacity',
                i <= pipelineIndex
                  ? cn(stageFill[meta.tone], 'opacity-100')
                  : 'bg-muted-foreground opacity-25',
                /*
                  El tramo actual late, y sólo si la línea está de verdad en
                  marcha. Publicado no late porque ya llegó; en estudio no late
                  porque todavía no arrancó. Así el movimiento significa algo en
                  vez de adornar.
                */
                i === pipelineIndex && enMarcha && 'stage-live',
              )}
            />
          ))}
        </span>
      )}

      <span
        className={cn(
          'mono text-[0.625rem] font-medium uppercase tracking-wider',
          stageTone[meta.tone],
        )}
      >
        {meta.label}
      </span>

      {/* Cuatro rectángulos no se leen en voz alta. Esto sí. */}
      <span className="sr-only">
        {pipelineIndex === null
          ? `${meta.label}. ${meta.meaning}`
          : `Etapa ${pipelineIndex + 1} de ${total}: ${meta.label}. ${meta.meaning}`}
      </span>
    </span>
  );
}
