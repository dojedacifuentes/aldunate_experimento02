# Kit canónico de investigación inter-IA

## IA y Derecho en una cohorte histórica de once universidades chilenas

**Protocolo metodológico, sistema de evidencia, coordinación entre ChatGPT, Claude y Gemini, y experiencia de publicación**

**Versión:** 1.0.0
**Fecha de corte del estudio:** 1 de septiembre de 2026
**Fecha de publicación del kit:** 2 de septiembre de 2026
**Estado:** protocolo operativo; investigación sustantiva pendiente
**Destinatario principal:** profesor Eduardo Aldunate Lizana
**Responsable del proyecto:** Diego Hernán Ojeda Cifuentes
**Naturaleza:** documento de trabajo de un prototipo académico experimental, no oficial PUCV

> Este kit no contiene resultados sobre el desempeño de las universidades. Define cómo producirlos, verificarlos, comunicarlos y actualizarlos sin perder continuidad.

---

## Capa 1 · Orientación rápida

### 1. Qué resuelve este kit

El proyecto necesita que varias inteligencias artificiales colaboren sin depender de que compartan memoria, cuenta, proveedor o historial de conversación. La solución no consiste en intentar que los modelos “conversen” directamente. Consiste en darles un expediente común, reglas idénticas y un formato obligatorio de relevo.

La memoria del proyecto será el **expediente canónico**. ChatGPT, Claude y Gemini son colaboradores reemplazables que leen ese expediente, proponen cambios y dejan un relevo estructurado. Ninguna IA es la fuente de verdad.

El kit fija:

- las once universidades que forman la cohorte histórica;
- la fecha de corte;
- las definiciones de IA aplicada al Derecho y Derecho aplicado a la IA;
- la continuidad con las cinco dimensiones del informe anterior;
- la escala de madurez;
- la jerarquía de fuentes;
- los identificadores estables;
- los estados de revisión;
- las funciones de las tres IA;
- el mecanismo de resolución humana;
- la experiencia web y las descargas derivadas de una misma fuente.

### 2. Qué no resuelve todavía

Este kit no:

- demuestra que una universidad sea líder o esté rezagada;
- valida los datos del informe de 2025;
- contiene un ranking nacional;
- representa a la totalidad de las universidades chilenas;
- autoriza a utilizar marcas institucionales como si el documento fuera oficial;
- sustituye la revisión humana de fuentes y conclusiones.

### 3. Inicio en quince minutos

1. Guardar este kit y las plantillas en una carpeta compartida.
2. Adjuntar el informe anterior dentro de `antecedentes_no_canonicos`.
3. Entregar a ChatGPT el manifiesto, el protocolo y la planilla vigente.
4. Pedirle que investigue una tarea acotada, no que escriba el informe entero.
5. Entregar a Gemini los registros propuestos para que busque omisiones y contraevidencia.
6. Entregar a Claude las mismas fuentes para que audite atribución, inferencias y madurez.
7. Resolver los conflictos mediante una decisión humana registrada.
8. Publicar únicamente registros con estado `ACEPTADO`.

### 4. Principio rector

> Una cohorte fija + un protocolo versionado + una base canónica + identificadores estables + relevos estructurados + aprobación humana.

---

## Capa 2 · Protocolo de investigación

### 5. Pregunta y propósito

La pregunta general es:

> ¿Qué capacidades institucionales verificables han construido once Facultades, Escuelas o carreras de Derecho chilenas en IA aplicada al Derecho y en Derecho aplicado a la IA, cómo cambiaron entre 2025 y el 1 de septiembre de 2026, y qué brechas presenta la PUCV frente a pares comparables?

El estudio tiene una finalidad estratégica: aportar evidencia que permita al profesor Eduardo Aldunate Lizana y a otros decisores evaluar si la PUCV está avanzando con suficiente coherencia, continuidad y recursos.

La hipótesis de trabajo es:

> La PUCV dispone de iniciativas relevantes en IA y Derecho, pero todavía no las ha convertido en una capacidad institucional coherente, transversal, sostenida, financiada y evaluable.

Esta hipótesis debe poder ser confirmada, matizada o refutada. La intención crítica no autoriza a seleccionar evidencia de manera sesgada. La incomodidad legítima debe provenir de datos trazables, comparadores razonables y preguntas que las autoridades puedan contestar.

### 6. Cohorte histórica canónica

**Identificador:** `COHORTE_IA_DERECHO_CHILE_11_V1`

