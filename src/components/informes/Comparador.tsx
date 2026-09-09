'use client';

import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, Info, X } from 'lucide-react';

import { informe01Comparador } from '@/data/informe01Comparador';
import type { Informe01EstadoCapacidad, Informe01FilaComparador } from '@/types';
import { cn } from '@/lib/utils';

/**
 * El comparador ordinal, explorable.
 *
 * **Por qué existe.** Hasta la v2.2.0 el sitio servía un PDF dentro de un
 * marco: la matriz de diez capacidades por diez instituciones se leía como
 * imagen impresa, sin poder ordenarla, filtrarla ni preguntarle de dónde sale
 * una celda. Aquí se dibuja desde el mismo dato que publican las tablas del
 * documento —`informe01Comparador`, generado desde `matriz-v2.json`— y por eso
 * no puede decir una cifra distinta de la del PDF. Ninguna cifra de este
 * archivo está escrita a mano; es la regla de D-039 llevada a la web.
 *
 * **Tres decisiones de lectura.**
 *
 *  - El índice se muestra como **banda**, no como número. El piso es lo que la
 *    evidencia acredita hoy; el techo, lo que daría si las celdas sin concluir
 *    resultaran favorables. Una banda ancha no es una institución peor
 *    evaluada: es una peor investigada, y son cosas distintas.
 *  - La institución apartada se dibuja **fuera del orden y sin posición**. No
 *    es un detalle de presentación: quien firma trabaja en ella, y ponerla en
 *    la misma lista comprometería el instrumento entero (D-037).
 *  - Una celda cerrada con fuente que no pasó el contraste sustantivo lo
 *    **declara**. Trece de los veintiséis cierres están en ese caso, y son
 *    veinticinco puntos: dejar que se lean como igual de firmes que los demás
 *    sería exactamente la clase de confianza inflada que este informe existe
 *    para no cometer.
 */

/* El color codifica el peldaño, no la institución. Verde para lo acreditado
   con instrumento, ámbar para lo que opera sin él, gris para la ausencia y
   punteado para lo que no se pudo concluir: la incertidumbre se ve como
   incertidumbre y no como un cero. */
const TONO: Record<Informe01EstadoCapacidad, string> = {
  OPF: 'bg-primary/85 text-primary-foreground border-primary/85',
  OP: 'bg-primary/40 text-foreground border-primary/40',
  INC: 'bg-primary/15 text-foreground border-primary/25',
  ENT: 'bg-muted text-muted-foreground border-border',
  ADY: 'bg-muted text-muted-foreground border-border',
  NL: 'bg-transparent text-muted-foreground/60 border-border/60',
  NC: 'bg-transparent text-muted-foreground border-dashed border-muted-foreground/50',
};

type Orden = 'indice' | 'nombre' | number;

