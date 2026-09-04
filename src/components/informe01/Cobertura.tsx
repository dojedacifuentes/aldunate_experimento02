import { Notice, Surface } from '@/components/common/ui';
import { informe01Recuento } from '@/data/informe01';
import { coberturaDe, universidadesOrdenadas } from '@/lib/informe01';
import { cn } from '@/lib/utils';

/**
 * Cobertura de investigación: cuánto se investigó cada institución.
 *
 * Es el gráfico que impide leer mal todos los demás, y por eso va antes que
 * ninguna comparación. Mide trabajo de campo —cuántas de las trece rutas del
 * protocolo se recorrieron— y no actividad institucional.
 *
 * El caso que lo demuestra está en la propia tabla: la Universidad Autónoma es
 * la institución con menos rutas recorridas de las once y aporta la única
 * cobertura docente cuantificada de todo el corpus. Si cobertura y madurez
 * fueran la misma variable, eso sería imposible.
 */
export function CoberturaInvestigacion() {
  return (
    <div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Cifra
          valor={`${informe01Recuento.coberturaPiloto}`}
          etiqueta="fuentes de media en el piloto"
          detalle="PUCV, Universidad Católica y Universidad de Chile"
        />
        <Cifra
          valor={`${informe01Recuento.coberturaResto}`}
          etiqueta="fuentes de media en las otras ocho"
          detalle={`Razón de ${informe01Recuento.razonCobertura}:1`}
        />
        <Cifra
          valor={`${informe01Recuento.rutasPiloto} · ${informe01Recuento.rutasResto}`}
          etiqueta="rutas del protocolo recorridas, de trece"
          detalle="Piloto frente al resto"
        />
      </div>

      <ol className="space-y-2.5">
        {universidadesOrdenadas.map((u) => {
          const c = coberturaDe(u.id);
          if (!c) return null;
          const pct = c.coveragePercent;
          return (
            <li key={u.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-sm text-foreground/90">{u.officialName}</span>
                  {c.inPilot && (
                    <span className="mono shrink-0 text-[0.5625rem] uppercase tracking-widest text-accent">
                      piloto
                    </span>
                  )}
                </div>
                <div
                  className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  role="img"
                  aria-label={`${u.officialName}: ${c.routesCompleted} de ${c.routesTotal} rutas del protocolo recorridas, ${pct} por ciento`}
                >
                  <div
                    className={cn('h-full rounded-full', c.inPilot ? 'bg-accent' : 'bg-signal')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="mono text-xs text-muted-foreground">
                {c.routesCompleted}/{c.routesTotal} · {c.sources} fuentes
              </span>
            </li>
          );
        })}
      </ol>

      <Notice tone="signal" className="mt-6">
        La ruta 13 del protocolo —<em>fuentes externas de contraste</em>— está sin recorrer en
        las once. Las {informe01Recuento.fuentesInstitucionales} fuentes institucionales del
        corpus son publicaciones de las propias universidades, y las{' '}
        {informe01Recuento.fuentesUniversoNacional} restantes son bases oficiales. El corpus
        hereda íntegro el sesgo de autodescripción: mide lo que las instituciones cuentan de
        sí mismas, y eso no se corrige agregando más fuentes del mismo tipo.
      </Notice>
    </div>
  );
}

function Cifra({
  valor,
  etiqueta,
  detalle,
}: {
  valor: string;
  etiqueta: string;
  detalle: string;
}) {
  return (
    <Surface className="p-5">
      <p className="mono text-3xl leading-none text-foreground">{valor}</p>
      <p className="mt-2 text-sm leading-snug text-foreground/85">{etiqueta}</p>
      <p className="mt-1 text-[0.75rem] leading-snug text-muted-foreground">{detalle}</p>
    </Surface>
  );
}
