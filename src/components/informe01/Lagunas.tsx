import { Badge, Notice, Surface } from '@/components/common/ui';
import { informe01AuditoriaBase, informe01Lagunas } from '@/data/informe01-editorial';

/**
 * Las lagunas y la auditoría de la línea base.
 *
 * Un informe que sólo publica lo que encontró deja al lector sin saber qué no
 * puede citar. Estas doce entradas existen para eso, y cada una trae su salida:
 * una laguna sin condición de cierre es una queja, y una queja no se puede
 * comprobar dentro de seis meses.
 */
export function Lagunas() {
  const porRonda = [1, 2, 3] as const;

  return (
    <div>
      <Notice tone="signal" className="mb-8">
        Doce lagunas declaradas, de las cuales cinco vienen de la primera fusión, cinco de la
        segunda y dos se abren en ésta. Ninguna se cerró: el corpus creció y la mayoría de
        los huecos siguió donde estaba, que es información sobre el campo y no sólo sobre el
        método.
      </Notice>

      <div className="space-y-10">
        {porRonda.map((ronda) => {
          const grupo = informe01Lagunas.filter((l) => l.ronda === ronda);
          return (
            <section key={ronda}>
              <h3 className="meta mb-4">
                {ronda === 1 && 'Declaradas en la primera fusión'}
                {ronda === 2 && 'Declaradas en la segunda fusión'}
                {ronda === 3 && 'Nuevas en esta versión'}
              </h3>
              <ul className="space-y-3">
                {grupo.map((l) => (
                  <li key={l.id}>
                    <Surface id={l.id} className="scroll-mt-24 p-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <code className="mono text-[0.6875rem] tracking-widest text-primary">
                          {l.id}
                        </code>
                        <Badge tone={l.alcance === 'metodo' ? 'accent' : 'muted'}>
                          {l.alcance === 'metodo' && 'Del método'}
                          {l.alcance === 'cohorte' && 'De la cohorte'}
                          {l.alcance === 'institucion' && 'De una institución'}
                        </Badge>
                      </div>
                      <h4 className="mt-2.5 font-serif text-lg leading-snug text-foreground">
                        {l.titulo}
                      </h4>
                      <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {l.cuerpo}
                      </p>
                      <p className="mt-3 border-l-2 border-l-border pl-4 text-[0.8125rem] leading-relaxed text-foreground/85">
                        <span className="meta">Qué la cerraría</span> {l.cierre}
                      </p>
                    </Surface>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Auditoría de la línea base.
 *
 * El archivo histórico no se corrige: se audita a la vista y se conserva como
 * está. Corregirlo en silencio destruiría la única prueba de que el error
 * existió, y esa prueba es la razón por la que ninguna puntuación heredada se
 * arrastra a esta versión.
 */
export function AuditoriaLineaBase() {
  return (
    <div>
      <div className="prose-editorial max-w-2xl">
        <p>
          El documento que sirvió de antecedente declaraba cinco dimensiones con un máximo de
          tres puntos cada una y, a la vez, asignaba valores de 0,25 a 1,50 a actividades
          individuales. Las dos lógicas nunca se reconciliaron, y el resultado es que cuatro
          de sus totales no salen de sus propias puntuaciones.
        </p>
      </div>

      <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <caption className="sr-only">
            Cuatro totales del informe antecedente que no coinciden con la suma de sus propias
            puntuaciones por dimensión.
          </caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="meta py-3 pr-4 text-left">
                Institución
              </th>
              <th scope="col" className="meta px-4 py-3 text-right">
                Suma declarada
              </th>
              <th scope="col" className="meta px-4 py-3 text-right">
                Total escrito
              </th>
              <th scope="col" className="meta py-3 pl-4 text-left">
                Qué ocurre
              </th>
            </tr>
          </thead>
          <tbody>
            {informe01AuditoriaBase.map((f) => (
              <tr key={f.institucion} className="border-b border-border/50">
                <th scope="row" className="py-3 pr-4 text-left font-normal text-foreground">
                  {f.institucion}
                </th>
                <td className="mono px-4 py-3 text-right text-muted-foreground">{f.suma}</td>
                <td className="mono px-4 py-3 text-right text-warning">{f.total}</td>
                <td className="py-3 pl-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {f.nota}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Notice tone="warning" className="mt-6">
        Consecuencia registrada: <strong>ninguna puntuación heredada se arrastra.</strong> La
        tabla se reconstruye desde la matriz de evidencias o no existe. Sumar o restar
        décimas a un total que no cuadra con sus sumandos propaga el error con apariencia de
        precisión, y el resultado se lee como si fuera más exacto que antes.
      </Notice>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
        Por la misma razón esta versión no publica un gráfico de pendiente entre 2025 y 2026:
        las dos escalas no son aritméticamente comparables, y dibujar una línea entre ellas
        sugeriría una continuidad que no existe. El archivo antecedente se conserva sin
        modificar, con su error a la vista.
      </p>
    </div>
  );
}
