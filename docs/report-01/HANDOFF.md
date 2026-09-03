# HANDOFF — Informe 01

**Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho
en Chile.** Documento de relevo entre sesiones. Léelo entero antes de tocar nada.

Actualizado: **03-09-2026**

---

## Objetivo

Convertir el Informe 01 de una ficha con método declarado y registro vacío en
una publicación digital con datos canónicos poblados, trazables y descargables,
sin cruzar la línea que el propio método prohíbe: **no hay informe de
resultados mientras la verificación sustantiva de las fuentes no exista.**

---

## Estado actual

Existe, por primera vez, un **dataset canónico poblado y reproducible** del
Informe 01 en `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/`:

| Archivo | Filas | Qué contiene |
|---|---:|---|
| `universidades.csv` | 11 | Cohorte cerrada, con el nombre real de cada unidad |
| `fuentes.csv` | 74 | Fuentes públicas únicas con estado editorial real |
| `iniciativas.csv` | 53 | Iniciativas deduplicadas, con escalera, atribución y trayectoria |
| `evidencias.csv` | 75 | Una por par fuente–iniciativa, con su límite propio |
| `cobertura.csv` | 11 | Rutas del protocolo recorridas, separado de la madurez |
| `afirmaciones.csv` | 14 | 10 FACT · 2 SIGNAL · 1 INFERENCE · 1 PENDING |

Los cinco scripts de `scripts/informe-01/` reconstruyen el dataset entero y
fallan si la integridad referencial se rompe.

**Los tres números que hay que conocer antes de tocar nada:**

- Ninguna de las 53 iniciativas alcanza el nivel 4 de la escalera. Es la tercera
  ronda independiente que llega a la misma ausencia.
- La cobertura del piloto es 3,7 veces la del resto en fuentes y 2,4 veces en
  rutas del protocolo recorridas. Por eso no hay comparación nacional.
- Ninguna de las 74 fuentes es contraste externo: la ruta 13 del protocolo está
  sin recorrer en las once.

Ninguna afirmación es publicable todavía. `sourceIds` y `claimIds` de
`src/data/reports.ts` **siguen vacíos** y deben seguirlo hasta que la
verificación sustantiva exista (DEC-108, ISSUE-001).

El sitio todavía no consume el dataset: la ficha publicada sigue siendo la
v0.4.0.

---

## Último punto completado

`afirmaciones.csv` generado y validado: 14 afirmaciones cuyas `evidence_ids` se
consultan sobre `evidencias.csv` en vez de escribirse a mano, de modo que una
afirmación no puede citar una evidencia inexistente.

---

## Próxima tarea exacta

T-010: escribir el compilador de los seis CSV a datos tipados. Crear
`scripts/informe-01/06-compilar-a-typescript.mjs`, que lea
`canonical/dataset/*.csv` y emita `src/data/informe01.ts` con los tipos
declarados en `src/types/index.ts` —`Informe01Universidad`, `Informe01Fuente`,
`Informe01Iniciativa`, `Informe01Evidencia`, `Informe01Cobertura`,
`Informe01Afirmacion`— más los contadores derivados. Ningún contador se escribe
a mano: el hero del informe debe leerlos de ahí. Después `npm run typecheck`.

---

## Archivos modificados recientemente

```
docs/report-01/HANDOFF.md            (nuevo)
docs/report-01/STATUS.md             (nuevo)
docs/report-01/TASKS.md              (nuevo)
docs/report-01/DECISIONS.md          (nuevo)
docs/report-01/ISSUES.md             (nuevo)
docs/report-01/progress.json         (nuevo)
content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/*.csv   (seis archivos nuevos)
scripts/informe-01/                  (cinco constructores y su README)
```

---

## Archivos canónicos

Fuente de verdad del Informe 01, en este orden:

1. `content/reports/01_ia_escuelas_derecho_chile/canonical/kit-canonico-v1.0.0.md`
   — protocolo, cohorte, vocabularios controlados, estados editoriales.
2. `content/reports/01_ia_escuelas_derecho_chile/canonical/manifest.json`
3. `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/*.csv`
   — **los datos**. Todo lo que el sitio muestre debe derivarse de aquí.
