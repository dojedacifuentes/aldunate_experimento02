# Plan del Documento B

## Identidad

- **Título:** Inteligencia artificial generativa y enseñanza del Derecho
- **Subtítulo:** Evidencia disponible y consecuencias para la formación jurídica universitaria
- **Naturaleza:** texto de trabajo en tono de artículo académico, preparado para la Dirección de la Escuela de Derecho de la PUCV y su Consejo de Profesores. Autor: Diego Hernán Ojeda Cifuentes. Corte de la evidencia: 30 de agosto de 2026.
- **Extensión objetivo:** unas 15.000 palabras en total (cuerpo cerca de 13.500; resumen, bibliografía y anexo, el resto), ocho gráficos de barras y dos o tres tablas. Con notas al pie, unas 50 páginas.
- **Registro:** el de la guía de estilo (`estilo/guia-de-estilo.md`), sección del Documento B: introducción con problema, objeto y plan; secciones en números romanos con apartados arábigos; notas al pie discursivas y de referencia; conclusiones en prosa.
- **Fuente principal:** el Informe 02 v0.3.0, ya cortado por capítulos en `insumos/informe-02/capitulos/` (archivos `.txt`), más `hechos/i02-evidencia-a.json` (capítulos 1 a 12) y `hechos/i02-evidencia-b.json` (capítulos 13 y 14, con comprobación en origen).

## Tesis que ordena el texto

El trabajo escrito no supervisado dejó de ser evidencia fiable de lo que un estudiante sabe hacer por sí mismo, y la mejor evidencia disponible indica que el efecto de la IA sobre el aprendizaje depende del diseño de la tarea y no del acceso a la herramienta. En el Derecho, donde verificar fuentes y responder personalmente por un escrito son parte del oficio, ambas cosas tienen consecuencias más directas que en otras disciplinas. Una escuela de Derecho puede responder con decisiones de bajo costo, salvo una, que exige presupuesto: horas docentes para evaluar de otra manera.

## Reglas de contenido que valen para todo el documento

1. No llamarlo revisión sistemática ni revisión estructurada. Es un análisis de la evidencia publicada, sin protocolo de búsqueda declarado; se dice una vez, en la introducción y en el anexo.
2. El ensayo de Bastani y otros (PNAS, 2025) se realizó con estudiantes de **secundaria** en Turquía, y PNAS publicó una corrección el 20 de agosto de 2025. Decir ambas cosas la primera vez que se cite.
3. El metaanálisis de Wang y Fan fue **retractado** el 22 de abril de 2026, tras 266 citas. No usar sus cifras como evidencia; mencionarlo como caso.
4. METR califica hoy su estudio de 2025 como histórico: si se usa, con esa advertencia.
5. Las encuestas (HEPI, Digital Education Council, UNESCO) son autoinformadas o de muestras autoseleccionadas: decirlo en nota, no en cada frase.
6. Nada de las etiquetas VERIFICADO, CONTROVERTIDO, ALTA o INSUFICIENTE, ni de la escala «cinco profundidades» como jerga. El grado de solidez se expresa en prosa.
7. Cifras de los gráficos: exactamente las de `figuras-informe-02.mjs`, que vienen de `Graficos.ps1` con su fuente.
8. Derechos de autor: citas textuales de terceros breves y entre comillas; nunca párrafos.

## Estructura

### Resumen y palabras clave · archivo `00-resumen.md` · 220 palabras
Un párrafo en el registro de resumen de revista: problema, objeto, método (análisis de evidencia publicada), hallazgos principales y consecuencia. Cinco palabras clave. Se escribe al final.

### I. Introducción · `01-introduccion.md` · 1.300 palabras
- El problema: durante siglos la tarea escrita cumplió a la vez funciones de aprendizaje, producción, entrenamiento profesional y prueba de lo aprendido; la IA generativa separó la última de las demás.
- Por qué el Derecho es un caso crítico y no solo un caso más.
- Objeto del trabajo y preguntas.
- Nota de método en dos párrafos: evidencia publicada entre noviembre de 2022 y agosto de 2026, criterio para ponderar estudios (diseño, población, independencia), ausencia de protocolo de búsqueda y su consecuencia. Remite al anexo.
- Plan del trabajo, sección por sección.
- Insumos: `capitulos/00-nota-preliminar...txt`, `02-capitulo-1...txt`, `resumen-ejecutivo.txt`.

