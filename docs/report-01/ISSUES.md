# ISSUES — Informe 01

Problemas abiertos. Uno se cierra cuando queda resuelto **en el repositorio**,
no cuando se entiende.

Estados: `OPEN` · `EN CURSO` · `CERRADO` · `BLOQUEADO`.

---

## ISSUE-001 — La verificación sustantiva de las 74 fuentes no está hecha

**Estado:** OPEN · **Impacto:** alto

Las 74 URL fueron abiertas por los modelos que produjeron los documentos de
investigación profunda, no por quien firma el informe. Que una URL responda no
prueba que diga lo que se le atribuye.

**Consecuencia mientras siga abierto:** ninguna fuente recibe `last_verified`,
ningún registro pasa a `ACEPTADO` y el informe no puede presentarse como informe
de resultados.

**Próximo intento:** verificar por universidad, en tandas, contrastando la
evidencia extraída contra lo que la página dice. Cinco comprobaciones por fuente:
lectura real, `published_date` frente a `fact_period`, unidad correcta,
anunciado frente a ejecutado, y advertencia de lectura en `notes`.

---

## ISSUE-002 — `src-udec-002` tenía el certificado TLS mal configurado

**Estado:** CERRADO el 04-09-2026 · **Impacto:** ninguno

**Cierre.** Al abrir la fuente en la verificación sustantiva, la página carga sin
error de certificado. El problema no se reproduce y `document_status` pasa de
`inaccesible` a `vigente`.

El cierre trajo un hallazgo mayor que el propio incidente: la organiza el **Centro
de Alumnas y Alumnos de Derecho Concepción**, no la Facultad. `ini-udec-002` se
reatribuye de `FACULTAD_DERECHO` a `ESTUDIANTIL`. Y la página declara «jueves 2 de
octubre» sin año, de modo que el 2025 del registro es inferencia a partir del día
de la semana, no dato publicado.

De paso quedó aclarada una confusión del relevo anterior: el respaldo en
`jur.udec.cl` que proponía buscar **es otra fuente**, `src-udec-001`, no un espejo
de ésta. Ambas quedan verificadas y son hechos distintos.

<details><summary>Diagnóstico original</summary>

`juridicasysociales.udec.cl` presenta un certificado que no cubre el nombre de
host (`SEC_E_WRONG_PRINCIPAL`). El dominio raíz falla igual. Con la verificación
desactivada la página responde: el contenido existe; lo roto es el certificado
del sitio de la Universidad de Concepción.

Importa más de lo que parece: quien siga el enlace desde el informe verá una
advertencia de seguridad, y es una de las cuatro fuentes de la UdeC.

**Próximo intento:** buscar el mismo hecho en `jur.udec.cl`, que sí responde
correctamente, y usarlo como fuente principal dejando ésta como respaldo.

</details>

---

## ISSUE-003 — `src-nacional-002` (base INDICES del CNED) rechaza la petición automatizada

**Estado:** OPEN · **Impacto:** medio

`cned.cl/institucional/bases-de-datos` devuelve `403` a una petición
automatizada. El sitio existe y es consultable desde un navegador.

Es la fuente propuesta para construir el universo nacional, de modo que sin ella
no puede fijarse cuántas carreras de Derecho hay en Chile ni qué proporción
cubre la cohorte de once.

**Próximo intento:** descargar la base manualmente desde un navegador y
versionar el archivo, no la URL.

---

## ISSUE-004 — Conflicto de fecha en `src-uchile-008`

**Estado:** OPEN · **Impacto:** bajo

El congreso internacional sobre IA en el derecho privado aparece fechado el
**09-06-2025** en `intento-2a` y el **27-05-2025** en `intento-3a`. Los dos
documentos citan la misma URL.

`published_date` queda vacío y `workflow_status` en `PROPUESTO` hasta abrir el
original. No se elige una de las dos fechas por mayoría.

---

## ISSUE-005 — Dos fuentes quedaron sin abrir por timeout

**Estado:** OPEN · **Impacto:** bajo

`src-puc-chile-009` (dirección del Programa de Derecho, Ciencia y Tecnología) y
`src-uchile-014` (Diploma para la Contraloría) constan en los documentos fuente
con la advertencia de que el original no llegó a abrirse. Quedan en `PROPUESTO`
y no en `FUENTE_ABIERTA`.

