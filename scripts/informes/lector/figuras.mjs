/**
 * Tratamiento de las figuras del documento.
 *
 * Las figuras llegan como SVG con dos defectos que sólo se ven al medirlos:
 *
 *  1. **Su texto es ilegible.** Los rótulos van de 6,6 a 9,2 unidades de
 *     `viewBox`, y como el SVG se escala al ancho de la caja, en papel caen a
 *     entre 4 y 5 puntos. Es la mitad del cuerpo del texto.
 *
 *  2. **Sus colores son fijos.** Veintidós hexadecimales escritos en los
 *     atributos, ninguna variable: en modo oscuro la figura es un parche claro
 *     sobre papel oscuro, y no pertenece al documento que la rodea.
 *
 * Aquí se corrigen los dos, sin tocar ni una posición ni un dato: sólo cambian
 * el tamaño de los rótulos y el nombre de los colores.
 */

/* ── 1 · Colores ────────────────────────────────────────────────────────────
   Cada hexadecimal de las figuras se traduce a una variable con el original
   como reserva, de modo que un navegador sin variables —o una impresión que
   no las resuelva— sigue viendo exactamente la figura de antes.

   Los grupos son semánticos y no cromáticos: lo que importa es qué papel
   juega el color en la figura, porque es lo que decide su equivalente
   oscuro. Una línea de eje y un relleno de barra pueden ser el mismo gris en
   claro y tienen que separarse en oscuro. */
export const COLORES_FIGURA = {
  // Tinta
  '#0d1420': '--fig-ink',
  '#26313f': '--fig-ink2',
  '#5d6b7d': '--fig-mute',
  '#8c98a8': '--fig-faint',
  // Trazos y retículas
  '#c3ccd6': '--fig-line',
  '#b9c4d1': '--fig-line',
  '#c7d5e3': '--fig-line2',
  '#dde3ea': '--fig-line2',
  // Superficies
  '#ffffff': '--fig-plate',
  '#fff': '--fig-plate',
  '#fafbfc': '--fig-plate',
  '#eef1f5': '--fig-wash',
  '#f0f2f5': '--fig-wash',
  '#e3e8ee': '--fig-band',
  // Marca
  '#0f4c81': '--fig-brand',
  '#1a6fa8': '--fig-brand2',
  // Acento
  '#00a3a3': '--fig-acc',
  '#7ad0cd': '--fig-acc2',
  // Cálido
  '#c2703a': '--fig-warm',
  '#e8b384': '--fig-warm2',
  // Alerta
  '#b3402f': '--fig-alert',
  '#f1d9d4': '--fig-alert2',
};

/* ── 2 · Tamaño de los rótulos ──────────────────────────────────────────────
   El factor no es uniforme: se comprime el rango. Los rótulos pequeños —los
   que hoy son ilegibles— suben mucho; los grandes, que ya se leen y sostienen
   la jerarquía de la figura, suben poco. Un factor plano de 1,8 haría legible
   el rótulo de un punto y convertiría el número destacado de una figura en un
   titular que se come el dibujo.

   La curva se ancla en dos puntos medidos: 6,6 → 11,9 (de 4,1 a 7,4 pt en
   papel) y 9,2 → 13,3. Por encima de 12 unidades el texto ya es grande y sólo
   se le aplica un 8 %. */
/**
 * Agranda un rótulo por un factor, sin tocar los que ya son grandes.
 *
 * Los rótulos grandes —el número destacado de una figura, su cifra de
 * cabecera— ya se leen y sostienen la jerarquía del dibujo. Agrandarlos
 * convierte la figura en un titular.
 */
export function escalarTexto(valor, factor) {
  const v = Number(valor);
  if (!Number.isFinite(v) || v >= 9 || factor <= 1) return valor;
  return +(v * factor).toFixed(2);
}

/**
 * Aplica las dos correcciones a todos los SVG de un documento.
 *
 * **El factor va por figura y no es uniforme, y esto se midió.** Un factor
 * plano de 1,32 en las doce llevó los solapamientos de rótulos de 9 —los que
 * el documento ya traía— a 44. Estas figuras están dibujadas con posiciones
 * absolutas calculadas para su tamaño original: cada una admite un aumento
 * distinto antes de que sus rótulos se monten unos sobre otros, y ese techo
 * lo fija `calibrar-figuras.mjs` midiendo las cajas de texto en un navegador.
 *
 * Lo que la calibración no puede dar, lo da el HTML de alrededor: la pregunta
 * de la figura, su titular, la leyenda y la nota metodológica son texto normal
 * y están a 9,5-13 pt. Quien no distinga un rótulo de eje tiene al lado, en
 * cuerpo legible, qué dice la figura.
 *
 * @param {string} html
 * @param {number[]} escalas  factor por figura, en orden de aparición
 */
export function tratarFiguras(html, escalas = []) {
  let rótulos = 0;
  let coloreados = 0;
  let figuras = 0;

  const salida = html.replace(/<svg[\s\S]*?<\/svg>/g, (svg) => {
    const factor = escalas[figuras] ?? 1;
    figuras += 1;

    let s = svg.replace(/font-size="([\d.]+)"/g, (todo, n) => {
      const nuevo = escalarTexto(n, factor);
      if (String(nuevo) !== String(n)) rótulos += 1;
      return `font-size="${nuevo}"`;
    });

    s = s.replace(/(fill|stroke)="(#[0-9a-fA-F]{3,6})"/g, (todo, prop, hex) => {
      const variable = COLORES_FIGURA[hex.toLowerCase()];
      if (!variable) return todo;
      coloreados += 1;
      return `${prop}="var(${variable}, ${hex})"`;
    });

    return s;
  });

  return { html: salida, figuras, rótulos, coloreados };
}
