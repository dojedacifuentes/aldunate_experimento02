import type { DoctrinalTopic } from '@/types';

/**
 * Preguntas del corpus.
 *
 * El encargo pedía un «explorador de posturas doctrinales». Lo que se puede
 * construir con honestidad, sin los textos completos delante, es esto: las
 * preguntas que el corpus **demostrablemente aborda**, con las obras que las
 * abordan.
 *
 * De ahí la asimetría deliberada de este archivo. Donde existe resumen de la
 * propia publicación, `position` dice qué examina el trabajo y va como `SIGNAL`.
 * Donde solo existe el título, `position` dice exactamente eso —que hay una
 * serie sostenida sobre el problema— y va como `PENDING`, sin fingir que
 * conocemos la respuesta.
 *
 * Un explorador doctrinal que atribuye tesis leídas en los títulos no es un
 * explorador: es una encuesta de opinión sobre alguien que no fue consultado.
 */
export const doctrinalTopics: DoctrinalTopic[] = [
  {
    id: 'fuerza-normativa',
    conceptId: 'fuentes',
    question:
      '¿Qué le hace al sistema de fuentes la invocación de la «fuerza normativa de la Constitución»?',
    position:
      'Según el resumen de la propia publicación de 2009, el trabajo revisa los sentidos corrientes del principio en la doctrina y la jurisprudencia nacionales, rastrea su origen y examina críticamente su efecto sobre el sistema de fuentes. Es la pregunta que articula el tramo 2009–2010 del catálogo.',
    classification: 'SIGNAL',
    publicationIds: [
      'art-2009-fuerza-normativa',
      'art-2010-neoconstitucionalismo-critica',
      'art-2010-tratados',
      'art-2009-potestades-normativas',
    ],
    note: 'Basado en el resumen publicado del artículo, no en su lectura completa. El resumen dice qué examina el trabajo; no permite afirmar a qué conclusión llega.',
  },
  {
    id: 'limite-propiedad',
    conceptId: 'propiedad',
    question: '¿Dónde termina la limitación al dominio y empieza la expropiación?',
    position:
      'Según el resumen de la publicación de 2006, el trabajo examina los criterios necesarios para distinguir ambas figuras, frente a la tesis del Tribunal Constitucional que las sitúa en un mismo continuo conceptual separado solo por la entidad del efecto patrimonial.',
    classification: 'SIGNAL',
    publicationIds: [
      'art-2006-expropiacion',
      'art-2008-propiedad-historia',
      'art-1997-propiedad-garantias',
    ],
    note: 'Basado en el resumen publicado. La posición del autor frente a esa tesis no se infiere del resumen.',
  },
  {
    id: 'como-se-interpreta',
    conceptId: 'interpretacion',
    question: '¿Con qué reglas se interpreta una constitución, y quién las fija?',
    position:
      'El corpus vuelve sobre el problema durante tres décadas —1993, 1998, 2001, 2002— y la tesis doctoral de 1997 lo aborda de frente, situando la teoría constitucional como elemento de la teoría de la interpretación. Qué reformulación propone cada trabajo exige leerlos.',
    classification: 'PENDING',
    publicationIds: [
      'art-1993-interpretacion-decision',
      'art-1998-teoria-interpretacion',
      'art-2001-doctrina-interpretacion',
      'art-2002-reformulacion-reglas',
      'art-2002-interpretacion-valores',
    ],
    note: 'Cinco trabajos localizados sobre la misma pregunta. Ninguno consultado en texto completo.',
  },
  {
    id: 'neoconstitucionalismo',
    conceptId: 'neoconstitucionalismo',
    question: '¿Qué reúne, y qué oculta, la etiqueta «neoconstitucionalismo»?',
    position:
      'Dos trabajos de 2010 abordan la cuestión; el de la Revista de Derecho de Valdivia se anuncia desde el título como aproximación conceptual **y crítica**. La palabra está en el título del autor, no puesta por nosotros; el contenido de esa crítica no se resume aquí porque no se ha leído.',
    classification: 'PENDING',
    publicationIds: [
      'art-2010-neoconstitucionalismo-critica',
      'art-2010-neoconstitucionalismo-anuario',
      'art-2009-fuerza-normativa',
    ],
    note: 'El informe de origen atribuía a estos trabajos una tesis específica sobre «choque de fuentes» y erosión de la autonomía legislativa. No se localizó respaldo textual para esa formulación y no se reproduce.',
  },
  {
    id: 'tribunal-constitucional',
    conceptId: 'justicia-constitucional',
    question: '¿Cómo argumenta el Tribunal Constitucional, y cómo se controla?',
    position:
      'Es la línea más persistente del catálogo: análisis de su argumentación (1998), control preventivo (2005), derecho procesal constitucional (1997), cosa juzgada (1993) y un volumen dedicado a su jurisprudencia 2006-2008.',
    classification: 'PENDING',
    publicationIds: [
      'art-1998-categorias-argumentacion',
      'art-2005-control-preventivo',
      'art-1997-procesal-constitucional',
      'art-1993-cosa-juzgada',
      'libro-jurisprudencia-constitucional',
    ],
  },
  {
    id: 'ia-ensenanza',
    conceptId: 'ia-derecho',
    question: '¿Qué cambia en la enseñanza del Derecho cuando entra un asistente virtual?',
    position:
      'La entrada más reciente del catálogo (2024), en coautoría con Faúndez Ugalde, Mellado Silva y Benfeld. Es el punto donde el corpus toca la materia de este laboratorio, y la razón por la que esta página existe.',
    classification: 'PENDING',
    publicationIds: ['art-2024-asistentes-virtuales'],
    note: 'Publicado en Revista de Pedagogía Universitaria y Didáctica del Derecho. No consultado en texto completo.',
  },
];
