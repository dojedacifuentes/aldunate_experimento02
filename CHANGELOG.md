# Changelog

## No publicado

### Informe 01 · v0.6.0 · el mapeo se somete a su propia exigencia

**Añadido · la verificación sustantiva existe, y llega al 51%.** Se abrieron 38
de las 74 fuentes y se contrastaron siete campos contra la publicación original:
existencia y título literal, fecha declarada, unidad responsable, condición de
anuncio o ejecución, cifras de población, límites y respaldo efectivo de la
afirmación que sostiene. El contraste fuente por fuente queda versionado en
`tools/informes/informe-01/verificacion-p1-2026-09-04.md`, y la cola de
prioridad —calculada recorriendo la cadena afirmación → evidencia → fuente— en
`prioridad-verificacion.json`.

**Corregido · once registros no decían lo que su página dice.** Es un tercio de
lo verificado, y varias correcciones tocan afirmaciones ya publicadas.

- El decálogo de la PUCV «sugiere recomendaciones»: es lineamiento y no
  política, y se presenta dentro de un Día de la IA que el título del registro
  no mencionaba.
- El «primer Departamento de Derecho y Tecnología en Chile» es cita textual del
  decano de la UC, no un hecho verificado. Y en ninguna de las cuatro unidades
  creadas entre 2025 y 2026 se localizó su acto de creación. Lo que sí existe,
  en un caso, es el organigrama: evidencia más fuerte que la noticia.
- El diploma de la Universidad de Chile figura cerrado desde 2022, y su
  reapertura de 2026 se declara referencial bajo otra unidad. La serie temporal
  de formación continua es de la UC: dos graduaciones consecutivas con más de 90
  y más de 100 titulados.
- El convenio de la UAI con Legu «se firmó»: es acto ejecutado. La afirmación
  que lo contaba como anuncio se reescribió.
- El LMIL de la PUCV dependía en 2022 de la Dirección de Incubación y Negocios y
  su fuente fundacional no menciona la IA. En 2025 ya es de la Escuela de
  Derecho: es un traslado orgánico, y así se registra.
- El Programa de IA y LegalTech de la Universidad Central estaba subestimado
  porque el registro lo nombraba por el segmento de su URL. El sesgo de cobertura
  no sólo infla a los observados: deprime a los no observados.
- El seminario «Derecho en la Smart Era» lo organiza el centro de alumnos:
  atribución `ESTUDIANTIL`, no de la Facultad.
- Dos fechas se retiraron por no constar en la fuente y dos se ganaron.

**Añadido · la capa académica.** Introducción, objetivos, relato metodológico en
nueve apartados, discusión en seis, sección PUCV rehecha con su doble revisión
publicada, siete conclusiones que citan las afirmaciones que las sostienen, ocho
limitaciones y una agenda de siete preguntas con su condición de cierre.

**Añadido · declaración de intereses.** Una fuente del corpus identifica al
destinatario del informe y a su autor como conductores del Programa DIAT. Se
declara en la metodología, y la sección PUCV publica las dos preguntas de
control con su respuesta.

**Cambiado · DEC-108 queda enmendada.** Prohibía verificar, pero el kit canónico
define «contrastado» como segunda revisión y se la encarga al auditor
metodológico. Lo que reserva a la firma humana es «aceptado», y no hay ni un
registro aceptado. Las guardas del compilador y la prueba que exigía cero
verificaciones no se borraron: pasaron a exigir coherencia.

**Cambiado · los cinco constructores en Python quedan congelados.** No hay
intérprete en el equipo del autor, y un generador que nadie puede ejecutar ni
comprobar es la segunda fuente de verdad que esta cadena existe para evitar.

**Corregido · el manifiesto tenía tres valores fijados a mano que ya mentían**:
las fuentes verificadas, el estado y la nota de cita. Ahora se derivan.

**Corregido · la página tenía dos secciones «Metodología» y dos sobre la PUCV**,
y el bloque de descargas seguía sirviendo los archivos de la v0.5.0.

**Corregido · el manifiesto de integridad fallaba en producción.** Los seis CSV
del paquete se publicaron con checksums que no cuadraban con lo que Vercel
servía. No era un error de cálculo: `core.autocrlf` convertía los archivos a LF
al guardarlos en git mientras el manifiesto describía los CRLF que había escrito
el exportador, de modo que el paquete verificaba en el equipo del autor y
fallaba al descargarlo. Sólo se vio bajando el paquete de producción y
ejecutando `sha256sum -c`. Ahora `.gitattributes` desactiva toda conversión bajo
`public/descargas/`, el exportador normaliza los CSV a LF para que el paquete
sea portable, y tres pruebas comprueban que cada checksum cuadre con su archivo.
Un control de integridad que falla es peor que no tenerlo: enseña a ignorarlo.

**Corregido · el tablero de la portada prometía una tarea ya empezada.** Su siguiente paso decía «verificar una por una las 74 fuentes» cuando 38 estaban hechas. Ahora nombra la tanda concreta que sigue y la institución que va a cero.

**Añadido · ocho pruebas que atan la prosa a los datos**: ninguna conclusión
puede afirmar inexistencia, cada una debe citar afirmaciones que existan, la
prosa no puede escribir a mano un número que el dataset ya conoce, y la sección
PUCV debe reconocer al menos tantos hechos favorables como brechas. Con las tres
que vigilan la integridad del paquete, **127 en total**.

---

### Informe 01 · v0.5.0 · el corpus deja de ser una lista y pasa a ser un dataset

**Añadido.** El Informe 01 tiene por primera vez datos publicados. Seis CSV
canónicos en `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/`
—once universidades, 74 fuentes, 53 iniciativas, 75 evidencias, cobertura y 14
afirmaciones—, un compilador que los proyecta a `src/data/informe01.ts` y una
publicación en el sitio que los enseña: matriz, cobertura, escalera de
institucionalización, mapa de direcciones, sección PUCV, lagunas, auditoría de
la línea base y once fichas institucionales en página propia.

**Corregido · el corpus tenía 74 fuentes y no 72.** La re-extracción mecánica de
URL sobre los cinco documentos de investigación profunda encontró dos que
`intento-2b` cita en su tabla-resumen y nunca convirtió en registro `PROP-*`:
IDEA UCEN y el Diplomado en Derecho, Innovación y Tecnología de la UNAB. Es el
mismo defecto que este proyecto detectó en el documento antecedente, ahora en su
propio corpus. La v0.4.0 no se reescribe: se corrige por delante, con fe de
erratas en el changelog del informe.

**Corregido · dos contadores que se contradecían.** La ficha del informe decía
«0 fuentes · en registro» mientras el propio informe declaraba setenta y pico
unas pantallas más abajo. Ahora lee del registro real y distingue las
registradas de las verificadas, que son cero. Y el tablero de la portada seguía
diciendo 43 fuentes y la asimetría de cobertura de la primera ronda.

