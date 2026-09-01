# Changelog

## No publicado

### Corregido

- **Quien ya había jugado no veía el capítulo nuevo.** La partida guardada lo
  devolvía a mitad del Capítulo 0 —los ids de nodo no cambiaron, así que el save
  funcionaba— y se saltaba para siempre la apertura reescrita y el tribunal de
  tres. `SAVE_VERSION` sube a 2: se conserva el personaje y se suelta la
  posición. D-032.
- **El juego no se nombraba desde la portada.** La pista de «Experimentos» y el
  pie ahora lo llaman por su nombre; antes estaba a tres clics y sin nombre.

- **No se veían los jueces.** `setBounds` pegado al mundo recortaba el
  desplazamiento de cámara: a zoom 1,2 el centro sólo podía moverse entre y=300
  e y=420, y el estrado está en y=176. La cámara **no podía enfocar al
  tribunal**. Con `FIT` no se notaba; con el recorte panorámico los dejaba fuera
  de pantalla. Ahora hay 300 px de margen y la sala se dibuja hasta ahí. D-031.
- **No se identificaba a quien habla.** Rótulo con el nombre sobre la cabeza
  —sujeto a la banda visible, que si no desaparecía en los planos de dos—, los
  demás al 55 % de opacidad, y sólo gesticula quien habla. D-031.
- **Las caras no se distinguían.** El zoom de conversación sube de 1,35 a 1,8:
  con 1,35 la cara quedaba en unos treinta píxeles. D-031.
- **El ritmo era lento.** El tecleo baja de 22–30 ms por carácter a 9–15, y los
  paneos de 420–520 ms a 260–320. D-031.
- **El recorte panorámico dejaba poco sitio.** El escenario pasa de 11 a 15 rem
  de suelo garantizado.

### Añadido

- **El tribunal son tres.** Isabel Achurra preside con hambre, Óscar Pinilla
  anota y sólo interviene por el acta, Amanda Riquelme hace la pregunta que
  nadie quería hacer. Dos personajes nuevos con su arte horneado. D-029.
- **La cámara sigue a quien habla.** Cada línea del guion puede declarar `quien`
  la dice y `a` quién: gesticula sólo esa persona y la cámara va a ella, o abre
  para encuadrar a las dos cuando alguien le habla a alguien. Antes el encuadre
  se fijaba una vez por nodo y no se movía aunque contestaran tres personas
  distintas. D-029.
- `src/lib/rpg/encuadre.ts`: la matemática del encuadre, fuera de Phaser y con
  diez pruebas. Es la única parte de la cinematografía que puede equivocarse en
  silencio.
- **Humor.** El Capítulo 0 se reescribe como comedia de sala, con el límite
  anotado: nadie hace un chiste a costa de la acusada. D-030.
- Dos pruebas más sobre el guion: que toda línea dirigida apunte a alguien que
  existe, y que los tres jueces hablen. Total: 44.
- **El juego se juega sin desplazar la página.** La cabina mide `100dvh` menos
  el cromo del sitio y reparte ese alto entre barra superior, escena, panel y
  acciones. Antes había que bajar 895 px para empezar a jugar y el juego seguía
  sin caber; la creación de personaje medía 1207 px en un viewport de 768.
  D-027.
- **Pantalla completa propia**, sin depender de la del navegador: un botón en la
  barra del juego pone la cabina en `fixed`. Se sale con el mismo botón o desde
  la pausa.
- Barra superior del juego con el rótulo «Ficción · prototipo», que a pantalla
  completa es el único que queda a la vista. D-028.
- Barra de acciones estructural en todas las pantallas del juego: «Continuar»,
  «Entrar a la sala» y «Alegato final» dejan de vivir dentro del texto.
- El veredicto se lee paginado, con contador `n/total`.
- Siete pruebas nuevas (`cabina.test.ts`) que cierran las tres formas concretas
  en que este layout se rompió: alturas de pantalla sueltas, contenedores
  flexibles sin `min-height: 0` y barras de acciones dentro de la zona que se
  desplaza. Total: 32.

- **La Ley de los Audaces**: RPG jurídico chileno jugable en
  `/experimentos/juegos/ley-de-los-audaces`. Capítulo 0 completo —creación de
  personaje, audiencia, contradicción, prueba y alegato final—, con su motor,
  su reparto de arte procedural y su documentación dentro de este repositorio.
- Ficha auditable: reparto, referencias normativas con su estado de verificación
  y pendientes declarados, calculados del propio contenido.
- `docs/juegos/ley-de-los-audaces/`: checkpoint, decisiones, dirección de arte,
  QA, backlog, devlog y encargos a agentes.
- Scripts `juego:arte` (horneado del arte) y `juego:suelto` (el juego en un
  archivo, sin red).
- `npm run verify` incorpora los tests: 25, con Vitest.
- `docs/AUDITORIA-2026-08-31.md`: auditoría del repositorio completo, con foco en
  la sección `/laboratorio`.
- `docs/PUENTE-Y-HOJA-DE-RUTA.md`: qué es el sitio como puente entre proyectos,
  los cuatro pendientes reales y en qué fase entra cada uno. Documento interno:
  las fichas que propone **no** están publicadas.
- `docs/juegos/ley-de-los-audaces/misiones/INFORME-2026-08-31.md`: informe de la
  misión de publicación.

### Cambiado

- La ficha de `La Ley de los Audaces` deja de describir el juego anterior
  —legislar bajo presión— y pasa a `prototipo` con enlace jugable.
