# Prompt para la próxima sesión

Copiar desde la línea siguiente.

---

Trabajo en el repositorio `dojedacifuentes/aldunate_experimento02`. Necesito que redactes un informe para el Consejo de Profesores de la Escuela de Derecho de la Pontificia Universidad Católica de Valparaíso.

## Lo primero que debes leer

Todo el material está en `tools/informes/consejo-profesores/`. Lee, en este orden:

1. `README.md` — cómo funciona la cadena de construcción y qué debe dar cada control.
2. `_build/redaccion/plan-informe-02b.md` — la estructura y el índice de lo que hay que escribir. Ya está decidido; no lo rediseñes.
3. `docs/HANDOFF-CONSEJO-PROFESORES.md` (en la raíz del repo) — las decisiones tomadas que no deben revertirse.
4. `_build/estilo/reglas-documento-a.md` — las reglas de redacción, que mandan sobre cualquier costumbre.

## Qué hay que hacer

Redactar el **Informe 02, edición de fichas institucionales**.

Antes de empezar, fija la distinción, porque el directorio produce dos documentos con objetos distintos y es fácil confundirlos.

El **Informe 01** ya está terminado y mide qué capacidades han construido once facultades de Derecho chilenas. Sirve de modelo de forma, y su contenido no es el tuyo.

El **Informe 02**, que es el tuyo, examina **cómo cambia la enseñanza universitaria** ante la inteligencia artificial generativa: metodologías, evaluación, competencias, currículo, rol docente, gobernanza y equidad. Su alcance es universitario, no solo jurídico, y el Derecho es uno de sus capítulos, tratado como caso crítico. Deriva del informe experto «La universidad ante la automatización del trabajo cognitivo».

Cuidado con un detalle: la versión anterior de ese Informe 02 se entregó bajo el título «Inteligencia artificial generativa y enseñanza del Derecho», que estrechó su objeto. El informe experto de base tiene alcance universitario, y la reestructuración debe recuperarlo, salvo que el usuario indique lo contrario.

Lo que se te pide es que el Informe 02 adopte la forma del Informe 01: fichas institucionales con gráfico de barras, mapeo general y conclusiones numeradas.

El `config.json` está creado en `_build/redaccion/informe-02b/` con los once archivos del cuerpo y tres anexos. Falta escribir todos esos archivos.

## De dónde sale el contenido

El informe experto completo está en `_build/insumos/informe-02/informe-experto-v0.3.0-rechazado.pdf`, setenta y siete páginas, y cortado en veinticuatro archivos de texto en `_build/insumos/informe-02/capitulos/`.

**La matriz ya está construida y no hay que reconstruirla.** Está en `_build/puntaje/niveles-instituciones.json`: nueve instituciones, siete dimensiones y una escala de cero a cinco, con la fortaleza verificada y la evidencia de resultados de cada una.

Las siete dimensiones son **metodologías, competencias, evaluación, currículo, rol docente, gobernanza y equidad**. Conviene saber, antes de escribir, que sus promedios confirman lo que el propio informe sostiene: gobernanza es la más alta con 3,33 y evaluación la más baja con 2,44. Ninguna institución alcanza el nivel 5 en el conjunto.

Lo que sí falta trasladar a ese archivo es el mapa de las treinta instituciones de diez países, que está en `_build/insumos/informe-02/capitulos/12-capitulo-11-...txt` con el nivel verificado y lo que acredita cada una.

## Reglas que no puedes romper

1. **El cuerpo no menciona el uso de inteligencia artificial en la elaboración del documento.** Eso va íntegro al anexo C, por instrucción expresa del profesor. Es la regla propia de este informe.
2. **Prosa humanizada.** Sin antítesis correctiva del tipo «no es X: es Y», sin fragmentos enfáticos, sin metáforas en los títulos, sin negritas en el cuerpo, sin preguntas retóricas, sin remates con moraleja. Oración media de 20 a 30 palabras. La medición lo comprueba: `node medir-estilo.mjs <archivo>` debe decir «Sin alertas» en cada archivo del cuerpo.
3. **Gráficos de barras fácilmente discernibles**, con un color por institución conservado entre figuras. Usa `colorDe(id)` de `graficos.mjs` y toma `figuras-por-institucion.mjs` como plantilla.
4. **Lo técnico va a los anexos.** El cuerpo expone lo indispensable para leer los puntajes.
5. **Distingue siempre lo no localizado de lo no concluyente.** Anotar un cero afirma que algo no existe, y eso exige evidencia.
6. **Separa la institución de la unidad.** Una política de universidad no acredita una capacidad de una facultad.
7. **Distingue el anuncio de la ejecución.** Un programa anunciado sin constancia de dictación es capacidad incipiente.

