'use client';

/**
 * components/rpg/EvaAvatar.tsx
 *
 * EVA en pantalla, con su identidad gráfica propia:
 *
 *   - animación de aparición (se "imprime" por bandas hasta cuadrar el registro)
 *   - idle especial permanente (deriva del barrido, no un rebote de personaje)
 *   - estado `eva_glitch` invocable desde un diálogo o una transición
 *
 * Lo que NO hace, a propósito: brillo, wireframe, transparencia de holograma ni
 * nada cyberpunk. EVA es opaca y viste como quien trabaja en el estudio; su capa
 * digital es una interferencia de imprenta, no un efecto de ciencia ficción.
 */

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import { useFrameSequence, usePrefersReducedMotion } from '@/hooks/rpg/useSpriteAnimation';
import { evaAppearUrls, evaIdleUrls } from '@/lib/rpg/characterArt';
import type { EvaMood } from '@/types/rpg';

import { CharacterPortrait } from './CharacterPortrait';
import { CharacterSprite } from './CharacterSprite';

const APPEAR_FPS = 12;
const IDLE_FPS = 3;

// ---------------------------------------------------------------------------
// Retrato
// ---------------------------------------------------------------------------

export interface EvaPortraitProps {
  mood?: EvaMood;
  size?: number;
  /** Reproduce la aparición al montar. */
  appear?: boolean;
  /**
   * Fuerza el glitch durante N ms y vuelve al mood anterior.
   * Pensado para transiciones y para puntuar una frase, no para dejarlo fijo.
   */
  glitchFor?: number;
  className?: string;
  onAppeared?: () => void;
}

export function EvaPortrait({
  mood = 'neutral',
  size = 160,
  appear = false,
  glitchFor,
  className,
  onAppeared,
}: EvaPortraitProps) {
  const reduced = usePrefersReducedMotion();
  const frames = useMemo(() => (appear ? evaAppearUrls(5) : []), [appear]);
  const { index, done } = useFrameSequence(frames.length, APPEAR_FPS, { paused: !appear });

  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    if (!glitchFor || glitchFor <= 0) return;
    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), glitchFor);
    return () => clearTimeout(t);
  }, [glitchFor]);

  useEffect(() => {
    if (appear && done) onAppeared?.();
  }, [appear, done, onAppeared]);

  // Mientras se materializa mostramos los fotogramas de aparición; al terminar,
  // el retrato normal toma el relevo y ya responde a `mood` como cualquier otro.
  if (appear && !done && !reduced && frames.length > 0) {
    return (
      <div className={className} style={{ width: size, height: size, position: 'relative' }}>
        <img
          src={frames[index]}
          alt=""
          aria-hidden
          style={{ width: '100%', height: '100%', imageRendering: 'pixelated', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <CharacterPortrait
      id="eva"
      mood={glitching ? 'eva_glitch' : mood}
      size={size}
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// Sprite de mapa
// ---------------------------------------------------------------------------

export interface EvaSpriteProps {
  scale?: number;
  /** Usa el idle especial en vez del idle estándar de la hoja. */
  special?: boolean;
  className?: string;
  label?: string;
  onClick?: () => void;
}

/**
 * EVA dentro del mapa.
 *
 * Su idle especial son fotogramas sueltos, no una fila de la hoja: el barrido
 * tiene que derivar de forma independiente del ciclo de caminata, y meterlo en
 * la hoja obligaría a duplicar filas por dirección para nada.
 */
export function EvaSprite({ scale = 2, special = true, className, label, onClick }: EvaSpriteProps) {
  const frames = useMemo(() => (special ? evaIdleUrls('down') : []), [special]);
  const { index } = useFrameSequence(frames.length, IDLE_FPS, { loop: true, paused: !special });

  if (!special || frames.length === 0) {
    return <CharacterSprite id="eva" scale={scale} className={className} label={label} onClick={onClick} />;
  }

  const style: CSSProperties = {
    width: 48 * scale,
    height: 48 * scale,
    backgroundImage: `url(${frames[index]})`,
    backgroundSize: `${48 * scale}px ${48 * scale}px`,
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated',
    cursor: onClick ? 'pointer' : undefined,
  };

  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={label ?? 'EVA'}
    />
  );
}

export default EvaPortrait;
