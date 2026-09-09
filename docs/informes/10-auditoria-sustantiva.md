# Auditoría sustantiva del Informe 01 · sobre la v2.2.0

**Fecha:** 09-09-2026 · **Objeto:** `public/descargas/informe-01-v2.2.0/informe-01-v2.2.0.html`
· **Encargo:** `docs/ENCARGO-informe-01-v3.md`, fase 1.

Esto no es una revisión de estilo. Cada fila afirma algo comprobable sobre el
documento publicado y dice cómo se comprobó. Las que llevan **[F]** son de fondo
—cambian lo que el informe afirma— y por el §8 de `CLAUDE.md` exigen versión
nueva. Las **[f]** son de forma y podrían reponerse.

---

## 1 · Lo que la fase 1 encontró, ordenado por gravedad

### A-1 · La portada declara más confianza de la que el anexo sostiene · **[F]**

El frontis del documento afirma, en tres sitios distintos:

- portada: «setenta y cuatro fuentes verificadas una por una»
- portada: «Corpus verificado al 100 % · contraste externo cerrado»
- ficha: «Fuentes del corpus · 74 públicas únicas · **74 contrastadas (100 %)**»

El anexo de ampliación afirma, en el mismo documento:

> «La ronda de ampliación aportó 32 referencias. 10 ya estaban en el corpus […];
> las 22 restantes son nuevas […]. **El corpus pasa de 74 a 96 fuentes.**»
>
> «Las 74 fuentes del corpus original están contrastadas […]. **Estas 22 llegan
> de una ronda de ampliación documental y no han pasado por ese contraste.**»

Las dos cosas no pueden ser ciertas a la vez. Si el corpus son 96, entonces está
contrastado al 77 %, no al 100 %. El anexo es la parte honesta; la portada es la
que hay que corregir.

**Por qué importa más que un descuadre aritmético.** El lector que se queda en la
portada —que son casi todos— recibe una garantía de verificación que el propio
documento desmiente cincuenta páginas después. Y es exactamente el defecto que el
encargo prohíbe: subir una confianza declarada.

**Cómo se comprobó.** Búsqueda literal de las tres cadenas en el HTML publicado
y lectura del anexo de ampliación.

### A-2 · La mitad del comparador descansa en fuentes sin contrastar · **[F]**

De los **26 cierres** de la matriz canónica `.v2` —los que producen el orden
publicado—:

| Procedencia de la evidencia del cierre | Cierres | Puntos |
|---|---:|---:|
| Depende de fuente de Ronda 2 **sin contrastar** | **13** | **25** |
| Ruta del protocolo recorrida sin hallar nada (no hay fuente que contrastar) | 8 | 0 |
| Fuente que ya estaba en el corpus, contrastada | 5 | 3 |

Cota superior, calculada: si las 22 se cayeran todas —escenario imposible, sirve
sólo para acotar—, el promedio de pisos baja de **12,0 a 9,7**, las celdas sin
concluir suben de **5 a 18**, y **ocho de las once posiciones se mueven**.

**El detalle que ordena el resto.** De los 13 cierres expuestos sólo dos alcanzan
el estado `OPF` —operación con instrumento formal, 3 puntos, el más caro de la
rúbrica—: la norma de la U. Central y la unidad de la U. Autónoma. **Son
exactamente las dos fuentes que el propio informe declara que no pudo abrir**: la
primera devuelve error en la dirección publicada, la segunda es un PDF escaneado
sin texto seleccionable. Los seis puntos mejor pagados de la ronda están sobre
las dos únicas fuentes que nadie ha leído.

**Cómo se comprobó.** Recálculo con la rúbrica del anexo D sobre `matriz-v2.json`,
clasificando cada uno de los 26 `aplicados` por la procedencia de su `source_id`
y descontando las diez referencias que la ronda repetía y que ya constaban en el
corpus con identificador anterior.

