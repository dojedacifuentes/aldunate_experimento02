import { Badge, Disclosure, Notice, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import {
  ATRIBUCIONES,
  DIRECCIONES,
  distribucionDirecciones,
  distribucionEscalera,
  ESCALONES,
  universidad,
} from '@/lib/informe01';
import { cn } from '@/lib/utils';

/**
 * Escalera de institucionalización, aplicada a **iniciativas**.
 *
 * Una universidad no está en un escalón: sus iniciativas sí. La Universidad
 * Católica tiene a la vez una guía ética aprobada por su Consejo de Facultad y
 * seminarios sueltos, y promediarlos produciría un número que no describe
 * ninguno de los dos. Por eso aquí se distribuyen las 53 iniciativas y no las
 * once instituciones.
 *
 * El último peldaño está vacío, y ésa es la lectura principal del informe.
 */
export function EscaleraInstitucionalizacion() {
  const dist = distribucionEscalera();
  const total = dist.reduce((s, d) => s + d.iniciativas.length, 0);

  return (
    <div>
      <ol className="space-y-3">
        {dist.map(({ nivel, iniciativas }) => {
          const meta = ESCALONES.find((e) => e.nivel === nivel)!;
          const pct = total ? Math.round((iniciativas.length / total) * 100) : 0;
          const vacio = iniciativas.length === 0;
          return (
            <li key={nivel}>
              <Surface
                className={cn(
                  'p-5',
                  vacio && 'border-dashed bg-transparent',
                )}
                style={{ marginLeft: `${nivel * 4}%` }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-serif text-lg leading-snug text-foreground">
                    <span className="mono mr-2 text-sm text-primary">{nivel}</span>
                    {meta.label}
                  </h3>
                  <p className="mono text-xs text-muted-foreground">
                    {iniciativas.length} de {total} iniciativas
                    {!vacio && ` · ${pct} %`}
                  </p>
                </div>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {meta.condition}
                </p>

                {vacio ? (
                  <p className="mt-3 border-l-2 border-l-warning bg-warning/[0.07] px-4 py-3 text-sm leading-relaxed text-foreground/85">
                    Ninguna de las {total} iniciativas registradas alcanza este peldaño. Se
                    localizaron métricas de cobertura —cerca del 80 % del profesorado de
                    Derecho de una Facultad, unos noventa participantes en un taller, más de
                    dos cohortes graduadas— y ninguna es una medición de efecto. Cuántos
                    asistieron no dice si algo cambió. Tres rondas de investigación
                    independientes, con documentos distintos y fuentes que apenas se solapan,
                    llegaron a esta misma ausencia.
                  </p>
                ) : (
                  <Disclosure
                    className="mt-3"
                    summary={`Qué iniciativas están en el peldaño ${nivel}`}
                    hint={`${iniciativas.length}`}
                  >
                    <ul className="space-y-2.5">
                      {iniciativas.map((i) => (
                        <li key={i.id} className="text-[0.8125rem] leading-relaxed">
                          <span className="text-foreground">{i.name}</span>
                          <span className="text-muted-foreground">
                            {' '}
                            · {universidad(i.universityId)?.officialName}
                          </span>
                          <span className="mono ml-2 text-[0.625rem] uppercase tracking-widest text-muted-foreground">
                            {ATRIBUCIONES[i.attribution].label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Disclosure>
                )}
              </Surface>
            </li>
          );
        })}
      </ol>

      <Notice tone="muted" className="mt-6">
        El peldaño de una iniciativa no se suma ni se promedia con el de las demás de su
        universidad. Una institución puede exhibir muchas actividades con baja
        institucionalización, y otra pocas pero formalizadas: el informe existe para
        conservar esa diferencia, y un promedio la borraría.
      </Notice>
    </div>
  );
}

/**
 * Qué clase de relación con la IA tiene cada iniciativa.
 *
 * La distinción hace un trabajo concreto: impide que una Facultad que discute la
 * regulación de la IA aparezca como una que la usa para enseñar, y viceversa.
 * Y `ADYACENTE` existe para lo contrario: tratar como IA una tecnología digital
 * que no lo es —realidad virtual, un laboratorio de innovación legal, una
 * plataforma de búsqueda— es el modo de inflar un mapa sin inventar una fuente.
 */
export function MapaDirecciones() {
  const dist = distribucionDirecciones();
  const total = informe01Recuento.iniciativas;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {dist.map((d) => {
        const pct = Math.round((d.iniciativas.length / total) * 100);
        return (
          <Surface key={d.id} className="flex h-full flex-col p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-lg leading-snug text-foreground">{d.label}</h3>
              <Badge tone={d.id === 'ADYACENTE' ? 'muted' : 'signal'}>
                {d.iniciativas.length} · {pct} %
              </Badge>
            </div>
            <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {d.definition}
            </p>
            <div
              className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${d.label}: ${d.iniciativas.length} de ${total} iniciativas`}
            >
              <div
                className={cn(
                  'h-full rounded-full',
                  d.id === 'ADYACENTE' ? 'bg-muted-foreground/50' : 'bg-signal',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </Surface>
        );
      })}
      <p className="sm:col-span-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
        {DIRECCIONES.length} categorías, {total} iniciativas, sin solapamiento: cada
        iniciativa recibe una sola dirección, y las que integran las dos de forma sustantiva
        se registran como <span className="mono text-foreground">AMBOS</span> en vez de
        contarse dos veces.
      </p>
    </div>
  );
}
