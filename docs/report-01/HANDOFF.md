# HANDOFF — Informe 01

Documento de relevo entre sesiones. **Léelo entero antes de tocar nada.** Está
escrito para que no necesites la conversación que lo produjo.

Actualizado: **04-09-2026** · versión **v0.8.0** · rama `informe-01/v0.8.0`

---

## A · Qué es esto y para quién

**«Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho
en Chile».** Un mapeo comparado de evidencia pública sobre once instituciones
chilenas, con fecha de corte al 1 de septiembre de 2026.

**Destinatario:** profesor **Eduardo Aldunate Lizana**. El documento debe servir
para una discusión institucional seria dentro de la PUCV, no para halagar ni para
acusar.

**Autor:** Diego Hernán Ojeda Cifuentes. No es una publicación oficial de la PUCV.

La pregunta que el informe existe para hacer discutible:

> Si la PUCV ya posee iniciativas relevantes y cierta continuidad, ¿hasta qué
> punto se han convertido en capacidades institucionales transversales,
> formalizadas, sostenibles y evaluables, frente a Facultades que ya desarrollan
> estructuras, gobernanza, currículo, adopción o cobertura?

---

## B · Estado actual

**v0.8.0, borrador académico para revisión.** En rama, **sin fusionar**. En
producción sigue la **v0.7.0**, que está publicada y **no se sobrescribe**: su
paquete se restauró byte a byte desde `main` al cortar esta versión (CLAUDE.md §8).

**Esta versión responde a un encargo de revisión mayor que está a medio camino.**
Lo que se hizo y lo que falta están en §C y en §H, y conviene leer las dos antes
de decidir nada: lo hecho cambia el método y lo que falta cambia el documento.

| | |
|---|---|
| Rama | `informe-01/v0.8.0` |
| Base | `e746963`, punta de `main` al empezar |
| HEAD | consúltalo con `git rev-parse HEAD`. Fijarlo aquí lo deja obsoleto en la fusión siguiente |
| Producción | https://aldunateexperimento02.vercel.app/informes/ia-escuelas-derecho-chile · **v0.7.0**, no la 0.8.0 |
| Fichas | `/informes/ia-escuelas-derecho-chile/instituciones` |
| **Preview** | uno por commit · se consulta, no se fija aquí |

**La URL del preview cambia con cada push**, porque Vercel emite un despliegue
inmutable por commit. Fijar una aquí la deja caduca en el push siguiente, que es
el mismo error que el HEAD de esta tabla. Se consulta así, sin necesidad de
credenciales de Vercel —el repositorio es público y GitHub guarda el despliegue—:

```bash
curl -s "https://api.github.com/repos/dojedacifuentes/aldunate_experimento02/deployments?per_page=5"
curl -s "https://api.github.com/repos/dojedacifuentes/aldunate_experimento02/deployments/<id>/statuses"
```

El `environment_url` del estado `success` es el preview de ese commit.

**Está detrás de la protección SSO de Vercel.** Se abre con la sesión del autor;
una petición anónima recibe un 302 a `vercel.com/sso-api`. Para comprobarlo desde
una sesión sin navegador autenticado, sirve el build de producción en local
—`npx next start -p 3100`— y adjunta el preview por URL: es el mismo commit y el
mismo build.

**Ramas preservadas en el remoto**, no borrar: `informe-01/v0.5.0` (`a1cc758`) y
`informe-01/borrador-aldunate` (`6dffd0f`).

**Datos, derivados del dataset y no de memoria:**

| | |
|---:|---|
| 11 | universidades (cohorte cerrada) |
| 74 | fuentes públicas únicas · 72 institucionales + 2 de universo nacional |
| **38** | **fuentes contrastadas (51%)** · sin cambios en esta versión |
| 53 | iniciativas deduplicadas, ahora también clasificadas por mecanismo |
| 75 | evidencias |
| 14 | afirmaciones · 10 FACT · 2 SIGNAL · 1 INFERENCE · 1 PENDING |
| 0 | registros `ACEPTADO` |
| 19 / 21 / 13 / **0** | iniciativas por peldaño 1 / 2 / 3 / **4** |
| **10 × 11 = 110** | **celdas de la matriz de capacidades** |
| 31 / 10 / 12 / **3** / 7 / **47** | en operación / incipiente / sólo entorno / **sólo adyacente** / no localizada / **no concluyente** |
| 3,7 : 1 | razón de cobertura piloto frente al resto |

