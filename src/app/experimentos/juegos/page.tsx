import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Container, Notice, PendingBlock, Section } from '@/components/common/ui';
import { ExperimentCard } from '@/components/common/ExperimentCard';
import { EvaNote } from '@/components/eva/EvaNote';
import { experiments } from '@/data/experiments';

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

      <Section>
        <Notice tone="signal" className="max-w-3xl">
          Sección en construcción. <strong>La Ley de los Audaces</strong> tiene
          su Capítulo 0 jugable —un prototipo de tres a cinco minutos, no un
          juego terminado— con el código, el arte y la documentación dentro de
          este repositorio, para poder auditarlo y continuarlo. Lex Note todavía
          es una idea.
        </Notice>
      </Section>

      <Section eyebrow="Estado" title="Las dos piezas">
        <ul className="grid gap-4 md:grid-cols-2">
          {family.map((exp) => (
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
