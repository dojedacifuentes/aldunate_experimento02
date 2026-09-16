# Ediciones para el Consejo de Profesores

Cadena completa para producir los informes en el formato tradicional que el Consejo de Profesores de la Escuela de Derecho aprobó en 2025. Todo lo necesario para retomar el trabajo está aquí; no hace falta ningún archivo del escritorio.

El traspaso con el contexto de las decisiones está en [`docs/HANDOFF-CONSEJO-PROFESORES.md`](../../../docs/HANDOFF-CONSEJO-PROFESORES.md). Este archivo explica cómo operar la cadena.

---

## Son dos informes distintos

Este directorio produce **dos documentos con objetos diferentes**. Conviene fijarlo antes de tocar nada, porque el nombre corto de cada uno no lo dice.

### Informe 01 · Uso de inteligencia artificial en las Escuelas de Derecho

Qué capacidades han construido **once facultades de Derecho chilenas**: unidades, normas propias, presencia en pregrado, formación continua, investigación, transferencia y uso interno. Es un mapeo institucional nacional, con un capítulo de contraste internacional.

- Escala de cinco dimensiones sobre quince puntos, heredada del informe que el Consejo aprobó en 2025.
- Informe experto de base: v3.2.0, corte del 6 de septiembre de 2026.
- En el sitio: `/informes/ia-escuelas-derecho-chile`
- Borradores en `_build/redaccion/informe-01/`

### Informe 02 · La universidad ante la automatización del trabajo cognitivo

**Cómo cambia la enseñanza universitaria** ante la inteligencia artificial generativa: metodologías, evaluación, competencias, currículo, rol docente, gobernanza y equidad. Su alcance es universitario, no solo jurídico, y el Derecho es uno de sus capítulos, tratado como caso crítico.

- Escala de seis niveles de profundidad de la transformación, de 0 a 5.
- Informe experto de base: v0.3.0, agosto de 2026, setenta y siete páginas.
- En el sitio: `/informes/transformacion-ensenanza-derecho`
- Borradores en `_build/redaccion/informe-02/` (versión temática) y `_build/redaccion/informe-02b/` (edición de decisiones, vigente)

### Una confusión que conviene evitar

La versión para el Consejo del Informe 02 se tituló **«Inteligencia artificial generativa y enseñanza del Derecho»**, lo que estrechó su objeto y la acerca en apariencia al Informe 01. No son lo mismo: el primero mide qué tienen las facultades chilenas, el segundo examina cómo cambia la enseñanza en cualquier universidad. La reestructuración pendiente debe recuperar el alcance universitario del informe experto de base.

---

## Qué hay aquí

```
consejo-profesores/
  PROMPT-PARA-GEMINI-O-CHATGPT.md    encargo de investigación autocontenido
  PROMPT-INVESTIGACION-PROFUNDA.md   encargo para un agente con contexto del proyecto
  _build/
    redaccion/
      informe-01/        Escuelas de Derecho chilenas · terminado
      informe-02/        Transformación de la enseñanza · versión temática, terminada
      informe-02b/       Transformación de la enseñanza · edición de decisiones, terminada
      metodologia-informe-02b.md  unidad de análisis, escala y regla de evidencia
      plan-informe-02b.md   qué se entregó y qué queda pendiente
    puntaje/             matriz, escalas y scripts de cálculo
    hechos/              hallazgos de cada ronda de búsqueda, con sus fuentes
    insumos/             corpus de origen: informes expertos, CSV y capítulos
    estilo/              guía de estilo y reglas de redacción
    figuras/             PNG, SVG y medidas de cada gráfico
    salida/              los cuatro documentos compilados
    *.mjs                la cadena de construcción
    word-a-pdf.ps1       conversión a PDF por Word
```

---

## Requisitos

- **Node** con las dependencias de `_build/package.json`: `docx`, `pdfjs-dist` y `playwright-core`.
- **Microsoft Word** instalado, para la conversión a PDF por COM.
- **Microsoft Edge** en su ruta habitual, que `graficos.mjs` usa para rasterizar los SVG. Si está en otra ruta, hay que ajustar `executablePath` en `renderizar()`.

```bash
cd tools/informes/consejo-profesores/_build
npm install
```

---

## Cómo se reconstruye un informe

El orden importa, porque cada paso consume la salida del anterior.

