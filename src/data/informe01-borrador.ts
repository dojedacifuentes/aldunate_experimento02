/**
 * Capa narrativa del Informe 01.
 *
 * Aquí vive la prosa académica del borrador: introducción, objetivos, relato
 * metodológico, estado de la investigación, discusión, conclusiones,
 * limitaciones y agenda. Los datos siguen viviendo en los CSV canónicos.
 *
 * Ningún número se escribe a mano. Los textos llevan marcas `{clave}` que
 * `resolverCifras` sustituye desde el dataset compilado, de modo que la web, el
 * Markdown, el HTML y el PDF no puedan decir cifras distintas, y de modo que
 * una verificación futura que cambie el recuento cambie también la prosa.
 */

export interface Informe01Conclusion {
  readonly id: string;
  readonly titulo: string;
  readonly cuerpo: string;
  /** Afirmaciones del dataset en que se apoya. Sin esto no es conclusión. */
  readonly apoyo: readonly string[];
  readonly clase: 'HECHO' | 'INFERENCIA';
}

export interface Informe01Recomendacion {
  readonly id: string;
  readonly problema: string;
  readonly evidencia: string;
  readonly referente: string;
  readonly accion: string;
  readonly indicador: string;
}

export interface Informe01Pendiente {
  readonly id: string;
  readonly pregunta: string;
  readonly porQue: string;
  readonly comoSeCierra: string;
}

/* ── Cifras interpoladas ────────────────────────────────────────────────────
 * `resolverCifras` recibe el recuento derivado del dataset y devuelve el texto
 * con las marcas sustituidas. Si una marca no tiene valor, falla en voz alta:
 * un informe con `{verificadas}` impreso en el PDF es peor que uno que no
 * compila.                                                                   */

export type Informe01Cifras = Readonly<Record<string, string | number>>;

export function resolverCifras(texto: string, cifras: Informe01Cifras): string {
  return texto.replace(/\{(\w+)\}/g, (_, clave: string) => {
    const directo = cifras[clave];
    if (directo !== undefined) return String(directo);
    // Una marca con inicial mayúscula pide el mismo valor capitalizado. La prosa
    // necesita «doce programas» dentro de la frase y «Doce iniciativas» al
    // abrirla, y duplicar la clave en el recuento dejaría que las dos pudieran
    // decir cosas distintas.
    const valor = cifras[clave.charAt(0).toLowerCase() + clave.slice(1)];
    if (valor === undefined)
      throw new Error(`Informe 01 · la prosa cita {${clave}} y el dataset no lo define`);
    const salida = String(valor);
    return salida.charAt(0).toUpperCase() + salida.slice(1);
  });
}

/* ── 1 · Introducción ───────────────────────────────────────────────────── */

export const informe01Introduccion: readonly string[] = [
  'La incorporación de sistemas de inteligencia artificial a la enseñanza y al ejercicio del Derecho dejó de ser una hipótesis sobre el futuro de la profesión. Es un hecho verificable en programas de formación continua con cohortes graduadas, en departamentos incorporados a organigramas de Facultad, en guías de uso con órgano aprobador y sanción asociada, y en herramientas desplegadas dentro de asignaturas jurídicas. La pregunta pertinente ya no es si las Escuelas de Derecho chilenas están haciendo algo, sino qué han construido exactamente, con qué respaldo formal, con qué alcance y con qué resultados conocidos.',
  'Esa pregunta es difícil de responder porque el material disponible induce a error. La actividad institucional se comunica mediante noticias, y la noticia tiene una gramática propia: anuncia creaciones sin citar el acto que las crea, atribuye a una Facultad lo que pertenece a una vicerrectoría, y describe con el mismo entusiasmo un convenio firmado y un programa en marcha. Un recuento de apariciones en prensa universitaria mide capacidad comunicacional. No mide capacidad institucional.',
  'Este informe adopta por eso una posición metodológica deliberadamente incómoda: sostiene que la unidad de análisis no es la actividad sino la **estructura que la sostiene**, y que la distancia entre ambas es precisamente el objeto de estudio. Una Facultad que dicta tres seminarios al año y una que integró la materia a su organigrama, a su régimen disciplinario y a su oferta permanente no están en el mismo punto, aunque produzcan el mismo número de titulares.',
  'La relevancia de la pregunta para una Escuela de Derecho no es tecnológica sino formativa y normativa. Formativa, porque la competencia profesional que se enseña —leer, investigar, redactar, argumentar— es exactamente aquella sobre la que estos sistemas operan, de modo que la decisión sobre su uso no puede delegarse en la infraestructura informática de la universidad. Normativa, porque una Facultad que regula el uso de estas herramientas en la evaluación está dictando derecho disciplinario sobre su propia comunidad, y la calidad de ese instrumento es un problema jurídico antes que técnico.',
  'La pregunta de investigación es, en consecuencia: **qué capacidades institucionales públicamente verificables han construido once Escuelas y Facultades de Derecho chilenas en materia de inteligencia artificial, con qué grado de formalización, y qué puede y no puede afirmarse sobre ellas a partir de evidencia pública.**',
  'El alcance está acotado por construcción y conviene decirlo antes que después. El estudio observa una cohorte cerrada de once instituciones, se limita a evidencia públicamente accesible al {corte}, y no evalúa desempeño, calidad ni resultados de aprendizaje. Lo que no aparece publicado queda fuera, y esa ausencia no equivale a inexistencia: significa que este método no puede verla.',
];

