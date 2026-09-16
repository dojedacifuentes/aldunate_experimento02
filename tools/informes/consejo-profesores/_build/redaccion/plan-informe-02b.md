# Plan del Informe 02, edición de fichas institucionales

Reestructuración del informe sobre transformación de la enseñanza superior ante la inteligencia artificial, para que adopte la forma del Informe 01 aprobado por el Consejo de Profesores.

La metodología que gobierna este plan está fijada en [`metodologia-informe-02b.md`](metodologia-informe-02b.md), documento del 15 de septiembre de 2026. Ante cualquier discrepancia manda ese archivo.

## 1. Identidad

- **Título:** Informe sobre la transformación de la enseñanza universitaria ante la inteligencia artificial
- **Subtítulo:** Edición 2026
- **Fuente:** informe experto v0.3.0, «La universidad ante la automatización del trabajo cognitivo», publicado el 31 de agosto de 2026. Veinticuatro fuentes, treinta instituciones de diez países, once ejes temáticos.
- **Corte de la evidencia:** 15 de septiembre de 2026.
- **Autor:** Diego Hernán Ojeda Cifuentes.

## 2. Qué cambia respecto de la versión de 43 páginas ya producida

La versión anterior organizó el material por temas: uso, evaluación, aprendizaje, competencias, el Derecho, respuestas institucionales. Esa forma es la de un artículo académico.

Esta edición adopta la forma del Informe 01: fichas comparadas, puntaje por dimensión, un gráfico de barras por ficha, color propio de cada institución sostenido entre figuras, mapeo general antes de concluir y conclusiones numeradas.

Lo que cambia respecto del Informe 01 es el sujeto de la ficha. Allí la unidad de análisis es la facultad, porque la pregunta es qué capacidades tiene cada una. Aquí la unidad es la dimensión de la enseñanza, porque la pregunta es cómo cambia la enseñanza, y las instituciones pasan a ser la evidencia dentro de cada dimensión. La matriz es la misma del informe experto y se lee por columnas en vez de por filas, con un capítulo posterior que recupera la lectura por filas. El apartado 3 de [`metodologia-informe-02b.md`](metodologia-informe-02b.md) desarrolla la decisión y su fundamento.

Cambio adicional exigido por el profesor: **todo el detalle metodológico sobre el uso de inteligencia artificial en la elaboración del documento sale del cuerpo y pasa a un anexo propio.**

## 3. La escala

Se conserva la escala de seis niveles del informe experto, que ya está construida y verificada.

| Nivel | Denominación | Señal que lo distingue |
|---|---|---|
| 0 | Ausencia o restricción | Reglamento que la prohíbe, o silencio institucional |
| 1 | Herramienta | Hay contrato de licencia y no hay documento pedagógico |
| 2 | Política y alfabetización | Existe una política citable y un plan de formación |
| 3 | Integración pedagógica | Los programas de asignatura de este año difieren de los de 2022 |
| 4 | Transformación curricular | Un documento de gobierno académico aprobó competencias nuevas |
| 5 | Transformación sistémica | Cambio coordinado de todas las dimensiones |

Las siete dimensiones son metodologías, competencias, evaluación, currículo, rol docente, gobernanza y equidad. Están construidas y verificadas en `puntaje/niveles-instituciones.json`, con las nueve instituciones de la matriz del capítulo 17.

### El umbral del nivel 3

La naturaleza de la señal cambia entre el nivel 2 y el nivel 3. Los niveles 0, 1 y 2 se acreditan con documentos que la institución produce sobre sí misma. Los niveles 3, 4 y 5 exigen un rastro de enseñanza, como un programa de asignatura que difiere del de 2022 o un acuerdo de gobierno académico. El nivel 3 es, por tanto, el umbral en que la evidencia deja de ser una declaración.

Ese umbral convierte en medición la distancia entre política y práctica, que es la debilidad conocida del método documental. Los datos actuales sitúan la media del conjunto en 2,89 sobre 63 celdas, con 23 celdas bajo el nivel 3.

| Dimensión | Media | Rango | Celdas bajo el nivel 3 |
|---|---|---|---|
| Gobernanza | 3,33 | 2 a 5 | 3 de 9 |
| Competencias | 3,00 | 2 a 5 | 3 de 9 |
| Rol docente | 3,00 | 2 a 4 | 2 de 9 |
| Metodologías | 2,89 | 2 a 4 | 2 de 9 |
| Currículo | 2,78 | 1 a 5 | 4 de 9 |
| Equidad | 2,78 | 2 a 4 | 3 de 9 |
| Evaluación | 2,44 | 1 a 5 | 6 de 9 |

