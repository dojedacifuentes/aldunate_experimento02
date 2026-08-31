'use client';

import { useEffect, useMemo, useState } from 'react';
import { Maximize2, Minimize2, Pause } from 'lucide-react';

import { GameCanvas } from '@/components/rpg/GameCanvas';
import { CreacionPersonaje } from '@/components/rpg/game/CreacionPersonaje';
import { Hoja } from '@/components/rpg/game/Hoja';
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
 *
 * Todas las pantallas devuelven **un solo elemento** que ocupa la fila
 * flexible de la cabina y resuelve dentro su propio desbordamiento. Ninguna
 * puede crecer hacia abajo: la cabina tiene alto definido y `overflow: hidden`.
 */
export function GameShell({
  inmersiva = false,
  onAlternarInmersiva,
}: {
  inmersiva?: boolean;
  onAlternarInmersiva?: () => void;
}) {
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
      // El tribunal es colegiado. La primera de la lista preside y se sienta al
      // centro; las otras dos van a los flancos.
      estrado: ['judge_achurra', 'judge_pinilla', 'judge_riquelme'],
      fiscalia: 'prosecutor_naveas',
      testigo: 'witness_zapata',
      defensa: player?.avatar ?? 'player_tomas',
      publico: ['director_sofia', 'rival_ignacio', 'counterparty_hector'],
    }),
    [player?.avatar],
  );

  const enPartida = Boolean(player && nodeId && fase !== 'fin');

  return (
    <>
      <BarraSuperior
        inmersiva={inmersiva}
        onAlternarInmersiva={onAlternarInmersiva}
        enPartida={enPartida}
        onPausa={() => setPausa(true)}
      />

      <Pantalla
        hidratado={hidratado}
        fase={fase}
        player={player}
        nodeId={nodeId}
        finales={finales}
        decisiones={decisiones}
        reparto={reparto}
        reiniciar={reiniciar}
        irA={irA}
      />

      {pausa && (
        <ModalPausa
          inmersiva={inmersiva}
          onAlternarInmersiva={onAlternarInmersiva}
          onVolver={() => setPausa(false)}
          onAbandonar={() => {
            setPausa(false);
            reiniciar();
          }}
        />
      )}
    </>
  );
}

/* ── Barra superior ──────────────────────────────────────────────────────────
   Identidad, rótulo de ficción y los controles que no pueden esconderse nunca.
   El rótulo va aquí y no sólo en la página porque en pantalla completa la
   página no se ve, y la advertencia no es decorativa. */

function BarraSuperior({
  inmersiva,
  onAlternarInmersiva,
  enPartida,
  onPausa,
}: {
  inmersiva: boolean;
  onAlternarInmersiva?: () => void;
  enPartida: boolean;
  onPausa: () => void;
}) {
  return (
    <div className="audaces-topbar">
      <span className="mono audaces-topbar-capitulo" style={{ color: 'var(--gold)' }}>
        La Ley de los Audaces · Capítulo 0
      </span>
      <span className="mono audaces-topbar-ficcion">Ficción · prototipo</span>

      {enPartida && (
        <button type="button" className="mono" onClick={onPausa} aria-label="Pausa (Esc)">
          <Pause className="inline h-3 w-3 align-[-1px]" aria-hidden /> Esc
        </button>
      )}

      {onAlternarInmersiva && (
        <button
          type="button"
          className="mono"
          onClick={onAlternarInmersiva}
          aria-pressed={inmersiva}
          aria-label={inmersiva ? 'Salir de pantalla completa' : 'Jugar a pantalla completa'}
        >
          {inmersiva ? (
            <Minimize2 className="inline h-3 w-3 align-[-1px]" aria-hidden />
          ) : (
            <Maximize2 className="inline h-3 w-3 align-[-1px]" aria-hidden />
          )}
        </button>
      )}
    </div>
  );
}

/* ── Selector de pantalla ─────────────────────────────────────────────────── */

type PantallaProps = {
  hidratado: boolean;
  fase: string;
  player: ReturnType<typeof useAudaces.getState>['player'];
  nodeId: string | null;
  finales: string[];
  decisiones: { acierta: boolean }[];
  reparto: Reparto;
  reiniciar: () => void;
  irA: (id: string) => void;
};

