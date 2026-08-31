# El sitio como puente · hoja de ruta

**Fecha:** 31-08-2026
**Estado:** propuesta interna. **Nada de este documento está publicado en el sitio.**

---

## 0. Advertencia que va primero

Este laboratorio **no fue encargado**. Se construye por iniciativa propia, para
tener trazabilidad y seguimiento del trabajo en IA y Derecho, y con la
posibilidad —no la certeza— de que sirva después como espacio común.

De ahí tres consecuencias que este documento respeta y que no conviene relajar:

1. **Al profesor Aldunate no se le ha planteado la idea.** Mientras eso no
   ocurra, el sitio no puede contener nada que parezca un compromiso suyo, una
   agenda suya o una oferta hecha en su nombre.
2. **Por eso las fichas de la sección 3 no se publican todavía.** Están escritas
   y listas para pegar, pero viven aquí, en `docs/`, y no en `src/data/`.
   Publicarlas convertiría proyectos propios en promesas institucionales. La
   regla dura 3 de `CLAUDE.md` no distingue entre inventar y anticipar.
3. **`noindex` y la franja de prototipo se quedan** hasta que exista una
   conversación y, si corresponde, una autorización.

Lo que sí se puede hacer sin pedirle permiso a nadie es tener el trabajo
ordenado, verificable y en un solo sitio. Eso es lo que sigue.

---

## 1. Qué es el puente, y qué no

**Es:** un lugar donde el trabajo en IA y Derecho queda registrado con su estado
real —qué está verificado, qué está en investigación, qué es una idea—, de modo
que cualquiera que llegue después pueda ver la cadena completa entre una fuente
y una conclusión sin preguntarle a nadie.

**No es:** una vitrina, un portafolio ni un canal de comunicación con la PUCV.
Si en algún momento sirve para conversar, será porque el contenido ya valía la
pena por sí solo, no porque la página estuviera bien diseñada.

La diferencia es práctica: un puente se justifica por lo que cruza. Hoy cruzan
dos informes, cinco experimentos y un juego. Es poco, pero es real. Añadir
secciones vacías para «prepararse» hace exactamente lo contrario.

---

## 2. Los pendientes reales, y dónde encajan

Cuatro proyectos declarados. Esto es lo que **ya existe** de cada uno dentro del
repositorio, que resultó ser bastante más de lo que parecía.

### 2.1 Informe sobre uso de IA en universidades chilenas

**Ya existe como `INFORME 01`**, slug `ia-escuelas-derecho-chile`, con página
propia en `/informes/ia-escuelas-derecho-chile`.

- Estado: `en-investigacion`, `v0.1.0`, actualizado 29-08-2026.
- Tiene: ocho ejes, doce variables por registro, método declarado y preguntas
  abiertas. La estructura está completa.
- **Le falta:** el registro poblado. El informe declara que no emitirá
  conclusiones sobre tendencias nacionales hasta tener cobertura suficiente, y
  esa cobertura no existe todavía.
- Carpeta de trabajo: `content/reports/01_ia_escuelas_derecho_chile/`.

Es el pendiente con más andamiaje ya montado y más trabajo de campo por delante.
Nótese que el alcance registrado es **Escuelas y Facultades de Derecho**, no
universidades en general: si el proyecto que se tiene en mente es más ancho, hay
que decidir si se ensancha el 01 o se abre un informe nuevo. No mezclar.

### 2.2 Enseñanza en el contexto de la IA

**Ya existe como `INFORME 02`** y está mucho más avanzado de lo que sugiere la
lista de pendientes.

- Estado: `en-revision`, `v0.2.0`. Veinticuatro capítulos.
- **Publicado y descargable**: PDF, DOCX y resumen ejecutivo en
  `public/descargas/`.
- Verificado en esta auditoría: esos archivos son byte a byte los mismos que
  están en el escritorio bajo `INFORME IA UNIVERSIDAD/` (mismo SHA-256). No hay
  dos versiones circulando, que era el riesgo obvio.
- Hallazgo central registrado: de treinta y ocho hallazgos, sólo seis alcanzan
  causalidad establecida.

**No es un pendiente: es un entregable en revisión.** Lo que falta es cerrar la
revisión y decidir si pasa a `publicado`.

### 2.3 Curso básico de IA para estudiantes de Derecho PUCV

**No existe en el repositorio.** Lo más cercano es la ficha `taller-docente`
(«Secuencia docente asistida») del laboratorio, que describe una estructura de
sesión —una tarea, un error inducido, una verificación, un registro— y no la
entrega.

