import type { FocusTarget } from '@/types/game';

/**
 * Bus de eventos entre React y Phaser.
 *
 * React nunca toca la escena y la escena nunca lee el store. Todo pasa por
 * aquí, en un solo sentido por evento. Es la costura que permitirá cambiar el
 * renderizador —o quitarlo— sin tocar la lógica del juego.
 */
export interface EventosJuego {
  /** La cámara mira a un punto de la sala. Encuadre de entrada al nodo. */
  enfocar: { objetivo: FocusTarget };
  /**
   * Habla alguien concreto.
   *
   * `personaje` es el `CharacterId`, no el puesto: en el estrado hay tres
   * jueces y sólo gesticula el que habla. `hacia` es a quién se dirige; si
   * viene, la cámara abre lo justo para que quepan los dos, que es la única
   * forma de que se entienda quién le está hablando a quién.
   */
  hablar: { personaje: string; puesto: FocusTarget; hacia?: string };
  /** Alguien reacciona sin hablar. Es lo que hace que la sala parezca viva. */
  reaccionar: { personaje: string; tipo: 'asentir' | 'negar' | 'sobresalto' };
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
