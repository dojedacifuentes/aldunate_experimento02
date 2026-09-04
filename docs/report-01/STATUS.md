# STATUS — Informe 01

Tablero de fases. `[x]` terminada · `[~]` parcial · `[ ]` pendiente ·
`[!]` bloqueada.

**Nunca marcar `[x]` algo parcialmente terminado.**

Rama `informe-01/v0.7.0` · versión **v0.7.0** · corte del estudio 01-09-2026 ·
actualizado 04-09-2026

---

## Fase 0 — Git, recuperación y publicación

- [x] Rama `informe-01/v0.5.0` restaurada y empujada
- [x] PR #20, #21 y #22 fusionados con CI en verde
- [x] Despliegue de producción comprobado en la v0.6.0
- [ ] **Fusionar la v0.7.0.** El trabajo vive en rama y producción sigue en 0.6.0

## Fase 1 — Corpus y datos

- [x] Dataset canónico poblado: 11 · 74 · 53 · 75 · 14
- [x] Integridad referencial comprobada por el compilador y por las pruebas
- [x] Constructores en Python congelados (DEC-112)
- [x] Columna `mechanism_type` añadida sin recodificar ningún otro campo

## Fase 2 — Verificación sustantiva

- [~] **38 de 74 fuentes contrastadas (51%).** Sin avance en esta versión
- [x] Once registros corregidos por divergencia con su página
- [x] Cuaderno de verificación versionado, fuente por fuente
- [ ] **36 fuentes pendientes**
- [!] **ISSUE-018 · el reparto está sesgado.** Neutralizado *visualmente* por
      DEC-119, que mete la desigualdad dentro de cada celda. **No resuelto**: la
      Universidad Autónoma sigue con cero fuentes contrastadas
- [!] **ISSUE-019 · verificación asistida frente a validación humana.** Requiere
      decisión editorial del autor
- [!] **ISSUE-021 · `routes_missing` pasó a ser normativo y no está verificado**
- [!] ISSUE-003 · el CNED devuelve 403; exige descarga manual

## Fase 3 — Afirmaciones

- [x] 14 afirmaciones con razonamiento, contraevidencia, límites y confianza
- [x] Ninguna aceptada: `ACEPTADO` exige firma humana
- [ ] Revisar las cuatro afirmaciones cuyas fuentes siguen sin contrastar

## Fase 4 — Análisis

- [x] Discusión en seis bloques, separando hecho de inferencia
- [x] Siete conclusiones, cada una citando las afirmaciones que la sostienen
- [x] Ocho limitaciones y agenda de siete preguntas
- [x] **Análisis de sensibilidad publicado**: cinco conclusiones intactas, dos
      matizadas, ninguna reforzada por el cambio de método
- [x] Hipótesis editoriales contrastadas contra los datos y publicadas con la
      evidencia a favor y en contra
- [ ] **Reescribir la discusión a la luz de la capa de capacidades.** Hay
      hallazgos nuevos que la sección 4 todavía no discute
- [ ] Revisar C-4 y C-5 tras recorrer las rutas pendientes (ISSUE-022)

## Fase 5 — Arquitectura editorial

- [x] Resumen ejecutivo reescrito: siete párrafos, con hallazgos y límites
- [x] **Los hallazgos van antes de la introducción y de las fichas**
- [x] Siete hallazgos con dato, lectura y límite, comprobados por una prueba
- [x] Anexos: fichas, matriz de dimensiones, afirmaciones, lagunas, auditoría y
      registro de fuentes
- [x] Implicancias separadas de las conclusiones

## Fase 6 — Visualizaciones

- [x] **Motor de gráficos propio**, en funciones puras compartidas por el sitio y
      el exportador. El PDF tenía cero figuras y ahora tiene las nueve
- [x] **Matriz de capacidades**: el comparador principal, sin ranking ni suma
- [x] **Cobertura y capacidad separadas visualmente** y cruzadas en una figura
      que demuestra que no coinciden
- [x] Matriz de dimensiones revisada y bajada a anexo
- [x] Legibilidad en web, en A4 y a 375 px, con desbordamiento cero
- [x] **Línea de tiempo de hitos** — la visualización declarada que faltaba
- [x] Cada figura declara pregunta, título de lectura, fuente, nota y alternativa

## Fase 7 — PUCV en contexto

- [x] Siete hechos favorables verificados, con su fuente
- [x] Seis brechas, cada una con comparador y alcance declarado
- [x] Doble revisión publicada
- [x] **Comparador de mecanismos**: qué instrumento resolvió esto quien ya lo
      resolvió, con institución y fuente
- [x] **Mapa de desarrollo institucional**, disponible para las once y no sólo
      para la PUCV
- [x] Sesgo de sobrerrepresentación neutralizado dentro de la matriz (DEC-119)

## Fase 8 — Redacción académica

- [x] Introducción, objetivos y metodología, ahora en diez apartados
- [x] Declaración de intereses (DEC-113)
- [x] Cifras interpoladas desde el dataset: la prosa no escribe números a mano
- [x] Pasada de edición con la arquitectura nueva
- [ ] Pasada de edición de la discusión, pendiente de datos nuevos

## Fase 9 — Exportaciones

- [x] MD, HTML, PDF A4 de 72 páginas, seis CSV, JSON, manifiesto, checksums, ZIP
- [x] PDF impreso del mismo HTML, con las nueve figuras en vector
- [x] **Portada**, con marca gráfica derivada de la propia matriz
- [x] Integridad verificada descargando por HTTP
- [ ] Verificar los checksums **desde producción** tras fusionar
- [ ] Word — depende del equipo del autor (ISSUE-011)

## Fase 10 — QA

- [x] `npm run verify`: 0 errores de lint, 8 avisos preexistentes, 142 pruebas,
      18 rutas
- [x] Auditoría de consistencia entre dataset, web, HTML, Markdown y ficha: sin
      inconsistencias
- [x] Responsive a 375 px: desbordamiento horizontal cero
- [x] Figuras legibles en móvil: se desplazan en vez de encogerse
- [x] Fe de erratas de la v0.6.0 aplicada
- [ ] Revisión humana del documento completo antes de enviarlo al destinatario

## Fase 11 — Publicación

- [ ] **Abrir el PR de la v0.7.0 y fusionarlo con CI en verde**
- [ ] Comprobar el despliegue de producción
- [x] Versiones anteriores conservadas y accesibles
