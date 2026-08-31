# ============================================================
#  Graficos.ps1 — especificaciones con datos VERIFICADOS
#  Informe: Transformación de la enseñanza universitaria e IA
# ============================================================
param([double]$PxScale = 2.5, [string]$OutDir = 'figuras')
$ErrorActionPreference = 'Stop'
$base = Split-Path $MyInvocation.MyCommand.Path -Parent
. (Join-Path (Join-Path (Split-Path $base -Parent) 'motor') 'ChartEngine.ps1')
$script:SCALE = $PxScale
$out = Join-Path $base $OutDir
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Force $out | Out-Null }

function D($e,$s,$v,$n='') { return [pscustomobject]@{etiqueta=$e; serie=$s; valor=$v; nota=$n} }
$G = @()

# ---------- G1 · Uso frente a delegación ----------
$G += [pscustomobject]@{
  id='g01-uso-delegacion'; tipo='lineas'; kicker='Adopción'
  titulo='Usar la IA no es delegar en ella: dos curvas que se separan'
  subtitulo='Estudiantes de grado del Reino Unido. La curva superior mide cualquier uso para trabajos evaluados; la inferior, la inserción directa de texto generado por IA en la entrega.'
  unidad='% de estudiantes'; sufijo='%'; max=100
  datos=@(
    (D '2024' 'Usa IA generativa para trabajos evaluados' 53),
    (D '2025' 'Usa IA generativa para trabajos evaluados' 88),
    (D '2026' 'Usa IA generativa para trabajos evaluados' 94),
    (D '2024' 'Inserta texto de IA directamente en la entrega' 3),
    (D '2025' 'Inserta texto de IA directamente en la entrega' 8),
    (D '2026' 'Inserta texto de IA directamente en la entrega' 12)
  )
  fuente='HEPI, Student Generative AI Survey, oleadas 2024, 2025 y 2026 (Policy Note 61 e Informe 199). Oleada 2026: n = 1.054 estudiantes de grado a tiempo completo del Reino Unido, trabajo de campo de diciembre de 2025, ejecutado por Savanta.'
  advertencia='Datos autoinformados. El enunciado de las preguntas varía levemente entre oleadas, por lo que la serie indica magnitud y dirección, no una medición estrictamente equivalente.'
}

# ---------- G2 · Rendimiento asistido frente a aprendizaje ----------
$G += [pscustomobject]@{
  id='g02-rendimiento-vs-aprendizaje'; tipo='lollipop'; kicker='Evidencia experimental'
  titulo='Rendimiento asistido y aprendizaje se mueven en direcciones opuestas'
  subtitulo='Variación porcentual del desempeño en dos ensayos aleatorizados. Los efectos positivos se miden con la IA disponible; los negativos, cuando se retira o cuando se mide el trabajo real en vez de percibirlo.'
  sufijo='%'
  datos=@(
    (D 'Tutor IA con andamiaje docente, durante la práctica' '#2F7D8C' 127 'Bastani et al., PNAS 2025 · n ≈ 1.000'),
    (D 'Acceso libre a GPT-4, durante la práctica' '#1B3A5C' 48 'Bastani et al., PNAS 2025'),
    (D 'Desarrolladores expertos: productividad PERCIBIDA' '#C08A2E' 20 'METR 2025 · autoinforme posterior a la tarea'),
    (D 'Acceso libre: rendimiento al RETIRAR la IA' '#A34A3C' -17 'Bastani et al. · frente a quienes nunca la tuvieron'),
    (D 'Desarrolladores expertos: productividad MEDIDA' '#A34A3C' -19 'METR 2025 · n = 16, 246 tareas reales')
  )
  fuente='Bastani, Bastani, Sungu, Ge, Kabakçı y Mariman, «Generative AI without guardrails can harm learning», PNAS (2025). METR, «Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity» (julio de 2025).'
  advertencia='Poblaciones y tareas distintas: no son efectos comparables entre sí, sino ilustraciones del mismo patrón. METR califica hoy su resultado de histórico. El estudio de Bastani se realizó en secundaria, no en universidad.'
}

