'use client';

import { CharacterPortrait } from '@/components/rpg/CharacterPortrait';
import { IMPULSO_MAX, multiplicador, progresoNivel } from '@/lib/rpg/scoring';
import { useAudaces } from '@/state/rpg/useAudaces';

/**
 * HUD.
 *
 * Muestra lo que cambia y nada más. Las seis estadísticas completas viven en la
 * pausa: en pantalla permanente sólo van nivel, XP, impulso y expediente, que
 * son las que se mueven durante una audiencia.
 */
export function Hud() {
  const player = useAudaces((s) => s.player);
  const impulso = useAudaces((s) => s.impulso);
  const combo = useAudaces((s) => s.combo);
  const evidencias = useAudaces((s) => s.evidencias);

  if (!player) return null;
  const mult = multiplicador(combo);

  return (
    <aside
      className="flex flex-col gap-4 border-l p-4"
      style={{ borderColor: 'var(--charcoal-lift)', background: 'var(--charcoal)' }}
    >
      <header className="flex items-center gap-3">
        <CharacterPortrait id={player.avatar} size={56} />
        <div>
          <p className="text-base leading-tight">{player.nombre}</p>
          <p className="mono" style={{ color: 'var(--stone)' }}>
            Nivel {player.nivel} · {player.xp} XP
          </p>
        </div>
      </header>

      <div>
        <div className="mono flex justify-between" style={{ color: 'var(--stone)' }}>
          <span>Nivel</span>
          <span>{Math.round(progresoNivel(player.xp) * 100)}%</span>
        </div>
        <div className="barra mt-1">
          <span style={{ width: `${progresoNivel(player.xp) * 100}%` }} />
        </div>
      </div>

      <div>
        <div className="mono flex justify-between" style={{ color: 'var(--stone)' }}>
          <span>Impulso</span>
          <span style={{ color: mult > 1 ? 'var(--gold-lift)' : 'var(--stone)' }}>
            {mult > 1 ? `combo ×${mult}` : '—'}
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

      <div>
        <p className="mono" style={{ color: 'var(--stone)' }}>
          Expediente · {evidencias.length}
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {evidencias.length === 0 && (
            <li className="text-sm" style={{ color: 'var(--stone-dim)' }}>
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
              <span style={{ color: 'var(--stone)' }}>{e.resumen}</span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mono mt-auto grid grid-cols-2 gap-x-3 gap-y-1" style={{ color: 'var(--stone)' }}>
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
          <div key={k} className="flex justify-between">
            <dt>{k}</dt>
            <dd style={{ color: 'var(--ivory-deep)' }}>{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
