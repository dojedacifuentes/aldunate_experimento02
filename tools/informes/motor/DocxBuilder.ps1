# ============================================================
#  DocxBuilder.ps1 - Generador OOXML (.docx) sin dependencias
#  Windows PowerShell 5.1
# ============================================================
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.Drawing

# ---- Paleta del documento (hex sin #) ----
$script:DK = @{
  ink='101720'; ink2='3A4654'; muted='7A8796'; rule='D8DEE5'; faint='EEF2F5'
  navy='1B3A5C'; teal='2F7D8C'; ochre='C08A2E'; brick='A34A3C'; sage='5F8560'
  panel='F4F7F9'; band='EAF0F4'; white='FFFFFF'
}
$script:BODYFONT = 'Georgia'
$script:HEADFONT = 'Segoe UI'

function XmlEsc([string]$s) {
  if ($null -eq $s) { return '' }
  $s = $s -replace '&','&amp;' -replace '<','&lt;' -replace '>','&gt;' -replace '"','&quot;'
  # limpia caracteres de control invalidos en XML
  return ($s -replace '[\x00-\x08\x0B\x0C\x0E-\x1F]','')
}

function New-Doc {
  return [pscustomobject]@{
    Body   = New-Object System.Text.StringBuilder
    Images = New-Object System.Collections.ArrayList
    RelId  = 10
    ImgId  = 100
  }
}
function AddXml($doc,[string]$xml) { [void]$doc.Body.Append($xml) }

# ---------- runs y parrafos ----------
function RunProps([hashtable]$o) {
  $s = '<w:rPr>'
  if ($o.font)  { $s += "<w:rFonts w:ascii=""$($o.font)"" w:hAnsi=""$($o.font)"" w:cs=""$($o.font)""/>" }
  if ($o.b)     { $s += '<w:b/>' }
  if ($o.i)     { $s += '<w:i/>' }
  if ($o.caps)  { $s += '<w:smallCaps/>' }
  if ($o.strike){ $s += '<w:strike/>' }
  if ($o.color) { $s += "<w:color w:val=""$($o.color)""/>" }
  if ($o.size)  { $s += "<w:sz w:val=""$([int]($o.size*2))""/><w:szCs w:val=""$([int]($o.size*2))""/>" }
  if ($o.spacing) { $s += "<w:spacing w:val=""$($o.spacing)""/>" }
  if ($o.shade) { $s += "<w:shd w:val=""clear"" w:color=""auto"" w:fill=""$($o.shade)""/>" }
  if ($o.super) { $s += '<w:vertAlign w:val="superscript"/>' }
  $s += '</w:rPr>'
  if ($s -eq '<w:rPr></w:rPr>') { return '' }
  return $s
}

function Run([string]$text,[hashtable]$o=@{}) {
  if ($null -eq $text) { $text = '' }
  $parts = $text -split "`n"
  $out = ''
  for ($i=0; $i -lt $parts.Count; $i++) {
    if ($i -gt 0) { $out += '<w:r><w:br/></w:r>' }
    $out += '<w:r>' + (RunProps $o) + '<w:t xml:space="preserve">' + (XmlEsc $parts[$i]) + '</w:t></w:r>'
  }
  return $out
}

# Marcado ligero dentro de un parrafo:  **negrita**  *cursiva*  `codigo`
function RichRuns([string]$text,[hashtable]$base=@{}) {
  if ([string]::IsNullOrEmpty($text)) { return '' }
  $out = ''
  $pattern = '(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)'
  $tokens = [regex]::Split($text, $pattern)
  foreach ($t in $tokens) {
    if ([string]::IsNullOrEmpty($t)) { continue }
    if ($t.StartsWith('**') -and $t.EndsWith('**') -and $t.Length -gt 4) {
      $o = $base.Clone(); $o.b = $true
      $out += Run $t.Substring(2,$t.Length-4) $o
    } elseif ($t.StartsWith('`') -and $t.EndsWith('`') -and $t.Length -gt 2) {
      $o = $base.Clone(); $o.font='Consolas'; $o.color=$script:DK.navy
      if ($base.size) { $o.size = $base.size - 1 }
      $out += Run $t.Substring(1,$t.Length-2) $o
    } elseif ($t.StartsWith('*') -and $t.EndsWith('*') -and $t.Length -gt 2) {
      $o = $base.Clone(); $o.i = $true
      $out += Run $t.Substring(1,$t.Length-2) $o
    } else {
      $out += Run $t $base
    }
  }
  return $out
}

