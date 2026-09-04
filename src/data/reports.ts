import { autor } from './site';
import type { ClaimChange, Report, ReportStatus, Tone } from '@/types';

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

/**
 * Qué significa cada estado para quien va a citar. Fuente única: la ficha, la
 * portada y la descarga leen de aquí, y no de tres frases escritas a mano que
 * envejecen por separado —que es como el sitio llegó a decir a la vez «v0.2.0
 * publicada» y «los hallazgos aún no están definidos»—.
 */
export const reportStatusNotice: Record<ReportStatus, string> = {
  'en-investigacion':
    'Investigación abierta. La estructura y el método están definidos; los hallazgos todavía no. Nada de lo publicado aquí debe citarse aún como resultado.',
  borrador:
    'Borrador de trabajo. El texto puede cambiar en cualquier momento y no ha pasado revisión. Cite sólo con indicación expresa de que es un borrador.',
  'en-revision':
    'Versión de trabajo en revisión. Los hallazgos y su interpretación pueden cambiar antes de una versión estable. Cite siempre el número de versión y la fecha de consulta.',
  publicado:
    'Versión estable. Las correcciones posteriores se publican como versión nueva y quedan registradas en el changelog; ninguna versión se sobrescribe.',
};

export const reports: Report[] = [
  {
    slug: 'ia-escuelas-derecho-chile',
    code: 'INFORME 01',
    title:
      'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile',
    subtitle: 'Mapeo comparado de evidencia pública e institucionalización · borrador académico para revisión',
    executiveSummary:
      'Mapeo comparado de evidencia pública sobre uso, enseñanza, políticas, herramientas e iniciativas de inteligencia artificial en once Escuelas y Facultades de Derecho chilenas, al 1 de septiembre de 2026. El campo entero cabe en dos años: 41 de las 49 iniciativas fechadas empiezan en 2025 o después. Lo que se observa es una fase de construcción de estructura —cinco Facultades sostienen una unidad especializada en funcionamiento— que va por delante de la producción de reglas, con una sola norma propia sobre uso de inteligencia artificial dictada por una Facultad, y muy por delante de cualquier resultado: ninguna de las 53 iniciativas registradas acredita haber medido su efecto sobre el aprendizaje jurídico. La inteligencia artificial entra además por el diplomado y el taller antes que por la malla, y buena parte de las herramientas disponibles pertenece a la universidad y no a su Facultad de Derecho. El informe no publica ranking, y no por cautela genérica: la institución menos investigada de la cohorte acredita tantas capacidades en funcionamiento como la más investigada, de modo que ordenar mediría el trabajo de campo. De las 110 celdas de su matriz de capacidades, 47 quedan sin concluir porque la ruta del protocolo que las habría acreditado no se recorrió. Es un borrador para revisión, no un informe de resultados.',
    authors: [autor.name],
    status: 'borrador',
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
        version: '0.8.0',
        date: '2026-09-04',
        status: 'borrador',
        pdf: '/descargas/informe-01-borrador-academico-v0.8.0/informe-01-borrador-academico-v0.8.0.pdf',
        html: '/descargas/informe-01-borrador-academico-v0.8.0/informe-01-borrador-academico-v0.8.0.html',
        changelog: [
          'Una iniciativa adyacente deja de acreditar una capacidad de inteligencia artificial. El registro ya distinguía en «dirección» si una iniciativa usa IA, la estudia como objeto jurídico, hace las dos cosas o pertenece al ámbito vecino de la tecnología y la innovación sin componente de IA documentado; la capa de capacidades ignoraba esa distinción, y un laboratorio de innovación legal acreditaba «unidad especializada» igual que un programa de Derecho e Inteligencia Artificial.',
          'La corrección alcanza a los siete registros adyacentes, repartidos en cinco instituciones y no sólo en la PUCV: una regla que se aplicara a una sola sería el método escrito para un resultado. Los siete se abrieron después contra sus fuentes, uno por uno, y ese contraste corrigió tres clasificaciones y dejó cuatro en pie.',
          'Estado nuevo, «sólo adyacente». Descontar la iniciativa y dejar caer la celda en «no localizada» habría afirmado que se buscó una estructura y no se encontró ninguna, y es falso: se encontró una, y lo que no consta es su componente de inteligencia artificial. El estado dice eso y no más. Tras la revisión de los siete registros no queda ninguna celda en ese estado, y el vocabulario se conserva porque la regla sigue vigente: describe qué haría el instrumento si volviera a darse el caso.',
          'Revisión de los siete registros adyacentes contra sus fuentes. El Departamento de Derecho y Tecnología de la Universidad Católica acredita evidencia propia de inteligencia artificial —el análisis de su ética, con fuente contrastada— y el CE3 de la Universidad de Chile acredita dos: la excepción de derechos de autor para el entrenamiento de sistemas y el seminario de inteligencia artificial y acceso a la justicia. Las dos unidades vuelven a constar en operación. El programa [genIA] de la Universidad de Concepción figuraba como adyacente a la inteligencia artificial por una razón que corresponde a otro campo del registro. El diplomado de la Universidad Andrés Bello se reclasifica por el ámbito declarado del programa y no por evidencia de contenido, y queda como primer registro de la cola de verificación.',
          'El documento adopta el sistema editorial del Informe 02: papel claro con oscuro disponible y recordado, Spectral para la prosa, IBM Plex Sans para los títulos y Plex Mono para los metadatos, raíl de navegación con el índice derivado de los propios encabezados, barra de progreso y una paleta de cinco tintas de la que ahora derivan también los colores de las figuras.',
          'La declaración de intereses deja de exponer el proceso privado de elaboración. El conflicto se conserva —es práctica académica— en primera persona del autor; se retiran el destinatario del borrador y los terceros nombrados, que no han escrito el informe. El manifiesto declaraba además el protocolo 2.0 cuando el vigente es el 2.1.',
        ],
      },
      {
        version: '0.7.0',
        date: '2026-09-04',
        status: 'borrador',
        pdf: '/descargas/informe-01-borrador-academico-v0.7.0/informe-01-borrador-academico-v0.7.0.pdf',
        html: '/descargas/informe-01-borrador-academico-v0.7.0/informe-01-borrador-academico-v0.7.0.html',
        changelog: [
          'Enmienda metodológica 2.1, aditiva y documentada. La 2.0 comparaba ocho dimensiones —ámbitos académicos donde una iniciativa puede ocurrir—, y dos de ellas no eran ámbitos sino atributos: como el registro obliga a elegir una dimensión primaria, ninguna iniciativa caía nunca ahí. La doble columna vacía que la v0.6.0 publicó como hallazgo era en parte un artefacto del modelo. La 2.0 se conserva íntegra y su matriz se publica en anexo.',
          'Eje nuevo de mecanismo institucional: qué clase de instrumento es cada iniciativa —unidad, norma, programa formativo, asignatura, herramienta, proyecto, actividad, convenio, publicación—. Es una clasificación de lo que el registro ya contenía en su nombre, su unidad responsable y sus productos, de modo que no aporta evidencia nueva y no reabre la verificación de ninguna fuente.',
          'Matriz de diez capacidades institucionales, derivada por reglas mecánicas sobre campos ya verificados. Responde «¿qué capacidad demuestra cada Facultad?» y no «¿cuánta evidencia encontramos de ella?», que era la pregunta que contestaba la matriz anterior.',
          'Una ausencia sólo informa si se recorrió la ruta del protocolo que la habría encontrado. Cada capacidad declara sus rutas: sin evidencia y con la ruta recorrida, la celda dice «no localizada»; sin recorrerla, «no concluyente». 47 de las 110 celdas son de la segunda clase. La desigualdad de cobertura deja de ser un aviso al pie y pasa a estar dentro de cada celda (ISSUE-018).',
          'Un primer diseño de la escala metía la verificación dentro del estado, y el efecto medido fue premiar a la PUCV por tener el 86 % de sus fuentes contrastadas, que es una propiedad del trabajo de campo. La marca de verificación viaja aparte y no modifica el estado.',
          'Análisis de sensibilidad publicado. El corpus es el mismo de la v0.6.0 —74 fuentes, 53 iniciativas, 38 contrastadas—, así que un cambio de lectura sólo puede venir del método. De las siete conclusiones, cinco se sostienen sin variación y dos se matizan: la ausencia de evaluación de efecto y la de línea curricular obligatoria quedan abiertas en las instituciones donde su ruta no se recorrió. Ninguna conclusión se hizo más fuerte por efecto del cambio.',
          'Motor de gráficos propio: funciones puras que devuelven SVG y que consumen dos huéspedes, el sitio y el exportador. La v0.6.0 dibujaba con tablas de HTML y el PDF que se envía al destinatario no tenía ni una figura; ahora las nueve figuras son las mismas en la web, en el HTML y en papel, porque salen de la misma función.',
          'Cada figura declara la pregunta que responde, un título que es su lectura y no un rótulo, su fuente, su nota metodológica y su alternativa textual. El color nunca va solo: cada estado lleva además trama o glifo, de modo que la figura sobrevive a una impresión en blanco y negro.',
          'Línea de tiempo, la única visualización declarada que faltaba. 41 de las 49 iniciativas fechadas empiezan en 2025 o después: el campo entero cabe en dos años.',
          'Arquitectura editorial rehecha. Resumen ejecutivo de siete párrafos y siete hallazgos —con dato, lectura y límite— antes de la introducción. Las once fichas, la matriz de la 2.0, las afirmaciones, las lagunas y el registro de fuentes bajan a anexos.',
          'La sección PUCV compara mecanismos y no adjetivos: para cada capacidad que aquí no consta en funcionamiento, nombra el instrumento concreto —con su institución y su fuente— allí donde sí. Las implicancias se separan de las conclusiones y se enuncian como decisiones que la evidencia abre, no como recomendaciones.',
          'El PDF pasa de 56 a 72 páginas y estrena portada, con una marca gráfica que es la propia matriz de capacidades reducida a su retícula.',
          'Fe de erratas de la v0.6.0: la ficha de cada institución declaraba «0 fuentes con verificación sustantiva» y la nota metodológica sostenía que ninguna fuente llevaba fecha de verificación. Las dos afirmaciones eran ciertas en la v0.5.0 y dejaron de serlo con 38 fuentes contrastadas.',
        ],
      },
      {
        version: '0.6.0',
        date: '2026-09-04',
        status: 'borrador',
        pdf: '/descargas/informe-01-borrador-academico-v0.6.0/informe-01-borrador-academico-v0.6.0.pdf',
        html: '/descargas/informe-01-borrador-academico-v0.6.0/informe-01-borrador-academico-v0.6.0.html',
        changelog: [
          'Primera verificación sustantiva del corpus. Se abrieron 38 de las 74 fuentes y se contrastaron siete campos contra la publicación original: existencia y título literal, fecha declarada, unidad responsable, condición de anuncio o ejecución, cifras de cobertura, límites y respaldo efectivo de la afirmación. Es el 51% del corpus, y la portada lo dice.',
          'Once registros no decían lo que su página dice. El decálogo de la PUCV «sugiere recomendaciones» y es lineamiento, no política. El «primer Departamento de Derecho y Tecnología en Chile» es cita textual del decano de la UC, no un hecho verificado, y ninguna de las cuatro unidades creadas entre 2025 y 2026 publica su acto de creación. El convenio de la UAI con Legu se firmó: es acto ejecutado.',
          'La serie temporal de formación continua cambia de titular. El diploma de la Universidad de Chile figura cerrado desde 2022 y su reapertura de 2026 se declara referencial bajo otra unidad; la serie documentada es de la UC, con dos graduaciones consecutivas de más de 90 y más de 100 titulados.',
          'El LMIL de la PUCV dependía en 2022 de la Dirección de Incubación y Negocios, no de la Facultad, y su fuente fundacional no menciona la inteligencia artificial. En 2025 ya es de la Escuela de Derecho. Es un traslado orgánico, y así se registra.',
          'La verificación corrigió en las dos direcciones. El Programa de IA y LegalTech de la Universidad Central estaba subestimado porque el registro lo nombraba por el segmento de su URL: tiene IA explícita y actividad fechada. El sesgo de cobertura no sólo infla a los observados.',
          'Dos fechas se retiraron por no constar en la fuente —GenIA UdeC y los lineamientos de la Universidad de Chile— y dos se ganaron. El seminario «Derecho en la Smart Era» lo organiza el centro de alumnos y se reatribuye a ESTUDIANTIL.',
          'El documento incorpora su capa académica: introducción, objetivos, relato metodológico en nueve apartados, discusión en seis, siete conclusiones que citan las afirmaciones que las sostienen, ocho limitaciones y una agenda de siete preguntas con su condición de cierre.',
          'Declaración de intereses. Una fuente del corpus identifica al destinatario del informe y a su autor como conductores del Programa DIAT. La sección PUCV publica su doble revisión: si es demasiado severa y si es demasiado indulgente.',
          'DEC-108 queda enmendada. Prohibía verificar, pero el kit canónico define «contrastado» como segunda revisión y se la encarga al auditor metodológico; lo que reserva a la firma humana es «aceptado», que sigue vacío en los 227 registros.',
          'Ningún número de la prosa se escribe a mano: los textos citan marcas que se resuelven desde el dataset, de modo que web, Markdown, HTML y PDF no puedan decir cifras distintas.',
          'ISSUE-002 cerrado: la fuente de la UdeC carga sin error de certificado. ISSUE-003 confirmado: el CNED devuelve 403. Tres incidencias nuevas registradas.',
        ],
      },
      {
        version: '0.5.0',
        date: '2026-09-04',
        status: 'en-investigacion',
        pdf: '/descargas/informe-01-mapeo-evidencia-v0.5.0/informe-01-mapeo-evidencia-v0.5.0.pdf',
        html: '/descargas/informe-01-mapeo-evidencia-v0.5.0/informe-01-mapeo-evidencia-v0.5.0.html',
        changelog: [
          'El corpus deja de ser una lista dentro de cinco documentos y pasa a ser un dataset canónico: seis CSV con universidades, fuentes, iniciativas, evidencias, cobertura y afirmaciones.',
          'Fe de erratas de la v0.4.0: el corpus tiene 74 fuentes públicas únicas y no 72. La re-extracción mecánica de URL encontró dos que intento-2b cita en su tabla-resumen y nunca convirtió en registro —IDEA UCEN y el Diplomado en Derecho, Innovación y Tecnología de la UNAB—. La v0.4.0 no se reescribe.',
          '53 iniciativas deduplicadas y 75 evidencias, cada una atribuida a la unidad que su fuente identifica. Nueve resultan ser capacidades de universidad y no de Facultad de Derecho.',
          'Ninguna de las 53 iniciativas alcanza el cuarto peldaño de la escalera. Es la tercera ronda independiente que llega a la misma ausencia de evaluación de efecto.',
          'La cobertura de investigación se publica como indicador propio, separado de la evidencia: 9,7 de trece rutas del protocolo recorridas en el piloto frente a 4,0 en las otras ocho, y una razón de 3,7:1 en fuentes.',
          'Dos lagunas nuevas. L-11: ninguna fuente del corpus proviene de contraste externo, de modo que hereda íntegro el sesgo de autodescripción. L-12: dos de las ocho dimensiones —recursos y capacidades, y continuidad y resultados— están vacías en las once instituciones.',
          '14 afirmaciones con razonamiento, contraevidencia, límites y confianza declarados. Ninguna está aceptada.',
          'La ficha publica matriz de evidencia localizada, cobertura, escalera de institucionalización, mapa de direcciones, sección PUCV, lagunas y auditoría de la línea base, además de once fichas institucionales en página propia.',
          'Descargas en PDF, HTML, Markdown, CSV y JSON, con manifiesto y controles de integridad. El PDF se imprime del mismo HTML, de modo que documento y web no pueden divergir.',
          'La matriz no ordena por nada: filas alfabéticas y ningún puntaje agregado por universidad. Con la cobertura actual, ordenar produciría un ranking del trabajo de campo.',
          'Todos los contadores del informe se calculan desde el dataset. El compilador falla y no escribe nada si una referencia queda huérfana o si algún registro declara una verificación sustantiva que no existe.',
        ],
      },
      {
        version: '0.4.0',
        date: '2026-09-02',
        status: 'en-investigacion',
        changelog: [
          'Ronda 2 de fusión: se incorporan dos investigaciones profundas que habían quedado sin inventariar.',
          'El corpus pasa de 43 a 72 fuentes públicas únicas; 22 de las localizadas ya estaban y sirven de corroboración.',
          'Segunda pasada de resolubilidad: 28 de 29 fuentes nuevas responden; la base INDICES del CNED rechaza la petición automatizada y se conserva con advertencia.',
          'Auditoría aritmética del documento antecedente: cuatro totales no cuadran con sus propias puntuaciones, de modo que ninguna puntuación heredada se arrastra y la tabla debe rehacerse desde la matriz de evidencias.',
          'Se deshacen seis atribuciones: tres capacidades de universidad contadas como capacidades de Derecho, y tres denominaciones de unidad corregidas contra la fuente oficial.',
          'Se derriban dos ceros heredados de uso interno de IA —PUCV y U. Autónoma—, ninguno sostenible al corte.',
          'Se declara que el documento tratado como línea base de 2025 contiene actividades de 2026 y no sirve como corte histórico congelado.',
          'Ninguna institución alcanza evidencia de evaluación de efecto. Es la segunda ronda independiente que llega a esa misma ausencia.',
          'La cobertura sigue desigual: 15 de las 29 fuentes nuevas van al piloto de tres, y la razón con el resto solo baja de 4,5:1 a 4,0:1. No se emite comparación nacional.',
        ],
      },
      {
        version: '0.3.0',
        date: '2026-09-02',
        status: 'en-investigacion',
        changelog: [
          'Publicación del kit canónico de investigación inter-IA v1.0.0.',
          'Cohorte longitudinal fijada en once Facultades, Escuelas o carreras de Derecho.',
          'Metodología 2.0 compatible con las cinco dimensiones del informe anterior.',
          'Plantillas, estados editoriales, identificadores y relevos para ChatGPT, Gemini y Claude.',
        ],
      },
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
      {
        version: '0.2.0',
        date: '2026-09-01',
        status: 'en-investigacion',
        changelog: [
          'Corpus de evidencia armado a partir de tres investigaciones profundas sobre las once universidades de la cohorte.',
          'Inventario de 43 fuentes públicas únicas, todas institucionales y con fecha de publicación.',
          'Se descartó una de las tres investigaciones de origen: declaraba 25 fuentes sin URL resoluble por terceros.',
          'Primera pasada de verificación: 42 de 43 fuentes responden; la restante existe pero su certificado no cubre el nombre de host.',
          'Ninguna afirmación se eleva a publicable: la verificación sustantiva de cada fuente sigue pendiente y no se delega.',
          'Se declara que la cobertura es desigual por diseño —nueve fuentes en cada universidad del piloto y dos en cada una de las otras ocho—, por lo que no se emite ninguna comparación nacional.',
        ],
      },
    ],
    // Vacíos a propósito, y así siguen. El registro existe y se publica desde el
    // dataset canónico —74 fuentes, 38 de ellas contrastadas—, pero `sourceIds`
    // alimenta la lista de fuentes **aceptadas** del sitio, y aceptar es un estado
    // editorial distinto de contrastar: exige una decisión humana registrada que
    // el procedimiento todavía no ha recogido. Ninguna de las 74 la tiene.
    sourceIds: [],
    claimIds: [],
    openQuestions: [
      '¿Qué unidades académicas cuentan con política publicada sobre uso de IA?',
      '¿Existen asignaturas específicas o el contenido aparece integrado en cursos existentes?',
      '¿Cómo se distribuye la actividad entre docencia, investigación y gestión?',
      '¿Qué diferencia hay entre lo declarado institucionalmente y lo observable en programas de curso?',
      '¿Cuáles de las iniciativas anunciadas llegaron a ejecutarse? Cinco acreditan su constitución o su anuncio, y no cobertura, productos ni resultados.',
      '¿Puede igualarse la cobertura de las ocho universidades fuera del piloto, sin la cual no hay comparación posible?',
      '¿Existe acto formal de creación —resolución, organigrama— de las unidades que hoy constan solo por su nombre comunicacional?',
      '¿Qué dicen los syllabus 2026 sobre obligatoriedad, semestre, créditos y matrícula real de los cursos de IA?',
      '¿Se sostienen en ANID los proyectos Fondecyt y FONDEF que hoy constan por noticia universitaria?',
      '¿Puede reconstruirse una línea base de 2025 auténticamente congelada? La heredada contiene actividades de 2026.',
      '¿Qué diría una fuente de contraste externo? Las 74 del corpus son institucionales, de modo que hoy el informe mide lo que las universidades cuentan de sí mismas.',
      '¿Existe alguna Facultad chilena que haya medido el efecto de una de sus actividades de IA? Ninguna lo ha publicado, y bastaría una para cambiar la lectura del informe.',
      '¿Qué diría la matriz de capacidades si se recorrieran las rutas que faltan? 47 de sus 110 celdas están sin concluir, y no por lo que hagan las Facultades sino por dónde alcanzó a buscar esta investigación.',
      '¿Debe «verificado» significar responsabilidad editorial o ejecución material del contraste? Los registros llevan la firma de quien responde por ellos, y el contraste lo ejecutó un modelo bajo ese encargo.',
    ],
    // Word no aparece porque no existe: su generador es PowerShell 5.1 con Word
    // por COM y sólo corre en el equipo del autor. Un botón que promete un
    // archivo inexistente es peor que no tener botón.
    downloads: [
      {
        format: 'PDF',
        label: 'Leer o imprimir',
        href: '/descargas/informe-01-borrador-academico-v0.8.0/informe-01-borrador-academico-v0.8.0.pdf',
        description:
          'A4 de 72 páginas, con portada, encabezado, pie y numeración, y con las nueve figuras del informe en vector. Es una impresión del mismo HTML: los dos salen del mismo modelo y no pueden divergir.',
      },
      {
        format: 'HTML',
        label: 'Leer la versión web',
        href: '/descargas/informe-01-borrador-academico-v0.8.0/informe-01-borrador-academico-v0.8.0.html',
        description:
          'Documento completo y autónomo, preparado para impresión: portada, resumen ejecutivo, hallazgos, metodología, panorama, capacidades comparadas, discusión, sección PUCV, conclusiones, implicancias, limitaciones y siete anexos.',
      },
      {
        format: 'Markdown',
        label: 'Usar como fuente editorial',
        href: '/descargas/informe-01-borrador-academico-v0.8.0/informe-01-borrador-academico-v0.8.0.md',
        description: 'El mismo documento en texto plano, reutilizable por personas y por modelos.',
      },
      {
        format: 'ZIP',
        label: 'Descargar el paquete reproducible',
        href: '/descargas/informe-01-borrador-academico-v0.8.0.zip',
        description:
          'Documento en PDF, HTML y Markdown, dataset canónico en seis CSV, representación JSON, manifiesto de publicación y controles de integridad SHA-256.',
      },
    ],
    researchKit: {
      title: 'Kit canónico de investigación inter-IA',
      summary:
        'Protocolo metodológico, cohorte histórica, plantillas y sistema de relevo para que ChatGPT, Gemini y Claude trabajen sobre una misma fuente de verdad. No contiene resultados sobre universidades.',
      version: '1.0.0',
      publishedAt: '2026-09-02',
      status: 'Protocolo operativo · investigación sustantiva pendiente',
      artifacts: [
        {
          format: 'PDF',
          label: 'Leer o imprimir',
          href: '/descargas/informe-01-kit-canonico-v1.0.0/kit-canonico-v1.0.0.pdf',
          description: 'Versión A4 de 18 páginas para lectura, presentación y archivo.',
        },
        {
          format: 'Word',
          label: 'Editar en Word',
          href: '/descargas/informe-01-kit-canonico-v1.0.0/kit-canonico-v1.0.0.docx',
          description: 'Documento editable con portada, índice, tablas y metadatos.',
        },
        {
          format: 'HTML',
          label: 'Abrir versión web',
          href: '/descargas/informe-01-kit-canonico-v1.0.0/kit-canonico-v1.0.0.html',
          description: 'Lectura navegable, adaptable a móvil y preparada para impresión.',
        },
        {
          format: 'Markdown',
          label: 'Usar como fuente canónica',
          href: '/descargas/informe-01-kit-canonico-v1.0.0/kit-canonico-v1.0.0.md',
          description: 'Fuente editorial reutilizable por personas, repositorios y modelos de IA.',
        },
        {
          format: 'ZIP',
          label: 'Descargar paquete completo',
          href: '/descargas/informe-01-kit-canonico-v1.0.0.zip',
          description: 'Todos los formatos, manifiesto, controles de integridad y plantillas CSV.',
        },
      ],
    },
    updatedAt: '2026-09-04',
  },
  {
    slug: 'transformacion-ensenanza-derecho',
    code: 'INFORME 02',
    /*
      Título canónico, idéntico al de la portada del PDF. La web decía «Cómo se
      está transformando la enseñanza del Derecho…» y el documento «La
      universidad ante la automatización del trabajo cognitivo»: dos títulos
      para un mismo informe, que es de las cosas más difíciles de defender ante
      alguien que quiera citarlo. Y el estrecho era el de la web: la
      arquitectura del informe es educación superior, con el Derecho como caso
      crítico, no al revés.

      El slug no cambia. Romper `/informes/transformacion-ensenanza-derecho`
      para que la URL «combine» con el título nuevo rompería enlaces ya
      publicados a cambio de nada.
    */
    title: 'La universidad ante la automatización del trabajo cognitivo',
    subtitle:
      'Transformación de la enseñanza superior en el contexto de la inteligencia artificial · 2022–2026',
    descriptor: 'Caso especial: enseñanza del Derecho',
    /*
      24, 38 y 18 parecían contradecirse y no lo hacían: contaban eslabones
      distintos de la misma cadena. Se publican juntos para que la relación se
      vea, en vez de dejar que tres cifras sueltas siembren la sospecha.
    */
    counts: { sources: 24, findings: 38, claims: 18, recommendations: 8 },
    executiveSummary:
      'Qué se evalúa cuando el producto escrito deja de ser prueba de proceso. El informe sitúa la enseñanza jurídica dentro del cuadro más amplio de la educación superior: veinticuatro capítulos que recorren evaluación, competencias, metodologías, rol docente, currículo, gobernanza y mercado profesional, con la formación en Derecho como caso crítico porque buena parte de sus instrumentos de aprendizaje y certificación —leer, investigar, argumentar y redactar— coincide con tareas que los sistemas generativos ejecutan con alta fluidez y fiabilidad insuficiente. El hallazgo central es asimétrico: la transformación verificable se concentra casi por completo en la evaluación, y de treinta y ocho hallazgos registrados solo seis alcanzan identificación causal en contexto experimental, todos en estudios pequeños y de alcance local. Ninguna afirmación sobre despliegues institucionales de escala supera el nivel de implementación.',
    authors: [autor.name],
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
      {
        version: '0.3.0',
        date: '2026-08-31',
        status: 'en-revision',
        pdf: '/descargas/informe-02-transformacion-ensenanza-v0.3.0.pdf',
        html: '/descargas/informe-02-completo-v0.3.0.html',
        changelog: [
          'Revisión metodológica: las afirmaciones se calibran al diseño de sus fuentes, no a su fuerza retórica.',
          'Título canónico único en portada, metadatos, ficha web y descargas. La web presentaba el informe con un alcance más estrecho que el documento.',
          'Portada: las cuatro cifras pasan a llevar universo, país, muestra y fuente. Un 94 % sin universo se lee como si fuera universal.',
          'Etiqueta de portada «Informe experto» sustituida por «Investigación aplicada»: la primera es una condición que se concede, no que se toma.',
          'Autoría con nombre y responsabilidad, en lugar de una autoría colectiva genérica.',
          'Taxonomía epistemológica separada en cuatro dimensiones independientes: estado documental, robustez, nivel demostrativo y alcance de generalización.',
          'Fuentes críticas contrastadas contra su publicación original, no contra el texto del informe.',
          'Se incorpora la corrección publicada por PNAS sobre Bastani et al. (20-08-2025), que la versión anterior no mencionaba.',
          'Eliminada la instrucción de Word visible en el índice y renumeradas las recomendaciones.',
          'Extensión: 77 páginas frente a 76. El aumento procede de acotaciones de alcance, no de material nuevo.',
        ],
        claimChanges: [
          {
            claimId: 'clm-validez-evaluacion',
            changeType: 'narrowed_scope',
            previous:
              'La evaluación no supervisada perdió su validez como evidencia de aprendizaje.',
            current:
              'La evaluación escrita no supervisada ya no puede presumirse, por sí sola, como evidencia suficiente de capacidad individual.',
            reason:
              'La fuente es un experimento en cinco módulos de Psicología de una universidad británica. Sostiene que el producto escrito sin supervisión dejó de bastar por sí solo; no sostiene que toda evaluación no supervisada sea inválida.',
          },
          {
            changeType: 'narrowed_scope',
            previous:
              'La diferencia entre el resultado de Harvard y el de Turquía es enteramente atribuible al diseño de la interacción.',
            current:
              'Ambos resultados son consistentes con un papel determinante del diseño y de sus guardarraíles; la comparación no permite aislar ese factor como única causa.',
            reason:
              'Son dos ensayos aleatorizados en poblaciones distintas. Cada uno identifica causalidad dentro de su experimento; la diferencia entre ambos no es un contraste controlado.',
          },
          {
            changeType: 'narrowed_scope',
            previous: 'La explicación no puede ser el dinero ni la información. Es de gobernanza.',
            current:
              'El patrón es compatible con la hipótesis de que la gobernanza sea un cuello de botella central; la muestra no permite estimar su peso frente a financiación, capacidades o regulación.',
            reason:
              'La muestra es intencionada y está sesgada hacia instituciones con actividad documentada. No permite descartar explicaciones alternativas.',
          },
          {
            changeType: 'retaxonomised',
            previous: 'D5 · causalidad establecida',
            current: 'D5 · identificación causal en contexto experimental',
            reason:
              'Un experimento pequeño identifica causalidad dentro de su contexto. «Causalidad establecida» autoriza a generalizar; el alcance ahora lo fija una dimensión independiente.',
          },
          {
            changeType: 'narrowed_scope',
            previous:
              'Leer, sintetizar, clasificar, comparar, argumentar y redactar documentos no es una parte de la formación jurídica; es la formación jurídica.',
            current:
              'La formación jurídica centrada en lectura, investigación, argumentación y escritura presenta una exposición especialmente intensa, sin que eso agote la disciplina.',
            reason:
              'La formulación anterior borraba la entrevista de clientes, la negociación, la litigación oral, la ética profesional y la decisión bajo incertidumbre, que son precisamente lo menos expuesto.',
          },
          {
            changeType: 'narrowed_scope',
            previous: 'Dejar de invertir en detección algorítmica. La evidencia es concluyente.',
            current:
              'No usar la detección algorítmica como estrategia central de imputación o sanción mientras persistan falsos positivos y negativos relevantes y no exista validación local.',
            reason:
              'La recomendación es correcta como política prudencial; la evidencia no justifica una afirmación universal sobre inutilidad. Puede conservar usos diagnósticos validados localmente.',
          },
          {
            changeType: 'corrected_data',
            previous: 'Bastani et al., PNAS · fecha 2025 · sin mención de correcciones.',
            current:
              'Bastani et al., PNAS · 25-06-2025 · con la corrección publicada el 20-08-2025 declarada en la ficha.',
            reason:
              'Verificado contra la publicación original. Una fuente corregida se puede citar; en silencio, no.',
          },
          {
            changeType: 'added_context',
            previous: '94 % · 12 % · 94 % · 19 %',
            current:
              'Cada cifra con su universo, país, muestra y fuente en la propia portada.',
            reason:
              'Una cifra sin universo se lee como si describiera a todo el mundo. El 19 % de UNESCO procede de 400 respuestas de Cátedras UNESCO/UNITWIN, no de una muestra representativa de universidades.',
          },
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

/** Etiqueta legible de cada tipo de cambio en el changelog granular. */
export const claimChangeLabel: Record<ClaimChange['changeType'], string> = {
  narrowed_scope: 'Alcance acotado',
  corrected_data: 'Dato corregido',
  retaxonomised: 'Reclasificado',
  added_context: 'Contexto añadido',
  editorial: 'Editorial',
};

/* ────────────────────────── Cuál informe encabeza la portada ────────────────────────── */

/**
 * Orden de madurez editorial. Mayor es más terminado.
 *
 * No es el mismo orden que el de `ReportStatus` declarado en `types`: aquí lo
 * que importa es **cuánto se puede leer hoy**, que es la pregunta que hace
 * quien entra por primera vez.
 */
const madurez: Record<ReportStatus, number> = {
  'en-investigacion': 0,
  borrador: 1,
  'en-revision': 2,
  publicado: 3,
};

/**
 * El informe que encabeza la portada: **el más terminado**, no el más reciente.
 *
 * ── Por qué cambió, y por qué el criterio anterior era una trampa ──
 *
 * La portada elegía por `updatedAt`, con el argumento de que así no se
 * desactualiza sola. El 02-09-2026 eso mandó a la acción principal del sitio
 * —«Leer el último informe»— al **Informe 01**, que declara expresamente que no
 * emite conclusiones y cuyas 43 fuentes siguen sin verificar. No porque el
 * informe hubiera avanzado: porque otra sesión le tocó la fecha al publicar un
 * kit metodológico.
 *
 * «Más reciente» y «más terminado» son cosas distintas, y en la primera
 * pantalla de un sitio que se ofrece para ser citado, la que importa es la
 * segunda. Un lector que llega y pulsa el botón principal tiene que aterrizar
 * en algo que pueda leer, no en un registro en construcción.
 *
 * `updatedAt` sigue mandando, pero sólo **dentro** del mismo grado de madurez:
 * entre dos informes igual de terminados, gana el más fresco.
 */
export const informeDestacado: Report = [...reports].sort((a, b) => {
  const porMadurez = madurez[b.status] - madurez[a.status];
  if (porMadurez !== 0) return porMadurez;
  return b.updatedAt.localeCompare(a.updatedAt);
})[0];

/**
 * ¿Hay algo terminado que ofrecer, o todo está en construcción?
 *
 * Sirve para que la portada no prometa con el verbo lo que el estado no
 * sostiene: «Leer el informe» cuando hay algo legible, y otra cosa cuando lo
 * único disponible es una investigación abierta.
 */
export const hayInformeLegible: boolean = madurez[informeDestacado.status] >= 2;
