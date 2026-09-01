import type {
  DemonstrativeLevel,
  DocumentaryStatus,
  EvidenceClaim,
  EvidenceLevel,
  GeneralizationScope,
  Robustness,
  Source,
  Tone,
} from '@/types';

/**
 * Capa de investigación profunda.
 *
 * Es la capa de verdad del proyecto: los textos y gráficos deben poder apuntar
 * a un `source_id` de aquí.
 *
 * Las fuentes provienen del informe 02 y se verificaron una a una abriendo el
 * documento original. Las que no pudieron rastrearse hasta su fuente primaria
 * quedaron fuera: se prefirió el hueco a la cita insegura. Nada de lo cargado
 * aquí es dato de ejemplo.
 *
 * Espeja `content/research/source-registry.csv` y `evidence-matrix.csv`.
 */

export const evidenceLevels: Record<
  EvidenceLevel,
  { label: string; definition: string; tone: Tone }
> = {
  FACT: {
    label: 'Hecho',
    definition:
      'Verificable en fuente pública citable. Cualquiera puede abrir el documento y comprobarlo.',
    tone: 'success',
  },
  SIGNAL: {
    label: 'Señal',
    definition:
      'Indicio real pero parcial. Sugiere una dirección; no autoriza a generalizar.',
    tone: 'signal',
  },
  INFERENCE: {
    label: 'Inferencia',
    definition:
      'Conclusión derivada de evidencia disponible. La cadena de razonamiento queda explícita.',
    tone: 'warning',
  },
  HYPOTHESIS: {
    label: 'Hipótesis',
    definition:
      'Formulación por contrastar. Se publica como pregunta, nunca como hallazgo.',
    tone: 'accent',
  },
  PENDING: {
    label: 'Pendiente',
    definition:
      'Dato identificado como necesario y aún no obtenido. El hueco se declara.',
    tone: 'muted',
  },
};

/** El método, escrito para poder ser incumplido a la vista de todos. */
export const researchPrinciples = [
  {
    title: 'Fuente antes que dato',
    body: 'Nada entra al informe sin pasar primero por el registro de fuentes, con URL y fecha de consulta. Un dato sin procedencia no es un dato: es un rumor con formato.',
  },
  {
    title: 'La cadena completa',
    body: 'Fuente → evidencia → dato → visualización → conclusión. Cada eslabón debe poder recorrerse hacia atrás desde el gráfico hasta el documento original.',
  },
  {
    title: 'Cinco niveles, no dos',
    body: 'Hecho, señal, inferencia, hipótesis y pendiente. Colapsarlos en «cierto / falso» es la forma más rápida de convertir una investigación en una opinión.',
  },
  {
    title: 'La ausencia se registra',
    body: 'No encontrar evidencia pública de algo no prueba que no exista. Se anota como ausencia de evidencia y se distingue de la evidencia de ausencia.',
  },
  {
    title: 'Sin salto de generalización',
    body: '«Varias universidades hacen X» no autoriza «X es la tendencia dominante». El salto requiere cobertura, no entusiasmo.',
  },
  {
    title: 'Todo dato tiene fecha',
    body: 'El campo cambia más rápido que el ciclo de verificación. Una cifra sin `last_verified` es una cifra que ya no se puede defender.',
  },
];

/* ────────────────────────────── Fuentes ────────────────────────────── */

