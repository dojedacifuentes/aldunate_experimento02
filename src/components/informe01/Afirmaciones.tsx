import { Disclosure, Surface } from '@/components/common/ui';
import { EpistemicTag } from '@/components/common/status';
import { evidencia, fuente, universidad } from '@/lib/informe01';
import type { Informe01Afirmacion } from '@/types';

/**
 * Afirmaciones con su cadena completa a la vista.
 *
 * Cada una publica cuatro cosas que en la mayoría de los informes se omiten:
 * el razonamiento que la sostiene, su contraevidencia, sus límites y su
 * confianza. La contraevidencia es la más importante y la que más incomoda: si
 * una conclusión tiene evidencia en contra y no se enseña, la conclusión no es
 * un hallazgo sino una postura.
 *
 * Ninguna está `ACEPTADA`. El estado editorial se imprime junto al nivel
 * epistémico precisamente para que no se confundan: el nivel dice qué clase de
 * cosa es la afirmación; el estado, cuánto ha caminado por el procedimiento.
 */
export function ListaAfirmaciones({ afirmaciones }: { afirmaciones: Informe01Afirmacion[] }) {
  return (
    <ol className="space-y-4">
      {afirmaciones.map((c) => (
        <li key={c.id}>
          <TarjetaAfirmacion afirmacion={c} />
        </li>
      ))}
    </ol>
  );
}

export function TarjetaAfirmacion({ afirmacion: c }: { afirmacion: Informe01Afirmacion }) {
  const u = c.universityId ? universidad(c.universityId) : undefined;

  return (
    <Surface id={c.id} className="scroll-mt-24 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <EpistemicTag level={c.classification} />
        <code className="mono text-[0.625rem] tracking-widest text-muted-foreground">
          {c.id}
        </code>
        <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
          {c.workflowStatus}
        </span>
        {u && (
          <span className="mono text-[0.625rem] uppercase tracking-widest text-accent">
            {u.officialName}
          </span>
        )}
        {!c.universityId && (
          <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            {c.id.startsWith('clm-metodo-') ? 'método' : 'cohorte'}
          </span>
        )}
      </div>

      <p className="mt-3 font-serif text-lg leading-snug text-foreground">{c.text}</p>

      <dl className="mt-4 space-y-3 border-t border-border/60 pt-4">
        <Campo etiqueta="Razonamiento" valor={c.reasoning} />
        <Campo etiqueta="Límites" valor={c.limitations} tone="warning" />
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
          Confianza {c.confidence}/100
        </span>
        <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
          Verificación sustantiva {c.lastVerified || 'pendiente'}
        </span>
      </div>

      {c.evidenceIds.length > 0 && (
        <Disclosure
          className="mt-4"
          summary="Evidencia que la sostiene"
          hint={`${c.evidenceIds.length}`}
        >
          <ListaEvidencia ids={c.evidenceIds} />
        </Disclosure>
      )}

      {c.counterevidenceIds.length > 0 && (
        <Disclosure
          className="mt-3"
          summary="Evidencia que la matiza o la contradice"
          hint={`${c.counterevidenceIds.length}`}
        >
          <ListaEvidencia ids={c.counterevidenceIds} />
        </Disclosure>
      )}
    </Surface>
  );
}

function Campo({
  etiqueta,
  valor,
  tone,
}: {
  etiqueta: string;
  valor: string;
  tone?: 'warning';
}) {
  return (
    <div>
      <dt className={`meta ${tone === 'warning' ? 'text-warning' : ''}`}>{etiqueta}</dt>
      <dd className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{valor}</dd>
    </div>
  );
}

function ListaEvidencia({ ids }: { ids: string[] }) {
  return (
    <ul className="space-y-3">
      {ids.map((id) => {
        const e = evidencia(id);
        if (!e) return null;
        const f = fuente(e.sourceId);
        return (
          <li key={id} className="border-l border-border pl-4">
            <div className="flex flex-wrap items-center gap-x-2">
              <code className="mono text-[0.625rem] tracking-widest text-muted-foreground">
                {e.id}
              </code>
              <span className="mono text-[0.625rem] uppercase tracking-widest text-muted-foreground">
                {e.workflowStatus}
              </span>
            </div>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/85">
              {e.statement}
            </p>
            <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
              {e.limitations}
            </p>
            {f && (
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex min-h-6 items-center text-[0.75rem] text-primary hover:underline"
              >
                {f.title}
                <span className="sr-only"> · abre en una pestaña nueva</span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
