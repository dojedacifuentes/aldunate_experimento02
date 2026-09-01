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

## Componentes

**Nuevos**

| Componente | Archivo |
|---|---|
| `MaturityBadge`, `MaturityLevel`, `EditorialStatus`, `EpistemicTag` | `src/components/common/status.tsx` |
| `Disclosure`, `Breadcrumbs` | `src/components/common/ui.tsx` |
| `ClaimList`, `SourceList`, `SchemaDisclosure` | `src/components/research/EvidenceMatrix.tsx` |

**Refactorizados**: `SiteHeader`, `SiteFooter`, `MetaRow`, `LabCatalog`,
y las páginas `/`, `/informes`, `/informes/[slug]`, `/investigacion`,
`/laboratorio`, `/aldunate`, `/experimentos/juegos/ley-de-los-audaces`.

**Retirado del árbol público, conservado a propósito**: `InstitutionalMark`
—sin usos, documentado, para que restituirlo el día que haya autorización sea un
`import`—. El retrato `eva-pucv-courtyard.png` salió de `public/` y vive en el
historial de git.

**Utilidades nuevas**: `formatSourceDate`, `datePrecision` (`src/lib/utils.ts`);
`maturityMeta` (`src/data/lab.ts`); `site.field`, `site.proposition`
(`src/data/site.ts`).

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
