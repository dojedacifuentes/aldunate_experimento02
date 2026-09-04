# TASKS — Informe 01

Tareas para la siguiente versión. Están dichas por **qué debe conseguirse**, no
por cómo: la solución concreta es criterio de quien la ejecute.

Actualizado 04-09-2026 · sobre v0.6.0

---

## Prioridad 1 · Arquitectura editorial

Es lo que más separa el documento actual de uno que el destinatario lea entero.

- [ ] Revisar la estructura y proponer una narrativa donde **los hallazgos
      aparezcan antes de las once fichas institucionales**. Hoy el lector recorre
      once perfiles antes de saber por qué debería importarle.
- [ ] Reescribir el resumen ejecutivo con hallazgos, inferencias, limitaciones y
      relevancia para la PUCV. El actual describe el método más que los
      resultados.
- [ ] Decidir qué detalle técnico baja a anexos. Candidatos: el registro completo
      de fuentes, la matriz de ocho dimensiones, la auditoría de la línea base.
- [ ] Comprobar contra los datos las dos hipótesis editoriales del HANDOFF §H.
      Si no resisten, degradarlas o descartarlas: son hipótesis, no conclusiones.

## Prioridad 1 · Visualización de capacidades

- [ ] Diseñar la **visualización principal de capacidad institucional**. Debe
      responder «¿qué capacidad demuestra cada institución?» y no «¿cuántas
      fuentes encontramos de ella?». No ranking, no suma de peldaños (DEC-115).
      Las capacidades declaradas: estructura especializada, gobernanza,
      integración curricular, formación recurrente, adopción docente,
      herramientas, cobertura, recursos, continuidad y evaluación.
- [ ] **Separar visualmente cobertura de investigación y desarrollo
      institucional.** Es el riesgo estructural del documento: hoy nada impide
      leer una fila más poblada como una universidad que hace más.
- [ ] Revisar si la matriz de ocho dimensiones debe dividirse, simplificarse o
      pasar parcialmente a anexos.
- [ ] Mejorar la legibilidad de las matrices en web y en A4. Comprobar impresión
      después de cualquier cambio: hay un defecto ya resuelto que no debe volver.
- [ ] Línea de tiempo de hitos, la única visualización declarada que falta.

## Prioridad 1 · PUCV en contexto

- [ ] Construir la sección comparativa sobre **mecanismos observados en otras
      Facultades**, no sobre recuento de iniciativas. Qué hace otra institución
      que aquí no consta, y con qué instrumento lo acredita.
- [ ] Neutralizar el sesgo de sobrerrepresentación. La PUCV tiene más fuentes por
      el piloto **y** la mayor proporción verificada. Ver ISSUE-018.

## Prioridad 2 · Verificación

- [ ] Verificar las tres fuentes de `uautonoma`. **Es la única institución con
      cero fuentes contrastadas** y hay afirmaciones que dependen de ella.
- [ ] Subir `uandes` (1/5), `udd` (1/4) y `uai` (1/3), que son las de menor
      proporción.
- [ ] Continuar por la cola de `tools/informes/informe-01/prioridad-verificacion.json`.
- [ ] O bien equilibrar la verificación por encima del 50% en las once, o bien
      publicar el porcentaje verificado por institución junto a cualquier
      comparación. Un indicador que cambia cómo se lee una tabla no puede quedar
      en un cuaderno interno.

## Prioridad 2 · Decisión editorial pendiente

- [ ] Resolver **ISSUE-019**: separar `contrasted_by` de `accepted_by`, o
      declarar expresamente que `verified_by` significa responsabilidad editorial
      y no ejecución. Requiere decisión del autor. **No resolver en silencio.**

## Prioridad 3 · Cerrar lo que la verificación dejó abierto

- [ ] **ISSUE-006** · el acto formal de las cuatro unidades creadas en 2025–2026.
      Es lo que decide la conclusión C-1, la principal del informe.
- [ ] **ISSUE-015** · el acto que traslada el LMIL a la Escuela de Derecho PUCV.
- [ ] **ISSUE-016** · la ficha metodológica de la medición de la UNAB. Sin
      diseño, muestra y control, la única cifra de efecto del corpus no es
      citable.
- [ ] **ISSUE-003** · descargar la base del CNED desde un navegador y versionar
      el archivo, no la URL.
- [ ] Recorrer la **ruta 13** del protocolo —contraste externo— en las once. El
      corpus no tiene ni una sola fuente de terceros.

## Al cerrar cualquier tanda

- [ ] Revisar la consistencia de las conclusiones contra las afirmaciones y el
      dataset. Hay pruebas que lo comprueban, pero no sustituyen la lectura.
- [ ] Regenerar el paquete y **verificar los checksums descargando de
      producción**, no en local.
- [ ] `npm run verify`, changelog, y los seis archivos de continuidad.
