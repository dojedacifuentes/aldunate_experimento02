import { Badge, Disclosure, MetaRow, Notice, Surface } from '@/components/common/ui';
import {
  afirmacionesDe,
  ATRIBUCIONES,
  celda,
  coberturaDe,
  DIMENSIONES,
  evidenciasDeIniciativa,
  fuentesDe,
  iniciativasDe,
  universidad,
} from '@/lib/informe01';
import { formatSourceDate } from '@/lib/utils';
import { ListaAfirmaciones } from './Afirmaciones';
import type { Informe01Iniciativa } from '@/types';

/**
 * Ficha institucional.
 *
 * Empieza por la cobertura y no por los hallazgos, que es al revés de como suele
 * hacerse. La razón es que sin el denominador la ficha engaña: una institución
 * con tres fuentes localizadas y una con catorce se leen igual de completas si
 * no se dice cuántas rutas del protocolo se recorrieron en cada una.
 *
 * Y separa lo que la fuente prueba de lo que no alcanza a probar. Las brechas
 * están escritas como ausencia de evidencia pública y nunca como inexistencia:
 * la diferencia entre «no publica un syllabus» y «no tiene un syllabus» es la
 * diferencia entre un mapeo y una acusación.
 */
export function FichaInstitucional({ universityId }: { universityId: string }) {
  const u = universidad(universityId);
  if (!u) return null;
  const cob = coberturaDe(universityId);
  const inis = iniciativasDe(universityId);
  const fuentes = fuentesDe(universityId);
  const claims = afirmacionesDe(universityId);

  const porDimension = DIMENSIONES.map((d) => ({ d, c: celda(universityId, d.id) })).filter(
    ({ c }) => c.iniciativas > 0,
  );
  const sinEvidencia = DIMENSIONES.filter((d) => celda(universityId, d.id).iniciativas === 0);
  const soloUniversidad = inis.filter((i) => i.attribution === 'INSTITUCIONAL_UNIVERSIDAD');

  return (
    <article id={`ficha-${u.id}`} className="scroll-mt-24">
      <header className="border-b border-border/70 pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <code className="mono text-[0.6875rem] tracking-widest text-primary">{u.id}</code>
          {cob?.inPilot && <Badge tone="accent">Piloto de profundidad</Badge>}
          <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            {u.status}
          </span>
        </div>
        <h2 className="mt-3 font-serif text-2xl leading-tight text-foreground sm:text-3xl">
          {u.officialName}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{u.unitName}</p>
        {u.notes && (
          <p className="mt-3 max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground">
            {u.notes}
          </p>
        )}
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <h3 className="meta mb-4">Qué se localizó, por dimensión</h3>
          {porDimension.length === 0 ? (
            <Notice tone="muted">
              No se localizó evidencia pública en ninguna dimensión. No significa que la
              actividad no exista: significa que el protocolo no la encontró publicada.
            </Notice>
          ) : (
            <ul className="space-y-6">
              {porDimension.map(({ d, c }) => (
                <li key={d.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h4 className="font-serif text-lg leading-snug text-foreground">
                      {d.label}
                    </h4>
                    <span className="mono text-[0.6875rem] text-muted-foreground">
                      {c.evidencias} evidencias · escalón máximo {c.escalonMaximo}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-3">
                    {inis
                      .filter((i) => i.dimension === d.id)
                      .map((i) => (
                        <li key={i.id}>
                          <Iniciativa iniciativa={i} />
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}

          {sinEvidencia.length > 0 && (
            <div className="mt-8">
              <h3 className="meta mb-3 text-warning">Dimensiones sin evidencia localizada</h3>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {sinEvidencia.map((d) => d.label).join(' · ')}. Se recorrieron{' '}
                {cob?.routesCompleted} de {cob?.routesTotal} rutas del protocolo, de modo que
                estas casillas describen el alcance de la búsqueda tanto como el de la
                institución.
              </p>
            </div>
          )}

          {soloUniversidad.length > 0 && (
            <Notice tone="warning" className="mt-6">
              {soloUniversidad.length} de las {inis.length} iniciativas registradas son
              capacidades de la universidad completa y no de su Facultad de Derecho:{' '}
              {soloUniversidad.map((i) => i.name).join(', ')}. Son capacidad institucional
              disponible; contarlas como capacidad de Derecho sería el error que este campo
              existe para impedir.
            </Notice>
          )}
        </div>

        <div className="space-y-6">
          <Surface className="p-5">
            <p className="meta mb-3">Cobertura de la investigación</p>
            <dl>
              <MetaRow
                label="Rutas recorridas"
                value={`${cob?.routesCompleted} de ${cob?.routesTotal} · ${cob?.coveragePercent} %`}
              />
              <MetaRow label="Fuentes localizadas" value={String(fuentes.length)} />
              <MetaRow label="Iniciativas" value={String(inis.length)} />
              <MetaRow
                label="Dimensiones cubiertas"
                value={`${cob?.dimensionsCovered} de ${cob?.dimensionsTotal}`}
              />
              <MetaRow
                label="Verificación sustantiva"
                value={`${cob?.substantivelyVerifiedSources} de ${fuentes.length} fuentes`}
              />
            </dl>
            {cob && cob.routesMissing.length > 0 && (
              <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
                <span className="meta">Rutas sin recorrer</span>{' '}
                {cob.routesMissing.join(' · ')}
              </p>
            )}
          </Surface>

          <Disclosure summary="Fuentes de esta institución" hint={`${fuentes.length}`}>
            <ul className="space-y-3">
              {fuentes.map((f) => (
                <li key={f.id} id={f.id} className="scroll-mt-24 border-l border-border pl-4">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <code className="mono text-[0.625rem] tracking-widest text-primary">
                      {f.id}
                    </code>
                    <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
                      {f.workflowStatus}
                    </span>
                    {f.documentStatus !== 'vigente' && (
                      <Badge tone="warning">{f.documentStatus}</Badge>
                    )}
                  </div>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-[0.8125rem] leading-snug text-primary hover:underline"
                  >
                    {f.title}
                  </a>
                  <p className="mt-0.5 text-[0.75rem] text-muted-foreground">
                    {f.publisher} ·{' '}
                    {f.publishedDate ? formatSourceDate(f.publishedDate) : 'sin fecha declarada'}{' '}
                    · consultada {formatSourceDate(f.accessedDate)}
                  </p>
                  {f.notes && (
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                      {f.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>
      </div>

      {claims.length > 0 && (
        <div className="mt-8">
          <h3 className="meta mb-4">Afirmaciones sobre esta institución</h3>
          <ListaAfirmaciones afirmaciones={claims} />
        </div>
      )}
    </article>
  );
}

function Iniciativa({ iniciativa: i }: { iniciativa: Informe01Iniciativa }) {
  const evs = evidenciasDeIniciativa(i.id);
  return (
    <div id={i.id} className="scroll-mt-24 rounded-md border border-border/70 bg-card/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h5 className="text-sm font-medium text-foreground">{i.name}</h5>
        <span className="mono text-[0.625rem] uppercase tracking-widest text-primary">
          nivel {i.ladder}
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground"
          title={ATRIBUCIONES[i.attribution].note}
        >
          {ATRIBUCIONES[i.attribution].label}
        </span>
        <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
          {i.direction.replaceAll('_', ' ').toLowerCase()}
        </span>
        <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
          trayectoria {i.trajectory.toLowerCase()}
        </span>
      </div>
      <dl className="mt-3 grid gap-x-4 gap-y-1 text-[0.75rem] sm:grid-cols-2">
        <Par etiqueta="Responsable" valor={i.responsibleUnit} />
        <Par etiqueta="Cobertura declarada" valor={i.coverage} />
        <Par etiqueta="Productos" valor={i.products} />
        <Par etiqueta="Resultados" valor={i.outcomes} />
      </dl>
      {i.notes && (
        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">{i.notes}</p>
      )}
      {evs.length > 0 && (
        <Disclosure className="mt-3" summary="Qué prueba cada fuente" hint={`${evs.length}`}>
          <ul className="space-y-2.5">
            {evs.map((e) => (
              <li key={e.id} className="text-[0.75rem] leading-relaxed">
                <a
                  href={`#${e.sourceId}`}
                  className="mono text-[0.625rem] tracking-widest text-primary hover:underline"
                >
                  {e.sourceId}
                </a>{' '}
                <span className="text-foreground/85">{e.statement}</span>{' '}
                <span className="text-muted-foreground">{e.limitations}</span>
              </li>
            ))}
          </ul>
        </Disclosure>
      )}
    </div>
  );
}

function Par({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  if (!valor) return null;
  return (
    <div>
      <dt className="meta">{etiqueta}</dt>
      <dd className="text-muted-foreground">{valor}</dd>
    </div>
  );
}
