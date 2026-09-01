# Auditoría de cierre · v0.3.0

**Fecha:** 31-08-2026 · **Rama:** `auditoria/v0.3.0` · **Base:** el rediseño UX/UI (PR #10)
**Encargo:** `MASTER PROMPT — CORRECCIÓN, AUDITORÍA Y EVOLUCIÓN A v0.3.0`
**Fecha de corte de evidencia:** 31-08-2026

Estado de los 34 hallazgos, con archivo y prueba. Ningún hallazgo se marca
resuelto porque «parezca arreglado»: cada `fixed` tiene una verificación
reproducible al lado.

---

## 1. Estado general

| | |
|---|---|
| Build | `npm run verify` verde: 0 errores, 8 avisos conocidos (D-022), 64 tests, 17 rutas |
| PDF | Regenerado. 77 páginas, 12 figuras, 24 tablas, índice actualizado, sin residuos de Word |
| Resumen ejecutivo | Regenerado. 5 páginas |
| Plataforma | Título, estado, autoría y conteos sincronizados con el documento |
| Descargas | v0.3.0 publicada junto a v0.2.0, que no se sobrescribió |

**Extensión.** 77 páginas frente a 76. El encargo prefería que no creciera. El
aumento procede íntegramente de acotaciones de alcance —lo que §3.2 autoriza
expresamente— y no de material nuevo.

---

## 2. Los 34 hallazgos

Leyenda: `fixed` · `partially_fixed` · `requires_decision` · `not_applicable` · `open`

| ID | Estado | Archivos | Verificación |
|---|---|---|---|
| A-01 | fixed | `contenido-01.json`, `contenido-02.json`, `research.ts`, `resumen-01.json` | «perdió su validez» → «no puede presumirse, por sí sola, evidencia suficiente». 0 coincidencias del original en el documento final |
| A-02 | fixed | `contenido-07.json` | «enteramente atribuible» → convergencia sin aislamiento causal. 0 coincidencias del original |
| A-03 | fixed | `contenido-01.json`, `contenido-07.json`, `types/index.ts`, `reports.ts` | «causalidad establecida» → «identificación causal en contexto experimental». 0 coincidencias en el documento; en la web sólo sobrevive tachada, dentro del changelog |
| A-04 | fixed | `types/index.ts`, `research.ts`, `EvidenceMatrix.tsx` | `documentaryStatus`, `robustness`, `demonstrativeLevel` y `generalizationScope` como dimensiones independientes, con definición publicada |
| A-05 | **requires_decision** | — | El protocolo de búsqueda depende de cómo se buscó realmente. Ver §4 |
| A-06 | fixed | `contenido-04b.json` | «treinta instituciones y seis modelos regionales» → «seis patrones regionales observados en treinta instituciones» |
| A-07 | fixed | `contenido-04b.json` | «la explicación no puede ser el dinero. Es de gobernanza» → hipótesis compatible, con la limitación de muestra declarada |
| A-08 | fixed | `contenido-05.json` | Se elimina «es la formación jurídica» y se nombra lo que la frase borraba: entrevista, negociación, litigación oral, ética, decisión bajo incertidumbre |
| A-09 | fixed | `Build-Informe.ps1`, `resumen-01.json` | Las cuatro cifras de portada con universo, país, muestra y fuente. Verificado en el texto del documento generado |
| A-10 | not_applicable | — | La afirmación «no deja rastro» no existe en el texto. 0 coincidencias |
| A-11 | fixed | `contenido-07.json`, `contenido-01.json` | «Dejar de invertir en detección algorítmica» → no usarla como estrategia central de imputación, admitiendo usos diagnósticos validados localmente |
| A-12 | **partially_fixed** | `contenido-07.json` | La recomendación sobre detectores ya declara su componente prudencial. Las ocho recomendaciones no están clasificadas todavía en A/B/C/D. Ver §4 |
| A-13 | fixed | `site.ts`, `reports.ts`, `Build-Informe.ps1` | Autoría con nombre, credencial y rol, en PDF y web desde una única fuente |
| A-14 | fixed | `Build-Informe.ps1` | «INFORME EXPERTO» → «INVESTIGACIÓN APLICADA» en portada. 0 coincidencias del original |
| A-15 | fixed | `Build-Informe.ps1`, `DocxBuilder.ps1` | Estaba en dos sitios: un párrafo visible y el texto de respaldo del campo TOC. 0 coincidencias de «clic derecho» y «Actualizar campos» en el documento final |
| A-16 | **open** | — | La numeración 31–38 de las recomendaciones no se ha revisado en el render final. Ver §5 |
| A-17 | **open** | — | Paginación final y última página no revisadas página a página. Ver §5 |
| A-18 | **open** | — | Densidad de tablas no revisada en el PDF regenerado |
| A-19 | partially_fixed | `research.ts` | Version of record priorizada y estados declarados en las seis fuentes críticas; las 18 restantes conservan su registro anterior |
| A-20 | fixed | `types/index.ts`, `reports.ts`, `[slug]/page.tsx`, `sitio.test.ts` | Cadena publicada: 24 fuentes → 38 hallazgos → 18 afirmaciones → 8 recomendaciones. Tres pruebas comprueban la coherencia |
| A-21 | fixed | `investigacion/page.tsx` | Corregido en el rediseño: el aviso «registros vacíos» convivía con 24 fuentes impresas en la misma página |
| A-22 | fixed | `reports.ts`, `[slug]/page.tsx` | El aviso de versión se deriva de `reportStatusNotice`, fuente única. Estaba escrito a mano y se pintaba igual en los dos informes |
| A-23 | fixed | `reports.ts` | Título canónico único: «La universidad ante la automatización del trabajo cognitivo». El slug no cambia, para no romper enlaces |
| A-24 | partially_fixed | `research.ts`, `lib/utils.ts` | Precisión declarada y tres fechas verificadas contra la publicación original. Magesh queda en precisión de mes: ver §3 |
| A-25 | fixed | `reports.ts`, `site.ts` | Mismo modelo de autoría en PDF y web |
| A-26 | fixed | `CLAUDE.md`, `DECISIONS.md` D-033, todo `src/app` | Escudo retirado de las cinco pantallas y del retrato de EVA que lo llevaba incrustado. 0 coincidencias en todas las rutas |
| A-27 | fixed | `investigacion/page.tsx`, `[slug]/page.tsx` | EVA fuera de metodología y fichas de evidencia |
| A-28 | fixed | `page.tsx` | «Cuatro entradas» pintaba cinco tarjetas |
| A-29 | partially_fixed | `research.ts`, `reports.ts` | `src/data/` es la fuente para toda la web. El PDF sigue generándose desde `contenido-*.json`, fuera del repositorio: son dos fuentes, no una. Ver §4 |
| A-30 | fixed | `types/index.ts`, `reports.ts`, `[slug]/page.tsx` | Changelog a nivel de afirmación: ocho cambios con anterior, actual y motivo |
| A-31 | fixed | `EvidenceMatrix.tsx`, `investigacion/page.tsx` | Cada afirmación y cada fuente tienen ancla estable: `/investigacion#clm-…` y `#src-…`, enlazadas entre sí |
| A-32 | **open** | — | Exportación CSV/JSON de la matriz no implementada |
| A-33 | partially_fixed | `UX-UI-CHANGELOG.md` | Responsive, contraste, objetivo táctil y teclado medidos en el rediseño. Lighthouse y axe no ejecutados: ver §5 |
| A-34 | fixed | `app/correcciones/page.tsx`, `site.ts` | Política pública en `/correcciones`: cómo se reporta, qué distingue menor de sustantiva, cuándo cambia la versión, y qué pasa con fuentes retractadas. Enlazada desde el footer |

**Recuento:** 23 `fixed` · 5 `partially_fixed` · 4 `open` · 1 `requires_decision` · 1 `not_applicable`.

---

## 3. Verificación de fuentes críticas

Contrastadas contra la publicación original, no contra el texto del informe.

```yaml
- source_id: src-hepi-2026
  verified_against: primary_source
  verified_at: 2026-08-31
  resultado: confirmado
  campos: [publication_date, sample, scope]
  detalle: >
    12-03-2026. n = 1.054 estudiantes de grado a tiempo completo del Reino
    Unido. Confirmados el 94 % de uso en trabajos evaluados y el 12 % de
    inserción directa. La fecha pasa de precisión de año a día.

- source_id: src-bastani-2025
  verified_against: primary_source
  verified_at: 2026-08-31
  resultado: confirmado, con hallazgo nuevo
  campos: [publication_date, sample, design, scope, correction]
  detalle: >
    Publicado en línea el 25-06-2025 (número del 01-07-2025). n ≈ 1.000
    estudiantes de secundaria en ~50 aulas de 9.º a 11.º grado, en Turquía.
    HALLAZGO NO PREVISTO EN EL ENCARGO: PNAS publicó una corrección el
    20-08-2025 (122(34):e2518204122) que el informe no mencionaba. El aviso no
    detalla qué se corrigió. Queda registrada y visible en la ficha.

- source_id: src-magesh-2025
  verified_against: secondary_index
  verified_at: 2026-08-31
  resultado: parcial
  campos: [publication_date, volume, pages]
  detalle: >
    Version of record en Journal of Empirical Legal Studies 22:216–242 (2025).
    El encargo afirmaba 23-04-2025. Wiley devuelve 403 a la consulta
    automatizada y el día no pudo contrastarse contra la página del editor. Se
    registra 2025-04 con precisión de mes. Estampar el día por confianza en el
    encargo sería exactamente la clase de precisión inventada que la regla 3.3
    prohíbe.
```

Scarfe (26-06-2024) y Kestin (03-06-2025) conservan las fechas que ya tenían;
se les añadió la clasificación en las cuatro dimensiones. UNESCO conserva su
precisión de mes.

---

## 4. Decisiones que requieren intervención humana

### REQUIERE DECISIÓN · A-05 · Protocolo de búsqueda

**Qué falta.** El anexo debe declarar bases consultadas, familias de términos,
idiomas, criterios de inclusión y exclusión, tratamiento de duplicados y de
preprints, y si hubo o no un segundo revisor.

**Por qué no puedo resolverlo.** Nada de eso está en el repositorio ni se puede
inferir del corpus. Escribir un protocolo verosímil a partir de las 24 fuentes
resultantes sería reconstruir hacia atrás un método que quizá no se siguió, y
publicarlo como reproducible. Es el fallo que el propio informe denuncia.

**Opciones.** (a) Reconstruirlo contigo en una sesión corta —qué buscaste,
dónde y con qué criterio— y publicarlo como declaración honesta. (b) Publicar
un anexo mínimo que declare período, corte y limitaciones, y anote como
pendiente lo demás. (c) No publicar anexo y declarar la ausencia.

**Impacto.** Sin protocolo, el informe no puede llamarse revisión estructurada
de evidencia. La denominación correcta mientras tanto es **análisis experto de
evidencia**, y conviene no usar «revisión sistemática» en ningún sitio.

### REQUIERE DECISIÓN · A-12 · Clasificación de las ocho recomendaciones

Cada una debe quedar como A (respaldada por evidencia), B (compatible),
C (decisión normativa razonable) o D (hipótesis por evaluar). La clasificación
es un juicio sobre tu propio trabajo y varias son claramente C —decisiones de
diseño curricular respaldadas por problemas empíricos, no deducidas de un RCT—.
Puedo proponer una clasificación razonada para que la revises.

### REQUIERE DECISIÓN · A-19 · Las 18 fuentes restantes

Seis están verificadas contra su publicación original. Las otras 18 conservan el
registro anterior sin `lastVerified` ni clasificación en las cuatro dimensiones.
Verificarlas una a una es trabajo de sesión, no de minutos. Mientras tanto la
ficha no muestra clasificación para ellas, que es lo correcto: la ausencia del
bloque dice que nadie las ha evaluado todavía.

### REQUIERE DECISIÓN · A-29 · Dos fuentes de verdad, no una

La web lee de `src/data/`. El PDF se genera desde `contenido-*.json`, que vive
en `Desktop/ALDUNEITOR/INFORME IA UNIVERSIDAD/_fuentes/`, **fuera del
repositorio**. Hoy coinciden porque se corrigieron los dos a mano en la misma
sesión; nada garantiza que sigan coincidiendo.

Tres caminos: (a) traer los JSON al repositorio y generar la web desde ellos;
(b) generar los JSON desde `src/data/` en el build del documento; (c) dejarlo
como está y aceptar la sincronización manual, documentada. La opción (a) es la
más simple y la que menos código nuevo pide.

---

## 5. Pendientes técnicos, no de decisión

- **A-16, A-17, A-18.** Numeración de recomendaciones, paginación final y
  densidad de tablas requieren revisar el PDF regenerado página a página. No se
  hizo: este equipo no tiene renderizador de PDF a imagen, así que la
  comprobación fue textual —índice actualizado, sin residuos de Word, 77
  páginas— y no visual. **No doy por buena la maquetación que no he visto.**
- **A-32.** Exportación CSV/JSON de la matriz.
- **A-33.** Lighthouse y axe no ejecutados. Lo que sí se midió, en el navegador
  y sobre el DOM: overflow en las 16 rutas a 375 y 320 px, contraste calculado
  sobre el píxel real en ambos temas, objetivo táctil y orden de encabezados.


---

## 6. Riesgos residuales

1. **El PDF y la web pueden divergir otra vez** mientras A-29 siga abierto. Es
   el riesgo más probable de todos: basta con corregir un lado y olvidar el otro.
2. **La maquetación del PDF no se ha visto.** Los cambios de portada alteran el
   alto de la tabla de cifras y podrían empujar contenido. Conviene abrir el
   documento y mirar la portada y las páginas finales antes de distribuirlo.
3. **18 fuentes sin clasificar** en la taxonomía nueva. La ficha lo declara, pero
   un lector rápido puede leer la ausencia como «no aplica» en vez de «no
   evaluado».
4. **La corrección de PNAS no dice qué corrigió.** Se registra la existencia del
   aviso, que es lo verificable. Si la corrección afectara a los resultados, la
   afirmación que se apoya en Bastani tendría que revisarse.
5. **El informe 01 sigue vacío de registro.** Nada de esta auditoría lo cambia.
