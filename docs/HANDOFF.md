# Handoff · estado del sitio

**Última actualización:** 02-09-2026
**Quien lea esto primero:** `CLAUDE.md` y `AGENTS.md` mandan sobre este documento.

**Estado de esta sesión:** el kit canónico `v1.0.0` del Informe 01 está
desplegado en producción. La ficha y sus descargas PDF, Word, HTML, Markdown y
ZIP responden `200` en el dominio público.

---

## 0. Dónde está todo

| | |
|---|---|
| Repositorio | `dojedacifuentes/aldunate_experimento02` |
| Producción | https://aldunateexperimento02.vercel.app |
| Clon de trabajo | `C:\Users\Asus\Desktop\aldunate-juego-audaces` (tiene `node_modules`) |
| Segundo clon | `C:\Users\Asus\Desktop\aldunate_experimento02` — también con `node_modules`; el 01-09-2026 se sincronizaron los dos. Comprueba `git status` antes de usar cualquiera |
| Fuente del PDF | `tools/informes/informe-02/`, **dentro del repositorio** desde el 01-09-2026 |

La carpeta `Desktop\ALDUNEITOR\INFORME IA UNIVERSIDAD\_fuentes\` es **histórica**.
Fue el origen del documento hasta la v0.3.0 y ya no se edita: lo que hay allí
está copiado al repositorio y verificado idéntico. Editarla otra vez reabre A-29.

**Node está en el PATH** desde el 01-09-2026: `v24.20.0` y npm `11.19.0`, en
`C:\Program Files\nodejs`. Ya no hace falta preparar runtimes portátiles.

**No hay `gh` CLI.** Los PR se abren contra la API REST con `curl`. El token se
recupera con `git credential fill`, y **sólo funciona desde Bash**, no desde
PowerShell.

---

## 1. Qué se hizo en la sesión del 31-08 / 01-09-2026

Dos encargos, diez commits, dos ramas. Ambos partían de `main` en `76e4a9f`.

### Rama `rediseno/ux-ui-fase-0` → PR #10 · seis commits

Auditoría completa en `UX-UI-AUDIT.md`, detalle por fases en
`UX-UI-CHANGELOG.md`.

Lo que más importa:

1. **Tres datos falsos estaban publicados.** `/investigacion` decía «registros
   vacíos» a un scroll de su cabecera, que imprimía 24 fuentes. La nota de EVA
   en `/informes` decía «ninguno concluido» y «el PDF de noventa y seis
   páginas»: son 76 y uno está descargable. «Cuatro entradas» pintaba cinco.
2. **El escudo salió del sitio** —decisión del usuario, `DECISIONS.md` D-033— y
   con él el retrato `eva-pucv-courtyard.png`, que llevaba el escudo, el
   logotipo «DERECHO PUCV» y el rótulo «EVA · ESCUELA DE DERECHO PUCV`
   incrustados en el píxel y estaba en la portada. `CLAUDE.md` regla dura 3
   ordenaba lo contrario y se actualizó.
3. **Se publicaron las 24 fuentes y las 18 afirmaciones.** El sitio afirmaba
   trazabilidad y sólo enseñaba el *esquema* de sus registros.
4. Tres familias de estado con silueta propia; portada encabezada por el
   laboratorio y no por el nombre del profesor; navegación reordenada.
5. QA medido: un overflow de 69 px, 48 objetivos táctiles bajo 24 px y 118
   fallos de contraste, todos corregidos.

### Rama `auditoria/v0.3.0` → PR #11 · cuatro commits más

Estado hallazgo por hallazgo en **`docs/audit-v0.3.0.md`**. 23 resueltos, 5
parciales, 4 abiertos, 1 que requiere decisión humana, 1 no aplicable.

1. **Once afirmaciones recalibradas** al diseño de sus fuentes. «Perdió su
   validez» → «no puede presumirse, por sí sola»; «enteramente atribuible» →
   convergencia; «es la formación jurídica» → exposición intensa sin agotar la
   disciplina; «D5 · causalidad establecida» → «identificación causal en
   contexto experimental».
2. **Taxonomía partida en cuatro dimensiones** —estado documental, robustez,
   nivel demostrativo, generalización— que antes viajaban juntas bajo
   «VERIFICADO».
3. **Fuentes verificadas contra su publicación original.** Hallazgo no previsto:
   **PNAS publicó una corrección sobre Bastani et al. el 20-08-2025** que el
   informe no mencionaba. Registrada y visible en la ficha.
4. **Título canónico único**, estado de versión derivado de una sola fuente,
   cadena de conteos publicada (24 → 38 → 18 → 8).