| ID canónico | Institución |
|---|---|
| `puc-chile` | Pontificia Universidad Católica de Chile |
| `uchile` | Universidad de Chile |
| `udp` | Universidad Diego Portales |
| `uandes` | Universidad de los Andes |
| `uai` | Universidad Adolfo Ibáñez |
| `unab` | Universidad Andrés Bello |
| `udd` | Universidad del Desarrollo |
| `uautonoma` | Universidad Autónoma de Chile |
| `ucentral` | Universidad Central de Chile |
| `pucv` | Pontificia Universidad Católica de Valparaíso |
| `udec` | Universidad de Concepción |

Estas once instituciones constituyen una cohorte longitudinal cerrada para conservar continuidad con el informe de 2025. La selección no es probabilística ni garantiza representatividad del sistema chileno.

Toda tabla, gráfico o conclusión debe decir **“cohorte histórica de once instituciones”**. No debe decir “las universidades chilenas” cuando el universo analizado sea solamente esta cohorte.

Una institución externa relevante se registra como `CANDIDATA_FUERA_DE_COHORTE`. Su descubrimiento no modifica silenciosamente la cohorte. Ampliar el universo exige una nueva versión del manifiesto y una explicación metodológica.

### 7. Unidad de análisis

La unidad principal es la Facultad, Escuela o carrera de Derecho.

Una iniciativa general de la universidad sólo puede atribuirse a Derecho si existe evidencia pública de al menos uno de estos vínculos:

- participación formal de la unidad jurídica;
- acceso documentado de estudiantes o docentes de Derecho;
- aplicación específicamente jurídica;
- resultados que incluyan explícitamente a esa unidad;
- incorporación en currículo, investigación, práctica o gestión jurídica.

Cada iniciativa se clasifica además por nivel de atribución:

- `UNIVERSIDAD`;
- `FACULTAD_DERECHO`;
- `CENTRO_O_LABORATORIO`;
- `EQUIPO_ACADEMICO`;
- `ACADEMICO_INDIVIDUAL`;
- `ESTUDIANTIL`;
- `EXTERNA_CON_PARTICIPACION`.

Una actividad individual no se convierte en avance institucional por aparecer en una noticia universitaria.

### 8. Dos direcciones de la relación IA–Derecho

Cada iniciativa recibe una etiqueta independiente de la dimensión en que se observa:

#### `IA_PARA_DERECHO`

Uso de IA en:

- enseñanza y aprendizaje jurídico;
- investigación y búsqueda jurídica;
- redacción y análisis documental;
- práctica profesional y clínicas;
- acceso a la justicia;
- automatización legal;
- gestión académica relacionada con Derecho;
- desarrollo de herramientas o prototipos jurídicos.

#### `DERECHO_DE_IA`

Aplicación del Derecho a:

- regulación y gobernanza de sistemas de IA;
- responsabilidad y transparencia;
- derechos fundamentales y discriminación;
- protección de datos;
- propiedad intelectual;
- ética y políticas públicas;
- control de decisiones automatizadas.

#### `AMBOS`

La iniciativa integra de forma sustantiva las dos direcciones.

#### `ADYACENTE`

La actividad trata sobre innovación, tecnología, datos, ciberseguridad o derecho digital, pero la IA no es un componente central verificable. Las actividades adyacentes pueden conservarse como contexto, pero no deben elevar automáticamente la madurez en IA y Derecho.

### 9. Continuidad con el informe anterior

La metodología 2.0 conserva las cinco dimensiones históricas:

1. formación de pregrado;
2. formación continua y postgrado;
3. investigación y desarrollo;
4. vinculación con el medio;
5. uso institucional de IA.

Agrega tres dimensiones transversales:

6. gobernanza y estrategia;
7. recursos y capacidades;
8. continuidad, cobertura y resultados.

La transición se publica con tres campos separados:

- `puntaje_publicado_2025`;
- `puntaje_2025_recalculado`;
- `madurez_2026_metodologia_2`.

Los errores del informe anterior se corrigen mediante fe de erratas y changelog. No se reemplazan silenciosamente. Ningún dato hallado en 2026 debe presentarse como si hubiera estado públicamente disponible en 2025.

### 10. Qué se mide

El estudio separa cuatro objetos que no deben confundirse:

#### Huella de actividad

Cantidad y variedad de actividades verificadas. Es descriptiva y no equivale a madurez.

#### Madurez institucional

Grado en que una capacidad dejó de ser aislada y pasó a formar parte de la estructura institucional.