**Validaciones al cierre:** typecheck en verde · lint 0 errores y 8 avisos
preexistentes del código donado del juego · **142 pruebas** · build de 18 rutas ·
paquete con PDF A4 de **72 páginas**, HTML, Markdown, seis CSV, JSON, manifiesto,
checksums y ZIP · **los once checksums verifican descargando desde producción**, que
es la comprobación que vale: en el disco donde se generó el paquete no prueba nada.

---

## C · Qué se hizo en esta sesión

### La revisión mayor, primera mitad

1. **Una iniciativa adyacente ya no acredita una capacidad de IA**, y hay un
   estado nuevo para decirlo sin fingir una ausencia: `SOLO_ADYACENTE`. Cinco
   celdas se mueven, ninguna de la PUCV. Lee la regla entera en
   `src/lib/informe01-capacidades.ts`: está documentada donde se aplica.
2. **La prosa dejó de exponer el proceso privado de elaboración.** El conflicto
   de interés se conserva en primera persona; el destinatario y los terceros
   nombrados, no. Una prueba lo vigila.
3. **El documento descargable adoptó el sistema editorial del Informe 02.**
4. **Se cortó la v0.8.0** y la v0.7.0 se restauró intacta.

### Lo anterior, de la v0.7.0

Sólo lo terminado.

1. **Metodología 2.1**, aditiva y documentada en
   `canonical/metodologia-v2.1.md`. La 2.0 se conserva íntegra.
2. **Eje de mecanismo** en `iniciativas.csv`: las 53 iniciativas clasificadas en
   nueve clases de instrumento institucional, con guarda en el compilador.
3. **Matriz de diez capacidades**, derivada por reglas mecánicas, con cinco
   estados y la regla de la ausencia: `NO_LOCALIZADA` frente a `NO_CONCLUYENTE`.
4. **Motor de gráficos** en funciones puras que devuelven SVG, compartido por el
   sitio y el exportador. Nueve figuras. El PDF tenía cero y ahora las tiene
   todas.
5. **Arquitectura editorial rehecha**: resumen ejecutivo y siete hallazgos antes
   de la introducción; fichas, matriz de dimensiones, afirmaciones, lagunas,
   auditoría y registro de fuentes a anexos.
6. **Sección PUCV** con mapa de desarrollo y comparador de mecanismos, e
   implicancias separadas de las conclusiones.
7. **Portada** del documento exportado, con marca gráfica derivada de los datos.
8. **Análisis de sensibilidad** publicado: cinco conclusiones intactas, dos
   matizadas, ninguna reforzada por el cambio de método.
9. **Quince pruebas nuevas** y una auditoría de consistencia entre dataset, web,
   HTML, Markdown y ficha, que quedó sin inconsistencias.
10. **Fe de erratas de la v0.6.0**: la ficha de cada institución declaraba «0
    fuentes con verificación sustantiva» y la nota metodológica sostenía que
    ninguna fuente llevaba fecha de verificación.
12. **Corrección de contraste.** La prosa del informe se pintaba con
    `text-muted`, que resuelve a `--muted`: el token de la superficie sobre la
    que se apoyan las tarjetas, no el de la tinta. 1,11 de contraste en el tema
    claro y 1,20 en el oscuro, sobre 152 elementos. Ver §J. De paso, las cifras
    escritas encima de una banda dejaron de usar `--background` y ahora nombran
    el tono sobre el que se dibujan.
11. **Pasada tipográfica sobre las cifras de la prosa**, terminada en la sesión
    siguiente. Cardinales en palabras hasta veinte, coma decimal y artículo
    delante del nombre institucional. Ninguna cifra deja de venir del dataset:
    cambia cómo se imprime. `resolverCifras` entiende ahora `{MarcaEnMayuscula}`
    y devuelve el valor capitalizado, que es lo que permite abrir frase con una
    cifra sin duplicar la clave en el recuento.