Pendiente antes de redactar: ninguna de las 63 celdas está marcada como no concluyente, lo que resulta improbable. Hay que recorrerlas contra el anexo B del informe experto y degradar las que descansen sobre inferencia.

## 4. Estructura e índice

### Portada e índice

Los mismos del Informe 01: institución, unidad, destinatario, autor, lugar y fecha. Índice automático a dos niveles.

### I. Resumen · 900 palabras

Qué se examinó, con qué escala, cuántas instituciones, y los cinco resultados que el Consejo debe retener. Sin gráficos.

### II. Objetivos · 600 palabras

Por qué importa la pregunta ahora, qué se propone el informe y qué deja fuera. Preámbulo corto, según la corrección que el Consejo hizo al Informe 01.

### III. Metodología · 1.200 palabras

- Qué se hizo, paso a paso: criterio de inclusión de instituciones, verificación en fuente primaria, aplicación de la escala.
- La escala de seis niveles, las siete dimensiones y el umbral del nivel 3.
- La regla de evidencia: el nivel lo fija el mejor nivel demostrativo acreditado, sin atender al número de fuentes.
- Qué se hace cuando la evidencia no permite concluir.
- El sesgo declarado de la muestra: solo entran instituciones que documentan, de modo que el mapa sobreestima el nivel medio del sistema.
- **Sin ninguna mención al uso de inteligencia artificial en la elaboración.** Eso va íntegro al anexo C.

### IV. Las siete dimensiones de la transformación · 5.000 palabras · 7 gráficos

El capítulo central, y donde el informe responde su pregunta. Una ficha por dimensión de la enseñanza, en el formato de ficha del Informe 01, con su gráfico de barras mostrando el nivel de las nueve instituciones dentro de esa dimensión.

Cada ficha desarrolla qué le ocurrió a esa parte de la enseñanza entre 2022 y 2026, qué institución llegó más lejos y qué acredita exactamente, cuántas quedaron bajo el umbral del nivel 3, y qué se sigue para una facultad de Derecho chilena.

Orden por media descendente, que es el orden del dato:

1. Gobernanza · media 3,33
2. Competencias · media 3,00
3. Rol docente · media 3,00
4. Metodologías · media 2,89
5. Currículo · media 2,78
6. Equidad · media 2,78
7. Evaluación · media 2,44

Los siete gráficos comparten escala de 0 a 5 y la paleta institucional, de modo que las barras sean comparables entre fichas.

### V. Perfiles institucionales · 2.500 palabras · 9 gráficos

La lectura por filas de la misma matriz, para que el Consejo pueda ver una institución entera de una vez. Nueve perfiles breves, cada uno con su gráfico en las siete dimensiones y una síntesis en prosa de su fortaleza verificada y su evidencia de resultados.

Orden por nivel global descendente:

1. University of Sydney · Australia · nivel 4
2. Ohio State University · Estados Unidos · nivel 4
3. Case Western Reserve, Facultad de Derecho · Estados Unidos · nivel 4
4. Arizona State University · Estados Unidos · nivel 3
5. Tecnológico de Monterrey · México · nivel 3
6. Northeastern University · Estados Unidos · nivel 3
7. University of Bath · Reino Unido · nivel 3
8. California State University · Estados Unidos · nivel 2
9. Universidad de Chile · Chile · nivel 2

Cada institución conserva su color en todos los gráficos del documento, como en el Informe 01.

### VI. El mapa internacional · 1.800 palabras · 3 gráficos

Las treinta instituciones de diez países, ordenadas por nivel verificado. Gráficos de barras por nivel, por país y por tipo de intervención. Los cuatro patrones que el mapa revela, con la advertencia de sesgo al alza.

Aquí entra el material chileno del mapa: Universidad Católica de Chile, Universidad de Chile y Universidad Andrés Bello, las tres en nivel 2, lo que permite al Consejo situar a las instituciones nacionales dentro de la escala internacional.

### VII. La evidencia sobre el efecto en el aprendizaje · 2.000 palabras · 2 gráficos

Lo que la literatura experimental sostiene y lo que no. Los dos ensayos de 2025, la regla del diseño de la tarea, la distancia entre rendimiento percibido y medido, y la retractación del metaanálisis más citado. Es el capítulo que fundamenta por qué la escala mide transformación y no resultado.

### VIII. El caso del Derecho · 2.000 palabras · 2 gráficos

