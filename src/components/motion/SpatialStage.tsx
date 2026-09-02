'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Motor de movimiento y de luz del sitio.
 *
 * Sucede a `MotionStage`, que hacía esto mismo pero sólo en `/aldunate`. Es el
 * mismo motor con dos añadidos —el reflejo del puntero y la profundidad al
 * desplazar— y una diferencia de fondo: vive en el layout raíz, así que sirve
 * a las dieciséis rutas.
 *
 * ── Por qué uno solo y no uno por componente ──
 *
 * Ocho componentes con su propio `IntersectionObserver`, su propio listener de
 * scroll y su propio `requestAnimationFrame` son ocho callbacks compitiendo en
 * el hilo principal en cada fotograma. Se nota exactamente donde importa: al
 * hacer scroll rápido. Aquí hay **un** observador para todas las apariciones,
 * **un** listener de scroll pasivo, **un** listener de puntero delegado y
 * **un** ticker, que además sólo se despierta si algo cambió.
 *
 * Ese es el motivo de que la biblioteca de animación del proyecto
 * (Framer Motion) no gobierne esta capa: por elemento es cómoda, pero monta un
 * ciclo de React por cada uno. Aquí el trabajo por fotograma es escribir una
 * variable CSS, y de ahí en adelante anima el compositor.
 *
 * ── Qué se anima ──
 *
 * Nada que provoque maquetación. Las apariciones son `opacity` y `transform`;
 * el hero publica un progreso 0→1 en `--hero-p`, el scroll publica `--scroll-y`
 * y el puntero publica `--lx` / `--ly`, y el CSS decide qué hacer con los tres.
 * Los contadores escriben texto, que es la única excepción, y ocurren una vez.
 */

/**
 * Tope del desplazamiento que alimenta la profundidad.
 *
 * Sin tope, un elemento con `--depth: 0.03` se ha desplazado 150 px al llegar
 * a los 5000 de scroll y acaba fuera de su sitio. Con tope, el paralaje se
 * satura: hace su trabajo en la primera pantalla y media, que es donde se ve,
 * y después se queda quieto.
 */
const DEPTH_MAX = 1200;

