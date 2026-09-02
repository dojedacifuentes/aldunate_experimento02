# UX-UI-CHANGELOG · Experimento 02

Rediseño ejecutado el 31-08-2026 sobre `main` en `76e4a9f`, rama
`rediseno/ux-ui-fase-0`. Organizado por fase, no por archivo. La auditoría que
lo motiva, con los hallazgos numerados U-01…U-18, está en
[`UX-UI-AUDIT.md`](UX-UI-AUDIT.md).

**Línea base** (antes de tocar nada): 0 errores · 8 avisos · 46 tests · 16 rutas.
**Al cerrar**: 0 errores · 8 avisos · **58 tests** · 16 rutas. Los ocho avisos son
los mismos de siempre, justificados en `docs/DECISIONS.md` D-022.

---

## Fase 1 · Datos falsos publicados y marca institucional

`a4a35ae`

Tres afirmaciones incorrectas estaban en producción y no esperaban a una fase de
diseño.

- **U-02.** `/investigacion` decía «Estado actual: registros vacíos — todavía no
  hay fuentes cargadas» a un scroll de su propia cabecera, que imprime 24
  fuentes y 18 afirmaciones. Aviso retirado; el mensaje de estado ahora se
  deriva de los datos.
- **U-06.** La nota de EVA en `/informes` afirmaba «ninguno concluido» y «el PDF
  de noventa y seis páginas». Son 76 y uno está descargable. Reescrita sin
  cifras escritas a mano.
- **U-04.** «Cuatro entradas» rotulaba una sección que pintaba cinco tarjetas.
- **U-05.** El mapa intelectual usaba `Surface interactive`: cinco territorios
  que se iluminaban al pasar el cursor sin llevar a ninguna parte.
- **U-14.** «Entrar» llevaba a `/aldunate`, que declara su propio hueco.
- **U-08 (parcial).** `/investigacion` no existía en el header de escritorio.
- **U-12 y U-18 · el escudo.** Retirado de las cinco pantallas. Y con él el
  retrato `eva-pucv-courtyard.png`, que llevaba el escudo, el logotipo «DERECHO
  PUCV» y el rótulo «EVA · ESCUELA DE DERECHO PUCV» **incrustados en el píxel**
  y estaba en la portada. `CLAUDE.md` regla dura 3 ordenaba lo contrario y se
  actualizó en el mismo cambio. Decisión completa en `docs/DECISIONS.md` D-033.

---

## Fase 2 · Design system

`cf2253f`

- **U-13 · tres familias de estado.** `Badge` con un tono de color servía a la
  vez para madurez del artefacto, estado editorial y nivel de evidencia:
  «Prototipo», «En revisión» y «Señal» eran indistinguibles de un vistazo. Ahora
  cada familia tiene silueta propia y la distinción sobrevive en escala de
  grises.

  | Familia | Componente | Forma |
  |---|---|---|
  | Madurez del artefacto | `MaturityBadge` | píldora con punto |
  | Grado de prueba | `MaturityLevel` | metadato en línea |
  | Estado editorial | `EditorialStatus` | sello con filo izquierdo |
  | Nivel de evidencia | `EpistemicTag` | código entre corchetes `[SEÑAL]` |

- La madurez de las fichas del Lab se imprimía en crudo: «madurez: en-prueba»,
  con guion incluido. Ahora pasa por `maturityMeta`.
- **U-15 · `Disclosure`.** `<details>` nativo: accesible sin ARIA a medida,
  operable con teclado, funciona sin JavaScript y responde a `Ctrl+F` en los
  navegadores que buscan dentro de detalles cerrados.
- **U-09 · `Breadcrumbs`.** Semántico, con `aria-current` en el último tramo.

---

## Fase 3 · Navegación global

`cf2253f`

- **U-08.** Jerarquía invertida: `/aldunate` abría la navegación con tres
  páginas que declaran su propio hueco, mientras `/investigacion` —24 fuentes—
  era secundaria y no aparecía en el header de escritorio. Ahora primarias
  **Informes · Experimentos · Lab**, secundarias **Investigación · Aldunate**,
  las dos visibles y con menos peso. Los `code` de cada `PageHeader` se
  renumeraron para seguir el orden.
- **U-11 · footer.** Once enlaces en tres columnas, el descargo largo, el aviso
  del escudo, año, versión y firma de EVA: un segundo índice del sitio. Ahora
  cinco secciones en una fila, el descargo —que no se toca— y la versión.

