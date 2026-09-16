# Traspaso · Ediciones para el Consejo de Profesores

Estado al 15 de septiembre de 2026. Este documento permite retomar el trabajo sin releer la conversación.

---

## 0. Son dos informes distintos

Este directorio produce **dos documentos con objetos diferentes**. Conviene fijarlo antes de tocar nada, porque el nombre corto de cada uno no lo dice.

### Informe 01 · Uso de inteligencia artificial en las Escuelas de Derecho

Qué capacidades han construido **once facultades de Derecho chilenas**: unidades, normas propias, presencia en pregrado, formación continua, investigación, transferencia y uso interno. Es un mapeo institucional nacional, con un capítulo de contraste internacional.

- Escala de cinco dimensiones sobre quince puntos, heredada del informe que el Consejo aprobó en 2025.
- Informe experto de base: v3.2.0, corte del 6 de septiembre de 2026.
- En el sitio: `/informes/ia-escuelas-derecho-chile`
- Borradores en `_build/redaccion/informe-01/`

### Informe 02 · La universidad ante la automatización del trabajo cognitivo

**Cómo cambia la enseñanza universitaria** ante la inteligencia artificial generativa: metodologías, evaluación, competencias, currículo, rol docente, gobernanza y equidad. Su alcance es universitario, no solo jurídico, y el Derecho es uno de sus capítulos, tratado como caso crítico.

- Escala de seis niveles de profundidad de la transformación, de 0 a 5.
- Informe experto de base: v0.3.0, agosto de 2026, setenta y siete páginas.
- En el sitio: `/informes/transformacion-ensenanza-derecho`
- Borradores en `_build/redaccion/informe-02/` y, la reestructuración pendiente, en `_build/redaccion/informe-02b/`

### Una confusión que conviene evitar

La versión para el Consejo del Informe 02 se tituló **«Inteligencia artificial generativa y enseñanza del Derecho»**, lo que estrechó su objeto y la acerca en apariencia al Informe 01. No son lo mismo: el primero mide qué tienen las facultades chilenas, el segundo examina cómo cambia la enseñanza en cualquier universidad. La reestructuración pendiente debe recuperar el alcance universitario del informe experto de base.

---

## 1. Qué pidió el profesor

Correo de Eduardo Aldunate Lizana, sin entrar al contenido de los informes:

- Formato de presentación **tradicional**, presentable al Consejo de Profesores.
- Los gráficos son admisibles, pero **fácilmente discernibles**.
- «No me sirve un buen compilado de información.»
- Redacción **humanizada**: los profesores reconocen el estilo de los modelos de lenguaje y le restan autoridad al documento.
- Borradores «listo para usar».
- **Todos los detalles técnicos en anexo.**

El usuario añadió después dos precisiones. La primera: replicar el formato del informe de 2025 que el Consejo sí aprobó (`Edición 2 informe mapeo IA y Derecho en Universidades`). La segunda, para el informe de enseñanza: que se parezca lo más posible al Informe 01, con gráficos de barra y fichas institucionales, y que **todo el detalle metodológico sobre el uso de inteligencia artificial quede en un anexo aparte**.

---

## 2. Dónde está el trabajo

Todo está versionado en este repositorio, en `tools/informes/consejo-profesores/`. No hace falta ningún archivo del escritorio.

```
consejo-profesores/
  README.md                          cómo operar la cadena
  PROMPT-PROXIMA-SESION.md           el encargo para retomar
  PROMPT-PARA-GEMINI-O-CHATGPT.md    encargo de investigación autocontenido
  PROMPT-INVESTIGACION-PROFUNDA.md   encargo para un agente con contexto
  _build/
    redaccion/informe-01/       Escuelas de Derecho chilenas · terminado
    redaccion/informe-02/       Transformación de la enseñanza · versión temática
    redaccion/informe-02b/      Transformación de la enseñanza · fichas · SOLO CONFIG
    redaccion/metodologia-informe-02b.md  la metodología del próximo trabajo
    redaccion/plan-informe-02b.md    la estructura y el índice del próximo trabajo
    puntaje/                    matriz, escalas y scripts de cálculo
    hechos/                     hallazgos de cada ronda de búsqueda
    insumos/                    corpus de origen, incluido el informe rechazado
    estilo/                     guía de estilo y reglas de redacción
    figuras/                    PNG y SVG generados
    salida/                     docx y pdf compilados
```