### II. La extensión del uso y lo que no significa · `02-uso.md` · 1.500 palabras
- La serie HEPI 2024-2026 y la distancia entre usar y delegar (gráfico `b01-uso-delegacion`).
- El profesorado: uso extendido y preparación escasa (gráfico `b03-preparacion`).
- Política declarada y política vigente: el caso de la encuesta de UNESCO (gráfico `b04-politicas`).
- Cierre: la adopción ya ocurrió; el problema pasó a ser de capacidad institucional para acompañarla.
- Insumos: `03-capitulo-2...txt`, `07-capitulo-6...txt`, `09-capitulo-8...txt` (solo la distancia entre política declarada y vigente), `hechos/i02-evidencia-a.json`.

### III. La evaluación escrita y la pérdida de su valor probatorio · `03-evaluacion.md` · 2.200 palabras
- El experimento de la Universidad de Reading (Scarfe y otros, 2024) y lo que prueba.
- Por qué la detección automática no resolvió el problema (falsos positivos con hablantes no nativos, instituciones que desactivaron detectores).
- Lo que dicen las cifras disciplinarias (gráfico `b05-integridad`): miden detección, no prevalencia.
- La cuestión como problema de validez de la evaluación, no solo de integridad académica. Formularlo sin antítesis.
- La respuesta de los dos carriles (University of Sydney) y la tipología de regímenes evaluativos.
- Qué instrumentos conservan valor probatorio y cuáles lo pierden.
- Insumos: `04-capitulo-3...txt`, `hechos/i02-evidencia-a.json` (capítulo 3).

### IV. Aprendizaje asistido y evidencia disponible · `04-aprendizaje.md` · 2.300 palabras
- Dos ensayos que parecen contradecirse: Kestin y otros (Harvard, 2025) y Bastani y otros (Turquía, secundaria, 2025), con la corrección de PNAS (gráfico `b02-rendimiento-aprendizaje`).
- La regla que ambos sugieren: el diseño de la tarea decide.
- Descalibración: la distancia entre rendimiento percibido y medido.
- Homogeneización (Doshi y Hauser, 2024) y el debate sobre la degradación cognitiva, con su grado real de evidencia.
- Estado de la evidencia: la retractación de Wang y Fan y lo que falta por saber (vacíos de investigación).
- Insumos: `06-capitulo-5...txt`, `08-capitulo-7...txt`, `16-capitulo-15...txt`, `17-capitulo-16...txt`, `23-capitulo-22...txt`.

### V. El Derecho como caso crítico · dos archivos · 3.200 palabras
`05a-derecho.md` (1.600 palabras):
- Por qué la verificación de fuentes y la responsabilidad personal por lo escrito hacen del Derecho un caso límite.
- Fiabilidad medida de las herramientas jurídicas (Magesh y otros, 2025; gráfico `b06-alucinaciones-juridicas`).
- Los tribunales ante las citas fabricadas (registro de Charlotin; gráfico `b07-citas-fabricadas`).
- El efecto sobre el aprendizaje jurídico: quién gana y quién pierde.

`05b-derecho.md` (1.600 palabras):
- La escritura jurídica: del componer al revisar y responder por lo escrito.
- Qué instrumentos de evaluación jurídica resisten.
- Cambios en el acceso a la profesión y en los puestos de entrada.
- Qué están haciendo las facultades de Derecho, incluida la experiencia iberoamericana y, como antecedente chileno, el artículo sobre enseñanza del Derecho con asistentes virtuales publicado en 2024 por Faúndez Ugalde, Mellado Silva, Benfeld y Aldunate Lizana (usar `estilo/resumen-2024.md`; citarlo con rigor y sin elogios).
- Insumos: `14-capitulo-13...txt` (el capítulo más largo del informe), `11-capitulo-10...txt`, `15-capitulo-14...txt`, `hechos/i02-evidencia-b.json` (capítulos 13 y 14, comprobados en origen).

