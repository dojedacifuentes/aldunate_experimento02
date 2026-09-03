# TASKS — Informe 01

Tareas pequeñas y retomables. Cada una declara entradas, salidas, archivos y
criterio de terminado. Una tarea que no cabe entre dos checkpoints se divide.

---

## Terminadas

### T-001 · Auditar el repositorio · `[x]`
Salida: mapa de rutas, componentes y cadena de informes. Sin archivos nuevos.

### T-002 · Inventariar el corpus de investigación · `[x]`
**Entradas:** `content/reports/01_ia_escuelas_derecho_chile/sources/investigacion-profunda/*.md`
**Salidas:** 74 URL únicas normalizadas; discrepancia con las 72 declaradas
identificada y explicada (DEC-106).
**Terminado cuando:** cada URL extraída tiene un registro y ningún registro
carece de URL extraída.

### T-003 · Poblar el registro de fuentes · `[x]`
**Salidas:** `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/fuentes.csv`, 74 filas.
**Terminado cuando:** IDs únicos, URL únicas, correspondencia 1:1 con la
extracción, y ningún `verified_by` relleno.

### T-004 · Normalizar iniciativas · `[x]`
**Salidas:** `canonical/dataset/iniciativas.csv`, 53 iniciativas deduplicadas.
**Terminado cuando:** toda `source_id` citada existe en `fuentes.csv` y ninguna
iniciativa alcanza el nivel 4.

---

## Pendientes, en orden

### T-005 · Completar `universidades.csv` · `[ ]`
**Entradas:** plantilla con los once `university_id`; nombres de unidad que
aparecen en las fuentes.
**Salidas:** `canonical/dataset/universidades.csv` con `unit_name` y `status`.
**Terminado cuando:** las once filas declaran el nombre real de la Facultad,
Escuela o carrera tal como lo escribe su propia fuente, y ninguna inventa uno.

### T-006 · Construir `evidencias.csv` · `[ ]`
**Entradas:** `fuentes.csv`, `iniciativas.csv`, los cinco documentos fuente.
**Salidas:** una fila por evidencia con `evidence_id`, `source_id`,
`initiative_id`, `dimension`, `direction`, `institutional_level`,
`temporal_status`, `factual_statement`, `limitations`.
**Terminado cuando:** no hay evidencias huérfanas y cada `factual_statement` es
una descripción acotada, no una interpretación.

### T-007 · Calcular cobertura de investigación · `[ ]`
**Entradas:** `fuentes.csv`, `evidencias.csv`, las trece rutas del protocolo
(kit §13).
**Salidas:** `canonical/dataset/cobertura.csv` con rutas completadas, fuentes,
evidencias y dimensiones cubiertas por institución.
**Terminado cuando:** la cobertura es un indicador **separado** de cualquier
lectura de madurez, y el piloto de tres aparece explícitamente marcado.

### T-008 · Construir `afirmaciones.csv` · `[ ]`
**Salidas:** afirmaciones con clasificación, evidencias, contraevidencia,
razonamiento, limitaciones y confianza.
**Terminado cuando:** ninguna inferencia aparece rotulada como hecho, cada
afirmación tiene al menos una `evidence_id`, y las de cohorte —ausencia de
evaluación de efecto, ausencia de prueba curricular— están escritas como
ausencia de evidencia pública y no como inexistencia.

### T-009 · Compilar los CSV a datos tipados · `[ ]`
**Salidas:** script en `scripts/informe-01/` y módulo tipado en `src/data/`.
**Terminado cuando:** `npm run typecheck` pasa y ningún contador del sitio está
escrito a mano.

### T-010 a T-020 · Componentes e implementación
Una tarea por pieza, en este orden: componente base de ficha, matriz de
evidencia, cobertura, escalera, mapa de direcciones, línea de tiempo, sección
PUCV, bloque de lagunas, auditoría de línea base, ficha del informe, QA de
fichas.

### T-021 · Exportaciones · `[ ]`
Markdown, HTML, CSV, JSON y ZIP con manifiesto. Word y PDF quedan fuera del
entorno: ver ISSUE-011.

### T-022 · Validadores y QA · `[ ]`
Pruebas de integridad referencial en vitest, QA editorial de expresiones
peligrosas, `npm run verify`.

### T-023 · Changelog, tablero y entrega · `[ ]`
Entrada v0.5.0, fe de erratas de la v0.4.0, revisión de `src/data/trabajos.ts`
y bundle de git.