function Pantalla({
  hidratado,
  fase,
  player,
  nodeId,
  finales,
  decisiones,
  reparto,
  reiniciar,
  irA,
}: PantallaProps) {
  // Antes de hidratar no se sabe si hay partida guardada. Mostrar «nueva
  // partida» y que aparezca «continuar» un instante después sería peor que
  // esperar un fotograma.
  if (!hidratado) {
    return (
      <div className="grid place-items-center">
        <p className="mono" style={{ color: 'var(--stone)' }}>
          Cargando…
        </p>
      </div>
    );
  }

  if (fase === 'fin') {
    const aciertos = decisiones.filter((d) => d.acierta).length;
    return (
      <Hoja
        acciones={
          <button type="button" className="boton boton--principal" onClick={reiniciar}>
            Volver al inicio
          </button>
        }
      >
        <div className="mx-auto max-w-2xl">
          <p className="mono" style={{ color: 'var(--gold)' }}>
            Fin del Capítulo 0
          </p>
          <h2 className="mt-3 text-3xl">Ganó el juicio.</h2>
          <p className="mt-4 leading-relaxed" style={{ color: 'var(--ivory-dim)' }}>
            {player?.nombre}, nivel {player?.nivel}, {player?.xp} XP. Acertó{' '}
            {aciertos} de {decisiones.length} decisiones con consecuencia.
          </p>
          <p className="mt-4 leading-relaxed" style={{ color: 'var(--stone)' }}>
            El Capítulo 1 —«La caída»— todavía no existe. Este prototipo termina
            donde empieza el problema, que es exactamente donde debe terminar un
            vertical slice.
          </p>
          <p className="mt-2" style={{ color: 'var(--stone)' }}>
            Finales desbloqueados: {finales.join(', ') || '—'}
          </p>
          <FuentesDelCapitulo />
        </div>
      </Hoja>
    );
  }

  if (fase === 'creacion') return <CreacionPersonaje />;

  if (!player) {
    return (
      <Portada
        hayPartida={false}
        onNueva={() => useAudaces.setState({ fase: 'creacion' })}
        onContinuar={() => undefined}
      />
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
    <div className="audaces-cuerpo">
      <Hud />
      <div className="audaces-juego">
        <GameCanvas reparto={reparto} />
        <section id="panel-juego" className="audaces-panel">
          <NodoRunner />
        </section>
      </div>
    </div>
  );
}

/* ── Piezas de composición ────────────────────────────────────────────────── */

function Portada({
  hayPartida,
  onNueva,
  onContinuar,
}: {
  hayPartida: boolean;
  onNueva: () => void;
  onContinuar: () => void;
}) {
  return (
    <Hoja
      acciones={
        <>
          <button type="button" className="boton boton--principal" onClick={onNueva}>
            Nueva partida
          </button>
          {hayPartida && (
            <button type="button" className="boton" onClick={onContinuar}>
              Continuar
            </button>
          )}
          <span className="mono audaces-acciones-pista">1–5 elegir · E o Espacio avanzar</span>
        </>
      }
    >
      <div className="mx-auto max-w-2xl">
        <p className="mono" style={{ color: 'var(--gold)' }}>
          RPG jurídico chileno · alpha 0.1
        </p>
        <h2
          className="mt-3 leading-none"
          style={{ fontSize: 'clamp(1.75rem, 5.5vh, 3.25rem)' }}
        >
          La Ley de los Audaces
        </h2>
        <p
          className="mt-5 max-w-xl leading-relaxed"
          style={{ color: 'var(--ivory-dim)', fontSize: 'var(--texto)' }}
        >
          Capítulo 0: gane un juicio. Es lo único que tiene que hacer hoy, y es lo
          último que le va a salir bien.
        </p>
        <p className="mt-6 max-w-xl text-sm" style={{ color: 'var(--stone)' }}>
          Ficción. Personajes, empresa, documentos, tribunal y causa son
          inventados. Las referencias normativas van rotuladas según su estado de
          verificación y ninguna se presenta como Derecho vigente sin contraste.
        </p>
      </div>
    </Hoja>
  );
}

function ModalPausa({
  inmersiva,
  onAlternarInmersiva,
  onVolver,
  onAbandonar,
}: {
  inmersiva: boolean;
  onAlternarInmersiva?: () => void;
  onVolver: () => void;
  onAbandonar: () => void;
}) {
  const player = useAudaces((s) => s.player);

  return (
    <div role="dialog" aria-label="Pausa" className="audaces-modal">
      <div className="audaces-modal-caja">
        <div className="audaces-topbar">
          <span className="mono" style={{ color: 'var(--gold)' }}>
            Pausa
          </span>
          <span className="mono audaces-topbar-ficcion">{prologo.titulo}</span>
        </div>

        <div className="audaces-modal-cuerpo">
          <p style={{ color: 'var(--stone)' }}>
            Controles: <b>1–5</b> elegir · <b>E</b> o <b>Espacio</b> avanzar ·{' '}
            <b>Esc</b> pausa. La partida se guarda sola en este navegador.
          </p>

          {player && (
            <dl
              className="mono mt-4 grid grid-cols-2 gap-x-4 gap-y-1"
              style={{ color: 'var(--stone)' }}
            >
              {(
                [
                  ['Argumentación', player.stats.argumentacion],
                  ['Investigación', player.stats.investigacion],
                  ['Negociación', player.stats.negociacion],
                  ['Estrategia', player.stats.estrategia],
                  ['Integridad', player.stats.integridad],
                  ['Prestigio', player.stats.prestigio],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt>{k}</dt>
                  <dd style={{ color: 'var(--ivory-deep)' }}>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="audaces-acciones">
          <button type="button" className="boton boton--principal" onClick={onVolver}>
            Volver
          </button>
          {onAlternarInmersiva && (
            <button type="button" className="boton" onClick={onAlternarInmersiva}>
              {inmersiva ? 'Salir de pantalla completa' : 'Pantalla completa'}
            </button>
          )}
          <button type="button" className="boton" onClick={onAbandonar}>
            Abandonar partida
          </button>
        </div>
      </div>
    </div>
  );
}
