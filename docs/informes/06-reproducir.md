# 06 · Cómo reproducirlo

Guía paso a paso para compilar el informe completo desde cero, y para modificarlo sin romperlo.

---

## Requisitos

| Necesitas | Para qué | Nota |
|---|---|---|
| **Windows con PowerShell 5.1** | Toda la cadena | Es el que trae el sistema. No PowerShell 7: la sintaxis difiere |
| **Microsoft Word** | Exportar a PDF y actualizar el índice | Solo al final, por automatización COM |
| **Fuentes Georgia y Segoe UI** | Tipografía de las figuras | Vienen con Windows |

No hace falta Python, Node, ningún gestor de paquetes ni conexión a internet para compilar.

---

## Compilación completa

```powershell
cd src

# 1. Codificación (imprescindible tras editar cualquier .ps1)
.\utf8bom.ps1

# 2. Figuras, en las dos resoluciones
.\Graficos.ps1                                     # ×2,5  → figuras/
.\Graficos.ps1 -PxScale 1.55 -OutDir figuras-web   # ×1,55 → figuras-web/

# 3. Documentos
.\Build-Informe.ps1        # informe → .docx
.\Build-Resumen.ps1        # resumen → .docx
.\Build-Artifact.ps1       # informe → .html
.\Build-Artifact.ps1 -Solo 'resumen-*.json' -Salida 'resumen-ejecutivo.html' -Plantilla 'shell-resumen.html'

# 4. Sitio estático
.\Build-Sitio.ps1
```

### Índice y PDF

```powershell
$w = New-Object -ComObject Word.Application
$w.Visible = $false; $w.DisplayAlerts = 0
$doc = $w.Documents.Open($rutaDocx, $false, $false)
$doc.Fields.Update() | Out-Null
$doc.TablesOfContents.Item(1).Update()
$doc.Repaginate()
$doc.Save()
$doc.ExportAsFixedFormat($rutaPdf, 17)
$doc.Close(0); $w.Quit()
```

---

## Las dos trampas del entorno

Ambas cuestan tiempo si no se conocen de antemano.

### 1. Codificación de los scripts

**PowerShell 5.1 lee los `.ps1` sin BOM como ANSI.** Los acentos y los signos tipográficos se corrompen en silencio: `·` se convierte en `Â·`, `ó` en `Ã³`. El texto compila y sale mal impreso.

La solución está automatizada en `utf8bom.ps1`, que reescribe todos los scripts del directorio en UTF-8 **con** BOM. Ejecútalo después de cada edición.

```powershell
.\utf8bom.ps1
```

### 2. Los nombres de variable no distinguen mayúsculas

En PowerShell, `$Scale` y `$SCALE` **son la misma variable**. Un parámetro llamado `$Scale` queda sobrescrito por el `$script:SCALE = 2.5` que ejecuta `ChartEngine.ps1` al ser cargado con `dot-source`, y el parámetro deja de tener efecto sin dar ningún error.

Por eso el parámetro de escala se llama `$PxScale`. Si añades parámetros a estos scripts, comprueba que no colisionen con ninguna variable interna, sea cual sea su caja.

---

## Modificaciones frecuentes

### Cambiar un dato del informe

1. Localiza el bloque en `contenido-*.json`.
2. Si el dato aparece también en una figura, edita su bloque en `Graficos.ps1` y vuelve a generar las figuras en las dos escalas.
3. Recompila.

Si el dato aparece en más de un sitio —es habitual: un mismo porcentaje puede estar en el resumen ejecutivo, en un capítulo y en la matriz maestra— búscalo en todos los archivos antes de dar por hecho que lo cambiaste una sola vez.

### Añadir un capítulo

Ver `docs/05-modelo-de-contenido.md`. En resumen: nuevo archivo con sufijo de letra en la posición alfabética correcta, renumeración descendente de los capítulos posteriores y revisión de las referencias cruzadas en prosa.

### Añadir una figura

Ver `docs/03-motor-de-graficos.md`. Nuevo bloque en `Graficos.ps1`, regenerar en dos escalas y referenciarla con un bloque `fig`. La numeración se recalcula sola.

### Cambiar la paleta

En `ChartEngine.ps1`, la tabla `$script:PAL` y el array `$script:SERIES` gobiernan las figuras. En `src/shell.html` y `src/shell-resumen.html`, los tokens CSS del bloque `:root` gobiernan la web, y deben redefinirse también en los dos bloques de tema oscuro. En `DocxBuilder.ps1`, la tabla `$script:DK` gobierna el Word.

Son tres definiciones de la misma paleta, en tres lugares. Es la única duplicación deliberada del sistema y conviene actualizarlas juntas.

---

## Verificaciones antes de dar por buena una compilación

### JSON válido

```powershell
Get-ChildItem contenido-*.json | ForEach-Object {
  try   { $n = (Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json).Count
          "OK  $($_.Name)  ($n bloques)" }
  catch { "ERROR  $($_.Name): $($_.Exception.Message)" }
}
```

### Nada desborda la caja de A4

```powershell
$doc = $w.Documents.Open($rutaDocx, $false, $true)
$caja = $doc.PageSetup.PageWidth - $doc.PageSetup.LeftMargin - $doc.PageSetup.RightMargin
$mal = 0
foreach ($t in $doc.Tables) {
  $a = 0; foreach ($c in $t.Columns) { $a += $c.Width }
  if ($a -gt ($caja + 1)) { $mal++ }
}
"Tablas que desbordan: $mal"
```

### Numeración correlativa

```powershell
$t = [System.IO.File]::ReadAllText($rutaHtml, [System.Text.Encoding]::UTF8)
$fg = [regex]::Matches($t, '<b>Figura (\d+)\.</b>') | ForEach-Object { [int]$_.Groups[1].Value }
"Figuras correlativas: " + ((($fg | Sort-Object) -join ',') -eq (1..$fg.Count -join ','))
```

### Recuentos declarados frente a recuentos reales

Es la comprobación que más errores encontró. Consiste en contrastar cada afirmación numérica en prosa —«cinco de los seis casos», «treinta y ocho hallazgos»— con el recuento real de filas de la tabla que la sostiene. En una revisión de este tipo aparecieron cuatro discrepancias en un documento de 28.700 palabras.

```powershell
# Ejemplo: contar filas por nivel demostrativo en la matriz maestra
$m = [System.IO.File]::ReadAllText('contenido-07.json', [System.Text.Encoding]::UTF8)
foreach ($d in @('D1','D2','D3','D4','D5')) {
  $n = $m.Split(@('","' + $d + '","'), [StringSplitOptions]::None).Length - 1
  "  $d = $n"
}
```

---

## Previsualizar la web en local

El navegador puede bloquear `file://` para páginas con recursos incrustados. Un servidor mínimo en PowerShell resuelve el problema sin instalar nada:

```powershell
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8100/')
$listener.Start()
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $bytes = [System.IO.File]::ReadAllBytes('..\public\index.html')
  $ctx.Response.ContentType = 'text/html; charset=utf-8'
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.OutputStream.Close()
}
```

---

## Desplegar

El sitio es estático y `vercel.json` ya declara `public/` como directorio de salida. Importar el repositorio en Vercel y desplegar, sin tocar la configuración: framework «Other», sin comando de build.

Los archivos descargables viven en `public/descargas/` y se enlazan con `<a href="…" download>`, que funciona en cualquier alojamiento web normal.