/* ── 2 · Objetivos ──────────────────────────────────────────────────────── */

export const informe01ObjetivoGeneral =
  'Establecer, sobre evidencia pública verificable y trazable, qué capacidades institucionales en materia de inteligencia artificial existen en once Escuelas y Facultades de Derecho chilenas al {corte}, distinguiendo actividad de estructura y estructura de resultado.';

export const informe01ObjetivosEspecificos: readonly string[] = [
  'Construir un registro de fuentes públicas únicas, con identificador estable, fecha declarada y estado editorial, que permita recorrer cualquier afirmación del informe hacia atrás hasta el documento que la sostiene.',
  'Deducir de ese registro un catálogo de iniciativas deduplicadas, cada una atribuida a la unidad que la fuente identifica, clasificada por dirección de la relación entre IA y Derecho y situada en una escala de institucionalización.',
  'Contrastar cada fuente prioritaria contra la publicación original, para determinar si el registro dice lo que la página dice, y dejar constancia de las divergencias.',
  'Medir la cobertura alcanzada por la investigación en cada institución como indicador independiente de la madurez observada, de modo que la desigualdad del trabajo de campo no se lea como desigualdad de las universidades.',
  'Formular las afirmaciones sostenibles con su clasificación epistemológica, su contraevidencia y sus límites, y registrar como pendiente lo que la evidencia disponible no permite decidir.',
  'Situar a la Pontificia Universidad Católica de Valparaíso frente a instituciones comparables, reconociendo la evidencia favorable localizada y las brechas que la evidencia pública deja al descubierto.',
];

/* ── 3 · Metodología ────────────────────────────────────────────────────── */

