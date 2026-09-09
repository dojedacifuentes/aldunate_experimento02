# Encargo · Informe 01 v3.0.0 — de la descripción a la decisión

**Pega este archivo entero en una sesión nueva de Claude Code y ejecútalo.** Es
un flujo, no un manifiesto: cada fase termina en algo medible y publicado.

---

## 0 · Dónde está todo

```
REPOSITORIO LOCAL   C:\Users\Asus\Desktop\aldunate-juego-audaces\aldunate_experimento02
GITHUB              https://github.com/dojedacifuentes/aldunate_experimento02   (rama main)
SITIO EN VIVO       https://aldunateexperimento02.vercel.app
LA PÁGINA           https://aldunateexperimento02.vercel.app/informes/ia-escuelas-derecho-chile
DESPLIEGUE          automático al empujar a main · tarda ~45 s
```

**El repositorio NO está en el directorio de trabajo por defecto.** Empieza con
`cd` a la ruta de arriba, o abre la sesión ahí.

**Estado al 09-09-2026:** versión vigente **v2.2.0**. Once versiones publicadas,
todas servidas y enlazadas. `npm run verify` en verde. Cero palabras partidas,
cero desbordes de tabla, cero menciones a versiones anteriores en el cuerpo.

---

## 1 · El encargo, en una frase

Llevar el Informe 01 de **describir** a **interpretar y orientar decisiones**,
conciliar las dos metodologías del repositorio en un espinazo común, y hacer
que el salto se vea en Vercel. Todo en una sesión, dejando pendientes medidos
para la siguiente.

### Para quién es

Circula más allá del destinatario original. El lector típico es **un docente de
Derecho**, no un analista de datos: quiere entender el panorama del país, ver
dónde está su Escuela y saber qué se puede hacer. También lo leerán
autoridades.

### Qué tiene que poder hacer ese lector

Las tres cosas, y en este orden de esfuerzo:

1. **Entender el panorama nacional** — patrones, no una lista de actividades.
2. **Ver qué construir el próximo año** — el complemento PUCV con sus brechas y
   prioridades desarrolladas.
3. **Usar el informe para pedir financiamiento** — la ausencia confirmada de
   evaluación de efecto es el hueco que nadie ocupa en Chile, y eso es
   exactamente lo que un fondo concursable premia.

### Dirección editorial

El informe debe ser **concreto e incómodo donde la evidencia lo permite**, y no
suavizar hallazgos por cortesía institucional. Las brechas se nombran, se
cuantifican y se traducen a lo que costaría cerrarlas. La oportunidad se hace
visible: hay capacidades que nadie en el país ha ocupado todavía.

**Y el límite que hace que eso funcione:** nada de lo anterior autoriza a
inclinar la evidencia. No subas una confianza declarada, no escondas una
contraevidencia, no conviertas una señal en un hecho, no elijas el marco que
más incomoda si otro se ajusta mejor al dato. El informe persuade porque es
verificable; en cuanto deja de serlo, deja de servir para pedir financiamiento
y para cualquier otra cosa.

En este caso no hay tensión entre las dos cosas, y conviene verlo antes de
escribir: **la lectura honesta ya es la lectura fuerte.** La PUCV tiene 18 de
30 y nueve de los doce puntos que le faltan no dependen de construir nada, sino
de publicar lo que ya decidió. Ninguna de las diez instituciones del comparador
ha medido efecto, y ninguna ha pedido financiamiento público para hacerlo en
cuarenta y cuatro años de registro ANID. Eso ya es incómodo y ya es una
oportunidad. No hace falta forzar nada.

**La declaración de intereses se mantiene intacta.** El autor trabaja en el
Programa DIAT de la Escuela de Derecho PUCV, la sección 8 lo declara y el
complemento lo repite en su primera página. Un informe que empuja a invertir en
un área y oculta que su autor trabaja en ella no es persuasivo: es refutable de
un golpe.

---

## 2 · Lo que el repositorio ya resolvió

**No lo reconstruyas.** Once versiones y seis decisiones registradas.

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