#### Calidad de evidencia

Fuerza con que las fuentes sostienen el dato atribuido.

#### Cobertura de investigación

Proporción del protocolo efectivamente completada para cada institución y dimensión.

Una universidad puede exhibir muchas actividades, baja institucionalización y evidencia débil. Otra puede mostrar pocas iniciativas, pero formalizadas y evaluadas. El informe debe conservar esa diferencia.

### 11. Escala de madurez

| Nivel | Nombre | Condición mínima |
|---|---|---|
| 0 | Sin evidencia pública | El protocolo de búsqueda fue completado y no se localizó evidencia verificable. |
| 1 | Exploración | Anuncio, evento, piloto o iniciativa aislada. |
| 2 | Operación | Actividad recurrente, curso activo, proyecto en ejecución o varios antecedentes convergentes. |
| 3 | Institucionalización | Responsables formales, continuidad, cobertura, política, recursos o integración curricular. |
| 4 | Evaluación | Productos, resultados o efectos públicamente documentados y revisables. |

Reglas de entrada:

- un centro nominal sin proyectos verificables no supera el nivel 1;
- varios eventos no producen por acumulación automática el nivel 3;
- el nivel 3 exige al menos una señal formal de institucionalización;
- el nivel 4 exige productos o resultados, no sólo continuidad;
- si la cobertura es insuficiente, se usa `NO_EVALUABLE`, no cero;
- la confianza de la fuente se reporta aparte de la madurez.

### 12. Trayectoria temporal

Cada iniciativa recibe un estado de cambio 2025–2026:

- `NUEVA`;
- `CONTINUA`;
- `AMPLIADA`;
- `INSTITUCIONALIZADA`;
- `EVALUADA`;
- `REDUCIDA`;
- `DISCONTINUADA`;
- `NO_LOCALIZADA`;
- `DESCONOCIDA`.

El análisis debe privilegiar la trayectoria. Una iniciativa que permanece durante dos años en fase de anuncio puede ser más informativa que una diferencia menor de puntaje.

### 13. Protocolo homogéneo de búsqueda

Para cada universidad deben recorrerse las mismas rutas:

1. sitio de la Facultad, Escuela o carrera de Derecho;
2. malla curricular;
3. programas y syllabus;
4. postgrados y formación continua;
5. repositorios y publicaciones;
6. proyectos, fondos y concursos;
7. centros y laboratorios;
8. políticas institucionales sobre IA;
9. reglas de integridad académica y evaluación;
10. herramientas, licencias y convenios;
11. vinculación y transferencia;
12. noticias institucionales;
13. fuentes externas de contraste.

Por institución se registra:

- consulta utilizada;
- dominio revisado;
- fecha y hora de búsqueda;
- resultados pertinentes;
- rutas sin resultados;
- documentos inaccesibles;
- responsable o modelo que ejecutó la búsqueda.

No puede asignarse nivel 0 hasta completar el protocolo. La expresión correcta es “no se encontró evidencia pública verificable”, no “la actividad no existe”.

### 14. Jerarquía de fuentes

Prioridad:

1. resoluciones, políticas y documentos oficiales;
2. mallas, programas y syllabus;
3. repositorios, publicaciones y proyectos financiados;
4. páginas oficiales de centros y laboratorios;
5. memorias, convenios, cuentas públicas y documentos de resultados;
6. noticias institucionales;
7. prensa externa;
8. redes sociales, sólo como pista o señal débil.

Todo hallazgo debe verificarse abriendo la fuente original. Un resultado de buscador, una síntesis generada por IA o la conclusión de otro modelo no son fuentes.

Cuando una fuente indique solamente el año, se conserva esa precisión. No se inventan día ni mes. Si una página no declara fecha, se registra `FECHA_NO_DECLARADA` y la fecha de consulta.

### 15. Cadena de trazabilidad

La cadena canónica es:

> Fuente → Evidencia → Iniciativa → Afirmación → Evaluación → Visualización → Conclusión → Recomendación

Ningún eslabón reemplaza al anterior. Una fuente puede sostener varias evidencias; varias fuentes pueden sostener una evidencia; una iniciativa puede estar respaldada por múltiples evidencias sin convertirse por eso en múltiples iniciativas.

### 16. Clasificación epistemológica

Cada afirmación se clasifica:

