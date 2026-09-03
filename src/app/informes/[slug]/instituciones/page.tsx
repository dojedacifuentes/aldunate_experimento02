import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs, Container, Notice, Section } from '@/components/common/ui';
import { FichaInstitucional } from '@/components/informe01/Ficha';
import { informe01Recuento } from '@/data/informe01';
import { getReport } from '@/data/reports';
import { coberturaDe, universidadesOrdenadas } from '@/lib/informe01';

const SLUG = 'ia-escuelas-derecho-chile';

export function generateStaticParams() {
  return [{ slug: SLUG }];
}

export const metadata: Metadata = {
  title: 'Fichas institucionales · IA en Escuelas y Facultades de Derecho en Chile',
  description:
    'Once fichas institucionales con la evidencia pública localizada sobre inteligencia artificial en Escuelas y Facultades de Derecho chilenas, cada una con su cobertura de investigación declarada.',
};

/**
 * Las once fichas, en su propia página.
 *
 * Van en orden alfabético y no por cantidad de evidencia. Ordenarlas por
 * evidencia sería un ranking encubierto: la cobertura es 3,7 veces mayor en las
 * tres del piloto, de modo que el orden reflejaría el trabajo de campo.
 *
 * Cada ficha declara cuántas rutas del protocolo se recorrieron en ella, que es
 * el dato sin el cual las demás cifras no se pueden interpretar.
 */
export default async function InstitucionesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== SLUG) notFound();
  const report = getReport(slug);
  if (!report) notFound();

  const piloto = universidadesOrdenadas.filter((u) => coberturaDe(u.id)?.inPilot);

  return (
    <>
      <header className="border-b border-border/70 py-12 sm:py-16">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Informes', href: '/informes' },
              { label: report.code, href: `/informes/${slug}` },
              { label: 'Instituciones' },
            ]}
          />
          <h1 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl">
            Las once instituciones de la cohorte
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {informe01Recuento.iniciativas} iniciativas y {informe01Recuento.evidencias}{' '}
            evidencias, atribuidas a la unidad que cada fuente identifica. Las fichas van en
            orden alfabético: ordenarlas por cantidad de evidencia sería un ranking del
            trabajo de campo.
          </p>

          <Notice tone="warning" className="mt-6 max-w-2xl">
            Tres de las once —{piloto.map((u) => u.officialName).join(', ')}— forman el piloto
            de profundidad y concentran {informe01Recuento.coberturaPiloto} fuentes de media
            frente a {informe01Recuento.coberturaResto} en las ocho restantes. Una ficha más
            poblada indica dónde se buscó más.
          </Notice>

          <nav aria-label="Índice de fichas" className="mt-8">
            <p className="meta mb-3">Ir a una ficha</p>
            <ul className="flex flex-wrap gap-2">
              {universidadesOrdenadas.map((u) => (
                <li key={u.id}>
                  <a
                    href={`#ficha-${u.id}`}
                    className="mono inline-flex min-h-8 items-center rounded border border-border bg-card/40 px-2.5 text-[0.6875rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {u.id}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>

      <Section reveal={false}>
        <div className="space-y-16">
          {universidadesOrdenadas.map((u) => (
            <FichaInstitucional key={u.id} universityId={u.id} />
          ))}
        </div>
      </Section>
    </>
  );
}
