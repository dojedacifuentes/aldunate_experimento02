'use client';

/**
 * hooks/rpg/useSpriteAnimation.ts
 *
 * Avanza el fotograma de un clip. Nada más: no dibuja, no conoce el personaje
 * ni la hoja. Devuelve un índice de paso, y quien lo use decide qué recortar.
 *
 * Dos reglas que vienen del MASTER_PROMPT y no son negociables:
 *
 *   - `prefers-reduced-motion` congela la animación en su primer fotograma. Un
 *     RPG de oficina no necesita moverse para funcionar.
 *   - Un solo `requestAnimationFrame` compartido por todos los sprites. Con un
 *     `setInterval` por NPC, veinte personajes en pantalla son veinte timers
 *     desincronizados y un perfil de rendimiento lamentable.
 */

import { useEffect, useMemo, useRef, useState } from 'react';

import type { AnimationClip } from '@/types/rpg';

// ---------------------------------------------------------------------------
// Reloj compartido
// ---------------------------------------------------------------------------

type Tick = (now: number) => void;

const subscribers = new Set<Tick>();
let rafId: number | null = null;

function pump(now: number) {
  for (const fn of subscribers) fn(now);
  rafId = subscribers.size > 0 ? requestAnimationFrame(pump) : null;
}

function subscribe(fn: Tick): () => void {
  subscribers.add(fn);
  if (rafId === null) rafId = requestAnimationFrame(pump);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

// ---------------------------------------------------------------------------
// Movimiento reducido
// ---------------------------------------------------------------------------

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface SpriteAnimationOptions {
  /** Pausa la animación sin desmontarla (NPC sentado, diálogo en curso). */
  paused?: boolean;
  /**
   * Desfase inicial en ms. Sin esto, todos los NPC ambientales parpadean al
   * unísono y la oficina parece un coro, no un sitio con gente.
   */
  offset?: number;
}

/**
 * @returns índice del paso actual dentro de `clip.frames`
 */
export function useSpriteAnimation(
  clip: AnimationClip | null | undefined,
  { paused = false, offset = 0 }: SpriteAnimationOptions = {},
): number {
  const [step, setStep] = useState(0);
  const reduced = usePrefersReducedMotion();
  const stepRef = useRef(0);

  const fps = clip?.fps ?? 0;
  const count = clip?.frames.length ?? 1;
  const loop = clip?.loop ?? true;

  // Reinicia al cambiar de clip: heredar el paso de la animación anterior hace
  // que un personaje que empieza a andar arranque a mitad de zancada.
  const clipKey = useMemo(
    () => (clip ? `${clip.row}:${clip.frames.join(',')}:${clip.fps}` : 'none'),
    [clip],
  );

  useEffect(() => {
    stepRef.current = 0;
    setStep(0);
  }, [clipKey]);

  useEffect(() => {
    if (!clip || paused || reduced || fps <= 0 || count <= 1) return;
    const period = 1000 / fps;
    return subscribe((now) => {
      const raw = Math.floor((now + offset) / period);
      const next = loop ? raw % count : Math.min(raw, count - 1);
      if (next !== stepRef.current) {
        stepRef.current = next;
        setStep(next);
      }
    });
  }, [clip, clipKey, paused, reduced, fps, count, loop, offset]);

  return step;
}

/**
 * Variante para tiras de fotogramas sueltas (aparición de EVA, idle especial),
 * donde no hay hoja ni clip sino una lista de URLs.
 *
 * @returns índice dentro de la lista, y si ya terminó
 */
export function useFrameSequence(
  length: number,
  fps: number,
  { loop = false, paused = false, offset = 0 }: { loop?: boolean; paused?: boolean; offset?: number } = {},
): { index: number; done: boolean } {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const startRef = useRef<number | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    startRef.current = null;
    indexRef.current = 0;
    setIndex(0);
  }, [length, fps, loop]);

  useEffect(() => {
    if (paused || length <= 1 || fps <= 0) return;
    // Con movimiento reducido, la secuencia salta directa a su estado final:
    // EVA aparece, pero no se materializa a trozos delante de quien lo pidió.
    if (reduced) {
      setIndex(length - 1);
      return;
    }
    const period = 1000 / fps;
    return subscribe((now) => {
      if (startRef.current === null) startRef.current = now - offset;
      const raw = Math.floor((now - startRef.current) / period);
      const next = loop ? raw % length : Math.min(raw, length - 1);
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
      }
    });
  }, [length, fps, loop, paused, reduced, offset]);

  return { index, done: !loop && index >= length - 1 };
}
