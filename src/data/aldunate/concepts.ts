import type { CorpusConcept } from '@/types';

/**
 * Conceptos del corpus.
 *
 * REGLA: ninguno se agrega porque «suene relevante» en derecho constitucional.
 * Cada uno etiqueta al menos una obra real del catálogo, y el test de datos lo
 * comprueba. Un concepto sin obras es un concepto inventado, y se cae en CI.
 *
 * `summary` describe **el territorio que las obras recorren**, no la posición
 * que sostienen. La distinción es la misma que separa un índice temático de
 * una atribución doctrinaria.
 *
 * Las aristas del grafo NO se declaran aquí: se derivan de la coocurrencia real
 * en las publicaciones (ver `graph.ts`). Escribirlas a mano permitiría dibujar
 * una relación que el corpus no sostiene.
 */
export const concepts: CorpusConcept[] = [
  {
    id: 'teoria-constitucional',
    title: 'Teoría de la Constitución',
    summary:
      'Qué es una constitución antes de ser un texto aplicable: su función, sus supuestos y el lugar de la teoría constitucional dentro de la teoría del Derecho.',
    related: [],
  },
  {
    id: 'interpretacion',
    title: 'Interpretación constitucional',
    summary:
      'Las reglas y elementos con que se interpreta el texto constitucional, el estado de la doctrina nacional sobre ellos y su relación con la decisión política.',
    related: [],
  },
  {
    id: 'fuentes',
    title: 'Sistema de fuentes',
    summary:
      'Cómo se ordenan las normas entre sí: fuerza normativa de la Constitución, distribución de potestades normativas y posición de los tratados internacionales.',
    related: [],
  },
  {
    id: 'neoconstitucionalismo',
    title: 'Neoconstitucionalismo',
    summary:
      'El conjunto de tesis que la etiqueta reúne, examinado conceptual y críticamente, y su efecto sobre el sistema de fuentes.',
    related: [],
  },
  {
    id: 'derechos-fundamentales',
    title: 'Derechos fundamentales',
    summary:
      'Titularidad, contenido y protección de los derechos: la materia del libro de 2008 y de una serie de artículos sobre amparo y tutela.',
    related: [],
  },
  {
    id: 'justicia-constitucional',
    title: 'Justicia constitucional',
    summary:
      'El Tribunal Constitucional como objeto de estudio: control preventivo, cosa juzgada, derecho procesal constitucional y análisis de su argumentación.',
    related: [],
  },
  {
    id: 'propiedad',
    title: 'Propiedad',
    summary:
      'La garantía constitucional del dominio: su evolución histórica, su tratamiento jurisprudencial y el límite entre limitación y expropiación.',
    related: [],
  },
  {
    id: 'poder-judicial',
    title: 'Poder judicial',
    summary:
      'Independencia judicial y organización constitucional de la judicatura, examinadas en clave teórica.',
    related: [],
  },
  {
    id: 'potestad-sancionadora',
    title: 'Potestad sancionadora y control',
    summary:
      'Las bases constitucionales del poder sancionador de la Administración y la evolución de la función de control de la Contraloría.',
    related: [],
  },
  {
    id: 'argumentacion',
    title: 'Argumentación jurídica',
    summary:
      'Categorías para analizar cómo argumentan los tribunales y diagnóstico de las deficiencias corrientes del razonamiento jurídico.',
    related: [],
  },
  {
    id: 'derechos-sociales',
    title: 'Derechos sociales y política fiscal',
    summary:
      'Los derechos de prestación y sus condiciones materiales, incluida una incursión en política fiscal y protección social.',
    related: [],
  },
  {
    id: 'igualdad',
    title: 'Igualdad',
    summary: 'La igualdad constitucional desagregada en sus componentes.',
    related: [],
  },
  {
    id: 'familia',
    title: 'Acuerdos matrimoniales',
    summary:
      'Los pactos pre y posmatrimoniales: modelos comparados de regulación y su lugar en el ordenamiento chileno.',
    related: [],
  },
  {
    id: 'ambiental-recursos',
    title: 'Recursos naturales y ambiente',
    summary:
      'Habilitación ambiental y régimen de pesca: las consecuencias constitucionales de la regulación de recursos.',
    related: [],
  },
  {
    id: 'ia-derecho',
    title: 'Inteligencia artificial y Derecho',
    summary:
      'La incorporación de asistentes virtuales al trabajo y a la formación jurídica. Es la línea más reciente del catálogo.',
    related: [],
  },
  {
    id: 'ensenanza',
    title: 'Enseñanza del Derecho',
    summary:
      'La didáctica jurídica como objeto de investigación, no solo como práctica: qué se enseña, con qué medios y con qué resultado.',
    related: [],
  },
];

export const conceptById = new Map(concepts.map((c) => [c.id, c]));
