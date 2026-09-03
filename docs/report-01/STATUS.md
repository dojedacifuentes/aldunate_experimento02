# STATUS — Informe 01

Tablero de fases. `[ ]` pendiente · `[~]` en curso · `[x]` terminada ·
`[!]` bloqueada.

**Nunca marcar `[x]` algo parcialmente terminado.**

Rama de trabajo: `informe-01/v0.5.0` · Corte: 03-09-2026

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
- [ ] Verificación sustantiva fuente por fuente — ver ISSUE-001

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

- [ ] Capa de datos tipada en `src/data/`
- [ ] Reescribir la ficha del informe en `src/data/reports.ts` para la v0.5.0
- [ ] Sección PUCV en contexto
- [ ] Bloque de lagunas L-1 a L-10
- [ ] Auditoría de la línea base como bloque propio

## Fase 5 — Visualizaciones

- [ ] Matriz de evidencia localizada por universidad y dimensión, sin puntaje
- [ ] Cobertura de investigación, separada de la evidencia
- [ ] Escalera de institucionalización por iniciativa
- [ ] Mapa de direcciones IA_PARA_DERECHO / DERECHO_DE_IA / AMBOS / ADYACENTE
- [ ] Línea de tiempo de hitos
- [ ] Alternativa textual o tabular de cada figura

## Fase 6 — Exportaciones

- [ ] Markdown, HTML, CSV y JSON en `public/descargas/`
- [ ] Paquete ZIP con manifiesto y controles de integridad
- [ ] `.json` de contenido listos para la cadena PowerShell — ver ISSUE-011
- [ ] Word y PDF (requieren el equipo del autor)

## Fase 7 — QA

- [ ] Validadores de integridad referencial en vitest
- [ ] QA editorial de expresiones peligrosas
- [ ] Contadores del sitio calculados desde los datos, nunca escritos a mano
- [ ] `npm run verify` completo
- [ ] Responsive e impresión

## Fase 8 — Entrega

- [ ] Changelog de la v0.5.0 y fe de erratas de la v0.4.0
- [ ] Comprobar `src/data/trabajos.ts` (regla permanente de `CLAUDE.md` §12)
- [ ] Bundle de git y comandos de publicación
