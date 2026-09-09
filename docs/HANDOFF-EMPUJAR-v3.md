# Traspaso · el trabajo del 09-09-2026 y la v3.0.0

**Qué es esto.** El estado en que quedó la sesión, qué se publicó y qué queda.
Si los commits todavía no están en GitHub, la sección 1 es lo único que hace
falta leer.

---

## 1 · Empujar, en dos órdenes

```bash
cd "C:/Users/Asus/Desktop/aldunate-juego-audaces/aldunate_experimento02"
git log --oneline f099279..HEAD
```

Eso lista exactamente lo que está por subir. `f099279` es donde estaba el remoto
cuando empezó la sesión.

**Antes de empujar, comprueba que nadie más movió `main`.** En este repositorio
trabajan varias sesiones a la vez y `origin/main` es una copia local que
envejece:

```bash
git ls-remote origin main
```

Si devuelve `f099279`, el camino está libre. Si devuelve otro hash, **no fuerces
nada**: trae lo de arriba con `git pull --rebase origin main`, vuelve a correr
`npm run verify` y empuja después.

```bash
git push origin main
```

Vercel despliega solo, tarda unos 45 segundos, y **la verificación se hace
contra producción, no contra el local**:
`https://aldunateexperimento02.vercel.app/informes/ia-escuelas-derecho-chile`

---

## 2 · Qué se hizo

| Commit | Qué trae |
|---|---|
| «La portada decía 100 por ciento…» | La auditoría sustantiva de la fase 1, `docs/informes/10-auditoria-sustantiva.md`, más la herramienta de resolubilidad de la ronda 2 |
| «La web servía un PDF dentro de un marco…» | El comparador ordinal explorable: generador, dato tipado, componente React, entrada en la ficha, y el análisis de sensibilidad ampliado y corregido |
| «Un lector de pantalla anunciaba…» | La etiqueta accesible de cada celda pasa a usar el rótulo del documento |
| «El cuello se cierra con su prueba…» | La prueba que ata el comparador del sitio a la matriz, el registro de cuellos de botella y el `nextStep` del tablero |
| «El corpus son 96 fuentes y no 74…» | **La v3.0.0 del documento**: guion de armonización, los seis artefactos publicados, la entrada en `reports.ts`, la conversión a Word por COM y la decisión D-043 |

**La v3.0.0 es la versión vigente.** La v2.2.0 se queda publicada donde estaba,
con las cifras que sostenía —se comprobó que su HTML conserva intactas sus dos
afirmaciones de «Corpus verificado al 100 %»—. Una versión publicada no se
sobrescribe.

**La puerta de aprobación del encargo no se abre.** La regla es parar y
preguntar si algo cambia una cifra publicada sobre una institución con nombre.
No ocurre: ninguna celda se degrada, ninguna posición se mueve, el corpus y la
rúbrica son los de la v2.2.0. Lo que cambia es lo que el documento afirma sobre
su propia verificación.

---

## 3 · Cómo se comprobó

- `npm run verify` en verde: 237 pruebas, build con la ruta `/v/3.0.0` incluida.
- Prueba nueva `src/data/informe01Comparador.test.ts`: 9 de 9. Ata el comparador
  del sitio a `matriz-v2.json` celda por celda.
- Maqueta de la v3.0.0, medida: **0 palabras partidas · 0 tablas fuera de la
  caja de 160 mm · 0 columnas bajo 10 mm · 0 rótulos sobre barra**. 93 páginas
  de contenido, 112 impresas — idénticas a la v2.2.0.
- El guion de armonización aplicó **25 sustituciones, todas con su recuento
  exacto**, y comprobó al terminar que no queda ninguna afirmación de «corpus
  verificado al 100 %» ni ninguna letra de anexo repetida.
- En el navegador: la matriz dibuja, el inspector de celda abre y declara la
  fuente, **sin desborde horizontal global ni a 1280 ni a 390 px**, y la consola
  no registra errores.
- `figuras.mjs` sigue dando las mismas cifras que antes de tocar nada: techo
  real 20/30, promedio de pisos 11,4, 5 celdas sin concluir.

---

## 4 · Lo que queda, ya medido

Para que la sesión siguiente empiece con trabajo y no con arqueología.

### P0 · Las tres direcciones que no resuelven

