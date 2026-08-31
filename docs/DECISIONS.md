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

---

## D-027 · El juego es una pantalla, no un tramo de página

**Qué.** `/experimentos/juegos/ley-de-los-audaces` abre con la cabina del juego,
que mide `100dvh` menos el cromo del sitio y resuelve dentro todo su
desbordamiento. La cabecera de la página, el aviso de ficción y la ficha
auditable pasan a estar **debajo**.

**Por qué.** Medido el 31-08-2026 a 1366×768 antes del cambio: la cabina
empezaba en el píxel 895 y medía 729, de modo que había que desplazar la página
para empezar a jugar y seguía sin caber entera. La creación de personaje medía
1207 px en un viewport de 768. Un juego al que hay que perseguir con la rueda no
es un juego: es un artículo con un juego dentro.

**Cómo.**

- La cabina es una rejilla de dos filas —barra superior y cuerpo— con alto
  definido y `overflow: hidden`.
- El cuerpo reparte: escena con `flex: 1 1 0`, panel con `flex: 0 1 auto`. La
  escena se queda con lo que sobra y encoge primero; el panel pide lo suyo y
  encoge después; la barra de acciones no encoge nunca.
- El único desplazamiento permitido es el del cuerpo de un panel, y la acción
  principal siempre queda fuera de él.

**El cromo se mide en JavaScript, y es la única medición del juego.** La
distancia entre el inicio del documento y la cabina —franja de prototipo más
cabecera pegajosa— no se puede expresar en CSS. Se mide con un `ResizeObserver`
sobre `body`, sin sondeo y sin manejadores de `scroll`, y hay un valor de
reserva en CSS para el primer pintado. **No se mide mientras el juego está a
pantalla completa**: ahí la cabina es `fixed`, su distancia al documento es cero,
y guardarla dejaba la cabina desbordando justo lo que mide el cromo al salir.

**La sala se dibuja siempre, y llena el ancho.** Hubo una primera versión que la
escondía por debajo de 704 px de alto, para que las nueve opciones del alegato
cupieran sin desplazar la lista. Era el umbral equivocado y se corrigió el mismo
día: un portátil de 1366×768 tiene un viewport real de unos 650 px, de modo que
la regla borraba el tribunal precisamente en la pantalla más común. El tribunal
es la mitad de la promesa del juego; que una lista larga se desplace por dentro
—30 px a 1366×650— es un precio muy inferior a jugar sin sala. Sólo desaparece
por debajo de 432 px de alto, donde la cabina entera mide 297 px.

**Phaser escala con `ENVELOP`, no con `FIT`.** El hueco que le deja la cabina es
ancho y bajo. Con `FIT`, a 1366×650 la sala quedaba encajada en 311 px dentro de
un hueco de 1082, con 770 px de franjas negras a los lados: un sello, no un
tribunal. `ENVELOP` cubre el hueco y recorta arriba y abajo. La proporción se
conserva en ambos casos y nadie se deforma; lo que cambia es qué sobra, y sobra
techo y suelo, que es donde no pasa nada. Además la cámara sigue a quien habla,
así que el recorte nunca esconde al que está hablando.

**Lo que no se hizo.** No hay `transform: scale()` ni `zoom` ni tipografías
reducidas para forzar el encaje. El texto se mueve entre `0.95rem` y `1.0625rem`
y los botones conservan 40 px de alto en el modo más apretado.

**Pantalla completa propia, no la del navegador.** Un botón en la barra superior
pone la cabina en `fixed`. Nadie debería tener que pulsar F11 para jugar, y el
juego tiene que funcionar igual en una pestaña normal.

---

## D-028 · La franja de prototipo viaja con el juego

**Qué.** La barra superior de la cabina lleva su propio rótulo «Ficción ·
prototipo», además del que la página ya muestra.

**Por qué.** A pantalla completa la página no se ve, y con ella desaparecerían
la franja del layout raíz y el aviso de ficción. La regla dura 3 de `CLAUDE.md`
no admite que exista un estado de la interfaz sin ese rótulo. Duplicarlo cuesta
una línea; perderlo cuesta la regla.

---

## D-029 · El tribunal son tres, y la cámara sigue a quien habla

**Qué.** Tres cambios que son el mismo cambio: el tribunal pasa de una persona a
tres, cada línea del guion declara quién la dice y a quién, y la cámara encuadra
personas en vez de muebles.

**Por qué el tribunal es colegiado.** Un tribunal oral se compone de más de un
juez, y con uno solo la sala se leía como un despacho. Además abre lo que el
capítulo necesitaba: tres caracteres que se interrumpen. Achurra preside y tiene
hambre; Pinilla anota y sólo interviene por el acta; Riquelme hace la pregunta
que nadie quería hacer. La composición se usa como puesta en escena, no como
cita: **no se afirma ninguna regla procesal**, y las referencias normativas del
capítulo siguen siendo las tres de `legalSources`, rotuladas «por verificar».

