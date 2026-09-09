# Encargo · Informe 01 v3.0.0 — de la descripción a la decisión, y la metodología que lo sostiene

Ábrelo en una sesión de Claude Code en la raíz del repositorio y ejecútalo de
principio a fin. Es un flujo, no un manifiesto: cada fase termina en algo
medible y publicado.

**Rellena esto antes de empezar.** Sin ello no hay criterio de suficiencia y la
sesión trabajará hasta agotarse.

```
DESTINATARIO            ………………………………………………………
QUÉ DEBE PODER DECIDIR  ………………………………………………………
FECHA DE ENTREGA        ………………………………………………………
ALCANCE CONTRATADO      ………………………………………………………
```

Si esos campos siguen vacíos, trabaja hasta cerrar la **fase 4** y detente ahí:
es el punto donde el informe ya mejoró sustantivamente y todavía no has gastado
presupuesto en superficie.

---

## 0 · Las dos cosas que hay que entender antes de tocar nada

### El repositorio ya resolvió mucho de esto

Once versiones publicadas y seis decisiones metodológicas registradas. La
trazabilidad, los niveles de confianza, la contraevidencia, el versionado y el
control de conflicto de interés **ya están construidos y probados**. Rehacerlos
consume el presupuesto sin mejorar el informe.

| Lo que un encargo pediría | Dónde ya está |
|---|---|
| Cadena fuente → evidencia → iniciativa → afirmación | 6 CSV en `content/reports/01_.../canonical/dataset/` |
| Niveles de confianza | `[HECHO] [SEÑAL] [INFERENCIA] [HIPÓTESIS] [PENDIENTE]` |
| Hallazgo con dato, lectura y límite | Los ocho hallazgos ya tienen esa estructura |
| Contraevidencia | Anexo B · 23 divergencias publicadas, doce materiales |
| Ausencia ≠ ausencia de evidencia | Estados `no localizada` / `no concluyente` con sus rutas |
| Cobertura separada de actividad | Figura de cobertura + comprobación cobertura × índice (r = 0,34) |
| Conflicto de interés | D-037 · sección 8 · complemento PUCV sin puntuación |
| Una fuente única para tabla y figura | D-039 · `tools/informes/informe-01/comparador/figuras.mjs` |
| Versionado sin sobrescribir | CLAUDE.md §8 · 11 versiones vivas con sus descargas |
| QA de maqueta | `tools/informes/lector/verificar-maqueta.mjs` |

### Hay dos metodologías y ninguna sabe de la otra

Esto es lo que este encargo viene a conciliar, y no es cosmético.

- **`docs/informes/01-metodologia.md`** se presenta como «el método del
  proyecto» y en realidad es **el del Informe 02**: treinta instituciones, tipos
  de fuente A–F, niveles demostrativos D1–D5, estados epistemológicos y una
  escala de profundidad 0–5.
- **El Informe 01 usa otra**: `METODOLOGIA_IA_DERECHO_V2.1` más la enmienda 2.2,
  en `content/reports/01_.../canonical/`. Diez capacidades, siete estados,
  trece rutas, una rúbrica de 0–3 y el índice de formalización como banda.

Vocabularios distintos, ninguna referencia cruzada, y el `README.md` de
`docs/informes/` anuncia siete documentos cuando hay nueve.

**No inventes una tercera.** El aporte metodológico de este encargo es el
**espinazo común** bajo el que las dos encajan, y las tres capas que a ninguna
le sobran porque ninguna las tiene.

---

## 1 · El espinazo común

Ocho capas. Las cinco primeras existen en ambos informes con otros nombres; las
capas 5, 6 y 7 **no existen en ninguno**, y son exactamente el salto que se
pide.