**Lee primero:** `CLAUDE.md`, `docs/DECISIONS.md` (D-037 a D-042),
`CHANGELOG.md`, `docs/informes/README.md` y `09-recalculo-comparador.md`.

---

## 3 · Las dos metodologías, y el espinazo que las concilia

Hay dos y ninguna sabe de la otra. Esto es lo que este encargo viene a arreglar.

- **`docs/informes/01-metodologia.md`** se presenta como «el método del
  proyecto» y es **el del Informe 02**: treinta instituciones, tipos de fuente
  A–F, niveles demostrativos D1–D5, escala de profundidad 0–5.
- **El Informe 01 usa otra**: `METODOLOGIA_IA_DERECHO_V2.1` + enmienda 2.2, en
  `content/reports/01_.../canonical/`. Diez capacidades, siete estados, trece
  rutas, rúbrica 0–3, índice de formalización como banda.

**No inventes una tercera.** Define el espinazo común de ocho capas y mapea las
dos dentro:

| Capa | Pregunta | Informe 01 | Informe 02 | ¿Existe? |
|---|---|---|---|---|
| 1 · Fuente | ¿De dónde viene? | `fuentes.csv`, 74 + 31 | Tipos A–F | ✅ |
| 2 · Evidencia | ¿Qué respalda exactamente? | `evidencias.csv` | Niveles D1–D5 | ✅ |
| 3 · Dato | ¿Cómo se estructura? | 10 capacidades × 7 estados | Escala 0–5 | ✅ |
| 4 · Hallazgo | ¿Qué demuestra el conjunto? | 8 hallazgos | Matriz maestra | ✅ |
| **5 · Interpretación** | **¿Qué significa?** | — | — | ❌ **falta** |
| **6 · Implicación** | **¿Por qué importa?** | enunciada, sin desarrollar | — | ❌ **falta** |
| **7 · Decisión** | **¿Qué acción sería razonable?** | sólo en el complemento | — | ❌ **falta** |
| 8 · Incertidumbre | ¿Qué no sabemos? | bandas, celdas sin concluir | estados epistemológicos | ✅ |

**Las capas 5, 6 y 7 son el encargo.** Nunca fundas dos capas de forma
implícita: un dato no es un hallazgo, un hallazgo no es una interpretación, una
interpretación no es una recomendación.

---

## 4 · Las seis reglas que no se tocan

Decididas, razonadas, varias con prueba automática. Romper una es un error.

1. **Una versión publicada no se sobrescribe** (CLAUDE.md §8). Cambiar el fondo
   exige versión nueva; reponer la forma se permite y se mide.
2. **La PUCV no entra al comparador** (D-037). Sigue en la cohorte, no en el
   orden. Su análisis va al complemento, que no puntúa ni compara.
3. **Matriz canónica `.v2`** (D-039). Cohorte once, comparador diez. Corpus,
   fuentes y rutas dicen *once*; capacidades, puntos y posiciones dicen *diez*.
4. **Una figura derivada de un dato no se dibuja aparte del dato** (D-039).
   Ninguna cifra literal dentro de un `<svg>`. **Se extiende a la web en la
   fase 4**: ningún componente React con datos a mano.
5. **El documento afirma; el sitio versiona** (D-041). El cuerpo no compara con
   versiones anteriores. Hay una prueba que falla si vuelve.
6. **Una cabecera no se parte** (D-042). Si no cabe, se acorta y se declara la
   abreviatura.

---

## 5 · Mecánica: cómo se toca este documento

**Aquí es donde más sesiones se estrellan.**

El Informe 01 desde la v2.0.0 **no nace en el repositorio**: llega como HTML
cerrado desde una cadena externa (D-038). No busques los `.json` que promete la
skill `informe-vivo` — no existen para este informe.

- **El original no se edita a mano.** Se deriva la versión nueva con un script
  de sustituciones contadas. Copia el patrón de
  `tools/informes/informe-01/v2.2.0/armonizar.mjs`: cada sustitución declara
  cuántas apariciones espera y el script no escribe nada si una sola no cuadra.
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

## 6 · El flujo · una sesión

