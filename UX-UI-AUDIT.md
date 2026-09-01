# Auditoría UX/UI · Experimento 02

**Fecha:** 31-08-2026 · **Base:** `main` en `76e4a9f` · **Rama:** `rediseno/ux-ui-fase-0`
**Encargo:** `CLAUDE MASTER PROMPT — REDISEÑO UX/UI DE EXPERIMENTO 02`
**Método:** lectura completa del árbol `src/`, `npm run verify` como línea base,
y verificación de cada hallazgo contra archivo y línea.

Este documento existe para ejecutar. Cada hallazgo trae ubicación, causa y
arreglo. Lo que no se puede arreglar sin una decisión tuya está en §7.

---

## 1. Línea base

Medida antes de tocar nada, para poder comparar al cerrar.

```
npm run verify → 0 errores · 8 avisos · 46 tests · 16 rutas · build OK
```

Los ocho avisos están justificados en `docs/DECISIONS.md` D-022 y no se tocan:
siete vienen del código donado del juego, uno de `figure-sprite.mjs`.

---

## 2. Arquitectura actual

**Stack.** Next 16.3.3 (App Router, Turbopack), React 19, TypeScript estricto,
Tailwind v4 con `@theme inline`, framer-motion, lucide-react, Vitest. Sin
backend, sin base de datos.

**Rutas (16).**

| Ruta | Archivo | Rol |
|---|---|---|
| `/` | `src/app/page.tsx` | Portada |
| `/aldunate` `/aldunate/papers` `/aldunate/cursos` | `src/app/aldunate/` | Capa académica, vacía por diseño |
| `/laboratorio` | `src/app/laboratorio/page.tsx` | Catálogo de herramientas |
| `/informes` · `/informes/[slug]` ×2 | `src/app/informes/` | Biblioteca + ficha |
| `/investigacion` | `src/app/investigacion/page.tsx` | Método y trazabilidad |
| `/experimentos` + 4 hijas | `src/app/experimentos/` | Hub, labs y el juego |
| `/_not-found` | `src/app/not-found.tsx` | 404 |

**Datos.** Todo el contenido vive en `src/data/` (`site`, `aldunate`, `reports`,
`research`, `lab`, `experiments`, `eva`) y ningún componente visual inventa
contenido. Esta separación ya está bien resuelta y **no se toca**.

**Estilos.** Un solo sistema de tokens en `src/app/globals.css`: paleta
semántica en `:root` y `.dark`, tipografía en tres familias con oficio
declarado (serif editorial, grotesk de interfaz, mono de metadatos), radios,
superficies, ambiente. Más `rpg.css` y `juego.css`, ámbito exclusivo del juego.

**Primitivas existentes** en `src/components/common/ui.tsx`: `Surface`,
`Badge` (con seis tonos), `Button` / `ButtonLink` (cuatro variantes, tres
tamaños), `Container`, `PageHeader`, `Section`, `PendingBlock`, `Notice`,
`MetaRow`.

---

## 3. Lo que se conserva

No es cortesía: es delimitación de alcance. Nada de esto se refactoriza.

- **El sistema de tokens de `globals.css`.** Está completo, es coherente en los
  dos temas y ya resuelve `:focus-visible`, `prefers-reduced-motion`, el enlace
  de salto y una hoja de impresión. La Fase 1 del encargo está en su mayor parte
  hecha; lo que falta son componentes, no tokens.
- **La separación datos / presentación.** `src/data/` es la fuente y los
  componentes leen de ahí.
- **Las tres familias tipográficas y su reparto.** Es lo que separa «archivo
  constitucional» de «landing de producto».
- **`PendingBlock`.** Un hueco declarado como decisión. Raro y valioso.
- **El campo «no hace» de las fichas del Lab.** Patrón propio del producto.
- **La franja de prototipo y `robots: noindex`** (`src/app/layout.tsx:76`).
- **El juego entero.** Tiene su propio shell, sus propios tokens y 46 tests.
  Fuera de este encargo.
- **EVA como personaje**, con el alcance reducido que describe U-07.

---

## 4. Problemas encontrados

Severidad: **ALTA** = dato falso, afirmación contradictoria o pérdida de
orientación. **MEDIA** = fricción real. **BAJA** = pulido.

### U-01 · ALTA · La portada anuncia a una persona, no al producto

`src/app/page.tsx:34` — el `<h1>` es `profile.name`, el nombre del profesor. El
producto aparece sólo en la línea superior (`site.eyebrow`, «Un experimento
digital») y en el título del navegador va detrás del nombre
(`src/app/layout.tsx:43`).

Dos motivos para corregirlo, y el segundo pesa más que el primero:

