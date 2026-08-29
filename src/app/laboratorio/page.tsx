import type { Metadata } from 'next';
import { Container, Notice, PageHeader, Section, Surface } from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import { LabCatalog } from '@/components/lab/LabCatalog';
import { labCategories, labTools, statusMeta } from '@/data/lab';
import type { ToolStatus } from '@/types';

export const metadata: Metadata = {
  title: 'Lab IA + Derecho',
  description:
    'Herramientas, prototipos y flujos verificables en la intersección de inteligencia artificial y Derecho. Cada ficha declara qué hace y qué no.',
};

/**
 * Laboratorio IA + Derecho.
 *
 * Cataloga trabajo propio, no proveedores. La página abre explicando el
 * criterio, porque un catálogo sin criterio se convierte en una vitrina.
 */
export default function LaboratorioPage() {
  const counts = (Object.keys(statusMeta) as ToolStatus[])
    .map((s) => ({ status: s, n: labTools.filter((t) => t.status === s).length }))
    .filter((c) => c.n > 0);

  return (
    <>
      <PageHeader
        code="02 · Laboratorio"
        title="Lab IA + Derecho"
        lede="Herramientas, prototipos y flujos de trabajo aplicados al Derecho. Cada ficha declara qué entra, qué sale y qué la herramienta no hace."
      >
        <dl className="flex flex-wrap gap-x-8 gap-y-3">
          {counts.map(({ status, n }) => (
            <div key={status}>
              <dt className="meta">{statusMeta[status].label}</dt>
              <dd className="mono mt-1 text-xl text-foreground">{n}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* ── Criterio ── */}
      <Section>
        <Notice tone="signal" className="max-w-3xl">
          <p className="font-medium text-foreground">Qué es y qué no es este catálogo</p>
          <p className="mt-2 text-muted-foreground">
            Registra instrumentos desarrollados o probados dentro del proyecto:
            plantillas, procedimientos, rúbricas y prototipos. No es un
            comparador de proveedores ni un directorio de aplicaciones
            comerciales. Ninguna ficha se marca «estable» sin uso real
            documentado.
          </p>
        </Notice>
      </Section>

      {/* ── Catálogo ── */}
      <Section
        eyebrow="Catálogo"
        title="Fichas"
        description="Filtre por categoría o por estado de desarrollo."
      >
        <LabCatalog tools={labTools} />
      </Section>

      {/* ── Categorías previstas ── */}
      <Section
        eyebrow="Alcance"
        title="Las diez categorías"
        description="El mapa completo del laboratorio. Varias todavía no tienen fichas: aparecen aquí porque definen el territorio, no porque estén cubiertas."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {labCategories.map((cat) => {
            const n = labTools.filter((t) => t.category === cat.id).length;
            return (
              <li key={cat.id}>
                <Surface className="h-full p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-sans text-sm font-semibold text-foreground">
                      {cat.label}
                    </h3>
                    <span className="mono shrink-0 text-[0.6875rem] text-muted-foreground">
                      {n > 0 ? `${n}` : '—'}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {cat.blurb}
                  </p>
                </Surface>
              </li>
            );
          })}
        </ul>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <EvaNote portrait="cyberpunk" className="max-w-3xl">
            <p>
              Cada ficha tiene un apartado titulado «no hace». Es la parte que
              nadie lee y la única que evita accidentes. No todo lo que tiene un
              gradiente azul necesita llamarse inteligencia artificial.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}