- `Experiment` admite `jugableEn`; la tarjeta pinta el botón **sólo si existe**.
- `/experimentos/juegos` declara el estado real de cada pieza y **abre con el
  juego destacado**: estado, botón «Jugar el Capítulo 0», enlace a su
  documentación y cuatro cifras calculadas del propio capítulo. El catálogo de
  abajo pasa a mostrar sólo lo que todavía no se puede tocar. D-026.
- **La página del juego abre con el juego.** La cabecera, el aviso de ficción y
  la ficha auditable pasan debajo de la cabina.
- **HUD responsive**: columna lateral cuando hay ancho, banda horizontal
  compacta cuando no. Las seis estadísticas se van a la pausa en vez de
  desaparecer.
- **Creación de personaje en dos columnas**: nombre y avatar a un lado,
  especialidad al otro. Las tres decisiones se ven a la vez.
- **La sala llena el ancho del hueco.** Phaser pasa de `Scale.FIT` a
  `Scale.ENVELOP`: con FIT, a 1366×650 el tribunal quedaba en 311 px dentro de
  un hueco de 1082, con 770 px de franjas negras. Ahora cubre y recorta techo y
  suelo, que es donde no pasa nada, y la cámara sigue a quien habla. D-027.
- El panel reserva siempre 11 rem para la sala. Cuando su contenido no cabe en
  lo que le toca, se desplaza por dentro; la barra de acciones sigue fuera de
  ese desplazamiento.
- Phaser arranca con `audio: { noAudio: true }`. El capítulo no tiene sonido y
  el contexto de audio dejaba dos `InvalidStateError` en la consola al salir de
  la ruta.

### Corregido

- **La barra de acciones se salía de la pantalla en móvil en horizontal.** A
  844×390 la cabina medía 352 px por su alto mínimo y el cromo del sitio otros
  93, contra 390 de viewport. Mínimo bajado a 16 rem.
- **El lanzador de EVA tapaba el botón principal** en pantallas estrechas, donde
  el HUD no ocupa el lateral derecho. La barra de acciones le reserva su
  esquina.
- **Al salir de pantalla completa la cabina se quedaba con el viewport entero.**
  El observador medía el cromo mientras la cabina estaba en `fixed` y guardaba
  cero. Ahora no se mide en ese estado.
- **La sala del tribunal había desaparecido en la mayoría de los portátiles.**
  El umbral que la ocultaba estaba en 704 px de alto y el viewport real de un
  1366×768 ronda los 650: la regla borraba el tribunal justo en la pantalla más
  común. Ahora sólo desaparece por debajo de 432 px.

- **`/experimentos` rompía la hidratación.** La ficha del juego trae su propio
  enlace «Jugar» y el catálogo la envolvía en otro: `<a>` dentro de `<a>`, HTML
  inválido, y React descartaba el árbol servido para rehidratar la página
  entera. La tarjeta deja de ser enlace cuando la ficha ya trae el suyo. D-024.
- **El recuento de familias dejaba fuera al juego.** Desde que la pieza jugable
  tiene ruta propia, comparar con `===` la excluía: «Juegos» anunciaba 1 pieza
  con 2 en el catálogo. Se cuenta por prefijo de ruta. D-025.

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


## Rediseño UX/UI · 31-08-2026

Auditoría en `UX-UI-AUDIT.md`, detalle por fases en `UX-UI-CHANGELOG.md`.

- El escudo de la Escuela de Derecho sale del sitio público hasta que exista
  autorización, y con él un retrato de EVA que lo llevaba incrustado en el
  píxel junto al rótulo «EVA · ESCUELA DE DERECHO PUCV». D-033.
- Tres datos falsos corregidos: «registros vacíos» sobre 24 fuentes cargadas,
  «el PDF de noventa y seis páginas» (son 76) y «cuatro entradas» sobre cinco
  tarjetas.
- Las 24 fuentes y las 18 afirmaciones se publican por primera vez. El sitio
  afirmaba trazabilidad y sólo enseñaba el esquema de sus registros.
- Tres familias de estado con silueta propia: madurez, estado editorial y nivel
  de evidencia dejan de compartir componente.
- La portada encabeza el laboratorio y no el nombre del profesor. Navegación
  reordenada: primarias Informes, Experimentos y Lab.
- Responsive y accesibilidad medidos: un overflow de 69 px corregido, 48
  objetivos táctiles por debajo de 24 px elevados, 118 fallos de contraste en
  tema claro eliminados.
- 12 pruebas nuevas sobre `src/data/`, que no tenía ninguna.

## Auditoría v0.3.0 · 01-09-2026

Estado hallazgo por hallazgo en `docs/audit-v0.3.0.md`.

- Once afirmaciones recalibradas al diseño de sus fuentes: alcance del estudio
  de Reading, comparación Harvard–Bastani, gobernanza, excepcionalismo jurídico
  y detectores dejan de afirmar más de lo que su evidencia sostiene.
- «D5 · causalidad establecida» → «identificación causal en contexto
  experimental», con el alcance de generalización como dimensión aparte.
- La taxonomía se parte en cuatro: estado documental, robustez, nivel
  demostrativo y generalización. «VERIFICADO» las mezclaba.
- Fuentes críticas contrastadas contra su publicación original. Aparece una
  corrección de PNAS sobre Bastani et al. que el informe no mencionaba.
- Título canónico único entre PDF y web; estado de versión derivado de una sola
  fuente; cadena de conteos publicada.
- Portada del informe: cifras con universo y muestra, «Investigación aplicada»
  en vez de «Informe experto», autoría con nombre.
- Informe regenerado como v0.3.0 —77 páginas, sin residuos de Word— y publicado
  junto a v0.2.0, que no se sobrescribe.
- Changelog a nivel de afirmación: qué decía, qué dice y por qué.
- Política pública de correcciones en `/correcciones`.
