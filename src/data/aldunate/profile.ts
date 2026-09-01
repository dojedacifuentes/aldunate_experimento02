import type { ProfileFact, Placeholder, TimelineEvent } from '@/types';

/**
 * Ficha del profesor Eduardo Aldunate Lizana.
 *
 * Todo dato de esta capa lleva nivel epistémico y fuente. Los niveles son los
 * cinco que el sitio usa en toda la investigación (`FACT` · `SIGNAL` ·
 * `INFERENCE` · `HYPOTHESIS` · `PENDING`), no una escala nueva.
 *
 * Criterio aplicado:
 *
 * - `FACT`     dos o más fuentes independientes, o una institucional/índice.
 * - `SIGNAL`   una sola fuente secundaria, o fuentes que discrepan en el detalle.
 * - `PENDING`  el dato circula pero ninguna fuente accesible lo sostiene.
 *
 * Lo que **no** está aquí y estaba en el informe de origen: fecha y lugar de
 * nacimiento. Ninguna de las fuentes consultadas los consigna. Ver
 * `docs/AUDITORIA-PERFIL-ALDUNATE.md`.
 */
export const profile = {
  name: 'Eduardo Aldunate Lizana',
  /** Descriptor de campo verificado por la propia Escuela. */
  field: 'Derecho constitucional',
  role: 'Profesor de Derecho constitucional e Introducción al Derecho',
  affiliation: 'Escuela de Derecho, Pontificia Universidad Católica de Valparaíso',
  /**
   * Redactada en términos de obra, no de convicción. Lo que se puede afirmar
   * sin leer los textos completos es qué materias recorre el catálogo.
   */
  intro:
    'Profesor de Derecho constitucional en la Escuela de Derecho de la Pontificia Universidad Católica de Valparaíso. Su catálogo indexado recorre tres décadas de trabajo sobre interpretación constitucional, sistema de fuentes, derechos fundamentales y justicia constitucional, y en su tramo más reciente alcanza la enseñanza del Derecho asistida por inteligencia artificial.',
  /** Advertencia de alcance de la propia página. */
  note: 'Esta ficha se construye a partir de fuentes públicas consultadas el 1 de septiembre de 2026. No procede de una entrevista ni de material entregado por el profesor, y no habla en su nombre.',
} as const;

/** Datos de formación, trayectoria y cargo, cada uno con su respaldo. */
export const profileFacts: ProfileFact[] = [
  {
    id: 'licenciatura',
    label: 'Licenciatura',
    value: 'Licenciado en Ciencias Jurídicas y Sociales, PUCV (1991)',
    classification: 'SIGNAL',
    sourceIds: ['derechopedia'],
    note: 'Consta en una sola ficha colaborativa. No se localizó registro institucional que lo confirme.',
  },
  {
    id: 'doctorado',
    label: 'Doctorado',
    value: 'Doctor en Derecho, Universidad del Sarre (Saarbrücken, Alemania), 1997',
    classification: 'FACT',
    sourceIds: ['derechopedia', 'pucv-derecho'],
  },
  {
    id: 'tesis',
    label: 'Tesis doctoral',
    value:
      'Verfassungsrecht als politisches Recht. Die Funktion der Verfassungstheorie als Element der Theorie der Verfassungsauslegung',
    classification: 'SIGNAL',
    sourceIds: ['derechopedia'],
    note: 'El informe de origen daba un título distinto («Die Auslegung des Verfassungsrechts als politisches Recht»). Se conserva el de la ficha, que es la única fuente localizada, y se deja constancia de la discrepancia.',
  },
  {
    id: 'subsecretaria-pesca',
    label: 'Ejercicio en el Estado',
    value: 'Abogado de la Subsecretaría de Pesca (1998–2001)',
    classification: 'SIGNAL',
    sourceIds: ['derechopedia'],
    note: 'Converge con su artículo de 1998 sobre el proyecto de régimen especial de pesca, pero la fuente del cargo sigue siendo única.',
  },
  {
    id: 'direccion-escuela-2004',
    label: 'Dirección de Escuela',
    value: 'Director de la Escuela de Derecho PUCV (2004–2007)',
    classification: 'FACT',
    sourceIds: ['derechopedia', 'pucv-derecho'],
  },
  {
    id: 'academia-judicial',
    label: 'Academia Judicial',
    value: 'Director de la Academia Judicial de Chile (2011–2018)',
    classification: 'FACT',
    sourceIds: ['derechopedia', 'pucv-derecho'],
  },
  {
    id: 'direccion-escuela-actual',
    label: 'Cargo actual',
    value: 'Director de la Escuela de Derecho PUCV',
    classification: 'FACT',
    sourceIds: ['pucv-derecho'],
    note: 'Sostenido por comunicaciones institucionales de la Escuela. No se fija fecha de inicio del período porque las fuentes consultadas no la consignan.',
  },
  {
    id: 'diat',
    label: 'Programa DIAT',
    value: 'Vinculado a la dirección del programa Derecho, Inteligencia Artificial y Tecnología (PUCV)',
    classification: 'SIGNAL',
    sourceIds: ['derechopedia', 'pucv-derecho'],
    note: 'Las fuentes discrepan sobre el rol exacto: una lo señala como director del programa; otra atribuye esa dirección a Johann Benfeld con Aldunate como director de la Escuela. Se publica la vinculación, no el cargo.',
  },
];

