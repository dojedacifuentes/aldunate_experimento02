/**
 * XP, nivel, impulso y combo.
 *
 * Funciones puras y sin estado: son las únicas piezas del juego que se pueden
 * testear sin montar React ni Phaser, y por eso concentran las reglas.
 */

/** XP acumulada necesaria para alcanzar cada nivel. El índice es el nivel - 1. */
export const UMBRALES_NIVEL = [0, 120, 300, 560, 900, 1320, 1820, 2400] as const;

export function nivelDesde(xp: number): number {
  let nivel = 1;
  for (let i = 1; i < UMBRALES_NIVEL.length; i += 1) {
    if (xp >= UMBRALES_NIVEL[i]) nivel = i + 1;
  }
  return nivel;
}

/** Progreso [0,1] dentro del nivel actual. En el nivel máximo devuelve 1. */
export function progresoNivel(xp: number): number {
  const nivel = nivelDesde(xp);
  if (nivel >= UMBRALES_NIVEL.length) return 1;
  const base = UMBRALES_NIVEL[nivel - 1];
  const techo = UMBRALES_NIVEL[nivel];
  return Math.min(1, Math.max(0, (xp - base) / (techo - base)));
}

/* ─────────────────────────────── Impulso ─────────────────────────────── */

export const IMPULSO_MAX = 100;
export const IMPULSO_POR_ACIERTO = 34;

/**
 * Multiplicador de combo.
 *
 * Un acierto aislado no multiplica nada: el combo premia la cadena, no la
 * suerte. Tope en x4 para que la última decisión no valga más que todo el
 * resto de la escena.
 */
export function multiplicador(combo: number): number {
  if (combo >= 4) return 4;
  if (combo >= 3) return 3;
  if (combo >= 2) return 2;
  return 1;
}

export function impulsoTrasAcierto(impulso: number): number {
  return Math.min(IMPULSO_MAX, impulso + IMPULSO_POR_ACIERTO);
}

/** Fallar no vacía la barra: la baja a la mitad. Perder todo desalienta. */
export function impulsoTrasFallo(impulso: number): number {
  return Math.max(0, Math.floor(impulso / 2));
}

/** XP efectiva de una acción, aplicando el combo vigente al momento de actuar. */
export function xpConCombo(base: number, combo: number): number {
  return Math.round(base * multiplicador(combo));
}
