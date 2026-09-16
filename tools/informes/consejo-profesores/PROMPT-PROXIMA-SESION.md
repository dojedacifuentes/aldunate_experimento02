# Prompt para la próxima sesión

Copiar desde la línea siguiente.

---

Trabajo en el repositorio `dojedacifuentes/aldunate_experimento02`. Continúo dos informes para el Consejo de Profesores de la Escuela de Derecho de la Pontificia Universidad Católica de Valparaíso. Ambos están redactados y compilados, y lo que queda es verificación y ajuste.

## Son dos informes distintos

Este directorio produce dos documentos con objetos diferentes. Conviene fijarlo antes de tocar nada, porque el nombre corto de cada uno no lo dice.

El **Informe 01**, «Uso de inteligencia artificial en las Escuelas de Derecho», mide qué capacidades han construido once facultades de Derecho chilenas: unidades, normas propias, presencia en pregrado, formación continua, investigación, transferencia y uso interno. Escala de cinco dimensiones sobre quince puntos, heredada del informe que el Consejo aprobó en 2025. Está terminado, en `_build/redaccion/informe-01/`.

El **Informe 02**, «La transformación de la enseñanza ante la automatización del trabajo cognitivo», examina cómo cambia la enseñanza universitaria. Su alcance es universitario y el Derecho entra como caso particular en un capítulo propio, lo que el usuario confirmó el 16 de septiembre de 2026. Está terminado en su edición vigente, en `_build/redaccion/informe-02b/`.

Existe además una versión temática anterior del Informe 02, de 43 páginas, en `_build/redaccion/informe-02/`. Se conserva como antecedente y quedó superada.

## Lo primero que debes leer

Todo el material está en `tools/informes/consejo-profesores/`. Lee, en este orden:

1. `README.md` — cómo funciona la cadena de construcción y qué debe dar cada control.
2. `_build/redaccion/metodologia-informe-02b.md` — la unidad de análisis, la escala y la regla de evidencia del Informe 02. Manda sobre cualquier otro documento.
3. `_build/redaccion/plan-informe-02b.md` — qué se entregó y qué queda pendiente.
4. `docs/HANDOFF-CONSEJO-PROFESORES.md` — las decisiones tomadas que no deben revertirse.
5. `_build/estilo/reglas-documento-a.md` — las reglas de redacción, que mandan sobre cualquier costumbre.

## Tres decisiones que no debes revertir

La primera es que el Informe 02 **no es un catálogo de instituciones**. Ese plan existió y el usuario lo descartó el 16 de septiembre de 2026, con una razón que conviene recordar: nueve fichas de universidades extranjeras son el mismo compilado que el profesor rechazó en agosto, ordenado por institución en lugar de por tema. El material institucional vive en el anexo B y en el cuerpo aparece solo como precedente dentro de cada decisión.

La segunda es la unidad de análisis. Es la **función pedagógica y su redistribución**. La automatización desagregó las funciones de la enseñanza en lugar de eliminarlas, y las partes que se producían como subproducto de otra tarea quedaron sin responsable. El ejemplo que ordena todo el documento es la verificación de fuentes: hasta 2022 quien encontraba una sentencia la había leído, y hoy verificar es un paso separado que ningún programa encarga a nadie.

La tercera es la medida. La escala de nivel demostrativo se aplica **dos veces a cada función**, al diagnóstico y a la respuesta. La media del diagnóstico es 4,17 y la de la respuesta 2,00, de modo que el campo sabe qué pasó e ignora qué hacer. Ese contraste es el resultado principal del informe y sale del archivo `_build/puntaje/funciones-pedagogicas.json`, del que se generan las figuras sin intervención manual.

## Qué queda por hacer