5. **Informe regenerado como v0.3.0**: 77 páginas, portada con cifras
   contextualizadas, «Investigación aplicada» en vez de «Informe experto»,
   autoría con nombre, sin residuos de Word. v0.2.0 **no se sobrescribió**.
6. **Changelog a nivel de afirmación** y **política pública de correcciones** en
   `/correcciones`.

### Informe 01 · el corpus, y lo que el corpus descartó

El Informe 01 llevaba desde el 29-08 con la estructura montada y el registro
vacío. Ahora tiene corpus, en `tools/informes/informe-01/`, fundido desde tres
investigaciones profundas con el procedimiento de la skill `informe-vivo`. Ficha
en **v0.2.0**; la 0.1.0 no se sobrescribió.

Desde el 02-09 incorpora además el kit canónico metodológico `v1.0.0` en
`content/reports/01_ia_escuelas_derecho_chile/canonical/`, con fuente maestra,
manifiesto y plantillas para relevos entre ChatGPT, Claude y Gemini. Sus
exportaciones PDF, Word, HTML, Markdown y ZIP viven en `public/descargas/`. El
kit organiza la investigación; no sustituye el corpus ni constituye todavía el
informe sustantivo.

1. **43 fuentes públicas únicas**, todas institucionales y con fecha, sobre las
   once universidades de la cohorte. Los tres documentos de origen quedan
   versionados en `content/reports/01_ia_escuelas_derecho_chile/sources/`.
2. **Una de las tres investigaciones no pasó el paso 1 y quedó fuera.** Declaraba
   25 fuentes con identificador y ninguna tenía URL: eran marcadores internos del
   buscador del modelo que la produjo, irresolubles por un tercero. Un documento
   que se cae en el inventario no llega a la publicación.
3. **La cobertura es desigual por diseño y está declarado.** Nueve fuentes en
   cada universidad del piloto —PUCV, UC, U. de Chile— y dos en cada una de las
   otras ocho. Esa diferencia mide esfuerzo de investigación, no actividad
   institucional, así que **no se emite ninguna comparación nacional**. El
   informe publicará once fichas y ninguna tabla de posiciones hasta igualar.
4. **`sourceIds` y `claimIds` siguen vacíos, a propósito.** Que una URL responda
   —42 de 43 lo hacen— no prueba que diga lo que se le atribuye. Esa verificación
   no se delega y no está hecha.

### Lo que salió de validar la skill `informe-vivo`

- **El chequeo de identificadores huérfanos daba una falsa alarma sobre nuestros
  propios datos.** `comm` exige entrada única y un mismo `clm-` aparece dos veces
  en `reports.ts`, en `claimIds[]` y en `claimChanges[].claimId`. Corregido con
  `sort -u`, y de paso se le quitó la coma final al patrón, que habría hecho
  invisible al último elemento de un array sin coma de cierre.
- **La skill sólo se carga desde este repositorio**, cosa que ahora dice
  `CLAUDE.md` §8. Se descubrió no activándose con la sesión abierta en la carpeta
  donde viven los documentos de investigación.
- El paso de arbitraje ya no se da por vacío cuando no hay fuentes repetidas.

---

## 1bis. Sesión del 02-09-2026 · la capa espacial

Rama `rediseno/capa-espacial`. Detalle completo en `UX-UI-CHANGELOG.md`
Fase 9; las reglas que de aquí en adelante mandan, en `CLAUDE.md` §5.1.

**El diagnóstico de partida, medido.** El motor de movimiento, el modo lectura
y el lenguaje de interacción que estrenó `/aldunate` el 01-09 se habían quedado
en esa ruta: `data-reveal` tenía 9 usos allí y **0 en las otras trece páginas**.
La infraestructura CSS, en cambio, ya era global y ya resolvía movimiento
reducido e impresión. Lo único que ataba el patrón a una ruta era dónde se
montaba el motor.

**Qué cambió.**

1. `MotionStage` pasa a `SpatialStage` y sube al layout raíz: un motor para las
   dieciséis rutas. **Depende de `usePathname()`** y vuelve a escanear en cada
   navegación; con `[]` habría observado la primera página y ninguna más.
2. Lenguaje de computación espacial inspirado en las HIG de Apple: `.glass` con
   desenfoque y saturación, escala de elevación, reflejo del cursor, respuesta
   a la pulsación. Sólo llevan material las capas que flotan.
3. Cuarta familia `--font-ui` (SF Pro / Segoe UI Variable) **sólo en el chrome**.
   Las tres familias editoriales no se tocan, y ése es el límite que impide que
   el sitio se lea como una plantilla.