export function SpatialStage() {
  /*
   * La ruta es la dependencia, y no es un detalle.
   *
   * En el App Router este componente se monta una vez y sobrevive a todas las
   * navegaciones de cliente. Un efecto con `[]` observaría los elementos de la
   * primera página visitada y de ninguna más: a partir del segundo clic, todo
   * lo que llevara `data-reveal` se quedaría en `opacity: 0` para siempre.
   * Volver a escanear en cada ruta es lo que hace que esto pueda ser global.
   */
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // Se marca el documento antes de observar nada: el CSS sólo esconde los
    // elementos cuando sabe que hay quien vuelva a mostrarlos.
    root.classList.add('motion');

    /* ── 1. Apariciones ── */

    const revealables = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];

    if (reduced) {
      revealables.forEach((el) => el.classList.add('revealed'));
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add('revealed');
          // Se deja de observar en cuanto aparece: es un gesto de una vez, no
          // un elemento que se desvanece al volver a subir. Eso último cansa.
          reveal.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );

    revealables.forEach((el) => reveal.observe(el));

    /**
     * Red de seguridad.
     *
     * El estado inicial de una aparición es `opacity: 0`. Si el observador no
     * llega a disparar, ese contenido no se ve nunca — y no es hipotético:
     * ocurre con la pestaña congelada en segundo plano, y se reprodujo al
     * medir estas páginas con el panel oculto. A los tres segundos se revela
     * todo lo que siga escondido, sin condiciones.
     *
     * Un texto que aparece de golpe es un defecto estético. Un texto que no
     * aparece nunca es una página rota.
     */
    const safety = window.setTimeout(() => {
      revealables.forEach((el) => el.classList.add('revealed'));
    }, 3000);

    /* ── 2. Longitud real de los arcos, para trazarlos ── */

    // `stroke-dasharray` necesita la longitud del trazo, y sólo el navegador
    // la conoce. Se mide una vez y se guarda como variable CSS.
    document.querySelectorAll<SVGPathElement>('[data-draw] path').forEach((path, i) => {
      const len = Math.ceil(path.getTotalLength());
      path.style.setProperty('--len', String(len));
      path.style.setProperty('--i', String(i));
    });

    /* ── 3. Progreso del hero y profundidad ── */

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    // El paralaje cuesta una escritura de variable en `<html>` por fotograma,
    // y eso recalcula estilo en todo el árbol. No se paga en las páginas que
    // no lo usan.
    const hasDepth = document.querySelector('[data-depth]') !== null;

    let pending = 0;
    let lastP = -1;
    let lastY = -1;

    function publish() {
      pending = 0;

      if (hero) {
        const height = hero.offsetHeight || 1;
        // 0 arriba del todo, 1 cuando el hero ya salió por completo.
        const p = Math.min(Math.max(window.scrollY / height, 0), 1);
        // Dos decimales bastan: por debajo de eso el cambio no se ve y sólo
        // ensucia el estilo en cada fotograma.
        const rounded = Math.round(p * 100) / 100;
        if (rounded !== lastP) {
          lastP = rounded;
          hero.style.setProperty('--hero-p', String(rounded));
        }
      }

      if (hasDepth) {
        const y = Math.min(window.scrollY, DEPTH_MAX);
        // Al píxel: por debajo no se distingue y cada escritura recalcula
        // estilo en todo lo que lea la variable.
        const rounded = Math.round(y);
        if (rounded !== lastY) {
          lastY = rounded;
          root.style.setProperty('--scroll-y', `${rounded}px`);
        }
      }
    }

    /**
     * Se cancela el fotograma anterior en vez de guardar un pestillo booleano.
     *
     * Con un pestillo, si `requestAnimationFrame` nunca llega a ejecutarse
     * —y no llega cuando la pestaña está en segundo plano— la bandera se queda
     * en `true` y el scroll deja de actualizar **para siempre**, también al
     * volver. Se detectó midiendo con el panel oculto. Cancelar y volver a
     * pedir no tiene ese estado que se pueda quedar atascado.
     */
    function onScroll() {
      if (pending) cancelAnimationFrame(pending);
      pending = requestAnimationFrame(publish);
    }

    // Al recuperar el foco, la posición pudo cambiar sin que corriera ningún
    // fotograma. Se recalcula de una vez en lugar de esperar al próximo scroll.
    function onVisible() {
      if (!document.hidden) publish();
    }

    const wantsScroll = (Boolean(hero) || hasDepth) && !reduced;

    if (wantsScroll) {
      publish();
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVisible);
    }

    /* ── 4. Reflejo del puntero ── */

    /**
     * Un solo listener delegado para todas las tarjetas de la página.
     *
     * La alternativa —un `onMouseMove` por tarjeta— son veinte listeners y
     * veinte renders de React en una rejilla de catálogo. Aquí sólo se escribe
     * en la tarjeta que está debajo del cursor, y como mucho una vez por
     * fotograma.
     */
    let lit: HTMLElement | null = null;
    let lightFrame = 0;
    let px = 0;
    let py = 0;

    function apagar() {
      if (!lit) return;
      lit.removeAttribute('data-lit');
      lit = null;
    }

    function paintLight() {
      lightFrame = 0;
      if (!lit) return;
      // Una lectura de geometría por fotograma y por una sola tarjeta. Se lee
      // antes de escribir, así que no encadena reflow con la escritura previa.
      const r = lit.getBoundingClientRect();
      lit.style.setProperty('--lx', `${Math.round(px - r.left)}px`);
      lit.style.setProperty('--ly', `${Math.round(py - r.top)}px`);
      // La luz se enciende **después** de tener posición: encenderla antes la
      // haría aparecer en la esquina y cruzar la tarjeta en diagonal.
      lit.setAttribute('data-lit', '');
    }

    function onPointerMove(e: PointerEvent) {
      // En una pantalla táctil no hay cursor que reflejar: el halo se quedaría
      // encendido donde se tocó por última vez, que es peor que no tenerlo.
      if (e.pointerType !== 'mouse') return;

      const target = e.target as Element | null;
      const card = target?.closest?.('[data-spatial]') as HTMLElement | null;

      if (card !== lit) {
        apagar();
        lit = card;
      }
      if (!card) return;

      px = e.clientX;
      py = e.clientY;
      if (lightFrame) return;
      lightFrame = requestAnimationFrame(paintLight);
    }

    if (!reduced) {
      document.addEventListener('pointermove', onPointerMove, { passive: true });
      // Sacar el ratón por el borde de la ventana no dispara `pointermove`:
      // sin esto, la última tarjeta se queda iluminada indefinidamente.
      document.addEventListener('pointerleave', apagar);
    }

    /* ── 5. Contadores ── */

    // Sólo los marcados, y una sola vez. Un número que sube es un gesto de
    // bienvenida; repetido en cada sección es un tic.
    const counters = [...document.querySelectorAll<HTMLElement>('[data-count]')];

    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          countObserver.unobserve(el);

          const target = Number(el.dataset.count);
          if (!Number.isFinite(target) || reduced) {
            el.textContent = String(target);
            continue;
          }

          const DURATION = 900;
          const start = performance.now();

          /**
           * Garantía de aterrizaje.
           *
           * El contador reemplaza el número servido por uno intermedio, y si
           * los fotogramas se detienen a mitad —la pestaña pasa a segundo
           * plano, el sistema throttlea— el número se queda congelado en un
           * valor **falso** y no se corrige nunca. Se llegó a ver «1 obras»
           * en una captura: un dato inventado en la primera pantalla, que es
           * bastante peor que no animar nada.
           *
           * Este temporizador escribe el valor final pase lo que pase. El
           * bucle lo cancela si llega a terminar por su cuenta.
           */
          const land = window.setTimeout(() => {
            el.textContent = String(target);
          }, DURATION + 400);

          const step = (now: number) => {
            const t = Math.min((now - start) / DURATION, 1);
            // Misma curva que el resto del movimiento: el número se posa.
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = String(Math.round(target * eased));
            if (t < 1) {
              requestAnimationFrame(step);
            } else {
              window.clearTimeout(land);
              el.textContent = String(target);
            }
          };

          el.textContent = '0';
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );

    counters.forEach((el) => countObserver.observe(el));

    return () => {
      window.clearTimeout(safety);
      reveal.disconnect();
      countObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisible);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', apagar);
      if (pending) cancelAnimationFrame(pending);
      if (lightFrame) cancelAnimationFrame(lightFrame);
      apagar();
      root.style.removeProperty('--scroll-y');
      root.classList.remove('motion');
    };
  }, [pathname]);

  return null;
}
