'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, List, Maximize2 } from 'lucide-react';

import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

/**
 * El documento de una versión, leído dentro del sitio.
 *
 * La cadena editorial produce un HTML autónomo con su propia maqueta. Aquí se
 * muestra tal cual —es la condición para que lo que se lee en pantalla y lo
 * que se imprime sean el mismo documento— pero integrado: sin costura de
 * fondo, con el tema del sitio y con un índice al lado.
 *
 * **Va en un `iframe`, y crece hasta su contenido.** Las dos decisiones son
 * deliberadas y van juntas:
 *
 *  - El marco aísla las dos hojas de estilo. El documento trae la suya
 *    completa —fuentes, retícula, reglas de impresión— y volcarla en la página
 *    la haría chocar con la del sitio en las dos direcciones.
 *  - El alto lo fija el propio documento, que lo publica por `postMessage`.
 *    Sin eso hay un desplazamiento dentro de otro, que es exactamente lo que
 *    hace incómodo leer treinta y siete páginas dentro de un marco. Con eso
 *    hay una sola barra —la de la página— y el documento se lee como un
 *    artículo largo, que es lo que es.
 *
 * El índice no se dibuja con la tipografía del documento sino con la del
 * sitio: quien navega está en el sitio, y el documento es lo que está leyendo.
 */

interface Sección {
  id: string;
  texto: string;
  anexo: boolean;
}

type MensajeLector =
  | { tipo: 'lector:alto'; alto: number }
  | { tipo: 'lector:índice'; secciones: Sección[] }
  | { tipo: 'lector:posición'; id: string; arriba: number };

