# TASKS — Informe 01

Tareas para la siguiente versión. Están dichas por **qué debe conseguirse**, no
por cómo: la solución concreta es criterio de quien la ejecute.

Actualizado 04-09-2026 · sobre v0.7.0

---

## Antes que nada · cerrar esta entrega

- [ ] Abrir el PR de `informe-01/v0.7.0`, esperar CI en verde y fusionar. **No se
      fuerza producción**: el repositorio exige revisión humana antes de `main`.
- [ ] Tras el despliegue, descargar el paquete **de producción** y ejecutar
      `sha256sum -c`. Comprobarlo en el disco donde se generó no comprueba nada.

## Prioridad 1 · Verificación, en el orden que el instrumento indica

La v0.7.0 mejoró el instrumento y no tocó los datos. La deuda es ésa.

- [ ] **Recorrer `repositorios-publicaciones` en las nueve instituciones que la
      tienen pendiente.** Es la ruta con mayor rendimiento del protocolo ahora
      mismo: cierra la conclusión C-5, que es la principal del informe, y hoy
      queda `NO_CONCLUYENTE` en nueve de las once celdas (ISSUE-022).
- [ ] **Contrastar las tres fuentes de `uautonoma`.** Es la única institución con
      cero fuentes contrastadas, y aporta la única cobertura docente cuantificada
      de todo el corpus.
- [ ] Subir `uandes` (1/5), `udd` (1/4) y `uai` (1/3), las de menor proporción.
- [ ] Recorrer `malla-curricular` y `programas-syllabus` en las seis que las
      tienen pendientes: cierran C-4.
- [ ] Recorrer `centros-laboratorios` en la UAI y registrar su laboratorio como
      iniciativa propia si tiene fuente. Cierra ISSUE-020.
- [ ] Continuar por la cola de `tools/informes/informe-01/prioridad-verificacion.json`.

## Prioridad 1 · La regla nueva necesita su propia verificación

- [ ] **Incluir `routes_missing` en el protocolo de verificación sustantiva**,
      como campo número ocho, y registrar en el cuaderno la consulta y el dominio
      con que se recorrió cada ruta declarada como completa. Desde DEC-119 ese
      registro decide si una celda dice «no localizada» o «no concluyente», que
      son dos afirmaciones distintas sobre una institución (ISSUE-021).

## Prioridad 2 · Análisis

- [ ] **Reescribir la discusión a la luz de la capa de capacidades.** La sección 4
      es la de la v0.6.0 y no discute los hallazgos que esta versión saca a la
      luz: que el fenómeno tiene dos años, que la estructura precede a la norma,
      que la transferencia es sobre todo actividad aislada, y que buena parte de
      las herramientas pertenece a la universidad y no a la Facultad.
- [ ] Revisar las siete conclusiones contra la matriz de capacidades una vez
      recorridas las rutas pendientes. Dos ya están matizadas en la nota
      metodológica; el texto de la sección 6 no se ha tocado.
- [ ] Revisar las cuatro afirmaciones cuyas fuentes siguen sin contrastar.

## Prioridad 2 · Decisión editorial pendiente

- [ ] Resolver **ISSUE-019**: separar `contrasted_by` de `accepted_by`, o
      declarar expresamente que `verified_by` significa responsabilidad editorial
      y no ejecución. Requiere decisión del autor. **No resolver en silencio.**

## Prioridad 3 · Cerrar lo que la verificación dejó abierto

- [ ] **ISSUE-006** · el acto formal de las cuatro unidades creadas en 2025–2026.
- [ ] **ISSUE-015** · el acto que traslada el LMIL a la Escuela de Derecho PUCV.
- [ ] **ISSUE-016** · la ficha metodológica de la medición de la UNAB.
- [ ] **ISSUE-003** · descargar la base del CNED desde un navegador y versionar
      el archivo, no la URL.
- [ ] Recorrer la **ruta 13** —contraste externo— en las once. El corpus no tiene
      ni una sola fuente de terceros, y ninguna cantidad de fuentes
      institucionales corrige ese sesgo.

## Prioridad 3 · Presentación

- [ ] Rediseñar las once fichas institucionales. Conservan la estructura de la
      v0.6.0 con el mapa de capacidades añadido encima; no se reordenaron.
- [ ] Evaluar si el informe necesita índice navegable. Con la arquitectura nueva
      el documento tiene veinticuatro secciones y siete anexos.

## Al cerrar cualquier tanda

- [ ] Regenerar el paquete y verificar los checksums **descargando de
      producción**, no en local.
- [ ] `npm run verify`, changelog, y los seis archivos de continuidad.
- [ ] Volver a pasar la auditoría de consistencia entre dataset, web, HTML,
      Markdown y ficha. Es barata y ya detectó dos afirmaciones caducadas.
