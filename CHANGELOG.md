# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado semántico.

---
## [0.2.0] — 2026-08-29

Ajustes de fidelidad a la guía visual y dos experimentos interactivos nuevos.

### Añadido

- **Wittgenstein · ¿Qué regla estás siguiendo?** — «Ningún vehículo puede
  entrar al parque»: ocho objetos, tres propósitos declarados, el mismo texto
  en los tres. No corrige respuestas: devuelve las del usuario y señala cuáles
  cambió al cambiar el contexto. Núcleo y penumbra se derivan de lo respondido.
- **Ama tu Constitución** — ocho dimensiones de diseño institucional (rigidez,
  vía de reforma, ejecutivo, derechos, justicia constitucional,
  descentralización, participación, estados de excepción). Sin puntaje ni
  etiqueta de identidad: la salida son las tensiones internas de la combinación
  elegida.
- Esquema de `Publication` ampliado con `question`, `thesis`, `concepts`,
  `relatedAuthors`, `relatedWorks` y `openQuestions`, para navegar el archivo
  por ideas y no solo por fechas.

### Cambiado

- Paleta fijada a los hexadecimales de la guía: nocturno `#09131D` · `#4BC7E8`;
  claro `#F7F4EE` · `#29588C` · `#8A2432` · `#B78C30`. El fondo oscuro deja de
  ser negro casi puro y recupera el azul.
- Copy del portal según la guía: «Un experimento digital» como antetítulo y
  «Derecho constitucional, lenguaje y otras complicaciones» como subtítulo.
- Constitution Lab y Gramatiquerías pasan de `prototipo` a `jugable`.

### Corregido

- Navegación por teclado ARIA en los dos módulos nuevos: los grupos de radio
  responden a flechas, Inicio y Fin, con `tabIndex` móvil, igual que el resto
  de los experimentos.
- Versión unificada en `site.version`: dejaba de estar escrita a mano en el
  footer y en el portal, donde ya había quedado desfasada.
- Contraste del tono `warning`: el badge de texto pequeño quedaba en 4.40:1
  frente al 4.5:1 exigido. Ajustado en ambos temas.

### Verificado

- Auditoría de contraste sobre el DOM renderizado, con carga limpia en cada
  tema: 0 fallos sobre 125–144 elementos por página.
- Los cuatro módulos interactivos ejercitados contra el build de producción.

---

## [0.1.1] — 2026-08-29

Versión de estabilización para producción y despliegue en Vercel.

### Seguridad y plataforma

- Next.js actualizado de `15.5.4` a `16.3.3`; se elimina la vulnerabilidad
  crítica reportada para la versión anterior.
- Node.js fijado en `22.x` para evitar saltos automáticos de versión mayor en
  Vercel.
- `npm audit` queda en cero vulnerabilidades.
- Scripts de instalación de `sharp@0.35.4` y `unrs-resolver@1.12.2` revisados y
  aprobados por versión en `package.json`.
- `recharts` retirado mientras no exista un dataset que requiera gráficos.

### Corregido

- ESLint migrado a la configuración plana nativa de Next.js 16.
- Estado de tema, menú móvil y EVA adaptado al modelo de efectos de React 19,
  sin actualizaciones de estado sincrónicas dentro de efectos.
- Los catálogos de Aldunate ahora calculan sus contadores desde los datos.
- La portada obtiene la versión más reciente de cada informe por fecha, sin
  depender del orden del arreglo.
- La sección de fuentes de un informe queda preparada para mostrar las fichas
  reales, no solo un contador.
- Los selectores de Constitution Lab y Gramatiquerías incorporan navegación
  completa por flechas, Inicio y Fin siguiendo el patrón ARIA de radio.

### Verificado

- TypeScript, ESLint y compilación de producción correctos.
- Todas las rutas públicas responden `200` y los tres alias responden `307`
  hacia su destino esperado.
- Flujo de GitHub Actions para instalación limpia, auditoría, lint, tipos y
  compilación en cada cambio de `main` y cada pull request.
- Tarjeta social propia para el sitio, sin escudo ni signos de oficialidad
  institucional; los informes sin imagen propia no heredan una portada genérica.
- URL base corregida al dominio de producción asignado por Vercel para evitar
  enlaces Open Graph rotos.

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
  (Wittgenstein pasa a estar construido en 0.2.0.)

