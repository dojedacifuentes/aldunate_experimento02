# METODOLOGIA_IA_DERECHO_V2.1

**Enmienda de la V2.0, que se conserva íntegra y sigue publicándose.**

| | |
|---|---|
| Identificador | `METODOLOGIA_IA_DERECHO_V2.1` |
| Antecedente | `METODOLOGIA_IA_DERECHO_V2.0` · kit canónico v1.0.0, vigente |
| Fecha | 4 de septiembre de 2026 |
| Informe que la estrena | Informe 01, versión 0.7.0 |
| Alcance del cambio | Aditivo. Ningún registro se recodifica, ningún vocabulario anterior se retira |

---

## 0 · Qué cambia y qué no

Cambia el **instrumento comparativo principal** y se añade **un campo** al
registro de iniciativas.

No cambian la cohorte, la fecha de corte, las trece rutas del protocolo, la
escalera de cero a cuatro peldaños, las ocho dimensiones, el vocabulario de
atribución, la jerarquía de fuentes, los estados editoriales ni las reglas de
verificación. La matriz de la 2.0 se sigue publicando, ahora en anexo.

Un cambio de método sobre datos que no cambian obliga a preguntar si las
conclusiones se movieron por evidencia nueva o por la nueva forma de medir. El
apartado M-7 responde esa pregunta.

---

## M-1 · Problema detectado en la V2.0

La 2.0 comparaba **dimensiones**: ocho ámbitos académicos donde una iniciativa
puede ocurrir —pregrado, formación continua, investigación, vinculación, uso
institucional, gobernanza, recursos y capacidades, continuidad y resultados—. Su
publicación en el Informe 01 v0.6.0 dejó a la vista tres defectos.

### M-1.1 · Dos de las ocho dimensiones no son ámbitos, sino atributos

«Recursos y capacidades» y «Continuidad, cobertura y resultados» describen
propiedades que cualquier iniciativa puede tener, no lugares donde una iniciativa
ocurra. Como el registro obliga a declarar una `primary_dimension` y sólo una,
ninguna iniciativa cae nunca ahí.

El caso que lo demuestra está dentro del propio corpus: el diplomado con dos
cohortes graduadas se clasifica en «formación continua», y su continuidad —que es
exactamente el dato que interesa— queda invisible. Lo mismo ocurre con la única
cifra de cobertura docente del corpus, cerca del 80 % del profesorado de Derecho
de una Facultad, clasificada bajo «uso institucional de IA».

**Consecuencia.** La doble columna vacía que la v0.6.0 presentó como hallazgo
—«dos de las ocho dimensiones están vacías en las once instituciones»— es en
parte un artefacto del modelo. El corpus **sí** contiene evidencia de continuidad
y de cobertura; la matriz no podía mostrarla.

### M-1.2 · La celda mezclaba cuánto se investigó con cuánto se hace

La intensidad de una celda codificaba el número de evidencias localizadas. Como
la cobertura de investigación es 3,7 veces mayor en el piloto de tres, una fila
más poblada indicaba dónde se había buscado más y se leía como una universidad
que hace más. La v0.6.0 lo advertía con un aviso sobre la tabla.

**Un aviso no corrige una lectura visual.**

### M-1.3 · No permitía comparar mecanismos

Un diplomado, una guía ética aprobada por un consejo de Facultad y un seminario
de una tarde contaban como una iniciativa cada uno. Sumarlos produce un recuento
sin significado institucional, y la pregunta que se hace un lector con
responsabilidad de gestión no es cuántas iniciativas tiene cada Facultad sino qué
instrumentos ha puesto en pie.

---

## M-2 · Modificación primera: el eje de mecanismo

Se añade al registro de iniciativas el campo **`mechanism_type`**, de vocabulario
cerrado y obligatorio.

| Valor | Comprende |
|---|---|
| `UNIDAD` | Centro, programa, departamento, dirección, laboratorio o núcleo |
| `NORMA` | Política, guía, lineamiento, decálogo o regla de integridad académica |
| `PROGRAMA_FORMATIVO` | Diplomado, diploma, minor, curso, taller o capacitación |
| `ASIGNATURA` | Actividad dentro de una asignatura o línea declarada de la malla |
| `HERRAMIENTA` | Sistema, asistente, plataforma o licencia puesta a disposición |
| `PROYECTO` | Investigación, I+D o adjudicación de fondo concursable |
| `ACTIVIDAD` | Seminario, workshop o jornada de una sola ocurrencia |
| `CONVENIO` | Acuerdo o alianza con un tercero |
| `PUBLICACION` | Revista, número monográfico o línea editorial |

