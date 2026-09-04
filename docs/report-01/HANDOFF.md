# HANDOFF — Informe 01

**Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho
en Chile.** Documento de relevo entre sesiones. Léelo entero antes de tocar nada.

Actualizado: **04-09-2026** · versión **v0.6.0** · rama `informe-01/borrador-aldunate`

---

## Objetivo

Convertir el Informe 01 en un borrador académico presentable al profesor Eduardo
Aldunate Lizana, sin cruzar la línea que el propio método prohíbe: **no hay
informe de resultados mientras la verificación sustantiva del corpus no esté
completa.** Está al 51%, y el documento lo dice en portada.

---

## Estado actual

La v0.6.0 hace dos cosas que la v0.5.0 no hacía.

**Verificó 38 de las 74 fuentes.** Se abrió cada publicación original y se
contrastaron siete campos contra el registro: existencia y título literal, fecha
declarada, unidad responsable, condición de anuncio o ejecución, cifras de
cobertura, límites y respaldo efectivo de la afirmación que sostiene. El detalle
fuente por fuente está en `tools/informes/informe-01/verificacion-p1-2026-09-04.md`,
y la cola de prioridad calculada, en `prioridad-verificacion.json`.

**Once registros no decían lo que su página dice.** No es una anécdota: es un
tercio de lo verificado, y varias correcciones tocan afirmaciones publicadas.

| Registro | Qué decía | Qué dice la fuente |
|---|---|---|
| `src-pucv-007` | «Universidad presentó decálogo…» | «…se realizó Día de la IA». Y el decálogo «sugiere recomendaciones»: es lineamiento, no política |
| `src-puc-chile-004` | «primer Departamento… en Chile» | Es cita textual del decano, no hecho verificado. Sin acto formal |
| `src-uchile-002` | Edición de un diploma en serie | «Diploma 2022 Cerrado». La serie es de la UC, no de la UChile |
| `src-uai-002` | Anuncio sin ejecución | «El martes 6 de enero **se firmó** un convenio» |
| `src-pucv-001` | LMIL de la Facultad de Derecho | Dirección de Incubación y Negocios, y no menciona IA |
| `src-ucentral-003` | `legal-tech`, subestimada | «Programa de IA y LegalTech», con actividad fechada |
| `src-udec-002` | Inaccesible por certificado | Carga bien. Y la organiza el centro de alumnos: `ESTUDIANTIL` |
| `src-udec-004`, `src-uchile-015` | Fechas 2026 | Las páginas no declaran fecha: retiradas |
| `src-ucentral-004`, `src-unab-004` | Sin fecha | Las páginas sí la declaran: ganadas |

**Y añadió la capa académica.** Introducción, objetivos, un relato metodológico
en nueve apartados, discusión en seis, la sección PUCV rehecha con doble revisión
publicada, siete conclusiones que citan las afirmaciones que las sostienen, ocho
limitaciones y una agenda de siete preguntas.

**Los números, recalculados desde el dataset:** 11 universidades · 74 fuentes ·
53 iniciativas · 75 evidencias · 14 afirmaciones · **38 fuentes contrastadas** ·
0 iniciativas en el peldaño de evaluación · escalera 19/21/13/0.

---

## Lo que hay que saber antes de tocar nada

**Python no existe en este equipo.** Los cinco constructores de
`scripts/informe-01/0[1-5]-*.py` quedan **congelados** (DEC-112) y llevan un
aviso en su cabecera. Ejecutarlos sobrescribiría la verificación con el estado
del 03-09-2026. Los CSV son la fuente de verdad; la integridad la comprueban
`06-compilar-a-typescript.mjs` y las 124 pruebas.

**Los CSV usan CRLF.** Un script que los reescriba con LF produce un diff de
archivo entero que oculta el cambio real.

**Ningún número de la prosa se escribe a mano.** Los textos citan marcas
`{clave}` que resuelven `cifrasInforme01()` en la web y una tabla equivalente en
el exportador. Una prueba falla si alguien escribe «74» en un párrafo.

**DEC-108 está enmendada (DEC-111).** Verificar ya no está prohibido; lo que
sigue exigiendo firma humana es `ACEPTADO`, y no hay ni un registro aceptado.

**Declaración de intereses (DEC-113).** `src-pucv-003` identifica como
conductores del DIAT a Johann Benfeld, Eduardo Aldunate y Diego Ojeda. El
destinatario del informe y su autor participan de una iniciativa evaluada. Está
declarado en la metodología y la sección PUCV publica su doble revisión.

---

## Último punto completado

Borrador académico v0.6.0 cerrado de extremo a extremo: verificación,
correcciones al dataset, capa narrativa, sección PUCV, web, exportaciones y QA.

`npm run verify` en verde: typecheck, lint con 0 errores y los 8 avisos
preexistentes del código donado del juego, **124 pruebas** y build de 18 rutas.
Paquete con MD, HTML, **PDF A4 de 56 páginas**, seis CSV, JSON, manifiesto,
checksums y ZIP. QA de impresión comprobado en el CSSOM del HTML exportado: las
21 tablas conservan su contenedor y la regla `.scroll { overflow: visible }`
sigue viva. Cero desbordamiento horizontal a 375 px.

---

## Próxima tarea exacta

**Continuar la verificación por las 36 fuentes restantes.** El orden ya está
calculado en `tools/informes/informe-01/prioridad-verificacion.json`: quedan las
de peso 7 (nivel 3 de escalera sin afirmación numérica) y las de peso 0.