- `HECHO`: verificable directamente en fuentes citables;
- `SEÑAL`: indicio real pero parcial;
- `INFERENCIA`: conclusión derivada cuya cadena de razonamiento se explicita;
- `HIPOTESIS`: formulación por contrastar;
- `PENDIENTE`: información necesaria aún no obtenida.

Cada afirmación debe incluir contraevidencia, limitaciones y confianza. Los hallazgos factuales deben quedar separados de la interpretación y de la recomendación.

### 17. Control de doble conteo

Antes de crear una nueva iniciativa se revisa si ya existe un `initiative_id` relacionado.

Ejemplo:

- noticia de lanzamiento de un laboratorio;
- seminario inaugural;
- convenio asociado;
- página institucional del laboratorio.

Pueden ser cuatro fuentes sobre una iniciativa. Sólo se registran como actividades distintas si representan acciones sustantivamente diferentes.

### 18. Comparación de la PUCV

La PUCV se observa mediante tres espejos:

1. pares chilenos comparables;
2. frontera nacional dentro de la cohorte;
3. referentes internacionales como modelos aspiracionales, nunca como participantes del mismo ranking.

La sección PUCV debe preguntar:

- ¿Existe estrategia formal?
- ¿Quién tiene responsabilidad institucional?
- ¿Qué recursos verificables existen?
- ¿Qué competencia aparece en el currículo obligatorio?
- ¿Qué proporción de estudiantes y docentes alcanza?
- ¿Qué herramientas se utilizan institucionalmente?
- ¿Qué políticas regulan su uso?
- ¿Qué productos y resultados han generado los centros o laboratorios?
- ¿Qué cambió desde 2025?
- ¿Las iniciativas sobreviven a quienes las impulsaron?
- ¿Qué universidad comparable ya hizo algo que la PUCV no ha realizado?

La formulación narrativa inicial es una hipótesis, no un resultado:

> La PUCV tiene semillas; la investigación debe determinar si ya existe un sistema.

### 19. Derecho de observación institucional

Antes de una versión estable puede enviarse a cada institución una ficha factual para corrección o aporte de documentos públicos. Este contacto requiere autorización humana específica.

Las respuestas institucionales no alteran automáticamente el registro. Toda modificación sustantiva debe estar respaldada por evidencia verificable. Se deja constancia de:

- fecha de envío;
- unidad contactada;
- respuesta recibida;
- documento aportado;
- cambio producido;
- decisión de aceptación o rechazo.

---

## Capa 3 · Sistema canónico y coordinación inter-IA

### 20. Fuente de verdad

La fuente de verdad es el expediente compartido, no este documento aislado ni el chat de una IA.

Estructura recomendada:

```text
IA_DERECHO_CHILE_CANONICO/
├── 00_MANIFIESTO_CANONICO.md
├── 01_PROTOCOLO_METODOLOGICO.md
├── 02_UNIVERSIDADES.csv
├── 03_INICIATIVAS.csv
├── 04_FUENTES.csv
├── 05_EVIDENCIAS.csv
├── 06_AFIRMACIONES.csv
├── 07_EVALUACIONES.csv
├── 08_CONFLICTOS.md
├── 09_HANDOFF_INTER_IA.md
├── 10_DECISIONES_HUMANAS.md
├── 11_CHANGELOG.md
├── antecedentes_no_canonicos/
├── archivos_fuente/
├── versiones_publicadas/
└── exportaciones/
```

El sitio web, el PDF, el Word y las visualizaciones deben derivarse del mismo contenido y de los mismos metadatos. Número de versión, fecha, recuentos y estado no deben escribirse manualmente en varios lugares.

### 21. Identificadores estables

Formato:

- fuente: `src-pucv-001`;
- evidencia: `ev-pucv-001`;
- iniciativa: `ini-pucv-001`;
- afirmación: `clm-pucv-001`;
- evaluación: `eval-pucv-pregrado-2026`;
- ejecución de IA: `run-20260901-chatgpt-001`.

Los identificadores no se reutilizan. Un registro superado conserva su ID y apunta al registro que lo reemplaza.

### 22. Estados editoriales

| Estado | Significado |
|---|---|
| `PROPUESTO` | Una IA o investigador encontró el registro. |
| `FUENTE_ABIERTA` | Se abrió y examinó la publicación original. |
| `CONTRASTADO` | Una segunda revisión examinó atribución, alcance y contraevidencia. |
| `ACEPTADO` | Una decisión humana lo habilitó para publicación. |
| `RECHAZADO` | Se descartó con una razón registrada. |
| `SUPERADO` | Era válido, pero evidencia posterior lo reemplazó. |