### VI. Respuestas institucionales y sus límites · `06-respuestas.md` · 1.700 palabras
- Cuatro modelos de gobernanza: licenciar, construir, federar o dejar hacer.
- California State University como contraejemplo: despliegue masivo sin rediseño evaluativo ni formación docente.
- Ohio State (requisito de egreso), University of Sydney (evaluación) y Tecnológico de Monterrey (herramienta propia) como casos de contraste, en uno o dos párrafos cada uno.
- Enseñar sobre la IA, con la IA o para trabajar con ella: el modelo curricular dominante y el que falta.
- Ninguna institución del mapa internacional alcanza un cambio sistémico (gráfico `b08-mapa-niveles`), con la advertencia de que la muestra está sesgada al alza.
- Insumos: `09-capitulo-8...txt`, `12-capitulo-11...txt`, `13-capitulo-12...txt`, `18-capitulo-17...txt`, `19-capitulo-18...txt`.

### VII. Consecuencias para una escuela de Derecho · `07-consecuencias.md` · 1.600 palabras
- Las cinco medidas del informe, ordenadas por costo, en prosa y con una tabla (`::tabla`): escribir la lista de capacidades que el titulado debe poseer sin asistencia; declarar dos carriles de evaluación a nivel de programa; dejar de invertir en detección automática; evaluar la verificación de fuentes como competencia; presupuestar horas de evaluación oral y de diseño de tareas.
- El riesgo principal de la reforma es presupuestario, y cómo se reconocería a tiempo.
- El contexto chileno, en un párrafo y con remisión al Documento A: ninguna facultad de la cohorte ha medido el efecto de lo que hace, lo que convierte la medición en una oportunidad propia.
- Distinguir lo que la evidencia sostiene de lo que es una decisión normativa razonable.
- Insumos: `resumen-ejecutivo.txt`, `24-capitulo-23...txt`, `25-capitulo-24...txt`.

### VIII. Conclusiones · `08-conclusiones.md` · 900 palabras
Prosa, sin viñetas. Cuatro o cinco conclusiones que no introduzcan información nueva, y lo que queda abierto.

### Bibliografía · `90-bibliografia.md`
Solo obras citadas en notas, con el formato de la guía de estilo, ordenadas alfabéticamente. Se compila al final a partir de las notas y del anexo C del informe (`28-anexo-c...txt`).

### Anexo. Nota metodológica y solidez de la evidencia · `A-anexo.md` · 900 palabras y una tabla
- Alcance, procedimiento y límites, sin protocolo de búsqueda declarado.
- Tabla de los estudios que sostienen las conclusiones: estudio, diseño, población, resultado principal, advertencia (incluye la corrección de Bastani, la retractación de Wang y Fan y la condición histórica de METR).
- Nota breve sobre la elaboración: qué tareas se apoyaron en herramientas de IA y qué verificó personalmente el autor.
- Insumos: `26-anexo-a...txt`, `27-anexo-b...txt`.

## Gráficos

| id | Sección | Qué muestra |
|---|---|---|
| b01-uso-delegacion | II | Uso de IA en trabajos evaluados y uso directo en la entrega, 2024-2026 (HEPI) |
| b03-preparacion | II | Indicadores de preparación docente y estudiantil (Digital Education Council) |
| b04-politicas | II | Estado de la política institucional sobre IA (UNESCO, 2025) |
| b05-integridad | III | Casos probados de mala conducta con IA por cada mil estudiantes (Reino Unido) |
| b02-rendimiento-aprendizaje | IV | Variación del desempeño con y sin la herramienta (Bastani y otros, 2025) |
| b06-alucinaciones-juridicas | V | Respuestas con contenido alucinado en herramientas jurídicas (Magesh y otros, 2025) |
| b07-citas-fabricadas | V | Resoluciones judiciales con citas fabricadas, registro acumulado (Charlotin) |
| b08-mapa-niveles | VI | Treinta instituciones según profundidad del cambio (elaboración del Informe 02) |

Cada gráfico lleva en su directiva `fuente="..."` la referencia breve y, cuando corresponde, la advertencia principal.
