'use client';

/**
 * hooks/rpg/useArtManifest.ts
 *
 * Expone qué assets están horneados de verdad. Mientras no se resuelve —y
 * mientras no exista manifiesto, que es el estado por defecto— devuelve un
 * conjunto vacío, y eso hace que todo se dibuje proceduralmente.
 *
 * Es deliberado que el estado inicial sea "no hay nada horneado": así el camino
 * procedural es el que se ejercita siempre en desarrollo y no puede pudrirse sin
 * que nadie se entere.
 */

import { useEffect, useState } from 'react';

import { loadArtManifest } from '@/lib/rpg/characterArt';

const EMPTY: Set<string> = new Set();

export function useArtManifest(): Set<string> {
  const [baked, setBaked] = useState<Set<string>>(EMPTY);

  useEffect(() => {
    let alive = true;
    loadArtManifest().then((set) => {
      if (alive && set.size > 0) setBaked(set);
    });
    return () => {
      alive = false;
    };
  }, []);

  return baked;
}