**El eje es ortogonal a la dimensión.** La dimensión dice en qué ámbito académico
ocurre algo; el mecanismo, con qué instrumento se hace.

**No aporta evidencia nueva.** La clasificación reordena información que ya
estaba verificada en los campos `name`, `responsible_unit` y `products` de cada
registro. Por eso no reabre la verificación de ninguna fuente y no altera ningún
`workflow_status`.

El compilador rechaza un valor fuera del vocabulario y no escribe nada: sin esa
guarda, una errata crea una categoría nueva y la matriz deja de contarla en
silencio.

---

## M-3 · Modificación segunda: las diez capacidades

Se define un eje derivado de **capacidades institucionales**. Ninguna se registra
a mano: todas se calculan desde iniciativas, atribución, escalón, mecanismo,
cobertura declarada y rutas del protocolo.

| # | Capacidad | Pregunta que responde | Regla | Escalón mínimo | Rutas que la acreditan |
|---|---|---|---|---|---|
| 1 | Unidad especializada | ¿Existe una estructura dedicada dentro de la Facultad? | `mechanism = UNIDAD` | 3 | `centros-laboratorios` |
| 2 | Norma propia | ¿La Facultad dictó reglas sobre uso de IA? | `mechanism = NORMA` | 3 | `politicas-ia`, `integridad-evaluacion` |
| 3 | Presencia en pregrado | ¿La IA aparece dentro de la enseñanza de pregrado? | `dimension = pregrado` | 2 | `malla-curricular`, `programas-syllabus` |
| 4 | Formación estructurada | ¿Hay diplomados, minors, cursos o capacitaciones? | `mechanism = PROGRAMA_FORMATIVO` | 2 | `postgrado-formacion-continua` |
| 5 | Herramienta desplegada | ¿Hay un sistema de IA a disposición? | `mechanism = HERRAMIENTA` | 2 | `herramientas-licencias-convenios` |
| 6 | Adopción en la enseñanza | ¿Consta que la IA se usa dentro de la enseñanza del Derecho? | `dimension = uso-institucional` | 2 | `herramientas-licencias-convenios`, `integridad-evaluacion` |
| 7 | Alcance declarado | ¿El registro declara a quién alcanza? | `coverage` distinto de «No publicada» y «No aplica» | 2 | — |
| 8 | Investigación | ¿Hay proyectos o publicaciones sobre IA? | `mechanism ∈ {PROYECTO, PUBLICACION}` | 2 | `proyectos-fondos`, `repositorios-publicaciones` |
| 9 | Transferencia | ¿Hay convenios o servicios hacia fuera? | `mechanism = CONVENIO` o `dimension = vinculacion` | 2 | `vinculacion-transferencia` |
| 10 | Evaluación de efecto | ¿Se midió si algo mejoró el aprendizaje jurídico? | `ladder = 4` | 2 | `repositorios-publicaciones` |

Una misma iniciativa puede acreditar más de una capacidad, y eso es correcto: una
herramienta usada en la enseñanza de pregrado responde a la vez la pregunta 3, la
5 y la 6. Lo que importa es que cada fila haga una pregunta distinta.

### Nota sobre la etiqueta de la capacidad 3

Se rotula **presencia en pregrado** y no «integración curricular» porque la regla
mide presencia y no currículo formal. Una fila rotulada «integración curricular»
contradiría la conclusión C-4, que declara que ninguna de las once acredita una
línea obligatoria con syllabus, semestre, créditos y matrícula. Las dos cosas son
verdad y el rótulo debe permitir que lo sean.

---

## M-4 · Modificación tercera: los cinco estados, y la regla de la ausencia

