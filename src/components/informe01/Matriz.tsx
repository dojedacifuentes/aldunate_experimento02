import { Disclosure, Notice, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import {
  celda,
  coberturaDe,
  DIMENSIONES,
  dimensionesVacias,
  universidadesOrdenadas,
} from '@/lib/informe01';
import { cn } from '@/lib/utils';

/**
 * Matriz de evidencia localizada. **No es un heatmap de madurez.**
 *
 * La diferencia no es de estilo. Un heatmap de madurez ordena instituciones por
 * un número, y aquí ese número no existe: la cobertura de investigación es 3,7
 * veces mayor en las tres del piloto, de modo que un color más intenso diría
 * «se buscó más aquí» y se leería «esta universidad hace más». Por eso las filas
 * van en orden alfabético, la intensidad codifica **cuánta evidencia se
 * localizó** y cada fila lleva pegada su cobertura, que es el denominador sin el
 * cual la celda no significa nada.
 *
 * Cada celda dice tres cosas que no se pueden colapsar en una: cuántas
 * evidencias se localizaron, cuántas iniciativas las agrupan y cuál es el
 * escalón más alto que alguna de ellas alcanza. Mucha evidencia con escalón bajo
 * —actividad sin estructura— y poca evidencia con escalón alto —estructura sin
 * actividad publicada— son estados distintos, y un solo número los volvería
 * indistinguibles.
 *
 * El color nunca va solo: toda celda con evidencia imprime su cifra y su
 * escalón, de modo que la tabla sigue diciendo lo mismo en blanco y negro,
 * impresa o leída por un lector de pantalla.
 */

const intensidad = (n: number) => {
  if (n === 0) return 'bg-transparent text-muted-foreground/60';
  if (n <= 2) return 'bg-signal/[0.09] text-foreground/85';
  if (n <= 5) return 'bg-signal/[0.18] text-foreground';
  return 'bg-signal/[0.28] text-foreground';
};

export function MatrizEvidencia() {
  const vacias = dimensionesVacias();

  return (
    <div>
      <Notice tone="warning" className="mb-6">
        Esta matriz muestra <strong>evidencia pública localizada</strong>, no madurez
        institucional, y sus filas van en orden alfabético. La cobertura de investigación es{' '}
        {informe01Recuento.razonCobertura} veces mayor en las tres universidades del piloto
        —{informe01Recuento.coberturaPiloto} fuentes de media frente a{' '}
        {informe01Recuento.coberturaResto}—, así que una fila más poblada indica dónde se
        buscó más, no dónde se hace más. Ordenar por esta tabla produciría un ranking del
        trabajo de campo disfrazado de ranking de universidades.
      </Notice>

      <div className="relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[54rem] border-collapse text-sm">
          <caption className="sr-only">
            Evidencia pública localizada por universidad y dimensión, al corte del 1 de
            septiembre de 2026. Cada celda indica el número de evidencias, el número de
            iniciativas que las agrupan y el escalón más alto alcanzado por alguna de ellas.
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="meta py-3 pr-4 text-left align-bottom">
                Universidad
              </th>
              {DIMENSIONES.map((d) => (
                <th
                  key={d.id}
                  scope="col"
                  className="meta px-2 py-3 text-center align-bottom font-normal"
                >
                  <abbr title={d.label} className="no-underline">
                    {d.short}
                  </abbr>
                </th>
              ))}
              <th scope="col" className="meta py-3 pl-4 text-right align-bottom">
                Cobertura
              </th>
            </tr>
          </thead>
          <tbody>
            {universidadesOrdenadas.map((u) => {
              const cob = coberturaDe(u.id);
              return (
                <tr key={u.id} className="border-b border-border/50">
                  <th scope="row" className="py-3 pr-4 text-left font-normal">
                    <a
                      href={`#ficha-${u.id}`}
                      className="text-foreground hover:text-primary hover:underline"
                    >
                      {u.officialName}
                    </a>
                    {cob?.inPilot && (
                      <span className="mono ml-2 text-[0.5625rem] uppercase tracking-widest text-accent">
                        piloto
                      </span>
                    )}
                  </th>
                  {DIMENSIONES.map((d) => {
                    const c = celda(u.id, d.id);
                    const etiqueta =
                      c.evidencias === 0
                        ? `${u.officialName}, ${d.label}: sin evidencia pública localizada`
                        : `${u.officialName}, ${d.label}: ${c.evidencias} evidencias en ${c.iniciativas} iniciativas, escalón máximo ${c.escalonMaximo}`;
                    return (
                      <td key={d.id} className="p-1">
                        <div
                          className={cn(
                            'flex h-12 flex-col items-center justify-center rounded border border-border/40',
                            intensidad(c.evidencias),
                            c.soloUniversidad && 'border-dashed border-warning/50',
                          )}
                          title={etiqueta}
                        >
                          {c.evidencias === 0 ? (
                            <span aria-hidden className="text-xs">
                              ·
                            </span>
                          ) : (
                            <>
                              <span className="mono text-sm leading-none">{c.evidencias}</span>
                              <span className="mono mt-0.5 text-[0.5625rem] uppercase tracking-widest text-muted-foreground">
                                niv {c.escalonMaximo}
                              </span>
                            </>
                          )}
                          <span className="sr-only">{etiqueta}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="py-3 pl-4 text-right">
                    <span className="mono text-xs text-muted-foreground">
                      {cob?.routesCompleted}/{cob?.routesTotal} rutas
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Surface className="p-5">
          <p className="meta mb-3">Cómo se lee una celda</p>
          <ul className="space-y-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
            <li>
              <span className="mono text-foreground">6</span> · evidencias públicas
              localizadas en esa dimensión.
            </li>
            <li>
              <span className="mono text-foreground">niv 3</span> · escalón más alto que
              alcanza alguna de sus iniciativas, no un promedio de la universidad.
            </li>
            <li>
              <span className="text-foreground">Borde punteado</span> · toda la evidencia de
              esa celda es capacidad de la universidad, no de la Facultad de Derecho.
            </li>
            <li>
              <span className="mono text-foreground">·</span> · no se localizó evidencia
              pública. No significa que la actividad no exista.
            </li>
          </ul>
        </Surface>

        <Surface className="p-5">
          <p className="meta mb-3">Dos dimensiones sin una sola evidencia</p>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            De las ocho dimensiones de la metodología 2.0, {vacias.length} están vacías en las
            once instituciones:{' '}
            <strong className="text-foreground">
              {vacias.map((d) => d.label.toLowerCase()).join(' y ')}
            </strong>
            . No es un descuido de la matriz: no se localizó ninguna fuente pública que
            declare dotación, presupuesto basal ni medición de resultados en ninguna
            Facultad de la cohorte. La columna vacía es el hallazgo.
          </p>
        </Surface>
      </div>

      <Disclosure
        className="mt-6"
        summary="La misma matriz en forma de lista"
        hint="alternativa textual"
      >
        <ul className="space-y-4">
          {universidadesOrdenadas.map((u) => {
            const conEvidencia = DIMENSIONES.map((d) => ({ d, c: celda(u.id, d.id) })).filter(
              ({ c }) => c.evidencias > 0,
            );
            return (
              <li key={u.id}>
                <p className="text-sm font-medium text-foreground">{u.officialName}</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {conEvidencia.length === 0
                    ? 'Sin evidencia pública localizada en ninguna dimensión.'
                    : conEvidencia
                        .map(
                          ({ d, c }) =>
                            `${d.label}: ${c.evidencias} evidencia${c.evidencias === 1 ? '' : 's'} en ${c.iniciativas} iniciativa${c.iniciativas === 1 ? '' : 's'}, escalón máximo ${c.escalonMaximo}`,
                        )
                        .join('. ') + '.'}
                </p>
              </li>
            );
          })}
        </ul>
      </Disclosure>
    </div>
  );
}