### A-3 · Tres de las 22 direcciones publicadas no resuelven, y dos no están declaradas · **[F]**

Comprobación HTTP sobre las 22 direcciones del anexo de ampliación:

| Fuente | HTTP | Puntos que sostiene | ¿El informe lo declara? |
|---|---:|---:|---|
| `R2-UCEN-01` · Resolución 13/2025, U. Central | **404** | 3 | **Sí**, con reserva expresa |
| `R2-UC-01` · Seminario IA y Derecho, PUC de Chile | **404** | 2 | **No** |
| `R2-UDD-02` · Curso Herramientas de IA, U. del Desarrollo | **404** | 2 | **No** |

Las otras 19 responden `200`.

Un `404` no prueba que el hecho no ocurriera —la página pudo moverse— pero sí
que **el lector que siga la cita desde el informe no llegará a nada**, y que esos
cuatro puntos no declarados descansan hoy en una referencia irrecuperable.

**Cómo se comprobó.** `tools/informes/informe-01/contraste-r2/contrastar.mjs`,
primera pasada de resolubilidad sobre las 22. **Advertencia sobre esa
herramienta:** su campo de nota aplica la heurística de PDF también a los cuerpos
de error, de modo que etiqueta los tres `404` como «probablemente escaneado».
El código HTTP es correcto; la nota no. Arreglar antes de usarla para otra cosa.

### A-4 · Dos anexos comparten la letra I · **[f]**

El índice publica: A, B, C, D, E, F, **I**, G, **I**. «Ampliación del corpus»
lleva la I y se coloca entre F y G; «Registro completo de fuentes» lleva también
la I. La H no se usa.

**Cómo se comprobó.** Extracción de los pares letra–título del bloque `ANEXOS`
del HTML publicado.

### A-5 · La nota que explica los saltos de numeración es falsa en sus dos mitades · **[f]**

El índice dice:

> «La numeración salta en dos puntos —**no hay sección 2 ni sección 10**— porque
> el sumario se estabilizó antes que el texto.»

Pero el propio índice lista «**2 · Objetivos**» en la posición 05, y la cabecera
corriente de las páginas de implicancias dice «**10 · Implicancias**». Las dos
secciones que la nota declara inexistentes existen. Lo que ocurre es otra cosa:
la sección 2 está anidada como subsección de la 1, y la 10 tiene cabecera
corriente pero no entrada de índice.

**Cómo se comprobó.** Dos apariciones literales de «2 · Objetivos» y una de
«10 · Implicancias» en el HTML publicado.

---

## 2 · Sobre la premisa del encargo: qué falta de verdad en las capas 5, 6 y 7

El encargo supone que las capas de **interpretación**, **implicación** y
**decisión** no existen. Contrastado contra el documento, eso es cierto sólo en
parte, y conviene decirlo antes de reconstruir nada.

| Capa | Lo que el encargo supone | Lo que el documento ya tiene | Veredicto |
|---|---|---|---|
| 5 · Interpretación | falta | Cada uno de los ocho hallazgos publica `Dato · Lectura · Límite`. Las ocho conclusiones C-1…C-8 declaran clase de afirmación y confianza, y dos se marcan como inferencia con su cadena publicada | **Existe**, bien construida |
| 6 · Implicación | enunciada, sin desarrollar | Sección «La ventana, y qué cuesta dejarla pasar»: tres hechos fechados que acotan el período —la guía del Colegio de Abogados de julio de 2026, el colapso de la Oficina Judicial Virtual del 28-07-2026 con 38.477 escritos, y el laboratorio presentado por otra Facultad el 04-09-2026 | **Existe**, y es lo más fuerte del documento |
| 7 · Decisión | sólo en el complemento | Correcto: el cuerpo no contiene prioridades | **Falta** |

**Lo que falta de verdad, entonces, son tres cosas y no siete:**

