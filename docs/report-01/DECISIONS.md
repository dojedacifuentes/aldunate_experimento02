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
