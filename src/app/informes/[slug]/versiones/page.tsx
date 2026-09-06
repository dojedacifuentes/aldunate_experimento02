import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Layers } from 'lucide-react';

import { Breadcrumbs, ButtonLink, Container, Notice, Section } from '@/components/common/ui';
import {
  EntradaDeHistorial,
  RailDeVersiones,
} from '@/components/informes/Versiones';
import { getReport, reports } from '@/data/reports';
import { currentVersion, sortedVersions } from '@/lib/informes';
import { formatDate } from '@/lib/utils';

/**
 * Historial completo de un informe.
 *
 * La ficha del informe muestra las tres últimas versiones porque su asunto es
 * el informe; ésta las muestra todas porque su asunto es el historial. Es la
 * página que hay que poder enseñar cuando alguien pregunta si un dato cambió
 * desde que lo citó: cada entrada trae su changelog, sus descargas y, cuando
 * las hubo, las afirmaciones que se modificaron con su motivo.
 */

export function generateStaticParams() {
  return reports.map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) return { title: 'Informe no encontrado' };
  return {
    title: `Versiones · ${report.title}`,
    description: `Historial completo de versiones del ${report.code}: qué cambió en cada una, qué se puede descargar y qué afirmaciones se modificaron.`,
  };
}

export default async function VersionesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) notFound();

  const ordenadas = sortedVersions(report.versions);
  const vigente = currentVersion(report);

  return (
    <>
      <header className="border-b border-border/70 py-12 sm:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Informes', href: '/informes' },
              { label: report.code, href: `/informes/${report.slug}` },
              { label: 'Versiones' },
            ]}
          />

          <p className="meta mt-6 text-primary">{report.code}</p>
          <h1 className="mt-4 max-w-3xl text-3xl leading-tight sm:text-4xl">
            Todas las versiones
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            {ordenadas.length} versiones desde{' '}
            {formatDate(ordenadas[ordenadas.length - 1]?.date)}. Ninguna se
            sobrescribe: cada publicación agrega una entrada y conserva la
            anterior con sus archivos y sus cifras, que son las que sostenía
            entonces y no las de hoy.
          </p>

          <div className="mt-7">
            <ButtonLink href={`/informes/${report.slug}`} variant="outline">
              <Layers className="h-4 w-4" aria-hidden />
              Volver a la ficha del informe
            </ButtonLink>
          </div>
        </Container>
      </header>

      <section className="border-b border-border/70 py-6">
        <Container>
          <p className="meta mb-3 text-primary">Ir a una versión</p>
          <RailDeVersiones
            slug={report.slug}
            versions={ordenadas}
            actual={vigente?.version}
          />
        </Container>
      </section>

      <Section eyebrow="Historial" title="Qué cambió, versión por versión">
        <ol className="relative space-y-10 border-l border-border pl-6">
          {ordenadas.map((version) => (
            <li key={version.version} className="relative">
              <span
                className={`absolute -left-[1.6875rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-background ${
                  version.version === vigente?.version
                    ? 'bg-primary'
                    : 'bg-muted-foreground/50'
                }`}
                aria-hidden
              />
              <EntradaDeHistorial
                slug={report.slug}
                version={version}
                esActual={version.version === vigente?.version}
              />
            </li>
          ))}
        </ol>

        <Notice tone="muted" className="mt-10">
          Las versiones sin documento en línea no son un hueco del archivo: no
          llegaron a tener edición publicada. Fueron estados del registro de
          investigación —apertura de alcance, armado del corpus, publicación del
          kit— y su changelog es todo lo que hubo.
        </Notice>
      </Section>
    </>
  );
}
