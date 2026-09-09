# Traspaso · empujar el trabajo del 09-09-2026

**Qué es esto.** La sesión que hizo este trabajo lo dejó **commiteado en local y
sin empujar**. Este archivo es lo único que hace falta leer para subirlo.

---

## 1 · Lo primero, en dos órdenes

```bash
cd "C:/Users/Asus/Desktop/aldunate-juego-audaces/aldunate_experimento02"
git log --oneline f099279..HEAD
```

Eso lista exactamente lo que está por subir. `f099279` es donde estaba el
remoto cuando empezó la sesión.

**Antes de empujar, comprueba que nadie más movió `main`.** En este repositorio
trabajan varias sesiones a la vez y `origin/main` es una copia local que
envejece:

```bash
git ls-remote origin main
```

Si devuelve `f099279`, el camino está libre y basta con empujar. Si devuelve
otro hash, **no fuerces nada**: trae lo de arriba con `git pull --rebase origin
main`, vuelve a correr `npm run verify` y empuja después.

```bash
git push origin main
```

Vercel despliega solo, tarda unos 45 segundos, y **la verificación se hace
contra producción, no contra el local**:
`https://aldunateexperimento02.vercel.app/informes/ia-escuelas-derecho-chile`

---

## 2 · Qué se sube, y por qué es seguro

| Commit | Qué trae |
|---|---|
| «La portada decía 100 por ciento…» | La auditoría sustantiva de la fase 1, `docs/informes/10-auditoria-sustantiva.md`, más la herramienta de resolubilidad de la ronda 2 |
| «La web servía un PDF dentro de un marco…» | El comparador ordinal explorable: generador, dato tipado, componente React, entrada en la ficha, y el análisis de sensibilidad ampliado y corregido |
| «Un lector de pantalla anunciaba…» | La etiqueta accesible de cada celda pasa a usar el rótulo del documento |
| «El cuello se cierra con su prueba…» | La prueba que ata el comparador del sitio a la matriz, el registro de cuellos de botella y el `nextStep` del tablero |

**La puerta de aprobación del encargo no se abre.** La regla es parar y
preguntar si algo cambia una cifra publicada sobre una institución con nombre.
No ocurre: **ninguna cifra del comparador cambia**. El sitio dibuja ahora las
mismas que ya publicaban las tablas del documento, y hay una prueba que falla si
alguna vez dejan de coincidir. Lo demás es maqueta, web y prosa que no altera
cifras, y eso se publica sin preguntar.

**Lo que NO se sube, y es deliberado.** No hay versión v3.0.0 del documento. Las
correcciones de fondo que la auditoría encontró —la portada que declara 100 %
frente a un anexo que declara 77 %— exigen regenerar el HTML, el `.docx` por
Word COM y el PDF, y eso es la cadena pesada. La v2.2.0 sigue siendo la vigente
y sigue publicada con sus cifras.

---

## 3 · Cómo se comprobó, antes de commitear

- `npm run verify` en verde (typecheck + lint + test + build).
- Prueba nueva `src/data/informe01Comparador.test.ts`: 9 de 9.
- En el navegador, sobre el servidor de desarrollo: la matriz dibuja, el
  inspector de celda abre y declara la fuente, **sin desborde horizontal global
  ni a 1280 ni a 390 px** —la tabla se desplaza dentro de su propia caja— y la
  consola no registra errores.
- `node tools/informes/informe-01/comparador/figuras.mjs` sigue dando las mismas
  cifras que antes de tocar nada: techo real 20/30, promedio de pisos 11,4,
  5 celdas sin concluir.

---

## 4 · Lo que queda, ya medido

Para que la sesión siguiente empiece con trabajo y no con arqueología.

### P0 · La contradicción de la portada · exige v3.0.0 del documento

El frontis dice «74 fuentes verificadas» y «Corpus verificado al 100 %». El
anexo de ampliación dice que el corpus son **96** y que **22 no han pasado el
contraste**. La cifra correcta es **77 %**, y sigue siendo alta. Está en
`docs/informes/10-auditoria-sustantiva.md`, hallazgo A-1, con las tres cadenas
literales a sustituir.

Se corrige con un guion de sustituciones contadas sobre el HTML entregado —copia
el patrón de `tools/informes/informe-01/v2.2.0/armonizar.mjs`, donde cada
sustitución declara cuántas apariciones espera y no escribe nada si una sola no
cuadra— y luego `npm run informe:publicar` y `npm run verify`.

### P1 · Tres direcciones publicadas que devuelven `404`

`R2-UCEN-01` (3 puntos, la declara el informe), `R2-UC-01` (2 puntos, **no
declarada**) y `R2-UDD-02` (2 puntos, **no declarada**). El análisis de
sensibilidad ya está corrido y acota lo que está en juego: **ninguna de las
cuatro fuentes irrecuperables mueve una posición** hasta la cuarta, y ahí sólo
intercambian dos. Lo que se degrada es la resolución del orden, no el orden.

```bash
node tools/informes/informe-01/comparador/sensibilidad.mjs
```

### P2 · Las tres cosas que faltan de verdad en la interpretación

La auditoría comprobó que las capas 5 y 6 **sí existen** en el documento —los
ocho hallazgos traen `Dato · Lectura · Límite`, las ocho conclusiones declaran
confianza, y «La ventana» ya desarrolla las implicaciones con tres hechos
fechados—. No hay que reconstruirlas. Falta:

1. **La lectura transversal**: qué dicen los ocho hallazgos *juntos*. Las tres
   formas de ausencia —unánime, bimodal, de umbral— están identificadas por
   separado y nadie las lee como un patrón del campo.
2. **Las 3 a 5 prioridades**, sistémicas, nunca dirigidas a una universidad
   nombrada del comparador.
3. **La oportunidad cuantificada**: con qué se llenaría la celda de evaluación
   de efecto —0 de 30 puntos, 0 proyectos ANID en 49.014 desde 1982— y qué
   costaría. Es lo que un fondo concursable pregunta.

### P3 · Deuda técnica declarada

`tools/informes/informe-01/contraste-r2/contrastar.mjs` aplica la heurística de
PDF también a los cuerpos de error, de modo que etiqueta los `404` como
«probablemente escaneado». **El código HTTP es correcto; la nota no.** Arreglar
antes de usarla para otra cosa.

### P4 · Lo que no cabe en una sesión

Fichas institucionales navegables, registro de fuentes explorable y evidencia
por iniciativa exigen recompilar el dataset canónico a datos tipados, que hoy
sólo existe para la v0.8.0 (`src/data/informe01*.ts`). Es un proyecto propio,
no una tarea.
