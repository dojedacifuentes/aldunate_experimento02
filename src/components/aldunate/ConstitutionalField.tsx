'use client';

import { useEffect, useRef } from 'react';
import type * as THREE_NS from 'three';

import { conceptEdges, conceptsWithCounts } from '@/data/aldunate';

/**
 * Campo de conocimiento tras el retrato.
 *
 * No es un fondo decorativo: cada punto es un concepto del corpus y cada línea
 * una coocurrencia real entre dos conceptos en una obra publicada. El radio
 * del punto sale del número de obras; el grosor de la línea, del número de
 * obras compartidas. Si mañana entra una publicación al catálogo, la figura
 * cambia sola.
 *
 * Reglas que este componente cumple y conviene no romper:
 *
 * - **Nada esencial vive aquí.** Toda la información del grafo está también en
 *   el DOM, en el mapa conceptual navegable. Si WebGL falla, no se pierde nada
 *   (encargo §40, §42).
 * - Se importa dinámicamente y sin SSR desde la página; `three` no entra en el
 *   bundle de ninguna otra ruta.
 * - Se detiene cuando el lienzo sale de la pantalla o la pestaña pasa a
 *   segundo plano. Un campo de estrellas invisible no gasta GPU.
 * - `prefers-reduced-motion` congela el movimiento en el primer fotograma:
 *   queda una composición estática, que sigue siendo legible.
 * - El retrato NO está dentro del canvas. Es un `next/image` del DOM, encima.
 *   Así conserva nitidez, indexación y accesibilidad (encargo §48).
 */
