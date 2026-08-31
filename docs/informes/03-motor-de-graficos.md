# 03 · Motor de gráficos

`ChartEngine.ps1` dibuja las doce figuras del informe con `System.Drawing`, la biblioteca GDI+ que viene con Windows. Sin Python, sin Node, sin dependencias.

---

## Por qué así

La máquina donde se produjo el informe no tenía Python, Node ni gestor de paquetes. Restricción incómoda que resultó tener una ventaja: el motor produce **PNG de alta resolución** que sirven igual de bien para el Word impreso y para la web, con una sola definición de la figura y sin diferencias tipográficas entre soportes.

La alternativa —dibujar SVG para web y otra cosa para impresión— habría duplicado la lógica de maquetación y garantizado que las dos versiones divergieran.

---

## Arquitectura

```
ChartEngine.ps1          Primitivas, tipografía, escalas y los 9 tipos de gráfico
   └── Graficos.ps1      Las 12 figuras del informe, con sus datos verificados
          └── figuras/       PNG a ×2,5  (2.200 px de ancho, impresión)
          └── figuras-web/   PNG a ×1,55 (1.364 px de ancho, web)
```

### Supermuestreo

Todo se dibuja a una escala mayor que la nominal y el PNG se guarda a 220 ppp. `$script:SCALE` multiplica cada coordenada, cada grosor de línea y cada cuerpo tipográfico, de modo que la proporción del diseño no cambia con la escala: solo cambia la densidad de píxeles.

```powershell
.\Graficos.ps1                                    # ×2,5 → figuras/       impresión
.\Graficos.ps1 -PxScale 1.55 -OutDir figuras-web  # ×1,55 → figuras-web/  web
```

El juego web pesa alrededor de la mitad. Con las doce figuras en base64 dentro del HTML, esa diferencia decide si el navegador renderiza la página con fluidez o se atasca.

> **Trampa.** El parámetro se llama `$PxScale` y no `$Scale` por una razón concreta: PowerShell no distingue mayúsculas, así que `$Scale` y la variable interna `$SCALE` serían la misma, y el `dot-source` de `ChartEngine.ps1` la sobrescribiría con su valor por defecto.

---

## Los nueve tipos

| `tipo` | Para qué |
|---|---|
| `barras` | Comparación entre categorías; admite varias series agrupadas y valores negativos |
| `barras_horizontales` | Muchas categorías o etiquetas largas; barra de fondo que muestra el total |
| `lineas` | Series temporales; etiqueta cada punto y limita las de los extremos para que no se corten |
| `area` | Como `lineas`, con relleno bajo la curva |
| `lollipop` | Tamaños de efecto y variaciones porcentuales; maneja bien positivos y negativos en un mismo eje |
| `dumbbell` | Brechas entre dos estados; dibuja la diferencia entre ambos extremos |
| `heatmap` | Matriz de dos entradas con intensidad de color; cabeceras rotadas y escala al pie |
| `linea_tiempo` | Cronologías; altura calculada según el texto de cada hito y color por categoría |
| `matriz_2x2` | Posicionamiento cualitativo en dos ejes; etiquetas que se repliegan al llegar al borde |

---

## Formato de especificación

Una figura es un objeto declarativo. El motor no sabe nada del informe; solo interpreta esta estructura.

```powershell
$G += [pscustomobject]@{
  id     = 'g01-uso-delegacion'      # nombre del archivo PNG
  tipo   = 'lineas'
  kicker = 'Adopción'                # antetítulo (sin número: se calcula en el pie)
  titulo = 'Usar la IA no es delegar en ella: dos curvas que se separan'
  subtitulo = 'Estudiantes de grado del Reino Unido. La curva superior mide…'
  unidad = '% de estudiantes'
  sufijo = '%'
  max    = 100                        # opcional: fuerza el tope del eje
  alto   = 500                        # opcional: altura en px nominales
  datos  = @(
    (D '2024' 'Usa IA para trabajos evaluados' 53),
    (D '2025' 'Usa IA para trabajos evaluados' 88),
    (D '2026' 'Usa IA para trabajos evaluados' 94)
  )
  fuente      = 'HEPI, Student Generative AI Survey, oleadas 2024, 2025 y 2026…'
  advertencia = 'Datos autoinformados. El enunciado de las preguntas varía…'
}
```

