/**
 * Encuadre de la cámara de la sala.
 *
 * Vive fuera de la escena Phaser por una razón práctica: es la única parte de
 * la cinematografía que se puede equivocar en silencio. Un encuadre malo no
 * lanza ningún error —simplemente deja a alguien fuera de plano—, y aquí, como
 * función pura, se puede comprobar sin navegador.
 *
 * Convenio: el mundo mide 1280×720 y la cámara se mueve dentro de él. La
 * ventana segura no es el lienzo: el lienzo se recorta arriba y abajo para
 * llenar el hueco de la cabina (`Scale.ENVELOP`, D-027), así que encuadrar
 * contra 720 px de alto dejaría gente fuera en cuanto la pantalla fuese baja.
 */

export interface Punto {
  x: number;
  y: number;
}

export interface Encuadre {
  x: number;
  y: number;
  zoom: number;
}

export interface Ventana {
  ancho: number;
  alto: number;
}

/** Ventana segura por defecto, ya descontado el recorte de ENVELOP. */
export const VISTA_SEGURA: Ventana = { ancho: 1120, alto: 400 };

/** Márgenes alrededor de las personas encuadradas. Un plano pegado incomoda. */
const AIRE = { x: 260, y: 200 };

/** Límites de zoom. Por debajo se ve el borde del mundo; por encima, poros. */
export const ZOOM = { min: 0.85, max: 1.4 } as const;

export function acotar(valor: number, min: number, max: number): number {
  return Math.min(Math.max(valor, min), max);
}

/**
 * Encuadre de una sola persona.
 *
 * El zoom lo propone el puesto —una testigo se mira más de cerca que el
 * público— y aquí sólo se acota.
 */
export function encuadreDeUno(persona: Punto, zoomDelPuesto: number): Encuadre {
  return {
    x: persona.x,
    y: persona.y,
    zoom: acotar(zoomDelPuesto, ZOOM.min, 1.35),
  };
}

/**
 * Encuadre de dos personas que se hablan.
 *
 * Punto medio y la apertura justa para que quepan las dos con aire. Es lo que
 * hace legible un contrainterrogatorio: se ve quién pregunta y quién tiene que
 * contestar, sin cortar a ninguno.
 */
export function encuadreDeDos(a: Punto, b: Punto, vista: Ventana = VISTA_SEGURA): Encuadre {
  const dx = Math.abs(a.x - b.x) + AIRE.x;
  const dy = Math.abs(a.y - b.y) + AIRE.y;
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    zoom: acotar(Math.min(vista.ancho / dx, vista.alto / dy), ZOOM.min, ZOOM.max),
  };
}

/**
 * ¿Hace falta mover la cámara?
 *
 * Dos líneas seguidas de la misma persona piden el mismo encuadre. Sin umbral,
 * la cámara rearranca el tween en cada línea: un temblor pequeño y constante
 * que era buena parte de lo que se veía mal.
 */
export function mereceMoverse(actual: Encuadre, nuevo: Encuadre): boolean {
  return (
    Math.abs(nuevo.x - actual.x) >= 24 ||
    Math.abs(nuevo.y - actual.y) >= 24 ||
    Math.abs(nuevo.zoom - actual.zoom) >= 0.04
  );
}