---

## 3. Estado de cada documento

### Informe 01 · terminado

**Uso de IA en las Escuelas de Derecho, edición 2026.** 63 páginas, 20.138 palabras, 26 gráficos, 10 tablas.

Estructura: I Resumen · II Objetivos · III Metodología · IV Fichas institucionales comparadas · V Casos internacionales · VI Mapeo general · VII Conclusiones (16, numeradas) · VIII Referencias · Anexos A, B y C.

Escala de cinco dimensiones sobre quince puntos, la misma que el Consejo aprobó en 2025, recalculada sobre la matriz de diez capacidades.

Orden vigente: U. Autónoma 11,67 · UC 10,83 · U. Central 9,83 · UAI 8,17 · U. de Chile 6,67 a 8,67 · UNAB 6,33 · UDP 5,83 · UDD 5,17 a 5,83 · U. de los Andes 3,33 a 6,00 · UdeC 3,17 a 5,17. La PUCV se informa aparte con 6,67.

### Informe 02 · versión temática, terminada

El de **transformación de la enseñanza universitaria**, derivado del informe experto «La universidad ante la automatización del trabajo cognitivo». 43 páginas, 14.857 palabras, cuerpo temático en once capítulos.

Se entregó bajo el título «Inteligencia artificial generativa y enseñanza del Derecho», que estrechó su objeto al ámbito jurídico. El informe experto de base tiene alcance universitario, y la reestructuración pendiente debe recuperarlo.

### Informe 02b · por hacer

Reestructuración del anterior con la forma del Informe 01. La metodología está fijada en `redaccion/metodologia-informe-02b.md` y la estructura en `redaccion/plan-informe-02b.md`. El `config.json` está creado con los once archivos del cuerpo y los tres anexos. Falta todo lo demás.

La decisión metodológica del 15 de septiembre de 2026 conviene no revertirla. La unidad de análisis es la dimensión de la enseñanza y no la institución, porque nueve fichas de universidades extranjeras serían otra vez el compilado que el profesor rechazó. El nivel 3 de la escala funciona como umbral: por debajo, la evidencia es una declaración institucional; por encima, es un rastro de enseñanza. Eso convierte en medición la distancia entre política y aula, que es la debilidad conocida del análisis documental.

---

## 4. Decisiones tomadas que no deben revertirse

1. **La escala de cinco dimensiones se recalcula sobre la matriz de capacidades, nunca sobre `iniciativas.csv`.** Ese archivo registra entre tres y nueve iniciativas por facultad y su volumen depende de cuánto se buscó, lo que disparaba artificialmente a la PUCV por el piloto de profundidad.

2. **Las capacidades sin información concluyente jamás se anotan como cero.** Se informa el piso y una banda hasta dos puntos. Anotar cero hundía a la U. de Chile del segundo al quinto lugar sin evidencia que lo sostuviera.

3. **La PUCV se informa fuera del orden comparativo**, por el conflicto de interés del autor y por la asimetría de cobertura.

4. **La revisión interna de la PUCV corrige a la baja y solo alcanza a la PUCV.** La Dirección bajó cuatro capacidades contrastando la evidencia pública con lo que conoce de su funcionamiento interno: presencia en pregrado y formación estructurada de 2 a 1, unidad especializada de 2 a 1, transferencia de 3 a 1. El total pasó de 10,17 a 6,67. La asimetría está declarada en el documento.

5. **El artículo de 2024 sobre asistentes virtuales se cita con su matiz.** Aldunate es coautor, y el autor del informe figura entre los ayudantes agradecidos. Sin ese matiz, la frase «ninguna facultad ha medido» es insostenible ante él. Ver `docs/` y la memoria `medicion-efecto-pucv-2024`.

6. **Un color por institución, estable entre gráficos.** Definido en `graficos.mjs` como `COLOR_UNIVERSIDAD` y `colorDe(id)`.

