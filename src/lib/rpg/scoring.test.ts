import { describe, expect, it } from 'vitest';

import {
  IMPULSO_MAX,
  impulsoTrasAcierto,
  impulsoTrasFallo,
  multiplicador,
  nivelDesde,
  progresoNivel,
  xpConCombo,
} from './scoring';

describe('nivel', () => {
  it('empieza en 1 y sube al cruzar cada umbral', () => {
    expect(nivelDesde(0)).toBe(1);
    expect(nivelDesde(119)).toBe(1);
    expect(nivelDesde(120)).toBe(2);
    expect(nivelDesde(560)).toBe(4);
  });

  it('el progreso queda acotado entre 0 y 1', () => {
    expect(progresoNivel(0)).toBe(0);
    expect(progresoNivel(60)).toBeCloseTo(0.5, 5);
    expect(progresoNivel(999_999)).toBe(1);
  });
});

describe('combo', () => {
  it('un acierto aislado no multiplica', () => {
    expect(multiplicador(0)).toBe(1);
    expect(multiplicador(1)).toBe(1);
  });

  it('multiplica desde el segundo acierto encadenado y topa en x4', () => {
    expect(multiplicador(2)).toBe(2);
    expect(multiplicador(3)).toBe(3);
    expect(multiplicador(9)).toBe(4);
  });

  it('la XP aplica el combo vigente al momento de actuar', () => {
    expect(xpConCombo(40, 0)).toBe(40);
    expect(xpConCombo(40, 3)).toBe(120);
  });
});

describe('impulso', () => {
  it('no supera el máximo', () => {
    expect(impulsoTrasAcierto(90)).toBe(IMPULSO_MAX);
  });

  it('fallar reduce a la mitad, no a cero', () => {
    expect(impulsoTrasFallo(100)).toBe(50);
    expect(impulsoTrasFallo(1)).toBe(0);
  });
});