1. El encargo (§5) pide la jerarquía `PRODUCTO → CAMPO → PROPUESTA → ACCIÓN`.
2. **El sitio no fue encargado y al profesor todavía no se le ha planteado**
   (`docs/PUENTE-Y-HOJA-DE-RUTA.md` §0). Una portada cuyo primer elemento es su
   nombre a 72 px se lee como sitio suyo, que es exactamente lo que la regla
   dura 2 de `CLAUDE.md` prohíbe.

**Arreglo:** H1 = `EXPERIMENTO 02`; campo y propuesta debajo; el profesor pasa a
ruta secundaria descrita como objeto de estudio, no como autor.

### U-02 · ALTA · `/investigacion` se contradice a sí misma en una pantalla

`src/app/investigacion/page.tsx:161-163` imprime:

> **Estado actual: registros vacíos** — Todavía no hay fuentes cargadas.

…mientras que las líneas 49 y 53 de la **misma página** imprimen
`{sources.length}` = **24** y `{claims.length}` = **18**.

Es el hallazgo A-21 del encargo de auditoría, y es peor de lo que describe: no
son dos vistas desincronizadas, son dos afirmaciones opuestas a un scroll de
distancia. El aviso es texto residual de cuando el registro sí estaba vacío.

**Arreglo:** eliminar el aviso y derivar todo mensaje de estado de
`sources.length` / `claims.length`.

### U-03 · ALTA · Las 24 fuentes y las 18 afirmaciones no se muestran en ninguna parte

`src/data/research.ts` (32 KB) contiene el corpus completo con fechas, diseño,
muestra, limitaciones y nivel de evidencia por registro. La página de
Investigación muestra **el esquema de los campos**, no los registros:
`SchemaTable` recibe `sourceSchema` y `claimSchema`, que son definiciones.

El sitio afirma trazabilidad y no la enseña. Es el único fallo de esta auditoría
que contradice la tesis del propio proyecto.

**Arreglo:** las fuentes y la matriz de evidencia se publican como primera capa
navegable; el esquema baja a segunda capa. Requiere componentes nuevos, no sólo
maquetación.

### U-04 · MEDIA · «Cuatro entradas» pinta cinco tarjetas

`src/app/page.tsx:70` rotula la sección «Cuatro entradas»; las líneas 82-90
pintan `primaryNav` (4) y después `secondaryNav` (1). Hallazgo A-28.

**Arreglo:** tres rutas primarias, dos secundarias, y el rótulo deja de contar.

### U-05 · MEDIA · El mapa intelectual promete interacción que no existe

`src/app/page.tsx:116` envuelve cada territorio en `<Surface interactive>`, que
aplica `surface-interactive`: cambio de borde y sombra al pasar el cursor. No
hay `<Link>` ni `onClick`. Cinco elementos que se iluminan y no llevan a
ninguna parte. Viola la regla absoluta de §7 del encargo.

**Arreglo:** o taxonomía navegable, o se retira el afiordance. Los datos para la
taxonomía existen —`researchLines[].related` ya nombra las piezas
relacionadas—, así que se puede hacer bien.

### U-06 · ALTA · La nota de EVA en `/informes` afirma dos cosas falsas

`src/app/informes/page.tsx:107-110`:

> «Dos informes abiertos, **ninguno concluido**. […] el PDF de **noventa y seis
> páginas** sin índice»

El Informe 02 está en `en-revision` con PDF, DOCX y resumen ejecutivo
descargables (`public/descargas/`), y tiene **76 páginas**, no 96. Copy que
envejeció y quedó afirmando datos incorrectos.

Es además el caso que ilustra por qué EVA no debe hablar sobre estado de
evidencia: el número no vive en `src/data/`, está escrito a mano dentro de un
componente visual.

**Arreglo:** reescribir la nota sin cifras, o derivarlas del dato.

### U-07 · MEDIA · EVA aparece en las 14 páginas, siempre en el mismo sitio

`grep -l EvaNote src/app` devuelve **14 de 14** páginas, todas con el bloque al
final. Más `EvaGuide`, panel flotante global (`src/app/layout.tsx:118`).

El encargo (§14) lo nombra literalmente: «el mismo bloque al final de todas las
páginas». El panel flotante en cambio está bien construido —se cierra con
Escape, no atrapa el foco, se puede silenciar— y se conserva.

**Arreglo:** EVA baja a intervención selectiva. Sale de Investigación e
Informes, que son capas de evidencia; se queda donde interpreta o acompaña.

### U-08 · ALTA · La jerarquía de navegación no coincide con lo que el sitio ofrece

`src/data/site.ts` declara como primarias: Aldunate, Lab, Informes,
Experimentos. Secundaria: Investigación.

Dos consecuencias:

- **`/investigacion` no existe en el header de escritorio.**
  `SiteHeader.tsx:63` pinta sólo `primaryNav`; la ruta secundaria aparece
  únicamente en el menú móvil (línea 118). En un portátil, la capa que sostiene
  todo el proyecto sólo se alcanza desde el footer o desde la portada.
- **`/aldunate` es primaria y está vacía por diseño** —tres páginas que declaran
  su hueco—, mientras Investigación, con 24 fuentes, es secundaria.

**Arreglo:** primarias Informes · Experimentos · Lab; secundarias Investigación
y Aldunate; y las secundarias visibles en escritorio, con menos peso.

### U-09 · MEDIA · Sin breadcrumbs en las rutas profundas

`/experimentos/juegos/ley-de-los-audaces` y `/informes/[slug]` no tienen rastro
de regreso salvo el header. Cuatro rutas lo justifican.

### U-10 · MEDIA · Sin búsqueda

No existe. Con 2 informes, 24 fuentes, 18 afirmaciones, 11 experimentos y 8
fichas de Lab, la navegación jerárquica todavía alcanza, pero es el techo.

### U-11 · MEDIA · El footer vuelve a contar el sitio entero

`SiteFooter.tsx` pinta tres columnas con once enlaces, el descargo largo, el
aviso del escudo, el año, la versión y la firma de EVA. Es un segundo índice.

### U-12 · ALTA · El escudo aparece en cinco lugares, cuatro de ellos de primer nivel

`InstitutionalMark` se usa en `page.tsx:199`, `informes/page.tsx:118`,
`informes/[slug]/page.tsx:415`, `aldunate/page.tsx:156` y `SiteFooter.tsx:23`.

**Decidido:** se retira del sitio público hasta que exista autorización. Ver §7.

### U-13 · MEDIA · Tres familias de estado comparten un mismo componente

`Badge` con `Tone` sirve simultáneamente para madurez del artefacto
(`idea` / `prototype` / `stable`), estado editorial del informe
(`en-investigacion` / `en-revision` / `publicado`) y nivel epistemológico
(los cinco de `evidenceLevels`). Mismo tratamiento visual, semánticas
incomparables. El encargo (§12) exige separarlas.

El color sí va acompañado de texto en todos los casos, así que el criterio de
accesibilidad se cumple; el problema es semántico.

### U-14 · MEDIA · CTA sin destino declarado

`page.tsx:47` dice «Entrar» y lleva a `/aldunate`. Verbo vacío y destino
inesperado. El encargo pide verbos concretos.

### U-15 · MEDIA · `/investigacion` es la secuencia larga que el encargo prohíbe

Cadena → niveles → principios → esquemas → estado → EVA, todo desplegado, sin
un solo `<details>` ni tabs en el sitio completo. Es exactamente el patrón que
§9 del encargo describe como el que hay que evitar.

### U-16 · MEDIA · El Lab es un catálogo de fichas sin artefacto

Ocho fichas, ninguna con `demoUrl` ni `repoUrl`, seis marcadas `prototype` sin
nada que probar. Diagnóstico previo en `docs/AUDITORIA-2026-08-31.md` H-03 y
propuesta de arreglo con contenido —no con más código— en
`docs/PUENTE-Y-HOJA-DE-RUTA.md` §3.

Para este encargo la parte UX es acotada: cards compactas, ficha de detalle bajo
demanda, y que la etiqueta de madurez diga la verdad.

### U-17 · descartado · Los slugs inválidos sí devuelven 404

Comprobado: `/informes/slug-inventado` → 404. `notFound()` está declarado en
`informes/[slug]/page.tsx:66`. No era un hallazgo.

### U-18 · ALTA · El escudo también viajaba dentro de un retrato de EVA

Encontrado al verificar U-12 en el navegador, no en el código.

`public/eva/eva-pucv-courtyard.png` —usado en la **portada** y en `/aldunate`—
lleva incrustados en el píxel: el escudo, el logotipo «DERECHO PUCV», el nombre
completo de la universidad en la esquina superior, y el rótulo
**«EVA · ESCUELA DE DERECHO PUCV»** sobreimpreso en grande. Compuesto como una
tarjeta institucional, con lo que parece el patio de la propia Escuela de fondo.

Es peor que el escudo suelto: presenta a un personaje fotorrealista como
representante de una institución que no lo ha autorizado. Retirar
`<InstitutionalMark>` y dejar esta imagen habría sido cambiar la puerta por la
que entra la marca, no cerrarla.

**Cómo pasó desapercibido:** ningún `grep` de nombres de componente encuentra
una marca dentro de un `.png`. La única forma de verlo es abrir los archivos.

**Arreglo aplicado:** clave `courtyard` eliminada del registro, del tipo y de
sus cuatro usos; archivo fuera de `public/`, recuperable del historial.

---

## 5. Quick wins

Cambios de menos de una hora, sin riesgo de regresión, con efecto visible.

