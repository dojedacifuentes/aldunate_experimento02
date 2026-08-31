# Auditoría del repositorio · 31-08-2026

**Objeto:** `dojedacifuentes/aldunate_experimento02`, rama `feature/juego-audaces`
(commit del juego `736f01c` sobre `main` en `e246edd`).
**Alcance:** el repositorio completo. Foco pedido: la sección `/laboratorio`.
**Método:** lectura del árbol, `npm run verify`, y recorrido de las trece rutas
en el navegador con la consola abierta.

Este documento no es un resumen amable. Nombra lo que está roto, lo que es
maqueta y lo que se sostiene, y separa las tres cosas.

---

## 1. Veredicto en una página

El repositorio está **bien construido y mal poblado**. La ingeniería, las reglas
editoriales y la trazabilidad están por encima de lo que se ve en un prototipo
académico. Lo que falta no es código: es contenido que respalde lo que las
páginas afirman.

| Capa | Estado |
|---|---|
| Base técnica (Next 16, TS estricto, CI, `verify`) | Sólida |
| Reglas duras (noindex, franja de prototipo, no inventar) | Respetadas sin excepción |
| Trazabilidad de investigación (`/investigacion`) | Poblada: 24 fuentes, 18 afirmaciones |
| Informes | Uno completo y descargable, uno en investigación |
| Experimentos | Cinco piezas realmente interactivas + el juego |
| **Laboratorio** | **Ocho fichas, cero funcionalidad. Es el punto débil.** |
| Capa académica (`/aldunate`) | Vacía por diseño, hueco declarado |
| Cobertura de pruebas | 25 tests, **todos del juego**. El resto del sitio, cero. |

Dos defectos reales encontrados y corregidos en esta misma rama; ambos los
introdujo el parche del juego y ninguno de los dos lo detecta `npm run verify`.

---

## 2. Defectos encontrados

### H-01 · Enlace dentro de enlace rompía la hidratación de `/experimentos` — CORREGIDO

**Severidad: alta.** Página entera afectada, no un detalle.

Desde que `ExperimentCard` pinta un botón «Jugar» cuando el experimento tiene
`jugableEn`, la ficha contiene su propio `<a>`. Pero `/experimentos` envolvía
cada ficha del catálogo en un `<Link>`, es decir, en otro `<a>`. HTML inválido:

```
Uncaught Error: Hydration failed because the server rendered HTML
didn't match the client.
In HTML, <a> cannot be a descendant of <a>. This will cause a hydration error.
```

Consecuencia real: React descarta el árbol servido y vuelve a renderizar toda la
página en el cliente. Se ve como un parpadeo y desactiva la mejora progresiva de
esa ruta.

**Por qué no lo vio nadie.** `npm run verify` compila y pasa. El error sólo
aparece en la consola del navegador, en tiempo de hidratación. Ninguna de las
tres suites de test toca esta ruta.

**Arreglo.** La tarjeta deja de ser un enlace cuando ya trae su propia salida
(`src/app/experimentos/page.tsx`).

### H-02 · El contador de familias dejó de contar el juego — CORREGIDO

**Severidad: media.** Dato visible y falso.

`/experimentos` contaba las piezas de cada familia comparando `e.href` con la
ruta de la familia usando `===`. El juego pasó a tener ruta propia
(`/experimentos/juegos/ley-de-los-audaces`), así que dejó de coincidir con
`/experimentos/juegos`. La tarjeta «Juegos» anunciaba **1 pieza** cuando había
dos.

Menor en apariencia, grave en principio: un laboratorio que publica el estado
real de cada pieza no puede equivocarse en el recuento de sus propias piezas.

**Arreglo.** Se cuenta por prefijo de ruta, no por igualdad exacta. Las cifras
vuelven a ser 2 · 4 · 2 = 8, que es el total del catálogo.

### H-03 · El laboratorio no se aplica a sí mismo su propia regla

**Severidad: alta. No corregido: es contenido, no código.** Ver sección 4.

### H-04 · La cobertura de pruebas es asimétrica

25 tests, en tres archivos, **todos del juego**: `prologo.test.ts` (11),
`save.test.ts` (7), `scoring.test.ts` (7). El resto del sitio —selectores de
informes, filtros del laboratorio, cálculo de familias, anclaje de EVA a ruta—
no tiene ninguna prueba.

No es una omisión abstracta: H-02 es exactamente el tipo de fallo que una prueba
de tres líneas sobre `experiments.ts` habría detenido.

### H-05 · `demoUrl` y `repoUrl` existen y nadie los usa

El tipo `LabTool` declara los dos campos y `LabCatalog` pinta los enlaces
«Demo» y «Código» cuando existen. Ninguna de las ocho fichas los define, así que
el código está escrito y muerto. Es la evidencia más limpia de H-03.

### H-06 · Taxonomía: «Lex Note» está catalogada como juego

`lex-note` tiene `family: 'juegos'` y vive en `/experimentos/juegos`. No es un
juego: es una herramienta de anotación. Está ahí porque la familia «Juegos»
necesitaba una segunda pieza, no porque le corresponda.