1. **Verificar el material institucional del anexo B** contra sus fuentes primarias. Procede del informe experto de base y no se contrastó institución por institución, según declara el apartado C.3 del propio documento. Ninguna afirmación del cuerpo descansa exclusivamente sobre ese material.
2. **Adaptar `auditar-cifras.mjs`**, que hoy comprueba la escala de cinco dimensiones sobre quince del Informe 01. Para el Informe 02 debería comprobar los doce niveles del cuerpo contra `funciones-pedagogicas.json`.
3. **Trasladar las treinta instituciones del mapa internacional** a formato de datos, solo si alguna afirmación del cuerpo llega a descansar sobre ellas. Hoy ninguna lo hace, y por eso quedaron fuera.
4. **Preguntar al usuario** si el profesor devolvió observaciones escritas además del correo transcrito más abajo.

## Reglas que no puedes romper

El cuerpo del Informe 02 no menciona el uso de inteligencia artificial en la elaboración. Eso va íntegro al anexo C, por instrucción expresa del profesor.

Cada vez que se cite el trabajo de 2024 de Faúndez-Ugalde, Mellado-Silva, Aldunate-Lizana y Benfeld, se declara en nota al pie que el autor del informe figura entre sus ayudantes de investigación agradecidos. El profesor destinatario es coautor de ese trabajo, y es la única medición de efecto del corpus.

Los títulos son descriptivos y numerados, sin metáforas, sin dos puntos y sin preguntas. Sin negritas en el cuerpo. Oración media de 20 a 30 palabras.

## Antes de entregar

```
node medir-estilo.mjs redaccion/informe-02b
node revisar-residuos.mjs redaccion/informe-02b figuras/informe-02b --doc a
node construir-docx.mjs redaccion/informe-02b/config.json
```

El control de estilo debe pasar sin alertas, salvo las líneas de bibliografía, que también las produce el Informe 01. Los otros dos no deben arrojar hallazgos ni avisos.

Las figuras se regeneran con `node figuras-funciones.mjs`, que las produce a partir del archivo de datos. Nunca edites una cifra en el texto sin cambiarla antes en el JSON.

## Qué rechazó el profesor, con ejemplos

El informe experto que está en `_build/insumos/informe-02/informe-experto-v0.3.0-rechazado.pdf` es **el que fue rechazado**. Léelo para saber qué contenido hay disponible, y no para imitar su forma.

Tiene veinticuatro capítulos y tres anexos en setenta y siete páginas, y su portada abre con cuatro cifras grandes en caja. Eso es el «buen compilado de información» que el profesor dice que no le sirve. Su índice está en `_build/insumos/informe-02/indice-borrador-v0.3.0.pdf`.

Sus títulos son ensayísticos y llevan metáfora o gancho. Estos son suyos, y ninguno debe aparecer:

- «El rol docente: el eslabón que nadie financió»
- «Adopción: la curva que todos citan y la que casi nadie mira»
- «Universidad y mercado profesional: el peldaño que se erosiona»
- «La pirámide se estrecha»
- «Gobernanza: licenciar, construir, federar o dejar hacer»

El contenido del informe rechazado, en cambio, es sólido y verificado.

## El correo del profesor, transcrito

> Respecto de los dos informes, sin entrar a su contenido, el formato de presentación debe ser un documento en formato más o menos tradicional, presentable al consejo de profesores, y en que la presentación de la información relevante puede apoyarse en gráficos, pero estos tienen que ser fácilmente discernibles. Aun cuando pueda ser muy útil, no me sirve un buen compilado de información. Adicionalmente, y sin rechazar en absoluto el uso de IA en su confección, la redacción y estilo debe estar debidamente humanizado. Muchos profesores ya manejan herramientas de IA y está surgiendo un cierto rechazo a la autoridad de los documentos cuando el estilo se asemeja mucho a respuestas de módulos de LLM. Por lo tanto, en ambos casos le pido que me envíe unos borradores en un documento con una estructura tradicional, y estilo humano «listo para usar», por así decirlo. Todos los detalles técnicos pueden ir en un anexo.

De esas cinco condiciones, cuatro son de forma y una es de método. La de método es la frase sobre el compilado, y es la que explica por qué el Informe 02 se organiza por decisiones y no por temas ni por instituciones.