Por qué la formación jurídica es el caso crítico: verificación de fuentes y responsabilidad personal. Fiabilidad medida de las herramientas jurídicas, citas fabricadas en tribunales, y las tres facultades de Derecho que alcanzan nivel 4 en el mapa. Cierra con el estado chileno, remitiendo al Informe 01.

### IX. Mapeo general · 1.200 palabras · 2 gráficos

Síntesis del conjunto antes de concluir, con el mismo papel que cumple en el Informe 01: qué muestra la matriz leída por columnas, dónde está el vacío estructural y qué relación hay entre profundidad de la transformación y calidad de la evidencia disponible.

### X. Conclusiones · 1.500 palabras

Entre doce y dieciséis conclusiones numeradas, agrupadas en bloques: sobre las instituciones examinadas, sobre el contraste internacional, sobre las limitaciones del informe y sobre lo que se sigue para una escuela de Derecho chilena. Ninguna introduce información nueva.

### XI. Referencias

Todas las fuentes citadas, en formato APA, ordenadas alfabéticamente y agrupadas por tipo, como en el Informe 01.

### Anexos

- **A. Detalle metodológico.** Escala completa, criterio de inclusión, procedimiento de verificación y pruebas de robustez.
- **B. Matriz y niveles.** La matriz de nueve instituciones por sus columnas, la tabla de las treinta instituciones del mapa y el registro de fuentes.
- **C. Uso de inteligencia artificial en la elaboración del informe.** Qué tareas se apoyaron en herramientas de inteligencia artificial, qué verificó personalmente el autor y con qué procedimiento. Va aquí por instrucción expresa del profesor, y se conserva porque el propio documento recomienda exigir esa declaración.

## 5. Gráficos

Todos de barras horizontales, un color por institución conservado entre figuras, en el estilo del Informe 01.

| id | Capítulo | Qué muestra |
|---|---|---|
| d01 a d07 | IV | Las nueve instituciones dentro de cada dimensión, escala común de 0 a 5 |
| m01 a m09 | V | Perfil de cada institución en las siete dimensiones |
| n01-niveles | VI | Las treinta instituciones por nivel verificado |
| n02-paises | VI | Instituciones por país y nivel medio |
| n03-tipo | VI | Mandato curricular frente a rediseño evaluativo |
| e01-ensayos | VII | Los dos ensayos aleatorizados de 2025 |
| e02-percepcion | VII | Distancia entre rendimiento percibido y medido |
| j01-alucinaciones | VIII | Contenido inventado en herramientas jurídicas |
| j02-citas | VIII | Resoluciones con citas fabricadas |
| g01-matriz | IX | La matriz completa leída por columnas |
| g02-evidencia | IX | Profundidad de la transformación frente a calidad de la evidencia |

Son veinticinco figuras, frente a las veintiséis del Informe 01.

## 6. Reglas de redacción

Las mismas del Informe 01, en `estilo/reglas-documento-a.md`, comprobadas con `node medir-estilo.mjs`. Sin antítesis correctiva, sin fragmentos enfáticos, sin metáforas en títulos, sin negritas en el cuerpo, oración media de 20 a 30 palabras.

Regla propia de este documento: **el cuerpo no menciona el uso de inteligencia artificial en la elaboración.** Cualquier referencia a ese asunto remite al anexo C.

## 7. Infraestructura reutilizable

Todo el andamiaje del Informe 01 sirve sin modificación:

- `construir-docx.mjs` con el mismo `config.json`
- `graficos.mjs` con la paleta `COLOR_UNIVERSIDAD` y `colorDe()`
- `figuras-por-institucion.mjs` como plantilla para los gráficos de ficha
- `medir-estilo.mjs`, `revisar-residuos.mjs` y `word-a-pdf.ps1`
- `auditar-cifras.mjs` requiere adaptación: hoy comprueba la escala de cinco dimensiones sobre quince, y aquí hay que comprobar niveles de cero a cinco

## 8. Orden de trabajo sugerido

1. Revisar las 63 celdas contra el anexo B del informe experto y degradar a no concluyente las que descansen sobre inferencia.
2. Formular las siete preguntas verificables, una por dimensión, que el anexo A debe publicar.
3. Trasladar las treinta instituciones del mapa internacional a `puntaje/niveles-instituciones.json`, con su país y su nivel verificado.
4. Generar los gráficos con la paleta y el estilo del Informe 01.
5. Redactar en el orden IV, V, VIII, VII, VI, IX, X, y al final I, II y III.
6. Escribir el anexo C con el mismo detalle que el anexo del documento anterior.
7. Auditar cifras, medir estilo, compilar y convertir a PDF.
