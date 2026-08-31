'use client';

import { useState } from 'react';

import { PlayerSelect } from '@/components/rpg/PlayerSelect';
import { Hoja } from '@/components/rpg/game/Hoja';
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
 *
 * Las tres tienen que verse a la vez. En pantallas anchas van en dos columnas
 * —nombre y avatar a un lado, especialidad al otro—; en estrechas se apilan y
 * el cuerpo se desplaza por dentro. «Entrar a la sala» vive en la barra de
 * acciones y nunca entra en ese desplazamiento.
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

  const elegida = especialidades.find((e) => e.id === especialidad);

  return (
    <Hoja
      acciones={
        <>
          <button type="button" className="boton boton--principal" onClick={comenzar}>
            Entrar a la sala
          </button>
          <span className="mono audaces-acciones-pista">
            {elegida ? `${elegida.nombre} · ${elegida.ventajaTexto}` : ''}
          </span>
        </>
      }
    >
      <div className="mx-auto max-w-5xl">
        <p className="mono" style={{ color: 'var(--gold)' }}>
          Capítulo 0 · antes de entrar
        </p>
        <h2 className="mt-2" style={{ fontSize: 'clamp(1.4rem, 3.4vh, 2.25rem)' }}>
          ¿Quién defiende hoy?
        </h2>
        <p className="mt-2 max-w-xl text-sm" style={{ color: 'var(--ivory-deep)' }}>
          Tres decisiones. Ninguna es cosmética: la especialidad cambia lo que
          podrá hacer dentro de la sala.
        </p>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="grid content-start gap-5">
            <section>
              <label className="mono block" style={{ color: 'var(--stone)' }} htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={32}
                placeholder="Como quiere que lo llame el tribunal"
                className="mt-1.5 w-full border bg-transparent px-3 py-2 outline-none"
                style={{
                  borderColor: 'var(--charcoal-lift)',
                  color: 'var(--ivory)',
                  fontSize: 'var(--texto)',
                }}
              />
            </section>

            <section>
              <p className="mono" style={{ color: 'var(--stone)' }}>
                Avatar · las dos plazas son idénticas sobre el papel
              </p>
              <PlayerSelect value={avatar} onChange={setAvatar} className="mt-2" compacto />
            </section>
          </div>

          <section>
            <p className="mono" style={{ color: 'var(--stone)' }}>
              Especialidad
            </p>
            <ul className="mt-2 grid gap-2">
              {especialidades.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className="opcion"
                    data-elegida={especialidad === e.id}
                    onClick={() => setEspecialidad(e.id)}
                    aria-pressed={especialidad === e.id}
                  >
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <strong className="text-base font-normal">{e.nombre}</strong>
                      <span className="mono" style={{ color: 'var(--gold)' }}>
                        {e.ventajaTexto}
                      </span>
                    </span>
                    <em className="mt-0.5 block text-sm" style={{ color: 'var(--ivory-deep)' }}>
                      {e.lema}
                    </em>
                    <span className="mt-1 block text-sm" style={{ color: 'var(--stone)' }}>
                      {e.descripcion}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Hoja>
  );
}
