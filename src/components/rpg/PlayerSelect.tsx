'use client';

/**
 * components/rpg/PlayerSelect.tsx
 *
 * Elección de avatar al empezar. No es un editor de personaje: son dos figuras
 * ya diseñadas, con su sprite, su retrato y sus animaciones, y se elige una.
 *
 * Cada opción muestra el sprite andando y el retrato, porque son las dos formas
 * en que se va a ver al personaje durante toda la partida y conviene decidir con
 * las dos a la vista.
 */

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import { getCharacter, PLAYER_AVATARS } from '@/data/rpg/characters';
import { preloadAllMoods } from '@/lib/rpg/characterArt';
import type { CharacterId } from '@/types/rpg';

import { CharacterPortrait } from './CharacterPortrait';
import { CharacterSprite } from './CharacterSprite';

const PALETTE = {
  charcoal: '#1B1917',
  panel: '#201E1C',
  panelOn: '#262320',
  border: '#332F2B',
  ivory: '#EDE6D6',
  ivoryDim: '#B9AF99',
  gold: '#B78C30',
  stone: '#6E6A63',
} as const;

const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';
const SERIF = 'ui-serif, Georgia, "Times New Roman", serif';

export interface PlayerSelectProps {
  value?: CharacterId;
  onChange?: (id: CharacterId) => void;
  onConfirm?: (id: CharacterId) => void;
  className?: string;
  /**
   * Dentro de la creación de personaje esto es un paso de tres, no una
   * pantalla: se queda sin titular propio y con las figuras más pequeñas, para
   * que las tres decisiones quepan a la vez.
   */
  compacto?: boolean;
}

export function PlayerSelect({
  value,
  onChange,
  onConfirm,
  className,
  compacto = false,
}: PlayerSelectProps) {
  const [selected, setSelected] = useState<CharacterId>(value ?? PLAYER_AVATARS[0].id);

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  // Generar los retratos de ambos avatares cuesta unos ms; hacerlo aquí evita
  // el tirón al abrir el primer diálogo de la partida.
  useEffect(() => {
    for (const option of PLAYER_AVATARS) preloadAllMoods(option.id);
  }, []);

  const pick = (id: CharacterId) => {
    setSelected(id);
    onChange?.(id);
  };

  const card = (active: boolean): CSSProperties => ({
    flex: 1,
    minWidth: compacto ? 180 : 240,
    background: active ? PALETTE.panelOn : PALETTE.panel,
    border: `1px solid ${active ? PALETTE.gold : PALETTE.border}`,
    borderRadius: 2,
    padding: compacto ? '12px 14px 14px' : '18px 18px 20px',
    cursor: 'pointer',
    textAlign: 'left',
    color: PALETTE.ivory,
    transition: 'border-color 160ms ease, background 160ms ease',
  });

  return (
    <div className={className} style={{ maxWidth: 760, margin: '0 auto', fontFamily: SERIF }}>
      <p
        style={{
          font: `500 11px/1.4 ${MONO}`,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: PALETTE.gold,
          margin: '0 0 6px',
        }}
      >
        Primer día
      </p>
      {!compacto && (
        <>
          <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 500 }}>
            ¿Quién entra hoy al estudio?
          </h2>
          <p style={{ margin: '0 0 22px', color: PALETTE.ivoryDim, maxWidth: '56ch' }}>
            Las dos plazas de junior son idénticas sobre el papel. Lo que cambia es a quién van a
            mirar cuando algo salga mal.
          </p>
        </>
      )}

      <div
        role="radiogroup"
        aria-label="Avatar"
        style={{ display: 'flex', gap: compacto ? 12 : 16, flexWrap: 'wrap' }}
      >
        {PLAYER_AVATARS.map((option) => {
          const def = getCharacter(option.id);
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => pick(option.id)}
              onDoubleClick={() => onConfirm?.(option.id)}
              style={card(active)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: compacto ? 10 : 14,
                  marginBottom: compacto ? 10 : 14,
                }}
              >
                <CharacterPortrait
                  id={option.id}
                  mood={active ? 'friendly' : 'neutral'}
                  size={compacto ? 72 : 104}
                />
                {/* Andando, no quieto: es como se le va a ver el 90 % del tiempo. */}
                <CharacterSprite
                  id={option.id}
                  facing="down"
                  moving={active}
                  scale={compacto ? 1 : 2}
                  paused={!active}
                />
              </div>

              <p style={{ margin: '0 0 2px', fontSize: compacto ? 16 : 18, fontWeight: 500 }}>
                {option.label}
              </p>
              <p
                style={{
                  margin: '0 0 10px',
                  font: `500 10px/1.4 ${MONO}`,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: active ? PALETTE.gold : PALETTE.stone,
                }}
              >
                {def.title}
              </p>
              {/* La descripción se encoge, no desaparece: es lo único que
                  distingue a una plaza de la otra. */}
              <p
                style={{
                  margin: 0,
                  color: PALETTE.ivoryDim,
                  fontSize: compacto ? 13 : 14,
                  lineHeight: 1.45,
                }}
              >
                {option.blurb}
              </p>
            </button>
          );
        })}
      </div>

      {/* El botón sólo existe si tiene a quién avisar. Sin `onConfirm` era un
          control que no hacía nada, que es peor que no tener control. */}
      {onConfirm && (
        <button
          type="button"
          onClick={() => onConfirm(selected)}
          style={{
            marginTop: 22,
            padding: '10px 22px',
            background: 'transparent',
            border: `1px solid ${PALETTE.gold}`,
            borderRadius: 2,
            color: PALETTE.gold,
            font: `500 11px/1 ${MONO}`,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Entrar
        </button>
      )}
    </div>
  );
}

export default PlayerSelect;
