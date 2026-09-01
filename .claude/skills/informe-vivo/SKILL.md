---
name: informe-vivo
description: Produce, amplía o publica un informe vivo de este proyecto — convierte investigación en un documento con Word, PDF y web sincronizados, con cada afirmación trazada hasta su fuente, y lo publica en el sitio. Úsala siempre que se pida crear, redactar, ampliar, versionar o publicar un informe; fundir uno o varios documentos de investigación profunda en un informe único; añadir capítulos, figuras o fuentes a un informe existente; o llevar un informe a la web. Aplícala aunque no se nombre «informe vivo» ni la cadena de producción, y aunque el encargo llegue como «hazme un informe sobre X» o «junta estos documentos».
---

# Informe vivo

Este proyecto no redacta informes en Word. Los **compila**: el texto vive en
archivos `.json` y el Word, el PDF y la web se generan desde ahí. La razón es
práctica —un informe se reescribe muchas veces, y tres versiones mantenidas a
mano se contradicen en la segunda semana— pero tiene una consecuencia de fondo:
el documento y su evidencia son la misma cosa, no dos cosas que hay que
sincronizar.

Trabaja con eso a favor, no contra ello.

## Antes de tocar nada

Lee, en este orden y solo lo que necesites:

- `CLAUDE.md` §7 y §8 — trazabilidad e informes vivos. Son reglas del
  repositorio, no sugerencias.
- `docs/informes/README.md` — índice de los siete documentos del método.
- `docs/informes/05-modelo-de-contenido.md` — si vas a escribir contenido.
- `docs/informes/03-motor-de-graficos.md` — si vas a hacer figuras.
- `docs/informes/07-puente-con-el-sitio.md` — si vas a publicar.

No repliques aquí lo que ya está ahí. Si algo de este archivo contradice a
`CLAUDE.md`, gana `CLAUDE.md`.

---

## Fundir varios documentos en uno

Es el encargo más frecuente y el que peor sale si se aborda como una suma. Cuatro
investigaciones no son cuatro capítulos: son cuatro corpus que se solapan, se
contradicen y citan la misma fuente con distinto grado de confianza.

Haz esto en este orden, y no empieces a redactar hasta terminar el paso 3:

**1 · Inventaría las fuentes, no los textos.** Extrae de cada documento sus
fuentes con URL y fecha. Es lo único que se puede fusionar sin perder nada.

**2 · Deduplica y arbitra.** La misma fuente aparecerá varias veces, a menudo con
lecturas distintas. Cuando dos documentos digan cosas incompatibles sobre la
misma fuente, abre la fuente y decide. Registra el desacuerdo en `notes`: que dos
investigaciones discreparan es información sobre la solidez del dato.

El solapamiento no siempre es de fuente, y este paso no queda vacío porque no lo
haya. Arbitra también **las cifras que coinciden midiendo cosas distintas** —dos
«94 %» en capítulos contiguos invitan a una correspondencia que nadie midió— y
**las fuentes que se contradicen en apariencia**, que a menudo convergen en una
variable que ambas declaran y entonces valen más juntas que por separado. Son
conflictos aunque no compartan procedencia.

Y comprueba de qué está hecha cada referencia antes de contarla: una fuente sin
URL resoluble por un tercero no es fusionable, por muchos identificadores que
tenga. Un documento entero puede caerse en este paso, y es mejor que se caiga
aquí.

**3 · Reclasifica todo desde cero.** No heredes las etiquetas de los documentos
de origen. Una afirmación que en un informe temático era un hecho central puede
ser una señal marginal en el informe fundido, porque el contexto cambió. Esto es
trabajo, y es el trabajo que da valor a fundir.

**4 · Deriva la estructura de la evidencia, no de los documentos fuente.**
Un capítulo por documento de origen produce un informe con costuras. Agrupa por
eje temático y deja que los documentos fuente se repartan entre capítulos.

**5 · Declara las lagunas que la fusión revela.** Cuando un tema aparece en un
documento y no en los otros, o cuando ninguno cubre algo que la estructura nueva
exige, eso es un `PENDING` y vale más que un párrafo de relleno.

Si los documentos fuente están fuera del repositorio, cópialos a
`content/reports/<informe>/sources/` antes de empezar. Lo que no está versionado
no es trazable.

---

## El flujo

### 1 · Corpus de evidencia

Escribe `tools/informes/<informe>/corpus-de-evidencia.md` a medida que investigas,
no al final. Es el cuaderno de trabajo: prosa, detalle, reservas.

Cada entrada necesita fuente con URL, fecha de consulta, y las tres
clasificaciones del método —tipo de fuente A–F, nivel demostrativo D1–D5 y estado
epistemológico—. La tabla de correspondencia con los cinco niveles del sitio está
en `docs/informes/07-puente-con-el-sitio.md`.

Guarda cada hallazgo en disco según lo encuentres. Una sesión que se corta no
debería costar más que el último bloque.

### 2 · Contenido

Copia `tools/informes/plantilla-informe-nuevo/` a `tools/informes/<informe>/`.
No empieces de cero ni clones el informe 02: la plantilla documenta cada tipo de
bloque con su propio contenido y compila tal cual.

