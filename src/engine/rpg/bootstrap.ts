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
      // FIT conserva la proporción 16:9 y encaja en el hueco que le deje la
      // cabina, sea cual sea. La escena no impone alto a la página: es al
      // revés. Ver D-027.
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    /*
     * El capítulo no tiene sonido —el audio está declarado como pendiente— y
     * Phaser abría igualmente un `AudioContext`. Al salir de la ruta, su
     * gestor seguía intentando suspenderlo sobre un contexto ya cerrado y
     * dejaba dos `InvalidStateError` en la consola. Sin audio no hay contexto
     * y no hay error.
     */
    audio: { noAudio: true },
    // Sin física: en el Capítulo 0 nadie se mueve. Se activará con el mapa.
    scene: [new CourtroomScene(reparto)],
  });
}

export type { Reparto };
