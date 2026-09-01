'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

import { corpusStats, profile } from '@/data/aldunate';
import { portrait } from '@/data/aldunate/portrait';
import { cn } from '@/lib/utils';

/**
 * El campo WebGL se carga aparte y sin SSR. `three` pesa lo suyo: no entra en
 * el bundle inicial de la ruta ni se ejecuta en el servidor.
 */
const ConstitutionalField = dynamic(() => import('./ConstitutionalField'), {
  ssr: false,
});

/**
 * Hero del perfil.
 *
 * El retrato no es una ilustración al costado del texto: es la entrada humana
 * al archivo. Se mueve con el cursor lo justo para parecer presente —4 px la
 * imagen, 14 px el campo que tiene detrás— y nunca se deforma. Ningún filtro
 * toca la cara: escalar o distorsionar el rostro de una persona real que no
 * encargó esta página sería exactamente el gesto que el proyecto evita.
 *
 * Debajo del retrato, una línea declara qué es la imagen. No es letra chica
 * defensiva: es un dato del contenido.
 */
export function PortraitHero() {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    // El parallax es de puntero fino. En táctil no aporta nada y el `hover`
    // fantasma de iOS lo deja pegado en la última posición tocada.
    if (!window.matchMedia?.('(pointer: fine)').matches) return;

    // El parallax existe: se avisa al compositor. Se hace aquí y no en el
    // render para no disparar un segundo render solo por una clase.
    frame.style.willChange = 'transform';

    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function onMove(event: PointerEvent) {
      const rect = frame!.getBoundingClientRect();
      target.x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      target.y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    }

    function tick() {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      // 4 px de recorrido máximo. Suficiente para leerse como profundidad,
      // insuficiente para que el rostro parezca flotar.
      frame!.style.setProperty('--px', `${(current.x * 4).toFixed(2)}px`);
      frame!.style.setProperty('--py', `${(current.y * 4).toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      data-hero
      className="relative isolate overflow-hidden border-b border-border/70"
    >
      {/* El campo de conceptos vive detrás de todo, en su propia capa. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <ConstitutionalField />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-28">
        {/* ── Columna editorial ── */}
        <div
          className="order-2 lg:order-1"
          style={{ opacity: 'calc(1 - var(--hero-p, 0) * 0.75)' }}
        >
          <p className="mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
            01 — Perfil
          </p>

          <h1 className="mt-5 font-serif text-[clamp(2.4rem,7vw,4.25rem)] leading-[0.98] tracking-tight text-foreground">
            Eduardo
            <br />
            Aldunate
          </h1>

          <p className="mono mt-5 text-[0.75rem] uppercase tracking-[0.18em] text-primary">
            {profile.field}
          </p>

          <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
            {profile.intro}
          </p>

          {/* Cifras derivadas del catálogo. Ninguna escrita a mano. */}
          <dl className="mt-9 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70">
            <Figure label="Obras" value={String(corpusStats.total)} count={corpusStats.total} />
            <Figure
              label="Años"
              value={`${corpusStats.span.from}—${corpusStats.span.to}`}
            />
            <Figure
              label="Conceptos"
              value={String(corpusStats.concepts)}
              count={corpusStats.concepts}
            />
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <HeroLink href="#pensamiento" primary>
              Explorar su pensamiento
            </HeroLink>
            <HeroLink href="#publicaciones">
              <BookOpen className="h-4 w-4" aria-hidden />
              Ver el catálogo
            </HeroLink>
          </div>
        </div>

        {/* ── Retrato ── */}
        <figure className="order-1 lg:order-2">
          <div
            ref={frameRef}
            className="group relative mx-auto w-full max-w-[19rem] sm:max-w-[21rem] lg:max-w-none"
            style={{
              // Cursor y scroll componen en la misma propiedad: dos capas de
              // movimiento, una sola transformación, cero maquetación.
              transform:
                'translate3d(var(--px, 0), var(--py, 0), 0) scale(calc(1 - var(--hero-p, 0) * 0.07))',
              transformOrigin: '50% 35%',
            }}
          >
            {/* Halo. Se mueve con el grupo, un poco más que la imagen. */}
            <div
              aria-hidden
              className="interactive-only absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(60% 55% at 60% 30%, var(--halo-1), transparent 70%)',
              }}
            />

            <div className="relative overflow-hidden rounded-xl border border-border/80 bg-muted">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                width={portrait.width}
                height={portrait.height}
                placeholder="blur"
                blurDataURL={portrait.blurDataURL}
                // Es el LCP de la ruta: se pide primero, no se difiere.
                priority
                sizes="(max-width: 1023px) 84vw, 38vw"
                className="h-auto w-full"
              />

              {/* Marco fino que se enciende al acercarse. Sin tocar el rostro. */}
              <div
                aria-hidden
                className="interactive-only pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/0 transition-[box-shadow,--tw-ring-color] duration-500 group-hover:ring-primary/25"
              />
            </div>
          </div>

          <figcaption className="mono mx-auto mt-3 max-w-[19rem] text-[0.625rem] uppercase leading-relaxed tracking-wider text-muted-foreground sm:max-w-[21rem] lg:max-w-none">
            {portrait.credit}
          </figcaption>
        </figure>
      </div>

      <p
        className="mono interactive-only pb-8 text-center text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground/70"
        style={{ opacity: 'calc(1 - var(--hero-p, 0) * 4)' }}
      >
        ↓ Sigue bajando
      </p>
    </header>
  );
}

function Figure({ label, value, count }: { label: string; value: string; count?: number }) {
  return (
    <div className="bg-background px-4 py-4">
      {/*
        El valor va escrito en el HTML servido. `data-count` solo pide que se
        anime al entrar; si el script no corre, la cifra ya está ahí.
      */}
      <dd
        className="font-serif text-[1.375rem] leading-none text-foreground tabular-nums"
        data-count={count}
      >
        {value}
      </dd>
      <dt className="mono mt-2 text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
    </div>
  );
}

/**
 * Enlace del hero. Sin rebote: subrayado que corre y una flecha que avanza
 * 2 px. El encargo pedía micro-magnetismo; un botón que salta compite con la
 * lectura, que es lo que la prioridad 9 del repositorio manda evitar.
 */
function HeroLink({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group/link inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium',
        'transition-colors duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        primary
          ? 'border-primary bg-primary text-primary-foreground hover:opacity-90'
          : 'border-border text-foreground hover:border-primary/60 hover:text-primary',
      )}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
