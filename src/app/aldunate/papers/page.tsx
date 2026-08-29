import type { Metadata } from 'next';
import { PageHeader, Section, Notice, Surface, Badge } from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import { publications } from '@/data/aldunate';

export const metadata: Metadata = {
  title: 'Publicaciones',
  description:
    'Catálogo de publicaciones. Cada entrada requiere respaldo documental verificable antes de publicarse.',
};

/**
 * Catálogo de publicaciones.
 *
 * Hoy está vacío. La página está construida para el catálogo lleno —el bloque
 * de listado ya existe y se activa solo— de modo que incorporar la primera
 * entrada verificada sea cargar un dato, no rehacer una vista.
 */
export default function PapersPage() {
  const hasPublications = publications.length > 0;

  return (
    <>
      <PageHeader
        code="01 · Publicaciones"
        title="Publicaciones"
        lede="Libros, capítulos, artículos y ponencias. El catálogo se construye a partir de referencias verificables, no de reconstrucciones."
      />

      <Section>
        {hasPublications ? (
          <ul className="space-y-3">
            {publications.map((pub) => (
              <li key={pub.id}>
                <Surface className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone="muted">{pub.kind}</Badge>
                    {pub.year && (
                      <span className="mono text-[0.75rem] text-muted-foreground">
                        {pub.year}
                      </span>
                    )}
                    {pub.verified ? (
                      <Badge tone="success" dot>
                        Verificada
                      </Badge>
                    ) : (
                      <Badge tone="warning" dot>
                        Sin verificar
                      </Badge>
                    )}
                  </div>
                  <h2 className="mt-3 font-serif text-lg text-foreground">{pub.title}</h2>
                  {pub.venue && (
                    <p className="mt-1 text-sm text-muted-foreground">{pub.venue}</p>
                  )}
                  {pub.abstract && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {pub.abstract}
                    </p>
                  )}
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      Ver referencia
                    </a>
                  )}
                </Surface>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-8">
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-14 text-center sm:py-20">
              <p className="mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
                Catálogo vacío
              </p>
              <h2 className="mt-4 font-serif text-2xl text-foreground">
                Todavía no hay publicaciones cargadas
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                No es un error de carga. Ninguna entrada se incorpora sin título
                exacto, año, sede de publicación y una referencia que cualquiera
                pueda comprobar por su cuenta.
              </p>
            </div>

            <Notice tone="signal" className="max-w-3xl">
              <p className="font-medium text-foreground">Qué se necesita para cargar una entrada</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>· Título exacto, tal como aparece en la publicación.</li>
                <li>· Año y sede: editorial, revista o congreso.</li>
                <li>· Coautoría, cuando corresponda.</li>
                <li>· Enlace, DOI o referencia bibliográfica completa.</li>
              </ul>
              <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                El material se deposita en <code className="mono">content/aldunate/papers/</code>{' '}
                y se registra según <code className="mono">docs/CONTENT_PIPELINE.md</code>.
              </p>
            </Notice>

            <EvaNote portrait="lifestyle">
              <p>
                Sin publicaciones cargadas. Podría haber inventado tres títulos
                verosímiles y nadie lo habría notado hasta la primera cita ajena.
                Por eso no lo hice: represento legalmente a las víctimas de la
                bibliografía plausible.
              </p>
            </EvaNote>
          </div>
        )}
      </Section>
    </>
  );
}
