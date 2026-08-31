import type { FocusTarget } from '@/types/game';

/**
 * Bus de eventos entre React y Phaser.
 *
 * React nunca toca la escena y la escena nunca lee el store. Todo pasa por
 * aquí, en un solo sentido por evento. Es la costura que permitirá cambiar el
 * renderizador —o quitarlo— sin tocar la lógica del juego.
 */
export interface EventosJuego {
  /** La cámara mira a un punto de la sala. */
  enfocar: { objetivo: FocusTarget };
  /** Alguien habla: el actor de ese puesto gesticula y los demás reposan. */
  hablar: { puesto: FocusTarget };
  /** Retroalimentación de acierto o error. */
  acierto: { intensidad?: number };
  fallo: Record<string, never>;
  /** Barrido de ANALIZAR sobre la sala. */
  escanear: Record<string, never>;
  /** La escena terminó de montarse y acepta eventos. */
  listo: Record<string, never>;
}

type Nombre = keyof EventosJuego;
type Handler<K extends Nombre> = (payload: EventosJuego[K]) => void;

const suscriptores = new Map<Nombre, Set<Handler<Nombre>>>();

export function on<K extends Nombre>(evento: K, handler: Handler<K>): () => void {
  const set = suscriptores.get(evento) ?? new Set();
  set.add(handler as Handler<Nombre>);
  suscriptores.set(evento, set);
  return () => {
    set.delete(handler as Handler<Nombre>);
  };
}

export function emit<K extends Nombre>(evento: K, payload: EventosJuego[K]): void {
  suscriptores.get(evento)?.forEach((handler) => {
    (handler as Handler<K>)(payload);
  });
}

/** Se llama al destruir la escena: evita handlers colgando entre navegaciones. */
export function limpiarBus(): void {
  suscriptores.clear();
}
