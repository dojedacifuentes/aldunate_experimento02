'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BellOff, X } from 'lucide-react';
import { eva } from '@/data/eva';
import { EvaPortrait } from './EvaPortrait';
import { evaWelcome, useEvaContext } from './EvaProvider';
import { cn } from '@/lib/utils';

/**
 * EVA en pantalla: un botón discreto y un panel lateral.
 *
 * El panel no bloquea la navegación —no hay overlay ni foco atrapado— porque
 * EVA orienta, no interrumpe. Se cierra con Escape, con el botón, o solo al
 * cambiar de sección.
 */
export function EvaGuide() {
  const { message, open, muted, greeting, openPanel, closePanel, toggleMuted } =
    useEvaContext();
  const reduced = useReducedMotion();

  if (muted) return <EvaMutedPill onRestore={toggleMuted} />;

  const content = greeting
    ? {
        title: evaWelcome.title,
        body: evaWelcome.body,
        portrait: evaWelcome.portrait,
        caveat: undefined as string | undefined,
        action: undefined as { label: string; href: string } | undefined,
      }
    : message
      ? {
          title: message.title,
          body: message.body,
          portrait: message.portrait,
          caveat: message.caveat,
          action: message.action,
        }
      : null;

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  return (
    <>
      {/* Lanzador. Siempre disponible, nunca sobre el contenido principal. */}
      <div className="no-print fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {!open && (
            <motion.button
              type="button"
              onClick={openPanel}
              initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.9 }}
              aria-label="Abrir la guía de EVA"
              className={cn(
                'surface surface-interactive flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4',
                'text-left transition-colors hover:border-primary/50',
              )}
            >
              <EvaPortrait portrait="neutral" size="sm" />
              <span className="flex flex-col leading-tight">
                <span className="mono text-[0.6875rem] font-semibold uppercase tracking-widest text-primary">
                  EVA
                </span>
                <span className="text-[0.6875rem] text-muted-foreground">Guía</span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Panel contextual. */}
      <AnimatePresence>
        {open && content && (
          <motion.aside
            {...slide}
            transition={{ duration: reduced ? 0.15 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="complementary"
            aria-label="Guía EVA"
            className={cn(
              'no-print fixed bottom-4 right-4 z-40 w-[min(24rem,calc(100vw-2rem))]',
              // En pantallas cortas el panel deja de crecer y desplaza su cuerpo:
              // una guía que tapa la página deja de ser una guía.
              'flex max-h-[min(32rem,calc(100vh-6rem))] flex-col overflow-hidden',
              'surface rounded-xl sm:bottom-6 sm:right-6',
            )}
          >
            <div className="flex shrink-0 items-start gap-3 border-b border-border/70 p-4">
              <EvaPortrait portrait={content.portrait} size="md" priority />
              <div className="min-w-0 flex-1">
                <p className="mono text-[0.6875rem] font-semibold uppercase tracking-widest text-primary">
                  {eva.name}
                </p>
                <p className="mt-0.5 text-[0.6875rem] italic leading-snug text-muted-foreground">
                  {eva.role}
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Cerrar la guía"
                className="-mr-1 -mt-1 rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              <h2 className="font-sans text-sm font-semibold text-foreground">
                {content.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{content.body}</p>

              {content.caveat && (
                <p className="rounded-md border-l-2 border-l-warning bg-warning/[0.07] px-3 py-2 text-[0.8125rem] leading-relaxed text-foreground/80">
                  {content.caveat}
                </p>
              )}

              {content.action && (
                <Link
                  href={content.action.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {content.action.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/70 px-4 py-2.5">
              <p className="text-[0.6875rem] leading-snug text-muted-foreground">
                Personaje digital experimental.
              </p>
              <button
                type="button"
                onClick={toggleMuted}
                className="mono inline-flex shrink-0 items-center gap-1.5 rounded px-1.5 py-1 text-[0.625rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                <BellOff className="h-3 w-3" aria-hidden />
                Silenciar
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/** Cuando EVA está silenciada queda esto: una salida, no un botón de ayuda. */
function EvaMutedPill({ onRestore }: { onRestore: () => void }) {
  return (
    <div className="no-print fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={onRestore}
        aria-label="Reactivar la guía de EVA"
        className="mono rounded-full border border-border bg-card/80 px-3 py-1.5 text-[0.625rem] uppercase tracking-widest text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
      >
        Activar EVA
      </button>
    </div>
  );
}
