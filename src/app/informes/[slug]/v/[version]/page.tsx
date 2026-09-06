import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download, History, Layers } from 'lucide-react';

import {
  Badge,
  Breadcrumbs,
  ButtonLink,
  Container,
  Notice,
  Section,
} from '@/components/common/ui';
import { EditorialStatus } from '@/components/common/status';
import { DocumentoEmbebido } from '@/components/informes/DocumentoEmbebido';
import {
  ArtefactosDeVersion,
  AvisoDeVersionHistorica,
  ComplementoDeVersion,
  RailDeVersiones,
  VersionFiguras,
} from '@/components/informes/Versiones';
import {
  Informe01Anexos,
  Informe01Apertura,
  Informe01Publicacion,
} from '@/components/informe01/Publicacion';
import {
  Informe01BorradorApertura,
  Informe01BorradorCierre,
} from '@/components/informe01/Borrador';
import { getReport, reports, reportStatusNotice } from '@/data/reports';
import {
  currentVersion,
  findVersion,
  readingMode,
  sortedVersions,
  versionArtifacts,
  versionsHref,
} from '@/lib/informes';
import { formatDate } from '@/lib/utils';

/**
 * Lector de una versión.
 *
 * Una ruta para todas: `/informes/<informe>/v/<versión>`. Publicar la versión
 * siguiente no crea una pantalla nueva ni toca ésta —basta la entrada en
 * `versions` y los archivos en `public/descargas/`—, y las anteriores siguen
 * exactamente donde estaban, con su enlace intacto. Es la parte de «informe
 * vivo» que faltaba: el historial se declaraba en una lista, pero sólo la
 * última versión se podía leer.
 *
 * Dos formas de lectura conviven, y el dato de cada versión dice cuál le toca.
 * La v0.8.0 está transcrita a datos tipados y el sitio la reconstruye con sus
 * componentes; la v2.0.0 llegó como documento cerrado y se muestra tal cual.
 * Ninguna de las dos se disfraza de la otra: la cabecera declara qué se está
 * viendo.
 */

export function generateStaticParams() {
  return reports.flatMap((report) =>
    report.versions.map((version) => ({ slug: report.slug, version: version.version })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; version: string }>;
}): Promise<Metadata> {
  const { slug, version } = await params;
  const report = getReport(slug);
  const entrada = report && findVersion(report, version);
  if (!report || !entrada) return { title: 'Versión no encontrada' };

  return {
    title: `${report.title} · v${entrada.version}`,
    description:
      entrada.summary ?? entrada.headline ?? report.executiveSummary.slice(0, 180),
  };
}