**Metodología.** Diez decisiones cerradas y registradas en
`docs/report-01/DECISIONS.md`. Las cuatro que más consecuencias tienen: no se
publica ranking ni puntaje agregado mientras la cobertura sea 3,7 veces mayor en
el piloto; la escalera 0–4 se aplica a la iniciativa y nunca se promedia por
universidad; toda evidencia se atribuye a la unidad que la fuente identifica, y
nueve registros resultaron ser capacidades de universidad y no de Derecho; y
ninguna fuente recibe fecha de verificación mientras la verificación sustantiva
no exista.

**Fuentes.** Ninguna verificada una a una todavía. `sourceIds` y `claimIds` de
`reports.ts` siguen vacíos a propósito: `src/data/research.ts` es la capa de
fuentes verificadas y el Informe 01 no tiene ninguna. El registro se publica
igualmente, desde su propio dataset y con el estado editorial de cada fuente a
la vista.

**Descargas.** PDF, Markdown, HTML, los seis CSV, una representación JSON
completa, manifiesto de publicación y `checksums.sha256`, más un ZIP determinista
que los reúne.

El PDF —A4 de 39 páginas, con encabezado, pie y numeración— se imprime del mismo
HTML con Chromium desde el propio exportador. No es una segunda cadena de
producción: es la misma, renderizada, así que documento y web no pueden divergir.
El navegador se toma del sistema, y si no hay ninguno el paquete sale sin PDF, el
manifiesto lo declara y el sitio no dibuja el botón. Word sigue fuera: su
generador es PowerShell 5.1 con Word por COM.

Al imprimir apareció un defecto que en pantalla no se ve: las tablas anchas viven
en un contenedor con desplazamiento horizontal, y en papel no hay a dónde
desplazarse, de modo que `overflow: auto` recortaba la columna de la derecha. El
registro de 74 fuentes perdía así su URL, en silencio. Con el desbordamiento
abierto y la tabla repartiéndose el ancho de la página, el documento pasó de 99
páginas con columnas cortadas a 39 completas.

**Límites conocidos.** Ninguna de las 53 iniciativas alcanza el cuarto peldaño de
la escalera —evaluación de efecto—, y es la tercera ronda independiente que
llega a esa ausencia. Ninguna de las 74 fuentes proviene de contraste externo.
Dos de las ocho dimensiones no reúnen una sola evidencia en las once
instituciones. Las doce lagunas están declaradas en la publicación, cada una con
su condición de cierre.

**Verificación.** `npm run verify` ejecutado y en verde el 04-09-2026: typecheck,
lint sin errores, 115 pruebas y build de 18 rutas. Dieciocho de esas pruebas son
nuevas y varias son metodológicas antes que técnicas —que ningún registro
declare una verificación que no existe, que toda inferencia sobre una institución
lleve contraevidencia enlazada, que ningún texto publicado convierta una ausencia
de evidencia en una afirmación de inexistencia—.

### La portada ofrece el informe terminado y el juego jugable

**Corregido · dato falso en la acción principal.** El botón primario de la
portada decía «Leer el último informe» y apuntaba al **Informe 01**, que
declara expresamente no emitir conclusiones y cuyas 43 fuentes siguen sin
verificar. No porque hubiera avanzado: porque otra sesión le tocó `updatedAt`
al publicar el kit canónico, y el criterio era «el más reciente».

«Más reciente» y «más terminado» son cosas distintas, y en la primera pantalla
de un sitio que se ofrece para ser citado importa la segunda. El destino se
calcula ahora por madurez editorial —`informeDestacado` en `reports.ts`— con
`updatedAt` como desempate dentro del mismo grado. La etiqueta pasa a «Leer el
informe», que además es verdad.

Tres pruebas lo fijan: la portada no puede encabezar un informe
`en-investigacion`, el destacado tiene que ser el más maduro de los que hay, y
tiene que existir en el registro.

**Añadido.** El juego se juega **en la portada**, sin un clic de por medio. La
cabina se monta sola cuando su sección entra en pantalla.

**Cómo se sostiene sin romper §10.** Phaser son 1,17 MB medidos. La cabina
entra por `next/dynamic` desde `JuegoEnPortada`, así que:

| | |
|---|---|
| Abrir la portada | **200 KB**, ningún trozo pesado |
| Llegar a la sección del juego | +30 KB, la cabina monta |
| Empezar a jugar | ahí, y sólo ahí, baja Phaser |

Quien viene a leer un informe y no baja hasta el juego no descarga un byte del
motor. La regla §10 se reescribe sobre el *paquete inicial* en vez de sobre la
ruta, que es lo que siempre quiso decir.

**Corregido al integrarlo.** `CabinaAudaces` calcula su alto como
`100dvh − distancia al inicio del documento`. Eso sólo vale cuando el juego es
lo primero de la página: en la portada pedía `100dvh − 3000px` y la cabina se
encogía a **256 px**. Se corrige desde `globals.css`, sin tocar código donado.

**Corregido.** El hueco reservado y la cabina descontaban cromos distintos
—5,75rem y 4rem— y daban **28 px de salto de maquetación** al montar el juego
en escritorio. Ahora descuentan la misma variable y no pueden separarse. Salto
medido tras el arreglo: **0 px**, en 375 y en 1270.

**Añadido.** El hueco de espera es pulsable. No contradice el «sin un clic»:
en uso normal nadie lo ve. Existe porque un `IntersectionObserver` no dispara
en una pestaña que nunca produce un fotograma, y sin escape ese lector se
quedaba mirando un cartel para siempre.

**Añadido.** Dos frenos honestos: si el navegador declara `saveData` el juego
espera permiso —descargar un megabyte sin preguntar en una conexión medida es
hostil—, y en modo lectura no se carga, porque ese modo existe justamente para
retirar lo que es pantalla.

**Añadido.** El juego entra en el tablero de estado como línea de trabajo
propia, en revisión: el Capítulo 0 está completo y lo que falta es ver a
alguien jugarlo sin instrucciones antes de escribir el siguiente.

**Verificado.** 0 errores · 8 avisos conocidos · 97 tests · build OK. En el
navegador, sobre el build de producción: 0 fallos de contraste (181 elementos),
0 desbordes y 0 objetivos táctiles bajo 24 px.

### Estado del arte en la portada

**Añadido.** La portada declara en qué punto va cada línea de trabajo, entre el
vestíbulo y las puertas. Cinco entradas: los dos informes, el diseño del curso
de alfabetización en IA, el optativo «IA y Derecho» y las otras líneas. Cada
una con su etapa, lo que falta para la siguiente y, cuando corresponde, su
salvedad.

Existía el dato —informes, experimentos y fichas de Lab tenían cada uno su
estado— pero ninguna vista los ponía juntos. La primera pregunta de quien llega
a un laboratorio en marcha se contestaba leyendo cuatro secciones y sumando de
cabeza.