# ---------- G3 · Brecha de preparación ----------
$G += [pscustomobject]@{
  id='g03-brecha-preparacion'; tipo='barras_horizontales'; kicker='Rol docente'
  titulo='El problema ya no es la adopción, es la preparación'
  subtitulo='Con el 77 % del profesorado y el 88 % de los estudiantes usando IA, los indicadores críticos ya no miden uso sino capacidad de acompañar ese uso.'
  sufijo='%'; max=100
  datos=@(
    (D 'Profesorado preocupado por la capacidad crítica de sus estudiantes' '' 83),
    (D 'Profesorado que percibe falta de claridad institucional' '' 80),
    (D 'Estudiantes con orientación insuficiente sobre IA en sus evaluaciones' '' 57),
    (D 'Profesorado que se declara al inicio de su alfabetización en IA' '' 40),
    (D 'Profesorado involucrado en el diseño de la política institucional' '' 31),
    (D 'Estudiantes que creen que sus docentes están preparados para orientarlos' '' 29),
    (D 'Profesorado en nivel avanzado o experto en IA' '' 17)
  )
  colores=@('#A34A3C','#A34A3C','#C08A2E','#C08A2E','#1B3A5C','#1B3A5C','#1B3A5C')
  fuente='Digital Education Council, Global AI Faculty Survey 2025 (n = 1.681 docentes, 52 instituciones, 28 países) y AI in Higher Education Global Survey 2026.'
  advertencia='Muestra internacional autoseleccionada de instituciones miembros; sobrerrepresenta universidades ya movilizadas en torno a la IA, por lo que la brecha real del sistema es probablemente mayor.'
}

# ---------- G4 · Políticas institucionales ----------
$G += [pscustomobject]@{
  id='g04-politicas'; tipo='barras'; kicker='Gobernanza'
  titulo='El titular dice dos tercios; la política vigente alcanza al 19 %'
  subtitulo='Estado de la normativa institucional sobre IA generativa en educación superior, según la encuesta de UNESCO publicada en septiembre de 2025.'
  unidad='% de instituciones'; sufijo='%'; max=100; alto=470
  datos=@(
    (D 'Política formal ya vigente' '' 19),
    (D 'Marco en desarrollo' '' 42),
    (D 'Sin política ni marco declarado' '' 39)
  )
  colores=@('#1B3A5C','#C08A2E','#A34A3C')
  fuente='UNESCO, encuesta a Cátedras UNESCO y Redes UNITWIN, 400 respuestas de 90 países, difundida durante la Digital Learning Week (2-5 de septiembre de 2025).'
  advertencia='Muestra de 400 respuestas autoseleccionadas dentro de la red UNESCO: no es representativa del sistema universitario mundial. La categoría residual del 39 % se deduce por diferencia.'
}

# ---------- G5 · Integridad académica ----------
$G += [pscustomobject]@{
  id='g05-integridad'; tipo='barras'; kicker='Integridad académica'
  titulo='Los casos probados se multiplican; siguen siendo la punta del iceberg'
  subtitulo='Casos probados de mala conducta académica con IA por cada 1.000 estudiantes en universidades del Reino Unido. En el mismo periodo, el 94 % de los estudiantes declara usar IA para trabajos evaluados.'
  unidad='casos por 1.000 estudiantes'; sufijo=''; alto=490
  datos=@(
    (D '2022-23' '' 1.6),
    (D '2023-24' '' 5.1),
    (D '2024-25 (proyección)' '' 7.5)
  )
  colores=@('#7C8A99','#1B3A5C','#C08A2E')
  fuente='Investigación de The Guardian mediante solicitudes de Freedom of Information a 155 universidades británicas (131 respondieron); recogida por Times Higher Education. En 2023-24 fueron casi 7.000 casos probados.'
  advertencia='Mide DETECCIÓN, no prevalencia. Más del 27 % de las universidades que respondieron no registraba la mala conducta con IA de forma separada. Contrástese con el 94 % de no detección del experimento de Reading.'
}