| Estado | Significado |
|---|---|
| `EN_OPERACION` | La Facultad, un centro suyo o un equipo académico sostiene un mecanismo en el escalón mínimo de esa capacidad o por encima |
| `INCIPIENTE` | Hay mecanismo de la Facultad, pero en el primer peldaño: actividad aislada, piloto o anuncio |
| `SOLO_ENTORNO` | Lo que consta pertenece a la universidad, a una persona o al centro de alumnos, no a la Facultad (DEC-105) |
| `NO_LOCALIZADA` | Se recorrieron las rutas que la habrían encontrado y no se halló evidencia pública |
| `NO_CONCLUYENTE` | La ruta del protocolo que la acreditaría no se recorrió en esa institución |

Cuentan como capacidad **de la Facultad** las atribuciones `FACULTAD_DERECHO`,
`CENTRO_PROGRAMA` y `EQUIPO`. Quedan fuera `INSTITUCIONAL_UNIVERSIDAD`,
`INDIVIDUAL`, `ESTUDIANTIL` y `EXTERNA_CON_PARTICIPACION`.

### La regla que hace el trabajo

> **Una ausencia sólo informa si se recorrió la ruta del protocolo que la habría
> encontrado.**

Es la aportación central de esta enmienda y responde directamente a ISSUE-018. La
desigualdad de cobertura deja de ser una advertencia al pie del documento y pasa
a estar dentro de cada celda, que es donde el lector la necesita. Al corte, 47 de
las 110 celdas son `NO_CONCLUYENTE`.

Una consecuencia incómoda y deliberada: la afirmación más fuerte del informe —que
ninguna iniciativa acredita evaluación de efecto— queda `NO_CONCLUYENTE` en nueve
de las once instituciones, porque la ruta `repositorios-publicaciones` sólo se
recorrió en dos. El hecho sobre el corpus se mantiene, con su razonamiento
propio; la afirmación sobre cada Facultad se declara abierta.

### Por qué la verificación no entra en el estado

Un primer diseño de esta escala distinguía «acreditada» —con fuente contrastada—
de «declarada» —sin contrastar—. El efecto medido fue premiar a la institución
con mayor proporción de fuentes verificadas, que es la PUCV con el 86 %, por una
propiedad del trabajo de campo y no de la Facultad. Es el defecto M-1.2 con otra
ropa.

La verificación viaja por tanto **fuera del estado**, en el campo booleano
`contrastada` de cada celda, y se dibuja como una marca que nunca modifica el
color. Es la única forma de que la matriz responda una sola pregunta.

---

## M-5 · Lo que la enmienda sigue prohibiendo

- **No hay total por fila ni por columna.** Sumar capacidades produce un número
  por institución, y ese número ordena el trabajo de campo tanto como el
  institucional: cinco capacidades observadas con dos rutas recorridas y cinco
  con once no son la misma cantidad de información. DEC-102 sigue vigente.
- **No hay promedio de escalón por universidad.** DEC-109 sigue vigente.
- **No se ordena por nada que no sea el alfabeto.**
- **La ausencia de evidencia pública no es evidencia de inexistencia**, y con la
  distinción entre `NO_LOCALIZADA` y `NO_CONCLUYENTE` esa regla queda por primera
  vez expresada en el propio instrumento y no sólo en el texto que lo acompaña.

---

## M-6 · Variables afectadas y compatibilidad

| Artefacto | Efecto |
|---|---|
| `iniciativas.csv` | Columna nueva `mechanism_type`, tras `primary_dimension`. Ninguna otra columna cambia |
| Resto del dataset | Sin cambios |
| Escalera 0–4 | Sin cambios; la capa de capacidades la consume, no la sustituye |
| Ocho dimensiones | Sin cambios; su matriz se publica en el anexo D del informe |
| Cobertura | Sin cambios; `routes_missing` pasa a tener uso normativo y no sólo descriptivo |
| Afirmaciones | Sin cambios en el dataset. Dos se matizan en la prosa (ver M-7) |
| Kit canónico v1.0.0 | Vigente. Esta enmienda lo amplía y no lo reemplaza |

**Compatibilidad hacia atrás.** Un consumidor del dataset que ignore
`mechanism_type` obtiene exactamente los mismos resultados que con la 2.0. La
capa de capacidades es un derivado y no un dato: puede recalcularse, discutirse o
descartarse sin tocar un solo registro.

---

## M-7 · Análisis de sensibilidad