| Capa | Pregunta | Informe 01 | Informe 02 | ¿Existe? |
|---|---|---|---|---|
| 1 · Fuente | ¿De dónde viene? | `fuentes.csv`, 74 + 31 | Tipos A–F | ✅ |
| 2 · Evidencia | ¿Qué respalda exactamente? | `evidencias.csv` | Niveles D1–D5 | ✅ |
| 3 · Dato | ¿Cómo se estructura? | Matriz de 10 capacidades × 7 estados | Escala 0–5 | ✅ |
| 4 · Hallazgo | ¿Qué demuestra el conjunto? | 8 hallazgos con dato, lectura y límite | Matriz maestra | ✅ |
| **5 · Interpretación** | **¿Qué significa?** | — | — | ❌ **falta** |
| **6 · Implicación** | **¿Por qué importa?** | Enunciado, sin desarrollar | — | ❌ **falta** |
| **7 · Decisión** | **¿Qué acción sería razonable?** | Sólo en el complemento PUCV | — | ❌ **falta** |
| 8 · Incertidumbre | ¿Qué no sabemos? | Bandas, celdas sin concluir, límites | Estados epistemológicos | ✅ |

**Regla:** nunca fundir dos capas de forma implícita. Un dato no es un hallazgo;
un hallazgo no es una interpretación; una interpretación no es una
recomendación. El lector puede verlas integradas con elegancia, pero el sistema
tiene que saber cuál es cuál.

---

## 2 · Las seis reglas que no se tocan

Decididas, razonadas y varias con prueba automática. Romper una es un error.

1. **Una versión publicada no se sobrescribe** (CLAUDE.md §8). Cambiar el fondo
   exige versión nueva; reponer la forma se permite y se mide.
2. **La PUCV no entra al comparador** (D-037). Sigue en la cohorte, no en el
   orden. Su análisis va al complemento, que no puntúa ni compara.
3. **Matriz canónica `.v2`** (D-039). Cohorte once, comparador diez. Corpus,
   fuentes y rutas dicen *once*; capacidades, puntos y posiciones dicen *diez*.
4. **Una figura derivada de un dato no se dibuja aparte del dato** (D-039).
   Ninguna cifra literal dentro de un `<svg>`. **Se extiende a la web en la
   fase 5**: ningún componente React con datos a mano.
5. **El documento afirma; el sitio versiona** (D-041). El cuerpo no compara con
   versiones anteriores. Hay una prueba que falla si vuelve.
6. **Una cabecera no se parte** (D-042). Si no cabe, se acorta y se declara la
   abreviatura.

---

## 3 · Mecánica: cómo se toca este documento

**Aquí es donde más sesiones se estrellan.**

El Informe 01 desde la v2.0.0 **no nace en el repositorio**: llega como HTML
cerrado desde una cadena externa (D-038). No busques los `.json` que promete la
skill `informe-vivo` — no existen para este informe. La skill describe el camino
del informe *nacido en el repo*; éste va por el del *entregado cerrado*.

- **El original no se edita a mano.** Se deriva una versión nueva con un script
  de sustituciones contadas, como `tools/informes/informe-01/v2.2.0/armonizar.mjs`.
  Cada sustitución declara cuántas apariciones espera y el script no escribe
  nada si una sola no cuadra.
- **El `.docx` de origen** se produce convirtiendo el HTML con Word por COM.
  `Join-Path` devuelve un PSObject que `[ref]` no acepta: usa `[string]`. Luego
  `npm run informe:word` lo lleva de 10 a 12 pt. El Word nunca ha llevado
  figuras y eso no es un defecto pendiente.
- **Cadena completa:** `npm run informe:publicar` y después `npm run verify`.
- **Al medir maqueta, fija el viewport a mano.** `newPage({viewportSize})` no es
  la opción válida —es `viewport`— y sin ella mides a 1280 px. La caja útil de
  impresión son **160 mm = 605 px**. Dos conclusiones falsas han salido de ahí.
- **CRLF.** Al insertar bloques en `.ts` y `.md`, convierte los saltos.
- **Los heredoc del shell** se comen backticks y barras invertidas: la prosa
  larga con código se escribe con Write o Edit.
- **Sesiones concurrentes.** Consulta el remoto con `git ls-remote origin main`,
  nunca con `origin/main`.

---

## 4 · El flujo

Ocho fases. Cada una termina en algo medible. **Sólo hay una puerta de
aprobación humana** y está en la fase 6.

### FASE 0 · Orientar · ~30 min

Lee `CLAUDE.md`, `docs/DECISIONS.md` (D-037 a D-042), `CHANGELOG.md`,
`docs/informes/README.md` y `09-recalculo-comparador.md`. Clasifica cada pieza
importante: **A** funciona · **B** mejorar · **C** documentado sin implementar ·
**D** falta · **E** no tocar.