# ---------- G6 · Alucinaciones jurídicas ----------
$G += [pscustomobject]@{
  id='g06-alucinaciones-juridicas'; tipo='barras'; kicker='Derecho'
  titulo='Las herramientas jurídicas comerciales alucinan entre una de cada seis y una de cada dos veces'
  subtitulo='Tasa de respuestas con contenido alucinado en consultas de investigación jurídica, medida por el RegLab y el instituto HAI de Stanford.'
  unidad='% de respuestas con alucinación'; sufijo='%'; max=50; alto=490
  datos=@(
    (D 'Lexis+ AI' '' 17),
    (D 'Westlaw AI-Assisted Research' '' 33),
    (D 'GPT-4 (sin recuperación jurídica)' '' 43)
  )
  colores=@('#C08A2E','#A34A3C','#7C8A99')
  fuente='Magesh, Surani, Dahl, Suzgun, Manning y Ho, «Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools», Journal of Empirical Legal Studies (2025). Precisión: Lexis+ AI responde correctamente el 65 % de las consultas; Westlaw, el 42 %.'
  advertencia='Ambos proveedores comercializaban sus productos como libres de alucinaciones. Las tasas dependen del conjunto de consultas empleado y pueden haber variado con versiones posteriores.'
}

# ---------- G7 · Casos judiciales con citas fabricadas ----------
$G += [pscustomobject]@{
  id='g07-citas-fabricadas'; tipo='area'; kicker='Derecho'
  titulo='Resoluciones judiciales en las que un tribunal constató citas fabricadas'
  subtitulo='Registro acumulado mundial. Solo incluye casos en que el tribunal estableció efectivamente el uso de contenido alucinado, no meras alegaciones.'
  unidad='casos acumulados'; sufijo=''; alto=470
  datos=@(
    (D 'Inicios de 2026' '' 1200),
    (D 'Julio de 2026' '' 1668),
    (D '28 de agosto de 2026' '' 1981)
  )
  fuente='Damien Charlotin, AI Hallucination Cases Database, Smart Law Hub, HEC Paris. Consulta de agosto de 2026.'
  advertencia='Es un registro de detección judicial, no una tasa de error. El crecimiento mezcla mayor uso de IA con mayor escrutinio de los tribunales y mejor cobertura del registro. La cifra de inicios de 2026 es un mínimo declarado.'
}

# ---------- G8 · Brecha de género ----------
$G += [pscustomobject]@{
  id='g08-genero'; tipo='barras_horizontales'; kicker='Equidad'
  titulo='La nueva alfabetización nace con una brecha de género incorporada'
  subtitulo='Participación femenina entre los usuarios de herramientas de IA generativa. La paridad demográfica estaría en el 50 %.'
  sufijo='%'; max=100; alto=430
  datos=@(
    (D 'Usuarias de ChatGPT' '' 42 'la paridad estaría en 50 %'),
    (D 'Usuarias de Claude' '' 31 ''),
    (D 'Descargas de la aplicación de ChatGPT' '' 27 '')
  )
  colores=@('#1B3A5C','#2F7D8C','#7C8A99')
  fuente='Otis, Delecourt, Cranney y Koning, «Global Evidence on Gender Gaps and Generative AI», Harvard Business School Working Paper 25-023. El metaanálisis asociado cubre 18 estudios y 143.008 personas en 25 países, y estima un 22 % menos de probabilidades de uso en mujeres.'
  advertencia='La brecha persiste incluso cuando el acceso se iguala, lo que descarta el acceso como única explicación. En estudiantes universitarios de EE. UU. y Suecia las diferencias alcanzaron 25 y 31 puntos porcentuales.'
}

# ---------- G12 · Mapa internacional: distribución por nivel ----------
$G += [pscustomobject]@{
  id='g12-mapa-niveles'; tipo='barras'; kicker='Panorama internacional'
  titulo='Ni una sola institución del mapa alcanza el nivel sistémico'
  subtitulo='Distribución de las 30 instituciones documentadas en este informe según la profundidad de su transformación. El nivel 5 exige cambio coordinado en currículo, evaluación, docencia, competencias, infraestructura y gobernanza.'
  unidad='número de instituciones'; sufijo=''; alto=500; max=12
  datos=@(
    (D '0 · Ausencia' '' 0),
    (D '1 · Herramienta' '' 2),
    (D '2 · Política' '' 9),
    (D '3 · Integración' '' 11),
    (D '4 · Currículo' '' 8),
    (D '5 · Sistémico' '' 0)
  )
  colores=@('#7C8A99','#7C8A99','#C08A2E','#2F7D8C','#1B3A5C','#A34A3C')
  fuente='Elaboración propia. Muestra de 30 instituciones de diez países con iniciativas documentadas y verificadas en esta investigación, clasificadas según la escala de profundidad empleada en todo el informe.'
  advertencia='La muestra está deliberadamente sesgada al alza: solo incluye instituciones que documentan públicamente iniciativas. No es representativa del sistema universitario mundial y sobrestima el nivel medio real.'
}

