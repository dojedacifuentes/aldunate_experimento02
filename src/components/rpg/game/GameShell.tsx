'use client';

import { useEffect, useMemo, useState } from 'react';

import { GameCanvas } from '@/components/rpg/GameCanvas';
import { CreacionPersonaje } from '@/components/rpg/game/CreacionPersonaje';
import { Hud } from '@/components/rpg/game/Hud';
import { FuentesDelCapitulo, NodoRunner } from '@/components/rpg/game/NodoRunner';
import { prologo } from '@/data/rpg/chapters/prologo';
import { useAudaces } from '@/state/rpg/useAudaces';
import type { Reparto } from '@/engine/rpg/bootstrap';

/**
 * Raíz del juego.
 *
 * Decide qué pantalla toca y monta la escena una sola vez por partida. No
 * contiene guion ni reglas: reparte.
 */
export function GameShell() {
  const hidratado = useAudaces((s) => s.hidratado);
  const player = useAudaces((s) => s.player);
  const nodeId = useAudaces((s) => s.nodeId);
  const fase = useAudaces((s) => s.fase);
  const finales = useAudaces((s) => s.finales);
  const decisiones = useAudaces((s) => s.decisiones);
  const reiniciar = useAudaces((s) => s.reiniciar);
  const irA = useAudaces((s) => s.irA);

  const [pausa, setPausa] = useState(false);

  useEffect(() => {
    const manejar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPausa((p) => !p);
    };
    window.addEventListener('keydown', manejar);
    return () => window.removeEventListener('keydown', manejar);
  }, []);

  /**
   * Con la pausa abierta, el juego no escucha.
   *
   * `NodoRunner` y el cuadro de diálogo escuchan el teclado en `window`. Este
   * interceptor va en fase de captura, de modo que corta el evento antes de que
   * llegue a ninguno de los dos: sin él, Espacio y los números seguían avanzando
   * la partida por detrás del modal. Escape queda fuera, que es como se sale.
   */
  useEffect(() => {
    if (!pausa) return;
    const bloquear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return;
      e.stopImmediatePropagation();
      e.preventDefault();
    };
    window.addEventListener('keydown', bloquear, true);
    return () => window.removeEventListener('keydown', bloquear, true);
  }, [pausa]);

  const reparto = useMemo<Reparto>(
    () => ({
      estrado: 'judge_achurra',
      fiscalia: 'prosecutor_naveas',
      testigo: 'witness_zapata',
      defensa: player?.avatar ?? 'player_tomas',
      publico: ['director_sofia', 'rival_ignacio', 'counterparty_hector'],
    }),
    [player?.avatar],
  );

  // Antes de hidratar no se sabe si hay partida guardada. Mostrar «nueva
  // partida» y que aparezca «continuar» un instante después sería peor que
  // esperar un fotograma.
  if (!hidratado) {
    return <p className="mono p-8" style={{ color: 'var(--stone)' }}>Cargando…</p>;
  }

  if (fase === 'fin') {
    const aciertos = decisiones.filter((d) => d.acierta).length;
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="mono" style={{ color: 'var(--gold)' }}>
          Fin del Capítulo 0
        </p>
        <h1 className="mt-3 text-4xl">Ganó el juicio.</h1>
        <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>
          {player?.nombre}, nivel {player?.nivel}, {player?.xp} XP. Acertó{' '}
          {aciertos} de {decisiones.length} decisiones con consecuencia.
        </p>
        <p className="mt-5 leading-relaxed" style={{ color: 'var(--stone)' }}>
          El Capítulo 1 —«La caída»— todavía no existe. Este prototipo termina
          donde empieza el problema, que es exactamente donde debe terminar un
          vertical slice.
        </p>
        <p className="mt-2" style={{ color: 'var(--stone)' }}>
          Finales desbloqueados: {finales.join(', ') || '—'}
        </p>
        <button
          type="button"
          className="mono mt-8 border px-6 py-3"
          style={{ borderColor: 'var(--gold)', color: 'var(--gold)', cursor: 'pointer' }}
          onClick={reiniciar}
        >
          Volver al inicio
        </button>
        <FuentesDelCapitulo />
      </main>
    );
  }

  if (!player) {
    return (
      <>
        <Portada
          hayPartida={false}
          onNueva={() => useAudaces.setState({ fase: 'creacion' })}
          onContinuar={() => undefined}
        />
        {fase === 'creacion' && <CreacionPersonaje />}
      </>
    );
  }

  if (!nodeId) {
    return (
      <Portada
        hayPartida
        onNueva={() => {
          reiniciar();
          useAudaces.setState({ fase: 'creacion' });
        }}
        onContinuar={() => irA(prologo.inicio)}
      />
    );
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_320px]">
      <div>
        <GameCanvas reparto={reparto} />
        <section id="panel-juego">
          <NodoRunner />
        </section>
      </div>
      <Hud />

      {pausa && (
        <div
          role="dialog"
          aria-label="Pausa"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--ink) 88%, transparent)' }}
        >
          <div className="max-w-md border p-6" style={{ borderColor: 'var(--gold)' }}>
            <p className="mono" style={{ color: 'var(--gold)' }}>
              Pausa
            </p>
            <h2 className="mt-2 text-2xl">{prologo.titulo}</h2>
            <p className="mt-3" style={{ color: 'var(--stone)' }}>
              Controles: <b>1–5</b> elegir · <b>E</b> o <b>Espacio</b> avanzar ·{' '}
              <b>Esc</b> pausa. La partida se guarda sola en este navegador.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="mono border px-5 py-2"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold)', cursor: 'pointer' }}
                onClick={() => setPausa(false)}
              >
                Volver
              </button>
              <button
                type="button"
                className="mono border px-5 py-2"
                style={{ borderColor: 'var(--charcoal-lift)', color: 'var(--stone)', cursor: 'pointer' }}
                onClick={() => {
                  setPausa(false);
                  reiniciar();
                }}
              >
                Abandonar partida
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Portada({
  hayPartida,
  onNueva,
  onContinuar,
}: {
  hayPartida: boolean;
  onNueva: () => void;
  onContinuar: () => void;
}) {
  const fase = useAudaces((s) => s.fase);
  if (fase === 'creacion') return null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="mono" style={{ color: 'var(--gold)' }}>
        RPG jurídico chileno · alpha 0.1
      </p>
      <h1 className="mt-4 text-5xl leading-none sm:text-6xl">La Ley de los Audaces</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>
        Capítulo 0: gane un juicio. Es lo único que tiene que hacer hoy, y es lo
        último que le va a salir bien.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          className="mono border px-6 py-3"
          style={{
            borderColor: 'var(--gold)',
            background: 'var(--gold)',
            color: 'var(--ink)',
            cursor: 'pointer',
          }}
          onClick={onNueva}
        >
          Nueva partida
        </button>
        {hayPartida && (
          <button
            type="button"
            className="mono border px-6 py-3"
            style={{ borderColor: 'var(--charcoal-lift)', color: 'var(--ivory)', cursor: 'pointer' }}
            onClick={onContinuar}
          >
            Continuar
          </button>
        )}
      </div>
      <p className="mt-12 max-w-xl text-sm" style={{ color: 'var(--stone)' }}>
        Ficción. Personajes, empresa, documentos, tribunal y causa son
        inventados. Las referencias normativas van rotuladas según su estado de
        verificación y ninguna se presenta como Derecho vigente sin contraste.
      </p>
    </main>
  );
}
