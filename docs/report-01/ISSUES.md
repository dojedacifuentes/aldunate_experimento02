# ISSUES — Informe 01

Problemas abiertos. Uno se cierra cuando queda resuelto **en el repositorio**,
no cuando se entiende.

Estados: `OPEN` · `EN CURSO` · `CERRADO` · `BLOQUEADO`.

---

## ISSUE-001 — La verificación sustantiva de las 74 fuentes no está hecha

**Estado:** OPEN · **Impacto:** alto

Las 74 URL fueron abiertas por los modelos que produjeron los documentos de
investigación profunda, no por quien firma el informe. Que una URL responda no
prueba que diga lo que se le atribuye.

**Consecuencia mientras siga abierto:** ninguna fuente recibe `last_verified`,
ningún registro pasa a `ACEPTADO` y el informe no puede presentarse como informe
de resultados.

**Próximo intento:** verificar por universidad, en tandas, contrastando la
evidencia extraída contra lo que la página dice. Cinco comprobaciones por fuente:
lectura real, `published_date` frente a `fact_period`, unidad correcta,
anunciado frente a ejecutado, y advertencia de lectura en `notes`.

---

## ISSUE-002 — `src-udec-002` tiene el certificado TLS mal configurado

**Estado:** OPEN · **Impacto:** medio

`juridicasysociales.udec.cl` presenta un certificado que no cubre el nombre de
host (`SEC_E_WRONG_PRINCIPAL`). El dominio raíz falla igual. Con la verificación
desactivada la página responde: el contenido existe; lo roto es el certificado
del sitio de la Universidad de Concepción.

Importa más de lo que parece: quien siga el enlace desde el informe verá una
advertencia de seguridad, y es una de las cuatro fuentes de la UdeC.

**Próximo intento:** buscar el mismo hecho en `jur.udec.cl`, que sí responde
correctamente, y usarlo como fuente principal dejando ésta como respaldo.

---

## ISSUE-003 — `src-nacional-002` (base INDICES del CNED) rechaza la petición automatizada

**Estado:** OPEN · **Impacto:** medio

`cned.cl/institucional/bases-de-datos` devuelve `403` a una petición
automatizada. El sitio existe y es consultable desde un navegador.

Es la fuente propuesta para construir el universo nacional, de modo que sin ella
no puede fijarse cuántas carreras de Derecho hay en Chile ni qué proporción
cubre la cohorte de once.

**Próximo intento:** descargar la base manualmente desde un navegador y
versionar el archivo, no la URL.

---

## ISSUE-004 — Conflicto de fecha en `src-uchile-008`

**Estado:** OPEN · **Impacto:** bajo

El congreso internacional sobre IA en el derecho privado aparece fechado el
**09-06-2025** en `intento-2a` y el **27-05-2025** en `intento-3a`. Los dos
documentos citan la misma URL.

`published_date` queda vacío y `workflow_status` en `PROPUESTO` hasta abrir el
original. No se elige una de las dos fechas por mayoría.

---

## ISSUE-005 — Dos fuentes quedaron sin abrir por timeout

**Estado:** OPEN · **Impacto:** bajo

`src-puc-chile-009` (dirección del Programa de Derecho, Ciencia y Tecnología) y
`src-uchile-014` (Diploma para la Contraloría) constan en los documentos fuente
con la advertencia de que el original no llegó a abrirse. Quedan en `PROPUESTO`
y no en `FUENTE_ABIERTA`.

---

## ISSUE-006 — Falta el acto formal de creación de casi todas las unidades

**Estado:** OPEN · **Impacto:** alto

Nombre comunicacional y unidad administrativa formal no son lo mismo. Se
necesita resolución, organigrama o documento constitutivo de: Departamento de
Derecho y Tecnología UC, Dirección de IA y Derecho UDP, Programa IA & LegalTech
de la Central, Programa DIAT y LMIL de la PUCV, y la estructura de la Autónoma.

Del conjunto, sólo la UC tiene respaldo orgánico publicado
(`src-puc-chile-005`, estructura orgánica).

---

## ISSUE-007 — Los proyectos con financiamiento público no están verificados en ANID

**Estado:** OPEN · **Impacto:** medio

Fondecyt de la UAI (`src-uai-003`) y FONDEF de UANDES y PUCV
(`src-uandes-001`, `src-uandes-002`) constan por noticia universitaria. La
fuente gubernamental —código, monto, duración, investigadores— debe **sustituir**
a la nota de prensa, no complementarla.

---

## ISSUE-008 — Herramientas heredadas sin comprobación de vigencia

**Estado:** OPEN · **Impacto:** medio

`Docente iLex` y `IDEA UCEN` de la Universidad Central y `AyudantIA` de la UC
constan en el antecedente y en fuentes de 2025. Falta comprobar que siguen
operativas en 2026 antes de presentarlas como stock actual.

---

## ISSUE-009 — No existe línea base congelada de 2025

**Estado:** BLOQUEADO · **Impacto:** alto

El documento tratado como línea base histórica contiene actividades fechadas en
2026. Reconstruir un corte auténticamente congelado exige decidir qué se
considera «público al 31-12-2025», y esa decisión no puede tomarla una sesión
automática sobre un archivo que ya fue editado retrospectivamente.

**Requiere intervención humana.**

---

## ISSUE-010 — La integración curricular efectiva sigue sin evidencia en las once

**Estado:** OPEN · **Impacto:** alto

Hay mallas y anuncios. Faltan syllabus 2026 con obligatoriedad, semestre,
créditos y matrícula real. Sin eso, un taller optativo y una línea curricular
obligatoria se confunden. Alcanza a las once instituciones, no a una.

---

## ISSUE-011 — La cadena de documentos es PowerShell y no corre fuera de Windows

**Estado:** OPEN · **Impacto:** medio

`tools/informes/motor/` usa PowerShell 5.1, System.Drawing y Word por COM. Word
y PDF sólo pueden generarse en el equipo del autor. Los `.json` de contenido y
los formatos que no dependen de Windows —Markdown, HTML, CSV, JSON, ZIP— sí se
generan en cualquier entorno.

**Consecuencia:** mientras el PDF no exista, el botón de descarga no aparece.
Un botón que promete un archivo inexistente es peor que no tener botón.

---

## ISSUE-012 — El móvil desbordaba por los `sr-only` de la matriz

**Estado:** CERRADO · 04-09-2026 · **Impacto:** medio

A 390 px la página del informe se desplazaba 363 px en horizontal. La causa no
era la tabla ancha, que ya vivía en un contenedor con desplazamiento propio,
sino los `sr-only` de sus celdas: se implementan con `position: absolute` y sin
un ancestro posicionado dentro del contenedor cada uno se colocaba respecto de
un bloque de más arriba, arrastrando el ancho del documento.

**Resuelto** con `relative` en los tres contenedores de tabla. Comprobado con
capturas a 390 y 1280 px y en modo impresión, en las dos rutas: desbordamiento
horizontal cero.