export const informe01MetodologiaRelato: readonly {
  readonly titulo: string;
  readonly parrafos: readonly string[];
}[] = [
  {
    titulo: 'La cohorte y por qué está cerrada',
    parrafos: [
      'El estudio observa {universidades} instituciones bajo el identificador `COHORTE_IA_DERECHO_CHILE_11_V1`. La selección no es probabilística y no pretende representar al sistema universitario chileno: reproduce la cohorte de un antecedente de 2025 para conservar comparabilidad longitudinal. Toda afirmación del informe se refiere a esas once y a ninguna más, y el documento evita sistemáticamente la expresión «las universidades chilenas» cuando el universo analizado es esta cohorte.',
      'Cerrarla tiene un costo y una razón. El costo es que una institución relevante fuera de la lista no entra al comparador aunque su actividad sea notable. La razón es que un universo que crece a medida que se investiga vuelve inservible cualquier comparación temporal: lo que parecería aumento de actividad sería aumento de la búsqueda. Una institución externa pertinente se registra como candidata fuera de cohorte y su incorporación exigiría una versión nueva del protocolo, no una decisión de redacción.',
    ],
  },
  {
    titulo: 'Qué cuenta como evidencia',
    parrafos: [
      'Sólo entra al registro material públicamente accesible con URL propia. La jerarquía va de resoluciones y políticas oficiales hasta la prensa externa, y la confianza documental de cada fuente se asigna por su tipo, no por lo interesante que resulte su contenido. Un resultado de buscador, una síntesis generada por un modelo de lenguaje o la conclusión de otra investigación no son fuentes: son pistas para localizar una.',
      'El corpus contiene {fuentes} fuentes públicas únicas. Cinco documentos de investigación previa, producidos por modelos distintos en rondas independientes, sirvieron para localizarlas; ninguno de ellos es citado como evidencia. Su función fue señalar dónde mirar, y su contenido narrativo quedó fuera del dataset.',
      'Cuando una fuente declara solamente el año, se conserva esa precisión. Cuando no declara fecha alguna, se registra como no declarada y se conserva la fecha de consulta. La verificación de esta versión encontró dos registros que asignaban fechas ausentes de la página y las retiró.',
    ],
  },
  {
    titulo: 'De la fuente a la conclusión',
    parrafos: [
      'La cadena es fuente → evidencia → iniciativa → afirmación → conclusión, y ningún eslabón sustituye al anterior. Una fuente puede sostener varias evidencias y varias fuentes pueden sostener una; una iniciativa respaldada por cuatro documentos sigue siendo una iniciativa. El control de doble conteo es explícito: antes de crear un registro nuevo se comprueba si el hecho ya está representado, y una noticia de lanzamiento, su seminario inaugural, el convenio asociado y la página del laboratorio son cuatro fuentes de un mismo objeto.',
      'El resultado son {iniciativas} iniciativas deduplicadas sostenidas por {evidencias} evidencias, de las cuales se derivan {afirmaciones} afirmaciones. Cada afirmación se publica con su razonamiento, su contraevidencia cuando existe, sus límites y su confianza, y se clasifica como hecho, señal, inferencia o pendiente. Ninguna se publica sin que el lector pueda deshacer el camino.',
    ],
  },
  {
    titulo: 'Atribución: universidad no es Facultad',
    parrafos: [
      'Cada iniciativa se atribuye a la unidad que la fuente identifica, y no a la que resultaría más favorable. Una licencia institucional disponible para toda la comunidad universitaria no es adopción de Derecho; un centro alojado en una dirección de incubación no es un laboratorio de la Facultad; una actividad organizada por un centro de estudiantes no es una actividad de la Facultad.',
      'La regla no es formalismo. Es la única manera de que la comparación entre instituciones signifique algo: sin ella, la universidad con mejor infraestructura informática aparecería como la Facultad de Derecho más avanzada. La verificación de esta versión reatribuyó dos registros por esta causa y confirmó que {universitarios} corresponden a capacidades de la universidad y no de la unidad jurídica.',
    ],
  },
  {
    titulo: 'IA y tecnología adyacente',
    parrafos: [
      'Cada iniciativa recibe una etiqueta de dirección: uso de IA en el Derecho, aplicación del Derecho a la IA, ambas, o adyacente. La categoría adyacente recoge lo que trata de innovación legal, transformación digital, protección de datos o ciberseguridad sin que la inteligencia artificial sea un componente central verificable.',
      'La distinción es la que más presión recibe, porque la etiqueta adyacente reduce el tamaño aparente del fenómeno. El criterio aplicado es literal: si la fuente no menciona inteligencia artificial, la iniciativa que sostiene no puede elevar la madurez en inteligencia artificial. La verificación encontró dos fuentes que sostenían tesis sobre capacidad en IA sin nombrarla una sola vez.',
    ],
  },
  {
    titulo: 'La escalera de institucionalización',
    parrafos: [
      'Cada iniciativa se sitúa en una escala de cinco peldaños: sin evidencia pública localizada, exploración, operación, institucionalización y evaluación. El nivel de institucionalización exige al menos una señal formal —responsable identificado, continuidad documentada, política, recursos o integración curricular— y la acumulación de eventos no lo produce por sí sola. El nivel de evaluación exige productos o resultados públicamente revisables, no continuidad.',
      'La escala se aplica a la iniciativa y nunca a la universidad, y no se promedia ni se suma. Un promedio institucional convertiría en un número lo que el informe existe para conservar: la diferencia entre una Facultad con muchas actividades poco formalizadas y otra con pocas actividades incorporadas a su estructura.',
    ],
  },
  {
    titulo: 'Verificación sustantiva',
    parrafos: [
      'Que una URL responda no prueba que diga lo que se le atribuye. La verificación sustantiva consiste en abrir la publicación original y contrastar siete campos contra el registro: existencia y título literal, fecha declarada, unidad responsable, condición de anuncio o de ejecución, cifras de población o cobertura, límites del documento, y respaldo efectivo de la afirmación que sostiene.',
      'En esta versión se verificaron {verificadas} de las {fuentes} fuentes del corpus, esto es un {porcentajeVerificado}%. La selección no fue aleatoria: se priorizaron las que sostienen afirmaciones con número explícito —«cuatro Facultades», «una sola política», «nueve registros», «cinco iniciativas»—, las que respaldan iniciativas situadas en el peldaño de institucionalización, y las que el registro marcaba como problemáticas. Son las afirmaciones que un lector puede refutar contando, y por eso son las primeras que deben resistir.',
      'Las fuentes verificadas pasan al estado contrastado, que en el protocolo significa que una segunda revisión examinó atribución, alcance y contraevidencia. **Contrastado no es aceptado.** La aceptación exige decisión humana registrada y ningún registro de este borrador la tiene, de modo que el documento no se presenta como informe de resultados.',
    ],
  },
  {
    titulo: 'Cobertura como indicador separado',
    parrafos: [
      'Para cada institución se recorren las mismas trece rutas del protocolo, y se registra cuántas se completaron. La cobertura se publica aparte de la madurez porque miden cosas distintas: una es el trabajo hecho por quien investiga y la otra el trabajo hecho por la institución.',
      'La asimetría es grande y está medida: la cobertura en fuentes es {razonCobertura} veces mayor en las tres instituciones del piloto de profundidad que en las ocho restantes. Mientras esa desproporción exista, ninguna comparación ordinal es publicable, porque ordenaría el esfuerzo de investigación y no la capacidad institucional.',
      'La verificación aportó una comprobación empírica de ese sesgo, y en la dirección menos cómoda: al abrir la fuente que sostenía el programa de una institución fuera del piloto, resultó que el registro la había clasificado por el segmento de su URL y subestimaba su actividad, que estaba fechada y documentada. El sesgo de cobertura no sólo infla a los observados: deprime a los no observados.',
    ],
  },
  {
    titulo: 'Ausencia frente a inexistencia',
    parrafos: [
      'No se asigna el nivel cero antes de completar el protocolo de búsqueda, y la formulación admitida es que no se localizó evidencia pública verificable, nunca que la actividad no existe. La distinción se aplica también a las afirmaciones de cohorte: cuando una ausencia se registra, alcanza a las once instituciones y no sólo a aquellas donde se buscó con más detalle.',
      'La consecuencia práctica es que este informe no puede sostener que una Facultad no hace nada. Sólo puede sostener que, recorridas las mismas rutas, no publicó evidencia de hacerlo.',
    ],
  },
  {
    titulo: 'Relación con el antecedente de 2025',
    parrafos: [
      'Existe un informe anterior sobre la misma cohorte con una metodología distinta, que puntuaba sobre una escala de quince puntos en cinco dimensiones. Ese documento se trata como antecedente y no como fuente vigente: sus puntajes no se arrastran, sus cifras no se comparan aritméticamente con la escala de cinco peldaños de este informe, y sus errores se corrigen mediante fe de erratas y no en silencio.',
      'No existe todavía una línea base congelada de 2025, porque el documento antecedente contiene actividades fechadas en 2026. Mientras eso no se resuelva, ninguna afirmación de la forma «tal capacidad aumentó desde 2025» es publicable, y la trayectoria temporal de la mayoría de las iniciativas queda registrada como desconocida.',
    ],
  },
  {
    titulo: 'Qué cambió en la metodología, y por qué',
    parrafos: [
      'La versión anterior comparaba **dimensiones**: ocho ámbitos académicos donde una iniciativa puede ocurrir. Como instrumento de inventario funcionaba; como instrumento comparativo tenía tres defectos que su propia publicación dejó a la vista, y esta versión los corrige sin retirar nada de lo anterior.',
      'El primero es de validez de constructo. Dos de las ocho dimensiones —recursos y capacidades, y continuidad, cobertura y resultados— no son ámbitos donde algo ocurra, sino **atributos** que cualquier iniciativa puede tener. Como el registro obliga a elegir una dimensión primaria, ninguna iniciativa cae nunca ahí: el diplomado con dos cohortes graduadas se clasifica en formación continua y su continuidad, que es precisamente el dato, queda invisible. La doble columna vacía de la versión anterior es, en parte, un artefacto del modelo y no sólo un hallazgo sobre las Facultades.',
      'El segundo es de lectura. La intensidad de una celda indicaba cuánta evidencia se había localizado, y como el trabajo de campo es {razonCobertura} veces más profundo en tres instituciones, una fila más poblada señalaba dónde se había buscado más. La versión anterior lo advertía con un aviso al pie. Un aviso no corrige una lectura visual.',
      'El tercero es de utilidad comparativa. Un diplomado, una guía ética y un seminario contaban como una iniciativa cada uno, y sumarlos produce un recuento sin significado institucional. La pregunta que un lector con responsabilidad de gestión se hace no es cuántas iniciativas tiene cada Facultad, sino qué instrumentos ha puesto en pie.',
      'La enmienda añade dos ejes y no recodifica ningún registro. El primero es el **mecanismo**: qué clase de instrumento institucional es cada iniciativa —unidad, norma, programa formativo, asignatura, herramienta, proyecto, actividad, convenio o publicación—. Es una clasificación de lo que el registro ya contenía en su nombre, su unidad responsable y sus productos, de modo que no aporta evidencia nueva y no reabre la verificación de ninguna fuente. El segundo son las **{capacidadesPalabra} capacidades**, cada una derivada por una regla mecánica sobre campos ya verificados, y cada una con la pregunta que responde escrita al lado.',
      'La regla que hace el trabajo de fondo es de una línea: **una ausencia sólo informa si se recorrió la ruta del protocolo que la habría encontrado**. Cada capacidad declara qué rutas de las trece la acreditarían; si no hay evidencia y esas rutas se recorrieron, la celda dice que la capacidad no se localizó, y si no se recorrieron, dice que la celda no es concluyente. Así la desigualdad de cobertura deja de ser una advertencia al pie y pasa a estar dentro de cada celda, que es donde el lector la necesita. De las {celdas} celdas de la matriz, {celdasNoConcluyente} son de esa segunda clase.',
      'Un primer diseño de esta escala metía la verificación dentro del estado: una capacidad con fuente contrastada valía más que la misma capacidad sin contrastar. El efecto era premiar a la institución con mayor proporción de fuentes verificadas —la PUCV, con el 86 %— por una propiedad del trabajo de campo, que es el mismo error de la matriz anterior con otra ropa. La verificación viaja por eso aparte del estado, como una marca que no lo modifica.',
      '**Análisis de sensibilidad.** Sustituir un instrumento por otro obliga a preguntar si las conclusiones cambian porque hay evidencia nueva o porque cambió la forma de medir. Aquí no hay evidencia nueva: el corpus es el mismo de la versión anterior, con las mismas {fuentes} fuentes y las mismas {iniciativas} iniciativas. De las siete conclusiones publicadas, cinco se sostienen sin variación. Las otras dos se matizan, y en las dos el matiz es más restrictivo que la versión previa: la ausencia de evaluación de efecto sigue siendo un hecho firme sobre el corpus, pero como afirmación sobre cada Facultad queda abierta en {evaluacionSinConcluirPalabra} de las once, porque la ruta que la acreditaría no se recorrió; y la ausencia de línea curricular obligatoria queda igualmente abierta en {pregradoSinConcluirPalabra}. Ninguna conclusión se hizo más fuerte por efecto del cambio de método, y ésa era la comprobación que importaba.',
      'La metodología 2.0 se conserva íntegra, su matriz se publica en anexo y ninguno de sus vocabularios se ha modificado. Una versión nueva del protocolo no autoriza a hacer desaparecer la anterior: quien leyó el documento de septiembre debe poder reencontrar lo que leyó y comprobar por sí mismo qué cambió.',
    ],
  },
];

