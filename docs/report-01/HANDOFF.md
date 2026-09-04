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

El sitio **ya consume el dataset**. `/informes/ia-escuelas-derecho-chile` monta
la publicación completa —hallazgos, cobertura, matriz, escalera, taxonomía,
sección PUCV, afirmaciones, lagunas y auditoría de la línea base— y
`/informes/ia-escuelas-derecho-chile/instituciones` sirve las once fichas.

Todo se renderiza en el servidor: ni un componente de cliente, ni un gráfico que
necesite hidratarse. Lo que se pliega usa `<details>` nativo, de modo que la
página funciona impresa y con el JavaScript apagado.

Lo que falta para publicar la v0.5.0: la ficha de `src/data/reports.ts` sigue
declarando la v0.4.0 con 72 fuentes.

---

## Último punto completado

Publicación de la v0.5.0 cerrada de extremo a extremo: dataset, capa tipada,
componentes, ficha del informe, descargas con manifiesto y controles de
integridad, pruebas de integridad y de control editorial, y un defecto de
maquetación en móvil encontrado con capturas y corregido (ISSUE-012).

`npm run verify` en verde: typecheck, lint (0 errores, 8 avisos preexistentes
del código donado del juego), 115 pruebas y build de 18 rutas.

---

## Próxima tarea exacta

Empezar la verificación sustantiva por la Universidad de Concepción, que es la
tanda más corta y la que tiene el problema más concreto: abrir sus cuatro
fuentes —`src-udec-001` a `src-udec-004`—, contrastar la evidencia extraída
contra lo que cada página dice, y buscar en `jur.udec.cl` un respaldo para
`src-udec-002`, cuya única URL tiene el certificado mal configurado (ISSUE-002).

Para cada fuente verificada: escribir `verified_by` y la fecha en
`canonical/dataset/fuentes.csv`, `last_verified` en las evidencias que sostiene,
y subir su `workflow_status` a `CONTRASTADO`. Después
`node scripts/informe-01/06-compilar-a-typescript.mjs` y `npm run verify`.

**Ojo:** dos pruebas de `src/data/informe01.test.ts` fallarán a propósito en
cuanto exista la primera verificación —comprueban que hoy no hay ninguna—.
Cuando eso ocurra, la prueba se actualiza para exigir coherencia entre
`verified_by` y `last_verified`, no se borra.

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

1. **Verificación sustantiva de las 74 fuentes** (ISSUE-001). Es lo único que
   desbloquea el paso de mapeo de evidencia a informe de resultados.
2. Los tres `.json` de contenido para la cadena PowerShell, y con ellos Word y
   PDF (ISSUE-011).
3. Línea de tiempo de hitos: la única visualización declarada que falta.
4. Cerrar ISSUE-002 a ISSUE-008, que son comprobaciones concretas y acotadas.
5. Igualar la cobertura de las ocho universidades fuera del piloto. Sin eso no
   habrá comparación nacional por muchas fuentes que se acumulen.

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
| lint | 0 errores · 8 avisos preexistentes | 04-09-2026 |
| typecheck | pasa | 04-09-2026 |
| tests | 115 pruebas en 8 archivos, todas pasan | 04-09-2026 |
| build | pasa · 18 rutas, 3 de ellas del Informe 01 | 04-09-2026 |
| responsive | capturas a 390 y 1280 px · desbordamiento horizontal cero | 04-09-2026 |
| impresión | comprobada con `emulateMedia('print')` | 04-09-2026 |

Los nueve avisos de lint son los del código donado del juego y uno de
`useSpriteAnimation`. Están documentados en `CLAUDE.md` §10 y no se tocan.

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

Después, la verificación sustantiva por tandas. No repitas las fases 0 a 3: están cerradas y sus
decisiones están registradas en `DECISIONS.md`.