7. **En el encabezado de página se escribe «inteligencia artificial» completo**, porque en versalitas «IA» se lee «LA».

---

## 5. Hallazgos de investigación que ya están integrados

Ronda de septiembre de 2026, registrada en `hechos/ronda-3-hallazgos.json`:

- El **Minor en IA y Derecho de la U. Autónoma opera desde 2018**, no desde 2026, con cinco asignaturas electivas, créditos publicados, microcredencial y doce egresados. Documentado en dos artículos revisados por pares. Es la corrección más importante del informe.
- El **Laboratorio de la UAI** produce investigación con la IA por objeto, incluida una encuesta propia a jueces civiles chilenos, proyecto ANID 202332026.
- La **UdeC tiene una publicación revisada por pares** de un profesor de Derecho Civil, lo que corrige su investigación de cero a incipiente.
- La **Universidad Austral de Chile** tiene un protocolo de facultad de dieciocho artículos, de 2025, más completo que las dos normas de la cohorte, e incluye el deber de verificar que las fuentes existan. **No está en la cohorte de once**, y eso queda declarado como limitación.
- El **archivo de políticas de Andrew Perlman** (agosto de 2026) cataloga 128 de las 196 facultades estadounidenses y registra **26 con componente curricular obligatorio**. La edición anterior decía tres.
- El **IALAB de la Universidad de Buenos Aires**, primer laboratorio de IA en una facultad de Derecho iberoamericana.

---

## 6. Cómo compilar

Desde `CONSEJO-PROFESORES/_build`:

```bash
node puntaje/escala-2025.mjs
node figuras-escala-2025.mjs
node figuras-por-institucion.mjs
node figuras-internacional.mjs
node auditar-cifras.mjs
node revisar-residuos.mjs redaccion/informe-01 figuras/informe-01 --doc a
node construir-docx.mjs redaccion/informe-01/config.json
```

Y para el PDF, desde PowerShell:

```powershell
.\word-a-pdf.ps1 -Docx salida\Informe-01-IA-escuelas-de-Derecho-Consejo.docx -Pdf salida\Informe-01-IA-escuelas-de-Derecho-Consejo.pdf
```

Controles antes de entregar: `auditar-cifras.mjs` debe dar 73 comprobaciones correctas, `revisar-residuos.mjs` no debe encontrar hallazgos salvo el falso positivo de «ecosistema» dentro del título de una fuente citada, y `medir-estilo.mjs` debe decir «Sin alertas» en cada archivo del cuerpo.

---

## 7. Lo próximo, en orden

1. **Trasladar el mapa de las treinta instituciones** del capítulo 11 a `puntaje/niveles-instituciones.json`, que ya contiene la matriz de nueve por siete dimensiones. Las siete son metodologías, competencias, evaluación, currículo, rol docente, gobernanza y equidad, y quedaron resueltas con los datos del bloque G9 de `tools/informes/informe-02/Graficos.ps1`.
2. **Generar los gráficos** reutilizando `figuras-por-institucion.mjs` como plantilla.
3. **Redactar** en el orden IV, V, VII, VI, VIII, IX, y al final I, II y III.
4. **Escribir el anexo C** sobre uso de inteligencia artificial en la elaboración, que por instrucción expresa no puede aparecer en el cuerpo.
5. **Adaptar `auditar-cifras.mjs`**, que hoy comprueba la escala de cinco dimensiones sobre quince y aquí debe comprobar niveles de cero a cinco.

---

## 8. Asuntos pendientes con el usuario

El informe de enseñanza que fue rechazado ya está en el repositorio, en `_build/insumos/informe-02/informe-experto-v0.3.0-rechazado.pdf`, con sus setenta y siete páginas. Quedan dos cosas por preguntar antes de redactar.

La primera es si el profesor devolvió observaciones propias además del correo transcrito en el apartado 1.

La segunda es si el alcance del Informe 02 vuelve a ser universitario o sigue acotado al Derecho. La versión de 43 páginas se entregó bajo un título que lo estrechaba al ámbito jurídico, mientras que el informe experto de base y su material institucional son de alcance universitario. El plan supone el alcance amplio, con el Derecho como capítulo, y conviene confirmarlo.