Sólo `ACEPTADO` alimenta conclusiones publicadas. Ninguna IA sobrescribe directamente un registro aceptado: propone un cambio.

### 23. Roles

#### ChatGPT · investigador principal

- inventaría el corpus;
- ejecuta la primera búsqueda;
- construye fuentes, evidencias e iniciativas propuestas;
- redacta la primera ficha factual;
- señala limitaciones y preguntas abiertas.

#### Gemini · buscador de omisiones y contraevidencia

- repite búsquedas independientemente;
- busca documentos omitidos;
- comprueba si una ausencia pública fue investigada suficientemente;
- propone fuentes contradictorias o complementarias;
- no modifica los registros del investigador principal.

#### Claude · auditor metodológico

- revisa atribución institucional;
- detecta doble conteo;
- controla la escala de madurez;
- cuestiona inferencias;
- examina comparadores y sesgos;
- audita con especial cuidado las conclusiones sobre la PUCV.

#### Curador humano · autoridad editorial

- resuelve conflictos;
- acepta o rechaza registros;
- protege la coherencia metodológica;
- autoriza comunicaciones externas;
- aprueba versiones publicables.

Estos roles pueden rotarse para evaluar dependencia del modelo. Debe quedar registrado qué modelo cumplió cada función.

### 24. Paquete de relevo

Cada sesión termina con:

```text
HANDOFF
protocol_version:
cohort_version:
cutoff_date:
run_id:
model:
role:
started_at:
completed_at:
institutions_reviewed:
records_created:
records_changed:
sources_opened:
claims_challenged:
conflicts:
unresolved_questions:
recommended_next_task:
```

El siguiente modelo recibe el expediente actualizado y el último relevo. No necesita ni debe presumir acceso a los chats anteriores.

### 25. Contrato de salida de las IA

Toda entrega debe contener:

1. resumen operativo breve;
2. registros nuevos en formato tabular;
3. registros modificados con antes y después;
4. fuentes originales abiertas;
5. contraevidencia;
6. conflictos;
7. afirmaciones debilitadas o fortalecidas;
8. pendientes;
9. paquete de relevo.

Una respuesta exclusivamente narrativa no se integra al expediente.

### 26. Prompt común de arranque

```text
Actúa dentro del proyecto COHORTE_IA_DERECHO_CHILE_11_V1, protocolo
METODOLOGIA_IA_DERECHO_V2.0 y fecha de corte 2026-09-01.

La fuente de verdad es el expediente canónico adjunto. El informe de 2025 es
un antecedente no verificado y las páginas del proyecto son referencias de
arquitectura, no evidencia sobre universidades.

No agregues, elimines ni renombres universidades. No sobrescribas registros
ACEPTADO. Toda novedad debe proponerse con un identificador estable, fuente
original, fecha de consulta, alcance, limitaciones y relación con registros
anteriores.

Trabaja sólo en la tarea asignada. Abre las fuentes originales; no uses
resultados de buscadores ni síntesis de otra IA como evidencia. Distingue
universidad, Facultad de Derecho, centro, equipo, actividad individual y
actividad estudiantil. Distingue IA_PARA_DERECHO, DERECHO_DE_IA, AMBOS y
ADYACENTE. No conviertas ausencia de evidencia pública en inexistencia.

Al terminar entrega registros propuestos, fuentes abiertas, contraevidencia,
conflictos, pendientes y un HANDOFF completo.
```

### 27. Prompt del investigador principal

```text
Investiga la institución [UNIVERSITY_ID], dimensión [DIMENSION] y periodo
[PERIODO]. Ejecuta todas las rutas del protocolo pertinentes. Antes de crear
una iniciativa revisa posibles duplicados. Devuelve fuentes, evidencias,
iniciativas y afirmaciones separadas. No asignes madurez hasta informar la
cobertura alcanzada. No redactes conclusiones nacionales.
```

### 28. Prompt del buscador de omisiones

```text
Audita los registros propuestos para [UNIVERSITY_ID]. Repite la búsqueda sin
depender de las consultas anteriores. Busca fuentes omitidas, documentos que
contradigan la atribución, iniciativas discontinuadas y evidencia de
institucionalización o ausencia de ella. No edites los registros: entrega
propuestas de confirmación, contradicción o sustitución con fuentes originales.
```

### 29. Prompt del auditor metodológico