**Lo que NO se hizo:** ni una fuente nueva contrastada. El corpus es exactamente
el de la v0.6.0. Esta versión trabaja sobre el instrumento, no sobre los datos.

---

## D · Dónde están los datos

**Fuente de verdad, en este orden:**

| Qué | Ruta |
|---|---|
| Protocolo base, cohorte, vocabularios | `content/reports/.../canonical/kit-canonico-v1.0.0.md` |
| **Enmienda vigente del protocolo** | `content/reports/.../canonical/metodologia-v2.1.md` |
| **Los datos** | `content/reports/.../canonical/dataset/*.csv` |
| **La prosa** | `src/data/informe01-borrador.ts` · `informe01-pucv.ts` · **`informe01-hallazgos.ts`** |
| Bloques editoriales | `src/data/informe01-editorial.ts` |
| Capa tipada compilada | `src/data/informe01.ts` *(generada, no editar a mano)* |
| Selectores y cifras de la prosa | `src/lib/informe01.ts` |
| **Capacidades y mecanismos** | `src/lib/informe01-capacidades.ts` |
| **Motor de gráficos** | `src/lib/informe01-svg.ts` · `src/lib/informe01-graficos.ts` |
| Ficha del informe | `src/data/reports.ts` |
| Documentos de origen | `content/reports/.../sources/investigacion-profunda/` |
| Cuaderno de verificación | `tools/informes/informe-01/verificacion-p1-2026-09-04.md` |
| Cola de prioridad | `tools/informes/informe-01/prioridad-verificacion.json` |
| Compilador CSV → TS | `scripts/informe-01/06-compilar-a-typescript.mjs` |
| Exportador | `scripts/informe-01/07-exportar.mts` |
| Paquete | `public/descargas/informe-01-borrador-academico-v0.7.0/` |
| Componentes | `src/components/informe01/` |
| Página | `src/app/informes/[slug]/page.tsx` |

`content/research/source-registry.csv` pertenece al **Informe 02**.

---

## E · Decisiones metodológicas vigentes

Las veintitrés están en `DECISIONS.md`. Las que más veces se rompen:

- **DEC-102** · **ninguna comparación ordinal ni ranking** mientras la cobertura
  sea desigual. Ordenar mediría el trabajo de campo.
- **Cobertura de investigación ≠ capacidad institucional.** Desde DEC-119, la
  distinción vive dentro de cada celda y no en un aviso al pie.
- **Fuente ≠ evidencia ≠ iniciativa ≠ afirmación.**
- **DEC-105 · universidad ≠ Facultad.**
- **IA ≠ tecnología adyacente · anuncio ≠ ejecución · asistencia ≠ evaluación.**
- **DEC-109** · la escalera se aplica a la iniciativa y no se promedia.
- **DEC-111** · contrastar no es aceptar. `ACEPTADO` exige firma humana.
- **DEC-112** · los constructores en Python están congelados.
- **DEC-118** · metodología 2.1, aditiva. La 2.0 no se retira.
- **DEC-119** · una ausencia sólo informa si se recorrió su ruta.
- **DEC-120** · la verificación no entra en el estado de una capacidad.
- **DEC-121** · el cruce cobertura/capacidad se publica con tres guardas.
- **DEC-122** · hallazgos antes que método; fichas a anexo.
- **DEC-123** · un solo motor de gráficos, en funciones puras.

---

## F · Qué significa «verificación sustantiva»

Abrir la publicación original y contrastar **siete campos** contra el registro:
existencia y título literal; fecha declarada; unidad responsable; condición de
anuncio o de ejecución; cifras de cobertura; límites; respaldo efectivo de la
afirmación que sostiene.

**Hecho:** 38 fuentes, el 51%. **Pendiente:** 36, y **el reparto no es uniforme**
—PUCV 12/14, Universidad Autónoma 0/3—. Léelo en **ISSUE-018**.

**Restricción abierta:** los registros llevan `verified_by` con el nombre del
investigador firmante y el contraste lo ejecutó un modelo. **ISSUE-019** propone
separar `contrasted_by` de `accepted_by`. **No lo resuelvas en silencio.**