/**
 * Cronología. Los hitos de obra no se repiten aquí uno por uno —para eso está
 * el catálogo—; solo entran los que marcan un cambio de tramo.
 */
export const timeline: TimelineEvent[] = [
  {
    id: 't-1991',
    year: 1991,
    title: 'Licenciatura en Ciencias Jurídicas y Sociales',
    detail: 'Facultad de Derecho, PUCV.',
    kind: 'formacion',
    classification: 'SIGNAL',
    sourceIds: ['derechopedia'],
  },
  {
    id: 't-1993',
    year: 1993,
    title: 'Primeras publicaciones indexadas',
    detail:
      'Interpretación constitucional y decisión política, y jurisdicción constitucional: las dos líneas que sostendrán el resto del catálogo.',
    kind: 'obra',
    classification: 'FACT',
    sourceIds: ['dialnet-autor'],
  },
  {
    id: 't-1997-doctorado',
    year: 1997,
    title: 'Doctorado en Derecho, Universidad del Sarre',
    detail: 'Tesis sobre la función de la teoría constitucional en la teoría de la interpretación.',
    kind: 'formacion',
    classification: 'FACT',
    sourceIds: ['derechopedia', 'pucv-derecho'],
  },
  {
    id: 't-1998-pesca',
    year: 1998,
    endYear: 2001,
    title: 'Subsecretaría de Pesca',
    detail: 'Ejercicio profesional en la Administración del Estado.',
    kind: 'cargo',
    classification: 'SIGNAL',
    sourceIds: ['derechopedia'],
  },
  {
    id: 't-2004-escuela',
    year: 2004,
    endYear: 2007,
    title: 'Dirección de la Escuela de Derecho PUCV',
    kind: 'cargo',
    classification: 'FACT',
    sourceIds: ['derechopedia', 'pucv-derecho'],
  },
  {
    id: 't-2008-libro',
    year: 2008,
    title: 'Derechos fundamentales',
    detail: 'LegalPublishing. La monografía sobre la materia que atraviesa el catálogo.',
    kind: 'obra',
    classification: 'FACT',
    sourceIds: ['dialnet-autor', 'derechopedia'],
  },
  {
    id: 't-2009-jurisprudencia',
    year: 2009,
    title: 'Jurisprudencia constitucional 2006-2008',
    detail: 'LegalPublishing.',
    kind: 'obra',
    classification: 'SIGNAL',
    sourceIds: ['derechopedia'],
  },
  {
    id: 't-2009-fuentes',
    year: 2009,
    endYear: 2010,
    title: 'El tramo sobre fuerza normativa y neoconstitucionalismo',
    detail:
      'Cuatro trabajos en dos años sobre el mismo problema: qué le hace al sistema de fuentes la expansión del principio de fuerza normativa.',
    kind: 'obra',
    classification: 'FACT',
    sourceIds: ['dialnet-autor', 'scielo-fuerza-normativa'],
  },
  {
    id: 't-2011-academia',
    year: 2011,
    endYear: 2018,
    title: 'Dirección de la Academia Judicial de Chile',
    detail: 'Formación de la magistratura, en el organismo público a cargo de ella.',
    kind: 'cargo',
    classification: 'FACT',
    sourceIds: ['derechopedia', 'pucv-derecho'],
  },
  {
    id: 't-2024-ia',
    year: 2024,
    title: 'Enseñanza del Derecho con asistentes virtuales',
    detail:
      'Artículo en coautoría sobre didáctica jurídica mediada por inteligencia artificial: la línea más reciente del catálogo.',
    kind: 'obra',
    classification: 'FACT',
    sourceIds: ['dialnet-autor'],
  },
  {
    id: 't-actual-escuela',
    year: 2025,
    title: 'Dirección de la Escuela de Derecho PUCV',
    detail: 'Segundo período al frente de la Escuela, según comunicaciones institucionales.',
    kind: 'institucional',
    classification: 'FACT',
    sourceIds: ['pucv-derecho'],
  },
];

/**
 * Huecos declarados.
 *
 * Se conservan del diseño anterior porque el principio no cambió: un hueco
 * dicho en voz alta es mejor que un relleno. Lo que cambió es la lista —el
 * catálogo de publicaciones dejó de estar vacío— y eso también se dice.
 */
export const pendingContent: Placeholder[] = [
  {
    id: 'nacimiento',
    label: 'Fecha y lugar de nacimiento',
    detail:
      'El informe de origen consignaba «Quilpué, 1968». Ninguna de las fuentes consultadas lo sostiene, de modo que el dato no se publica.',
  },
  {
    id: 'texto-completo',
    label: 'Tesis y argumento de cada obra',
    detail:
      'El catálogo registra qué se publicó y dónde. Qué sostiene cada trabajo exige leerlo: el campo existe en el modelo de datos y se llena con cita, no de memoria.',
  },
  {
    id: 'capitulos',
    label: 'Capítulos de libro y ponencias',
    detail:
      'Dialnet indexa artículos de revista y un libro. Capítulos, ponencias e informes quedan fuera del alcance de la fuente y no se han incorporado.',
  },
  {
    id: 'cursos',
    label: 'Cursos y docencia',
    detail:
      'Asignaturas, programas y materiales. Se cargarán solo cursos confirmados, con institución y período.',
  },
  {
    id: 'proyectos',
    label: 'Proyectos de investigación',
    detail:
      'El informe de origen mencionaba proyectos Fondecyt sin identificarlos por código ni año. Sin folio verificable no se publican.',
  },
];
