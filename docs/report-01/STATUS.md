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
- [!] Word y PDF: requieren el equipo del autor

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