→ *Sale:* la clasificación, en el informe final.

### FASE 1 · Medir la línea base

Antes de mejorar nada, deja las cifras de partida:

```bash
npm run verify
node tools/informes/lector/verificar-maqueta.mjs public/descargas/informe-01-v2.2.0/informe-01-v2.2.0.html
node tools/informes/informe-01/comparador/figuras.mjs
```

→ *Sale:* tabla de partida. Sin ella no podrás demostrar que mejoraste.

### FASE 2 · Auditoría sustantiva

Para cada sección del informe:

| Sección | Qué dice | Qué demuestran los datos | Interpretación válida | Interpretación débil | Qué sería especulativo |
|---|---|---|---|---|---|

→ *Sale:* `docs/informes/10-auditoria-sustantiva.md`. **Commitéalo antes de
seguir**: si la sesión se corta, esto sobrevive.

### FASE 3 · P0 · coherencia y evidencia

Por orden:

1. **Las 22 fuentes de la Ronda 2 no están contrastadas** y sostienen los 26
   cierres de la matriz `.v2`, que es la que produce el orden publicado. Si una
   cae, el comparador se mueve. **Es la mayor amenaza abierta a lo que el
   informe afirma.** Contrástalas; si no alcanza, publica el análisis de
   sensibilidad que diga qué posiciones dependen de ellas y márcalas como
   sensibles.
2. Cinco celdas sin concluir, en cuatro instituciones; sólo la Universidad de
   los Andes tiene más de una.
3. La referencia «Revista DIE» de la Universidad Central, no localizada en
   ningún dominio.
4. Cualquier contradicción que la fase 2 haya sacado.

### FASE 4 · El salto interpretativo · capas 5, 6 y 7

Aplica a cada bloque sustantivo, con peso proporcional a su importancia:

```
¿QUÉ VEMOS? → ¿QUÉ SIGNIFICA? → ¿POR QUÉ IMPORTA?
            → ¿QUÉ DECISIONES SUGIERE? → ¿QUÉ NO SABEMOS?
```

**Qué añadir:**

- **Patrones transversales**, derivados del dataset. El material está: las tres
  formas de ausencia —unánime, bimodal, de umbral— ya están identificadas.
  Falta leer qué dicen juntas sobre el campo.
- **Tensiones**, más útiles que un orden. La Universidad Autónoma acredita 17
  puntos con 5 rutas recorridas; la Universidad de Chile, 12 con 12. Eso dice
  algo sobre qué mide el instrumento, y hoy sólo se enuncia.
- **Brechas**: `qué falta · evidencia · por qué importa · qué capacidad
  desbloquearía`.
- **Estado y trayectoria.** 41 de 49 iniciativas fechadas empiezan en 2025 o
  después: eso permite hablar de apertura de campo. **No** permite inventar
  trayectorias por institución.
- **Sección «De los datos a la decisión»**: diagnóstico · patrones · brechas ·
  riesgos · oportunidades · **3 a 5 prioridades**, no veinte.

**Los límites que protegen el informe:**

- **Separa sistémicas de institucionales.** Recomendaciones al campo, al
  regulador o a la política pública: territorio legítimo. Recomendaciones
  dirigidas a una universidad nombrada del comparador: **no**. El autor tiene un
  conflicto declarado con una de ellas, y prescribir a las otras nueve desde ahí
  es lo que la sección 8 existe para evitar. Lo prescriptivo sobre la PUCV ya
  vive en el complemento; que siga ahí.
- Ninguna recomendación como consecuencia automática de un dato: declara
  evidencia, problema y qué información falta.
- **Si la evidencia sólo permite describir, dilo.** «Permite describir X, pero no
  establecer Y» es una conclusión útil; recomendar porque todo informe recomienda
  algo, no.
- Verbos calibrados: *sugiere, indica, es consistente con*. «Queda demostrado»
  sólo con evidencia excepcional.
- **Sensibilidad:** si una conclusión cambia al reclasificar una fuente o una
  celda, márcala.

→ *Publica:* `npm run informe:publicar` y verifica.

### FASE 5 · UX/UI · lo que se tiene que ver en Vercel