**Añadido · regla permanente.** `CLAUDE.md` §12 obliga a mantenerlo: toda línea
en curso aparece, lo que no está en curso no aparece, cada entrada declara su
siguiente paso, y se actualiza en el mismo cambio que altera el estado real. Es
lo único de la portada que envejece solo.

**Añadido · cuarta familia de estado.** `StageMeter`, con silueta propia: un
medidor de cuatro tramos. Responde a una pregunta que las otras tres no
contestan —*¿cuánto le falta a esta línea?*—, y una posición en una recta se lee
mejor dibujada que escrita. Un informe puede estar `en-revision` como documento
y ser a la vez lo más atrasado del laboratorio: son dos hechos distintos.

`comprometido` y `supeditado` **no reciben medidor**: no son «más avanzados» que
un desarrollo, son otra clase de hecho, y dibujarlos en la recta sugeriría un
progreso que nadie ha medido.

**Los informes no declaran su estado en el registro nuevo**, lo derivan de
`reports.ts`. Es la regla de fuente única del resto del sitio, y existe porque
ya se rompió una vez: el sitio llegó a decir a la vez «v0.2.0 publicada» y «los
hallazgos todavía no están definidos».

**El movimiento significa algo.** El tramo actual del medidor late sólo en las
líneas que están efectivamente en marcha —`en-desarrollo` y `en-revision`—.
Publicado no late porque ya llegó; en estudio no late porque todavía no arrancó.
Se apaga en modo lectura, con `prefers-reduced-motion` y al imprimir.

**Salvedad institucional.** El optativo va como `comprometido`, no como
programado, y su ficha declara que no está formalizado y que no constituye
anuncio de la Escuela de Derecho. La regla dura 3 prohíbe que este sitio hable
por la Escuela; una prueba impide que esa salvedad desaparezca en una edición de
estilo.

**Añadido.** Recuento de una línea sobre el tablero. El tablero completo mide
2129 px a 375 px de ancho —dos pantallas y media—, y «legible de un vistazo» no
puede depender de recorrerlo entero. El recuento se calcula, no se escribe.

**Añadido.** Ocho pruebas que convierten en fallo la erosión del tablero:
estado y derivación excluyentes, informes que existen, siguiente paso
obligatorio, salvedad obligatoria en los compromisos, enlaces a rutas reales,
horizontes sin fechas inventadas y medidor sólo para los estados de la recta.
Comprobadas por mutación: quitar la salvedad del optativo rompe exactamente una
prueba.
### Informe 01 — kit canónico inter-IA

**Añadido.** Kit canónico `v1.0.0` para continuar la actualización del Informe
01 sobre una cohorte histórica fija de once universidades: fuente maestra en
Markdown, manifiesto, siete plantillas CSV y reglas de relevo para que ChatGPT,
Claude y Gemini trabajen sobre la misma fuente de verdad.

**Publicado.** Exportaciones descargables en PDF, Word, HTML y Markdown, más un
ZIP con el paquete completo y controles de integridad. La ficha del Informe 01
distingue explícitamente este protocolo de los hallazgos sustantivos todavía en
investigación.

**Verificado.** TypeScript, ESLint, 86 pruebas y compilación de producción
correctos; ficha del informe y cinco descargas comprobadas también en el dominio
público, todas con respuesta `200`.

### Capa espacial — el patrón de `/aldunate` alcanza a todo el sitio

**Añadido.** Motor de movimiento global (`SpatialStage`). Vivía sólo en
`/aldunate` como `MotionStage`; ahora está en el layout raíz y sirve a las
dieciséis rutas. Es el mismo motor —un observador, un listener de scroll, un
ticker— más el reflejo del puntero y la profundidad al desplazar.

**La corrección que lo hacía posible:** montado en el layout, un efecto con
`[]` observaría los elementos de la primera página visitada y de ninguna más,
y a partir del segundo clic todo lo que llevara `data-reveal` se quedaría en
`opacity: 0` para siempre. Depende de `usePathname()` y vuelve a escanear en
cada navegación.

**Añadido.** Lenguaje visual de computación espacial, inspirado en las *Human
Interface Guidelines*: material translúcido con desenfoque y saturación
(`.glass`), escala de elevación de tres pasos, radio de tarjeta grande, reflejo
del cursor sobre las tarjetas y respuesta a la pulsación. Sólo llevan vidrio
las capas que de verdad flotan —cabecera, barra de pestañas, panel de EVA—;
una página entera de vidrio no es profundidad, es ruido caro de pintar.

**Añadido.** Cuarta familia tipográfica, `--font-ui`: la del sistema —SF Pro en
un aparato de Apple, Segoe UI Variable en Windows— y sólo para el chrome de
interfaz. Newsreader sigue firmando la prosa y JetBrains Mono los metadatos.
El límite es deliberado: con SF en todo, el sitio pasaría de archivo
constitucional a aplicación genérica.

**Cambiado.** El menú de hamburguesa desaparece en pantallas estrechas y lo
sustituye `<TabBar>`, la navegación inferior de iOS: las cinco secciones
visibles sin abrir nada y al alcance del pulgar. Lo que se pierde son las
pistas de una línea que el menú mostraba; siguen en las tarjetas de la portada,
que es donde se decide entrar.

**Cambiado.** El modo lectura sube a la cabecera del sitio. El CSS que lo
aplica siempre fue global; lo único que lo ataba a `/aldunate` era dónde vivía
el botón. Ahora funciona en las dieciséis rutas, persiste y sobrevive al cambio
de ruta. Estado compartido en `components/layout/reading-mode.ts`. La barra de
pestañas **no** desaparece en modo lectura: es la única navegación de la ruta
en un teléfono.

**Cambiado.** `Surface interactive` implica tarjeta espacial, y `<Section>`
aparece al entrar en pantalla. Las dos decisiones están en la primitiva y no en
las páginas: es lo que armoniza las rejillas de Experimentos, Lab e Informes
sin pasar por trece archivos, y lo que impide que una página nueva se olvide
del atributo.

**Cambiado.** Radio base de 8 a 12 px. Da una escala de dos radios en vez de un
salto: 12 px en lo que está apoyado en la página y 20 px en lo que flota.

**Corregido.** El panel de EVA se montaba 41 px encima de la barra de pestañas
y tapaba dos de las cinco secciones —medido, no supuesto—. Las capas flotantes
usan ahora un suelo común (`--float-bottom`) que cuenta el alto de la barra y
el respiro de la barra de gestos del teléfono.

**Corregido.** Veintiséis objetivos táctiles por debajo de 24 px en
`/aldunate`, todos anteriores a este cambio: veinte fichas de filtro del
explorador de publicaciones a 21 px, dos enlaces de texto a 15 y cuatro
enlaces de fuente de la cronología a 17. Ninguno era enlace en línea, así que
la excepción de WCAG 2.2 AA 2.5.8 no los cubría. Quedan en cero.

