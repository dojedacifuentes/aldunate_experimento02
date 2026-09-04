/**
 * Los hallazgos principales del Informe 01.
 *
 * Van **antes** que las fichas institucionales, antes que la metodología y antes
 * que las matrices. En la versión 0.6.0 el lector recorría once perfiles y tres
 * visualizaciones antes de encontrar una razón para seguir leyendo; el orden
 * académico manda poner el método antes de los datos, pero no manda esconder los
 * resultados detrás de él.
 *
 * Cada hallazgo tiene cuatro partes y ninguna es prescindible:
 *
 * - **el enunciado**, en indicativo y sin adjetivos;
 * - **el dato** que lo sostiene, siempre con cifras interpoladas del dataset;
 * - **la lectura**, que es interpretación y se declara como tal;
 * - **el límite**, que dice hasta dónde llega y qué lo desmentiría.
 *
 * La cuarta parte es la que impide que un hallazgo se convierta en un eslogan, y
 * está por eso en el tipo y no en la buena voluntad de quien escribe: un
 * hallazgo sin límite no compila.
 *
 * Las cifras se escriben como marcas `{clave}` y las resuelve `cifrasInforme01()`
 * desde el dataset compilado. Ninguna se teclea.
 */

export interface Informe01Hallazgo {
  readonly id: string;
  readonly enunciado: string;
  readonly dato: string;
  readonly lectura: string;
  readonly limite: string;
  /** Afirmaciones del dataset o figuras del informe en que se apoya. */
  readonly apoyo: readonly string[];
}

