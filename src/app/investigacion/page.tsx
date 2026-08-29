import type { Metadata } from 'next';
import Link from 'next/link';

import {
  Badge,
  Container,
  Notice,
  PageHeader,
  Section,
  Surface,
} from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import {
  claimSchema,
  claims,
  evidenceLevels,
  researchPrinciples,
  sourceSchema,
  sources,
} from '@/data/research';
import { reports } from '@/data/reports';
import type { EvidenceLevel } from '@/types';

export const metadata: Metadata = {
  title: 'Investigación',
  description:
    'Registro de fuentes, matriz de evidencia y método. La capa que sostiene los informes: fuente, evidencia, dato, visualización, conclusión.',
};

/**
 * Capa de investigación profunda.
 *
 * Publicar el método antes que los resultados tiene un costo: cualquiera puede
 * comprobar si el proyecto lo cumple. Ese es exactamente el punto.
 */
export default function InvestigacionPage() {
  const levelKeys = Object.keys(evidenceLevels) as EvidenceLevel[];

  return (
    <>
      <PageHeader
        code="05 · Investigación"
        title="La capa que sostiene todo lo demás"
        lede="Registro de fuentes, matriz de evidencia y método de trabajo. Un gráfico bonito sobre evidencia débil sigue siendo evidencia débil, solo que más persuasiva."
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="meta">Fuentes registradas</dt>
            <dd className="mono mt-1 text-2xl text-foreground">{sources.length}</dd>
          </div>
          <div>
            <dt className="meta">Afirmaciones</dt>
            <dd className="mono mt-1 text-2xl text-foreground">{claims.length}</dd>
          </div>
          <div>
            <dt className="meta">Informes alimentados</dt>
            <dd className="mono mt-1 text-2xl text-foreground">{reports.length}</dd>
          </div>
        </dl>
      </PageHeader>

      {/* ── La cadena ── */}
      <Section
        eyebrow="Principio operativo"
        title="La cadena"
        description="Cinco eslabones, en un orden que no se puede alterar. Cada uno debe poder recorrerse hacia atrás."
      >
        <ol className="flex flex-wrap items-stretch gap-2">
          {['Fuente', 'Evidencia', 'Dato', 'Visualización', 'Conclusión'].map((step, i, arr) => (
            <li key={step} className="flex items-center gap-2">
              <div className="rounded-md border border-border bg-card/50 px-4 py-3">
                <span className="mono mr-2 text-[0.6875rem] text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-foreground/85">{step}</span>
              </div>
              {i < arr.length - 1 && (
                <span className="text-muted-foreground" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Niveles de evidencia ── */}
      <Section
        eyebrow="Clasificación"
        title="Cinco niveles, no dos"
        description="Colapsar la evidencia en «cierto / falso» es la forma más rápida de convertir una investigación en una opinión larga."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {levelKeys.map((key) => {
            const level = evidenceLevels[key];
            return (
              <li key={key}>
                <Surface className="h-full p-5">
                  <div className="flex items-center gap-2.5">
                    <Badge tone={level.tone}>{level.label}</Badge>
                    <code className="mono text-[0.625rem] tracking-widest text-muted-foreground">
                      {key}
                    </code>
                  </div>
                  <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {level.definition}
                  </p>
                </Surface>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ── Principios ── */}
      <Section
        eyebrow="Método"
        title="Seis reglas"
        description="Se publican para poder ser incumplidas a la vista de todos."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {researchPrinciples.map((p, i) => (
            <li key={p.title}>
              <Surface className="h-full p-6">
                <span className="mono text-[0.6875rem] tracking-widest text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-serif text-lg text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </Surface>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Esquemas de registro ── */}
      <Section
        eyebrow="Trazabilidad"
        title="Los dos registros"
        description="Estructura real de los archivos que viven en content/research/. El método es auditable porque su esquema es público."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <SchemaTable
            title="Registro de fuentes"
            file="content/research/source-registry.csv"
            rows={sourceSchema}
            count={sources.length}
          />
          <SchemaTable
            title="Matriz de evidencia"
            file="content/research/evidence-matrix.csv"
            rows={claimSchema}
            count={claims.length}
          />
        </div>
      </Section>

      {/* ── Estado ── */}
      <Section>
        <Notice tone="warning" className="max-w-3xl">
          <p className="font-medium text-foreground">Estado actual: registros vacíos</p>
          <p className="mt-2 text-muted-foreground">
            Todavía no hay fuentes cargadas. Poblar la matriz con datos de
            ejemplo para que «se vea trabajada» produciría exactamente el
            problema que este método existe para evitar. Los informes en curso
            aparecen sin fuentes porque no las tienen aún, no porque falte
            mostrarlas.
          </p>
          <p className="mt-3">
            <Link href="/informes" className="font-medium text-primary hover:underline">
              Ver los informes que alimentará
            </Link>
          </p>
        </Notice>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <EvaNote portrait="desk" className="max-w-3xl">
            <p>
              Esta es la capa aburrida e imprescindible. Fuente, evidencia, dato,
              visualización, conclusión —en ese orden y sin saltarse pasos—.
              Cualquiera puede volver a este método en seis meses y comprobar si
              el proyecto lo cumplió. Esa es toda la gracia.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}

function SchemaTable({
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
    <Surface className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-5">
        <div>
          <h3 className="font-serif text-lg text-foreground">{title}</h3>
          <code className="mono mt-1 block text-[0.6875rem] text-muted-foreground">{file}</code>
        </div>
        <Badge tone={count > 0 ? 'success' : 'muted'}>
          {count} {count === 1 ? 'registro' : 'registros'}
        </Badge>
      </div>
      <dl className="divide-y divide-border/60">
        {rows.map((row) => (
          <div key={row.field} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:gap-4">
            <dt className="mono shrink-0 text-[0.75rem] text-primary sm:w-36">{row.field}</dt>
            <dd className="text-[0.8125rem] leading-relaxed text-muted-foreground">{row.desc}</dd>
          </div>
        ))}
      </dl>
    </Surface>
  );
}