```bash
# 1. Recalcular la escala de cinco dimensiones desde la matriz de capacidades
node puntaje/escala-2025.mjs

# 2. Regenerar los gráficos
node figuras-escala-2025.mjs      # los nueve de la escala
node figuras-por-institucion.mjs  # el perfil de cada ficha
node figuras-informe-01.mjs       # los del índice y el anexo
node figuras-internacional.mjs    # el del capítulo internacional

# 3. Regenerar las tablas que se derivan del dato
node regenerar-anexo-b.mjs
node regenerar-sensibilidad.mjs

# 4. Controles antes de compilar
node auditar-cifras.mjs
node revisar-residuos.mjs redaccion/informe-01 figuras/informe-01 --doc a
node medir-estilo.mjs redaccion/informe-01/03-fichas-a.md

# 5. Compilar
node construir-docx.mjs redaccion/informe-01/config.json
```

Y el PDF, desde PowerShell:

```powershell
.\word-a-pdf.ps1 -Docx salida\Informe-01-IA-escuelas-de-Derecho-Consejo.docx -Pdf salida\Informe-01-IA-escuelas-de-Derecho-Consejo.pdf
```

---

## Qué debe dar cada control

| Control | Resultado esperado |
|---|---|
| `auditar-cifras.mjs` | 73 comprobaciones correctas, sin problemas |
| `revisar-residuos.mjs` | Sin hallazgos, salvo «ecosistema» dentro del título de una fuente citada |
| `medir-estilo.mjs` | «Sin alertas» en cada archivo del cuerpo |
| `construir-docx.mjs` | `"avisos": []` |

Si `auditar-cifras.mjs` encuentra problemas, es porque el texto de las fichas dejó de coincidir con el cálculo. Nunca se corrige editando el script: se corrige el texto, o se revisa si el cambio de la matriz era correcto.

---

## Cómo se cambia un estado de la matriz

No se edita `puntaje/resultados.json` a mano. El procedimiento deja rastro auditable:

1. Se registra el hallazgo en `hechos/ronda-N-*.json`, con la fuente, lo que acredita y su límite.
2. Se escribe un script `puntaje/aplicar-ronda-N.mjs` que lee ese archivo, comprueba que el estado de partida sea el declarado y aplica el cambio conservando `estado_anterior` y `puntos_anterior`.
3. Se recalculan escala, gráficos y tablas con la secuencia de arriba.
4. Se actualiza el texto de la ficha y se corre el auditor.

Las rondas 3 y 4 están hechas y sirven de plantilla. La 3 incorporó hallazgos de búsqueda web; la 4 aplicó la revisión interna de la Dirección sobre la propia PUCV.

---

## Formato del borrador

Cada capítulo es un `.md` en `redaccion/informe-0X/`. El constructor solo admite estas marcas:

```
# I. Título del capítulo     Título 1, abre página y entra al índice
## 1. Subtítulo               Título 2, entra al índice
### 1.1. Apartado             Título 3, no entra al índice

::grafico id="g01-total" titulo="..." fuente="..."
::tabla id="t01" titulo="..." fuente="..." anchos="20,60,20"
{{grafico:g01-total}}         se reemplaza por el número del gráfico
[^clave]                      nota al pie, definida al final del archivo
```

La numeración de capítulos y apartados la escribe el redactor dentro del título. El constructor numera los gráficos, las tablas y las notas en orden de aparición.

---

## Lo próximo

El Informe 02, el de transformación de la enseñanza, está **terminado en su edición de decisiones**, en `_build/redaccion/informe-02b/`.

No adoptó la forma de fichas institucionales. El 16 de septiembre de 2026 el usuario descartó esa vía, porque un catálogo de universidades extranjeras es el mismo compilado que el profesor rechazó, ordenado de otra manera. El documento es un insumo para comprender y decidir: su unidad de análisis es la función pedagógica y su redistribución, y cada capítulo identifica qué se automatizó, qué quedó sin responsable y qué decisión deja planteada, con la instancia competente y un indicador de seguimiento.

La metodología está en [`_build/redaccion/metodologia-informe-02b.md`](_build/redaccion/metodologia-informe-02b.md) y manda sobre el plan. Lo entregado y lo pendiente están en [`_build/redaccion/plan-informe-02b.md`](_build/redaccion/plan-informe-02b.md).

La matriz ya está construida en [`_build/puntaje/niveles-instituciones.json`](_build/puntaje/niveles-instituciones.json): nueve instituciones, siete dimensiones —metodologías, competencias, evaluación, currículo, rol docente, gobernanza y equidad— y una escala de cero a cinco. Falta trasladar a ese archivo el mapa de las treinta instituciones del capítulo 11.

El encargo completo para retomar está en [`PROMPT-PROXIMA-SESION.md`](PROMPT-PROXIMA-SESION.md).
