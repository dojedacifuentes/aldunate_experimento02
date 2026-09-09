# Comparador ordinal · Informe 01

La cadena de cálculo del índice de formalización de capacidad. Vivía fuera del
repositorio, en el equipo del autor, y se trajo aquí el 07-09-2026 porque sin
ella no se puede recalcular nada ni comprobar que lo publicado cuadra.

| Archivo | Qué es |
|---|---|
| `matriz-v2.json` | Las diez capacidades por institución, en dos estados |
| `recalcular.mjs` | Aplica la Ronda 2 sobre la matriz anterior y compara |
| `sensibilidad.mjs` | Qué pasa con el orden si una fuente discutida se cae |

## La rúbrica

Cerrada **antes** de calcular, y ésa es la razón de que el comparador sea
defendible. No se toca.

```
OPF  en operación con instrumento formal   3
OP   en operación                          2
INC  incipiente                            1
ENT  presente sólo en el entorno           1
ADY  sólo adyacente                        1
NL   no localizada                         0
NC   no concluyente                    sin puntuar, suma 2 al techo
```

El índice se publica como **banda**: el piso es lo que la evidencia acredita
hoy; el techo, lo que daría si todas las celdas sin concluir resultaran
favorables. Una banda ancha no es una institución peor evaluada: es una peor
investigada, y son cosas distintas.

## Las dos matrices, y cuál se publica

`matriz-v2.json` contiene `.v1` y `.v2`. **La canónica es `.v2`** (D-039).

- `.v2` — aplica los 26 cierres de la Ronda 2 y deja 5 celdas sin concluir. Es
  la que publicaban ya las tres tablas de la v2.0.0 —el orden de la sección 4,
  el anexo C y el cálculo del anexo D— y la que la v2.1.0 lleva también a las
  figuras y a la prosa.
- `.v1` — 31 celdas sin concluir. Es la matriz anterior a la Ronda 2. Se
  conserva porque las figuras de la v2.0.0 la dibujaban y hay que poder
  reproducir lo que esa versión publicó; ninguna versión vigente la usa.

La v2.0.0 estuvo dos días publicada con las tablas en `.v2` y las figuras en
`.v1`. Ver `docs/informes/09-recalculo-comparador.md`.

## Las figuras salen de aquí

`figuras.mjs` genera siete figuras del informe y una del complemento. Cuatro
derivan de la matriz —el comparador, la comprobación contra cobertura, la
matriz de capacidades y su lectura por filas—; tres se trajeron aquí porque las
entregadas tenían defectos que no se arreglan editando un SVG a mano: la de
cobertura llevaba dentro una comparación con una versión anterior, la de
conclusiones escribía rótulos que las barras tapaban desde la mitad, y la
cronología ponía su anotación encima de una cifra. La octava es el perfil de la
institución apartada, que va al complemento.

Existe por el defecto de arriba: mientras la figura y la tabla salgan de sitios
distintos, divergir es cuestión de tiempo.

```bash
node tools/informes/informe-01/comparador/figuras.mjs      # las ocho figuras
node tools/informes/informe-01/comparador/recalcular.mjs
node tools/informes/informe-01/comparador/sensibilidad.mjs
```

## Quién sale del comparador

`FUERA_DEL_COMPARADOR`, en `figuras.mjs`. Hoy es la Pontificia Universidad
Católica de Valparaíso, por D-037: quien firma trabaja en su Escuela de Derecho.
Sigue en la cohorte —las figuras de cobertura y el registro de fuentes la
dibujan— y no en el orden ni en la matriz de capacidades.
