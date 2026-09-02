import { sourceById, timeline } from '@/data/aldunate';
import { cn } from '@/lib/utils';
import type { TimelineKind } from '@/types';

import { EvidenceBadge, SourceRef } from './Evidence';

/**
 * Cronología.
 *
 * Componente de servidor: no necesita estado. Un eje horizontal con
 * desplazamiento en escritorio y vertical en móvil se resuelve con dos clases
 * de grilla y `scroll-snap`; montarlo con JavaScript habría añadido hidratación
 * a cambio de nada.
 *
 * Cada hito lleva su nivel de evidencia a la vista. La cronología es
 * exactamente el sitio donde un dato débil se disfraza de dato duro: puesto en
 * una línea junto a otros, un año que consta en una sola ficha colaborativa
 * parece tan firme como uno indexado. Aquí no.
 */

const kindLabel: Record<TimelineKind, string> = {
  formacion: 'Formación',
  cargo: 'Cargo',
  obra: 'Obra',
  institucional: 'Institucional',
};

const kindAccent: Record<TimelineKind, string> = {
  formacion: 'bg-signal',
  cargo: 'bg-accent',
  obra: 'bg-primary',
  institucional: 'bg-muted-foreground',
};

export function AcademicTimeline() {
  const events = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <div>
      {/* Leyenda de categorías. Discreta, sin convertirse en un gráfico. */}
      <ul className="mb-6 flex flex-wrap gap-x-5 gap-y-2">
        {(Object.keys(kindLabel) as TimelineKind[]).map((kind) => (
          <li key={kind} className="flex items-center gap-2">
            <span className={cn('h-1.5 w-1.5 rounded-full', kindAccent[kind])} aria-hidden />
            <span className="mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
              {kindLabel[kind]}
            </span>
          </li>
        ))}
      </ul>

      {/* Eje. Horizontal con arrastre en pantallas anchas; vertical debajo. */}
      <ol
        className={cn(
          'grid gap-4',
          'lg:snap-x lg:snap-mandatory lg:grid-flow-col lg:auto-cols-[minmax(15rem,1fr)]',
          'lg:overflow-x-auto lg:pb-5',
        )}
      >
        {events.map((event) => (
          <li
            key={event.id}
            className="relative lg:snap-start"
          >
            <div className="surface h-full rounded-lg p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-serif text-2xl leading-none text-foreground">
                  {event.year}
                  {event.endYear && (
                    <span className="mono ml-1.5 text-[0.75rem] text-muted-foreground">
                      —{event.endYear}
                    </span>
                  )}
                </p>
                <span
                  className={cn('h-1.5 w-1.5 shrink-0 rounded-full', kindAccent[event.kind])}
                  aria-hidden
                />
              </div>

              <h3 className="mt-3.5 text-[0.9375rem] font-medium leading-snug text-foreground">
                {event.title}
              </h3>

              {event.detail && (
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {event.detail}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                <EvidenceBadge level={event.classification} withLabel={false} />
                <SourceRef ids={event.sourceIds} />
                <span className="mono ml-auto text-[0.5625rem] uppercase tracking-wider text-muted-foreground">
                  {kindLabel[event.kind]}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="mono mt-4 hidden text-[0.625rem] uppercase tracking-wider text-muted-foreground lg:block">
        ← Desplaza el eje →
      </p>
    </div>
  );
}

/** Bibliografía completa. También de servidor: es una lista, no una aplicación. */
export function SourceList({ ids }: { ids?: string[] }) {
  const list = ids
    ? ids.map((id) => sourceById.get(id)).filter((s) => s !== undefined)
    : [...sourceById.values()];

  const tierLabel = {
    indice: 'Índice bibliográfico',
    publicacion: 'Publicación original',
    institucional: 'Fuente institucional',
    secundaria: 'Fuente secundaria',
  } as const;

  return (
    <ol className="divide-y divide-border/60 border-y border-border/60">
      {list.map((source, i) => (
        <li key={source.id} id={`fuente-${source.id}`} className="scroll-mt-24 py-5">
          <div className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
            <span className="mono text-[0.75rem] text-primary">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-[0.9375rem] leading-snug text-foreground">{source.title}</h3>
                <span
                  className={cn(
                    'mono rounded-full border px-2 py-px text-[0.5625rem] uppercase tracking-wider',
                    source.tier === 'secundaria'
                      ? 'border-warning/40 bg-warning/10 text-warning'
                      : 'border-border/70 text-muted-foreground',
                  )}
                >
                  {tierLabel[source.tier]}
                </span>
              </div>

              <p className="mono mt-1 text-[0.6875rem] text-muted-foreground">
                {source.publisher}
              </p>

              <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                <span className="meta mr-2">Sostiene</span>
                {source.supports}
              </p>

              {source.caveat && (
                <p className="mt-2 border-l-2 border-warning/40 pl-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {source.caveat}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mono inline-flex min-h-6 items-center break-all text-[0.6875rem] text-primary hover:underline"
                  >
                    {source.url.replace(/^https:\/\//, '')} ↗
                  </a>
                )}
                <span className="mono text-[0.625rem] text-muted-foreground">
                  Consultada {source.accessedDate}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
