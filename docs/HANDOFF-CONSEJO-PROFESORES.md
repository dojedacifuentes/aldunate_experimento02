# Traspaso · Ediciones para el Consejo de Profesores

Estado al 16 de septiembre de 2026. Todo está versionado en este repositorio y no hace falta ningún archivo del escritorio.

## 0. Son dos informes distintos

Este directorio produce dos documentos con objetos diferentes. Conviene fijarlo antes de tocar nada, porque el nombre corto de cada uno no lo dice.

### Informe 01 · Uso de inteligencia artificial en las Escuelas de Derecho

Qué capacidades han construido **once facultades de Derecho chilenas**: unidades, normas propias, presencia en pregrado, formación continua, investigación, transferencia y uso interno. Es un mapeo institucional nacional, con un capítulo de contraste internacional.

- Escala de cinco dimensiones sobre quince puntos, heredada del informe que el Consejo aprobó en 2025.
- Informe experto de base: v3.2.0, corte del 6 de septiembre de 2026.
- En el sitio: `/informes/ia-escuelas-derecho-chile`
- Borradores en `_build/redaccion/informe-01/`

### Informe 02 · Transformaciones de la enseñanza universitaria

**Qué ha cambiado en la enseñanza universitaria** desde que estudiantes y docentes disponen de sistemas capaces de ejecutar parte del trabajo cognitivo que antes exigía el aprendizaje. Su alcance es universitario, y la formación jurídica entra como caso particular en el capítulo X.

- Escala ordinal de nivel demostrativo, que declara qué acredita la mejor fuente disponible sobre cada afirmación. **Nunca se promedia.**
- Informe experto de base: v0.3.0, agosto de 2026, setenta y siete páginas, rechazado por el profesor.
- Borradores en `_build/redaccion/informe-02c/`

### Una confusión que conviene evitar

Una versión anterior del Informe 02 se entregó bajo el título «Inteligencia artificial generativa y enseñanza del Derecho», lo que estrechó su objeto y lo acercó en apariencia al Informe 01. No son lo mismo: el primero mide qué tienen las facultades chilenas, el segundo examina cómo cambia la enseñanza en cualquier universidad. El alcance universitario quedó confirmado por el usuario el 16 de septiembre de 2026.

---

## 1. Qué pidió el profesor

Correo del director de la Escuela, Eduardo Aldunate Lizana, transcrito literalmente:

> Respecto de los dos informes, sin entrar a su contenido, el formato de presentación debe ser un documento en formato más o menos tradicional, presentable al consejo de profesores, y en que la presentación de la información relevante puede apoyarse en gráficos, pero estos tienen que ser fácilmente discernibles. Aun cuando pueda ser muy util, no me sirve un buen compilado de información. Adicionalmente, y sin rechazar en absoluto el uso de IA en su confección, la redacción y estilo debe estar debidamente humanizado. Muchos profesores ya manejan herramientas de IA y está surgiendo un cierto rechazo a la autoridad de los documentos cuando el estilo se asemeja mucho a respuestas de módulos de LLM. Por lo tanto, en ambos casos le pido que me envie unos borradores en un documento con una estructura tradicional, y estilo humano «listo para usar», por asi decirlo. Todos los detalles técnicos pueden ir en un anexo.

De esas cinco condiciones, cuatro son de forma y una es de método. La de método es la frase sobre el compilado, y es la que explica por qué el Informe 02 se reescribió tres veces.

---

## 2. Dónde está el trabajo

```
tools/informes/consejo-profesores/
  README.md                          cómo operar la cadena
  PROMPT-PROXIMA-SESION.md           el encargo para retomar
  PROMPT-PARA-GEMINI-O-CHATGPT.md    encargo de investigación autocontenido
  PROMPT-INVESTIGACION-PROFUNDA.md   encargo para un agente con contexto
  _build/
    redaccion/informe-01/       Escuelas de Derecho chilenas · TERMINADO
    redaccion/informe-02c/      Transformaciones de la enseñanza · TERMINADO
    redaccion/_descartado/      versiones superadas, con su LEEME
    puntaje/                    matriz, escalas y scripts de cálculo
    hechos/                     hallazgos de cada ronda de búsqueda
    insumos/                    corpus de origen, incluido el informe rechazado
    estilo/                     guía de estilo y reglas de redacción
    figuras/informe-01/         26 figuras
    figuras/informe-02c/        5 figuras
    salida/                     docx y pdf compilados
docs/
  HANDOFF-CONSEJO-PROFESORES.md      este archivo
  REESTRUCTURACION_INFORME02.md      matriz de recuperación del Informe 02
  CAMBIOS_INFORME02.md               qué se mantuvo, reescribió, movió y eliminó
  VERIFICACIONES_PENDIENTES.md       material sin contrastar contra fuente primaria
```

