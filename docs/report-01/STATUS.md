# STATUS — Informe 01

Tablero de fases. `[ ]` pendiente · `[~]` en curso · `[x]` terminada ·
`[!]` bloqueada.

**Nunca marcar `[x]` algo parcialmente terminado.**

Rama de trabajo: `informe-01/borrador-aldunate` · v0.6.0 · Corte: 04-09-2026

---

## Fase 0 — Auditoría

- [x] Auditar el repositorio: framework, rutas, sistema de diseño, cadena de informes
- [x] Localizar los artefactos existentes del Informe 01 (`content/`, `tools/`, `src/data/reports.ts`)
- [x] Leer el kit canónico v1.0.0 y extraer sus vocabularios controlados
- [x] Inventariar los cinco documentos de investigación profunda versionados
- [x] Auditar la aritmética del corpus declarado (72) contra la extracción mecánica (74)
- [x] Registrar decisiones metodológicas heredadas y nuevas en `DECISIONS.md`

## Fase 1 — Fuentes

- [x] Extraer y normalizar las URL de los cinco documentos (host, `www`, barra final)
- [x] Deduplicar y arbitrar lecturas divergentes
- [x] Poblar `canonical/dataset/fuentes.csv` con las 74 fuentes
- [x] Comprobar correspondencia 1:1 entre URL extraídas y registro
- [~] Verificación sustantiva fuente por fuente — **38 de 74 (51%)** al 04-09-2026. Cola en `tools/informes/informe-01/prioridad-verificacion.json`; contraste en `verificacion-p1-2026-09-04.md`

## Fase 2 — Evidencia

- [x] Poblar `canonical/dataset/iniciativas.csv` con las iniciativas deduplicadas
- [x] Poblar `canonical/dataset/universidades.csv` con unidad y estado
- [x] Poblar `canonical/dataset/evidencias.csv` — 75 evidencias, ninguna con `last_verified`
- [x] Calcular la cobertura de investigación por institución y dimensión — `cobertura.csv`
- [x] Dejar la construcción del dataset reproducible en `scripts/informe-01/`

## Fase 3 — Claims

- [x] Poblar `canonical/dataset/afirmaciones.csv` — 14 afirmaciones
- [x] Clasificar cada afirmación y declarar contraevidencia y limitaciones
- [~] Prueba A (abogado de la PUCV) y prueba B (abogado del benchmark)

## Fase 4 — Informe

- [x] Capa de datos tipada en `src/data/informe01.ts`, compilada desde los CSV
- [x] Capa editorial en `src/data/informe01-editorial.ts` — lagunas, auditoría, tabla PUCV
- [x] Sección PUCV en contexto, con reconocimiento de evidencia favorable primero
- [x] Bloque de lagunas, ampliado a doce con L-11 y L-12
- [x] Auditoría de la línea base como bloque propio
- [x] Página de fichas institucionales en `/informes/[slug]/instituciones`
- [x] Ficha del informe en `src/data/reports.ts` con la v0.5.0 y su fe de erratas

## Fase 5 — Visualizaciones

- [x] Matriz de evidencia localizada por universidad y dimensión, sin puntaje
- [x] Cobertura de investigación, separada de la evidencia
- [x] Escalera de institucionalización por iniciativa, con el nivel 4 vacío a la vista
- [x] Mapa de direcciones IA_PARA_DERECHO / DERECHO_DE_IA / AMBOS / ADYACENTE
- [ ] Línea de tiempo de hitos
- [x] Alternativa textual o tabular de la matriz; el resto no depende del color

## Fase 6 — Exportaciones

- [x] Markdown, HTML, CSV y JSON en `public/descargas/`
- [x] Paquete ZIP determinista con manifiesto y `checksums.sha256`
- [x] Descargas enlazadas en la ficha del informe
- [ ] `.json` de contenido listos para la cadena PowerShell — ver ISSUE-011
- [x] PDF A4 de 39 páginas, impreso del mismo HTML
- [!] Word: requiere el equipo del autor

## Fase 7 — QA

- [x] Validadores de integridad referencial en el compilador de datos
- [x] Los mismos validadores como prueba de vitest: 18 pruebas nuevas, 115 en total
- [x] QA editorial de expresiones peligrosas, ejecutable y ya con dos capturas reales
- [x] Contadores del sitio calculados desde los datos, nunca escritos a mano
- [x] `npm run verify` completo, en verde al 04-09-2026
- [x] Responsive e impresión — capturas a 390 y 1280 px y en modo impresión; desbordamiento cero

## Fase 8 — Entrega

- [x] Changelog de la v0.5.0 y fe de erratas de la v0.4.0
- [x] `src/data/trabajos.ts` actualizado: decía 43 fuentes y la asimetría antigua
- [x] Bundle de git y comandos de publicación

---

## Fase 7 — Verificación sustantiva · v0.6.0

- [x] Calcular la cola de prioridad desde la cadena claim → evidencia → fuente
- [x] Contrastar las 38 fuentes que sostienen afirmaciones numéricas y nivel 3
- [x] Corregir los once registros cuya página no decía lo que se le atribuía
- [x] Reescribir `clm-cohorte-005` y `clm-cohorte-008`; matizar `clm-cohorte-003`
- [x] Bajar `ini-uchile-002` del peldaño 3 al 2 y reatribuir `ini-udec-002`
- [x] Enmendar DEC-108: las guardas pasan de prohibir a exigir coherencia
- [x] Cerrar ISSUE-002 · confirmar ISSUE-003 · abrir ISSUE-013 a ISSUE-016
- [~] **Quedan 36 fuentes.** Siguientes: `src-uautonoma-001`, `src-uautonoma-003`,
      `src-ucentral-001`, `src-unab-001`
- [!] ISSUE-003 · el CNED devuelve 403 y exige descarga manual

## Fase 8 — Borrador académico · v0.6.0

- [x] Introducción, objetivos y relato metodológico en nueve apartados
- [x] Declaración de intereses (DEC-113)
- [x] Discusión en seis bloques, separando hecho de inferencia
- [x] Sección PUCV: siete hechos favorables, seis brechas, doble revisión publicada
- [x] Cinco recomendaciones con problema, evidencia, referente, acción e indicador
- [x] Siete conclusiones, cada una citando las afirmaciones que la sostienen
- [x] Ocho limitaciones y agenda de siete preguntas con condición de cierre
- [x] Marcas `{clave}` resueltas desde el dataset: la prosa no escribe cifras
- [x] Ocho pruebas nuevas que atan la prosa a los datos (124 en total)

## Fase 9 — QA · v0.6.0

- [x] Auditoría adversarial de las siete conclusiones. Tres se reescribieron:
      C-1 y C-2 afirmaban inexistencia donde sólo hay ausencia de evidencia, y
      C-7 daba por superada una fase que 19 de 53 iniciativas no han superado
- [x] Duplicación de secciones resuelta: había dos «Metodología» y dos de PUCV
- [x] Descargas apuntando a v0.6.0; los siete artefactos responden 200
- [x] Responsive a 375 px · desbordamiento horizontal cero
- [x] Impresión comprobada en el CSSOM del HTML exportado
- [x] `npm run verify` en verde
- [ ] Word · sigue dependiendo del equipo del autor (ISSUE-011)
