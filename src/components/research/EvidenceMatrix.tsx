import { ExternalLink } from 'lucide-react';

import { Disclosure, Surface } from '@/components/common/ui';
import { EpistemicTag } from '@/components/common/status';
import {
  demonstrativeLevelMeta,
  documentaryStatusMeta,
  generalizationScopeMeta,
  robustnessMeta,
  sources,
} from '@/data/research';
import { datePrecision, formatDate, formatSourceDate } from '@/lib/utils';
import type { EvidenceClaim, Source } from '@/types';

/**
 * Las fuentes y las afirmaciones, publicadas.
 *
 * El sitio afirmaba trazabilidad desde su primera versión y no la enseñaba:
 * `/investigacion` mostraba el **esquema** de los registros —los nombres de los
 * campos— y nunca los registros. Veinticuatro fuentes y dieciocho afirmaciones
 * vivían en `src/data/research.ts` sin una sola ruta que las pintara. Era el
 * único fallo que contradecía la tesis del propio proyecto.
 *
 * Cada afirmación enlaza a sus fuentes por ancla, y cada fuente lleva su
 * identificador visible: el recorrido afirmación → fuente → publicación
 * original se hace con el ratón, no leyendo el repositorio.
 */

/* ────────────────────────────── Afirmaciones ────────────────────────────── */

export function ClaimList({ claims }: { claims: EvidenceClaim[] }) {
  return (
    <ol className="space-y-3">
      {claims.map((claim) => (
        <li key={claim.id}>
          <ClaimCard claim={claim} />
        </li>
      ))}
    </ol>
  );
}