---

## Fase 4 · Portada

`cf2253f`

- **U-01.** El `<h1>` era el nombre del profesor a 72 px, y también el título de
  la pestaña y de cualquier enlace compartido. Eso presenta el sitio como suyo,
  y no lo es: no lo encargó y todavía no sabe que existe. Ahora encabeza el
  laboratorio con la jerarquía **producto → campo → propuesta → acción**, y el
  nombre baja al mapa intelectual, donde es contexto y no firma.
- Las tres puertas primarias en un grid propio; las dos capas de apoyo debajo,
  con menos peso. Cinco tarjetas idénticas hacían que sostener la evidencia
  pareciera tan primario como leer un informe.
- La acción principal apunta al informe **más reciente**, calculado, no elegido
  a mano.

---

## Fase 5 · Investigación

`8e503aa`

El cambio con más consecuencia.

- **U-03.** El sitio afirmaba trazabilidad desde su primera versión y no la
  enseñaba: `/investigacion` mostraba el **esquema** de los registros y nunca los
  registros. 24 fuentes y 18 afirmaciones vivían en `src/data/research.ts` sin
  una sola ruta que las pintara. Era el único fallo que contradecía la tesis del
  propio proyecto.
- Ahora se publican. Cada afirmación lleva su nivel de evidencia, su advertencia
  de lectura **sin plegar** —es lo que impide citar la cifra sin su alcance— y
  los identificadores de sus fuentes como enlaces de ancla. El recorrido
  afirmación → fuente → publicación original se hace con el ratón.
- **Fechas con la precisión que tienen.** `26.06.2024`, `11.2024` o `2025` a
  secas, y las dos últimas lo declaran. De cinco fuentes sólo se conoce el año.
  Nuevas utilidades `formatSourceDate` y `datePrecision`.
- **Hallazgo derivado.** Al publicarlo apareció lo que el registro escondía
  mientras nadie lo pintaba: **4 de las 24 fuentes no las cita ninguna
  afirmación**. Van marcadas y el recuento se calcula.
- El método —niveles, reglas, esquemas— baja a segunda capa en `Disclosure`. La
  página era la secuencia larga que el encargo describe como el patrón a evitar:
  se recorría entera sin ver una fuente.

---

## Fase 6 · Lab, migas de pan y EVA

`251ee1e`

- **U-16.** Ocho fichas con entradas, salidas y la lista completa de límites
  desplegadas a la vez. Ahora la tarjeta responde de un vistazo y
  `Entra / Sale / No hace` se despliega a petición. El **recuento de límites se
  queda en la tarjeta cerrada**: es lo que impide leer un prototipo como
  producto y no puede esconderse detrás de un clic.
- Aparece el dato que la ficha no daba: **ninguna de las ocho tiene `demoUrl` ni
  `repoUrl`**. Van marcadas «sin artefacto consultable».
- **U-09.** Migas de pan en el juego (tercer nivel, sólo decía «← Juegos») y en
  la ficha de informe, cuyo título es demasiado largo para orientar solo.
- **U-07.** EVA sale de las dos capas de evidencia —`/investigacion` y la ficha
  de informe—, que es donde su voz competía con la voz metodológica. Se queda
  como *empty state* en los catálogos vacíos y en el panel flotante.

---

## Fases 7–8 · Responsive, accesibilidad y pruebas

`(este cambio)`

Medido en el navegador, no supuesto.

- **Overflow horizontal.** Un caso real:
  `/informes/transformacion-ensenanza-derecho` desbordaba 69 px a 375 px de
  ancho. Causa: la ruta `content/reports/02_transformacion_ensenanza_derecho/`
  es un token de 374 px sin punto de corte, y `min-width: auto` del grid le
  reservaba el ancho entero. Corregido en `MetaRow` con
  `overflow-wrap: anywhere` —y no `break-words`, que parte la palabra al pintar
  pero **no** reduce su tamaño min-content, que era el problema—.
- **Objetivo táctil (WCAG 2.2 AA 2.5.8).** 48 enlaces por debajo de 24 px:
  las migas de pan (17 px), los enlaces de fuente de la matriz (14 px), los del
  footer (18 px) y «Abrir fuente» (20 px). Corregidos con `min-h-6` en los
  componentes compartidos. El único que queda es un enlace dentro de una frase,
  al que sí alcanza la excepción de enlace en línea.
