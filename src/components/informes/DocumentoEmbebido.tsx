'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * El documento de una versión, leído dentro del sitio.
 *
 * La cadena editorial produce un HTML autónomo —un archivo, sin dependencias,
 * con su propia maqueta de papel— y hasta ahora el sitio se limitaba a
 * enlazarlo: quien pulsaba «leer en línea» salía a una pestaña en blanco, sin
 * ruta de vuelta, sin saber qué versión tenía delante ni que existía otra.
 * Aquí el documento entra en un marco que conserva esa información alrededor.
 *
 * **Va en un `iframe` y no incrustado en la página, y es deliberado.** El
 * documento trae su propia hoja de estilos completa —fuentes, retícula, colores
 * de papel, reglas de impresión— y volcarla en el sitio la haría chocar con la
 * del sitio en las dos direcciones. El marco aísla las dos maquetas y deja que
 * el documento se vea como el documento: si alguien compara la pantalla con el
 * PDF, tiene que ver lo mismo.
 *
 * El alto es una fracción alta de la ventana y el desplazamiento ocurre dentro
 * del marco. Medir el alto real del documento y crecer hasta él —posible, es
 * del mismo origen— produciría una página de decenas de miles de píxeles en la
 * que la barra del navegador deja de significar nada.
 */
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
  const [cargado, setCargado] = useState(false);
  const marco = useRef<HTMLIFrameElement>(null);

  /*
    Un `iframe` que ya estaba en caché puede terminar de cargar antes de que
    React enganche el `onLoad`, y entonces el velo de carga se queda para
    siempre encima de un documento que ya está debajo. Se comprueba una vez al
    montar.
  */
  useEffect(() => {
    if (marco.current?.contentDocument?.readyState === 'complete') setCargado(true);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-border bg-white',
          'h-[min(78svh,60rem)] min-h-[32rem]',
        )}
      >
        <iframe
          ref={marco}
          src={src}
          title={titulo}
          onLoad={() => setCargado(true)}
          loading="lazy"
          className="h-full w-full border-0"
        />

        {!cargado && (
          <div className="absolute inset-0 grid place-items-center bg-card">
            <p className="mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
              Abriendo el documento…
            </p>
          </div>
        )}
      </div>

      {/*
        La salida a pestaña propia no es un extra. El marco mide lo que mide, y
        un documento de treinta y siete páginas con tablas anchas se lee mejor a
        pantalla completa; además es la única forma de usar la búsqueda del
        navegador sobre el documento entero.
      */}
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-muted-foreground">
        <a
          href={src}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-6 items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          Abrir a pantalla completa
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </a>
        <span>
          El documento se desplaza dentro de su marco. A pantalla completa se
          puede buscar e imprimir.
        </span>
      </p>
    </div>
  );
}
