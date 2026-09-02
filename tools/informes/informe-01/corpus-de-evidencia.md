# Corpus de evidencia · Informe 01

**IA en Escuelas y Facultades de Derecho de Chile**
Cuaderno de trabajo. Se escribe durante la investigación, no al final.

- **Fecha de corte:** 01-09-2026
- **Fecha de consulta de todas las fuentes:** 01-09-2026
- **Estado:** fusión de tres documentos de investigación profunda. Pasos 1 a 5 del
  procedimiento cerrados. **Ninguna afirmación elevada a publicable todavía.**
- **Documentos fuente versionados en:**
  `content/reports/01_ia_escuelas_derecho_chile/sources/investigacion-profunda/`

---

## Paso 1 · Inventario de fuentes, no de textos

Tres documentos entraron a la fusión. Solo dos aportan fuentes fusionables.

| Documento | Registros | Fuentes con URL resoluble |
|---|---|---|
| `intento-1_establecimiento-y-piloto` | 25 `source_id` declarados | **0** |
| `intento-2a_piloto-tres-universidades` | 24 | 24 |
| `intento-2b_barrido-once-universidades` | 23 | 23 |

**Total de registros: 47. Fuentes únicas tras deduplicar: 43.**

### El primer intento no pasa el paso 1

Declara veinticinco fuentes con identificador propio y **ninguna tiene URL**. Sus
referencias son marcadores del tipo `citeturn18search0`: tokens internos del
índice de búsqueda del modelo que las produjo, no direcciones que un tercero
pueda abrir. El documento contiene cero cadenas `http`.

El paso 1 del método existe justamente para detectar esto: *las fuentes con URL y
fecha son lo único que se puede fusionar sin perder nada*. Un `source_id` que no
resuelve no es una fuente, es una promesa de fuente. Y `CLAUDE.md` §7 exige la
cadena completa `fuente → evidencia → dato`, sin eslabones implícitos.

**Decisión: el primer intento no se funde. Queda archivado como antecedente.**
No se descarta —sus hipótesis pueden volver a probarse contra fuentes reales—
pero no aporta ni un dato publicable. Los dos documentos del segundo intento
cubren las mismas tres instituciones con URL, fecha y estado documental.

Esto coincide con lo que el propio segundo intento declara sobre su antecedente:
que no puede conservarse como base cuantitativa válida sin reconstrucción, por
inconsistencias aritméticas, mezcla de IA con materias adyacentes y uso de una
escala distinta de la matriz 0–4.

---

## Paso 2 · Deduplicar y arbitrar

### 2.1 · Los dos documentos del segundo intento son complementarios, no rivales

Es la primera decisión, y la que evita fundirlos mal:

- **`intento-2a`** es un **piloto en profundidad** sobre tres universidades:
  PUCV, PUC y Universidad de Chile.
- **`intento-2b`** es un **barrido inicial** sobre las once de la cohorte.

No compiten: se cruzan solo en las tres del piloto. Tratarlos como dos versiones
del mismo trabajo —y quedarse con la más reciente— habría descartado el barrido
de ocho universidades enteras.

### 2.2 · Cuatro fuentes duplicadas, con dos identificadores cada una

Cuatro URL aparecen en ambos documentos con identificador distinto. Es el caso
canónico del paso 2: **la misma fuente vista dos veces, con lecturas distintas.**

| Fuente | En el piloto | En el barrido | Lecturas |
|---|---|---|---|
| Guía ética IA generativa, Derecho UC, 21-08-2026 | `SRC-puc-chile-005` | `PROP-PUC-001` | «gobernanza específica de Facultad» vs. «actualiza `ANT-PUC-USO-INTERNO`; señal formal más fuerte» |
| Decálogo IA en docencia PUCV, 09-01-2026 | `SRC-pucv-007` | `PROP-PUCV-002` | «gobernanza universitaria y vínculo con Derecho» vs. «**contradice parcialmente** la frase heredada *no se identifican lineamientos formales*» |
| Fondos VcM Derecho PUCV, 03-06-2026 | `SRC-pucv-006` | `PROP-PUCV-001` | «renovación/fondos 2026» vs. «confirma y amplía LMIL/DIAT; adjudicación competitiva interna» |
| Diploma Derecho e IA, U. de Chile, 2.º sem. 2026 | `SRC-uchile-003` | `PROP-UCH-001` | «continuidad de oferta» vs. «confirma continuidad; **sustituye** la dependencia en versiones 2022/2023 como única prueba» |