export const informe01Hallazgos: readonly Informe01Hallazgo[] = [
  {
    id: 'H-1',
    enunciado: 'El fenómeno tiene dos años, no una década.',
    dato: '{iniciativasDesde2025} de las {iniciativasFechadas} iniciativas con fecha declarada comienzan en 2025 o después. Las dos anteriores a 2020 son unidades que existían antes de la inteligencia artificial generativa y que incorporaron el tema más tarde.',
    lectura:
      'Lo que se observa no es la maduración de un proceso largo, sino su apertura. Casi todo lo registrado es de primera generación, y eso explica más de lo que parece: que abunde la estructura recién creada, que escaseen los resultados y que ninguna Facultad haya tenido todavía tiempo material de evaluar lo que empezó el año pasado.',
    limite:
      'La fecha es la de inicio declarado por la fuente, no la de la actividad real. Una Facultad que llevara años trabajando sin publicarlo aparecería aquí como recién llegada, y {iniciativasSinFecha} iniciativas no declaran fecha alguna.',
    apoyo: ['Línea de tiempo'],
  },
  {
    id: 'H-2',
    enunciado: 'La estructura se crea antes que la regla.',
    dato: 'En {unidadOperacionPalabra} de las once Facultades consta una unidad especializada en operación —centro, programa, departamento o dirección—. Instrumento normativo propio dictado por la Facultad, en una sola. El corpus registra {mecUnidadesPalabra} unidades frente a {mecNormasPalabra} normas, y de esas cuatro normas sólo dos son de una Facultad.',
    lectura:
      'La institucionalización avanza por creación de órganos y no por producción de reglas. Es un orden posible y no el único: crear una unidad es un acto de una autoridad, y dictar una norma sobre uso de inteligencia artificial obliga antes a decidir qué se permite en una evaluación, qué se declara y qué consecuencia tiene no declararlo. Lo segundo es más difícil y más comprometedor que lo primero.',
    limite:
      'La ruta del protocolo que acredita políticas propias no se recorrió en {normaSinConcluirPalabra} de las once instituciones. La asimetría entre unidades y normas es firme sobre lo hallado, y sobre lo no hallado el informe no puede pronunciarse.',
    apoyo: ['clm-cohorte-002', 'clm-cohorte-003', 'Matriz de capacidades'],
  },
  {
    id: 'H-3',
    enunciado: 'La inteligencia artificial entra por la formación continua, no por la malla.',
    dato: '{MecProgramasPalabra} iniciativas son programas formativos —diplomados, minors, cursos, talleres—, {mecProgramasFacultadPalabra} de ellos sostenidos por la propia Facultad, frente a {mecAsignaturasPalabra} que ocurren dentro de una asignatura o de una línea de malla. La formación estructurada consta en operación en {formacionOperacionPalabra} de las once; la presencia en pregrado, en {pregradoOperacionPalabra}.',
    lectura:
      'La formación continua y el postgrado son los espacios donde una Facultad puede decidir en un semestre. La malla exige comités, acreditación y acuerdo de claustro, y responde en años. La distribución observada es exactamente la que produciría esa diferencia de velocidad, y no requiere suponer desinterés curricular.',
    limite:
      'Las rutas de malla y de programas de asignatura quedaron sin recorrer en {pregradoSinConcluirPalabra} de las once. Que el pregrado aparezca menos poblado es compatible con que se haya buscado menos, y ninguna de las dos explicaciones puede descartarse con lo disponible.',
    apoyo: ['clm-cohorte-005', 'clm-cohorte-006', 'Mecanismos institucionales'],
  },
  {
    id: 'H-4',
    enunciado:
      'Buena parte de lo que se atribuye a las Facultades pertenece a sus universidades.',
    dato: 'De las {mecHerramientasPalabra} herramientas del corpus, {mecHerramientasEntornoPalabra} son capacidades de la universidad y no de la Facultad de Derecho. En total, {celdasEntorno} de las {celdas} celdas de la matriz de capacidades muestran una capacidad presente sólo en el entorno institucional.',
    lectura:
      'Existe una capa de infraestructura universitaria —licencias generales, asistentes institucionales, lineamientos de rectoría— disponible para Derecho pero no desarrollada por Derecho. Confundir disponibilidad con adopción es el error más frecuente al leer estos anuncios, y es un error que se comete de buena fe: la nota de prensa que anuncia una licencia para toda la universidad no distingue quién la usará.',
    limite:
      'Que una capacidad sea universitaria no impide que la Facultad de Derecho la use intensamente: impide acreditarlo con lo publicado. La distinción es sobre la atribución de la evidencia, no sobre el uso real.',
    apoyo: ['clm-cohorte-007', 'clm-cohorte-004', 'Matriz de capacidades'],
  },
  {
    id: 'H-5',
    enunciado: 'Nadie ha publicado si algo de esto funciona.',
    dato: 'Ninguna de las {iniciativas} iniciativas alcanza el cuarto peldaño de la escalera, que exige resultados públicamente revisables. Tres rondas de investigación independientes, con documentos distintos y fuentes que apenas se solapan, llegaron a la misma ausencia.',
    lectura:
      'El campo produce actividad y estructura, y todavía no produce conocimiento sobre sus propios efectos. Las cifras que existen son de cobertura —cuánta gente participó— y contar asistentes no dice si alguien aprendió mejor. Bastaría una Facultad que midiera el efecto de una sola actividad que ya realiza y lo publicara para que este hallazgo dejara de ser cierto.',
    limite:
      'Es un hecho firme sobre el corpus y una pregunta abierta sobre cada Facultad. La ruta que acreditaría una medición publicada —repositorios y producción académica— quedó sin recorrer en {evaluacionSinConcluirPalabra} de las once instituciones. La versión anterior de este informe presentaba la ausencia sin esta salvedad.',
    apoyo: ['clm-cohorte-001', 'Escalera de institucionalización'],
  },
  {
    id: 'H-6',
    enunciado: 'Cuánto se investigó y cuánto se hace son variables distintas, y el corpus lo demuestra.',
    dato: 'La {menosInvestigada} es la institución menos investigada de las once —{menosInvestigadaRutas} de trece rutas recorridas, ninguna fuente contrastada— y acredita {menosInvestigadaOperacion} capacidades en operación. La {masInvestigada} recorrió {masInvestigadaRutas} rutas y acredita {masInvestigadaOperacion}.',
    lectura:
      'Si el trabajo de campo y la capacidad institucional fueran la misma variable, ese par de valores no podría existir. Es la razón concreta —y no una cautela genérica— por la que este informe no publica ranking: una tabla ordenada por evidencia localizada ordenaría a los investigadores antes que a las Facultades.',
    limite:
      'La demostración vale en la dirección que importa: prueba que la cobertura no determina el resultado, no que sea irrelevante. Con {celdasNoConcluyente} de {celdas} celdas sin concluir, el recuento de capacidades de cualquier institución poco investigada es un piso y no una medida.',
    apoyo: ['clm-metodo-001', 'Cobertura frente a capacidad'],
  },
  {
    id: 'H-7',
    enunciado: 'La relación con el mundo externo es conversación, no todavía vínculo estable.',
    dato: 'La capacidad de transferencia aparece como incipiente en {transferenciaIncipientePalabra} de las once: lo registrado son {mecActividadesPalabra} actividades de una sola ocurrencia —seminarios, jornadas, workshops— frente a {mecConveniosPalabra} convenios con terceros en todo el corpus.',
    lectura:
      'Las Facultades están discutiendo el asunto en público mucho más de lo que lo están incorporando a relaciones institucionales duraderas. Un seminario acredita interés y capacidad de convocatoria; un convenio acredita que alguien de fuera comprometió recursos, que es un hecho de otra naturaleza.',
    limite:
      'Un convenio firmado es acto ejecutado, pero de los dos registrados no consta actividad derivada. Y la ruta de vinculación y transferencia no se recorrió en dos instituciones.',
    apoyo: ['clm-cohorte-008', 'Mecanismos institucionales'],
  },
] as const;

