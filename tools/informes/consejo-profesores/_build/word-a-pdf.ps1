param(
  [Parameter(Mandatory = $true)][string]$Docx,
  [Parameter(Mandatory = $true)][string]$Pdf
)
# Opens a docx in Word (COM), updates TOC and fields, saves, exports PDF, prints page count.
# ASCII only on purpose: PowerShell 5.1 reads BOM-less scripts as ANSI.
$ErrorActionPreference = 'Stop'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open([string]$Docx)
  foreach ($t in $doc.TablesOfContents) { $t.Update() }
  $null = $doc.Fields.Update()
  foreach ($t in $doc.TablesOfContents) { $t.Update() }
  $pages = $doc.ComputeStatistics(2)
  $words = $doc.ComputeStatistics(0)
  $doc.Save()
  $doc.ExportAsFixedFormat([string]$Pdf, 17)
  $doc.Close()
  "pages=$pages words=$words"
}
finally {
  $word.Quit()
  $null = [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word)
}
