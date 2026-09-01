import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Tone } from '@/types';

/* ────────────────────────────── Superficie ────────────────────────────── */

export function Surface({
  className,
  interactive = false,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'surface rounded-lg',
        interactive && 'surface-interactive',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────── Tonos ────────────────────────────── */

export type { Tone };

/**
 * Clases por tono. Se escriben completas —sin interpolación— porque Tailwind
 * extrae las clases del código fuente y una clase construida en runtime nunca
 * llega a la hoja de estilos.
 */
const toneClasses: Record<Tone, string> = {
  muted: 'text-muted-foreground border-border bg-muted/60',
  signal: 'text-signal border-signal/35 bg-signal/10',
  success: 'text-success border-success/35 bg-success/10',
  warning: 'text-warning border-warning/35 bg-warning/10',
  danger: 'text-danger border-danger/35 bg-danger/10',
  accent: 'text-accent border-accent/35 bg-accent/10',
};

const dotClasses: Record<Tone, string> = {
  muted: 'bg-muted-foreground',
  signal: 'bg-signal',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  accent: 'bg-accent',
};

export function Badge({
  tone = 'muted',
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'text-[0.6875rem] font-medium uppercase tracking-wider',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} aria-hidden />}
      {children}
    </span>
  );
}

/* ────────────────────────────── Botones ────────────────────────────── */

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ' +
  'transition-colors disabled:pointer-events-none disabled:opacity-50';

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  outline: 'border border-border bg-transparent text-foreground hover:border-primary/60 hover:text-primary',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  accent: 'bg-accent text-accent-foreground hover:opacity-90',
} as const;

const buttonSizes = {
  sm: 'h-8 px-3 text-[0.8125rem]',
  md: 'h-10 px-4',
  lg: 'h-11 px-6',
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...rest}
    />
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  external = false,
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/* ────────────────────────────── Estructura de página ────────────────────────────── */

export function Container({
  className,
  children,
  width = 'default',
}: {
  className?: string;
  children: React.ReactNode;
  width?: 'default' | 'wide' | 'prose';
}) {
  const widths = {
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    prose: 'max-w-3xl',
  };
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8', widths[width], className)}>{children}</div>
  );
}

export function PageHeader({
  code,
  title,
  lede,
  children,
}: {
  code?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border/70 py-12 sm:py-16">
      <Container>
        {code && <p className="meta mb-4 text-primary">{code}</p>}
        <h1 className="max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lede}
          </p>
        )}
        {children && <div className="mt-7">{children}</div>}
      </Container>
    </header>
  );
}

export function Section({
  title,
  eyebrow,
  description,
  className,
  children,
}: {
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn('py-12 sm:py-16', className)}>
      <Container>
        {(eyebrow || title || description) && (
          <div className="mb-8 max-w-2xl">
            {eyebrow && <p className="meta mb-3 text-primary">{eyebrow}</p>}
            {title && <h2 className="text-2xl sm:text-3xl">{title}</h2>}
            {description && (
              <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

/* ────────────────────────────── Huecos declarados ────────────────────────────── */

/**
 * Marca de contenido ausente. Existe para que un vacío se lea como decisión y
 * no como descuido — y para que nadie sienta la tentación de rellenarlo.
 */
export function PendingBlock({
  label,
  detail,
  className,
}: {
  label: string;
  detail: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-border bg-muted/40 p-5',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mono mt-0.5 shrink-0 rounded border border-border px-1.5 py-0.5 text-[0.625rem] uppercase tracking-widest text-muted-foreground">
          Pendiente
        </span>
        <div className="min-w-0">
          <h3 className="font-sans text-sm font-semibold text-foreground">{label}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{detail}</p>
        </div>
      </div>
    </div>
  );
}

/** Aviso operativo breve, para límites y advertencias de lectura. */
export function Notice({
  tone = 'muted',
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-md border-l-2 px-4 py-3 text-sm leading-relaxed',
        tone === 'signal' && 'border-l-signal bg-signal/[0.07] text-foreground/85',
        tone === 'warning' && 'border-l-warning bg-warning/[0.07] text-foreground/85',
        tone === 'accent' && 'border-l-accent bg-accent/[0.07] text-foreground/85',
        tone === 'danger' && 'border-l-danger bg-danger/[0.07] text-foreground/85',
        tone === 'success' && 'border-l-success bg-success/[0.07] text-foreground/85',
        tone === 'muted' && 'border-l-border bg-muted/50 text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Par etiqueta/valor en clave de ficha técnica. */
export function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/60 py-3 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="meta shrink-0 sm:w-44">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground/90">{value}</dd>
    </div>
  );
}

/* ────────────────────────────── Profundidad bajo demanda ────────────────────────────── */

/**
 * Sección plegable.
 *
 * `<details>` nativo y no un acordeón a medida: llega accesible de fábrica
 * —foco, teclado, `aria-expanded` implícito—, funciona sin JavaScript y
 * responde a `Ctrl+F` en los navegadores que buscan dentro de detalles
 * cerrados. Un acordeón propio habría necesitado cuarenta líneas de ARIA para
 * empatar.
 *
 * Sirve para bajar a segunda capa lo que no todo lector necesita: esquemas,
 * campos técnicos, listas largas de limitaciones. Lo que se pliega no
 * desaparece; deja de imponerse.
 */
export function Disclosure({
  summary,
  hint,
  defaultOpen = false,
  className,
  children,
}: {
  summary: string;
  hint?: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn('group rounded-lg border border-border bg-card/40', className)}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-3 rounded-lg px-5 py-4',
          'text-sm font-medium text-foreground transition-colors hover:text-primary',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <span
          aria-hidden
          className="mono shrink-0 text-[0.75rem] text-primary transition-transform group-open:rotate-90"
        >
          ▸
        </span>
        <span className="min-w-0 flex-1">{summary}</span>
        {hint && (
          <span className="mono shrink-0 text-[0.6875rem] text-muted-foreground">{hint}</span>
        )}
      </summary>
      <div className="border-t border-border/60 px-5 py-4">{children}</div>
    </details>
  );
}

/* ────────────────────────────── Ruta ────────────────────────────── */

export interface Crumb {
  label: string;
  /** El último tramo no lleva enlace: es dónde está el lector, no adónde va. */
  href?: string;
}

/**
 * Migas de pan. Sólo donde la profundidad lo justifica —tercer nivel o
 * detalle dentro de un catálogo—; en una ruta de primer nivel son ruido.
 *
 * Pesan visualmente menos que el H1 a propósito: orientan, no compiten.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Ruta de navegación" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className="mono text-[0.6875rem] uppercase tracking-widest text-foreground/70"
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className="text-[0.6875rem] text-muted-foreground/50">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
