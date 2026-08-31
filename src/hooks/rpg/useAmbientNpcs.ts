'use client';

/**
 * hooks/rpg/useAmbientNpcs.ts
 *
 * Rutinas de los NPC de fondo. Cada uno recorre en bucle una lista de pasos
 * (caminar, sentarse, trabajar, esperar, charlar) y el hook devuelve su posición
 * y su animación en cada momento.
 *
 * Criterio de diseño: la oficina tiene que parecer ocupada, no coreografiada.
 * Por eso los pasos se declaran por NPC en la escena y cada uno arranca con un
 * desfase derivado de su clave. Si todos empiezan en el paso 0 en el mismo
 * instante, seis personas se levantan a la vez y el efecto es el contrario del
 * buscado.
 *
 * Lo que este hook NO hace: colisiones, pathfinding ni ocupación de casillas.
 * Los NPC ambientales no bloquean; para los que sí importan al juego hay que
 * gestionarlos desde la lógica de la escena.
 */

import { useEffect, useMemo, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks/rpg/useSpriteAnimation';
import type { AmbientActivity, AmbientNpc, AnimationName, Direction } from '@/types/rpg';

/** Estado observable de un NPC en un instante. */
export interface AmbientNpcState {
  key: string;
  characterId: AmbientNpc['characterId'];
  x: number;
  y: number;
  facing: Direction;
  activity: AmbientActivity;
  animation: AnimationName;
  /** Desfase de animación propio, para no sincronizar el reparto de fondo. */
  offset: number;
}

/** Desfase estable a partir de la clave: mismo NPC, mismo ritmo, siempre. */
function seedOffset(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % 4000;
}

function directionTo(from: { x: number; y: number }, to: { x: number; y: number }): Direction {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'right' : 'left';
  return dy >= 0 ? 'down' : 'up';
}

/** Qué animación corresponde a cada actividad. */
function animationFor(activity: AmbientActivity, facing: Direction): AnimationName {
  switch (activity) {
    case 'walk':
      return `walk_${facing}` as AnimationName;
    case 'chat':
      return 'talk';
    case 'work':
      // Trabajar se lee como "pensar": la persona está quieta, algo se mueve.
      return 'thinking';
    case 'sit':
    case 'wait':
    case 'idle':
    default:
      return `idle_${facing}` as AnimationName;
  }
}

/** Duración total de una rutina. */
function routineLength(npc: AmbientNpc): number {
  return npc.routine.reduce((sum, s) => sum + Math.max(1, s.duration), 0);
}

/**
 * Resuelve el estado de un NPC en un momento dado de su rutina.
 * Es una función pura del tiempo: no acumula deriva y sobrevive a que la
 * pestaña se quede en segundo plano.
 */
function stateAt(npc: AmbientNpc, elapsed: number): AmbientNpcState {
  const total = routineLength(npc);
  const offset = seedOffset(npc.key);
  const t = total > 0 ? (elapsed + offset) % total : 0;

  let acc = 0;
  let x = npc.x;
  let y = npc.y;
  let facing: Direction = npc.facing ?? 'down';
  let activity: AmbientActivity = 'idle';

  for (const step of npc.routine) {
    const duration = Math.max(1, step.duration);
    const from = { x, y };
    const to = step.to ?? from;

    if (t < acc + duration) {
      activity = step.activity;
      if (step.activity === 'walk' && step.to) {
        // Interpolación lineal dentro del tramo: el sprite anda de verdad de un
        // punto a otro en vez de teletransportarse al terminar el paso.
        const k = (t - acc) / duration;
        x = from.x + (to.x - from.x) * k;
        y = from.y + (to.y - from.y) * k;
        facing = directionTo(from, to);
      } else {
        facing = step.facing ?? facing;
      }
      return {
        key: npc.key,
        characterId: npc.characterId,
        x,
        y,
        facing,
        activity,
        animation: animationFor(activity, facing),
        offset,
      };
    }

    // paso ya consumido: adelantamos el estado y seguimos
    if (step.activity === 'walk' && step.to) {
      facing = directionTo(from, to);
      x = to.x;
      y = to.y;
    } else if (step.facing) {
      facing = step.facing;
    }
    acc += duration;
  }

  return {
    key: npc.key,
    characterId: npc.characterId,
    x,
    y,
    facing,
    activity: 'idle',
    animation: animationFor('idle', facing),
    offset,
  };
}

export interface AmbientOptions {
  /** ms entre recálculos. 120 ms basta: el movimiento es lento. */
  tick?: number;
  paused?: boolean;
}

/**
 * @returns estado actual de cada NPC, en el mismo orden que se pasaron
 */
export function useAmbientNpcs(npcs: AmbientNpc[], { tick = 120, paused = false }: AmbientOptions = {}) {
  const reduced = usePrefersReducedMotion();
  const start = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Con movimiento reducido, la oficina se congela en su estado inicial. Sigue
    // habiendo gente sentada y de pie; simplemente no se desplaza nadie.
    if (paused || reduced) return;
    const id = setInterval(() => {
      if (start.current === null) start.current = performance.now();
      setElapsed(performance.now() - start.current);
    }, tick);
    return () => clearInterval(id);
  }, [tick, paused, reduced]);

  return useMemo(() => npcs.map((npc) => stateAt(npc, elapsed)), [npcs, elapsed]);
}

export { stateAt as ambientStateAt, animationFor as ambientAnimationFor };
