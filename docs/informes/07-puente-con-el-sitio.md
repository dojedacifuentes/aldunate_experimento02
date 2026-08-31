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

Con el número de versión en el nombre, siempre:

```
informe-XX-<slug>-v0.2.0.pdf
informe-XX-completo-v0.2.0.html
```

El versionado en el nombre es lo que permite que una versión anterior siga
descargable cuando se publique la siguiente.

### 3 · Añadir la versión en `src/data/reports.ts`

**Nunca sobrescribir una entrada existente.** Se añade al final de `versions`:

```ts
{
  version: '0.2.0',
  date: '2026-08-31',
  status: 'en-revision',
  pdf: '/descargas/informe-02-transformacion-ensenanza-v0.2.0.pdf',
  html: '/descargas/informe-02-completo-v0.2.0.html',
  changelog: [
    'Qué cambió, en frases que un lector externo entienda.',
  ],
}
```

`pdf` y `html` solo se rellenan si el archivo existe. La ficha del informe
comprueba su presencia antes de dibujar el botón: un botón que promete un
documento inexistente es peor que no tener botón.

### 4 · Cargar fuentes y afirmaciones en `src/data/research.ts`

Cada fuente necesita como mínimo `id`, `title`, `organization`, `url`,
`accessedDate` y `notes`. El campo `notes` no es decorativo: es donde vive la
advertencia de lectura, y sin ella la cifra viaja sola.

Cada afirmación necesita `classification`, `sourceIds` y `lastVerified`.

### 5 · Enlazar desde el informe

Poblar `sourceIds` y `claimIds` en la entrada del informe. Antes de dar por
terminado, comprobar que no queda ningún identificador huérfano:

```bash
grep -o "id: '\(src\|clm\)-[a-z0-9-]*'" src/data/research.ts | sed "s/id: '//; s/'//" | sort > /tmp/definidos.txt
grep -o "'\(src\|clm\)-[a-z0-9-]*'," src/data/reports.ts | sed "s/'//g; s/,//" | sort > /tmp/usados.txt
comm -13 /tmp/definidos.txt /tmp/usados.txt   # referenciado sin definir → rompe la página
comm -23 /tmp/definidos.txt /tmp/usados.txt   # definido y sin usar → probablemente un olvido
```

La página filtra los `undefined`, así que un identificador huérfano no rompe el
build: simplemente hace desaparecer una fuente sin avisar. Por eso conviene
comprobarlo a mano.

---

## Antes de cerrar

```bash
npm run typecheck && npm run lint && npm run build
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
