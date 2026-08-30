import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Container, Notice, Section } from '@/components/common/ui';
import { ExperimentCard } from '@/components/common/ExperimentCard';
import { AmbiguityLab } from '@/components/experiments/AmbiguityLab';
import { RuleFollowingLab } from '@/components/experiments/RuleFollowingLab';
import { EvaNote } from '@/components/eva/EvaNote';
import { experiments } from '@/data/experiments';

export const metadata: Metadata = {
  title: 'Gramatiquerías',
  description:
    'Ambigüedad sintáctica en textos normativos: una misma oración, dos lecturas legítimas, consecuencias jurídicas distintas.',
};

/**
 * Gramatiquerías.
 *
 * La pieza central es un ejercicio funcional de ambigüedad sintáctica; el
 * resto de la familia figura con su estado real. Preferimos un experimento que
 * funciona y tres declarados como ideas, a cuatro maquetas que no hacen nada.
 */
export default function GramatiqueriasPage() {
  const family = experiments.filter(
    (e) => e.family === 'gramatiquerias' || e.family === 'lectura',
  );
  // Las dos piezas construidas ya tienen su sección propia arriba.
  const pending = family.filter((e) => !['gramatiquerias', 'wittgenstein'].includes(e.id));

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
            Gramatiquerías
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-lg italic text-muted-foreground">
            La coma que decide el caso
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            El lenguaje no es el envase de la norma: es la norma. Estos
            ejercicios muestran oraciones normativas con más de un análisis
            gramatical válido, donde elegir una lectura ya es decidir el caso.
          </p>
        </Container>
      </header>

      <Section>
        <Notice tone="warning" className="max-w-3xl">
          Las oraciones de esta página son material de demostración, construido
          para ilustrar el mecanismo. No corresponden a normas vigentes ni deben
          citarse como tales.
        </Notice>
      </Section>

      <Section
        eyebrow="Ejercicio 01"
        title="Dos lecturas, una oración"
        description="Cambie la lectura y observe cómo se reorganiza el análisis y qué consecuencia arrastra. Ninguna de las dos es un error gramatical."
      >
        <AmbiguityLab />
      </Section>

      <Section
        eyebrow="Ejercicio 02 · Wittgenstein"
        title="¿Qué regla estás siguiendo?"
        description="Una disposición de tres palabras y ocho objetos. Clasifique bajo un propósito, cambie el propósito y vuelva a clasificar lo mismo. El texto no cambia en ningún momento."
      >
        <RuleFollowingLab />
      </Section>

      <Section
        eyebrow="Misma familia"
        title="Piezas relacionadas"
        description="Wittgenstein, Borges y Eco: tres formas distintas de preguntar hasta dónde llega una interpretación."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {pending.map((exp) => (
            <li key={exp.id}>
              <ExperimentCard experiment={exp} />
            </li>
          ))}
        </ul>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <EvaNote portrait="lifestyle" className="max-w-3xl">
            <p>
              Si alguna vez sospechó que el Derecho es filosofía del lenguaje con
              toga, esta sección no lo va a tranquilizar. Dos análisis
              gramaticalmente impecables, dos resultados incompatibles, y alguien
              tiene que firmar uno.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}
