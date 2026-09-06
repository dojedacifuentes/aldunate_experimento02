import Link from 'next/link';
import { ArrowUpRight, Download, FileText } from 'lucide-react';

import { Badge, ButtonLink, Disclosure, Notice, Surface } from '@/components/common/ui';
import { EditorialStatus } from '@/components/common/status';
import { claimChangeLabel, reportStatusMeta } from '@/data/reports';
import {
  hasOnlineReading,
  readingMode,
  versionArtifacts,
  versionHref,
} from '@/lib/informes';
import { cn, formatDate } from '@/lib/utils';
import type { ReportArtifact, ReportCompanion, ReportVersion } from '@/types';

/**
 * El vocabulario de versiones, en un solo sitio.
 *
 * Tres pantallas hablan de lo mismo —la ficha del informe, el índice de
 * versiones y el lector— y antes cada una lo decía a su manera. Aquí viven las
 * piezas que comparten, de modo que publicar la versión siguiente no obligue a
 * revisar tres maquetas para que digan lo mismo con las mismas palabras.
 *
 * Ninguna pieza inventa una cifra ni deduce un estado: todo sale de la entrada
 * de `versions` en `src/data/reports.ts`, y lo que esa entrada no declara,
 * simplemente no se pinta.
 */

/* ────────────────────────────── Cifras ────────────────────────────── */

/**
 * Las cifras de una versión, junto a su número.
 *
 * Van pegadas a la versión y nunca al informe. Es la lección de la v0.8.0: la
 * ficha del sitio declaraba «38 verificadas» mientras el documento que se podía
 * descargar en esa misma pantalla ya decía otra cosa.
 */