**Verificado.** 0 fallos de contraste en ambos temas; 0 desbordes horizontales
en las siete rutas medidas a 375 px; 0 objetivos táctiles bajo 24 px. La capa
entera se apaga en modo lectura, con `prefers-reduced-motion` y al imprimir, y
la página sigue diciendo lo mismo.

### Perfil académico — la ruta `/aldunate`

**Añadido.** La ruta pasa de declarar dos catálogos vacíos a una monografía
navegable en cinco actos: retrato, ficha con nivel de evidencia por línea, mapa
conceptual de arcos, explorador de preguntas, catálogo con tres lecturas,
cronología y bibliografía. `/aldunate/papers` deja de estar huérfana y pasa a
ser el catálogo completo, imprimible y sin un solo componente de cliente.

**Contenido.** Entran 40 obras (38 artículos y 2 libros, 1993–2024) con sede,
volumen, páginas y coautoría, contrastadas contra Dialnet y, donde estaba
accesible, contra la publicación original. Cada dato lleva su nivel de
evidencia y el número de la fuente que lo sostiene.

**Corregido del material de partida.** Seis afirmaciones del informe de
investigación no se sostenían y no se publicaron: «Limitación y expropiación»
estaba fechado en 2024 y es de 2006 —y el título es «Scilla», no «Scylla»—;
dos artículos más con año equivocado; una contradicción interna del propio
informe; «Quilpué, 1968» sin fuente; e indicadores bibliométricos que el propio
documento declaraba no verificados. Detalle en
`docs/AUDITORIA-PERFIL-ALDUNATE.md`. D-034.

**Corregido en el sitio.** Dos mensajes de EVA seguían diciendo que el catálogo
estaba vacío. Es el tipo de dato falso que compila y que `verify` no ve.

**Añadido.** Modo lectura conmutable y persistido: retira lienzos, movimiento,
barras pegajosas y grano; deja texto y referencias. Es también lo que se
imprime.

**Corregido.** Dos barras pegajosas se disputaban `top-0`: la navegación de
sección se montaba sobre la cabecera del sitio.

**Corregido.** El bucle WebGL corría a 60 fps para siempre. A una vuelta cada
110 s, un fotograma mueve la escena 0,0009 rad. Ahora va a 24 fps y el paso se
calcula por milisegundo, de modo que no depende de la tasa de refresco.

**Corregido.** El pestillo del ticker de scroll podía quedarse trabado si
`requestAnimationFrame` no llegaba a ejecutarse, y entonces el scroll dejaba de
actualizar para siempre. Sustituido por cancelar y volver a pedir.

**Añadido.** 22 pruebas de integridad del perfil: rompen el build si un
`sourceId` no existe, si un concepto se queda sin obras, si un dato con una
sola fuente secundaria se marca como verificado, o si alguien atribuye una
tesis a una obra que nadie ha leído.

### Informe 01 — el corpus de evidencia

- **El Informe 01 tiene corpus.** Llevaba desde el 29-08 con la estructura
  montada y el registro vacío. Se funden tres investigaciones profundas sobre IA
  y Derecho en las once universidades de la cohorte, siguiendo los cinco pasos de
  la skill `informe-vivo`: **43 fuentes públicas únicas**, todas institucionales,
  todas con fecha. Los documentos fuente quedan versionados en
  `content/reports/01_ia_escuelas_derecho_chile/sources/`, porque lo que no está
  versionado no es trazable. Ficha en `v0.2.0`.
- **Una de las tres investigaciones se cayó en el paso 1, y es el hallazgo.**
  Declaraba 25 fuentes con identificador y ninguna tenía URL: sus referencias
  eran marcadores internos del buscador del modelo que la produjo, no resolubles
  por un tercero. No aporta nada fusionable y queda como antecedente. Un
  documento que se cae en el inventario es un documento que no llega a la
  publicación.
- **Se declara la desigualdad de cobertura antes de que engañe a nadie.** Nueve
  fuentes en cada universidad del piloto, dos en cada una de las otras ocho: esa
  diferencia mide esfuerzo de investigación, no actividad institucional. **No se
  emite ninguna comparación nacional**, que es exactamente lo que la metodología
  declarada del informe ya exigía.
- **Verificación de resolubilidad de las 43 fuentes.** 42 responden; la de la
  UdeC existe pero su certificado no cubre el nombre de host, así que se conserva
  con la advertencia declarada en vez de descartarla —es una de sus dos únicas
  fuentes—. `sourceIds` y `claimIds` **siguen vacíos**: que una URL responda no
  prueba que diga lo que se le atribuye, y esa verificación no se delega.

### Cadena de producción — el repositorio recupera el original del Informe 02

**El repositorio no contenía el texto del documento que estaba publicado.**
Producción servía el Informe 02 en v0.3.0 mientras `tools/informes/informe-02/`
conservaba el texto de la v0.2.0: cinco `contenido-*.json` y el
`resumen-01.json` se habían corregido durante la auditoría en la carpeta de
escritorio de la que salió el PDF, fuera del control de versiones. Quien leyera
el repositorio para saber qué dice el informe habría leído la versión anterior
sin ninguna señal de que lo era. Es el riesgo A-29 de `docs/audit-v0.3.0.md`, y
no era hipotético: ya había ocurrido.

**Traído y comprobado.** Los once JSON del repositorio son ahora idénticos a los
que generaron el documento publicado, y las correcciones de la auditoría que
vivían sólo en los scripts de fuera están portadas a la versión parametrizada
del repositorio: la autoría firmada, «INVESTIGACIÓN APLICADA» en lugar de
«INFORME EXPERTO», y las cuatro cifras de portada con la procedencia que antes
callaban —HEPI 2026 con su n, Scarfe et al. 2024 con sus cinco módulos, y la
advertencia de que el 19 % sale de una muestra no representativa—.

La comprobación no es que los archivos coincidan, sino que la cadena reproduce:
recompilado desde `tools/informes/informe-02/`, el HTML resultante es idéntico
al publicado salvo el fin de línea. La carpeta de escritorio queda como
histórica y no se edita más.

### Corregido

- **El comprobador de identificadores huérfanos daba una falsa alarma sobre
  nuestros propios datos.** `CLAUDE.md` §8 lo llama «el paso que más se olvida», y
  señalaba como huérfano un `clm-` que estaba perfectamente definido: `comm`
  exige entrada única y ese identificador aparece dos veces en `reports.ts`, en
  `claimIds[]` y en `claimChanges[].claimId`. Ahora lleva `sort -u` en ambos
  lados. De paso se le quitó la coma final al patrón, que habría hecho invisible
  al último elemento de un array sin coma de cierre —un falso negativo, peor por
  silencioso—. Comprobado: 42 definidos, 42 usados, cero huérfanos. Un
  comprobador que se equivoca enseña a ignorarlo.
- **La skill daba por vacío el paso de arbitraje cuando no había fuentes
  repetidas.** Estaba redactado sólo alrededor de «la misma fuente vista dos
  veces». Ahora cubre también las cifras que coinciden midiendo cosas distintas y
  las fuentes que se contradicen en apariencia, y manda comprobar de qué está
  hecha una referencia antes de contarla.