Cinco fases. **Presupuesto orientativo entre paréntesis.** Si te pasas de una,
corta por la regla de suficiencia y documenta el resto como pendiente.

### FASE 0 · Orientar y medir la línea base · (10 %)

```bash
cd "C:\Users\Asus\Desktop\aldunate-juego-audaces\aldunate_experimento02"
git ls-remote origin main && git log --oneline -3
npm run verify
node tools/informes/lector/verificar-maqueta.mjs public/descargas/informe-01-v2.2.0/informe-01-v2.2.0.html
node tools/informes/informe-01/comparador/figuras.mjs
```

Lee lo del §2. Clasifica cada pieza: **A** funciona · **B** mejorar · **C**
documentado sin implementar · **D** falta · **E** no tocar.

→ *Sale:* la tabla de partida. Sin ella no podrás demostrar que mejoraste.

### FASE 1 · Auditoría sustantiva · (15 %)

Para cada sección del informe:

| Sección | Qué dice | Qué demuestran los datos | Interpretación válida | Interpretación débil | Qué sería especulativo |
|---|---|---|---|---|---|

→ *Sale:* `docs/informes/10-auditoria-sustantiva.md`. **Commitéalo antes de
seguir**: si la sesión se corta, esto sobrevive.

### FASE 2 · Evidencia · P0 · (20 %)

1. **Las 22 fuentes de la Ronda 2 no están contrastadas**, y sostienen los 26
   cierres de la matriz `.v2` que produce el orden publicado. Si una cae, el
   comparador se mueve. **Es la mayor amenaza abierta a lo que el informe
   afirma.** Contrástalas. Si no alcanza el presupuesto, publica el **análisis
   de sensibilidad** que diga qué posiciones dependen de ellas y márcalas como
   sensibles — es una salida honesta y cuesta horas en vez de días.
2. Cinco celdas sin concluir, en cuatro instituciones; sólo la Universidad de
   los Andes tiene más de una.
3. La referencia «Revista DIE» de la Universidad Central, no localizada.
4. Cualquier contradicción que la fase 1 haya sacado.

### FASE 3 · El salto interpretativo · capas 5, 6 y 7 · (30 %) · **el corazón**

Aplica a cada bloque sustantivo, con peso proporcional a su importancia:

```
¿QUÉ VEMOS? → ¿QUÉ SIGNIFICA? → ¿POR QUÉ IMPORTA?
            → ¿QUÉ DECISIONES SUGIERE? → ¿QUÉ NO SABEMOS?
```

**Qué añadir, en orden de valor para este destinatario:**

1. **Patrones transversales.** El material está: las tres formas de ausencia
   —unánime, bimodal, de umbral— ya están identificadas. Falta leer qué dicen
   juntas sobre el campo chileno.
2. **La oportunidad, cuantificada.** Evaluación de efecto: 0 de 30 puntos en las
   diez instituciones, cero proyectos ANID en 49.014 adjudicados desde 1982.
   Esa celda vacía es la que un fondo concursable premia, y hay que decir con
   qué se llenaría y qué costaría.
3. **Brechas**: `qué falta · evidencia · por qué importa · qué capacidad
   desbloquearía`.
4. **Tensiones**, más útiles que un orden. La Universidad Autónoma acredita 17
   puntos con 5 rutas recorridas; la Universidad de Chile, 12 con 12. Eso dice
   algo sobre qué mide el instrumento.
5. **Sección «De los datos a la decisión»**: diagnóstico · patrones · brechas ·
   riesgos · oportunidades · **3 a 5 prioridades**, no veinte.
6. **El complemento PUCV**, que es donde vive lo prescriptivo. Desarrolla las
   brechas y las prioridades: sus doce puntos que faltan ya están repartidos en
   tres clases —cinco por instrumento, cuatro por nivel, tres por capacidad
   inexistente—, y nueve de los doce no dependen de construir nada.

**Los límites que protegen el informe:**