/* ── Resumen ejecutivo ───────────────────────────────────────────────────────
 *
 * Dos páginas como mucho, y seis preguntas que debe contestar: qué se
 * investigó, cómo, qué apareció, qué significa, qué no puede concluirse y qué
 * cuestión abre para la institución destinataria.
 *
 * El resumen de la v0.6.0 describía sobre todo el método. Un lector que sólo
 * leyera aquello salía sabiendo cómo se hizo el trabajo y no qué se encontró,
 * que es justamente al revés de lo que un resumen ejecutivo debe conseguir.  */

export const informe01ResumenEjecutivo: readonly string[] = [
  'Este documento mapea la evidencia pública disponible sobre uso y enseñanza de inteligencia artificial en once Escuelas y Facultades de Derecho chilenas, con fecha de corte al {corte}. Reúne {fuentes} fuentes públicas únicas —{verificadas} de ellas abiertas y contrastadas contra su publicación original— y deriva {iniciativas} iniciativas, {evidencias} evidencias y {afirmaciones} afirmaciones trazables una por una hasta su fuente. **No es un informe de resultados sino un borrador para revisión**, y las {noVerificadas} fuentes todavía sin contrastar son la razón exacta de esa distinción.',

  'El método separa cuatro cosas que la discusión pública mezcla: la fuente, la evidencia que esa fuente prueba, la iniciativa que agrupa varias evidencias y la afirmación que se sostiene sobre ellas. Separa además a quién pertenece cada capacidad —una licencia disponible para toda la universidad no es una capacidad de su Facultad de Derecho— y en qué peldaño de institucionalización se encuentra, desde el anuncio aislado hasta el resultado públicamente revisable. Esta versión añade dos instrumentos: la clase de **mecanismo** con que se hace cada cosa —una unidad, una norma, un programa formativo, una herramienta, un convenio— y una matriz de **{capacidadesPalabra} capacidades institucionales** que reemplaza al recuento de evidencia como comparador principal.',

  'Lo que aparece tiene una forma reconocible y reciente. **{iniciativasDesde2025} de las {iniciativasFechadas} iniciativas fechadas comienzan en 2025 o después**: no se observa la maduración de un proceso largo sino su apertura. En {unidadOperacionPalabra} de las once Facultades consta una unidad especializada en funcionamiento, y en una sola un instrumento normativo propio sobre uso de inteligencia artificial. La formación entra por el diplomado, el minor y el taller —{mecProgramasPalabra} programas formativos— antes que por la malla, y buena parte de las herramientas disponibles pertenece a la universidad y no a la Facultad: {mecHerramientasEntornoPalabra} de {mecHerramientasPalabra}.',

  'La lectura que el conjunto permite es que el campo está construyendo estructura antes que reglas, y actividad antes que resultados. Se crean órganos, se abren programas y se anuncian herramientas; **ninguna de las {iniciativas} iniciativas registradas acredita haber medido su efecto sobre el aprendizaje jurídico**, y tres rondas independientes de investigación llegaron por separado a esa misma ausencia. Es la conclusión más sólida del informe y también la más fácil de revertir: bastaría una Facultad que evaluara una sola de las actividades que ya realiza y lo publicara.',

  'Lo que no puede concluirse es tan importante como lo anterior, y esta versión lo lleva dentro de cada celda en vez de al pie. De las {celdas} celdas de la matriz de capacidades, **{celdasNoConcluyente} quedan sin concluir porque la ruta del protocolo que las habría acreditado no se recorrió en esa institución**. Una ausencia sólo informa cuando se buscó donde correspondía, y por eso el informe distingue «no localizada» de «no concluyente». Tampoco hay ranking, ni lo habrá mientras el trabajo de campo sea {razonCobertura} veces más profundo en tres instituciones que en las ocho restantes: el propio corpus muestra que la {menosInvestigada}, la menos investigada de todas, acredita tantas capacidades en operación como la {masInvestigada}, que es la más investigada.',

  'Para la Pontificia Universidad Católica de Valparaíso, la evidencia corrige de entrada una idea que el documento antecedente podía sugerir: no parte de cero. Tiene una unidad especializada con continuidad desde 2020, un laboratorio propio, presencia de la inteligencia artificial en la enseñanza de pregrado, una herramienta desarrollada en casa y actividad formativa con cobertura declarada. Es, en número de capacidades observadas en funcionamiento, uno de los perfiles más completos de la cohorte.',

  'La pregunta que el informe deja planteada es por eso otra, y es de gestión antes que de diagnóstico. Las dos capacidades que en la PUCV constan sólo en el entorno —el instrumento normativo y la adopción documentada dentro de la enseñanza— son precisamente las que en otras Facultades ya se resolvieron con un mecanismo concreto y localizable. **Si una base propia y sostenida ya existe, la cuestión no es generar más iniciativas sino cuáles de ellas conviene convertir en capacidad formalizada, transversal y evaluable**, y con qué instrumento. El informe no responde esa pregunta: la deja formulada con los referentes a la vista.',
];
