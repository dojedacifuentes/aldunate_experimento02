# Cuellos de botella · registro

Lo que hace que la metodología mejore sola en vez de envejecer. El ciclo es
siempre el mismo:

```
MEDIR  →  NOMBRAR  →  CORREGIR UNO  →  ESCRIBIR LA REGLA  →  AUTOMATIZAR LA PRUEBA
```

**Las reglas del registro.** Un cuello sin cifra es una impresión, no un cuello.
Se corrige **uno** por sesión: dos a medias no cierran ninguno. Una regla sin
prueba dura una entrega. La carga metodológica va con el impacto de la
afirmación —no se le pide a un pie de figura lo que se le pide a una posición
del comparador—. Y al terminar se propone el siguiente **con su cifra ya
medida**, para que la sesión que venga empiece con trabajo y no con arqueología.

---

## Cerrados

| # | Cuello | Cómo se midió | Qué costó | Regla | Prueba |
|---|---|---|---|---|---|
| 1 | La figura y la tabla salían de sitios distintos | Tres tablas publicaban `.v2` y cuatro figuras dibujaban `.v1` | Dos días publicado con la institución apartada encabezando un orden del que estaba excluida | D-039 | `figuras.mjs`, fuente única |
| 2 | El documento se narraba a sí mismo | 69 pasajes del cuerpo comparando con versiones que el lector no tiene | Se leía como un registro de cambios en vez de como la descripción de once Escuelas | D-041 | `src/lib/informes.test.ts` |
| 3 | `overflow-wrap:anywhere` aplicado a `td, th` | 33 celdas con una palabra partida | «PRESEN / CIA», «TRANSF / ERENCI / A», «PISO» roto en vertical | D-042 | `verificar-maqueta.mjs` |
| 4 | **La portada declaraba una confianza que el anexo desmentía** | Tres afirmaciones de «74 fuentes · 100 %» en el frontis contra un anexo que declara 96 fuentes y 22 sin contrastar | La primera persona que comprobara una cosa contra la otra encontraba una contradicción en el documento que le pide que confíe en su verificación | *pendiente de redactar como decisión* | *pendiente* |

---

## El que se cierra en esta sesión · 09-09-2026

### Las cifras del sitio podían divergir de las del documento

**Cómo se midió.** La regla de D-039 —una figura derivada de un dato no se
dibuja aparte del dato— gobernaba el PDF y no la web. El sitio servía el
documento dentro de un marco, de modo que hasta hoy no había divergencia
posible **porque no había nada que divergir**: la web no dibujaba ninguna cifra
propia. En el momento en que la fase 4 pide un comparador nativo, el defecto que
costó dos días en la v2.0.0 vuelve a estar disponible, ahora en TypeScript.

**Qué habría costado.** Exactamente lo mismo que la primera vez, con un
agravante: un componente React con las cifras escritas a mano no tiene un
`figuras.mjs` que lo delate. Nadie compara un `.tsx` contra una tabla del anexo
D hasta que un lector lo hace por su cuenta.

**Cómo se corrigió.** `scripts/informe-01/08-compilar-comparador.mjs` genera
`src/data/informe01Comparador.ts` desde `matriz-v2.json` con la rúbrica del
anexo D. El componente sólo dibuja. El generador además **se niega a correr** si
la matriz cambia de forma: si alguien añade una capacidad y no la rotula, o si
el orden de las claves deja de coincidir, lanza en vez de emitir un archivo con
una columna sin nombre.

**La regla.** *Ningún componente del sitio escribe a mano una cifra que el
documento publique.* Es D-039 extendida a la web, y la razón es la misma:
mientras la figura y la tabla salgan de sitios distintos, divergir no es un
accidente sino cuestión de tiempo.

**La prueba.** `src/data/informe01Comparador.test.ts`, nueve comprobaciones
dentro de `npm run verify`. Recalcula la matriz desde `matriz-v2.json` con la
rúbrica del anexo D —repetida a propósito en la prueba, porque importarla del
generador sería comprobar que el generador coincide consigo mismo— y verifica
el estado celda por celda, el piso, el techo, las celdas sin concluir, el orden
publicado, que la institución apartada no ocupe posición, y que cada cierre de
la ronda cuelgue de su celda con su nota literal. Un dato regenerado y no
recompilado rompe el `verify` en vez de llegar a producción.

Sin ella la garantía habría sido una cabecera que dice «archivo generado», que
es disciplina y no comprobación. Una regla sin prueba dura una entrega.

---

## El siguiente, con su cifra medida

### La resolubilidad de las fuentes no se comprueba en el `verify`

**La cifra.** De las 22 direcciones de la ronda de ampliación, **tres devuelven
`404`**, y el documento sólo declara una de las tres. Sostienen **cuatro puntos
no declarados** de la matriz. Se descubrieron en cuatro minutos de máquina, y
llevaban publicadas desde la v2.0.0.

**Por qué es un cuello y no una tarea.** El corpus tiene 96 fuentes y crece. La
comprobación de resolubilidad se hizo a mano el 01-09-2026 sobre 43 fuentes,
volvió a hacerse hoy sobre 22, y entre una y otra pasaron ocho días en los que
nadie sabía si un enlace publicado seguía en pie. Un informe cuya defensa es la
trazabilidad no puede enterarse de que sus citas se rompieron porque alguien
pase por ahí.

**Qué costaría cerrarlo.** Poco: la herramienta ya existe
(`tools/informes/informe-01/contraste-r2/contrastar.mjs`, con el fallo declarado
de aplicar la heurística de PDF a los cuerpos de error). Falta convertirla en
una comprobación periódica sobre el registro completo, con su instantánea
fechada, y decidir qué hace el informe con un enlace roto: recuperarlo en otro
dominio, degradarlo, o declararlo en el propio documento como ya se hace con
dos.

**Lo que no hay que hacer.** Meterla en `npm run verify`. Una prueba que depende
de que noventa y seis servidores universitarios estén en pie falla por causas
ajenas al cambio que se está verificando, y una prueba que falla sin culpa del
autor enseña a ignorarla — que es el mismo razonamiento por el que el
`.gitattributes` de este repositorio desactiva la conversión de finales de línea
en lo publicado.