/* ── Declaración de intereses ───────────────────────────────────────────── */

export const informe01Intereses: readonly string[] = [
  'Una de las fuentes del corpus identifica como conductores del Programa de Derecho, Inteligencia Artificial y Tecnología de la PUCV a Johann Benfeld, **Eduardo Aldunate** y **Diego Ojeda**. El destinatario de este borrador y su autor figuran, por tanto, en una iniciativa que el informe evalúa.',
  'La declaración no resuelve el conflicto: lo hace visible. Las medidas adoptadas son tres. Las fuentes que involucran al autor permanecen en el corpus y no se retiran. La sección dedicada a la PUCV se somete a una doble revisión explícita —si el juicio resulta demasiado severo y si resulta demasiado indulgente— cuyo resultado se publica. Y ninguna afirmación sobre la PUCV se sostiene en una fuente única.',
  'El lector debe saber además que este informe se produjo con asistencia de sistemas de inteligencia artificial en la localización de fuentes, en el contraste de cada publicación original contra su registro y en la redacción. La responsabilidad editorial es humana y está firmada; el protocolo que rige esa asistencia, los estados por los que pasa cada registro y el punto exacto en que se exige decisión humana están publicados junto con los datos.',
];

/* ── 4 · Discusión ──────────────────────────────────────────────────────── */

