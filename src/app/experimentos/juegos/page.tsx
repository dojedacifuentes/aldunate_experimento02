import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, Play } from 'lucide-react';

import {
  Badge,
  ButtonLink,
  Container,
  Notice,
  PendingBlock,
  Section,
  Surface,
} from '@/components/common/ui';
import { ExperimentCard } from '@/components/common/ExperimentCard';
import { EvaNote } from '@/components/eva/EvaNote';
import { experiments } from '@/data/experiments';
import { CHARACTER_IDS, CHARACTERS } from '@/data/rpg/characters';
import { prologo } from '@/data/rpg/chapters/prologo';
import { legalSources } from '@/data/rpg/legalSources';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Juegos',
  description:
    'La Ley de los Audaces, RPG jurídico con su primer capítulo jugable, y Lex Note, lectura anotada con trazabilidad.',
};

/**
 * Juegos.
 *
 * Una pieza tiene su primer capítulo jugable y vive dentro de este repositorio,
 * con su código, su arte y su trazabilidad. La otra sigue en diseño. La página
 * distingue las dos situaciones en vez de aplanarlas.
 */
export default function JuegosPage() {
  const family = experiments.filter((e) => e.family === 'juegos');
  const destacado = family.find((e) => e.jugableEn);
  const rutaJugable = destacado?.jugableEn;
  const resto = family.filter((e) => e !== destacado);

  // Las cifras se calculan del propio contenido del capítulo. Un número escrito
  // a mano en una plantilla envejece mal: dice 13 nodos cuando ya hay 20.
  const nodos = Object.values(prologo.nodos).length;
  const decisiones = Object.values(prologo.nodos).filter((n) => n.kind === 'decision').length;
  const reparto = CHARACTER_IDS.map((id) => CHARACTERS[id]).filter(
    (c) => c.role !== 'ambient',
  ).length;
  const porVerificar = legalSources.filter((f) => f.estado !== 'VERIFIED').length;

  return (
    <>
      <header className="border-b border-border/70 py-12 sm:py-16">
        <Container>
          <Link
            href="/experimentos"
            className="mono inline-flex items-center gap-1.5 text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            Experimentos
          </Link>
          <h1 className="mt-6 max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Juegos
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg italic text-muted-foreground">
            Consecuencias diferidas
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            Piezas sobre decisión jurídica y sobre lectura anotada con
            trazabilidad. Una tiene su primer capítulo jugable; la otra sigue en
            diseño.
          </p>
        </Container>
      </header>

      {/*
        ── Destacado ──
        Lo único jugable de la sección va arriba y entero, no como una ficha
        más de una grilla. Un prototipo que se juega y una idea que no existe
        todavía no son dos elementos del mismo tipo, y la página no los empata.
      */}
      {destacado && rutaJugable && (
        <Section>
          <Surface className="overflow-hidden p-0">
            <div className="border-b border-border/60 px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="success" dot>
                  Capítulo 0 jugable
                </Badge>
                <Badge tone="signal">Prototipo</Badge>
                <Badge tone="warning">Ficción</Badge>
              </div>

              <h2 className="mt-5 font-serif text-2xl leading-snug text-foreground sm:text-3xl">
                {destacado.title}
              </h2>
              <p className="mt-1.5 font-serif text-base italic text-primary">
                {destacado.tagline}
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                {destacado.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href={rutaJugable} size="md">
                  <Play className="h-4 w-4" aria-hidden />
                  Jugar el Capítulo 0
                </ButtonLink>
                <ButtonLink
                  href={`${site.repo}/tree/main/docs/juegos/ley-de-los-audaces`}
                  size="md"
                  variant="outline"
                  external
                >
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Cómo se construyó
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </ButtonLink>
                <span className="mono text-[0.6875rem] text-muted-foreground">
                  3–5 min · teclado 1–5, E o Espacio
                </span>
              </div>
            </div>

            {/* Las cuatro cifras salen del contenido, no de una plantilla. */}
            <dl className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:grid-cols-4 sm:divide-y-0">
              {[
                { label: 'Nodos del capítulo', value: String(nodos) },
                { label: 'Decisiones con consecuencia', value: String(decisiones) },
                { label: 'Personajes con ficha', value: String(reparto) },
                {
                  label: 'Referencias por verificar',
                  value: `${porVerificar} de ${legalSources.length}`,
                },
              ].map((cifra) => (
                <div key={cifra.label} className="px-6 py-5">
                  <dt className="meta">{cifra.label}</dt>
                  <dd className="mono mt-1.5 text-xl text-foreground">{cifra.value}</dd>
                </div>
              ))}
            </dl>
          </Surface>
        </Section>
      )}

      <Section>
        <Notice tone="signal" className="max-w-3xl">
          Sección en construcción. <strong>La Ley de los Audaces</strong> tiene
          su Capítulo 0 jugable —un prototipo de tres a cinco minutos, no un
          juego terminado— con el código, el arte y la documentación dentro de
          este repositorio, para poder auditarlo y continuarlo. Lex Note todavía
          es una idea.
        </Notice>
      </Section>

      <Section
        eyebrow="Estado"
        title="La otra pieza"
        description="Lo que todavía no se puede tocar, dicho como lo que es."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {resto.map((exp) => (
            <li key={exp.id}>
              <ExperimentCard experiment={exp} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Requisitos"
        title="Qué falta antes de construirlas"
        description="Las condiciones que cada pieza tendría que cumplir para dejar de ser una idea."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <PendingBlock
            label="La Ley de los Audaces · validación"
            detail="El Capítulo 0 funciona; falta saber si entretiene. Antes de escribir el capítulo siguiente hay que ver a alguien jugarlo entero sin instrucciones y anotar dónde se aburre."
          />
          <PendingBlock
            label="La Ley de los Audaces · verificación jurídica"
            detail="Las tres referencias normativas del capítulo están rotuladas «por verificar» y así se muestran dentro del juego. Pasan a citarse como Derecho vigente sólo cuando alguien las contraste con el texto oficial y deje la fecha."
          />
          <PendingBlock
            label="Lex Note · modelo de anotación"
            detail="Esquema que vincule cada nota a su fragmento de origen y a un source_id del registro de investigación. Sin ese vínculo es un cuaderno, no una herramienta de trazabilidad."
          />
          <PendingBlock
            label="Lex Note · persistencia"
            detail="Decidir dónde viven las notas. El prototipo no tiene backend; una herramienta de anotación que pierde el trabajo al cerrar la pestaña no sirve para lo que promete."
          />
        </div>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <EvaNote portrait="sunset" className="max-w-3xl">
            <p>
              Una de las dos ya se juega. La otra sigue siendo una idea, y decir
              cuál es cuál es la mitad del trabajo de un laboratorio.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}
