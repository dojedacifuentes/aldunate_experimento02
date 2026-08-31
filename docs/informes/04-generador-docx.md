# 04 · Generador de Word

`DocxBuilder.ps1` escribe el `.docx` a mano, como paquete OOXML. Sin `python-docx`, sin `docx-js`, sin automatización de Word para redactar.

---

## Por qué a mano

Un `.docx` es un ZIP con archivos XML dentro. Escribirlo directamente da dos cosas que ninguna biblioteca ligera ofrece: **control tipográfico completo** —espaciados exactos, filetes bajo los títulos, celdas con fondo de color, versalitas— y **cero dependencias**, que en un entorno sin Python ni Node dejó de ser una preferencia para volverse un requisito.

Word solo interviene al final, por automatización COM, para dos cosas que no puede hacer un generador: **actualizar el índice** (que es un campo, no texto) y **exportar a PDF**.

---

## Anatomía del paquete

```
Informe.docx  (ZIP)
├── [Content_Types].xml          declara los tipos de cada parte
├── _rels/.rels                  raíz de relaciones
├── docProps/
│   ├── core.xml                 título, autor, palabras clave, fechas
│   └── app.xml                  aplicación
└── word/
    ├── document.xml             EL CONTENIDO
    ├── styles.xml               estilos y valores por defecto
    ├── settings.xml             ← updateFields, clave para el índice
    ├── numbering.xml            viñetas y numeración
    ├── header1.xml              encabezado con filete
    ├── footer1.xml              pie con número de página
    ├── media/                   las 12 figuras en PNG
    └── _rels/document.xml.rels  relaciones: estilos, imágenes, encabezados
```

### El truco del índice

En `settings.xml`:

```xml
<w:updateFields w:val="true"/>
```

Con esa línea, Word actualiza todos los campos al abrir el documento y el índice se genera solo. Sin ella, el lector vería un marcador vacío y tendría que actualizarlo a mano.

El índice se inserta como campo `TOC`, no como lista de texto:

```xml
<w:fldChar w:fldCharType="begin" w:dirty="true"/>
<w:instrText> TOC \o "1-2" \h \z \u </w:instrText>
```

---

## API de bloques

El constructor expone funciones que corresponden a los tipos del modelo de contenido. Se usan en orden y van acumulando XML en un búfer.

| Función | Produce |
|---|---|
| `H1 $d $num $titulo` | Título de capítulo con salto de página, antetítulo en versalitas y filete inferior |
| `H1NoBreak` | Igual, sin forzar página nueva |
| `H2`, `H3`, `H4` | Jerarquía descendente, con `keepNext` para que no queden huérfanos |
| `Body $d $texto` | Párrafo justificado, Georgia 10,5 pt, interlineado 1,32 |
| `Lead` | Párrafo de entrada, cuerpo mayor y color secundario |
| `Bullet`, `NumItem` | Listas con sangría francesa |
| `Quote $d $texto $atribucion` | Cita con barra lateral de acento y atribución en versalitas |
| `Callout $d $titulo $texto $color` | Destacado con fondo y barra de color semántico |
| `TableGrid $d $head $rows $widths $opt` | Tabla con cabecera fija, filas alternadas y celdas coloreadas |
| `AddImage $d $ruta $anchoEmu $alt` | Imagen centrada, con relación y texto alternativo |
| `Caption`, `Kicker`, `HRule`, `Spacer`, `PageBreak` | Elementos auxiliares |
| `TOC $d '1-2'` | Campo de índice |
| `Save-Doc $d $ruta $meta` | Ensambla y comprime el paquete |

### Marcado ligero

`RichRuns` interpreta dentro de cualquier texto:

- `**negrita**` → `<w:b/>`
- `*cursiva*` → `<w:i/>`
- `` `código` `` → Consolas en color primario

Es lo que permite que el mismo JSON alimente al Word y a la web sin escribir el formato dos veces.

### Celdas coloreadas

Una celda que empieza por `[[RRGGBB]]` se pinta con ese fondo y su texto pasa a blanco y negrita. Se usa en la matriz institucional para los niveles 0–5:

```json
["University of Sydney", "Australia", "[[1B3A5C]]4", "…"]
```

---

## Medidas

Las unidades de OOXML son tres y conviene no mezclarlas:

| Unidad | Equivale a | Dónde se usa |
|---|---|---|
| **twip** | 1/20 pt | Anchos de tabla, sangrías, espaciados |
| **half-point** | 1/2 pt | Cuerpos tipográficos (`w:sz`) |
| **EMU** | 1/914.400 pulgada | Dimensiones de imagen |

Para el A4 con márgenes de 2,2 cm la caja mide **470,6 pt**. Las tablas se dimensionan a **9.120 twips** (456 pt) y las imágenes a **5.950.000 EMU** (468,5 pt), dejando holgura en ambos casos.

### Verificar que nada desborda

Merece la pena comprobarlo por medición y no a ojo:

```powershell
$w = New-Object -ComObject Word.Application
$doc = $w.Documents.Open($ruta, $false, $true)
$caja = $doc.PageSetup.PageWidth - $doc.PageSetup.LeftMargin - $doc.PageSetup.RightMargin
foreach ($t in $doc.Tables) {
  $ancho = 0; foreach ($c in $t.Columns) { $ancho += $c.Width }
  if ($ancho -gt $caja) { "DESBORDA: $ancho > $caja" }
}
```

---

## Exportar a PDF y actualizar el índice

```powershell
$w = New-Object -ComObject Word.Application
$w.Visible = $false; $w.DisplayAlerts = 0
$doc = $w.Documents.Open($docx, $false, $false)
$doc.Fields.Update()                      | Out-Null
$doc.TablesOfContents.Item(1).Update()
$doc.Repaginate()
$doc.Save()
$doc.ExportAsFixedFormat($pdf, 17)        # 17 = wdExportFormatPDF
$doc.Close(0); $w.Quit()
```

Funciona incluso con versiones antiguas de Word siempre que esté disponible el complemento de exportación a PDF.

---

## Numeración automática

`Build-Informe.ps1` lleva dos contadores y antepone el número al pie, después de retirar cualquier número que hubiera escrito en el JSON:

```powershell
$cap = 'Figura ' + $nFig + '. ' + ([regex]::Replace($b.cap, '^Figura\s+\d+\.\s*', ''))
```

El mismo mecanismo está en el constructor web, de modo que ambas salidas numeran igual **por orden de aparición**. Esto corrigió un defecto real: en una versión anterior las figuras se numeraban por identificador, de modo que la figura 5 aparecía en segundo lugar y la 11 antes que la 10.