- **Separa sistémicas de institucionales.** Recomendaciones al campo, al
  regulador o a la política pública: territorio legítimo. Recomendaciones
  dirigidas a una universidad nombrada del comparador: **no**. El autor tiene
  conflicto declarado con una de ellas, y prescribir a las otras nueve desde ahí
  es lo que la sección 8 existe para evitar. Lo prescriptivo sobre la PUCV vive
  en el complemento; que siga ahí.
- Ninguna recomendación como consecuencia automática de un dato: declara
  evidencia, problema y qué información falta.
- **Si la evidencia sólo permite describir, dilo.** «Permite describir X, pero no
  establecer Y» es una conclusión útil.
- Verbos calibrados: *sugiere, indica, es consistente con*. «Queda demostrado»
  sólo con evidencia excepcional.
- **Sensibilidad:** si una conclusión cambia al reclasificar una fuente o una
  celda, márcala.

→ *Publica:* `npm run informe:publicar` y verifica. **Esto ya es una versión
nueva** (cambia el fondo): v3.0.0, entrada en `src/data/reports.ts`, y la
v2.2.0 se queda donde está.

### FASE 4 · UX/UI · lo que se ve en Vercel · (20 %)

Todo lo de aquí es alcanzable hoy: `matriz-v2.json` es legible por máquina y ya
alimenta ocho figuras. **Haz 4.1 y 4.2 antes que nada; 4.3 y 4.4 si queda
presupuesto.**

**4.1 · Escalera de lectura en la ficha.** Hoy la página incrusta el documento
en un iframe de ~100.000 px antes de la ficha, y el navegador tarda en pintarlo.
Reorganízala en tres profundidades declaradas:

```
3 min   →  pregunta · respuesta · 5-7 hallazgos · prioridades · límites
15 min  →  comparador y matriz nativos, explorables
1 h     →  el documento completo, cargado en diferido
```

Respeta *el informe se abre leído* (CLAUDE.md §8): el documento puede cargarse
en diferido sin romper esa regla.

**4.2 · Comparador y matriz nativos.** Componentes React que leen
`matriz-v2.json`, no valores a mano — es la regla 4 del §4 extendida a la web.
Permiten ordenar, filtrar por capacidad y ver la banda de incertidumbre. Sin
esto la web sólo sirve un PDF dentro de un marco.

**4.3 · Inspector de evidencia.** Al pulsar una celda: institución, capacidad,
estado, puntos, y **la nota y el `source_id` del cierre de la Ronda 2** — todo
está en `matriz-v2.json` bajo `aplicados`. Es la cadena hallazgo → dato →
evidencia → fuente con lo que existe hoy.

**4.4 · Contexto en versiones históricas.** Cada una dice por qué fue sustituida
y enlaza la vigente, sin alterar sus conclusiones originales.

**Siempre:** WCAG 2.2 AA donde sea razonable; toda figura con título,
explicación y alternativa textual; revisa 1440 · 1280 · 1024 · 768 · 430 · 390
sin scroll horizontal global. Conserva la identidad —*archivo académico del
futuro + publicación editorial + datos vivos*—: nada de cyberpunk, neón, cripto
ni SaaS genérico. El movimiento explica transiciones; no decora.

**Lo que NO cabe en esta sesión.** Fichas institucionales navegables, registro de
fuentes explorable y evidencia por iniciativa exigen **recompilar el dataset
canónico a datos tipados**, que sólo existe para la v0.8.0
(`src/data/informe01*.ts`). Es un proyecto propio. Déjalo como pendiente con su
coste estimado.

### FASE 5 · Cerrar · (5 %)

```bash
npm run verify
git ls-remote origin main
```

> **🚦 ÚNICA PUERTA DE APROBACIÓN.** Si algo cambia una cifra publicada sobre una
> institución con nombre, **para y pregunta antes de empujar**. Todo lo demás
> —maqueta, UX, prosa que no altera cifras— se publica sin preguntar.

Después: empuja, espera los ~45 s del despliegue y **verifica contra la URL de
producción**, no contra el local.

---

## 7 · El ciclo de cuellos de botella

Es lo que hace que la metodología mejore sola en vez de envejecer. Crea o amplía
**`docs/informes/CUELLOS-DE-BOTELLA.md`**:

