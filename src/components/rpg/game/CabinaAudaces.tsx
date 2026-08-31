'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { GameShell } from '@/components/rpg/game/GameShell';

/**
 * La cabina: el marco de pantalla del juego.
 *
 * Existe para resolver una cosa que el CSS no puede resolver solo: cuánto cromo
 * del sitio —franja de prototipo y cabecera pegajosa— hay por encima del juego.
 * Sin ese dato, «alto del viewport menos lo que ya ocupa la página» no se puede
 * escribir. Se mide una vez y se reobserva sólo cuando algo cambia de tamaño;
 * no hay sondeo ni manejadores de `scroll`.
 *
 * También ofrece el modo pantalla completa, que no es el del navegador: es la
 * cabina en `position: fixed`. Nadie debería tener que pulsar F11 para jugar.
 */
export function CabinaAudaces() {
  const marco = useRef<HTMLDivElement>(null);
  const [inmersiva, setInmersiva] = useState(false);

  /**
   * Distancia entre el inicio del documento y la cabina. La cabecera es
   * `sticky`, así que ocupa sitio en el flujo: esa distancia es exactamente el
   * cromo que hay que descontar para que el juego quepa sin desplazar la
   * página.
   *
   * A pantalla completa **no se mide**. La cabina está en `position: fixed` y
   * su distancia al inicio del documento es cero: guardarla convertía el cromo
   * en 0 px, y al salir la cabina se quedaba con el viewport entero empezando
   * por debajo de la cabecera, es decir, sobresaliendo justo lo que mide el
   * cromo.
   */
  const medir = useCallback(() => {
    const el = marco.current;
    if (!el || el.dataset.inmersiva === 'true') return;
    const arriba = el.getBoundingClientRect().top + window.scrollY;
    el.style.setProperty('--cabina-chrome', `${Math.max(0, Math.round(arriba))}px`);
  }, []);

  useLayoutEffect(() => {
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(document.body);
    return () => observador.disconnect();
  }, [medir]);

  /* Con el juego a pantalla completa, el documento de detrás no se desplaza. */
  useEffect(() => {
    if (!inmersiva) {
      // Al volver, la cabina ya no es `fixed`: ahora sí se puede medir.
      medir();
      return;
    }
    document.body.dataset.juegoInmersivo = 'true';
    return () => {
      delete document.body.dataset.juegoInmersivo;
    };
  }, [inmersiva, medir]);

  const alternarInmersiva = useCallback(() => setInmersiva((v) => !v), []);

  return (
    <div ref={marco} className="cabina-audaces" data-inmersiva={inmersiva || undefined}>
      <GameShell inmersiva={inmersiva} onAlternarInmersiva={alternarInmersiva} />
    </div>
  );
}