**Por qué la cámara.** Antes el encuadre se fijaba una vez por nodo, con el
`focus` declarado, y no se movía aunque contestaran tres personas distintas. Con
el recorte panorámico de D-027 eso era peor: la cámara se quedaba mirando un
mueble mientras hablaba alguien que estaba fuera de plano. Ahora cada línea
puede traer `quien` y `a`:

- con `quien`, gesticula **sólo** esa persona —con tres jueces, que gesticulen
  los tres a la vez delata el decorado— y la cámara va a ella;
- con `a`, la cámara abre lo justo para que quepan las dos, que es lo que hace
  legible un contrainterrogatorio;
- `a` admite un puesto además de una persona, porque quién ocupa la defensa
  depende del avatar elegido y el guion no puede saberlo.

**Umbral de movimiento.** Dos líneas seguidas de la misma persona piden el mismo
encuadre. Sin umbral, la cámara rearrancaba el tween en cada línea: un temblor
pequeño y constante que era buena parte de lo que se veía mal.

**La matemática del encuadre vive fuera de Phaser.** `src/lib/rpg/encuadre.ts`,
función pura, con pruebas. Es la única parte de la cinematografía que puede
equivocarse en silencio: un encuadre malo no lanza ningún error, sólo deja a
alguien fuera de plano. Diez pruebas comprueban que las parejas que de verdad se
hablan en el Capítulo 0 —fiscal y testigo, defensa y estrado, los dos extremos
del tribunal— caben en el plano.

---

## D-030 · El humor es de oficio, y nunca a costa de la acusada

**Qué.** El Capítulo 0 se escribe como comedia de sala.

**Por qué.** El registro seco anterior era correcto y no invitaba a seguir
jugando. Un tutorial que se recorre una vez tiene que dar ganas de la segunda.

**Dónde está el límite.** Tres reglas, anotadas también en la cabecera de
`prologo.ts`:

1. **Nadie hace un chiste a costa de la acusada.** Es la única que se juega algo
   de verdad; reírse de ella convertiría el juego en otra cosa.
2. El chiste sale de que el Derecho lo hacen personas con hambre y con manías,
   no de que el Derecho sea ridículo.
3. Si una línea es sólo graciosa, sobra. Toda línea informa de un hecho, una
   relación o un peligro.

**Lo que no cambia.** Ni una regla procesal se afirma en broma, la franja de
prototipo y el rótulo de ficción siguen donde estaban, y las tres referencias
normativas del capítulo siguen «por verificar».

---

## D-031 · La cámara no llegaba al estrado, y por eso no se veían los jueces

**Qué.** La cámara tiene un margen dibujado de 300 px alrededor del mundo, se
acerca a 1,8 para hablar, rotula a quien habla y apaga a quien no.

**El fallo.** `setBounds(0, 0, 1280, 720)` recorta el desplazamiento para no
enseñar el vacío. A zoom 1,2 la vista mide 600 px de alto, así que el centro de
cámara sólo podía moverse entre y=300 e y=420. **El estrado está en y=176: la
cámara no podía enfocar a los jueces.** Con `FIT` no se notaba porque se veía el
mundo entero; al pasar a `ENVELOP` (D-027) el recorte los dejó fuera de
pantalla, que es exactamente el síntoma reportado: «casi toda la pantalla no se
ven los jueces».

Comprobado en el navegador antes de tocar nada: con la línea de Achurra en
pantalla, el objetivo de cámara era el correcto —(640, 176)— y `midPoint`
seguía en (640, 360).

**El arreglo.** Un margen de 300 px en los límites, y el dibujo de la sala
extendido para llenarlo: si la cámara puede llegar ahí, ahí tiene que haber
sala. Con eso el centro de cámara alcanza cualquier puesto y el recorte deja de
importar, porque quien habla siempre está en el centro del lienzo.

**Identificar a quien habla.** Tres señales a la vez, porque una sola no
bastaba en una sala de ocho personas:

1. **Rótulo con el nombre** sobre la cabeza, sujeto a la banda visible. Sin
   sujetarlo desaparecía justo cuando más falta hace —en los planos de dos, que
   es donde hay dos personas y hay que saber cuál habla—.
2. **Los demás se apagan** a 55 % de opacidad.
3. **Sólo gesticula quien habla.**

**Zoom de conversación a 1,8.** El sprite mide 48 px de celda y la cabeza es una
fracción de eso: con el tope anterior de 1,35 la cara quedaba en unos treinta
píxeles. El plano de dos se abre hasta donde haga falta para que quepan ambos,
y ahí las caras se ven más pequeñas: es el coste inevitable de encuadrar a la
vez el estrado y el suelo.

**Ritmo.** El tecleo baja de 22–30 ms por carácter a 9–15, y los paneos de
420–520 ms a 260–320.

**Nota de entorno.** Nada de esto se puede comprobar con capturas si el panel de
vista previa estrangula `requestAnimationFrame`: el bucle de Phaser avanza cero
fotogramas y la cámara se queda congelada a mitad del recorrido. Se verifica
leyendo el objetivo de cámara —`scene.encuadre`— y forzando un paso del bucle
con `game.loop.step()`.