# ---------- G9 · Matriz de transformación institucional ----------
$inst = @(
  @{n='University of Sydney (Australia)';      v=@(4,3,5,3,4,4,3)},
  @{n='Ohio State University (EE. UU.)';       v=@(3,5,2,4,3,3,3)},
  @{n='Case Western Reserve · Derecho';        v=@(3,4,3,5,3,2,2)},
  @{n='Arizona State University (EE. UU.)';    v=@(3,3,2,3,3,4,3)},
  @{n='Tecnológico de Monterrey (México)';     v=@(3,3,2,3,4,5,3)},
  @{n='Northeastern University (EE. UU.)';     v=@(3,3,2,2,3,4,3)},
  @{n='University of Bath (Reino Unido)';      v=@(3,2,4,2,2,2,2)},
  @{n='California State University (EE. UU.)'; v=@(2,2,1,2,2,4,4)},
  @{n='Universidad de Chile';                  v=@(2,2,1,1,3,2,2)}
)
$dims = @('Metodologías','Competencias','Evaluación','Currículo','Rol docente','Gobernanza','Equidad')
$hd = @()
foreach ($i in $inst) { for ($k=0; $k -lt $dims.Count; $k++) { $hd += (D $i.n $dims[$k] $i.v[$k]) } }
$G += [pscustomobject]@{
  id='g09-matriz-instituciones'; tipo='heatmap'; kicker='Comparación'
  titulo='Ninguna institución transforma todas las dimensiones a la vez'
  subtitulo='Profundidad de la transformación por dimensión, en escala de 0 a 5. Las filas revelan perfiles, no jerarquías: cada institución es fuerte donde decidió serlo y débil donde no intervino.'
  max=5; alto=640
  datos=$hd
  fuente='Valoración propia a partir de la evidencia recogida en este informe. Escala: 0 ausencia o restricción · 1 herramienta · 2 política y alfabetización · 3 integración pedagógica · 4 transformación curricular · 5 transformación sistémica de esa dimensión.'
  advertencia='Puntuaciones analíticas del autor, no mediciones. Reflejan la evidencia pública disponible en agosto de 2026 y penalizan a las instituciones que documentan menos, no necesariamente a las que hacen menos.'
}

