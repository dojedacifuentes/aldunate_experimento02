# ============================================================
#  Build-Resumen.ps1 — resumen ejecutivo autónomo para dirección
# ============================================================
param([string]$Contenido = '.', [string]$Salida = '', [string]$Archivo = 'resumen-ejecutivo.docx')
$ErrorActionPreference = 'Stop'
$plantillas = Split-Path $MyInvocation.MyCommand.Path -Parent
$motor      = Join-Path (Split-Path $plantillas -Parent) 'motor'
. (Join-Path $motor 'DocxBuilder.ps1')
$base = (Resolve-Path $Contenido).Path
$figs = Join-Path $base 'figuras'
if (-not $Salida) { $Salida = Join-Path $base 'salida' }
$IMGW = 5950000

$TITULO = 'Inteligencia artificial y enseñanza universitaria'
$SUB    = 'Resumen ejecutivo para la toma de decisiones institucionales'

$d = New-Doc

# ---- portada compacta (no ocupa página entera) ----
Spacer $d 22
P $d 'RESUMEN EJECUTIVO' @{after=44} @{font=$script:HEADFONT; size=9.5; b=$true; color=$script:DK.teal; spacing=90}
HRule $d $script:DK.navy 14 30 190
P $d $TITULO @{after=90; line=236} @{font=$script:HEADFONT; size=22; b=$true; color=$script:DK.ink}
P $d $SUB @{after=150; line=250; indentRight=1200} @{font=$script:BODYFONT; size=12; i=$true; color=$script:DK.ink2}
TableGrid $d $null @(
  @('**94 %**','de los estudiantes usa IA para trabajos evaluados','**12 %**','inserta texto generado directamente en la entrega'),
  @('**94 %**','de las entregas de IA pasó sin detección en un examen real','**19 %**','de las instituciones tiene política de IA vigente')
) @(880,3560,880,3800) @{ size=8.6; align=@('center','left','center','left'); sansCol=@(0,2) }
Spacer $d 16
P $d 'Síntesis del informe «La universidad ante la automatización del trabajo cognitivo» (2022-2026), 76 páginas. Todas las cifras proceden de fuentes verificadas individualmente; el informe completo detalla en cada caso qué mide el dato y con qué sesgo.' @{after=40; line=240} @{font=$script:BODYFONT; size=9.5; color=$script:DK.muted}
HRule $d $script:DK.rule 4 60 40
P $d 'Agosto de 2026' @{after=0} @{font=$script:HEADFONT; size=9; b=$true; color=$script:DK.muted}

# ---- cuerpo ----
$nFig = 0; $nTab = 0; $primero = $true
foreach ($f in (Get-ChildItem -Path $base -Filter 'resumen-*.json' | Sort-Object Name)) {
  foreach ($b in (Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json)) {
    switch ($b.t) {
      'h1' { if ($primero) { HRule $d $script:DK.navy 10 260 40; H1NoBreak $d $b.n $b.x; $primero = $false } else { H1NoBreak $d $b.n $b.x } }
      'h2'      { H2 $d $b.x }
      'lead'    { Lead $d $b.x }
      'p'       { Body $d $b.x }
      'quote'   { Quote $d $b.x $b.a }
      'callout' {
        $c = $script:DK.navy
        if ($b.c -eq 'brick') { $c = $script:DK.brick }
        if ($b.c -eq 'teal')  { $c = $script:DK.teal }
        if ($b.c -eq 'ochre') { $c = $script:DK.ochre }
        Callout $d $b.h $b.x $c
      }
      'bullets' { foreach ($i in $b.items) { Bullet $d $i }; Spacer $d 5 }
      'numbers' { foreach ($i in $b.items) { NumItem $d $i }; Spacer $d 5 }
      'fig' {
        $nFig++
        $p = Join-Path $figs ($b.id + '.png')
        $cap = 'Figura ' + $nFig + '. ' + ([regex]::Replace([string]$b.cap, '^Figura\s+\d+\.\s*', ''))
        if (Test-Path $p) { AddImage $d $p $IMGW $cap; Caption $d $cap }
      }
      'table' {
        $nTab++
        $rows = @(); foreach ($r in $b.rows) { $rows += ,@($r) }
        $opt = @{ sansCol = @(0) }
        if ($b.align) { $opt.align = @($b.align) }
        TableGrid $d @($b.head) $rows @($b.w) $opt
        if ($b.cap) { Caption $d ('Tabla ' + $nTab + '. ' + ([regex]::Replace([string]$b.cap, '^Tabla\s+\d+\.\s*', ''))) }
      }
    }
  }
}

HRule $d $script:DK.navy 10 260 100
P $d 'El informe completo —24 capítulos, mapa de treinta instituciones, seis estudios de caso y matriz maestra con treinta y ocho hallazgos trazados— desarrolla y documenta cada afirmación de este resumen.' @{after=0; line=240} @{font=$script:BODYFONT; size=9.5; i=$true; color=$script:DK.muted}

if (-not (Test-Path $Salida)) { New-Item -ItemType Directory -Force $Salida | Out-Null }
$out = Join-Path $Salida $Archivo
$meta = @{
  titulo=$TITULO; subtitulo=$SUB
  autor='Investigador y consultor experto en modelos educativos'
  keywords='inteligencia artificial; educación superior; evaluación; gobernanza universitaria'
  fecha='2026-08-30T09:00:00Z'
  headerIzq='IA Y ENSEÑANZA UNIVERSITARIA · RESUMEN EJECUTIVO'
  headerDer='Agosto de 2026'
  footerIzq='Síntesis del informe completo'
}
$p = Save-Doc $d $out $meta
"Figuras: $nFig   Tablas: $nTab"
"DOCX -> $p  ($([Math]::Round((Get-Item $p).Length/1KB,1)) KB)"
