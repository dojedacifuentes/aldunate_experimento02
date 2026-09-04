/**
 * Sección PUCV del Informe 01.
 *
 * Vive en su propio módulo por una razón editorial, no técnica: es la única
 * sección sometida a una doble revisión declarada —si el juicio es demasiado
 * severo y si es demasiado indulgente—, y el autor del informe figura en una de
 * las fuentes que la sostienen. Separarla obliga a que esa revisión sea visible
 * en lugar de quedar diluida en el resto del texto.
 *
 * Las cifras siguen resolviéndose desde el dataset con `resolverCifras`.
 */

export interface PucvHechoFavorable {
  readonly hecho: string;
  readonly fuente: string;
  readonly fuerza: string;
}

export interface PucvBrecha {
  readonly brecha: string;
  readonly evidencia: string;
  readonly comparador: string;
  /** true cuando la brecha alcanza a toda la cohorte y no distingue a la PUCV. */
  readonly esDeCohorte: boolean;
}

export interface PucvRecomendacion {
  readonly id: string;
  readonly problema: string;
  readonly evidencia: string;
  readonly referente: string;
  readonly accion: string;
  readonly indicador: string;
}

/* ── Evidencia favorable, primero ───────────────────────────────────────────
 * El orden no es neutro. Una sección que empieza por las brechas ya decidió su
 * conclusión antes de exponer los hechos.                                    */

export const pucvFavorable: readonly PucvHechoFavorable[] = [
  {
    hecho:
      'Innova Day acredita cinco versiones consecutivas entre 2022 y 2026. La cuarta, en 2025, publica nueve proyectos en categoría estudiantes y diez en profesionales, con 326 y 809 votantes y participantes de seis países.',
    fuente: 'src-pucv-011 · src-pucv-006',
    fuerza:
      'Es la serie de continuidad más larga de todo el corpus, por encima de cualquier otra institución de la cohorte. El antecedente de 2025 no la registraba, y la verificación de esta versión la sacó a la luz.',
  },
  {
    hecho:
      'ScribeClaroPUCV es una herramienta de inteligencia artificial desplegada y operativa —asistente web de redacción jurídica, sin registro previo, con dirección propia—, dirigida por una profesora de la Escuela de Derecho y concebida para estudiantes de Derecho desde primer año.',
    fuente: 'src-pucv-004',
    fuerza:
      'Es la única herramienta de IA del corpus construida por una Facultad de Derecho para su propia enseñanza y efectivamente en funcionamiento. Ninguna otra institución de la cohorte documenta algo equivalente.',
  },
  {
    hecho:
      'El Programa DIAT integró inteligencia artificial en el curso de Filosofía del Derecho mediante prompting y un chatbot de asignatura, con dos sesiones documentadas como realizadas.',
    fuente: 'src-pucv-003',
    fuerza:
      'Es ejecución dentro de una asignatura jurídica, no una actividad paralela al currículo. En la cohorte hay pocas evidencias de este tipo.',
  },
  {
    hecho:
      'La Facultad y la Escuela de Derecho se adjudicaron fondos concursables de Vinculación con el Medio en dos años consecutivos, 2025 y 2026, con inteligencia artificial explícita en el objeto de los proyectos.',
    fuente: 'src-pucv-010 · src-pucv-006',
    fuerza:
      'Dos adjudicaciones seguidas indican capacidad de formulación sostenida y no una oportunidad aislada.',
  },
  {
    hecho:
      'El Taller de Prompting en IA Generativa se ejecutó en tres sesiones durante septiembre de 2025, con cerca de noventa participantes.',
    fuente: 'src-pucv-005',
    fuerza:
      'Es una de las pocas cifras de participación publicadas en el corpus, y corresponde a una actividad realizada y no anunciada.',
  },
  {
    hecho:
      'El decálogo universitario sobre uso ético de inteligencia artificial en docencia fue liderado por una profesora de la Escuela de Derecho desde la Unidad de Integridad Académica.',
    fuente: 'src-pucv-007',
    fuerza:
      'Acredita participación de Derecho en la gobernanza universitaria de la materia. Es un dato favorable que el informe está obligado a no descontar cuando, más abajo, reclasifica el instrumento como lineamiento.',
  },
  {
    hecho:
      'La Escuela de Derecho organizó en 2026 un workshop internacional sobre gobernanza de inteligencia artificial en el ámbito legal, documentado como realizado.',
    fuente: 'src-pucv-008',
    fuerza: 'Investigación y vinculación con atribución limpia a la unidad jurídica.',
  },
];

/* ── Brechas ────────────────────────────────────────────────────────────── */