Es el pendiente con menos escrito y el más delicado: un curso dirigido a
estudiantes de una escuela concreta no se publica sin que esa escuela lo sepa.
Se diseña, se guarda en `content/`, y no sale a la web hasta que exista
conversación.

### 2.4 Educación continua y políticas de uso de IA

**No existen en el repositorio.** Territorio declarado sin ficha: el laboratorio
tiene la categoría `seguridad-privacidad` con una sola entrada en estado idea
(«Protocolo de datos sensibles»), y nada sobre diseño de políticas
institucionales ni sobre formatos de educación continua.

Son los dos más lejanos. No conviene abrirles sección todavía.

---

## 3. Fichas propuestas, listas para pegar y sin publicar

Cuando exista la conversación de la sección 0, esto entra en `src/data/lab.ts`
sin escribir nada nuevo. Hasta entonces, se queda aquí.

Se proponen **tres**, no cinco: las tres que corresponden a trabajo que ya
ocurrió y por tanto podrían llevar evidencia adjunta desde el primer día. Un
laboratorio que estrena fichas vacías repite el problema que la auditoría
describe en H-03.

```ts
// Categoría hoy vacía y, sin embargo, la más poblada en la realidad: el juego
// entero se construyó así, y los informes de misión son la evidencia.
{
  id: 'encargo-a-agentes',
  title: 'Encargo verificable a agentes',
  summary:
    'Formato de encargo que fija alcance, criterio de término y forma del informe antes de que un agente toque el repositorio. El informe de vuelta declara qué falló con el mensaje literal, no un resumen amable.',
  status: 'prototype',
  category: 'agentes-automatizacion',
  maturity: 'en-prueba',
  inputs: ['Objetivo acotado', 'Fuera de alcance explícito', 'Plantilla de informe'],
  outputs: ['Encargo ejecutable', 'Informe de misión con enlaces y fallos'],
  limitations: [
    'Probado en un proyecto propio, no en trabajo de terceros.',
    'No mide calidad del resultado: mide que el resultado sea auditable.',
    'Depende de que el encargo esté bien acotado; un encargo vago produce un informe vago.',
  ],
  repoUrl: 'https://github.com/dojedacifuentes/aldunate_experimento02/tree/main/docs/juegos/ley-de-los-audaces/misiones',
  updatedAt: '2026-08-31',
},

// La ficha que documenta cómo se produjo el informe 02, que es el único
// entregable del proyecto con descargas reales.
{
  id: 'produccion-informe-vivo',
  title: 'Producción de informe vivo',
  summary:
    'Cadena que va del corpus de fuentes al documento entregable sin perder el vínculo entre afirmación y fuente. Una versión publicada no se sobrescribe: se agrega con su changelog.',
  status: 'prototype',
  category: 'flujos-verificables',
  maturity: 'en-prueba',
  inputs: ['Corpus de fuentes con `source_id`', 'Estructura de capítulos', 'Nivel de evidencia por afirmación'],
  outputs: ['Documento versionado', 'PDF y DOCX', 'Registro de qué cambió entre versiones'],
  limitations: [
    'La verificación de cada fuente sigue siendo humana.',
    'No detecta una fuente real mal interpretada, sólo una fuente ausente.',
    'Probada en un informe; un segundo caso todavía no la valida.',
  ],
  demoUrl: '/informes/transformacion-ensenanza-derecho',
  updatedAt: '2026-08-31',
},

// El juego, catalogado donde corresponde: como prototipo del laboratorio y no
// sólo como experimento.
{
  id: 'rpg-decision-juridica',
  title: 'Decisión jurídica como mecánica jugable',
  summary:
    'Prototipo que convierte hecho, prueba y norma en tres piezas que el jugador tiene que armar para alegar. Sirve para observar dónde se rompe el razonamiento de alguien que aprende, no para enseñar Derecho.',
  status: 'prototype',
  category: 'prototipos',
  maturity: 'en-prueba',
  inputs: ['Grafo de nodos del capítulo', 'Referencias normativas con estado de verificación'],
  outputs: ['Capítulo jugable', 'Ficha auditable con reparto, fuentes y pendientes'],
  limitations: [
    'Ficción: causa, tribunal, documentos y personajes son inventados.',
    'Las tres referencias normativas están rotuladas «por verificar» y no se presentan como Derecho vigente.',
    'Un solo capítulo. Nadie externo lo ha jugado sin instrucciones todavía.',
  ],
  demoUrl: '/experimentos/juegos/ley-de-los-audaces',
  updatedAt: '2026-08-31',
},
```

