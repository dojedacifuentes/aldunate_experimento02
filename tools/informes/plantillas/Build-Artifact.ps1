param([string]$Contenido = '.', [string]$Solo = 'contenido-*.json', [string]$Salida = 'informe.html', [string]$Plantilla = 'shell.html', [string]$Destino = '')
# ============================================================
#  Build-Artifact.ps1 — genera el HTML del informe desde contenido-*.json
# ============================================================
$ErrorActionPreference = 'Stop'
$plantillas = Split-Path $MyInvocation.MyCommand.Path -Parent
$base = (Resolve-Path $Contenido).Path
if (-not $Destino) { $Destino = Join-Path $base 'salida' }
$figs = Join-Path $base 'figuras-web'
if (-not (Test-Path $figs)) { $figs = Join-Path $base 'figuras' }

function Esc([string]$s) {
  if ($null -eq $s) { return '' }
  return ($s -replace '&','&amp;' -replace '<','&lt;' -replace '>','&gt;')
}
# **negrita**  *cursiva*  `codigo`
function Rich([string]$s) {
  $t = Esc $s
  $t = [regex]::Replace($t,'\*\*([^*]+)\*\*','<strong>$1</strong>')
  $t = [regex]::Replace($t,'(?<!\*)\*([^*\n]+)\*(?!\*)','<em>$1</em>')
  $t = [regex]::Replace($t,'`([^`]+)`','<code>$1</code>')
  return $t
}
$CHIPS = @('ALTA','MEDIA-ALTA','MEDIA','BAJA','INSUFICIENTE','NO DEMOSTRADO','VERIFICADO','REPORTADO','EMERGENTE','CONTROVERTIDO')
function Cell([string]$s) {
  $raw = ($s -replace '\*\*','').Trim()
  if ($CHIPS -contains $raw) {
    $cls = ($raw.ToLower() -replace ' ','-')
    return '<span class="chip ' + $cls + '">' + (Esc $raw) + '</span>'
  }
  return (Rich $s)
}
function Slug([string]$s) {
  $t = $s.ToLower()
  $map = @{'á'='a';'é'='e';'í'='i';'ó'='o';'ú'='u';'ñ'='n';'ü'='u'}
  foreach ($k in $map.Keys) { $t = $t -replace $k, $map[$k] }
  $t = $t -replace '[^a-z0-9]+','-'
  return $t.Trim('-')
}
$imgCache = @{}
function Img64([string]$id) {
  if ($imgCache.ContainsKey($id)) { return $imgCache[$id] }
  $p = Join-Path $figs ($id + '.png')
  if (-not (Test-Path $p)) { Write-Warning "FALTA: $p"; return '' }
  $b = 'data:image/png;base64,' + [Convert]::ToBase64String([IO.File]::ReadAllBytes($p))
  $imgCache[$id] = $b
  return $b
}

$sb  = New-Object System.Text.StringBuilder
$nav = New-Object System.Text.StringBuilder
$abierto = $false
$nFig = 0; $nTab = 0

