# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Versionado semántico.

---

## [0.6.0] — 2026-08-31

### Añadido

- **Skill `informe-vivo`** en `.claude/skills/`. Encapsula el flujo completo de
  producción: investigación, corpus, contenido, figuras, compilación y
  publicación. Existía la maquinaria y existía el método escrito; faltaba lo que
  los invoca cuando alguien pide un informe sin saber que hay una cadena detrás.
- La skill trata como caso de primera clase el encargo más frecuente y peor
  resuelto: **fundir varios documentos de investigación en un informe único**.
  Cuatro investigaciones no son cuatro capítulos. El procedimiento —inventariar
  fuentes en vez de textos, arbitrar los desacuerdos abriendo la fuente,
  reclasificar desde cero y derivar la estructura de la evidencia y no de los
  documentos de origen— es lo que separa una fusión de una suma.
- Recoge además los errores ya cometidos en este repositorio, para que no se
  repitan: el BOM de PowerShell, las variables que no distinguen mayúsculas, la
  numeración manual de figuras, la renumeración ascendente de capítulos y los
  identificadores huérfanos.

### Corregido

- Las notas «Sin verificar» de 0.4.0 y 0.5.0 quedan resueltas: el CI del
  repositorio ejecuta `npm run verify` en cada push a `main`, y ambos commits
  (`3ec584a` y `5d78036`) pasaron typecheck, lint y build. La verificación
  existía; lo que faltaba era mirarla.

---

## [0.5.0] — 2026-08-31

### Añadido

- **`tools/informes/` — la cadena de producción completa.** Deja de vivir fuera
  del repositorio: el motor de gráficos, el generador de `.docx`, las dos
  maquetas web y los constructores quedan versionados aquí. El informe 02 está
  incluido íntegro como ejemplo funcionando, con sus doce figuras en dos
  resoluciones y su corpus de evidencia.
- **`tools/informes/plantilla-informe-nuevo/`** — esqueleto en blanco que
  compila. Se copia para arrancar un informe: no hay que empezar de cero ni
  clonar el 02. Documenta cada tipo de bloque con el propio contenido.
- **`docs/informes/` — el método en siete documentos.** Metodología de
  investigación, sistema de diseño, motor de gráficos, generador de Word, modelo
  de contenido, guía de reproducción y puente con el sitio. Escritos para que
  alguien que no estuvo presente pueda reconstruir lo que se hizo.
- **Botón «Leer en línea»** en la ficha del informe. `ReportVersion` gana un
  campo `html` con la misma regla que `pdf`: aparece solo si el archivo existe.

### Cambiado

- Los constructores dejan de tener rutas absolutas y pasan a aceptar
  `-Contenido`, `-Salida`, `-Titulo` y demás. Antes solo funcionaban en la
  máquina donde se escribieron; ahora la cadena es portátil, y se comprobó
  ejecutándola entera desde su nueva ubicación: 12 figuras, 24 tablas y los
  mismos pesos de salida que el original.
- `CLAUDE.md` §6 y §8 recogen `tools/` y las reglas propias de la cadena: las
  figuras no llevan número escrito, una figura sin fuente no se publica, los
  `.ps1` van en UTF-8 con BOM.

### Aprendido

- PowerShell no distingue mayúsculas en los nombres de variable, así que `$T` y
  `$t` son la misma. Costó un intento fallido durante esta misma sesión, y está
  documentado en `docs/informes/06-reproducir.md` con su solución.

### Sin verificar

- Sigue sin ejecutarse `npm run verify`: la máquina no tiene Node. Se comprobó a
  mano que `ButtonLink` admite las variantes `primary` y `outline` usadas, que
  `BookOpen` existe en `lucide-react` y que los 42 identificadores de fuentes y
  afirmaciones siguen sin huérfanos. El build de Vercel es la verificación real.

---

## [0.4.0] — 2026-08-31

### Añadido

- **Informe 02 v0.2.0** — documento completo: 24 capítulos y 3 anexos,
  76 páginas, 12 figuras y 24 tablas. Descargable en PDF desde la ficha del
  informe. El botón aparece porque el archivo existe.
- **Capa de investigación poblada.** `sources` pasa de 0 a 24 entradas y
  `claims` de 0 a 18. Cada fuente se verificó abriendo el documento original;
  las que no pudieron rastrearse hasta su fuente primaria quedaron fuera.
- Las 18 afirmaciones se distribuyen en los cinco niveles sin colapsarlos:
  siete hechos, cinco señales, tres inferencias, una hipótesis y dos
  pendientes. Los dos pendientes son los que más dicen —no hay evidencia
  independiente de que los despliegues masivos mejoren el aprendizaje, y no se
  localizó rediseño evaluativo publicado en facultades chilenas— y se registran
  como ausencia de evidencia, no como evidencia de ausencia.

### Cambiado

- Informe 02 pasa de `en-investigacion` a `en-revision`. Existe documento, no
  existe revisión externa: `publicado` habría sido una promesa que el estado
  real no sostiene.
- Su resumen ejecutivo deja de describir alcance y pasa a describir hallazgos,
  porque ahora los hay.
- Tres preguntas abiertas nuevas, todas sobre vacíos que la investigación
  identificó y no pudo cerrar: el coste real de la evaluación válida, el efecto
  a lo largo de una carrera completa y la validez de estos hallazgos fuera del
  inglés.

### Registrado

- La retractación del metaanálisis de Wang y Fan (22 de abril de 2026, tras 266
  citas) entra como fuente propia. Cualquier lectura de la literatura anterior a
  esa fecha tiene que hacerse con ese dato delante.

### Sin verificar

- **No se ejecutaron `typecheck`, `lint` ni `build`**: la máquina donde se hizo
  este cambio no tiene Node instalado. Se comprobó a mano que los 42
  identificadores de `sourceIds` y `claimIds` existen en `research.ts`, sin
  huérfanos en ninguna de las dos direcciones, y que los campos poblados
  coinciden con los que consume la interfaz. Falta correr `npm run verify` antes
  de dar por bueno el despliegue.

---

## [0.3.0] — 2026-08-30

### Añadido

- **Borges · El jardín de las interpretaciones que se bifurcan** — una
  disposición ficticia, unos hechos fijos y tres decisiones hermenéuticas
  encadenadas, cada una apoyada en un canon reconocible (literal/teleológica,
  empírica/conceptual, estricta/extensiva). Cinco desenlaces defendibles del
  mismo texto, desde el archivo sin sanción hasta la agravada contra dos
  personas.
- El árbol es **asimétrico** a propósito: la lectura teleológica de «alterar»
  cierra el caso y deja sin objeto las dos preguntas siguientes. Un esquema de
  opciones equilibradas habría ocultado que existen decisiones interpretativas
  que no responden una pregunta, sino que vuelven irrelevantes las demás.
- Panel «el jardín completo»: cuenta las ramas recorridas sobre el total, con
  el total derivado del recorrido del árbol y no escrito a mano.

### Cambiado

- Borges pasa de `idea` a `jugable`. Quedan cuatro piezas como idea.

### Cerrado

- PR #1 (`vercel/react-server-components-cve-vu-ajyqgj`), sin fusionar. Proponía
  `next@15.5.9` sobre un `main` que ya está en `16.3.3` con `npm audit` en cero:
  fusionarlo habría retrocedido una versión mayor. El motivo quedó comentado en
  el propio PR y en `docs/HANDOFF.md` §3.6.

### Verificado

- typecheck, lint y build limpios.
- Las cinco ramas recorridas contra el build de producción: cinco desenlaces
  distintos, contador en 5/5, ninguna rama sin recorrer.

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

