import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';

import { AcademicTimeline, SourceList } from '@/components/aldunate/AcademicTimeline';
import { ConceptMap } from '@/components/aldunate/ConceptMap';
import { DoctrinalExplorer } from '@/components/aldunate/DoctrinalExplorer';
import {
  EvidenceBadge,
  EvidenceLegend,
  SourceRef,
} from '@/components/aldunate/Evidence';
import { MotionStage } from '@/components/aldunate/MotionStage';
import { PortraitHero } from '@/components/aldunate/PortraitHero';
import { PublicationExplorer } from '@/components/aldunate/PublicationExplorer';
import { SectionNav } from '@/components/aldunate/SectionNav';
import {
  Container,
  Notice,
  PendingBlock,
  Section,
  Surface,
} from '@/components/common/ui';
import { EvaNote } from '@/components/eva/EvaNote';
import {
  corpusStats,
  courses,
  pendingContent,
  profile,
  profileFacts,
} from '@/data/aldunate';
import { portrait } from '@/data/aldunate/portrait';

export const metadata: Metadata = {
  title: 'Eduardo Aldunate — perfil académico',
  description:
    `Catálogo de ${corpusStats.total} obras entre ${corpusStats.span.from} y ${corpusStats.span.to}, mapa de conceptos derivado del propio corpus y ficha de trayectoria con el nivel de evidencia de cada dato a la vista. Prototipo académico, no oficial PUCV.`,
  alternates: { canonical: '/aldunate' },
  openGraph: {
    title: 'Eduardo Aldunate — perfil académico',
    description:
      `Catálogo académico con sus fuentes: ${corpusStats.total} obras, ${corpusStats.span.from}—${corpusStats.span.to}, y el nivel de evidencia de cada dato declarado.`,
    url: '/aldunate',
    type: 'profile',
    images: [{ url: portrait.og, width: 1200, height: 630, alt: portrait.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eduardo Aldunate — perfil académico',
    images: [portrait.og],
  },
};

/**
 * Perfil académico.
 *
 * Cinco actos: persona, ideas, obra, tiempo, evidencia. Cada sección compone
 * distinto —hero partido, mapa con panel, catálogo con filtros, eje temporal,
 * bibliografía— porque una página que repite «título más tres tarjetas» cinco
 * veces se lee como un formulario.
 *
 * Qué cambió respecto de la versión anterior, y por qué:
 *
 * La página declaraba «dos catálogos abiertos, ambos vacíos». Era honesto
 * cuando no había material verificado. Ahora lo hay para publicaciones —40
 * obras contrastadas contra Dialnet y, donde se pudo, contra la publicación
 * original— y seguir mostrando el hueco sería tan inexacto como haberlo
 * rellenado antes. Cursos sigue vacío y lo sigue diciendo.
 *
 * Lo que NO cambió: ninguna afirmación viaja sin su nivel de evidencia, y
 * ninguna obra lleva una tesis atribuida. El aparato de trazabilidad no es
 * decorado académico: es la razón por la que este perfil puede citarse.
 */
export default function AldunatePage() {
  return (
    <>
      {/* Un solo motor de movimiento para toda la ruta. Ver MotionStage. */}
      <MotionStage />

      <PortraitHero />
      <SectionNav />

      {/* ── Aviso de alcance ── */}
      <div data-reveal>
        <Section>
        <Notice tone="warning" className="max-w-3xl">
          {profile.note}
          </Notice>
        </Section>
      </div>

      {/* ── ACTO 01 · Ficha ── */}
      <div data-reveal>
        <Section
        eyebrow="02 — En noventa segundos"
        title="Quién es, según qué fuente"
        description="Cada línea lleva su nivel de evidencia y el número de la fuente que la sostiene. Un dato que consta en una sola ficha colaborativa no se presenta igual que uno indexado."
      >
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <dl className="divide-y divide-border/60 border-y border-border/60">
            {profileFacts.map((fact) => (
              <div key={fact.id} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr] sm:gap-5">
                <dt className="meta pt-1">{fact.label}</dt>
                <dd>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                    <span className="text-[0.9375rem] leading-snug text-foreground">
                      {fact.value}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <EvidenceBadge level={fact.classification} withLabel={false} />
                      <SourceRef ids={fact.sourceIds} />
                    </span>
                  </div>
                  {fact.note && (
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {fact.note}
                    </p>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Surface className="p-6">
              <p className="meta mb-4">Cómo leer las marcas</p>
              <EvidenceLegend levels={['FACT', 'SIGNAL', 'PENDING']} />
            </Surface>

            <Surface className="p-6">
              <p className="meta mb-3">El corpus, en cifras</p>
              <dl className="space-y-2.5">
                <Stat label="Obras indexadas" value={corpusStats.total} />
                <Stat label="Artículos" value={corpusStats.articles} />
                <Stat label="Libros" value={corpusStats.books} />
                <Stat label="En coautoría" value={corpusStats.coauthored} />
                <Stat label="Sedes distintas" value={corpusStats.venues} />
                <Stat
                  label="Años cubiertos"
                  value={`${corpusStats.span.from}—${corpusStats.span.to}`}
                />
              </dl>
              <p className="mt-4 border-t border-border/60 pt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
                Todas se calculan desde el catálogo. Ninguna está escrita a mano, de modo que
                no pueden quedar desactualizadas.
              </p>
            </Surface>
          </div>
        </div>
        </Section>
      </div>

      {/* ── ACTO 02 · Ideas ── */}
      <section id="pensamiento" data-reveal className="scroll-mt-32 border-t border-border/70">
        <Section
          eyebrow="03 — Mapa intelectual"
          title="Qué territorios recorre el corpus"
          description="Dieciséis conceptos extraídos de las obras del catálogo, no propuestos de antemano. Los vínculos se calculan: dos conceptos se unen cuando una misma publicación los reúne."
        >
          <ConceptMap />
        </Section>
      </section>

      <section data-reveal className="border-t border-border/70">
        <Section
          eyebrow="04 — Preguntas"
          title="Qué problemas aborda, y hasta dónde podemos decirlo"
          description="Un explorador de preguntas, no de posturas. Sin haber leído los textos completos, lo que puede afirmarse es qué problema trata cada serie de obras; la respuesta que dan queda declarada como pendiente."
        >
          <DoctrinalExplorer />
        </Section>
      </section>

      {/* ── ACTO 03 · Obra ── */}
      <section id="publicaciones" data-reveal className="scroll-mt-32 border-t border-border/70">
        <Section
          eyebrow="05 — Catálogo"
          title={`${corpusStats.total} obras, ${corpusStats.span.from}—${corpusStats.span.to}`}
          description="Tres lecturas del mismo conjunto: lista, eje temporal y agrupación temática. Los filtros se conservan al cambiar de vista."
        >
          <PublicationExplorer />
        </Section>
      </section>

      {/* ── ACTO 04 · Tiempo ── */}
      <section id="trayectoria" data-reveal className="scroll-mt-32 border-t border-border/70">
        <Section
          eyebrow="06 — Trayectoria"
          title="La cronología, con su respaldo"
          description="Formación, cargos y los tramos de obra que marcan un cambio de rumbo temático."
        >
          <AcademicTimeline />
        </Section>
      </section>

      {/* ── ACTO 05 · Evidencia ── */}
      <section id="fuentes" data-reveal className="scroll-mt-32 border-t border-border/70">
        <Section
          eyebrow="07 — Fuentes"
          title="Sobre qué se sostiene todo lo anterior"
          description="Ocho fuentes, cada una con lo que efectivamente respalda. Citar la misma referencia al pie de todo es el abuso más común de una bibliografía; declarar el alcance de cada una lo impide."
        >
          <SourceList />
        </Section>
      </section>

      {/* ── Huecos ── */}
      <section data-reveal className="border-t border-border/70">
        <Section
          eyebrow="08 — Estado del contenido"
          title="Lo que falta, dicho en voz alta"
          description="Inventario de lo identificado como necesario y todavía no incorporado, incluido lo que el informe de origen afirmaba y aquí no se publica."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {pendingContent.map((item) => (
              <PendingBlock key={item.id} label={item.label} detail={item.detail} />
            ))}
          </div>

          <div className="mt-8">
            <Link href="/aldunate/cursos" className="group inline-block">
              <Surface interactive className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-primary">
                    <GraduationCap className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="mono text-[0.6875rem] text-muted-foreground">
                    {courses.length} entradas
                  </span>
                </div>
                <h3 className="mt-5 flex items-center gap-2 font-serif text-xl text-foreground group-hover:text-primary">
                  Cursos
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  Sigue vacío. Ninguna fuente consultada consigna asignaturas con institución y
                  período, y un curso plausible sobrevive al ejemplo igual que un título.
                </p>
              </Surface>
            </Link>
          </div>
        </Section>
      </section>

      {/* ── Cierre ── */}
      <section data-reveal className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <EvaNote portrait="neutral">
              <p>
                La versión anterior de esta página no afirmaba nada porque no tenía con qué.
                Ahora afirma cuarenta obras, y sigue sin afirmar qué sostiene ninguna de
                ellas: eso exige leerlas. La diferencia entre un catálogo y una biografía es
                que el catálogo sabe dónde termina.
              </p>
            </EvaNote>

            <Surface className="p-6">
              <p className="meta mb-4">Naturaleza de esta página</p>
              <p className="mono text-[0.6875rem] uppercase tracking-widest text-warning">
                Prototipo académico experimental
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                No representa a la PUCV ni a su Escuela de Derecho, y no habla en nombre del
                profesor Eduardo Aldunate Lizana. Se construyó a partir de fuentes públicas,
                sin su participación.
              </p>
            </Surface>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[0.8125rem] text-muted-foreground">{label}</dt>
      <dd className="mono text-[0.8125rem] text-foreground">{value}</dd>
    </div>
  );
}
