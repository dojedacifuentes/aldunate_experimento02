# DECISIONS — Informe 01

Decisiones metodológicas cerradas. **Otra sesión no debe volver a resolverlas.**
Si una decisión se revisa, no se edita: se agrega una entrada nueva que la
sustituye y la anterior queda marcada como `SUPERADA`.

Las decisiones de alcance del proyecto entero viven en `docs/DECISIONS.md`.
Aquí sólo las propias del Informe 01.

---

## DEC-101 — Cohorte cerrada de once instituciones

**Fecha:** 03-09-2026
**Decisión:** la cohorte longitudinal se mantiene cerrada en las once
universidades de `COHORTE_IA_DERECHO_CHILE_11_V1`.
**Motivo:** el antecedente pedía ampliar el universo y el kit canónico ordena
mantenerlo cerrado. Se resuelve a favor del kit: es la única forma de que las
comparaciones entre años signifiquen algo. El piloto de tres —PUCV, PUC y
Universidad de Chile— se conserva **como profundidad, no como universo**.
**Consecuencia:** once fichas en la matriz, tres con evidencia densa, y esa
asimetría se declara en vez de disimularse.
**No hacer:** no introducir instituciones fuera de la cohorte en la comparación
principal. Si aparecen, se registran aparte como señales fuera de cohorte.

---

## DEC-102 — Ninguna comparación ni ranking nacional

**Fecha:** 03-09-2026
**Decisión:** el informe **no publica** tabla de posiciones, ranking, puntaje
agregado por universidad ni conclusión sobre tendencias nacionales.
**Motivo:** la cobertura es desigual por diseño. Tras la ronda 3 el piloto de
tres reúne 42 fuentes y las otras ocho, 30. Esa diferencia mide esfuerzo de
investigación, no actividad institucional. Publicar una comparación sobre esta
base produciría un ranking del trabajo de campo disfrazado de ranking de
universidades. La metodología declarada del propio informe ya lo prohíbe.
**Consecuencia:** la matriz comparativa muestra **evidencia pública localizada**
y su cobertura, nunca un puntaje de madurez por universidad. La escalera de
institucionalización se aplica **a la iniciativa**, nunca a la universidad
entera, y no se agrega en un promedio.
**No hacer:** no sumar niveles de iniciativa para producir un número por
universidad. No ordenar universidades por cantidad de evidencia.

---

## DEC-103 — Las escalas histórica y actual no se comparan aritméticamente

**Fecha:** 03-09-2026
**Decisión:** no se arrastra ninguna puntuación del informe antecedente.
**Motivo:** cuatro totales del antecedente no cuadran con sus propias
puntuaciones (UAI 7,5 vs. 6,2; UNAB 7,75 vs. 8,75; U. Central 8,0 vs. 8,5; UDP
I+D 1,0 vs. 0,75), y el documento mezclaba dos lógicas de puntuación sin regla
de deduplicación. Sumar o restar décimas a un total que no cuadra con sus
sumandos propaga el error con apariencia de precisión.
**Consecuencia:** la tabla se reconstruye desde la matriz de evidencias o no
existe. Se conservan por separado `puntaje_publicado_2025`,
`puntaje_2025_recalculado` y `madurez_2026_metodologia_2`.
**No hacer:** no publicar un slope chart 2025 → 2026. No corregir en silencio el
archivo histórico.

---

## DEC-104 — Un cero heredado no se arrastra

**Fecha:** 03-09-2026
**Decisión:** la ausencia de evidencia pública en una ronda anterior no es
evidencia de inexistencia, y menos cuando la ronda anterior no buscó.
**Motivo:** los dos ceros de «uso interno de IA» del antecedente —PUCV y
Universidad Autónoma— quedaron derribados por evidencia de 2026.
**Consecuencia:** la expresión correcta es «no se localizó evidencia pública
verificable», nunca «la actividad no existe». No puede asignarse nivel 0 hasta
completar el protocolo de búsqueda.

---

## DEC-105 — Universidad no es Facultad

