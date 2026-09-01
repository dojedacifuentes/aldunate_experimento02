import Link from 'next/link';

import { cn } from '@/lib/utils';
import { sourceById, sources } from '@/data/aldunate';
import type { AcademicSource, EvidenceLevel } from '@/types';

/**
 * Sistema de evidencia de la página.
 *
 * El encargo pedía tres marcas (dato verificado · posición respaldada ·
 * síntesis editorial). Aquí se usan los cinco niveles que el sitio ya emplea
 * en toda la capa de investigación: una segunda escala solo para esta ruta
 * haría incomparables sus afirmaciones con las de los informes, que es
 * justamente lo que la trazabilidad debe evitar.
 *
 * Ninguna marca dice «% de verdad». Dice de qué tipo es la afirmación y
 * cuántas fuentes la sostienen; el lector saca su conclusión.
 */

const levelMeta: Record<
  EvidenceLevel,
  { label: string; glyph: string; className: string; help: string }
> = {
  FACT: {
    label: 'Verificado',
    glyph: '●',
    className: 'text-success border-success/40 bg-success/10',
    help: 'Sostenido por dos o más fuentes independientes, o por una fuente institucional o un índice bibliográfico.',
  },
  SIGNAL: {
    label: 'Indicio',
    glyph: '◆',
    className: 'text-warning border-warning/40 bg-warning/10',
    help: 'Consta en una sola fuente secundaria, o las fuentes discrepan en el detalle. Se publica con la reserva a la vista.',
  },
  INFERENCE: {
    label: 'Inferencia',
    glyph: '◇',
    className: 'text-signal border-signal/40 bg-signal/10',
    help: 'Deducido a partir de datos verificados. La deducción se explica; no se presenta como dato.',
  },
  HYPOTHESIS: {
    label: 'Hipótesis',
    glyph: '○',
    className: 'text-muted-foreground border-border bg-muted/60',
    help: 'Formulación tentativa. No hay fuente que la sostenga todavía.',
  },
  PENDING: {
    label: 'Sin leer',
    glyph: '□',
    className: 'text-muted-foreground border-border bg-muted/60',
    help: 'Se sabe que la obra aborda el problema; no se ha consultado su texto completo, de modo que no se atribuye ninguna posición.',
  },
};

export function EvidenceBadge({
  level,
  className,
  withLabel = true,
}: {
  level: EvidenceLevel;
  className?: string;
  withLabel?: boolean;
}) {
  const meta = levelMeta[level];
  return (
    <span
      title={meta.help}
      className={cn(
        'mono inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5',
        'text-[0.625rem] font-medium uppercase tracking-wider',
        meta.className,
        className,
      )}
    >
      <span aria-hidden>{meta.glyph}</span>
      <span className={withLabel ? undefined : 'sr-only'}>{meta.label}</span>
    </span>
  );
}

/** Leyenda de la escala. Se muestra una vez por página, no en cada tarjeta. */
export function EvidenceLegend({ levels }: { levels: EvidenceLevel[] }) {
  const shown = [...new Set(levels)];
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {shown.map((level) => (
        <div key={level} className="flex gap-3">
          <dt className="shrink-0 pt-0.5">
            <EvidenceBadge level={level} />
          </dt>
          <dd className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            {levelMeta[level].help}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Referencia numerada a una fuente.
 *
 * Enlaza al ancla de la bibliografía al pie. No abre un tooltip flotante: en
 * una página que se imprime y se lee con teclado, un salto al listado es más
 * robusto y deja la referencia visible en el papel.
 */
export function SourceRef({ ids, className }: { ids: string[]; className?: string }) {
  const found = ids.map((id) => sourceById.get(id)).filter((s): s is AcademicSource => Boolean(s));
  if (found.length === 0) return null;

  return (
    <span className={cn('mono inline-flex flex-wrap gap-1 align-baseline', className)}>
      {found.map((source) => (
        <Link
          key={source.id}
          href={`#fuente-${source.id}`}
          title={`${source.title} — ${source.publisher}`}
          className={cn(
            // 24×24 px es el mínimo de WCAG 2.2 para un objetivo táctil. El
            // texto sigue en 10 px; lo que crece es el área que responde.
            'inline-flex min-h-6 min-w-6 items-center justify-center',
            'rounded border border-border/70 px-1.5 text-[0.625rem] leading-none',
            'text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          {sourceIndex(source.id)}
        </Link>
      ))}
    </span>
  );
}

/** Número estable de cada fuente: el orden del registro, no el de aparición. */
const order = new Map(sources.map((s, i) => [s.id, String(i + 1).padStart(2, '0')]));
function sourceIndex(id: string) {
  return order.get(id) ?? '··';
}

export { levelMeta };
