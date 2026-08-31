'use client';

/**
 * components/rpg/CharacterSprite.tsx
 *
 * Un personaje dentro del mapa. Recorta un fotograma de la hoja mediante
 * `background-position`: sin canvas, sin un `<img>` por fotograma y sin volver a
 * pintar nada cuando el sprite no cambia de paso.
 *
 * El componente no sabe si el píxel viene de un PNG horneado o del motor
 * procedural, y no debería llegar a saberlo nunca.
 */

import { memo, useMemo } from 'react';

import { getCharacter } from '@/data/rpg/characters';
import { useArtManifest } from '@/hooks/rpg/useArtManifest';
import { useSpriteAnimation } from '@/hooks/rpg/useSpriteAnimation';
import { animationName, clipFor, frameStyle, spriteSheetUrl } from '@/lib/rpg/characterArt';
import type { AnimationName, CharacterId, Direction } from '@/types/rpg';

export interface CharacterSpriteProps {
  id: CharacterId;
  /** Dirección de la figura. Se ignora si se pasa `animation`. */
  facing?: Direction;
  /** Si camina. Se ignora si se pasa `animation`. */
  moving?: boolean;
  /** Fuerza una animación concreta (`talk`, `thinking`…). */
  animation?: AnimationName;
  /** Multiplicador entero. 2 = 96 px con celdas de 48. */
  scale?: number;
  paused?: boolean;
  /** Desfase de animación, para que no todos vayan al mismo compás. */
  offset?: number;
  className?: string;
  /** Etiqueta accesible. Si se omite, el sprite es decorativo. */
  label?: string;
  onClick?: () => void;
}

function CharacterSpriteImpl({
  id,
  facing = 'down',
  moving = false,
  animation,
  scale = 2,
  paused = false,
  offset = 0,
  className,
  label,
  onClick,
}: CharacterSpriteProps) {
  const def = getCharacter(id);
  const baked = useArtManifest();

  const clip = useMemo(
    () => clipFor(def, animation ?? animationName(facing, moving)),
    [def, animation, facing, moving],
  );

  const step = useSpriteAnimation(clip, { paused, offset });
  const url = useMemo(() => spriteSheetUrl(id, baked), [id, baked]);
  const style = useMemo(() => frameStyle(def, clip, step, url, scale), [def, clip, step, url, scale]);

  const interactive = Boolean(onClick);

  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

export const CharacterSprite = memo(CharacterSpriteImpl);
export default CharacterSprite;
