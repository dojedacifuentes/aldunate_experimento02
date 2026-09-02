param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
)

$ErrorActionPreference = 'Stop'
$outputDir = Join-Path $ProjectRoot 'public\descargas\informe-01-kit-canonico-v1.0.0'
$htmlPath = Join-Path $outputDir 'kit-canonico-v1.0.0-word.html'
$docxPath = Join-Path $outputDir 'kit-canonico-v1.0.0.docx'
$pdfPath = Join-Path $outputDir 'kit-canonico-v1.0.0.pdf'
$zipPath = Join-Path $ProjectRoot 'public\descargas\informe-01-kit-canonico-v1.0.0.zip'

if (-not (Test-Path -LiteralPath $htmlPath)) {
  throw "No existe el HTML canónico: $htmlPath"
}

$resolvedRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$resolvedOutput = (Resolve-Path -LiteralPath $outputDir).Path
if (-not $resolvedOutput.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'El directorio de salida quedó fuera del proyecto.'
}

$word = $null
$document = $null
try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = 0
  $document = $word.Documents.Open($htmlPath)

  foreach ($section in $document.Sections) {
    $section.PageSetup.PaperSize = 7
    $section.PageSetup.TopMargin = $word.CentimetersToPoints(1.8)
    $section.PageSetup.BottomMargin = $word.CentimetersToPoints(2.0)
    $section.PageSetup.LeftMargin = $word.CentimetersToPoints(1.8)
    $section.PageSetup.RightMargin = $word.CentimetersToPoints(1.8)

    $footer = $section.Footers.Item(1).Range
    $footer.Text = 'Kit canónico inter-IA · v1.0.0 · Documento no oficial · '
    $footer.ParagraphFormat.Alignment = 2
    $footer.Collapse(0)
    $null = $footer.Fields.Add($footer, -1, 'PAGE', $true)
  }

  try { $document.BuiltInDocumentProperties('Title').Value = 'Kit canónico de investigación inter-IA' } catch {}
  try { $document.BuiltInDocumentProperties('Subject').Value = 'IA y Derecho en una cohorte histórica de once universidades chilenas' } catch {}
  try { $document.BuiltInDocumentProperties('Author').Value = 'Diego Hernán Ojeda Cifuentes' } catch {}
  try { $document.BuiltInDocumentProperties('Comments').Value = 'Documento de trabajo no oficial. Versión 1.0.0.' } catch {}

  $document.SaveAs($docxPath, 16)
  $document.ExportAsFixedFormat($pdfPath, 17)
} finally {
  if ($document -ne $null) { $document.Close($false) }
  if ($word -ne $null) { $word.Quit() }
  if ($document -ne $null) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($document) }
  if ($word -ne $null) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

if (Test-Path -LiteralPath $htmlPath) { Remove-Item -LiteralPath $htmlPath -Force }

$checksumFiles = Get-ChildItem -LiteralPath $outputDir -File |
  Where-Object { $_.Name -ne 'checksums.sha256' } |
  Sort-Object Name
$checksumLines = foreach ($file in $checksumFiles) {
  $hash = Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256
  "$($hash.Hash.ToLowerInvariant())  $($file.Name)"
}
[System.IO.File]::WriteAllLines((Join-Path $outputDir 'checksums.sha256'), $checksumLines, [System.Text.UTF8Encoding]::new($false))

$temporaryZip = Join-Path ([System.IO.Path]::GetTempPath()) 'informe-01-kit-canonico-v1.0.0.zip'
if (Test-Path -LiteralPath $temporaryZip) { Remove-Item -LiteralPath $temporaryZip -Force }
Compress-Archive -Path (Join-Path $outputDir '*') -DestinationPath $temporaryZip -CompressionLevel Optimal
Copy-Item -LiteralPath $temporaryZip -Destination $zipPath -Force
Remove-Item -LiteralPath $temporaryZip -Force

Get-Item -LiteralPath $docxPath, $pdfPath, $zipPath | Select-Object FullName, Length, LastWriteTime