**Fecha:** 03-09-2026
**Decisión:** toda evidencia se atribuye a la unidad que la fuente identifica.
Una capacidad de la universidad no se convierte en capacidad de Derecho.
**Motivo:** es el modo más frecuente de inflar un mapa sin inventar ni una
fuente. Aparece al menos nueve veces en el corpus.
**Consecuencia:** `institutional_level` es obligatorio en toda iniciativa, y la
interfaz lo muestra. Casos registrados: AyudantIA y MIAsistentes, Gemini y el
decálogo PUCV, los lineamientos y el curso de la Universidad de Chile, IDEA
UCEN, DOMus AI y `[genIA]`.

---

## DEC-106 — El corpus pasa de 72 a 74 fuentes

**Fecha:** 03-09-2026
**Decisión:** el registro canónico contiene **74** fuentes únicas, no 72.
**Motivo:** la re-extracción mecánica de URL sobre los cinco documentos de
investigación profunda arroja 74 direcciones únicas tras normalizar host y barra
final, excluidas tres del propio sitio del laboratorio. Las dos que faltaban
—`src-ucentral-004` (IDEA UCEN) y `src-unab-004` (Diplomado en Derecho,
Innovación y Tecnología)— aparecen citadas en la tabla-resumen de `intento-2b`
pero nunca recibieron registro `PROP-*` propio, de modo que quedaron fuera del
inventario. Es el mismo defecto que el proyecto detectó en el documento
antecedente, ahora encontrado en su propio corpus.
**Consecuencia:** el contador del sitio dice 74 y se calcula desde el CSV, no a
mano. La cifra 72 se conserva en el changelog de la v0.4.0 y no se reescribe.
**No hacer:** no corregir hacia atrás la v0.4.0. Se agrega una fe de erratas.

---

## DEC-107 — Sin línea base congelada de 2025, la trayectoria casi siempre es DESCONOCIDA

**Fecha:** 03-09-2026
**Decisión:** `temporal_change` sólo vale `CONTINUA` cuando dos fuentes de
fechas distintas prueban la misma iniciativa. En el resto es `DESCONOCIDA`.
**Motivo:** el documento tratado como línea base de 2025 contiene actividades de
abril, junio, agosto y septiembre de 2026. Una comparación mecánica mezclaría
cambios reales con incorporaciones retrospectivas.
**Consecuencia:** ninguna afirmación de la forma «X aumentó desde 2025» es
publicable mientras no exista un corte congelado de verdad.

---

## DEC-108 — La verificación sustantiva no se delega y no está hecha

**Fecha:** 03-09-2026
**Decisión:** ninguna fuente recibe `last_verified` ni pasa a `ACEPTADO` en esta
versión. El campo `verified_by` queda vacío a propósito.
**Motivo:** las 74 URL fueron abiertas por los modelos que produjeron los
documentos, no por quien firma. Que una URL responda no prueba que diga lo que
se le atribuye. En el Informe 02 fue la verificación manual la que descubrió que
el metaanálisis más citado del campo estaba retractado.
**Consecuencia:** el informe se publica como **mapeo de evidencia**, no como
informe de resultados. Los estados editoriales llegan hasta `FUENTE_ABIERTA`.
**No hacer:** no rellenar `last_verified` con la fecha de consulta declarada por
otro modelo. Una matriz con relleno es peor que una vacía.

---

## DEC-109 — La escalera se aplica a la iniciativa, no a la universidad

**Fecha:** 03-09-2026
**Decisión:** el nivel 0–4 del kit (§11) se asigna a cada iniciativa y se
publica así. No se agrega, promedia ni suma por institución.
**Motivo:** una universidad puede exhibir muchas actividades, baja
institucionalización y evidencia débil, y otra pocas iniciativas pero
formalizadas. El informe debe conservar esa diferencia, y un promedio la borra.
**Consecuencia:** la visualización de la escalera distribuye **iniciativas**, no
universidades.

---

## DEC-110 — La ausencia curricular se registra como afirmación de cohorte

