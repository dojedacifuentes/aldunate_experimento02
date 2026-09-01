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
 * Mapa intelectual — diagrama de arcos.
 *
 * Deliberadamente **no** es WebGL. Qué conceptos recorre el corpus y cuáles
 * comparten obra es información importante, y §40 del encargo prohíbe que algo
 * así viva solo dentro de un canvas. Aquí se navega con teclado, se lee con
 * lector de pantalla, se imprime y está en el HTML servido. El WebGL del hero
 * es la metáfora; esto es el dato.
 *
 * ── Por qué arcos y no una constelación radial ──
 *
 * La primera versión repartió los dieciséis conceptos sobre una elipse. Medido
 * en el navegador, tres rótulos se salían del contenedor y dos pares se
 * pisaban; apilar los de la cima y la base subió el recuento a cuatro, porque
 * un rótulo centrado ocupa más ancho que uno al costado. La causa no era el
 * ajuste: dieciséis títulos de hasta treinta caracteres alrededor de una
 * circunferencia no caben, y ninguna combinación de radios lo arregla.
 *
 * Un diagrama de arcos sí cabe, y no por suerte: los conceptos van en filas de
 * altura fija, de modo que **no pueden solaparse por construcción**, y las
 * relaciones se dibujan en un carril lateral. Se pierde la sugerencia de
 * constelación —que ya la da el campo del hero— y se gana que los dieciséis
 * nombres se lean siempre, en cualquier ancho.
 *
 * El orden es por número de obras, determinista. Un `force layout` daría una
 * figura distinta en cada carga, y un diagrama que cambia de forma sin que
 * cambien los datos no es un diagrama.
 */

/** Alto de fila en píxeles. Fija la geometría: la lista y el SVG comparten
 *  este número, y por eso cada arco aterriza exactamente en su concepto. */
const ROW = 40;
/** Ancho del carril de arcos. */
const LANE = 150;

export function ConceptMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const active = hovered ?? selected;

  const rows = useMemo(
    () => conceptsWithCounts.map((c, i) => ({ ...c, y: i * ROW + ROW / 2 })),
    [],
  );
  const byId = useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows]);
  const maxCount = rows[0]?.count ?? 1;

  const related = useMemo(() => {
    if (!active) return null;
    return new Set([active, ...(conceptNeighbours.get(active) ?? []).map((n) => n.id)]);
  }, [active]);

  const detail = selected ? byId.get(selected) : null;
  const detailWorks = selected ? (publicationsByConcept.get(selected) ?? []) : [];
  const height = rows.length * ROW;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-10">
      {/* ── Diagrama ── */}
      <div>
        <div
          className="flex"
          role="group"
          aria-label="Mapa de conceptos. Cada fila es un concepto; cada arco, las obras que reúnen a dos."
        >
          {/* Conceptos, en filas de alto fijo. Sin solapes posibles. */}
          <ol className="min-w-0 flex-1">
            {rows.map((row, i) => {
              const on = !active || related?.has(row.id);
              const isActive = active === row.id;
              return (
                <li key={row.id} style={{ height: ROW }} className="flex items-center">
                  <button
                    type="button"
                    aria-pressed={selected === row.id}
                    onMouseEnter={() => setHovered(row.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(row.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected((prev) => (prev === row.id ? null : row.id))}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-l-md py-1.5 pl-2 pr-3 text-left',
                      'transition-[opacity,background-color] duration-300',
                      'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
                      isActive && 'bg-primary/5',
                      on ? 'opacity-100' : 'opacity-30',
                    )}
                  >
                    <span className="mono w-5 shrink-0 text-[0.625rem] text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={cn(
                        'truncate text-[0.875rem] transition-colors',
                        isActive ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {row.title}
                    </span>

                    {/* Barra proporcional: el número de obras, de un vistazo. */}
                    <span className="ml-auto flex shrink-0 items-center gap-2">
                      <span
                        aria-hidden
                        style={{ width: `${(row.count / maxCount) * 72 + 4}px` }}
                        className={cn(
                          'h-1 rounded-full transition-colors',
                          isActive ? 'bg-primary' : 'bg-primary/45',
                        )}
                      />
                      <span className="mono w-5 text-right text-[0.6875rem] text-primary">
                        {row.count}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Carril de arcos. Es una lectura, no la única: las mismas
              relaciones están en el panel, como vecinos con su peso. */}
          <svg
            width={LANE}
            height={height}
            viewBox={`0 0 ${LANE} ${height}`}
            aria-hidden
            className="interactive-only hidden shrink-0 sm:block"
          >
            {conceptEdges.map((edge) => {
              const a = byId.get(edge.source);
              const b = byId.get(edge.target);
              if (!a || !b) return null;
              const on = !active || (related?.has(edge.source) && related?.has(edge.target));
              // La panza crece con la distancia entre filas: dos conceptos
              // lejanos se conectan por fuera y el haz no se apelmaza.
              const bulge = Math.min(18 + Math.abs(a.y - b.y) * 0.55, LANE - 8);
              return (
                <path
                  key={`${edge.source}-${edge.target}`}
                  d={`M 0 ${a.y} C ${bulge} ${a.y} ${bulge} ${b.y} 0 ${b.y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.7 + edge.weight * 0.5}
                  className={cn(
                    'text-primary transition-opacity duration-300',
                    on ? 'opacity-55' : 'opacity-[0.08]',
                  )}
                />
              );
            })}
          </svg>
        </div>

        <p className="mt-5 max-w-xl text-[0.8125rem] leading-relaxed text-muted-foreground">
          La barra es el número de obras. Cada arco une dos conceptos que aparecen juntos en
          una misma publicación, y su grosor es cuántas veces ocurre. Pasa por una fila para
          aislar sus relaciones.
        </p>
      </div>

      {/* ── Panel de detalle ── */}
      <aside className="lg:sticky lg:top-32">
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
                  href="#publicaciones"
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
              Los dieciséis conceptos salen de las obras del catálogo, no de una lista
              propuesta de antemano: cada uno etiqueta al menos una publicación, y una prueba
              lo comprueba en cada compilación.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Las relaciones tampoco están escritas a mano: se calculan desde el catálogo. El
              mapa no puede dibujar un vínculo que las publicaciones no sostengan.
            </p>
            <p className="mt-4 border-t border-border/60 pt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Elige un concepto para ver su definición, con qué otros comparte obra y qué
              publicaciones lo tratan.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