Las tres traen `demoUrl` o `repoUrl`. Eso resuelve H-05 —código escrito y nunca
ejecutado— con contenido en vez de con más código.

---

## 4. Hoja de ruta

Cuatro fases. La condición de paso entre una y otra no es una fecha: es un
hecho comprobable.

### Fase A · Cerrar lo que ya está abierto *(no depende de nadie)*

| # | Qué | Por qué ahora |
|---|---|---|
| A1 | Fusionar esta rama y ver el juego en producción | Es lo único bloqueado por un clic |
| A2 | Darle artefacto a tres fichas del laboratorio (auditoría §7.1) | Medio día, y la sección deja de ser una vitrina |
| A3 | Bajar a `idea` toda ficha sin artefacto | Coherencia con la regla que el propio sitio impone |
| A4 | Tres pruebas sobre `src/data/` (auditoría §7.4) | Habrían atajado los dos defectos de esta auditoría |
| A5 | Cerrar la revisión del informe 02 y decidir si pasa a `publicado` | Es el entregable más terminado y está detenido en `en-revision` |

**Paso a B cuando:** el laboratorio tenga al menos tres fichas con archivo
descargable y el informe 02 tenga estado definitivo.

### Fase B · Poblar el informe 01 *(el trabajo de fondo)*

| # | Qué |
|---|---|
| B1 | Decidir el alcance: ¿Escuelas de Derecho, o educación superior completa? |
| B2 | Registrar instituciones una a una, con documento público, fecha y nivel de confianza |
| B3 | Publicar `v0.2.0` sólo cuando la cobertura permita decir algo sin saltar de «varias» a «la tendencia» |

**Paso a C cuando:** el registro tenga cobertura suficiente para que el informe
01 deje de ser una estructura vacía. Es el hito que más tiempo va a tomar y el
que más sostiene todo lo demás.

### Fase C · Enseñar el sitio *(la conversación)*

| # | Qué |
|---|---|
| C1 | Preparar un recorrido de diez minutos: `/investigacion` → informe 02 → el juego |
| C2 | Plantearle la idea al profesor Aldunate, con el sitio ya funcionando |
| C3 | Según lo que responda: autorización de uso del escudo, revisión de la franja de prototipo, `noindex` |

**Nada de la fase D empieza antes de C2.** Publicar antes de preguntar convierte
una propuesta en un hecho consumado, y eso arruina la propuesta.

### Fase D · Sólo si hay luz verde

| # | Qué |
|---|---|
| D1 | Diseño del curso básico de IA para estudiantes de Derecho |
| D2 | Formatos de educación continua |
| D3 | Apoyo al desarrollo de políticas institucionales de uso de IA |
| D4 | Sección de proyectos con su estado, si a esas alturas hay proyectos que mostrar |

---

## 5. Lo que no hay que hacer

Anotado porque son los errores que este tipo de sitio comete siempre.

- **No abrir secciones vacías «para cuando haya contenido».** El sitio ya tiene
  tres páginas legítimamente vacías (`/aldunate` y sus dos hijas) y funcionan
  porque declaran el hueco. Una cuarta empieza a parecer un sitio abandonado.
- **No publicar las fichas de la sección 3 antes de la fase C.** Ver sección 0.
- **No poner el nombre del profesor en nada que no haya dicho él.** Los cinco
  ejes de `researchLines` describen el alcance del laboratorio, no su obra. Esa
  distinción es todo lo que separa este sitio de un problema.
- **No marcar nada como `stable` ni `publicado` para que la página se vea mejor.**

---

## 6. Qué decidir, y quién

| Decisión | De quién es | Bloquea |
|---|---|---|
| Alcance del informe 01: Derecho o educación superior | Tuya | B1, y todo el trabajo de campo |
| Si el informe 02 pasa a `publicado` | Tuya | A5 |
| Dónde vive «Lex Note» (auditoría H-06) | Tuya | Nada, pero afecta la taxonomía |
| Cuándo plantearle la idea al profesor | Tuya | Toda la fase D |
| Autorización del escudo PUCV y `noindex` | Del profesor / la Escuela | C3 |

---

*Documento interno. Si algo de aquí se publica en el sitio, deja de ser interno y
pasa a estar sujeto a las reglas duras de `CLAUDE.md`.*