export const informe01Discusion: readonly {
  readonly titulo: string;
  readonly parrafos: readonly string[];
}[] = [
  {
    titulo: 'La estructura se anuncia más rápido de lo que se constituye',
    parrafos: [
      'El hallazgo más consistente del corpus es que entre 2025 y 2026 cuatro Facultades de Derecho crearon unidades dedicadas a tecnología o inteligencia artificial. Es un cambio de naturaleza respecto de la sucesión de seminarios que caracterizaba el fenómeno: nombrar una estructura compromete a la institución de un modo que organizar un evento no compromete.',
      'La verificación, sin embargo, encontró que de esas cuatro creaciones **en ninguna se localizó el acto que la constituye**. No hay decreto, acuerdo de consejo ni resolución citada en ninguna de las fuentes que las anuncian. Conviene mantener la formulación en su registro exacto: dos de esas cuatro instituciones están fuera del piloto de profundidad, de modo que la ausencia mide también dónde se buscó. Lo que existe en un caso —y sólo en uno— es respaldo orgánico: la estructura publicada de la Facultad de Derecho de la Universidad Católica lista el Departamento de Derecho y Tecnología entre sus once departamentos, con director identificado. Un organigrama es evidencia más fuerte que una noticia de creación, porque el organigrama tiene que sostenerse en el tiempo.',
      'En el extremo opuesto, la unidad de la Universidad Diego Portales se acredita mediante el nombramiento de su director y una hoja de ruta: talleres y un curso por implementar, sin nombre de asignatura, semestre, créditos ni matrícula. Entre el organigrama y el nombramiento hay una distancia institucional considerable, y el recuento de «cuatro Facultades» la oculta si no se explicita.',
      'La conclusión que el corpus admite es más precisa que la que el titular sugiere: la institucionalización está ocurriendo por **denominación** antes que por **constitución**. Nombrar una unidad es un acto real y tiene efectos, pero no es lo mismo que dotarla.',
    ],
  },
  {
    titulo: 'La norma disciplinaria es donde más lejos ha llegado una Facultad',
    parrafos: [
      'De los tres instrumentos normativos del corpus, dos son universitarios: los lineamientos de la Universidad de Chile los dictan dos vicerrectorías y no mencionan Derecho, y el decálogo de la PUCV lo elabora una unidad de integridad académica y, según su propia formulación, «sugiere recomendaciones».',
      'El tercero es de otra clase. La guía de la Facultad de Derecho de la Universidad Católica fue aprobada por su Comité Directivo y por su Consejo, obliga a declarar herramienta y propósito, exige conservar registros, y establece que su incumplimiento constituye infracción grave a los deberes de probidad académica, sancionable conforme al régimen del plagio. Es el único documento del corpus con órgano aprobador identificado y consecuencia jurídica asociada.',
      'Merece atención un matiz que la propia guía introduce y que ninguna lectura optimista debería omitir: el profesor conserva la facultad de determinar libremente los usos permitidos en su curso. El instrumento fija un piso de transparencia y descentraliza la regulación sustantiva. Eso puede ser prudencia pedagógica o puede ser una forma de no decidir; la evidencia pública no permite distinguirlo, y determinarlo exigiría examinar programas de curso.',
      'La observación general es que las Facultades de Derecho han avanzado más en regular el uso de estas herramientas que en enseñarlas. Tiene sentido disciplinar: la infracción académica es un problema que una Facultad sabe tratar, y el diseño curricular es un problema que exige acuerdos más amplios.',
    ],
  },
  {
    titulo: 'La formación continua funciona; el pregrado no aparece',
    parrafos: [
      'La formación continua es el único eje del corpus con serie temporal documentada, y la serie es de una sola institución. El Programa de Derecho, Ciencia y Tecnología de la Universidad Católica publica dos graduaciones consecutivas —más de noventa titulados en 2024 y más de cien en 2025—, en ambos casos incluyendo un diplomado específicamente de Derecho e Inteligencia Artificial, dictado a través de la educación continua de la Facultad. Es la única evidencia del corpus que acredita a la vez continuidad, cifras y atribución a Derecho.',
      'La verificación deshizo aquí una atribución errónea que el registro arrastraba. El diploma equivalente de la Universidad de Chile figura como cerrado desde 2022, y la edición anunciada para 2026 se publica bajo un centro distinto del que lo dictaba, con la advertencia expresa de que sus datos son referenciales y de que puede suspenderse si no se alcanza un mínimo de estudiantes. Entre ambas fechas no hay edición localizada. Eso no es una serie: es una discontinuidad con reapertura anunciada.',
      'El contraste con el pregrado es el dato más incómodo del informe. **En ninguna de las once instituciones se localizó una línea curricular obligatoria en inteligencia artificial con syllabus, semestre, créditos y matrícula.** Lo que hay son talleres —«Talleres de Herramientas Digitales e Inteligencia Artificial en Derecho» en una malla que se presenta como orientada al futuro—, experiencias acotadas a una asignatura, y compromisos de integración enunciados sin cronograma.',
      'La asimetría admite una lectura que no es acusatoria. La formación continua puede innovar porque su ciclo de decisión es corto, su público es voluntario y su financiamiento es directo. El pregrado exige modificar planes de estudio, y ese es un procedimiento lento en cualquier Facultad de Derecho del mundo. Que la innovación se aloje primero donde el procedimiento lo permite es esperable. Que a mediados de 2026 siga sin haber una sola línea obligatoria publicada en once instituciones es, de todos modos, un dato sobre el ritmo.',
    ],
  },
  {
    titulo: 'La única medición de efecto del corpus no es jurídica',
    parrafos: [
      'Ninguna de las {iniciativas} iniciativas registradas alcanza el peldaño de evaluación. Es la tercera ronda independiente de investigación que llega a la misma ausencia, y la verificación sustantiva de esta versión no la modificó.',
      'Sí encontró, en cambio, algo que el informe está obligado a discutir en lugar de refugiarse en la redacción afortunada de su propia afirmación. Una universidad de la cohorte publica, sobre su ecosistema de asistentes basados en IA, un veinte por ciento más de aprobación entre los estudiantes que lo usaron más de treinta veces, sobre más de quince mil estudiantes y cuatrocientas cincuenta mil interacciones. Es la única cifra de resultado en las {fuentes} fuentes del corpus.',
      'No mueve la afirmación, por dos razones. La primera es de alcance: la medición es universitaria y no jurídica, y la afirmación se refiere a efecto sobre el aprendizaje del Derecho. La segunda es de diseño: comparar a quien usó una herramienta treinta veces con quien no la usó mide, entre otras cosas, la diferencia entre ambos grupos antes de la herramienta. Sin diseño, muestra y control declarados, la cifra es correlacional.',
      'Lo que sí revela es una asimetría de capacidades que debería inquietar a una Escuela de Derecho: **lo más parecido a una evaluación de efecto que existe en este corpus lo produjo una vicerrectoría de transformación digital.** Las Facultades han incorporado la inteligencia artificial como contenido de enseñanza y como objeto de regulación, pero todavía no como objeto de medición educativa. La capacidad de evaluar el aprendizaje mediado por estas herramientas está, por ahora, fuera de ellas.',
    ],
  },
  {
    titulo: 'El problema de atribución no es un tecnicismo',
    parrafos: [
      '{universitarios} registros del corpus corresponden a capacidades de la universidad y no de la Facultad de Derecho: licencias corporativas de asistentes generativos, plataformas de búsqueda bibliográfica con asistente incorporado, oficinas centrales de inteligencia artificial, agentes docentes en fase piloto, programas transversales liderados desde vicerrectorías.',
      'Ninguno de esos registros es despreciable, y sería un error metodológico descontarlos: constituyen el entorno en que una Facultad opera y, en varios casos, la condición material de que pueda hacer algo. Pero atribuirlos a Derecho produciría una imagen falsa. Entre «la universidad habilitó un asistente generativo para toda su comunidad» y «los estudiantes de Derecho lo usan en tareas jurídicas bajo criterios definidos por su Facultad» hay exactamente el problema que este informe intenta medir.',
      'La distancia es medible en principio y no lo es en la práctica, porque las universidades publican la disponibilidad y no el uso. Ninguna de las fuentes del corpus informa cuántos estudiantes de Derecho utilizan las herramientas institucionales, en qué tareas ni con qué resultados. Esa es la laguna que separa este mapeo de un informe de adopción.',
    ],
  },
  {
    titulo: 'Lo que el método no puede ver',
    parrafos: [
      'Ninguna de las {fuentes} fuentes del corpus proviene de contraste externo: todas son institucionales o bases oficiales. La ruta del protocolo destinada a fuentes de terceros está sin recorrer en las once instituciones. Un corpus construido enteramente con la comunicación de las propias instituciones observadas hereda su selectividad, y este informe no tiene manera de saber qué omitieron.',
      'Dos de las ocho dimensiones del protocolo —recursos y capacidades, y continuidad, cobertura y resultados— no reúnen una sola evidencia en toda la cohorte. No es que las instituciones carezcan de presupuesto o de dotación: es que no los publican. Una investigación basada en evidencia pública no puede pronunciarse sobre lo que sistemáticamente no se publica, y debería resistir la tentación de inferirlo.',
      'Conviene enunciar el límite en su forma más fuerte, porque es el que más afecta a las conclusiones. Este informe mide **lo que once Facultades de Derecho han decidido hacer público sobre su relación con la inteligencia artificial.** Que eso se aproxime a lo que efectivamente hacen es una hipótesis razonable, no un hallazgo.',
    ],
  },
];