Escribe en los `contenido-*.json`. Se concatenan por orden alfabético, así que
para insertar un capítulo entre dos existentes basta un sufijo de letra
(`contenido-04b.json`). Alfabético, no numérico: mantén el relleno a dos dígitos
que trae la plantilla, porque `contenido-9.json` se ordenaría después de
`contenido-10.json`.

### 3 · Figuras

Defínelas en `Graficos.ps1`. Diez tipos disponibles.

Dos cosas que separan una figura buena de una decorativa: el **titular enuncia el
hallazgo, no el tema** —«Usar la IA no es delegar en ella: dos curvas que se
separan», no «Uso de IA por estudiantes»— y el campo `fuente` es obligatorio,
porque una cifra sin procedencia viaja sola y termina citada por alguien.

No escribas el número de figura en ninguna parte. Se calcula al compilar.

### 4 · Compilar

```powershell
cd tools\informes\<informe>
..\motor\utf8bom.ps1 .
.\Graficos.ps1
.\Graficos.ps1 -PxScale 1.55 -OutDir figuras-web
..\plantillas\Build-Informe.ps1  -Titulo '...' -Subtitulo '...'
..\plantillas\Build-Artifact.ps1
```

El PDF sale abriendo el `.docx` en Word y exportando; el mismo paso actualiza el
índice, que es un campo y no texto. El procedimiento está en
`docs/informes/04-generador-docx.md`.

### 5 · Publicar

Cinco pasos, detallados en `docs/informes/07-puente-con-el-sitio.md`: copiar los
archivos a `public/descargas/` con la versión en el nombre, añadir la entrada a
`versions` en `src/data/reports.ts`, cargar fuentes y afirmaciones en
`src/data/research.ts`, enlazar `sourceIds` y `claimIds`, y comprobar que no
queda ningún identificador huérfano.

### 6 · Cerrar

`npm run verify`, actualizar `CHANGELOG.md`, y `docs/HANDOFF.md` si el estado
cambió. Si no puedes ejecutar la verificación —por ejemplo, en una máquina sin
Node— **decláralo en el changelog** en vez de omitirlo; el CI del repositorio la
corre igualmente en cada push a `main`.

---

## Lo que no se negocia

**Una versión publicada no se sobrescribe.** Se añade a `versions` con su
changelog. El historial es la prueba de que el informe está vivo.

**No se rellenan `sources` ni `claims` con datos de ejemplo.** Una matriz de
evidencia con relleno es peor que una vacía: la vacía es honesta.

**Existir no es implementar; implementar no es adoptar; adoptar no es
funcionar.** Cada afirmación lleva declarado qué prueba realmente. La mayor parte
de lo que se publica sobre estos temas demuestra solo lo primero, y decirlo es
la mitad del valor del informe.

**La ausencia de evidencia se registra.** No encontrar algo no prueba que no
exista. Un `PENDING` bien escrito vale más que diez `FACT` de relleno.

**Toda cifra lleva su advertencia de lectura**: qué mide exactamente, sobre qué
población, con qué sesgo conocido. Va en `notes` de la fuente y en `advertencia`
de la figura.

**La verificación de fuentes no se delega.** Redactar, ordenar, dibujar y
maquetar es trabajo de la cadena. Que un dato sea cierto es de quien firma. En el
informe 02 fue ese trabajo manual el que descubrió que el metaanálisis más citado
del campo había sido retractado tras 266 citas, y el que llevó a descartar varias
cifras muy difundidas cuyo origen no pudo rastrearse.

---

## Errores que ya se cometieron

Están aquí porque volverán a aparecer.

**Los `.ps1` sin BOM.** PowerShell 5.1 los lee como ANSI y los acentos se
corrompen en silencio: `·` pasa a `Â·`. El documento compila y sale mal impreso.
Ejecuta `motor/utf8bom.ps1` después de editar cualquier script.

**Las variables de PowerShell no distinguen mayúsculas.** `$T` y `$t` son la
misma. Un parámetro `$Scale` queda pisado por la variable interna `$SCALE` que
el `dot-source` inicializa después, sin dar ningún error.

**Numerar figuras a mano.** Produce que la figura 5 salga en segundo lugar. La
numeración automática existe justamente para eso.

**Renumerar capítulos en orden ascendente.** Se pisan entre sí. Hazlo
descendente, con marcador temporal, como está en
`docs/informes/05-modelo-de-contenido.md`.

**Dar por buenos los recuentos en prosa.** Un documento largo escrito por partes
acumula errores: «cinco de los seis casos» donde la tabla muestra cuatro. Antes
de cerrar, contrasta cada afirmación numérica contra la tabla que la sostiene;
el procedimiento está en `docs/informes/06-reproducir.md`.

**Identificadores huérfanos.** La interfaz filtra los `undefined`, así que un
`source_id` mal escrito no rompe el build: hace desaparecer una fuente sin
avisar. Compruébalo con el `comm` de `07-puente-con-el-sitio.md`.

---

## Si el encargo no encaja

Un informe de este proyecto es un documento versionado, con evidencia trazada y
publicación en el sitio. Si lo que se pide es una nota interna, un resumen de
lectura o un texto que no va a publicarse, no montes la cadena: escríbelo y ya.
La maquinaria vale la pena cuando el documento va a vivir, cambiar y ser citado.
