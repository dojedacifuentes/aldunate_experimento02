# Cambios del Informe 02

Registro de la reestructuración del 16 de septiembre de 2026, ejecutada según la auditoría editorial. La versión nueva vive en `tools/informes/consejo-profesores/_build/redaccion/informe-02c/`, y las dos anteriores se conservan intactas.

## 1. Las tres versiones

| Versión | Carpeta | Organización | Extensión | Estado |
|---|---|---|---|---|
| Informe experto v0.3.0 | `insumos/informe-02/` | 24 capítulos temáticos | 77 páginas | Rechazado en agosto de 2026 |
| Edición temática | `redaccion/informe-02/` | 11 capítulos temáticos | 43 páginas | Superada |
| Edición de decisiones | `redaccion/informe-02b/` | 6 funciones pedagógicas | 52 páginas | Superada |
| **Edición reestructurada** | `redaccion/informe-02c/` | **12 capítulos según los cambios observados** | **52 páginas** | **Vigente** |

## 2. Los cuatro defectos que la auditoría señaló, y qué se hizo con cada uno

El primero era estructural. La edición 02b organizaba el índice alrededor de seis funciones pedagógicas que el propio informe había inventado, de modo que el lector debía aceptar la taxonomía antes de leer. La estructura nueva sigue los cambios observados y la evidencia disponible. La taxonomía sobrevive como herramienta de análisis dentro de los capítulos III a V, sin gobernar la tabla de contenidos.

El segundo era metodológico y es el más grave. La edición 02b promediaba una escala ordinal para producir cifras como 4,17 y 2,00, lo que carece de justificación: la distancia entre el primer grado y el segundo no equivale a la distancia entre el cuarto y el quinto. Todas las medias se retiraron. El apartado A.6 explica la razón y reporta recuentos y distribución, que es lo que una escala ordinal admite.

El tercero era de foco. La edición 02b desplazaba la pregunta de investigación hacia la pregunta de decisión, y cerraba cada capítulo con una decisión institucional. Las cuestiones institucionales ocupan ahora un solo capítulo, el XI, como consecuencia del análisis.

El cuarto era de prosa. Seis capítulos con la misma secuencia interna de cinco apartados producían una simetría que se lee como plantilla. Los capítulos nuevos tienen arquitectura desigual, y se eliminaron las fórmulas que se repetían, entre ellas «la pregunta que queda planteada» y la frase sentenciosa «el campo sabe qué pasó y no sabe qué hacer».

## 3. Qué se hizo con cada material

| Material de la edición 02b | Destino |
|---|---|
| Capítulo IV, producción de textos y verificación | Reescrito y repartido entre los capítulos V y X |
| Capítulo V, evaluación | Mantenido casi íntegro como capítulo III, con el gráfico de instrumentos añadido |
| Capítulo VI, práctica | Reescrito como capítulo IV, con la regla de diseño como eje |
| Capítulo VII, retroalimentación | Dividido: la evidencia al capítulo IV, el profesorado al capítulo VII |
| Capítulo VIII, calibración | Comprimido en el apartado 3 del capítulo V |
| Capítulo IX, acreditación | Reescrito como capítulo IX, sobre formación profesional |
| Capítulo X, el Derecho | Mantenido casi íntegro como capítulo X |
| Capítulo XI, mapeo general | Eliminado; su contenido pasó al capítulo VIII y a las conclusiones |
| Capítulo XII, decisiones | Reformulado como capítulo XI, sin imperativos |
| Anexo A, rúbrica | Reescrito como anexo A, sin las medias |
| Anexo B, material institucional | Dividido entre el anexo B, matriz de evidencia, y el anexo C, casos |
| Anexo C, uso de IA | Reducido de 615 a 175 palabras como anexo E |
| Las 15 figuras | Cinco sobreviven en forma nueva; las diez restantes se conservan en `figuras/informe-02b/` |

## 4. Material nuevo

Cuatro capítulos no existían en ninguna versión anterior. El II, sobre la distancia entre adopción y transformación, con la serie longitudinal de tres oleadas. El VI, sobre las tres modalidades de incorporación curricular, recuperado del capítulo 12 del informe experto que ninguna edición para el Consejo había usado. El VIII, comparación institucional con su tabla de siete casos. Y el XII, conclusiones que responden la pregunta de la introducción.

El anexo B, la matriz de evidencia con siete columnas, es también nuevo. Ninguna edición anterior permitía comprobar, afirmación por afirmación, sobre qué diseño de estudio descansaba.

## 5. Las figuras

De quince se pasó a cinco, porque la auditoría exige que cada gráfico resuelva una pregunta visual y que lo que pueda decirse en una frase se diga en una frase.

| Id | Capítulo | Pregunta que resuelve |
|---|---|---|
| g1-adopcion | II | ¿Creció el uso al mismo ritmo que la delegación completa? |
| g2-instrumentos | III | ¿Qué instrumentos conservan capacidad de verificación? |
| g3-ensayos | IV | ¿Por qué dos experimentos con la misma tecnología dan resultados opuestos? |
| f4-curriculo | VI | ¿En qué se diferencian las tres modalidades de incorporación curricular? |
| g5-docentes | VII | ¿Qué declara el profesorado sobre su propia situación? |

Las cinco usan como máximo tres tonos, funcionan en escala de grises y llevan su fuente visible. Las dos que expresan valoraciones del autor lo declaran en la nota.

## 6. Controles pasados

```
node medir-estilo.mjs redaccion/informe-02c
node revisar-residuos.mjs redaccion/informe-02c figuras/informe-02c --doc a
node construir-docx.mjs redaccion/informe-02c/config.json
```

El control de estilo pasa sin alertas, salvo las líneas de bibliografía, que también las produce el Informe 01. El de residuos no arroja hallazgos y la compilación no emite avisos.

Se ejecutaron además dos revisiones que la auditoría exige. La epistemológica buscó «demuestra», «prueba», «causa», «confirma» y «concluye», y corrigió dos pasajes en que el verbo excedía lo que la fuente permite. La de hipérbole y personificación buscó «revolución», «sin precedentes», «concluyente», «la universidad reaccionó» y «la evidencia exige», sin encontrar ninguna.

## 7. Una nota sobre la extensión

La auditoría fijaba un objetivo de 34 a 38 páginas, y el usuario lo relajó el 16 de septiembre de 2026 en favor de la coherencia del documento. El entregable tiene 52 páginas.

La cifra depende de dos decisiones. La primera es el salto de página por capítulo, que es el formato del Informe 01 y cuesta unas diez páginas; conservarlo produce un documento tradicional, y desactivarlo con `capitulo_en_pagina_nueva: false` en el config lo comprime a 38. La segunda es la extensión de los anexos C y D, que en la versión de 38 páginas estaban recortados y ahora llevan las fichas institucionales completas y las tablas de cifras jurídicas.

Para situar la cifra: el Informe 01, que el Consejo aprobó, tiene 63 páginas, y el informe experto rechazado, 77.

## 8. Qué no aparece en el entregable

El documento no narra su propia confección. Se retiraron de él tres pasajes que lo hacían: la advertencia del anexo A sobre que una versión anterior había promediado la escala ordinal, la mención del anexo E a que la declaración figura ahí por indicación de la Dirección, y la remisión del anexo A a `VERIFICACIONES_PENDIENTES.md`, que es un archivo interno.

Las limitaciones sustantivas se conservan íntegras, porque son metodología y no proceso: los dos materiales sin contrastar contra fuente primaria se declaran allí donde se emplean, y el anexo A los enumera.

El registro del proceso vive en este archivo y en los otros dos de `docs/`, fuera del documento que se entrega.
