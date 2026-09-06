# 08 · El lector en línea

Cómo un informe maquetado para papel se lee en pantalla sin dejar de ser el
mismo documento, y qué hay que hacer para que la versión siguiente nazca así.

---

## El problema que resuelve

La cadena editorial produce documentos para imprimir. Su hoja de estilos está
en milímetros y puntos, con `@page`, saltos de página y una caja de 210 mm. Eso
es correcto —es lo que garantiza que el PDF y el HTML no diverjan— y en
pantalla produce esto:

| En papel | En pantalla, sin capa |
|---|---|
| Columna de 210 mm | Columna rígida de 210 mm en un monitor de 1.400 px |
| 10,05 pt | 13 px |
| Justificado con partición | Justificado con ríos |
| Papel blanco | Papel blanco, también a medianoche |
| Índice con números de página | Lista de títulos que no lleva a ninguna parte |
| Encabezado corriente en cada hoja | Repetido treinta y siete veces en una tira |

La v2.0.0 del Informe 01 se publicó así el 06-09-2026 y se vio: era peor que la
v0.8.0, que sí traía armazón de lectura. Esta capa lo corrige sin tocar el
documento.

---

## La regla que no se negocia

**La capa cambia el tamaño, el ritmo, el color y la navegación. No cambia lo
que el documento dice.** Ni una palabra, ni una cifra, ni el orden de una
sección.

No es una intención: está comprobado. `src/lib/informes.test.ts` extrae el
texto desnudo del documento entregado y el del publicado y exige que sean
**idénticos**. Si la capa alguna vez altera el contenido, la prueba falla.

---

## Cómo funciona

```
content/reports/<informe>/entregas/<versión>/*.html   ← el documento entregado, intocado
                        │
                        │  node scripts/informes/lector/construir.mjs
                        ▼
public/descargas/<carpeta>/*.html                     ← el publicado, con capa
```

La fuente **nunca** se modifica, así que el proceso es idempotente: volver a
ejecutarlo produce byte a byte lo mismo. El constructor se niega a trabajar si
la fuente ya lleva capa, que es lo que pasaría si alguien apuntara la entrada a
un archivo ya procesado.

```bash
npm run informe:lector
```

Tres archivos, y cada uno hace una cosa:

| Archivo | Qué es |
|---|---|
| `scripts/informes/lector/estilos.css` | La hoja de pantalla. Todo dentro de `@media screen` |
| `scripts/informes/lector/comportamiento.js` | Progreso, capítulo activo, tema y el diálogo con el sitio |
| `scripts/informes/lector/documentos.mjs` | Qué documentos llevan capa |
| `scripts/informes/lector/construir.mjs` | El transformador |

### Qué añade el constructor

1. **Anclas** en cada `h2` y `h3`. El documento entregado trae **un** `id` en
   cuatrocientos kilobytes: sin anclas no hay índice, ni raíl, ni enlace a una
   sección.
2. **El índice impreso se vuelve navegable.** En papel el número es la página;
   en pantalla no hay páginas.
3. **Envoltura de desplazamiento** en cada tabla, para que una tabla ancha se
   desplace dentro de sí misma y nunca la página.
4. **Raíl** con el índice, agrupado en cuerpo y anexos según lo que diga el
   propio índice del documento —y no adivinándolo por el título, que es lo que
   se rompería con el informe siguiente—.
5. **Barra de progreso y alternador de tema.**
6. **Un guion antes del primer pintado** que fija modo y tema desde la
   dirección, para que no haya destello.

---

## Los dos modos

El mismo archivo sirve dos situaciones, y lo decide la dirección.

### Suelto

`…/informe-01-v2.0.0.html`

Documento completo con su armazón: raíl pegajoso a la izquierda, barra de
progreso, botón de claro y oscuro que se recuerda. Se abre desde un disco, sin
red y sin nada instalado. Es también la forma de imprimirlo.

### Embebido

`…/informe-01-v2.0.0.html?modo=embebido&tema=oscuro`

Dentro de una página del sitio. Sin raíl, sin barra, sin botón y **sin fondo**:
la página que lo aloja pone el suelo, el índice y el tema, y así no hay costura
entre el documento y la página.

El diálogo va por `postMessage`, y tiene cuatro mensajes:

| Mensaje | Dirección | Para qué |
|---|---|---|
| `lector:alto` | documento → página | Publica su alto para que el marco crezca hasta él |
| `lector:índice` | ambas | La página lo pide; el documento lo envía |
| `lector:posición` | documento → página | Dónde está una sección, para que la página se desplace |
| `lector:tema` | página → documento | El tema del sitio manda |
| `lector:pregunta` | página → documento | «Ya estoy escuchando, repite» |

---

## Tres trampas que costaron encontrar

### El bucle del alto

El marco toma su alto de lo que el documento publica, y el documento medía con
`document.body.scrollHeight`. Ese valor vale **al menos** el alto del marco, de
modo que se informa 1.200, el marco pasa a 1.200, se vuelve a medir 1.200 y así
sin fin. Llegó a **3.147.655 píxeles**.

Se mide `.lector`, que es el contenido y no crece porque crezca el marco. El
`ResizeObserver` va sobre el mismo elemento, por la misma razón.

### El primer aviso no lo oye nadie

El marco viaja en el HTML que sirve el servidor, así que empieza a cargar en
cuanto el navegador lee la página: su guion corre **antes** de que React
hidrate y ponga su escuchador. Esperar a `onLoad` tampoco vale, porque para un
marco ya cargado React no lo dispara.

El resultado era un documento clavado en 1.200 px y un índice vacío, sin ningún
error en consola. Lo resuelve `lector:pregunta`: la página pregunta cada 250 ms
hasta que le contestan.

### El alto no es uno solo

Cambia tres veces después de `load`: cuando llegan las fuentes, cuando el
navegador reflowea las tablas anchas y cuando cambia el ancho. Un solo aviso
deja el documento cortado por abajo.

---

## Contraste

Los 36 colores que la hoja original tiene escritos dentro de las reglas se
redeclaran contra variables, porque **un color suelto es un color sin
equivalente oscuro**, y en modo oscuro se ve como una mancha clara.

Los suelos son los del sitio —`#F7F4EE` y `#09131D`— para que embebido no haya
costura.

Comprobado sobre 34 tipos de elemento en los dos temas: **ninguno baja de
4,5 : 1**, y la mayoría pasa de 7 : 1. Las tintas que no llegaban se
oscurecieron —`--faint`, `--acc` y el chip «no concluyente»— en vez de dejarlas
pasar.

---

## Publicar la versión siguiente

1. Dejar el documento entregado en
   `content/reports/<informe>/entregas/<versión>/`, **sin tocarlo**.
2. Añadir su entrada a `scripts/informes/lector/documentos.mjs`.
3. `npm run informe:lector`
4. Añadir la versión a `src/data/reports.ts` con `reading: 'documento'`
   (ver [07 · Puente con el sitio](07-puente-con-el-sitio.md)).
5. `npm run verify`

El paso 3 es el que se olvida, y por eso hay una prueba que lo caza: si un
documento declarado `reading: 'documento'` no lleva la capa, el conjunto falla.

**Las versiones históricas no se reconstruyen.** No están en `documentos.mjs` y
no deben estarlo: una versión publicada no se sobrescribe, y volver a generar
la v0.7.0 con la capa de hoy cambiaría un archivo que alguien pudo citar.
