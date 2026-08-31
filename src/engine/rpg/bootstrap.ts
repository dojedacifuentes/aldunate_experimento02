import * as Phaser from 'phaser';

import { CourtroomScene, DIMENSIONES, type Reparto } from './CourtroomScene';

/**
 * Arranque de Phaser.
 *
 * Este módulo se importa **dinámicamente** y sólo desde el navegador: contiene
 * el motor entero y no debe entrar en el bundle de ninguna otra ruta ni
 * ejecutarse durante el render en servidor.
 */
export async function crearJuego(padre: HTMLElement, reparto: Reparto): Promise<Phaser.Game> {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: padre,
    width: DIMENSIONES.ANCHO,
    height: DIMENSIONES.ALTO,
    backgroundColor: '#12100F',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // Sin física: en el Capítulo 0 nadie se mueve. Se activará con el mapa.
    scene: [new CourtroomScene(reparto)],
  });
}

export type { Reparto };