export function DocumentoEmbebido({
  src,
  titulo,
  className,
}: {
  /** Ruta del HTML autónomo bajo `/public`. */
  src: string;
  /** Título accesible del marco. Un `iframe` sin nombre es «marco sin título». */
  titulo: string;
  className?: string;
}) {
  const { theme } = useTheme();
  const marco = useRef<HTMLIFrameElement>(null);
  const contenedor = useRef<HTMLDivElement>(null);

  /*
    Posición de cada sección dentro del documento. Se rehace cuando llega el
    índice y cuando cambia el alto —que es lo que ocurre al reflowear—: sin
    eso, el índice marca la sección equivocada en cuanto alguien cambia el
    ancho de la ventana.
  */
  const posiciones = useRef(new Map<string, number>());

  const [alto, setAlto] = useState(1200);
  const [cargado, setCargado] = useState(false);
  const [secciones, setSecciones] = useState<Sección[]>([]);
  const [activa, setActiva] = useState<string | null>(null);
  const [índiceAbierto, setÍndiceAbierto] = useState(false);

  /*
    El modo y el tema viajan en la dirección, no por mensaje, para que el
    documento nazca ya con ellos: pasado después, el marco parpadea en claro
    antes de ponerse oscuro y con raíl antes de quitarlo.
  */
  const dirección = useMemo(
    () => `${src}?modo=embebido&tema=${theme === 'dark' ? 'oscuro' : 'claro'}`,
    [src, theme],
  );

  const enviar = useCallback((mensaje: unknown) => {
    marco.current?.contentWindow?.postMessage(mensaje, '*');
  }, []);

  /* ── Conversación con el documento ── */
  useEffect(() => {
    function alRecibir(ev: MessageEvent) {
      if (ev.source !== marco.current?.contentWindow) return;
      const d = ev.data as MensajeLector;
      if (!d || typeof d !== 'object') return;

      if (d.tipo === 'lector:alto' && typeof d.alto === 'number') {
        /*
          Segunda guarda, del lado de acá. El documento ya no publica alturas
          medidas a cero de ancho, pero una versión suya anterior sí podría
          —los documentos publicados no se reconstruyen—, y un alto absurdo
          deja la página con kilómetros de vacío. Cien mil píxeles son ya unas
          cien pantallas: nada legítimo pasa de ahí.
        */
        if (d.alto > 0 && d.alto < 400_000) setAlto(d.alto);
        /* El velo se retira igual: el documento contestó, y dejarlo puesto
           encima de un documento que ya está debajo es peor que un alto
           provisional. */
        setCargado(true);
      }

      if (d.tipo === 'lector:índice' && Array.isArray(d.secciones)) {
        setSecciones(d.secciones);
      }

      /*
        El marco no puede desplazarse —mide lo que mide su contenido—, así que
        saltar a una sección es desplazar la página de fuera hasta la posición
        que el documento acaba de informar.
      */
      if (d.tipo === 'lector:posición' && typeof d.arriba === 'number') {
        const caja = contenedor.current?.getBoundingClientRect();
        if (!caja) return;
        const destino = caja.top + window.scrollY + d.arriba - 88;
        window.scrollTo({
          top: destino,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        });
        setActiva(d.id);
        setÍndiceAbierto(false);
      }
    }

    window.addEventListener('message', alRecibir);
    return () => window.removeEventListener('message', alRecibir);
  }, []);

  /*
    Preguntar hasta que conteste.

    El marco viaja en el HTML que sirve el servidor, así que empieza a cargar
    en cuanto el navegador lee la página y publica su alto y su índice antes
    de que React llegue a hidratar y a poner el escuchador de arriba. Esperar
    a `onLoad` tampoco vale: para un marco ya cargado, React no lo dispara. El
    resultado era un documento clavado en su alto provisional y una columna de
    índice vacía, sin ningún error a la vista.

    Se pregunta cada 250 ms y se deja de preguntar en cuanto llega la primera
    respuesta, o a los cuatro segundos.
  */
  useEffect(() => {
    if (cargado) return;
    let intentos = 0;
    const t = setInterval(() => {
      intentos += 1;
      enviar({ tipo: 'lector:pregunta' });
      if (intentos > 16) clearInterval(t);
    }, 250);
    return () => clearInterval(t);
  }, [cargado, enviar]);

  /* El tema del sitio manda sobre el del documento, siempre. */
  useEffect(() => {
    if (!cargado) return;
    enviar({ tipo: 'lector:tema', tema: theme === 'dark' ? 'dark' : 'light' });
  }, [theme, cargado, enviar]);

  /* ── Sección visible, para marcar el índice ──
     Se calcula fuera del marco porque es la página la que se desplaza. */
  useEffect(() => {
    if (!secciones.length) return;

    function alDesplazar() {
      const caja = contenedor.current?.getBoundingClientRect();
      if (!caja) return;
      const desplazado = -caja.top + 120;
      let actual: string | null = null;
      for (const s of secciones) {
        const pos = posiciones.current.get(s.id);
        if (pos !== undefined && pos <= desplazado) actual = s.id;
      }
      if (actual) setActiva(actual);
    }

    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, [secciones]);

  useEffect(() => {
    const doc = marco.current?.contentDocument;
    if (!doc || !secciones.length) return;
    /* Se muta el mapa en sitio en vez de reemplazarlo: la ref la lee el efecto
       de desplazamiento, y cambiarle el objeto por debajo es lo que la regla
       de inmutabilidad de los hooks señala con razón. */
    const mapa = posiciones.current;
    mapa.clear();
    for (const s of secciones) {
      const el = doc.getElementById(s.id);
      if (el) mapa.set(s.id, el.getBoundingClientRect().top + (doc.defaultView?.scrollY ?? 0));
    }
  }, [secciones, alto]);

  function irA(id: string) {
    enviar({ tipo: 'lector:ir', id });
  }

  const enCuerpo = secciones.filter((s) => !s.anexo);
  const enAnexos = secciones.filter((s) => s.anexo);

  return (
    <div className={cn('lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10', className)}>
      {/* ── Índice ── */}
      {secciones.length > 0 && (
        <nav
          aria-label="Índice del documento"
          className="mb-6 lg:sticky lg:top-24 lg:mb-0 lg:max-h-[calc(100svh-8rem)] lg:self-start lg:overflow-y-auto"
        >
          {/* En una pantalla estrecha el índice es un desplegable: veintinueve
              entradas antes del texto empujarían el documento fuera de la
              primera pantalla. */}
          <button
            type="button"
            onClick={() => setÍndiceAbierto((v) => !v)}
            aria-expanded={índiceAbierto}
            className="ui flex w-full items-center gap-2 rounded-md border border-border bg-card/50 px-4 py-2.5 text-sm font-medium text-foreground lg:hidden"
          >
            <List className="h-4 w-4 text-primary" aria-hidden />
            Índice del documento
            <span className="mono ml-auto text-[0.6875rem] text-muted-foreground">
              {secciones.length}
            </span>
          </button>

          <div className={cn('mt-3 lg:mt-0', índiceAbierto ? 'block' : 'hidden lg:block')}>
            <p className="meta mb-3 hidden text-primary lg:block">En este documento</p>
            <ol className="space-y-0.5">
              {enCuerpo.map((s) => (
                <li key={s.id}>
                  <BotónDeSección s={s} activa={activa === s.id} onIr={irA} />
                </li>
              ))}
            </ol>
            {enAnexos.length > 0 && (
              <>
                <p className="meta mb-2 mt-4 text-muted-foreground">Anexos</p>
                <ol className="space-y-0.5">
                  {enAnexos.map((s) => (
                    <li key={s.id}>
                      <BotónDeSección s={s} activa={activa === s.id} onIr={irA} />
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </nav>
      )}

      {/* ── Documento ── */}
      <div ref={contenedor} className="min-w-0">
        <div className="relative">
          <iframe
            ref={marco}
            src={dirección}
            title={titulo}
            /* El documento se sirve del mismo origen: sin esto no podría
               publicar su alto ni recibir el tema. */
            className="w-full border-0"
            style={{ height: `${alto}px` }}
            onLoad={() => {
              setCargado(true);
              enviar({ tipo: 'lector:índice' });
            }}
          />

          {!cargado && (
            <div className="absolute inset-x-0 top-0 grid h-96 place-items-center">
              <p className="mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
                Abriendo el documento…
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border/60 pt-4 text-[0.8125rem] text-muted-foreground">
          <a
            href={src}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-6 items-center gap-1.5 font-medium text-primary hover:underline"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden />
            Abrir el documento solo
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </a>
          <span>
            Se abre en una pestaña propia, con su propio índice y su alternador
            de claro y oscuro. Es también la forma de imprimirlo.
          </span>
        </p>
      </div>
    </div>
  );
}

function BotónDeSección({
  s,
  activa,
  onIr,
}: {
  s: Sección;
  activa: boolean;
  onIr: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onIr(s.id)}
      aria-current={activa ? 'true' : undefined}
      className={cn(
        'ui w-full border-l-2 py-1.5 pl-3 pr-2 text-left text-[0.8125rem] leading-snug transition-colors',
        activa
          ? 'border-l-primary bg-primary/[0.07] font-medium text-foreground'
          : 'border-l-transparent text-muted-foreground hover:border-l-border hover:text-foreground',
      )}
    >
      {s.texto}
    </button>
  );
}