export const pucvBrechas: readonly PucvBrecha[] = [
  {
    brecha: 'No hay acto formal de creación del DIAT.',
    evidencia:
      'La única mención localizada a su origen dice que es una «iniciativa que se oficializa en el 2020», sin citar decreto, acuerdo ni resolución. Y la unidad cambia de nombre entre fuentes: Núcleo en 2023, Programa en 2024.',
    comparador:
      'La Universidad Católica publica su Departamento de Derecho y Tecnología en la estructura orgánica de la Facultad, con director identificado. No es una exigencia desmedida: es lo que hace un par comparable.',
    esDeCohorte: false,
  },
  {
    brecha: 'Todo el financiamiento localizado es concursable; ninguno basal.',
    evidencia:
      'Vinculación con el Medio en 2025 y en 2026, y un Fondo de Desarrollo Institucional de 2023 que, al verificarlo, no menciona inteligencia artificial: financia internacionalización con metodología COIL.',
    comparador:
      'Ninguna institución de la cohorte publica presupuesto basal para esta materia, de modo que la brecha no distingue a la PUCV. Lo que sí la caracteriza es que su continuidad depende íntegramente de volver a ganar concursos.',
    esDeCohorte: true,
  },
  {
    brecha: 'No hay política propia de la Escuela ni de la Facultad de Derecho.',
    evidencia:
      'El decálogo es universitario, lo elabora la Unidad de Integridad Académica y, según su propia formulación, «sugiere recomendaciones». No obliga, no tipifica y no establece consecuencia.',
    comparador:
      'La guía de la Facultad de Derecho de la Universidad Católica fue aprobada por su Comité Directivo y su Consejo, impone deberes de declaración y de registro, y califica su incumplimiento como infracción grave sancionable conforme al régimen del plagio.',
    esDeCohorte: false,
  },
  {
    brecha: 'No hay línea curricular.',
    evidencia:
      'La experiencia documentada está acotada a una asignatura, se apoya en una fuente única de 2024, y no publica matrícula, semestre, créditos ni evaluación. No consta que se haya repetido.',
    comparador:
      'Ninguna de las once instituciones acredita una línea curricular obligatoria: la brecha es de cohorte. Pero la PUCV es de las pocas con una experiencia de aula ya ejecutada, y por tanto de las mejor situadas para convertirla en asignatura.',
    esDeCohorte: true,
  },
  {
    brecha: 'No hay evaluación de ningún tipo.',
    evidencia:
      'Ninguna iniciativa de la PUCV publica resultados de aprendizaje, indicadores de uso ni evaluación de la experiencia. ScribeClaroPUCV está operativa y no informa cuántas personas la usan.',
    comparador:
      'Tampoco la tiene ninguna otra Facultad de la cohorte. La única medición de resultado del corpus la produjo una vicerrectoría de transformación digital de otra universidad, sobre toda su comunidad y sin distinguir Derecho.',
    esDeCohorte: true,
  },
  {
    brecha: 'La cifra de participación mide alcance del evento, no cobertura de la Facultad.',
    evidencia:
      'Los cerca de noventa participantes del Taller de Prompting son «estudiantes de derecho de distintas universidades, egresados y profesionales». No son noventa estudiantes de Derecho PUCV.',
    comparador:
      'Es una precisión y no un reproche: la actividad es de vinculación con el medio y su alcance externo es un mérito. Lo que no puede es leerse como penetración interna.',
    esDeCohorte: false,
  },
];

/* ── Lectura ────────────────────────────────────────────────────────────── */

export const pucvLectura: readonly string[] = [
  'La PUCV presenta el perfil más persistente de la cohorte y uno de los menos formalizados. Las dos cosas son ciertas a la vez, y el informe no debería resolver la tensión eligiendo una.',
  'La persistencia está documentada mejor de lo que sugería el antecedente de 2025. Cinco versiones consecutivas de un certamen entre 2022 y 2026, una herramienta de inteligencia artificial construida por la Facultad y en funcionamiento, una experiencia de aula ejecutada dentro de una asignatura jurídica, dos adjudicaciones concursables seguidas con la IA en el objeto, y una profesora de Derecho conduciendo el instrumento de gobernanza de toda la universidad. Ninguna otra institución de las once reúne esa combinación de continuidad y de producto propio.',
  'La formalización es donde la evidencia pública deja a la PUCV por detrás de su comparador más directo. La unidad que sostiene todo eso no publica el acto que la crea, cambia de nombre entre fuentes, depende de fondos que hay que volver a ganar cada año, no ha traducido su experiencia de aula en una asignatura con créditos, y opera bajo un lineamiento universitario que sugiere donde otro obliga.',
  'La formulación que la evidencia sostiene es, entonces, la siguiente: **el desafío de la PUCV no parece ser iniciar actividad —tiene más y más sostenida que la mayoría—, sino demostrar que esa actividad se transformó en capacidad facultativa transversal, estable y evaluable.** Conviene subrayar el verbo. Buena parte de lo que falta puede existir sin estar publicado, y en ese caso el problema no es de capacidad sino de trazabilidad, que es un problema menor y bastante más fácil de resolver.',
];