4. `<TabBar>` sustituye al menú de hamburguesa en pantallas estrechas.
5. El modo lectura sube a la cabecera y funciona en las dieciséis rutas.
6. `Surface interactive` implica tarjeta espacial y `<Section>` aparece sola:
   las dos decisiones viven en la primitiva, no en las páginas.

**Lo que apareció al medir**, y no antes: el panel de EVA se montaba 41 px
encima de la barra de pestañas nueva, y `/aldunate` tenía 26 objetivos táctiles
por debajo de 24 px que venían del 01-09. Ambos corregidos; los objetivos, con
el mismo `min-h-6` de la Fase 8.

**Dos artefactos de medición que casi se publican como fallos**, anotados
porque volverán:

- «Las apariciones se quedan invisibles en las siete rutas» era **el panel de
  vista previa oculto**: `document.hidden` a `true`, 0 fotogramas en 500 ms y
  las transiciones congeladas en `currentTime: 0`. Un `IntersectionObserver` no
  dispara sin ciclo de render.
- «224 px de desborde horizontal» era **`clientWidth` a 0**: el panel colapsado.

En los dos casos el instrumento estaba roto, no el sitio. Antes de creerse una
medida en este equipo, medir el instrumento: `document.hidden`,
`clientWidth` y fotogramas por segundo.

**Y un tercero, del propio medidor de contraste.** El comprobador que usaban
estas sesiones parseaba el color con una expresión regular sobre `rgb()`.
Tailwind v4 devuelve `oklab(0.94 -0.006 -0.011 / 0.8)` para cualquier utilidad
con opacidad, y esos tres decimales se leían como si fueran valores 0-255: un
texto claro pasaba por casi negro y salían **12 fallos de contraste
inexistentes**. La versión buena no parsea nada —pinta el color en un canvas de
1×1 y lee el píxel—, y así cubre `rgb`, `oklab`, `oklch` y `color-mix` sin
saber cuál es cuál. Con ella: 0 fallos en ambos temas.

---

## 1ter. Estado del arte en la portada · 02-09-2026

La portada declara en qué punto va cada línea de trabajo, entre el vestíbulo y
las puertas. Es **regla permanente**: `CLAUDE.md` §12.

- Registro en `src/data/trabajos.ts`; lo pinta `components/work/WorkBoard.tsx`.
- **Se actualiza en el mismo cambio que altera el estado real del trabajo.** Es
  lo único de la portada que envejece solo, y un tablero desactualizado es peor
  que ninguno porque se lee como vigente.
- **Los informes no declaran estado ahí**: lo derivan de `reports.ts`.
- **`comprometido` obliga a salvedad**, y una prueba lo impone. El optativo «IA
  y Derecho» está comprometido y **no formalizado**; su ficha declara que no es
  anuncio de la Escuela. Sin esa salvedad el sitio estaría anunciando en nombre
  de una institución que no lo ha autorizado — regla dura 3.
- Cuarta familia de estado (`StageMeter`, medidor de cuatro tramos). No
  reutilizar `Badge` ni las otras tres: reintroduce U-13.

Las cinco líneas actuales: Informe 01 (en desarrollo), Informe 02 (en revisión),
diseño del curso de alfabetización en IA (en estudio), optativo IA y Derecho
(comprometido, próximo semestre) y otras líneas (supeditado).

---

## 2. Estado verificable

```
npm run verify   →  exit 0 · 0 errores · 8 avisos (D-022, no tocar) · 86 tests
```

Comprobado el 01-09-2026 sobre `ac04e93`. Los 8 avisos son de siempre: siete del
código donado del juego, uno de `figure-sprite.mjs`. Están justificados en
`DECISIONS.md` D-022 y **no se arreglan**.

Las 86 pruebas incluyen las de `src/data/`, que antes no tenía ninguna: las 46
originales eran todas del juego, y ahí es donde vivían los dos datos falsos que
compilaban sin protestar.

**Si `verify` falla nada más clonar o tras un `pull` largo, mira `node_modules`
antes que el código.** El 01-09 falló con treinta errores de tipos —`zustand/
middleware` y `vitest/config` no encontrados— y no había nada roto: el
fast-forward había traído un `package.json` con dependencias nuevas y las
dependencias instaladas eran las de antes. `npm ci` y en verde.

**Chequeo de identificadores huérfanos**, con el comando ya corregido de
`docs/informes/07-puente-con-el-sitio.md`: 42 definidos, 42 usados, cero
huérfanos en ambas direcciones.

---

## 3. Lo que NO está hecho, y por qué

