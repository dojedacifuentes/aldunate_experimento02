import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { SourceList } from '@/components/aldunate/AcademicTimeline';
import { SourceRef } from '@/components/aldunate/Evidence';
import { Notice, PageHeader, Section, Surface } from '@/components/common/ui';
import { conceptById, corpusStats, publications } from '@/data/aldunate';

export const metadata: Metadata = {
  title: 'Publicaciones — catálogo completo',
  description: `Listado bibliográfico completo: ${corpusStats.total} obras entre ${corpusStats.span.from} y ${corpusStats.span.to}, con sede, volumen, páginas, coautoría y fuente de cada entrada.`,
  alternates: { canonical: '/aldunate/papers' },
};

/**
 * Catálogo completo, sin filtros.
 *
 * Convive con el explorador de `/aldunate` a propósito, y no lo duplica: hacen
 * trabajos distintos. Aquel sirve para **recorrer** —filtros, vistas, panel de
 * concepto, todo en cliente—; este sirve para **citar**: una sola lista, en
 * orden cronológico inverso, enteramente renderizada en el servidor, que se
 * imprime de un tirón y se copia sin desplegar nada.
 *
 * De ahí que aquí no haya un solo componente de cliente. Es una página que
 * funciona con JavaScript desactivado, porque una bibliografía que necesita
 * hidratación para leerse es una bibliografía peor.
 */
export default function PapersPage() {
  const ordered = [...publications].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  // Agrupación por año: da al listado el ritmo que una lista plana de cuarenta
  // entradas no tiene, y ubica cada obra sin repetir la fecha en cada línea.
  const byYear = ordered.reduce<Map<number, typeof publications>>((acc, pub) => {
    if (typeof pub.year !== 'number') return acc;
    const bucket = acc.get(pub.year);
    if (bucket) bucket.push(pub);
    else acc.set(pub.year, [pub]);
    return acc;
  }, new Map());

  return (
    <>
      <PageHeader
        code="05 · Publicaciones"
        title="Catálogo completo"
        lede={`${corpusStats.total} obras entre ${corpusStats.span.from} y ${corpusStats.span.to}: ${corpusStats.articles} artículos y ${corpusStats.books} libros, con sede, volumen, páginas y coautoría. Ordenadas de la más reciente a la más antigua.`}
      />

      <Section>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/aldunate#publicaciones"
            className="mono inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-wider text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Volver al explorador, con filtros y vistas
          </Link>
        </div>

        <Notice tone="warning" className="mt-6 max-w-3xl">
          Listado construido a partir de la ficha de autor en Dialnet, contrastado contra la
          publicación original donde estaba accesible. Cubre lo indexado: la ausencia de una
          obra aquí no prueba que no exista. Ninguna entrada lleva un resumen de su
          argumento, porque no se han consultado los textos completos.
        </Notice>
      </Section>

      {/* ── El listado ── */}
      <Section eyebrow="Bibliografía" title="Obras, por año">
        <div className="space-y-10">
          {[...byYear.entries()].map(([year, list]) => (
            <section key={year} className="grid gap-4 sm:grid-cols-[5rem_1fr] sm:gap-6">
              <h3 className="font-serif text-3xl leading-none text-foreground sm:sticky sm:top-24 sm:self-start">
                {year}
              </h3>

              <ol className="min-w-0 space-y-4">
                {list.map((pub) => (
                  <li key={pub.id}>
                    <Surface className="p-5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="mono text-[0.5625rem] uppercase tracking-[0.16em] text-primary">
                          {pub.kind}
                        </span>
                        <SourceRef ids={pub.sourceIds ?? []} className="ml-auto" />
                      </div>

                      <h4 className="mt-2.5 text-[0.9375rem] leading-snug text-foreground">
                        {pub.title}
                      </h4>

                      <p className="mono mt-1.5 text-[0.6875rem] leading-relaxed text-muted-foreground">
                        {pub.venue}
                      </p>

                      {pub.coauthors && pub.coauthors.length > 0 && (
                        <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                          <span className="meta mr-2">En coautoría con</span>
                          {pub.coauthors.join(' · ')}
                        </p>
                      )}

                      {pub.abstract && (
                        <p className="mt-3 border-l-2 border-border/70 pl-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {pub.abstract}
                        </p>
                      )}

                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        {pub.concepts?.map((id) => (
                          <span
                            key={id}
                            className="mono rounded border border-border/70 px-2 py-0.5 text-[0.5625rem] uppercase tracking-wider text-muted-foreground"
                          >
                            {conceptById.get(id)?.title ?? id}
                          </span>
                        ))}

                        {pub.url && (
                          <a
                            href={pub.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="mono ml-auto inline-flex items-center gap-1 text-[0.625rem] uppercase tracking-wider text-primary hover:underline"
                          >
                            Texto
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        )}
                      </div>
                    </Surface>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </Section>

      {/* ── Fuentes, para que el listado se sostenga sin salir de la página ── */}
      <section className="border-t border-border/70">
        <Section
          eyebrow="Fuentes"
          title="De dónde sale este listado"
          description="Los números entre corchetes de cada entrada apuntan aquí."
        >
          <SourceList />
        </Section>
      </section>
    </>
  );
}
