import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, Download, FlaskConical, History, ListTree } from 'lucide-react';

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
import { DocumentoEmbebido } from '@/components/informes/DocumentoEmbebido';
import {
  ArtefactosDeVersion,
  ComplementoDeVersion,
  EntradaDeHistorial,
  RailDeVersiones,
  VersionFiguras,
} from '@/components/informes/Versiones';
import { informe01Recuento } from '@/data/informe01';
import {
  getReport,
  reports,
  reportStatusMeta,
  reportStatusNotice,
} from '@/data/reports';
import { autor } from '@/data/site';
import type { EvidenceLevel } from '@/types';
import { evidenceLevels, sources } from '@/data/research';
import {
  currentVersion,
  hasOnlineReading,
  readingMode,
  sortedVersions,
  versionArtifacts,
  versionHref,
  versionsHref,
} from '@/lib/informes';
import { formatDate } from '@/lib/utils';

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
 * Ficha de informe.
 *
 * Desde la v2.0.0 del Informe 01 esta pantalla es la **portada del informe** y
 * no el informe: dice qué es, en qué versión va, qué cambió en ella y por dónde
 * se entra. El documento se lee en `/informes/<informe>/v/<versión>`, una ruta
 * por versión, y el historial completo en `/versiones`.
 *
 * El motivo es que el informe dejó de caber aquí sin mentir. La pantalla
 * reconstruía la v0.8.0 con componentes propios mientras la cabecera anunciaba
 * la versión vigente: quien leía de arriba abajo veía «v2.0.0» y a continuación
 * las cifras de la anterior. Ahora cada versión se lee en su propia ruta, con
 * su número en la cabecera, y ninguna pantalla habla por otra.
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
  /*
    La vigente es la de número mayor, no la última por fecha: el Informe 01
    publicó la v0.7.0 y la v0.8.0 el mismo día y el orden quedaba a merced de
    cómo estuviera escrito el arreglo.
  */
  const latest = currentVersion(report);
  const ordered = sortedVersions(report.versions);
  const artefactos = latest ? versionArtifacts(latest) : [];
  const word = artefactos.find((a) => a.format === 'Word');
  const complementos = latest?.companions ?? [];
  const leeEnLinea = latest ? hasOnlineReading(latest) : false;
  /* Las tres últimas aquí; las demás, en su propia página. */
  const recientes = ordered.slice(0, 3);
  const reportSources = report.sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source) => source !== undefined);
  const hasSources = reportSources.length > 0;
  const primaryKitArtifact = report.researchKit?.artifacts.find(
    (artifact) => artifact.format === 'PDF',
  );
  const esInforme01 = report.slug === 'ia-escuelas-derecho-chile';

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
          {/* Descriptor: acota el alcance, no compite con el título. */}
          {report.descriptor && (
            <p className="mono mt-3 text-[0.6875rem] uppercase tracking-widest text-accent">
              {report.descriptor}
            </p>
          )}

          {/* La cadena, con sus cifras juntas. Sueltas parecían contradecirse. */}
          {report.counts && (
            <ol className="mono mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] text-muted-foreground">
              {[
                [report.counts.sources, 'fuentes'],
                [report.counts.findings, 'hallazgos'],
                [report.counts.claims, 'afirmaciones'],
                [report.counts.recommendations, 'recomendaciones'],
              ].map(([n, etiqueta], i, arr) => (
                <li key={etiqueta as string} className="flex items-center gap-2">
                  <span>
                    <span className="text-foreground">{n}</span> {etiqueta}
                  </span>
                  {i < arr.length - 1 && <span aria-hidden>→</span>}
                </li>
              ))}
            </ol>
          )}

          {/*
            «Leer en línea» ya no sale del sitio a un archivo suelto: entra al
            lector de la versión vigente, que conserva alrededor el número de
            versión, el selector y las descargas. Un documento abierto en una
            pestaña en blanco no dice de qué versión es ni que existe otra.
          */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {latest && leeEnLinea && (
              <ButtonLink href={versionHref(report.slug, latest.version)} variant="primary">
                <BookOpen className="h-4 w-4" aria-hidden />
                Leer en línea · v{latest.version}
              </ButtonLink>
            )}
            {latest?.pdf ? (
              <ButtonLink
                href={latest.pdf}
                variant={leeEnLinea ? 'outline' : 'primary'}
                external
              >
                <Download className="h-4 w-4" aria-hidden />
                Descargar PDF · v{latest.version}
              </ButtonLink>
            ) : primaryKitArtifact && report.researchKit ? (
              <ButtonLink href={primaryKitArtifact.href} variant="primary" external>
                <Download className="h-4 w-4" aria-hidden />
                Descargar kit · v{report.researchKit.version}
              </ButtonLink>
            ) : (
              <span className="inline-flex h-10 items-center gap-2 rounded-md border border-dashed border-border px-4 text-sm text-muted-foreground">
                <Download className="h-4 w-4" aria-hidden />
                PDF no disponible en esta versión
              </span>
            )}
            {word && (
              <ButtonLink href={word.href} variant="outline" external>
                <Download className="h-4 w-4" aria-hidden />
                Word
              </ButtonLink>
            )}
            <ButtonLink href={versionsHref(report.slug)} variant="outline">
              <History className="h-4 w-4" aria-hidden />
              Versiones
            </ButtonLink>
            {!esInforme01 && (
              <ButtonLink href="#metodologia" variant="outline">
                <FlaskConical className="h-4 w-4" aria-hidden />
                Ver metodología
              </ButtonLink>
            )}
            <ButtonLink href="#fuentes" variant="outline">
              <ListTree className="h-4 w-4" aria-hidden />
              Ver fuentes
            </ButtonLink>
          </div>
        </Container>
      </header>

      {/*
        El raíl de versiones va aquí, antes que nada: es lo primero que hay que
        poder contestar en un informe vivo —«¿cuál estoy mirando y cuáles hay?»—
        y antes había que bajar hasta la capa 3 para averiguarlo.
      */}
      {report.versions.length > 1 && (
        <section className="border-b border-border/70 py-6">
          <Container>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <p className="meta text-primary">
                {report.versions.length} versiones publicadas
              </p>
              <Link
                href={versionsHref(report.slug)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver el historial completo
              </Link>
            </div>
            <RailDeVersiones
              slug={report.slug}
              versions={ordered}
              actual={latest?.version}
            />
          </Container>
        </section>
      )}

      {latest && (
        <Section
          eyebrow={`Versión vigente · v${latest.version}`}
          title={latest.headline ?? `Qué trae la v${latest.version}`}
          description={latest.summary}
        >
          <VersionFiguras version={latest} className="mb-10" />
        </Section>
      )}

      {/*
        El documento, abierto. Es lo primero que se lee y no algo a lo que haya
        que llegar: quien entra a un informe entra a leerlo, y obligarle a
        pulsar «leer en línea» para empezar era un paso que no compraba nada.
        Se carga dentro de la página, con el tema del sitio y su índice al
        lado; la ruta \`/v/<versión>\` sigue existiendo para enlazar una
        versión concreta y para las históricas.
      */}
      {latest && leeEnLinea && readingMode(latest) === 'documento' && latest.html && (
        <Section
          id="documento"
          eyebrow="El informe"
          title={`Documento completo · v${latest.version}`}
          description="El documento tal como se imprime y se envía, leído aquí sin descargar nada. El índice de la izquierda lleva a cualquier sección."
          className="scroll-mt-20"
        >
          <DocumentoEmbebido
            src={latest.html}
            titulo={`${report.title} · versión ${latest.version}`}
          />
        </Section>
      )}

      {/*
        La v0.8.0 es la única versión transcrita a datos tipados, y su lectura
        vive en su propia ruta. Cuando la vigente sea de esa clase, aquí sólo
        se anuncia: montar la reconstrucción entera dentro de la portada es lo
        que hacía que la pantalla dijera una versión y mostrara otra.
      */}
      {latest && readingMode(latest) === 'nativo' && (
        <Section eyebrow="El informe" title={`Documento completo · v${latest.version}`}>
          <Notice tone="signal">
            Esta versión la reconstruye el sitio con sus propios componentes.{' '}
            <Link
              href={versionHref(report.slug, latest.version)}
              className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
            >
              Abrir la lectura de la v{latest.version}
            </Link>
            .
          </Notice>
        </Section>
      )}

      {latest && (
        <Section
          eyebrow="Registro"
          title={`Qué cambió en la v${latest.version}`}
          description="Una versión nueva no autoriza a hacer desaparecer la anterior. Esto es lo que se hizo, y qué consecuencia tiene cada cosa sobre lo que el informe puede afirmar."
        >
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div>
              <p className="meta mb-4 text-primary">Qué cambió respecto de la anterior</p>
              <ul className="space-y-3">
                {latest.changelog.map((entry) => (
                  <li key={entry} className="flex gap-4">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    <span className="leading-relaxed text-muted-foreground">{entry}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Surface className="p-6">
              <p className="meta mb-4">Cómo leerla</p>
              <dl className="space-y-0">
                <MetaRow label="Publicada" value={formatDate(latest.date)} />
                <MetaRow label="Estado" value={reportStatusMeta[latest.status].label} />
                {latest.pages && (
                  <MetaRow label="Extensión" value={`${latest.pages} páginas`} />
                )}
                <MetaRow
                  label="Lectura en línea"
                  value={
                    readingMode(latest) === 'nativo'
                      ? 'Reconstruida en el sitio'
                      : readingMode(latest) === 'documento'
                        ? 'Documento completo, sin salir del sitio'
                        : 'No disponible'
                  }
                />
                <MetaRow label="Formatos" value={String(artefactos.length)} />
              </dl>
              {leeEnLinea && (
                <ButtonLink
                  href={versionHref(report.slug, latest.version)}
                  variant="primary"
                  size="sm"
                  className="mt-5"
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Abrir la v{latest.version}
                </ButtonLink>
              )}
            </Surface>
          </div>
        </Section>
      )}


      {/* ── Capa 1 · Ficha y resumen ── */}
      <Section
        eyebrow="Capa 1"
        title={esInforme01 ? 'Ficha del documento' : 'Resumen ejecutivo'}
      >
        <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          {/*
            El Informe 01 publica su resumen ejecutivo como sección propia, con
            siete párrafos y hallazgos enumerados: repetir aquí el párrafo de la
            ficha lo diría dos veces y en dos extensiones distintas. Los demás
            informes conservan el resumen en este sitio.
          */}
          <div className="prose-editorial">
            {esInforme01 ? (
              <p className="text-muted-foreground">
                Mapeo comparado de capacidades institucionales en inteligencia artificial
                en once Escuelas y Facultades de Derecho chilenas. Esta pantalla es la
                portada del informe: declara su estado, sus versiones y por dónde se entra.
                El resumen ejecutivo, los ocho hallazgos y los anexos están dentro del
                documento, y se leen sin descargar nada en la versión que se elija.
              </p>
            ) : (
              <p>{report.executiveSummary}</p>
            )}
          </div>

          <Surface className="p-6">
            <p className="meta mb-4">Ficha</p>
            <dl className="space-y-0">
              <MetaRow label="Estado" value={meta.label} />
              <MetaRow label="Versión" value={latest ? `v${latest.version}` : '—'} />
              <MetaRow label="Actualizado" value={formatDate(report.updatedAt)} />
              <MetaRow
                label="Autoría"
                value={
                  <>
                    <span className="block text-foreground">{report.authors.join(', ')}</span>
                    <span className="mt-0.5 block text-[0.75rem] text-muted-foreground">
                      {autor.credential} · {autor.role}
                    </span>
                  </>
                }
              />
              <MetaRow label="Ejes" value={String(report.axes.length)} />
              {/*
                El contador se lee del registro real y no de `sourceIds`.
                `sourceIds` alimenta la lista de fuentes verificadas, y el
                Informe 01 tiene registro poblado y verificación en curso:
                mostrar «0» aquí contradecía las que declara el propio informe
                unas pantallas más abajo.
              */}
              <MetaRow
                label={esInforme01 ? 'Registro navegable' : 'Fuentes registradas'}
                value={
                  esInforme01
                    ? `${informe01Recuento.fuentes} fuentes · dataset de la v0.8.0`
                    : hasSources
                      ? String(reportSources.length)
                      : '0 · en registro'
                }
              />
              <MetaRow
                label="Carpeta"
                value={<code className="mono text-[0.75rem]">{report.folder}</code>}
              />
            </dl>
          </Surface>
        </div>
      </Section>

      {/*
        Qué trae la versión vigente. Las cifras cuelgan de la versión y no del
        informe: son las que ese documento sostiene, y la versión anterior
        sostenía otras. Es lo que impide que la ficha diga «38 verificadas»
        mientras el documento descargable en la misma pantalla dice «74 de 74».
      */}
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

      {/*
        Aquí vivía la publicación entera del Informe 01, reconstruida con
        componentes propios a partir de `src/data/informe01*`. Se mudó a
        `/informes/<informe>/v/0.8.0`, que es la versión que esos datos
        transcriben, y sigue completa: fichas institucionales, matriz navegable,
        las nueve figuras y los anexos. No se borró nada.

        Mantenerla aquí, bajo una cabecera que anuncia la v2.0.0, habría hecho
        que la pantalla dijera una versión y mostrara otra.
      */}

      {/*
        Los complementos van antes que las descargas y con su razón de ser
        delante: el de la PUCV existe porque quien firma trabaja en esa Escuela,
        y ponerlo en la rejilla de archivos lo habría convertido en un anexo.
      */}
      {complementos.length > 0 && (
        <Section
          eyebrow="Acompaña a la versión vigente"
          title="Documentos complementarios"
          description="No sustituyen al informe ni son una versión suya: existen aparte porque tratan algo que el informe principal, por método, no puede tratar dentro."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {complementos.map((companion) => (
              <ComplementoDeVersion key={companion.id} companion={companion} />
            ))}
          </div>
        </Section>
      )}

      {latest && artefactos.length > 0 && (
        <Section
          eyebrow="Descargas"
          title={`La v${latest.version}, fuera de esta página`}
          description="Mismo contenido, mismos números: el documento y sus datos salen del mismo origen y no pueden divergir. Sólo se listan los archivos que existen."
          className="scroll-mt-20"
        >
          <div id="descargas">
            <ArtefactosDeVersion artifacts={artefactos} />
            <Notice tone="muted" className="mt-6">
              Éstos son los archivos de la versión vigente. Los de las versiones
              anteriores no se retiran: cada una conserva los suyos en{' '}
              <Link
                href={versionsHref(report.slug)}
                className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
              >
                su entrada del historial
              </Link>
              .
            </Notice>
          </div>
        </Section>
      )}

      {report.researchKit && (
        <Section
          eyebrow="Para comenzar"
          title={report.researchKit.title}
          description={report.researchKit.summary}
        >
          <div className="mb-6 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <Notice tone="signal">
              Este material fija el método, la cohorte y el sistema de coordinación. Su
              publicación no implica que existan hallazgos sobre las universidades.
            </Notice>
            <Surface className="p-5">
              <dl>
                <MetaRow label="Versión del kit" value={`v${report.researchKit.version}`} />
                <MetaRow
                  label="Publicado"
                  value={formatDate(report.researchKit.publishedAt)}
                />
                <MetaRow label="Estado" value={report.researchKit.status} />
              </dl>
            </Surface>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.researchKit.artifacts.map((artifact) => (
              <li key={artifact.format}>
                <Surface className="flex h-full flex-col p-5">
                  <Badge tone={artifact.format === 'ZIP' ? 'accent' : 'muted'}>
                    {artifact.format}
                  </Badge>
                  <h3 className="mt-3 font-serif text-lg leading-snug text-foreground">
                    {artifact.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {artifact.description}
                  </p>
                  <ButtonLink
                    href={artifact.href}
                    variant={artifact.format === 'ZIP' ? 'accent' : 'outline'}
                    size="sm"
                    external
                    className="mt-4 self-start"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden />
                    {artifact.format === 'HTML' ? 'Abrir' : 'Descargar'}
                  </ButtonLink>
                </Surface>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/*
        Capa 2 · Metodología y límites.
        El Informe 01 la sustituye por su §3, que cuenta lo mismo con nueve
        apartados y una declaración de intereses, y por su §7. Mantener las dos
        dejaría dos secciones llamadas «Metodología» en el mismo documento.
      */}
      {!esInforme01 && (
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
      )}

      {/* Igual que arriba: la agenda del §8 del Informe 01 sustituye a esta lista. */}
      {!esInforme01 && (
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
      )}

      {/* ── Capa 3 · Historial ── */}
      <Section eyebrow="Capa 3" title="Historial de versiones">
        <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
          Cada publicación agrega una versión. Ninguna se reemplaza, y cada una
          sigue legible y descargable con las cifras que sostenía entonces. El
          changelog es la prueba de que el documento cambió de forma trazable.
        </p>

        <ol className="relative space-y-8 border-l border-border pl-6">
          {recientes.map((version) => (
            <li key={version.version} className="relative">
              <span
                className={`absolute -left-[1.6875rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-background ${
                  version.version === latest?.version
                    ? 'bg-primary'
                    : 'bg-muted-foreground/50'
                }`}
                aria-hidden
              />
              <EntradaDeHistorial
                slug={report.slug}
                version={version}
                esActual={version.version === latest?.version}
                compacta
              />
            </li>
          ))}
        </ol>

        {ordered.length > recientes.length && (
          <ButtonLink href={versionsHref(report.slug)} variant="outline" className="mt-8">
            <History className="h-4 w-4" aria-hidden />
            Ver las {ordered.length} versiones, con sus descargas
          </ButtonLink>
        )}
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
                  {esInforme01
                    ? 'Registro poblado · corpus contrastado al 100 %'
                    : 'Registro vacío'}
                </p>
                <h3 className="mt-3 font-serif text-xl text-foreground">
                  {esInforme01
                    ? `${informe01Recuento.fuentes} fuentes en el registro navegable, contrastadas una por una en la v2.0.0`
                    : 'Todavía no hay fuentes incorporadas'}
                </h3>
                <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {esInforme01
                    ? 'El registro está publicado y cada fuente aparece en la ficha de su institución, con su estado editorial y sus advertencias de lectura; las fichas navegables se construyen sobre el dataset de la v0.8.0, que es el último que se compiló a datos tipados. Ninguna fuente entra a esta lista todavía porque esta lista es de fuentes aceptadas, y aceptar exige decisión humana registrada: contrastar no es aceptar.'
                    : 'El informe está en fase de definición de alcance. Las fuentes entran al registro antes de convertirse en dato, y el registro se publica junto con el documento.'}
                </p>
                <Link
                  href={
                    esInforme01
                      ? `/informes/${report.slug}/instituciones`
                      : '/investigacion'
                  }
                  className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {esInforme01
                    ? 'Ver el registro en las fichas institucionales'
                    : 'Ver el método de investigación'}
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
              {/*
                El aviso se deriva del estado. Estaba escrito a mano y decía
                «Informe en fase de investigación… los hallazgos, no» en los dos
                informes, incluido el que está en revisión con PDF descargable y
                treinta y ocho hallazgos registrados. Una advertencia que
                contradice a la propia página no advierte de nada.
              */}
              <Notice tone={report.status === 'publicado' ? 'success' : 'warning'}>
                {reportStatusNotice[report.status]}
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
