# 07 · Puente con el sitio

Cómo un informe producido en `tools/informes/` termina publicado en este sitio,
y por qué la evidencia vive en dos sitios a la vez sin contradecirse.

---

## Las dos representaciones

La misma evidencia existe en dos formas, y cada una sirve para algo distinto:

| | Dónde | Para qué |
|---|---|---|
| **El corpus** | `tools/informes/informe-XX/corpus-de-evidencia.md` | Cuaderno de trabajo. Se escribe durante la investigación, en prosa, con todo el detalle |
| **La capa tipada** | `src/data/research.ts` | Lo que el sitio muestra. Estructurado, enlazado y auditable desde la interfaz |

El corpus es el borrador; la capa tipada es la publicación. **La dirección del
flujo es siempre corpus → capa tipada, nunca al revés.** Si un dato cambia, se
corrige primero en el corpus.

---

## Traducción entre los dos vocabularios

El informe clasifica cada hallazgo en tres ejes independientes. El sitio usa un
solo eje de cinco niveles. La correspondencia no es mecánica y conviene hacerla
a conciencia, porque es donde se pierde o se conserva el rigor.

| En el informe | En el sitio | Criterio |
|---|---|---|
| VERIFICADO + nivel demostrativo D4 o D5 | `FACT` | Hay medición o causalidad, y es comprobable abriendo la fuente |
| VERIFICADO + D1, D2 o D3 | `FACT` | Existencia, implementación o adopción documentada en fuente citable |
| REPORTADO | `SIGNAL` | Lo afirma la institución o el proveedor sobre sí mismo, sin verificación externa |
| Conclusión analítica del informe | `INFERENCE` | La cadena de razonamiento queda explícita en la nota |
| CONTROVERTIDO | `HYPOTHESIS` | Hay resultados contradictorios; se publica como pregunta |
| NO DEMOSTRADO | `PENDING` | Se identificó la necesidad del dato y no se obtuvo |

**El caso que más importa es el último.** Un `PENDING` bien escrito vale más que
diez `FACT` de relleno: registra que se buscó y no se encontró, que es
información, frente a no decir nada, que no lo es. En el informe 02 los dos
`PENDING` son los que más dicen: no existe evidencia independiente de que los
despliegues masivos mejoren el aprendizaje, y no se localizó rediseño evaluativo
publicado en facultades chilenas.

### La regla que no se negocia

`sources` y `claims` no se pueblan con datos de ejemplo. Una matriz de evidencia
con relleno es peor que una vacía: la vacía es honesta. Si un informe todavía no
tiene fuentes verificadas, sus arrays se quedan como estaban.

---

## Publicar una versión

Cinco pasos. Ninguno es opcional.

### 1 · Compilar el documento

```powershell
cd tools\informes\informe-XX
..\motor\utf8bom.ps1 .
.\Graficos.ps1
.\Graficos.ps1 -PxScale 1.55 -OutDir figuras-web
..\plantillas\Build-Informe.ps1
..\plantillas\Build-Artifact.ps1
```

El PDF se genera abriendo el `.docx` en Word y exportando; el mismo paso
actualiza el índice, que es un campo y no texto.

### 2 · Copiar los archivos a `public/descargas/`

Una carpeta por versión, con el número en la carpeta y en cada archivo:

```
public/descargas/informe-01-v2.0.0/
  informe-01-v2.0.0.pdf
  informe-01-v2.0.0.docx
  informe-01-v2.0.0.html
  complemento-pucv-v1.0.pdf        ← documentos que acompañan
  datos/matriz-v2.json             ← datos que el documento cita
```

El versionado en el nombre es lo que permite que una versión anterior siga
descargable cuando se publique la siguiente. Las carpetas anteriores a esta
convención —`informe-01-borrador-academico-v0.8.0/`— **no se renombran**: hay
enlaces circulando hacia ellas.

Y no toques `.gitattributes`: `public/descargas/** -text` desactiva la
conversión de fin de línea para lo que se publica, porque los checksums se
calculan sobre los bytes que escribe el exportador.

### 3 · Añadir la versión en `src/data/reports.ts`

**Nunca sobrescribir una entrada existente.** Se añade a `versions`, y con eso
la versión queda publicada, legible en línea y descargable: **ninguna pantalla
se toca**. El raíl de versiones, la ruta `/v/<versión>`, el historial y la
sección de descargas se derivan de esta entrada.

```ts
{
  version: '2.1.0',
  date: '2026-10-01',
  status: 'publicado',
  // La frase del raíl. Sin ella, el selector es una lista de números y hay que
  // abrir tres para encontrar la que se busca.
  headline: 'Qué distingue a esta versión, en una línea',
  summary: 'Dos o tres frases sobre su alcance.',
  pages: 40,
  reading: 'documento',
  pdf: '/descargas/informe-01-v2.1.0/informe-01-v2.1.0.pdf',
  html: '/descargas/informe-01-v2.1.0/informe-01-v2.1.0.html',
  // Las cifras van aquí y nunca en el informe: son las que este documento
  // sostiene, y la versión anterior sostenía otras.
  figures: [
    { value: '74', unit: '/74', label: '100 % del corpus', note: 'Qué cuenta exactamente.' },
  ],
  changelog: ['Qué cambió, en frases que un lector externo entienda.'],
  artifacts: [
    { format: 'PDF', label: 'Leer o imprimir', href: '…', description: '…' },
  ],
  // Sólo si un documento acompaña a la versión sin sustituirla.
  companions: [],
}
```