**Fecha:** 03-09-2026
**Decisión:** la falta de prueba pública de una línea curricular obligatoria en
IA no se registra como una iniciativa fallida de la PUCV, sino como una
afirmación que alcanza a las once.
**Motivo:** registrar la ausencia sólo donde se buscó con más detalle produce
exactamente el sesgo que DEC-102 intenta evitar. Ninguna institución de la
cohorte tiene syllabus 2026 públicos con obligatoriedad, semestre, créditos y
matrícula.
**Consecuencia:** la afirmación `clm-cohorte-006` se apoya en las cuatro
evidencias curriculares que sí existen —UDD, UDP y Universidad Autónoma— y
alcanza a las once. `src-pucv-012` queda registrada como **fuente de contexto**,
sin evidencia asociada, igual que las dos bases de universo nacional: consta en
el registro, se lee en la ficha de la PUCV con su advertencia, y no sostiene
ninguna afirmación por sí sola.

**No hacer:** no crear una iniciativa de nivel 0 para la PUCV mientras no se
cree la equivalente para las diez restantes. Registrar la ausencia sólo donde se
buscó con más detalle es el sesgo que DEC-102 existe para evitar.

---

## DEC-111 — La verificación sustantiva se ejecuta, y DEC-108 se enmienda

**Fecha:** 04-09-2026
**Decisión:** DEC-108 —«la verificación sustantiva no se delega y no está
hecha»— queda enmendada. La verificación se ejecuta abriendo cada fuente y
contrastando siete campos contra el registro: existencia, título literal, fecha
declarada, unidad responsable, anuncio frente a ejecución, cifras de población o
cobertura, y respaldo de la afirmación. El resultado se escribe como
`CONTRASTADO`, con `verified_by` y `last_verified`.

**Motivo:** DEC-108 era más restrictiva que el protocolo canónico que dice
aplicar. El kit §22 define `CONTRASTADO` como «una segunda revisión examinó
atribución, alcance y contraevidencia», y §23 asigna esa función explícitamente
a un auditor metodológico. Lo que el kit reserva a la decisión humana no es
contrastar: es **aceptar**. `ACEPTADO` sigue exigiendo firma humana, y ninguna
conclusión se publica sin ella.

**Consecuencia:** 38 de las 74 fuentes pasan a `CONTRASTADO`. Las guardas de
`06-compilar-a-typescript.mjs` dejan de prohibir la verificación y pasan a
exigir su coherencia: una fuente no puede declarar quién la verificó sin estar
contrastada, ni decirse contrastada sin decir quién; fecha y firma viajan
juntas; y una evidencia no puede estar verificada si su fuente no lo está. La
prueba que exigía cero verificaciones se reescribe con el mismo criterio y no se
borra.

**No hacer:** no marcar `ACEPTADO` ningún registro. No presentar el documento
como informe de resultados: 36 fuentes siguen sin contrastar y el porcentaje
debe ir escrito en la portada.

---

## DEC-112 — Los cinco constructores en Python quedan congelados

**Fecha:** 04-09-2026
**Decisión:** `scripts/informe-01/01` a `05` dejan de ser ejecutables como
generadores y quedan como registro auditable de la construcción inicial del
dataset. Los CSV canónicos son la única fuente de verdad, y se editan
directamente.

**Motivo:** el README de los scripts ofrecía dos caminos al editar un CSV a
mano: trasladar el cambio al script, o dejar de usarlo y anotarlo aquí. El
primero no es verificable en el equipo del autor, donde no hay intérprete de
Python. Mantener un generador que nadie puede ejecutar ni comprobar es
exactamente la segunda fuente de verdad que la cadena de informes existe para
evitar.

**Consecuencia:** la integridad referencial la comprueba
`06-compilar-a-typescript.mjs`, que sí se ejecuta, y las 116 pruebas de
`informe01.test.ts`. Cada script lleva un aviso en su cabecera.

**No hacer:** no ejecutar `python3 scripts/informe-01/0[1-5]-*.py`. Sobrescribiría
la verificación del 04-09-2026 con el estado del 03-09-2026.

---

## DEC-113 — El conflicto de interés se declara en la metodología

**Fecha:** 04-09-2026
**Decisión:** el informe declara expresamente que el destinatario del documento
y su autor figuran, en una fuente del propio corpus, como conductores de una de
las iniciativas evaluadas.

**Motivo:** `src-pucv-003` identifica a los líderes del Programa DIAT como
«Johann Benfeld, Eduardo Aldunate y Diego Ojeda». Un informe que compara la
institucionalización de once Facultades y dedica una sección a la PUCV no puede
omitir que quien lo escribe y quien lo recibe participan de la actividad
evaluada. La omisión no protege al documento: lo hace refutable de un golpe.

