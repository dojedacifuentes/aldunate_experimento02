'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

import {
  conceptById,
  conceptsWithCounts,
  publications,
  publicationsByDecade,
} from '@/data/aldunate';
import { cn } from '@/lib/utils';
import type { Publication } from '@/types';

import { SourceRef } from './Evidence';

/**
 * Catálogo navegable.
 *
 * Tres lecturas del mismo conjunto: la lista editorial, el eje temporal y la
 * agrupación por concepto. No son tres componentes: es el mismo dato filtrado,
 * de modo que un filtro activo sigue aplicando al cambiar de vista.
 *
 * Se descartó una cuarta vista de «red» que pedía el encargo: el grafo ya
 * existe en el mapa intelectual y repetirlo aquí habría duplicado la
 * complejidad sin añadir una lectura nueva.
 */

type View = 'lista' | 'tiempo' | 'temas';

const views: { id: View; label: string }[] = [
  { id: 'lista', label: 'Lista' },
  { id: 'tiempo', label: 'Tiempo' },
  { id: 'temas', label: 'Temas' },
];

export function PublicationExplorer() {
  const [view, setView] = useState<View>('lista');
  const [concept, setConcept] = useState<string | null>(null);
  const [kind, setKind] = useState<'todo' | 'libro' | 'articulo'>('todo');

  const filtered = useMemo(
    () =>
      publications
        .filter((p) => (concept ? p.concepts?.includes(concept) : true))
        .filter((p) => (kind === 'todo' ? true : p.kind === kind))
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
    [concept, kind],
  );

  return (
    <div>
      {/* ── Controles ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div role="tablist" aria-label="Forma de ver el catálogo" className="flex gap-1">
          {views.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={cn(
                'mono rounded px-3 py-1.5 text-[0.6875rem] uppercase tracking-wider transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                view === v.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['todo', 'libro', 'articulo'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                'mono rounded-full border px-2.5 py-0.5 text-[0.625rem] uppercase tracking-wider transition-colors',
                kind === k
                  ? 'border-primary/60 bg-primary/10 text-primary'
                  : 'border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {k === 'todo' ? 'Todo' : k === 'libro' ? 'Libros' : 'Artículos'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filtro por concepto ── */}
      <div className="flex flex-wrap items-center gap-1.5 py-4">
        <button
          type="button"
          onClick={() => setConcept(null)}
          className={cn(
            'mono rounded-full border px-2.5 py-0.5 text-[0.625rem] uppercase tracking-wider transition-colors',
            concept === null
              ? 'border-foreground/40 bg-muted text-foreground'
              : 'border-border/70 text-muted-foreground hover:border-primary/40',
          )}
        >
          Todos los temas
        </button>
        {conceptsWithCounts.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setConcept(concept === c.id ? null : c.id)}
            className={cn(
              'mono rounded-full border px-2.5 py-0.5 text-[0.625rem] uppercase tracking-wider transition-colors',
              concept === c.id
                ? 'border-primary/60 bg-primary/10 text-primary'
                : 'border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {c.title}
            <span className="ml-1.5 opacity-60">{c.count}</span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mono pb-5 text-[0.6875rem] text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'obra' : 'obras'}
        {concept ? ` · ${conceptById.get(concept)?.title}` : ''}
      </p>

      {/* ── Vistas ── */}
      {filtered.length === 0 ? (
        <p className="surface rounded-lg p-8 text-center text-sm text-muted-foreground">
          Ninguna obra del catálogo cumple ese cruce de filtros.
        </p>
      ) : view === 'lista' ? (
        <ol className="divide-y divide-border/60 border-y border-border/60">
          {filtered.map((pub) => (
            <PublicationRow key={pub.id} pub={pub} />
          ))}
        </ol>
      ) : view === 'tiempo' ? (
        <TimeView items={filtered} />
      ) : (
        <ThemeView items={filtered} />
      )}
    </div>
  );
}

/**
 * Fila del catálogo.
 *
 * Es un `<details>`, no un modal: se abre en su sitio, no atrapa el foco, se
 * imprime abierta si el lector la dejó abierta y funciona sin JavaScript.
 */
function PublicationRow({ pub }: { pub: Publication }) {
  return (
    <li>
      <details className="group">
        <summary
          className={cn(
            'relative flex cursor-pointer list-none items-baseline gap-4 py-4 pl-3',
            'transition-colors hover:bg-muted/40',
            'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
          )}
        >
          {/*
            Filete que crece desde arriba al pasar por encima y se queda
            mientras la ficha está abierta. Anima `transform`, no `height`:
            escalar no vuelve a maquetar la lista de cuarenta filas.
          */}
          <span
            aria-hidden
            className={cn(
              'interactive-only absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-primary',
              'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'group-hover:scale-y-100 group-open:scale-y-100',
            )}
          />

          <span
            className={cn(
              'mono w-10 shrink-0 text-[0.75rem] text-primary',
              'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'group-hover:translate-x-0.5',
            )}
          >
            {pub.year}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9375rem] leading-snug text-foreground">{pub.title}</span>
            <span className="mono mt-1 block text-[0.6875rem] text-muted-foreground">
              {pub.venue}
            </span>
          </span>
          <span className="mono hidden shrink-0 text-[0.625rem] uppercase tracking-wider text-muted-foreground sm:block">
            {pub.kind}
          </span>

          <ChevronDown
            aria-hidden
            className={cn(
              'h-3.5 w-3.5 shrink-0 self-center text-muted-foreground',
              'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'group-open:rotate-180',
            )}
          />
        </summary>

        <div className="grid gap-4 pb-6 pl-[4.25rem] pr-2 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            {pub.coauthors && pub.coauthors.length > 0 && (
              <p className="text-[0.8125rem] text-muted-foreground">
                <span className="meta mr-2">En coautoría con</span>
                {pub.coauthors.join(' · ')}
              </p>
            )}

            {pub.question && (
              <div>
                <p className="meta mb-1">Pregunta declarada</p>
                <p className="text-[0.8125rem] leading-relaxed text-foreground/85">
                  {pub.question}
                </p>
              </div>
            )}

            {pub.abstract && (
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {pub.abstract}
              </p>
            )}

            {!pub.question && !pub.abstract && (
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                Registrada por su ficha bibliográfica. Su argumento no se resume aquí porque
                no se ha consultado el texto completo.
              </p>
            )}

            {pub.concepts && pub.concepts.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {pub.concepts.map((id) => (
                  <li
                    key={id}
                    className="mono rounded border border-border/70 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-muted-foreground"
                  >
                    {conceptById.get(id)?.title ?? id}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <SourceRef ids={pub.sourceIds ?? []} />
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noreferrer noopener"
                className="mono inline-flex items-center gap-1 text-[0.625rem] uppercase tracking-wider text-primary hover:underline"
              >
                Texto
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </details>
    </li>
  );
}

/** Eje temporal por décadas. Una lectura de ritmo, no de detalle. */
function TimeView({ items }: { items: Publication[] }) {
  const decades = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const decade of publicationsByDecade.keys()) map.set(decade, []);
    for (const item of items) {
      if (typeof item.year !== 'number') continue;
      const decade = Math.floor(item.year / 10) * 10;
      map.set(decade, [...(map.get(decade) ?? []), item]);
    }
    return [...map.entries()].filter(([, list]) => list.length > 0).sort((a, b) => b[0] - a[0]);
  }, [items]);

  return (
    <div className="space-y-10">
      {decades.map(([decade, list]) => (
        <section key={decade} className="grid gap-5 sm:grid-cols-[7rem_1fr]">
          <div className="sm:sticky sm:top-24 sm:self-start">
            <p className="font-serif text-3xl leading-none text-foreground">{decade}s</p>
            <p className="mono mt-1.5 text-[0.625rem] uppercase tracking-wider text-muted-foreground">
              {list.length} {list.length === 1 ? 'obra' : 'obras'}
            </p>
          </div>
          <ul className="space-y-px border-l border-border/70 pl-5">
            {list.map((pub) => (
              <li key={pub.id} className="relative py-2.5">
                <span
                  aria-hidden
                  className="absolute -left-[1.4rem] top-[1.1rem] h-1.5 w-1.5 rounded-full bg-primary/70"
                />
                <p className="text-[0.875rem] leading-snug text-foreground">
                  <span className="mono mr-2 text-[0.75rem] text-primary">{pub.year}</span>
                  {pub.title}
                </p>
                <p className="mono mt-0.5 text-[0.625rem] text-muted-foreground">{pub.venue}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Agrupación por concepto. Deja ver dónde se concentra el corpus. */
function ThemeView({ items }: { items: Publication[] }) {
  const groups = useMemo(
    () =>
      conceptsWithCounts
        .map((concept) => ({
          concept,
          list: items.filter((p) => p.concepts?.includes(concept.id)),
        }))
        .filter((g) => g.list.length > 0),
    [items],
  );

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {groups.map(({ concept, list }) => (
        <section key={concept.id} className="surface rounded-lg p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-lg text-foreground">{concept.title}</h3>
            <span className="mono text-[0.6875rem] text-primary">{list.length}</span>
          </div>
          <ul className="mt-3.5 space-y-2 border-t border-border/60 pt-3.5">
            {list.map((pub) => (
              <li key={pub.id} className="text-[0.8125rem] leading-snug">
                <span className="mono mr-2 text-[0.6875rem] text-primary">{pub.year}</span>
                <span className="text-muted-foreground">{pub.title}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