`pdf` y `html` solo se rellenan si el archivo existe, y lo mismo cada `href` de
`artifacts`. Un botón que promete un documento inexistente es peor que no tener
botón, y desde la v2.0.0 **hay una prueba que lo comprueba contra el disco**:
`src/lib/informes.test.ts` abre `public/` y falla si falta cualquiera. Ya no
depende de que quien publica se acuerde.

#### La capa de lectura

Un documento con `reading: 'documento'` tiene que llevar la capa de lectura en
pantalla, o se sirve como una columna de papel de 210 mm. Se genera con
`npm run informe:lector` desde el original guardado en `content/.../entregas/`,
y hay una prueba que falla si falta. El método está en
[08 · El lector en línea](08-lector-en-linea.md).

#### Los tres campos que deciden la experiencia

| Campo | Qué gobierna |
|---|---|
| `reading` | `documento` muestra el HTML autónomo dentro del sitio; `nativo` lo reconstruye desde `src/data`; `ninguna` deja sólo las descargas. Por omisión, `documento` si hay `html` |
| `figures` | Las cifras que se pintan junto al número de versión. Se anima sólo lo que es un entero |
| `companions` | Documento que acompaña sin sustituir. Exige `rationale`: por qué existe por separado |

#### Qué versión es la vigente

**La de número mayor, no la última por fecha.** El Informe 01 publicó la v0.7.0
y la v0.8.0 el mismo día y el orden pasaba a depender de cómo estuviera escrito
el arreglo. Lo resuelve `compareVersions` en `src/lib/informes.ts`, y de ahí
salen `currentVersion`, `sortedVersions` e `historicVersions`. No ordenes
versiones a mano en una pantalla nueva: importa el helper.

#### Dónde queda la versión anterior

Donde estaba. Su ruta `/informes/<informe>/v/<versión>` sigue funcionando, sus
archivos siguen en `public/descargas/`, y el lector le pone encima —antes del
documento y no al pie— el aviso de que fue superada, con enlace a la vigente.
**No se retira nada al publicar una versión nueva.**

### 4 · Cargar fuentes y afirmaciones en `src/data/research.ts`

Cada fuente necesita como mínimo `id`, `title`, `organization`, `url`,
`accessedDate` y `notes`. El campo `notes` no es decorativo: es donde vive la
advertencia de lectura, y sin ella la cifra viaja sola.

Cada afirmación necesita `classification`, `sourceIds` y `lastVerified`.

### 5 · Enlazar desde el informe

Poblar `sourceIds` y `claimIds` en la entrada del informe. Antes de dar por
terminado, comprobar que no queda ningún identificador huérfano:

```bash
grep -o "id: '\(src\|clm\)-[a-z0-9-]*'" src/data/research.ts \
  | sed "s/id: '//; s/'//" | sort -u > /tmp/definidos.txt
grep -oE "'(src|clm)-[a-z0-9-]*'" src/data/reports.ts \
  | tr -d "'" | sort -u > /tmp/usados.txt
comm -13 /tmp/definidos.txt /tmp/usados.txt   # referenciado sin definir → rompe la página
comm -23 /tmp/definidos.txt /tmp/usados.txt   # definido y sin usar → probablemente un olvido
```

La página filtra los `undefined`, así que un identificador huérfano no rompe el
build: simplemente hace desaparecer una fuente sin avisar. Por eso conviene
comprobarlo a mano.

**Dos detalles del comando que no son cosméticos**, y que costaron una falsa
alarma el 01-09-2026:

- **`sort -u` en los dos lados.** `comm` exige entrada única, y un mismo
  identificador aparece legítimamente dos veces en `reports.ts`: una en
  `claimIds[]` y otra en `claimChanges[].claimId`. Sin `-u`, el duplicado se
  reporta como huérfano y manda a buscar un problema que no existe.
- **El patrón no lleva coma final.** Exigirla haría invisible al último elemento
  de un array escrito sin coma de cierre. Ése sería un falso negativo —silencioso,
  y por tanto peor que la falsa alarma.

Un comprobador que se equivoca enseña a ignorarlo, y entonces deja de servir el
día que acierte.

---

## Antes de cerrar

```bash
npm run verify   # typecheck + lint + tests + build
```

Y actualizar `CHANGELOG.md`. Si no se pudo ejecutar la verificación —por ejemplo,
por trabajar en una máquina sin Node— **se declara en el changelog** en lugar de
omitirlo. El build de Vercel funciona entonces como red: no despliega un build
roto, así que el sitio publicado nunca queda peor que antes.

---

## Lo que no se automatiza

La verificación de fuentes. La cadena de producción redacta, ordena, dibuja y
maqueta; que un dato sea cierto sigue siendo responsabilidad de quien firma.

En el informe 02 ese trabajo manual fue el que descubrió que el metaanálisis más
citado del campo había sido retractado en abril de 2026 tras 266 citas, y el que
llevó a descartar varias cifras muy difundidas cuyo origen no pudo rastrearse
hasta una fuente primaria. Ninguna de las dos cosas la habría detectado un
proceso automático.