### H-07 · Sin cabeceras de seguridad

`next.config.ts` define redirecciones y nada más. No hay `headers()` con
`Content-Security-Policy`, `X-Frame-Options` ni `Referrer-Policy`. Para un
prototipo `noindex` sin backend es aceptable; conviene anotarlo antes de que el
sitio deje de ser un prototipo.

---

## 3. Lo que está bien y no hay que tocar

Vale la pena decirlo, porque un informe que sólo enumera defectos induce a
reescribir lo que funciona.

- **Las reglas duras se cumplen sin excepciones.** `robots: { index: false }`,
  franja de prototipo en el layout raíz, aviso de uso pendiente de autorización
  del escudo PUCV. En trece rutas no hay una sola pantalla que sugiera que esto
  es un sitio oficial.
- **`publications` y `courses` están vacíos a propósito**, con cinco huecos
  declarados en `pendingContent`. Es la decisión correcta y la más difícil de
  sostener. No rellenar.
- **`/investigacion` está poblada de verdad:** 24 fuentes y 18 afirmaciones con
  nivel de evidencia y `last_verified`. La matriz ya no es una promesa.
- **El botón de descarga sólo aparece si el archivo existe.** El informe 02
  tiene PDF, DOCX y resumen ejecutivo en `public/descargas/`; el informe 01 no
  tiene botón porque no tiene archivo. Verificado byte a byte: los DOCX/PDF
  publicados son exactamente los mismos archivos que están en el escritorio
  (`INFORME IA UNIVERSIDAD/`), mismo SHA-256. No hay dos versiones circulando.
- **CI real.** `.github/workflows` corre `npm ci`, `npm audit --audit-level=high`
  y `npm run verify` en cada PR y en cada push a `main`.
- **El juego está aislado.** Phaser se carga dinámicamente y sólo en su ruta; los
  tokens del juego viven dentro de `.cabina-audaces` y no se escapan. La única
  duplicación de paleta aceptada está documentada en D-023.

---

## 4. La sección `/laboratorio`, en detalle

Es lo que se pidió mirar de cerca, y el diagnóstico es más incómodo que
«faltan cosas».

### 4.1 El diagnóstico

La página se abre declarando su criterio: *«Registra instrumentos desarrollados o
probados dentro del proyecto… Ninguna ficha se marca estable sin uso real
documentado.»*

El criterio es correcto. El problema es que **ninguna ficha lo satisface, y la
página no lo dice**. Ocho fichas: cuatro `idea`, cuatro `prototype`. Las cuatro
marcadas `prototype` llevan además `maturity: 'en-prueba'`, es decir, afirman
haber sido probadas. Ninguna de las ocho enlaza a nada: ni demo, ni código, ni
plantilla, ni documento.

El resultado es que el laboratorio **describe** instrumentos en lugar de
**entregarlos**. Una ficha que dice «plantilla que obliga a declarar
jurisdicción, materia y fuente admisible» y no permite descargar esa plantilla
no es una herramienta: es el anuncio de una herramienta.

Y la asimetría es la parte que importa. El repositorio le exige a todo lo demás
—a los informes, a los experimentos, al juego— que declare su estado de
verificación y que no prometa lo que no entrega. El juego llega al extremo de
mostrar sus tres referencias normativas rotuladas «por verificar». El
laboratorio es la única sección que se autoexime de su propia regla.

Dicho de otro modo: **`/laboratorio` es hoy la sección menos trazable de un sitio
cuyo argumento central es la trazabilidad.** Si el sitio se le muestra a alguien
que sabe leer, ésa es la primera grieta que va a encontrar.

### 4.2 Ficha por ficha

Qué existe realmente detrás de cada una y qué le falta para dejar de ser maqueta.
«Artefacto» significa: un archivo que alguien puede descargar y usar hoy.

| Ficha | Estado declarado | Qué hay detrás | Qué le falta para dejar de ser maqueta |
|---|---|---|---|
| Prompt jurídico acotado | prototype · en-prueba | La descripción | La plantilla en `content/lab/`, más 3 ejemplos ejecutados con su salida real |
| Flujo verificable | prototype · en-prueba | La descripción; el método sí se aplica en `/investigacion` | El procedimiento escrito paso a paso + un caso trabajado de punta a cabo |
| Lectura estructurada de sentencias | idea · exploratoria | Nada | Corpus de prueba y una sentencia procesada de ejemplo |
| Banco de comparación de modelos | idea · exploratoria | Nada | Rúbrica cerrada y publicada. Sin eso, comparar es ruido con tabla |
| Mapa de estructura normativa | idea · exploratoria | Parcial: Constitution Lab ya hace onda expansiva | Decidir si es ficha propia o si es el experimento que ya existe |
| Rúbrica de trazabilidad | prototype · en-prueba | La descripción | La rúbrica misma, con sus dimensiones y su escala, descargable |
| Protocolo de datos sensibles | idea · exploratoria | Nada | Lista de decisión escrita y contraste con la normativa chilena de protección de datos vigente, citada con su fecha de verificación |
| Secuencia docente asistida | prototype · en-prueba | La descripción | Guion de sesión, material de sala e instrumento de cierre |