function ParaProps([hashtable]$o) {
  $s = '<w:pPr>'
  if ($o.style)   { $s += "<w:pStyle w:val=""$($o.style)""/>" }
  if ($o.numId)   { $s += "<w:numPr><w:ilvl w:val=""$([int]$o.ilvl)""/><w:numId w:val=""$($o.numId)""/></w:numPr>" }
  if ($o.shade)   { $s += "<w:shd w:val=""clear"" w:color=""auto"" w:fill=""$($o.shade)""/>" }
  $bd = ''
  if ($o.barLeft) { $bd += "<w:left w:val=""single"" w:sz=""$([int]$o.barSize)"" w:space=""10"" w:color=""$($o.barLeft)""/>" }
  if ($o.ruleTop) { $bd += "<w:top w:val=""single"" w:sz=""$([int]$o.ruleTopSize)"" w:space=""4"" w:color=""$($o.ruleTop)""/>" }
  if ($o.ruleBottom) { $bd += "<w:bottom w:val=""single"" w:sz=""$([int]$o.ruleBottomSize)"" w:space=""6"" w:color=""$($o.ruleBottom)""/>" }
  if ($o.boxed)   { $bd += "<w:top w:val=""single"" w:sz=""4"" w:space=""8"" w:color=""$($o.boxed)""/><w:left w:val=""single"" w:sz=""4"" w:space=""10"" w:color=""$($o.boxed)""/><w:bottom w:val=""single"" w:sz=""4"" w:space=""8"" w:color=""$($o.boxed)""/><w:right w:val=""single"" w:sz=""4"" w:space=""10"" w:color=""$($o.boxed)""/>" }
  if ($bd) { $s += "<w:pBdr>$bd</w:pBdr>" }
  $ind = ''
  if ($o.indent)      { $ind += " w:left=""$([int]$o.indent)""" }
  if ($o.indentRight) { $ind += " w:right=""$([int]$o.indentRight)""" }
  if ($o.hanging)     { $ind += " w:hanging=""$([int]$o.hanging)""" }
  if ($o.firstLine)   { $ind += " w:firstLine=""$([int]$o.firstLine)""" }
  if ($ind) { $s += "<w:ind$ind/>" }
  $sp = ''
  if ($null -ne $o.before) { $sp += " w:before=""$([int]$o.before)""" }
  if ($null -ne $o.after)  { $sp += " w:after=""$([int]$o.after)""" }
  if ($o.line)   { $sp += " w:line=""$([int]$o.line)"" w:lineRule=""auto""" }
  if ($sp) { $s += "<w:spacing$sp/>" }
  if ($o.align)  { $s += "<w:jc w:val=""$($o.align)""/>" }
  if ($o.keepNext) { $s += '<w:keepNext/>' }
  if ($o.keepLines) { $s += '<w:keepLines/>' }
  if ($o.pageBreakBefore) { $s += '<w:pageBreakBefore/>' }
  if ($o.tabs) { $s += '<w:tabs>' + $o.tabs + '</w:tabs>' }
  $rpr = ''
  if ($o.rFont -or $o.rSize -or $o.rColor) {
    $rpr = '<w:rPr>'
    if ($o.rFont) { $rpr += "<w:rFonts w:ascii=""$($o.rFont)"" w:hAnsi=""$($o.rFont)""/>" }
    if ($o.rSize) { $rpr += "<w:sz w:val=""$([int]($o.rSize*2))""/>" }
    if ($o.rColor) { $rpr += "<w:color w:val=""$($o.rColor)""/>" }
    $rpr += '</w:rPr>'
  }
  $s += $rpr + '</w:pPr>'
  return $s
}

