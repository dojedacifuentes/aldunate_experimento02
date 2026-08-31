# 02 · Sistema de diseño

Un solo sistema visual gobierna las tres salidas —Word, PDF y web— para que ninguna parezca una traducción de otra.

---

## El principio rector

La identidad visual no decora el informe: **codifica su tesis**. El argumento central es que la transformación declarada excede con mucho a la transformación demostrada. Por eso las etiquetas epistémicas —`VERIFICADO`, `CONTROVERTIDO`, `ALTA`, `INSUFICIENTE`— son elementos visuales de primera clase, con color semántico propio, y no texto corriente dentro de una celda.

Un lector que hojee las tablas sin leerlas debe percibir de un vistazo cuánta certeza hay en cada fila.

---

## Color

Se evitaron deliberadamente los defaults del momento —crema cálido con serif de display y acento terracota, o negro con un verde ácido— en favor de una paleta de **tinta fría**, propia del documento académico impreso.

### Tema claro

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#FBFCFD` | Fondo, blanco apenas frío |
| `--surface` | `#F1F5F7` | Destacados, cabeceras de tabla |
| `--ink` | `#0F1720` | Texto principal |
| `--ink-2` | `#3A4654` | Texto secundario, celdas |
| `--muted` | `#6C7A88` | Pies de fuente, metadatos |
| `--rule` | `#DDE4EA` | Filetes y bordes |
| `--navy` | `#1B3A5C` | **Primario.** Títulos, cifras, filetes de tabla |
| `--teal` | `#276E7C` | **Acento.** Antetítulos, enlaces, barras de destacado |
| `--ochre` | `#96681C` | Semántico: confianza media, advertencia |
| `--brick` | `#93372A` | Semántico: contraevidencia, riesgo, valores negativos |
| `--sage` | `#4C7150` | Semántico: evidencia sólida |

### Tema oscuro

Los tokens se redefinen; ningún componente define color fuera del sistema de tokens.

| Token | Valor |
|---|---|
| `--paper` | `#0D1319` |
| `--ink` | `#E8EEF3` |
| `--navy` | `#8FB3D4` |
| `--teal` | `#63B7C6` |
| `--ochre` | `#D8A852` |
| `--brick` | `#DD8375` |

Los colores semánticos se aclaran en oscuro para conservar el contraste sin perder su identidad.

### Los tres estados del tema

La web contempla que el visitante puede estar en tres situaciones, no en dos:

```css
:root { /* paleta clara completa */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* solo se redefinen tokens */ }
}

:root[data-theme="dark"] { /* el conmutador gana en ambos sentidos */ }
```

El estado por defecto —«sistema»— no marca nada en la raíz, así que solo `prefers-color-scheme` separa claro de oscuro. Por eso **ningún color puede tener su única definición dentro de un bloque de media query o de `[data-theme]`**: si la tiene, no se aplica en el estado sin marcar y la página muestra el texto de un tema sobre el fondo del otro.

---

## Tipografía

Tres familias con papeles claramente separados. Es el emparejamiento clásico del informe científico —titulares en palo seco, cuerpo en serif— con una tercera monoespaciada para los datos.

| Papel | Web | Word | Por qué |
|---|---|---|---|
| Títulos | IBM Plex Sans 600/700 | Segoe UI negrita | Autoridad y contraste con el cuerpo |
| Cuerpo | Spectral 300/400 | Georgia | Lectura larga; excelente comportamiento con diacríticos |
| Datos y etiquetas | IBM Plex Mono 500/600 | Segoe UI versalitas | Cifras alineadas y aire de registro, no de prosa |

Reglas aplicadas de forma sistemática:

- Texto corrido cerca de **65 caracteres** de ancho (`--measure: 69ch`).
- `text-wrap: balance` en todos los titulares.
- Las etiquetas en versalitas llevan `letter-spacing` entre `.09em` y `.20em`.
- `font-variant-numeric: tabular-nums` donde las cifras se alinean en columna.

---

## Retícula

