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

## D-011 · Los experimentos construidos funcionan; el resto se declara idea

> Ampliada por **D-016**: el recuento subió de dos piezas a cuatro. El criterio
> que sigue vigente es el de este apartado.

**Qué.** Las piezas construidas son interactivas de verdad. El resto figura con
su estado real: `idea`.

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

---

## D-015 · La paleta se fija a los hexadecimales de la guía

**Qué.** Los tokens base pasan a los valores exactos declarados en la guía
visual: nocturno `#09131D` · `#4BC7E8` · `#29588C`; claro `#F7F4EE` ·
`#29588C` · `#8A2432` · `#B78C30`.

**Por qué.** La primera versión derivó la paleta oscura de `taller-diat` en
`oklch`, lo que producía un fondo casi negro puro. `#09131D` conserva el azul
en el negro —es «azul-noche», no «apagado»— y el cian `#4BC7E8` es más legible
que el cian derivado.

**Efecto lateral útil.** Al pasar de `oklch` a hexadecimal, los colores del tema
oscuro vuelven a ser inspeccionables con herramientas que no interpretan CSS
Color 4.

---

## D-016 · Cuatro experimentos funcionan, no dos

**Qué.** Se suman *¿Qué regla estás siguiendo?* (Wittgenstein) y *Ama tu
Constitución* a los dos módulos interactivos ya existentes.

**Por qué.** La guía especifica ambos con suficiente detalle para construirlos
—el caso «ningún vehículo puede entrar al parque» y las ocho dimensiones de
diseño institucional— y ninguno requiere datos que todavía no existan.

**Decisión de diseño en los dos casos: no evaluar.**
- Wittgenstein no tiene clave de corrección. Devuelve al usuario sus propias
  respuestas y señala cuáles cambió al cambiar el propósito de la regla. Núcleo
  y penumbra se derivan de lo que la persona respondió, no de un baremo.
- *Ama tu Constitución* no puntúa ni asigna etiquetas de identidad política. La
  salida son las tensiones internas de la combinación elegida: pares de
  decisiones que empujan en direcciones opuestas.

**Descartado.** Mostrar «lo que responde la mayoría» o comparar contra
constituciones reales. Ambas cosas exigirían datos que no tenemos, y un
porcentaje inventado arruinaría exactamente el punto de los dos ejercicios.

---

## D-017 · El esquema de publicaciones va más allá de la ficha bibliográfica

**Qué.** `Publication` incorpora `question`, `thesis`, `concepts`,
`relatedAuthors`, `relatedWorks` y `openQuestions`.

**Por qué.** Un catálogo que solo guarda título, año y enlace es un cementerio
de referencias. Estos campos permiten navegar el archivo por ideas y no solo
por fechas.

**Regla.** `thesis` se completa únicamente cuando el argumento central puede
extraerse del texto con cita. Resumir una tesis de memoria es inventarla
despacio.

---

## D-018 · Borges se construye; Eco se mantiene como idea

**Qué.** *El jardín de las interpretaciones que se bifurcan* pasa a ser un
módulo funcional: una disposición ficticia, hechos fijos y tres decisiones
hermenéuticas encadenadas que producen cinco desenlaces.

**Por qué se pudo construir.** No necesita datos externos. Todo lo que exige es
un caso bien diseñado y cánones interpretativos reconocibles —literal frente a
teleológica, empírica frente a conceptual, estricta frente a extensiva—.

**El árbol es asimétrico a propósito.** La lectura teleológica de «alterar»
cierra el caso y deja sin objeto las dos preguntas siguientes. Un árbol
equilibrado habría sido más ordenado y habría ocultado el punto: existen
decisiones interpretativas que no responden una pregunta, sino que vuelven
irrelevantes las demás.

**Descartado.** Reproducir texto de Borges. La estructura es el préstamo; la
prosa no. El módulo no cita ni parafrasea la obra.

**Por qué Eco sigue como idea.** El módulo sobre los límites de la
interpretación es el contrapeso del jardín: sostiene que no toda lectura es
admisible. Eso exige un criterio publicado de qué hace defendible una
interpretación, y ese criterio todavía no está escrito. Construirlo antes
produciría un módulo que afirma tener un límite sin poder decir cuál es.

---

## D-019 · El PR #1 se cierra sin fusionar

**Qué.** El PR automático del bot de Vercel (`next@15.5.9`) se cerró sin
fusionar el 30-08-2026, con el motivo comentado en el propio PR.

**Por qué.** `main` ya estaba en `16.3.3` con `npm audit` en cero. Fusionarlo
habría retrocedido una versión mayor a cambio de nada.

**Regla general.** Un PR automático de seguridad no se acepta por el hecho de
serlo. Se compara contra el estado real de `main`: si la vulnerabilidad ya está
resuelta por otra vía, el parche propuesto puede ser un retroceso.


---

## D-020 · El juego se aloja aquí, no se enlaza

**Qué.** «La Ley de los Audaces» —RPG jurídico— deja de ser una idea y pasa a
vivir dentro de este repositorio: código, arte, documentación y encargos a
agentes. Se juega en `/experimentos/juegos/ley-de-los-audaces`.

**Por qué.** El valor del experimento no está sólo en que se pueda jugar, sino en
que se pueda **auditar**: ver el guion, el reparto, las fuentes normativas con su
estado, la dirección de arte y las decisiones, sin salir del árbol. Repartido en
dos repositorios eso se pierde, y con ello la posibilidad de corregirlo o de
derivar escenarios nuevos sin reconstruir el contexto.