function P($doc,[string]$text,[hashtable]$p=@{},[hashtable]$r=@{}) {
  AddXml $doc ('<w:p>' + (ParaProps $p) + (RichRuns $text $r) + '</w:p>')
}
function PRaw($doc,[string]$runsXml,[hashtable]$p=@{}) {
  AddXml $doc ('<w:p>' + (ParaProps $p) + $runsXml + '</w:p>')
}
function PageBreak($doc) {
  AddXml $doc '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
}
function Spacer($doc,[int]$pts=8) {
  AddXml $doc ('<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="' + ($pts*20) + '" w:lineRule="exact"/></w:pPr></w:p>')
}
function HRule($doc,[string]$color='D8DEE5',[int]$sz=6,[int]$before=100,[int]$after=100) {
  AddXml $doc ('<w:p><w:pPr><w:spacing w:before="' + $before + '" w:after="' + $after + '"/><w:pBdr><w:bottom w:val="single" w:sz="' + $sz + '" w:space="1" w:color="' + $color + '"/></w:pBdr></w:pPr></w:p>')
}

# ---------- titulos ----------
function H1($doc,[string]$num,[string]$text) {
  AddXml $doc ('<w:p>' + (ParaProps @{before=0; after=50; keepNext=$true; pageBreakBefore=$true}) + `
    (Run $num.ToUpper() @{font=$script:HEADFONT; size=9.5; b=$true; color=$script:DK.teal; spacing=70}) + '</w:p>')
  AddXml $doc ('<w:p>' + (ParaProps @{style='Heading1'; before=20; after=180; keepNext=$true; ruleBottom=$script:DK.navy; ruleBottomSize=12}) + `
    (Run $text @{font=$script:HEADFONT; size=20; b=$true; color=$script:DK.ink}) + '</w:p>')
}
function H1NoBreak($doc,[string]$num,[string]$text) {
  AddXml $doc ('<w:p>' + (ParaProps @{before=0; after=50; keepNext=$true}) + `
    (Run $num.ToUpper() @{font=$script:HEADFONT; size=9.5; b=$true; color=$script:DK.teal; spacing=70}) + '</w:p>')
  AddXml $doc ('<w:p>' + (ParaProps @{style='Heading1'; before=20; after=180; keepNext=$true; ruleBottom=$script:DK.navy; ruleBottomSize=12}) + `
    (Run $text @{font=$script:HEADFONT; size=20; b=$true; color=$script:DK.ink}) + '</w:p>')
}
function H2($doc,[string]$text) {
  AddXml $doc ('<w:p>' + (ParaProps @{style='Heading2'; before=320; after=110; keepNext=$true; keepLines=$true}) + `
    (Run $text @{font=$script:HEADFONT; size=13.5; b=$true; color=$script:DK.navy}) + '</w:p>')
}
function H3($doc,[string]$text) {
  AddXml $doc ('<w:p>' + (ParaProps @{style='Heading3'; before=240; after=80; keepNext=$true; keepLines=$true}) + `
    (Run $text @{font=$script:HEADFONT; size=11; b=$true; color=$script:DK.ink2}) + '</w:p>')
}
function H4($doc,[string]$text) {
  AddXml $doc ('<w:p>' + (ParaProps @{style='Heading4'; before=180; after=60; keepNext=$true; keepLines=$true}) + `
    (Run $text @{font=$script:HEADFONT; size=10; b=$true; i=$true; color=$script:DK.teal}) + '</w:p>')
}

function Body($doc,[string]$text,[int]$after=140) {
  P $doc $text @{after=$after; before=0; line=264; align='both'} @{font=$script:BODYFONT; size=10.5; color=$script:DK.ink}
}
function Lead($doc,[string]$text) {
  P $doc $text @{after=180; before=40; line=280; align='both'} @{font=$script:BODYFONT; size=12; color=$script:DK.ink2}
}
function Bullet($doc,[string]$text,[int]$lvl=0) {
  P $doc $text @{numId=1; ilvl=$lvl; after=60; line=250; indent=(360+$lvl*280); hanging=200} @{font=$script:BODYFONT; size=10.5; color=$script:DK.ink}
}
function NumItem($doc,[string]$text,[int]$lvl=0) {
  P $doc $text @{numId=2; ilvl=$lvl; after=60; line=250; indent=(400+$lvl*280); hanging=240} @{font=$script:BODYFONT; size=10.5; color=$script:DK.ink}
}
function Quote($doc,[string]$text,[string]$attr='') {
  P $doc $text @{barLeft=$script:DK.teal; barSize=18; indent=300; indentRight=200; before=160; after=(&{ if($attr){40}else{180} }); line=250} @{font=$script:BODYFONT; size=10.5; i=$true; color=$script:DK.ink2}
  if ($attr) { P $doc $attr @{indent=300; before=0; after=180} @{font=$script:HEADFONT; size=8.5; color=$script:DK.muted} }
}
function Callout($doc,[string]$title,[string]$text,[string]$accent='') {
  if (-not $accent) { $accent = $script:DK.navy }
  P $doc $title @{shade=$script:DK.panel; barLeft=$accent; barSize=24; indent=240; indentRight=160; before=180; after=0} @{font=$script:HEADFONT; size=9.5; b=$true; color=$accent}
  P $doc $text  @{shade=$script:DK.panel; barLeft=$accent; barSize=24; indent=240; indentRight=160; before=40; after=180; line=240} @{font=$script:BODYFONT; size=9.5; color=$script:DK.ink2}
}
function Caption($doc,[string]$text) {
  P $doc $text @{before=20; after=200; indent=0} @{font=$script:HEADFONT; size=8; color=$script:DK.muted}
}
function Kicker($doc,[string]$text) {
  P $doc $text.ToUpper() @{before=0; after=40} @{font=$script:HEADFONT; size=8.5; b=$true; color=$script:DK.teal; spacing=40}
}

# ---------- tablas ----------
function TableGrid($doc,$header,$rows,$widths,[hashtable]$opt=@{}) {
  # widths: array de enteros en dxa (twentieths of a point). Total util A4 con margenes 2.2cm = ~9300
  $total = ($widths | Measure-Object -Sum).Sum
  $fs = 8.5; if ($opt.size) { $fs = $opt.size }
  $hfs = 8;  if ($opt.headSize) { $hfs = $opt.headSize }
  $x = '<w:tbl><w:tblPr><w:tblStyle w:val="TablaInforme"/><w:tblW w:w="' + $total + '" w:type="dxa"/>'
  $x += '<w:tblLayout w:type="fixed"/>'
  $x += '<w:tblBorders>'
  $x += '<w:top w:val="single" w:sz="8" w:space="0" w:color="' + $script:DK.navy + '"/>'
  $x += '<w:bottom w:val="single" w:sz="8" w:space="0" w:color="' + $script:DK.navy + '"/>'
  $x += '<w:insideH w:val="single" w:sz="2" w:space="0" w:color="' + $script:DK.rule + '"/>'
  $x += '<w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/><w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/><w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
  $x += '</w:tblBorders>'
  $x += '<w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="70" w:type="dxa"/><w:right w:w="70" w:type="dxa"/></w:tblCellMar>'
  $x += '</w:tblPr><w:tblGrid>'
  foreach ($wd in $widths) { $x += '<w:gridCol w:w="' + [int]$wd + '"/>' }
  $x += '</w:tblGrid>'
  # cabecera
  if ($header) {
    $x += '<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>'
    for ($i=0;$i -lt $header.Count;$i++) {
      $al = 'left'; if ($opt.align -and $opt.align[$i]) { $al = $opt.align[$i] }
      $x += '<w:tc><w:tcPr><w:tcW w:w="' + [int]$widths[$i] + '" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="' + $script:DK.band + '"/><w:vAlign w:val="bottom"/>'
      $x += '<w:tcBorders><w:bottom w:val="single" w:sz="8" w:space="0" w:color="' + $script:DK.navy + '"/></w:tcBorders></w:tcPr>'
      $x += '<w:p>' + (ParaProps @{before=50; after=50; align=$al; line=210}) + (Run ([string]$header[$i]) @{font=$script:HEADFONT; size=$hfs; b=$true; color=$script:DK.navy}) + '</w:p></w:tc>'
    }
    $x += '</w:tr>'
  }
  $ri = 0
  foreach ($row in $rows) {
    $ri++
    $fill = $script:DK.white
    if ($ri % 2 -eq 0) { $fill = 'FAFCFD' }
    $x += '<w:tr><w:trPr><w:cantSplit/></w:trPr>'
    for ($i=0;$i -lt $row.Count;$i++) {
      $al = 'left'; if ($opt.align -and $opt.align[$i]) { $al = $opt.align[$i] }
      $cell = [string]$row[$i]
      $rp = @{font=$script:BODYFONT; size=$fs; color=$script:DK.ink}
      if ($opt.boldCol -and ($opt.boldCol -contains $i)) { $rp.b = $true }
      if ($opt.sansCol -and ($opt.sansCol -contains $i)) { $rp.font = $script:HEADFONT }
      $cf = $fill
      if ($cell -match '^\[\[(#?[0-9A-Fa-f]{6})\]\]') {
        $cf = $Matches[1].TrimStart('#'); $cell = $cell -replace '^\[\[#?[0-9A-Fa-f]{6}\]\]',''
        $rp.color = 'FFFFFF'; $rp.b = $true
      }
      $x += '<w:tc><w:tcPr><w:tcW w:w="' + [int]$widths[$i] + '" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="' + $cf + '"/><w:vAlign w:val="top"/></w:tcPr>'
      $x += '<w:p>' + (ParaProps @{before=50; after=50; align=$al; line=215}) + (RichRuns $cell $rp) + '</w:p></w:tc>'
    }
    $x += '</w:tr>'
  }
  $x += '</w:tbl>'
  AddXml $doc $x
  AddXml $doc '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="60" w:lineRule="exact"/></w:pPr></w:p>'
}

# ---------- imagenes ----------
function AddImage($doc,[string]$path,[int]$maxWidthEmu=5760000,[string]$alt='Grafico') {
  if (-not (Test-Path $path)) { Write-Warning "Imagen no encontrada: $path"; return }
  $img = [System.Drawing.Image]::FromFile($path)
  $pw = $img.Width; $ph = $img.Height
  $img.Dispose()
  $cx = $maxWidthEmu
  $cy = [int]([double]$cx * $ph / $pw)
  $doc.RelId++; $doc.ImgId++
  $rid = 'rId' + $doc.RelId
  $name = 'media/image' + $doc.ImgId + '.png'
  [void]$doc.Images.Add([pscustomobject]@{ RId=$rid; Path=$path; Name=$name })
  $x  = '<w:p>' + (ParaProps @{align='center'; before=140; after=40; keepNext=$true}) + '<w:r><w:drawing>'
  $x += '<wp:inline distT="0" distB="0" distL="0" distR="0">'
  $x += '<wp:extent cx="' + $cx + '" cy="' + $cy + '"/><wp:effectExtent l="0" t="0" r="0" b="0"/>'
  $x += '<wp:docPr id="' + $doc.ImgId + '" name="Imagen ' + $doc.ImgId + '" descr="' + (XmlEsc $alt) + '"/>'
  $x += '<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
  $x += '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
  $x += '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
  $x += '<pic:nvPicPr><pic:cNvPr id="' + $doc.ImgId + '" name="Imagen ' + $doc.ImgId + '"/><pic:cNvPicPr/></pic:nvPicPr>'
  $x += '<pic:blipFill><a:blip r:embed="' + $rid + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
  $x += '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + $cx + '" cy="' + $cy + '"/></a:xfrm>'
  $x += '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>'
  $x += '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>'
  AddXml $doc $x
}

# ---------- indice ----------
function TOC($doc,[string]$levels='1-3') {
  $x  = '<w:p>' + (ParaProps @{before=0; after=120}) + '<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r>'
  $x += '<w:r><w:instrText xml:space="preserve"> TOC \o "' + $levels + '" \h \z \u </w:instrText></w:r>'
  $x += '<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
  $x += (Run 'Haga clic derecho sobre esta tabla y elija «Actualizar campos» para generar el indice.' @{font=$script:HEADFONT; size=9; i=$true; color=$script:DK.muted})
  $x += '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>'
  AddXml $doc $x
}

# ============================================================
#  Ensamblado del paquete
# ============================================================
function Save-Doc($doc,[string]$outPath,[hashtable]$meta) {
  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('docxb_' + [Guid]::NewGuid().ToString('N').Substring(0,10))
  New-Item -ItemType Directory -Force $tmp | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $tmp '_rels') | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $tmp 'docProps') | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $tmp 'word') | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $tmp 'word\_rels') | Out-Null
  New-Item -ItemType Directory -Force (Join-Path $tmp 'word\media') | Out-Null

  $enc = New-Object System.Text.UTF8Encoding($false)
  function W([string]$rel,[string]$content) {
    $p = Join-Path $tmp $rel
    [System.IO.File]::WriteAllText($p, $content, $enc)
  }
  $HDR = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + "`r`n"

  # ---- [Content_Types].xml ----
  $ct = $HDR + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
  $ct += '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
  $ct += '<Default Extension="xml" ContentType="application/xml"/>'
  $ct += '<Default Extension="png" ContentType="image/png"/>'
  $ct += '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
  $ct += '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
  $ct += '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>'
  $ct += '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>'
  $ct += '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'
  $ct += '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'
  $ct += '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
  $ct += '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
  $ct += '</Types>'
  W '[Content_Types].xml' $ct

  # ---- _rels/.rels ----
  $r = $HDR + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
  $r += '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
  $r += '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
  $r += '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
  $r += '</Relationships>'
  W '_rels\.rels' $r

  # ---- docProps ----
  $now = $meta.fecha
  $core = $HDR + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
  $core += '<dc:title>' + (XmlEsc $meta.titulo) + '</dc:title>'
  $core += '<dc:subject>' + (XmlEsc $meta.subtitulo) + '</dc:subject>'
  $core += '<dc:creator>' + (XmlEsc $meta.autor) + '</dc:creator>'
  $core += '<cp:keywords>' + (XmlEsc $meta.keywords) + '</cp:keywords>'
  $core += '<dcterms:created xsi:type="dcterms:W3CDTF">' + $now + '</dcterms:created>'
  $core += '<dcterms:modified xsi:type="dcterms:W3CDTF">' + $now + '</dcterms:modified>'
  $core += '</cp:coreProperties>'
  W 'docProps\core.xml' $core
  $app = $HDR + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Office Word</Application><Company>' + (XmlEsc $meta.autor) + '</Company></Properties>'
  W 'docProps\app.xml' $app

  # ---- word/_rels/document.xml.rels ----
  $dr = $HDR + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
  $dr += '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
  $dr += '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>'
  $dr += '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>'
  $dr += '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>'
  $dr += '<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>'
  foreach ($im in $doc.Images) {
    $dr += '<Relationship Id="' + $im.RId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="' + $im.Name + '"/>'
    Copy-Item $im.Path (Join-Path $tmp ('word\' + ($im.Name -replace '/','\'))) -Force
  }
  $dr += '</Relationships>'
  W 'word\_rels\document.xml.rels' $dr

  # ---- settings.xml (actualiza campos al abrir -> TOC automatico) ----
  $st = $HDR + '<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
  $st += '<w:zoom w:percent="110"/><w:defaultTabStop w:val="708"/>'
  $st += '<w:updateFields w:val="true"/>'
  $st += '<w:compat/>'
  $st += '</w:settings>'
  W 'word\settings.xml' $st

  # ---- numbering.xml ----
  $nb = $HDR + '<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
  $nb += '<w:abstractNum w:abstractNumId="0">'
  foreach ($lv in 0..2) {
    $ch = @([char]0x25AA, [char]0x2013, [char]0x00B7)[$lv]
    $nb += '<w:lvl w:ilvl="' + $lv + '"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="' + $ch + '"/><w:lvlJc w:val="left"/>'
    $nb += '<w:pPr><w:ind w:left="' + (360+$lv*280) + '" w:hanging="200"/></w:pPr>'
    $nb += '<w:rPr><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI" w:hint="default"/><w:color w:val="' + $script:DK.teal + '"/></w:rPr></w:lvl>'
  }
  $nb += '</w:abstractNum>'
  $nb += '<w:abstractNum w:abstractNumId="1">'
  foreach ($lv in 0..2) {
    $fmt = @('decimal','lowerLetter','lowerRoman')[$lv]
    $nb += '<w:lvl w:ilvl="' + $lv + '"><w:start w:val="1"/><w:numFmt w:val="' + $fmt + '"/><w:lvlText w:val="%' + ($lv+1) + '."/><w:lvlJc w:val="left"/>'
    $nb += '<w:pPr><w:ind w:left="' + (400+$lv*280) + '" w:hanging="240"/></w:pPr>'
    $nb += '<w:rPr><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/><w:b/><w:color w:val="' + $script:DK.navy + '"/></w:rPr></w:lvl>'
  }
  $nb += '</w:abstractNum>'
  $nb += '<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>'
  $nb += '<w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>'
  $nb += '</w:numbering>'
  W 'word\numbering.xml' $nb

  # ---- header / footer ----
  $hd = $HDR + '<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
  $hd += '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="4" w:color="' + $script:DK.rule + '"/></w:pBdr>'
  $hd += '<w:tabs><w:tab w:val="right" w:pos="9300"/></w:tabs><w:spacing w:after="0"/></w:pPr>'
  $hd += (Run $meta.headerIzq @{font=$script:HEADFONT; size=7.5; color=$script:DK.muted; spacing=20})
  $hd += '<w:r><w:tab/></w:r>'
  $hd += (Run $meta.headerDer @{font=$script:HEADFONT; size=7.5; color=$script:DK.muted; spacing=20})
  $hd += '</w:p></w:hdr>'
  W 'word\header1.xml' $hd

  $ft = $HDR + '<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
  $ft += '<w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="9300"/></w:tabs><w:spacing w:before="60" w:after="0"/></w:pPr>'
  $ft += (Run $meta.footerIzq @{font=$script:HEADFONT; size=7.5; color=$script:DK.muted})
  $ft += '<w:r><w:tab/></w:r>'
  $ft += '<w:r><w:rPr><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/><w:b/><w:color w:val="' + $script:DK.navy + '"/><w:sz w:val="17"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>'
  $ft += '<w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>'
  $ft += '<w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>'
  $ft += '</w:p></w:ftr>'
  W 'word\footer1.xml' $ft

  # ---- styles.xml ----
  $sy = $HDR + '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
  $sy += '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="' + $script:BODYFONT + '" w:hAnsi="' + $script:BODYFONT + '" w:eastAsia="' + $script:BODYFONT + '" w:cs="' + $script:BODYFONT + '"/>'
  $sy += '<w:color w:val="' + $script:DK.ink + '"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="es-ES"/></w:rPr></w:rPrDefault>'
  $sy += '<w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
  $sy += '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
  $lvls = @(
    @{id='Heading1'; name='heading 1'; out=0; sz=40; col=$script:DK.ink},
    @{id='Heading2'; name='heading 2'; out=1; sz=27; col=$script:DK.navy},
    @{id='Heading3'; name='heading 3'; out=2; sz=22; col=$script:DK.ink2},
    @{id='Heading4'; name='heading 4'; out=3; sz=20; col=$script:DK.teal}
  )
  foreach ($l in $lvls) {
    $sy += '<w:style w:type="paragraph" w:styleId="' + $l.id + '"><w:name w:val="' + $l.name + '"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>'
    $sy += '<w:pPr><w:keepNext/><w:keepLines/><w:outlineLvl w:val="' + $l.out + '"/></w:pPr>'
    $sy += '<w:rPr><w:rFonts w:ascii="' + $script:HEADFONT + '" w:hAnsi="' + $script:HEADFONT + '"/><w:b/><w:color w:val="' + $l.col + '"/><w:sz w:val="' + $l.sz + '"/></w:rPr></w:style>'
  }
  foreach ($i in 1..3) {
    $sy += '<w:style w:type="paragraph" w:styleId="TOC' + $i + '"><w:name w:val="toc ' + $i + '"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/>'
    $sy += '<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9300"/></w:tabs><w:spacing w:after="' + (60 - ($i-1)*20) + '" w:line="240" w:lineRule="auto"/><w:ind w:left="' + (($i-1)*280) + '"/></w:pPr>'
    if ($i -eq 1) { $sy += '<w:rPr><w:rFonts w:ascii="' + $script:HEADFONT + '" w:hAnsi="' + $script:HEADFONT + '"/><w:b/><w:color w:val="' + $script:DK.navy + '"/><w:sz w:val="19"/></w:rPr>' }
    else { $sy += '<w:rPr><w:rFonts w:ascii="' + $script:HEADFONT + '" w:hAnsi="' + $script:HEADFONT + '"/><w:color w:val="' + $script:DK.ink2 + '"/><w:sz w:val="18"/></w:rPr>' }
    $sy += '</w:style>'
  }
  $sy += '<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:rPr><w:color w:val="' + $script:DK.teal + '"/><w:u w:val="single"/></w:rPr></w:style>'
  $sy += '<w:style w:type="table" w:styleId="TablaInforme"><w:name w:val="Tabla Informe"/><w:tblPr/></w:style>'
  $sy += '</w:styles>'
  W 'word\styles.xml' $sy

  # ---- document.xml ----
  $ns = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
  $ns += 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
  $ns += 'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
  $ns += 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
  $ns += 'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"'
  $sect = '<w:sectPr><w:headerReference w:type="default" r:id="rId4"/><w:footerReference w:type="default" r:id="rId5"/>'
  $sect += '<w:pgSz w:w="11906" w:h="16838"/>'
  $sect += '<w:pgMar w:top="1418" w:right="1247" w:bottom="1418" w:left="1247" w:header="680" w:footer="680" w:gutter="0"/>'
  $sect += '<w:titlePg/><w:docGrid w:linePitch="360"/></w:sectPr>'
  $dx = $HDR + '<w:document ' + $ns + '><w:body>' + $doc.Body.ToString() + $sect + '</w:body></w:document>'
  W 'word\document.xml' $dx

  if (Test-Path $outPath) { Remove-Item $outPath -Force }
  [System.IO.Compression.ZipFile]::CreateFromDirectory($tmp, $outPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
  Remove-Item -Recurse -Force $tmp
  return $outPath
}