export function VersionFiguras({
  version,
  className,
}: {
  version: ReportVersion;
  className?: string;
}) {
  if (!version.figures?.length) return null;

  return (
    <dl
      className={cn(
        'grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70',
        'sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {version.figures.map((figure) => (
        <div key={figure.label} className="bg-card/60 p-5">
          <dd className="mono flex items-baseline gap-0.5 text-2xl text-foreground">
            {/*
              `data-count` lleva el número de destino **en el atributo**, no en
              el texto: el motor lee `dataset.count` y escribe el resultado
              encima. Puesto sin valor, React lo sirve como `data-count="true"`
              y la primera pantalla del informe mostraba «NaN» en las cinco
              cifras. Y sólo se anima lo que es un entero: una cifra como
              «1,8 : 1» no se cuenta hacia arriba, se lee.
            */}
            {/^\d+$/.test(figure.value) ? (
              <span data-count={figure.value}>{figure.value}</span>
            ) : (
              <span>{figure.value}</span>
            )}
            {figure.unit && (
              <span className="text-base text-muted-foreground">{figure.unit}</span>
            )}
          </dd>
          <dt className="meta mt-2 text-primary">{figure.label}</dt>
          {figure.note && (
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {figure.note}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}

/* ────────────────────────────── Selector ────────────────────────────── */

/**
 * Raíl de versiones.
 *
 * Es el control que hace navegable un informe vivo: todas las versiones a la
 * vista, la vigente marcada, y cada una con la frase que la distingue. Un
 * desplegable con números habría ocupado menos y obligado a abrir tres para
 * saber cuál se busca.
 *
 * Las versiones sin lectura en línea aparecen igual, en gris y sin enlace. Que
 * una versión antigua no tenga documento autónomo es un hecho del historial,
 * y esconderla haría que el historial mintiera por omisión.
 */
export function RailDeVersiones({
  slug,
  versions,
  actual,
  activa,
  className,
}: {
  slug: string;
  versions: ReportVersion[];
  /** La vigente, para marcarla aunque no sea la que se está leyendo. */
  actual?: string;
  /** La que se está leyendo ahora, si hay alguna. */
  activa?: string;
  className?: string;
}) {
  return (
    <nav aria-label="Versiones del informe" className={className}>
      <ul className="flex snap-x gap-2.5 overflow-x-auto pb-2">
        {versions.map((version) => {
          const esActual = version.version === actual;
          const esActiva = version.version === activa;
          const legible = hasOnlineReading(version);

          const contenido = (
            <>
              <span className="flex items-center gap-2">
                <span className="mono text-sm font-medium text-foreground">
                  v{version.version}
                </span>
                {esActual && <Badge tone="signal">Vigente</Badge>}
              </span>
              <span className="mono mt-1 block text-[0.625rem] text-muted-foreground">
                {formatDate(version.date)}
              </span>
              {version.headline && (
                <span className="mt-2 block text-[0.8125rem] leading-snug text-muted-foreground">
                  {version.headline}
                </span>
              )}
              {!legible && (
                <span className="mono mt-2 block text-[0.625rem] uppercase tracking-widest text-muted-foreground/70">
                  Sin documento en línea
                </span>
              )}
            </>
          );

          const base = 'block h-full w-60 shrink-0 snap-start rounded-lg border p-4 text-left';

          return (
            <li key={version.version} className="flex">
              {legible ? (
                <Link
                  href={versionHref(slug, version.version)}
                  aria-current={esActiva ? 'page' : undefined}
                  className={cn(
                    base,
                    'transition-colors',
                    esActiva
                      ? 'border-primary bg-primary/[0.07]'
                      : 'border-border/70 bg-card/40 hover:border-primary/60',
                  )}
                >
                  {contenido}
                </Link>
              ) : (
                <div className={cn(base, 'border-dashed border-border/70 bg-muted/25')}>
                  {contenido}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ────────────────────────────── Descargas ────────────────────────────── */

const formatTone: Partial<Record<ReportArtifact['format'], 'accent' | 'muted' | 'signal'>> = {
  ZIP: 'accent',
  JSON: 'signal',
};

export function ArtefactosDeVersion({ artifacts }: { artifacts: readonly ReportArtifact[] }) {
  if (artifacts.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {artifacts.map((artifact) => (
        <li key={`${artifact.format}-${artifact.href}`}>
          <Surface className="flex h-full flex-col p-5">
            <Badge tone={formatTone[artifact.format] ?? 'muted'}>{artifact.format}</Badge>
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
  );
}

/* ────────────────────────────── Complementos ────────────────────────────── */

/**
 * Documento que acompaña a una versión.
 *
 * Lleva su razón de ser delante de sus descargas, y no al revés: el
 * complemento de la PUCV existe porque quien firma el informe trabaja en esa
 * Escuela, y ofrecer el archivo antes que ese motivo lo convertiría en un
 * anexo cualquiera.
 */
export function ComplementoDeVersion({ companion }: { companion: ReportCompanion }) {
  return (
    <Surface className="p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="warning">Documento complementario</Badge>
        <span className="mono text-[0.6875rem] text-muted-foreground">
          v{companion.version} · {formatDate(companion.date)}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-xl leading-snug text-foreground">
        {companion.title}
      </h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{companion.summary}</p>

      <div className="mt-5 rounded-md border-l-2 border-l-warning bg-warning/[0.06] px-4 py-3">
        <p className="meta mb-1.5 text-warning">Por qué existe por separado</p>
        <p className="text-[0.8125rem] leading-relaxed text-foreground/80">
          {companion.rationale}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {companion.html && (
          <ButtonLink href={companion.html} variant="outline" size="sm" external>
            <FileText className="h-3.5 w-3.5" aria-hidden />
            Leer el complemento
          </ButtonLink>
        )}
        {companion.artifacts
          .filter((artifact) => artifact.format !== 'HTML')
          .map((artifact) => (
            <ButtonLink
              key={artifact.href}
              href={artifact.href}
              variant="ghost"
              size="sm"
              external
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              {artifact.format}
            </ButtonLink>
          ))}
      </div>
    </Surface>
  );
}

/* ────────────────────────────── Historial ────────────────────────────── */

/**
 * Una entrada del historial, con todo lo que la versión declaró.
 *
 * `compacta` deja fuera las descargas y el cambio a nivel de afirmación: es la
 * forma que usa la ficha del informe, donde el historial es un resumen y no el
 * asunto de la página.
 */
export function EntradaDeHistorial({
  slug,
  version,
  esActual,
  compacta = false,
}: {
  slug: string;
  version: ReportVersion;
  esActual: boolean;
  compacta?: boolean;
}) {
  const artefactos = versionArtifacts(version);
  const legible = hasOnlineReading(version);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="mono text-sm font-medium text-foreground">v{version.version}</span>
        <span className="mono text-[0.6875rem] text-muted-foreground">
          {formatDate(version.date)}
        </span>
        {esActual ? (
          <Badge tone="signal">Vigente</Badge>
        ) : (
          <Badge tone="muted">Histórica</Badge>
        )}
        <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
          {reportStatusMeta[version.status].label}
        </span>
      </div>

      {version.headline && (
        <p className="mt-2 font-serif text-lg leading-snug text-foreground">
          {version.headline}
        </p>
      )}
      {version.summary && !compacta && (
        <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
          {version.summary}
        </p>
      )}

      {legible && (
        <Link
          href={versionHref(slug, version.version)}
          className="mt-3 inline-flex min-h-6 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {readingMode(version) === 'nativo'
            ? 'Leer en el sitio'
            : 'Leer el documento'}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only"> la versión {version.version}</span>
        </Link>
      )}

      <ul className="mt-3 space-y-1.5">
        {version.changelog.map((entry) => (
          <li key={entry} className="text-sm leading-relaxed text-muted-foreground">
            · {entry}
          </li>
        ))}
      </ul>

      {!compacta && artefactos.length > 0 && (
        <Disclosure
          className="mt-4"
          summary="Qué se puede descargar de esta versión"
          hint={`${artefactos.length} archivos`}
        >
          <ArtefactosDeVersion artifacts={artefactos} />
        </Disclosure>
      )}

      {/*
        Changelog a nivel de afirmación. «Se actualizaron fuentes» no permite
        saber si la frase que alguien citó el mes pasado sigue diciendo lo
        mismo; esto sí: qué decía, qué dice y por qué.
      */}
      {!compacta && version.claimChanges && version.claimChanges.length > 0 && (
        <Disclosure
          className="mt-4"
          summary="Qué afirmaciones cambiaron, y por qué"
          hint={`${version.claimChanges.length} cambios`}
        >
          <ol className="space-y-5">
            {version.claimChanges.map((c, k) => (
              <li key={`${version.version}-${k}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mono text-[0.625rem] uppercase tracking-widest text-accent">
                    {claimChangeLabel[c.changeType]}
                  </span>
                  {c.claimId && (
                    <a
                      href={`/investigacion#${c.claimId}`}
                      className="mono inline-flex min-h-6 items-center text-[0.625rem] text-primary underline underline-offset-2 hover:no-underline"
                    >
                      {c.claimId}
                    </a>
                  )}
                </div>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground line-through decoration-muted-foreground/40">
                  {c.previous}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/85">
                  {c.current}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  <span className="meta">Motivo</span> {c.reason}
                </p>
              </li>
            ))}
          </ol>
        </Disclosure>
      )}
    </div>
  );
}

/**
 * Aviso de versión no vigente.
 *
 * Se pinta arriba del documento y no al pie. Alguien que llega por un enlace
 * antiguo debe saber que está leyendo una versión superada **antes** de leerla,
 * no después de citarla.
 */
export function AvisoDeVersionHistorica({
  slug,
  actual,
}: {
  slug: string;
  actual: ReportVersion;
}) {
  return (
    <Notice tone="warning">
      Ésta no es la versión vigente. Se conserva publicada y descargable porque
      ninguna versión se sobrescribe, pero sus cifras fueron superadas por la{' '}
      <Link
        href={versionHref(slug, actual.version)}
        className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
      >
        v{actual.version}, de {formatDate(actual.date)}
      </Link>
      . Si va a citar, cite el número de versión y la fecha de consulta.
    </Notice>
  );
}

/** Estado editorial de una versión, con su significado a la vista. */
export function EstadoDeVersion({ version }: { version: ReportVersion }) {
  return <EditorialStatus status={version.status} />;
}
