# 09 · Recálculo del comparador · cerrado el 08-09-2026

Encargo abierto el 07-09-2026 y **cerrado el 08-09-2026 con la publicación de la
v2.1.0**. Se conserva porque explica una contradicción que estuvo publicada dos
días, y porque la regla que sale de ella vale para cualquier informe futuro.

Lo que sigue es lo que se encontró, lo que se decidió y lo que se hizo. La
decisión está registrada como **D-039** en `docs/DECISIONS.md`.

---

## 1 · La pregunta que bloqueaba el encargo, y su respuesta

`matriz-v2.json` contiene dos matrices. El encargo la planteó como una decisión
editorial del autor entre dos hipótesis igual de defendibles, y no lo era.

**La canónica es `.v2`, y lo decía el propio documento entregado.** Sus tablas
ya la publicaban:

| Dónde | Qué publica la v2.0.0 | Coincide con |
|---|---|---|
| Tabla del orden, sección 4 | diez filas, sin la PUCV | `.v2`, celda por celda |
| Anexo C · capacidades celda por celda | diez filas, sin la PUCV | `.v2`, celda por celda |
| Anexo D · cálculo completo | diez filas, sin la PUCV | `.v2`, celda por celda |
| Figura del comparador | **once barras, con la PUCV** | `.v1` |
| Figura de comprobación | **once puntos, con la PUCV** | `.v1` |
| Matriz de capacidades | **once filas, 31 celdas blancas** | `.v1` |
| Matriz leída por filas | **recuentos sobre once** | `.v1` |
| Prosa que las rodea | once, y la PUCV encabezando | `.v1` |

La sección 8 lo confirma sin ambigüedad: dice que el perfil de la institución
apartada «habría sido de 18 puntos con banda cerrada, es decir **el segundo
lugar del orden**». Es su posición bajo `.v2` —detrás de la PUC de Chile con
20— y no bajo `.v1`, donde con 18 y banda cerrada habría encabezado.

El encargo anterior comparó la figura con `.v1`, acertó, y no llegó a mirar la
tabla que tenía debajo. De ahí la impresión de que había que elegir.

---

## 2 · Lo que se hizo

**Las cuatro figuras derivadas de la matriz se generan ahora desde la matriz**,
en `tools/informes/informe-01/comparador/figuras.mjs`. La gramática visual
—escalas, colores, tamaños, posiciones— se midió sobre las figuras entregadas
para que el cambio de origen no se lea como un cambio de diseño. Las otras ocho
no dependen de la matriz y se conservan byte a byte.

**La prosa se armonizó con 36 sustituciones, todas comprobadas**, en
`tools/informes/informe-01/v2.1.0/armonizar.mjs`. Cada una declara cuántas
apariciones espera y el script no escribe nada si una sola no cuadra: es la
única defensa razonable al editar un documento de 29.000 palabras que afirma
cosas sobre diez universidades con nombre.

**El complemento pasa a v1.1** y estrena la sección que le faltaba: el perfil
completo de la institución apartada, sus diez capacidades, su suma de 18 sobre
30 y el reparto de los doce puntos que faltan. Lo genera
`tools/informes/informe-01/v2.1.0/complemento.mjs`.

### Las cifras que cambiaron

| | v2.0.0 (figuras y prosa) | v2.1.0 |
|---|---|---|
| Techo del comparador | 18/30, dos instituciones | **20/30, una** |
| Promedio de los pisos | 9,4 | **11,4** |
| Celdas sin concluir | 31 de 110 | **5 de 100** |
| Banda cerrada | una institución | **seis de diez** |
| Banda ancha | cuatro instituciones | **ninguna** |
| Correlación cobertura–índice | «existe y no es perfecta» | **0,34, publicada** |
| Extensión declarada | 37 páginas | **113**, las del PDF que se sirve |

### El orden publicado

```
 1. P. U. Católica de Chile      20-20   nc=0
 2. U. Autónoma de Chile         17-17   nc=0
 3. U. Central de Chile          17-17   nc=0
 4. U. de Chile                  12-14   nc=1
 5. U. Adolfo Ibáñez             11-11   nc=0
 6. U. Andrés Bello              11-11   nc=0
 7. U. del Desarrollo             8-10   nc=1
 8. U. Diego Portales             8- 8   nc=0
 9. U. de los Andes               5- 9   nc=2
10. U. de Concepción              5- 7   nc=1

Apartada: P. U. Católica de Valparaíso, 18-18, nc=0 → complemento v1.1
```

---

## 3 · La regla que sale de esto

**Una figura derivada de un dato no se dibuja aparte del dato.**

Mientras la figura y la tabla salgan de sitios distintos, divergir no es un
accidente: es cuestión de tiempo. Aquí tardó una entrega. El informe llevaba
publicada dos días una portada que decía una cosa y un anexo que decía otra,
sobre diez universidades nombradas, y nadie lo vio porque cada pieza era
correcta por separado.

Para reproducir el orden y comprobar que lo publicado cuadra:

```bash
node tools/informes/informe-01/comparador/figuras.mjs
node tools/informes/informe-01/comparador/recalcular.mjs
node tools/informes/informe-01/comparador/sensibilidad.mjs
```

Para rehacer la v2.1.0 entera desde la v2.0.0 intocada:

```bash
node tools/informes/informe-01/v2.1.0/armonizar.mjs
node tools/informes/informe-01/v2.1.0/complemento.mjs
npm run informe:publicar
```

El `.docx` de origen de cada entrega se produce aparte, convirtiendo el HTML con
Word por automatización COM, y `npm run informe:word` lo lleva de 10 a 12
puntos. Ver [06 · Cómo reproducirlo](06-reproducir.md).

---

## 4 · Lo que sigue abierto

- **Las 22 fuentes de la ronda de ampliación no están contrastadas.** Entraron
  al registro marcadas «Ronda 2» y no «contrastada», y sostienen los 26 cierres
  de `.v2`. Contrastarlas es el trabajo de campo pendiente, y es lo que declara
  el tablero de la portada.
- **Cinco celdas siguen sin concluir**, repartidas en cuatro instituciones:
  Universidad de Chile, del Desarrollo y de Concepción con una cada una, y de
  los Andes con dos.
- **La paginación tiene holgura.** El PDF ocupa 113 páginas para unas 70 de
  contenido: cada sección abre hoja y los bloques que no pueden partirse empujan
  al siguiente pliego. No es un error —ninguna afirmación depende de ello— pero
  cuarenta páginas de aire son cuarenta páginas.
