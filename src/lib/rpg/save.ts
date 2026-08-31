import type { EvidenceItem, Player } from '@/types/game';

/**
 * Versión del formato de guardado.
 *
 * Subirla obliga a escribir el paso correspondiente en `migrar()`. Un save que
 * no migra es un jugador que pierde su partida en un deploy.
 */
export const SAVE_VERSION = 2;

export const SAVE_KEY = 'audaces-save';

/**
 * Almacenamiento que nunca lanza.
 *
 * En navegación privada, con permisos restringidos o con la cuota llena,
 * `localStorage` puede lanzar incluso al leer la propiedad. Zustand se queda
 * entonces sin almacén, no completa la rehidratación y el juego no arranca: la
 * pantalla se queda en «Cargando…» para siempre.
 *
 * Con este envoltorio siempre hay un almacén. Si el del navegador falla, se usa
 * uno en memoria: la partida vive lo que dure la pestaña, que es infinitamente
 * mejor que no poder jugar.
 */
export function almacenamientoSeguro(): Storage {
  const memoria = new Map<string, string>();

  const real = (): Storage | null => {
    try {
      const s = globalThis.localStorage;
      // Probar de verdad: en algunos navegadores el objeto existe y falla al usarlo.
      const sonda = '__audaces_sonda__';
      s.setItem(sonda, '1');
      s.removeItem(sonda);
      return s;
    } catch {
      return null;
    }
  };

  return {
    getItem: (clave) => {
      try {
        return real()?.getItem(clave) ?? memoria.get(clave) ?? null;
      } catch {
        return memoria.get(clave) ?? null;
      }
    },
    setItem: (clave, valor) => {
      memoria.set(clave, valor);
      try {
        real()?.setItem(clave, valor);
      } catch {
        /* Sin persistencia entre sesiones, pero la partida sigue. */
      }
    },
    removeItem: (clave) => {
      memoria.delete(clave);
      try {
        real()?.removeItem(clave);
      } catch {
        /* Nada que hacer. */
      }
    },
    clear: () => memoria.clear(),
    key: () => null,
    get length() {
      return memoria.size;
    },
  } as Storage;
}

export interface SaveShape {
  saveVersion: number;
  creado: number;
  ultimoGuardado: number;
  player: Player | null;
  capitulo: string;
  nodeId: string | null;
  evidencias: EvidenceItem[];
  flags: Record<string, boolean>;
  impulso: number;
  combo: number;
  decisiones: { nodeId: string; opcionId: string; acierta: boolean }[];
  finales: string[];
}

/**
 * Migración hacia adelante.
 *
 * Recibe lo que había en `localStorage` y su versión, y devuelve algo que el
 * juego actual sabe leer. Nunca lanza: un save corrupto se descarta con un
 * estado inicial, porque perder la partida es malo pero no arrancar es peor.
 */
export function migrar(estado: unknown, version: number): Partial<SaveShape> {
  if (!estado || typeof estado !== 'object') return {};
  const datos = { ...(estado as Record<string, unknown>) } as Partial<SaveShape>;

  // v0 → v1: los saves anteriores a la numeración no tenían `decisiones`
  // ni `finales`, y guardaban el impulso como booleano.
  if (version < 1) {
    if (!Array.isArray(datos.decisiones)) datos.decisiones = [];
    if (!Array.isArray(datos.finales)) datos.finales = [];
    if (typeof datos.impulso !== 'number') datos.impulso = 0;
    if (typeof datos.combo !== 'number') datos.combo = 0;
  }

  /*
   * v1 → v2: el Capítulo 0 se reescribió.
   *
   * El tribunal pasó de uno a tres jueces, la apertura es otra y hay líneas
   * nuevas repartidas por todo el capítulo. Los identificadores de nodo siguen
   * siendo válidos, así que el save no está roto: está desactualizado. Retomarlo
   * a mitad significa no ver nunca la mitad de lo que cambió.
   *
   * Se conserva el personaje —nombre, avatar, especialidad, estadísticas— y se
   * suelta la posición. En la portada aparece «Continuar», que ahora arranca el
   * capítulo desde el principio. Nadie pierde su personaje en un deploy; lo que
   * se pierde es un punto de retorno a un texto que ya no existe.
   */
  if (version < 2) {
    const v2 = datos as Record<string, unknown>;
    v2.nodeId = null;
    v2.fase = 'portada';
  }

  // La fase se guarda para poder retomar el cierre de capítulo, pero sólo dos
  // valores merecen recuperarse. Una creación de personaje a medias no es un
  // punto al que valga la pena volver: se retoma desde la portada.
  const sueltos = datos as Record<string, unknown>;
  if (sueltos.fase !== 'juego' && sueltos.fase !== 'fin') sueltos.fase = 'portada';

  datos.saveVersion = SAVE_VERSION;
  return datos;
}

/** ¿El save es jugable, o hay que ofrecer partida nueva? */
export function saveUtilizable(datos: Partial<SaveShape> | null | undefined): boolean {
  if (!datos) return false;
  return Boolean(datos.player && datos.player.nombre && datos.nodeId);
}
