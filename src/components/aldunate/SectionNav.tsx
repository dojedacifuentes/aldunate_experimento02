'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Navegación contextual.
 *
 * Se pega bajo la cabecera y marca la sección en curso. El indicador se
 * desplaza; el scroll sigue siendo nativo. Nada de scroll-jacking: el encargo
 * lo pedía explícitamente y, además, secuestrar la rueda en una página que se
 * lee de arriba abajo es la forma más rápida de que alguien la cierre.
 *
 * En pantallas estrechas la barra se desplaza en horizontal en vez de
 * apilarse: cuatro anclas apiladas ocuparían media pantalla.
 *
 * **El conmutador de modo lectura ya no vive aquí.** Estaba en esta barra, y
 * por tanto sólo existía en `/aldunate`, cuando el CSS que lo aplica siempre
 * fue global. Ahora está en la cabecera del sitio y funciona en las dieciséis
 * rutas; el estado compartido está en `components/layout/reading-mode.ts`.
 * Dejar aquí un segundo botón para el mismo modo habría sido peor que no
 * tener ninguno.
 */

const sections = [
  { id: 'pensamiento', label: 'Ideas' },
  { id: 'publicaciones', label: 'Obras' },
  { id: 'trayectoria', label: 'Tiempo' },
  { id: 'fuentes', label: 'Fuentes' },
] as const;

export function SectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    // El margen inferior grande hace que la sección se marque cuando su inicio
    // entra en el tercio superior, no cuando asoma un píxel por abajo.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Secciones del perfil"
      // La cabecera del sitio ya ocupa 'top-0' con 4rem de alto y z-30. Esta se
      // apoya justo debajo y pasa por detrás: dos barras disputándose el mismo
      // borde superior es el defecto clásico de una navegación de sección.
      className="interactive-only glass sticky top-16 z-20 rounded-none border-x-0 border-t-0"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-5 py-2.5 sm:px-8">
        <span className="mono mr-3 shrink-0 text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
          Aldunate
        </span>

        {sections.map((section, i) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            data-press
            aria-current={active === section.id ? 'true' : undefined}
            className={cn(
              'ui relative shrink-0 rounded-lg px-3 py-1.5 text-[0.8125rem] transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              active === section.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="mono mr-1.5 text-[0.625rem] text-primary/70">
              {String(i + 1).padStart(2, '0')}
            </span>
            {section.label}
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-3 -bottom-[0.7rem] h-px transition-opacity duration-300',
                active === section.id ? 'bg-primary opacity-100' : 'opacity-0',
              )}
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
