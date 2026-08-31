import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Invariantes de la pantalla de juego.
 *
 * Vitest corre en Node y este proyecto no tiene navegador de pruebas, así que
 * no se puede comprobar `scrollHeight > clientHeight` de verdad. Lo que sí se
 * puede es cerrar la puerta a las tres formas concretas en que este layout se
 * rompió, que están documentadas en D-027:
 *
 *  1. una altura de pantalla dentro de un bloque incrustado (`min-h-screen`),
 *  2. un contenedor flexible sin `min-height: 0`, que nunca encoge,
 *  3. una barra de acciones metida dentro de la zona que se desplaza.
 *
 * No sustituye a recorrer las pantallas en el navegador. Sustituye a
 * redescubrir el mismo fallo dentro de seis meses.
 */

const RAIZ = join(process.cwd(), 'src');
const CSS = readFileSync(
  join(RAIZ, 'app/experimentos/juegos/ley-de-los-audaces/juego.css'),
  'utf8',
);

function archivosDe(dir: string, ext: string[]): string[] {
  return readdirSync(dir).flatMap((entrada) => {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) return archivosDe(ruta, ext);
    return ext.some((e) => entrada.endsWith(e)) ? [ruta] : [];
  });
}

describe('la cabina se mide contra el viewport', () => {
  it('ata su alto al viewport disponible y no al contenido', () => {
    expect(CSS).toMatch(/--cabina-alto:\s*calc\(100dvh\s*-\s*var\(--cabina-chrome\)\)/);
    expect(CSS).toMatch(/height:\s*var\(--cabina-alto\)/);
    expect(CSS).toMatch(/max-height:\s*var\(--cabina-alto\)/);
  });

  it('recorta lo que se salga en vez de empujar la página', () => {
    const bloque = CSS.slice(CSS.indexOf('.cabina-audaces {'), CSS.indexOf('/* ── Modales'));
    expect(bloque).toMatch(/overflow:\s*hidden/);
  });

  it('declara un valor de reserva para el cromo, por si el JS no llega', () => {
    expect(CSS).toMatch(/--cabina-chrome:\s*[\d.]+rem/);
  });
});

describe('el reparto de alto', () => {
  it('deja que la escena absorba la variación y que el panel no crezca', () => {
    // La escena con base cero: se queda con lo que sobre, nunca lo reclama.
    expect(CSS).toMatch(/flex:\s*1 1 0/);
    // El panel pide lo suyo y encoge; jamás crece por encima de su contenido.
    expect(CSS).toMatch(/flex:\s*0 1 auto/);
  });

  it('da `min-height: 0` a todos los contenedores que deben poder encoger', () => {
    for (const clase of [
      '.cabina-audaces .audaces-cuerpo',
      '.cabina-audaces .audaces-juego',
      '.cabina-audaces .audaces-panel',
      '.cabina-audaces .audaces-panel-cuerpo',
      '.cabina-audaces .audaces-hoja',
      '.cabina-audaces .audaces-hoja-cuerpo',
      '.cabina-audaces .audaces-modal-cuerpo',
    ]) {
      const i = CSS.indexOf(`${clase} {`);
      expect(i, `falta la regla de ${clase}`).toBeGreaterThan(-1);
      const regla = CSS.slice(i, CSS.indexOf('}', i));
      expect(regla, `${clase} sin min-height: 0`).toMatch(/min-height:\s*0/);
    }
  });

  it('confina el desplazamiento a los cuerpos, nunca a las barras de acciones', () => {
    for (const clase of [
      '.cabina-audaces .audaces-panel-cuerpo',
      '.cabina-audaces .audaces-hoja-cuerpo',
      '.cabina-audaces .audaces-modal-cuerpo',
    ]) {
      const i = CSS.indexOf(`${clase} {`);
      const regla = CSS.slice(i, CSS.indexOf('}', i));
      expect(regla, `${clase} debería desplazarse por dentro`).toMatch(/overflow-y:\s*auto/);
      expect(regla, `${clase} debería contener su scroll`).toMatch(/overscroll-behavior:\s*contain/);
    }

    const i = CSS.indexOf('.cabina-audaces .audaces-acciones {');
    const regla = CSS.slice(i, CSS.indexOf('}', i));
    expect(regla, 'la barra de acciones no puede desplazarse').not.toMatch(/overflow/);
  });
});

describe('nada del juego usa alturas de pantalla sueltas', () => {
  it('ningún componente del RPG usa `min-h-screen` ni `h-screen`', () => {
    const sospechosos = archivosDe(join(RAIZ, 'components/rpg'), ['.tsx', '.ts'])
      .concat(archivosDe(join(RAIZ, 'app/experimentos/juegos'), ['.tsx', '.css']))
      // Este propio archivo nombra el patrón que persigue.
      .filter((ruta) => !ruta.endsWith('.test.ts'))
      .filter((ruta) => /(^|[^-\w])(min-h-screen|h-screen)/.test(readFileSync(ruta, 'utf8')));

    // Un `100vh` dentro de un bloque incrustado en una página larga es
    // exactamente lo que producía 895 px de scroll antes de poder jugar.
    expect(sospechosos, `alturas de pantalla en: ${sospechosos.join(', ')}`).toEqual([]);
  });
});
