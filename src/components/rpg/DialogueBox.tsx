'use client';

/**
 * components/rpg/DialogueBox.tsx
 *
 * El cuadro de diálogo. Consume `DialogueLine`, que es exactamente la forma
 * pedida en la especificación:
 *
 *   { speaker, portrait, mood, text }
 *
 * Con dos precisiones que hacen falta para que el sistema aguante una partida
 * entera sin degenerar:
 *
 *   - `characterId` es obligatorio y `speaker` opcional. El nombre mostrado sale
 *     del registro salvo que la línea lo sobreescriba (un personaje aún sin
 *     presentar puede hablar como «Una voz»).
 *   - `portrait` sólo se indica cuando la cara mostrada NO es la del hablante
 *     (una llamada, un recuerdo, EVA interviniendo sobre la escena de otro).
 *
 * El estilo visual —color del nombre, filete, tipografía, velocidad de
 * escritura— viene de `dialogueStyle` del registro. Ninguna escena fija colores.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { getCharacter, resolveMood } from '@/data/rpg/characters';
import { usePrefersReducedMotion } from '@/hooks/rpg/useSpriteAnimation';
import type { DialogueLine, DialogueStyle } from '@/types/rpg';

import { CharacterPortrait } from './CharacterPortrait';

const PALETTE = {
  ink: '#12100F',
  charcoal: '#1B1917',
  panel: '#201E1C',
  border: '#332F2B',
  ivory: '#EDE6D6',
  ivoryDim: '#B9AF99',
  burgundy: '#8A2432',
  gold: '#B78C30',
  stone: '#6E6A63',
} as const;

/** Cada variante cambia el filete y el fondo, nunca la estructura. */
const VARIANT: Record<DialogueStyle['variant'], { edge: string; wash: string }> = {
  default: { edge: PALETTE.stone, wash: PALETTE.panel },
  authority: { edge: PALETTE.gold, wash: '#221F1B' },
  opposing: { edge: PALETTE.burgundy, wash: '#221D1E' },
  client: { edge: PALETTE.ivoryDim, wash: '#221F1C' },
  eva: { edge: PALETTE.gold, wash: '#1D1B1C' },
};

const FAMILY: Record<DialogueStyle['family'], string> = {
  serif: 'ui-serif, Georgia, "Times New Roman", serif',
  sans: 'ui-sans-serif, system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, monospace',
};

// ---------------------------------------------------------------------------
// Efecto de escritura
// ---------------------------------------------------------------------------

/**
 * Revela el texto carácter a carácter.
 *
 * Con `prefers-reduced-motion`, o cuando quien juega pulsa para avanzar, el
 * texto aparece entero de golpe. Es un requisito de accesibilidad y además la
 * cortesía mínima con quien lee rápido.
 */
function useTypewriter(text: string, charDelay: number, enabled: boolean) {
  const [shown, setShown] = useState(enabled ? 0 : text.length);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || charDelay <= 0) {
      setShown(text.length);
      return;
    }
    setShown(0);
    timer.current = setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          if (timer.current) clearInterval(timer.current);
          return n;
        }
        return n + 1;
      });
    }, charDelay);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [text, charDelay, enabled]);

  const complete = shown >= text.length;
  const finish = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    setShown(text.length);
  }, [text.length]);

  return { visible: text.slice(0, shown), complete, finish };
}

// ---------------------------------------------------------------------------

export interface DialogueBoxProps {
  line: DialogueLine;
  /** Se llama al avanzar con el texto ya completo. */
  onAdvance?: () => void;
  /** Indicador de que quedan más líneas. */
  hasNext?: boolean;
  /** Lado del retrato. */
  portraitSide?: 'left' | 'right';
  className?: string;
}

export function DialogueBox({
  line,
  onAdvance,
  hasNext = true,
  portraitSide = 'left',
  className,
}: DialogueBoxProps) {
  const reduced = usePrefersReducedMotion();
  const speakerDef = getCharacter(line.characterId);

  // Quién habla y qué cara se muestra son cosas distintas.
  const portraitId = line.portrait ?? line.characterId;
  const style = speakerDef.dialogueStyle;
  const mood = resolveMood(portraitId, line.mood ?? style.defaultMood);
  const name = line.speaker ?? speakerDef.name;

  const { visible, complete, finish } = useTypewriter(line.text, style.charDelay, !reduced);

  // Primer clic completa el texto; el segundo avanza. Es la convención de
  // cualquier RPG y evita saltarse una línea sin querer.
  const handleAdvance = useCallback(() => {
    if (!complete) {
      finish();
      return;
    }
    onAdvance?.();
  }, [complete, finish, onAdvance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleAdvance]);

  const variant = VARIANT[style.variant] ?? VARIANT.default;

  const box: CSSProperties = useMemo(
    () => ({
      display: 'flex',
      flexDirection: portraitSide === 'right' ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: 0,
      maxWidth: 860,
      width: '100%',
    }),
    [portraitSide],
  );

  const panel: CSSProperties = {
    flex: 1,
    minWidth: 0,
    background: variant.wash,
    border: `1px solid ${PALETTE.border}`,
    borderBottomWidth: 2,
    borderBottomColor: variant.edge,
    borderRadius: 2,
    padding: '14px 18px 16px',
    color: PALETTE.ivory,
    fontFamily: FAMILY[style.family],
    fontSize: 16,
    lineHeight: 1.62,
    position: 'relative',
  };

  return (
    <div
      className={className}
      style={box}
      onClick={handleAdvance}
      role="button"
      tabIndex={0}
      aria-live="polite"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
      }}
    >
      <CharacterPortrait
        id={portraitId}
        mood={mood}
        size={132}
        flip={portraitSide === 'right'}
        // El retrato se apoya en el borde del panel, sin marco propio: el marco
        // es del cuadro, no de la persona.
        className="rpg-dialogue-portrait"
      />

      <div style={panel}>
        <p
          style={{
            margin: '0 0 6px',
            font: `500 11px/1.4 ${FAMILY.mono}`,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: style.nameColor,
          }}
        >
          {name}
          {line.characterId !== portraitId ? (
            <span style={{ color: PALETTE.stone, marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>
              — {getCharacter(portraitId).name} en pantalla
            </span>
          ) : null}
        </p>

        <p style={{ margin: 0, minHeight: '3.2em' }}>
          {visible}
          {/* Cursor sólo mientras escribe: si se queda parpadeando al final,
              compite con el indicador de avanzar. */}
          {!complete ? (
            <span aria-hidden style={{ color: style.accent, opacity: 0.7 }}>
              ▍
            </span>
          ) : null}
        </p>

        {complete && hasNext ? (
          <span
            aria-hidden
            style={{
              position: 'absolute',
              right: 14,
              bottom: 10,
              color: variant.edge,
              fontSize: 12,
              animation: reduced ? undefined : 'rpgNudge 1.4s ease-in-out infinite',
            }}
          >
            ▸
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default DialogueBox;
