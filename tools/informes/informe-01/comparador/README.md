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

## Las dos matrices, y por qué importa

`matriz-v2.json` contiene `.v1` y `.v2`. **El documento publicado usa `.v1`.**

- `.v1` — 31 celdas sin concluir. Coincide exactamente con la figura del
  informe y con su frase «de 47 a 31».
- `.v2` — aplica los 26 cierres de la Ronda 2 y deja 5. Está calculado,
  declara `rechazados: 0` y **no se publicó**.

Cuál es la canónica es una pregunta abierta para el autor, y bloquea el
recálculo. Ver `docs/informes/09-recalculo-comparador.md`.

```bash
node tools/informes/informe-01/comparador/recalcular.mjs
node tools/informes/informe-01/comparador/sensibilidad.mjs
```