export default async function VersionPage({
  params,
}: {
  params: Promise<{ slug: string; version: string }>;
}) {
  const { slug, version } = await params;
  const report = getReport(slug);
  if (!report) notFound();

  const entrada = findVersion(report, version);
  if (!entrada) notFound();

  const vigente = currentVersion(report);
  const esVigente = vigente?.version === entrada.version;
  const modo = readingMode(entrada);
  const artefactos = versionArtifacts(entrada);
  const pdf = artefactos.find((a) => a.format === 'PDF');

  /*
    La lectura nativa sólo existe para el Informe 01 v0.8.0: es la única versión
    que alguien transcribió a `src/data`. No se generaliza a un componente por
    informe porque hay un solo caso, y una abstracción con un caso es una capa
    que esconde dónde está el contenido.
  */
  const nativo = modo === 'nativo' && report.slug === 'ia-escuelas-derecho-chile';

  return (
    <>
      <header className="border-b border-border/70 py-10 sm:py-14">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Informes', href: '/informes' },
              { label: report.code, href: `/informes/${report.slug}` },
              { label: `v${entrada.version}` },
            ]}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <EditorialStatus status={entrada.status} />
            <span className="mono text-sm font-medium text-foreground">
              v{entrada.version}
            </span>
            <span className="mono text-[0.6875rem] text-muted-foreground">
              {formatDate(entrada.date)}
            </span>
            {esVigente ? (
              <Badge tone="signal">Versión vigente</Badge>
            ) : (
              <Badge tone="muted">Versión histórica</Badge>
            )}
            {entrada.pages && (
              <span className="mono text-[0.6875rem] text-muted-foreground">
                {entrada.pages} páginas
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {report.title}
          </h1>

          {entrada.headline && (
            <p className="mt-3 max-w-3xl font-serif text-lg italic text-muted-foreground">
              {entrada.headline}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {pdf && (
              <ButtonLink href={pdf.href} variant="primary" external>
                <Download className="h-4 w-4" aria-hidden />
                Descargar PDF · v{entrada.version}
              </ButtonLink>
            )}
            <ButtonLink href={`/informes/${report.slug}`} variant="outline">
              <Layers className="h-4 w-4" aria-hidden />
              Ficha del informe
            </ButtonLink>
            <ButtonLink href={versionsHref(report.slug)} variant="outline">
              <History className="h-4 w-4" aria-hidden />
              Todas las versiones
            </ButtonLink>
          </div>
        </Container>
      </header>

      {/* ── Selector, siempre a la vista al abrir ── */}
      <section className="border-b border-border/70 py-6">
        <Container>
          <p className="meta mb-3 text-primary">Cambiar de versión</p>
          <RailDeVersiones
            slug={report.slug}
            versions={sortedVersions(report.versions)}
            actual={vigente?.version}
            activa={entrada.version}
          />
        </Container>
      </section>

      {/* ── Aviso, antes del documento y no después ── */}
      {!esVigente && vigente && (
        <section className="py-6">
          <Container>
            <AvisoDeVersionHistorica slug={report.slug} actual={vigente} />
          </Container>
        </section>
      )}

      {/* ── Qué trae esta versión ── */}
      {(entrada.summary || entrada.figures?.length) && (
        <Section eyebrow="Esta versión" title="Qué trae, y qué cifras sostiene">
          {entrada.summary && (
            <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
              {entrada.summary}
            </p>
          )}
          <VersionFiguras version={entrada} />
        </Section>
      )}

      {/* ── El documento ── */}
      {modo === 'documento' && entrada.html && (
        <Section
          eyebrow="Documento"
          title={`El informe completo, v${entrada.version}`}
          description="El documento tal como se imprime y se envía. Es el mismo archivo que se descarga, mostrado aquí sin salir del sitio."
        >
          <DocumentoEmbebido
            src={entrada.html}
            titulo={`${report.title} · versión ${entrada.version}`}
          />
        </Section>
      )}

      {modo === 'nativo' && !nativo && (
        <Section eyebrow="Documento" title="Sin reconstrucción disponible">
          <Notice tone="warning">
            Esta versión se declara legible en el sitio, pero no hay componentes
            que la reconstruyan. Use el documento descargable mientras tanto.
          </Notice>
        </Section>
      )}

      {modo === 'ninguna' && (
        <Section eyebrow="Documento" title="Esta versión no tiene documento en línea">
          <Notice tone="muted">
            No se publicó un documento autónomo para la v{entrada.version}: fue
            un estado del registro de investigación y no una edición del informe.
            Lo que cambió en ella queda en su changelog, y el historial completo
            está en{' '}
            <Link
              href={versionsHref(report.slug)}
              className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
            >
              todas las versiones
            </Link>
            .
          </Notice>
        </Section>
      )}

      {/*
        Lectura nativa de la v0.8.0. Son los mismos componentes que servían la
        ficha del informe antes de la v2.0.0: al pasar a histórica, la versión
        se llevó su lectura consigo en vez de perderla.
      */}
      {nativo && (
        <>
          <Informe01Apertura />
          <Informe01BorradorApertura />
          <Informe01Publicacion />
          <Informe01BorradorCierre />
          <Informe01Anexos />
        </>
      )}

      {/* ── Qué cambió ── */}
      <Section eyebrow="Registro" title={`Qué cambió en la v${entrada.version}`}>
        <ul className="max-w-3xl space-y-3">
          {entrada.changelog.map((entry) => (
            <li key={entry} className="flex gap-4">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              <span className="leading-relaxed text-muted-foreground">{entry}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Complementos ── */}
      {entrada.companions?.length ? (
        <Section
          eyebrow="Acompaña a esta versión"
          title="Documentos complementarios"
          description="No sustituyen al informe ni son una versión suya: existen aparte porque tratan algo que el informe principal, por método, no puede tratar dentro."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {entrada.companions.map((companion) => (
              <ComplementoDeVersion key={companion.id} companion={companion} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* ── Descargas de esta versión ── */}
      {artefactos.length > 0 && (
        <Section
          eyebrow="Descargas"
          title={`La v${entrada.version}, fuera de esta página`}
          description="Todos los formatos salen del mismo modelo y no pueden divergir. Sólo se listan los archivos que existen."
        >
          <ArtefactosDeVersion artifacts={artefactos} />
        </Section>
      )}

      {/* ── Cierre ── */}
      <section className="border-t border-border/70 py-14">
        <Container>
          <Notice tone={entrada.status === 'publicado' ? 'success' : 'warning'}>
            {reportStatusNotice[entrada.status]}
          </Notice>
        </Container>
      </section>
    </>
  );
}