---

## ISSUE-006 — Falta el acto formal de creación de casi todas las unidades

**Estado:** OPEN · **Impacto:** alto

Nombre comunicacional y unidad administrativa formal no son lo mismo. Se
necesita resolución, organigrama o documento constitutivo de: Departamento de
Derecho y Tecnología UC, Dirección de IA y Derecho UDP, Programa IA & LegalTech
de la Central, Programa DIAT y LMIL de la PUCV, y la estructura de la Autónoma.

Del conjunto, sólo la UC tiene respaldo orgánico publicado
(`src-puc-chile-005`, estructura orgánica).

---

## ISSUE-007 — Los proyectos con financiamiento público no están verificados en ANID

**Estado:** OPEN · **Impacto:** medio

Fondecyt de la UAI (`src-uai-003`) y FONDEF de UANDES y PUCV
(`src-uandes-001`, `src-uandes-002`) constan por noticia universitaria. La
fuente gubernamental —código, monto, duración, investigadores— debe **sustituir**
a la nota de prensa, no complementarla.

---

## ISSUE-008 — Herramientas heredadas sin comprobación de vigencia

**Estado:** OPEN · **Impacto:** medio

`Docente iLex` y `IDEA UCEN` de la Universidad Central y `AyudantIA` de la UC
constan en el antecedente y en fuentes de 2025. Falta comprobar que siguen
operativas en 2026 antes de presentarlas como stock actual.

---

## ISSUE-009 — No existe línea base congelada de 2025

**Estado:** BLOQUEADO · **Impacto:** alto

El documento tratado como línea base histórica contiene actividades fechadas en
2026. Reconstruir un corte auténticamente congelado exige decidir qué se
considera «público al 31-12-2025», y esa decisión no puede tomarla una sesión
automática sobre un archivo que ya fue editado retrospectivamente.

**Requiere intervención humana.**

---

## ISSUE-010 — La integración curricular efectiva sigue sin evidencia en las once

**Estado:** OPEN · **Impacto:** alto

Hay mallas y anuncios. Faltan syllabus 2026 con obligatoriedad, semestre,
créditos y matrícula real. Sin eso, un taller optativo y una línea curricular
obligatoria se confunden. Alcanza a las once instituciones, no a una.

---

## ISSUE-011 — Word sigue dependiendo del equipo del autor

**Estado:** OPEN · **Impacto:** bajo · *reducido el 04-09-2026*

`tools/informes/motor/` usa PowerShell 5.1, System.Drawing y Word por COM, y por
tanto sólo corre en Windows con Word instalado.

**El PDF dejó de depender de eso.** Se imprime del HTML del propio paquete con
Chromium, desde `scripts/informe-01/07-exportar.mts`, de modo que documento y web
salen del mismo modelo y no pueden divergir. `playwright-core` es dependencia de
desarrollo y el navegador se toma del sistema —Chrome o Edge— o de
`CHROMIUM_PATH`. Si no hay ninguno, el paquete sale sin PDF, el manifiesto lo
declara y el sitio no dibuja el botón.

**Queda Word**, que es el único formato que aún exige el equipo del autor.

---

## ISSUE-012 — El móvil desbordaba por los `sr-only` de la matriz

**Estado:** CERRADO · 04-09-2026 · **Impacto:** medio

A 390 px la página del informe se desplazaba 363 px en horizontal. La causa no
era la tabla ancha, que ya vivía en un contenedor con desplazamiento propio,
sino los `sr-only` de sus celdas: se implementan con `position: absolute` y sin
un ancestro posicionado dentro del contenedor cada uno se colocaba respecto de
un bloque de más arriba, arrastrando el ancho del documento.

**Resuelto** con `relative` en los tres contenedores de tabla. Comprobado con
capturas a 390 y 1280 px y en modo impresión, en las dos rutas: desbordamiento
horizontal cero.

---

## ISSUE-013 — Cinco títulos del registro no eran los de la página

**Estado:** CERRADO el 04-09-2026 · **Impacto:** medio

La verificación encontró cinco fuentes cuyo `title` no coincidía con el titular
publicado. Dos de ellas cambiaban el sentido del registro:

- **`src-pucv-007`** figuraba como «Universidad presentó decálogo para el uso ético
  de la inteligencia artificial». La página se titula «Con gran participación de
  académicas y académicos se realizó Día de la IA»: el decálogo se presenta dentro
  de un evento y no es el objeto de la publicación. Y «sugiere recomendaciones»:
  es lineamiento, no política.
- **`src-ucentral-003`** figuraba por su URL, `legal-tech`. La página se titula
  «Programa de IA y LegalTech» y nombra la IA de forma explícita y reiterada. El
  registro subestimaba a la Universidad Central.

Los otros tres —`src-uchile-016`, `src-uandes-003`, `src-pucv-010`— eran títulos
truncados o parafraseados. Todos corregidos.

**Lección para el protocolo:** clasificar una unidad por el segmento de su URL es
una fuente de error sistemático, y el sesgo que produce no es aleatorio: penaliza
a las instituciones cuya página se investigó con menos detalle.

---

## ISSUE-014 — Cuatro fechas del registro no constaban en la fuente

**Estado:** CERRADO el 04-09-2026 · **Impacto:** medio

- `src-udec-004` (GenIA UdeC) traía `2026-02-10`. **La página no declara ninguna
  fecha.** Las actividades datadas que muestra son de enero de 2025.
- `src-uchile-015` (lineamientos de tesis) traía `2026` con precisión de año. **La
  página no declara fecha.**
- `src-ucentral-004` traía `FECHA_NO_DECLARADA`. La página **sí** declara
  27-08-2025: la precisión sube.
- `src-unab-004` traía `FECHA_NO_DECLARADA`. La página declara inicio el
  28-08-2026.

Dos fechas se borraron por falta de respaldo y dos se ganaron. El kit §14 es
explícito —«no se inventan día ni mes»— y el corpus lo había incumplido en dos
registros.

---

## ISSUE-015 — El LMIL cambió de unidad de dependencia entre 2022 y 2025

**Estado:** OPEN · **Impacto:** medio

`src-pucv-001` (2022) sitúa el Legal Management Innovation Lab en la **Dirección
de Incubación y Negocios de la PUCV**, una unidad central, y no menciona la
inteligencia artificial ni una vez: habla de transformación digital e innovación
legal. `src-pucv-011` (2025) lo describe como laboratorio «de la Escuela de
Derecho PUCV».

No es un error del registro: es un traslado orgánico documentado por dos fuentes
en fechas distintas, y el informe debe narrarlo como trayectoria en lugar de
elegir una de las dos versiones.

**Lo que falta:** el acto que formaliza el traslado. Sin él, la fecha en que el
LMIL pasa a depender de Derecho es desconocida.

---

## ISSUE-016 — La única medición de efecto del corpus está fuera de las Facultades

**Estado:** OPEN · **Impacto:** alto

`src-unab-003` publica, sobre MIAsistentes, «20% más aprobación» en estudiantes
que usaron la herramienta más de 30 veces, sobre más de 15.000 estudiantes y
450.000 interacciones desde 2024. Es la única de las 74 fuentes con una medición
de resultado.

No mueve `clm-cohorte-001` —que habla de evaluación de efecto sobre el
**aprendizaje jurídico**, y ésta es universitaria y no jurídica—, y además es
correlacional y no causal: quien usa una herramienta treinta veces ya se
diferencia de quien no la usa.

**Por qué importa igual:** lo más cercano al nivel 4 de la escalera que existe en
el corpus lo produjo una vicerrectoría de transformación digital, no una Facultad
de Derecho. El informe está obligado a discutirlo en lugar de esconderlo detrás
de la redacción afortunada de su propia afirmación.

**Próximo paso:** buscar la ficha metodológica de esa medición. Sin diseño,
muestra y control declarados, la cifra no es publicable como evidencia de efecto
ni siquiera fuera del ámbito jurídico.

---

## ISSUE-017 — El manifiesto de integridad fallaba al descargarlo de producción

**Estado:** CERRADO el 04-09-2026 · **Impacto:** alto

Los seis CSV del paquete v0.6.0 se publicaron con checksums que no cuadraban con
los bytes que servía Vercel. El paquete verificaba en el equipo del autor y
fallaba en cuanto alguien lo descargaba.

**Causa.** `core.autocrlf` está activo en este equipo. El exportador escribía los
CSV copiándolos del dataset canónico, que lleva CRLF, y calculaba el checksum
sobre esos bytes. Git los convertía a LF al guardarlos, y Vercel servía LF.
2568 bytes contra 2556: doce líneas, doce retornos de carro.