Tres de las ocho (prompt acotado, flujo verificable, rúbrica de trazabilidad)
están a **un archivo** de ser reales. Ese archivo ya existe implícitamente: es lo
que se hizo para producir el informe 02.

### 4.3 Además: dos de las diez categorías no le pertenecen a nadie

`labCategories` declara diez territorios; sólo seis tienen ficha. La página lo
dice explícitamente y eso es honesto. Pero `agentes-automatizacion` es hoy la
categoría más poblada del proyecto **en la realidad** —el juego entero se
construyó con encargos a agentes, documentados en
`docs/juegos/ley-de-los-audaces/misiones/`— y en el catálogo figura vacía.

El laboratorio no está catalogando su propio trabajo más reciente.

---

## 5. Inventario de rutas

Trece rutas de página, dieciséis entradas en el build (incluye `_not-found` y
las dos generadas por `generateStaticParams`). Todas prerenderizadas.

| Ruta | Qué es realmente |
|---|---|
| `/` | Portal. Cuatro puertas, cifras vivas. Funciona |
| `/aldunate` | Perfil sin biografía: cinco ejes + dos huecos declarados |
| `/aldunate/papers` | Vacía por regla dura. Correcto |
| `/aldunate/cursos` | Vacía por regla dura. Correcto |
| `/laboratorio` | 8 fichas, filtros funcionales, **cero artefactos** |
| `/informes` | 2 informes. El 02 con descargas reales |
| `/informes/[slug]` | Ficha completa: versiones, ejes, método, preguntas |
| `/investigacion` | Método + 24 fuentes + 18 afirmaciones |
| `/experimentos` | Hub. 3 familias, 8 piezas. **Contaba mal hasta H-02** |
| `/experimentos/constitucion` | Interactivo de verdad |
| `/experimentos/gramatiquerias` | Interactivo de verdad (4 piezas) |
| `/experimentos/juegos` | Catálogo + destacado del juego |
| `/experimentos/juegos/ley-de-los-audaces` | **Juega y se audita.** Capítulo 0 completo |

---

## 6. Estado de la verificación

```
✖ 8 problems (0 errors, 8 warnings)      ← los 8 justificados en D-022
Test Files  3 passed (3)
     Tests  25 passed (25)
✓ Generating static pages (16/16)
```

Los 8 avisos son `react-hooks/set-state-in-effect` (7) y una constante sin usar
en el motor de arte (1). No se tocan: D-022 los justifica.

---

## 7. Qué haría, en este orden

1. **Darle un artefacto a tres fichas del laboratorio.** Prompt acotado, flujo
   verificable y rúbrica de trazabilidad. Un archivo cada una en `content/lab/`,
   un `demoUrl` o `repoUrl` que lo apunte, y el código muerto de H-05 deja de
   estarlo. Es medio día y cambia el carácter de la sección.
2. **Bajar a `idea` lo que no tenga artefacto.** Mientras tanto, `prototype` con
   `maturity: 'en-prueba'` y nada detrás es una afirmación sin respaldo, que es
   justo lo que el sitio le reprocha a los demás.
3. **Abrir ficha para `agentes-automatizacion`** con lo que ya ocurrió: el juego
   construido por encargos, con sus informes de misión como evidencia. Es la
   única ficha del laboratorio que hoy podría marcarse con uso real documentado.
4. **Tres pruebas sobre `src/data/`**: que cada `href` apunte a una ruta que
   existe, que los recuentos de familia cuadren, que ningún experimento con
   `jugableEn` quede sin página. Habría atajado H-01 y H-02.
5. **Decidir dónde vive «Lex Note»** (H-06). O se mueve a una familia propia o se
   archiva hasta que exista el modelo de anotación.
6. **Cabeceras de seguridad** (H-07) antes de que el sitio deje de ser `noindex`.

Los puntos 1 a 3 son contenido y no requieren tocar componentes. El 4 es media
hora. El 5 es una decisión, no un trabajo.

---

## 8. Lo que vi y no toqué

- `scripts/standalone/` produce el juego en un archivo suelto sin red
  (`npm run juego:suelto`). No está enlazado desde ninguna parte del sitio. Es un
  entregable listo que nadie puede encontrar.
- `preview/*.html` en el escritorio (`ALDUNEITOR/preview/`) son bancos de prueba
  del motor de arte que nunca entraron al repositorio. Si el arte se va a seguir
  tocando, deberían entrar.
- El informe 01 lleva desde el 29-08 en `en-investigacion` con `v0.1.0` y sin
  archivo. Ver la hoja de ruta: es el pendiente con más trabajo previo hecho.

---

*Auditoría hecha sobre la rama `feature/juego-audaces` el 31-08-2026. H-01 y H-02
se corrigieron en esa misma rama; el resto queda registrado, no implementado.*