- **Contraste.** 118 fallos reales en tema claro, todos en variantes con
  opacidad: `text-muted-foreground/70` daba 3.31 y `/80` daba 4.02, contra el
  4.5 exigido. Eliminadas. **0 fallos** en ambos temas tras la corrección.
- **Jerarquía de encabezados.** Un solo `h1` por ruta y ningún salto de nivel en
  ninguna de las 16.
- **Teclado.** Ningún `tabindex` positivo, `<summary>` enfocable y operable, la
  regla `:focus-visible` presente, y el enlace de salto apunta a un destino que
  existe.
- **12 pruebas nuevas** en `src/data/sitio.test.ts`. Las 46 anteriores eran
  todas del juego: nada cubría `src/data/`, que es donde vivían los dos defectos
  de la auditoría. Verifican que las afirmaciones citen fuentes existentes, que
  las fechas no lleven relleno del 1 de enero, que los códigos de navegación
  sean consecutivos, que el footer enlace exactamente las cinco secciones y que
  ninguna ficha se declare estable sin artefacto.

---

## Fase 9 · Capa espacial

`(este cambio)` · 02-09-2026

Las fases 1 a 8 dejaron el sitio correcto y coherente. Lo que no dejaron es un
sitio con **una sola manera de moverse**: el 01-09 `/aldunate` estrenó un motor
de movimiento, un modo lectura y un lenguaje de interacción propios, y se
quedaron ahí. La medición de partida fue ésta:

| Pieza | Dónde estaba |
|---|---|
| Motor de movimiento (`MotionStage`) | montado sólo en `/aldunate` |
| `data-reveal` | 9 usos en `/aldunate`, **0 en las otras 13 páginas** |
| Modo lectura | dentro de `SectionNav`, que sólo renderiza en `/aldunate` |
| CSS del sistema (`html.motion`, movimiento reducido, impresión) | **ya era global** |

Es decir: **1 de 14 páginas**. Y la infraestructura CSS ya estaba hecha —y ya
resolvía accesibilidad e impresión—, así que lo único que ataba el patrón a esa
ruta era dónde se montaba el motor y quién llevaba el atributo.

### El motor sube al layout

`MotionStage` pasa a `SpatialStage` y se monta una vez para las dieciséis
rutas. Sigue habiendo **un** observador, **un** listener de scroll pasivo y
**un** ticker; se le suman el reflejo del puntero —también delegado, un solo
listener para todas las tarjetas— y la profundidad al desplazar.

**El detalle que hace que esto pueda ser global.** En el App Router un
componente del layout se monta una vez y sobrevive a todas las navegaciones de
cliente. Un efecto con `[]` habría observado los elementos de la primera página
visitada y de ninguna más: a partir del segundo clic, todo lo que llevara
`data-reveal` se habría quedado en `opacity: 0` **para siempre**. El efecto
depende de `usePathname()`.

Se comprobó midiendo, no leyendo: navegando por clic a `/aldunate` desde otra
ruta, los 10 elementos de esa página reciben su clase. El temporizador que se
la da nace dentro del efecto, así que sólo puede haber disparado si el efecto
volvió a correr.

### Computación espacial, y dónde se para

El lenguaje visual que pedía el encargo —vidrio, tarjetas grandes, esquinas
blandas, profundidad ligera, microanimaciones— con un límite explícito en cada
punto, porque es lo que separa «sutil» de «plantilla»:

- **Material sólo donde algo flota.** `.glass` lleva desenfoque **y saturación**
  —la saturación es la mitad del truco y la que casi siempre falta: desenfocar
  sin saturar deja el fondo lavado y el vidrio parece plástico—. Lo llevan la
  cabecera, la barra de pestañas y el panel de EVA. Nada más.
- **La cabecera es de vidrio sólo cuando hace falta.** Arriba del todo es
  transparente; el material aparece cuando el contenido empieza a pasar por
  debajo.
- **Reflejo del cursor** al 10-13 %, movido con `transform` y encendido con
  `opacity`. Se enciende con un atributo que pone el motor y no con `:hover`,
  porque con `:hover` el halo aparece en la esquina durante un fotograma y
  cruza la tarjeta en diagonal.
- **Dos radios, no uno.** El radio base sube de 8 a 12 px y las tarjetas que
  flotan usan 20. Cuanto más alto está un elemento, más blanda es su esquina.
- **Una excepción declarada a la regla de fluidez:** la sombra de elevación
  transiciona `box-shadow`, que repinta. Ocurre en un elemento cada vez y es lo
  que ya hacía `.surface-interactive` desde la primera versión.

