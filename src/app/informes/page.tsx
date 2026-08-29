import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

import { Badge, Container, Notice, PageHeader, Section, Surface } from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import { InstitutionalMark } from '@/components/layout/InstitutionalMark';
import { reports, reportStatusMeta } from '@/data/reports';
import { formatDate, latestVersion } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Informes',
  description:
    'Biblioteca de informes vivos: versionados, con metodología declarada, fuentes verificables y changelog público.',
};

/**
 * Biblioteca de informes.
 *
 * «Vivo» significa que se versiona hacia adelante y que el historial queda a la
 * vista. Sin changelog no hay informe vivo: hay un archivo que cambió sin que
 * nadie pueda decir cuándo ni por qué.
 */
export default function InformesPage() {
  return (
    <>
      <PageHeader
        code="03 · Informes"
        title="Documentos vivos"
        lede="Biblioteca de informes versionados. Cada uno declara su metodología, sus fuentes, sus límites y su historial de cambios."
      />

      <Section>
        <Notice tone="signal" className="max-w-3xl">
          <p className="font-medium text-foreground">Cómo leer un informe vivo</p>
          <p className="mt-2 text-muted-foreground">
            Ninguna versión publicada se sobrescribe. Cuando un informe cambia,
            se agrega una versión nueva y el cambio queda registrado. Toda cifra
            lleva fecha de verificación: un dato sin fecha es un dato que ya no
            se puede defender.
          </p>
        </Notice>
      </Section>

      <Section>
        <ul className="space-y-4">
          {reports.map((report) => {
            const meta = reportStatusMeta[report.status];
            const latest = latestVersion(report.versions);

            return (
              <li key={report.slug}>
                <Link href={`/informes/${report.slug}`} className="group block">
                  <Surface interactive className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="mono text-[0.6875rem] tracking-widest text-primary">
                        {report.code}
                      </span>
                      <Badge tone={meta.tone} dot>
                        {meta.label}
                      </Badge>
                      {latest && (
                        <span className="mono text-[0.6875rem] text-muted-foreground">
                          v{latest.version}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 max-w-3xl font-serif text-2xl leading-snug text-foreground group-hover:text-primary sm:text-3xl">
                      {report.title}
                    </h2>
                    {report.subtitle && (
                      <p className="mt-1.5 font-serif text-base italic text-muted-foreground">
                        {report.subtitle}
                      </p>
                    )}

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {report.executiveSummary}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
                      <span className="mono text-[0.6875rem] text-muted-foreground">
                        {report.axes.length} ejes · actualizado {formatDate(report.updatedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Abrir informe
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </Surface>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <EvaNote portrait="desk">
              <p>
                Dos informes abiertos, ninguno concluido. Ambos declaran alcance
                y método antes de tener hallazgos, que es el orden correcto y el
                menos frecuente. Detecté una tecnología obsoleta —el PDF de
                noventa y seis páginas sin índice— y procedo a representar
                legalmente a la víctima.
              </p>
            </EvaNote>

            <Surface className="p-6">
              <FileText className="h-5 w-5 text-primary" aria-hidden />
              <p className="meta mt-4 mb-3">Contexto institucional</p>
              <InstitutionalMark size={48} withCaption />
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                Documentos de trabajo de un prototipo académico. No son
                publicaciones oficiales de la PUCV.
              </p>
            </Surface>
          </div>
        </Container>
      </section>
    </>
  );
}