**Arbitraje:** se conserva un solo identificador por fuente, y **la lectura del
barrido prevalece en los cuatro casos**, porque en los cuatro dice algo más
fuerte: no solo qué prueba la fuente, sino **qué afirmación anterior corrige**.
La lectura del piloto se conserva en `notes`. Que dos investigaciones leyeran la
misma fuente con distinto alcance es información sobre la solidez del dato, y se
registra en vez de disolverse.

Caso aparte: `SRC-uchile-002` y `SRC-uchile-003` **no** son duplicados. Sus URL
difieren en una partícula —`diploma-en-derecho-e-inteligencia-artificial` frente
a `diploma-derecho-e-inteligencia-artificial`— y corresponden a las versiones de
2022 y de 2026. Fundirlas habría borrado la prueba de continuidad, que es
precisamente lo que aportan juntas.

### 2.3 · El conflicto de alcance, que no se integra en silencio

Los dos materiales metodológicos se dan órdenes incompatibles:

- El antecedente exigía **ampliar** el universo más allá de las once
  universidades y empezar con un piloto de tres.
- El manifiesto vigente ordena **mantener cerrada** una cohorte longitudinal de
  once.

El segundo intento lo registró como conflicto documental y se negó a resolverlo
por su cuenta. **Aquí se resuelve así:** la cohorte de once queda cerrada, porque
es la única forma de que las comparaciones entre años signifiquen algo; el piloto
de tres se conserva **como profundidad, no como universo**. Es decir: once
universidades en la matriz, tres con evidencia densa. Y esa asimetría se declara
en vez de disimularse — ver el paso 5.

### 2.4 · Colisión de atribución: universidad no es facultad

Aparece tres veces y ninguna de las tres es una fuente contra otra, sino una
fuente contra la tentación de sobreleerla:

- **UANDES `PROP-UANDES-002` (DOMus AI):** lo desarrollan el CET e Ingeniería. Es
  IA aplicada a regulación, pero **la unidad principal no es Derecho**.
- **PUC `SRC-puc-chile-006` (AyudantIA):** infraestructura central de la universidad;
  su alcance sobre Derecho está pendiente.
- **PUCV `PROP-PUCV-002` (decálogo):** prueba lineamiento **universitario**, no
  política propia de la Escuela de Derecho.

**Arbitraje:** se atribuyen a la universidad, nunca automáticamente a la
facultad. Es el mismo salto que prohíbe `CLAUDE.md` §7, aplicado a la unidad
académica en vez de a la tendencia.

---

## Paso 3 · Reclasificar desde cero

Sin heredar etiquetas. Los tres documentos dejaron **todo** en `PROPUESTO` y
ninguno elevó nada a `ACEPTADO`; esa prudencia se respeta y se traduce al eje de
cinco niveles del sitio.

### Regla de traducción aplicada

| Situación en el corpus | Nivel del sitio |
|---|---|
| Documento oficial que prueba **existencia** de una estructura, guía o programa | `FACT` |
| La institución describiéndose a sí misma sin verificación externa | `SIGNAL` |
| Currículo **anunciado** pero no acreditado como ejecutado | `SIGNAL` |
| Conclusión analítica sobre posiciones relativas | `INFERENCE` |
| Dato buscado y no hallado | `PENDING` |

### Degradaciones respecto de la lectura de los documentos fuente

**UDD `PROP-UDD-001` → `SIGNAL`.** La malla declara «LegalTech + IA» con talleres
propios, pero la página está orientada a **Admisión 2027**. Prueba diseño
curricular anunciado, no curso dictado. El propio documento lo advierte y la
advertencia se conserva.

**UDP `PROP-UDP-001` → `SIGNAL` en lo curricular, `FACT` en lo orgánico.** El
nombramiento de una Dirección de IA y Derecho está documentado; los cambios de
malla que anuncia, no. Se parte el registro en dos en vez de promediarlo.

