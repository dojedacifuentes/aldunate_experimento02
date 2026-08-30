import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Badge, ButtonLink, Container, Surface } from '@/components/common/ui';
import { DoorCard } from '@/components/common/DoorCard';
import { EvaNote } from '@/components/eva/EvaNote';
import { InstitutionalMark } from '@/components/layout/InstitutionalMark';
import { primaryNav, secondaryNav, site } from '@/data/site';
import { profile, researchLines } from '@/data/aldunate';
import { reports, reportStatusMeta } from '@/data/reports';
import { labTools } from '@/data/lab';
import { formatDateCompact, latestVersion } from '@/lib/utils';

/**
 * Portal.
 *
 * Ni dashboard ni página personal: un vestíbulo. Nombre, cuatro puertas, el
 * mapa de temas y el estado real del trabajo. Nada de métricas inventadas y
 * ningún número que no se pueda contar aquí mismo.
 */
export default function HomePage() {
  const activeLines = researchLines.filter((l) => l.status === 'activa');

  return (
    <>
      {/* ── Vestíbulo ── */}
      <section className="relative overflow-hidden">
        <Container className="py-20 sm:py-28 lg:py-32">
          <p className="mono mb-6 text-[0.6875rem] uppercase tracking-[0.2em] text-primary">
            {site.eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>

          <p className="mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
            {site.tagline}
          </p>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/80">
            {profile.intro}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/aldunate" variant="primary">
              Entrar
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/informes" variant="outline">
              Ver informes
            </ButtonLink>
          </div>

          {/* Estado del laboratorio: solo lo que se puede contar en este repositorio. */}
          <dl className="mt-16 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border/70 pt-8 sm:grid-cols-4">
            <Stat label="Líneas activas" value={String(activeLines.length)} />
            <Stat label="Informes abiertos" value={String(reports.length)} />
            <Stat label="Fichas en el Lab" value={String(labTools.length)} />
            <Stat label="Versión" value={`v${site.version}`} />
          </dl>
        </Container>
      </section>

      {/* ── Las cuatro puertas ── */}
      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="meta mb-3 text-primary">Cuatro entradas</p>
              <h2 className="text-2xl sm:text-3xl">Elija por dónde empezar</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                No hay recorrido obligatorio ni orden correcto. Cada puerta abre
                un tipo de trabajo distinto.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {primaryNav.map((entry) => (
              <DoorCard key={entry.href} entry={entry} />
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {secondaryNav.map((entry) => (
              <DoorCard key={entry.href} entry={entry} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mapa intelectual ── */}
      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="meta mb-3 text-primary">Mapa intelectual</p>
              <h2 className="text-2xl sm:text-3xl">Territorios que recorre</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Los ejes del laboratorio y cómo conversan entre sí. Describen el
                alcance del proyecto, no una atribución de obra.
              </p>
              <Link
                href="/aldunate"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Ver el perfil completo
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <ul className="space-y-3">
              {researchLines.map((line) => (
                <li key={line.id}>
                  <Surface interactive className="p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="font-serif text-lg text-foreground">{line.title}</h3>
                      {line.status === 'en-formacion' && (
                        <Badge tone="muted">En formación</Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {line.summary}
                    </p>
                    {line.related.length > 0 && (
                      <p className="mono mt-3 text-[0.6875rem] text-muted-foreground/80">
                        ↳ {line.related.join(' · ')}
                      </p>
                    )}
                  </Surface>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Informes en curso ── */}
      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="mb-8 max-w-2xl">
            <p className="meta mb-3 text-primary">Documentos vivos</p>
            <h2 className="text-2xl sm:text-3xl">Informes en curso</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Se versionan hacia adelante. Ninguna versión publicada se
              sobrescribe en silencio.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {reports.map((report) => {
              const meta = reportStatusMeta[report.status];
              const latest = latestVersion(report.versions);
              return (
                <Link key={report.slug} href={`/informes/${report.slug}`} className="group">
                  <Surface interactive className="h-full p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="mono text-[0.6875rem] tracking-widest text-primary">
                        {report.code}
                      </span>
                      <Badge tone={meta.tone} dot>
                        {meta.label}
                      </Badge>
                    </div>
                    <h3 className="mt-4 font-serif text-xl leading-snug text-foreground group-hover:text-primary">
                      {report.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {report.executiveSummary}
                    </p>
                    <p className="mono mt-5 text-[0.6875rem] text-muted-foreground">
                      {latest ? `v${latest.version} · ` : ''}actualizado{' '}
                      {formatDateCompact(report.updatedAt)}
                    </p>
                  </Surface>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Nota de EVA + marca institucional ── */}
      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <EvaNote portrait="courtyard">
              <p>
                Este laboratorio se construye a la vista. Lo que todavía no
                existe aparece rotulado como pendiente, no rellenado con material
                verosímil. Es más lento y considerablemente menos impresionante,
                pero sobrevive a la primera persona que decida verificar una cita.
              </p>
            </EvaNote>

            <Surface className="p-6">
              <p className="meta mb-4">Contexto institucional</p>
              <InstitutionalMark size={52} withCaption />
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                Prototipo académico experimental. No es un sitio oficial de la
                PUCV ni de su Escuela de Derecho.
              </p>
            </Surface>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="meta">{label}</dt>
      <dd className="mono mt-1.5 text-2xl text-foreground">{value}</dd>
    </div>
  );
}
