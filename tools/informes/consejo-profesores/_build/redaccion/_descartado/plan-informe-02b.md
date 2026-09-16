# Informe 02, edición de decisiones

Estado al 16 de septiembre de 2026: **redactado y compilado**. Este archivo describe lo entregado y sustituye al plan anterior, que organizaba el informe en fichas institucionales y quedó descartado por instrucción del usuario.

La metodología que gobierna el documento está en [`metodologia-informe-02b.md`](metodologia-informe-02b.md). Ante cualquier discrepancia manda ese archivo.

## 1. Identidad

- **Título:** La transformación de la enseñanza ante la automatización del trabajo cognitivo
- **Subtítulo:** Qué cambió, qué sabemos y qué hay que decidir · Edición 2026
- **Objeto:** la pedagogía universitaria en general, con el Derecho como caso particular
- **Fuente:** informe experto v0.3.0, «La universidad ante la automatización del trabajo cognitivo», agosto de 2026
- **Corte de la evidencia:** 15 de septiembre de 2026
- **Autor:** Diego Hernán Ojeda Cifuentes
- **Salida:** `salida/Informe-02b-Transformacion-ensenanza-Consejo.docx` y su PDF, 52 páginas

## 2. Qué clase de instrumento es

Un insumo para comprender y para decidir, según la instrucción del usuario del 16 de septiembre de 2026. Quedan descartados los tres formatos anteriores: el compilado temático, que es lo que el profesor rechazó en agosto; el catálogo institucional, que es el mismo compilado ordenado por institución; y el ranking, que no le dice a un consejo qué hacer.

La unidad de análisis es la función pedagógica y su redistribución. La automatización desagregó las funciones de la enseñanza en lugar de eliminarlas, y las partes que se producían solas, como subproducto de otra tarea, quedaron sin responsable. Cada capítulo identifica ese residuo y deja planteada la decisión que lo asignaría.

Las instituciones no estructuran el documento. Aparecen dentro de cada decisión como precedente, con su nivel demostrativo, y el material comparado completo va al anexo B.

## 3. La medida

Escala de nivel demostrativo de 0 a 5, heredada del anexo B del informe experto, aplicada **dos veces a cada función**: una al diagnóstico y otra a la respuesta.

| | Media | Bajo nivel 3 |
|---|---|---|
| Diagnóstico | 4,17 | 0 de 6 |
| Respuesta | 2,00 | 5 de 6 |
| Distancia | 2,17 | |

Ese contraste es el resultado principal del informe: el campo sabe qué pasó e ignora qué hacer. La calibración concentra la brecha máxima, con diagnóstico 4 y ninguna respuesta localizada. La práctica es la excepción favorable, con diagnóstico 5 y respuesta 4.

Los datos están en [`../puntaje/funciones-pedagogicas.json`](../puntaje/funciones-pedagogicas.json) y las figuras se generan de ahí con `figuras-funciones.mjs`, sin intervención manual sobre las cifras.

## 4. Estructura entregada

| Capítulo | Palabras | Gráficos |
|---|---|---|
| I. Resumen | 729 | — |
| II. Objeto y alcance | 673 | — |
| III. Metodología | 1.013 | — |
| IV. La producción de textos y la verificación | 1.136 | 3 |
| V. La evaluación | 1.104 | 3 |
| VI. La práctica | 904 | 2 |
| VII. La retroalimentación | 854 | 2 |
| VIII. La calibración | 908 | 2 |
| IX. La acreditación | 889 | 2 |
| X. El Derecho como caso particular | 1.169 | 1 tabla |
| XI. Mapeo general | 1.046 | 1 |
| XII. Decisiones | 991 | 1 tabla |
| XIII. Referencias | 835 | — |
| Anexo A. Rúbrica y procedimiento | 1.280 | 3 tablas |
| Anexo B. Material institucional comparado | 1.074 | 3 tablas |
| Anexo C. Uso de inteligencia artificial | 615 | — |

Total: 15.220 palabras en borrador, 15 figuras y 8 tablas, 52 páginas compiladas. El Informe 01 tiene 20.460 palabras y 26 figuras.

## 5. Las seis funciones

| Función | Qué se automatizó | Qué quedó sin responsable | Diag. | Resp. |
|---|---|---|---|---|
| Producción de textos | La redacción y la búsqueda de fuentes | La verificación de lo que el texto afirma | 4 | 2 |
| Evaluación | La producción del entregable | La inferencia del aprendizaje a partir del producto | 4 | 2 |
| Práctica | La resolución del ejercicio | La dificultad que producía la práctica | 5 | 4 |
| Retroalimentación | La corrección inmediata y abundante | El criterio para saber cuándo se equivoca | 4 | 2 |
| Calibración | La fluidez del producto final | La estimación realista del propio nivel | 4 | 0 |
| Acreditación | El costo de producir | Aquello que el título certifica | 4 | 2 |

## 6. Controles pasados

- `node medir-estilo.mjs redaccion/informe-02b` — sin alertas, salvo las líneas de bibliografía, que también las produce el Informe 01.
- `node revisar-residuos.mjs redaccion/informe-02b figuras/informe-02b --doc a` — sin hallazgos.
- `node construir-docx.mjs redaccion/informe-02b/config.json` — sin avisos.
- `word-a-pdf.ps1` — 52 páginas.

## 7. Lo que queda pendiente

1. **Verificar el material institucional del anexo B** contra sus fuentes primarias. Procede del informe experto y no se contrastó institución por institución en esta edición, según declara el apartado C.3.
2. **Trasladar las treinta instituciones del mapa internacional** a formato de datos, si en algún momento una afirmación del cuerpo llega a descansar sobre ellas. Hoy ninguna lo hace.
3. **Adaptar `auditar-cifras.mjs`**, que comprueba la escala de cinco dimensiones sobre quince del Informe 01. Para este documento debería comprobar los doce niveles contra `funciones-pedagogicas.json`.
4. **Preguntar al usuario** si el profesor devolvió observaciones escritas además del correo transcrito.
