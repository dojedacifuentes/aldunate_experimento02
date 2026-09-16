# Reestructuración del Informe 02

Matriz de recuperación previa a la reescritura, según la auditoría editorial del 16 de septiembre de 2026. Registra qué material existente sostiene cada sección nueva, qué gráficos le corresponden y qué vacíos quedan.

La versión reestructurada vive en `_build/redaccion/informe-02c/`. Las dos anteriores se conservan sin tocar: `informe-02/` (versión temática, 43 páginas) e `_descartado/informe-02b/` (edición de decisiones, 52 páginas).

## 1. Qué cambia respecto de la edición 02b

La auditoría señaló cuatro defectos y los cuatro son reales.

El primero es estructural. La edición 02b organizaba el índice alrededor de seis funciones pedagógicas inventadas por el propio informe. Una taxonomía propia puede servir como herramienta de análisis y no debe gobernar la tabla de contenidos, porque el lector no tiene por qué aceptarla antes de leer. La estructura nueva sigue los cambios observados y la evidencia disponible.

El segundo es metodológico. La edición 02b promediaba una escala ordinal para producir cifras como 4,17 y 2,00. Promediar niveles ordinales no está justificado: la distancia entre el nivel 1 y el 2 no es la misma que entre el 4 y el 5. La escala se conserva como clasificación en el anexo A, sin medias, y el cuerpo informa recuentos y distribución.

El tercero es de foco. La edición 02b desplazaba la pregunta de investigación hacia la pregunta de decisión. Las cuestiones institucionales son una consecuencia del análisis y ocupan ahora un solo capítulo, el XI, en lugar de cerrar cada capítulo.

El cuarto es de prosa. Seis capítulos con la misma secuencia interna de cinco apartados producen una simetría que se lee como plantilla. La estructura nueva tiene capítulos de arquitectura desigual, como corresponde a materias de densidad distinta.

## 2. Matriz de recuperación

| Sección nueva | Material existente reutilizable | Fuentes | Gráficos | Vacíos |
|---|---|---|---|---|
| Resumen ejecutivo | `_descartado/informe-02b/00-resumen.md`, reescrito sin cifras promediadas | — | — | — |
| I. Introducción | `_descartado/informe-02b/01-objeto.md` y `02-metodologia.md`, comprimidos | — | — | — |
| II. De la adopción individual a un problema institucional | Cap. 2 del informe experto; `03-produccion.md` §2 | HEPI 2026 (n = 1.054), series 2024-2026 | G1 | — |
| III. La evaluación universitaria | `_descartado/informe-02b/04-evaluacion.md` casi íntegro | Scarfe et al. (2024); Liang et al. (2023); Sydney; TEQSA | G2 | Instrumentos: la clasificación es valoración del autor, no medición |
| IV. Inteligencia artificial y aprendizaje | `_descartado/informe-02b/05-practica.md` y `06-retroalimentacion.md` §3 | Bastani et al. (2025); Kestin et al. (2025); Wang y Fan retractado | G3 | — |
| V. Competencias en transformación | Cap. 4 del informe experto, tabla 8; `07-calibracion.md` | METR (2025); marcos Unesco, OCDE y Comisión Europea | Tabla | — |
| VI. Transformación curricular | Cap. 12 del informe experto íntegro | Ohio State; datos de China, México, Singapur y Hong Kong | F4 | Cifras de expansión asiática: `[VERIFICAR]` |
| VII. El trabajo docente | Cap. 6 del informe experto; `06-retroalimentacion.md` §4 | Digital Education Council 2025 (n = 1.681) | G5 | — |
| VIII. Respuestas institucionales comparadas | `_descartado/informe-02b/B-material-institucional.md` | Fuentes institucionales primarias del cap. 17 | Tabla 6 | Contraste con fuentes primarias pendiente |
| IX. Universidad y formación profesional | `_descartado/informe-02b/08-acreditacion.md` | Brynjolfsson et al. (2026); NACE 2026 | — | Traslado a Chile no acreditado |
| X. La enseñanza del Derecho | `_descartado/informe-02b/09-derecho.md` casi íntegro | Magesh et al. (2025); Charlotin (2026); Choi y Schwarcz (2025) | — | — |
| XI. Implicancias para la Escuela | `_descartado/informe-02b/11-decisiones.md`, reformulado sin imperativos | Faúndez-Ugalde et al. (2024) | — | — |
| XII. Conclusiones | Nuevo | — | — | — |
| Anexo A. Metodología | `_descartado/informe-02b/A-metodologia-tecnica.md`, sin las medias | — | — | — |
| Anexo B. Matriz de evidencia | Anexo B del informe experto, con las siete columnas pedidas | Todo el corpus | — | — |
| Anexo C. Casos institucionales | `_descartado/informe-02b/B-material-institucional.md` §B.1 | — | — | — |
| Anexo D. Evidencia sobre enseñanza jurídica | Cap. 13 del informe experto | — | — | — |
| Anexo E. Declaración de uso de IA | `_descartado/informe-02b/C-uso-de-ia.md`, reducido a media página | — | — | — |
| Anexo F. Referencias | `_descartado/informe-02b/12-referencias.md` | — | — | — |

## 3. Gráficos

La edición 02b tenía quince figuras. La reestructurada tiene cinco, porque la auditoría exige que cada gráfico resuelva una pregunta visual y que lo que pueda decirse en una frase se diga en una frase. Esa reducción se mantiene aunque la restricción de extensión se haya relajado, porque no dependía de ella.

| Id | Capítulo | Pregunta visual que resuelve | Series |
|---|---|---|---|
| g1-adopcion | II | ¿Creció el uso al mismo ritmo que la delegación completa? | 2 |
| g2-instrumentos | III | ¿Qué instrumentos conservan capacidad de verificación? | 1 ordinal |
| g3-ensayos | IV | ¿Por qué dos experimentos con la misma tecnología dan resultados opuestos? | 2 |
| f4-curriculo | VI | ¿En qué se diferencian las tres modalidades de incorporación curricular? | diagrama |
| g5-docentes | VII | ¿Qué declara el profesorado sobre su propia situación? | 4 barras |

Las diez figuras de la edición 02b que no sobreviven se conservan en `figuras/_no-usadas/informe-02b/`.

## 4. Vacíos marcados para verificación

Los que aparecen en la columna correspondiente de la matriz quedan registrados en `VERIFICACIONES_PENDIENTES.md`, con lo que cada uno permitiría afirmar si se acreditara.
