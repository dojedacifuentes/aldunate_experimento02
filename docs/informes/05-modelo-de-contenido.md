# 05 · Modelo de contenido

El informe vive en diez archivos JSON. Ni el Word ni el HTML son fuente: ambos son salidas.

---

## La regla

**Editar el JSON. Nunca el `.docx`, nunca el `.html`.**

Es lo que impide que las tres versiones diverjan. Un documento de 28.700 palabras reescrito muchas veces, mantenido a mano en tres formatos, diverge en la segunda sesión de trabajo.

---

## Orden de los archivos

Los constructores leen `contenido-*.json` **ordenados alfabéticamente** y los concatenan. De ahí una propiedad práctica: para insertar un capítulo entre dos existentes basta un sufijo de letra.

```
contenido-01.json   Nota preliminar y resumen ejecutivo
contenido-02.json   Capítulos 2 y 3
contenido-03.json   Capítulos 4 a 7
contenido-04.json   Capítulos 8 a 10
contenido-04b.json  Capítulo 11   ← insertado después
contenido-04c.json  Capítulo 12   ← insertado después
contenido-05.json   Capítulos 13 y 14
contenido-06.json   Capítulos 15 a 21
contenido-06b.json  Capítulo 22   ← insertado después
contenido-07.json   Capítulos 23, 24 y los tres anexos
```

`contenido-04.json` < `contenido-04b.json` < `contenido-05.json`, porque el punto (46) precede a la letra `b` (98) en la tabla ASCII.

El resumen ejecutivo usa el mismo esquema en `resumen-*.json`.

---

## Tipos de bloque

Cada archivo es un array de objetos con un campo `t` que declara el tipo.

### Estructura

```json
{ "t":"h1", "n":"Capítulo 11", "x":"Mapa internacional" }
{ "t":"h1", "n":"Nota preliminar", "x":"Cómo leer este informe", "nobreak":true }
{ "t":"h2", "x":"11.1 Cómo se construyó el mapa" }
{ "t":"h3", "x":"Subapartado" }
```

`n` es el antetítulo del capítulo; `x`, el título. `nobreak` evita el salto de página, y solo se usa en el primer bloque del documento.

### Texto

```json
{ "t":"lead", "x":"Párrafo de entrada, cuerpo mayor." }
{ "t":"p", "x":"Párrafo normal con **negrita**, *cursiva* y `código`." }
{ "t":"quote", "x":"Cita destacada.", "a":"Atribución" }
```

### Listas

```json
{ "t":"bullets", "items":["Primero.", "Segundo."] }
{ "t":"numbers", "items":["Primero.", "Segundo."] }
```

### Destacados

```json
{ "t":"callout", "h":"Título del destacado", "c":"brick",
  "x":"Cuerpo del destacado." }
```

`c` acepta `navy` (síntesis, valor por defecto), `teal` (matiz constructivo), `ochre` (advertencia de lectura), `brick` (contraevidencia o riesgo) y `sage` (evidencia sólida).

### Figuras

```json
{ "t":"fig", "id":"g01-uso-delegacion",
  "cap":"Lo que muestra la figura y qué conviene advertir al leerla." }
```

`id` corresponde al nombre del PNG sin extensión. **No escribas el número** en `cap`: se antepone en la compilación.

### Tablas

```json
{ "t":"table",
  "cap":"Pie con la fuente y la advertencia.",
  "head":["Institución","País","Nivel","Qué está verificado"],
  "w":[2500,1100,620,4900],
  "align":["left","left","center","left"],
  "rows":[
    ["**University of Hong Kong**","Hong Kong","4","Dos cursos obligatorios…"]
  ]
}
```

- `w` son anchos en **twips**, y su suma debe ser **9.120**. Es la única restricción numérica del modelo y conviene respetarla: por encima, la tabla desborda la caja de A4.
- `align` acepta `left` y `center`.
- Un valor en versales del vocabulario epistémico —`ALTA`, `VERIFICADO`, `NO DEMOSTRADO`…— se convierte automáticamente en etiqueta con color semántico.
- Un valor que empieza por `[[RRGGBB]]` pinta la celda de ese color.

### Auxiliares

```json
{ "t":"rule" }
{ "t":"pagebreak" }
```

---

## Marcado ligero

Dentro de cualquier campo de texto, incluidas las celdas de tabla:

| Escribe | Obtienes |
|---|---|
| `**texto**` | negrita |
| `*texto*` | cursiva |
| `` `texto` `` | monoespaciada en color primario |

Se interpreta igual en Word y en HTML. Para comillas se usan las angulares españolas «…», que ambos formatos representan sin escapes.

---

## Numeración automática

Figuras y tablas se numeran **por orden de aparición**, en ambos constructores. Ni el JSON ni el PNG contienen el número.

Consecuencia práctica: reordenar capítulos o insertar una figura en medio no rompe nada. Lo que sí exige revisión manual son las **referencias en prosa** del tipo «como muestra la figura 10» o «el capítulo 13», porque el sistema no las conoce.

### Renumerar capítulos

Los números de capítulo sí son texto, en el campo `n` y en los subtítulos `11.1`, `11.2`. Al insertar un capítulo hay que renumerar con reemplazos **en orden descendente**, para que no se pisen:

```powershell
$pares = @(@(22,24),@(21,23),@(20,21),@(19,20),@(18,19),@(17,18),@(16,17))
foreach ($p in $pares) {
  $x = $x.Replace('"n":"Capítulo ' + $p[0] + '"', '"n":"ZC ' + $p[1] + '"')
  $x = $x.Replace('"h2","x":"' + $p[0] + '.', '"h2","x":"ZH' + $p[1] + '.')
}
$x = $x.Replace('"n":"ZC ', '"n":"Capítulo ').Replace('"h2","x":"ZH', '"h2","x":"')
```

El marcador temporal `ZC` evita que un capítulo ya renumerado vuelva a serlo en la misma pasada.

Después conviene localizar y revisar las referencias cruzadas:

```powershell
[regex]::Matches($texto, 'capítulo \d+') | ForEach-Object { $_.Value } | Sort-Object -Unique
```

---

## Validar antes de compilar

Un JSON mal formado detiene la compilación con un mensaje poco útil. Merece la pena comprobarlo primero:

```powershell
Get-ChildItem contenido-*.json | ForEach-Object {
  try   { $n = (Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json).Count
          "OK  $($_.Name)  ($n bloques)" }
  catch { "ERROR  $($_.Name): $($_.Exception.Message)" }
}
```

Dos errores frecuentes: una fila de tabla con más o menos celdas que la cabecera, y comillas dobles sin escapar dentro de un texto —motivo por el cual el informe usa comillas angulares.