$archivos = Get-ChildItem -Path $base -Filter $Solo | Sort-Object Name
foreach ($f in $archivos) {
  $bloques = Get-Content $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($b in $bloques) {
    switch ($b.t) {
      'h1' {
        if ($abierto) { [void]$sb.Append("</section>`n") }
        $id = Slug $b.n
        [void]$sb.Append('<section class="chapter" id="' + $id + '">' + "`n")
        [void]$sb.Append('<div class="kicker">' + (Esc $b.n) + '</div>' + "`n")
        [void]$sb.Append('<h2 class="ch">' + (Esc $b.x) + '</h2>' + "`n")
        [void]$sb.Append('<hr class="chrule">' + "`n")
        [void]$nav.Append('<li><a href="#' + $id + '"><span class="num">' + (Esc $b.n) + '</span><span>' + (Esc $b.x) + '</span></a></li>' + "`n")
        $abierto = $true
      }
      'h2'      { [void]$sb.Append('<h3>' + (Rich $b.x) + '</h3>' + "`n") }
      'h3'      { [void]$sb.Append('<h4>' + (Rich $b.x) + '</h4>' + "`n") }
      'h4'      { [void]$sb.Append('<h5>' + (Rich $b.x) + '</h5>' + "`n") }
      'lead'    { [void]$sb.Append('<p class="lead">' + (Rich $b.x) + '</p>' + "`n") }
      'p'       { [void]$sb.Append('<p>' + (Rich $b.x) + '</p>' + "`n") }
      'quote'   {
        [void]$sb.Append('<blockquote><p>' + (Rich $b.x) + '</p>')
        if ($b.a) { [void]$sb.Append('<cite>' + (Rich $b.a) + '</cite>') }
        [void]$sb.Append("</blockquote>`n")
      }
      'callout' {
        $c = 'navy'; if ($b.c) { $c = $b.c }
        [void]$sb.Append('<div class="callout ' + $c + '"><h4>' + (Esc $b.h) + '</h4><p>' + (Rich $b.x) + '</p></div>' + "`n")
      }
      'bullets' {
        [void]$sb.Append('<ul class="b">')
        foreach ($i in $b.items) { [void]$sb.Append('<li>' + (Rich $i) + '</li>') }
        [void]$sb.Append("</ul>`n")
      }
      'numbers' {
        [void]$sb.Append('<ol class="n">')
        foreach ($i in $b.items) { [void]$sb.Append('<li>' + (Rich $i) + '</li>') }
        [void]$sb.Append("</ol>`n")
      }
      'rule'      { [void]$sb.Append('<hr class="sep">' + "`n") }
      'pagebreak' { }
      'fig' {
        $nFig++
        $src = Img64 $b.id
        if ($src) {
          $limpio = [regex]::Replace([string]$b.cap, '^Figura\s+\d+\.\s*', '')
          $cap = '<b>Figura ' + $nFig + '.</b> ' + (Rich $limpio)
          [void]$sb.Append('<figure><div class="plate"><img src="' + $src + '" alt="' + (Esc ('Figura ' + $nFig + '. ' + $limpio)) + '" loading="lazy"></div><figcaption>' + $cap + '</figcaption></figure>' + "`n")
        }
      }
      'table' {
        $nTab++
        $al = @(); if ($b.align) { $al = @($b.align) }
        [void]$sb.Append('<div class="tw"><div class="tscroll"><table><thead><tr>')
        for ($i=0; $i -lt $b.head.Count; $i++) {
          $c = ''; if ($al.Count -gt $i -and $al[$i] -eq 'center') { $c = ' class="c"' }
          [void]$sb.Append('<th' + $c + '>' + (Rich $b.head[$i]) + '</th>')
        }
        [void]$sb.Append('</tr></thead><tbody>')
        foreach ($r in $b.rows) {
          [void]$sb.Append('<tr>')
          for ($i=0; $i -lt $r.Count; $i++) {
            $c = ''; if ($al.Count -gt $i -and $al[$i] -eq 'center') { $c = ' class="c"' }
            [void]$sb.Append('<td' + $c + '>' + (Cell $r[$i]) + '</td>')
          }
          [void]$sb.Append('</tr>')
        }
        [void]$sb.Append('</tbody></table></div>')
        if ($b.cap) {
          $tc = '<b>Tabla ' + $nTab + '.</b> ' + (Rich ([regex]::Replace([string]$b.cap, '^Tabla\s+\d+\.\s*', '')))
          [void]$sb.Append('<div class="tcap">' + $tc + '</div>')
        }
        [void]$sb.Append("</div>`n")
      }
      default { Write-Warning "Bloque desconocido: $($b.t)" }
    }
  }
}
if ($abierto) { [void]$sb.Append("</section>`n") }

$shell = Get-Content (Join-Path $plantillas $Plantilla) -Raw -Encoding UTF8
$html  = $shell.Replace('<!--NAV-->', $nav.ToString()).Replace('<!--CONTENIDO-->', $sb.ToString())

if (-not (Test-Path $Destino)) { New-Item -ItemType Directory -Force $Destino | Out-Null }
$out = Join-Path $Destino $Salida
[System.IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($false)))

"Figuras: $nFig   Tablas: $nTab"
"HTML -> $out  ($([Math]::Round((Get-Item $out).Length/1MB,2)) MB)"
