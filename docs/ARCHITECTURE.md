# Arquitectura de información — Aldunate Experimento 02

## Navegación primaria
- `/` — portal/landing
- `/aldunate` — perfil intelectual
- `/aldunate/papers` — publicaciones
- `/aldunate/cursos` — cursos
- `/laboratorio` — IA + Derecho
- `/informes` — biblioteca de informes vivos
- `/informes/[slug]` — detalle y descargas
- `/experimentos` — hub
- `/experimentos/constitucion`
- `/experimentos/gramatiquerias`
- `/experimentos/juegos`

## Componentes transversales
- ThemeProvider + ThemeToggle
- Header compacto
- EVA contextual
- Footer institucional/prototipo
- Search/Command menu
- SourceBadge
- VersionBadge
- DownloadButton
- UpdateTimeline
- KnowledgeGraph
- Heatmap
- ResearchEvidenceCard

## Regla de contenido
Los contenidos se almacenan como datos/MDX/JSON tipados, no hardcodeados dentro de componentes visuales.

## EVA
EVA debe ser un sistema contextual, no una mascota ornamental:
- `EvaGuide`
- `EvaPanel`
- `EvaMessage`
- `EvaPortrait`
- `useEvaContext()`

El mensaje depende de ruta, estado y acción, no de intervalos aleatorios.

## Informes
Cada informe debe tener:
- metadata;
- versiones;
- assets descargables;
- fuentes;
- visualizaciones;
- changelog;
- `latest` calculable.

## Investigación
El registro de fuentes es la capa de verdad. Los gráficos y textos deben apuntar a identificadores de evidencia cuando sea posible.
