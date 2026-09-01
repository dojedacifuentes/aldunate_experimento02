'use client';

import { useEffect } from 'react';

/**
 * Motor de movimiento de la página.
 *
 * ── Por qué uno solo y no uno por componente ──
 *
 * Ocho componentes con su propio `IntersectionObserver`, su propio listener de
 * scroll y su propio `requestAnimationFrame` son ocho callbacks compitiendo en
 * el hilo principal en cada fotograma. Se nota exactamente donde importa: al
 * hacer scroll rápido. Aquí hay **un** observador para todas las apariciones,
 * **un** listener de scroll pasivo y **un** ticker, que además solo se
 * despierta si el scroll cambió algo.
 *
 * Ese es el motivo de que la biblioteca de animación del proyecto
 * (Framer Motion) no se use en esta ruta: por elemento es cómoda, pero monta
 * un ciclo de React por cada uno. Aquí el trabajo por fotograma es escribir
 * una variable CSS, y de ahí en adelante anima el compositor.
 *
 * ── Qué se anima ──
 *
 * Nada que provoque maquetación. Las apariciones son `opacity` y `transform`;
 * el hero publica un progreso 0→1 en `--hero-p` y el CSS decide qué hacer con
 * él. Los contadores escriben texto, que es la única excepción, y ocurren una
 * vez.
 */
export function MotionStage() {
  useEffect(() => {
    const root = document.documentElement;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // Se marca el documento antes de observar nada: el CSS solo esconde los
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
     * medir esta misma página con el panel oculto. A los tres segundos se
     * revela todo lo que siga escondido, sin condiciones.
     *
     * Un texto que aparece de golpe es un defecto estético. Un texto que no
     * aparece nunca es una página rota.
     */
    const safety = window.setTimeout(() => {
      revealables.forEach((el) => el.classList.add('revealed'));
    }, 3000);

    /* ── 2. Longitud real de los arcos, para trazarlos ── */

    // `stroke-dasharray` necesita la longitud del trazo, y solo el navegador
    // la conoce. Se mide una vez y se guarda como variable CSS.
    document.querySelectorAll<SVGPathElement>('[data-draw] path').forEach((path, i) => {
      const len = Math.ceil(path.getTotalLength());
      path.style.setProperty('--len', String(len));
      path.style.setProperty('--i', String(i));
    });

    /* ── 3. Progreso del hero ── */

    const hero = document.querySelector<HTMLElement>('[data-hero]');
    let pending = 0;
    let lastP = -1;

    function publish() {
      pending = 0;
      if (!hero) return;
      const height = hero.offsetHeight || 1;
      // 0 arriba del todo, 1 cuando el hero ya salió por completo.
      const p = Math.min(Math.max(window.scrollY / height, 0), 1);
      // Dos decimales bastan: por debajo de eso el cambio no se ve y solo
      // ensucia el estilo en cada fotograma.
      const rounded = Math.round(p * 100) / 100;
      if (rounded === lastP) return;
      lastP = rounded;
      hero.style.setProperty('--hero-p', String(rounded));
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

    if (hero && !reduced) {
      publish();
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVisible);
    }

    /* ── 4. Contadores ── */

    // Solo los del hero, y una sola vez. Un número que sube es un gesto de
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

          const step = (now: number) => {
            const t = Math.min((now - start) / DURATION, 1);
            // Misma curva que el resto del movimiento: el número se posa.
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = String(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(step);
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
      if (pending) cancelAnimationFrame(pending);
      root.classList.remove('motion');
    };
  }, []);

  return null;
}