**UAI `PROP-UAI-002` (convenio Legu) → `SIGNAL`.** Hay convenio firmado y
fechado. No hay evidencia pública de cobertura estudiantil, productos ni
resultados. Existir no es funcionar.

**UANDES `PROP-UANDES-002` → `SIGNAL`, y atribuido a la universidad.** Ver 2.4.

### La única contradicción empírica encontrada

**U. Autónoma:** el antecedente registraba `ANT-UAUT-USO=0` —ausencia de uso
interno—. La fuente de 27-05-2026 documenta talleres que alcanzan cerca del 80 %
del cuerpo docente de Derecho en Santiago, Talca y Temuco, más una segunda etapa
hacia estudiantes, y otra de 10-08-2026 documenta un programa de 18 semanas en
Clínicas Jurídicas en las tres sedes.

**La afirmación heredada de ausencia ya no es sostenible.** Queda como `FACT` que
la capacitación ocurrió; queda `PENDING` cuántos docentes implementaron después
actividades en sus cursos, que es lo que separa capacitar de adoptar.

---

## Paso 4 · Estructura derivada de la evidencia

Un capítulo por universidad daría once fichas y ninguna tesis. Un capítulo por
documento fuente daría dos capítulos con costura. La evidencia se agrupa sola en
otra cosa:

1. **De la actividad a la estructura.** El eje que la propia evidencia hace
   visible: Departamento de Derecho y Tecnología en la UC, Dirección de IA y
   Derecho en la UDP. Son señales distintas de una sucesión de seminarios.
2. **La adopción interna dejó de ser una casilla vacía.** UNAB con asistentes en
   cursos nombrados, U. Central con `Docente iLex` y métricas de uso, U. Autónoma
   con cobertura docente y clínicas, Derecho UC con guía ética propia.
3. **Gobernanza: universitaria antes que facultativa.** Decálogo PUCV, guía UC,
   lineamientos U. de Chile para tesis. Quién dicta la regla importa tanto como
   la regla.
4. **Formación especializada y su continuidad.** Diplomas UC y U. de Chile con
   graduaciones sucesivas documentadas: es el único eje donde hay serie temporal.
5. **Lo que la evidencia pública no alcanza a mostrar.** El paso 5.

---

## Paso 5 · Lagunas que la fusión revela

**L-1 · La cobertura es desigual por diseño, y eso impide cualquier ranking.**
Tras deduplicar, el reparto es:

| Universidades | Fuentes por institución |
|---|---|
| PUCV, U. de Chile, PUC | **9 cada una** |
| UDP, UANDES, UAI, UNAB, UDD, U. Autónoma, U. Central, UdeC | **2 cada una** |

Las tres del piloto tienen cuatro veces y media más evidencia que las otras ocho.
**Esa diferencia mide esfuerzo de investigación, no actividad institucional.**
Publicar una comparación nacional sobre esta base produciría un ranking del
trabajo de campo disfrazado de ranking de universidades.

La metodología declarada del Informe 01 ya lo prohíbe: *los datos agregados se
publican solo cuando la cobertura permite interpretarlos sin sesgo de
disponibilidad*. **No se emiten conclusiones sobre tendencias nacionales.** El
informe publica once fichas y ninguna tabla de posiciones hasta igualar
cobertura.

**L-2 · La posición relativa de la PUCV no puede sostenerse con lo que hay.** El
puntaje 3,25 del antecedente proviene de un documento sin fuentes resolubles y no
se hereda. La evidencia nueva de 2026 le es favorable —fondos VcM adjudicados,
ejecución desde DIAT y LMIL, workshop internacional, marco institucional de
integridad—, pero no se encontró evidencia pública comparable a la UDP sobre
autoridad de facultad con mandato curricular transversal, a UNAB sobre asistentes
desplegados en asignaturas nombradas, a U. Autónoma sobre cobertura docente
masiva, ni a U. Central sobre herramienta con métricas de uso.

Eso es una **`INFERENCE` provisional y se publica rotulada como tal**, nunca como
hallazgo. Y arrastra la advertencia de L-1: la PUCV es una de las tres con nueve
fuentes, así que la comparación se hace desde una posición de información
privilegiada sobre ella.