### La tipografía del sistema, y sólo en el chrome

Entra `--font-ui` —SF Pro en un aparato de Apple, Segoe UI Variable en
Windows—, que no se descarga y hace que la navegación se parezca a la del
aparato en el que se lee.

**No sustituye a las tres familias**, y el límite es la decisión, no un
descuido: `CLAUDE.md` §5 y la §3 de esta auditoría dicen que el reparto serif /
grotesk / mono «es lo que separa *archivo constitucional* de *landing de
producto*». Con SF en la prosa, el sitio sería la plantilla genérica que el
propio encargo pedía evitar. Manda sobre navegación, botones, controles y
rótulos. Nada más.

### Navegación inferior

El menú de hamburguesa desaparece en pantallas estrechas y lo sustituye
`<TabBar>`. Las cinco secciones del sitio son exactamente el máximo que admite
el patrón, y se ven sin abrir nada, al alcance del pulgar.

Se pierde algo y conviene decirlo: las pistas de una línea que el menú mostraba
bajo cada entrada. Siguen en las tarjetas de la portada, que es donde se decide
entrar.

**No desaparece en modo lectura.** Ese modo retira lo que existe para la
pantalla, pero en un teléfono esto es la única navegación de la ruta: quitarla
dejaría al lector encerrado en la página.

### El modo lectura deja de ser de una ruta

Sube a la cabecera y funciona en las dieciséis. El estado sigue viviendo en un
atributo del `<html>` leído con `useSyncExternalStore` —tiene que vivir ahí de
todos modos, porque es CSS quien lo aplica, y duplicarlo en un `useState` crea
dos fuentes de verdad—, pero ahora en un módulo propio,
`components/layout/reading-mode.ts`. `SectionNav` cede el botón en vez de
ofrecer un segundo control para el mismo modo.

### Lo que apareció al medir

- **El panel de EVA se montaba 41 px encima de la barra de pestañas** y tapaba
  dos de las cinco secciones. Las capas flotantes usan ahora un suelo común,
  `--float-bottom`, que cuenta el alto de la barra y `env(safe-area-inset-bottom)`.
  Una variable y no una clase por componente: la próxima capa flotante hereda
  el suelo sin que nadie tenga que acordarse.
- **Veintiséis objetivos táctiles bajo 24 px en `/aldunate`**, todos anteriores
  a este cambio: veinte fichas de filtro del explorador a 21 px, dos enlaces de
  texto a 15 y cuatro enlaces de fuente de la cronología a 17. Ninguno es
  enlace en línea, así que la excepción de WCAG 2.2 AA 2.5.8 no los cubre.
  Quedan en cero, con el mismo `min-h-6` de la Fase 8.

### Dos artefactos de medición que casi se publican como fallos

Se anotan porque cuestan media hora cada vez y volverán a aparecer.

- **«Todas las apariciones se quedan invisibles en las siete rutas.»** Falso. El
  panel de vista previa estaba oculto: `document.hidden` a `true`, **0
  fotogramas en 500 ms** y las transiciones en `running` con `currentTime: 0`.
  Un `IntersectionObserver` no dispara sin ciclo de render, y `getComputedStyle`
  devuelve el valor congelado del inicio. Forzando el fin de las transiciones,
  la opacidad final es 1 en todas. Para eso existe la red de seguridad de 3 s.
- **«224 px de desborde horizontal.»** Falso. `clientWidth` valía **0**: el
  panel estaba colapsado. Con un viewport real, 0 desbordes en las siete rutas
  a 375 px.

La lección es la de siempre en este equipo: **antes de creerse una medida, medir
el instrumento.**

### Verificación

`npm run verify` → 0 errores · 8 avisos conocidos (D-022) · 86 tests · 16 rutas.

Medido en el navegador: **0 fallos de contraste** en los dos temas, **0
desbordes horizontales** en las siete rutas a 375 px, **0 objetivos táctiles**
bajo 24 px. La barra de pestañas aparece bajo 1024 px y la navegación de
escritorio por encima, nunca las dos.

**Sin revisión visual completa.** El panel de vista previa dejó de producir
fotogramas a mitad de sesión —el fallo conocido en sesiones largas— y la
comprobación se hizo midiendo el DOM: geometría, contraste calculado sobre el
píxel compuesto y estado de las transiciones. Hay dos capturas, de la barra de
pestañas y de la cabecera, y no más.

