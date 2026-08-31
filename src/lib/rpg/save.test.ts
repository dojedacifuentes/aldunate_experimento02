import { describe, expect, it } from 'vitest';

import { SAVE_VERSION, migrar, saveUtilizable } from './save';

describe('migración de guardado', () => {
  it('descarta lo que no es un objeto sin lanzar', () => {
    expect(migrar(null, 0)).toEqual({});
    expect(migrar('roto', 0)).toEqual({});
  });

  it('completa los campos que la v0 no tenía', () => {
    const migrado = migrar({ player: { nombre: 'Ana' }, nodeId: 'apertura' }, 0);
    expect(migrado.decisiones).toEqual([]);
    expect(migrado.finales).toEqual([]);
    expect(migrado.impulso).toBe(0);
    expect(migrado.combo).toBe(0);
  });

  it('deja el save en la versión actual', () => {
    expect(migrar({ nodeId: 'x' }, 0).saveVersion).toBe(SAVE_VERSION);
  });

  it('conserva lo que ya estaba', () => {
    const migrado = migrar({ impulso: 68, nodeId: 'scan' }, 0);
    expect(migrado.impulso).toBe(68);
    expect(migrado.nodeId).toBe('scan');
  });
});

describe('save utilizable', () => {
  it('exige jugador con nombre y un nodo donde retomar', () => {
    expect(saveUtilizable(null)).toBe(false);
    expect(saveUtilizable({ nodeId: 'apertura' })).toBe(false);
    expect(
      saveUtilizable({
        nodeId: 'apertura',
        player: {
          nombre: 'Ana',
          avatar: 'player_renata',
          especialidad: 'litigacion',
          stats: {
            argumentacion: 3,
            investigacion: 3,
            negociacion: 3,
            estrategia: 3,
            integridad: 5,
            prestigio: 1,
          },
          xp: 0,
          nivel: 1,
        },
      }),
    ).toBe(true);
  });
});

describe('fase persistida', () => {
  it('sólo se retoman partidas en curso o terminadas', () => {
    expect((migrar({ fase: 'juego' }, 1) as Record<string, unknown>).fase).toBe('juego');
    expect((migrar({ fase: 'fin' }, 1) as Record<string, unknown>).fase).toBe('fin');
  });

  it('una creación de personaje a medias vuelve a la portada', () => {
    expect((migrar({ fase: 'creacion' }, 1) as Record<string, unknown>).fase).toBe('portada');
    expect((migrar({}, 1) as Record<string, unknown>).fase).toBe('portada');
  });
});
