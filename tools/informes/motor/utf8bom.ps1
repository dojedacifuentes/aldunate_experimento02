# Convierte los .ps1 del directorio a UTF-8 con BOM (PowerShell 5.1 los lee como ANSI si no lo tienen)
param([string]$Dir)
if (-not $Dir) { $Dir = Split-Path $MyInvocation.MyCommand.Path -Parent }
$utf8bom = New-Object System.Text.UTF8Encoding($true)
$utf8nobom = New-Object System.Text.UTF8Encoding($false)
foreach ($f in (Get-ChildItem -Path $Dir -Filter *.ps1 -File)) {
  if ($f.Name -eq 'utf8bom.ps1') { continue }
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    "SKIP (ya tiene BOM)  $($f.Name)"
    continue
  }
  $text = $utf8nobom.GetString($bytes)
  [System.IO.File]::WriteAllText($f.FullName, $text, $utf8bom)
  "BOM anadido  $($f.Name)"
}
