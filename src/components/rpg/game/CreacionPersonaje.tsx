'use client';

import { useState } from 'react';

import { PlayerSelect } from '@/components/rpg/PlayerSelect';
import { especialidades } from '@/data/rpg/skills';
import { useAudaces } from '@/state/rpg/useAudaces';
import type { AvatarId, Especialidad } from '@/types/game';
import type { CharacterId } from '@/types/rpg';

/**
 * Creación de personaje.
 *
 * Tres decisiones y ninguna más: nombre, avatar y especialidad. La ventaja de
 * cada especialidad es real —modifica una estadística que el prólogo usa—,
 * porque una elección que no cambia nada enseña al jugador que sus elecciones
 * no cambian nada.
 */
export function CreacionPersonaje() {
  const crearPersonaje = useAudaces((s) => s.crearPersonaje);
  const irA = useAudaces((s) => s.irA);

  const [nombre, setNombre] = useState('');
  const [avatar, setAvatar] = useState<CharacterId>('player_tomas');
  const [especialidad, setEspecialidad] = useState<Especialidad>('litigacion');

  const comenzar = () => {
    crearPersonaje({ nombre, avatar: avatar as AvatarId, especialidad });
    irA('apertura');
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="mono" style={{ color: 'var(--gold)' }}>
        Capítulo 0 · antes de entrar
      </p>
      <h1 className="mt-3 text-4xl leading-tight">¿Quién defiende hoy?</h1>
      <p className="mt-4 max-w-xl leading-relaxed" style={{ color: 'var(--ivory-deep)' }}>
        Tres decisiones. Ninguna es cosmética: la especialidad cambia lo que
        podrá hacer dentro de la sala.
      </p>

      <section className="mt-10">
        <label className="mono block" style={{ color: 'var(--stone)' }} htmlFor="nombre">
          Nombre
        </label>
        <input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={32}
          placeholder="Como quiere que lo llame el tribunal"
          className="mt-2 w-full border bg-transparent px-3 py-2 text-lg outline-none"
          style={{ borderColor: 'var(--charcoal-lift)', color: 'var(--ivory)' }}
        />
      </section>

      <section className="mt-10">
        <p className="mono" style={{ color: 'var(--stone)' }}>
          Avatar
        </p>
        <PlayerSelect value={avatar} onChange={setAvatar} className="mt-3" />
      </section>

      <section className="mt-10">
        <p className="mono" style={{ color: 'var(--stone)' }}>
          Especialidad
        </p>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {especialidades.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                className="opcion h-full"
                data-elegida={especialidad === e.id}
                onClick={() => setEspecialidad(e.id)}
                aria-pressed={especialidad === e.id}
              >
                <span className="mono block" style={{ color: 'var(--gold)' }}>
                  {e.ventajaTexto}
                </span>
                <strong className="mt-2 block text-lg font-normal">{e.nombre}</strong>
                <em className="block text-sm" style={{ color: 'var(--ivory-deep)' }}>
                  {e.lema}
                </em>
                <span className="mt-2 block text-sm" style={{ color: 'var(--stone)' }}>
                  {e.descripcion}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={comenzar}
        className="mono mt-10 border px-6 py-3"
        style={{
          borderColor: 'var(--gold)',
          color: 'var(--ink)',
          background: 'var(--gold)',
          cursor: 'pointer',
        }}
      >
        Entrar a la sala
      </button>
    </main>
  );
}