---

## 3. Estado de cada documento

### Informe 01 · terminado

Nueve capítulos y tres anexos, 20.460 palabras, 26 figuras, 63 páginas. Compila y pasa los tres controles. Salida en `salida/Informe-01-IA-escuelas-de-Derecho-Consejo.docx`.

### Informe 02 · terminado

Doce capítulos y seis anexos, 14.874 palabras, 5 figuras, 9 tablas, 52 páginas. Compila y pasa los tres controles. Salida en `salida/Informe-02-Transformaciones-ensenanza-universitaria.docx`.

Su estructura sigue los cambios observados: adopción, evaluación, aprendizaje, competencias, currículo, trabajo docente, respuestas institucionales comparadas, formación profesional, Derecho, implicancias y conclusiones.

---

## 4. Decisiones tomadas que no deben revertirse

**El entregable no narra su propia confección.** Nada de versiones anteriores, correcciones internas, instrucciones de formato de la Dirección ni remisiones a archivos del repositorio. Las limitaciones metodológicas sí se declaran, porque son metodología y no proceso. El registro del proceso vive en `docs/`, fuera del documento.

**No se promedia una escala ordinal.** Una versión anterior calculaba medias como 4,17 y 2,00 sobre niveles demostrativos. La distancia entre el nivel 1 y el 2 no equivale a la que hay entre el 4 y el 5, de modo que esas medias no significan nada. Se reportan recuentos y distribución.

**El índice no se organiza alrededor de una taxonomía propia del informe.** Obliga al lector a aceptarla antes de leer. Sigue los cambios observados y la evidencia disponible.

**La pregunta rectora es qué cambió, no qué decidir.** Las cuestiones institucionales son consecuencia del análisis y ocupan un solo capítulo, el XI, sin imperativos.

**El Informe 02 no es un catálogo de instituciones.** Nueve fichas de universidades extranjeras son el mismo compilado que el profesor rechazó, ordenado por institución en lugar de por tema. El material institucional vive en los anexos C y D, y en el cuerpo aparece como precedente dentro del argumento.

**El recálculo del Informe 01 va sobre la matriz de capacidades**, no sobre el recuento de iniciativas, porque un puntaje que crece con el número de actividades halladas mide la intensidad de la búsqueda tanto como la actividad real.

**La ausencia de evidencia no se cuenta como cero.** Un cero afirma que la capacidad no existe, y sostener eso exige evidencia de la que no se dispone.

**La relación del autor con la medición de 2024 se declara en nota al pie, cada vez que se cita.** El profesor destinatario es coautor de ese trabajo, que es la única medición de efecto del corpus.

---

## 5. Cómo compilar

```
cd tools/informes/consejo-profesores/_build
npm install
node medir-estilo.mjs redaccion/informe-02c
node revisar-residuos.mjs redaccion/informe-02c figuras/informe-02c --doc a
node construir-docx.mjs redaccion/informe-02c/config.json
pwsh word-a-pdf.ps1 -Docx "<ruta>.docx" -Pdf "<ruta>.pdf"
```

El control de estilo debe pasar sin alertas, salvo las líneas de bibliografía, que también las produce el Informe 01. Los otros dos no deben arrojar hallazgos ni avisos.

Las figuras del Informe 02 se regeneran con `node figuras-informe-02c.mjs`. Nunca se edita una cifra en el texto sin cambiarla antes en su fuente de datos.

El salto de página por capítulo cuesta unas diez páginas y se desactiva con `capitulo_en_pagina_nueva: false` en el `config.json`. Con él, el Informe 02 tiene 52 páginas; sin él, 38.

---

## 6. Lo próximo

1. **Verificar el material institucional** contra sus fuentes primarias, según `VERIFICACIONES_PENDIENTES.md`. Son tres entradas y ninguna sostiene por sí sola una conclusión.
2. **Adaptar `auditar-cifras.mjs`** al Informe 02. Hoy comprueba la escala de cinco dimensiones sobre quince del Informe 01.
3. **Preguntar al usuario** si el profesor devolvió observaciones escritas además del correo transcrito en el apartado 1.
