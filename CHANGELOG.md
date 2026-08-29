# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado semántico.

---

## [0.1.0] — 2026-08-29

Primera implementación. Estructura completa, contenido académico pendiente de
verificación.

### Añadido

**Base técnica**
- Proyecto Next.js 15 (App Router) con React 19, TypeScript estricto y
  Tailwind v4.
- 16 rutas prerenderizadas. Sin backend.
- `npm run verify` — typecheck, lint y build en una orden.

**Modo visual dual**
- Tema nocturno «archivo constitucional del futuro»: azul-negro, cian
  contenido, índigo, retícula, grano mínimo.
- Tema institucional PUCV: off-white cálido, azul `#29588C`, burgundy
  `#8A2432`, dorado `#B78C30`, registro editorial sin glow.
- Conmutador persistente con script de arranque: sin destello de tema
  equivocado en la primera carga.
- Utilidades de ambiente basadas en variables de tema: una clase, dos lecturas.

**Tipografía**
- Newsreader (serif) para títulos y prosa; Space Grotesk para interfaz;
  JetBrains Mono para metadatos y trazabilidad.

**EVA**
- Guía residente anclada a ruta, con doce mensajes contextuales.
- Aparición automática única en la primera visita; silenciado persistente;
  cierre con `Escape`; sin overlay ni foco atrapado; respeta
  `prefers-reduced-motion`.
- `EvaNote` para anotaciones en línea dentro del contenido.
- Retratos integrados desde `/public/eva/`.

**Secciones**
- `/` — portal con las cuatro entradas, mapa intelectual y estado del
  laboratorio.
- `/aldunate` — perfil, seis líneas de trabajo con sus conexiones, y cinco
  huecos declarados.
- `/aldunate/papers` y `/aldunate/cursos` — catálogos vacíos con la vista de
  listado ya construida.
- `/laboratorio` — ocho fichas filtrables por categoría y estado, con
  limitaciones visibles; las diez categorías del alcance.
- `/informes` — biblioteca de documentos vivos.
- `/informes/[slug]` — detalle en tres capas de lectura: resumen ejecutivo,
  metodología y límites, historial de versiones y fuentes.
- `/experimentos` — hub con tres familias y ocho piezas.
- `/experimentos/constitucion` — **Constitution Lab**, interactivo: cambiar el
  operador deóntico de un artículo y observar qué disposiciones dependientes
  quedan inaplicables o en tensión.
- `/experimentos/gramatiquerias` — **ambigüedad sintáctica**, interactivo: dos
  análisis gramaticales válidos de una misma oración normativa, con sus
  consecuencias jurídicas divergentes.
- `/experimentos/juegos` — La Ley de los Audaces y Lex Note, en diseño, con los
  requisitos que faltan para construirlas.
- `/investigacion` — la cadena de cinco eslabones, los cinco niveles de
  evidencia, seis reglas de método y el esquema público de ambos registros.
- `not-found` — 404 con las cuatro entradas.

**Institucional**
- Franja de prototipo no oficial en el layout raíz, en todas las páginas.
- `<InstitutionalMark>` como única vía de uso del escudo Derecho PUCV, sin
  recolorear, animar ni deformar.
- Aviso de uso pendiente de autorización formal en el footer.
- `robots: noindex` mientras no exista autorización institucional.

**Contenido e investigación**
- `content/reports/01_ia_escuelas_derecho_chile/` — Informe 01, alcance,
  ocho ejes, doce variables, metodología y límites declarados.
- `content/reports/02_transformacion_ensenanza_derecho/` — Informe 02, once
  ejes de análisis, metodología y límites declarados.
- `content/research/` — registro de fuentes, matriz de evidencia y plantilla de
  notas.

**Documentación**
- `CLAUDE.md`, `README.md`, `docs/DECISIONS.md`, `docs/HANDOFF.md`,
  `CHANGELOG.md`, además del master prompt, la arquitectura y el pipeline de
  contenido heredados del encargo.

### Pendiente por diseño

- Publicaciones, cursos y ficha biográfica: sin datos. Requieren verificación.
- `sources` y `claims`: registros vacíos. No se poblarán con ejemplos.
- PDFs de los informes: no existen todavía; el botón de descarga no se muestra.
- Mapa de calor constitucional, Wittgenstein, Borges, Eco, La Ley de los
  Audaces y Lex Note: declarados como ideas, con sus requisitos publicados.