**L-3 · Cuatro fuentes prueban anuncio, no ejecución.** UDD (malla 2027), UDP
(cambios curriculares anunciados), UAI (convenio sin resultados), UANDES (FONDEF
en curso). Verificar ejecución es la siguiente ronda, no una nota al pie.

**L-4 · Ninguna fuente mide efecto sobre el aprendizaje jurídico.** Todo el
corpus documenta existencia, implementación y adopción. Nada mide si funciona.
Ese vacío es lo que el Informe 02 cubre con evidencia internacional, y es la
costura por la que los dos informes se enlazan en vez de duplicarse.

**L-5 · La verificación de fuentes sigue pendiente y no se delega.** Las 43 URL
fueron abiertas por el modelo que produjo los documentos, no por quien firma. El
Informe 02 aprendió esto por las malas: fue la verificación manual la que
descubrió que el metaanálisis más citado del campo estaba retractado, y la que
encontró la corrección de PNAS sobre Bastani que la v0.2.0 no mencionaba.

---

## Estado tras la ronda 1

- Pasos 1 a 5 cerrados sobre 43 fuentes.
- Antes de redactar: verificar esas 43 URL una por una, con `last_verified`
  propio. Una matriz con relleno es peor que una vacía.
- Las lagunas L-1 a L-5 de esta ronda siguen vigentes; la ronda 2 actualiza L-1
  y añade L-6 a L-10.


---

# Ronda 2 · Fusión de los intentos 3a y 3b

**Fecha de fusión:** 02-09-2026. **Fecha de consulta de las fuentes nuevas:** 02-09-2026.

Dos documentos de investigación profunda producidos el 01-09-2026 a las 05:16 y
05:32 quedaron fuera de la primera fusión. No se descartaron: no llegaron a
inventariarse. Se versionan como `intento-3a` y `intento-3b` y se funden aquí
con el mismo procedimiento de cinco pasos.

## Paso 1 · Inventario

| Documento | Qué es | URLs | Pasa el paso 1 |
|---|---|---:|---|
| `intento-3a_linea-base-y-diccionario` | Auditoría de línea base, diccionario de datos y matrices del piloto de tres | 28 | Sí |
| `intento-3b_avance-y-evidencia-actualizada` | Barrido de las once al corte de septiembre de 2026, con registro de cambios | 31 | Sí |

**Ambos traen marcadores `citeturn`, y aun así pasan.** Es la diferencia que
importa respecto del `intento-1`, que se cayó en este mismo paso: allí los
marcadores **sustituían** a la referencia y el documento no contenía ni una
cadena `http`. Aquí acompañan a una URL real que un tercero puede abrir. Un
marcador irresoluble junto a una URL resoluble es ruido; solo, es una promesa de
fuente.

Tres URLs de `intento-3a` apuntan al propio sitio de este laboratorio. No son
evidencia sobre universidades y se excluyen del inventario.

## Paso 2 · Deduplicar y arbitrar

### 2.1 · Los dos documentos no comparten ni una fuente

De las 29 fuentes nuevas, **cero aparecen en ambos**. No es casualidad: `3a`
profundiza en el piloto de tres y `3b` barre las once al corte de 2026. Como
en la ronda anterior, son complementarios y no rivales.

| | Fuentes |
|---|---:|
| Ya en el corpus (corroboran, no suman) | 22 |
| Nuevas de `3a` | 15 |
| Nuevas de `3b` | 14 |
| **Nuevas únicas** | **29** |
| **Total del corpus tras la fusión** | **72** |

Las 22 coincidencias no son desperdicio: una fuente que dos rondas de
investigación independientes localizan por separado vale más que una que
apareció una vez.

### 2.2 · La tabla de puntajes heredada no se puede actualizar, hay que rehacerla

Es el arbitraje más costoso de esta ronda y el que más consecuencias tiene.

`intento-3b` audita la aritmética del documento antecedente y encuentra que sus
totales no salen de sus propias puntuaciones:

| Institución | Suma de las cinco puntuaciones declaradas | Total escrito | |
|---|---:|---:|---|
| UAI | 7,5 | 6,2 | Error |
| UNAB | 7,75 | 8,75 | Error |
| U. Central | 8,0 | 8,5 | Error |
| UDP (I+D) | 1,0 | 0,75 | Inconsistencia interna |

