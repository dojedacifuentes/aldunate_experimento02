# ============================================================
#  ChartEngine.ps1 - Motor de graficos PNG con System.Drawing
#  Informe: Transformacion de la ensenanza universitaria e IA
#  Sin dependencias externas. Windows PowerShell 5.1.
# ============================================================
Add-Type -AssemblyName System.Drawing

$script:SCALE = 2.5   # supersampling para nitidez en Word/PDF

function C([string]$hex) {
  $hex = $hex.TrimStart('#')
  return [System.Drawing.Color]::FromArgb(255,
    [Convert]::ToInt32($hex.Substring(0,2),16),
    [Convert]::ToInt32($hex.Substring(2,2),16),
    [Convert]::ToInt32($hex.Substring(4,2),16))
}
function CA([string]$hex, [int]$alpha) {
  $hex = $hex.TrimStart('#')
  return [System.Drawing.Color]::FromArgb($alpha,
    [Convert]::ToInt32($hex.Substring(0,2),16),
    [Convert]::ToInt32($hex.Substring(2,2),16),
    [Convert]::ToInt32($hex.Substring(4,2),16))
}

$script:PAL = @{
  ink   = '#101720'; ink2  = '#3A4654'; muted = '#7A8796'; faint = '#C3CCD6'
  rule  = '#E4E9EE'; paper = '#FFFFFF'; panel = '#F6F8FA'
  navy  = '#1B3A5C'; teal  = '#2F7D8C'; ochre = '#C08A2E'; brick = '#A34A3C'
  sage  = '#5F8560'; plum  = '#6B4A72'; steel = '#7C8A99'; sky   = '#5D8FBF'
}
$script:SERIES = @('#1B3A5C','#C08A2E','#2F7D8C','#A34A3C','#5F8560','#6B4A72','#5D8FBF','#7C8A99')

function Fnt([string]$family,[single]$size,[string]$style) {
  $st = [System.Drawing.FontStyle]::Regular
  if ($style -eq 'bold') { $st = [System.Drawing.FontStyle]::Bold }
  if ($style -eq 'italic') { $st = [System.Drawing.FontStyle]::Italic }
  try { $f = New-Object System.Drawing.Font($family, ($size * $script:SCALE), $st, [System.Drawing.GraphicsUnit]::Pixel) }
  catch { $f = New-Object System.Drawing.Font('Arial', ($size * $script:SCALE), $st, [System.Drawing.GraphicsUnit]::Pixel) }
  return $f
}
function FSans([single]$s,[string]$st='regular') { return Fnt 'Segoe UI' $s $st }
function FSerif([single]$s,[string]$st='regular') { return Fnt 'Georgia' $s $st }