1. **La lectura transversal.** Los ocho hallazgos interpretan **cada uno su
   dato**. Nadie lee qué dicen **juntos**. Las tres formas de ausencia —unánime
   (evaluación de efecto: 0 de 10), bimodal (norma propia: 2 de 10, y las dos en
   extremos opuestos de formalización), de umbral (presencia en pregrado: 5 de
   10)— están identificadas por separado y no se leen como un patrón del campo.

2. **Las 3 a 5 prioridades**, que el encargo pide en el cuerpo y hoy no existen
   en ninguna parte del informe. Con el límite del propio encargo: sistémicas,
   nunca dirigidas a una universidad nombrada del comparador.

3. **La oportunidad, cuantificada.** El dato está —0 de 30 puntos en evaluación
   de efecto, 0 proyectos ANID en 49.014 adjudicados desde 1982— y está bien
   interpretado. Lo que no dice el informe es **con qué se llenaría esa celda y
   qué costaría**, que es justo lo que un fondo concursable pregunta.

**Lo que NO hay que tocar.** Los ocho hallazgos con su triple estructura, las
ocho conclusiones con su confianza declarada, la sección 8 de conflicto de
interés y la figura de confianza por conclusión. Están mejor de lo que el encargo
supone y rehacerlos sería gasto puro.

---

## 3 · Línea base medida · fase 0

Todo lo de esta tabla se midió el 09-09-2026 sobre `f099279`, antes de tocar nada.

| Medida | Valor |
|---|---|
| `npm run verify` | verde (typecheck + lint + test + build) |
| Celdas con palabra partida | 0 |
| Tablas fuera de la caja de 160 mm | 0 |
| Tablas con columna bajo 10 mm | 0 |
| Rótulos de figura que pisan una barra | 0 |
| Páginas · contenido / impresas | 93 / 112 |
| Comparador | 10 instituciones · techo real 20/30 · promedio de pisos 11,4 |
| Celdas sin concluir | 5 de 100 |
| Capacidad en cero | Evaluación de efecto · 0 de 10 |
| Versiones publicadas, servidas y enlazadas | 11 |
| Local y remoto | sincronizados en `f099279`, árbol limpio |

La maqueta está en verde y **no hay nada que arreglar ahí**: las tres cifras que
D-042 dejó en cero siguen en cero. El trabajo de esta versión es de fondo y de
web, no de composición.

---

## 4 · Clasificación de piezas · fase 0

**A · funciona, no tocar** — los ocho hallazgos, las ocho conclusiones con
confianza, la sección 8, la maqueta, el versionado, `figuras.mjs` como fuente
única, la declaración de intereses.

**B · mejorar** — la portada (A-1), el índice (A-4, A-5), la ficha de la web:
hoy incrusta el documento en un iframe muy alto antes de cualquier otra cosa.

**C · documentado sin implementar** — el análisis de sensibilidad existe como
herramienta (`comparador/sensibilidad.mjs`) pero sólo cubre **dos** escenarios;
los cierres expuestos son **13**.

**D · falta** — la lectura transversal de patrones, las 3-5 prioridades, la
cuantificación de la oportunidad, el comparador nativo en la web.

**E · no tocar** — el corpus, la rúbrica, la cohorte, las cifras de las versiones
ya publicadas.

---

## 5 · Consecuencia para la v3.0.0

A-1, A-2 y A-3 son de fondo: cambian lo que el informe afirma sobre su propia
verificación. Ninguno cambia una cifra sobre una institución con nombre —el orden
publicado no se mueve—, de modo que **no abren la puerta de aprobación** del §6
del encargo. A-4 y A-5 son de forma y viajan con ellos.

Lo que ninguno de los cinco autoriza es a **rebajar el informe**. El corpus está
contrastado al 77 % y no al 100 %; ésa es la cifra correcta y sigue siendo alta.
La corrección honesta aquí no debilita el argumento: lo blinda, porque la primera
persona que compruebe la portada contra el anexo encontrará la contradicción, y
es mejor que la encuentre ya resuelta.