**Web del informe.** Dos columnas: un raíl lateral fijo de 280 px con la navegación de capítulos y el indicador de progreso de lectura, y la columna principal. El texto se limita a `--mtext` (690 px) mientras que **figuras y tablas rompen a ancho completo** (`--wide`, 1040 px). Ese contraste entre columna estrecha de lectura y lámina ancha es el gesto editorial del diseño.

Por debajo de 1080 px el raíl desaparece y el documento pasa a columna única.

**Web del resumen ejecutivo.** Columna única centrada, sin raíl: es un documento de cinco páginas y una navegación lateral sería ruido.

**Word.** A4 con márgenes de 2,2 cm laterales, lo que deja 470,6 pt de caja. Las tablas se dimensionan a 9.120 twips (456 pt) para dejar holgura, y las imágenes a 5.950.000 EMU (468,5 pt). Ninguna de las 25 tablas del informe desborda.

---

## Componentes

### Etiquetas epistémicas

El elemento distintivo del sistema. Se generan automáticamente: el constructor detecta en una celda de tabla un valor en versales que coincida con el vocabulario epistémico y lo convierte en etiqueta con su color semántico.

| Etiqueta | Color de fondo | Color de texto |
|---|---|---|
| `ALTA`, `VERIFICADO` | `--navy-soft` | `--navy` |
| `MEDIA-ALTA` | `--teal-soft` | `--teal` |
| `MEDIA`, `REPORTADO`, `EMERGENTE` | `--ochre-soft` | `--ochre` |
| `BAJA`, `CONTROVERTIDO` | `--brick-soft` | `--brick` |
| `INSUFICIENTE`, `NO DEMOSTRADO` | transparente, borde discontinuo | `--muted` |

La regla de detección es deliberadamente estricta —**solo versales exactas**— para que un «Alta» en caja de título dentro de otra columna, con otro significado, no se convierta en etiqueta y confunda al lector.

### Destacados

Bloque con fondo `--surface` y barra izquierda de 3 px cuyo color declara la naturaleza del contenido: `--navy` para síntesis, `--teal` para matiz constructivo, `--ochre` para advertencia de lectura, `--brick` para contraevidencia o riesgo.

### Figuras como láminas

En web, cada figura se presenta sobre una lámina blanca con borde y sombra suave, **también en tema oscuro**. Es el tratamiento del grabado impreso: no se altera el color de los datos para adaptarlo al fondo, porque eso comprometería su lectura.

### Tablas

Filete superior e inferior de 2 px en `--navy`, cabecera sobre `--surface-2`, filas alternadas y separadores internos de 1 px. Sin bordes verticales. Contenedor con `overflow-x: auto` propio, de modo que una tabla ancha nunca provoca desplazamiento horizontal de la página.

---

## Paleta de los gráficos

Las figuras comparten la paleta del documento, en su versión de impresión —más saturada, porque va sobre papel blanco:

```
#1B3A5C  navy      serie principal
#C08A2E  ochre     segunda serie, percepción
#2F7D8C  teal      tercera serie, evidencia
#A34A3C  brick     valores negativos, riesgo
#5F8560  sage      cuarta serie
#6B4A72  plum      quinta serie
#5D8FBF  sky       sexta serie
#7C8A99  steel     referencia, contexto
```

El uso es semántico y constante en todo el informe: lo que aparece en ladrillo es siempre un valor adverso; lo ocre, siempre una percepción o una advertencia.

---

## Anatomía de una figura

Cada figura lleva cinco elementos y ninguno es opcional:

1. **Antetítulo** en versalitas y color acento, que sitúa el eje temático.
2. **Titular** que enuncia el hallazgo, no el contenido. No «Uso de IA por estudiantes», sino «Usar la IA no es delegar en ella: dos curvas que se separan».
3. **Subtítulo** que precisa qué se mide exactamente y sobre qué población.
4. **Advertencia de lectura** en cursiva y color ladrillo, cuando el dato tiene un sesgo conocido.
5. **Pie de fuente** completo, con autor, año, publicación y tamaño de muestra.

El número de figura **no está dibujado en la imagen**: vive solo en el pie y se calcula en cada compilación. Así, reordenar capítulos no puede desincronizar la numeración.
