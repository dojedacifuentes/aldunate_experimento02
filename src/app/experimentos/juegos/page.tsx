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
    'La Ley de los Audaces y Lex Note: piezas sobre decisión normativa bajo presión y lectura anotada con trazabilidad.',
};

/**
 * Juegos.
 *
 * Ninguna pieza está construida todavía. La página lo dice en la primera línea
 * en vez de simular actividad: un hub con maquetas vacías promete más que un
 * hub que declara su estado.
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
            Piezas sobre decisión normativa bajo presión y sobre lectura anotada
            con trazabilidad. Dos ideas en diseño, ninguna jugable todavía.
          </p>
        </Container>
      </header>

      <Section>
        <Notice tone="signal" className="max-w-3xl">
          Esta sección está en diseño. Las fichas siguientes describen qué se
          quiere construir y con qué criterio, no algo que ya funcione.
        </Notice>
      </Section>

      <Section eyebrow="En diseño" title="Las dos piezas">
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
            label="La Ley de los Audaces · mecánica"
            detail="Falta definir el modelo de consecuencias diferidas: cuántos turnos median entre una decisión y su efecto, y cómo se le muestra al jugador la relación causal sin arruinar el punto del juego, que es precisamente que no se ve."
          />
          <PendingBlock
            label="La Ley de los Audaces · contenido"
            detail="Escenarios normativos de demostración, rotulados como tales. No se usarán casos reales: un caso real convertido en juego se cita después como si fuera análisis."
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
              Se decide rápido y con información incompleta; los efectos aparecen
              varias jugadas después, cuando ya nadie recuerda quién los causó.
              Cualquier parecido con la realidad legislativa es estructural, no
              anecdótico.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}