export const sources: Source[] = [
  {
    id: 'src-scarfe-2024',
    title:
      'A real-world test of artificial intelligence infiltration of a university examinations system: A Turing Test case study',
    organization: 'PLOS ONE · University of Reading',
    url: 'https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0305354',
    publishedDate: '2024-06-26',
    accessedDate: '2026-08-30',
    geography: 'Reino Unido',
    evidenceType: 'Estudio experimental revisado por pares',
    confidence: 95,
    documentaryStatus: 'verified',
    robustness: 'single_study',
    demonstrativeLevel: 'D5_causal_identification',
    generalizationScope: 'local',
    lastVerified: '2026-08-31',
    notes:
      'Inserción ciega de respuestas generadas por IA en exámenes reales, corregidas por los propios evaluadores del curso. Realizado en módulos de Psicología: la dirección del hallazgo es robusta, su magnitud en otras disciplinas no está medida.',
  },
  {
    id: 'src-kestin-2025',
    title:
      'AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting',
    organization: 'Scientific Reports · Harvard University',
    url: 'https://www.nature.com/articles/s41598-025-97652-6',
    publishedDate: '2025-06-03',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Ensayo controlado aleatorizado',
    confidence: 92,
    documentaryStatus: 'verified',
    robustness: 'single_study',
    demonstrativeLevel: 'D5_causal_identification',
    generalizationScope: 'local',
    lastVerified: '2026-08-31',
    notes:
      'n ≈ 180, diseño cruzado semanal. La condición de control no era clase magistral sino aprendizaje activo bien ejecutado. El tutor fue construido con andamiajes de expertos: el efecto es atribuible al diseño, no al modelo.',
  },
  {
    id: 'src-bastani-2025',
    title: 'Generative AI without guardrails can harm learning',
    organization: 'PNAS',
    url: 'https://www.pnas.org/doi/10.1073/pnas.2422633122',
    publishedDate: '2025-06-25',
    accessedDate: '2026-08-30',
    geography: 'Turquía',
    evidenceType: 'Experimento de campo aleatorizado',
    confidence: 90,
    documentaryStatus: 'corrected',
    robustness: 'single_study',
    demonstrativeLevel: 'D5_causal_identification',
    generalizationScope: 'local',
    lastVerified: '2026-08-31',
    correction: {
      date: '2025-08-20',
      url: 'https://www.pnas.org/doi/10.1073/pnas.2518204122',
      note: 'PNAS publicó una corrección (122(34):e2518204122). El aviso no detalla qué se corrigió ni si afecta a los resultados. Se registra porque una fuente corregida se puede citar, pero no en silencio.',
    },
    notes:
      'n ≈ 1.000 estudiantes de secundaria en ~50 aulas de 9.º a 11.º grado, en un liceo de Turquía. Único diseño localizado que retira la herramienta y mide qué queda: separa rendimiento asistido de aprendizaje. Realizado en secundaria y en matemáticas; su traslado a la universidad es inferencia razonable, no dato.',
  },
  {
    id: 'src-metr-2025',
    title:
      'Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity',
    organization: 'METR',
    url: 'https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/',
    publishedDate: '2025-07-10',
    accessedDate: '2026-08-30',
    geography: 'Internacional',
    evidenceType: 'Ensayo aleatorizado con medición objetiva',
    confidence: 72,
    notes:
      'n = 16 desarrolladores, 246 tareas reales. METR reclasificó posteriormente el resultado como histórico: no refleja necesariamente las herramientas actuales. El hallazgo metacognitivo conserva valor pedagógico.',
  },
  {
    id: 'src-wangfan-retraction-2026',
    title:
      'Retraction Note: The effect of ChatGPT on students’ learning performance, learning perception, and higher-order thinking',
    organization: 'Humanities and Social Sciences Communications · Springer Nature',
    url: 'https://www.nature.com/articles/s41599-026-07310-z',
    publishedDate: '2026-04-22',
    accessedDate: '2026-08-30',
    geography: 'Internacional',
    evidenceType: 'Nota de retractación',
    confidence: 98,
    documentaryStatus: 'verified',
    robustness: 'retracted',
    demonstrativeLevel: 'D1_existence',
    generalizationScope: 'not_established',
    lastVerified: '2026-08-31',
    notes:
      'El metaanálisis retractado había acumulado 266 citas y cerca de 486.000 visualizaciones. Motivo declarado: agregación de estudios demasiado distintos en método y muestra.',
  },
  {
    id: 'src-doshi-hauser-2024',
    title:
      'Generative AI enhances individual creativity but reduces the collective diversity of novel content',
    organization: 'Science Advances',
    url: 'https://www.science.org/doi/10.1126/sciadv.adn5290',
    publishedDate: '2024-07-12',
    accessedDate: '2026-08-30',
    geography: 'Internacional',
    evidenceType: 'Ensayo controlado aleatorizado',
    confidence: 90,
    notes:
      'Los autores lo describen como un dilema social: individualmente mejor, colectivamente más estrecho. El efecto nivelador es mayor entre quienes partían de menor desempeño.',
  },
  {
    id: 'src-magesh-2025',
    title:
      'Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools',
    organization: 'Journal of Empirical Legal Studies · Stanford RegLab y HAI',
    url: 'https://onlinelibrary.wiley.com/doi/full/10.1111/jels.12413',
    publishedDate: '2025-04',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Evaluación empírica de herramientas comerciales',
    confidence: 93,
    documentaryStatus: 'verified',
    robustness: 'single_study',
    demonstrativeLevel: 'D4_measured_outcome',
    generalizationScope: 'disciplinary',
    lastVerified: '2026-08-31',
    notes:
      'Version of record en Journal of Empirical Legal Studies 22:216–242 (2025). Precisión de mes, no de día: Wiley devuelve 403 a la consulta automatizada y el día exacto no pudo contrastarse contra la página del editor. Ambos proveedores comercializaban sus productos como libres de alucinaciones. Las tasas dependen del conjunto de consultas empleado y pueden variar con versiones posteriores.',
  },
  {
    id: 'src-charlotin-2026',
    title: 'AI Hallucination Cases Database',
    organization: 'Damien Charlotin · Smart Law Hub, HEC Paris',
    url: 'https://www.damiencharlotin.com/hallucinations/',
    publishedDate: '2026',
    accessedDate: '2026-08-28',
    geography: 'Internacional',
    evidenceType: 'Registro de resoluciones judiciales',
    confidence: 88,
    notes:
      'Solo incluye casos en que un tribunal constató el uso de contenido alucinado, no meras alegaciones. Es un registro de detección, no una tasa de error: el crecimiento mezcla mayor uso con mayor escrutinio judicial.',
  },
  {
    id: 'src-choi-schwarcz',
    title: 'AI Assistance in Legal Analysis: An Empirical Study',
    organization: 'Journal of Legal Education',
    url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4539836',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Ensayo aleatorizado en estudiantes de Derecho',
    confidence: 90,
    notes:
      'Primer ensayo aleatorizado sobre asistencia de IA en análisis jurídico, con corrección ciega y medición de tiempos. El hallazgo estructural es la compresión de la distribución del desempeño.',
  },
  {
    id: 'src-otis-2025',
    title: 'Global Evidence on Gender Gaps and Generative AI',
    organization: 'Harvard Business School · Working Paper 25-023',
    url: 'https://www.hbs.edu/ris/Publication%20Files/25-023_be8fb517-3dd5-40aa-97f9-4e42e1c8e6ff.pdf',
    publishedDate: '2025',
    accessedDate: '2026-08-30',
    geography: 'Internacional · 25 países',
    evidenceType: 'Metaanálisis',
    confidence: 90,
    notes:
      'Metaanálisis de 18 estudios y 143.008 personas. La brecha persiste incluso cuando el acceso se iguala, lo que descarta el acceso como única explicación.',
  },
  {
    id: 'src-brynjolfsson-2026',
    title:
      'Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence',
    organization: 'Stanford Digital Economy Lab',
    url: 'https://digitaleconomy.stanford.edu/news/canariesaug26/',
    publishedDate: '2026-08',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Análisis de microdatos administrativos',
    confidence: 85,
    notes:
      'No documenta desplazamiento laboral generalizado. El efecto se concentra por antigüedad, no por sector: golpea el primer peldaño, que es donde la universidad entrega su producto.',
  },
  {
    id: 'src-hepi-2026',
    title: 'Student Generative AI Survey 2026',
    organization: 'Higher Education Policy Institute',
    url: 'https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/',
    publishedDate: '2026-03-12',
    accessedDate: '2026-08-30',
    geography: 'Reino Unido',
    evidenceType: 'Encuesta',
    confidence: 82,
    documentaryStatus: 'verified',
    robustness: 'single_study',
    demonstrativeLevel: 'D3_adoption',
    generalizationScope: 'similar_population',
    lastVerified: '2026-08-31',
    notes:
      'n = 1.054 estudiantes de grado a tiempo completo; trabajo de campo de diciembre de 2025, ejecutado por Savanta. Datos autoinformados. El enunciado varía levemente entre oleadas: la serie indica magnitud y dirección, no medición equivalente.',
  },
  {
    id: 'src-unesco-2025',
    title:
      'Encuesta sobre orientación institucional en materia de IA en educación superior',
    organization: 'UNESCO',
    url: 'https://www.unesco.org/en/articles/unesco-survey-two-thirds-higher-education-institutions-have-or-are-developing-guidance-ai-use',
    publishedDate: '2025-09',
    accessedDate: '2026-08-30',
    geography: 'Internacional · 90 países',
    evidenceType: 'Encuesta institucional',
    confidence: 70,
    documentaryStatus: 'verified',
    robustness: 'single_study',
    demonstrativeLevel: 'D1_existence',
    generalizationScope: 'not_established',
    lastVerified: '2026-08-31',
    notes:
      '400 respuestas autoseleccionadas dentro de la red de Cátedras UNESCO, colectivo más movilizado que el promedio del sistema. Techo optimista, no media global. El titular difundido agrega política vigente y política en desarrollo.',
  },
  {
    id: 'src-teqsa-2025',
    title:
      'Assessment reform for the age of artificial intelligence · Enacting assessment reform in a time of artificial intelligence',
    organization: 'Tertiary Education Quality and Standards Agency (TEQSA)',
    url: 'https://www.teqsa.gov.au/guides-resources/higher-education-good-practice-hub/gen-ai-knowledge-hub/gen-ai-academic-integrity-and-assessment-reform',
    publishedDate: '2025-09',
    accessedDate: '2026-08-30',
    geography: 'Australia',
    evidenceType: 'Marco regulatorio y guía de aplicación',
    confidence: 92,
    notes:
      'No impone un método único: fija dos principios sobre preparación para una sociedad con IA ubicua y sobre la necesidad de enfoques múltiples para formar juicios fiables sobre el aprendizaje.',
  },
  {
    id: 'src-sydney-2024',
    title: 'Artificial intelligence and assessment · modelo de dos carriles',
    organization: 'University of Sydney',
    url: 'https://intranet.sydney.edu.au/education-students/teaching-learning/academic-integrity/artificial-intelligence-and-assessment.html',
    publishedDate: '2024-11',
    accessedDate: '2026-08-30',
    geography: 'Australia',
    evidenceType: 'Política institucional',
    confidence: 90,
    notes:
      'Separa evaluación segura de evaluación abierta y traslada la garantía del nivel de asignatura al de programa. No existe evaluación externa publicada de sus resultados de aprendizaje.',
  },
  {
    id: 'src-vanderbilt-2023',
    title: 'Guidance on AI Detection and Why We’re Disabling Turnitin’s AI Detector',
    organization: 'Vanderbilt University',
    url: 'https://www.vanderbilt.edu/brightspace/2023/08/16/guidance-on-ai-detection-and-why-were-disabling-turnitins-ai-detector/',
    publishedDate: '2023-08-16',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Decisión institucional razonada',
    confidence: 92,
    notes:
      'Argumentación pública sobre falsos positivos, sesgo contra hablantes no nativos y privacidad. A marzo de 2026 al menos doce instituciones importantes habían tomado la misma decisión.',
  },
  {
    id: 'src-the-foi-2025',
    title: 'Student AI cheating cases soar at UK universities',
    organization:
      'Times Higher Education · investigación de The Guardian por acceso a la información',
    url: 'https://www.timeshighereducation.com/news/student-ai-cheating-cases-soar-uk-universities',
    publishedDate: '2025',
    accessedDate: '2026-08-30',
    geography: 'Reino Unido',
    evidenceType: 'Datos obtenidos por solicitud de acceso a la información',
    confidence: 85,
    notes:
      'Solicitudes a 155 universidades; 131 respondieron. Mide detección, no prevalencia. Más del 27 % de las que respondieron no registraba la mala conducta con IA de forma separada.',
  },
  {
    id: 'src-dec-2026',
    title: 'Global AI Faculty Survey 2025 · AI in Higher Education Global Survey 2026',
    organization: 'Digital Education Council',
    url: 'https://www.digitaleducationcouncil.com/resource-library-items/ai-in-higher-education-global-survey-2026',
    publishedDate: '2026',
    accessedDate: '2026-08-30',
    geography: 'Internacional · 28 países',
    evidenceType: 'Encuesta',
    confidence: 68,
    notes:
      'n = 1.681 docentes en 52 instituciones en la oleada de 2025. Muestra autoseleccionada de instituciones miembros: sobrerrepresenta universidades ya movilizadas, por lo que la brecha real del sistema es probablemente mayor.',
  },
  {
    id: 'src-csu-2026',
    title: 'California State University renews controversial systemwide contract with OpenAI',
    organization: 'EdSource',
    url: 'https://edsource.org/2026/cal-state-renews-controversial-system-wide-contract-with-openai/758919',
    publishedDate: '2026-05',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Prensa especializada · datos institucionales internos',
    confidence: 82,
    notes:
      'La encuesta interna de CSU a más de 94.000 estudiantes y empleados es el único dato de resultados a escala institucional localizado en toda la investigación, y es desfavorable a su propia inversión.',
  },
  {
    id: 'src-casewestern-2026',
    title: 'Introduction to AI and the Law · requisito de primer año',
    organization: 'Case Western Reserve University School of Law · ABA Journal',
    url: 'https://www.abajournal.com/web/article/class-is-in-session-how-some-law-schools-are-training-students-in-generative-ai',
    publishedDate: '2026',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Programa curricular · cobertura especializada',
    confidence: 85,
    notes:
      'Primer programa de certificación en IA jurídica obligatorio para primer año en una facultad de Derecho estadounidense. No existe evaluación de resultados: enseña sobre IA sin haber rediseñado cómo evalúa.',
  },
  {
    id: 'src-uchicago-law-2026',
    title: 'Rethinking Legal Education in the AI Era · piloto de investigación y escritura jurídica',
    organization: 'University of Chicago Law School',
    url: 'https://www.law.uchicago.edu/news/ai-strategy-statement',
    publishedDate: '2026',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Estrategia institucional y diseño curricular',
    confidence: 85,
    notes:
      'Escribir sin IA como base y escribir con IA superpuesto encima. Es el modelo de dos carriles aplicado dentro de una sola asignatura, y el primero localizado en Derecho.',
  },
  {
    id: 'src-ncbe-nextgen',
    title: 'NextGen Bar Exam',
    organization: 'National Conference of Bar Examiners',
    url: 'https://nextgenbarexam.ncbex.org/',
    publishedDate: '2026-07',
    accessedDate: '2026-08-30',
    geography: 'Estados Unidos',
    evidenceType: 'Marco de evaluación profesional',
    confidence: 88,
    notes:
      'Debuta en julio de 2026 en jurisdicciones limitadas. Desplaza el peso hacia la aplicación de conceptos en escenarios realistas e incluye explícitamente la redacción jurídica como destreza evaluada.',
  },
  {
    id: 'src-eu-ai-act-annex3',
    title: 'Reglamento europeo de inteligencia artificial · Anexo III',
    organization: 'Unión Europea',
    url: 'https://artificialintelligenceact.eu/annex/3/',
    publishedDate: '2026-08-02',
    accessedDate: '2026-08-30',
    geography: 'Unión Europea',
    evidenceType: 'Norma jurídica',
    confidence: 95,
    notes:
      'Clasifica como alto riesgo la evaluación de resultados de aprendizaje y la supervisión de exámenes. Requisitos generales en vigor desde el 2 de agosto de 2026; usos del Anexo III prorrogados hasta el 2 de diciembre de 2027.',
  },
  {
    id: 'src-bid-ceibal-2025',
    title: '¡IA Presente! · mapeo regional de iniciativas de IA educativa',
    organization: 'Banco Interamericano de Desarrollo con Ceibal y Socialab',
    url: 'https://www.iadb.org/en/blog/education/how-ai-transforming-education-latin-america-and-caribbean-lessons-193-solutions',
    publishedDate: '2025',
    accessedDate: '2026-08-30',
    geography: 'América Latina y el Caribe · 22 países',
    evidenceType: 'Mapeo regional',
    confidence: 80,
    notes:
      '193 iniciativas identificadas. Demuestra existencia y alcance, no resultados: ninguna de las iniciativas mapeadas cuenta con evaluación independiente publicada.',
  },
];

