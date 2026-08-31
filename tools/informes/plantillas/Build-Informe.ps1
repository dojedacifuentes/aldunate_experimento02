# ============================================================
#  Build-Informe.ps1 — ensambla el .docx a partir de contenido-*.json
#
#  Se ejecuta desde la carpeta del informe:
#     ..\plantillas\Build-Informe.ps1
#
#  O apuntando explícitamente a otra carpeta:
#     .\Build-Informe.ps1 -Contenido ..\informe-03 -Titulo 'Mi informe'
# ============================================================
param(
  [string]$Contenido = '.',
  [string]$Salida    = '',
  [string]$Archivo   = 'informe.docx',
  [string]$Titulo    = 'La universidad ante la automatización del trabajo cognitivo',
  [string]$Subtitulo = 'Transformación de la enseñanza superior en el contexto de la inteligencia artificial: metodologías, competencias, evaluación, currículo y gobernanza',
  [string]$Periodo   = '2022 – 2026',
  [string]$Autoria   = 'Informe elaborado en calidad de investigador y consultor experto en modelos educativos, innovación y transformación institucional',
  [string]$Fecha     = 'Agosto de 2026'
)

$ErrorActionPreference = 'Stop'
$plantillas = Split-Path $MyInvocation.MyCommand.Path -Parent
$motor      = Join-Path (Split-Path $plantillas -Parent) 'motor'
. (Join-Path $motor 'DocxBuilder.ps1')

$base = (Resolve-Path $Contenido).Path
$figs = Join-Path $base 'figuras'
if (-not $Salida) { $Salida = Join-Path $base 'salida' }

$TITULO    = $Titulo
$SUBTITULO = $Subtitulo
$PERIODO   = $Periodo
$AUTORLINE = $Autoria
$FECHA     = $Fecha
$IMGW      = 5950000

$d = New-Doc

# ============ PORTADA ============
Spacer $d 54
P $d 'INFORME EXPERTO' @{after=50} @{font=$script:HEADFONT; size=10; b=$true; color=$script:DK.teal; spacing=90}
P $d 'Educación superior · Modelos educativos · Transformación institucional' @{after=90} @{font=$script:HEADFONT; size=9.5; color=$script:DK.muted}
HRule $d $script:DK.navy 16 40 320
P $d $TITULO @{after=140; line=232} @{font=$script:HEADFONT; size=26; b=$true; color=$script:DK.ink}
P $d $SUBTITULO @{after=180; line=252; indentRight=900} @{font=$script:BODYFONT; size=12.5; i=$true; color=$script:DK.ink2}
P $d $PERIODO @{after=460} @{font=$script:HEADFONT; size=13; b=$true; color=$script:DK.teal; spacing=180}

# bloque de cifras de portada
TableGrid $d $null @(
  @('**94 %**','de los estudiantes de grado usa IA generativa para trabajos evaluados','**12 %**','inserta directamente texto generado por IA en la entrega'),
  @('**94 %**','de las entregas generadas por IA pasó sin detección en un examen real','**19 %**','de las instituciones tiene una política de IA formalmente vigente')
) @(900,3600,900,3720) @{ size=9; align=@('center','left','center','left'); sansCol=@(0,2) }

Spacer $d 26
HRule $d $script:DK.rule 4 40 120
P $d $AUTORLINE @{after=60; line=240} @{font=$script:BODYFONT; size=9.5; color=$script:DK.ink2}
P $d $FECHA @{after=0} @{font=$script:HEADFONT; size=9.5; b=$true; color=$script:DK.muted}
PageBreak $d

# ============ ÍNDICE ============
P $d 'CONTENIDO' @{after=50} @{font=$script:HEADFONT; size=9; b=$true; color=$script:DK.teal; spacing=70}
P $d 'Tabla de contenido' @{after=40} @{font=$script:HEADFONT; size=19; b=$true; color=$script:DK.ink}
HRule $d $script:DK.navy 12 20 160
P $d 'Si la numeración de páginas no aparece, haga clic derecho sobre la tabla y elija «Actualizar campos» → «Actualizar toda la tabla».' @{after=200} @{font=$script:BODYFONT; size=8.5; i=$true; color=$script:DK.muted}
TOC $d '1-2'
PageBreak $d

# ============ CUERPO ============
$archivos = Get-ChildItem -Path $base -Filter 'contenido-*.json' | Sort-Object Name
$nFig = 0; $nTab = 0; $primero = $true
foreach ($f in $archivos) {
  $bloques = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($b in $bloques) {
    switch ($b.t) {
      'h1' {
        if ($primero -or $b.nobreak) { H1NoBreak $d $b.n $b.x } else { H1 $d $b.n $b.x }
        $primero = $false
      }
      'h2'      { H2 $d $b.x }
      'h3'      { H3 $d $b.x }
      'h4'      { H4 $d $b.x }
      'lead'    { Lead $d $b.x }
      'p'       { Body $d $b.x }
      'quote'   { Quote $d $b.x $b.a }
      'callout' {
        $c = $script:DK.navy
        if ($b.c -eq 'brick') { $c = $script:DK.brick }
        if ($b.c -eq 'teal')  { $c = $script:DK.teal }
        if ($b.c -eq 'ochre') { $c = $script:DK.ochre }
        if ($b.c -eq 'sage')  { $c = $script:DK.sage }
        Callout $d $b.h $b.x $c
      }
      'bullets' { foreach ($i in $b.items) { Bullet $d $i } ; Spacer $d 5 }
      'numbers' { foreach ($i in $b.items) { NumItem $d $i } ; Spacer $d 5 }
      'rule'    { HRule $d $script:DK.rule 4 200 200 }
      'pagebreak' { PageBreak $d }
      'fig' {
        $nFig++
        $p = Join-Path $figs ($b.id + '.png')
        $cap = 'Figura ' + $nFig + '. ' + ([regex]::Replace([string]$b.cap, '^Figura\s+\d+\.\s*', ''))
        if (Test-Path $p) { AddImage $d $p $IMGW $cap; Caption $d $cap }
        else { Write-Warning "FALTA FIGURA: $p" }
      }
      'table' {
        $nTab++
        $rows = @()
        foreach ($r in $b.rows) { $rows += ,@($r) }
        $opt = @{}
        if ($b.align) { $opt.align = @($b.align) }
        if ($b.size)  { $opt.size  = $b.size }
        $opt.sansCol = @(0)
        TableGrid $d @($b.head) $rows @($b.w) $opt
        if ($b.cap) { Caption $d ('Tabla ' + $nTab + '. ' + ([regex]::Replace([string]$b.cap, '^Tabla\s+\d+\.\s*', ''))) }
      }
      default { Write-Warning "Bloque desconocido: $($b.t)" }
    }
  }
}

if (-not (Test-Path $Salida)) { New-Item -ItemType Directory -Force $Salida | Out-Null }
$out = Join-Path $Salida $Archivo

$meta = @{
  titulo=$TITULO; subtitulo=$SUBTITULO
  autor='Investigador y consultor experto en modelos educativos'
  keywords='inteligencia artificial; educación superior; evaluación; competencias; currículo; gobernanza universitaria'
  fecha='2026-08-30T09:00:00Z'
  headerIzq='LA UNIVERSIDAD ANTE LA AUTOMATIZACIÓN DEL TRABAJO COGNITIVO'
  headerDer='2022 – 2026'
  footerIzq='Informe experto · Agosto de 2026'
}
$p = Save-Doc $d $out $meta
"Figuras insertadas: $nFig    Tablas: $nTab"
"DOCX -> $p  ($([Math]::Round((Get-Item $p).Length/1KB,1)) KB)"