**Nuevo desde esta versión:** `routes_missing` dejó de ser descriptivo y pasó a
ser normativo —decide si una celda dice «no localizada» o «no concluyente»—, y
**ese registro no ha sido reverificado**. Ver ISSUE-021.

---

## G · Estado editorial: qué funciona y qué no

**Funciona.** La cadena de trazabilidad es recorrible de punta a punta. El
comparador principal responde la pregunta del informe y no la del trabajo de
campo. Los hallazgos llegan antes que el aparato. Las nueve figuras son idénticas
en web, HTML y papel porque salen de la misma función. Ningún número de la prosa
se escribe a mano. La sección PUCV compara mecanismos concretos y publica su
doble revisión.

**No funciona todavía, y es la misión siguiente:**

- **El corpus no ha crecido ni se ha verificado más.** Esta versión mejoró el
  instrumento; la siguiente tiene que mejorar los datos. Es la deuda principal.
- **47 de 110 celdas están sin concluir**, y la ruta que más rinde es
  `repositorios-publicaciones`: cierra la conclusión principal del informe en
  nueve instituciones (ISSUE-022).
- **La discusión y las conclusiones son las de la v0.6.0.** Se matizaron dos en
  la nota metodológica, pero el texto de la sección 4 no se reescribió a la luz
  de la capa de capacidades. Hay hallazgos nuevos —el fenómeno tiene dos años, la
  estructura precede a la norma, la transferencia es actividad aislada— que la
  discusión todavía no discute.
- **Las once fichas conservan su estructura anterior** salvo por el mapa de
  capacidades que se les añadió arriba. No se rediseñaron.
- **ISSUE-020**: la UAI aparece sin unidad especializada porque su laboratorio
  consta como unidad responsable y no como iniciativa propia.
- **ISSUE-023**: en el cruce cobertura/capacidad los rótulos se pisan en el
  cuadrante bajo —«U. de los Andes» con «U. Diego Portales», «U. de Concepción»
  con «U. del Desarrollo»—. La figura se lee, pero cuatro nombres hay que
  adivinarlos. No se tocó: el autor pidió revisar antes de rediseñar.

---

## H · Misión: terminar la revisión mayor

> **Falta la mitad, y es la mitad que se ve.**
>
> Lo hecho cambió el método y el envoltorio. Lo que falta cambia el documento, y
> el encargo lo enumera:
>
> 1. **Simplificar el modelo de diez capacidades a cinco o siete.** Hay una
>    consolidación natural en las cinco bandas que ya existen —estructura,
>    docencia, adopción, conocimiento, resultado—, y hay una trampa: fundir
>    `unidad` con `norma` destruye el hallazgo H-2, que dice que la estructura
>    se crea antes que la regla, y fundir `herramienta` con `adopcion` destruye
>    el H-4, que distingue disponer de adoptar. El modelo más parsimonioso es el
>    menor que conserve los hallazgos que la evidencia sostiene, no el menor.
> 2. **Reescribir la arquitectura editorial** para que la narrativa llegue antes
>    a las conclusiones y el aparato metodológico baje a anexos. El resumen
>    ejecutivo debe leerse en cinco minutos.
> 3. **Títulos declarativos en todas las figuras** y revisión de las tablas del
>    cuerpo: sintéticas arriba, completas en anexo.
> 4. **Llevar el sistema visual a la página del sitio**, que sigue con el tema
>    oscuro espacial mientras el documento ya es claro y editorial. Hoy no
>    parecen la misma publicación.
>
> Y sigue pendiente lo de siempre, que ninguna de estas cuatro resuelve: **el
> corpus no ha crecido**. 38 fuentes contrastadas de 74, y 47 celdas sin concluir
> porque su ruta no se recorrió. Ver ISSUE-022.

**Antes de tocar la matriz, lee ISSUE-024.** El campo `direction` acaba de
volverse normativo y en al menos un registro no responde la pregunta que dice
responder.

## I · Qué NO tocar sin causa declarada

