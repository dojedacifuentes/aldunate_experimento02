# Prompt para la próxima sesión

Copiar desde la línea siguiente. Sirve tanto para Claude como para Codex.

---

Trabajo en el repositorio `dojedacifuentes/aldunate_experimento02`. Continúo dos informes para el Consejo de Profesores de la Escuela de Derecho de la Pontificia Universidad Católica de Valparaíso. **Ambos están terminados y compilados.** Lo que queda es verificación y ajuste, no redacción nueva.

## Son dos informes distintos

**Informe 01 · Uso de inteligencia artificial en las Escuelas de Derecho.** Mide qué capacidades han construido once facultades de Derecho chilenas. Escala de cinco dimensiones sobre quince puntos. Nueve capítulos, tres anexos, 26 figuras, 63 páginas. En `_build/redaccion/informe-01/`.

**Informe 02 · Transformaciones de la enseñanza universitaria en el contexto de la inteligencia artificial.** Examina qué ha cambiado en la enseñanza universitaria desde que estudiantes y docentes disponen de sistemas capaces de ejecutar parte del trabajo cognitivo que antes exigía el aprendizaje. Alcance universitario, con la formación jurídica como caso particular en el capítulo X. Doce capítulos, seis anexos, 5 figuras, 52 páginas. En `_build/redaccion/informe-02c/`.

Las versiones anteriores del Informe 02 están en `_build/redaccion/_descartado/`, con un `LEEME.md` que explica por qué se descartó cada una. **No las uses para redactar.**

## Lo primero que debes leer

Todo está en `tools/informes/consejo-profesores/`. En este orden:

1. `README.md` — cómo funciona la cadena de construcción y qué debe dar cada control.
2. `docs/HANDOFF-CONSEJO-PROFESORES.md` — el estado completo y las decisiones que no deben revertirse.
3. `_build/estilo/reglas-documento-a.md` — las reglas de redacción, que mandan sobre cualquier costumbre.
4. `docs/VERIFICACIONES_PENDIENTES.md` — lo que falta comprobar.

## Ocho reglas que no puedes romper

**El entregable no narra su propia confección.** Ni versiones anteriores, ni correcciones internas, ni instrucciones de formato de la Dirección, ni remisiones a archivos del repositorio. Las limitaciones metodológicas sí se declaran, porque son metodología y no proceso.

**No promedies una escala ordinal.** Una versión anterior calculaba medias como 4,17 y 2,00 sobre niveles demostrativos. La distancia entre el nivel 1 y el 2 no equivale a la que hay entre el 4 y el 5. Se reportan recuentos y distribución.

**El índice no se organiza alrededor de una taxonomía inventada por el propio informe.** Obliga al lector a aceptarla antes de leer.

**La pregunta rectora es qué cambió, no qué debe decidir la Escuela.** Las cuestiones institucionales son consecuencia del análisis y ocupan un solo capítulo, sin imperativos. Se escribe «la evidencia permite plantear» o «cabe considerar», nunca «se recomienda adoptar».

**Distingue siempre qué acredita una fuente.** Que una universidad implementara algo acredita que lo implementó, sin acreditar que funcione. Usa «muestra», «registra», «sugiere» o «es consistente con», y reserva «demuestra» y «prueba» para diseños que lo permitan.

**Títulos descriptivos y numerados, sin dos puntos.** La regla de estilo los prohíbe, así que se usa coma: «La evaluación universitaria, del producto entregado a la evidencia del aprendizaje».

**Sin negritas en el cuerpo, sin metáforas en los títulos, oración media de 20 a 30 palabras.** Y vigila las señales de prosa automática: capítulos con secuencia interna idéntica, fórmulas que se repiten, frases sentenciosas de remate.

**Cada vez que cites el trabajo de 2024 de Faúndez-Ugalde, Mellado-Silva, Aldunate-Lizana y Benfeld, declara en nota al pie que el autor del informe figura entre sus ayudantes de investigación agradecidos.** El profesor destinatario es coautor, y es la única medición de efecto del corpus.

## Qué queda por hacer

1. **Verificar el material institucional del Informe 02** contra fuentes primarias. `docs/VERIFICACIONES_PENDIENTES.md` lista tres entradas: las cifras de expansión de la oferta asiática del capítulo VI, la información de las siete instituciones del capítulo VIII y del anexo C, y la cifra británica de mala conducta académica del capítulo III. Cada entrada dice qué pasaría con el texto si la verificación saliera negativa. Ninguna sostiene por sí sola una conclusión.
2. **Adaptar `auditar-cifras.mjs`** al Informe 02. Hoy comprueba la escala de cinco dimensiones sobre quince del Informe 01, y debería comprobar que cada cifra del cuerpo coincide con su fuente de datos.
3. **Preguntar al usuario** si el profesor devolvió observaciones escritas además del correo transcrito más abajo.

## Cómo compilar

```
cd tools/informes/consejo-profesores/_build
npm install
node figuras-informe-02c.mjs
node medir-estilo.mjs redaccion/informe-02c
node revisar-residuos.mjs redaccion/informe-02c figuras/informe-02c --doc a
node construir-docx.mjs redaccion/informe-02c/config.json
```

El control de estilo debe pasar sin alertas, salvo las líneas de bibliografía, que también las produce el Informe 01. Los otros dos no deben arrojar hallazgos ni avisos. Nunca edites una cifra en el texto sin cambiarla antes en su fuente de datos.

La extensión no es una restricción: prioriza la coherencia. El salto de página por capítulo cuesta unas diez páginas y se desactiva con `capitulo_en_pagina_nueva: false` en el `config.json`.

## Trampas del entorno

Windows con PowerShell 5.1 y Git Bash. Node está instalado; Python no. No hay poppler, de modo que los PDF se leen con `pdfjs-dist` y se rasterizan con `pdf-a-png.mjs`.

Los heredoc de Bash fallan con contenido que lleve acentos, comillas angulares o backticks. Para textos largos, escribe un archivo `.mjs` y ejecútalo.

Git avisa de conversión CRLF en cada commit; es normal en este repositorio.

Varias sesiones escriben a la vez sobre este repositorio. Consulta el remoto con `git ls-remote origin -h refs/heads/main` antes de empujar, no con `origin/main`.

## El correo del profesor, transcrito

> Respecto de los dos informes, sin entrar a su contenido, el formato de presentación debe ser un documento en formato más o menos tradicional, presentable al consejo de profesores, y en que la presentación de la información relevante puede apoyarse en gráficos, pero estos tienen que ser fácilmente discernibles. Aun cuando pueda ser muy útil, no me sirve un buen compilado de información. Adicionalmente, y sin rechazar en absoluto el uso de IA en su confección, la redacción y estilo debe estar debidamente humanizado. Muchos profesores ya manejan herramientas de IA y está surgiendo un cierto rechazo a la autoridad de los documentos cuando el estilo se asemeja mucho a respuestas de módulos de LLM. Por lo tanto, en ambos casos le pido que me envíe unos borradores en un documento con una estructura tradicional, y estilo humano «listo para usar», por así decirlo. Todos los detalles técnicos pueden ir en un anexo.

De esas cinco condiciones, cuatro son de forma y una es de método. La de método es la frase sobre el compilado, y es la que explica por qué el Informe 02 se reescribió tres veces antes de quedar como está.