A eso se suma que el antecedente mezclaba dos lógicas —puntuaciones holísticas
de 0–3 por dimensión y microponderaciones de 0,25–1,50 por actividad— sin regla
para deduplicar iniciativas ni para impedir que el número de eventos se
confundiera con institucionalización.

**Consecuencia registrada: ninguna puntuación heredada se arrastra.** No se
corrigen décimas; la tabla se reconstruye desde la matriz de evidencias o no
existe. Sumar o restar a un total que no cuadra con sus sumandos propaga el
error con apariencia de precisión.

### 2.3 · El «informe 2025» no era una fotografía de 2025

`CONF-SEP26-002`. El documento tratado como línea base histórica contiene
actividades fechadas en abril, junio, agosto y septiembre de **2026**. Una
comparación mecánica «antes contra septiembre de 2026» mezclaría cambios reales
con incorporaciones hechas retrospectivamente sobre el propio archivo.

**Toda etiqueta «nuevo desde 2025» queda provisional** hasta reconstruir un
corte congelado de verdad. Es la laguna L-9.

### 2.4 · Seis atribuciones que había que deshacer

La colisión «universidad no es facultad» del §2.4 de la ronda 1 reaparece, y
esta vez con nombres:

| Registro heredado | Qué dice la fuente | Operación |
|---|---|---|
| Red AIGEN contada como capacidad de Derecho (UANDES) | Ninguna fuente identifica participación concreta de Derecho | Reclasificar adyacente |
| Tribunal del metaverso contado como IA (UNAB) | La fuente oficial describe realidad virtual y simulación, no IA sustantiva | Reclasificar adyacente |
| `[genIA]` contado como I+D de Derecho (UdeC) | Es programa interdisciplinario de toda la Universidad | Reclasificar adyacente |
| «Centro de IA y Derecho» (UDP) | La unidad oficial es **Dirección** de Inteligencia Artificial y Derecho | Corregir nomenclatura |
| «Centro DIAT» (PUCV) | En 2026 la unidad es **Programa** Derecho, Inteligencia Artificial y Tecnología | Corregir nomenclatura |
| «Cátedra LegalTech» (U. Central) | La página vigente muestra **Programa IA & LegalTech** | Sustituir, conservando la Cátedra como antecedente |

Tratar una tecnología digital que no es IA como si lo fuera, o adjudicar a
Derecho la capacidad de otra facultad, son los dos modos de inflar un mapa sin
inventar ni una fuente.

### 2.5 · Dos ceros heredados que la evidencia derriba

El antecedente registraba «uso interno de IA = 0» para PUCV y para U. Autónoma.
Ninguno se sostiene al corte:

- **PUCV.** Decálogo institucional de uso de IA presentado en enero de 2026,
  elaborado por la Unidad de Integridad Académica y liderado por una profesora
  de Derecho; Gemini habilitado para la comunidad desde marzo de 2026; y
  experiencia docente previa con «Prompts Socráticos» en Filosofía del Derecho
  documentada desde abril de 2024.
- **U. Autónoma.** La Facultad informa alfabetización en IA generativa con
  cobertura cercana al 80 % de sus docentes de Derecho en tres sedes.

**Regla que se deriva y se aplica a todo el corpus:** un cero heredado no se
arrastra. La ausencia de evidencia pública en una ronda anterior no es evidencia
de inexistencia, y menos cuando la ronda anterior ni siquiera buscó.

Queda en pie, eso sí, una distinción que la propia fuente obliga a hacer en el
caso PUCV: **infraestructura universitaria**, **participación de Derecho** y
**uso efectivo en la Facultad** son tres cosas, y solo las dos primeras están
documentadas.

## Paso 3 · Reclasificar desde cero

`intento-3b` trae su propia escala documental de cuatro niveles: señal,
operación, institucionalización y evaluación. Se traduce a los cinco niveles del
sitio del mismo modo que en la ronda 1, sin heredar etiquetas.