```text
Examina atribución, pertinencia temática, doble conteo, temporalidad, calidad
de fuente, cobertura y escala de madurez. Selecciona afirmaciones sustantivas y
comprueba cada una contra la publicación original. Clasifica los defectos como
bloqueantes, altos, medios o menores. Indica el efecto de cada defecto sobre la
conclusión y formula la corrección mínima necesaria.
```

### 30. Resolución de conflictos

Un conflicto se abre cuando:

- dos fuentes atribuyen estados incompatibles;
- dos modelos clasifican de modo distinto una iniciativa;
- una fuente institucional contradice una externa;
- no puede determinarse si una actividad pertenece a Derecho;
- el nivel de madurez depende de una inferencia discutible;
- una fecha cambia el resultado temporal.

El registro de conflicto incluye posiciones, fuentes, decisión, responsable y fecha. La resolución humana no borra la posición rechazada.

---

## Capa 4 · Experiencia centrada en el usuario

### 31. Usuarios

El sistema sirve a cuatro perfiles:

#### Decisor

Necesita comprender en pocos minutos qué está demostrado, qué falta y qué decisiones se desprenden.

#### Investigador

Necesita continuar una búsqueda sin reconstruir el contexto ni interpretar conversaciones anteriores.

#### Auditor

Necesita recorrer una afirmación hacia atrás hasta su fuente y conocer qué cambió.

#### Lector público

Necesita una narrativa clara, límites visibles, descargas accesibles y certeza sobre la versión consultada.

### 32. Capas de lectura

La interfaz web y los documentos descargables deben ofrecer:

1. **Orientación:** propósito, estado, fecha, versión y descarga.
2. **Método:** cohorte, dimensiones, escala, cobertura y flujo.
3. **Auditoría:** fuentes, evidencias, afirmaciones, conflictos y changelog.

Nadie debe estar obligado a leer la capa técnica para comprender correctamente el estado del proyecto. Al mismo tiempo, ningún hallazgo debe quedar sin camino de auditoría.

### 33. Principios de interfaz

- mostrar siempre versión, fecha de corte y estado;
- distinguir “protocolo”, “borrador” y “resultado”;
- no ofrecer botones de archivos inexistentes;
- rotular cada formato y su propósito;
- evitar que el color sea el único indicador de estado;
- utilizar lenguaje sencillo antes del vocabulario técnico;
- mantener tablas utilizables en pantallas pequeñas;
- ofrecer HTML, PDF, Word y Markdown desde el mismo punto;
- señalar de forma visible que el proyecto no es una publicación oficial PUCV;
- conservar enlaces directos a las fuentes;
- publicar los vacíos como pendientes, no ocultarlos.

### 34. Ruta de usuario recomendada

#### Primera visita

El usuario ve:

- qué es el kit;
- para qué sirve;
- que aún no contiene resultados;
- las once instituciones;
- un botón principal de descarga;
- formatos alternativos;
- la fecha de actualización.

#### Continuación de investigación

El investigador descarga el paquete completo, abre el manifiesto y trabaja sobre una tarea acotada. Al terminar, devuelve un relevo que puede ser utilizado por otro modelo.

#### Verificación

El auditor abre una afirmación, ve sus fuentes, revisa el documento original, registra un conflicto o propone aceptación.

#### Publicación

El decisor aprueba una versión. El sitio, PDF, Word y Markdown se regeneran desde el expediente. La versión anterior permanece disponible.

### 35. Accesibilidad y legibilidad

- estructura de encabezados consistente;
- índice navegable;
- enlaces descriptivos;
- contraste suficiente;
- tipografía de lectura y espaciado generoso;
- tablas con encabezados explícitos;
- navegación por teclado en HTML;
- diseño de impresión en tamaño A4;
- contenido comprensible sin imágenes;
- metadatos de autoría, versión y fecha.

### 36. Integridad entre formatos

La versión Markdown es la fuente editorial de este kit. HTML, Word y PDF se generan desde ella. Un manifiesto registra nombre, versión, fecha y archivos.

Antes de publicar se comprueba:

- que los cuatro formatos declaren la misma versión;
- que tengan el mismo título, cohorte y fecha de corte;
- que los enlaces relevantes sobrevivan a la conversión;
- que Word y PDF sean legibles;
- que el HTML funcione en móvil y pueda imprimirse;
- que el paquete ZIP contenga las plantillas;
- que las descargas del sitio existan realmente.

---

## Capa 5 · Gobierno, almacenamiento y publicación

### 37. Versionado

