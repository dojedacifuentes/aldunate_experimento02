# TASKS — Informe 01

Tareas pequeñas y retomables. Cada una declara entradas, salidas, archivos y
criterio de terminado. Una tarea que no cabe entre dos checkpoints se divide.

---

## Terminadas

### T-001 · Auditar el repositorio · `[x]`
Salida: mapa de rutas, componentes y cadena de informes. Sin archivos nuevos.

### T-002 · Inventariar el corpus de investigación · `[x]`
**Entradas:** los cinco documentos de `sources/investigacion-profunda/`.
**Salidas:** 74 URL únicas normalizadas; discrepancia con las 72 declaradas
identificada y explicada (DEC-106).
**Terminado:** cada URL extraída tiene registro y ningún registro carece de URL.

### T-003 · Poblar el registro de fuentes · `[x]`
**Salidas:** `canonical/dataset/fuentes.csv`, 74 filas.
**Terminado:** IDs y URL únicos, correspondencia 1:1 con la extracción, ningún
`verified_by` relleno.

### T-004 · Normalizar iniciativas · `[x]`
**Salidas:** `canonical/dataset/iniciativas.csv`, 53 iniciativas deduplicadas.
**Terminado:** toda `source_id` citada existe y ninguna iniciativa alcanza el
nivel 4 de la escalera.

### T-005 · Completar `universidades.csv` · `[x]`
Once filas con `unit_name` tomado de la propia fuente institucional y `status`
en `PENDIENTE_VERIFICACION`.

### T-006 · Construir `evidencias.csv` · `[x]`
75 evidencias, una por par fuente–iniciativa, con enunciado factual acotado y
limitación propia. Sin evidencias huérfanas, sin `last_verified`.

### T-007 · Calcular cobertura de investigación · `[x]`
`cobertura.csv` sobre las trece rutas del protocolo. Piloto: 9,7 rutas y 14
fuentes de media. Las otras ocho: 4,0 rutas y 3,8 fuentes. Razón 3,7:1.

### T-008 · Construir `afirmaciones.csv` · `[x]`
14 afirmaciones: 10 `FACT`, 2 `SIGNAL`, 1 `INFERENCE`, 1 `PENDING`. Las
`evidence_ids` se consultan sobre `evidencias.csv`, no se escriben a mano.

---

## Pendientes, en orden

### T-009 · Prueba A y prueba B de control de sesgo · `[~]`
**Entradas:** `afirmaciones.csv`, en especial `clm-pucv-001` y `clm-pucv-002`.
**Terminado cuando:** toda conclusión desfavorable a la PUCV tenga
contraevidencia enlazada, y ninguna capacidad de otra universidad esté atribuida
a su Facultad de Derecho sin que la fuente lo diga.

### T-010 · Compilar los CSV a datos tipados · `[ ]`
**Entradas:** los seis CSV del dataset.
**Salidas:** script de compilación y módulo tipado en `src/data/`, más los tipos
en `src/types/`.
**Archivos:** `scripts/informe-01/`, `src/data/`, `src/types/index.ts`.
**Terminado cuando:** `npm run typecheck` pasa y ningún contador del sitio está
escrito a mano.

### T-011 · Componente base de ficha institucional · `[ ]`
Reutilizando `Surface`, `Badge`, `MetaRow`, `EpistemicTag` y los tokens de
`globals.css`. Sin colores hardcodeados.

### T-012 · Matriz de evidencia localizada · `[ ]`
Universidades × ocho dimensiones. Cada celda declara evidencias localizadas y
cobertura, **nunca** un puntaje de madurez ni un orden (DEC-102). Con
alternativa tabular y valor textual además del color.

### T-013 · Cobertura de investigación · `[ ]`
Visualización separada de la matriz, que haga visible que la asimetría mide
esfuerzo de investigación.

### T-014 · Escalera de institucionalización · `[ ]`
Distribuye **iniciativas**, no universidades (DEC-109). El nivel 4 aparece vacío
y esa casilla vacía es el hallazgo.

### T-015 · Mapa de direcciones · `[ ]`
`IA_PARA_DERECHO` · `DERECHO_DE_IA` · `AMBOS` · `ADYACENTE`.

### T-016 · Línea de tiempo · `[ ]`
Hitos fechados. Las fuentes sin fecha declarada no se inventan: se omiten y se
declara cuántas son.

### T-017 · Fichas de las once instituciones · `[ ]`
Una tarea por institución si es necesario. Cada ficha distingue verificado,
parcial y pendiente, y declara su cobertura.

### T-018 · Sección «PUCV: de las iniciativas a la capacidad» · `[ ]`
Matriz existe / parcial / no demostrado públicamente / próximo salto. Reconoce
la evidencia favorable antes de contrastar.

### T-019 · Bloques de lagunas y auditoría de línea base · `[ ]`
L-1 a L-10 y la auditoría aritmética del antecedente, sin corregirlo en
silencio.

### T-020 · Ficha del informe en `src/data/reports.ts` · `[ ]`
Versión 0.5.0, changelog, fe de erratas de la v0.4.0, contadores derivados.

### T-021 · Exportaciones · `[ ]`
Markdown, HTML, CSV, JSON y ZIP con manifiesto y controles de integridad. Word
y PDF quedan fuera del entorno: ISSUE-011.

### T-022 · Validadores y QA · `[ ]`
Integridad referencial en vitest, QA editorial de expresiones peligrosas,
`npm run verify`, responsive e impresión.

### T-023 · Entrega · `[ ]`
Revisión de `src/data/trabajos.ts` (`CLAUDE.md` §12) y bundle de git con los
comandos de publicación.