**El riesgo, y qué se hizo con él.** El juego es un thriller: incriminación,
prisión, fuga. Alojarlo bajo un sitio que lleva el escudo de la Escuela no es
neutro. Se acota en vez de ignorarse: la ficha abre con un aviso de ficción antes
del juego, el juego declara que no habla por nadie, el `noindex` y la franja de
prototipo se mantienen, y el reparto y las fuentes se publican en la propia ficha
para que cualquiera compruebe que nada es real.

**Lo que la técnica no resuelve.** Antes de quitar el `noindex` o difundir el
enlace, corresponde que el profesor sepa qué se aloja bajo su laboratorio.

**Descartado.** Repositorio y dominio propios, enlazados desde aquí. Era la
opción más prudente y la menos auditable.

---

## D-021 · La ficha del juego se puede jugar y revisar

**Qué.** `/experimentos/juegos/ley-de-los-audaces` tiene dos mitades: arriba se
juega, abajo se audita —de qué está hecho el capítulo, qué reparto lo interpreta,
qué referencias normativas usa y en qué estado de verificación está cada una—.

**Por qué.** Un experimento que sólo se puede jugar es una demo. Los recuentos se
calculan del propio contenido, no se escriben a mano: si alguien añade un nodo o
una fuente, la ficha lo refleja sola y no puede quedar desactualizada.

---

## D-022 · El juego trae sus propias excepciones de lint

**Qué.** `react-hooks/set-state-in-effect` baja a aviso en
`src/components/rpg/*.tsx` y `src/hooks/rpg/*.ts`.

**Por qué.** Es una heurística de rendimiento, no una regla de corrección, y esos
archivos sincronizan estado con fuentes externas: temporizadores de animación,
manifiesto de assets, efecto de tecleo. Llegaron como paquete cerrado y
funcionan; reescribirlos para silenciar un aviso arriesga más de lo que gana.

**Lo que no se relaja.** El código propio del juego no usa ese patrón, y el resto
del sitio conserva la regla como error.

---

## D-023 · La paleta del juego vive en tres copias

**Qué.** Los colores del juego existen en `src/lib/rpg/art/palette.mjs` (motor de
arte), en `src/app/experimentos/juegos/ley-de-los-audaces/juego.css` (interfaz) y
en `src/engine/rpg/CourtroomScene.ts` (Phaser).

**Por qué.** Los tres consumidores hablan idiomas distintos: el motor de arte
corre en Node y en el navegador sin compilador, la interfaz usa variables CSS y
Phaser necesita enteros. No hay fuente única que los tres puedan leer sin añadir
un paso de compilación.

**Regla.** Es la **única** duplicación de color aceptada en el repositorio.
Cambiar un token obliga a cambiar los tres.

---

## D-024 · Una tarjeta con salida propia deja de ser una tarjeta-enlace

**Qué.** En `/experimentos`, la ficha de un experimento se envuelve en un enlace
sólo si la propia ficha no trae ya uno. Desde que `ExperimentCard` pinta el botón
«Jugar» cuando hay `jugableEn`, envolverla producía un `<a>` dentro de otro `<a>`.

**Por qué.** No es una preferencia de estilo: es HTML inválido, y React lo
resuelve descartando el árbol servido y rehidratando la página entera. Se veía
como un parpadeo en `/experimentos` y desactivaba la mejora progresiva de esa
ruta. El error sólo aparece en la consola del navegador; `npm run verify` compila
y pasa sin quejarse.

**Regla general.** Un contenedor clicable y un botón dentro de él no pueden ser
ambos enlaces. Cuando una ficha gane su propia acción, la tarjeta cede.

---

## D-025 · Las piezas de una familia se cuentan por destino, no por igualdad

**Qué.** El recuento de piezas por familia en `/experimentos` compara con
`startsWith`, no con `===`.

**Por qué.** Cuando una pieza se vuelve jugable gana ruta propia
—`/experimentos/juegos/ley-de-los-audaces`— y deja de ser igual a la ruta de su
familia. La tarjeta «Juegos» anunciaba una pieza cuando había dos. Un catálogo
que publica el estado real de cada experimento no puede equivocarse contando los
suyos.

**Consecuencia.** Las piezas de la familia `lectura`, que viven bajo
`/experimentos/gramatiquerias`, siguen contándose donde el lector las encuentra.
El recuento agrupa por dónde va a parar el usuario, no por cómo está etiquetado
el dato.

---

## D-026 · El juego va arriba en su sección, y entero

**Qué.** `/experimentos/juegos` abre con un bloque destacado de La Ley de los
Audaces —estado, promesa, botón «Jugar el Capítulo 0», enlace a su documentación
y cuatro cifras calculadas del propio capítulo— antes del catálogo. La grilla de
abajo pasa a mostrar sólo lo que todavía no se puede tocar.

**Por qué.** Un prototipo jugable y una idea sin escribir no son dos elementos
del mismo tipo. Ponerlos en la misma grilla de dos columnas los empata
visualmente y obliga a leer las etiquetas para distinguirlos. La jerarquía hace
ese trabajo antes que el texto.

**Las cifras se calculan, no se escriben.** Nodos, decisiones, reparto y
referencias por verificar salen de `prologo`, `CHARACTERS` y `legalSources`. Un
número escrito a mano en una plantilla dice trece nodos cuando ya hay veinte.