Se utiliza versionado semántico:

- cambio mayor: altera cohorte, conceptos centrales o compatibilidad;
- cambio menor: agrega dimensiones, campos o flujos sin romper continuidad;
- parche: corrige redacción, enlaces o errores sin cambiar el método.

Las versiones publicadas son inmutables. Una corrección produce un nuevo archivo y una entrada de changelog.

### 38. Metadatos mínimos

Cada archivo publicado declara:

- título;
- versión;
- fecha de publicación;
- fecha de corte;
- estado;
- responsable;
- carácter no oficial;
- archivo canónico del que deriva.

### 39. Privacidad y seguridad

La investigación se limita a datos públicos. No se incorporan:

- credenciales;
- conversaciones privadas con el destinatario;
- antecedentes personales irrelevantes;
- presupuestos no autorizados;
- archivos institucionales confidenciales;
- datos personales de estudiantes;
- inferencias sobre personas no necesarias para el objeto institucional.

El contexto con el profesor Aldunate se limita a destinatario, finalidad, tono, decisiones que el informe busca apoyar y condición no oficial. La gestión comercial del encargo se mantiene separada de la evidencia.

### 40. Fases

#### Fase 0 · Protocolo

- aprobar cohorte;
- aprobar metodología;
- preparar plantillas;
- corregir línea base;
- fijar presupuesto y alcance.

#### Fase 1 · Piloto

- PUCV;
- Pontificia Universidad Católica de Chile;
- Universidad de Chile;
- evaluación de cobertura y reglas.

#### Fase 2 · Cohorte completa

- ocho instituciones restantes;
- contra-búsqueda;
- auditoría cruzada;
- resolución de conflictos.

#### Fase 3 · Análisis

- trayectorias;
- perfiles de madurez;
- comparación PUCV;
- sensibilidad y limitaciones;
- recomendaciones.

#### Fase 4 · Publicación

- informe web;
- PDF;
- Word;
- Markdown;
- matrices descargables;
- changelog.

#### Fase 5 · Actualización

- verificación periódica;
- nuevas fuentes;
- cambios de estado;
- versiones inmutables.

### 41. Criterios de aceptación de la investigación

Una versión con resultados no puede publicarse si:

- existen afirmaciones sustantivas sin fuente;
- no se completó el protocolo para instituciones comparadas;
- hay errores aritméticos;
- se mezclan unidades de análisis;
- no se distingue ausencia pública de inexistencia;
- se atribuyen actividades individuales como institucionales;
- una conclusión PUCV omite contraevidencia relevante;
- los comparadores no son razonables;
- web y descargas declaran versiones diferentes;
- los conflictos bloqueantes permanecen abiertos.

### 42. Indicadores del propio proceso

El sistema debe informar:

- universidades con protocolo completo;
- fuentes propuestas, abiertas y aceptadas;
- evidencias sin segunda revisión;
- afirmaciones con contraevidencia;
- conflictos abiertos;
- antigüedad de la última verificación;
- porcentaje de campos completos;
- registros aportados por cada modelo;
- correcciones originadas por auditoría humana.

Estos indicadores permiten evaluar la calidad del proceso sin confundirla con el desempeño de las universidades.

---

## Anexo A · Diccionario mínimo

### Universidades

| Campo | Descripción |
|---|---|
| `university_id` | Identificador canónico inmutable. |
| `official_name` | Nombre institucional completo. |
| `cohort_version` | Versión en que fue incorporada. |
| `unit_name` | Nombre de Facultad, Escuela o carrera. |
| `status` | Activa, pendiente de verificación u otro estado explícito. |
| `notes` | Alcance y advertencias. |

### Fuentes

| Campo | Descripción |
|---|---|
| `source_id` | Identificador único. |
| `university_id` | Institución relacionada. |
| `title` | Título de la publicación. |
| `publisher` | Emisor. |
| `source_type` | Política, syllabus, noticia, publicación u otro. |
| `url` | Enlace original. |
| `archived_url` | Copia permanente si existe. |
| `published_date` | Fecha con precisión real. |
| `accessed_date` | Fecha de consulta. |
| `document_status` | Vigente, histórico, inaccesible, sustituido. |
| `confidence` | Confianza documental separada de la madurez. |
| `workflow_status` | Propuesto, abierto, contrastado, aceptado, etc. |

### Evidencias