**Por qué no se vio antes.** El paquete de la v0.5.0 llegó a este repositorio
dentro de un *bundle*, que transporta los blobs tal cual: sus CSV conservaron
CRLF y su manifiesto cuadraba. El defecto apareció al regenerar el paquete y
guardarlo con git en un equipo con conversión activa.

**Cierre.** `.gitattributes` desactiva la conversión bajo `public/descargas/` y
en el dataset canónico. El exportador normaliza los CSV a LF al copiarlos, de
modo que el paquete usa un solo final de línea —el mismo del Markdown, el HTML y
el JSON— y su manifiesto describe bytes que no dependen del sistema operativo.
Tres pruebas nuevas comprueban que cada checksum cuadre con su archivo y que no
quede ningún CRLF en el paquete.

**Lección.** Comprobar el paquete en el disco donde se generó no comprueba nada:
hay que descargarlo de producción y ejecutar `sha256sum -c`. Un control de
integridad que falla es peor que no tenerlo, porque enseña a ignorarlo.

---

## ISSUE-018 — La verificación tiene su propio sesgo de cobertura

**Estado:** OPEN · **Impacto:** alto

Se verificaron 38 de 74 fuentes, pero **no repartidas**. El reparto real:

| Institución | Verificadas | Total | |
|---|---:|---:|---|
| pucv | 12 | 14 | 86% |
| udec | 3 | 4 | 75% |
| puc-chile | 8 | 12 | 67% |
| udp | 2 | 3 | 67% |
| ucentral | 2 | 4 | 50% |
| unab | 2 | 4 | 50% |
| uchile | 5 | 16 | 31% |
| uai | 1 | 3 | 33% |
| udd | 1 | 4 | 25% |
| uandes | 1 | 5 | 20% |
| **uautonoma** | **0** | **3** | **0%** |

El orden lo fijó la cola de prioridad, que es defendible: se contrastaron primero
las fuentes que sostienen afirmaciones con número explícito y las iniciativas del
peldaño 3. Pero el efecto compuesto no lo es tanto.

**Por qué importa, y es incómodo.** La PUCV ya estaba sobrerrepresentada por el
piloto de profundidad —14 fuentes frente a una media de 3,8 fuera de él— y ahora
además es la institución con mayor proporción verificada. Si un lector interpreta
«verificado» como «sólido», la PUCV aparece doblemente favorecida por decisiones
de método, no por evidencia.

La Universidad Autónoma no tiene ninguna fuente contrastada. Cualquier afirmación
que la involucre descansa íntegramente en la investigación previa.

**Qué hacer.** Antes de que la próxima versión publique cualquier comparación
institucional, o bien se equilibra la verificación —las diez restantes por encima
del 50%—, o bien el porcentaje verificado por institución se publica junto a la
comparación, del mismo modo que ya se publica la cobertura. Un indicador que
influye en cómo se lee una tabla no puede quedarse en un cuaderno interno.

**Siguientes por prioridad:** las tres de `uautonoma`, y después `uandes`, `udd`
y `uai`, que son las de menor proporción.

---

## ISSUE-019 — Verificación asistida frente a validación humana

**Estado:** OPEN · **Impacto:** alto · *decisión editorial pendiente*

DEC-108 sostenía que «la verificación sustantiva no se delega». DEC-111 la enmendó
apoyándose en el kit canónico, que define `CONTRASTADO` como una segunda revisión
de atribución, alcance y contraevidencia (§22) y encarga precisamente esa función
al auditor metodológico (§23). Bajo esa lectura, el contraste ejecutado en la
v0.6.0 es conforme al protocolo.

**Lo que la enmienda no resuelve.** Los 38 registros llevan `verified_by` con el
nombre del investigador firmante, por decisión del autor, pero quien abrió las
páginas y contrastó los siete campos fue un modelo. El dato es exacto en cuanto a
responsabilidad editorial y ambiguo en cuanto a ejecución. Nada en el dataset
permite hoy distinguir un registro contrastado por una persona de uno contrastado
con asistencia.

**Propuesta para la próxima sesión, a decidir por el autor:**

Un modelo puede abrir, leer, contrastar, registrar observaciones y proponer
correcciones. Lo que no debe es aparentar una validación humana que no ocurrió.
La forma limpia de sostener las dos cosas es separar el campo en dos:

- `contrasted_by` — quién ejecutó el contraste, con su naturaleza declarada.
- `accepted_by` — quién lo refrendó editorialmente, que sigue siendo humano y
  sigue siendo lo único que habilita `ACEPTADO`.

Con eso, la portada podría declarar dos cifras en lugar de una: cuántas fuentes
están contrastadas y cuántas refrendadas. Es más honesto y no cuesta rigor.

**No resolver esto en silencio.** Cambiar el significado de `verified_by` sin
declararlo reescribiría hacia atrás lo que afirma el corpus sobre sí mismo.

---

## ISSUE-020 — La clasificación de mecanismo es un juicio, y en un caso cambia el resultado

**Estado:** OPEN · **Impacto:** medio

`mechanism_type` reordena información ya verificada y no aporta evidencia nueva,
pero clasificar sigue siendo decidir. El caso que lo muestra es `ini-uai-001`.

El registro se llama «Laboratorio de Justicia Centrada en las Personas · curso de
IA para la Academia Judicial» y su `responsible_unit` es ese laboratorio, dentro
de la Facultad de Derecho UAI. La iniciativa registrada es **el curso**, no el
laboratorio, de modo que se clasifica como `PROGRAMA_FORMATIVO`.

**Consecuencia.** La UAI no tiene ninguna iniciativa `UNIDAD`, y como la ruta
`centros-laboratorios` tampoco se recorrió allí, su celda de «unidad
especializada» queda `NO_CONCLUYENTE`. El registro nombra el laboratorio y el
informe no puede acreditarlo como capacidad sin haberlo buscado.

El comportamiento es el correcto —el modelo hace exactamente lo que declara— y la
consecuencia es informativa. Pero un lector puede leer la celda como si el
laboratorio no constara, cuando consta en el campo de unidad responsable.

**Qué hacer.** Recorrer `centros-laboratorios` en la UAI y, si el laboratorio
tiene página propia o acto de creación, registrarlo como iniciativa `UNIDAD` con
su fuente. Es una consulta, no una decisión metodológica.

**Regla que no se toca mientras tanto:** no se crea una iniciativa a partir de un
campo de otra iniciativa. Eso fabricaría un registro sin fuente.

---

## ISSUE-021 — La regla de las rutas hereda la calidad de `routes_missing`

**Estado:** OPEN · **Impacto:** medio

DEC-119 hace que `routes_missing` deje de ser descriptivo y pase a ser normativo:
decide si una celda dice «no localizada» o «no concluyente», que son dos
afirmaciones distintas sobre una institución.

Ese registro proviene de la investigación previa y **no ha sido reverificado**. Si
una ruta figura como recorrida sin haberlo sido, la matriz declara una ausencia
que no puede sostener; si figura como pendiente habiéndose recorrido, la matriz
se calla donde podría hablar.

**Qué hacer.** Incluir `routes_missing` en el protocolo de verificación
sustantiva, como campo número ocho, y registrar en el cuaderno la consulta y el
dominio con que se recorrió cada ruta declarada como completa. Hoy el cuaderno
registra fuentes, no rutas.

**Mientras tanto:** la nota metodológica y el anexo del informe declaran que la
regla depende de este registro.

---

## ISSUE-022 — Dos conclusiones quedan abiertas donde su ruta no se recorrió

**Estado:** OPEN · **Impacto:** alto · **Es una autocorrección, no un defecto nuevo**

Aplicada DEC-119, dos de las siete conclusiones publicadas en la v0.6.0 dejan de
poder sostenerse con el mismo alcance:

| | Conclusión | Alcance que se mantiene | Alcance que se abre |
|---|---|---|---|
| C-4 | No hay línea curricular obligatoria documentada en ninguna de las once | Hecho sobre el corpus | `NO_CONCLUYENTE` en 6 de 11: no se recorrieron `malla-curricular` ni `programas-syllabus` |
| C-5 | Ninguna iniciativa acredita evaluación de efecto | Hecho sobre el corpus, con tres rondas independientes | `NO_CONCLUYENTE` en 9 de 11: no se recorrió `repositorios-publicaciones` |

