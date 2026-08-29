import Link from 'next/link';
import { disclaimer, footerNav, site } from '@/data/site';
import { eva } from '@/data/eva';
import { InstitutionalMark } from './InstitutionalMark';

/**
 * Footer institucional. Aquí vive el aviso de prototipo, en texto plano y sin
 * eufemismos: es la pieza que impide que el sitio se lea como oficial.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print mt-auto border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-5">
            <div>
              <p className="font-serif text-lg text-foreground">{site.subject}</p>
              <p className="mt-1 text-sm text-muted-foreground">{site.tagline}</p>
            </div>

            <InstitutionalMark size={44} withCaption />

            <p className="max-w-sm text-[0.8125rem] leading-relaxed text-muted-foreground">
              {disclaimer.long}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="meta mb-3">{group.title}</h2>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-border/70 pt-6">
          <p className="text-[0.75rem] leading-relaxed text-muted-foreground">
            {disclaimer.logoNotice}
          </p>
          <div className="flex flex-col gap-3 text-[0.75rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p className="mono uppercase tracking-widest">
              {year} · Experimento 02 · v0.1.0
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
