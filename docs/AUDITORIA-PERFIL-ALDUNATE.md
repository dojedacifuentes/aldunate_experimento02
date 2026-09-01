# Auditoría del perfil académico

**Fecha:** 1 de septiembre de 2026
**Alcance:** ruta `/aldunate` y la capa de datos `src/data/aldunate/`
**Material de partida:** informe de investigación entregado por el autor
(`deep-research-report`, más un resumen ejecutivo y una ficha en PDF)

---

## 0. Por qué existe este documento

La ruta `/aldunate` arrancó vacía a propósito: `publications: []` y
`courses: []`, con los huecos declarados en pantalla. La regla dura 2 de
`CLAUDE.md` lo exigía mientras no hubiera respaldo documental.

El informe de investigación aportado es ese respaldo —pero **no tal como
venía**. Contrastado contra índices bibliográficos y contra las publicaciones
originales, seis afirmaciones no se sostenían. Este documento registra cuáles,
qué se publicó en su lugar y qué quedó fuera, de modo que nadie tenga que
repetir la comprobación para saber por qué falta un dato.

El informe original **no se corrigió**: se conserva como llegó, en
`content/aldunate/`. Lo que se corrigió es lo que el sitio afirma.

---

## 1. Correcciones

| Afirmación del informe | Lo verificado | Fuente |
|---|---|---|
| «Limitación y expropiación: **Scylla** y Caribdis…», Revista Chilena de Derecho 33(2), **2024** | «…**Scilla** y Caribdis…», Revista Chilena de Derecho **33(2), 2006, pp. 285–303** | SciELO Chile, Dialnet |
| «Los acuerdos pre y posmatrimoniales en el ordenamiento jurídico chileno», **2020** | Revista de Derecho Privado **n.º 40, 2021** | Dialnet |
| «La reforma constitucional del año 2005…», Revista de Derecho Público, **2016** | Revista de Derecho Público **n.º 69, 2007, pp. 35–44** | Dialnet |
| «La fuerza normativa de la Constitución…» aparecía en **2010** en la cronología y en **2009** en la tabla de obras del mismo documento | **2009**, Revista de Derecho PUCV 32(1), pp. 443–484 | SciELO, Dialnet, Pro Jure |
| Tesis doctoral: «*Die Auslegung des Verfassungsrechts als politisches Recht…*» | «*Verfassungsrecht als politisches Recht. Die Funktion der Verfassungstheorie als Element der Theorie der Verfassungsauslegung*» | DerechoPedia |

El error de 2024 por 2006 no es tipográfico: sitúa un artículo sobre dogmática
de la propiedad al final de la trayectoria en vez de en su mitad, y con él se
desordena la lectura de toda la línea temática. El volumen 33 de la Revista
Chilena de Derecho corresponde a 2006, lo que ya delataba la inconsistencia sin
salir del propio dato.

La tesis se publica como `SIGNAL`, no como `FACT`: hay una sola fuente
localizada y discrepa del informe. La discrepancia se muestra en la interfaz,
no se esconde.

---

## 2. Afirmaciones omitidas

### Fecha y lugar de nacimiento

El informe abría con «Quilpué, 1968». Ninguna de las fuentes consultadas
—incluidas las que el propio informe cita— lo consigna. **No se publica.**
Aparece declarado como hueco en la sección «Lo que falta, dicho en voz alta».

### Indicadores bibliométricos

El informe daba «~32 publicaciones, ~112 citas, índice h ≈ 6», atribuidos a una
plataforma que el propio documento marcaba como no verificada y no accesible.
**No se incorporan.** La cifra además no resiste el contraste: solo Dialnet
indexa 38 artículos.

Ninguna cifra bibliométrica se muestra en la interfaz. Los recuentos que sí
aparecen —obras, artículos, libros, coautorías, sedes— se calculan desde el
catálogo cargado y no pretenden medir impacto.

### Proyectos Fondecyt

Mencionados sin código de proyecto ni año. Sin folio verificable no se
publican.

### Tesis doctrinales atribuidas

El informe atribuía a los trabajos de 2010 una posición concreta: que el uso
desmedido de principios constitucionales abstractos genera un «choque de
fuentes» que mina la autonomía legislativa y la certeza jurídica.

No se localizó respaldo textual para esa formulación, y **no se reproduce**. Lo
que sí puede afirmarse, y se afirma, es que el artículo se anuncia desde su
propio título como aproximación conceptual *y crítica*, y que su resumen
publicado dice examinar críticamente el efecto del principio sobre el sistema
de fuentes. La diferencia entre «examina críticamente X» y «sostiene que X
mina Y» es exactamente la que separa un catálogo de una atribución.

---

## 3. Lo que entró