/* ── 5 · Conclusiones ───────────────────────────────────────────────────── */

export const informe01Conclusiones: readonly Informe01Conclusion[] = [
  {
    id: 'C-1',
    titulo: 'La institucionalización avanza por denominación, no por constitución',
    cuerpo:
      'Cuatro Facultades de Derecho crearon entre 2025 y 2026 unidades dedicadas a tecnología o inteligencia artificial, y en ninguna de las cuatro se localizó el acto formal que la constituye. Sólo una tiene respaldo orgánico publicado: figura en la estructura de la Facultad, con director identificado. Las otras tres se acreditan mediante noticias de creación y nombramientos. La afirmación registra lo que no fue localizado recorriendo el protocolo, no que los actos no existan: dos de las cuatro instituciones están fuera del piloto de profundidad.',
    apoyo: ['clm-cohorte-002'],
    clase: 'HECHO',
  },
  {
    id: 'C-2',
    titulo: 'Del corpus, una sola Facultad dictó una norma propia con consecuencia jurídica',
    cuerpo:
      'De los tres instrumentos sobre uso de inteligencia artificial localizados, dos son universitarios y de carácter orientador. El tercero fue aprobado por los órganos de una Facultad de Derecho, impone deberes de declaración y registro, y califica su incumplimiento como infracción grave sancionable conforme al régimen del plagio. La regulación del uso ha avanzado más que la enseñanza del uso.',
    apoyo: ['clm-cohorte-003'],
    clase: 'HECHO',
  },
  {
    id: 'C-3',
    titulo: 'La continuidad documentada existe en un solo eje y en una sola institución',
    cuerpo:
      'La formación continua es el único eje con serie temporal, y la serie consiste en dos graduaciones consecutivas de una misma institución, con más de noventa y más de cien titulados, incluyendo un diplomado específicamente de Derecho e Inteligencia Artificial. El programa equivalente de otra institución de la cohorte figura cerrado desde 2022, con una reapertura anunciada para 2026 bajo otra unidad y declarada referencial por la propia página.',
    apoyo: ['clm-cohorte-005'],
    clase: 'HECHO',
  },
  {
    id: 'C-4',
    titulo: 'No hay línea curricular obligatoria documentada en ninguna de las once',
    cuerpo:
      'No se localizó en ninguna institución de la cohorte evidencia pública de una asignatura obligatoria en inteligencia artificial con syllabus, semestre, créditos y matrícula. Lo que existe son talleres, electivos y experiencias acotadas a una asignatura. La afirmación registra una ausencia de evidencia pública y no una inexistencia: puede existir integración curricular no publicada.',
    apoyo: ['clm-cohorte-006'],
    clase: 'HECHO',
  },
  {
    id: 'C-5',
    titulo: 'Ninguna iniciativa acredita evaluación de efecto sobre el aprendizaje jurídico',
    cuerpo:
      'Ninguna de las {iniciativas} iniciativas alcanza el peldaño de evaluación de la escala. La única medición de resultado del corpus la publica una vicerrectoría de transformación digital sobre el conjunto de su universidad, es correlacional y no distingue estudiantes de Derecho. La capacidad de medir el aprendizaje mediado por estas herramientas está hoy fuera de las Facultades.',
    apoyo: ['clm-cohorte-001'],
    clase: 'HECHO',
  },
  {
    id: 'C-6',
    titulo: 'La cobertura desigual impide toda comparación ordinal',
    cuerpo:
      'La investigación alcanzó una cobertura {razonCobertura} veces mayor en tres instituciones que en las ocho restantes. Cualquier ordenamiento construido sobre esa base mediría el trabajo de campo. La verificación sustantiva confirmó el sesgo en su forma menos evidente: al abrir las fuentes de una institución fuera del piloto, el registro la subestimaba.',
    apoyo: ['clm-metodo-001'],
    clase: 'HECHO',
  },
  {
    id: 'C-7',
    titulo: 'El fenómeno está en tránsito de la actividad a la estructura, sin llegar al resultado',
    cuerpo:
      'La distribución de las {iniciativas} iniciativas en la escalera describe un campo a medio camino, no uno que ya cambió de fase: {escalon1} siguen siendo actividades aisladas o anuncios, {escalon2} acreditan operación recurrente, {escalon3} alcanzan alguna señal de institucionalización, y {evaluadas} llegan a evaluación. La secuencia actividad → operación → institucionalización → evaluación está poblada en sus tres primeros tramos y vacía en el cuarto, y lo está en las once instituciones a la vez. Que la ausencia sea simultánea sugiere una causa común —el costo de medir aprendizaje— antes que una diferencia de mérito entre Facultades, aunque la evidencia disponible no permite distinguir entre ambas explicaciones.',
    apoyo: ['clm-cohorte-001', 'clm-cohorte-002', 'clm-cohorte-006'],
    clase: 'INFERENCIA',
  },
];