### Requiere decisión del autor

| Qué | Por qué no lo resolví |
|---|---|
| **Protocolo de búsqueda** (A-05) | Depende de cómo se buscó realmente. Reconstruirlo desde las 24 fuentes resultantes sería inventar un método hacia atrás y publicarlo como reproducible: el fallo que el propio informe denuncia. Quince minutos de conversación bastan. |
| **Clasificar las 8 recomendaciones** (A-12) | En A/B/C/D según si la respalda la evidencia o son decisión normativa. Es un juicio sobre trabajo propio. |
| **Ficha del profesor Aldunate** | El usuario indicó «actualizaremos info de Aldunate» más adelante. Su cargo —director de la Escuela de Derecho PUCV— **no se publicó**: añadir el cargo institucional de alguien que no sabe que el sitio existe reintroduce el riesgo que D-033 acaba de cerrar. |
| **Estado de 4 fichas del Lab** | Dicen «prototipo» sin `demoUrl` ni `repoUrl`. No las bajé a `idea` porque una plantilla o una rúbrica pueden existir fuera del sitio; degradarlas sería el error contrario. Van marcadas «sin artefacto consultable». |

### Pendientes técnicos

- **A-16, A-17, A-18 · maquetación del PDF.** Numeración de recomendaciones,
  paginación final y densidad de tablas **no se revisaron visualmente**: este
  equipo no tiene `pdftoppm` ni renderizador de PDF a imagen. La comprobación
  fue textual. **Abre el PDF y mira la portada y las páginas finales antes de
  distribuirlo**: los cambios de portada alteran el alto de la tabla de cifras.
- **A-24 · fecha de Magesh.** El encargo afirmaba 23-04-2025. Wiley devuelve 403
  y no pude contrastarlo. Queda en `2025-04` con precisión de mes declarada.
- **A-19 · 18 fuentes sin clasificar** en la taxonomía nueva. Las 6 críticas sí.
  La ficha no muestra el bloque cuando no hay datos, que es lo correcto.
- **A-29 · dos fuentes de verdad. Resuelto a medias el 01-09-2026.** Los
  `contenido-*.json` ya están en el repositorio y se comprobó que reproducen el
  documento publicado. Lo que queda no es un problema de custodia sino de
  sincronización: `src/data/` y `contenido-*.json` siguen siendo dos textos que
  hay que corregir a la vez. Ahora, al menos, un diff los compara.
- **A-32** exportación CSV/JSON · **A-33** Lighthouse y axe · búsqueda global.

---

## 4. Cómo regenerar el informe