# ---------- G10 · Cronología ----------
$G += [pscustomobject]@{
  id='g10-cronologia'; tipo='linea_tiempo'; kicker='Cronología'
  titulo='Cuatro años: del pánico de la detección al rediseño de la evaluación'
  subtitulo='Hitos con consecuencia institucional entre noviembre de 2022 y agosto de 2026. En azul los movimientos institucionales; en verde azulado la evidencia científica; en ocre la norma; en rojo los retrocesos.'
  datos=@(
    (D 'Nov 2022' 'Lanzamiento público de ChatGPT. Comienza el ciclo.' '' ''),
    (D 'Ene 2023' 'Primeras prohibiciones institucionales y retorno defensivo al examen presencial.' '' 'retroceso'),
    (D 'Ago 2023' 'Vanderbilt desactiva el detector de IA de Turnitin por su sesgo contra hablantes no nativos. La vía de la detección empieza a cerrarse.' '' 'evidencia'),
    (D 'Sep 2023' 'UNESCO publica la primera guía mundial sobre IA generativa en educación e investigación.' '' 'norma'),
    (D 'Sep 2023' 'El Tecnológico de Monterrey lanza TECgpt: primer modelo propio de una universidad latinoamericana.' '' ''),
    (D 'Ene 2024' 'Arizona State firma la primera alianza institucional de una universidad con OpenAI.' '' ''),
    (D 'Jun 2024' 'Scarfe et al. (PLOS ONE): el 94 % de las entregas generadas por IA pasa sin detección y obtiene mejores notas que las humanas.' '' 'evidencia'),
    (D 'Jul 2024' 'Doshi y Hauser (Science Advances): más creatividad individual, menos diversidad colectiva.' '' 'evidencia'),
    (D 'Nov 2024' 'La University of Sydney anuncia el modelo de evaluación de dos carriles. Es el punto de inflexión del rediseño evaluativo.' '' ''),
    (D 'Abr 2025' 'Claude for Education llega a la LSE, Northeastern y Champlain College con modo de aprendizaje socrático.' '' ''),
    (D 'Jun 2025' 'Kestin et al. (Scientific Reports): un tutor IA bien diseñado duplica las ganancias de aprendizaje frente al aula activa en Harvard.' '' 'evidencia'),
    (D 'Jun 2025' 'Bastani et al. (PNAS): sin andamiajes, el acceso libre a la IA deja a los estudiantes peor que si nunca la hubieran tenido.' '' 'evidencia'),
    (D 'Sep 2025' 'UNESCO: solo el 19 % de las instituciones tiene política formal vigente. TEQSA publica su guía de aplicación de la reforma evaluativa.' '' 'norma'),
    (D 'Abr 2026' 'Se retracta el metaanálisis de Wang y Fan, la referencia más citada a favor de efectos positivos grandes, tras 266 citas.' '' 'retroceso'),
    (D 'May 2026' 'California State University renueva su contrato con OpenAI pese a la petición del profesorado y a los recortes presupuestarios.' '' 'retroceso'),
    (D 'Ago 2026' 'Entran en vigor los requisitos de alto riesgo del Reglamento europeo de IA; los usos del Anexo III se prorrogan hasta diciembre de 2027.' '' 'norma'),
    (D 'Ago 2026' 'El registro de resoluciones judiciales con citas fabricadas alcanza 1.981 casos.' '' 'evidencia')
  )
  fuente='Elaboración propia a partir de las fuentes citadas en este informe.'
}

# ---------- G11 · Profundidad declarada frente a evidencia ----------
$G += [pscustomobject]@{
  id='g11-declaracion-evidencia'; tipo='matriz_2x2'; kicker='Síntesis'
  titulo='Casi toda la transformación vive en el cuadrante sin evidencia'
  subtitulo='Posición relativa de las iniciativas estudiadas según la profundidad del cambio declarado y la solidez de la evidencia independiente sobre sus resultados.'
  ejeX='Profundidad de la transformación declarada'
  ejeY='Solidez de la evidencia independiente de resultados'
  cuadrantes=@('Alcance limitado, bien evaluado','Transformación respaldada por evidencia','Ni profundidad ni evidencia','Transformación declarada sin evidencia')
  datos=@(
    [pscustomobject]@{etiqueta='Harvard PS2 / CS50'; valor=42; y=88; nota='#5F8560'},
    [pscustomobject]@{etiqueta='U. of Sydney'; valor=86; y=52; nota='#1B3A5C'},
    [pscustomobject]@{etiqueta='Ohio State'; valor=88; y=28; nota='#C08A2E'},
    [pscustomobject]@{etiqueta='Case Western · Derecho'; valor=74; y=24; nota='#C08A2E'},
    [pscustomobject]@{etiqueta='Tec de Monterrey'; valor=68; y=17; nota='#A34A3C'},
    [pscustomobject]@{etiqueta='Northeastern'; valor=60; y=21; nota='#A34A3C'},
    [pscustomobject]@{etiqueta='California State U.'; valor=80; y=11; nota='#A34A3C'},
    [pscustomobject]@{etiqueta='Universidad de Chile'; valor=27; y=17; nota='#7C8A99'}
  )
  fuente='Elaboración propia. El eje horizontal recoge la ambición declarada en documentos institucionales; el vertical, la existencia de evaluación externa, revisada por pares o con grupo de comparación.'
  advertencia='Posiciones relativas y cualitativas, no mediciones. Harvard puntúa alto en evidencia y bajo en profundidad porque sus resultados provienen de dos cursos rigurosamente evaluados, no de una reforma institucional.'
}

# ---------- render ----------
foreach ($s in $G) {
  $p = Render-Chart $s $out
  $kb = [Math]::Round((Get-Item $p).Length/1KB,1)
  "OK  $($s.id)  ($kb KB)"
}
"---"
"Total: $($G.Count) figuras en $out"
