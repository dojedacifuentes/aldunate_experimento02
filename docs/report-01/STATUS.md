# STATUS — Informe 01

Tablero de fases. `[x]` terminada · `[~]` parcial · `[ ]` pendiente ·
`[!]` bloqueada.

**Nunca marcar `[x]` algo parcialmente terminado.**

Rama: `main` · HEAD `d329c86` · versión **v0.6.0** · corte del estudio 01-09-2026
· actualizado 04-09-2026

---

## Fase 0 — Git, recuperación y publicación

- [x] Restaurar la rama `informe-01/v0.5.0` desde el bundle heredado
- [x] Comprobar base `057ad4b`, nueve commits y punta `a1cc758`
- [x] Empujar `informe-01/v0.5.0` al remoto — la sesión anterior no pudo
- [x] Rama derivada `informe-01/borrador-aldunate`, preservada en el remoto
- [x] PR #20 y PR #21 abiertos, CI en verde y fusionados a `main`
- [x] Despliegue de producción comprobado

## Fase 1 — Corpus y datos

- [x] Dataset canónico poblado: 11 · 74 · 53 · 75 · 14
- [x] Integridad referencial comprobada por el compilador y por las pruebas
- [x] Cola de prioridad derivada de la cadena afirmación → evidencia → fuente
- [x] Constructores en Python congelados (DEC-112)

## Fase 2 — Verificación sustantiva

- [~] **38 de 74 fuentes contrastadas (51%).** Siete campos por fuente
- [x] Once registros corregidos por divergencia con su página
- [x] Cuaderno de verificación versionado, fuente por fuente
- [x] Guardas del compilador: de prohibir la verificación a exigir su coherencia
- [x] ISSUE-002 cerrado · ISSUE-003 confirmado · ISSUE-013 a 017 registrados
- [ ] **36 fuentes pendientes**
- [!] **ISSUE-018 · el reparto de la verificación está sesgado.** PUCV 12/14,
      Universidad Autónoma 0/3. Bloquea publicar comparación institucional
      mientras no se equilibre o no se publique el porcentaje por institución
- [!] **ISSUE-019 · verificación asistida frente a validación humana.** Requiere
      decisión editorial del autor
- [!] ISSUE-003 · el CNED devuelve 403; exige descarga manual

## Fase 3 — Afirmaciones

- [x] 14 afirmaciones con razonamiento, contraevidencia, límites y confianza
- [x] `clm-cohorte-005` y `clm-cohorte-008` reescritas tras el contraste
- [x] `clm-cohorte-003` matizada
- [x] Ninguna aceptada: `ACEPTADO` exige firma humana
- [ ] Revisar las cuatro afirmaciones cuyas fuentes siguen sin contrastar

## Fase 4 — Análisis

- [x] Discusión en seis bloques, separando hecho de inferencia
- [x] Siete conclusiones, cada una citando las afirmaciones que la sostienen
- [x] Auditoría adversarial: tres conclusiones reescritas antes de publicar
- [x] Ocho limitaciones y agenda de siete preguntas con condición de cierre
- [ ] Comprobar contra los datos las dos hipótesis editoriales heredadas

## Fase 5 — Arquitectura editorial

- [~] Orden académico en la web: método antes de los datos, discusión después
- [ ] **Los hallazgos siguen llegando después de las once fichas**
- [ ] Decidir qué detalle técnico pasa a anexos
- [ ] Reescribir el resumen ejecutivo con hallazgos, inferencias, limitaciones y
      relevancia para la PUCV

## Fase 6 — Visualizaciones

- [x] Matriz de evidencia localizada, cobertura, escalera y mapa de direcciones
- [ ] **Visualización principal de capacidad institucional** que no sea ranking
      ni sume peldaños (DEC-115)
- [ ] Separar visualmente cobertura de investigación y desarrollo institucional
- [ ] Revisar si la matriz de ocho dimensiones se divide, simplifica o va a anexo
- [ ] Mejorar la legibilidad de las matrices en web y en A4
- [ ] Línea de tiempo de hitos — única visualización declarada que falta

## Fase 7 — PUCV en contexto

- [x] Siete hechos favorables verificados, con su fuente
- [x] Seis brechas, cada una con comparador y alcance declarado
- [x] Doble revisión publicada: ¿demasiado severa?, ¿demasiado indulgente?
- [x] Cinco recomendaciones con problema, evidencia, referente, acción, indicador
- [ ] **Comparador de mecanismos**: qué hacen otras Facultades que aquí no consta
- [ ] Neutralizar el sesgo de sobrerrepresentación (ISSUE-018)

## Fase 8 — Redacción académica

- [x] Introducción, objetivos y metodología en nueve apartados
- [x] Declaración de intereses (DEC-113)
- [x] Cifras interpoladas desde el dataset: la prosa no escribe números a mano
- [ ] Pasada de edición completa con la nueva arquitectura

## Fase 9 — Exportaciones

- [x] MD, HTML, PDF A4 de 56 páginas, seis CSV, JSON, manifiesto, checksums, ZIP
- [x] PDF impreso del mismo HTML: web y documento no pueden divergir
- [x] Manifiesto derivado del dataset, sin valores fijados a mano
- [x] Integridad verificada **descargando desde producción**
- [ ] Word — depende del equipo del autor (ISSUE-011)

## Fase 10 — QA

- [x] `npm run verify`: 0 errores de lint, 8 avisos preexistentes, 127 pruebas,
      18 rutas
- [x] Auditoría adversarial de las conclusiones
- [x] Duplicación de secciones resuelta
- [x] Responsive a 375 px: desbordamiento horizontal cero
- [x] Impresión comprobada en el CSSOM del HTML exportado
- [x] Los siete artefactos responden 200 y los once checksums cuadran
- [ ] QA de legibilidad de las matrices — el defecto conocido de la Fase 6

## Fase 11 — Publicación

- [x] PR #20 y #21 fusionados con CI en verde, sin bypass
- [x] Producción desplegada y comprobada
- [x] Versiones anteriores conservadas y accesibles