```
MEDIR  →  NOMBRAR  →  CORREGIR UNO  →  ESCRIBIR LA REGLA  →  AUTOMATIZAR LA PRUEBA
```

Los tres que ya se cerraron, como modelo del formato:

| Cuello | Cómo se midió | Coste | Regla | Prueba |
|---|---|---|---|---|
| Figura y tabla de sitios distintos | Tres tablas `.v2`, cuatro figuras `.v1` | Dos días publicado con la PUCV encabezando un orden del que estaba excluida | D-039 | `figuras.mjs` única fuente |
| El documento se narraba a sí mismo | 69 pasajes comparando con versiones que el lector no tiene | Se leía como changelog | D-041 | `informes.test.ts` |
| `overflow-wrap:anywhere` en `td, th` | 33 celdas partidas | «PRESEN / CIA», «PISO» en vertical | D-042 | `verificar-maqueta.mjs` |

**Reglas:** un cuello sin cifra es una impresión, no un cuello. Corrige **uno**
por sesión. Una regla sin prueba dura una entrega. La carga metodológica va con
el impacto de la afirmación. **Y al terminar, propón el siguiente con su cifra
medida**, para que la sesión que venga empiece con trabajo y no con arqueología.

---

## 8 · Criterios de aceptación

Si no puedes medirlo, no lo declares hecho.

| # | Criterio | Cómo se comprueba |
|---|---|---|
| 1 | Ninguna afirmación nueva sin evidencia en el corpus | Cita `source_id` o el anexo que la sostiene |
| 2 | Cero recomendaciones a una universidad nombrada del comparador | Búsqueda por nombre en las secciones prescriptivas |
| 3 | 3 a 5 prioridades, con evidencia, actor y qué falta saber | Recuento |
| 4 | Cero menciones a versiones anteriores en el cuerpo | `npm run test` |
| 5 | Cero palabras partidas · cero desbordes · cero rótulos sobre barra | `verificar-maqueta.mjs` |
| 6 | Toda figura y todo componente salen de un dataset | Ninguna cifra literal en `<svg>` ni en React |
| 7 | Web y PDF dicen la misma cifra | Salen del mismo HTML |
| 8 | `npm run verify` en verde | typecheck + lint + test + build |
| 9 | Versiones anteriores servidas, enlazadas y contextualizadas | Prueba de botones + revisión |
| 10 | Cada conclusión reforzada declara confianza y contraevidencia | Revisión sobre la lista |
| 11 | Sin scroll horizontal en los seis anchos | Revisión en el navegador |
| 12 | La declaración de intereses sigue íntegra | Sección 8 + primera página del complemento |
| 13 | El registro de cuellos de botella tiene una fila nueva | `CUELLOS-DE-BOTELLA.md` |

---

## 9 · Informe final de trabajo

```
LÍNEA BASE     las cifras de la fase 0
AUDITORÍA      qué encontraste, con cifras
CONTENIDO      qué mejoró en análisis e interpretación
DECISIONES     qué implicaciones se incorporaron, y cuáles se descartaron
               por falta de evidencia
WEB            qué cambió, con capturas antes y después de producción
PDF            qué cambió, medido
METODOLOGÍA    el espinazo conciliado y las reglas nuevas
CUELLOS        el que cerraste, y el siguiente con su cifra
VERSIONADO     cómo se preservó el linaje
QA             las trece casillas del §8
PENDIENTES     con sus cifras ya calculadas, listos para la sesión siguiente
```

---

## 10 · El criterio final

El informe debe pasar de

> «estas universidades hicieron estas cosas»

a

> «estos patrones emergen, estas capacidades se consolidan, estas brechas siguen
> abiertas, y éstas son las decisiones que razonablemente deberían considerarse»

sin sacrificar evidencia, trazabilidad, incertidumbre ni versionado. Un docente
debe poder leerlo y entender dónde está el país y dónde su Escuela. Un
investigador debe poder preguntar «¿de dónde salió esto?» y llegar a la fuente.

**Un informe más contundente que afirme una sola cosa que la evidencia no
sostiene es un peor informe, y además es refutable de un golpe.**
