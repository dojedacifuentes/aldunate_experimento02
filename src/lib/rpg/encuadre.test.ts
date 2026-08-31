import { describe, expect, it } from 'vitest';

import {
  VISTA_SEGURA,
  ZOOM,
  encuadreDeDos,
  encuadreDeUno,
  mereceMoverse,
} from '@/lib/rpg/encuadre';

/**
 * Puestos reales de la sala del Capítulo 0. Si cambian en `CourtroomScene`,
 * cambiarlos aquí: estas pruebas valen por ser concretas.
 */
const ESTRADO_IZQ = { x: 504, y: 176 };
const ESTRADO_CENTRO = { x: 640, y: 176 };
const ESTRADO_DER = { x: 776, y: 176 };
const TESTIGO = { x: 968, y: 300 };
const FISCALIA = { x: 372, y: 452 };
const DEFENSA = { x: 908, y: 452 };

/** ¿Caben los dos dentro de la ventana segura con este encuadre? */
function ambosDentro(a: { x: number; y: number }, b: { x: number; y: number }) {
  const e = encuadreDeDos(a, b);
  const medioAncho = VISTA_SEGURA.ancho / e.zoom / 2;
  const medioAlto = VISTA_SEGURA.alto / e.zoom / 2;
  return [a, b].every(
    (p) => Math.abs(p.x - e.x) <= medioAncho && Math.abs(p.y - e.y) <= medioAlto,
  );
}

describe('encuadre de una persona', () => {
  it('la centra', () => {
    const e = encuadreDeUno(TESTIGO, 1.4);
    expect(e.x).toBe(TESTIGO.x);
    expect(e.y).toBe(TESTIGO.y);
  });

  it('se acerca lo suficiente para que se le vea la cara', () => {
    // El sprite mide 48 px de celda y la cabeza es una fracción de eso. Con el
    // tope anterior —1.35— la cara quedaba en unos treinta píxeles y no se
    // distinguía a quién se estaba escuchando.
    expect(encuadreDeUno({ x: 640, y: 176 }, 1.2).zoom).toBeGreaterThanOrEqual(1.5);
    expect(encuadreDeUno(TESTIGO, 1.4).zoom).toBeGreaterThanOrEqual(1.5);
  });

  it('no se acerca tanto como para enseñar el pixelado', () => {
    expect(encuadreDeUno(TESTIGO, 9).zoom).toBeLessThanOrEqual(ZOOM.max);
    expect(encuadreDeUno(TESTIGO, 0.1).zoom).toBeGreaterThanOrEqual(ZOOM.min);
  });
});

describe('encuadre de dos que se hablan', () => {
  it('los pone a los dos dentro del plano', () => {
    expect(ambosDentro(FISCALIA, TESTIGO), 'fiscal y testigo').toBe(true);
    expect(ambosDentro(DEFENSA, TESTIGO), 'defensa y testigo').toBe(true);
    expect(ambosDentro(DEFENSA, ESTRADO_CENTRO), 'defensa y presidenta').toBe(true);
    expect(ambosDentro(FISCALIA, ESTRADO_CENTRO), 'fiscal y presidenta').toBe(true);
    expect(ambosDentro(ESTRADO_IZQ, ESTRADO_DER), 'los dos extremos del tribunal').toBe(true);
  });

  it('va al punto medio de los dos', () => {
    const e = encuadreDeDos(FISCALIA, DEFENSA);
    expect(e.x).toBe((FISCALIA.x + DEFENSA.x) / 2);
    expect(e.y).toBe((FISCALIA.y + DEFENSA.y) / 2);
  });

  it('se abre más cuanto más lejos están', () => {
    const juntos = encuadreDeDos(ESTRADO_IZQ, ESTRADO_CENTRO);
    const lejos = encuadreDeDos(FISCALIA, TESTIGO);
    expect(lejos.zoom).toBeLessThan(juntos.zoom);
  });

  it('nunca se abre tanto como para enseñar el borde del mundo', () => {
    const e = encuadreDeDos({ x: 0, y: 0 }, { x: 1280, y: 720 });
    expect(e.zoom).toBeGreaterThanOrEqual(ZOOM.min);
  });
});

describe('umbral de movimiento', () => {
  it('no mueve la cámara cuando habla dos veces la misma persona', () => {
    const uno = encuadreDeUno(TESTIGO, 1.4);
    expect(mereceMoverse(uno, encuadreDeUno(TESTIGO, 1.4))).toBe(false);
  });

  it('sí la mueve cuando cambia quien habla', () => {
    const desde = encuadreDeUno(TESTIGO, 1.4);
    expect(mereceMoverse(desde, encuadreDeUno(FISCALIA, 1.3))).toBe(true);
  });

  it('sí la mueve cuando el mismo hablante empieza a dirigirse a alguien', () => {
    const solo = encuadreDeUno(TESTIGO, 1.4);
    expect(mereceMoverse(solo, encuadreDeDos(TESTIGO, DEFENSA))).toBe(true);
  });

  it('aguanta un temblor de un píxel sin reaccionar', () => {
    const a = encuadreDeUno(TESTIGO, 1.4);
    const b = encuadreDeUno({ x: TESTIGO.x + 1, y: TESTIGO.y + 1 }, 1.4);
    expect(mereceMoverse(a, b)).toBe(false);
  });
});
