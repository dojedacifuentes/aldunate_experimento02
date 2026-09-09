# Convierte el documento entregado a .docx abriéndolo con Word.
#
# Por qué existe. Desde la v2.0.0 el Informe 01 no nace en el repositorio: llega
# maquetado como HTML. El .docx que se ofrece para anotar y devolver con control
# de cambios se produce abriendo ese HTML con Word y guardándolo, no
# reconstruyéndolo: cualquier otra vía produce un documento que ya no es el
# mismo que el PDF.
#
# Se convierte el HTML de `entregas/`, no el de `public/descargas/`. El
# publicado lleva encima la capa de lectura en pantalla —índice lateral, raíl,
# alternador de tema—, y eso en un Word es basura.
#
# Después, `npm run informe:word` lo lleva de 10 a 12 pt.
#
#   powershell -ExecutionPolicy Bypass -File scripts/informes/lector/html-a-word.ps1 -Version 3.0.0
#
# La trampa. `Join-Path` devuelve un PSObject y los parámetros [ref] de la API
# COM de Word no lo aceptan: hay que envolver cada ruta en [string]. Sin eso el
# fallo es un "no se puede convertir el argumento" que no dice cuál.

param(
  [Parameter(Mandatory = $true)][string]$Version
)

$ErrorActionPreference = 'Stop'

$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$entregas = Join-Path $raiz "content\reports\01_ia_escuelas_derecho_chile\entregas\v$Version"

# El .docx se deja junto a su HTML, en `entregas/`, y no en `public/descargas/`.
# Es la fuente intocada de la que `word.mjs` deriva el publicado a 12 pt; si se
# escribiera ya en descargas, el escalado se aplicaría sobre su propia salida y
# volver a ejecutar la cadena agrandaría la letra una vez más en cada pasada.
$destino = $entregas

$piezas = @(
  @{ html = "informe-01-v$Version.html"; docx = "informe-01-v$Version.docx" },
  @{ html = 'complemento-pucv-v1.1.html'; docx = 'complemento-pucv-v1.1.docx' }
)

foreach ($p in $piezas) {
  $origen = [string](Join-Path $entregas $p.html)
  if (-not (Test-Path $origen)) { throw "No existe el HTML de origen: $origen" }
}
if (-not (Test-Path $destino)) { New-Item -ItemType Directory -Path $destino | Out-Null }

Write-Output "Abriendo Word..."
$w = New-Object -ComObject Word.Application
$w.Visible = $false
$w.DisplayAlerts = 0

try {
  foreach ($p in $piezas) {
    $origen = [string](Join-Path $entregas $p.html)
    $salida = [string](Join-Path $destino $p.docx)

    Write-Output "  $($p.html) -> $($p.docx)"

    # ConfirmConversions a $false: si no, Word abre un diálogo con el filtro de
    # importación y el script se queda esperando a alguien que no está.
    $d = $w.Documents.Open($origen, $false, $true)

    # 16 = wdFormatDocumentDefault, que es el .docx moderno. El 0 heredado
    # produce un .doc binario que Word marca como formato antiguo al abrirlo.
    #
    # Y aquí la segunda trampa, hermana de la del [string]: el objeto que
    # devuelve New-Object -ComObject es de enlace tardío y NO expone `SaveAs2`
    # por nombre — el error dice "no contiene ningún método llamado SaveAs2" y
    # no que haya que llamarlo de otra forma. Se usa `SaveAs` con parámetros
    # [ref], que es la firma que la interfaz sí publica.
    $formato = 16
    $d.SaveAs([ref]$salida, [ref]$formato)
    $d.Close(0)

    $kb = [math]::Round((Get-Item $salida).Length / 1KB)
    Write-Output "    OK $kb KB"
  }
}
finally {
  $w.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($w) | Out-Null
  [GC]::Collect()
}

Write-Output "Listo. Ahora: npm run informe:word"