C-5 es la conclusión principal del informe, de modo que conviene ser preciso
sobre qué se sostiene y qué no. **Se sostiene** que ninguna de las 53 iniciativas
registradas alcanza el cuarto peldaño, y eso es un hecho sobre el corpus que tres
rondas de investigación con documentos distintos confirmaron por separado. Se
sostiene además que la ruta 12 —noticias institucionales— se recorrió en las once,
y una Facultad que hubiera medido y publicado sus resultados casi con seguridad lo
habría anunciado. **No se sostiene**, en cambio, la forma institucional de la
afirmación: «esta Facultad no ha evaluado» exige haber mirado donde una evaluación
se publica.

**Qué hacer.** Recorrer `repositorios-publicaciones` en las nueve instituciones
que la tienen pendiente. Es la ruta con mayor rendimiento del protocolo en este
momento: cierra la conclusión principal del informe.

**No hacer.** No retirar C-5 ni rebajarla a hipótesis. El hecho sobre el corpus no
depende de las rutas: depende de los registros, y los registros están.


---

## ISSUE-023 — Los rótulos se pisan en el cruce de cobertura y capacidad

**Estado:** OPEN · **Impacto:** bajo · **Es estético, no metodológico**

La figura que cruza rutas recorridas contra capacidades en operación es la que
demuestra la tesis central del método —que trabajo de campo y capacidad son
variables distintas— y en el cuadrante bajo del gráfico cuatro nombres se
solapan: «U. de los Andes» con «U. Diego Portales», y «U. de Concepción» con
«U. del Desarrollo».

Las cuatro instituciones tienen pocas rutas recorridas y pocas capacidades
acreditadas, de modo que sus puntos caen cerca unos de otros. El rótulo se dibuja
siempre a la derecha del punto y a la misma altura, sin comprobar si ese espacio
está ocupado.

**Consecuencia.** La figura se lee y ningún dato está mal, pero cuatro de los once
nombres hay que adivinarlos. En la versión impresa el efecto es el mismo.

**Qué hacer.** Dar al rotulador una regla de colisión: si el rectángulo del texto
se cruza con uno ya dibujado, desplazarlo verticalmente o pasarlo al otro lado
del punto. Vive en el motor de gráficos —`src/lib/informe01-graficos.ts`—, de
modo que la corrección alcanza a la web, al HTML y al PDF a la vez.

**No hacer.** No mover los puntos: sus coordenadas son los datos.


---

## ISSUE-024 — El campo `direction` carga dos preguntas distintas

**Estado:** OPEN · **Impacto:** medio · **Afecta a la matriz de capacidades**

`direction` responde a «¿qué relación tiene esta iniciativa con la inteligencia
artificial?», con cuatro valores: la usa, la estudia como objeto jurídico, ambas,
o `ADYACENTE`.

Desde la v0.8.0 ese campo es normativo: decide si una iniciativa puede acreditar
una capacidad. Y al recorrer los siete registros adyacentes aparece que en al
menos uno el valor no responde esa pregunta sino otra. La nota de `[genIA]`, de
la Universidad de Concepción, lo dice con todas sus letras:

> «Programa interdisciplinario de toda la universidad. No es una estructura de
> Derecho: reclasificado ADYACENTE.»

«No es una estructura de Derecho» es un juicio sobre el **nivel institucional**,
que el registro ya guarda en `institutional_level` —y que ahí figura como
`INSTITUCIONAL_UNIVERSIDAD`—. Una herramienta que se llama *genIA* es
difícilmente adyacente a la inteligencia artificial.

**Consecuencia.** La celda de herramienta de la Universidad de Concepción dice
«sólo adyacente» cuando probablemente debería decir «sólo en el entorno». Las dos
son estados prudentes y ninguna afirma una ausencia, de modo que el error no
produce una afirmación falsa sobre la institución; pero clasifica mal, y con el
campo ya convertido en normativo eso importa más que antes.

**Qué hacer.** Revisar los siete registros `ADYACENTE` contra su fuente y
comprobar, uno por uno, que el valor responde a la pregunta sobre inteligencia
artificial y no a la pregunta sobre pertenencia a Derecho. Empezar por
`[genIA]`.

**No hacer.** No reclasificar en bloque sin abrir las fuentes. El reparto actual
—siete registros en cinco instituciones— es lo que hace que la regla no favorezca
a nadie, y tocarlo a ojo es justamente el riesgo que la regla existe para evitar.
