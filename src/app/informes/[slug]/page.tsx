import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, Download, FlaskConical, ListTree } from 'lucide-react';

import {
  Badge,
  Breadcrumbs,
  ButtonLink,
  Container,
  MetaRow,
  Notice,
  Section,
  Surface,
} from '@/components/common/ui';
import { EditorialStatus, EpistemicTag } from '@/components/common/status';
import { getReport, reports, reportStatusMeta } from '@/data/reports';
import type { EvidenceLevel } from '@/types';
import { evidenceLevels, sources } from '@/data/research';
import { formatDate, latestVersion } from '@/lib/utils';

export function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) return { title: 'Informe no encontrado' };
  const description = report.executiveSummary.slice(0, 180);
  return {
    title: report.title,
    description,
    openGraph: {
      title: report.title,
      description,
      images: [],
    },
    twitter: {
      title: report.title,
      description,
      images: [],
    },
  };
}

/**
 * Detalle de informe.
 *
 * Tres capas de lectura, en este orden: resumen ejecutivo, método y límites,
 * historial y fuentes. Quien se quede en la primera capa debe salir con una
 * idea correcta del alcance; quien baje a la tercera debe poder auditar.
 *
 * La descarga solo aparece cuando existe un archivo real. Un botón que promete
 * un PDF inexistente es peor que no tener botón.
 */