`R2-UCEN-01` (3 puntos), `R2-UC-01` (2 puntos) y `R2-UDD-02` (2 puntos)
devuelven `404`. **La v3.0.0 las declara**, que era lo urgente; lo que queda es
recuperarlas —buscar el mismo hecho en otro dominio de la misma institución,
como ya se hizo con una fuente de la Universidad Central— o degradarlas con la
puerta de aprobación abierta, porque eso sí movería cifras con nombre.

La sensibilidad está corrida y acota lo que está en juego:

```bash
node tools/informes/informe-01/comparador/sensibilidad.mjs
```

Si las cuatro fuentes irrecuperables cayeran a la vez, el orden sólo
intercambiaría dos puestos.

### P1 · Las trece fuentes que sostienen puntos

De las 22 de la ronda de ampliación, **13 sostienen cierres de la matriz por 25
puntos**. Contrastarlas es el trabajo pendiente de mayor valor. La ruta barata
está montada: `tools/informes/informe-01/contraste-r2/contrastar.mjs` resuelve
por máquina los campos comprobables —existencia, título literal, fecha, unidad—
y deja para quien firma los tres que son juicio: anuncio frente a ejecución,
límites del documento y respaldo efectivo.

**Su fallo, declarado:** aplica la heurística de PDF también a los cuerpos de
error, de modo que etiqueta los `404` como «probablemente escaneado». El código
HTTP es correcto; la nota no. Arreglar antes de usarla para otra cosa.

### P2 · Las tres cosas que faltan en la interpretación

La auditoría comprobó que las capas 5 y 6 **sí existen** —los ocho hallazgos
traen `Dato · Lectura · Límite`, las ocho conclusiones declaran confianza, y la
sección 10, que en la v3.0.0 recuperó su encabezado, ya desarrolla las
implicaciones con tres hechos fechados—. No hay que reconstruirlas. Falta:

1. **La lectura transversal**: qué dicen los ocho hallazgos *juntos*. Las tres
   formas de ausencia —unánime, bimodal, de umbral— están identificadas por
   separado y nadie las lee como un patrón del campo.
2. **Las 3 a 5 prioridades**, sistémicas, nunca dirigidas a una universidad
   nombrada del comparador.
3. **La oportunidad cuantificada**: con qué se llenaría la celda de evaluación
   de efecto —0 de 30 puntos, 0 proyectos ANID en 49.014 desde 1982— y qué
   costaría. Es lo que un fondo concursable pregunta.

### P3 · El cuello siguiente, con su cifra

La resolubilidad de las fuentes no se comprueba en ninguna parte de la cadena.
Tres de 22 direcciones estaban rotas y llevaban publicadas desde la v2.0.0; se
descubrieron en cuatro minutos de máquina. El registro completo está en
`docs/informes/CUELLOS-DE-BOTELLA.md`, con lo que costaría cerrarlo y por qué
**no** debe meterse dentro de `npm run verify`.

### P4 · Lo que no cabe en una sesión

Fichas institucionales navegables, registro de fuentes explorable y evidencia
por iniciativa exigen recompilar el dataset canónico a datos tipados, que hoy
sólo existe para la v0.8.0 (`src/data/informe01*.ts`). Es un proyecto propio, no
una tarea.

---

## 5 · La mecánica de la v3.0.0, para repetirla

El original **no se edita a mano**. La cadena entera:

```bash
node tools/informes/informe-01/v3.0.0/armonizar.mjs     # deriva el HTML nuevo
npm run informe:lector                                   # capa de lectura
npm run informe:pdf                                      # PDF
```

```powershell
powershell -ExecutionPolicy Bypass -File scripts\informes\lector\html-a-word.ps1 -Version 3.0.0
```

```bash
npm run informe:word                                     # de 10 a 12 pt
npm run verify
```

**Las dos trampas de Word por COM**, y las dos cuestan una hora si no se
conocen: `Join-Path` devuelve un PSObject que los parámetros `[ref]` no aceptan
—hay que envolver cada ruta en `[string]`—, y el objeto de `New-Object
-ComObject` es de enlace tardío y **no expone `SaveAs2`**; hay que llamar a
`SaveAs` con parámetros `[ref]`. Las dos están resueltas y comentadas en
`html-a-word.ps1`.

El `.docx` se escribe en `entregas/`, no en `public/descargas/`: es la fuente
intocada de la que `word.mjs` deriva el publicado a 12 pt. Si se escribiera ya
en descargas, cada pasada agrandaría la letra otra vez.
