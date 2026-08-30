# Decisiones

Registro de decisiones tomadas y sus razones. Se escribe para que una decisión
pueda ser revisada con conocimiento de por qué se tomó, no revertida por
desconocimiento.

Formato: **qué**, **por qué**, **qué se descartó**.

---

## D-001 · El modo oscuro es el estado por defecto

**Qué.** El sitio nace en modo nocturno. El claro institucional se elige.

**Por qué.** El encargo describe el tono oscuro como el actual y el claro como
el registro institucional alternativo. El nocturno es la identidad del
laboratorio; el claro es el registro que adopta cuando se presenta ante la
institución.

**Descartado.** Seguir `prefers-color-scheme` como criterio único. Se respeta
solo cuando el sistema pide `light` explícitamente y no hay preferencia
guardada.

---

## D-002 · Dos temas, una sola hoja de utilidades

**Qué.** `grid-bg`, `surface`, `glow`, `noise` y `rule-gradient` leen variables
de tema (`--grid-line`, `--surface-bg`, `--glow-soft`, `--noise-opacity`). La
misma clase produce retícula de tinta sobre papel o malla cian con halos.

**Por qué.** Evita duplicar cada componente en dos versiones y hace imposible
que un tema se quede atrás cuando el otro cambia. En claro, `--glow-soft: none`
y `--noise-opacity: 0`: el efecto no se apaga con un condicional, simplemente no
se pinta.

**Descartado.** Prefijos `dark:` repartidos por los componentes. Producen
divergencia silenciosa entre temas y hardcodean color en la capa de
presentación.

---

## D-003 · Tres familias tipográficas con oficios distintos

**Qué.** Serif (Newsreader) para títulos y prosa larga; grotesk (Space Grotesk)
para interfaz; mono (JetBrains Mono) para metadatos y códigos.

**Por qué.** La mezcla es lo que separa «archivo constitucional» de «landing de
producto». El serif aporta el registro académico; el mono sostiene la
trazabilidad visualmente —una fecha de verificación en monoespaciada se lee como
dato, no como decoración—.

**Descartado.** Un solo grotesk para todo, como en `taller-diat`. Funciona para
un taller; para un archivo intelectual resulta plano.

---

## D-004 · Los catálogos académicos arrancan vacíos

**Qué.** `publications` y `courses` son arreglos vacíos. Las vistas de listado
ya están construidas y se activan solas cuando llega el primer dato.

**Por qué.** Regla dura del encargo. Un título plausible puesto «de muestra»
sobrevive a la muestra: termina citado. La vista lista y el dato ausente hacen
que incorporar contenido verificado sea cargar un objeto, no rehacer una página.

**Descartado.** Datos de ejemplo con bandera `demo: true`. La bandera se olvida;
el dato queda.

---

## D-005 · El hueco se declara, no se disimula

**Qué.** Componente `PendingBlock` y arreglo `pendingContent`. Cada ausencia
lleva etiqueta y explicación de qué se necesita para llenarla.

**Por qué.** Un vacío rotulado se lee como decisión; un vacío mudo se lee como
descuido, e invita a rellenarlo. Además convierte la lista de trabajo del
proyecto en algo público y auditable.

---

## D-006 · `robots: noindex` mientras no haya autorización

**Qué.** El layout raíz declara `robots: { index: false, follow: false }`.

**Por qué.** Un prototipo indexado se cita como si fuera fuente. Mientras el
sitio no tenga autorización institucional y contenido verificado, no debe
competir por posicionamiento.

**Cuándo revisar.** Cuando exista autorización formal y al menos un informe
publicado con fuentes.

---

## D-007 · El escudo PUCV se usa a través de un solo componente

**Qué.** `<InstitutionalMark>` es la única vía de renderizar el escudo. En modo
oscuro aplica `brightness-95` y nada más.

**Por qué.** Centralizar el uso hace que la regla —no recolorear, no animar, no
deformar, no aplicar glow— sea estructural en vez de disciplinaria. La tentación
de «integrarlo al tema» termina en una marca institucional intervenida sin
autorización.

---

## D-008 · EVA se ancla a ruta, no a temporizador

**Qué.** `evaMessageForRoute()` selecciona por prefijo más largo. El panel se
cierra al navegar. Una sola aparición automática, en la primera visita.
Silenciarla persiste.

**Por qué.** El encargo lo pide explícitamente y la razón es buena: un
acompañante que habla por intervalos es un pop-up con retrato. Anclado a ruta,
lo que dice siempre es pertinente a lo que hay en pantalla.

**Detalle.** El panel no lleva overlay ni atrapa el foco. EVA orienta, no
interrumpe.

---

## D-009 · El laboratorio cataloga trabajo propio, no proveedores

**Qué.** `labTools` contiene plantillas, procedimientos, rúbricas y prototipos
del proyecto. Cada ficha lleva `limitations` visibles, no plegadas.

**Por qué.** El encargo prohíbe convertir el laboratorio en catálogo de logos de
IA. Además, la sección «no hace» es la que evita que un prototipo se use como si
fuera un producto.

**Regla.** Ninguna ficha se marca `stable` sin uso real documentado.

---

## D-010 · Los informes se publican con método antes que con hallazgos

**Qué.** Ambos informes están en `en-investigacion`, con alcance, metodología,
límites y preguntas abiertas definidos, y sin conclusiones.

**Por qué.** Publicar el método antes que los resultados permite criticarlo
antes de que haya algo que defender. También impide el orden inverso —hallazgo
primero, método después— que es como se fabrican los informes que no resisten
lectura.

---

## D-011 · Dos experimentos funcionan; el resto se declara idea

**Qué.** Constitution Lab (onda expansiva) y Gramatiquerías (ambigüedad
sintáctica) son interactivos y funcionan. Las otras seis piezas figuran con
estado real: `idea`.

**Por qué.** Un experimento que funciona argumenta; seis maquetas que no hacen
nada prometen. Todo contenido de demostración lleva `demoContent: true`, que
produce una etiqueta visible: un ejemplo sin rótulo se convierte en dato al
segundo día.

---

## D-012 · La matriz de evidencia se publica vacía

**Qué.** `sources` y `claims` están vacíos. La página `/investigacion` muestra
el esquema de ambos registros y el método, con el contador en cero.

**Por qué.** Poblar la matriz con ejemplos para que «se vea trabajada»
produciría exactamente el problema que el método existe para evitar. El esquema
público hace el método auditable; el contador en cero hace el estado honesto.

---

## D-013 · Sin backend

**Qué.** Todo es estático. Sin base de datos, sin API, sin autenticación.

**Por qué.** El encargo lo pide mientras no haya necesidad real. Las rutas se
prerenderizan; el despliegue en Vercel no tiene estado que administrar.

**Cuándo revisar.** Cuando Lex Note necesite persistir anotaciones, o cuando un
informe requiera datos que no quepan en el bundle.

---

## D-014 · Next.js 16 y Node 22 como base de despliegue

**Qué.** El proyecto usa Next.js `16.3.3` y fija Node.js en la rama `22.x`.
Los scripts de instalación necesarios se aprueban por paquete y versión.

**Por qué.** Next.js `15.5.4` contenía una vulnerabilidad crítica y el rango
abierto de Node permitía que Vercel cambiara de versión mayor sin una decisión
del proyecto. La combinación actual compila en producción y deja la auditoría
de dependencias en cero vulnerabilidades.

**Regla.** Toda actualización futura debe pasar `npm run verify`, una
instalación limpia y la revisión de scripts de instalación pendientes antes de
subirse a `main`.