- **Identificadores canónicos.** No se reutilizan ni se renombran.
- **La cohorte y la fecha de corte.**
- **Los datasets**, salvo por verificación con su registro en el cuaderno.
- **La metodología 2.0.** Está enmendada, no derogada, y su matriz se publica.
- **Las decisiones de atribución.** Reatribuir exige la fuente que lo justifica.
- **Lo verificado.** No rebajar `CONTRASTADO` sin motivo escrito.
- **La arquitectura de exportación.** PDF y web salen del mismo modelo.
- **El contrato de color de las figuras.** Ninguna escribe un color: nombran
  variables CSS que los dos huéspedes definen. Una prueba lo vigila.
- **Los SVG no llevan atributos de ancho ni de alto.** Con un alto automático el
  navegador recorta la matriz por abajo sin avisar de nada.
- **`.scroll { overflow: visible }` y `.g-caja { overflow: visible }` en `@media
  print`.** Es lo que evita que tablas y figuras se recorten en papel (ISSUE-012).
- **`.gitattributes`.** Sin él los checksums vuelven a fallar (ISSUE-017).
- **El historial de Git.** No reescribir, no forzar, no borrar ramas preservadas.
- **Los constructores en Python.** Congelados (DEC-112).

---

## J · Trampas de este repositorio

Cuestan tiempo y no son evidentes.

- **Los CSV canónicos usan CRLF** y `core.autocrlf` está activo. Antes de añadir
  una columna, comprueba que tu lector y tu escritor hacen un viaje de ida y
  vuelta byte a byte: si no, el diff tapa el cambio real.
- **El heredoc de Bash falla** con textos largos que llevan comillas y acentos.
  Los textos se escriben con Write, y los parches al código, con un script `.mjs`
  que se escribe con Write y se ejecuta con `node`. `node -e "..."` también se
  rompe con acentos y expresiones regulares.
- **Cuidado con los acentos graves dentro de plantillas de texto.** Un comentario
  de CSS con `` `algo` `` dentro del `html` del exportador cierra la plantilla y
  produce un error de sintaxis a cien líneas de distancia.
- **Comprobar un paquete en el disco donde se generó no comprueba nada.**
  Descárgalo por HTTP y ejecuta `sha256sum -c`.
- **No hay intérprete de Python.**
- **`preview_start` resuelve el `launch.json` de otro directorio.** Si devuelve
  `aldunate-attach`, está leyendo `Desktop\ALDUNEITOR\.claude\launch.json`, que
  sólo se ancla. Levanta `npm run dev` y adjunta el preview por URL.
- **Varias sesiones escriben este repositorio.** Consulta el remoto con
  `git ls-remote origin`, nunca `origin/main` local.
- **Matar el shell de `npm run dev` no mata Node.** Deja el puerto 3000 ocupado.
- **`text-muted` no es el color de un texto.** `--muted` es la superficie sobre
  la que se apoyan las tarjetas —#EDE8DD en claro, #142534 en oscuro— y
  `--muted-foreground` es la tinta. Las clases de Tailwind que salen de los dos
  se distinguen en un sufijo, y escribir la primera pinta la letra del color del
  papel: 1,11 de contraste. **No rompe nada**: el texto sigue en el DOM, lo lee
  un lector de pantalla y sale en el buscador; sólo no se ve, y ni el typecheck
  ni el lint ni las pruebas lo notan. Estuvo así toda la prosa del informe. Hay
  una prueba que lo vigila en los cinco componentes; no la quites.
- **El contraste se mide, no se mira.** Un color se juzga contra el fondo
  *efectivo*, y media interfaz usa fondos translúcidos —`bg-muted/60`— que hay
  que componer antes de calcular. Medir contra el fondo declarado da falsos
  positivos a montones.

---

## K · Cómo empezar

```bash
git fetch origin && git log --oneline -5
cat docs/report-01/progress.json
sed -n '1,80p' content/reports/01_ia_escuelas_derecho_chile/canonical/metodologia-v2.1.md
npm run verify
```

No repitas las fases 0 a 6: están cerradas y sus decisiones están en
`DECISIONS.md`. El detalle de lo pendiente está en `TASKS.md` y `STATUS.md`.
