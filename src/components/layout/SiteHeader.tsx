'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { primaryNav, secondaryNav, site } from '@/data/site';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { cn } from '@/lib/utils';

/**
 * Header compacto. Tres entradas primarias y dos secundarias con menos peso:
 * la navegación es una decisión de producto, no un índice de todo lo que
 * existe. Y lo secundario existe, que no es lo mismo que estar escondido.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = openPathname === pathname;

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
        'no-print sticky top-0 z-30 border-b transition-colors duration-300',
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        <Link
          href="/"
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
                  onClick={() => setOpenPathname(null)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-sm transition-colors',
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
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
                  onClick={() => setOpenPathname(null)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-[0.8125rem] transition-colors',
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
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
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpenPathname(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Menú móvil: mismas cuatro puertas, con la pista de qué hay detrás. */}
      {open && (
        <nav
          id="menu-movil"
          aria-label="Navegación principal (móvil)"
          className="border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
        >
          <ul className="mx-auto w-full max-w-6xl divide-y divide-border/60 px-5 py-2 sm:px-8">
            {[...primaryNav, ...secondaryNav].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="flex items-start gap-3 py-3.5"
                >
                  <span className="mono mt-0.5 text-[0.625rem] text-primary">{item.code}</span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-[0.9375rem]',
                        isActive(item.href) ? 'text-foreground' : 'text-foreground/85',
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-muted-foreground">
                      {item.hint}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
