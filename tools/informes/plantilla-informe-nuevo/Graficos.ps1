# ============================================================
#  Graficos.ps1 — las figuras de este informe
#
#  Cada figura es un objeto declarativo. El motor no sabe nada del
#  informe: solo interpreta esta estructura.
#
#     .\Graficos.ps1                                   → figuras/      ×2,5 impresión
#     .\Graficos.ps1 -PxScale 1.55 -OutDir figuras-web → figuras-web/  ×1,55 web
# ============================================================
param([double]$PxScale = 2.5, [string]$OutDir = 'figuras')
$ErrorActionPreference = 'Stop'
$base = Split-Path $MyInvocation.MyCommand.Path -Parent
. (Join-Path (Join-Path (Split-Path $base -Parent) 'motor') 'ChartEngine.ps1')
$script:SCALE = $PxScale
$out = Join-Path $base $OutDir
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Force $out | Out-Null }

# Ayudante para un punto de datos: D <etiqueta> <serie> <valor> [<nota>]
function D($e,$s,$v,$n='') { return [pscustomobject]@{etiqueta=$e; serie=$s; valor=$v; nota=$n} }
$G = @()

# ------------------------------------------------------------------
#  EJEMPLO. Borra este bloque y escribe los tuyos.
#
#  Tipos disponibles:
#    barras · barras_horizontales · lineas · area · lollipop
#    dumbbell · heatmap · linea_tiempo · matriz_2x2 · dispersion
#
#  El titular debe enunciar EL HALLAZGO, no el tema.
#  No «Uso de IA por estudiantes», sino
#  «Usar la IA no es delegar en ella: dos curvas que se separan».
#
#  `fuente` es obligatorio: una figura sin procedencia no debería compilar.
# ------------------------------------------------------------------
$G += [pscustomobject]@{
  id='g01-ejemplo'; tipo='barras'; kicker='Categoría'
  titulo='El titular enuncia el hallazgo, no el tema'
  subtitulo='El subtítulo precisa qué se mide exactamente y sobre qué población.'
  unidad='% de casos'; sufijo='%'; max=100; alto=470
  datos=@(
    (D 'Primera'  '' 42),
    (D 'Segunda'  '' 67),
    (D 'Tercera'  '' 19)
  )
  colores=@('#1B3A5C','#C08A2E','#A34A3C')
  fuente='Autor, año, publicación, tamaño de muestra y fecha de consulta. Sin esto la figura no debería publicarse.'
  advertencia='Sesgo conocido del dato: autoinforme, muestra no representativa, sin denominador claro, lo que corresponda.'
}

# ---------- render ----------
foreach ($s in $G) {
  $p = Render-Chart $s $out
  $kb = [Math]::Round((Get-Item $p).Length/1KB,1)
  "OK  $($s.id)  ($kb KB)"
}
"---"
"Total: $($G.Count) figuras en $out"
