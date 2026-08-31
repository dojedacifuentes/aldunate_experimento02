'use client';

import { useEffect, useRef, useState } from 'react';

import { emit, limpiarBus } from '@/lib/rpg/bus';
import { CHARACTER_IDS, CHARACTERS } from '@/data/rpg/characters';
import type { Reparto } from '@/engine/rpg/bootstrap';

/**
 * Nombre visible de cada personaje, para que la escena pueda rotular a quien
 * habla. Sale del registro: la escena no conoce el reparto, sólo claves.
 */
const NOMBRES = Object.fromEntries(CHARACTER_IDS.map((id) => [id, CHARACTERS[id].name]));

/**
 * Monta y desmonta la escena Phaser.
 *
 * Tres reglas que este componente existe para cumplir:
 *  1. Phaser se importa dinámicamente: no entra en el bundle del servidor ni en
 *     el de ninguna ruta que no sea el juego.
 *  2. La instancia se destruye al desmontar. Un `Phaser.Game` que sobrevive a
 *     su ruta sigue consumiendo un `requestAnimationFrame` para siempre.
 *  3. Si el montaje falla, el juego sigue siendo jugable sin canvas: el texto,
 *     las decisiones y el HUD son React y no dependen de esto.
 */
export function GameCanvas({ reparto }: { reparto: Reparto }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'sin-canvas'>('cargando');

  useEffect(() => {
    let juego: { destroy: (removeCanvas: boolean) => void } | null = null;
    let cancelado = false;

    (async () => {
      try {
        const { crearJuego } = await import('@/engine/rpg/bootstrap');
        if (cancelado || !contenedor.current) return;
        juego = await crearJuego(contenedor.current, reparto, NOMBRES);
        if (cancelado) return;
        setEstado('listo');
        emit('listo', {});
      } catch {
        if (!cancelado) setEstado('sin-canvas');
      }
    })();

    return () => {
      cancelado = true;
      juego?.destroy(true);
      limpiarBus();
    };
  }, [reparto]);

  return (
    <div className="escena" aria-hidden>
      <div ref={contenedor} className="escena-canvas" />
      {estado !== 'listo' && (
        <p className="escena-aviso mono">
          {estado === 'cargando' ? 'Cargando sala…' : 'Sala sin representación gráfica.'}
        </p>
      )}
    </div>
  );
}