Ésta es la fase donde el trabajo se hace visible. **Todo lo de aquí es
alcanzable hoy** con lo que el repo ya tiene: `matriz-v2.json` es legible por
máquina y ya alimenta ocho figuras.

**5.1 · Escalera de lectura en la ficha del informe.** Hoy la página incrusta el
documento en un iframe de ~100.000 px antes de la ficha; el navegador tarda en
pintarlo. Reorganízala en tres profundidades declaradas:

```
3 min   →  pregunta · respuesta · 5-7 hallazgos · prioridades · límites
15 min  →  comparador y matriz nativos, explorables
1 h     →  el documento completo, cargado en diferido
```

Respeta la regla vigente —*el informe se abre leído*, CLAUDE.md §8— pero el
documento puede cargarse en diferido sin romperla.

**5.2 · Comparador y matriz nativos.** Componentes React que leen
`matriz-v2.json`, no valores a mano. Es la regla 4 del §2 extendida a la web.
Permiten ordenar, filtrar por capacidad, y ver la banda de incertidumbre. Sin
esto, la web sólo sirve un PDF dentro de un marco.

**5.3 · Inspector de evidencia.** Al pulsar una celda de la matriz: institución,
capacidad, estado, puntos, y **la nota y el `source_id` del cierre de la Ronda
2** — todo eso ya está en `matriz-v2.json` bajo `aplicados`. Es la cadena
`hallazgo → dato → evidencia → fuente` con lo que existe hoy.

**5.4 · Contexto en las versiones históricas.** Cada una debe decir por qué fue
sustituida y enlazar la vigente, sin alterar sus conclusiones originales.

**5.5 · Accesibilidad y responsive.** Objetivo WCAG 2.2 AA donde sea razonable.
Toda figura con título, explicación y alternativa textual o tabular. Revisa
1440 · 1280 · 1024 · 768 · 430 · 390 y que no haya scroll horizontal global.

**5.6 · Dirección visual.** Conserva la identidad: *archivo académico del futuro
+ publicación editorial + datos vivos*. Nada de cyberpunk, neón, cripto ni SaaS
genérico. El movimiento explica transiciones y estados; no decora.

**Lo que NO cabe aquí, y por qué.** Fichas institucionales navegables, registro
de fuentes explorable y evidencia por iniciativa exigen **recompilar el dataset
canónico a datos tipados**, que sólo existe para la v0.8.0
(`src/data/informe01*.ts`). Es un proyecto propio, no un retoque. Si lo
acometes, va con presupuesto declarado; si no, queda como pendiente con su coste
estimado.

→ *Sale:* diferencias visibles en Vercel, con capturas antes y después.

### FASE 6 · Publicar

```bash
npm run informe:publicar
node tools/informes/lector/verificar-maqueta.mjs <html publicado>
npm run verify
git ls-remote origin main     # antes de empujar
```

> **🚦 ÚNICA PUERTA DE APROBACIÓN.** Si algo cambia una cifra publicada sobre una
> institución con nombre, **para y pregunta antes de empujar**. Todo lo demás
> —maqueta, UX, prosa que no altera cifras— se publica sin preguntar.

### FASE 7 · Metodología y cuellos de botella

1. **Concilia las dos metodologías.** Escribe el espinazo del §1 como documento
   canónico, con la tabla de correspondencias. Renumera el `README.md` de
   `docs/informes/`, que anuncia siete documentos y hay nueve. **No crees un
   `METODOLOGIA_V2_FINAL.md`**: amplía lo que existe y enlaza.
2. **Registra las decisiones** en `docs/DECISIONS.md` con el formato vigente,
   incluido **qué se descartó y por qué**.
3. **Cierra el ciclo de cuellos de botella** (§5 de este encargo).

### FASE 8 · Handoff

El informe final del §7.

---

## 5 · El ciclo de cuellos de botella

Esto es lo que hace que la metodología mejore sola en vez de envejecer. Crea o
amplía **`docs/informes/CUELLOS-DE-BOTELLA.md`** y trabájalo así:

```
MEDIR  →  NOMBRAR  →  CORREGIR UNO  →  ESCRIBIR LA REGLA  →  AUTOMATIZAR LA PRUEBA
```

**Cada sesión que toque un informe deja el registro con una fila más.** El
formato, con los tres ejemplos que ya existen y que sirven de modelo:

| Cuello | Cómo se midió | Coste | Regla que quedó | Prueba |
|---|---|---|---|---|
| Figura y tabla salían de sitios distintos | Las tres tablas eran `.v2` y las cuatro figuras `.v1` | Dos días publicado con la PUCV encabezando un orden del que estaba excluida | Una figura derivada de un dato no se dibuja aparte del dato (D-039) | `figuras.mjs` es la única fuente |
| El documento se narraba a sí mismo | 69 pasajes comparando con versiones que el lector no tiene | El informe se leía como changelog | El documento afirma; el sitio versiona (D-041) | `informes.test.ts` |
| `overflow-wrap:anywhere` sobre `td, th` | 33 celdas con palabras partidas | «PRESEN / CIA», «PISO» en vertical | Una cabecera no se parte (D-042) | `verificar-maqueta.mjs` |

**Reglas del ciclo:**

- **Un cuello sin cifra no es un cuello, es una impresión.** Mídelo antes de
  nombrarlo.
- **Corrige uno por sesión, no cinco.** El valor está en la regla y en la
  prueba, no en el parche.
- **Una regla sin prueba dura una entrega.** Si no puedes automatizarla,
  escríbela igual, y dilo.
- **Proporcionalidad.** Un hallazgo menor no necesita cinco niveles de revisión.
  La carga metodológica va con el impacto de la afirmación.
- **Al terminar, propón el siguiente cuello** con su cifra medida. Es lo que
  hace que la sesión siguiente empiece con trabajo en vez de con arqueología.

---

## 6 · Criterios de aceptación

Si no puedes medirlo, no lo declares hecho.

| # | Criterio | Cómo se comprueba |
|---|---|---|
| 1 | Ninguna afirmación nueva sin evidencia en el corpus | Cita `source_id` o el anexo que la sostiene |
| 2 | Cero recomendaciones a una universidad nombrada del comparador | Búsqueda por nombre en las secciones prescriptivas |
| 3 | 3 a 5 prioridades, cada una con evidencia, actor y qué falta saber | Recuento |
| 4 | Cero menciones a versiones anteriores en el cuerpo | `npm run test` |
| 5 | Cero palabras partidas · cero desbordes · cero rótulos sobre barra | `verificar-maqueta.mjs` |
| 6 | Toda figura y todo componente salen de un dataset | Ninguna cifra literal en `<svg>` ni en React |
| 7 | Web y PDF dicen la misma cifra | Salen del mismo HTML |
| 8 | `npm run verify` en verde | typecheck + lint + test + build |
| 9 | Versiones anteriores servidas, enlazadas y contextualizadas | Prueba de botones + revisión |
| 10 | Cada conclusión reforzada declara confianza y contraevidencia | Revisión sobre la lista |
| 11 | Sin scroll horizontal en los seis anchos | Revisión en el navegador |
| 12 | El registro de cuellos de botella tiene una fila nueva | `CUELLOS-DE-BOTELLA.md` |

---

## 7 · Informe final de trabajo

```
LÍNEA BASE     las cifras de la fase 1
AUDITORÍA      qué encontraste, con cifras
CONTENIDO      qué mejoró en análisis e interpretación
DECISIONES     qué implicaciones se incorporaron, y cuáles se descartaron
               por falta de evidencia
WEB            qué cambió, con capturas antes y después
PDF            qué cambió, medido
METODOLOGÍA    el espinazo conciliado y las reglas nuevas
CUELLOS        el que cerraste, y el siguiente con su cifra
VERSIONADO     cómo se preservó el linaje
QA             las doce casillas del §6
PENDIENTES     con sus cifras ya calculadas
```

---

## 8 · El criterio final

El informe debe pasar de

> «estas universidades hicieron estas cosas»

a

> «estos patrones emergen, estas capacidades se consolidan, estas brechas siguen
> abiertas, y éstas son las decisiones que razonablemente deberían considerarse»

sin sacrificar evidencia, trazabilidad, incertidumbre ni versionado. Un lector
debe poder preguntar «¿de dónde salió esto?» y llegar a la fuente. Una autoridad
universitaria debe poder responder dónde está, qué le falta, qué importa y qué
medir.

**Un informe más bonito que afirme una sola cosa que la evidencia no sostiene es
un peor informe.**