**El dato de esta ronda no es lo que encontró, sino lo que no encontró:
ninguna institución alcanza el cuarto nivel.** El documento lo declara
expresamente y lo razona: se localizaron métricas de cobertura —cerca del 80 %
del profesorado de Derecho en la Autónoma, unos 90 participantes en el taller de
la PUCV, más de 800 en el congreso de la Universidad de Chile— y ninguna de ellas
es una evaluación de efecto. Cuántos asistieron no dice si algo cambió.

Esto **confirma la laguna L-4 con un corpus independiente**. Dos rondas de
investigación separadas, con documentos distintos y fuentes que apenas se
solapan, llegan a la misma ausencia. Es el hallazgo más sólido del Informe 01
hasta ahora, y es un hallazgo sobre el estado del campo, no sobre las
universidades: nadie está midiendo si esto funciona.

## Paso 4 · Estructura

Los ocho ejes declarados en la ficha del informe siguen sirviendo. La fusión no
obliga a reordenarlos: obliga a poblarlos.

## Paso 5 · Lagunas que esta fusión revela

**L-1 (actualizada) · La cobertura sigue desigual, y la brecha apenas se mueve.**
Las fuentes nuevas se concentran otra vez en el piloto: 15 de 29 van a PUCV, PUC
y Universidad de Chile.

| | Antes | Después |
|---|---:|---:|
| Piloto de tres | 27 (9 por universidad) | 42 (14 de media) |
| Las otras ocho | 16 (2 por universidad) | 28 (3,5 de media) |
| Bases de universo nacional | 0 | 2 |
| **Total** | **43** | **72** |

La razón entre el piloto y el resto pasa de 4,5:1 a 4,0:1. **Sigue sin haber
comparación nacional posible.** Casi setenta fuentes se leen como cobertura, y
no lo son: son veintinueve fuentes más sobre una asimetría que persiste. La
prohibición de publicar ranking o comparación se mantiene íntegra.

**L-6 · Falta el acto formal de creación de casi todas las unidades.** Nombre
comunicacional y unidad administrativa formal no son lo mismo. Se necesitan
resolución, organigrama o documento constitutivo de: Departamento UC, Dirección
UDP, Programa IA & LegalTech de la Central, Programa DIAT y LMIL de la PUCV, y
estructura IA+D de la Autónoma.

**L-7 · La integración curricular efectiva es la mayor incógnita.** Hay mallas y
anuncios; faltan syllabus 2026 con obligatoriedad, semestre, créditos y matrícula
real. Sin eso, un taller optativo y una línea curricular obligatoria se
confunden.

**L-8 · Los proyectos con financiamiento público no se han verificado en ANID.**
Fondecyt de la UAI y FONDEF de UANDES y PUCV constan por noticia universitaria.
La fuente gubernamental —código, monto, duración, investigadores— debe sustituir
a la nota de prensa, no complementarla.

**L-9 · No existe una línea base congelada de 2025.** Ver §2.3. Mientras no
exista, ninguna afirmación de la forma «X aumentó desde 2025» es publicable.

**L-10 · Las herramientas heredadas pueden ser páginas históricas.** iLex, IDEA
de la Central y AyudantIA de la UC constan en el antecedente; falta comprobar
vigencia en 2026 antes de presentarlas como stock actual.

## Verificación

Segunda pasada de resolubilidad, ejecutada el 02-09-2026 sobre las 29 fuentes
nuevas: **28 responden**. La restante —la base INDICES del Consejo Nacional de
Educación— devuelve `403` a una petición automatizada; el sitio existe y es
consultable desde un navegador, de modo que se conserva con advertencia. Quince
redirigen a su forma canónica, todas por barra final o `www`.

Vale la misma advertencia de la ronda 1, y con más motivo ahora que el corpus
crece: **que una URL responda no prueba que diga lo que se le atribuye.** La
verificación sustantiva sigue sin hacerse y sigue sin delegarse.

## Estado tras la ronda 2

- Pasos 1 a 5 cerrados sobre 72 fuentes. **Ninguna afirmación es publicable.**
- Diez lagunas declaradas, de las cuales cinco son nuevas de esta ronda.
- `sourceIds` y `claimIds` siguen vacíos, y siguen debiendo estarlo.
- Lo que esta ronda cambia de verdad no es el tamaño del corpus: es que la
  ausencia de evaluación de efecto ya no descansa en un solo barrido.