function NewCanvas([int]$w,[int]$h) {
  $W = [int]($w * $script:SCALE); $H = [int]($h * $script:SCALE)
  $bmp = New-Object System.Drawing.Bitmap($W,$H,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bmp.SetResolution(220,220)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear((C $script:PAL.paper))
  return @{ bmp=$bmp; g=$g; W=$W; H=$H }
}

function SaveCanvas($cv,[string]$path) {
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
  $cv.g.Dispose()
  $cv.bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $cv.bmp.Dispose()
  return $path
}

function DrawText($g,[string]$txt,$font,[string]$hex,[single]$x,[single]$y,[string]$align='left') {
  if ([string]::IsNullOrEmpty($txt)) { return }
  $br = New-Object System.Drawing.SolidBrush((C $hex))
  $sf = New-Object System.Drawing.StringFormat
  $sf.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap
  if ($align -eq 'center') { $sf.Alignment = [System.Drawing.StringAlignment]::Center }
  if ($align -eq 'right')  { $sf.Alignment = [System.Drawing.StringAlignment]::Far }
  $g.DrawString($txt,$font,$br,($x*$script:SCALE),($y*$script:SCALE),$sf)
  $br.Dispose(); $sf.Dispose()
}
function MeasureW($g,[string]$txt,$font) {
  if ([string]::IsNullOrEmpty($txt)) { return 0 }
  return ($g.MeasureString($txt,$font)).Width / $script:SCALE
}
function DrawTextWrapped($g,[string]$txt,$font,[string]$hex,[single]$x,[single]$y,[single]$w,[string]$align='left') {
  if ([string]::IsNullOrEmpty($txt)) { return }
  $br = New-Object System.Drawing.SolidBrush((C $hex))
  $sf = New-Object System.Drawing.StringFormat
  if ($align -eq 'center') { $sf.Alignment = [System.Drawing.StringAlignment]::Center }
  if ($align -eq 'right')  { $sf.Alignment = [System.Drawing.StringAlignment]::Far }
  $rect = New-Object System.Drawing.RectangleF(($x*$script:SCALE),($y*$script:SCALE),($w*$script:SCALE),9999)
  $g.DrawString($txt,$font,$br,$rect,$sf)
  $br.Dispose(); $sf.Dispose()
}
function TextH($g,[string]$txt,$font,[single]$w) {
  if ([string]::IsNullOrEmpty($txt)) { return 0 }
  $sz = $g.MeasureString($txt,$font,[int]($w*$script:SCALE))
  return $sz.Height / $script:SCALE
}
function FillRect($g,[string]$hex,[int]$alpha,[single]$x,[single]$y,[single]$w,[single]$h) {
  if ($w -le 0 -or $h -le 0) { return }
  $br = New-Object System.Drawing.SolidBrush((CA $hex $alpha))
  $g.FillRectangle($br,($x*$script:SCALE),($y*$script:SCALE),($w*$script:SCALE),($h*$script:SCALE))
  $br.Dispose()
}
function LineSeg($g,[string]$hex,[single]$wpx,[single]$x1,[single]$y1,[single]$x2,[single]$y2,[int]$alpha=255,[bool]$dash=$false) {
  $pen = New-Object System.Drawing.Pen((CA $hex $alpha),($wpx*$script:SCALE))
  if ($dash) { $pen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash }
  $pen.StartCap=[System.Drawing.Drawing2D.LineCap]::Round; $pen.EndCap=[System.Drawing.Drawing2D.LineCap]::Round
  $g.DrawLine($pen,($x1*$script:SCALE),($y1*$script:SCALE),($x2*$script:SCALE),($y2*$script:SCALE))
  $pen.Dispose()
}
function Dot($g,[string]$hex,[single]$cx,[single]$cy,[single]$r,[int]$alpha=255) {
  $br = New-Object System.Drawing.SolidBrush((CA $hex $alpha))
  $g.FillEllipse($br,(($cx-$r)*$script:SCALE),(($cy-$r)*$script:SCALE),(2*$r*$script:SCALE),(2*$r*$script:SCALE))
  $br.Dispose()
}
function RingDot($g,[string]$fill,[string]$stroke,[single]$cx,[single]$cy,[single]$r,[single]$sw=1.6) {
  Dot $g $fill $cx $cy $r 255
  $pen = New-Object System.Drawing.Pen((C $stroke),($sw*$script:SCALE))
  $g.DrawEllipse($pen,(($cx-$r)*$script:SCALE),(($cy-$r)*$script:SCALE),(2*$r*$script:SCALE),(2*$r*$script:SCALE))
  $pen.Dispose()
}

function NiceMax([double]$m) {
  if ($m -le 0) { return 1 }
  $exp = [Math]::Floor([Math]::Log10($m)); $p = [Math]::Pow(10,$exp); $f = $m / $p
  if ($f -le 1) { $n = 1 } elseif ($f -le 2) { $n = 2 } elseif ($f -le 2.5) { $n = 2.5 } elseif ($f -le 5) { $n = 5 } else { $n = 10 }
  return $n * $p
}
function FmtNum([double]$v) {
  $ci = [Globalization.CultureInfo]::GetCultureInfo('es-ES')
  if ([Math]::Abs($v - [Math]::Round($v)) -lt 0.0005) { return ([int][Math]::Round($v)).ToString('N0',$ci) }
  return $v.ToString('0.##',$ci)
}

function DrawHeader($cv,$spec,[single]$x,[single]$w) {
  $g=$cv.g; $y = 20
  if ($spec.kicker) {
    DrawText $g ($spec.kicker.ToUpper()) (FSans 8.2 'bold') $script:PAL.teal $x $y
    $y += 15
  }
  $ft = FSerif 15.5 'bold'
  DrawTextWrapped $g $spec.titulo $ft $script:PAL.ink $x $y $w
  $y += (TextH $g $spec.titulo $ft $w) + 3
  if ($spec.subtitulo) {
    $fs = FSans 9.4
    DrawTextWrapped $g $spec.subtitulo $fs $script:PAL.ink2 $x $y $w
    $y += (TextH $g $spec.subtitulo $fs $w) + 5
  }
  LineSeg $g $script:PAL.navy 2 $x $y ($x+42) $y 255
  return ($y + 18)
}
function DrawFooter($cv,$spec,[single]$x,[single]$w) {
  $g=$cv.g; $H = $cv.H / $script:SCALE
  $fs = FSans 7.5
  $fh = TextH $g $spec.fuente $fs $w
  $y = $H - 10 - $fh
  if ($spec.advertencia) {
    $fa = FSans 7.6 'italic'
    $ah = TextH $g $spec.advertencia $fa $w
    DrawTextWrapped $g ([char]0x26A0 + "  " + $spec.advertencia) $fa $script:PAL.brick $x ($y-$ah-8) $w
  }
  LineSeg $g $script:PAL.rule 1 $x ($y-4) ($x+$w) ($y-4) 255
  DrawTextWrapped $g $spec.fuente $fs $script:PAL.muted $x $y $w
}
function FooterTop($cv,$spec,[single]$w) {
  $g=$cv.g; $H = $cv.H / $script:SCALE
  $fh = TextH $g $spec.fuente (FSans 7.5) $w
  $t = $H - 10 - $fh - 10
  if ($spec.advertencia) { $t = $t - (TextH $g $spec.advertencia (FSans 7.6 'italic') $w) - 8 }
  return $t
}

# ============================================================
#  TIPOS DE GRAFICO
# ============================================================

function Chart-Bars($spec,[string]$out,[bool]$horizontal=$false) {
  $w = 880; $h = 520
  if ($spec.alto) { $h = [int]$spec.alto }
  $cv = NewCanvas $w $h; $g = $cv.g
  $M = 48; $plotW = $w - 2*$M
  $top = DrawHeader $cv $spec $M $plotW
  $data = @($spec.datos)
  $series = @($data | ForEach-Object { $_.serie } | Where-Object { $_ } | Select-Object -Unique)
  if ($series.Count -eq 0) {
    $series = @('')
    foreach ($d in $data) { if (-not $d.PSObject.Properties['serie']) { $d | Add-Member -NotePropertyName serie -NotePropertyValue '' -Force } else { $d.serie = '' } }
  }
  $cats = @($data | ForEach-Object { $_.etiqueta } | Select-Object -Unique)
  if ($series.Count -gt 1) {
    $lx = $M
    for ($i=0; $i -lt $series.Count; $i++) {
      $col = $script:SERIES[$i % $script:SERIES.Count]
      FillRect $g $col 255 $lx ($top+3) 9 9
      DrawText $g $series[$i] (FSans 8.6) $script:PAL.ink2 ($lx+13) $top
      $lx += 13 + (MeasureW $g $series[$i] (FSans 8.6)) + 20
    }
    $top += 26
  }
  $fTop = FooterTop $cv $spec $plotW
  $vals = @($data | ForEach-Object { [double]$_.valor })
  $maxV = ($vals | Measure-Object -Maximum).Maximum
  $minV = ($vals | Measure-Object -Minimum).Minimum
  if ($minV -gt 0) { $minV = 0 }
  $axMax = NiceMax $maxV
  if ($spec.max) { $axMax = [double]$spec.max }
  $axMin = 0
  if ($minV -lt 0) { $axMin = -1 * (NiceMax ([Math]::Abs($minV))) }

  if (-not $horizontal) {
    $py0 = $top + 8; $py1 = $fTop - 26
    $labelFont = FSans 8.4
    $maxLbl = 0
    foreach ($c in $cats) { $mw = MeasureW $g $c $labelFont; if ($mw -gt $maxLbl) { $maxLbl = $mw } }
    $slotW = $plotW / [Math]::Max($cats.Count,1)
    $rotate = ($maxLbl -gt ($slotW - 6))
    if ($rotate) { $py1 = $py1 - 40 }
    $ph = $py1 - $py0
    $zeroY = $py1
    if ($axMin -lt 0) { $zeroY = $py1 - ($ph * (0 - $axMin) / ($axMax - $axMin)) }
    for ($t=0; $t -le 5; $t++) {
      $v = $axMin + ($axMax-$axMin) * $t / 5
      $yy = $py1 - $ph * ($v - $axMin) / ($axMax - $axMin)
      LineSeg $g $script:PAL.rule 1 $M $yy ($M+$plotW) $yy
      DrawText $g (FmtNum $v) (FSans 7.8) $script:PAL.muted ($M-7) ($yy-7) 'right'
    }
    if ($spec.unidad) { DrawText $g $spec.unidad (FSans 7.8 'bold') $script:PAL.muted $M ($py0-15) }
    $gap = [Math]::Min(20, $slotW*0.24)
    $bandW = $slotW - $gap
    $maxBand = 78 * [Math]::Max($series.Count,1)
    if ($bandW -gt $maxBand) { $bandW = $maxBand }
    $bw = $bandW / [Math]::Max($series.Count,1)
    for ($ci=0; $ci -lt $cats.Count; $ci++) {
      $bx0 = $M + $ci*$slotW + ($slotW - $bandW)/2
      for ($si=0; $si -lt $series.Count; $si++) {
        $row = $data | Where-Object { $_.etiqueta -eq $cats[$ci] -and $_.serie -eq $series[$si] } | Select-Object -First 1
        if (-not $row) { continue }
        $v = [double]$row.valor
        $col = $script:SERIES[$si % $script:SERIES.Count]
        if ($spec.colores -and $series.Count -le 1) { $col = $spec.colores[$ci % $spec.colores.Count] }
        $yv = $py1 - $ph * ($v - $axMin) / ($axMax - $axMin)
        $bx = $bx0 + $si*$bw
        $bh = $zeroY - $yv
        if ($bh -ge 0) { FillRect $g $col 232 ($bx+1) $yv ($bw-2) $bh }
        else { FillRect $g $col 232 ($bx+1) $zeroY ($bw-2) (-$bh) }
        $lbl = (FmtNum $v); if ($spec.sufijo) { $lbl = $lbl + $spec.sufijo }
        $ly = $yv - 16
        if ($bh -lt 0) { $ly = $yv + 3 }
        DrawText $g $lbl (FSans 8.5 'bold') $script:PAL.ink ($bx + $bw/2) $ly 'center'
      }
      if ($rotate) {
        $st = $g.Save()
        $g.TranslateTransform((($M + $ci*$slotW + $slotW/2 + 6)*$script:SCALE), (($py1+9)*$script:SCALE))
        $g.RotateTransform(-30)
        $sf = New-Object System.Drawing.StringFormat; $sf.Alignment=[System.Drawing.StringAlignment]::Far
        $br = New-Object System.Drawing.SolidBrush((C $script:PAL.ink2))
        $g.DrawString($cats[$ci],$labelFont,$br,0,0,$sf)
        $br.Dispose(); $sf.Dispose(); $g.Restore($st)
      } else {
        DrawTextWrapped $g $cats[$ci] $labelFont $script:PAL.ink2 ($M + $ci*$slotW) ($py1+8) $slotW 'center'
      }
    }
    LineSeg $g $script:PAL.ink2 1.2 $M $zeroY ($M+$plotW) $zeroY
  } else {
    $labelFont = FSans 9
    $maxLbl = 0
    foreach ($c in $cats) { $mw = MeasureW $g $c $labelFont; if ($mw -gt $maxLbl) { $maxLbl = $mw } }
    if ($maxLbl -gt 260) { $maxLbl = 260 }
    $lx = $M + $maxLbl + 14
    $barMaxW = ($w - $M) - $lx - 62
    $py0 = $top + 6
    $avail = $fTop - $py0 - 6
    $slotH = $avail / [Math]::Max($cats.Count,1)
    $bh = [Math]::Min($slotH*0.60, 26)
    for ($ci=0; $ci -lt $cats.Count; $ci++) {
      $yy = $py0 + $ci*$slotH + ($slotH-$bh)/2
      DrawTextWrapped $g $cats[$ci] $labelFont $script:PAL.ink $M ($yy + $bh/2 - 8) $maxLbl 'right'
      $row = $data | Where-Object { $_.etiqueta -eq $cats[$ci] } | Select-Object -First 1
      $v = [double]$row.valor
      $bwid = $barMaxW * $v / $axMax
      $col = $script:SERIES[0]
      if ($spec.colores) { $col = $spec.colores[$ci % $spec.colores.Count] }
      if ($row.serie) { $col = $row.serie }
      FillRect $g $script:PAL.rule 110 $lx $yy $barMaxW $bh
      FillRect $g $col 235 $lx $yy $bwid $bh
      $lbl = (FmtNum $v); if ($spec.sufijo) { $lbl = $lbl + $spec.sufijo }
      DrawText $g $lbl (FSans 8.9 'bold') $script:PAL.ink ($lx+$bwid+8) ($yy + $bh/2 - 9)
      if ($row.nota) { DrawText $g $row.nota (FSans 7.3) $script:PAL.muted ($lx+3) ($yy+$bh+0.5) }
    }
  }
  DrawFooter $cv $spec $M $plotW
  return SaveCanvas $cv $out
}

function Chart-Lines($spec,[string]$out,[bool]$area=$false) {
  $w = 880; $h = 500
  if ($spec.alto) { $h = [int]$spec.alto }
  $cv = NewCanvas $w $h; $g = $cv.g
  $M = 54; $plotW = $w - 2*$M
  $top = DrawHeader $cv $spec $M $plotW
  $data = @($spec.datos)
  $series = @($data | ForEach-Object { $_.serie } | Where-Object { $_ } | Select-Object -Unique)
  if ($series.Count -eq 0) {
    $series=@('')
    foreach ($d in $data) { if (-not $d.PSObject.Properties['serie']) { $d | Add-Member -NotePropertyName serie -NotePropertyValue '' -Force } else { $d.serie='' } }
  }
  $cats = @($data | ForEach-Object { $_.etiqueta } | Select-Object -Unique)
  if ($series.Count -gt 1) {
    $lx = $M
    for ($i=0; $i -lt $series.Count; $i++) {
      $col = $script:SERIES[$i % $script:SERIES.Count]
      LineSeg $g $col 2.6 $lx ($top+7) ($lx+16) ($top+7)
      Dot $g $col ($lx+8) ($top+7) 3.4
      DrawText $g $series[$i] (FSans 8.6) $script:PAL.ink2 ($lx+21) $top
      $lx += 21 + (MeasureW $g $series[$i] (FSans 8.6)) + 22
    }
    $top += 26
  }
  $fTop = FooterTop $cv $spec $plotW
  $py0 = $top + 8; $py1 = $fTop - 26; $ph = $py1-$py0
  $maxV = ($data | ForEach-Object { [double]$_.valor } | Measure-Object -Maximum).Maximum
  $axMax = NiceMax $maxV; if ($spec.max) { $axMax = [double]$spec.max }
  for ($t=0; $t -le 5; $t++) {
    $v = $axMax * $t / 5; $yy = $py1 - $ph*$v/$axMax
    LineSeg $g $script:PAL.rule 1 $M $yy ($M+$plotW) $yy
    DrawText $g (FmtNum $v) (FSans 7.8) $script:PAL.muted ($M-7) ($yy-7) 'right'
  }
  if ($spec.unidad) { DrawText $g $spec.unidad (FSans 7.8 'bold') $script:PAL.muted $M ($py0-15) }
  $stepX = $plotW / [Math]::Max(($cats.Count-1),1)
  for ($si=0; $si -lt $series.Count; $si++) {
    $col = $script:SERIES[$si % $script:SERIES.Count]
    $pts = @()
    for ($ci=0; $ci -lt $cats.Count; $ci++) {
      $row = $data | Where-Object { $_.etiqueta -eq $cats[$ci] -and $_.serie -eq $series[$si] } | Select-Object -First 1
      if (-not $row) { continue }
      $v = [double]$row.valor
      $pts += ,@(($M + $ci*$stepX), ($py1 - $ph*$v/$axMax), $v)
    }
    if ($area -and $pts.Count -gt 1) {
      $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
      $poly = @()
      foreach ($p in $pts) { $poly += (New-Object System.Drawing.PointF(($p[0]*$script:SCALE),($p[1]*$script:SCALE))) }
      $poly += (New-Object System.Drawing.PointF(($pts[$pts.Count-1][0]*$script:SCALE),($py1*$script:SCALE)))
      $poly += (New-Object System.Drawing.PointF(($pts[0][0]*$script:SCALE),($py1*$script:SCALE)))
      $gp.AddPolygon([System.Drawing.PointF[]]$poly)
      $br = New-Object System.Drawing.SolidBrush((CA $col 36)); $g.FillPath($br,$gp); $br.Dispose(); $gp.Dispose()
    }
    for ($i=0; $i -lt ($pts.Count-1); $i++) { LineSeg $g $col 2.8 $pts[$i][0] $pts[$i][1] $pts[$i+1][0] $pts[$i+1][1] }
    foreach ($p in $pts) {
      RingDot $g $script:PAL.paper $col $p[0] $p[1] 4.2 2.2
      $lbl = (FmtNum $p[2]); if ($spec.sufijo) { $lbl = $lbl+$spec.sufijo }
      $lw = MeasureW $g $lbl (FSans 8)
      $lx2 = $p[0]
      if (($lx2 - $lw/2) -lt $M) { $lx2 = $M + $lw/2 }
      if (($lx2 + $lw/2) -gt ($M+$plotW)) { $lx2 = $M + $plotW - $lw/2 }
      DrawText $g $lbl (FSans 8) $script:PAL.ink2 $lx2 ($p[1]-20) 'center'
    }
  }
  for ($ci=0; $ci -lt $cats.Count; $ci++) {
    DrawTextWrapped $g $cats[$ci] (FSans 8.4) $script:PAL.ink2 ($M+$ci*$stepX-$stepX/2) ($py1+9) $stepX 'center'
  }
  LineSeg $g $script:PAL.ink2 1.2 $M $py1 ($M+$plotW) $py1
  DrawFooter $cv $spec $M $plotW
  return SaveCanvas $cv $out
}

function Chart-Dumbbell($spec,[string]$out) {
  $w=880; $h=520; if ($spec.alto) { $h=[int]$spec.alto }
  $cv = NewCanvas $w $h; $g=$cv.g
  $M=48; $plotW=$w-2*$M
  $top = DrawHeader $cv $spec $M $plotW
  $data=@($spec.datos)
  $series=@($data | ForEach-Object { $_.serie } | Select-Object -Unique)
  $cats=@($data | ForEach-Object { $_.etiqueta } | Select-Object -Unique)
  $lx=$M
  for ($i=0;$i -lt $series.Count;$i++){
    $col=$script:SERIES[$i % $script:SERIES.Count]
    Dot $g $col ($lx+5) ($top+5) 5
    DrawText $g $series[$i] (FSans 8.6) $script:PAL.ink2 ($lx+14) $top
    $lx += 14 + (MeasureW $g $series[$i] (FSans 8.6)) + 22
  }
  $top += 26
  $labelFont = FSans 9
  $maxLbl=0; foreach($c in $cats){ $mw=MeasureW $g $c $labelFont; if($mw -gt $maxLbl){$maxLbl=$mw} }
  if ($maxLbl -gt 240) { $maxLbl=240 }
  $ax0=$M+$maxLbl+16; $axW=($w-$M)-$ax0-52
  $maxV=($data | ForEach-Object {[double]$_.valor} | Measure-Object -Maximum).Maximum
  $axMax = NiceMax $maxV; if ($spec.max) { $axMax=[double]$spec.max }
  $fTop = FooterTop $cv $spec $plotW
  $py0=$top+8; $avail=$fTop-$py0-20; $slotH=$avail/[Math]::Max($cats.Count,1)
  for ($t=0;$t -le 5;$t++){
    $v=$axMax*$t/5; $xx=$ax0+$axW*$v/$axMax
    LineSeg $g $script:PAL.rule 1 $xx $py0 $xx ($py0+$avail)
    DrawText $g ((FmtNum $v)+$spec.sufijo) (FSans 7.8) $script:PAL.muted $xx ($py0+$avail+5) 'center'
  }
  for ($ci=0;$ci -lt $cats.Count;$ci++){
    $yy=$py0+$ci*$slotH+$slotH/2
    DrawTextWrapped $g $cats[$ci] $labelFont $script:PAL.ink $M ($yy-8) $maxLbl 'right'
    $vals=@()
    for ($si=0;$si -lt $series.Count;$si++){
      $row=$data | Where-Object { $_.etiqueta -eq $cats[$ci] -and $_.serie -eq $series[$si] } | Select-Object -First 1
      if ($row) { $vals += ,@([double]$row.valor,$script:SERIES[$si % $script:SERIES.Count]) }
    }
    if ($vals.Count -ge 2) {
      $x1=$ax0+$axW*$vals[0][0]/$axMax; $x2=$ax0+$axW*$vals[1][0]/$axMax
      LineSeg $g $script:PAL.steel 2.4 $x1 $yy $x2 $yy 150
    }
    foreach ($v in $vals) {
      $xx=$ax0+$axW*$v[0]/$axMax
      RingDot $g $v[1] $script:PAL.paper $xx $yy 5.6 1.8
    }
    if ($vals.Count -ge 2) {
      $d = $vals[1][0]-$vals[0][0]
      $sgn=''; if ($d -gt 0) { $sgn='+' }
      $xm=[Math]::Max(($ax0+$axW*$vals[0][0]/$axMax),($ax0+$axW*$vals[1][0]/$axMax))
      DrawText $g ($sgn+(FmtNum $d)+$spec.sufijo) (FSans 8.2 'bold') $script:PAL.ink2 ($xm+10) ($yy-8)
    }
  }
  DrawFooter $cv $spec $M $plotW
  return SaveCanvas $cv $out
}

function Chart-Heatmap($spec,[string]$out) {
  $w=900; $h=560; if ($spec.alto){$h=[int]$spec.alto}
  $cv=NewCanvas $w $h; $g=$cv.g
  $M=48; $plotW=$w-2*$M
  $top = DrawHeader $cv $spec $M $plotW
  $data=@($spec.datos)
  $rows=@($data | ForEach-Object { $_.etiqueta } | Select-Object -Unique)
  $cols=@($data | ForEach-Object { $_.serie } | Select-Object -Unique)
  $labelFont=FSans 8.7
  $maxLbl=0; foreach($r in $rows){ $mw=MeasureW $g $r $labelFont; if($mw -gt $maxLbl){$maxLbl=$mw} }
  if ($maxLbl -gt 245){$maxLbl=245}
  $gx=$M+$maxLbl+12
  $fTop = FooterTop $cv $spec $plotW
  $gy=$top+56
  $gw=($w-$M)-$gx; $gh=$fTop-$gy-30
  $cw=$gw/[Math]::Max($cols.Count,1); $ch=$gh/[Math]::Max($rows.Count,1)
  $maxV=5.0; if ($spec.max){$maxV=[double]$spec.max}
  for ($cj=0;$cj -lt $cols.Count;$cj++){
    $st=$g.Save()
    $g.TranslateTransform((($gx+$cj*$cw+$cw/2)*$script:SCALE),(($gy-8)*$script:SCALE))
    $g.RotateTransform(-40)
    $sf=New-Object System.Drawing.StringFormat
    $br=New-Object System.Drawing.SolidBrush((C $script:PAL.ink2))
    $g.DrawString($cols[$cj],(FSans 8.3 'bold'),$br,0,0,$sf)
    $br.Dispose();$sf.Dispose();$g.Restore($st)
  }
  for ($ri=0;$ri -lt $rows.Count;$ri++){
    $yy=$gy+$ri*$ch
    DrawTextWrapped $g $rows[$ri] $labelFont $script:PAL.ink $M ($yy+$ch/2-8) $maxLbl 'right'
    for ($cj=0;$cj -lt $cols.Count;$cj++){
      $row=$data | Where-Object { $_.etiqueta -eq $rows[$ri] -and $_.serie -eq $cols[$cj] } | Select-Object -First 1
      $xx=$gx+$cj*$cw
      if ($row) {
        $v=[double]$row.valor
        $t=$v/$maxV; if($t -lt 0){$t=0}; if($t -gt 1){$t=1}
        $alpha=[int](24 + 216*$t)
        FillRect $g $script:PAL.navy $alpha ($xx+1.5) ($yy+1.5) ($cw-3) ($ch-3)
        $tc=$script:PAL.ink; if ($t -gt 0.55) { $tc='#FFFFFF' }
        DrawText $g (FmtNum $v) (FSans 9.6 'bold') $tc ($xx+$cw/2) ($yy+$ch/2-9) 'center'
      } else {
        FillRect $g $script:PAL.panel 255 ($xx+1.5) ($yy+1.5) ($cw-3) ($ch-3)
        DrawText $g '-' (FSans 9) $script:PAL.faint ($xx+$cw/2) ($yy+$ch/2-8) 'center'
      }
    }
  }
  $sx=$gx; $sy=$gy+$gh+10
  DrawText $g 'Escala 0-5' (FSans 7.5) $script:PAL.muted $sx ($sy-1)
  $sx += 56
  for ($k=0;$k -le 5;$k++){
    $alpha=[int](24+216*($k/5.0))
    FillRect $g $script:PAL.navy $alpha ($sx+$k*24) $sy 20 10
    DrawText $g "$k" (FSans 7) $script:PAL.muted ($sx+$k*24+10) ($sy+11) 'center'
  }
  DrawFooter $cv $spec $M $plotW
  return SaveCanvas $cv $out
}

function Chart-Timeline($spec,[string]$out) {
  $w=900
  $data=@($spec.datos)
  $probe = NewCanvas 10 10
  $slot = 30
  $textW = $w - 48 - ($w*0) - 168
  foreach ($d in $data) {
    $th = TextH $probe.g $d.serie (FSans 9.1) $textW
    if (($th + 16) -gt $slot) { $slot = $th + 16 }
  }
  $probe.g.Dispose(); $probe.bmp.Dispose()
  $h = 152 + [int]($data.Count*$slot)
  if ($spec.alto){$h=[int]$spec.alto}
  $cv=NewCanvas $w $h; $g=$cv.g
  $M=48; $plotW=$w-2*$M
  $top = DrawHeader $cv $spec $M $plotW
  $axisX=$M+104
  $y0=$top+12
  LineSeg $g $script:PAL.faint 2 $axisX $y0 $axisX ($y0+$slot*($data.Count-1)+10) 255
  for ($i=0;$i -lt $data.Count;$i++){
    $d=$data[$i]
    $yy=$y0+$i*$slot+6
    $col=$script:SERIES[0]
    if ($d.nota -eq 'retroceso') { $col=$script:PAL.brick }
    if ($d.nota -eq 'evidencia') { $col=$script:PAL.teal }
    if ($d.nota -eq 'norma')     { $col=$script:PAL.ochre }
    DrawText $g $d.etiqueta (FSans 8.5 'bold') $script:PAL.ink2 ($axisX-14) ($yy-7) 'right'
    RingDot $g $col $script:PAL.paper $axisX $yy 5.2 2
    DrawTextWrapped $g $d.serie (FSans 9.1) $script:PAL.ink ($axisX+16) ($yy-10) ($w-$M-$axisX-20)
  }
  DrawFooter $cv $spec $M $plotW
  return SaveCanvas $cv $out
}

function Chart-Matrix2x2($spec,[string]$out) {
  $w=840; $h=650; if($spec.alto){$h=[int]$spec.alto}
  $cv=NewCanvas $w $h; $g=$cv.g
  $M=48; $plotW=$w-2*$M
  $top=DrawHeader $cv $spec $M $plotW
  $fTop = FooterTop $cv $spec $plotW
  $gx=$M+64; $gy=$top+14; $gw=($w-$M)-$gx-12; $gh=$fTop-$gy-26
  FillRect $g $script:PAL.panel 255 $gx $gy $gw $gh
  LineSeg $g $script:PAL.faint 1.4 ($gx+$gw/2) $gy ($gx+$gw/2) ($gy+$gh)
  LineSeg $g $script:PAL.faint 1.4 $gx ($gy+$gh/2) ($gx+$gw) ($gy+$gh/2)
  if ($spec.cuadrantes) {
    $q=@($spec.cuadrantes)
    DrawTextWrapped $g $q[0] (FSans 8.1 'bold') $script:PAL.muted ($gx+10) ($gy+9) ($gw/2-22)
    DrawTextWrapped $g $q[1] (FSans 8.1 'bold') $script:PAL.muted ($gx+$gw/2+10) ($gy+9) ($gw/2-22)
    DrawTextWrapped $g $q[2] (FSans 8.1 'bold') $script:PAL.muted ($gx+10) ($gy+$gh-26) ($gw/2-22)
    DrawTextWrapped $g $q[3] (FSans 8.1 'bold') $script:PAL.muted ($gx+$gw/2+10) ($gy+$gh-26) ($gw/2-22)
  }
  foreach ($d in @($spec.datos)) {
    $px=$gx+$gw*([double]$d.valor)/100.0
    $py=$gy+$gh*(1-([double]$d.y)/100.0)
    $col=$script:SERIES[0]
    if ($d.nota) { $col = $d.nota }
    RingDot $g $col $script:PAL.paper $px $py 6.4 2
    $lw = MeasureW $g $d.etiqueta (FSans 8.3 'bold')
    if (($px + 10 + $lw) -gt ($gx + $gw - 4)) {
      DrawText $g $d.etiqueta (FSans 8.3 'bold') $script:PAL.ink ($px-10) ($py-8) 'right'
    } else {
      DrawText $g $d.etiqueta (FSans 8.3 'bold') $script:PAL.ink ($px+10) ($py-8)
    }
  }
  DrawText $g $spec.ejeX (FSans 8.6 'bold') $script:PAL.ink2 ($gx+$gw/2) ($gy+$gh+8) 'center'
  $st=$g.Save()
  $g.TranslateTransform((($gx-18)*$script:SCALE),(($gy+$gh/2)*$script:SCALE)); $g.RotateTransform(-90)
  $sf=New-Object System.Drawing.StringFormat; $sf.Alignment=[System.Drawing.StringAlignment]::Center
  $br=New-Object System.Drawing.SolidBrush((C $script:PAL.ink2))
  $g.DrawString($spec.ejeY,(FSans 8.6 'bold'),$br,0,0,$sf)
  $br.Dispose();$sf.Dispose();$g.Restore($st)
  DrawFooter $cv $spec $M $plotW
  return SaveCanvas $cv $out
}

function Chart-Lollipop($spec,[string]$out) {
  $w=880; $h=520; if($spec.alto){$h=[int]$spec.alto}
  $cv=NewCanvas $w $h; $g=$cv.g
  $M=48; $plotW=$w-2*$M
  $top=DrawHeader $cv $spec $M $plotW
  $data=@($spec.datos)
  $labelFont=FSans 9
  $maxLbl=0; foreach($d in $data){ $mw=MeasureW $g $d.etiqueta $labelFont; if($mw -gt $maxLbl){$maxLbl=$mw} }
  if($maxLbl -gt 270){$maxLbl=270}
  $vals=@($data | ForEach-Object {[double]$_.valor})
  $maxV=($vals | Measure-Object -Maximum).Maximum
  $minV=($vals | Measure-Object -Minimum).Minimum
  $negPad = 16
  if ($minV -lt 0) { $negPad = 62 }
  $ax0=$M+$maxLbl+$negPad; $axW=($w-$M)-$ax0-62
  if ($minV -gt 0) { $minV=0 }
  $axMax=NiceMax $maxV; $axMin=0
  if ($minV -lt 0) { $axMin = -1*(NiceMax([Math]::Abs($minV))) }
  if ($spec.max) { $axMax=[double]$spec.max }
  if ($spec.min) { $axMin=[double]$spec.min }
  $fTop = FooterTop $cv $spec $plotW
  $py0=$top+8; $avail=$fTop-$py0-22; $slotH=$avail/[Math]::Max($data.Count,1)
  $zeroX=$ax0+$axW*(0-$axMin)/($axMax-$axMin)
  for ($t=0;$t -le 5;$t++){
    $v=$axMin+($axMax-$axMin)*$t/5; $xx=$ax0+$axW*($v-$axMin)/($axMax-$axMin)
    LineSeg $g $script:PAL.rule 1 $xx $py0 $xx ($py0+$avail)
    DrawText $g ((FmtNum $v)+$spec.sufijo) (FSans 7.8) $script:PAL.muted $xx ($py0+$avail+5) 'center'
  }
  LineSeg $g $script:PAL.faint 1.4 $zeroX $py0 $zeroX ($py0+$avail)
  for ($i=0;$i -lt $data.Count;$i++){
    $d=$data[$i]; $v=[double]$d.valor
    $yy=$py0+$i*$slotH+$slotH/2
    $xx=$ax0+$axW*($v-$axMin)/($axMax-$axMin)
    $col=$script:SERIES[0]
    if ($v -lt 0) { $col=$script:PAL.brick }
    if ($d.serie) { $col = $d.serie }
    DrawTextWrapped $g $d.etiqueta $labelFont $script:PAL.ink $M ($yy-8) $maxLbl 'right'
    LineSeg $g $col 2.6 $zeroX $yy $xx $yy 170
    RingDot $g $col $script:PAL.paper $xx $yy 5.8 2
    $lbl=(FmtNum $v)+$spec.sufijo
    $tx=$xx+11; if ($v -lt 0) { $tx = $xx - 11 - (MeasureW $g $lbl (FSans 8.6 'bold')) }
    DrawText $g $lbl (FSans 8.6 'bold') $script:PAL.ink $tx ($yy-9)
    if ($d.nota) { DrawText $g $d.nota (FSans 7.2) $script:PAL.muted ($ax0+2) ($yy+7) }
  }
  DrawFooter $cv $spec $M $plotW
  return SaveCanvas $cv $out
}

function Render-Chart($spec,[string]$outDir) {
  $out = Join-Path $outDir ($spec.id + '.png')
  switch ($spec.tipo) {
    'barras'              { return Chart-Bars $spec $out $false }
    'barras_horizontales' { return Chart-Bars $spec $out $true }
    'lineas'              { return Chart-Lines $spec $out $false }
    'area'                { return Chart-Lines $spec $out $true }
    'dumbbell'            { return Chart-Dumbbell $spec $out }
    'heatmap'             { return Chart-Heatmap $spec $out }
    'linea_tiempo'        { return Chart-Timeline $spec $out }
    'matriz_2x2'          { return Chart-Matrix2x2 $spec $out }
    'dispersion'          { return Chart-Matrix2x2 $spec $out }
    'lollipop'            { return Chart-Lollipop $spec $out }
    default               { return Chart-Bars $spec $out $false }
  }
}
