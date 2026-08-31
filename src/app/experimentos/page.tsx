import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Container, Notice, PageHeader, Section, Surface } from '@/components/common/ui';
import { ExperimentCard } from '@/components/common/ExperimentCard';
import { EvaNote } from '@/components/eva/EvaNote';
import { experimentFamilies, experiments } from '@/data/experiments';

export const metadata: Metadata = {
  title: 'Experimentos',
  description:
    'Constitution Lab, Gramatiquerías, juegos y visualizaciones. Prototipos donde una pieza jugable argumenta mejor que un párrafo.',
};

/**
 * Hub de experimentos.
 *
 * Tres familias, ocho piezas. La mayoría son ideas todavía: el catálogo se
 * publica con su estado real en vez de esperar a estar completo.
 */
export default function ExperimentosPage() {
  return (
    <>
      <PageHeader
        code="04 · Experimentos"
        title="Aquí se puede romper cosas"
        lede="Prototipos, juegos y visualizaciones sobre texto normativo, lenguaje e interpretación. Un experimento que se puede tocar discute mejor que un párrafo."
      />

      <Section>
        <Notice tone="warning" className="max-w-3xl">
          <p className="font-medium text-foreground">Sobre el contenido de estos experimentos</p>
          <p className="mt-2 text-muted-foreground">
            Las piezas de esta sección usan material de demostración: textos de
            ejemplo construidos para ilustrar un mecanismo. No corresponden a
            texto normativo vigente ni a datos verificados, y aparecen siempre
            rotulados como tales.
          </p>
        </Notice>
      </Section>

      {/* ── Familias ── */}
      <Section
        eyebrow="Familias"
        title="Tres territorios"
        description="Cada familia agrupa piezas que comparten una pregunta de fondo."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {experimentFamilies.map((family) => {
            // Se cuenta por destino, no por igualdad exacta: desde que una
            // pieza jugable tiene su propia ruta (`/experimentos/juegos/…`),
            // comparar con `===` la dejaba fuera del recuento de su familia.
            const n = experiments.filter((e) => e.href?.startsWith(family.href)).length;
            return (
              <Link key={family.id} href={family.href} className="group">
                <Surface interactive className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl text-foreground group-hover:text-primary">
                      {family.label}
                    </h3>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {family.blurb}
                  </p>
                  <p className="mono mt-auto pt-5 text-[0.6875rem] text-muted-foreground">
                    {n} {n === 1 ? 'pieza' : 'piezas'}
                  </p>
                </Surface>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* ── Catálogo completo ── */}
      <Section
        eyebrow="Catálogo"
        title="Todas las piezas"
        description="Estado real de cada experimento. Las ideas figuran como ideas."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {experiments.map((exp) => (
            <li key={exp.id}>
              {/*
                Una ficha jugable trae su propio botón «Jugar», que ya es un
                enlace. Envolverla además en un enlace de tarjeta anida un <a>
                dentro de otro: HTML inválido que rompe la hidratación de toda
                la página. Cuando la ficha tiene su propia salida, la tarjeta
                deja de ser un enlace.
              */}
              {exp.href && !exp.jugableEn ? (
                <Link href={exp.href} className="block h-full">
                  <ExperimentCard experiment={exp} />
                </Link>
              ) : (
                <ExperimentCard experiment={exp} />
              )}
            </li>
          ))}
        </ul>
      </Section>

      <section className="border-t border-border/70 py-16 sm:py-20">
        <Container>
          <EvaNote portrait="cyberpunk" className="max-w-3xl">
            <p>
              La Constitución todavía no tiene botón de deshacer. Estos
              experimentos sí, y por eso son el lugar adecuado para equivocarse.
              Trabaje con cuidado igualmente: las malas ideas también se
              aprenden.
            </p>
          </EvaNote>
        </Container>
      </section>
    </>
  );
}