/** Las dos preguntas de control, con su respuesta. Se publican, no se resuelven en privado. */
export const pucvDobleRevision: readonly { readonly pregunta: string; readonly respuesta: string }[] = [
  {
    pregunta: '¿Es esta sección demasiado severa con la PUCV?',
    respuesta:
      'No lo parece. Reconoce siete hechos favorables verificados uno a uno, tres de ellos sin equivalente en la cohorte —la serie de cinco versiones, la herramienta propia en funcionamiento y la conducción de Derecho en la gobernanza universitaria—. Y de las seis brechas, tres alcanzan también a las otras diez instituciones y así se declaran expresamente en lugar de imputarse a la PUCV.',
  },
  {
    pregunta: '¿Es demasiado indulgente?',
    respuesta:
      'El riesgo existe y se concentra en un punto: la continuidad del DIAT desde 2020 se apoya en una afirmación de la propia institución sin instrumento que la respalde, y este informe la registra como no acreditada en lugar de darla por buena. El segundo punto de riesgo es que el autor del informe figura, en una de las fuentes, como conductor del programa evaluado; por eso ninguna afirmación de esta sección se sostiene en fuente única.',
  },
];

/* ── Recomendaciones de desarrollo institucional ────────────────────────── */

export const pucvRecomendaciones: readonly PucvRecomendacion[] = [
  {
    id: 'R-1',
    problema:
      'La unidad que concentra la actividad en inteligencia artificial no tiene acto de creación publicado, y su denominación varía entre fuentes.',
    evidencia:
      'La única mención a su origen es una afirmación de continuidad desde 2020 sin instrumento citado. Aparece como Núcleo en 2023 y como Programa en 2024.',
    referente:
      'La Facultad de Derecho de la Universidad Católica publica su Departamento de Derecho y Tecnología en la estructura orgánica, con director y dependencia.',
    accion:
      'Publicar el instrumento de creación con denominación estable, dependencia orgánica y responsable, en la página de transparencia de la Facultad.',
    indicador:
      'Documento con número y fecha accesible desde el sitio de la Facultad, y unidad listada en el organigrama publicado.',
  },
  {
    id: 'R-2',
    problema:
      'La continuidad depende de fondos concursables que deben ganarse cada año, sin base de financiamiento declarada.',
    evidencia:
      'Las tres adjudicaciones localizadas son concursables, y una de ellas, verificada, ni siquiera financia inteligencia artificial.',
    referente:
      'Ninguna institución de la cohorte publica financiamiento basal para esta materia: el referente no es aquí un par, sino la propia exigencia de sostenibilidad.',
    accion:
      'Declarar públicamente qué parte de la actividad se sostiene con presupuesto permanente de la Facultad y qué parte depende de concursos.',
    indicador:
      'Línea presupuestaria identificable, o declaración expresa de que no existe. Ambas cosas informan; el silencio no.',
  },
  {
    id: 'R-3',
    problema: 'La experiencia de aula documentada no consta que se haya repetido, ni consta su alcance.',
    evidencia:
      'La integración de IA en Filosofía del Derecho se apoya en una fuente única de 2024, sin matrícula, semestre ni evaluación, y sin prueba pública de continuidad.',
    referente:
      'El Programa de Derecho, Ciencia y Tecnología de la Universidad Católica publica sus graduaciones con número de titulados, año a año.',
    accion:
      'Publicar, para cada experiencia de aula que incorpore inteligencia artificial, la asignatura, el semestre, el número de estudiantes y si se repitió.',
    indicador:
      'Una serie de al menos dos años con cifras publicadas: es exactamente lo que hoy distingue a la única institución con serie temporal del corpus.',
  },
  {
    id: 'R-4',
    problema:
      'La Facultad opera bajo un lineamiento universitario orientador, sin norma propia que rija el uso de estas herramientas en la evaluación jurídica.',
    evidencia:
      'El decálogo es universitario y sugiere recomendaciones. No obliga, no tipifica y no establece consecuencia.',
    referente:
      'La guía de Derecho UC, aprobada por Comité Directivo y Consejo, impone deberes de declaración y registro y califica su incumplimiento como infracción grave.',
    accion:
      'Dictar una norma de Facultad sobre uso de inteligencia artificial generativa en trabajos y evaluaciones, con órgano aprobador identificado.',
    indicador: 'Instrumento aprobado, publicado y fechado, con deberes exigibles y régimen de consecuencias.',
  },
  {
    id: 'R-5',
    problema: 'Existe una herramienta propia en funcionamiento y no se sabe si alguien la usa.',
    evidencia:
      'ScribeClaroPUCV está desplegada y accesible sin registro. No publica número de usuarios, cursos en que se emplea ni resultado alguno.',
    referente:
      'La única cifra de resultado del corpus la produce una vicerrectoría de otra universidad. Ninguna Facultad de la cohorte mide.',
    accion:
      'Instrumentar una medición mínima de uso y de efecto sobre una competencia acotada —por ejemplo, claridad de la redacción en una asignatura concreta—, con grupo de comparación.',
    indicador:
      'Sería la primera iniciativa del corpus en alcanzar el peldaño de evaluación, que hoy está vacío en las once instituciones.',
  },
];