La pregunta obligatoria: **¿las conclusiones cambian porque hay evidencia nueva o
porque cambió la forma de medir?**

No hay evidencia nueva. El corpus es el de la v0.6.0: las mismas 74 fuentes, las
mismas 53 iniciativas, las mismas 75 evidencias, las mismas 38 fuentes
contrastadas. Sólo cambió el instrumento.

De las siete conclusiones publicadas en la v0.6.0:

| Conclusión | Efecto del cambio de método |
|---|---|
| C-1 · La institucionalización avanza por denominación, no por constitución | Sin cambios. La capa de capacidades la refuerza: cinco unidades en operación frente a una norma propia |
| C-2 · Una sola Facultad dictó una norma propia con consecuencia jurídica | Sin cambios |
| C-3 · La continuidad documentada existe en un solo eje y en una sola institución | Sin cambios en su enunciado. La 2.1 permite además ver que la continuidad estaba en el corpus y la matriz de la 2.0 no podía mostrarla |
| C-4 · No hay línea curricular obligatoria documentada en ninguna de las once | **Se matiza.** Queda `NO_CONCLUYENTE` en 6 de las 11: las rutas de malla y syllabus no se recorrieron ahí |
| C-5 · Ninguna iniciativa acredita evaluación de efecto | **Se matiza.** Firme sobre el corpus; abierta en 9 de las 11 como afirmación institucional |
| C-6 · La cobertura desigual impide toda comparación ordinal | Sin cambios, y ahora con demostración empírica: la institución menos investigada acredita tantas capacidades en operación como la más investigada |
| C-7 · El fenómeno está en tránsito de la actividad a la estructura, sin llegar al resultado | Sin cambios |

**Cinco conclusiones se sostienen sin variación y dos se matizan. Las dos se
vuelven más restrictivas, no más fuertes.** Ninguna conclusión ganó fuerza por
efecto del cambio de método, y ésa era la comprobación que importaba: una
metodología que se revisa y produce conclusiones más cómodas es una metodología
ajustada al resultado.

---

## M-8 · Limitaciones nuevas que introduce esta versión

1. **La clasificación de mecanismo es un juicio, aunque sea auditable.** Que el
   curso de la Academia Judicial de la UAI se registre como `PROGRAMA_FORMATIVO`
   y no como `UNIDAD` —pese a que su unidad responsable es un laboratorio de la
   Facultad— es defendible y discutible. La consecuencia concreta: la UAI aparece
   como `NO_CONCLUYENTE` en «unidad especializada», porque la ruta
   `centros-laboratorios` tampoco se recorrió allí. El registro nombra el
   laboratorio; el informe no puede acreditarlo como capacidad sin haberlo
   buscado.
2. **La regla de las rutas hereda la calidad del registro de cobertura.** Si
   `routes_missing` está mal declarada en una institución, la celda dirá «no
   concluyente» cuando debía decir «no localizada», o al revés. Ese registro
   proviene de la investigación previa y no ha sido reverificado.
3. **Diez capacidades no agotan el fenómeno.** Faltan al menos recursos
   presupuestarios, dotación de personal y gobernanza colegiada, que no se
   incluyeron porque el corpus no contiene ni un registro que permita derivarlas.
   Añadir filas que salieran todas vacías habría sido decorar una ausencia.
4. **La matriz sigue midiendo evidencia pública.** Una Facultad que hiciera todo
   esto sin publicarlo aparecería vacía, y ninguna de las dos formas de ausencia
   lo distinguiría.

---

## M-9 · Implementación

| Qué | Dónde |
|---|---|
| Vocabulario de mecanismos y guarda del compilador | `scripts/informe-01/06-compilar-a-typescript.mjs` |
| Tipos | `src/types/informe01.ts` |
| Derivación de capacidades y estados | `src/lib/informe01-capacidades.ts` |
| Cifras derivadas para la prosa | `src/lib/informe01.ts` · `cifrasInforme01()` |
| Figuras | `src/lib/informe01-graficos.ts` · `informe01-svg.ts` |
| Pruebas | `src/data/informe01.test.ts` |

Las reglas son funciones puras del dataset. Cambiar un CSV cambia la matriz sin
que nadie edite una figura, y ninguna cifra del informe se escribe a mano.
