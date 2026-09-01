import Link from 'next/link';
import { disclaimer, footerNav, site } from '@/data/site';
import { eva } from '@/data/eva';

/**
 * Footer. Orienta y cierra.
 *
 * Eran tres columnas con once enlaces, el descargo largo, un aviso sobre el
 * escudo, el año, la versión y la firma de EVA: un segundo índice del sitio.
 * Ahora son cinco secciones en una fila, el descargo —que es obligatorio— y la
 * versión.
 *
 * No lleva escudo. Mientras no exista autorización, ninguna pantalla muestra
 * signos institucionales: un descargo bajo un escudo se lee como nota al pie,
 * no como negación. Ver `docs/DECISIONS.md` D-033.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-auto border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="font-serif text-lg text-foreground">Experimento 02</p>

          <nav aria-label="Secciones del sitio" className="min-w-0">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {footerNav.map((link) => (
                <li key={link.href}>
                  {/* `min-h-6`: 24 px de objetivo táctil, WCAG 2.2 AA 2.5.8. */}
                  <Link
                    href={link.href}
                    className="inline-flex min-h-6 items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 space-y-4 border-t border-border/70 pt-6">
          {/* Regla dura: este párrafo no se acorta ni se pliega. */}
          <p className="max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground">
            <span className="mono uppercase tracking-widest text-warning">
              {disclaimer.short}
            </span>
            {' — '}
            {disclaimer.long}
          </p>

          <div className="flex flex-col gap-2 text-[0.75rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="mono uppercase tracking-widest">
              {year} · v{site.version}
            </p>
            <p>
              <span className="text-foreground/70">{eva.name}</span> — {eva.role}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