## Orden de trabajo

1. Traslada las treinta instituciones del mapa internacional a `_build/puntaje/niveles-instituciones.json`, que ya contiene la matriz de nueve.
2. Genera los gráficos.
3. Redacta en el orden IV, V, VII, VI, VIII, IX, y al final I, II y III. El resumen y la metodología se escriben con el resto a la vista.
4. Escribe el anexo C sobre uso de inteligencia artificial en la elaboración. Toma como modelo el apartado 4 del anexo de `_build/redaccion/informe-02/A-anexo.md`.
5. Adapta `auditar-cifras.mjs`: hoy comprueba una escala de cinco dimensiones sobre quince, y aquí debe comprobar niveles de cero a cinco.

## Antes de entregar

```bash
cd tools/informes/consejo-profesores/_build
npm install                                  # docx, pdfjs-dist, playwright-core
node auditar-cifras.mjs                      # sin problemas
node revisar-residuos.mjs redaccion/informe-02b figuras/informe-02b --doc b
node construir-docx.mjs redaccion/informe-02b/config.json   # "avisos": []
```

Y el PDF desde PowerShell con `word-a-pdf.ps1`. Requiere Word instalado y Edge en su ruta habitual.

## Qué rechazó el profesor, con ejemplos

El informe experto que está en el repositorio es **el que fue rechazado**. Léelo para saber qué contenido hay disponible, y no para imitar su forma. Sus rasgos son justamente los que el profesor objetó.

Tiene veinticuatro capítulos y tres anexos en setenta y siete páginas, y su portada abre con cuatro cifras grandes en caja. Eso es el «buen compilado de información» que el profesor dice que no le sirve.

Sus títulos son ensayísticos y llevan metáfora o gancho. Estos son suyos, y ninguno debe aparecer en la nueva versión:

- «El rol docente: el eslabón que nadie financió»
- «Adopción: la curva que todos citan y la que casi nadie mira»
- «Universidad y mercado profesional: el peldaño que se erosiona»
- «La pirámide se estrecha»
- «Gobernanza: licenciar, construir, federar o dejar hacer»
- «Hoja de ruta para una facultad de Derecho»

Escríbelos descriptivos y numerados, como en el Informe 01: «VI. El efecto sobre el aprendizaje», «2.3. Investigación y desarrollo».

El contenido del informe rechazado, en cambio, es sólido y verificado. Lo que cambia es la forma: menos capítulos, títulos descriptivos, fichas institucionales con gráfico, y lo técnico al anexo.

## Dos cosas que debes pedirme antes de redactar

1. **Si hubo observaciones del profesor además del correo.** El informe rechazado ya está en el repositorio, pero no consta si lo devolvió con comentarios propios.
2. **Confirmación de si el alcance vuelve a ser universitario o sigue acotado al Derecho.** La versión anterior de 43 páginas se tituló «Inteligencia artificial generativa y enseñanza del Derecho» y estrechó el objeto. El material institucional que ahora se usa —las nueve instituciones de la matriz y las treinta del mapa— es de alcance universitario, con el Derecho como uno de sus capítulos. El plan supone ese alcance más amplio; conviene confirmarlo.

## Contexto de por qué el formato es así

El profesor Eduardo Aldunate pidió, sin entrar al contenido: formato tradicional presentable al Consejo, gráficos admisibles pero fácilmente discernibles, «no me sirve un buen compilado de información», redacción humanizada porque los profesores reconocen el estilo de los modelos de lenguaje y le restan autoridad al documento, borradores listos para usar y todos los detalles técnicos en anexo.

El Informe 01 ya cumple ese encargo y está terminado en `_build/redaccion/informe-01/`. Léelo antes de escribir: es el modelo.