---

## Componentes

**Nuevos**

| Componente | Archivo |
|---|---|
| `MaturityBadge`, `MaturityLevel`, `EditorialStatus`, `EpistemicTag` | `src/components/common/status.tsx` |
| `Disclosure`, `Breadcrumbs` | `src/components/common/ui.tsx` |
| `ClaimList`, `SourceList`, `SchemaDisclosure` | `src/components/research/EvidenceMatrix.tsx` |
| `SpatialStage` — motor de movimiento y luz de todo el sitio (Fase 9) | `src/components/motion/SpatialStage.tsx` |
| `TabBar` — navegación inferior en pantallas estrechas (Fase 9) | `src/components/layout/TabBar.tsx` |
| `ReadingModeToggle` y el estado compartido del modo lectura (Fase 9) | `src/components/layout/ReadingModeToggle.tsx` · `reading-mode.ts` |

**Refactorizados**: `SiteHeader`, `SiteFooter`, `MetaRow`, `LabCatalog`,
y las páginas `/`, `/informes`, `/informes/[slug]`, `/investigacion`,
`/laboratorio`, `/aldunate`, `/experimentos/juegos/ley-de-los-audaces`.

**Retirado del árbol público, conservado a propósito**: `InstitutionalMark`
—sin usos, documentado, para que restituirlo el día que haya autorización sea un
`import`—. El retrato `eva-pucv-courtyard.png` salió de `public/` y vive en el
historial de git.

**Borrado en la Fase 9**: `MotionStage`. No se conserva porque no se retira
—`SpatialStage` es el mismo motor, con dos capacidades más y montado un nivel
más arriba—. Dejarlo habría permitido montar dos motores a la vez, que es
exactamente el problema que su propia documentación existía para evitar.

**Utilidades nuevas**: `formatSourceDate`, `datePrecision` (`src/lib/utils.ts`);
`maturityMeta` (`src/data/lab.ts`); `site.field`, `site.proposition`
(`src/data/site.ts`); y en la Fase 9 las clases `.glass`, `.ui`, `.elev-1..3`,
`.rounded-spatial`, `.floating-layer` y `.tabbar`, más los atributos que lee el
motor —`data-reveal`, `data-spatial`, `data-press`, `data-hero`, `data-depth`,
`data-count`— documentados en `CLAUDE.md` §5.1.

---

## Rutas revisadas

Las 16. Todas inspeccionadas a 375 px, y las cuatro más densas además a 320 px,
1366 px y en los dos temas.

`/` · `/informes` · `/informes/ia-escuelas-derecho-chile` ·
`/informes/transformacion-ensenanza-derecho` · `/investigacion` · `/laboratorio` ·
`/experimentos` · `/experimentos/constitucion` · `/experimentos/gramatiquerias` ·
`/experimentos/juegos` · `/experimentos/juegos/ley-de-los-audaces` · `/aldunate` ·
`/aldunate/papers` · `/aldunate/cursos` · `/_not-found` · slug inexistente (404).

---

## Verificación

```bash
npm run verify
```

`typecheck` limpio · `lint` 0 errores y 8 avisos conocidos · 58 tests · build de
producción con 16 rutas.

Sin capturas de pantalla: el panel de vista previa dejó de responder en esta
sesión —fallo conocido en sesiones largas— y la comprobación visual se hizo
midiendo el DOM (`getBoundingClientRect`, contraste calculado sobre el píxel
real con canvas), no mirando imágenes.

---

## Pendientes

Sólo lo que requiere una decisión que no es técnica.

- **Autoría.** `src/data/reports.ts` firma «Equipo Experimento 02». Falta el
  nombre del responsable y el reparto de roles. Hallazgos A-13 y A-25 del
  encargo de auditoría.
- **Estado de las fichas del Lab.** Cuatro se declaran `prototype` sin nada
  consultable. No las he degradado a `idea`: una plantilla o una rúbrica pueden
  existir fuera del sitio, y degradarlas sería el error contrario. Es decisión
  del autor.
- **Título canónico del Informe 02.** La web y el PDF llevan títulos distintos.
  Hallazgo A-23; se resuelve en el encargo de auditoría, no en éste.
- **Búsqueda global** (U-10) y **taxonomía navegable del mapa intelectual**
  (U-05). Prioridad P1 y P2 del encargo; con dos informes, 24 fuentes y once
  experimentos la navegación jerárquica todavía alcanza, pero es el techo.
