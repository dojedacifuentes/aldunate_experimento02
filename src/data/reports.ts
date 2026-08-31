import type { Report, ReportStatus, Tone } from '@/types';

/**
 * Informes vivos.
 *
 * Un informe vivo no se reemplaza: se versiona. `versions` crece hacia
 * adelante y nunca se edita hacia atrás; el changelog es la prueba de eso.
 *
 * El informe 01 sigue en fase de investigación: su resumen describe el alcance
 * del trabajo, no hallazgos, porque todavía no hay hallazgos que reportar.
 *
 * El informe 02 alcanzó su versión 0.2.0 con documento completo. Sus hallazgos
 * están respaldados en `src/data/research.ts`, con el nivel epistémico de cada
 * afirmación declarado y su fecha de verificación.
 */

export const reportStatusMeta: Record<ReportStatus, { label: string; tone: Tone }> = {
  'en-investigacion': { label: 'En investigación', tone: 'signal' },
  borrador: { label: 'Borrador', tone: 'warning' },
  'en-revision': { label: 'En revisión', tone: 'warning' },
  publicado: { label: 'Publicado', tone: 'success' },
};

export const reports: Report[] = [
  {
    slug: 'ia-escuelas-derecho-chile',
    code: 'INFORME 01',
    title:
      'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile',
    subtitle: 'Mapeo de evidencia pública',
    executiveSummary:
      'Mapeo sistemático de evidencia pública sobre uso, enseñanza, políticas, herramientas e iniciativas de inteligencia artificial en Escuelas y Facultades de Derecho chilenas. El informe se construye por acumulación verificada: cada institución incorporada exige documento público, fecha de consulta y nivel de confianza declarado. Hasta que ese registro alcance cobertura suficiente, este documento no emite conclusiones sobre tendencias nacionales.',
    authors: ['Equipo Experimento 02'],
    status: 'en-investigacion',
    folder: 'content/reports/01_ia_escuelas_derecho_chile/',
    axes: [
      'Universidades y unidades académicas',
      'Iniciativas y programas',
      'Cursos y asignaturas',
      'Políticas y reglamentos de uso',
      'Herramientas adoptadas',
      'Docentes e investigadores involucrados',
      'Evidencia pública disponible',
      'Comparación temporal',
    ],
    variables: [
      'universidad',
      'unidad',
      'iniciativa',
      'tipo',
      'fecha',
      'estado',
      'audiencia',
      'herramienta',
      'evidencia',
      'source_id',
      'confidence',
      'last_verified',
    ],
    methodology: [
      'Búsqueda en sitios institucionales, repositorios y prensa universitaria; se registra URL y fecha de consulta.',
      'Cada hallazgo entra al registro de fuentes antes de convertirse en dato.',
      'Cada afirmación se clasifica como hecho, señal, inferencia, hipótesis o pendiente.',
      'La ausencia de evidencia pública se registra como ausencia, no como inexistencia.',
      'Los datos agregados se publican solo cuando la cobertura permite interpretarlos sin sesgo de disponibilidad.',
    ],
    limitations: [
      'La evidencia pública favorece a instituciones con mayor actividad comunicacional; visibilidad no equivale a adopción.',
      'Las iniciativas internas sin publicación quedan fuera del alcance por construcción.',
      'El campo cambia más rápido que el ciclo de verificación: toda cifra tiene fecha.',
    ],
    versions: [
      {
        version: '0.1.0',
        date: '2026-08-29',
        status: 'en-investigacion',
        changelog: [
          'Apertura del informe y definición de alcance.',
          'Definición de variables y esquema de registro.',
          'Estructura de carpetas de fuentes, borradores y versiones publicadas.',
        ],
      },
    ],
    sourceIds: [],
    claimIds: [],
    openQuestions: [
      '¿Qué unidades académicas cuentan con política publicada sobre uso de IA?',
      '¿Existen asignaturas específicas o el contenido aparece integrado en cursos existentes?',
      '¿Cómo se distribuye la actividad entre docencia, investigación y gestión?',
      '¿Qué diferencia hay entre lo declarado institucionalmente y lo observable en programas de curso?',
    ],
    updatedAt: '2026-08-29',
  },
  {
    slug: 'transformacion-ensenanza-derecho',
    code: 'INFORME 02',
    title:
      'Cómo se está transformando la enseñanza del Derecho en el contexto de la inteligencia artificial',
    subtitle: 'Metodologías, evaluación y competencias',
    executiveSummary:
      'Qué se evalúa cuando el producto escrito deja de ser prueba de proceso. La versión 0.2.0 sitúa la enseñanza jurídica dentro del cuadro más amplio de la educación superior: veinticuatro capítulos que recorren evaluación, competencias, metodologías, rol docente, currículo, gobernanza y mercado profesional, con la formación en Derecho como caso crítico porque su cadena formativa completa —leer, sintetizar, argumentar y redactar— coincide con lo que los sistemas generativos ejecutan con alta fluidez y fiabilidad insuficiente. El hallazgo central es asimétrico: la transformación verificable se concentra casi por completo en la evaluación, y de treinta y ocho hallazgos registrados solo seis alcanzan nivel de causalidad establecida. Ninguna afirmación sobre despliegues institucionales de escala supera el nivel de implementación.',
    authors: ['Equipo Experimento 02'],
    status: 'en-revision',
    folder: 'content/reports/02_transformacion_ensenanza_derecho/',
    axes: [
      'Metodologías de enseñanza',
      'Evaluación',
      'Competencias',
      'Rol docente',
      'Alfabetización en IA',
      'Integridad académica',
      'Diseño curricular',
      'Práctica jurídica',
      'Formación profesional',
      'Casos internacionales',
      'Escenarios y proyecciones',
    ],
    methodology: [
      'Revisión de literatura académica y documentos institucionales sobre enseñanza jurídica e IA.',
      'Análisis de casos internacionales con documentación pública verificable.',
      'Separación explícita entre evidencia observada, inferencia y escenario proyectado.',
      'Los escenarios se publican rotulados como escenarios, con sus supuestos a la vista.',
    ],
    limitations: [
      'La literatura disponible se concentra en jurisdicciones anglosajonas; la transferencia al contexto chileno es una inferencia, no un dato.',
      'Los efectos sobre aprendizaje requieren horizontes temporales más largos que la evidencia existente.',
      'Buena parte del material publicado es normativo —qué debería hacerse— más que empírico.',
    ],
    versions: [
      {
        version: '0.1.0',
        date: '2026-08-29',
        status: 'en-investigacion',
        changelog: [
          'Apertura del informe y definición de ejes de análisis.',
          'Definición del criterio de separación entre evidencia y proyección.',
          'Estructura de carpetas de fuentes, borradores y versiones publicadas.',
        ],
      },
      {
        version: '0.2.0',
        date: '2026-08-31',
        status: 'en-revision',
        pdf: '/descargas/informe-02-transformacion-ensenanza-v0.2.0.pdf',
        html: '/descargas/informe-02-completo-v0.2.0.html',
        changelog: [
          'Documento completo: 24 capítulos y 3 anexos, 76 páginas, 12 figuras y 24 tablas.',
          'Registro de fuentes poblado con 24 entradas verificadas una a una en el documento original.',
          'Matriz de evidencia con 18 afirmaciones clasificadas en los cinco niveles epistémicos.',
          'Mapa internacional de 30 instituciones de 10 países, clasificadas por profundidad verificada de transformación.',
          'Seis estudios de caso con la pregunta doble qué demuestra y qué no demuestra cada uno.',
          'Capítulo sobre enseñanza del Derecho ampliado a once secciones, con hoja de ruta para una facultad.',
          'Se registra la ausencia de evidencia pública de rediseño evaluativo en facultades chilenas.',
          'Se incorpora la retractación del metaanálisis de Wang y Fan (22 de abril de 2026) como advertencia de lectura sobre la literatura previa.',
          'Auditoría de consistencia numérica: cuatro discrepancias de recuento detectadas y corregidas.',
        ],
      },
    ],
    sourceIds: [
      'src-scarfe-2024',
      'src-kestin-2025',
      'src-bastani-2025',
      'src-metr-2025',
      'src-wangfan-retraction-2026',
      'src-doshi-hauser-2024',
      'src-magesh-2025',
      'src-charlotin-2026',
      'src-choi-schwarcz',
      'src-otis-2025',
      'src-brynjolfsson-2026',
      'src-hepi-2026',
      'src-unesco-2025',
      'src-teqsa-2025',
      'src-sydney-2024',
      'src-vanderbilt-2023',
      'src-the-foi-2025',
      'src-dec-2026',
      'src-csu-2026',
      'src-casewestern-2026',
      'src-uchicago-law-2026',
      'src-ncbe-nextgen',
      'src-eu-ai-act-annex3',
      'src-bid-ceibal-2025',
    ],
    claimIds: [
      'clm-validez-evaluacion',
      'clm-uso-vs-delegacion',
      'clm-diseno-no-acceso',
      'clm-deteccion-fracaso',
      'clm-alucinacion-juridica',
      'clm-compresion-desempeno',
      'clm-retractacion-metaanalisis',
      'clm-politica-vigente',
      'clm-brecha-docente',
      'clm-descalibracion',
      'clm-peldano-entrada',
      'clm-brecha-genero',
      'clm-reforma-evaluativa',
      'clm-derecho-caso-critico',
      'clm-coste-evaluacion',
      'clm-verificacion-competencia',
      'clm-despliegues-sin-resultados',
      'clm-chile-evidencia',
    ],
    openQuestions: [
      '¿Qué instrumentos de evaluación resisten el uso no declarado de sistemas generativos?',
      '¿La alfabetización en IA es contenido transversal o asignatura propia?',
      '¿Qué competencias jurídicas ganan valor y cuáles se abaratan?',
      '¿Cómo se traduce esto a la formación práctica y al ejercicio profesional temprano?',
      '¿Cuánto tiempo docente cuesta realmente la evaluación que recupera validez? Es la variable que decide si la reforma es viable y nadie la ha medido.',
      '¿Qué ocurre con el aprendizaje a lo largo de una carrera completa? Toda la evidencia disponible mide semanas o un semestre.',
      '¿Se sostienen estos hallazgos fuera del inglés? Casi toda la evidencia procede de sistemas anglófonos, con modelos que rinden mejor en esa lengua.',
    ],
    updatedAt: '2026-08-31',
  },
];

export function getReport(slug: string): Report | undefined {
  return reports.find((r) => r.slug === slug);
}