/* ────────────────────────────── Afirmaciones ────────────────────────────── */

const INFORME_02 = 'transformacion-ensenanza-derecho';

export const claims: EvidenceClaim[] = [
  {
    id: 'clm-validez-evaluacion',
    claim:
      'La evaluación escrita no supervisada ya no puede presumirse, por sí sola, como evidencia suficiente de capacidad individual: el 94 % de las entregas generadas por IA pasó sin detección en un sistema de exámenes real y obtuvo, en promedio, mejores calificaciones que las humanas.',
    classification: 'FACT',
    sourceIds: ['src-scarfe-2024'],
    note: 'Experimento en cinco módulos de Psicología de una universidad británica. La dirección del hallazgo es robusta; su magnitud en otras disciplinas no está medida, y de aquí no se sigue que toda evaluación no supervisada sea inválida: se sigue que su valor certificador depende de supervisión, defensa, trazabilidad o triangulación.',
    confidence: 95,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-uso-vs-delegacion',
    claim:
      'El uso de IA generativa entre estudiantes de grado está saturado —94 % para trabajos evaluados—, pero la delegación total sigue siendo minoritaria: un 12 % inserta texto generado directamente en la entrega.',
    classification: 'FACT',
    sourceIds: ['src-hepi-2026'],
    note: 'Autoinforme sobre conducta sancionable: el 12 % debe leerse como suelo, no como estimación central. Serie británica; su traslado a Chile es inferencia, no dato.',
    confidence: 82,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-diseno-no-acceso',
    claim:
      'Lo que determina si la IA ayuda o daña el aprendizaje es el diseño pedagógico de la tarea, no el acceso a la herramienta: un tutor con andamiajes duplicó las ganancias de aprendizaje, mientras el acceso libre al mismo tipo de modelo dejó a los estudiantes por debajo de quienes nunca lo tuvieron.',
    classification: 'FACT',
    sourceIds: ['src-kestin-2025', 'src-bastani-2025'],
    note: 'Dos ensayos aleatorizados en poblaciones distintas —universidad y secundaria— que convergen desde direcciones opuestas.',
    confidence: 90,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-deteccion-fracaso',
    claim:
      'La detección algorítmica falló en las dos direcciones: falsos positivos que discriminan a hablantes no nativos y falsos negativos masivos. Al menos doce instituciones importantes la desactivaron.',
    classification: 'FACT',
    sourceIds: ['src-vanderbilt-2023', 'src-scarfe-2024'],
    note: 'El cierre de esta vía explica que la reforma evaluativa avanzara: las universidades no rediseñaron por convicción pedagógica sino por falta de alternativa técnica.',
    confidence: 92,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-alucinacion-juridica',
    claim:
      'Las herramientas comerciales de investigación jurídica alucinan entre el 17 % y el 33 % de las consultas, pese a comercializarse como libres de alucinaciones.',
    classification: 'FACT',
    sourceIds: ['src-magesh-2025'],
    note: 'Medición sobre un conjunto acotado de consultas; puede variar con versiones posteriores de las herramientas.',
    confidence: 93,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-compresion-desempeno',
    claim:
      'La asistencia de IA comprime la distribución del desempeño en análisis jurídico: los estudiantes de peor desempeño previo ganaron alrededor de 45 puntos percentiles y los de mejor desempeño obtuvieron peores calificaciones.',
    classification: 'FACT',
    sourceIds: ['src-choi-schwarcz', 'src-doshi-hauser-2024'],
    note: 'Es a la vez una promesa de equidad y una amenaza a la capacidad discriminante de la evaluación. Falta replicación fuera de Derecho y escritura creativa.',
    confidence: 88,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-retractacion-metaanalisis',
    claim:
      'El metaanálisis más citado a favor de efectos positivos grandes de ChatGPT sobre el aprendizaje fue retractado en abril de 2026, tras acumular 266 citas.',
    classification: 'FACT',
    sourceIds: ['src-wangfan-retraction-2026'],
    note: 'Motivo: agregación de estudios demasiado distintos en método y muestra. Obliga a releer cualquier documento anterior que se apoye en esa cifra.',
    confidence: 98,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-politica-vigente',
    claim:
      'Solo el 19 % de las instituciones de educación superior encuestadas por UNESCO tiene una política de IA formalmente vigente; un 42 % adicional la tiene en desarrollo.',
    classification: 'SIGNAL',
    sourceIds: ['src-unesco-2025'],
    note: 'Muestra autoseleccionada de 400 respuestas dentro de la red de Cátedras UNESCO. Techo optimista, no media global. El titular difundido agrega ambas categorías.',
    confidence: 70,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-brecha-docente',
    claim:
      'El cuello de botella se desplazó de la adopción a la capacidad docente: con el 77 % del profesorado ya usando IA, el 80 % declara falta de claridad institucional y solo el 17 % se sitúa en nivel avanzado.',
    classification: 'SIGNAL',
    sourceIds: ['src-dec-2026'],
    note: 'Muestra autoseleccionada de instituciones ya movilizadas: la brecha real del sistema es probablemente mayor que la reportada.',
    confidence: 68,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-descalibracion',
    claim:
      'La percepción de la propia productividad asistida está sistemáticamente descalibrada: desarrolladores expertos fueron un 19 % más lentos con IA y siguieron estimando que habían sido un 20 % más rápidos.',
    classification: 'SIGNAL',
    sourceIds: ['src-metr-2025'],
    note: 'n = 16 y resultado reclasificado como histórico por sus autores. Se conserva por su valor pedagógico: si expertos no calibran en su propio dominio, un estudiante tampoco lo hará sin entrenamiento explícito.',
    confidence: 66,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-peldano-entrada',
    claim:
      'El empleo de jóvenes de 22 a 25 años en ocupaciones expuestas a IA está aproximadamente un 19 % por debajo de su trayectoria esperada, sin brecha equivalente en trabajadores experimentados.',
    classification: 'SIGNAL',
    sourceIds: ['src-brynjolfsson-2026'],
    note: 'No hay desplazamiento laboral agregado. La atribución causal a la IA no es completa: coexisten factores de ciclo económico.',
    confidence: 78,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-brecha-genero',
    claim:
      'Se está formando una brecha de aprendizaje asistido con dimensión de género: las mujeres tienen un 22 % menos de probabilidades de usar IA generativa, y la brecha persiste incluso cuando el acceso se iguala.',
    classification: 'SIGNAL',
    sourceIds: ['src-otis-2025'],
    note: 'Igualar el acceso —lo que hace un despliegue institucional de licencias— es necesario y demostradamente insuficiente. Sin datos chilenos localizados.',
    confidence: 76,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-reforma-evaluativa',
    claim:
      'La reforma evaluativa es la única transformación sistemática verificable del periodo, y avanza por vía regulatoria antes que por adopción tecnológica.',
    classification: 'INFERENCE',
    sourceIds: ['src-teqsa-2025', 'src-sydney-2024', 'src-the-foi-2025'],
    note: 'Cadena explícita: la detección falla → la vía disciplinaria no escala al tamaño del fenómeno → el regulador fija principios → las instituciones rediseñan. Concentrada en Australia y Reino Unido; poco visible en otras regiones.',
    confidence: 80,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-derecho-caso-critico',
    claim:
      'El Derecho es el caso crítico de esta transformación porque su cadena formativa completa —leer, sintetizar, clasificar, comparar, argumentar y redactar— coincide con lo que los modelos de lenguaje ejecutan con alta fluidez y fiabilidad insuficiente.',
    classification: 'INFERENCE',
    sourceIds: ['src-magesh-2025', 'src-charlotin-2026', 'src-choi-schwarcz'],
    note: 'Esa combinación es la peor posible desde el punto de vista formativo: el error no se manifiesta como fallo evidente sino como texto correcto que cita una sentencia inexistente.',
    confidence: 78,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-coste-evaluacion',
    claim:
      'El principal riesgo de fracaso de la reforma evaluativa es presupuestario, no pedagógico: los instrumentos que recuperan validez consumen tiempo docente en proporción al número de estudiantes, y ninguna institución examinada lo ha presupuestado.',
    classification: 'INFERENCE',
    sourceIds: ['src-sydney-2024', 'src-teqsa-2025', 'src-csu-2026'],
    note: 'Razonamiento estructural, no medición directa. Es falsable: bastaría observar si aparecen partidas de horas docentes para evaluación oral y diseño de tareas en los presupuestos de 2027 y 2028.',
    confidence: 60,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-verificacion-competencia',
    claim:
      'Verificar que una cita existe, dice lo que se le atribuye y sigue vigente se ha convertido en una competencia jurídica autónoma, porque el proceso de investigación que antes la garantizaba de forma automática ha sido automatizado.',
    classification: 'HYPOTHESIS',
    sourceIds: ['src-magesh-2025', 'src-charlotin-2026'],
    note: 'Formulación por contrastar: no existe todavía evaluación de intervenciones que enseñen verificación de forma explícita, ni medición de su efecto.',
    confidence: 55,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-despliegues-sin-resultados',
    claim:
      'No existe evidencia independiente de que los despliegues institucionales masivos de IA generativa mejoren resultados de aprendizaje en educación superior.',
    classification: 'PENDING',
    sourceIds: ['src-csu-2026', 'src-unesco-2025'],
    note: 'Ausencia de evidencia, no evidencia de ausencia. Tras revisar treinta instituciones con iniciativas documentadas no se localizó un solo estudio independiente con grupo de comparación. El único dato de resultados a escala institucional es interno y desfavorable.',
    confidence: 70,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
  {
    id: 'clm-chile-evidencia',
    claim:
      'No se localizó evidencia pública de rediseño evaluativo institucional ni de modificación formal de perfiles de egreso en facultades de Derecho chilenas.',
    classification: 'PENDING',
    sourceIds: ['src-bid-ceibal-2025'],
    note: 'Se registra como ausencia de evidencia pública, no como inexistencia. Lo verificado en Chile se sitúa en el nivel de política y alfabetización, con un vector en formación inicial docente. Es precisamente la laguna que el informe 01 está destinado a cubrir.',
    confidence: 60,
    report: INFORME_02,
    lastVerified: '2026-08-30',
  },
];

export function sourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

/** Campos del registro, expuestos en la interfaz para que el método sea auditable. */
export const sourceSchema = [
  { field: 'source_id', desc: 'Identificador estable y citable dentro del proyecto.' },
  { field: 'title', desc: 'Título del documento o página.' },
  { field: 'organization', desc: 'Institución o autor responsable.' },
  { field: 'url', desc: 'Enlace directo al material consultado.' },
  { field: 'published_date', desc: 'Fecha de publicación declarada por la fuente.' },
  { field: 'accessed_date', desc: 'Fecha en que se consultó. Internet se edita.' },
  { field: 'geography', desc: 'Jurisdicción o ámbito territorial.' },
  { field: 'evidence_type', desc: 'Norma, política, programa, nota de prensa, artículo, dato.' },
  { field: 'confidence', desc: '0–100. Cuánto sostiene la fuente lo que se le atribuye.' },
  { field: 'notes', desc: 'Reservas, contexto y advertencias de lectura.' },
];

export const claimSchema = [
  { field: 'claim_id', desc: 'Identificador de la afirmación.' },
  { field: 'claim', desc: 'La afirmación, redactada de forma comprobable.' },
  { field: 'classification', desc: 'FACT · SIGNAL · INFERENCE · HYPOTHESIS · PENDING.' },
  { field: 'source_id', desc: 'Fuente o fuentes que la sostienen.' },
  { field: 'excerpt_or_note', desc: 'Fragmento citado o nota de lectura.' },
  { field: 'confidence', desc: '0–100.' },
  { field: 'report', desc: 'Informe donde se utiliza.' },
  { field: 'last_verified', desc: 'Última comprobación efectiva.' },
];

/* ────────────────── Taxonomía epistemológica (auditoría v0.3.0) ────────────────── */

/**
 * Las cuatro dimensiones que antes viajaban juntas bajo «VERIFICADO».
 *
 * Se publican con su definición porque el lector tiene que poder discutir la
 * clasificación, no sólo leerla. Una taxonomía que no se explica es una
 * etiqueta de autoridad.
 */
export const documentaryStatusMeta: Record<DocumentaryStatus, { label: string; definition: string }> = {
  verified: {
    label: 'Verificada',
    definition: 'La fuente existe, es accesible y dice lo que se le atribuye. No dice nada sobre si su hallazgo se sostiene.',
  },
  incomplete: {
    label: 'Incompleta',
    definition: 'Falta algún dato del registro —fecha exacta, versión de registro, muestra— que no pudo contrastarse.',
  },
  unverifiable: {
    label: 'No verificable',
    definition: 'No hay acceso público al documento original. Se conserva declarando la limitación.',
  },
  corrected: {
    label: 'Con corrección publicada',
    definition: 'El propio editor publicó una corrección o fe de erratas. Se puede citar, pero no en silencio.',
  },
};

export const robustnessMeta: Record<Robustness, { label: string; definition: string }> = {
  single_study: {
    label: 'Estudio único',
    definition: 'Un solo trabajo, sin réplica independiente. La dirección puede ser sólida y la magnitud no.',
  },
  convergent: {
    label: 'Convergente',
    definition: 'Varios trabajos de diseño distinto apuntan en la misma dirección sin ser réplicas.',
  },
  replicated: {
    label: 'Replicada',
    definition: 'El hallazgo se reprodujo en un diseño equivalente y población distinta.',
  },
  contested: {
    label: 'Controvertida',
    definition: 'Existe evidencia publicada que apunta en dirección contraria.',
  },
  retracted: {
    label: 'Retractada',
    definition: 'La publicación fue retirada por su editor. No sostiene nada; se conserva como registro del episodio.',
  },
};

export const demonstrativeLevelMeta: Record<DemonstrativeLevel, { label: string; definition: string }> = {
  D1_existence: { label: 'D1 · existencia', definition: 'Consta que la iniciativa existe. Nada más.' },
  D2_implementation: { label: 'D2 · implementación', definition: 'Consta que se puso en marcha, no que se use.' },
  D3_adoption: { label: 'D3 · adopción', definition: 'Consta uso efectivo, no resultados.' },
  D4_measured_outcome: { label: 'D4 · resultado medido', definition: 'Hay medición de resultados, sin diseño que aísle la causa.' },
  D5_causal_identification: {
    label: 'D5 · identificación causal en contexto experimental',
    definition:
      'El diseño permite atribuir causalidad dentro del experimento. No es «causalidad establecida»: fuera de ese contexto, el alcance lo fija la dimensión de generalización.',
  },
};

export const generalizationScopeMeta: Record<GeneralizationScope, { label: string; definition: string }> = {
  local: { label: 'Local', definition: 'Vale para la población y el contexto del estudio. Llevarlo más lejos es inferencia.' },
  similar_population: { label: 'Población similar', definition: 'Extensible a poblaciones equiparables en país, nivel y disciplina.' },
  disciplinary: { label: 'Disciplinar', definition: 'Extensible dentro de la disciplina estudiada.' },
  multi_context: { label: 'Multicontexto', definition: 'Sostenido en contextos, países o disciplinas distintos.' },
  not_established: { label: 'Sin establecer', definition: 'El diseño no permite pronunciarse sobre generalización.' },
};
