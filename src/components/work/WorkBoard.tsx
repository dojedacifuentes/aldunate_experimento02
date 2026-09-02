import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/common/ui';
import { StageMeter } from '@/components/common/status';
import {
  resolveWorkItems,
  workKindMeta,
  workStageMeta,
  workStageOrder,
} from '@/data/trabajos';
import { cn } from '@/lib/utils';
import type { WorkStage } from '@/types';

/**
 * Color de la cifra del recuento. Se escribe completo y por estado —sin
 * construir la clase— porque Tailwind extrae las clases del código fuente y
 * una clase armada en tiempo de ejecución nunca llega a la hoja de estilos.
 */
const stageCountTone: Record<WorkStage, string> = {
  'en-estudio': 'text-muted-foreground',
  'en-desarrollo': 'text-signal',
  'en-revision': 'text-warning',
  publicado: 'text-success',
  comprometido: 'text-warning',
  supeditado: 'text-muted-foreground',
};

/**
 * Estado del arte — qué se está haciendo aquí ahora mismo y cuánto le falta.
 *
 * Va en la portada, inmediatamente después del vestíbulo y **antes de las
 * puertas**, porque es la primera pregunta que se hace quien llega a un sitio
 * que se presenta como laboratorio en marcha. Antes había que leer cuatro
 * secciones y sumar de cabeza.
 *
 * ── Por qué filas y no tarjetas ──
 *
 * Una rejilla de tarjetas se lee pieza a pieza. Un tablero de estado se lee en
 * vertical: la vista baja por la columna de medidores y saca el cuadro completo
 * antes de haber leído un solo título. Por eso el medidor ocupa siempre la
 * misma posición en todas las filas, y por eso las filas son anchas en vez de
 * estar en tres columnas.
 *
 * ── Qué se muestra y qué no ──
 *
 * Cada fila lleva **estado y siguiente paso**, siempre los dos. Un estado sin
 * siguiente paso es una etiqueta que nadie puede auditar; con él, cualquiera
 * comprueba dentro de un mes si la línea avanzó o sólo cambió de rótulo. Las
 * salvedades no se pliegan: si una ficha dice «comprometido», la advertencia de
 * que no está formalizado tiene que verse a la vez que la palabra, no detrás de
 * un clic.
 */
export function WorkBoard() {
  const items = resolveWorkItems();

  /*
    Recuento por etapa, en el orden del vocabulario y sin etapas vacías.
    Existe porque el tablero completo mide más de dos pantallas en un teléfono
    —medido: 2067 px a 375 px de ancho— y «legible de un vistazo» no puede
    depender de recorrerlo entero. Esta línea da el cuadro antes del detalle.
    Se calcula, no se escribe: una cifra a mano aquí se desincroniza en cuanto
    alguien añada una línea de trabajo.
  */
  const recuento = [...workStageOrder]
    .map((stage) => ({
      stage,
      n: items.filter((i) => i.resolvedStage === stage).length,
    }))
    .filter((r) => r.n > 0);

  return (
    <section
      aria-labelledby="estado-del-arte"
      className="border-t border-border/70 py-14 sm:py-16"
    >
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="meta mb-3 text-primary">Estado del arte</p>
            <h2 id="estado-del-arte" className="text-2xl sm:text-3xl">
              En qué va cada línea
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Todo lo que está en marcha, con su etapa y lo que falta para la
              siguiente. Lo que no aparece aquí, no está en curso.
            </p>
          </div>

          {/*
            El cuadro en una línea. En un teléfono el tablero completo son dos
            pantallas y media; esto se lee en un segundo y el detalle queda
            debajo para quien lo quiera.
          */}
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {recuento.map(({ stage, n }) => (
              <li key={stage} className="flex items-baseline gap-1.5">
                <span
                  className={cn('mono text-lg leading-none', stageCountTone[stage])}
                  aria-hidden
                >
                  {n}
                </span>
                <span className="mono text-[0.625rem] uppercase tracking-wider text-muted-foreground">
                  {workStageMeta[stage].label}
                </span>
                <span className="sr-only">
                  {n} {n === 1 ? 'línea' : 'líneas'} en estado{' '}
                  {workStageMeta[stage].label}.
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-3">
          {items.map((item, i) => {
            const meta = workKindMeta[item.kind];
            /*
              Aparición escalonada. El retardo va en una variable que el CSS ya
              lee (`--reveal-delay`), así que no hay una animación por fila: hay
              una regla y cinco retardos. Se corta a los 240 ms —seis filas—
              para que la última no llegue tarde a una pantalla que ya se está
              leyendo.
            */
            const delay = `${Math.min(i, 6) * 60}ms`;

            const cuerpo = (
              <>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {meta.label}
                  </span>
                  {item.version && (
                    <span className="mono text-[0.625rem] text-muted-foreground">
                      v{item.version}
                    </span>
                  )}
                  {item.horizon && (
                    <span className="mono rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[0.625rem] uppercase tracking-wider text-warning">
                      {item.horizon}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-serif text-lg leading-snug text-foreground sm:text-xl">
                  {item.title}
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>

                <p className="mt-3 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-foreground/80">
                  <span
                    aria-hidden
                    className="mono mt-px shrink-0 text-primary"
                    title="Siguiente paso"
                  >
                    →
                  </span>
                  <span>
                    <span className="sr-only">Siguiente paso: </span>
                    {item.nextStep}
                  </span>
                </p>

                {/*
                  La salvedad no se pliega. Es la que impide que «comprometido»
                  se lea como anuncio institucional.
                */}
                {item.caveat && (
                  <p className="mt-3 border-l-2 border-l-warning/60 bg-warning/[0.06] px-3 py-2 text-[0.8125rem] leading-relaxed text-foreground/80">
                    {item.caveat}
                  </p>
                )}
              </>
            );

            return (
              <li
                key={item.id}
                data-reveal
                style={{ '--reveal-delay': delay } as React.CSSProperties}
              >
                {/*
                  Sólo es tarjeta espacial si lleva a alguna parte. Una
                  superficie que se levanta al pasar el cursor promete una
                  acción; sin `href` no la hay, y esa promesa vacía es el
                  hallazgo U-05 de la auditoría.
                */}
                {item.href ? (
                  <Link
                    href={item.href}
                    data-spatial
                    className="surface group grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6 sm:p-6"
                  >
                    <div className="min-w-0">{cuerpo}</div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-3">
                      <StageMeter
                        stage={item.resolvedStage}
                        pipelineIndex={item.pipelineIndex}
                      />
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    </div>
                  </Link>
                ) : (
                  <div
                    className={cn(
                      'surface rounded-lg p-5 sm:p-6',
                      'grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6',
                    )}
                  >
                    <div className="min-w-0">{cuerpo}</div>
                    <StageMeter
                      stage={item.resolvedStage}
                      pipelineIndex={item.pipelineIndex}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
