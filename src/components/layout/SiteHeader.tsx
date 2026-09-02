'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { primaryNav, secondaryNav, site } from '@/data/site';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ReadingModeToggle } from '@/components/layout/ReadingModeToggle';
import { cn } from '@/lib/utils';

/**
 * Header compacto. Tres entradas primarias y dos secundarias con menos peso:
 * la navegación es una decisión de producto, no un índice de todo lo que
 * existe. Y lo secundario existe, que no es lo mismo que estar escondido.
 *
 * ── Qué cambió con la capa espacial ──
 *
 * **El menú de hamburguesa se fue.** En pantallas estrechas la navegación es
 * ahora `<TabBar>`, la barra inferior: las mismas cinco secciones, visibles
 * sin abrir nada y al alcance del pulgar. Mantener las dos habría sido pedir
 * al lector que eligiera entre dos navegaciones para el mismo sitio. Lo que se
 * pierde son las pistas de una línea que el menú mostraba bajo cada entrada;
 * siguen estando en las tarjetas de la portada, que es donde se decide entrar.
 *
 * **La barra es de vidrio, y sólo cuando hace falta.** Arriba del todo es
 * transparente y no hay nada que separar; en cuanto el contenido empieza a
 * pasar por debajo aparece el material, que es lo que evita que el texto se
 * lea a través de la cabecera. Es el mismo criterio de iOS: el material
 * responde al contenido, no está siempre.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'no-print sticky top-0 z-30 transition-colors duration-300',
        scrolled
          ? 'glass rounded-none border-x-0 border-t-0'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        <Link
          href="/"
          data-press
          className="group flex shrink-0 items-baseline gap-2"
          aria-label={`${site.shortName} — inicio`}
        >
          <span className="font-serif text-lg font-medium tracking-tight text-foreground">
            {site.shortName}
          </span>
          <span className="mono hidden text-[0.625rem] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary sm:inline">
            Exp·02
          </span>
        </Link>

        {/*
          Las secundarias también viven aquí, separadas por una regla vertical y
          con menos peso. Estaban sólo en el menú móvil, así que en un portátil
          la capa de investigación —veinticuatro fuentes— no existía en la
          navegación.
        */}
        <nav aria-label="Navegación principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-press
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'ui relative rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground',
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-px bg-primary"
                      aria-hidden
                    />
                  )}
                </Link>
              </li>
            ))}

            <li aria-hidden className="mx-2 h-4 w-px shrink-0 bg-border" />

            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-press
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'ui relative rounded-lg px-3 py-2 text-[0.8125rem] transition-colors',
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground',
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-px bg-primary"
                      aria-hidden
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ReadingModeToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
