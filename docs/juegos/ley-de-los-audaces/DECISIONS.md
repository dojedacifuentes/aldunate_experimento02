# Decisiones

Registro de decisiones y sus razones. Se escribe para que una decisión pueda
revisarse con conocimiento de por qué se tomó, no revertirse por
desconocimiento.

Formato: **qué**, **por qué**, **qué se descartó**.

---

## D-001 · Repositorio propio, enlazado desde el laboratorio

> **SUPERADA por D-009 (31-08-2026).** El juego se aloja dentro del laboratorio.
> Se conserva el texto porque la razón que lo motivó sigue siendo real y hay que
> tenerla presente: lo que cambió fue la decisión, no el riesgo.

**Qué.** El juego vive en su propio repositorio y su propio despliegue. Desde
`/experimentos/juegos` de `aldunate_experimento02` se enlaza como pieza externa.

**Por qué.** El juego es un thriller: incriminación, prisión, fuga,
clandestinidad. El laboratorio anfitrión lleva escudo de Derecho PUCV, franja de
prototipo y una regla escrita de no hablar en nombre de la institución ni del
profesor. Aunque la ficción sea explícita, el contenedor no es neutro. Separar
elimina el riesgo sin costo técnico y evita que el RPG canibalice un sitio que
tiene contenido académico bloqueado esperando material verificado.

**Descartado.** Alojarlo bajo `/experimentos/juegos/ley-de-los-audaces`.

---

## D-002 · El RPG reemplaza a la ficha anterior

**Qué.** «La Ley de los Audaces» pasa a ser este juego. La ficha previa
—legislar bajo presión con consecuencias diferidas— cede el nombre.

**Por qué.** Dos piezas con el mismo nombre en el mismo ecosistema producen una
confusión que ningún subtítulo arregla. La idea original no se pierde: sus
requisitos siguen publicados y puede volver con otro nombre.

**Consecuencia.** Hay que actualizar `src/data/experiments.ts` y la página
`/experimentos/juegos` del repositorio anfitrión.

---

## D-003 · Phaser desde el primer día, React para todo lo demás

**Qué.** La sala se dibuja en Phaser. Diálogo, decisiones, evidencia, HUD y
alegato son React sobre el canvas.

**Por qué.** Decisión del proyecto. El costo se asume ahora, con la escena más
simple posible, a cambio de que el Capítulo 3 pueda añadir movimiento libre,
colisiones y cámara sin reescribir nada. Las hojas de sprites del registro
(288×288, celdas de 48) las consume Phaser sin conversión.

**Cómo se acota el costo.** La escena no lee el store y no conoce el guion:
recibe cinco órdenes por un bus (`enfocar`, `hablar`, `acierto`, `fallo`,
`escanear`). Si mañana el renderizador cambia, cambia un archivo.

**Descartado.** Empezar sólo con DOM reutilizando `CharacterSprite` y
`useSpriteAnimation`, y añadir Phaser al aparecer el primer mapa.

---

## D-004 · La paleta vive en tres copias, y está anotado

**Qué.** Los mismos colores existen en `src/lib/rpg/art/palette.mjs` (motor de
arte), `src/app/globals.css` (interfaz) y `src/engine/rpg/CourtroomScene.ts`
(Phaser).

**Por qué.** Los tres consumidores hablan idiomas distintos: el motor de arte
corre en Node y en el navegador sin compilador, la interfaz usa variables CSS y
Phaser necesita enteros. No hay una fuente única que los tres puedan leer sin
introducir un paso de build.

**Regla.** Es la **única** duplicación de color aceptada. Cambiar un token
obliga a cambiar los tres. Cualquier otro color hardcodeado es un error.

---

## D-005 · El reparto se amplía, no se reinterpreta

**Qué.** El Capítulo 0 es penal, y para eso se suman tres personajes al
registro: Isabel Achurra (tribunal), Rodrigo Naveas (fiscalía) y Rocío Zapata
(testigo).

**Por qué.** El reparto donado está construido para un conflicto civil —clienta,
contraparte, abogado de la contraria— y no incluye tribunal, fiscalía ni
testigo. Reasignar roles existentes habría sido más barato y habría roto el
casting: Ignacio Bravo es el abogado de la contraria, y convertirlo en fiscal
destruye su arco.

**Cómo.** Tres ediciones —`asset-paths.mjs`, `character-specs.mjs`,
`characters.ts`— y `node scripts/rpg-art/bake.mjs`. El motor de arte genera el
personaje dentro de la misma paleta cerrada; no hay assets sueltos.