export default async function InformeDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) notFound();

  const meta = reportStatusMeta[report.status];
  const latest = latestVersion(report.versions);
  const ordered = [...report.versions].sort((a, b) => b.date.localeCompare(a.date));
  const reportSources = report.sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source) => source !== undefined);
  const hasSources = reportSources.length > 0;

  return (
    <>
      {/* ── Cabecera ── */}
      <header className="border-b border-border/70 py-12 sm:py-16">
        <Container>
          {/* El título del informe es largo; la ruta orienta antes de leerlo. */}
          <Breadcrumbs
            items={[{ label: 'Informes', href: '/informes' }, { label: report.code }]}
          />

          {/* El código ya va en la miga de pan; repetirlo aquí era eco. */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <EditorialStatus status={report.status} />
            {latest && (
              <span className="mono text-[0.6875rem] text-muted-foreground">
                v{latest.version}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {report.title}
          </h1>
          {report.subtitle && (
            <p className="mt-3 font-serif text-lg italic text-muted-foreground sm:text-xl">
              {report.subtitle}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {latest?.html && (
              <ButtonLink href={latest.html} variant="primary" external>
                <BookOpen className="h-4 w-4" aria-hidden />
                Leer en línea · v{latest.version}
              </ButtonLink>
            )}
            {latest?.pdf ? (
              <ButtonLink
                href={latest.pdf}
                variant={latest.html ? 'outline' : 'primary'}
                external
              >
                <Download className="h-4 w-4" aria-hidden />
                Descargar PDF · v{latest.version}
              </ButtonLink>
            ) : (
              <span className="inline-flex h-10 items-center gap-2 rounded-md border border-dashed border-border px-4 text-sm text-muted-foreground">
                <Download className="h-4 w-4" aria-hidden />
                PDF no disponible en esta versión
              </span>
            )}
            <ButtonLink href="#metodologia" variant="outline">
              <FlaskConical className="h-4 w-4" aria-hidden />
              Ver metodología
            </ButtonLink>
            <ButtonLink href="#fuentes" variant="outline">
              <ListTree className="h-4 w-4" aria-hidden />
              Ver fuentes
            </ButtonLink>
          </div>
        </Container>
      </header>

      {/* ── Capa 1 · Resumen ejecutivo ── */}
      <Section eyebrow="Capa 1" title="Resumen ejecutivo">
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          <div className="prose-editorial">
            <p>{report.executiveSummary}</p>
          </div>

          <Surface className="p-6">
            <p className="meta mb-4">Ficha</p>
            <dl className="space-y-0">
              <MetaRow label="Estado" value={meta.label} />
              <MetaRow label="Versión" value={latest ? `v${latest.version}` : '—'} />
              <MetaRow label="Actualizado" value={formatDate(report.updatedAt)} />
              <MetaRow label="Autoría" value={report.authors.join(', ')} />
              <MetaRow label="Ejes" value={String(report.axes.length)} />
              <MetaRow
                label="Fuentes registradas"
                value={hasSources ? String(reportSources.length) : '0 · en registro'}
              />
              <MetaRow
                label="Carpeta"
                value={<code className="mono text-[0.75rem]">{report.folder}</code>}
              />
            </dl>
          </Surface>
        </div>
      </Section>

      {/* ── Ejes ── */}
      <Section
        eyebrow="Alcance"
        title="Ejes del informe"
        description="Qué cubre el documento. Delimitar el alcance por adelantado impide que el informe crezca hasta perder el foco."
      >
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {report.axes.map((axis, i) => (
            <li key={axis}>
              <div className="flex h-full items-start gap-3 rounded-md border border-border/70 bg-card/40 p-4">
                <span className="mono mt-0.5 shrink-0 text-[0.6875rem] text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-snug text-foreground/85">{axis}</span>
              </div>
            </li>
          ))}
        </ul>

        {report.variables && (
          <div className="mt-8">
            <p className="meta mb-3">Variables de registro</p>
            <div className="flex flex-wrap gap-2">
              {report.variables.map((v) => (
                <code
                  key={v}
                  className="mono rounded border border-border bg-muted/60 px-2 py-1 text-[0.75rem] text-muted-foreground"
                >
                  {v}
                </code>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── Capa 2 · Metodología y límites ── */}
      <Section eyebrow="Capa 2" title="Metodología" className="scroll-mt-20">
        <div id="metodologia" className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-5 max-w-xl leading-relaxed text-muted-foreground">
              Cómo se construye el documento. El método se publica antes que los
              hallazgos para que pueda ser criticado antes de que haya algo que
              defender.
            </p>
            <ol className="space-y-3">
              {report.methodology.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="mono mt-0.5 shrink-0 text-[0.6875rem] text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/85">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="meta mb-3 text-warning">Límites declarados</p>
            <ul className="space-y-3">
              {report.limitations.map((lim) => (
                <li
                  key={lim}
                  className="rounded-md border-l-2 border-l-warning bg-warning/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/80"
                >
                  {lim}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Preguntas abiertas ── */}
      <Section
        eyebrow="Trabajo pendiente"
        title="Preguntas abiertas"
        description="Lo que el informe todavía no puede responder. Se publican como preguntas, no como conclusiones provisionales."
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {report.openQuestions.map((q) => (
            <li key={q}>
              <div className="h-full rounded-lg border border-dashed border-border bg-muted/30 p-5">
                <p className="font-serif text-base leading-snug text-foreground/85">{q}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Capa 3 · Historial ── */}
      <Section eyebrow="Capa 3" title="Historial de versiones">
        <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
          Cada publicación agrega una versión. Ninguna se reemplaza. El
          changelog es la prueba de que el documento cambió de forma trazable.
        </p>

        <ol className="relative space-y-6 border-l border-border pl-6">
          {ordered.map((version, i) => (
            <li key={version.version} className="relative">
              <span
                className={`absolute -left-[1.6875rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background ${
                  i === 0 ? 'bg-primary' : 'bg-muted-foreground/50'
                }`}
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-3">
                <span className="mono text-sm font-medium text-foreground">
                  v{version.version}
                </span>
                <span className="mono text-[0.6875rem] text-muted-foreground">
                  {formatDate(version.date)}
                </span>
                {i === 0 && <Badge tone="signal">Actual</Badge>}
              </div>
              <ul className="mt-2.5 space-y-1">
                {version.changelog.map((entry) => (
                  <li key={entry} className="text-sm leading-relaxed text-muted-foreground">
                    · {entry}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Fuentes ── */}
      <Section eyebrow="Trazabilidad" title="Fuentes" className="scroll-mt-20">
        <div id="fuentes">
          {hasSources ? (
            <ul className="grid gap-3 md:grid-cols-2">
              {reportSources.map((source) => (
                <li key={source.id}>
                  <Surface className="h-full p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="mono text-[0.6875rem] tracking-widest text-primary">
                        {source.id}
                      </span>
                      {source.evidenceType && (
                        <Badge tone="muted">{source.evidenceType}</Badge>
                      )}
                    </div>
                    <h3 className="mt-3 font-serif text-lg leading-snug text-foreground">
                      {source.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {source.organization}
                    </p>
                    <dl className="mt-4 border-t border-border/60 pt-3">
                      {source.publishedDate && (
                        <MetaRow label="Publicada" value={formatDate(source.publishedDate)} />
                      )}
                      {source.accessedDate && (
                        <MetaRow label="Consultada" value={formatDate(source.accessedDate)} />
                      )}
                      {source.confidence !== undefined && (
                        <MetaRow label="Confianza" value={`${source.confidence}/100`} />
                      )}
                    </dl>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex min-h-6 items-center text-sm font-medium text-primary hover:underline"
                      >
                        Abrir fuente
                        <span className="sr-only">: {source.title}</span>
                      </a>
                    )}
                  </Surface>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-8">
              <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
                <p className="mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
                  Registro vacío
                </p>
                <h3 className="mt-3 font-serif text-xl text-foreground">
                  Todavía no hay fuentes incorporadas
                </h3>
                <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  El informe está en fase de definición de alcance. Las fuentes
                  entran al registro antes de convertirse en dato, y el registro
                  se publica junto con el documento.
                </p>
                <Link
                  href="/investigacion"
                  className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Ver el método de investigación
                </Link>
              </div>

              <div>
                <p className="meta mb-3">Niveles de evidencia en uso</p>
                <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(evidenceLevels).map(([key, level]) => (
                    <li key={key}>
                      <div className="h-full rounded-md border border-border/70 bg-card/40 p-4">
                        <EpistemicTag level={key as EvidenceLevel} code />
                        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {level.definition}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ── Cierre ── */}
      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="space-y-6">
              <Notice tone="warning">
                Informe en fase de investigación. El alcance y el método están
                definidos; los hallazgos, no. Nada de lo publicado aquí debe
                citarse todavía como resultado.
              </Notice>

              {/*
                Sin nota de EVA. La ficha de un informe es capa de evidencia:
                lleva niveles, fuentes y advertencias de lectura, y una voz que
                interpreta no debe cerrarla. EVA sigue disponible en el panel,
                donde el lector la abre si la quiere. Ver U-07 en UX-UI-AUDIT.md.
              */}
            </div>

            <Surface className="p-6">
              <p className="meta mb-4">Naturaleza de este documento</p>
              <p className="mono text-[0.6875rem] uppercase tracking-widest text-warning">
                Prototipo académico experimental
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                Documento de trabajo. No es una publicación oficial de la PUCV ni
                de su Escuela de Derecho.
              </p>
            </Surface>
          </div>
        </Container>
      </section>
    </>
  );
}
