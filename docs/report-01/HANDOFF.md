# HANDOFF — Informe 01

Documento de relevo entre sesiones. **Léelo entero antes de tocar nada.** Está
escrito para que no necesites la conversación que lo produjo.

Actualizado: **04-09-2026** · versión **v0.6.0** · `main` en `d329c86`

---

## A · Qué es esto y para quién

**«Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho
en Chile».** Un mapeo comparado de evidencia pública sobre once instituciones
chilenas, con fecha de corte al 1 de septiembre de 2026.

**Destinatario:** profesor **Eduardo Aldunate Lizana**. El documento debe servir
para una discusión institucional seria dentro de la PUCV, no para halagar ni para
acusar.

**Autor:** Diego Hernán Ojeda Cifuentes. No es una publicación oficial de la PUCV.

La pregunta que el informe existe para hacer discutible:

> Si la PUCV ya posee iniciativas relevantes y cierta continuidad, ¿hasta qué
> punto se han convertido en capacidades institucionales transversales,
> formalizadas, sostenibles y evaluables, frente a Facultades que ya desarrollan
> estructuras, gobernanza, currículo, adopción o cobertura?

---

## B · Estado actual

**v0.6.0, borrador académico para revisión.** Publicado y en producción.

| | |
|---|---|
| Rama | `main` |
| HEAD | `d329c86f18496394baa4c22a207461e8e436e1ca` |
| Base heredada | `057ad4b` |
| Producción | https://aldunateexperimento02.vercel.app/informes/ia-escuelas-derecho-chile |
| Fichas | `/informes/ia-escuelas-derecho-chile/instituciones` |
| PR fusionados | [#20](https://github.com/dojedacifuentes/aldunate_experimento02/pull/20) · [#21](https://github.com/dojedacifuentes/aldunate_experimento02/pull/21) |

**Ramas preservadas en el remoto**, no borrar sin motivo: `informe-01/v0.5.0`
(`a1cc758`, el estado heredado intacto) y `informe-01/borrador-aldunate`
(`6dffd0f`, el historial completo de esta sesión antes del squash).

**Datos, derivados del dataset y no de memoria:**

| | |
|---:|---|
| 11 | universidades (cohorte cerrada) |
| 74 | fuentes públicas únicas · 72 institucionales + 2 de universo nacional |
| **38** | **fuentes contrastadas (51%)** |
| 53 | iniciativas deduplicadas |
| 75 | evidencias |
| 14 | afirmaciones · 10 FACT · 2 SIGNAL · 1 INFERENCE · 1 PENDING |
| 0 | registros `ACEPTADO` |
| 19 / 21 / 13 / **0** | iniciativas por peldaño de la escalera 1 / 2 / 3 / **4** |
| 6 de 8 | dimensiones con evidencia |
| 3,7 : 1 | razón de cobertura piloto frente al resto |

**Validaciones al cierre:** lint 0 errores y 8 avisos preexistentes del código
donado del juego · **127 pruebas** · build de 18 rutas · paquete con PDF A4 de
**56 páginas**, HTML, Markdown, seis CSV, JSON, manifiesto, checksums y ZIP ·
**los once checksums verifican descargando desde producción.**

---

## C · Qué se hizo en esta sesión

Sólo lo terminado.

1. **Se recuperó la v0.5.0 desde el bundle y se empujó al remoto.** La sesión
   anterior no tuvo permisos; sus nueve commits vivían sólo en un archivo en la
   carpeta de Descargas del autor.
2. **Se verificaron 38 de las 74 fuentes.** Siete campos contrastados contra la
   publicación original. **Once registros no decían lo que su página dice.**
3. **Se corrigió el dataset** y se reescribieron dos afirmaciones
   (`clm-cohorte-005`, `clm-cohorte-008`), se matizó una tercera
   (`clm-cohorte-003`), se bajó `ini-uchile-002` del peldaño 3 al 2 y se
   reatribuyó `ini-udec-002` a `ESTUDIANTIL`.
4. **Se añadió la capa académica**: introducción, objetivos, metodología en nueve
   apartados, discusión en seis, sección PUCV con doble revisión publicada, siete
   conclusiones, ocho limitaciones y agenda de siete preguntas.
5. **Se enmendó DEC-108** (→ DEC-111) y se congelaron los constructores en Python
   (DEC-112), que no pueden ejecutarse en este equipo.
6. **Se declaró el conflicto de interés** (DEC-113).
7. **Se corrigió un defecto de integridad** que hacía fallar seis checksums al
   descargar el paquete de producción (ISSUE-017).

---

## D · Dónde están los datos

**Fuente de verdad, en este orden:**

| Qué | Ruta |
|---|---|
| Protocolo, cohorte, vocabularios | `content/reports/01_ia_escuelas_derecho_chile/canonical/kit-canonico-v1.0.0.md` |
| **Los datos** | `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/*.csv` |
| **La prosa** | `src/data/informe01-borrador.ts` · `src/data/informe01-pucv.ts` |
| Bloques editoriales | `src/data/informe01-editorial.ts` |
| Capa tipada compilada | `src/data/informe01.ts` *(generada, no editar a mano)* |
| Selectores y cifras | `src/lib/informe01.ts` |
| Ficha del informe | `src/data/reports.ts` |
| Documentos de origen | `content/reports/01_ia_escuelas_derecho_chile/sources/investigacion-profunda/` |
| **Cuaderno de verificación** | `tools/informes/informe-01/verificacion-p1-2026-09-04.md` |
| Cola de prioridad | `tools/informes/informe-01/prioridad-verificacion.json` |
| Compilador CSV → TS | `scripts/informe-01/06-compilar-a-typescript.mjs` |
| Exportador | `scripts/informe-01/07-exportar.mts` |
| Paquete publicado | `public/descargas/informe-01-borrador-academico-v0.6.0/` |
| Componentes | `src/components/informe01/` |
| Página | `src/app/informes/[slug]/page.tsx` |

`content/research/source-registry.csv` pertenece al **Informe 02** y no es el
registro del 01.

---

## E · Decisiones metodológicas vigentes

Las diecisiete están en `DECISIONS.md`. Las que más veces se rompen:

- **DEC-102** · **ninguna comparación ordinal ni ranking** mientras la cobertura
  sea desigual. Ordenar mediría el trabajo de campo.
- **Cobertura de investigación ≠ madurez institucional.** Son indicadores
  distintos y se publican por separado.
- **Fuente ≠ evidencia ≠ iniciativa ≠ afirmación.** Cuatro fuentes sobre un mismo
  hecho siguen siendo una iniciativa.
- **DEC-105 · universidad ≠ Facultad.** Una licencia institucional disponible no
  es adopción de Derecho.
- **IA ≠ tecnología adyacente.** Si la fuente no menciona inteligencia artificial,
  la iniciativa no eleva la madurez en IA.
- **Anuncio ≠ ejecución.** Y un convenio firmado *sí* es acto ejecutado: lo que
  falta es la actividad derivada.
- **Asistencia ≠ evaluación.** Que una herramienta se use no dice si algo mejoró.
- **Escala histórica 0–15 ≠ escalera 0–4.** No se comparan aritméticamente.
- **DEC-109** · la escalera se aplica a la iniciativa, nunca a la universidad, y
  no se promedia.
- **DEC-111** · contrastar no es aceptar. `ACEPTADO` exige firma humana.
- **DEC-112** · los constructores en Python están congelados.
- **DEC-114 a DEC-117** · el informe interpreta; se comparan capacidades y no
  volumen de fuentes; la sección PUCV compara mecanismos; la presentación puede
  rediseñarse sin bajar el estándar metodológico.

---

## F · Qué significa «verificación sustantiva»

Que una URL responda no prueba que diga lo que se le atribuye. Verificar es abrir
la publicación original y contrastar **siete campos** contra el registro:

1. existencia y título literal;
2. fecha declarada por la página;
3. unidad responsable;
4. condición de anuncio o de ejecución;
5. cifras de población o cobertura;
6. límites del documento;
7. respaldo efectivo de la afirmación que sostiene.

**Hecho:** 38 fuentes, el 51%. El detalle fuente por fuente está en el cuaderno.

**Pendiente:** 36. **Y el reparto no es uniforme** — PUCV 12/14, Universidad
Autónoma 0/3. Léelo en **ISSUE-018** antes de publicar cualquier comparación
institucional: es un sesgo de segundo orden que favorece justamente a la
institución sobre la que el informe debe ser más cuidadoso.

**Restricción abierta:** los registros llevan `verified_by` con el nombre del
investigador firmante, pero el contraste lo ejecutó un modelo. **ISSUE-019**
propone separar `contrasted_by` de `accepted_by`. **No lo resuelvas en silencio.**

---

## G · Estado editorial: qué funciona y qué no

**Funciona.** La cadena de trazabilidad es recorrible de punta a punta. La
metodología está escrita y es defendible. Las conclusiones citan las afirmaciones
que las sostienen y una prueba lo comprueba. La sección PUCV reconoce evidencia
favorable antes de exponer brechas y publica su doble revisión. El PDF se imprime
del mismo HTML que la web, de modo que no pueden divergir. Ningún número de la
prosa se escribe a mano.

**No funciona todavía, y es la misión siguiente:**

- **Densidad.** Algunas matrices son ilegibles en el cuerpo del documento, tanto
  en web como en A4. Buena parte de ese detalle pertenece a anexos.
- **El lector puede confundir cantidad de evidencia con capacidad institucional.**
  Es el riesgo estructural del documento y hoy no está neutralizado visualmente.
- **Las once fichas llegan antes que los hallazgos.** La arquitectura editorial
  hace trabajar al lector antes de darle una razón para hacerlo.
- **La sección PUCV todavía cuenta iniciativas más de lo que compara
  capacidades.** Necesita comparadores de mecanismos.
- **Faltan visualizaciones de capacidad.** Hay matrices de evidencia localizada;
  no hay un comparador que responda «¿qué capacidad demuestra cada institución?».
- La línea de tiempo de hitos sigue siendo la única visualización declarada que
  no existe.

---

## H · Misión recomendada para la próxima sesión

> Trabajar como investigador, editor académico, diseñador de información y
> estratega institucional.
>
> La prioridad no es producir más datos por producirlos, sino **transformar el
> corpus existente en una lectura analítica y visualmente convincente**.
>
> La siguiente versión debe conservar toda la trazabilidad de la v0.6.0, pero
> permitir que un lector como Eduardo Aldunate comprenda rápidamente:
>
> 1. qué está ocurriendo en las Facultades chilenas;
> 2. qué patrones parecen estar emergiendo;
> 3. qué capacidades concretas empiezan a institucionalizarse;
> 4. qué todavía no puede concluirse;
> 5. qué tiene hoy la PUCV;
> 6. qué mecanismos ya aparecen en otras Facultades;
> 7. por qué eso plantea una decisión institucional para la PUCV.
>
> Usar criterio profesional y libertad de diseño dentro de las restricciones
> metodológicas existentes.

**Dos hipótesis editoriales que heredas.** No se publican automáticamente: se
comprueban contra los datos, y si no resisten, se degradan o se descartan.

> El fenómeno parece desplazarse desde actividades aisladas hacia formas de
> institucionalización más complejas —estructuras especializadas, gobernanza,
> adopción docente, formación recurrente, integración curricular—. La
> heterogeneidad no está sólo en cuánto hacen las universidades, sino en qué
> capacidad logran sostener y demostrar.

> La evidencia corrige la idea de que la PUCV parte de cero: tiene una base
> relevante y sostenida. Precisamente por eso la pregunta estratégica es si esa
> base se convirtió en capacidad transversal, formalizada y evaluable.

**Contra qué chocan hoy.** La primera tiene un dato en contra que hay que mirar
de frente: 19 de las 53 iniciativas siguen en el primer peldaño. La segunda
descansa sobre una base verificada al 86% en la PUCV y al 0% en la Autónoma
(ISSUE-018).

---

## I · Qué NO tocar sin causa declarada

- **Identificadores canónicos.** No se reutilizan ni se renombran.
- **La metodología y la cohorte.** Cambiarlas exige versión nueva del protocolo.
- **Los datasets**, salvo por verificación con su registro en el cuaderno.
- **Las decisiones de atribución.** Reatribuir exige la fuente que lo justifica.
- **Lo verificado.** No rebajar `CONTRASTADO` a `PROPUESTO` sin motivo escrito.
- **La arquitectura de exportación.** PDF y web salen del mismo modelo. No crear
  una segunda narrativa.
- **La corrección de impresión.** `.scroll { overflow: visible }` en `@media
  print` es lo que evita que las tablas se recorten en papel (ISSUE-012).
- **`.gitattributes`.** Sin él los checksums vuelven a fallar (ISSUE-017).
- **El historial de Git.** No reescribir, no forzar, no borrar las ramas
  preservadas.
- **Los constructores en Python.** Congelados (DEC-112).

---

## J · Trampas de este repositorio

Cuestan tiempo y no son evidentes.

- **Los CSV canónicos usan CRLF.** Un script que los reescriba con LF produce un
  diff de archivo entero que oculta el cambio real.
- **`core.autocrlf` está activo.** Lo que escribes no es lo que git guarda.
  `.gitattributes` protege `public/descargas/` y el dataset; no lo quites.
- **Comprobar un paquete en el disco donde se generó no comprueba nada.**
  Descárgalo de producción y ejecuta `sha256sum -c`.
- **El heredoc de Bash falla** con textos largos que llevan comillas y acentos.
  La prosa se escribe con Write o Edit, nunca con `cat <<EOF`.
- **No hay intérprete de Python.**
- **`preview_start` puede resolver una configuración de otro directorio.** Si
  devuelve `aldunate-attach`, está leyendo
  `Desktop\ALDUNEITOR\.claude\launch.json`, que sólo se ancla y no lanza nada.
- **Varias sesiones escriben este repositorio.** Consulta el remoto con
  `git ls-remote origin`, nunca `origin/main` local.
- **Matar el shell de `npm run dev` no mata Node.** Deja el puerto 3000 ocupado.

---

## K · Cómo empezar

```bash
git fetch origin && git log --oneline -5
cat docs/report-01/progress.json
sed -n '1,60p' tools/informes/informe-01/verificacion-p1-2026-09-04.md
npm run verify
```

No repitas las fases 0 a 4: están cerradas y sus decisiones están en
`DECISIONS.md`. El detalle de lo pendiente está en `TASKS.md` y `STATUS.md`.
