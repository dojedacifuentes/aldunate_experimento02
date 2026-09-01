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
 * apilarse: cinco anclas apiladas ocuparían media pantalla.
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
      className="interactive-only sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-5 py-2.5 sm:px-8">
        <span className="mono mr-3 shrink-0 text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
          Aldunate
        </span>

        {sections.map((section, i) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active === section.id ? 'true' : undefined}
            className={cn(
              'relative shrink-0 rounded px-3 py-1.5 text-[0.8125rem] transition-colors',
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