Empezar por las cuatro que sostienen `clm-cohorte-006` y `clm-cohorte-004` y aún
no se abrieron: `src-uautonoma-001`, `src-uautonoma-003`, `src-ucentral-001` y
`src-unab-001`. Son las que faltan para que las dos afirmaciones sobre currículo
y uso interno queden completamente contrastadas.

Para cada una: contrastar los siete campos, escribir `verified_by` y
`workflow_status: CONTRASTADO` en `fuentes.csv`, `last_verified` y `verified_by`
en sus evidencias, y anotar la divergencia en el cuaderno de verificación.
Después `node scripts/informe-01/06-compilar-a-typescript.mjs` y `npm run verify`.

**Ojo:** la prueba «cuenta las fuentes verificadas desde el dataset» exige que
queden fuentes sin verificar. El día que se complete el corpus, esa prueba debe
fallar para obligar a decidir a mano si el documento deja de ser borrador.

---

## Archivos canónicos

Fuente de verdad, en este orden:

1. `content/reports/01_ia_escuelas_derecho_chile/canonical/kit-canonico-v1.0.0.md`
2. `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/*.csv` — **los datos**
3. `src/data/informe01-borrador.ts` y `informe01-pucv.ts` — **la prosa**
4. `content/reports/01_ia_escuelas_derecho_chile/sources/investigacion-profunda/*.md`
5. `tools/informes/informe-01/verificacion-p1-2026-09-04.md` — el contraste

`content/research/source-registry.csv` pertenece al Informe 02 y **no** es el
registro del 01.

---

## Decisiones metodológicas vigentes

Las trece están en `DECISIONS.md`. Las cinco que más veces se rompen:

- **DEC-102** · ninguna comparación ni ranking nacional.
- **DEC-105** · universidad no es Facultad.
- **DEC-109** · la escalera se aplica a la iniciativa, nunca a la universidad.
- **DEC-111** · contrastar no es aceptar. `ACEPTADO` exige firma humana.
- **DEC-112** · los constructores en Python están congelados.

---

## Qué NO debe hacerse

- **No** ejecutar los scripts `.py`. Sobrescriben la verificación.
- **No** rellenar `sourceIds` ni `claimIds` en `src/data/reports.ts`.
- **No** marcar `ACEPTADO` ningún registro.
- **No** publicar ranking, tabla de posiciones ni puntaje agregado.
- **No** presentar el documento como informe de resultados mientras el corpus no
  esté verificado del todo.
- **No** escribir cifras a mano en la prosa: usar marcas.
- **No** convertir una ausencia de evidencia pública en inexistencia. Hay una
  prueba que lo comprueba sobre las conclusiones.
- **No** retirar del corpus las fuentes que involucran al autor: se declaran.
- **No** reescribir los CSV con LF.

---

## Pendientes, por prioridad

1. **Verificar las 36 fuentes restantes** (ISSUE-001, ahora al 51%).
2. **Localizar el acto formal de las cuatro unidades creadas** (ISSUE-006). Es
   lo que decide la conclusión C-1, que es la principal del informe.
3. **Pedir la ficha metodológica de la medición de la UNAB** (ISSUE-016). Es la
   única cifra de efecto del corpus y su diseño no está publicado.
4. **Recorrer la ruta 13**, contraste externo, en las once (ISSUE-011 del corpus).
5. Word, que sigue dependiendo del equipo del autor (ISSUE-011).
6. Línea de tiempo de hitos: la única visualización declarada que falta.

---

## Bloqueos

- **ISSUE-003** · el CNED devuelve 403 a petición automatizada. Exige descargar
  la base desde un navegador y versionar el archivo.
- **ISSUE-009** · reconstruir una línea base congelada de 2025 exige una decisión
  humana sobre un archivo ya editado retrospectivamente.
- **ISSUE-011** · Word sólo puede generarse en el equipo del autor. El PDF ya no:
  se imprime del HTML con el Chrome del sistema.

---

## Tests

| | Estado | Cuándo |
|---|---|---|
| lint | 0 errores · 8 avisos preexistentes | 04-09-2026 |
| typecheck | pasa | 04-09-2026 |
| tests | **124** en 8 archivos | 04-09-2026 |
| build | pasa · 18 rutas | 04-09-2026 |
| responsive | 375 px · desbordamiento horizontal cero | 04-09-2026 |
| impresión | reglas vivas en el CSSOM · 21 tablas con contenedor | 04-09-2026 |
| exportación | MD 123 KB · HTML 156 KB · PDF 56 pp · ZIP 489 KB | 04-09-2026 |

---

## Git

- **Rama:** `informe-01/borrador-aldunate`, derivada de `informe-01/v0.5.0`.
- **Base:** `origin/main` en `057ad4b`.
- La v0.5.0 quedó preservada en su propia rama y empujada al remoto: no se
  sobrescribió para hacer sitio a ésta.

Se trabaja siempre desde `git ls-remote origin` tras `git fetch`, nunca desde el
árbol local, porque varias sesiones escriben sobre este repositorio.

---

## Cómo continuar

```bash
git fetch origin
git log --oneline -5
cat docs/report-01/progress.json
sed -n '1,40p' tools/informes/informe-01/verificacion-p1-2026-09-04.md
```

Después, la verificación por tandas. No repitas las fases 0 a 6: están cerradas
y sus decisiones están registradas en `DECISIONS.md`.
