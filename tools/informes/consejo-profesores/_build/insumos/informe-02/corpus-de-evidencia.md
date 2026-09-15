# CORPUS DE EVIDENCIA — Transformación de la enseñanza universitaria e IA generativa
Recopilación propia, verificada por búsqueda directa. Agosto de 2026.
Clave: **A** peer-reviewed · **B** organismo público · **C** institucional primaria · **D** proveedor · **E** prensa especializada · **F** otras
Nivel demostrativo: D1 existencia · D2 implementación · D3 adopción · D4 resultados · D5 causalidad

---

## 1. ADOPCIÓN — cifras duras

### 1.1 HEPI Student Generative AI Survey (Reino Unido) — serie de tres oleadas [B/E · D3 · VERIFICADO]
Proporción de estudiantes de grado que declara usar IA generativa para **trabajos evaluados**:
- 2024: **53 %**
- 2025: **88 %**
- 2026: **94 %**
Fuentes:
- https://www.hepi.ac.uk/reports/student-generative-ai-survey-2025/
- https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/
- https://www.hepi.ac.uk/wp-content/uploads/2026/03/HEPI-Report-199-Gen-AI-Survey-2026.pdf
ADVERTENCIA: autoinforme; muestras del Reino Unido; el enunciado de la pregunta cambió ligeramente entre oleadas. La serie mide *alguna* utilización, no dependencia.

### 1.2 EDUCAUSE — despliegue institucional (EE. UU.) [B/E · D2]
- ~**74 %** de las instituciones estadounidenses tienen al menos un despliegue de IA en producción que afecta directamente a estudiantes (2026), frente a **28 %** a principios de 2024.
- Líderes institucionales "cautelosos o muy cautelosos": 23 % (2024) → 20 % (2025) → **15 %** (2026).
- 81 % del personal siente entusiasmo o una mezcla de cautela y entusiasmo.
- De quienes tienen políticas de IA, **47 %** las califica de permisivas y 30 % de neutras.
Fuentes: https://www.educause.edu/research/2026/the-impact-of-ai-on-work-in-higher-education · https://library.educause.edu/resources/2025/2/2025-educause-ai-landscape-study
PENDIENTE VERIFICAR: el 74 % / 28 % procede de una síntesis secundaria; confirmar en el informe original.

---

## 2. EVALUACIÓN

### 2.1 TEQSA (Australia) — reforma evaluativa nacional [B · D2 · VERIFICADO]
"Assessment reform for the age of artificial intelligence": no impone un método único; fija **dos principios**:
1. La evaluación y las experiencias de aprendizaje deben preparar para participar ética y activamente en una sociedad donde la IA es ubicua.
2. Formar juicios fiables sobre el aprendizaje exige enfoques **múltiples, inclusivos y contextualizados**.
Documento posterior: "Enacting assessment reform in a time of artificial intelligence" (sept. 2025).
Fuentes: https://www.teqsa.gov.au/guides-resources/higher-education-good-practice-hub/gen-ai-knowledge-hub/gen-ai-academic-integrity-and-assessment-reform · https://www.teqsa.gov.au/sites/default/files/2025-09/enacting-assessment-reform-in-a-time-of-artificial-intelligence.pdf

### 2.2 University of Sydney — modelo de dos carriles (two-lane) [C · D2/D3]
- **Carril 1 (seguro):** evaluación *del* aprendizaje; verificación supervisada y presencial de competencias nucleares a nivel de programa, sin ayudas externas.
- **Carril 2 (abierto):** evaluación *para* el aprendizaje; uso productivo y declarado de IA.
- Anunciado en **noviembre de 2024**, despliegue progresivo desde el **semestre 1 de 2025**.
Fuente: https://intranet.sydney.edu.au/education-students/teaching-learning/academic-integrity/artificial-intelligence-and-assessment.html

