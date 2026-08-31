'use client';

/**
 * components/rpg/CharacterPortrait.tsx
 *
 * Retrato de diálogo. Recibe `id` y `mood`; **el retrato cambia solo al cambiar
 * el mood**, que es el requisito central del sistema de expresiones.
 *
 * El cruce entre expresiones es un fundido muy corto sobre dos capas: cortar en
 * seco delata que son imágenes distintas, y una transición larga convierte una
 * conversación en un pase de diapositivas. 130 ms basta para que se lea como un
 * cambio de gesto.
 */

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { getCharacter, resolveMood } from '@/data/rpg/characters';
import { useArtManifest } from '@/hooks/rpg/useArtManifest';
import { usePrefersReducedMotion } from '@/hooks/rpg/useSpriteAnimation';
import { portraitUrl } from '@/lib/rpg/characterArt';
import type { CharacterId, EvaMood } from '@/types/rpg';

const CROSSFADE_MS = 130;

export interface CharacterPortraitProps {
  id: CharacterId;
  mood?: EvaMood;
  /** Lado en px. El PNG es de 512; aquí se muestra al tamaño que haga falta. */
  size?: number;
  /** Espeja el retrato: útil cuando el hablante está a la derecha del cuadro. */
  flip?: boolean;
  className?: string;
  /** Atenúa al personaje que no tiene la palabra. */
  dimmed?: boolean;
}

function CharacterPortraitImpl({
  id,
  mood,
  size = 160,
  flip = false,
  className,
  dimmed = false,
}: CharacterPortraitProps) {
  const def = getCharacter(id);
  const baked = useArtManifest();
  const reduced = usePrefersReducedMotion();

  // El mood se resuelve contra las expresiones DECLARADAS del personaje: pedir
  // `angry` a un NPC que sólo tiene `neutral` degrada, no rompe.
  const effective = resolveMood(id, mood);
  const url = useMemo(() => portraitUrl(id, effective, baked), [id, effective, baked]);

  /** Capa que sale, para cruzar el fundido. */
  const [outgoing, setOutgoing] = useState<string | null>(null);
  /** Arranca en 0 y sube a 1 en el fotograma siguiente: eso dispara la transición. */
  const [entered, setEntered] = useState(true);
  const lastUrl = useRef(url);

  useEffect(() => {
    if (url === lastUrl.current) return;
    const previous = lastUrl.current;
    lastUrl.current = url;

    if (reduced || !previous) {
      setOutgoing(null);
      setEntered(true);
      return;
    }

    setOutgoing(previous);
    setEntered(false);
    const raf = requestAnimationFrame(() => setEntered(true));
    const timer = setTimeout(() => setOutgoing(null), CROSSFADE_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [url, reduced]);

  const box: CSSProperties = {
    position: 'relative',
    width: size,
    height: size,
    opacity: dimmed ? 0.45 : 1,
    transition: reduced ? undefined : 'opacity 180ms ease',
    transform: flip ? 'scaleX(-1)' : undefined,
  };

  const layer: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    imageRendering: 'pixelated',
    objectFit: 'contain',
  };

  return (
    <div className={className} style={box}>
      {outgoing ? <img src={outgoing} alt="" aria-hidden style={layer} /> : null}
      <img
        src={url}
        alt={`${def.name}, expresión ${effective}`}
        style={{
          ...layer,
          opacity: entered ? 1 : 0,
          transition: reduced ? undefined : `opacity ${CROSSFADE_MS}ms linear`,
        }}
      />
    </div>
  );
}

export const CharacterPortrait = memo(CharacterPortraitImpl);
export default CharacterPortrait;