| # | Qué | Dónde | Hallazgo |
|---|---|---|---|
| Q1 | Borrar el aviso «registros vacíos» | `investigacion/page.tsx:159-171` | U-02 |
| Q2 | Corregir «Cuatro entradas» | `page.tsx:70` | U-04 |
| Q3 | Reescribir la nota de EVA de Informes | `informes/page.tsx:105-113` | U-06 |
| Q4 | Quitar `interactive` del mapa intelectual | `page.tsx:116` | U-05 |
| Q5 | Cambiar «Entrar» por un verbo con destino | `page.tsx:44-50` | U-14 |
| Q6 | Añadir `/investigacion` al header de escritorio | `SiteHeader.tsx:63` | U-08 |

---

## 6. Problemas estructurales

Requieren componentes nuevos o cambio de arquitectura de información.

1. **Publicar el corpus de investigación** (U-03). Es el mayor y el que más
   cambia lo que el sitio demuestra.
2. **Reordenar la jerarquía de la portada y de la navegación** (U-01, U-08).
3. **Separar las tres familias de estado** en componentes distintos (U-13).
4. **Progressive disclosure** con un `Disclosure` accesible reutilizable (U-15).
5. **Breadcrumbs** (U-09) y **búsqueda** (U-10).
6. **Retirar el escudo** y revisar qué queda comunicando afiliación (U-12).

---

## 7. Riesgos de regresión

- **`InstitutionalMark` se retira, no se borra.** El componente se conserva sin
  usos en el árbol público, para que volver a ponerlo sea un import y no una
  reconstrucción. Y **`disclaimer.logoNotice` deja de tener sentido** cuando el
  escudo no está: hay que quitarlo del footer o quedará un aviso sobre un
  elemento ausente.
- **`CLAUDE.md` regla dura 3 dice lo contrario.** Ordena conservar el escudo con
  aviso. Se actualiza en el mismo PR: si el código y la regla se separan, gana
  el error.
- **Cambiar `primaryNav` toca cinco archivos.** `SiteHeader`, el menú móvil, la
  portada, el footer y los `code` («01 · Aldunate»…) que se imprimen en cada
  `PageHeader`. Renumerar sin revisar deja códigos duplicados.
- **`ExperimentCard` no puede envolverse en `<Link>`** cuando la pieza es
  jugable: `<a>` dentro de `<a>` rompe la hidratación. Ya ocurrió una vez
  (`docs/AUDITORIA-2026-08-31.md` H-01). Vale para cualquier card nueva.
- **Las clases de Tailwind se escriben completas.** Una clase construida en
  runtime no llega a la hoja de estilos. Ya está documentado en `ui.tsx:31`.
- **Ninguna prueba cubre `src/data/` ni las rutas del sitio.** Los 46 tests son
  todos del juego. Cualquier cambio de datos se verifica a mano hasta que
  existan pruebas; conviene añadirlas en la Fase 8.

---

## 8. Orden propuesto de implementación

Cada fase termina con `npm run verify` verde y un commit.

| Fase | Qué | Hallazgos |
|---|---|---|
| **1** | Quick wins Q1–Q6 y retirada del escudo | U-02 U-04 U-05 U-06 U-12 U-14 U-18 |
| **2** | Design system: familias de estado, `Disclosure`, `Breadcrumbs`, CTA | U-13 U-15 U-09 |
| **3** | Navegación global: jerarquía, header, footer compacto | U-08 U-11 |
| **4** | Portada | U-01 |
| **5** | Investigación: publicar fuentes y matriz | U-03 |
| **6** | Lab: cards compactas y fichas de detalle | U-16 |
| **7** | Experimentos: uniformar CTA y etiquetas | U-13 |
| **8** | Búsqueda, responsive, accesibilidad, pruebas de datos | U-10 U-17 |

El orden no es negociable en un punto: **U-02 y U-06 van primero** porque son
datos falsos publicados, y eso no espera a una fase de diseño.

---

## 9. Decisiones tomadas y pendientes

**Tomadas** (31-08-2026):

- **Escudo PUCV:** se retira del sitio público hasta que exista autorización.
  Prevalece el encargo de auditoría P0.9 sobre `CLAUDE.md` regla dura 3, que se
  actualiza en consecuencia.

**Pendientes** — bloquean trabajo del otro encargo, no de éste:

- **Autoría.** `src/data/reports.ts:33` y `:102` firman «Equipo Experimento 02».
  Falta el nombre del responsable y el reparto de roles.
- **Título canónico del Informe 02.** La web dice «Cómo se está transformando la
  enseñanza del Derecho…» (`reports.ts:97`) y el PDF «La universidad ante la
  automatización del trabajo cognitivo». Hallazgo A-23; se resuelve en el
  encargo de auditoría.
