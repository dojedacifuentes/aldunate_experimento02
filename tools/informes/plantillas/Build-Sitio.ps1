# ============================================================
#  Build-Sitio.ps1
#  Convierte los HTML generados por Build-Artifact.ps1 (que son
#  fragmentos pensados para el runtime de Artifacts) en documentos
#  HTML autónomos, y los coloca en /public para servir en Vercel.
# ============================================================
param([string]$Origen = '', [string]$Destino = '')

$ErrorActionPreference = 'Stop'
$src  = Split-Path $MyInvocation.MyCommand.Path -Parent
$raiz = Split-Path $src -Parent
if (-not $Origen)  { $Origen  = Join-Path $raiz 'salida' }
if (-not $Destino) { $Destino = Join-Path $raiz 'public' }

# Envuelve un fragmento (title + link + style + markup) en un documento completo.
# El corte se hace tras la última etiqueta </style>: todo lo anterior es cabecera.
function Envolver([string]$fragmento, [string]$descripcion) {
  $corte = $fragmento.LastIndexOf('</style>')
  if ($corte -lt 0) { throw 'No se encontró bloque <style> en el fragmento.' }
  $cabeza = $fragmento.Substring(0, $corte + 8)
  $cuerpo = $fragmento.Substring($corte + 8)
  $d = [System.Net.WebUtility]::HtmlEncode($descripcion)
  $html = @"
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="$d">
<meta name="color-scheme" content="light dark">
$cabeza
</head>
<body>
$cuerpo
</body>
</html>
"@
  return $html
}

$mapa = @(
  @{ ent='informe-ia-universidad.html'; sal='informe.html'; desc='La universidad ante la automatización del trabajo cognitivo: informe experto sobre la transformación de la enseñanza universitaria ante la IA generativa, 2022-2026.' },
  @{ ent='resumen-ejecutivo.html';      sal='resumen.html'; desc='Resumen ejecutivo de ocho minutos: qué se rompió en la evaluación universitaria, qué dice la evidencia y cinco medidas ordenadas por coste.' }
)

if (-not (Test-Path $Destino)) { New-Item -ItemType Directory -Force $Destino | Out-Null }
$utf8 = New-Object System.Text.UTF8Encoding($false)

foreach ($m in $mapa) {
  $ruta = Join-Path $Origen $m.ent
  if (-not (Test-Path $ruta)) { Write-Warning "No encontrado: $ruta"; continue }
  $frag = [System.IO.File]::ReadAllText($ruta, [System.Text.Encoding]::UTF8)
  $doc  = Envolver $frag $m.desc
  $out  = Join-Path $Destino $m.sal
  [System.IO.File]::WriteAllText($out, $doc, $utf8)
  "OK  {0}  ->  {1}  ({2:N2} MB)" -f $m.ent, $m.sal, ((Get-Item $out).Length / 1MB)
}
