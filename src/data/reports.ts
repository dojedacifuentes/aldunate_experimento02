import { autor } from './site';
import type { ClaimChange, Report, ReportStatus, Tone } from '@/types';

/**
 * Informes vivos.
 *
 * Un informe vivo no se reemplaza: se versiona. `versions` crece hacia
 * adelante y nunca se edita hacia atrás; el changelog es la prueba de eso.
 *
 * El informe 01 alcanzó su v2.0.0 el 06-09-2026 y dejó de ser borrador: su
 * corpus está contrastado al 100 % y recorrió la ruta de contraste externo que
 * la v0.8.0 declaraba como su limitación estructural. Las versiones anteriores
 * siguen publicadas y legibles, cada una con las cifras que sostenía.
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
    subtitle:
      'Mapeo comparado de capacidades institucionales en una cohorte de once Escuelas y Facultades de Derecho chilenas, diez de ellas en el comparador ordinal · corpus contrastado al 100 %',
    descriptor: 'Corte 06-09-2026 · cohorte de once, comparador de diez',
    executiveSummary:
      'Qué capacidades institucionales en inteligencia artificial han construido once Escuelas y Facultades de Derecho chilenas, con qué grado de formalización, y qué puede afirmarse sobre ellas con evidencia verificable. Las 74 fuentes del corpus están abiertas y contrastadas una por una contra su publicación original, y por primera vez el trabajo incorpora 31 fuentes de terceros: base histórica de proyectos adjudicados de ANID, prensa no universitaria, Colegio de Abogados, Academia Judicial, Comisión Nacional de Acreditación y política pública sectorial. El campo entero cabe en dos años —41 de las 49 iniciativas fechadas empiezan en 2025 o después— y se construye estructura antes que reglas: cinco Facultades sostienen una unidad especializada en operación y una sola ha dictado norma propia sobre uso de inteligencia artificial. Ninguna de las 53 iniciativas acredita haber medido su efecto sobre el aprendizaje jurídico, y la consulta exhaustiva de los 49.014 proyectos adjudicados por ANID desde 1982 convierte esa laguna en hecho: no existe un solo proyecto, de ninguna universidad chilena y en ningún año, sobre enseñanza del Derecho con inteligencia artificial. El hallazgo que ordena a los demás es que nadie verifica: ni el regulador de acreditación, ni el gremio, ni la política pública tienen mandato sobre lo que una Facultad de Derecho dice de sí misma en esta materia.',
    authors: [autor.name],
    status: 'publicado',
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
        version: '3.0.0',
        date: '2026-09-09',
        status: 'publicado',
        headline: 'El corpus son 96 fuentes y no 74, y la portada ya lo dice',
        summary:
          'El frontis afirmaba en cuatro sitios que el corpus son 74 fuentes y que está verificado al 100 %. El anexo de ampliación, en el mismo documento, declaraba un corpus de 96 con 22 sin contrastar. La cifra correcta es 74 de 96, un 77 %, y sigue siendo alta. Se declaran además dos direcciones publicadas que no resuelven y que la versión anterior no advertía, se ordenan las letras de los anexos —dos llevaban la I y la H no se usaba— y la sección 10 recupera el encabezado y la entrada de índice que nunca tuvo. Ninguna celda se degrada y ninguna posición se mueve.',
        pages: 112,
        reading: 'documento',
        pdf: '/descargas/informe-01-v3.0.0/informe-01-v3.0.0.pdf',
        html: '/descargas/informe-01-v3.0.0/informe-01-v3.0.0.html',
        figures: [
          {
            value: '74',
            unit: '/96',
            label: '77 % del corpus',
            note: 'Fuentes abiertas y contrastadas contra su publicación original. Las 22 de la ronda de ampliación se declaran como tales y no como contrastadas. Más 31 de contraste externo.',
          },
          {
            value: '0',
            label: 'ausencia confirmada',
            note: 'Proyectos ANID sobre enseñanza del Derecho con inteligencia artificial, en 49.014 adjudicados desde 1982.',
          },
          {
            value: '20',
            unit: '/30',
            label: 'el techo real',
            note: 'Índice de formalización más alto del comparador de diez, alcanzado por una sola institución. El promedio de los pisos es 11,4 y la mediana, 11.',
          },
          {
            value: '13',
            unit: '/26',
            label: 'cierres expuestos',
            note: 'Cierres de la matriz que se apoyan en fuentes sin contraste sustantivo, con 25 puntos encima. El análisis de sensibilidad dice que el orden aguanta: lo que se ensancha son las bandas.',
          },
          {
            value: '5',
            unit: '/100',
            label: 'celdas sin concluir',
            note: 'Repartidas en cuatro instituciones. Sólo una de ellas tiene más de una.',
          },
        ],
        changelog: [
          'La portada deja de declarar una confianza que el anexo desmentía. Decía «setenta y cuatro fuentes verificadas una por una» y «Corpus verificado al 100 %», mientras el anexo de ampliación decía que el corpus pasó a 96 y que 22 de ellas no han pasado el contraste sustantivo. Las dos cosas no podían ser ciertas. Se corrigen los cuatro sitios del frontis, el indicador del resumen ejecutivo y los cinco pasajes del cuerpo que argumentaban sobre ese 100 %. La cifra que se publica es 74 de 96, un 77 %.',
          'Se declaran dos direcciones rotas que la versión anterior no advertía. El anexo advertía de dos fuentes irrecuperables; son cuatro. Además de la resolución de la Universidad Central y del documento escaneado de la Universidad Autónoma, tampoco resuelven la referencia del seminario de la Pontificia Universidad Católica de Chile ni la del curso de la Universidad del Desarrollo, que sostienen dos puntos cada una. Un enlace roto que el documento no declara traslada al lector un problema que ya se conocía.',
          'Las cuatro se acotan en vez de dejarse abiertas. El análisis de sensibilidad se amplió de dos escenarios a las cuatro fuentes rotas más la cota superior de los trece cierres expuestos, y el resultado se publica: si las cuatro cayeran a la vez, el orden sólo intercambiaría dos puestos. Lo que se degrada es la resolución del comparador, no el comparador.',
          'Las letras de los anexos dejan de repetirse. El índice publicaba A, B, C, D, E, F, I, G, I: dos anexos con la misma letra, la H sin usar y uno de ellos fuera del orden en que se lee. El registro completo de fuentes pasa a ser el anexo H y la ampliación del corpus, el I, que es el último del documento. No había ninguna cita en prosa a esas dos letras.',
          'La sección 10 recupera su encabezado. Existía —tenía cabecera corriente propia, «10 · Implicancias»— pero no tenía título ni entrada en el índice, que saltaba del 16 al 18. Es la sección donde vive lo más fuerte del documento: las tres ventanas fechadas y lo que cuesta dejarlas pasar. Ahora se puede citar y se puede llegar a ella.',
          'La nota que explicaba los saltos de numeración era falsa en sus dos mitades. Decía que no existían las secciones 2 ni 10, y las dos existen: la 2 son los Objetivos, que el propio índice listaba, y la 10 son las Implicancias. Se reescribe para decir lo que de verdad ocurre.',
          'Ninguna cifra sobre una institución con nombre cambia. Ninguna celda se degrada, ninguna posición se mueve, el corpus y la rúbrica son los de la v2.2.0. Lo que cambia es lo que el documento afirma sobre su propia verificación.',
        ],
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-01-v3.0.0/informe-01-v3.0.0.pdf',
            description:
              'A4 de 112 páginas, con portada de una sola hoja, encabezado, pie y numeración. Es una impresión del mismo HTML: los dos salen del mismo modelo y no pueden divergir. 2,8 MB.',
          },
          {
            format: 'Word',
            label: 'Editar o comentar',
            href: '/descargas/informe-01-v3.0.0/informe-01-v3.0.0.docx',
            description:
              'Documento editable a 12 puntos, con las diecinueve tablas y sin las figuras. Para quien deba anotarlo o devolverlo con control de cambios.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-01-v3.0.0/informe-01-v3.0.0.html',
            description:
              'Un solo archivo, sin dependencias, legible sin conexión y preparado para impresión. Es el mismo que se lee dentro del sitio.',
          },
          {
            format: 'JSON',
            label: 'Matriz de capacidades',
            href: '/descargas/informe-01-v3.0.0/datos/matriz-v2.json',
            description:
              'Las diez capacidades por institución en los dos estados de la enmienda 2.2. De aquí salen las figuras derivadas de la matriz, las tablas del comparador y, desde esta versión, el comparador explorable de esta misma ficha. De ningún otro sitio.',
          },
          {
            format: 'JSON',
            label: 'Fuentes de la segunda ronda',
            href: '/descargas/informe-01-v3.0.0/datos/fuentes-nuevas.json',
            description:
              'Las 22 fuentes de la ronda de ampliación, con su grado documental y su confianza. No están contrastadas y el archivo lo declara: se marcan «Ronda 2» y no «contrastada».',
          },
        ],
        companions: [
          {
            id: 'complemento-pucv',
            title: 'La PUCV como caso de proyección, no como caso comparado',
            version: '1.1',
            date: '2026-09-08',
            summary:
              'Por qué la Pontificia Universidad Católica de Valparaíso se retira del comparador de diez, qué acredita su perfil completo —18 puntos de 30, sin ninguna celda sin concluir— y dónde están los doce que le faltan. Con las cuatro construcciones posibles, un optativo cuyo proyecto final es la medición, y la ventana de decisión con lo que cuesta dejarla pasar.',
            rationale:
              'Quien firma el informe trabaja en el Programa de Derecho, Inteligencia Artificial y Tecnología de esa Escuela. El conflicto es actual, directo y sobre el objeto medido, y hay además un sesgo medible: la PUCV fue una de las tres instituciones del piloto de profundidad, de modo que en un instrumento que puntúa capacidades acreditadas por evidencia pública, haberla investigado más produce mecánicamente una puntuación más alta sin que nada haya cambiado en la institución. Este documento publica su perfil para que la decisión sea auditable, y no puntúa, no ordena y no compara.',
            html: '/descargas/informe-01-v3.0.0/complemento-pucv-v1.1.html',
            artifacts: [
              {
                format: 'PDF',
                label: 'Leer o imprimir',
                href: '/descargas/informe-01-v3.0.0/complemento-pucv-v1.1.pdf',
                description: 'A4 de 25 páginas, con el perfil de capacidades y el dossier de evidencia completo en anexo.',
              },
              {
                format: 'Word',
                label: 'Editar o comentar',
                href: '/descargas/informe-01-v3.0.0/complemento-pucv-v1.1.docx',
                description: 'Documento editable a 12 puntos. El complemento no cambia en esta versión: viaja con ella para que sus dos documentos estén en la misma carpeta.',
              },
              {
                format: 'HTML',
                label: 'Abrir el documento autónomo',
                href: '/descargas/informe-01-v3.0.0/complemento-pucv-v1.1.html',
                description: 'Un solo archivo, sin dependencias, legible sin conexión y preparado para impresión.',
              },
            ],
          },
        ],
      },
      {
        version: '2.2.0',
        date: '2026-09-09',
        status: 'publicado',
        headline: 'El informe deja de narrarse a sí mismo, y sus tablas se pueden leer',
        summary:
          'El documento arrastraba 69 pasajes escritos como comparación con versiones que el lector no tiene delante: «la v0.8.0 sólo podía decir», «eran 31 en la versión anterior». Quedan tres, y las tres nombran una ronda de trabajo de campo, no una versión. El diff vive donde corresponde, que es esta ficha. En paralelo, las cabeceras de tabla dejan de partirse a mitad de palabra —eran 33— y tres figuras se rehacen: la de cobertura llevaba dentro una marca de «hasta aquí llegaba la versión anterior», y la de conclusiones tenía los rótulos tapados por las barras.',
        pages: 112,
        reading: 'documento',
        pdf: '/descargas/informe-01-v2.2.0/informe-01-v2.2.0.pdf',
        html: '/descargas/informe-01-v2.2.0/informe-01-v2.2.0.html',
        figures: [
          {
            value: '74',
            unit: '/74',
            label: '100 % del corpus',
            note: 'Fuentes públicas abiertas y contrastadas contra su publicación original, más 31 de contraste externo.',
          },
          {
            value: '0',
            label: 'ausencia confirmada',
            note: 'Proyectos ANID sobre enseñanza del Derecho con inteligencia artificial, en 49.014 adjudicados desde 1982.',
          },
          {
            value: '20',
            unit: '/30',
            label: 'el techo real',
            note: 'Índice de formalización más alto del comparador de diez, alcanzado por una sola institución. El promedio de los pisos es 11,4 y la mediana, 11.',
          },
          {
            value: '2',
            unit: '/10',
            label: 'norma propia',
            note: 'Facultades del comparador con instrumento normativo propio sobre uso de IA, con acto citable.',
          },
          {
            value: '5',
            unit: '/100',
            label: 'celdas sin concluir',
            note: 'Repartidas en cuatro instituciones. Sólo una de ellas tiene más de una.',
          },
        ],
        changelog: [
          'El documento afirma; el sitio versiona. El cuerpo llevaba 69 pasajes escritos como comparación con versiones anteriores, repartidos por el resumen ejecutivo, los ocho hallazgos, siete puntos de las conclusiones, los pies de figura y dos figuras. Quien recibe el informe no ha leído el anterior: para ese lector cada uno de esos pasajes compara contra algo que no tiene delante. Se reescriben en presente, con su evidencia. Quedan tres menciones y las tres nombran una ronda de trabajo de campo, no una versión.',
          'El frontis pasa de dos registros de cambios a una nota. Abría con tres párrafos sobre lo que corregía la versión anterior y seguía con una lista de seis bloques sobre lo que había corregido la anterior a ésa: 5.710 caracteres de historia editorial antes del índice. Queda una nota de un párrafo y se conserva la caja que explica por qué la cohorte es de once y el comparador de diez, que es una regla de lectura y no un cambio.',
          'Las cabeceras de tabla dejan de partirse a mitad de palabra. El documento traía `overflow-wrap:anywhere` sobre `td` y `th` —una regla puesta para que una URL sin espacios no desbordara su celda— y el navegador la aplicaba a todo: en una columna de 4,6 mm se leía «PRESEN / CIA», «TRANSF / ERENCI / A» y un «PISO» roto letra a letra en vertical. Eran 33 celdas. Ahora son cero.',
          'La matriz del anexo C abrevia sus diez columnas y declara las abreviaturas; el anexo D deja de repetirla. Ese anexo traía, en una columna estrecha, los diez pares «capacidad + puntos» de cada institución como texto corrido: cuatro líneas por fila con la misma información que el anexo C dibuja dos páginas antes. Se retira y la nota dice dónde está el detalle.',
          'Tres figuras se rehacen desde sus datos. La de cobertura llevaba dentro una marca de «hasta aquí llegaba la versión anterior» y una leyenda que la explicaba; ahora dice cuánto se recorrió y marca el piloto de profundidad. La de conclusiones escribía rótulos de hasta 85 caracteres sin ancho máximo y las barras los tapaban desde la mitad; ahora el texto se parte dentro de su columna. La cronología tenía la anotación de la banda encima de la cifra de una barra.',
          'Las cifras se alinean por columna. Las tablas heredaban la numeración de estilo antiguo del cuerpo, correcta en prosa y pésima en una tabla: los dígitos suben y bajan y la columna deja de leerse. Las columnas numéricas pasan a numeración tabular y alineación a la derecha.',
          'Una prueba nueva impide que la narración vuelva. `informes.test.ts` comprueba que el cuerpo del documento vigente no contenga comparaciones con versiones anteriores, excluyendo el frontis —que es donde la nota corresponde— y los encabezados corrientes. Y `tools/informes/lector/verificar-maqueta.mjs` mide sobre el documento publicado las palabras partidas, las tablas que se salen de la caja y los rótulos de figura que pisan una barra.',
          'Ninguna cifra sobre las instituciones cambia. El corpus, las fuentes, la rúbrica y el comparador son los de la v2.1.0. Lo que cambia es cómo se lee.',
        ],
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-01-v2.2.0/informe-01-v2.2.0.pdf',
            description:
              'A4 de 112 páginas, con portada de una sola hoja, encabezado, pie y numeración. Es una impresión del mismo HTML: los dos salen del mismo modelo y no pueden divergir. 2,7 MB.',
          },
          {
            format: 'Word',
            label: 'Editar o comentar',
            href: '/descargas/informe-01-v2.2.0/informe-01-v2.2.0.docx',
            description:
              'Documento editable a 12 puntos, con las diecinueve tablas y sin las figuras. Para quien deba anotarlo o devolverlo con control de cambios.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-01-v2.2.0/informe-01-v2.2.0.html',
            description:
              'Un solo archivo, sin dependencias, legible sin conexión y preparado para impresión. Es el mismo que se lee dentro del sitio.',
          },
          {
            format: 'JSON',
            label: 'Matriz de capacidades',
            href: '/descargas/informe-01-v2.2.0/datos/matriz-v2.json',
            description:
              'Las diez capacidades por institución en los dos estados de la enmienda 2.2. De aquí salen las cuatro figuras derivadas de la matriz y las tres tablas del comparador, y de ningún otro sitio.',
          },
          {
            format: 'JSON',
            label: 'Fuentes de la segunda ronda',
            href: '/descargas/informe-01-v2.2.0/datos/fuentes-nuevas.json',
            description:
              'Las 22 fuentes de la ronda de ampliación, con su grado documental y su confianza. No están contrastadas y el archivo lo declara: se marcan «Ronda 2» y no «contrastada».',
          },
        ],
        companions: [
          {
            id: 'complemento-pucv',
            title: 'La PUCV como caso de proyección, no como caso comparado',
            version: '1.1',
            date: '2026-09-08',
            summary:
              'Por qué la Pontificia Universidad Católica de Valparaíso se retira del comparador de diez, qué acredita su perfil completo —18 puntos de 30, sin ninguna celda sin concluir— y dónde están los doce que le faltan. Con las cuatro construcciones posibles, un optativo cuyo proyecto final es la medición, y la ventana de decisión con lo que cuesta dejarla pasar.',
            rationale:
              'Quien firma el informe trabaja en el Programa de Derecho, Inteligencia Artificial y Tecnología de esa Escuela. El conflicto es actual, directo y sobre el objeto medido, y hay además un sesgo medible: la PUCV fue una de las tres instituciones del piloto de profundidad, de modo que en un instrumento que puntúa capacidades acreditadas por evidencia pública, haberla investigado más produce mecánicamente una puntuación más alta sin que nada haya cambiado en la institución. Este documento publica su perfil para que la decisión sea auditable, y no puntúa, no ordena y no compara.',
            html: '/descargas/informe-01-v2.2.0/complemento-pucv-v1.1.html',
            artifacts: [
              {
                format: 'PDF',
                label: 'Leer o imprimir',
                href: '/descargas/informe-01-v2.2.0/complemento-pucv-v1.1.pdf',
                description: 'A4 de 25 páginas, con el perfil de capacidades y el dossier de evidencia completo en anexo.',
              },
              {
                format: 'Word',
                label: 'Editar o comentar',
                href: '/descargas/informe-01-v2.2.0/complemento-pucv-v1.1.docx',
                description: 'Documento editable, para devolverlo con observaciones.',
              },
              {
                format: 'HTML',
                label: 'Abrir el documento autónomo',
                href: '/descargas/informe-01-v2.2.0/complemento-pucv-v1.1.html',
                description: 'Un solo archivo, legible sin conexión.',
              },
            ],
          },
        ],
      },
      {
        version: '2.1.0',
        date: '2026-09-08',
        status: 'publicado',
        headline:
          'La institución apartada sale también de las figuras y de la prosa, y las puntuaciones se leen',
        summary:
          'La v2.0.0 publicaba dos matrices a la vez: sus tablas aplicaban la ronda de ampliación sobre diez instituciones, sin la PUCV, y sus cuatro figuras derivadas de la matriz seguían dibujando once con la matriz anterior. El resumen ejecutivo decía que la PUCV encabezaba el comparador seis páginas antes de que la sección 8 explicara por qué no estaba en él. Esta versión aplica a las figuras y a la prosa lo que las tablas ya aplicaban, y rehace la lectura de dónde se pierden los puntos.',
        pages: 113,
        reading: 'documento',
        pdf: '/descargas/informe-01-v2.1.0/informe-01-v2.1.0.pdf',
        html: '/descargas/informe-01-v2.1.0/informe-01-v2.1.0.html',
        figures: [
          {
            value: '74',
            unit: '/74',
            label: '100 % del corpus',
            note: 'Fuentes públicas abiertas y contrastadas contra su publicación original. El corpus no cambia en esta versión.',
          },
          {
            value: '0',
            label: 'ausencia confirmada',
            note: 'Proyectos ANID sobre enseñanza del Derecho con inteligencia artificial, en 49.014 adjudicados desde 1982.',
          },
          {
            value: '20',
            unit: '/30',
            label: 'el techo real',
            note: 'Índice de formalización más alto del comparador de diez, alcanzado por una sola institución. Las figuras de la v2.0.0 decían 18 y dos.',
          },
          {
            value: '2',
            unit: '/10',
            label: 'norma propia',
            note: 'Facultades del comparador con instrumento normativo propio sobre uso de IA, con acto citable. El promedio de los pisos es 11,4 y la mediana, 11.',
          },
          {
            value: '5',
            unit: '/100',
            label: 'celdas sin concluir',
            note: 'Las figuras de la v2.0.0 dibujaban 31 sobre 110. Bajan porque la figura pasa a leer la misma matriz que sus propias tablas.',
          },
        ],
        changelog: [
          'La contradicción que corrige. La v2.0.0 publicaba la matriz de la ronda de ampliación en sus tablas —el orden de la sección 4, el anexo C y el cálculo del anexo D, los tres sobre diez instituciones sin la PUCV— y la matriz anterior en sus cuatro figuras derivadas de ella, sobre once y con la PUCV encabezando. Las dos salían de sitios distintos, así que nada impedía que divergieran. El resumen ejecutivo afirmaba que la PUCV «encabeza el comparador» y la sección 8 explicaba, seis páginas después, por qué está fuera de él.',
          'Las cuatro figuras se rehacen desde la matriz. La del comparador, la de comprobación, la matriz de capacidades y su lectura por filas se generan ahora desde `matriz-v2.json` con un motor publicado en el repositorio, de modo que no puedan volver a decir algo distinto de las tablas que tienen al lado. Las otras ocho figuras no dependen de la matriz y se conservan intactas.',
          'Cifras que cambian, y son las que se envían. El techo del comparador pasa de 18 a 20 puntos y lo alcanza una sola institución en vez de dos; el promedio de los pisos, de 9,4 a 11,4; las celdas sin concluir, de 31 sobre 110 a 5 sobre 100; y seis de las diez instituciones quedan con banda cerrada, ninguna con banda ancha. La v2.0.0 permanece publicada con sus cifras, y su contradicción queda declarada dentro de esta versión.',
          'La lectura de las puntuaciones se rehace entera. Donde antes había una lista de recuentos, ahora hay tres formas de ausencia con nombre: la unánime —evaluación de efecto obtiene 0 de 30, sin una sola excepción—, la bimodal —investigación reparte sus puntos entre cuatro instituciones con proyecto adjudicado y cinco con nada, casi sin término medio— y la de umbral —transferencia, donde ninguna obtiene cero y siete obtienen exactamente un punto—. La forma de cada pérdida dice qué haría falta para revertirla; el agregado no.',
          'La comprobación contra el sesgo de cobertura queda más fuerte y menos cómoda. La Universidad Autónoma de Chile recorre cinco rutas de trece y obtiene 17 puntos; la Universidad de Chile recorre doce y obtiene 12. La correlación entre cobertura e índice es de 0,34 sobre las diez. La afirmación de la v2.0.0 —que las dos instituciones con más rutas estaban entre las tres de mayor piso— deja de ser cierta y se retira.',
          'El complemento incorpora el perfil que le faltaba. El documento de la PUCV pasa de v1.0 a v1.1 y estrena una sección 4 con sus diez capacidades, su puntuación de 18 sobre 30 y el detalle de los doce puntos que faltan, repartidos en tres formas: cinco a los que sólo les falta el instrumento citable, cuatro que existen en la universidad y no en la Escuela, y tres de una capacidad que no consta en ninguna Facultad del país. Nueve de los doce no dependen de construir nada.',
          'La portada dejó de correrse. En impresión medía 255,6 mm contra una caja de 245: se desbordaba diez milímetros, el pie caía partido en una segunda hoja y todo lo demás quedaba desplazado. La causa era un espaciador fijo de 55 mm entre la cabecera y el título. Ahora la portada se fija al alto exacto de su caja y reparte el aire sobrante, de modo que un título de cuatro líneas se come el aire en vez de empujar el pie fuera de la página.',
          'La extensión declarada se corrige. La v2.0.0 anunciaba 37 páginas, que eran las del PDF de la cadena de origen; el PDF que se sirve se imprime desde el mismo HTML a 12 puntos y tiene 113. La cifra que se publica es la del archivo que se descarga.',
        ],
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-01-v2.1.0/informe-01-v2.1.0.pdf',
            description:
              'A4 de 113 páginas, con portada de una sola hoja, encabezado, pie y numeración. Es una impresión del mismo HTML: los dos salen del mismo modelo y no pueden divergir. 2,8 MB.',
          },
          {
            format: 'Word',
            label: 'Editar o comentar',
            href: '/descargas/informe-01-v2.1.0/informe-01-v2.1.0.docx',
            description:
              'Documento editable a 12 puntos, con las diecinueve tablas y sin las figuras, igual que el de la versión anterior. Para quien deba anotarlo o devolverlo con control de cambios.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-01-v2.1.0/informe-01-v2.1.0.html',
            description:
              'Un solo archivo, sin dependencias, legible sin conexión y preparado para impresión. Es el mismo que se lee dentro del sitio.',
          },
          {
            format: 'JSON',
            label: 'Matriz de capacidades',
            href: '/descargas/informe-01-v2.1.0/datos/matriz-v2.json',
            description:
              'Las diez capacidades por institución en los dos estados de la enmienda 2.2. Esta versión publica `.v2`, la de la ronda de ampliación, y de ella salen las cuatro figuras y las tres tablas del comparador.',
          },
          {
            format: 'JSON',
            label: 'Fuentes de la segunda ronda',
            href: '/descargas/informe-01-v2.1.0/datos/fuentes-nuevas.json',
            description:
              'Las 22 fuentes de la ronda de ampliación, con su grado documental y su confianza. No están contrastadas y el archivo lo declara: se marcan «Ronda 2» y no «contrastada».',
          },
        ],
        companions: [
          {
            id: 'complemento-pucv',
            title: 'La PUCV como caso de proyección, no como caso comparado',
            version: '1.1',
            date: '2026-09-08',
            summary:
              'Por qué la Pontificia Universidad Católica de Valparaíso se retira del comparador de diez, qué acredita su perfil completo —18 puntos de 30, sin ninguna celda sin concluir— y dónde están los doce que le faltan. Con las cuatro construcciones posibles, un optativo cuyo proyecto final es la medición, y la ventana de decisión con lo que cuesta dejarla pasar.',
            rationale:
              'Quien firma el informe trabaja en el Programa de Derecho, Inteligencia Artificial y Tecnología de esa Escuela. El conflicto es actual, directo y sobre el objeto medido, y hay además un sesgo medible: la PUCV fue una de las tres instituciones del piloto de profundidad, de modo que en un instrumento que puntúa capacidades acreditadas por evidencia pública, haberla investigado más produce mecánicamente una puntuación más alta sin que nada haya cambiado en la institución. Este documento publica su perfil para que la decisión sea auditable, y no puntúa, no ordena y no compara.',
            html: '/descargas/informe-01-v2.1.0/complemento-pucv-v1.1.html',
            artifacts: [
              {
                format: 'PDF',
                label: 'Leer o imprimir',
                href: '/descargas/informe-01-v2.1.0/complemento-pucv-v1.1.pdf',
                description: 'A4 de 25 páginas, con el perfil de capacidades y el dossier de evidencia completo en anexo.',
              },
              {
                format: 'Word',
                label: 'Editar o comentar',
                href: '/descargas/informe-01-v2.1.0/complemento-pucv-v1.1.docx',
                description: 'Documento editable, para devolverlo con observaciones.',
              },
              {
                format: 'HTML',
                label: 'Abrir el documento autónomo',
                href: '/descargas/informe-01-v2.1.0/complemento-pucv-v1.1.html',
                description: 'Un solo archivo, legible sin conexión.',
              },
            ],
          },
        ],
      },
      {
        version: '2.0.0',
        date: '2026-09-06',
        status: 'publicado',
        headline: 'Deja de ser borrador: corpus contrastado al 100 % y contraste externo cerrado',
        summary:
          'Las 36 fuentes que la v0.8.0 dejaba sin abrir se contrastaron contra su publicación original, y por primera vez el informe sale del círculo de lo que las universidades dicen de sí mismas. Con eso desaparecen las dos razones por las que la versión anterior se declaraba borrador, y aparecen dos capítulos que antes no podían escribirse: el comparador ordinal y la escala internacional.',
        pages: 37,
        reading: 'documento',
        pdf: '/descargas/informe-01-v2.0.0/informe-01-v2.0.0.pdf',
        html: '/descargas/informe-01-v2.0.0/informe-01-v2.0.0.html',
        figures: [
          {
            value: '74',
            unit: '/74',
            label: '100 % del corpus',
            note: 'Fuentes públicas abiertas y contrastadas contra su publicación original. En la v0.8.0 eran 38.',
          },
          {
            value: '0',
            label: 'ausencia confirmada',
            note: 'Proyectos ANID sobre enseñanza del Derecho con inteligencia artificial, en 49.014 adjudicados desde 1982.',
          },
          {
            value: '18',
            unit: '/30',
            label: 'el techo real',
            note: 'Índice de formalización más alto de la cohorte, alcanzado por dos instituciones.',
          },
          {
            value: '1',
            unit: '/11',
            label: 'norma propia',
            note: 'Facultades con instrumento normativo propio sobre uso de IA en evaluación.',
          },
          {
            value: '31',
            unit: '/110',
            label: 'celdas sin concluir',
            note: 'Eran 47 en la v0.8.0. Bajan porque se recorrieron tres rutas del protocolo en las once instituciones.',
          },
        ],
        changelog: [
          'Verificación sustantiva completa. Las 36 fuentes que la v0.8.0 dejaba sin contrastar se abrieron y se compararon contra su publicación original: el corpus pasa de 51 % a 100 % contrastado. Aparecieron 23 divergencias, doce de ellas materiales, y todas se publican en el anexo B en lugar de corregirse en silencio.',
          'Ruta 13 recorrida por primera vez. La v0.8.0 declaraba que ninguna de sus 74 fuentes provenía de contraste externo, y que ésa era su limitación estructural. Esta versión la recorre en las once instituciones —base histórica de ANID, prensa no universitaria, Colegio de Abogados, Academia Judicial, Comisión Nacional de Acreditación y política pública sectorial— y 31 fuentes de terceros entran al registro.',
          'La ausencia de evaluación deja de ser una laguna y pasa a ser un hecho. La v0.8.0 sólo podía decir que no había encontrado medición de efecto allí donde buscó. La consulta exhaustiva de los 49.014 proyectos adjudicados por ANID desde 1982 cierra la pregunta por el lado del financiamiento público: ningún proyecto, en ningún año, sobre enseñanza del Derecho con inteligencia artificial.',
          'Comparador ordinal, con su incertidumbre dentro. La v0.8.0 se prohibía toda comparación ordinal. Esta versión publica una, porque la cobertura mejoró lo suficiente para hacerla defendible. El índice se publica como banda —piso y techo— y no como número: quien tiene celdas sin concluir aparece con una banda ancha, y el lector ve la duda en la misma figura donde ve la posición.',
          'Escala internacional. Un capítulo de referencia externa con las políticas de facultad, los currículos obligatorios y la literatura experimental disponibles en el mundo. Sirve para calibrar, y en dos casos corrige la impresión de rezago: varias ausencias que parecían chilenas resultan ser globales.',
          'Celdas sin concluir: de 47 a 31. Al recorrer tres rutas del protocolo en las once instituciones, dieciséis celdas que la v0.8.0 no podía resolver quedan resueltas. La cobertura en rutas pasa de 61 a 88 de 143 posibles, y la asimetría entre el piloto y el resto baja de 2,4 : 1 a 1,8 : 1.',
          'La PUCV sale del comparador y pasa a un documento complementario. Una declaración de intereses advierte al lector pero no corrige el dato: si quien firma tiene un interés en una de las instituciones que ordena, la advertencia traslada al lector un problema que era del método. El comparador cubre diez instituciones y la PUCV se examina aparte, como caso de proyección y no como caso comparado.',
          'La enmienda metodológica 2.2, aditiva y sin recodificar ningún registro previo. El estado «en operación» se desdobla para distinguir la capacidad que funciona de la que funciona y publica el instrumento que la sostiene, y el comparador ordinal lleva la incertidumbre dentro del objeto en vez de al pie.',
        ],
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-01-v2.0.0/informe-01-v2.0.0.pdf',
            description:
              'A4 de 37 páginas, con portada, encabezado, pie y numeración. Es una impresión del mismo HTML: los dos salen del mismo modelo y no pueden divergir. 3,5 MB.',
          },
          {
            format: 'Word',
            label: 'Editar o comentar',
            href: '/descargas/informe-01-v2.0.0/informe-01-v2.0.0.docx',
            description:
              'Documento editable, para quien deba anotarlo o devolverlo con control de cambios. No es la fuente editorial: es una salida más de la misma cadena.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-01-v2.0.0/informe-01-v2.0.0.html',
            description:
              'Un solo archivo, sin dependencias, legible sin conexión y preparado para impresión. Es el mismo que se lee dentro del sitio.',
          },
          {
            format: 'JSON',
            label: 'Matriz de capacidades',
            href: '/descargas/informe-01-v2.0.0/datos/matriz-v2.json',
            description:
              'Las diez capacidades por institución en los dos estados de la enmienda 2.2, con la tabla de puntos del comparador y el registro de qué cambió respecto de la v0.8.0.',
          },
          {
            format: 'JSON',
            label: 'Fuentes de la segunda ronda',
            href: '/descargas/informe-01-v2.0.0/datos/fuentes-nuevas.json',
            description:
              'Las 22 fuentes de la ronda de ampliación, con su grado documental y su confianza. No están contrastadas y el archivo lo declara: se marcan «Ronda 2» y no «contrastada».',
          },
        ],
        companions: [
          {
            id: 'complemento-pucv',
            title: 'La PUCV como caso de proyección, no como caso comparado',
            version: '1.0',
            date: '2026-09-06',
            summary:
              'Por qué la Pontificia Universidad Católica de Valparaíso se retira del comparador de diez, y qué puede proyectarse sobre la base que ya existe: cuatro construcciones, un optativo cuyo proyecto final es la medición, y la ventana de decisión con lo que cuesta dejarla pasar.',
            rationale:
              'Quien firma el informe trabaja en el Programa de Derecho, Inteligencia Artificial y Tecnología de esa Escuela. El conflicto es actual, directo y sobre el objeto medido, y hay además un sesgo medible: la PUCV fue una de las tres instituciones del piloto de profundidad, de modo que en un instrumento que puntúa capacidades acreditadas por evidencia pública, haberla investigado más produce mecánicamente una puntuación más alta sin que nada haya cambiado en la institución. Este documento no puntúa, no ordena y no compara.',
            html: '/descargas/informe-01-v2.0.0/complemento-pucv-v1.0.html',
            artifacts: [
              {
                format: 'PDF',
                label: 'Leer o imprimir',
                href: '/descargas/informe-01-v2.0.0/complemento-pucv-v1.0.pdf',
                description: 'A4, con el dossier de evidencia completo en anexo.',
              },
              {
                format: 'Word',
                label: 'Editar o comentar',
                href: '/descargas/informe-01-v2.0.0/complemento-pucv-v1.0.docx',
                description: 'Documento editable, para devolverlo con observaciones.',
              },
              {
                format: 'HTML',
                label: 'Abrir el documento autónomo',
                href: '/descargas/informe-01-v2.0.0/complemento-pucv-v1.0.html',
                description: 'Un solo archivo, legible sin conexión.',
              },
            ],
          },
        ],
      },
      {
        version: '0.8.0',
        date: '2026-09-04',
        status: 'borrador',
        headline: 'Último borrador: la regla de adyacencia se aplica a los once',
        summary:
          'Una iniciativa del ámbito vecino de la tecnología deja de acreditar una capacidad de inteligencia artificial, y la corrección alcanza a los siete registros adyacentes y no sólo a la PUCV. Es la versión que el sitio reconstruye con sus propios componentes: fichas institucionales, matriz navegable y figuras.',
        pages: 72,
        reading: 'nativo',
        pdf: '/descargas/informe-01-borrador-academico-v0.8.0/informe-01-borrador-academico-v0.8.0.pdf',
        html: '/descargas/informe-01-borrador-academico-v0.8.0/informe-01-borrador-academico-v0.8.0.html',
        figures: [
          {
            value: '38',
            unit: '/74',
            label: '51 % del corpus',
            note: 'Fuentes contrastadas contra su publicación original en esta versión.',
          },
          {
            value: '47',
            unit: '/110',
            label: 'celdas sin concluir',
            note: 'Sin resolver porque la ruta del protocolo que las habría acreditado no se recorrió.',
          },
          {
            value: '0',
            label: 'comparaciones ordinales',
            note: 'Esta versión se prohibía toda ordenación: con la cobertura desigual, ordenar habría medido el trabajo de campo.',
          },
        ],
        changelog: [
          'Una iniciativa adyacente deja de acreditar una capacidad de inteligencia artificial. El registro ya distinguía en «dirección» si una iniciativa usa IA, la estudia como objeto jurídico, hace las dos cosas o pertenece al ámbito vecino de la tecnología y la innovación sin componente de IA documentado; la capa de capacidades ignoraba esa distinción, y un laboratorio de innovación legal acreditaba «unidad especializada» igual que un programa de Derecho e Inteligencia Artificial.',
          'La corrección alcanza a los siete registros adyacentes, repartidos en cinco instituciones y no sólo en la PUCV: una regla que se aplicara a una sola sería el método escrito para un resultado. Los siete se abrieron después contra sus fuentes, uno por uno, y ese contraste corrigió tres clasificaciones y dejó cuatro en pie.',
          'Estado nuevo, «sólo adyacente». Descontar la iniciativa y dejar caer la celda en «no localizada» habría afirmado que se buscó una estructura y no se encontró ninguna, y es falso: se encontró una, y lo que no consta es su componente de inteligencia artificial. El estado dice eso y no más. Tras la revisión de los siete registros no queda ninguna celda en ese estado, y el vocabulario se conserva porque la regla sigue vigente: describe qué haría el instrumento si volviera a darse el caso.',
          'Revisión de los siete registros adyacentes contra sus fuentes. El Departamento de Derecho y Tecnología de la Universidad Católica acredita evidencia propia de inteligencia artificial —el análisis de su ética, con fuente contrastada— y el CE3 de la Universidad de Chile acredita dos: la excepción de derechos de autor para el entrenamiento de sistemas y el seminario de inteligencia artificial y acceso a la justicia. Las dos unidades vuelven a constar en operación. El programa [genIA] de la Universidad de Concepción figuraba como adyacente a la inteligencia artificial por una razón que corresponde a otro campo del registro. El diplomado de la Universidad Andrés Bello se reclasifica por el ámbito declarado del programa y no por evidencia de contenido, y queda como primer registro de la cola de verificación.',
          'El documento adopta el sistema editorial del Informe 02: papel claro con oscuro disponible y recordado, Spectral para la prosa, IBM Plex Sans para los títulos y Plex Mono para los metadatos, raíl de navegación con el índice derivado de los propios encabezados, barra de progreso y una paleta de cinco tintas de la que ahora derivan también los colores de las figuras.',
          'La declaración de intereses deja de exponer el proceso privado de elaboración. El conflicto se conserva —es práctica académica— en primera persona del autor; se retiran el destinatario del borrador y los terceros nombrados, que no han escrito el informe. El manifiesto declaraba además el protocolo 2.0 cuando el vigente es el 2.1.',
        ],
        artifacts: [
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
      },
      {
        version: '0.7.0',
        date: '2026-09-04',
        status: 'borrador',
        headline: 'Enmienda metodológica 2.1, matriz de capacidades y motor de gráficos propio',
        pages: 72,
        reading: 'documento',
        pdf: '/descargas/informe-01-borrador-academico-v0.7.0/informe-01-borrador-academico-v0.7.0.pdf',
        html: '/descargas/informe-01-borrador-academico-v0.7.0/informe-01-borrador-academico-v0.7.0.html',
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-01-borrador-academico-v0.7.0/informe-01-borrador-academico-v0.7.0.pdf',
            description: 'El documento en A4, tal como se publicó en su día.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-01-borrador-academico-v0.7.0/informe-01-borrador-academico-v0.7.0.html',
            description:
              'Un solo archivo, legible sin conexión. Conserva la maqueta de su versión.',
          },
          {
            format: 'Markdown',
            label: 'Usar como fuente editorial',
            href: '/descargas/informe-01-borrador-academico-v0.7.0/informe-01-borrador-academico-v0.7.0.md',
            description: 'El mismo documento en texto plano, reutilizable.',
          },
          {
            format: 'ZIP',
            label: 'Descargar el paquete reproducible',
            href: '/descargas/informe-01-borrador-academico-v0.7.0.zip',
            description:
              'Documento, dataset en CSV, representación JSON, manifiesto y controles de integridad SHA-256.',
          },
        ],
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
        headline: 'Primera verificación sustantiva: 38 de 74 fuentes contrastadas',
        pages: 56,
        reading: 'documento',
        pdf: '/descargas/informe-01-borrador-academico-v0.6.0/informe-01-borrador-academico-v0.6.0.pdf',
        html: '/descargas/informe-01-borrador-academico-v0.6.0/informe-01-borrador-academico-v0.6.0.html',
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-01-borrador-academico-v0.6.0/informe-01-borrador-academico-v0.6.0.pdf',
            description: 'El documento en A4, tal como se publicó en su día.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-01-borrador-academico-v0.6.0/informe-01-borrador-academico-v0.6.0.html',
            description:
              'Un solo archivo, legible sin conexión. Conserva la maqueta de su versión.',
          },
          {
            format: 'Markdown',
            label: 'Usar como fuente editorial',
            href: '/descargas/informe-01-borrador-academico-v0.6.0/informe-01-borrador-academico-v0.6.0.md',
            description: 'El mismo documento en texto plano, reutilizable.',
          },
          {
            format: 'ZIP',
            label: 'Descargar el paquete reproducible',
            href: '/descargas/informe-01-borrador-academico-v0.6.0.zip',
            description:
              'Documento, dataset en CSV, representación JSON, manifiesto y controles de integridad SHA-256.',
          },
        ],
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
        headline: 'El corpus se vuelve dataset canónico: seis CSV y 74 fuentes',
        reading: 'documento',
        pdf: '/descargas/informe-01-mapeo-evidencia-v0.5.0/informe-01-mapeo-evidencia-v0.5.0.pdf',
        html: '/descargas/informe-01-mapeo-evidencia-v0.5.0/informe-01-mapeo-evidencia-v0.5.0.html',
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-01-mapeo-evidencia-v0.5.0/informe-01-mapeo-evidencia-v0.5.0.pdf',
            description: 'El documento en A4, tal como se publicó en su día.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-01-mapeo-evidencia-v0.5.0/informe-01-mapeo-evidencia-v0.5.0.html',
            description:
              'Un solo archivo, legible sin conexión. Conserva la maqueta de su versión.',
          },
          {
            format: 'Markdown',
            label: 'Usar como fuente editorial',
            href: '/descargas/informe-01-mapeo-evidencia-v0.5.0/informe-01-mapeo-evidencia-v0.5.0.md',
            description: 'El mismo documento en texto plano, reutilizable.',
          },
          {
            format: 'ZIP',
            label: 'Descargar el paquete reproducible',
            href: '/descargas/informe-01-mapeo-evidencia-v0.5.0.zip',
            description:
              'Documento, dataset en CSV, representación JSON, manifiesto y controles de integridad SHA-256.',
          },
        ],
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
        headline: 'Ronda 2 de fusión: el corpus pasa de 43 a 72 fuentes',
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
        headline: 'Kit canónico de investigación inter-IA y cohorte fijada en once',
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
        headline: 'Apertura del informe: alcance, variables y esquema de registro',
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
        headline: 'Primer corpus: 43 fuentes públicas de tres investigaciones profundas',
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
      '¿Qué omiten las instituciones observadas? La v2.0.0 incorporó 31 fuentes de terceros y con eso confirmó lo que las universidades dicen; lo que ninguna fuente externa puede decir es qué decidieron no publicar.',
      '¿Ha medido alguna Facultad chilena el efecto de una de sus actividades de IA con recursos propios y sin publicarlo? Por el lado del financiamiento público la pregunta está cerrada: cero proyectos en 49.014 adjudicados por ANID desde 1982.',
      '¿Qué diría la matriz de capacidades si se recorrieran las rutas que faltan? La v2.0.0 bajó las celdas sin concluir de 47 a 31 de 110, y esas 31 siguen midiendo dónde alcanzó a buscar la investigación y no lo que hacen las Facultades.',
      '¿Debe «verificado» significar responsabilidad editorial o ejecución material del contraste? Los registros llevan la firma de quien responde por ellos, y el contraste lo ejecutó un modelo bajo ese encargo.',
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
    updatedAt: '2026-09-06',
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
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-02-transformacion-ensenanza-v0.2.0.pdf',
            description: 'El informe completo en A4, tal como se publicó.',
          },
          {
            format: 'PDF',
            label: 'Resumen ejecutivo',
            href: '/descargas/informe-02-resumen-ejecutivo-v0.2.0.pdf',
            description: 'La versión corta de esta versión.',
          },
          {
            format: 'Word',
            label: 'Editar o comentar',
            href: '/descargas/informe-02-transformacion-ensenanza-v0.2.0.docx',
            description: 'Documento editable de esta versión.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-02-completo-v0.2.0.html',
            description: 'Un solo archivo, legible sin conexión.',
          },
        ],
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
        artifacts: [
          {
            format: 'PDF',
            label: 'Leer o imprimir',
            href: '/descargas/informe-02-transformacion-ensenanza-v0.3.0.pdf',
            description:
              'El informe completo en A4, con sus figuras y su registro de fuentes.',
          },
          {
            format: 'PDF',
            label: 'Resumen ejecutivo',
            href: '/descargas/informe-02-resumen-ejecutivo-v0.3.0.pdf',
            description:
              'La versión corta, para quien deba decidir sin leer el informe entero.',
          },
          {
            format: 'Word',
            label: 'Editar o comentar',
            href: '/descargas/informe-02-transformacion-ensenanza-v0.3.0.docx',
            description:
              'Documento editable, para devolverlo con control de cambios.',
          },
          {
            format: 'HTML',
            label: 'Abrir el documento autónomo',
            href: '/descargas/informe-02-completo-v0.3.0.html',
            description: 'Un solo archivo, legible sin conexión.',
          },
        ],
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