- **`07-puente-con-el-sitio.md` mandaba correr una verificación que ya no
  existía** —`typecheck && lint && build`—, sin los tests que `npm run verify`
  incorporó.
- **Quien ya había jugado no veía el capítulo nuevo.** La partida guardada lo
  devolvía a mitad del Capítulo 0 —los ids de nodo no cambiaron, así que el save
  funcionaba— y se saltaba para siempre la apertura reescrita y el tribunal de
  tres. `SAVE_VERSION` sube a 2: se conserva el personaje y se suelta la
  posición. D-032.
- **El juego no se nombraba desde la portada.** La pista de «Experimentos» y el
  pie ahora lo llaman por su nombre; antes estaba a tres clics y sin nombre.

- **No se veían los jueces.** `setBounds` pegado al mundo recortaba el
  desplazamiento de cámara: a zoom 1,2 el centro sólo podía moverse entre y=300
  e y=420, y el estrado está en y=176. La cámara **no podía enfocar al
  tribunal**. Con `FIT` no se notaba; con el recorte panorámico los dejaba fuera
  de pantalla. Ahora hay 300 px de margen y la sala se dibuja hasta ahí. D-031.
- **No se identificaba a quien habla.** Rótulo con el nombre sobre la cabeza
  —sujeto a la banda visible, que si no desaparecía en los planos de dos—, los
  demás al 55 % de opacidad, y sólo gesticula quien habla. D-031.
- **Las caras no se distinguían.** El zoom de conversación sube de 1,35 a 1,8:
  con 1,35 la cara quedaba en unos treinta píxeles. D-031.
- **El ritmo era lento.** El tecleo baja de 22–30 ms por carácter a 9–15, y los
  paneos de 420–520 ms a 260–320. D-031.
- **El recorte panorámico dejaba poco sitio.** El escenario pasa de 11 a 15 rem
  de suelo garantizado.

### Añadido

- **El tribunal son tres.** Isabel Achurra preside con hambre, Óscar Pinilla
  anota y sólo interviene por el acta, Amanda Riquelme hace la pregunta que
  nadie quería hacer. Dos personajes nuevos con su arte horneado. D-029.
- **La cámara sigue a quien habla.** Cada línea del guion puede declarar `quien`
  la dice y `a` quién: gesticula sólo esa persona y la cámara va a ella, o abre
  para encuadrar a las dos cuando alguien le habla a alguien. Antes el encuadre
  se fijaba una vez por nodo y no se movía aunque contestaran tres personas
  distintas. D-029.
- `src/lib/rpg/encuadre.ts`: la matemática del encuadre, fuera de Phaser y con
  diez pruebas. Es la única parte de la cinematografía que puede equivocarse en
  silencio.
- **Humor.** El Capítulo 0 se reescribe como comedia de sala, con el límite
  anotado: nadie hace un chiste a costa de la acusada. D-030.
- Dos pruebas más sobre el guion: que toda línea dirigida apunte a alguien que
  existe, y que los tres jueces hablen. Total: 44.
- **El juego se juega sin desplazar la página.** La cabina mide `100dvh` menos
  el cromo del sitio y reparte ese alto entre barra superior, escena, panel y
  acciones. Antes había que bajar 895 px para empezar a jugar y el juego seguía
  sin caber; la creación de personaje medía 1207 px en un viewport de 768.
  D-027.
- **Pantalla completa propia**, sin depender de la del navegador: un botón en la
  barra del juego pone la cabina en `fixed`. Se sale con el mismo botón o desde
  la pausa.
- Barra superior del juego con el rótulo «Ficción · prototipo», que a pantalla
  completa es el único que queda a la vista. D-028.
- Barra de acciones estructural en todas las pantallas del juego: «Continuar»,
  «Entrar a la sala» y «Alegato final» dejan de vivir dentro del texto.
- El veredicto se lee paginado, con contador `n/total`.
- Siete pruebas nuevas (`cabina.test.ts`) que cierran las tres formas concretas
  en que este layout se rompió: alturas de pantalla sueltas, contenedores
  flexibles sin `min-height: 0` y barras de acciones dentro de la zona que se
  desplaza. Total: 32.

- **La Ley de los Audaces**: RPG jurídico chileno jugable en
  `/experimentos/juegos/ley-de-los-audaces`. Capítulo 0 completo —creación de
  personaje, audiencia, contradicción, prueba y alegato final—, con su motor,
  su reparto de arte procedural y su documentación dentro de este repositorio.
- Ficha auditable: reparto, referencias normativas con su estado de verificación
  y pendientes declarados, calculados del propio contenido.
- `docs/juegos/ley-de-los-audaces/`: checkpoint, decisiones, dirección de arte,
  QA, backlog, devlog y encargos a agentes.
- Scripts `juego:arte` (horneado del arte) y `juego:suelto` (el juego en un
  archivo, sin red).
- `npm run verify` incorpora los tests: 25, con Vitest.
- `docs/AUDITORIA-2026-08-31.md`: auditoría del repositorio completo, con foco en
  la sección `/laboratorio`.
- `docs/PUENTE-Y-HOJA-DE-RUTA.md`: qué es el sitio como puente entre proyectos,
  los cuatro pendientes reales y en qué fase entra cada uno. Documento interno:
  las fichas que propone **no** están publicadas.
- `docs/juegos/ley-de-los-audaces/misiones/INFORME-2026-08-31.md`: informe de la
  misión de publicación.

### Cambiado

- La ficha de `La Ley de los Audaces` deja de describir el juego anterior
  —legislar bajo presión— y pasa a `prototipo` con enlace jugable.
- `Experiment` admite `jugableEn`; la tarjeta pinta el botón **sólo si existe**.
- `/experimentos/juegos` declara el estado real de cada pieza y **abre con el
  juego destacado**: estado, botón «Jugar el Capítulo 0», enlace a su
  documentación y cuatro cifras calculadas del propio capítulo. El catálogo de
  abajo pasa a mostrar sólo lo que todavía no se puede tocar. D-026.
- **La página del juego abre con el juego.** La cabecera, el aviso de ficción y
  la ficha auditable pasan debajo de la cabina.
- **HUD responsive**: columna lateral cuando hay ancho, banda horizontal
  compacta cuando no. Las seis estadísticas se van a la pausa en vez de
  desaparecer.
- **Creación de personaje en dos columnas**: nombre y avatar a un lado,
  especialidad al otro. Las tres decisiones se ven a la vez.
- **La sala llena el ancho del hueco.** Phaser pasa de `Scale.FIT` a
  `Scale.ENVELOP`: con FIT, a 1366×650 el tribunal quedaba en 311 px dentro de
  un hueco de 1082, con 770 px de franjas negras. Ahora cubre y recorta techo y
  suelo, que es donde no pasa nada, y la cámara sigue a quien habla. D-027.