function ClaimCard({ claim }: { claim: EvidenceClaim }) {
  const cited = claim.sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  return (
    <Surface id={claim.id} className="scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <EpistemicTag level={claim.classification} />
        <code className="mono text-[0.625rem] tracking-widest text-muted-foreground">
          {claim.id}
        </code>
        {claim.report && (
          <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            {claim.report}
          </span>
        )}
      </div>

      <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/90">{claim.claim}</p>

      {/*
        La advertencia de lectura no se pliega. Es la parte que impide que la
        cifra se cite sin su alcance, así que va al mismo nivel que la cifra.
      */}
      {claim.note && (
        <p className="mt-3 border-l-2 border-l-warning/60 pl-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {claim.note}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3">
        <span className="meta">Sostenida por</span>
        <ul className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
          {cited.map((source) => (
            <li key={source.id}>
              {/* `min-h-6`: 24 px de objetivo táctil, WCAG 2.2 AA 2.5.8. */}
              <a
                href={`#${source.id}`}
                className="mono inline-flex min-h-6 items-center text-[0.6875rem] text-primary underline underline-offset-2 hover:no-underline"
                title={source.title}
              >
                {source.id}
              </a>
            </li>
          ))}
        </ul>
        {typeof claim.confidence === 'number' && (
          <span className="mono ml-auto text-[0.6875rem] text-muted-foreground">
            confianza {claim.confidence}
          </span>
        )}
        {claim.lastVerified && (
          <span className="mono text-[0.6875rem] text-muted-foreground">
            verificada {formatDate(claim.lastVerified, { day: '2-digit', month: '2-digit' })}
          </span>
        )}
      </div>
    </Surface>
  );
}

/* ────────────────────────────── Fuentes ────────────────────────────── */

export function SourceList({ items, citedIds }: { items: Source[]; citedIds: Set<string> }) {
  return (
    <ol className="space-y-3">
      {items.map((source) => (
        <li key={source.id}>
          <SourceCard source={source} cited={citedIds.has(source.id)} />
        </li>
      ))}
    </ol>
  );
}

function SourceCard({ source, cited }: { source: Source; cited: boolean }) {
  const precision = datePrecision(source.publishedDate);

  return (
    <Surface id={source.id} className="scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <code className="mono text-[0.625rem] tracking-widest text-primary">{source.id}</code>
        {source.evidenceType && (
          <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            {source.evidenceType}
          </span>
        )}
        {/*
          Una fuente registrada que ninguna afirmación cita no es un error: puede
          estar ahí como contexto o como contraevidencia. Pero se dice, porque
          el registro se publica para ser auditado y un lector tiene derecho a
          saber cuál de estas fichas sostiene algo y cuál todavía no.
        */}
        {!cited && (
          <span className="mono rounded-sm border border-dashed border-border px-1.5 py-0.5 text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            sin afirmación asociada
          </span>
        )}
      </div>

      <h3 className="mt-3 font-serif text-lg leading-snug text-foreground">
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-start gap-1.5 hover:text-primary"
          >
            <span className="min-w-0">{source.title}</span>
            <ExternalLink className="mt-1.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          </a>
        ) : (
          source.title
        )}
      </h3>

      <p className="mt-1.5 text-sm text-muted-foreground">{source.organization}</p>

      {/*
        La corrección del editor va antes que las notas y con marca propia. Una
        fuente corregida se puede citar; lo que no se puede es citarla en
        silencio, y quien la lea deprisa tiene que tropezarse con el aviso.
      */}
      {source.correction && (
        <div className="mt-3 rounded-md border-l-2 border-l-warning bg-warning/[0.06] px-3.5 py-2.5">
          <p className="mono text-[0.625rem] uppercase tracking-widest text-warning">
            Corrección publicada · {formatSourceDate(source.correction.date)}
          </p>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-foreground/80">
            {source.correction.note}
          </p>
          {source.correction.url && (
            <a
              href={source.correction.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mono mt-1.5 inline-flex min-h-6 items-center text-[0.6875rem] text-primary underline underline-offset-2 hover:no-underline"
            >
              Ver la corrección
            </a>
          )}
        </div>
      )}

      {source.notes && (
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {source.notes}
        </p>
      )}

      {/*
        Las cuatro dimensiones separadas. Antes todo esto era la palabra
        «VERIFICADO», que mezclaba «la fuente existe» con «el hallazgo se
        sostiene» y con «esto vale en cualquier parte».
      */}
      <Clasificacion source={source} />

      <dl className="mono mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border/60 pt-3 text-[0.6875rem] text-muted-foreground">
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">publicada</dt>
          <dd className="text-foreground/75">
            {formatSourceDate(source.publishedDate)}
            {/*
              La precisión se declara. Una fuente de la que sólo se conoce el
              año se ve distinta de una fechada al día, en vez de disimularse.
            */}
            {precision && precision !== 'día' && (
              <span className="text-muted-foreground"> · precisión de {precision}</span>
            )}
          </dd>
        </div>
        {source.geography && (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">ámbito</dt>
            <dd className="text-foreground/75">{source.geography}</dd>
          </div>
        )}
        {source.accessedDate && (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">consultada</dt>
            <dd className="text-foreground/75">{formatSourceDate(source.accessedDate)}</dd>
          </div>
        )}
        {typeof source.confidence === 'number' && (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">confianza</dt>
            <dd className="text-foreground/75">{source.confidence}</dd>
          </div>
        )}
      </dl>
    </Surface>
  );
}

/* ────────────────────────────── Esquemas ────────────────────────────── */

/**
 * El esquema de un registro baja a segunda capa: interesa a quien va a auditar
 * o a reproducir, no a quien viene a leer la evidencia. Antes ocupaba el lugar
 * de los registros mismos.
 */
export function SchemaDisclosure({
  title,
  file,
  rows,
  count,
}: {
  title: string;
  file: string;
  rows: { field: string; desc: string }[];
  count: number;
}) {
  return (
    <Disclosure summary={title} hint={`${count} ${count === 1 ? 'registro' : 'registros'}`}>
      <code className="mono mb-3 block text-[0.6875rem] text-muted-foreground">{file}</code>
      <dl className="divide-y divide-border/60">
        {rows.map((row) => (
          <div key={row.field} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:gap-4">
            <dt className="mono shrink-0 text-[0.75rem] text-primary sm:w-36">{row.field}</dt>
            <dd className="text-[0.8125rem] leading-relaxed text-muted-foreground">{row.desc}</dd>
          </div>
        ))}
      </dl>
    </Disclosure>
  );
}

/**
 * Las cuatro dimensiones de una fuente, cuando están declaradas.
 *
 * No se rellenan por defecto: una fuente sin clasificar aparece sin este
 * bloque, y eso es información —dice que nadie la ha evaluado todavía—. Poner
 * un valor plausible para que la ficha se vea completa es exactamente el
 * problema que esta taxonomía existe para evitar.
 */
function Clasificacion({ source }: { source: Source }) {
  const filas = [
    source.documentaryStatus && {
      k: 'Estado documental',
      ...documentaryStatusMeta[source.documentaryStatus],
    },
    source.robustness && { k: 'Robustez', ...robustnessMeta[source.robustness] },
    source.demonstrativeLevel && {
      k: 'Nivel demostrativo',
      ...demonstrativeLevelMeta[source.demonstrativeLevel],
    },
    source.generalizationScope && {
      k: 'Generalización',
      ...generalizationScopeMeta[source.generalizationScope],
    },
  ].filter((f) => f !== undefined);

  if (filas.length === 0) return null;

  return (
    <dl className="mt-4 grid gap-2 sm:grid-cols-2">
      {filas.map((f) => (
        <div key={f.k} className="rounded-md border border-border/60 bg-card/40 px-3 py-2">
          <dt className="meta">{f.k}</dt>
          <dd className="mt-0.5 text-[0.8125rem] text-foreground/85" title={f.definition}>
            {f.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
