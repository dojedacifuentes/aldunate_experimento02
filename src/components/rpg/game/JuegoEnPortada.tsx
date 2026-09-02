'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Gamepad2 } from 'lucide-react';

import { leerModo, modoEnServidor, suscribir } from '@/components/layout/reading-mode';

/**
 * El juego, jugable en la portada y sin un clic de por medio.
 *
 * ── El problema que resuelve ──
 *
 * «La Ley de los Audaces» se juega con Phaser, y Phaser son **1,17 MB**
 * medidos en un solo trozo. Importarlo desde la portada de la forma obvia lo
 * mete en el paquete inicial de la página que más se abre —normalmente para
 * leer un informe—, y `CLAUDE.md` §10 lo prohíbe con razón.
 *
 * La solución no es pedir un clic: es **cargarlo cuando el lector llega**. La
 * cabina se monta al entrar su sección en pantalla, así que quien baja hasta
 * aquí se encuentra el juego ya corriendo, y quien viene a leer un informe y
 * no baja nunca no descarga un solo byte de Phaser.
 *
 * ── Las dos excepciones, y por qué existen ──
 *
 * 1. **Ahorro de datos.** Descargar 1,17 MB sin preguntar en una conexión
 *    medida es hostil. Si el navegador declara `saveData`, el juego espera a
 *    que lo pidan. Es el único caso en que aparece un botón, y aparece porque
 *    la alternativa es gastarle el plan de datos a alguien.
 * 2. **Modo lectura.** Ese modo existe para retirar todo lo que es pantalla y
 *    dejar el texto; `globals.css` ya esconde los lienzos. Cargar el motor
 *    para no enseñarlo sería pagar el peso dos veces mal.
 */

const Cabina = dynamic(() => import('./CabinaCargable'), {
  // El juego mide su alto contra el viewport y lee `localStorage`: no hay nada
  // que pueda renderizar el servidor, y pintarlo en blanco sólo añade un salto.
  ssr: false,
  loading: () => <Marcador estado="cargando" />,
});

/**
 * Reserva el mismo alto que ocupará la cabina.
 *
 * Sin esto la portada da un salto de una pantalla entera cuando el juego
 * termina de bajar, justo mientras alguien está leyendo lo que hay debajo.
 * `--cabina-alto` es la variable que usa la propia cabina, de modo que el
 * hueco y el juego miden lo mismo por construcción y no por coincidencia.
 */
function Marcador({
  estado,
  onCargar,
}: {
  estado: 'cargando' | 'espera' | 'lectura';
  onCargar?: () => void;
}) {
  /*
   * El hueco de espera es **pulsable**, y no contradice el encargo de «sin un
   * clic»: en uso normal nadie lo ve, porque el observador monta el juego
   * media pantalla antes de que la sección aparezca. Existe para el caso en
   * que el observador no llegue a dispararse —una pestaña que se abrió en
   * segundo plano y nunca produjo un fotograma es el ejemplo real, y se
   * reprodujo midiendo esta misma página—. Sin esto, ese lector se queda
   * mirando «Listo para cargar» para siempre y sin forma de salir.
   *
   * Un gesto que casi nunca hace falta es barato. Un callejón sin salida, no.
   */
  const pulsable = estado === 'espera' && onCargar;

  const contenido = (
    <span className="ui flex items-center gap-2.5 text-sm text-muted-foreground">
      <Gamepad2 className="h-4 w-4" aria-hidden />
      {estado === 'cargando' && 'Cargando el Capítulo 0…'}
      {estado === 'espera' && 'Preparando el Capítulo 0…'}
      {estado === 'lectura' && 'El juego no se carga en modo lectura.'}
    </span>
  );

  if (pulsable) {
    return (
      <button
        type="button"
        onClick={onCargar}
        data-press
        aria-label="Cargar el Capítulo 0 de La Ley de los Audaces"
        className="cabina-hueco flex w-full items-center justify-center border-y border-border/70 bg-muted/20 transition-colors hover:bg-muted/40"
      >
        {contenido}
      </button>
    );
  }

  return (
    <div
      className="cabina-hueco flex items-center justify-center border-y border-border/70 bg-muted/20"
      role="status"
      aria-live="polite"
    >
      {contenido}
    </div>
  );
}

/**
 * `saveData` como estado externo, no como `setState` dentro de un efecto.
 *
 * Es la misma razón por la que el modo lectura vive en el DOM: son datos que
 * pertenecen al navegador, no a React, y leerlos con `useSyncExternalStore`
 * evita el render en cascada que la regla `set-state-in-effect` persigue. De
 * paso resuelve el servidor sin desajuste de hidratación: allí no hay
 * `navigator` y la respuesta es «no ahorra».
 *
 * No se suscribe a nada porque el valor no cambia durante la visita.
 */
function suscribirAhorro() {
  return () => {};
}

function leerAhorro() {
  /*
   * `connection` no está en la definición de `Navigator` porque no es estándar
   * en todos los navegadores. Se lee con guardas en vez de castear a `any`: si
   * no existe, no ahorra nada y se carga como siempre.
   */
  const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection;
  return Boolean(conexion?.saveData);
}

function ahorroEnServidor() {
  return false;
}

export function JuegoEnPortada() {
  const ancla = useRef<HTMLDivElement>(null);
  const [montar, setMontar] = useState(false);
  const ahorroDatos = useSyncExternalStore(suscribirAhorro, leerAhorro, ahorroEnServidor);
  const lectura = useSyncExternalStore(suscribir, leerModo, modoEnServidor);

  useEffect(() => {
    // Ni se observa ni se carga nada en estos dos casos; la decisión ya está
    // tomada arriba y aquí sólo se evita montar el observador.
    if (lectura || ahorroDatos) return;

    const el = ancla.current;
    if (!el) return;

    /*
     * Margen generoso: empieza a bajar el motor media pantalla antes de que la
     * sección se vea. Es la diferencia entre llegar y encontrarlo corriendo, y
     * llegar y mirar una barra de carga.
     */
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((e) => e.isIntersecting)) return;
        setMontar(true);
        observador.disconnect();
      },
      { rootMargin: '50% 0px' },
    );

    observador.observe(el);
    return () => observador.disconnect();
    // Depende de los dos: si alguien sale del modo lectura con la portada
    // abierta, el observador tiene que montarse entonces y no quedarse fuera
    // por haberse suscrito una sola vez al principio.
  }, [lectura, ahorroDatos]);

  return (
    <div ref={ancla} className="juego-portada">
      {lectura ? (
        <Marcador estado="lectura" />
      ) : ahorroDatos && !montar ? (
        <div className="cabina-hueco flex flex-col items-center justify-center gap-4 border-y border-border/70 bg-muted/20 px-6 text-center">
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Su navegador pide ahorrar datos. El juego pesa algo más de un
            megabyte, así que no se descarga sin permiso.
          </p>
          <button
            type="button"
            data-press
            onClick={() => setMontar(true)}
            className="ui inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Gamepad2 className="h-4 w-4" aria-hidden />
            Cargar el juego
          </button>
        </div>
      ) : montar ? (
        <Cabina />
      ) : (
        <Marcador estado="espera" onCargar={() => setMontar(true)} />
      )}
    </div>
  );
}