**Consecuencia:** la sección de metodología incorpora una declaración de
intereses, y la sección PUCV se somete a la doble revisión de rigor —¿demasiado
dura?, ¿demasiado indulgente?— dejando constancia de ambas.

**No hacer:** no suprimir del corpus las fuentes que involucran al autor. Se
declaran, no se esconden.

---

## DEC-114 — El informe interpreta, y la prudencia no es excusa para no concluir

**Fecha:** 04-09-2026
**Decisión:** el Informe 01 deja de limitarse a mapear evidencia. Distingue cuatro
niveles y publica los cuatro: **hallazgo**, **inferencia**, **limitación** y
**conclusión provisional**.

**Motivo:** la v0.5.0 era metodológicamente sólida y editorialmente muda. Un
expediente de evidencia que no dice qué significa su propia evidencia traslada
al lector un trabajo que le corresponde a quien investiga, y en la práctica se
lee como si no hubiera nada que concluir. La cautela metodológica impide afirmar
más de lo que sostiene la evidencia; no impide afirmar lo que sí sostiene.

**Consecuencia:** cada conclusión declara su clase —`HECHO` o `INFERENCIA`— y
cita las afirmaciones del dataset que la sostienen. Una prueba comprueba que las
citas existan y que ninguna conclusión afirme inexistencia donde sólo hay
ausencia de evidencia.

**No hacer:** no publicar una conclusión sin apoyo declarado. No degradar todo a
«pendiente» para evitar comprometerse: eso también es una decisión editorial, y
peor fundada.

---

## DEC-115 — Se comparan capacidades, no volumen de fuentes

**Fecha:** 04-09-2026
**Decisión:** la visualización principal de la comparación institucional debe
distinguir **capacidades** —estructura especializada, gobernanza, integración
curricular, formación recurrente, adopción docente, herramientas, cobertura,
recursos, continuidad y evaluación—, no cantidad de fuentes ni de iniciativas.

**Motivo:** el número de fuentes de una institución mide dónde se buscó. Usarlo
como aproximación a su desarrollo institucional convierte el sesgo de cobertura
en un hallazgo, y produce exactamente el ranking que DEC-102 prohíbe, sólo que
disfrazado de tabla descriptiva.

**Consecuencia:** cualquier comparador nuevo debe poder responder «¿qué capacidad
demuestra esta institución?» y no «¿cuántas fuentes encontramos de ella?».

**No hacer:** no sumar estas variables en un puntaje agregado. La metodología no
lo justifica y DEC-109 lo prohíbe para la escalera.

---

## DEC-116 — La sección PUCV compara mecanismos, no adjetivos

**Fecha:** 04-09-2026
**Decisión:** la sección PUCV se construye contrastando **mecanismos observables
en otras Facultades** con lo que la evidencia pública demuestra en la PUCV. La
incomodidad, si aparece, debe surgir de la comparación y no de la calificación.

**Motivo:** el propósito no es favorecer ni perjudicar a la institución, sino
hacer discutible una pregunta: si una base de iniciativas relevante y sostenida
se ha convertido en capacidad transversal, formalizada y evaluable. Un adjetivo
no es discutible; un mecanismo que otra Facultad publica y ésta no, sí.

**Consecuencia:** cada brecha declara su comparador concreto y si alcanza también
a las otras diez instituciones. Cada recomendación declara problema, evidencia,
referente, acción e indicador.

---

## DEC-117 — La fuerza visual del antecedente, sin su metodología

**Fecha:** 04-09-2026
**Decisión:** la presentación puede rediseñarse libremente —nuevas
visualizaciones, reorganización de secciones, tablas convertidas en gráficos,
detalle técnico a anexos— siempre que no cambien los datos, no se fabriquen
rankings, no se distorsionen escalas, se preserve la accesibilidad y la
impresión, y todo derive de los datasets.

**Motivo:** el informe antecedente se leía rápido y comunicaba; su método era
débil. La v0.5.0 invirtió ambas cosas. Las dos propiedades son independientes y
no hay razón para elegir.

