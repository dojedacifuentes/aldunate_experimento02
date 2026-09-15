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

Redactar el **Informe 02, edición de fichas institucionales**: una reestructuración del informe sobre transformación de la enseñanza universitaria ante la inteligencia artificial, para que adopte la forma del Informe 01 que el Consejo ya aprobó.

El `config.json` está creado en `_build/redaccion/informe-02b/` con los once archivos del cuerpo y tres anexos. Falta escribir todos esos archivos.

## De dónde sale el contenido

El informe experto de base está en `_build/insumos/informe-02/capitulos/`, en veinticuatro archivos de texto. Lo que necesitas está sobre todo en tres:

- **`02-capitulo-1-...txt`**, tabla 3: la escala de seis niveles de profundidad de la transformación, de 0 (ausencia) a 5 (sistémica), con la señal que distingue cada uno.
- **`18-capitulo-17-...txt`**: la matriz comparada de nueve instituciones, con su nivel global, su fortaleza verificada y la evidencia de resultados de cada una.
- **`12-capitulo-11-...txt`**: el mapa de treinta instituciones en diez países, cada una con su nivel verificado y qué acredita exactamente.

Las seis dimensiones de transformación son currículo, evaluación, docencia, competencias, infraestructura y gobernanza.

## Reglas que no puedes romper

1. **El cuerpo no menciona el uso de inteligencia artificial en la elaboración del documento.** Eso va íntegro al anexo C, por instrucción expresa del profesor. Es la regla propia de este informe.
2. **Prosa humanizada.** Sin antítesis correctiva del tipo «no es X: es Y», sin fragmentos enfáticos, sin metáforas en los títulos, sin negritas en el cuerpo, sin preguntas retóricas, sin remates con moraleja. Oración media de 20 a 30 palabras. La medición lo comprueba: `node medir-estilo.mjs <archivo>` debe decir «Sin alertas» en cada archivo del cuerpo.
3. **Gráficos de barras fácilmente discernibles**, con un color por institución conservado entre figuras. Usa `colorDe(id)` de `graficos.mjs` y toma `figuras-por-institucion.mjs` como plantilla.
4. **Lo técnico va a los anexos.** El cuerpo expone lo indispensable para leer los puntajes.
5. **Distingue siempre lo no localizado de lo no concluyente.** Anotar un cero afirma que algo no existe, y eso exige evidencia.
6. **Separa la institución de la unidad.** Una política de universidad no acredita una capacidad de una facultad.
7. **Distingue el anuncio de la ejecución.** Un programa anunciado sin constancia de dictación es capacidad incipiente.

## Orden de trabajo

1. Confirma las siete columnas de la matriz del capítulo 17 en los datos de la figura 9. El texto nombra seis dimensiones más una columna de evidencia de resultados, y hay que verificar cuál es la séptima.
2. Construye `_build/puntaje/niveles-instituciones.json` con las nueve instituciones de la matriz y las treinta del mapa, con su nivel y su país.
3. Genera los gráficos.
4. Redacta en el orden IV, V, VII, VI, VIII, IX, y al final I, II y III. El resumen y la metodología se escriben con el resto a la vista.
5. Escribe el anexo C sobre uso de inteligencia artificial en la elaboración. Toma como modelo el apartado 4 del anexo de `_build/redaccion/informe-02/A-anexo.md`.
6. Adapta `auditar-cifras.mjs`: hoy comprueba una escala de cinco dimensiones sobre quince, y aquí debe comprobar niveles de cero a cinco.

## Antes de entregar

```bash
cd tools/informes/consejo-profesores/_build
npm install                                  # docx, pdfjs-dist, playwright-core
node auditar-cifras.mjs                      # sin problemas
node revisar-residuos.mjs redaccion/informe-02b figuras/informe-02b --doc b
node construir-docx.mjs redaccion/informe-02b/config.json   # "avisos": []
```

Y el PDF desde PowerShell con `word-a-pdf.ps1`. Requiere Word instalado y Edge en su ruta habitual.

## Dos cosas que debes pedirme antes de redactar

1. **El informe antiguo de enseñanza que el profesor rechazó.** Se mencionó que venía adjunto y no llegó. Puede traer observaciones suyas que no constan en el correo.
2. **Confirmación de si el alcance vuelve a ser universitario o sigue acotado al Derecho.** La versión anterior de 43 páginas se tituló «Inteligencia artificial generativa y enseñanza del Derecho» y estrechó el objeto. El material institucional que ahora se usa —las nueve instituciones de la matriz y las treinta del mapa— es de alcance universitario, con el Derecho como uno de sus capítulos. El plan supone ese alcance más amplio; conviene confirmarlo.

## Contexto de por qué el formato es así

El profesor Eduardo Aldunate pidió, sin entrar al contenido: formato tradicional presentable al Consejo, gráficos admisibles pero fácilmente discernibles, «no me sirve un buen compilado de información», redacción humanizada porque los profesores reconocen el estilo de los modelos de lenguaje y le restan autoridad al documento, borradores listos para usar y todos los detalles técnicos en anexo.

El Informe 01 ya cumple ese encargo y está terminado en `_build/redaccion/informe-01/`. Léelo antes de escribir: es el modelo.