El ayudante `D` construye un punto: `D <etiqueta> <serie> <valor> [<nota>]`. En los tipos que no usan series —`barras_horizontales`, `lollipop`— el segundo campo se reutiliza para pasar un color explícito, y en `linea_tiempo` el tercero queda vacío y el cuarto marca la categoría (`retroceso`, `evidencia`, `norma`).

Campos obligatorios: `id`, `tipo`, `titulo`, `datos`, `fuente`. **`fuente` no es opcional por diseño**: una figura sin procedencia no debería poder compilarse.

---

## Composición de la lámina

Todas las figuras comparten la misma estructura vertical, calculada de arriba abajo y de abajo arriba a la vez:

```
┌──────────────────────────────────────────┐
│ ANTETÍTULO                    versalitas │  ← DrawHeader
│ Titular que enuncia el hallazgo   serif  │
│ Subtítulo con qué mide y sobre quién     │
│ ▬▬▬                        filete acento │
│                                          │
│           área de trazado                │  ← alto = espacio restante
│                                          │
│ ⚠ Advertencia de lectura         cursiva │  ← DrawFooter
│ ─────────────────────────────────────────│
│ Fuente completa con autor, año y muestra │
└──────────────────────────────────────────┘
```

`FooterTop` calcula dónde empieza el pie midiendo el texto real de la fuente y de la advertencia, y devuelve ese límite al tipo de gráfico. Por eso una fuente de tres líneas no invade nunca el área de datos: el gráfico se encoge para dejarle sitio.

---

## Primitivas disponibles

| Función | Qué hace |
|---|---|
| `NewCanvas w h` | Lienzo con antialias, interpolación de alta calidad y 220 ppp |
| `DrawText` / `DrawTextWrapped` | Texto con alineación; la segunda ajusta a un ancho dado |
| `MeasureW` / `TextH` | Medición previa, imprescindible para decidir repliegues y alturas |
| `FillRect`, `LineSeg`, `RoundRect` | Formas básicas, con alpha y trazo discontinuo opcionales |
| `Dot`, `RingDot` | Puntos; el segundo con anillo de contraste sobre el fondo |
| `NiceMax` | Redondea el tope del eje a 1 / 2 / 2,5 / 5 / 10 × potencia de diez |
| `FmtNum` | Formato numérico en español: coma decimal y punto de millar |

---

## Decisiones de robustez

Tres problemas concretos que el motor resuelve, y que conviene conocer antes de añadir una figura:

- **Etiquetas de los extremos.** En `lineas`, la etiqueta del primer y del último punto se recorta contra el margen del área de trazado en lugar de centrarse ciegamente sobre el punto.
- **Valores negativos.** En `lollipop`, cuando hay negativos el eje reserva 62 px extra a la izquierda para que la cifra no se solape con la etiqueta de categoría.
- **Etiquetas al borde.** En `matriz_2x2`, un punto situado en el cuarto derecho dibuja su etiqueta a la izquierda del punto en vez de a la derecha.

Y una regla de anchura: en `barras`, el ancho de banda se limita a 78 px por serie. Sin ese tope, tres categorías en un lienzo ancho producen barras desproporcionadas que exageran visualmente la diferencia.

---

## Añadir una figura

1. Añade el bloque a `$G` en `Graficos.ps1`, con sus datos y su fuente.
2. Ejecuta el script en las dos escalas.
3. Referencia la figura desde el contenido con un bloque `fig`:

```json
{ "t":"fig", "id":"g13-nueva", "cap":"Lo que muestra la figura y su advertencia." }
```

No escribas el número en el pie: los constructores lo anteponen según el orden de aparición.
