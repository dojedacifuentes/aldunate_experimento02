import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Container, Notice, PendingBlock, Section } from '@/components/common/ui';
import { ConstitutionLab } from '@/components/experiments/ConstitutionLab';
import { EvaNote } from '@/components/eva/EvaNote';

export const metadata: Metadata = {
  title: 'Constitution Lab',
  description:
    'Ama tu Constitución: cambie una palabra en un artículo y observe qué disposiciones dejan de funcionar.',
};

/**
 * Constitution Lab.
 *
 * Pieza funcional: la onda expansiva. El mapa de calor todavía es una idea y
 * figura como tal, con el criterio que tendría que cumplir para existir.
 */
export default function ConstitucionPage() {
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
            Constitution Lab
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg italic text-muted-foreground">
            Ama tu Constitución
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            Un texto normativo es una red, no una lista. La mayoría de las
            propuestas de reforma se discuten como si fuera una lista. Aquí se
            cambia una palabra y se ve qué se cae.
          </p>
        </Container>
      </header>

      <Section>
        <Notice tone="warning" className="max-w-3xl">
          Texto de demostración, construido para ilustrar el mecanismo. No
          corresponde a la Constitución vigente de ninguna jurisdicción ni debe
          citarse como norma.
        </Notice>
      </Section>

      <Section
        eyebrow="Ejercicio"
        title="Onda expansiva"
        description="Cambie el operador deóntico del artículo 11 y observe las cuatro disposiciones que remiten a él. Ninguna cambia de texto; todas cambian de sentido."
      >
        <ConstitutionLab />
      </Section>

      <Section
        eyebrow="En construcción"
        title="Mapa de calor constitucional"
        description="La segunda pieza de esta familia. Todavía no existe, y hay una razón."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <PendingBlock
            label="Mapa de calor de densidad normativa"
            detail="Visualización de qué artículos concentran remisiones, reformas o litigio. Requiere primero un texto normativo segmentado por artículo e inciso, y un criterio publicado sobre qué se está midiendo. Un mapa de calor sin criterio declarado es una mancha de color persuasiva."
          />
          <PendingBlock
            label="Corpus de trabajo"
            detail="Texto normativo estructurado, con remisiones extraídas y verificadas. Sin corpus no hay grafo, y sin grafo el mapa sería una ilustración."
          />
        </div>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <EvaNote portrait="cyberpunk" className="max-w-3xl">
            <p>
              La Constitución todavía no tiene botón de deshacer. Trabaje con
              cuidado. Aquí sí lo tiene, y aun así conviene mirar las cuatro
              disposiciones de abajo antes de decidir que el cambio era menor.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}
