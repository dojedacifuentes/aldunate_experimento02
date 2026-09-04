/**
 * Primitivas del motor de gráficos del Informe 01.
 *
 * ── Por qué un motor propio y por qué en SVG plano ──────────────────────────
 *
 * La v0.6.0 dibujaba con tablas de HTML y `div` de color. Funcionaba en la web
 * y **no existía en el PDF**: el exportador sólo sabía escribir párrafos, listas
 * y tablas, de modo que el documento que se envía al destinatario no tenía ni un
 * gráfico. Cualquier motor que viva dentro de React repite ese problema, porque
 * el exportador no monta React.
 *
 * Estas funciones devuelven **cadenas de SVG**. Las consumen dos huéspedes:
 * los componentes del sitio, que las insertan tal cual, y
 * `scripts/informe-01/07-exportar.mts`, que las concatena en el HTML del que se
 * imprime el PDF. Un solo origen, dos destinos, y ninguna posibilidad de que la
 * web y el papel muestren gráficos distintos.
 *
 * ── Reglas de dibujo ────────────────────────────────────────────────────────
 *
 * - **El color nunca va solo.** Cada estado lleva además una trama, un signo o
 *   una cifra, de modo que el gráfico sobreviva a una impresión en blanco y
 *   negro y a un lector daltónico.
 * - **Nada de píxeles fijos.** Todo sale con `viewBox` y ancho relativo: la
 *   misma cadena se lee en un teléfono, en un monitor y en un A4.
 * - **Ningún color escrito a mano dentro de una figura.** Se usan variables CSS
 *   con reserva —`var(--g-op, #1b5e76)`— que cada huésped define. El sitio las
 *   declara en `globals.css` para sus dos temas; el exportador, en su `<style>`.
 * - **Accesible por construcción.** Cada figura lleva `role="img"`, un `<title>`
 *   y una `<desc>`, y toda visualización se publica junto a su alternativa
 *   textual. Un gráfico que sólo funciona viéndolo no está terminado.
 */

/** Escapa texto para XML. Los nombres de universidad traen tildes y ampersands. */
export const esc = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export interface OpcionesFigura {
  ancho: number;
  alto: number;
  titulo: string;
  descripcion: string;
  /** Clase del elemento raíz. El huésped la usa para tipografía y color de texto. */
  clase?: string;
}

/**
 * Envuelve el contenido en un `<svg>` con caja de vista, título y descripción.
 *
 * **No lleva atributos `width` ni `height`, y es deliberado.** Con `height="auto"`
 * el navegador recortaba la figura por abajo: la matriz de capacidades perdía
 * cuatro de sus once filas y el gráfico seguía pareciendo correcto. Sin esos dos
 * atributos, el `viewBox` fija la proporción y la regla `.g-fig { width: 100% }`
 * del huésped fija el tamaño, que es la combinación que entra igual en 375 px y
 * en una página A4.
 */
export function figura(contenido: string, o: OpcionesFigura): string {
  const id = `t${Math.abs(hash(o.titulo))}`;
  return [
    `<svg viewBox="0 0 ${o.ancho} ${o.alto}"`,
    ` preserveAspectRatio="xMidYMin meet" role="img"`,
    ` aria-labelledby="${id}" class="g-fig${o.clase ? ` ${o.clase}` : ''}"`,
    ` xmlns="http://www.w3.org/2000/svg">`,
    `<title id="${id}">${esc(o.titulo)}</title>`,
    `<desc>${esc(o.descripcion)}</desc>`,
    defs(),
    contenido,
    `</svg>`,
  ].join('');
}

/** Hash estable y corto. Sólo sirve para que dos figuras no compartan `id`. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/**
 * Tramas compartidas. Son lo que permite distinguir los estados sin color: la
 * diagonal fina marca «no se buscó» y la diagonal gruesa marca «incipiente».
 *
 * La fina lleva tinta propia —`--g-trama`— y no la de los filetes. Compartirla
 * funcionaba sobre el papel oscuro anterior y dejo de funcionar sobre el claro:
 * una linea de un pixel al color de una regla de tabla desaparece sobre blanco,
 * y el estado «no concluyente» quedaba indistinguible de una celda vacia. Es la
 * diferencia entre «no se busco» y «se busco y no habia», que es justamente la
 * distincion que esta capa existe para sostener.
 */
function defs(): string {
  return [
    '<defs>',
    '<pattern id="g-tramaFina" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">',
    '<rect width="6" height="6" fill="var(--g-trama-fondo, #f2f5f7)"/>',
    '<line x1="0" y1="0" x2="0" y2="6" stroke="var(--g-trama, #a9b6c1)" stroke-width="1.4"/>',
    '</pattern>',
    '<pattern id="g-tramaGruesa" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">',
    '<rect width="5" height="5" fill="var(--g-incip-fondo, #dbeaef)"/>',
    '<line x1="0" y1="0" x2="0" y2="5" stroke="var(--g-incip, #5c9ead)" stroke-width="2"/>',
    '</pattern>',
    '</defs>',
  ].join('');
}

export type Ancla = 'start' | 'middle' | 'end';

export interface OpcionesTexto {
  tam?: number;
  ancla?: Ancla;
  clase?: string;
  peso?: number;
  rotar?: number;
  /** Desplazamiento vertical relativo, en `em`. Centra un texto sobre su línea base. */
  dy?: string;
}

export function texto(x: number, y: number, s: string, o: OpcionesTexto = {}): string {
  const t = [
    `<text x="${x}" y="${y}"`,
    ` font-size="${o.tam ?? 11}"`,
    o.ancla ? ` text-anchor="${o.ancla}"` : '',
    o.peso ? ` font-weight="${o.peso}"` : '',
    o.dy ? ` dy="${o.dy}"` : '',
    ` class="${o.clase ?? 'g-t'}"`,
    o.rotar ? ` transform="rotate(${o.rotar} ${x} ${y})"` : '',
    `>${esc(s)}</text>`,
  ].join('');
  return t;
}

export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  atributos: Record<string, string | number> = {},
): string {
  const extra = Object.entries(atributos)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join('');
  return `<rect x="${x}" y="${y}" width="${Math.max(0, w)}" height="${Math.max(0, h)}"${extra}/>`;
}

export function linea(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  atributos: Record<string, string | number> = {},
): string {
  const extra = Object.entries(atributos)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join('');
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${extra}/>`;
}

/**
 * Parte un rótulo largo en líneas de a lo más `max` caracteres, cortando por
 * palabra. Los nombres oficiales de universidad no caben en una columna y
 * truncarlos con puntos suspensivos deja «Pontificia Universidad Cató…» en dos
 * filas distintas, que es peor que partir.
 */
export function partir(s: string, max: number): string[] {
  const palabras = s.split(' ');
  const lineas: string[] = [];
  let actual = '';
  for (const p of palabras) {
    if (!actual) actual = p;
    else if (`${actual} ${p}`.length <= max) actual += ` ${p}`;
    else {
      lineas.push(actual);
      actual = p;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

/** Varias líneas de texto apiladas desde `y`, con interlineado `salto`. */
export function textoMulti(
  x: number,
  y: number,
  lineas: string[],
  salto: number,
  o: OpcionesTexto = {},
): string {
  return lineas.map((l, i) => texto(x, y + i * salto, l, o)).join('');
}