4. `content/reports/01_ia_escuelas_derecho_chile/sources/investigacion-profunda/*.md`
   — los cinco documentos de origen, versionados y no editables.
5. `tools/informes/informe-01/corpus-de-evidencia.md` y `verificacion-fuentes.md`
   — el cuaderno de trabajo de las rondas 1 y 2.

`content/research/source-registry.csv` y `evidence-matrix.csv` pertenecen al
Informe 02 y **no** son el registro del 01.

---

## Decisiones metodológicas vigentes

Las diez están en `DECISIONS.md`. Las cuatro que más veces se rompen:

- **DEC-102** · ninguna comparación ni ranking nacional. La cobertura es
  desigual por diseño; comparar produciría un ranking del trabajo de campo.
- **DEC-105** · universidad no es Facultad. Toda evidencia se atribuye a la
  unidad que la fuente identifica.
- **DEC-108** · la verificación sustantiva no se delega y no está hecha.
- **DEC-109** · la escalera 0–4 se aplica a la iniciativa, nunca a la
  universidad, y no se promedia.

---

## Qué NO debe hacerse

- **No** rellenar `sourceIds` ni `claimIds` en `src/data/reports.ts`.
- **No** publicar tabla de posiciones, ranking ni puntaje agregado.
- **No** presentar el informe como informe de resultados: es mapeo de evidencia.
- **No** arrastrar puntuaciones del informe antecedente ni corregirlas en
  silencio: cuatro de sus totales no cuadran con sus propias puntuaciones.
- **No** convertir una ausencia de evidencia pública en inexistencia.
- **No** reescribir hacia atrás el changelog de la v0.4.0 por el cambio de 72 a
  74 fuentes: se agrega fe de erratas.
- **No** editar los cinco documentos de `sources/investigacion-profunda/`.
- **No** intentar generar Word ni PDF fuera de Windows: la cadena es PowerShell
  5.1 con Word por COM (ISSUE-011).
- **No** hacer push, commit ni cambios en repositorios distintos de
  `dojedacifuentes/aldunate_experimento02`.

---

## Pendientes, por prioridad

1. Capa de datos tipada y compilación CSV → TS (T-010).
2. Componentes de la publicación, uno por uno (T-011 a T-019).
3. Ficha del informe con la versión 0.5.0 y la fe de erratas (T-020).
4. Exportaciones y manifiesto (T-021).
5. QA, `npm run verify` (T-022).
6. Bundle de entrega (T-023).

---

## Bloqueos

- **ISSUE-001** · verificación sustantiva de las 74 fuentes. Es trabajo humano
  por definición metodológica, no un paso automatizable.
- **ISSUE-009** · reconstruir una línea base congelada de 2025 exige una
  decisión humana sobre un archivo ya editado retrospectivamente.
- **ISSUE-011** · Word y PDF sólo pueden generarse en el equipo del autor.

---

## Tests

Al corte de este relevo, sobre la rama `informe-01/v0.5.0`:

| | Estado | Cuándo |
|---|---|---|
| lint | no ejecutado en esta sesión | — |
| typecheck | no ejecutado en esta sesión | — |
| tests | no ejecutado en esta sesión | — |
| build | no ejecutado en esta sesión | — |

Los cambios hasta aquí son datos y documentación: no tocan el bundle. La
primera ejecución de `npm run verify` corresponde a T-010, cuando exista código.

---

## Git

- **Rama:** `informe-01/v0.5.0`, creada desde `origin/main` en `057ad4b`.
- **Último commit:** ver `git log --oneline -1`.
- **Cambios sin commit:** ver `git status --short`.

El árbol local del autor está detrás del remoto. Se trabaja siempre desde
`origin/main` tras `git fetch`, nunca desde el árbol local.

---

## Cómo continuar

```bash
git fetch origin
git status --short
git log --oneline -5
cat docs/report-01/progress.json
```

Después, T-010 de `TASKS.md`. No repitas las fases 0 a 3: están cerradas y sus
decisiones están registradas en `DECISIONS.md`.