**No hacer:** no recuperar puntajes agregados ni tablas de posiciones para ganar
legibilidad. La claridad se consigue con jerarquía editorial y mejores gráficos,
no bajando el estándar metodológico.

---

## DEC-118 — Metodología 2.1: una capa de capacidades ortogonal a las dimensiones

**Fecha:** 04-09-2026
**Decisión:** se enmienda `METODOLOGIA_IA_DERECHO_V2.0` con la versión **2.1**,
que añade dos ejes —el **mecanismo** institucional de cada iniciativa y diez
**capacidades** derivadas— sin recodificar un solo registro. La 2.0 se conserva
íntegra, su matriz se publica en el anexo D del informe y ninguno de sus
vocabularios se retira.

**Motivo:** la 2.0 comparaba ámbitos académicos, y dos de sus ocho dimensiones
—«recursos y capacidades» y «continuidad, cobertura y resultados»— no son ámbitos
sino atributos. Como el registro obliga a declarar una `primary_dimension` y sólo
una, ninguna iniciativa cae nunca ahí: el diplomado con dos cohortes graduadas se
clasifica en «formación continua» y su continuidad, que es el dato, queda
invisible. **La doble columna vacía que la v0.6.0 publicó como hallazgo es en
parte un artefacto del modelo.**

**Consecuencia:** el comparador principal pasa a responder «¿qué capacidad
demuestra esta Facultad?» en lugar de «¿cuánta evidencia encontramos de ella?».
El eje de mecanismo se registra en `iniciativas.csv` como `mechanism_type`, con
vocabulario cerrado que el compilador verifica.

**No hacer:** no retirar la matriz de dimensiones ni sus vocabularios. Un cambio
de instrumento no autoriza a hacer desaparecer el instrumento con el que se
publicó la versión anterior: impediría comprobar qué cambió.

**Documento:** `content/reports/01_ia_escuelas_derecho_chile/canonical/metodologia-v2.1.md`.

---

## DEC-119 — Una ausencia sólo informa si se recorrió la ruta que la habría encontrado

**Fecha:** 04-09-2026
**Decisión:** la matriz de capacidades distingue dos clases de ausencia.
`NO_LOCALIZADA` significa que se recorrieron las rutas del protocolo que
acreditarían esa capacidad y no se halló evidencia. `NO_CONCLUYENTE` significa
que esas rutas no se recorrieron en esa institución. Cada capacidad declara sus
rutas, y la clasificación se calcula desde `routes_missing`.

**Motivo:** es la respuesta operativa a ISSUE-018. Hasta aquí, la desigualdad de
cobertura se advertía con un aviso encima de la tabla, y un aviso no corrige una
lectura visual: una celda vacía seguía leyéndose como «esta Facultad no lo hace»
tanto si se había buscado como si no.

**Consecuencia:** 47 de las 110 celdas son `NO_CONCLUYENTE`, y el instrumento
declara el límite del trabajo de campo en lugar de disimularlo. La consecuencia
más incómoda es deliberada: la afirmación más fuerte del informe —que ninguna
iniciativa acredita evaluación de efecto— queda `NO_CONCLUYENTE` en nueve de las
once, porque la ruta `repositorios-publicaciones` sólo se recorrió en dos. El
hecho sobre el corpus se mantiene con su razonamiento propio; la afirmación sobre
cada Facultad se declara abierta.

**No hacer:** no usar una sola marca de ausencia. Una cruz que signifique las dos
cosas a la vez convierte la desigualdad de cobertura en un juicio institucional.

---

## DEC-120 — La verificación no entra en el estado de una capacidad

**Fecha:** 04-09-2026
**Decisión:** el estado de una celda responde una sola pregunta —qué capacidad
demuestra la Facultad—. Si nosotros hemos contrastado o no las fuentes que la
sostienen viaja aparte, en el campo `contrastada`, y se dibuja como una marca que
**nunca** modifica el color de la celda.

**Motivo:** el primer diseño de la escala distinguía «acreditada» —con fuente
contrastada— de «declarada» —sin contrastar—. El efecto medido fue premiar a la
PUCV, con el 86 % de sus fuentes contrastadas, por una propiedad del trabajo de
campo. Es el mismo defecto de la matriz de la v0.6.0 con otra ropa, y se detectó
comparando la matriz resultante contra el reparto de ISSUE-018.

