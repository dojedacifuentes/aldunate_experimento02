# tools/informes — fábrica de informes

Aquí vive la maquinaria que convierte investigación en documentos publicables.
No es una carpeta de utilidades sueltas: es una cadena de producción completa que
toma contenido estructurado y devuelve **Word, PDF y web sincronizados**.

Se usó para producir el informe 02. Está aquí para que el 03 no haya que
inventarlo de nuevo.

---

## La idea en una frase

El texto no vive en el Word. Vive en archivos `.json`, y el Word, el PDF y la web
se **generan** desde ahí.

```
contenido-*.json  ──┬──►  Build-Informe.ps1   ──►  .docx  ──(Word)──►  .pdf
   fuente única     │
                    └──►  Build-Artifact.ps1  ──►  .html  ──►  público/

Graficos.ps1  ──►  ChartEngine.ps1  ──►  figuras/      (impresión, ×2,5)
                                    └──►  figuras-web/ (web, ×1,55)
```

La forma habitual —escribir en Word, exportar a PDF, copiar a mano a la web—
funciona una vez. A la tercera corrección las tres versiones dicen cosas
distintas y nadie sabe cuál es la buena. Aquí eso no puede pasar: no hay copia
que quede desactualizada.

---

## Qué hay en cada carpeta

| Carpeta | Contenido |
|---|---|
| `motor/` | Lo reutilizable y estable. Motor de gráficos, generador de `.docx` y utilidad de codificación. No se toca al escribir un informe nuevo. |
| `plantillas/` | Los constructores y las dos maquetas web. Tampoco se tocan salvo cambio de diseño. |
| `plantilla-informe-nuevo/` | Esqueleto en blanco. Se copia para arrancar un informe. |
| `informe-02/` | El informe 02 completo como ejemplo real y funcionando: contenido, figuras y corpus de evidencia. |

La documentación del método está en [`docs/informes/`](../../docs/informes/):
metodología de investigación, sistema de diseño, motor de gráficos, generador de
Word, modelo de contenido, guía de reproducción y puente con el sitio.

---

## Requisitos

| Necesitas | Para qué |
|---|---|
| **Windows con PowerShell 5.1** | Toda la cadena. Es el que trae el sistema, no PowerShell 7 |
| **Microsoft Word** | Solo para actualizar el índice y exportar a PDF, por automatización COM |

No hace falta Python, Node, ni ninguna biblioteca externa. Esa restricción no fue
una elección estética: la máquina donde se construyó no tenía ninguna de las dos.

---

## Crear un informe nuevo

```powershell
# 1. Copiar el esqueleto
Copy-Item -Recurse tools\informes\plantilla-informe-nuevo tools\informes\informe-03

# 2. Escribir el contenido en los .json y definir las figuras en Graficos.ps1

# 3. Compilar
cd tools\informes\informe-03
..\motor\utf8bom.ps1 .                              # imprescindible: ver abajo
.\Graficos.ps1                                      # figuras de impresión
.\Graficos.ps1 -PxScale 1.55 -OutDir figuras-web    # figuras para web
..\plantillas\Build-Informe.ps1                     # .docx
..\plantillas\Build-Artifact.ps1                    # .html
```

Después, para publicarlo en el sitio:

1. Copiar el PDF y el HTML a `public/descargas/`.
2. Añadir una entrada a `versions` en `src/data/reports.ts`, con sus rutas `pdf`
   y `html`. **Nunca sobrescribir una versión anterior**: se añade y se registra
   el changelog.
3. Cargar las fuentes y afirmaciones en `src/data/research.ts`.

El paso 3 es el que importa y está explicado en
[`docs/informes/07-puente-con-el-sitio.md`](../../docs/informes/07-puente-con-el-sitio.md).

---

## Dos trampas del entorno

Ambas costaron tiempo. Están aquí para que no vuelvan a costarlo.

**1 · PowerShell 5.1 lee los `.ps1` sin BOM como ANSI.** Los acentos y los signos
tipográficos se corrompen en silencio: `·` se convierte en `Â·`, `ó` en `Ã³`. El
documento compila y sale mal impreso. Ejecutar `motor/utf8bom.ps1` después de
editar cualquier script.

**2 · Los nombres de variable no distinguen mayúsculas.** `$Scale` y `$SCALE` son
la misma variable, así que un parámetro queda sobrescrito por la variable interna
que el `dot-source` inicializa después, sin dar ningún error. Por eso el
parámetro de escala se llama `$PxScale`.

---

## Lo que el sistema garantiza

- **Las tres versiones no pueden divergir.** Salen del mismo origen.
- **Figuras y tablas se numeran solas**, por orden de aparición. Reordenar
  capítulos no las desincroniza. Los pies no llevan número escrito.
- **Una figura sin fuente no compila.** El campo `fuente` es obligatorio por
  diseño.
- **Insertar un capítulo entre dos existentes** solo requiere un sufijo de letra
  en el nombre del archivo (`contenido-04b.json`), porque se concatenan por orden
  alfabético.

## Lo que no garantiza

- **Que los datos sean ciertos.** La verificación de fuentes es humana y no se
  delega. En el informe 02, ese trabajo fue el que descubrió que el metaanálisis
  más citado del campo había sido retractado.
- **Que los números en prosa coincidan con las tablas.** Un documento largo
  escrito por partes acumula errores de recuento; en el informe 02 la auditoría
  encontró cuatro. El procedimiento para repetirla está en
  `docs/informes/06-reproducir.md`.