export default function ConstitutionalField() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // Import dinámico dentro del efecto: nunca se ejecuta en el servidor y solo
    // se descarga cuando el componente llega a montarse de verdad.
    void import('three').then((THREE) => {
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        // Sin WebGL no hay nada que hacer aquí, y no hace falta: el contenido
        // está en el DOM. Se deja el hueco vacío y en silencio.
        return;
      }

      /*
       * Los colores salen del tema, no del componente.
       *
       * Estaban escritos a mano en hexadecimal, contra CLAUDE.md §5, y eso
       * traía la paleta nocturna al modo institucional: en tema claro el campo
       * seguía pintando el mismo azul frío sobre un fondo hueso. Ahora se leen
       * de las variables CSS al montar, que es cuando el tema ya está aplicado.
       */
      const css = getComputedStyle(document.documentElement);
      function token(nombre: string, respaldo: number) {
        const v = css.getPropertyValue(nombre).trim();
        if (!v.startsWith('#')) return respaldo;
        const hex = v.slice(1);
        const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
        const n = Number.parseInt(full.slice(0, 6), 16);
        return Number.isFinite(n) ? n : respaldo;
      }

      const colorNodo = token('--primary', 0x5fa8d8);
      const colorArista = token('--signal', 0x4b90c4);

      const reduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* ── Escena ── */

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 14);

      renderer.setClearColor(0x000000, 0);
      // Tope de DPR: por encima de 2 el coste sube y la diferencia no se ve.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      host.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      Object.assign(renderer.domElement.style, {
        width: '100%',
        height: '100%',
        display: 'block',
      });

      /* ── Nodos: un concepto, un punto ── */

      const nodes = conceptsWithCounts;
      const index = new Map(nodes.map((n, i) => [n.id, i]));
      const maxCount = Math.max(...nodes.map((n) => n.count));

      // Distribución en espiral de Fibonacci sobre una esfera: reparte los
      // puntos sin agrupamientos, y es determinista — la figura es la misma en
      // cada carga, que es lo que se espera de un diagrama, no de un fondo.
      const golden = Math.PI * (3 - Math.sqrt(5));
      const positions = nodes.map((node, i) => {
        const y = 1 - (i / Math.max(nodes.length - 1, 1)) * 2;
        const radius = Math.sqrt(Math.max(1 - y * y, 0));
        const theta = golden * i;
        // Los conceptos con más obras se acercan al centro.
        const shell = 5.6 - (node.count / maxCount) * 1.6;
        return new THREE.Vector3(
          Math.cos(theta) * radius * shell,
          y * shell * 0.82,
          Math.sin(theta) * radius * shell,
        );
      });

      const group = new THREE.Group();
      scene.add(group);

      const pointGeometry = new THREE.BufferGeometry().setFromPoints(positions);
      const sizes = new Float32Array(
        nodes.map((n) => 4 + (n.count / maxCount) * 12),
      );
      pointGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const pointMaterial = new THREE.PointsMaterial({
        color: colorNodo,
        size: 0.16,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      group.add(new THREE.Points(pointGeometry, pointMaterial));

      /* ── Aristas: una coocurrencia, una línea ── */

      // Se agrupan por peso para que el grosor signifique algo sin abrir una
      // draw call por arista. Tres materiales cubren todo el grafo.
      const byWeight = new Map<number, THREE_NS.Vector3[]>();
      for (const edge of conceptEdges) {
        const a = index.get(edge.source);
        const b = index.get(edge.target);
        if (a === undefined || b === undefined) continue;
        const bucket = Math.min(edge.weight, 3);
        const list = byWeight.get(bucket) ?? [];
        list.push(positions[a], positions[b]);
        byWeight.set(bucket, list);
      }

      const materialesArista: InstanceType<typeof THREE.LineBasicMaterial>[] = [];

      for (const [weight, points] of byWeight) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: colorArista,
          transparent: true,
          opacity: 0.1 + weight * 0.075,
          depthWrite: false,
        });
        materialesArista.push(material);
        group.add(new THREE.LineSegments(geometry, material));
      }

      /*
       * El campo sigue al tema mientras está montado.
       *
       * Leer los tokens una sola vez dejaba el lienzo con la paleta del tema
       * que hubiera al cargar: quien conmuta a institucional se quedaba con el
       * azul nocturno hasta recargar. El conmutador cambia una clase y un
       * atributo del `<html>`, así que basta con observarlos.
       */
      // `css` es el objeto vivo que devuelve `getComputedStyle`: relee el valor
      // vigente en cada consulta, así que `token` no necesita recalcularse.
      const observadorTema = new MutationObserver(() => {
        pointMaterial.color.setHex(token('--primary', 0x5fa8d8));
        const arista = token('--signal', 0x4b90c4);
        for (const m of materialesArista) m.color.setHex(arista);
        render(0);
      });
      observadorTema.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });

      /* ── Movimiento ── */

      const pointer = { x: 0, y: 0 };
      const eased = { x: 0, y: 0 };

      function onPointerMove(event: PointerEvent) {
        const rect = host!.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      }
      if (!reduced) window.addEventListener('pointermove', onPointerMove, { passive: true });

      function resize() {
        const { clientWidth: w, clientHeight: h } = host!;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(host);

      /* ── Bucle, con pausa ── */

      let frame = 0;
      let visible = true;
      let running = false;

      // Una vuelta completa cada ~110 s. El encargo pedía entre 80 y 150.
      //
      // El paso se calcula por milisegundo, no por fotograma, porque el bucle
      // no corre a 60 fps: a esta velocidad, un fotograma de 60 fps mueve la
      // escena 0,0009 rad —invisible— y mantener el hilo principal ocupado
      // sesenta veces por segundo para eso es puro desperdicio. Con 24 fps la
      // figura se ve idéntica y la página alcanza reposo, que además es la
      // condición para que un navegador dé por terminada la carga.
      const RAD_PER_MS = (Math.PI * 2) / (110 * 1000);
      const FRAME_MS = 1000 / 24;
      let last = 0;

      function render(deltaMs: number) {
        // El suavizado también se normaliza: atado al fotograma, el retardo
        // cambiaría con la tasa de refresco del monitor.
        const k = Math.min(deltaMs / FRAME_MS, 3) * 0.085;
        eased.x += (pointer.x - eased.x) * k;
        eased.y += (pointer.y - eased.y) * k;

        group.rotation.y += RAD_PER_MS * deltaMs;
        group.rotation.x = eased.y * 0.14;
        group.rotation.z = eased.x * 0.045;
        camera.position.x = eased.x * 0.5;
        camera.position.y = -eased.y * 0.35;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }

      function loop(now: number) {
        if (!running) return;
        frame = requestAnimationFrame(loop);
        const delta = now - last;
        if (delta < FRAME_MS) return;
        last = now;
        render(delta);
      }

      function start() {
        if (running || reduced) return;
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
      function stop() {
        running = false;
        cancelAnimationFrame(frame);
      }

      const intersection = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !document.hidden) start();
          else stop();
        },
        { threshold: 0.01 },
      );
      intersection.observe(host);

      function onVisibility() {
        if (document.hidden) stop();
        else if (visible) start();
      }
      document.addEventListener('visibilitychange', onVisibility);

      // Con `reduced`, un único fotograma: la figura queda quieta pero visible.
      render(0);
      if (!reduced) start();

      cleanup = () => {
        stop();
        observadorTema.disconnect();
        intersection.disconnect();
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pointermove', onPointerMove);
        group.traverse((child) => {
          const mesh = child as unknown as {
            geometry?: { dispose(): void };
            material?: { dispose(): void };
          };
          mesh.geometry?.dispose();
          mesh.material?.dispose();
        });
        // `dispose()` libera programas y render targets, pero no devuelve el
        // contexto WebGL. Un navegador admite del orden de dieciséis vivos: en
        // una aplicación de una sola página que entra y sale de esta ruta, se
        // agotan y el lienzo deja de pintar sin dar ningún error.
        renderer.forceContextLoss();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      // `interactive-only` la retira en impresión (globals.css).
      className="interactive-only pointer-events-none absolute inset-0 -z-10"
    />
  );
}