/* ── 6 · Limitaciones ───────────────────────────────────────────────────── */

export const informe01Limitaciones: readonly string[] = [
  '**La verificación está incompleta.** Se contrastaron {verificadas} de {fuentes} fuentes, un {porcentajeVerificado}% del corpus. Las {noVerificadas} restantes conservan el contenido que les asignó la investigación previa, y la experiencia de esta tanda es que aproximadamente uno de cada tres registros contenía alguna divergencia con su fuente. Es razonable esperar correcciones adicionales.',
  '**El corpus no tiene contraste externo.** Ninguna fuente proviene de terceros: todas son institucionales o bases oficiales. El informe hereda la selectividad comunicacional de las instituciones que observa.',
  '**La cobertura es desigual por diseño.** Tres instituciones recibieron un piloto de profundidad y ocho no. Ninguna comparación ordinal es publicable, y las diferencias observadas entre instituciones son en parte diferencias de observación.',
  '**No existe línea base congelada de 2025.** El documento antecedente contiene actividades fechadas en 2026, de modo que ninguna afirmación de crecimiento temporal es sostenible y la trayectoria de la mayoría de las iniciativas queda como desconocida.',
  '**Dos dimensiones del protocolo están vacías.** Recursos y capacidades, y continuidad, cobertura y resultados, no reúnen evidencia en ninguna institución. El informe no puede pronunciarse sobre financiamiento, dotación ni sostenibilidad.',
  '**Falta el acto formal de casi todas las unidades.** De las estructuras creadas entre 2025 y 2026, sólo una tiene respaldo orgánico publicado. El informe distingue creación anunciada de creación acreditada, pero no puede resolver la diferencia con las fuentes disponibles.',
  '**La ausencia de evidencia pública no es inexistencia.** Toda afirmación negativa de este informe se refiere a lo que no fue localizado recorriendo un protocolo definido, no a lo que no ocurre.',
  '**El autor y el destinatario participan de una iniciativa evaluada.** Ver la declaración de intereses. Ninguna afirmación sobre la PUCV se sostiene en fuente única, y la sección correspondiente publica su doble revisión.',
];