De la ficha de autor en Dialnet, contrastada obra por obra contra la
publicación original donde estaba accesible:

- **38 artículos** de revista, 1993–2024
- **2 libros**: *Derechos fundamentales* (LegalPublishing, 2008) y
  *Jurisprudencia constitucional 2006-2008* (LegalPublishing, 2009)
- **7 obras en coautoría**, con los coautores nombrados
- **39 sedes** distintas de publicación

Los títulos se conservan **literales**, con las erratas del índice incluidas
(«regalas», «interperetación», «desconstitucionalizacion»). Normalizar la
ortografía de un título rompe la búsqueda exacta, que es para lo que sirve un
catálogo.

Un hallazgo que el informe de partida no traía y que resultó ser el más
pertinente para este laboratorio: el artículo de **2024 sobre enseñanza del
Derecho mediada por asistentes virtuales**, en coautoría con Antonio Faúndez
Ugalde, Rafael Mellado Silva y Johann Benfeld. Es el punto donde el corpus toca
la materia del sitio.

---

## 4. Criterio de evidencia aplicado

Se reutilizan los cinco niveles que el sitio ya emplea en toda la capa de
investigación (`FACT` · `SIGNAL` · `INFERENCE` · `HYPOTHESIS` · `PENDING`).

El encargo proponía una escala distinta y propia de esta página —«dato
verificado / posición respaldada / síntesis editorial»—. Se descartó: dos
taxonomías en el mismo sitio harían incomparables las afirmaciones de este
perfil con las de los informes, que es justamente lo que la trazabilidad debe
impedir.

| Nivel | Criterio |
|---|---|
| `FACT` | Dos o más fuentes independientes, o una institucional o de índice |
| `SIGNAL` | Una sola fuente secundaria, o fuentes que discrepan en el detalle |
| `PENDING` | La obra aborda el problema pero no se ha leído su texto completo |

El criterio no es un comentario: hay una prueba que falla si un dato con una
sola fuente secundaria se marca como `FACT`, y otra que exige que todo `SIGNAL`
explique por qué no llegó a `FACT`.

**Ninguna obra lleva `thesis`.** El campo existe en el modelo y queda vacío
hasta que alguien lea los textos. Una prueba lo impide mientras tanto: si algún
día se llena, habrá que cambiar la prueba a conciencia, que es el punto.

---

## 5. Fuentes, y qué sostiene cada una

Se registran ocho, con su nivel y su alcance declarado en
`src/data/aldunate/sources.ts`. El campo `supports` existe para impedir el abuso
más común de una bibliografía: citar la misma referencia al pie de todo.

Jerarquía aplicada (encargo §27): índice bibliográfico o publicación original
antes que ficha institucional, y ficha institucional antes que sitio
colaborativo. Toda fuente secundaria declara su reserva en pantalla, y una
prueba comprueba que ninguna se quede sin ella.

**Discrepancia registrada:** sobre la dirección del programa *Derecho,
Inteligencia Artificial y Tecnología*, una fuente señala al profesor Aldunate
como director del programa y otra atribuye esa dirección a Johann Benfeld con
Aldunate como director de la Escuela. Se publica **la vinculación, no el
cargo**.

---

## 6. El retrato

La imagen es una **recreación editorial a partir de fotografías**, no una
fotografía documental, y la página lo dice junto a la imagen —no en letra
chica al pie: es un dato del contenido.

El encuadre termina en el píxel 1210 del original, sobre el nudo de la corbata.
La corbata lleva bordado un escudo heráldico ornamental; **no es el escudo de
la PUCV**, pero la regla dura 3 se cumple mirando el píxel y no el nombre del
componente. Es la lección de `eva-pucv-courtyard.png` (D-033): la marca
institucional también viaja dentro de las imágenes, y ahí no la encuentra
ningún `grep`. El emblema queda fuera del archivo publicado, no solo fuera de
la vista.

El procesamiento es reproducible: `node scripts/aldunate/retrato.mjs <origen>`
regenera el WebP, el JPEG de respaldo, la composición 1200×630 de Open Graph y
el `blurDataURL` que evita el salto de maquetación. 2,2 MB de PNG quedan en
99 KB.

---

## 7. Lo que sigue pendiente

- **El argumento de cada obra.** El catálogo registra qué se publicó y dónde.
  Qué sostiene cada trabajo exige leerlo.
- **Capítulos de libro y ponencias.** Dialnet indexa artículos de revista y un
  libro; el resto queda fuera del alcance de la fuente.
- **Cursos.** Ninguna fuente consultada consigna asignaturas con institución y
  período. `/aldunate/cursos` sigue vacía y lo declara.
- **Fecha de inicio del período actual como director de Escuela.** Consta el
  ejercicio del cargo; no la fecha.