- El panel reserva siempre 11 rem para la sala. Cuando su contenido no cabe en
  lo que le toca, se desplaza por dentro; la barra de acciones sigue fuera de
  ese desplazamiento.
- Phaser arranca con `audio: { noAudio: true }`. El capítulo no tiene sonido y
  el contexto de audio dejaba dos `InvalidStateError` en la consola al salir de
  la ruta.

### Corregido

- **La barra de acciones se salía de la pantalla en móvil en horizontal.** A
  844×390 la cabina medía 352 px por su alto mínimo y el cromo del sitio otros
  93, contra 390 de viewport. Mínimo bajado a 16 rem.
- **El lanzador de EVA tapaba el botón principal** en pantallas estrechas, donde
  el HUD no ocupa el lateral derecho. La barra de acciones le reserva su
  esquina.
- **Al salir de pantalla completa la cabina se quedaba con el viewport entero.**
  El observador medía el cromo mientras la cabina estaba en `fixed` y guardaba
  cero. Ahora no se mide en ese estado.
- **La sala del tribunal había desaparecido en la mayoría de los portátiles.**
  El umbral que la ocultaba estaba en 704 px de alto y el viewport real de un
  1366×768 ronda los 650: la regla borraba el tribunal justo en la pantalla más
  común. Ahora sólo desaparece por debajo de 432 px.

- **`/experimentos` rompía la hidratación.** La ficha del juego trae su propio
  enlace «Jugar» y el catálogo la envolvía en otro: `<a>` dentro de `<a>`, HTML
  inválido, y React descartaba el árbol servido para rehidratar la página
  entera. La tarjeta deja de ser enlace cuando la ficha ya trae el suyo. D-024.
- **El recuento de familias dejaba fuera al juego.** Desde que la pieza jugable
  tiene ruta propia, comparar con `===` la excluía: «Juegos» anunciaba 1 pieza
  con 2 en el catálogo. Se cuenta por prefijo de ruta. D-025.

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado semántico.

---

## [0.6.0] — 2026-08-31

### Añadido

- **Skill `informe-vivo`** en `.claude/skills/`. Encapsula el flujo completo de
  producción: investigación, corpus, contenido, figuras, compilación y
  publicación. Existía la maquinaria y existía el método escrito; faltaba lo que
  los invoca cuando alguien pide un informe sin saber que hay una cadena detrás.
- La skill trata como caso de primera clase el encargo más frecuente y peor
  resuelto: **fundir varios documentos de investigación en un informe único**.
  Cuatro investigaciones no son cuatro capítulos. El procedimiento —inventariar
  fuentes en vez de textos, arbitrar los desacuerdos abriendo la fuente,
  reclasificar desde cero y derivar la estructura de la evidencia y no de los
  documentos de origen— es lo que separa una fusión de una suma.
- Recoge además los errores ya cometidos en este repositorio, para que no se
  repitan: el BOM de PowerShell, las variables que no distinguen mayúsculas, la
  numeración manual de figuras, la renumeración ascendente de capítulos y los
  identificadores huérfanos.

### Corregido

- Las notas «Sin verificar» de 0.4.0 y 0.5.0 quedan resueltas: el CI del
  repositorio ejecuta `npm run verify` en cada push a `main`, y ambos commits
  (`3ec584a` y `5d78036`) pasaron typecheck, lint y build. La verificación
  existía; lo que faltaba era mirarla.

---

## [0.5.0] — 2026-08-31

### Añadido

- **`tools/informes/` — la cadena de producción completa.** Deja de vivir fuera
  del repositorio: el motor de gráficos, el generador de `.docx`, las dos
  maquetas web y los constructores quedan versionados aquí. El informe 02 está
  incluido íntegro como ejemplo funcionando, con sus doce figuras en dos
  resoluciones y su corpus de evidencia.
- **`tools/informes/plantilla-informe-nuevo/`** — esqueleto en blanco que
  compila. Se copia para arrancar un informe: no hay que empezar de cero ni
  clonar el 02. Documenta cada tipo de bloque con el propio contenido.
- **`docs/informes/` — el método en siete documentos.** Metodología de
  investigación, sistema de diseño, motor de gráficos, generador de Word, modelo
  de contenido, guía de reproducción y puente con el sitio. Escritos para que
  alguien que no estuvo presente pueda reconstruir lo que se hizo.
- **Botón «Leer en línea»** en la ficha del informe. `ReportVersion` gana un
  campo `html` con la misma regla que `pdf`: aparece solo si el archivo existe.

### Cambiado

- Los constructores dejan de tener rutas absolutas y pasan a aceptar
  `-Contenido`, `-Salida`, `-Titulo` y demás. Antes solo funcionaban en la
  máquina donde se escribieron; ahora la cadena es portátil, y se comprobó
  ejecutándola entera desde su nueva ubicación: 12 figuras, 24 tablas y los
  mismos pesos de salida que el original.
- `CLAUDE.md` §6 y §8 recogen `tools/` y las reglas propias de la cadena: las
  figuras no llevan número escrito, una figura sin fuente no se publica, los
  `.ps1` van en UTF-8 con BOM.

### Aprendido

- PowerShell no distingue mayúsculas en los nombres de variable, así que `$T` y
  `$t` son la misma. Costó un intento fallido durante esta misma sesión, y está
  documentado en `docs/informes/06-reproducir.md` con su solución.

### Sin verificar

- Sigue sin ejecutarse `npm run verify`: la máquina no tiene Node. Se comprobó a
  mano que `ButtonLink` admite las variantes `primary` y `outline` usadas, que
  `BookOpen` existe en `lucide-react` y que los 42 identificadores de fuentes y
  afirmaciones siguen sin huérfanos. El build de Vercel es la verificación real.

---

## [0.4.0] — 2026-08-31

### Añadido

- **Informe 02 v0.2.0** — documento completo: 24 capítulos y 3 anexos,
  76 páginas, 12 figuras y 24 tablas. Descargable en PDF desde la ficha del
  informe. El botón aparece porque el archivo existe.
- **Capa de investigación poblada.** `sources` pasa de 0 a 24 entradas y
  `claims` de 0 a 18. Cada fuente se verificó abriendo el documento original;
  las que no pudieron rastrearse hasta su fuente primaria quedaron fuera.
- Las 18 afirmaciones se distribuyen en los cinco niveles sin colapsarlos:
  siete hechos, cinco señales, tres inferencias, una hipótesis y dos
  pendientes. Los dos pendientes son los que más dicen —no hay evidencia
  independiente de que los despliegues masivos mejoren el aprendizaje, y no se
  localizó rediseño evaluativo publicado en facultades chilenas— y se registran
  como ausencia de evidencia, no como evidencia de ausencia.

### Cambiado

- Informe 02 pasa de `en-investigacion` a `en-revision`. Existe documento, no
  existe revisión externa: `publicado` habría sido una promesa que el estado
  real no sostiene.
