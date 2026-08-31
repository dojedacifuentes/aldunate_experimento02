# GAME_DESIGN

Lo que está construido y por qué está construido así. Para lo que falta, ver
`VISION.md`.

---

## El bucle

```
OBSERVAR → PREGUNTAR → DESCUBRIR → DECIDIR → CONSECUENCIA → NUEVO PROBLEMA
```

En el Capítulo 0 el bucle ocurre sentado. No hay exploración porque la pregunta
que el slice tiene que responder no es «¿es entretenido caminar?», sino **«¿es
entretenido el Derecho convertido en decisión?»**. Si la respuesta fuera no,
ningún mapa lo arreglaría.

Cada 30 a 60 segundos debe pasar algo: una decisión, una pista, una recompensa,
un comentario de EVA o un cambio de quién tiene la palabra.

---

## Tipos de nodo

Seis, y ninguno más hasta que un capítulo demuestre necesitar el séptimo.

| Nodo | Qué hace |
|---|---|
| `dialogo` | Alguien habla. Puede cerrar con una línea de EVA. |
| `decision` | Tres opciones; una acierta. Todas continúan. |
| `scan` | ANALIZAR: elegir dónde mirar. Sólo un objetivo es contrastable. |
| `prueba` | Presentar una pieza del expediente contra una afirmación. |
| `alegato` | Ordenar hecho, prueba y norma. |
| `fin` | Veredicto y epílogo. |

Añadir un capítulo es añadir datos. Añadir una mecánica es añadir un caso al
intérprete. Ninguna línea de guion vive en un componente.

---

## Diseño de las decisiones

Una decisión sirve si las opciones equivocadas son **razonables**, no tontas.

En el contrainterrogatorio, «¿está usted segura?» es lo que uno preguntaría, y
es exactamente lo que le regala firmeza al testigo delante del tribunal. En el
scan, el nerviosismo de la testigo es visible y real; lo que no es, es
contrastable con un documento. La opción equivocada tiene que enseñar algo al
fallar, o es relleno.

Cada respuesta explica **por qué** falló, en una frase, sin sermón.

---

## Fracaso

Aquí no se pierde. Fallar cuesta impulso, prestigio o integridad; nunca
reinicia. Ver `DECISIONS.md` D-007.

El alegato incompleto sigue adelante con otro texto: dos de tres piezas se
entiende, no convence del todo, y con la carga de la prueba en la otra parte
puede bastar. Que pueda bastar es, además, cierto.

---

## Progresión

- **XP** por acción, multiplicada por el combo vigente **al momento de actuar**.
- **Impulso** sube 34 por acierto y baja a la mitad al fallar. Nunca a cero.
- **Combo** desde el segundo acierto encadenado; tope en ×4, para que la última
  decisión no valga más que toda la escena.
- **Estadísticas** que suben y bajan en pantalla. Prestigio e integridad bajan:
  son las que hacen que una victoria sucia se sienta sucia.

---

## Especialidad

Litigación, investigación o negociación. Cada una da +2 en una estadística que
el prólogo usa. Una elección que no cambia nada enseña al jugador que sus
elecciones no cambian nada.

---

## Cómo enseña Derecho

No lo explica: lo pone en la mesa.

- Una hora declarada es una **afirmación de hecho**, y las afirmaciones de hecho
  chocan con registros. Eso se aprende presentando la bitácora, no leyéndolo.
- Un informe pericial que no concluye **siembra duda**; usarlo como si probara
  algo es un error, y el juego lo cobra.
- El alegato exige hecho, prueba y norma **en ese orden**. Empezar por la norma
  es perder al tribunal antes de decir de qué se habla.
- La absolución no dice «es inocente»: dice que la acusación no probó. La
  diferencia es el capítulo entero.