### 2.3 Scarfe, Watcham, Clarke & Roesch (2024) — el experimento de Reading [A · D4 · VERIFICADO]
PLOS ONE 19(6): e0305354. Inserción ciega de respuestas generadas por ChatGPT en exámenes reales de varios módulos de Psicología (≈5 % de las respuestas de cada módulo).
- **94 %** de las entregas de IA **no fueron detectadas**.
- En promedio obtuvieron **calificaciones superiores** a las de los estudiantes reales.
Fuente: https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0305354
Es el estudio más sólido disponible sobre la pérdida de validez de la evaluación no supervisada.

---

## 3. EVIDENCIA CIENTÍFICA SOBRE APRENDIZAJE

### 3.1 Wang & Fan (2025) — metaanálisis RETRACTADO [A · CONTROVERTIDO → NO_DEMOSTRADO]
"The effect of ChatGPT on students' learning performance, learning perception, and higher-order thinking: insights from a meta-analysis", *Humanities and Social Sciences Communications* 12, art. 621.
- Efectos reportados: rendimiento **g = 0,867**; percepción **g = 0,456**; pensamiento de orden superior **g = 0,457**. k = 51 estudios (nov. 2022 – feb. 2025).
- **El artículo figura como RETRACTED en Nature/HSSC.** Se documentaron errores sustantivos de extracción de datos y de análisis.
Fuentes: https://www.nature.com/articles/s41599-025-04787-y · https://sciety.org/articles/activity/10.31234/osf.io/wgu56_v2
HALLAZGO CRÍTICO: el metaanálisis más citado a favor del efecto positivo grande fue retractado. Cualquier informe que lo cite sin advertirlo está desactualizado.

### 3.2 Bastani, Bastani, Sungu, Ge, Kabakcı & Mariman — "Generative AI without guardrails can harm learning" [A · D5 · VERIFICADO]
PNAS (2025); versión previa SSRN 4895486 (2024). Experimento de campo, ~**1.000** estudiantes de secundaria en Turquía, 4 sesiones de 90 min, cursos 9.º–11.º.
- Con acceso a GPT-4 durante la práctica: **+48 %** (GPT Base) y **+127 %** (GPT Tutor con andamiaje) en el desempeño *durante* la práctica.
- Al **retirar el acceso**: los del grupo GPT Base rindieron **−17 %** frente a quienes nunca tuvieron acceso.
- Los andamiajes diseñados por docentes (pistas en vez de respuestas) mitigan el daño.
Fuente: https://www.pnas.org/doi/10.1073/pnas.2422633122
Es la distinción central del informe: **rendimiento asistido ≠ aprendizaje**.

### 3.3 Kestin, Miller, Klales, Milbourne & Ponti (2025) — RCT de tutor IA en Harvard [A · D5 · VERIFICADO]
"AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting", *Scientific Reports* (3 jun. 2025).
- Curso Physical Sciences 2, Harvard, otoño 2023; ~**180** estudiantes en diseño cruzado semanal.
- Ganancias de aprendizaje **≈ el doble** que con aprendizaje activo presencial, en **menos tiempo**, con mayor compromiso y motivación.
- El tutor fue **diseñado con andamiajes de expertos y guardarraíles**, no un chatbot genérico.
Fuente: https://www.nature.com/articles/s41598-025-97652-6
Leer junto con 3.2: lo que funciona es el **diseño pedagógico**, no el acceso al modelo.

---

## 4. COMPETENCIAS Y CURRÍCULO

### 4.1 Ohio State University — AI Fluency [C · D2]
- Desde la **clase de 2029**, todo egresado debe ser "AI fluent" en su campo y en IA.
- Mecanismo real verificado: **General Education Launch Seminar obligatorio** con tres módulos nuevos (qué es la IA generativa; uso eficaz y ético; uso reflexivo a lo largo de la carrera) + talleres de IA generativa integrados en la First Year Success Series.
- Cada unidad académica publica su **mapa de incorporación** de IA hacia finales de **2026**.
Fuentes: https://oaa.osu.edu/ai-fluency · https://oaa.osu.edu/news/2026/02/11/ai-fluency-ohio-state-february-2026 · https://news.osu.edu/ohio-state-launches-bold-ai-fluency-initiative-to-redefine-learning-and-innovation/
MATIZ: es transformación curricular real (nivel 4) en su diseño, pero la evidencia de resultados es todavía D2, no D4.