- Su resumen ejecutivo deja de describir alcance y pasa a describir hallazgos,
  porque ahora los hay.
- Tres preguntas abiertas nuevas, todas sobre vacíos que la investigación
  identificó y no pudo cerrar: el coste real de la evaluación válida, el efecto
  a lo largo de una carrera completa y la validez de estos hallazgos fuera del
  inglés.

### Registrado

- La retractación del metaanálisis de Wang y Fan (22 de abril de 2026, tras 266
  citas) entra como fuente propia. Cualquier lectura de la literatura anterior a
  esa fecha tiene que hacerse con ese dato delante.

### Sin verificar

- **No se ejecutaron `typecheck`, `lint` ni `build`**: la máquina donde se hizo
  este cambio no tiene Node instalado. Se comprobó a mano que los 42
  identificadores de `sourceIds` y `claimIds` existen en `research.ts`, sin
  huérfanos en ninguna de las dos direcciones, y que los campos poblados
  coinciden con los que consume la interfaz. Falta correr `npm run verify` antes
  de dar por bueno el despliegue.

---

## [0.3.0] — 2026-08-30

### Añadido

- **Borges · El jardín de las interpretaciones que se bifurcan** — una
  disposición ficticia, unos hechos fijos y tres decisiones hermenéuticas
  encadenadas, cada una apoyada en un canon reconocible (literal/teleológica,
  empírica/conceptual, estricta/extensiva). Cinco desenlaces defendibles del
  mismo texto, desde el archivo sin sanción hasta la agravada contra dos
  personas.
- El árbol es **asimétrico** a propósito: la lectura teleológica de «alterar»
  cierra el caso y deja sin objeto las dos preguntas siguientes. Un esquema de
  opciones equilibradas habría ocultado que existen decisiones interpretativas
  que no responden una pregunta, sino que vuelven irrelevantes las demás.
- Panel «el jardín completo»: cuenta las ramas recorridas sobre el total, con
  el total derivado del recorrido del árbol y no escrito a mano.

### Cambiado

- Borges pasa de `idea` a `jugable`. Quedan cuatro piezas como idea.

### Cerrado

- PR #1 (`vercel/react-server-components-cve-vu-ajyqgj`), sin fusionar. Proponía
  `next@15.5.9` sobre un `main` que ya está en `16.3.3` con `npm audit` en cero:
  fusionarlo habría retrocedido una versión mayor. El motivo quedó comentado en
  el propio PR y en `docs/HANDOFF.md` §3.6.

### Verificado

- typecheck, lint y build limpios.
- Las cinco ramas recorridas contra el build de producción: cinco desenlaces
  distintos, contador en 5/5, ninguna rama sin recorrer.

---

## [0.2.0] — 2026-08-29

Ajustes de fidelidad a la guía visual y dos experimentos interactivos nuevos.

### Añadido

- **Wittgenstein · ¿Qué regla estás siguiendo?** — «Ningún vehículo puede
  entrar al parque»: ocho objetos, tres propósitos declarados, el mismo texto
  en los tres. No corrige respuestas: devuelve las del usuario y señala cuáles
  cambió al cambiar el contexto. Núcleo y penumbra se derivan de lo respondido.
- **Ama tu Constitución** — ocho dimensiones de diseño institucional (rigidez,
  vía de reforma, ejecutivo, derechos, justicia constitucional,
  descentralización, participación, estados de excepción). Sin puntaje ni
  etiqueta de identidad: la salida son las tensiones internas de la combinación
  elegida.
- Esquema de `Publication` ampliado con `question`, `thesis`, `concepts`,
  `relatedAuthors`, `relatedWorks` y `openQuestions`, para navegar el archivo
  por ideas y no solo por fechas.

### Cambiado

- Paleta fijada a los hexadecimales de la guía: nocturno `#09131D` · `#4BC7E8`;
  claro `#F7F4EE` · `#29588C` · `#8A2432` · `#B78C30`. El fondo oscuro deja de
  ser negro casi puro y recupera el azul.
- Copy del portal según la guía: «Un experimento digital» como antetítulo y
  «Derecho constitucional, lenguaje y otras complicaciones» como subtítulo.
- Constitution Lab y Gramatiquerías pasan de `prototipo` a `jugable`.

### Corregido

- Navegación por teclado ARIA en los dos módulos nuevos: los grupos de radio
  responden a flechas, Inicio y Fin, con `tabIndex` móvil, igual que el resto
  de los experimentos.
- Versión unificada en `site.version`: dejaba de estar escrita a mano en el
  footer y en el portal, donde ya había quedado desfasada.
- Contraste del tono `warning`: el badge de texto pequeño quedaba en 4.40:1
  frente al 4.5:1 exigido. Ajustado en ambos temas.

### Verificado

- Auditoría de contraste sobre el DOM renderizado, con carga limpia en cada
  tema: 0 fallos sobre 125–144 elementos por página.
- Los cuatro módulos interactivos ejercitados contra el build de producción.

---

## [0.1.1] — 2026-08-29

Versión de estabilización para producción y despliegue en Vercel.

### Seguridad y plataforma

- Next.js actualizado de `15.5.4` a `16.3.3`; se elimina la vulnerabilidad
  crítica reportada para la versión anterior.
- Node.js fijado en `22.x` para evitar saltos automáticos de versión mayor en
  Vercel.
- `npm audit` queda en cero vulnerabilidades.
- Scripts de instalación de `sharp@0.35.4` y `unrs-resolver@1.12.2` revisados y
  aprobados por versión en `package.json`.
- `recharts` retirado mientras no exista un dataset que requiera gráficos.

### Corregido

- ESLint migrado a la configuración plana nativa de Next.js 16.
- Estado de tema, menú móvil y EVA adaptado al modelo de efectos de React 19,
  sin actualizaciones de estado sincrónicas dentro de efectos.
- Los catálogos de Aldunate ahora calculan sus contadores desde los datos.
- La portada obtiene la versión más reciente de cada informe por fecha, sin
  depender del orden del arreglo.
- La sección de fuentes de un informe queda preparada para mostrar las fichas
  reales, no solo un contador.
- Los selectores de Constitution Lab y Gramatiquerías incorporan navegación
  completa por flechas, Inicio y Fin siguiendo el patrón ARIA de radio.

### Verificado

- TypeScript, ESLint y compilación de producción correctos.
- Todas las rutas públicas responden `200` y los tres alias responden `307`
  hacia su destino esperado.
- Flujo de GitHub Actions para instalación limpia, auditoría, lint, tipos y
  compilación en cada cambio de `main` y cada pull request.
- Tarjeta social propia para el sitio, sin escudo ni signos de oficialidad
  institucional; los informes sin imagen propia no heredan una portada genérica.
- URL base corregida al dominio de producción asignado por Vercel para evitar
  enlaces Open Graph rotos.

## [0.1.0] — 2026-08-29

