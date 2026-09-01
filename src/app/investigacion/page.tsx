import type { Metadata } from 'next';
import Link from 'next/link';
import { ListTree, ScrollText, Wrench } from 'lucide-react';

import {
  ButtonLink,
  Disclosure,
  Notice,
  PageHeader,
  Section,
  Surface,
} from '@/components/common/ui';
import { EpistemicTag } from '@/components/common/status';
import { ClaimList, SchemaDisclosure, SourceList } from '@/components/research/EvidenceMatrix';
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
 *
 * Orden de la página, y por qué cambió. Era una secuencia larga —cadena,
 * niveles, reglas, esquemas, estado— con todo desplegado y sin un solo registro
 * a la vista: mostraba el **esquema** de los registros, nunca los registros. El
 * lector recorría entera la documentación del método y se iba sin haber visto
 * una fuente. Ahora la evidencia va primero y el método queda plegado a un
 * clic: quien viene a auditar lo abre, quien viene a leer no tropieza con él.
 */
export default function InvestigacionPage() {
  const levelKeys = Object.keys(evidenceLevels) as EvidenceLevel[];
  /**
   * Qué fuentes sostienen efectivamente una afirmación. Se calcula en vez de
   * anotarse a mano: una cifra escrita a mano deja de ser cierta en cuanto
   * alguien añade una fuente y se olvida de actualizarla.
   */
  const citedIds = new Set(claims.flatMap((c) => c.sourceIds));
  const uncited = sources.length - sources.filter((s) => citedIds.has(s.id)).length;

  return (
    <>
      <PageHeader
        code="04 · Investigación"
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

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href="#afirmaciones" variant="primary">
            <ListTree className="h-4 w-4" aria-hidden />
            Ver la matriz
          </ButtonLink>
          <ButtonLink href="#fuentes" variant="outline">
            <ScrollText className="h-4 w-4" aria-hidden />
            Explorar las fuentes
          </ButtonLink>
          <ButtonLink href="#metodo" variant="outline">
            <Wrench className="h-4 w-4" aria-hidden />
            Leer el método
          </ButtonLink>
        </div>
      </PageHeader>

      {/* ── Primera capa: la cadena ── */}
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

      {/* ── Matriz de evidencia ── */}
      <section id="afirmaciones" className="scroll-mt-20 border-t border-border/70 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="meta mb-3 text-primary">Matriz de evidencia</p>
            <h2 className="text-2xl sm:text-3xl">
              {claims.length} afirmaciones, con su alcance declarado
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Cada una lleva su nivel de evidencia, la advertencia de lectura que
              limita hasta dónde puede citarse, y los identificadores de las
              fuentes que la sostienen. Los identificadores son enlaces: llevan a
              la ficha de la fuente, más abajo en esta misma página.
            </p>
          </div>

          <ClaimList claims={claims} />
        </div>
      </section>

      {/* ── Registro de fuentes ── */}
      <section id="fuentes" className="scroll-mt-20 border-t border-border/70 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="meta mb-3 text-primary">Registro de fuentes</p>
            <h2 className="text-2xl sm:text-3xl">
              {sources.length} fuentes, con su publicación original enlazada
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Diseño, ámbito geográfico, fecha de publicación con su precisión
              real y fecha de consulta. Cuando de una fuente sólo se conoce el
              año, se dice: rellenar el día para que la ficha se vea completa
              sería inventar precisión.
            </p>
            {uncited > 0 && (
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {uncited} de estas {sources.length} no sostienen todavía ninguna
                afirmación de la matriz. Están registradas como contexto y van
                marcadas: un registro que se publica para ser auditado no puede
                ocultar cuál de sus fichas trabaja y cuál no.
              </p>
            )}
          </div>

          <SourceList items={sources} citedIds={citedIds} />
        </div>
      </section>

      {/* ── Segunda capa: el método, plegado ── */}
      <section id="metodo" className="scroll-mt-20 border-t border-border/70 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="meta mb-3 text-primary">Método</p>
            <h2 className="text-2xl sm:text-3xl">Cómo se construye lo anterior</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Criterios de clasificación, reglas de trabajo y estructura de los
              registros. Está aquí para poder ser auditado y para poder ser
              incumplido a la vista de todos.
            </p>
          </div>

          <div className="space-y-3">
            <Disclosure summary="Los cinco niveles de evidencia" hint={`${levelKeys.length} niveles`}>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Colapsar la evidencia en «cierto / falso» es la forma más rápida
                de convertir una investigación en una opinión larga.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {levelKeys.map((key) => (
                  <li key={key}>
                    <Surface className="h-full p-4">
                      <EpistemicTag level={key} code />
                      <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {evidenceLevels[key].definition}
                      </p>
                    </Surface>
                  </li>
                ))}
              </ul>
            </Disclosure>

            <Disclosure summary="Las reglas de trabajo" hint={`${researchPrinciples.length} reglas`}>
              <ul className="grid gap-5 md:grid-cols-2">
                {researchPrinciples.map((p, i) => (
                  <li key={p.title}>
                    <span className="mono text-[0.6875rem] tracking-widest text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 font-serif text-base text-foreground">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Disclosure>

            <SchemaDisclosure
              title="Esquema del registro de fuentes"
              file="content/research/source-registry.csv"
              rows={sourceSchema}
              count={sources.length}
            />

            <SchemaDisclosure
              title="Esquema de la matriz de evidencia"
              file="content/research/evidence-matrix.csv"
              rows={claimSchema}
              count={claims.length}
            />
          </div>
        </div>
      </section>

      {/* ── Estado ── */}
      <Section>
        <Notice tone="signal" className="max-w-3xl">
          <p className="font-medium text-foreground">Estado actual del registro</p>
          <p className="mt-2 text-muted-foreground">
            {sources.length} fuentes verificadas y {claims.length} afirmaciones
            sintéticas, todas trazables hasta su publicación original. La
            cobertura es desigual por diseño: se registra lo que se pudo
            verificar, no lo que haría ver el registro más completo. Las lagunas
            se anotan como lagunas.
          </p>
          <p className="mt-3">
            <Link href="/informes" className="font-medium text-primary hover:underline">
              Ver los informes que alimenta
            </Link>
          </p>
        </Notice>
      </Section>

      {/*
        Sin nota de EVA. Es una capa de evidencia: aquí la voz que interpreta no
        debe cerrar la página. EVA interpreta, la evidencia demuestra.
      */}
    </>
  );
}