/* ── 7 · Agenda de investigación ────────────────────────────────────────── */

export const informe01Agenda: readonly Informe01Pendiente[] = [
  {
    id: 'A-1',
    pregunta: '¿Cuál es el acto formal que crea cada una de las unidades anunciadas entre 2025 y 2026?',
    porQue:
      'Es la diferencia entre institucionalización anunciada y acreditada, y afecta a la conclusión C-1, que es la principal del informe.',
    comoSeCierra:
      'Solicitud de decreto, acuerdo de consejo o resolución a cada Facultad, o localización en sus repositorios de transparencia. Cuatro documentos cierran la pregunta.',
  },
  {
    id: 'A-2',
    pregunta: '¿Existe alguna asignatura obligatoria de IA en las mallas vigentes de las once?',
    porQue:
      'La conclusión C-4 registra una ausencia de evidencia pública. Convertirla en afirmación sobre el currículo exige examinar los planes de estudio y no las páginas de presentación.',
    comoSeCierra:
      'Revisión de las once mallas curriculares vigentes y de los programas de las asignaturas que nombren tecnología, innovación o inteligencia artificial, verificando obligatoriedad, semestre, créditos y matrícula.',
  },
  {
    id: 'A-3',
    pregunta: '¿Qué mide realmente la única cifra de resultado del corpus?',
    porQue:
      'Es el único dato de efecto disponible y su diseño no está publicado. Sin ficha metodológica no es citable ni siquiera fuera del ámbito jurídico.',
    comoSeCierra:
      'Obtención del diseño, la muestra, el grupo de control y el instrumento de medición, o registro definitivo como señal no verificable.',
  },
  {
    id: 'A-4',
    pregunta: '¿Cuántos estudiantes de Derecho usan efectivamente las herramientas institucionales?',
    porQue:
      'Es la distancia entre disponibilidad y adopción, que este informe identifica como su laguna central y no puede medir con fuentes públicas.',
    comoSeCierra:
      'Datos de uso desagregados por unidad académica, que hoy ninguna universidad de la cohorte publica. Exige solicitud institucional.',
  },
  {
    id: 'A-5',
    pregunta: '¿Qué dirían fuentes externas a las propias instituciones?',
    porQue:
      'El corpus carece por completo de contraste externo, y esa es la limitación estructural del método.',
    comoSeCierra:
      'Recorrido de la ruta trece del protocolo en las once instituciones: prensa no universitaria, bases de proyectos financiados, registros de propiedad intelectual y repositorios de terceros.',
  },
  {
    id: 'A-6',
    pregunta: '¿Puede reconstruirse una línea base congelada al 31-12-2025?',
    porQue:
      'Sin ella no hay comparación temporal posible y el informe no puede afirmar que nada haya aumentado ni disminuido.',
    comoSeCierra:
      'Decisión humana sobre qué se considera público al cierre de 2025 en un documento antecedente que ya fue editado retrospectivamente. No es automatizable.',
  },
  {
    id: 'A-7',
    pregunta: '¿Completar la verificación de las {noVerificadas} fuentes restantes?',
    porQue:
      'Es la condición para que este documento deje de ser un borrador y pase a ser un informe de resultados.',
    comoSeCierra:
      'Continuar el contraste por tandas, siguiendo el orden de prioridad ya calculado, y registrar cada divergencia como en esta versión.',
  },
];
