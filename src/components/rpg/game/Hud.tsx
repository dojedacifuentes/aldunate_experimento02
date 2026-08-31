'use client';

import { CharacterPortrait } from '@/components/rpg/CharacterPortrait';
import { IMPULSO_MAX, multiplicador, progresoNivel } from '@/lib/rpg/scoring';
import { useAudaces } from '@/state/rpg/useAudaces';

/**
 * HUD.
 *
 * Muestra lo que cambia y nada más: nivel, XP, impulso y expediente, que son
 * las cifras que se mueven durante una audiencia. Las seis estadísticas
 * completas viven también en la pausa, que es donde hay sitio para leerlas.
 *
 * Dos formas, una sola marca: columna lateral cuando hay ancho, y banda
 * horizontal compacta cuando no. El reparto lo hace el CSS —`audaces-hud`—;
 * aquí no hay ninguna medición ni ningún `matchMedia`.
 *
 * El expediente es la única lista que puede crecer sin límite, así que es la
 * única que se desplaza por dentro. Nada de lo que hay aquí empuja al juego.
 */
export function Hud() {
  const player = useAudaces((s) => s.player);
  const impulso = useAudaces((s) => s.impulso);
  const combo = useAudaces((s) => s.combo);
  const evidencias = useAudaces((s) => s.evidencias);

  if (!player) return null;
  const mult = multiplicador(combo);

  return (
    <aside className="audaces-hud" aria-label="Estado de la partida">
      <header className="audaces-hud-id">
        <CharacterPortrait id={player.avatar} size={56} />
        <div className="min-w-0">
          <p className="truncate leading-tight">{player.nombre}</p>
          <p className="mono" style={{ color: 'var(--stone)' }}>
            Nv {player.nivel} · {player.xp} XP
          </p>
        </div>
      </header>

      <div className="audaces-hud-barras">
        <div>
          <div className="mono flex justify-between gap-2" style={{ color: 'var(--stone)' }}>
            <span>Nivel</span>
            <span>{Math.round(progresoNivel(player.xp) * 100)}%</span>
          </div>
          <div className="barra mt-1">
            <span style={{ width: `${progresoNivel(player.xp) * 100}%` }} />
          </div>
        </div>

        <div>
          <div className="mono flex justify-between gap-2" style={{ color: 'var(--stone)' }}>
            <span>Impulso</span>
            <span style={{ color: mult > 1 ? 'var(--gold-lift)' : 'var(--stone)' }}>
              {mult > 1 ? `×${mult}` : '—'}
            </span>
          </div>
          <div className="barra mt-1">
            <span
              style={{
                width: `${(impulso / IMPULSO_MAX) * 100}%`,
                background: mult > 1 ? 'var(--gold-lift)' : 'var(--gold)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="audaces-hud-exp">
        <p className="mono" style={{ color: 'var(--stone)' }}>
          Expediente · {evidencias.length}
        </p>
        <ul className="audaces-hud-exp-lista">
          {evidencias.length === 0 && (
            <li className="audaces-hud-exp-vacio text-sm" style={{ color: 'var(--stone-dim)' }}>
              Todavía nada que proyectar.
            </li>
          )}
          {evidencias.map((e) => (
            <li
              key={e.id}
              className="border p-2 text-sm"
              style={{ borderColor: 'var(--charcoal-lift)' }}
            >
              <strong className="block font-normal">{e.nombre}</strong>
              <span className="audaces-hud-exp-detalle" style={{ color: 'var(--stone)' }}>
                {e.resumen}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="audaces-hud-stats mono" style={{ color: 'var(--stone)' }}>
        {(
          [
            ['Arg', player.stats.argumentacion],
            ['Inv', player.stats.investigacion],
            ['Neg', player.stats.negociacion],
            ['Est', player.stats.estrategia],
            ['Int', player.stats.integridad],
            ['Pre', player.stats.prestigio],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2">
            <dt>{k}</dt>
            <dd style={{ color: 'var(--ivory-deep)' }}>{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
