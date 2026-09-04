import type { ReactNode } from 'react';

import { Disclosure } from '@/components/common/ui';
import { CORTE_INFORME_01 } from '@/lib/informe01';
import { informe01Recuento } from '@/data/informe01';

/**
 * El envoltorio de toda figura del Informe 01.
 *
 * Impone las cuatro cosas que separan un gráfico académico de una decoración, y
 * las impone por construcción y no por disciplina:
 *
 * 1. **Una pregunta.** Si una figura no responde una pregunta que pueda
 *    escribirse, sobra. Va arriba, en pequeño, antes que el título.
 * 2. **Un título que sea la lectura, no el rótulo.** «Gráfico 4» no dice nada;
 *    «la escalera se llena hasta el tercero y se detiene» sí. Es la regla que el
 *    encargo pide y la que más cambia el documento.
 * 3. **Fuente y corte.** Ninguna figura se publica sin decir de dónde sale y a
 *    qué fecha. El campo es obligatorio: es la misma regla que la cadena de
 *    informes del repositorio aplica a sus figuras.
 * 4. **Una alternativa textual.** El SVG lleva `title` y `desc`, pero eso sirve
 *    a un lector de pantalla y no a quien imprime en blanco y negro o a quien
 *    quiere el dato exacto. La alternativa va plegada, disponible y no estorba.
 *
 * Las figuras **no se numeran a mano**. Si alguna vez hace falta numerarlas, se
 * numeran solas por orden de aparición: escribir el número reintroduce el error
 * que esa regla resuelve.
 */
export function Figura({
  pregunta,
  titulo,
  svg,
  nota,
  fuente,
  alternativa,
  ancha = false,
}: {
  pregunta: string;
  titulo: string;
  svg: string;
  nota?: ReactNode;
  /** Por omisión, el dataset canónico con su corte. Se sobrescribe si procede. */
  fuente?: string;
  alternativa?: ReactNode;
  /** Marca las figuras que necesitan desplazarse en pantallas estrechas. */
  ancha?: boolean;
}) {
  return (
    <figure className="my-8 first:mt-0">
      <figcaption className="mb-4">
        <p className="mono text-[0.625rem] uppercase tracking-widest text-accent">
          {pregunta}
        </p>
        <h3 className="mt-1.5 max-w-3xl font-serif text-lg leading-snug text-foreground sm:text-xl">
          {titulo}
        </h3>
      </figcaption>

      <div
        className={ancha ? 'g-caja -mx-4 px-4 sm:mx-0 sm:px-0' : undefined}
        // El SVG llega como cadena desde una función pura del dataset. No hay
        // entrada de usuario en ninguna parte de esa cadena y todo texto pasa por
        // `esc()` antes de entrar: es contenido propio, generado en el servidor.
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
        <p className="text-[0.75rem] leading-relaxed text-muted-foreground">
          <span className="mono text-[0.625rem] uppercase tracking-widest">Fuente · </span>
          {fuente ??
            `Dataset canónico del Informe 01: ${informe01Recuento.fuentes} fuentes públicas sobre ${informe01Recuento.universidades} instituciones, al corte del ${CORTE_INFORME_01}.`}
        </p>
        {nota && (
          <p className="text-[0.75rem] leading-relaxed text-muted-foreground">
            <span className="mono text-[0.625rem] uppercase tracking-widest">Nota · </span>
            {nota}
          </p>
        )}
      </div>

      {alternativa && (
        <Disclosure
          className="mt-4"
          summary="Los mismos datos en texto"
          hint="alternativa a la figura"
        >
          {alternativa}
        </Disclosure>
      )}
    </figure>
  );
}