**Pendiente de arte.** La toga no existe como prenda en el motor. La presidenta
usa traje tinta con acento oro, que lee como autoridad pero no como tribunal.
Anotado en `ART_DIRECTION.md`.

---

## D-006 · `set-state-in-effect` queda como aviso en el código donado

**Qué.** La regla `react-hooks/set-state-in-effect` baja de error a aviso en
`src/components/rpg/*.tsx` y `src/hooks/rpg/*.ts`.

**Por qué.** Es una heurística de rendimiento, no una regla de corrección, y
esos archivos sincronizan estado con fuentes externas: temporizadores de
animación, manifiesto de assets, efecto de tecleo. Reescribir código donado para
silenciar un aviso arriesga más de lo que gana.

**Lo que no se relaja.** El código propio no usa ese patrón: `NodoRunner`
reinicia su estado con `key`, que es la forma idiomática, y el salto al nodo
siguiente ocurre fuera del actualizador de estado.

---

## D-007 · Aquí no se puede perder

**Qué.** En el Capítulo 0, fallar cuesta impulso, prestigio o integridad y
cambia lo que EVA dirá después. Nunca reinicia la escena ni cierra el capítulo.

**Por qué.** Es un tutorial. Un tutorial que castiga con repetición enseña a
temerle al botón en vez de a usarlo. La consecuencia tiene que verse —el
prestigio baja en pantalla— sin que el jugador pierda el hilo de la historia.

**Descartado.** Game over por alegato incompleto. Un alegato con dos de tres
piezas se entiende, no convence del todo, y con la carga de la prueba en la otra
parte puede bastar. Que baste es, además, jurídicamente cierto.

---

## D-008 · El horneado de arte no depende de librerías nativas

**Qué.** `scripts/rpg-art/png.mjs` codifica PNG con `zlib` y un CRC propio.

**Por qué.** El motor de arte ya entrega píxeles; sólo faltaba envolverlos. Una
dependencia nativa menos es una instalación menos que puede fallar en CI o en un
equipo sin herramientas de compilación.


---

## D-009 · El juego se aloja dentro del laboratorio

**Qué.** El juego deja de ser un repositorio aparte enlazado desde fuera. Su
código, su arte, su documentación y sus encargos a agentes viven en
`dojedacifuentes/aldunate_experimento02`, y se juega en
`/experimentos/juegos/ley-de-los-audaces`. Sustituye a **D-001**.

**Por qué.** El objetivo del proyecto cambió: no se busca sólo publicar un juego,
sino tener **un experimento auditable**. Que el guion, el motor, los sprites, la
dirección de arte, las decisiones y los prompts usados para construirlo estén en
el mismo árbol es lo que permite revisarlo, corregirlo y derivar escenarios
nuevos sin reconstruir el contexto cada vez. Repartido en dos repositorios, eso
se pierde: la mitad de la trazabilidad queda siempre en el otro lado.

**Qué se hizo con el riesgo que motivaba D-001.** El riesgo no desaparece —un
thriller de incriminación y fuga bajo el escudo de la Escuela— y por eso se
acota, en vez de ignorarse:

- la ficha del juego abre con un aviso de ficción, antes del juego;
- el juego declara que no habla por la Escuela, la Universidad ni el profesor;
- la franja de prototipo y el `noindex` del sitio se mantienen;
- las referencias normativas se muestran rotuladas por estado de verificación;
- el reparto y las fuentes son públicos en la propia ficha, para que cualquiera
  compruebe que nada es real.

**Lo que sigue pendiente y no lo resuelve la técnica.** Antes de quitar el
`noindex` o de difundir el enlace conviene que el profesor Aldunate sepa qué se
aloja bajo su laboratorio. Es una conversación, no una línea de código.

---

## D-010 · El juego vive en una cabina con sus propios tokens

**Qué.** Todo el juego se renderiza dentro de `.cabina-audaces`, que declara su
propia paleta.

**Por qué.** El sitio tiene tema dual —nocturno e institucional— y el juego es de
un solo tono. Sin acotar, o el juego se rompe en modo claro o sus colores se
escapan al resto del sitio. La cabina resuelve las dos cosas: el juego se ve
igual en ambos temas y ni un token suyo sale de ahí.

**Descartado.** Añadir el juego a los tokens globales, que habría obligado a
mantener dos identidades cromáticas en la misma hoja.