---

## 5. GOBERNANZA E INFRAESTRUCTURA

### 5.1 California State University — el mayor despliegue del mundo [C/E · D2 · CONTROVERTIDO]
- ChatGPT Edu para **>470.000 estudiantes** y **63.000** docentes y personal, 23 campus.
- Renovación (mayo de 2026): **13 M USD anuales durante tres años = 39 M USD**. El acuerdo inicial se reportó en torno a **17 M USD**.
- Renovado **pese a recortes presupuestarios** y a una petición del profesorado (enero) pidiendo cancelarlo por no estar "diseñado, entrenado ni optimizado para la educación".
- Encuesta interna de la propia CSU a **>94.000** estudiantes y empleados: **52 %** del profesorado reportó un efecto **negativo** de la IA sobre su docencia; **67 %** de los estudiantes considera que sus profesores no les enseñan a usar IA eficazmente.
Fuentes: https://edsource.org/2026/cal-state-renews-controversial-system-wide-contract-with-openai/758919 · https://calmatters.org/education/2026/05/california-state-university-open-ai-chatgpt-contract/ · https://www.insidehighered.com/news/tech-innovation/artificial-intelligence/2026/03/27/faculty-push-back-against-openai-deals · https://academeblog.org/2026/06/04/paying-the-costs-of-ai-centrism-csu-re-ups-chatgpt/
CASO CLAVE: licenciar a escala máxima ≠ transformar. Es el mejor contraejemplo disponible del "nivel 1 disfrazado de nivel 5".

---

## 6. DERECHO

### 6.1 Magesh, Surani, Dahl, Suzgun, Manning & Ho — alucinaciones en herramientas jurídicas comerciales [A · D4 · VERIFICADO]
"Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools", *Journal of Empirical Legal Studies* (2025); preprint mayo 2024 (arXiv 2405.20362). Stanford RegLab + HAI.
- Tasas de alucinación: **Lexis+ AI 17 %**, **Westlaw AI-Assisted Research 33 %**, **GPT-4 43 %**.
- Precisión: Lexis+ AI responde correctamente el **65 %**; Westlaw el **42 %**.
- Ask Practical Law AI: respuestas incompletas en más del **60 %** de las consultas.
- Conclusión: las afirmaciones de los proveedores ("hallucination-free") están **sobredimensionadas**.
Fuentes: https://onlinelibrary.wiley.com/doi/full/10.1111/jels.12413 · https://reglab.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools/

### 6.2 Base de datos de casos judiciales con citas alucinadas (Damien Charlotin, HEC Paris) [B/A · D4 · VERIFICADO]
Solo incluye casos en que un tribunal **constató** el uso de contenido alucinado (no meras alegaciones).
- Inicios de 2026: **> 1.200** casos
- Julio de 2026: **1.668**
- **28 de agosto de 2026: 1.981 casos**
Fuente: https://www.damiencharlotin.com/hallucinations/
Dato ideal para gráfico de crecimiento. Advertencia: es un registro de detección, no una tasa; el crecimiento mezcla aumento de uso y aumento de escrutinio judicial.

---

## 7. MERCADO PROFESIONAL

### 7.1 Brynjolfsson, Chandar & Chen — "Canaries in the Coal Mine?" [A · D4 · VERIFICADO]
Stanford Digital Economy Lab, con microdatos administrativos de ADP. Actualización de agosto de 2026.
- El empleo de **jóvenes de 22–25 años** en ocupaciones expuestas a IA está **19 % por debajo** de donde estaría si hubiera seguido el ritmo de sus pares menos expuestos. La brecha se amplía de forma sostenida desde agosto de 2025.
- Los trabajadores **experimentados no muestran** una brecha comparable.
- Las caídas se concentran donde la IA **sustituye** tareas; donde **complementa**, el empleo es plano o creciente.
- **No hay desplazamiento generalizado** en el conjunto de la economía.
Fuentes: https://digitaleconomy.stanford.edu/news/canariesaug26/ · https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf
Implicación formativa directa: se erosiona precisamente el peldaño de entrada que la universidad prepara.