export function Comparador({ className }: { className?: string }) {
  const { capacidades, filas, apartada, maximo, rubrica, cierres } = informe01Comparador;

  const [orden, setOrden] = useState<Orden>('indice');
  const [capacidadActiva, setCapacidadActiva] = useState<number | null>(null);
  const [inspeccionada, setInspeccionada] = useState<{ fila: number; celda: number } | null>(null);

  const ordenadas = useMemo(() => {
    const copia = [...filas];
    if (orden === 'nombre') {
      return copia.sort((a, b) => a.institucion.localeCompare(b.institucion, 'es'));
    }
    if (typeof orden === 'number') {
      /* Al ordenar por una capacidad, el desempate sigue siendo el índice: si
         no, dos instituciones con el mismo estado quedarían en un orden que
         depende del arreglo de entrada y cambia sin motivo visible. */
      return copia.sort(
        (a, b) =>
          (b.celdas[orden].puntos ?? -1) - (a.celdas[orden].puntos ?? -1) ||
          b.piso - a.piso ||
          a.institucion.localeCompare(b.institucion, 'es'),
      );
    }
    return copia;
  }, [filas, orden]);

  /* La posición es la del orden publicado y no la de la vista: reordenar por
     una capacidad no renumera el comparador. */
  const posición = useMemo(
    () => new Map(filas.map((f, i) => [f.institucion, i + 1])),
    [filas],
  );

  const detalle =
    inspeccionada !== null
      ? { fila: ordenadas[inspeccionada.fila], celda: ordenadas[inspeccionada.fila]?.celdas[inspeccionada.celda] }
      : null;

  return (
    <div className={cn('min-w-0', className)}>
      {/* ── Controles ── */}
      <div className="mb-6 flex flex-wrap items-end gap-x-8 gap-y-4">
        <div>
          <label htmlFor="cmp-orden" className="meta mb-1.5 block text-primary">
            Ordenar por
          </label>
          <div className="flex items-center gap-2">
            <ArrowDownWideNarrow className="h-4 w-4 text-muted-foreground" aria-hidden />
            <select
              id="cmp-orden"
              value={typeof orden === 'number' ? `cap-${orden}` : orden}
              onChange={(e) => {
                const v = e.target.value;
                setOrden(v.startsWith('cap-') ? Number(v.slice(4)) : (v as Orden));
                setInspeccionada(null);
              }}
              className="ui min-h-9 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
            >
              <option value="indice">Índice de formalización</option>
              <option value="nombre">Nombre de la institución</option>
              {capacidades.map((c, i) => (
                <option key={c.clave} value={`cap-${i}`}>
                  {c.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="cmp-cap" className="meta mb-1.5 block text-primary">
            Destacar capacidad
          </label>
          <select
            id="cmp-cap"
            value={capacidadActiva ?? ''}
            onChange={(e) => setCapacidadActiva(e.target.value === '' ? null : Number(e.target.value))}
            className="ui min-h-9 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            <option value="">Ninguna · ver las diez</option>
            {capacidades.map((c, i) => (
              <option key={c.clave} value={i}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {capacidadActiva !== null && (
        <p className="mb-5 border-l-2 border-primary/60 py-1 pl-4 text-[0.875rem] text-muted-foreground">
          <span className="text-foreground">{capacidades[capacidadActiva].rotulo}.</span>{' '}
          {capacidades[capacidadActiva].pregunta}
        </p>
      )}

      {/* ── La matriz ──
          Desplaza dentro de su propia caja: el cuerpo de la página nunca lo
          hace en horizontal, en ninguno de los seis anchos. */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <caption className="sr-only">
            Índice de formalización de capacidad por institución y capacidad. Diez instituciones,
            diez capacidades. Cada celda declara su estado y, si procede, la fuente que lo cierra.
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="meta w-8 py-3 pr-2 text-muted-foreground">
                #
              </th>
              <th scope="col" className="meta py-3 pr-4 text-muted-foreground">
                Institución
              </th>
              {capacidades.map((c, i) => (
                <th
                  key={c.clave}
                  scope="col"
                  title={`${c.rotulo} — ${c.pregunta}`}
                  className={cn(
                    'meta whitespace-nowrap px-1.5 py-3 text-center text-muted-foreground transition-colors',
                    capacidadActiva === i && 'bg-primary/[0.07] text-foreground',
                  )}
                >
                  {c.corto}
                </th>
              ))}
              <th scope="col" className="meta py-3 pl-4 text-muted-foreground">
                Índice
              </th>
            </tr>
          </thead>
          <tbody>
            {ordenadas.map((fila, f) => (
              <Fila
                key={fila.institucion}
                fila={fila}
                rotulos={capacidades.map((c) => c.rotulo)}
                posicion={posición.get(fila.institucion) ?? null}
                maximo={maximo}
                capacidadActiva={capacidadActiva}
                inspeccionada={inspeccionada?.fila === f ? inspeccionada.celda : null}
                onInspeccionar={(c) =>
                  setInspeccionada((prev) =>
                    prev?.fila === f && prev.celda === c ? null : { fila: f, celda: c },
                  )
                }
              />
            ))}
          </tbody>
          {apartada && (
            <tfoot>
              <tr>
                <td colSpan={capacidades.length + 3} className="pt-6">
                  <p className="mb-2 border-t border-dashed border-border pt-5 text-[0.8125rem] text-muted-foreground">
                    <span className="text-foreground">Fuera del orden.</span> Quien firma trabaja en
                    la Escuela de Derecho de esta institución. Su perfil se publica para que se vea,
                    pero no puntúa contra las demás y no ocupa posición.
                  </p>
                </td>
              </tr>
              <tr className="opacity-80">
                <td className="py-3 pr-2 text-center text-muted-foreground/60" aria-hidden>
                  —
                </td>
                <th scope="row" className="py-3 pr-4 text-[0.875rem] font-normal italic text-foreground">
                  {apartada.institucion}
                </th>
                {apartada.celdas.map((celda) => (
                  <td key={celda.capacidad} className="px-1.5 py-3 text-center">
                    <span
                      className={cn(
                        'mono inline-flex min-w-11 justify-center rounded border px-1.5 py-1 text-[0.625rem]',
                        TONO[celda.estado],
                      )}
                    >
                      {celda.estado}
                    </span>
                  </td>
                ))}
                {/*
                  Sin banda y sin cifra. Desde la v3.2.0 el informe no publica
                  la puntuación de esta institución ni su lugar, y el sitio no
                  puede publicarlos por su cuenta: la banda dibujada junto a un
                  orden es una posición, aunque no lleve número. El perfil
                  completo se lee en el documento complementario, que no puntúa
                  contra nadie.
                */}
                <td className="py-3 pl-4">
                  <span className="mono whitespace-nowrap text-[0.6875rem] text-muted-foreground">
                    sin puntuación
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* ── Inspector de evidencia ── */}
      {detalle?.celda && (
        <div className="mt-6 rounded-lg border border-primary/30 bg-primary/[0.04] p-5">
          <div className="flex items-start gap-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="meta mb-1 text-primary">
                {detalle.fila.institucion} · {
                  capacidades.find((c) => c.clave === detalle.celda!.capacidad)?.rotulo
                }
              </p>
              <p className="text-[0.9375rem] text-foreground">
                <span className="mono mr-2 rounded border border-border px-1.5 py-0.5 text-[0.6875rem]">
                  {detalle.celda.estado}
                </span>
                {rubrica.find((r) => r.codigo === detalle.celda!.estado)?.significa}
                {detalle.celda.puntos !== null && (
                  <span className="text-muted-foreground"> · {detalle.celda.puntos} de 3 puntos</span>
                )}
              </p>

              {detalle.celda.cierre ? (
                <>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-muted-foreground">
                    {detalle.celda.cierre.nota}
                  </p>
                  <p className="mono mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem]">
                    {detalle.celda.cierre.fuentes.length > 0 ? (
                      detalle.celda.cierre.fuentes.map((f) => (
                        <span key={f} className="rounded border border-border px-1.5 py-0.5 text-foreground">
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        Ruta del protocolo recorrida sin localizar evidencia
                      </span>
                    )}
                    <span
                      className={cn(
                        'uppercase tracking-widest',
                        detalle.celda.cierre.contrastada ? 'text-muted-foreground' : 'text-accent',
                      )}
                    >
                      {detalle.celda.cierre.contrastada
                        ? 'evidencia contrastada'
                        : 'fuente de ronda 2 · sin contraste sustantivo'}
                    </span>
                  </p>
                </>
              ) : (
                <p className="mt-3 text-[0.875rem] text-muted-foreground">
                  Esta celda viene de la matriz de partida y no la modificó la ronda de ampliación.
                  Su evidencia está en la ficha institucional del anexo A.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setInspeccionada(null)}
              className="ui -m-1 shrink-0 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar el detalle de la celda"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* ── Leyenda ── */}
      <div className="mt-8 border-t border-border/60 pt-5">
        <p className="meta mb-3 text-muted-foreground">Los siete estados</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {rubrica.map((r) => (
            <li key={r.codigo} className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
              <span
                className={cn(
                  'mono inline-flex min-w-11 justify-center rounded border px-1.5 py-0.5 text-[0.625rem]',
                  TONO[r.codigo],
                )}
              >
                {r.codigo}
              </span>
              {r.significa}
              <span className="text-muted-foreground/70">
                · {r.puntos === null ? 'no puntúa' : `${r.puntos} p`}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted-foreground">
          El índice se publica como banda sobre {maximo} puntos posibles. El extremo izquierdo es el
          piso —lo acreditado hoy—; la parte punteada llega al techo, que es lo que daría si todas
          las celdas sin concluir resultaran favorables. Pulse cualquier celda para ver de dónde
          sale. De los {cierres.total} cierres de la ronda de ampliación, {cierres.expuestos} se
          apoyan en fuentes que no han pasado el contraste sustantivo, y suman{' '}
          {cierres.puntosExpuestos} puntos: la matriz lo señala celda por celda.
        </p>
      </div>
    </div>
  );
}

function Fila({
  fila,
  rotulos,
  posicion,
  maximo,
  capacidadActiva,
  inspeccionada,
  onInspeccionar,
}: {
  fila: Informe01FilaComparador;
  /* El rótulo del documento, no la clave del dataset: un lector de pantalla
     que anuncia «Formacion» sin tilde está leyendo el nombre de una variable. */
  rotulos: string[];
  posicion: number | null;
  maximo: number;
  capacidadActiva: number | null;
  inspeccionada: number | null;
  onInspeccionar: (celda: number) => void;
}) {
  return (
    <tr className="border-b border-border/50 last:border-b-0">
      <td className="mono py-3 pr-2 text-[0.6875rem] text-muted-foreground">{posicion}</td>
      <th scope="row" className="py-3 pr-4 text-[0.875rem] font-normal text-foreground">
        {fila.institucion}
      </th>
      {fila.celdas.map((celda, i) => (
        <td
          key={celda.capacidad}
          className={cn(
            'px-1.5 py-3 text-center transition-colors',
            capacidadActiva === i && 'bg-primary/[0.07]',
          )}
        >
          <button
            type="button"
            onClick={() => onInspeccionar(i)}
            aria-pressed={inspeccionada === i}
            aria-label={`${fila.institucion}, ${rotulos[i]}: ${celda.estado}. Ver de dónde sale.`}
            className={cn(
              'mono inline-flex min-w-11 justify-center rounded border px-1.5 py-1 text-[0.625rem] transition-all hover:brightness-110',
              TONO[celda.estado],
              inspeccionada === i && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
              /* Una celda cerrada con fuente sin contrastar lleva marca propia:
                 el subrayado no compite con el color del peldaño. */
              celda.cierre && !celda.cierre.contrastada && 'underline decoration-accent decoration-2 underline-offset-2',
            )}
          >
            {celda.estado}
          </button>
        </td>
      ))}
      <td className="py-3 pl-4">
        <Banda fila={fila} maximo={maximo} />
      </td>
    </tr>
  );
}

function Banda({ fila, maximo }: { fila: Informe01FilaComparador; maximo: number }) {
  const piso = (fila.piso / maximo) * 100;
  const incierto = ((fila.techo - fila.piso) / maximo) * 100;
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 w-24 shrink-0 overflow-hidden rounded-sm bg-muted"
        role="img"
        aria-label={
          fila.sinConcluir === 0
            ? `${fila.piso} puntos de ${maximo}, banda cerrada`
            : `entre ${fila.piso} y ${fila.techo} puntos de ${maximo}, con ${fila.sinConcluir} celdas sin concluir`
        }
      >
        <div className="flex h-full">
          <div className="h-full bg-primary" style={{ width: `${piso}%` }} />
          {incierto > 0 && (
            <div
              className="h-full bg-primary/25"
              style={{
                width: `${incierto}%`,
                backgroundImage:
                  'repeating-linear-gradient(45deg, currentColor 0 2px, transparent 2px 4px)',
              }}
            />
          )}
        </div>
      </div>
      <span className="mono whitespace-nowrap text-[0.6875rem] text-foreground">
        {fila.piso === fila.techo ? fila.piso : `${fila.piso}–${fila.techo}`}
      </span>
    </div>
  );
}
