'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

import {
  conceptEdges,
  conceptNeighbours,
  conceptsWithCounts,
  publicationsByConcept,
} from '@/data/aldunate';
import { cn } from '@/lib/utils';

/**
 * Mapa intelectual.
 *
 * Deliberadamente **no** es WebGL. La información que contiene —qué conceptos
 * recorre el corpus y cuáles comparten obra— es de las importantes, y §40 del
 * encargo prohíbe que algo así viva solo dentro de un canvas. En SVG el grafo
 * se navega con teclado, se lee con lector de pantalla, se imprime y aparece
 * en el HTML servido. El WebGL del hero es la metáfora; esto es el dato.
 *
 * La disposición es determinista: los conceptos se ordenan por número de obras
 * y se reparten en un anillo. Un `force layout` daría una figura distinta en
 * cada carga, y un diagrama que cambia de forma sin que cambien los datos no
 * es un diagrama.
 */

const SIZE = 760;
const CENTER = SIZE / 2;
const RING = 268;

export function ConceptMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const active = hovered ?? selected;

  const layout = useMemo(() => {
    const nodes = conceptsWithCounts;
    const max = Math.max(...nodes.map((n) => n.count));
    const step = (Math.PI * 2) / nodes.length;

    return nodes.map((node, i) => {
      const angle = -Math.PI / 2 + i * step;
      return {
        ...node,
        x: CENTER + Math.cos(angle) * RING,
        y: CENTER + Math.sin(angle) * RING,
        r: 7 + (node.count / max) * 15,
        /** A la izquierda del círculo la etiqueta se alinea al otro lado. */
        flip: Math.cos(angle) < -0.01,
        angle,
      };
    });
  }, []);

  const byId = useMemo(() => new Map(layout.map((n) => [n.id, n])), [layout]);

  /** Vecinos del concepto activo. Lo demás se atenúa, no desaparece. */
  const related = useMemo(() => {
    if (!active) return null;
    return new Set([active, ...(conceptNeighbours.get(active) ?? []).map((n) => n.id)]);
  }, [active]);

  const detail = selected ? byId.get(selected) : null;
  const detailWorks = selected ? (publicationsByConcept.get(selected) ?? []) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
      {/* ── Diagrama. Oculto bajo `md`: ahí manda la lista. ── */}
      <div className="hidden md:block">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="interactive-only h-auto w-full"
          role="group"
          aria-label="Mapa de conceptos del corpus. Cada punto es un concepto; cada línea, una obra que reúne a dos."
        >
          {/* Aristas primero: quedan bajo los nodos. */}
          <g>
            {conceptEdges.map((edge) => {
              const a = byId.get(edge.source);
              const b = byId.get(edge.target);
              if (!a || !b) return null;
              const on = !active || (related?.has(edge.source) && related?.has(edge.target));
              return (
                <path
                  key={`${edge.source}-${edge.target}`}
                  d={`M ${a.x} ${a.y} Q ${CENTER} ${CENTER} ${b.x} ${b.y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.6 + edge.weight * 0.45}
                  className={cn(
                    'text-primary transition-opacity duration-500',
                    on ? 'opacity-40' : 'opacity-[0.06]',
                  )}
                />
              );
            })}
          </g>

          {/* Nodos. Cada uno es un control real: foco, teclado, etiqueta. */}
          <g>
            {layout.map((node) => {
              const on = !active || related?.has(node.id);
              const isActive = active === node.id;
              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected === node.id}
                  aria-label={`${node.title}. ${node.count} ${node.count === 1 ? 'obra' : 'obras'}.`}
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(node.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setSelected((prev) => (prev === node.id ? null : node.id))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelected((prev) => (prev === node.id ? null : node.id));
                    }
                  }}
                >
                  {/* Área táctil generosa, invisible. */}
                  <circle cx={node.x} cy={node.y} r={Math.max(node.r + 12, 24)} fill="transparent" />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    className={cn(
                      'transition-all duration-500',
                      isActive ? 'fill-primary' : 'fill-primary/70',
                      on ? 'opacity-100' : 'opacity-20',
                    )}
                  />
                  {isActive && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 7}
                      fill="none"
                      strokeWidth={1}
                      className="stroke-primary/50"
                    />
                  )}
                  <text
                    x={node.x + (node.flip ? -(node.r + 12) : node.r + 12)}
                    y={node.y + 4}
                    textAnchor={node.flip ? 'end' : 'start'}
                    className={cn(
                      'pointer-events-none text-[13px] transition-opacity duration-500',
                      isActive ? 'fill-foreground' : 'fill-muted-foreground',
                      on ? 'opacity-100' : 'opacity-25',
                    )}
                  >
                    {node.title}
                  </text>
                  <text
                    x={node.x + (node.flip ? -(node.r + 12) : node.r + 12)}
                    y={node.y + 20}
                    textAnchor={node.flip ? 'end' : 'start'}
                    className={cn(
                      'mono pointer-events-none text-[10px] transition-opacity duration-500',
                      'fill-muted-foreground',
                      on ? 'opacity-70' : 'opacity-15',
                    )}
                  >
                    {node.count} {node.count === 1 ? 'obra' : 'obras'}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* ── Lista. Es el control en móvil y el índice en escritorio. ── */}
      <div className="md:hidden">
        <ConceptList selected={selected} onSelect={setSelected} />
      </div>

      {/* ── Panel de detalle ── */}
      <aside className="lg:sticky lg:top-24">
        {detail ? (
          <div className="surface rounded-lg p-6">
            <p className="meta mb-2">Concepto</p>
            <h3 className="font-serif text-2xl leading-tight text-foreground">{detail.title}</h3>
            <p className="mono mt-2 text-[0.6875rem] uppercase tracking-wider text-primary">
              {detail.count} {detail.count === 1 ? 'obra' : 'obras'} en el catálogo
            </p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{detail.summary}</p>

            {(conceptNeighbours.get(detail.id)?.length ?? 0) > 0 && (
              <div className="mt-5 border-t border-border/60 pt-4">
                <p className="meta mb-2">Comparte obra con</p>
                <ul className="flex flex-wrap gap-1.5">
                  {conceptNeighbours.get(detail.id)!.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(n.id)}
                        className="mono rounded border border-border/70 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                      >
                        {byId.get(n.id)?.title ?? n.id}
                        <span className="ml-1 opacity-60">×{n.weight}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 border-t border-border/60 pt-4">
              <p className="meta mb-2.5">Obras</p>
              <ul className="space-y-2.5">
                {detailWorks.slice(0, 6).map((work) => (
                  <li key={work.id} className="text-[0.8125rem] leading-snug">
                    <span className="mono mr-2 text-[0.6875rem] text-primary">{work.year}</span>
                    <span className="text-foreground/85">{work.title}</span>
                  </li>
                ))}
              </ul>
              {detailWorks.length > 6 && (
                <a
                  href={`#publicaciones`}
                  className="mono mt-4 inline-flex items-center gap-1 text-[0.6875rem] uppercase tracking-wider text-primary hover:underline"
                >
                  Ver las {detailWorks.length} en el catálogo
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mono mt-5 text-[0.625rem] uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="surface rounded-lg p-6">
            <p className="meta mb-3">Cómo leer el mapa</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              El tamaño de cada punto es el número de obras del catálogo que tratan ese
              concepto. Cada línea une dos conceptos que aparecen juntos en una misma obra,
              y su grosor es cuántas veces ocurre.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Las relaciones no están escritas a mano: se calculan desde el catálogo. El
              mapa no puede dibujar un vínculo que las publicaciones no sostengan.
            </p>
            <div className="mt-5 hidden border-t border-border/60 pt-4 md:block">
              <ConceptList selected={selected} onSelect={setSelected} compact />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function ConceptList({
  selected,
  onSelect,
  compact = false,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
  compact?: boolean;
}) {
  return (
    <>
      {!compact && <p className="meta mb-3">Conceptos del corpus</p>}
      {compact && <p className="meta mb-2.5">Ir a un concepto</p>}
      <ul className={cn('grid gap-1.5', !compact && 'sm:grid-cols-2')}>
        {conceptsWithCounts.map((concept) => (
          <li key={concept.id}>
            <button
              type="button"
              onClick={() => onSelect(selected === concept.id ? null : concept.id)}
              className={cn(
                'flex w-full items-baseline justify-between gap-3 rounded-md border px-3 py-2 text-left',
                'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                selected === concept.id
                  ? 'border-primary/60 bg-primary/5 text-foreground'
                  : 'border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <span className={cn(compact ? 'text-[0.8125rem]' : 'text-sm')}>{concept.title}</span>
              <span className="mono shrink-0 text-[0.625rem] text-primary">{concept.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