**Consecuencia:** una prueba lo vigila. Comprueba que dentro del estado
`EN_OPERACION` aparezcan celdas contrastadas y celdas sin contrastar: si la
verificación volviera a decidir el estado, esa coexistencia sería imposible.

---

## DEC-121 — El cruce entre cobertura y capacidad se publica, con tres guardas

**Fecha:** 04-09-2026
**Decisión:** se publica una figura que cruza rutas del protocolo recorridas
—horizontal— contra capacidades en operación —vertical—, pese a que el eje
vertical es un recuento por institución.

**Motivo:** DEC-102 prohíbe la comparación ordinal, y contar capacidades se le
parece lo suficiente como para exigir justificación. La justificación es que esta
figura existe precisamente para **demostrar que las dos variables no coinciden**,
y demostrarlo exige cruzarlas. El resultado es una prueba empírica dentro del
propio corpus: la institución menos investigada de las once acredita tantas
capacidades en operación como la más investigada.

**Las tres guardas, y las tres son condición de publicación:**

1. no se ordena por el eje vertical y no se numeran posiciones;
2. cada punto muestra un halo proporcional a sus celdas no concluyentes, de modo
   que un valor bajo con halo grande se lea «no lo sabemos» y no «hace poco»;
3. el pie declara que el eje vertical es un recuento de preguntas contestadas
   afirmativamente y no un puntaje, y que está acotado por arriba por lo buscado.

**No hacer:** no reutilizar ese recuento fuera de esta figura, ni ordenar ninguna
tabla por él.

---

## DEC-122 — Los hallazgos van antes que el método, y las fichas bajan a anexo

**Fecha:** 04-09-2026
**Decisión:** el documento abre por resumen ejecutivo y hallazgos principales.
Introducción, objetivos y metodología vienen después, y las once fichas
institucionales, la matriz de dimensiones, las afirmaciones, las lagunas, la
auditoría de la línea base y el registro de fuentes pasan a anexos.

**Motivo:** el orden académico exige que el método preceda a los datos; no exige
esconder los resultados detrás del método. En la v0.6.0 el destinatario recorría
once perfiles, cuatro visualizaciones y catorce afirmaciones antes de encontrar
una razón para seguir leyendo.

**Consecuencia:** cada hallazgo declara su dato, su lectura y su límite, y el
límite es obligatorio por tipo. Un hallazgo sin límite no compila.

**No hacer:** no eliminar el aparato. Un lector que quiere auditar y uno que
quiere entender no necesitan lo mismo en el mismo sitio, y servir a los dos en el
cuerpo no sirve a ninguno. Bajar algo a anexo no es retirarlo.

---

## DEC-123 — Un solo motor de gráficos, en funciones puras, para la web y el papel

**Fecha:** 04-09-2026
**Decisión:** las figuras se generan como cadenas de SVG por funciones puras del
dataset, en `src/lib/informe01-svg.ts` y `src/lib/informe01-graficos.ts`. Las
consumen dos huéspedes: los componentes del sitio y el exportador que produce el
HTML del que se imprime el PDF.

**Motivo:** la v0.6.0 dibujaba con tablas de HTML y `div` de color. Funcionaba en
la web y **no existía en el PDF**: el documento que se envía al destinatario no
tenía ni un gráfico, porque el exportador sólo sabía escribir párrafos, listas y
tablas. Cualquier motor que viva dentro de React repite ese problema.

**Consecuencia, y es un contrato:** ninguna figura escribe un color. Todas nombran
variables CSS que cada huésped define para su tema y para papel, y una prueba
rechaza cualquier hexadecimal que no sea la reserva de una variable. El SVG sale
además sin atributos de ancho ni de alto —con un alto automático el navegador
recortaba la matriz por abajo y se perdían cuatro de las once filas sin que nada
fallara— y cada figura lleva `role`, `title`, `desc` y una alternativa textual.

**No hacer:** no dibujar una figura dentro de un componente de React. Vivirá en
la web y desaparecerá del documento.
