import * as Phaser from 'phaser';

import { CourtroomScene, DIMENSIONES, type Nombres, type Reparto } from './CourtroomScene';

/**
 * Arranque de Phaser.
 *
 * Este módulo se importa **dinámicamente** y sólo desde el navegador: contiene
 * el motor entero y no debe entrar en el bundle de ninguna otra ruta ni
 * ejecutarse durante el render en servidor.
 */
export async function crearJuego(
  padre: HTMLElement,
  reparto: Reparto,
  nombres: Nombres = {},
): Promise<Phaser.Game> {
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
      /*
       * ENVELOP, no FIT.
       *
       * La escena no impone alto a la página: se conforma con el hueco que le
       * deje la cabina (D-027). Ese hueco es ancho y bajo, y con FIT la sala
       * quedaba encajada en 311 px dentro de un hueco de 1082, con 770 px de
       * franjas negras a los lados: un sello, no un tribunal. ENVELOP cubre el
       * hueco y recorta arriba y abajo, que es lo que hace una cámara.
       *
       * La proporción se conserva en ambos casos; nadie se deforma. Lo que
       * cambia es qué sobra: antes sobraba fondo a los lados, ahora sobra
       * techo y suelo, que es donde no pasa nada.
       */
      mode: Phaser.Scale.ENVELOP,
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
    scene: [new CourtroomScene(reparto, nombres)],
  });
}

export type { Nombres, Reparto };