Primera implementación. Estructura completa, contenido académico pendiente de
verificación.

### Añadido

**Base técnica**
- Proyecto Next.js 15 (App Router) con React 19, TypeScript estricto y
  Tailwind v4.
- 16 rutas prerenderizadas. Sin backend.
- `npm run verify` — typecheck, lint y build en una orden.

**Modo visual dual**
- Tema nocturno «archivo constitucional del futuro»: azul-negro, cian
  contenido, índigo, retícula, grano mínimo.
- Tema institucional PUCV: off-white cálido, azul `#29588C`, burgundy
  `#8A2432`, dorado `#B78C30`, registro editorial sin glow.
- Conmutador persistente con script de arranque: sin destello de tema
  equivocado en la primera carga.
- Utilidades de ambiente basadas en variables de tema: una clase, dos lecturas.

**Tipografía**
- Newsreader (serif) para títulos y prosa; Space Grotesk para interfaz;
  JetBrains Mono para metadatos y trazabilidad.

**EVA**
- Guía residente anclada a ruta, con doce mensajes contextuales.
- Aparición automática única en la primera visita; silenciado persistente;
  cierre con `Escape`; sin overlay ni foco atrapado; respeta
  `prefers-reduced-motion`.
- `EvaNote` para anotaciones en línea dentro del contenido.
- Retratos integrados desde `/public/eva/`.

**Secciones**
- `/` — portal con las cuatro entradas, mapa intelectual y estado del
  laboratorio.
- `/aldunate` — perfil, seis líneas de trabajo con sus conexiones, y cinco
  huecos declarados.
- `/aldunate/papers` y `/aldunate/cursos` — catálogos vacíos con la vista de
  listado ya construida.
- `/laboratorio` — ocho fichas filtrables por categoría y estado, con
  limitaciones visibles; las diez categorías del alcance.
- `/informes` — biblioteca de documentos vivos.
- `/informes/[slug]` — detalle en tres capas de lectura: resumen ejecutivo,
  metodología y límites, historial de versiones y fuentes.
- `/experimentos` — hub con tres familias y ocho piezas.
- `/experimentos/constitucion` — **Constitution Lab**, interactivo: cambiar el
  operador deóntico de un artículo y observar qué disposiciones dependientes
  quedan inaplicables o en tensión.
- `/experimentos/gramatiquerias` — **ambigüedad sintáctica**, interactivo: dos
  análisis gramaticales válidos de una misma oración normativa, con sus
  consecuencias jurídicas divergentes.
- `/experimentos/juegos` — La Ley de los Audaces y Lex Note, en diseño, con los
  requisitos que faltan para construirlas.
- `/investigacion` — la cadena de cinco eslabones, los cinco niveles de
  evidencia, seis reglas de método y el esquema público de ambos registros.
- `not-found` — 404 con las cuatro entradas.

**Institucional**
- Franja de prototipo no oficial en el layout raíz, en todas las páginas.
- `<InstitutionalMark>` como única vía de uso del escudo Derecho PUCV, sin
  recolorear, animar ni deformar.
- Aviso de uso pendiente de autorización formal en el footer.
- `robots: noindex` mientras no exista autorización institucional.

**Contenido e investigación**
- `content/reports/01_ia_escuelas_derecho_chile/` — Informe 01, alcance,
  ocho ejes, doce variables, metodología y límites declarados.
- `content/reports/02_transformacion_ensenanza_derecho/` — Informe 02, once
  ejes de análisis, metodología y límites declarados.
- `content/research/` — registro de fuentes, matriz de evidencia y plantilla de
  notas.

**Documentación**
- `CLAUDE.md`, `README.md`, `docs/DECISIONS.md`, `docs/HANDOFF.md`,
  `CHANGELOG.md`, además del master prompt, la arquitectura y el pipeline de
  contenido heredados del encargo.

### Pendiente por diseño

- Publicaciones, cursos y ficha biográfica: sin datos. Requieren verificación.
- `sources` y `claims`: registros vacíos. No se poblarán con ejemplos.
- PDFs de los informes: no existen todavía; el botón de descarga no se muestra.
- Mapa de calor constitucional, Wittgenstein, Borges, Eco, La Ley de los
  Audaces y Lex Note: declarados como ideas, con sus requisitos publicados.
  (Wittgenstein pasa a estar construido en 0.2.0.)


## Rediseño UX/UI · 31-08-2026

Auditoría en `UX-UI-AUDIT.md`, detalle por fases en `UX-UI-CHANGELOG.md`.

- El escudo de la Escuela de Derecho sale del sitio público hasta que exista
  autorización, y con él un retrato de EVA que lo llevaba incrustado en el
  píxel junto al rótulo «EVA · ESCUELA DE DERECHO PUCV». D-033.
- Tres datos falsos corregidos: «registros vacíos» sobre 24 fuentes cargadas,
  «el PDF de noventa y seis páginas» (son 76) y «cuatro entradas» sobre cinco
  tarjetas.
- Las 24 fuentes y las 18 afirmaciones se publican por primera vez. El sitio
  afirmaba trazabilidad y sólo enseñaba el esquema de sus registros.
- Tres familias de estado con silueta propia: madurez, estado editorial y nivel
  de evidencia dejan de compartir componente.
- La portada encabeza el laboratorio y no el nombre del profesor. Navegación
  reordenada: primarias Informes, Experimentos y Lab.
- Responsive y accesibilidad medidos: un overflow de 69 px corregido, 48
  objetivos táctiles por debajo de 24 px elevados, 118 fallos de contraste en
  tema claro eliminados.
- 12 pruebas nuevas sobre `src/data/`, que no tenía ninguna.

## Auditoría v0.3.0 · 01-09-2026

Estado hallazgo por hallazgo en `docs/audit-v0.3.0.md`.

- Once afirmaciones recalibradas al diseño de sus fuentes: alcance del estudio
  de Reading, comparación Harvard–Bastani, gobernanza, excepcionalismo jurídico
  y detectores dejan de afirmar más de lo que su evidencia sostiene.
- «D5 · causalidad establecida» → «identificación causal en contexto
  experimental», con el alcance de generalización como dimensión aparte.
- La taxonomía se parte en cuatro: estado documental, robustez, nivel
  demostrativo y generalización. «VERIFICADO» las mezclaba.
- Fuentes críticas contrastadas contra su publicación original. Aparece una
  corrección de PNAS sobre Bastani et al. que el informe no mencionaba.
- Título canónico único entre PDF y web; estado de versión derivado de una sola
  fuente; cadena de conteos publicada.
- Portada del informe: cifras con universo y muestra, «Investigación aplicada»
  en vez de «Informe experto», autoría con nombre.
- Informe regenerado como v0.3.0 —77 páginas, sin residuos de Word— y publicado
  junto a v0.2.0, que no se sobrescribe.
- Changelog a nivel de afirmación: qué decía, qué dice y por qué.
- Política pública de correcciones en `/correcciones`.
