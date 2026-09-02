'use client';

/**
 * Modo lectura — el estado, sin interfaz.
 *
 * Nació dentro de `SectionNav` y por tanto sólo existía en `/aldunate`. El CSS
 * que lo aplica (`html[data-lectura]` en `globals.css`) siempre fue global:
 * lo único que ataba el modo a una ruta era dónde vivía el botón. Aquí se
 * separa el estado del control, de modo que la cabecera pueda ofrecerlo en las
 * dieciséis rutas y cualquier otra pieza pueda leerlo sin duplicarlo.
 *
 * ── Por qué el estado vive en el DOM y no en React ──
 *
 * Tiene que vivir en el `<html>` de todos modos —es CSS quien lo aplica— y
 * duplicarlo en un `useState` crea dos fuentes de verdad que se pueden
 * desincronizar. `useSyncExternalStore` lee el atributo directamente, que es
 * exactamente para lo que existe: estado externo a React, leído sin un render
 * en cascada.
 *
 * No es un tema. Un tema cambia cómo se ve lo mismo; esto cambia qué hay:
 * retira lienzos, halos, grano, barras pegajosas, reflejos y diagramas, y deja
 * el texto, las referencias y los catálogos. Es además lo que se imprime.
 */

const CLAVE = 'aldunate:lectura';
const EVENTO = 'aldunate:lectura-change';

/** Se conserva la clave anterior: quien ya tenía la preferencia no la pierde. */
export function leerModo(): boolean {
  return document.documentElement.hasAttribute('data-lectura');
}

/** En el servidor no hay DOM, y el modo por defecto es explorar. */
export function modoEnServidor(): boolean {
  return false;
}

export function suscribir(onChange: () => void): () => void {
  window.addEventListener(EVENTO, onChange);
  return () => window.removeEventListener(EVENTO, onChange);
}

export function aplicarModo(activo: boolean): void {
  const root = document.documentElement;
  if (activo) root.setAttribute('data-lectura', '');
  else root.removeAttribute('data-lectura');
  window.dispatchEvent(new Event(EVENTO));
}

/** Conmuta y persiste. Devuelve el estado resultante. */
export function alternarModo(): boolean {
  const siguiente = !leerModo();
  aplicarModo(siguiente);
  try {
    localStorage.setItem(CLAVE, siguiente ? '1' : '0');
  } catch {
    /* ventana privada o almacenamiento bloqueado: no sobrevive a la sesión */
  }
  return siguiente;
}

/** Restaura la preferencia guardada. Sólo toca el DOM y avisa. */
export function restaurarModo(): void {
  try {
    if (localStorage.getItem(CLAVE) === '1') aplicarModo(true);
  } catch {
    /* sin almacenamiento se queda en explorar, que es el valor por defecto */
  }
}
