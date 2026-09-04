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

## ISSUE-002 — `src-udec-002` tenía el certificado TLS mal configurado

**Estado:** CERRADO el 04-09-2026 · **Impacto:** ninguno

**Cierre.** Al abrir la fuente en la verificación sustantiva, la página carga sin
error de certificado. El problema no se reproduce y `document_status` pasa de
`inaccesible` a `vigente`.

El cierre trajo un hallazgo mayor que el propio incidente: la organiza el **Centro
de Alumnas y Alumnos de Derecho Concepción**, no la Facultad. `ini-udec-002` se
reatribuye de `FACULTAD_DERECHO` a `ESTUDIANTIL`. Y la página declara «jueves 2 de
octubre» sin año, de modo que el 2025 del registro es inferencia a partir del día
de la semana, no dato publicado.

De paso quedó aclarada una confusión del relevo anterior: el respaldo en
`jur.udec.cl` que proponía buscar **es otra fuente**, `src-udec-001`, no un espejo
de ésta. Ambas quedan verificadas y son hechos distintos.

<details><summary>Diagnóstico original</summary>

`juridicasysociales.udec.cl` presenta un certificado que no cubre el nombre de
host (`SEC_E_WRONG_PRINCIPAL`). El dominio raíz falla igual. Con la verificación
desactivada la página responde: el contenido existe; lo roto es el certificado
del sitio de la Universidad de Concepción.

Importa más de lo que parece: quien siga el enlace desde el informe verá una
advertencia de seguridad, y es una de las cuatro fuentes de la UdeC.

**Próximo intento:** buscar el mismo hecho en `jur.udec.cl`, que sí responde
correctamente, y usarlo como fuente principal dejando ésta como respaldo.

</details>

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

## ISSUE-011 — Word sigue dependiendo del equipo del autor

**Estado:** OPEN · **Impacto:** bajo · *reducido el 04-09-2026*

`tools/informes/motor/` usa PowerShell 5.1, System.Drawing y Word por COM, y por
tanto sólo corre en Windows con Word instalado.

**El PDF dejó de depender de eso.** Se imprime del HTML del propio paquete con
Chromium, desde `scripts/informe-01/07-exportar.mts`, de modo que documento y web
salen del mismo modelo y no pueden divergir. `playwright-core` es dependencia de
desarrollo y el navegador se toma del sistema —Chrome o Edge— o de
`CHROMIUM_PATH`. Si no hay ninguno, el paquete sale sin PDF, el manifiesto lo
declara y el sitio no dibuja el botón.

**Queda Word**, que es el único formato que aún exige el equipo del autor.

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

---

## ISSUE-013 — Cinco títulos del registro no eran los de la página

**Estado:** CERRADO el 04-09-2026 · **Impacto:** medio

La verificación encontró cinco fuentes cuyo `title` no coincidía con el titular
publicado. Dos de ellas cambiaban el sentido del registro:

- **`src-pucv-007`** figuraba como «Universidad presentó decálogo para el uso ético
  de la inteligencia artificial». La página se titula «Con gran participación de
  académicas y académicos se realizó Día de la IA»: el decálogo se presenta dentro
  de un evento y no es el objeto de la publicación. Y «sugiere recomendaciones»:
  es lineamiento, no política.
- **`src-ucentral-003`** figuraba por su URL, `legal-tech`. La página se titula
  «Programa de IA y LegalTech» y nombra la IA de forma explícita y reiterada. El
  registro subestimaba a la Universidad Central.

Los otros tres —`src-uchile-016`, `src-uandes-003`, `src-pucv-010`— eran títulos
truncados o parafraseados. Todos corregidos.

**Lección para el protocolo:** clasificar una unidad por el segmento de su URL es
una fuente de error sistemático, y el sesgo que produce no es aleatorio: penaliza
a las instituciones cuya página se investigó con menos detalle.

---

## ISSUE-014 — Cuatro fechas del registro no constaban en la fuente

**Estado:** CERRADO el 04-09-2026 · **Impacto:** medio

- `src-udec-004` (GenIA UdeC) traía `2026-02-10`. **La página no declara ninguna
  fecha.** Las actividades datadas que muestra son de enero de 2025.
- `src-uchile-015` (lineamientos de tesis) traía `2026` con precisión de año. **La
  página no declara fecha.**
- `src-ucentral-004` traía `FECHA_NO_DECLARADA`. La página **sí** declara
  27-08-2025: la precisión sube.
- `src-unab-004` traía `FECHA_NO_DECLARADA`. La página declara inicio el
  28-08-2026.

Dos fechas se borraron por falta de respaldo y dos se ganaron. El kit §14 es
explícito —«no se inventan día ni mes»— y el corpus lo había incumplido en dos
registros.

---

## ISSUE-015 — El LMIL cambió de unidad de dependencia entre 2022 y 2025

**Estado:** OPEN · **Impacto:** medio

`src-pucv-001` (2022) sitúa el Legal Management Innovation Lab en la **Dirección
de Incubación y Negocios de la PUCV**, una unidad central, y no menciona la
inteligencia artificial ni una vez: habla de transformación digital e innovación
legal. `src-pucv-011` (2025) lo describe como laboratorio «de la Escuela de
Derecho PUCV».

No es un error del registro: es un traslado orgánico documentado por dos fuentes
en fechas distintas, y el informe debe narrarlo como trayectoria en lugar de
elegir una de las dos versiones.

**Lo que falta:** el acto que formaliza el traslado. Sin él, la fecha en que el
LMIL pasa a depender de Derecho es desconocida.

---

## ISSUE-016 — La única medición de efecto del corpus está fuera de las Facultades

**Estado:** OPEN · **Impacto:** alto

`src-unab-003` publica, sobre MIAsistentes, «20% más aprobación» en estudiantes
que usaron la herramienta más de 30 veces, sobre más de 15.000 estudiantes y
450.000 interacciones desde 2024. Es la única de las 74 fuentes con una medición
de resultado.

No mueve `clm-cohorte-001` —que habla de evaluación de efecto sobre el
**aprendizaje jurídico**, y ésta es universitaria y no jurídica—, y además es
correlacional y no causal: quien usa una herramienta treinta veces ya se
diferencia de quien no la usa.

**Por qué importa igual:** lo más cercano al nivel 4 de la escalera que existe en
el corpus lo produjo una vicerrectoría de transformación digital, no una Facultad
de Derecho. El informe está obligado a discutirlo en lugar de esconderlo detrás
de la redacción afortunada de su propia afirmación.

**Próximo paso:** buscar la ficha metodológica de esa medición. Sin diseño,
muestra y control declarados, la cifra no es publicable como evidencia de efecto
ni siquiera fuera del ámbito jurídico.