Sólo si tocas `contenido-*.json`. Desde PowerShell, en
`tools\informes\informe-02\`:

```powershell
..\motor\utf8bom.ps1 .                 # los .ps1 y .json en UTF-8 con BOM
.\Graficos.ps1                         # figuras para el documento
.\Graficos.ps1 -PxScale 1.55 -OutDir figuras-web
..\plantillas\Build-Informe.ps1        # JSON -> DOCX
..\plantillas\Build-Artifact.ps1       # JSON -> HTML
..\plantillas\Build-Resumen.ps1        # resumen ejecutivo
```

Todo sale a `salida\`, que está en `.gitignore`. El método completo está en
`docs/informes/`, siete documentos.

Después, el paso de Word por COM —**imprescindible**, es lo que actualiza el
índice y elimina el aviso de campo sin actualizar—:

```powershell
$w = New-Object -ComObject Word.Application; $w.Visible=$false; $w.DisplayAlerts=0
$d = $w.Documents.Open($docx,$false,$false)
$d.Fields.Update(); $d.TablesOfContents.Item(1).Update(); $d.Repaginate()
$d.ExportAsFixedFormat($pdf,17); $d.Save(); $d.Close(0); $w.Quit()
```

Y copiar a `public/descargas/` con nombre de versión nueva. **Nunca sobrescribas
una versión publicada.**

### Trampas de esa cadena

- **Los `contenido-*.json` tienen BOM mezclado**: cuatro lo llevan y uno no.
  PowerShell 5.1 lee sin BOM como ANSI y corrompe todos los acentos.
  **Conserva el estado de origen de cada archivo.**
- Al hacer sustituciones masivas, **comprueba que el texto de partida aparezca
  exactamente una vez antes de escribir nada**. Hay un script de ejemplo con ese
  guardián en el historial de la sesión.
- Los archivos son CRLF. `perl -0pi` con patrones multilínea falla por eso;
  usa la herramienta de edición o `sed` línea a línea.

---

## 5. Trampas del entorno que ahorran una hora

- **El panel de vista previa se rompe en sesiones largas**: deja de pintar y las
  capturas fallan por tiempo agotado. Cuando pase, verifica por DOM
  —`getBoundingClientRect`, contraste calculado sobre el píxel con canvas— y
  **di explícitamente que no hubo revisión visual**, en vez de fingir que la hubo.
- **Y antes de creerte la medida, mide el instrumento.** Un panel roto no da
  error: da datos verosímiles y falsos. El 02-09 produjo dos hallazgos
  inventados —«las apariciones se quedan invisibles en las siete rutas» y «224 px
  de desborde horizontal»— que eran, respectivamente, la pestaña sin producir
  fotogramas y el panel colapsado a ancho cero. Tres comprobaciones de un
  segundo lo descartan:

  ```js
  document.hidden                          // ¿corre el ciclo de render?
  document.documentElement.clientWidth     // ¿hay viewport?
  // y contar fotogramas en 500 ms con requestAnimationFrame
  ```

  Con la pestaña oculta, `IntersectionObserver` no dispara y `getComputedStyle`
  devuelve el valor congelado del **inicio** de cada transición. Para leer lo
  que decide la cascada, `el.getAnimations().forEach(a => a.finish())` primero.
- **No cambies el tema por JavaScript a media medición.** El proveedor lo repone
  y acabas leyendo colores de un tema con fondos del otro: da 121 fallos de
  contraste falsos. Recarga.
- **`npm run verify` no detecta errores de hidratación ni datos falsos que
  compilan.** Recorrer las rutas con la consola abierta no es opcional.
- **La vista previa de Vercel por rama exige iniciar sesión**, así que un agente
  no puede verificarla. El dominio de producción sí es público.

---

## 6. Siguiente paso sugerido

Producción va en **`c1fedb8`**, con los PR #10 a #13 dentro. Sirve el Informe 02
en v0.3.0, el Informe 01 en v0.2.0 y el perfil `/aldunate`; las tres rutas
comprobadas en vivo el 01-09-2026.

**La capa espacial (§1bis) está en la rama `rediseno/capa-espacial`, sin
fusionar.** Lo que falta antes de fusionarla no es código: es **mirarla en un
navegador de verdad**. Se verificó por DOM porque el panel de vista previa dejó
de pintar, y eso cubre geometría, contraste y accesibilidad, pero no dice si el
vidrio, el reflejo del cursor y las apariciones se ven bien. Abre el dominio de
producción tras fusionar, o `npm run dev` en local, y recorre las dieciséis
rutas en los dos temas.

> **Este repositorio tuvo sesiones concurrentes el 01-09.** Dos líneas de trabajo
> —el perfil de Aldunate y el corpus del Informe 01— avanzaron a la vez y se
> encontraron en un conflicto de `CHANGELOG.md`. Antes de dar por buena la
> posición del remoto, consúltala con `git ls-remote origin main`, no con
> `origin/main`: esa referencia se quedó congelada días por no tener refspec
> configurado, y por poco lleva a leer como «sin subir» tres commits que ya
> estaban en producción. El refspec ya está reparado.

1. **Verificar las 43 fuentes del Informe 01 una por una.** Es lo único que
   desbloquea todo lo demás, y es lo que no se delega: abrir cada página y
   contrastar lo que dice contra lo que el documento fuente le atribuye. La
   pasada hecha sólo comprueba que responden. Procedimiento en
   `tools/informes/informe-01/verificacion-fuentes.md`.
2. **Igualar cobertura en las ocho universidades fuera del piloto.** Con nueve
   fuentes contra dos, ninguna comparación nacional es publicable. Hasta que se
   iguale, el informe publica once fichas y ninguna tabla de posiciones.
3. Comprobar cuáles de las cuatro iniciativas anunciadas llegaron a ejecutarse
   —UDD malla 2027, UDP currículo, UAI convenio Legu, UANDES FONDEF—.
4. Abrir el PDF v0.3.0 del Informe 02 y revisar portada y páginas finales (§3).
5. Resolver el protocolo de búsqueda (A-05) con el autor.
6. Cerrar A-29 trayendo los `contenido-*.json` al repositorio.

**No redactar el Informe 01 antes del punto 1.** El corpus cierra los cinco pasos
de fusión, pero ninguna afirmación es publicable todavía y `sourceIds` /
`claimIds` siguen vacíos a propósito.

El plan de fondo del proyecto —fases A a D, y por qué nada se publica antes de
hablar con el profesor— sigue en `docs/PUENTE-Y-HOJA-DE-RUTA.md`. No ha
cambiado.
