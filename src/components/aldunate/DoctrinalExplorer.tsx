'use client';

import { useState } from 'react';

import { conceptById, doctrinalTopics, publicationById } from '@/data/aldunate';
import { cn } from '@/lib/utils';

import { EvidenceBadge } from './Evidence';

/**
 * Explorador de preguntas del corpus.
 *
 * El encargo lo llamaba «explorador de posturas doctrinales». Se construyó
 * como explorador de **preguntas**, y la diferencia es todo el punto: sin los
 * textos completos delante, lo que se puede mostrar con honestidad es qué
 * problema aborda cada serie de obras, no qué respuesta da.
 *
 * Por eso la mayoría de las entradas lleva la marca «sin leer». No es un hueco
 * a rellenar más tarde con una síntesis convincente: es el estado real del
 * conocimiento de esta página sobre esos textos, y decirlo vale más que una
 * paráfrasis deducida del título.
 */
export function DoctrinalExplorer() {
  const [activeId, setActiveId] = useState(doctrinalTopics[0]!.id);
  const active = doctrinalTopics.find((t) => t.id === activeId) ?? doctrinalTopics[0]!;

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
      {/* ── Índice de preguntas ── */}
      <nav aria-label="Preguntas del corpus">
        <ol className="space-y-px">
          {doctrinalTopics.map((topic, i) => (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => setActiveId(topic.id)}
                aria-current={topic.id === activeId}
                className={cn(
                  'group flex w-full items-start gap-3 border-l-2 py-3 pl-4 pr-2 text-left transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
                  topic.id === activeId
                    ? 'border-primary bg-primary/5'
                    : 'border-border/60 hover:border-primary/40 hover:bg-muted/40',
                )}
              >
                <span
                  className={cn(
                    'mono shrink-0 pt-0.5 text-[0.625rem]',
                    topic.id === activeId ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-[0.8125rem] leading-snug',
                    topic.id === activeId ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {conceptById.get(topic.conceptId)?.title ?? topic.conceptId}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Detalle ── */}
      <article className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
            {conceptById.get(active.conceptId)?.title}
          </span>
          <EvidenceBadge level={active.classification} />
        </div>

        <h3 className="mt-4 max-w-2xl font-serif text-[1.75rem] leading-[1.15] text-foreground sm:text-[2rem]">
          {active.question}
        </h3>

        <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {active.position}
        </p>

        {active.note && (
          <p className="mt-4 max-w-2xl border-l-2 border-warning/40 pl-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {active.note}
          </p>
        )}

        <div className="mt-8 border-t border-border/60 pt-5">
          <p className="meta mb-3">
            Obras que abordan la pregunta · {active.publicationIds.length}
          </p>
          <ul className="space-y-2.5">
            {active.publicationIds.map((id) => {
              const pub = publicationById.get(id);
              if (!pub) return null;
              return (
                <li key={id} className="flex items-baseline gap-3 text-[0.875rem] leading-snug">
                  <span className="mono w-9 shrink-0 text-[0.75rem] text-primary">{pub.year}</span>
                  <span>
                    <span className="text-foreground/90">{pub.title}</span>
                    <span className="mono ml-2 block text-[0.625rem] text-muted-foreground sm:inline sm:ml-2">
                      {pub.venue}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </div>
  );
}
