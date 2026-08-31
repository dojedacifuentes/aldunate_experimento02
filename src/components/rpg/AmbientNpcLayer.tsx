'use client';

/**
 * components/rpg/AmbientNpcLayer.tsx
 *
 * La capa de gente de fondo. Coloca cada NPC en coordenadas de mapa y lo anima
 * según su rutina.
 *
 * Ordena por `y` antes de pintar para que quien está más abajo tape a quien está
 * más arriba. Es la regla de profundidad de cualquier RPG cenital y sin ella los
 * personajes se atraviesan al cruzarse.
 */

import { memo, useMemo } from 'react';
import type { CSSProperties } from 'react';

import { getCharacter } from '@/data/rpg/characters';
import { useAmbientNpcs } from '@/hooks/rpg/useAmbientNpcs';
import type { AmbientNpc } from '@/types/rpg';

import { CharacterSprite } from './CharacterSprite';

export interface AmbientNpcLayerProps {
  npcs: AmbientNpc[];
  /** Lado de la casilla del mapa en px. */
  tileSize?: number;
  /** Escala del sprite. */
  scale?: number;
  paused?: boolean;
  /** Interacción breve al pulsar sobre un NPC con frase. */
  onInteract?: (npc: AmbientNpc) => void;
  className?: string;
}

function AmbientNpcLayerImpl({
  npcs,
  tileSize = 48,
  scale = 2,
  paused = false,
  onInteract,
  className,
}: AmbientNpcLayerProps) {
  const states = useAmbientNpcs(npcs, { paused });
  const byKey = useMemo(() => new Map(npcs.map((n) => [n.key, n])), [npcs]);

  // Copia antes de ordenar: `states` viene memoizado del hook y ordenarlo in
  // place lo mutaría entre renders.
  const ordered = useMemo(() => [...states].sort((a, b) => a.y - b.y), [states]);

  return (
    <div className={className} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {ordered.map((s) => {
        const npc = byKey.get(s.key);
        const def = getCharacter(s.characterId);
        const interactive = Boolean(npc?.line && onInteract);

        const style: CSSProperties = {
          position: 'absolute',
          left: s.x * tileSize,
          top: s.y * tileSize,
          // El sprite se ancla por los pies, no por la esquina: así una figura
          // más alta no queda flotando sobre su casilla.
          transform: `translate(-50%, -100%)`,
          pointerEvents: interactive ? 'auto' : 'none',
          cursor: interactive ? 'pointer' : undefined,
        };

        return (
          <div key={s.key} style={style}>
            <CharacterSprite
              id={s.characterId}
              animation={s.animation}
              scale={scale}
              offset={s.offset}
              paused={paused}
              label={interactive ? `${def.name}, ${def.title}` : undefined}
              onClick={interactive && npc ? () => onInteract?.(npc) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

export const AmbientNpcLayer = memo(AmbientNpcLayerImpl);
export default AmbientNpcLayer;