| Campo | Descripción |
|---|---|
| `evidence_id` | Identificador único. |
| `source_id` | Fuente que la sostiene. |
| `initiative_id` | Iniciativa a la que pertenece. |
| `direction` | IA para Derecho, Derecho de IA, ambos o adyacente. |
| `dimension` | Dimensión histórica o transversal. |
| `factual_statement` | Descripción factual acotada. |
| `institutional_level` | Nivel de atribución. |
| `temporal_status` | Estado de cambio. |
| `last_verified` | Última comprobación. |

### Afirmaciones

| Campo | Descripción |
|---|---|
| `claim_id` | Identificador único. |
| `claim_text` | Afirmación exacta. |
| `classification` | Hecho, señal, inferencia, hipótesis o pendiente. |
| `evidence_ids` | Evidencias relacionadas. |
| `counterevidence_ids` | Contraevidencia. |
| `reasoning` | Cadena inferencial. |
| `limitations` | Alcance y restricciones. |
| `confidence` | Confianza en la afirmación. |
| `workflow_status` | Estado editorial. |

---

## Anexo B · Lista de verificación por institución

- [ ] Se utilizó el ID canónico.
- [ ] Se verificó el nombre de la unidad de Derecho.
- [ ] Se completaron las trece rutas de búsqueda o se explicó por qué no aplican.
- [ ] Se registraron consultas y fechas.
- [ ] Se abrieron las fuentes originales.
- [ ] Se separaron fuentes, evidencias, iniciativas y afirmaciones.
- [ ] Se controló el doble conteo.
- [ ] Se distinguió nivel institucional.
- [ ] Se clasificó la dirección IA–Derecho.
- [ ] Se clasificó la dimensión.
- [ ] Se determinó trayectoria temporal.
- [ ] Se informó cobertura.
- [ ] Se buscó contraevidencia.
- [ ] Una segunda IA revisó los registros.
- [ ] Los conflictos están resueltos o visibles.
- [ ] Un humano aceptó lo publicable.

---

## Anexo C · Lista de verificación de publicación

- [ ] Markdown, HTML, Word y PDF tienen la misma versión.
- [ ] La fecha de corte es 1 de septiembre de 2026.
- [ ] La cohorte contiene exactamente once instituciones.
- [ ] El documento se presenta como no oficial.
- [ ] El estado distingue protocolo de resultados.
- [ ] Los enlaces de descarga existen.
- [ ] El HTML es navegable con teclado.
- [ ] El PDF y Word son legibles en A4.
- [ ] El ZIP contiene manifiesto y plantillas.
- [ ] El changelog explica los cambios.
- [ ] No hay datos confidenciales.
- [ ] No se publican registros distintos de `ACEPTADO` como resultados.

---

## Anexo D · Decisiones canónicas de la versión 1.0.0

1. La cohorte queda fijada en once universidades.
2. El estudio se denomina longitudinal de cohorte, no censo nacional.
3. El informe de 2025 es línea base no verificada.
4. Las cinco dimensiones anteriores se conservan.
5. Se agregan tres dimensiones transversales.
6. IA para el Derecho y Derecho de la IA son etiquetas, no dimensiones que dupliquen actividades.
7. Actividad, madurez, evidencia y cobertura se reportan separadamente.
8. Sólo los registros aceptados alimentan resultados.
9. Las tres IA se comunican mediante el expediente y paquetes de relevo.
10. El curador humano mantiene autoridad final.
11. Todas las salidas se derivan de una fuente editorial canónica.
12. El propósito crítico respecto de la PUCV se formula como hipótesis falsable.

---

## Historial

### v1.0.0 · 2 de septiembre de 2026

- Se fija la cohorte histórica de once instituciones.
- Se consolida la metodología 2.0 compatible con el informe anterior.
- Se establecen identificadores, estados y registros canónicos.
- Se define el flujo ChatGPT → Gemini → Claude → decisión humana.
- Se incorpora una experiencia de lectura en capas.
- Se definen criterios de accesibilidad, publicación y consistencia entre formatos.
- Se incluyen plantillas descargables para universidades, fuentes, evidencias, afirmaciones y ejecuciones.

---

## Cierre

El valor del sistema no depende de lograr que tres modelos produzcan el mismo texto. Depende de que puedan discrepar sin romper la trazabilidad, aportar evidencia sin reescribir la historia y continuar el trabajo sin depender de la memoria de una conversación.

El expediente canónico convierte esa colaboración en un proceso acumulativo, auditable y centrado en quien finalmente debe usar el informe para comprender, decidir y exigir respuestas.
