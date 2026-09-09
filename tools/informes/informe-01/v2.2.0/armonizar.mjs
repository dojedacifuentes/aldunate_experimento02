/**
 * De la v2.1.0 a la v2.2.0 · el informe deja de narrarse a sí mismo.
 *
 * La v2.1.0 arrastraba **ochenta y cinco menciones a versiones anteriores**,
 * y sólo dieciséis estaban en el frontis, que es donde corresponden. Las otras
 * sesenta y nueve vivían en el cuerpo: en el resumen ejecutivo, en los ocho
 * hallazgos, en siete pasajes de las conclusiones, en los pies de figura y
 * dentro de dos figuras. «La v0.8.0 sólo podía decir…», «eran 31 en la versión
 * anterior», «esta versión recorre…».
 *
 * Quien recibe este documento no ha leído el anterior. Para ese lector, cada
 * una de esas frases es una comparación con algo que no tiene delante, y el
 * informe se lee como un registro de cambios en vez de como lo que es: una
 * descripción de once Escuelas de Derecho chilenas.
 *
 * **La regla que se adopta: el documento afirma, el sitio versiona.** El
 * cuerpo enuncia en presente y cita su evidencia. El diff completo vive en el
 * changelog de la ficha, que ya lo tiene entero, y en una nota breve del
 * frontis para quien lea el PDF suelto.
 *
 *   node tools/informes/informe-01/v2.2.0/armonizar.mjs
 *
 * Como en la v2.1.0, toda sustitución declara cuántas apariciones espera y el
 * script no escribe nada si una sola no cuadra.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  comparador,
  figuraCapacidades,
  figuraCobertura,
  figuraComparador,
  figuraComprobacion,
  figuraConclusiones,
  figuraCronologia,
  figuraPorCapacidad,
  porCapacidad,
} from '../comparador/figuras.mjs';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..', '..');
const entregas = path.join(
  raíz,
  'content/reports/01_ia_escuelas_derecho_chile/entregas',
);

const ORIGEN = path.join(entregas, 'v2.1.0/informe-01-v2.1.0.html');
const DESTINO = path.join(entregas, 'v2.2.0/informe-01-v2.2.0.html');

const filas = comparador('v2');

const frase = (s) =>
  new RegExp(
    s
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s+'),
    'g',
  );

const CAMBIOS = [];
const cambio = (motivo, busca, pone, veces = 1) =>
  CAMBIOS.push({ motivo, busca, pone, veces });

/* ── 0 · Sello de versión ─────────────────────────────────────────────── */

cambio('Sello de versión en portada, encabezados y pies', /v2\.1\.0/g, 'v2.2.0', 0);

/* ── 1 · Frontis · una nota breve en lugar de dos registros de cambios ── */

cambio(
  'Frontis · la v2.2.0 sucede a la v2.1.0',
  frase('<td>v2.2.0 · sucede a v2.0.0 del 06-09-2026</td>'),
  '<td>v2.2.0 · sucede a v2.1.0 del 08-09-2026</td>',
);

cambio(
  'Índice · la nota comparaba el sumario con el de una versión que el lector no tiene',
  frase(
    '<p style="max-width:150mm">Las secciones 4, 6, 7 y 10 y los anexos B, D, E, F y G no existían en la versión anterior. El resto conserva la numeración de la v0.8.0, para que quien la haya leído encuentre lo mismo en el mismo sitio.</p>',
  ),
  '<p style="max-width:150mm">El cuerpo va numerado del 1 al 12 y los anexos de la A a la I. La ' +
    'numeración salta en dos puntos —no hay sección 2 ni sección 10— porque el sumario se ' +
    'estabilizó antes que el texto y renumerarlo rompería las citas ya hechas.</p>',
);

/**
 * Frontis · dos registros de cambios se convierten en una nota.
 *
 * La v2.1.0 abría con «Qué corrige la v2.1.0» —tres párrafos sobre la
 * contradicción entre sus figuras y sus tablas— y seguía con «Seis cambios de
 * la v2.0.0 respecto de la v0.8.0», una lista de seis bloques. Son cinco mil
 * setecientos bytes de historia editorial antes del índice, para un lector que
 * no ha visto ninguna de las dos versiones citadas.
 *
 * Queda una nota de un párrafo. El registro completo de cada versión sigue
 * publicado en la ficha del informe, junto a la versión que describe. La caja
 * de «Once y diez» se conserva porque no es un cambio: es la regla que hay que
 * conocer para leer cualquier cifra del documento.
 */
cambio(
  'Frontis · los dos registros de cambios se reducen a una nota de versión',
  /<h3 style="margin-top:6mm">Qué corrige la v2\.2\.0<\/h3>[\s\S]*?<div class="box acc" style="margin:5mm 0">/,
  '<h3 style="margin-top:6mm">Nota de versión</h3>\n' +
    ' <p>Ésta es la v2.2.0. Corrige la presentación de la versión que la precede —figuras que no ' +
    'leían la misma matriz que las tablas de al lado, rótulos de columna partidos a mitad de ' +
    'palabra y pasajes escritos como comparación con versiones anteriores— y no toca el corpus, ' +
    'las fuentes ni la rúbrica. Ninguna cifra sobre las instituciones cambia por efecto de esta ' +
    'corrección. Las versiones anteriores siguen publicadas con las cifras que sostenían, y el ' +
    'registro de qué cambió en cada una se publica junto a ella.</p>\n' +
    ' <div class="box acc" style="margin:5mm 0">',
);

cambio(
  'Frontis · fuera la lista de los seis cambios de una versión que ya no es ésta',
  /<h3 style="margin-top:6mm">Seis cambios de la v2\.0\.0 respecto de la v0\.8\.0<\/h3>[\s\S]*?1,8 : 1<\/strong>\.<\/p><\/div>/,
  '',
);

/* ── 2 · Resumen ejecutivo ────────────────────────────────────────────── */

cambio(
  'Resumen ejecutivo · el documento no necesita compararse para decir que no es un borrador',
  frase('A diferencia de su versión anterior, no es un borrador: las 74 fuentes del corpus fueron abiertas y contrastadas una por una contra su publicación original, y por primera vez el trabajo incorpora fuentes de terceros.'),
  'No es un borrador: las 74 fuentes del corpus fueron abiertas y contrastadas una por una contra ' +
    'su publicación original, y el trabajo incorpora además 31 fuentes de terceros ajenas a las ' +
    'instituciones observadas.',
);

cambio(
  'Resumen ejecutivo · la reatribución es un hecho de la verificación, no de una versión',
  frase('La verificación de esta versión reatribuyó seis registros por esta causa.'),
  'La verificación reatribuyó seis registros por esta causa.',
);

cambio(
  'Resumen ejecutivo · la PUCV, sin apelar a lo que hacía la ronda anterior',
  frase('Fue, además, la primera institución de la cohorte cuyo perfil quedó sin ninguna celda sin concluir, ya antes de que la ronda de ampliación cerrara las del resto.'),
  'Su perfil no tiene además ninguna celda sin concluir: las trece rutas del protocolo que le ' +
    'corresponden se recorrieron enteras, de modo que cada ausencia suya es una ausencia ' +
    'comprobada y no un hueco de investigación.',
);

/* ── 3 · Los ocho hallazgos ───────────────────────────────────────────── */

cambio(
  'Hallazgos · los dos marcados en color se explican por su origen, no por su novedad',
  frase('Los dos marcados en color no existían en la versión anterior y son consecuencia directa del contraste externo.'),
  'Los dos marcados en color son los que sólo puede sostener el contraste con fuentes de terceros.',
);

cambio(
  'Hallazgo 2 · el límite dice qué se recorrió, no cuándo',
  frase('La ronda de ampliación recorrió la ruta que acredita políticas propias en las diez instituciones del comparador, y ninguna celda de esa capacidad queda sin concluir.'),
  'La ruta que acredita políticas propias se recorrió en las diez instituciones del comparador, y ' +
    'ninguna celda de esa capacidad queda sin concluir.',
);

cambio(
  'Hallazgo 3 · las reatribuciones son de la verificación',
  frase('La verificación de esta versión añadió seis reatribuciones nuevas.'),
  'La verificación añadió seis reatribuciones por esta causa.',
);

cambio(
  'Hallazgo · la ausencia de medición se enuncia por lo que la prueba, no por lo que decía antes',
  frase('La versión anterior de este informe presentaba esto como una ausencia que la investigación podía no haber alcanzado a ver. El contraste externo cambia su naturaleza: no es que no se haya encontrado la medición, es que ninguna Facultad'),
  'El contraste externo fija la naturaleza de esta ausencia: no es que no se haya encontrado la ' +
    'medición, es que ninguna Facultad',
);

/* ── 4 · Cómo leer este documento ─────────────────────────────────────── */

cambio(
  'Cómo leer · la regla de las celdas no necesita el historial de la cifra',
  frase('De las 100 celdas de la matriz de capacidades, 5 son de la segunda clase: eran 31 antes de la ronda de ampliación y 47 en la v0.8.0.'),
  'De las 100 celdas de la matriz de capacidades, 5 son de la segunda clase.',
);

cambio(
  'Cómo leer · el epígrafe del borrador se convierte en una declaración de estatuto',
  frase('<h4>Qué cambió respecto de la versión anterior, en una frase</h4>'),
  '<h4>Qué es y qué no es este documento</h4>',
);

cambio(
  'Cómo leer · y su párrafo deja de apoyarse en la v0.8.0',
  frase('La v0.8.0 era un borrador porque la mitad de su corpus no había sido contrastado y porque ninguna de sus fuentes provenía de terceros. Las dos cosas están resueltas. Eso no convierte al documento en una evaluación de calidad de las once Facultades'),
  'Este documento es un informe de resultados: su corpus está contrastado al cien por ciento ' +
    'contra las publicaciones originales y una parte proviene de terceros ajenos a las ' +
    'instituciones observadas. Eso no lo convierte en una evaluación de calidad de las once Facultades',
);

cambio(
  'Cómo leer · el orden se justifica por la cobertura que hay, no por la prohibición que hubo',
  frase('La versión anterior no publicaba comparación ordinal porque la cobertura de investigación era 3,7 veces más profunda en tres instituciones que en las ocho restantes, de modo que cualquier ordenamiento habría medido el trabajo de campo. Esta versión publica un comparador ordinal, y conviene ser explícito sobre por qué eso no es una contradicción y dónde sigue siendo peligroso.'),
  'Un orden entre instituciones sólo es defendible si mide lo que dice medir y no el trabajo de ' +
    'campo de quien lo construye. Conviene ser explícito sobre por qué aquí lo mide, y sobre dónde ' +
    'sigue siendo peligroso.',
);

cambio(
  'Cómo leer · el epígrafe del orden pierde el «antes se prohibía»',
  frase('<h4>Qué publica ahora y antes se prohibía: un orden</h4>'),
  '<h4>Qué autoriza a publicar un orden entre instituciones</h4>',
);

cambio(
  'Cómo leer · la asimetría se declara como estado, no como trayectoria',
  frase('<strong>La asimetría bajó, pero no desapareció.</strong> En rutas del protocolo la razón pasó de 2,4 : 1 a 1,8 : 1. En número de fuentes sigue siendo de 3,7 : 1.'),
  '<strong>La asimetría existe y está medida.</strong> En rutas del protocolo la razón entre el piloto de ' +
    'profundidad y el resto es de 1,8 : 1; en número de fuentes, de 3,7 : 1.',
);

/* ── 5 · Introducción y metodología ───────────────────────────────────── */

cambio(
  'Introducción · el cierre por el lado negativo no es una novedad, es un método',
  frase('La única excepción —y es la novedad de esta versión— son las afirmaciones que el contraste con bases oficiales permite cerrar por el lado negativo'),
  'La única excepción son las afirmaciones que el contraste con bases oficiales permite cerrar por ' +
    'el lado negativo',
);

cambio(
  'Metodología · el caso documentado no depende de qué versión lo documentó',
  frase('y esta versión documenta un caso concreto:'),
  'y el anexo G documenta un caso concreto:',
);

cambio(
  'Metodología · el doble conteo lo detecta la verificación',
  frase('El control de doble conteo es explícito, y la verificación de esta versión detectó un caso:'),
  'El control de doble conteo es explícito, y la verificación detectó un caso:',
);

cambio(
  'Metodología · las 74 fuentes verificadas, sin apelar a la versión',
  frase('En esta versión se verificaron <strong>las 74 fuentes del corpus</strong>'),
  'Se verificaron <strong>las 74 fuentes del corpus</strong>',
);

cambio(
  'Metodología · el epígrafe de la ruta 13 deja de anunciar un cambio de estatuto',
  frase('<h4>La ruta trece, y por qué cambia el estatuto de este documento</h4>'),
  '<h4>La ruta trece: contraste con fuentes que no son las observadas</h4>',
);

cambio(
  'Metodología · el contraste externo se enuncia por lo que aporta',
  frase('La versión anterior declaraba, como su limitación estructural más grave, que ninguna de sus 74 fuentes provenía de contraste externo:'),
  'Un corpus formado sólo por lo que las universidades publican de sí mismas tiene una limitación ' +
    'estructural:',
);

cambio(
  'Metodología · el consecuente sobre el estatuto, en presente',
  frase('Con el corpus contrastado al 100 % y la ruta de contraste externo recorrida, las dos razones por las que la v0.8.0 se declaraba borrador desaparecen. Esta versión se publica como informe de resultados.'),
  'Con el corpus contrastado al 100 % y la ruta de contraste externo recorrida, el documento se ' +
    'publica como informe de resultados y no como borrador.',
);

cambio(
  'Metodología · la capacidad retirada se explica por la regla, no por quién la daba antes',
  frase('es una capacidad que la versión anterior daba por acreditada y que esta retira.'),
  'es una capacidad que la regla de adyacencia no da por acreditada.',
);

cambio(
  'Metodología · la rúbrica cerrada no es una medida nueva, es una medida',
  frase('Y —medida nueva de esta versión— el comparador ordinal se calculó'),
  'Y el comparador ordinal se calculó',
);

/* ── 6 · Panorama y cobertura ─────────────────────────────────────────── */

cambio(
  'Panorama · la evaluación se declara ausente por lo que se recorrió',
  frase('La versión anterior debía añadir aquí que la ruta que acreditaría una evaluación publicada sólo se había recorrido en dos de las once instituciones. Esta versión la recorrió en las once, y además consultó de forma exhaustiva la base histórica de proyectos adjudicados por ANID.'),
  'La ruta que acreditaría una evaluación publicada se recorrió en las once instituciones, y se ' +
    'consultó además de forma exhaustiva la base histórica de proyectos adjudicados por ANID.',
);

cambio(
  'Cobertura · el título de la figura declaraba una trayectoria entre versiones',
  frase('El trabajo de campo sigue siendo desigual, pero la brecha bajó de 2,4 : 1 a 1,8 : 1 en rutas recorridas'),
  'El trabajo de campo es desigual: el piloto de profundidad recibió 1,8 veces más rutas que el resto',
);

cambio(
  'Cobertura · la leyenda de la figura explicaba una marca que ya no se dibuja',
  frase('Rutas recorridas en la v2.2.0'),
  'Rutas recorridas',
  0,
);

cambio(
  'Cobertura · el pie de la figura describía la ganancia respecto de la versión anterior',
  frase('La ganancia de esta versión —el tramo entre la marca clara y el extremo de la barra— corresponde a las tres rutas recorridas en las once: contraste externo, proyectos y fondos, y repositorios y publicaciones. La ruta 13, que la versión anterior declaraba sin recorrer en las once, está ahora cerrada en las once.'),
  'Las tres rutas que se recorren en las once instituciones —contraste externo, proyectos y fondos, ' +
    'y repositorios y publicaciones— son las que sostienen las afirmaciones de alcance nacional. ' +
    'La marca de la izquierda señala a las tres instituciones del piloto de profundidad.',
);

cambio(
  'Cobertura · la razón de asimetría, sin su historial',
  frase('Razón de 1,8 a 1, frente a 2,4 a 1 en la versión anterior.'),
  'Razón de 1,8 a 1 en rutas recorridas.',
);

cambio(
  'Cobertura · el sesgo de segundo orden se declara resuelto sin contar su historia',
  frase('<h5>Un sesgo de segundo orden que ya no opera</h5>'),
  '<h5>Un sesgo de segundo orden, y por qué no opera</h5>',
);

cambio(
  'Cobertura · y su párrafo',
  frase('La versión anterior advertía que la proporción de fuentes contrastadas variaba entre el 86 % de la PUCV y el 0 % de la Universidad Autónoma, de modo que la institución sobre la que el informe debía ser más cuidadoso era también la mejor comprobada.'),
  'Una proporción desigual de fuentes contrastadas dejaría a la institución sobre la que el informe ' +
    'debe ser más cuidadoso como la mejor comprobada, que es exactamente el sesgo que una ' +
    'declaración de intereses no corrige. Con el corpus contrastado al cien por ciento en las once, ' +
    'esa proporción es la misma para todas y el sesgo no tiene por dónde entrar.',
);

cambio(
  'Cobertura · la marca de verificación se retira sin narrar de dónde venía',
  frase('La marca de verificación de la matriz de capacidades, que en la v0.8.0 viajaba aparte del estado para no contaminarlo, deja de ser necesaria y se retira.'),
  'La matriz de capacidades no lleva marca de verificación: con el corpus contrastado por igual en ' +
    'las once, una marca que distinguiera fuentes abiertas de fuentes por abrir no separaría nada.',
);

/* ── 7 · Capacidades ──────────────────────────────────────────────────── */

cambio(
  'Capacidades · el rótulo de la figura contaba su propia historia',
  frase('Diez capacidades, diez Facultades, y 5 de 100 celdas todavía sin respuesta<br> <span style="font-size:9pt;font-weight:400;color:#5d6b7d">eran 31 antes de la ronda de ampliación</span>'),
  'Diez capacidades, diez Facultades, y 5 de las 100 celdas todavía sin respuesta',
);

cambio(
  'Capacidades · la investigación no sube respecto de nada: consta',
  frase('Investigación sube de 3 a 5 respecto de la versión anterior, por efecto de la consulta a ANID;'),
  'Investigación consta en cinco instituciones, todas con proyecto adjudicado y código citable;',
);

cambio(
  'Capacidades · la evaluación en cero, sin la salvedad de antes',
  frase('evaluación de efecto sigue en cero, y ahora sin la salvedad que la versión anterior tenía que añadir.'),
  'evaluación de efecto está en cero en las diez, y sin ninguna celda sin concluir que permita ' +
    'esperar otra cosa.',
);

/* ── 8 · Comparador y comprobación ────────────────────────────────────── */

cambio(
  'Comparador · la apertura de la sección no se define contra la versión anterior',
  frase('La versión anterior de este informe se prohibía publicar un orden entre instituciones. Esta lo publica. Conviene decir con precisión qué cambió, qué mide el índice y qué sigue sin medir, porque un orden mal leído hace más daño que la ausencia de orden.'),
  'Este informe publica un orden entre instituciones. Conviene decir con precisión qué mide el ' +
    'índice, qué autoriza a publicarlo y qué sigue sin medir, porque un orden mal leído hace más ' +
    'daño que la ausencia de orden.',
);

cambio(
  'Comparador · el epígrafe pierde el «ahora sí»',
  frase('<h4>Por qué ahora sí</h4>'),
  '<h4>Por qué un orden es defendible aquí</h4>',
);

cambio(
  'Comparador · y su párrafo, que narraba la prohibición de la 2.1',
  frase('La prohibición de la v2.1 tenía una razón medida y no una cautela genérica: la cobertura de investigación era 3,7 veces más profunda en tres instituciones que en las ocho restantes, de modo que ordenar habría producido un ranking del trabajo de campo disfrazado de ranking de universidades. Dos cosas cambiaron. La primera es que la asimetría en rutas recorridas bajó a 1,8 : 1 y el corpus quedó contrastado al 100 % en todas. La segunda, y más importante, es de diseño:'),
  'El riesgo de ordenar no es genérico y se puede nombrar: con una cobertura de investigación 3,7 ' +
    'veces más profunda en tres instituciones que en las ocho restantes, un orden produciría un ' +
    'ranking del trabajo de campo disfrazado de ranking de universidades. Dos cosas lo contienen. ' +
    'La primera es que la asimetría en rutas recorridas es de 1,8 : 1 y el corpus está contrastado ' +
    'al 100 % en las once. La segunda, y más importante, es de diseño:',
);

cambio(
  'Comparador · el pie de la figura fechaba las bandas en una ronda',
  frase('Tras la ronda de ampliación seis de las diez tienen banda cerrada y ninguna tiene banda ancha: quedan cinco celdas sin concluir, repartidas en cuatro instituciones.'),
  'Seis de las diez tienen banda cerrada y ninguna tiene banda ancha: las cinco celdas sin concluir ' +
    'se reparten en cuatro instituciones.',
);

cambio(
  'Comprobación · la observación retirada no necesita decir de dónde se retira',
  frase('La versión anterior de esta comprobación observaba que las dos instituciones con más rutas recorridas estaban entre las tres de mayor piso; con la matriz de la ronda de ampliación eso deja de ser cierto. De las dos que recorrieron doce rutas, una encabeza el comparador y la otra es cuarta, por debajo de dos instituciones investigadas con cinco y con siete.'),
  'De las dos instituciones que recorrieron doce rutas, una encabeza el comparador y la otra es ' +
    'cuarta, por debajo de dos investigadas con cinco y con siete. Si el trabajo de campo ' +
    'determinara la posición, ese reparto no podría darse.',
);

cambio(
  'Comprobación · el límite describe dónde está la duda, no de dónde viene',
  frase('La ronda de ampliación redujo las celdas sin concluir de 31 a 5, de modo que el margen de duda dejó de ser general y quedó concentrado: las cinco celdas se reparten en cuatro instituciones, y sólo una de ellas —la Universidad de los Andes— tiene más de una. Para las seis restantes el piso ya no es un piso: es la medida.'),
  'El margen de duda no es general sino concentrado: las cinco celdas sin concluir se reparten en ' +
    'cuatro instituciones, y sólo una de ellas —la Universidad de los Andes— tiene más de una. Para ' +
    'las seis restantes el piso no es un piso: es la medida.',
);

cambio(
  'Comprobación · el sesgo empírico lo aporta la verificación',
  frase('La verificación de esta versión aportó además una comprobación empírica del sesgo en la dirección menos cómoda para quien investiga.'),
  'La verificación aportó además una comprobación empírica del sesgo, en la dirección menos cómoda ' +
    'para quien investiga.',
);

/* ── 9 · Discusión, contraste externo y escala internacional ──────────── */

cambio(
  'Discusión · el contraste con la U. de Chile vale por lo que muestra',
  frase('El contraste con la Universidad de Chile es instructivo y no estaba disponible en la versión anterior.'),
  'El contraste con la Universidad de Chile es instructivo.',
);

cambio(
  'Discusión · el segundo caso lo añade la verificación',
  frase('La verificación de esta versión añade un segundo caso:'),
  'La verificación añade un segundo caso:',
);

cambio(
  'Discusión · el pregrado se formula con la malla verificada, no con más precisión que antes',
  frase('El contraste con el pregrado sigue siendo el dato más incómodo del informe, y esta versión puede formularlo con más precisión que la anterior porque verificó una malla completa.'),
  'El contraste con el pregrado es el dato más incómodo del informe, y se puede formular con ' +
    'precisión porque hay una malla verificada asignatura por asignatura.',
);

cambio(
  'Discusión · las reatribuciones, sin el marcador entre versiones',
  frase('La verificación de esta versión añadió seis a los nueve que la anterior ya registraba, y los tres casos nuevos más relevantes merecen nombrarse porque cada uno ilustra una forma distinta del mismo error.'),
  'El registro acumula quince reatribuciones por esta causa, y tres de ellas merecen nombrarse ' +
    'porque cada una ilustra una forma distinta del mismo error.',
);

cambio(
  'Contraste externo · la sección se abre por lo que hace, no por lo que faltaba',
  frase('La versión anterior declaraba como su limitación estructural más grave que ninguna de sus 74 fuentes provenía de contraste externo.'),
  'Un corpus formado sólo por lo que las universidades publican de sí mismas no puede distinguir ' +
    'entre lo que ocurre y lo que se declara.',
);

cambio(
  'Escala internacional · corrige la lectura pesimista, sin atribuirla a una versión',
  frase('y en dos puntos importantes corrige la lectura pesimista que la versión anterior invitaba a hacer.'),
  'y en dos puntos importantes corrige la lectura pesimista que la cohorte chilena, leída sola, ' +
    'invita a hacer.',
);

/* ── 10 · Conclusiones ────────────────────────────────────────────────── */

cambio(
  'Conclusiones · el pie de la figura era un registro de cambios',
  frase('El orden es el del documento y no el de la confianza. Respecto de la versión anterior, C-5 sube de 85 a 95 por efecto del contraste con el registro exhaustivo de financiamiento, C-4 sube de 75 a 80 por verificación directa de una malla completa, C-6 se reformula porque su prohibición dejó de ser absoluta, y C-8 es nueva.'),
  'El orden es el del documento y no el de la confianza. Las dos conclusiones dibujadas en el ' +
    'segundo color son inferencias: se derivan de la evidencia disponible en lugar de constar en ' +
    'una fuente, y su cadena de razonamiento se publica entera junto a cada una.',
);

cambio(
  'C-2 · la norma propia se cuenta, no se corrige',
  frase('La versión anterior sostuvo que una sola Facultad de la cohorte había dictado norma propia. La ronda de ampliación la corrige:'),
  'Dos Facultades del comparador dictaron norma propia con acto citable:',
);

cambio(
  'C-3 · la continuidad se describe por lo que consta',
  frase('La versión anterior sostuvo que la continuidad existía en un solo eje y en una sola institución. La ronda de ampliación la desmiente en la segunda mitad.'),
  'La continuidad plurianual consta ya en varios ejes y en varias instituciones.',
);

cambio(
  'C-5 · la conclusión de mayor confianza se funda en ANID, no en su novedad',
  frase('La novedad de esta versión, y la razón por la que ésta es la conclusión de mayor confianza declarada, es que la consulta exhaustiva'),
  'La razón por la que ésta es la conclusión de mayor confianza declarada es que la consulta exhaustiva',
);

/* ── 11 · Los últimos rastros ─────────────────────────────────────────── */

cambio(
  'Resumen ejecutivo · la ausencia de medición, sin el «ya no»',
  frase('La versión anterior registraba eso como una ausencia que podía deberse a que no se había buscado lo suficiente. Ya no: la consulta exhaustiva'),
  'Esa ausencia no depende de dónde se haya buscado: la consulta exhaustiva',
);

cambio(
  'Cobertura · la leyenda describía una marca de la v0.8.0 que la figura ya no dibuja',
  frase('<span><i style="background:#7ad0cd;width:1.4mm"></i>Marca de la v0.8.0 · lo que se ganó a la derecha de ella</span>'),
  '',
);

cambio(
  'Cobertura · la tabla comparaba dos versiones en dos columnas',
  frase('<th class="num">Rutas v0.8.0</th><th class="num">Rutas v2.2.0</th>'),
  '<th class="num">Rutas</th>',
);

/* Y con la cabecera va la celda: cada fila traía el valor de la v0.8.0 delante
   del vigente. Quitar sólo el rótulo habría descuadrado las once filas. */
cambio(
  'Cobertura · y la celda de la v0.8.0 en cada una de las once filas',
  /<td class="num">(\d+)<\/td><td class="num"><strong>(\d+)<\/strong><\/td>/g,
  '<td class="num"><strong>$2</strong></td>',
  11,
);

cambio(
  'Agenda · las siete preguntas se presentan por lo que son',
  frase('La agenda de la versión anterior tenía siete; dos se cerraron en ésta —la verificación completa del corpus y el contraste externo— y dos son nuevas.'),
  'Cada una declara el procedimiento que la cerraría, de modo que su respuesta pueda comprobarse ' +
    'desde fuera.',
);

cambio(
  'Nota metodológica · la política de versionado, sin apelar a quién leyó qué',
  frase('<strong>Los versionados no se reescriben hacia atrás.</strong> La v0.8.0 permanece publicada. Esta versión declara qué cambió y por qué, y quien leyó la anterior puede comprobar cada diferencia.'),
  '<strong>Los versionados no se reescriben hacia atrás.</strong> Cada versión publicada se ' +
    'conserva accesible con las cifras que sostenía, y el registro de cambios de cada una se ' +
    'publica junto a ella.',
);

cambio(
  'Ficha institucional · el certificado mal configurado es un hecho, no una herencia',
  frase('problema declarado desde la versión anterior.'),
  'problema que se declara aquí porque afecta a la comprobación por terceros.',
);

cambio(
  'Anexo B · la tasa de divergencia se compara entre tandas, no entre versiones',
  frase('coincide con la que arrojó la tanda anterior de la v0.8.0.'),
  'coincide con la que arrojó la primera tanda de verificación.',
);

cambio(
  'C-6 · el enunciado de la conclusión, en presente',
  frase('La cobertura desigual acota, pero ya no impide, la comparación ordinal</span>'),
  'La cobertura desigual acota la comparación ordinal, y no la impide</span>',
);

cambio(
  'C-6 · y su desarrollo, sin la cifra de la versión anterior',
  frase('La investigación alcanzó una cobertura 1,8 veces mayor en tres instituciones que en las ocho restantes, frente a 2,4 veces en la versión anterior, y el corpus quedó contrastado al 100 % en todas.'),
  'La investigación alcanzó una cobertura 1,8 veces mayor en tres instituciones que en las ocho ' +
    'restantes, y el corpus está contrastado al 100 % en todas.',
);

cambio(
  'Sección 8 · el perfil apartado se cifra sin narrar la ronda',
  frase('Con el corpus cerrado al cien por ciento y la ronda de ampliación incorporada, su perfil habría sido de 18 puntos con banda cerrada, es decir el segundo lugar del orden.'),
  'Con la misma rúbrica que se aplica a las demás, su perfil da 18 puntos con banda cerrada, es ' +
    'decir el segundo lugar del orden.',
);

cambio(
  'Complemento anunciado · la banda cerrada se declara, no se fecha',
  frase('y su banda ya estaba cerrada antes de la ronda de ampliación que cerró las de las demás.'),
  'y su banda está cerrada porque no le queda ninguna celda sin concluir.',
);

cambio(
  'Limitaciones · el corpus autodescriptivo se mide, no se compara con la versión previa',
  frase('Las 31 fuentes de contraste externo incorporadas en esta versión corrigen la limitación estructural de la anterior, pero no la eliminan:'),
  'Las 31 fuentes de contraste externo acotan esa limitación estructural, y no la eliminan:',
);

cambio(
  'Anexo D · el pie de la tabla contaba de dónde venía cada fila',
  frase('Las dos últimas filas las aportó la ronda de ampliación; las dos que la v2.0.0 asignaba a la Pontificia Universidad Católica de Valparaíso se trasladaron al documento complementario.'),
  'La Pontificia Universidad Católica de Valparaíso no figura aquí: sus dos instrumentos formales ' +
    'se publican en el documento complementario, por la razón de la sección 8.',
);

/* ── 12 · Las tablas que no se podían leer ────────────────────────────── */

/**
 * Anexo C · once columnas de 9 mm con rótulos de trece caracteres.
 *
 * A 6,4 pt en 9 mm no cabe «Transferencia», y el documento traía
 * `overflow-wrap:anywhere`, de modo que el navegador la partía por donde
 * cayera: «TRANSF / ERENCI / A». La hoja de impresión ya devolvió el corte
 * normal; aquí se acortan los rótulos para que quepan enteros. El orden de
 * las columnas y su nombre completo siguen publicados en la nota de la tabla
 * y en la lista de capacidades que la precede, dos párrafos antes.
 */
const ABREVIATURAS = {
  Unidad: 'Unid',
  Norma: 'Norma',
  Presencia: 'Pregr',
  Formación: 'Form',
  Herramienta: 'Herr',
  Adopción: 'Adop',
  Alcance: 'Alc',
  Investigación: 'Inv',
  Transferencia: 'Transf',
  Evaluación: 'Eval',
};

cambio(
  'Anexo C · la matriz recibe clase propia para poder apretar su relleno',
  frase('<table style=\"font-size:7pt\"><thead><tr><th style=\"width:38mm\">Institución</th>'),
  '<table class=\"matriz\" style=\"font-size:7pt\"><thead><tr><th style=\"width:38mm\">Institución</th>',
);

for (const [largo, corto] of Object.entries(ABREVIATURAS)) {
  cambio(
    `Anexo C · la columna «${largo}» se abrevia para que quepa entera`,
    frase(`<th class="num" style="width:9mm;font-size:6.4pt">${largo}</th>`),
    `<th class="num" style="width:9mm;font-size:6.4pt">${corto}</th>`,
  );
}

cambio(
  'Anexo C · la nota declara las abreviaturas, que es lo que las hace legibles',
  frase('Las columnas siguen el orden del cuerpo: unidad, norma, pregrado, formación, herramienta, adopción, alcance, investigación, transferencia y evaluación.'),
  'Las columnas siguen el orden del cuerpo, abreviadas: <em>Unid</em> unidad especializada, ' +
    '<em>Norma</em> norma propia, <em>Pregr</em> presencia en pregrado, <em>Form</em> formación ' +
    'estructurada, <em>Herr</em> herramienta desplegada, <em>Adop</em> adopción en la enseñanza, ' +
    '<em>Alc</em> alcance declarado, <em>Inv</em> investigación, <em>Transf</em> transferencia y ' +
    '<em>Eval</em> evaluación de efecto.',
);

/**
 * Anexo D · la columna que repetía la matriz entera en una tirada de texto.
 *
 * Cada fila llevaba los diez pares «capacidad + puntos» separados por puntos
 * medios, envueltos en una celda estrecha: cuatro líneas de texto corrido por
 * institución, y exactamente la misma información que el anexo C dibuja dos
 * páginas antes con una celda por capacidad. Se retira la columna y la nota
 * dice dónde está el detalle.
 */
cambio(
  'Anexo D · fuera la cabecera de la columna que duplicaba el anexo C',
  frase('<th style="width:44mm">Institución</th><th>Detalle por capacidad</th><th class="num">Piso</th><th class="num">Techo</th>'),
  '<th style="width:74mm">Institución</th><th class="num">Piso</th><th class="num">Techo</th>',
);

cambio(
  'Anexo D · y la celda correspondiente en cada una de las diez filas',
  /<td style="font-size:7\.6pt">unidad [^<]*<\/td>/g,
  '',
  10,
);

cambio(
  'Anexo D · la nota remite al anexo C en lugar de repetirlo',
  frase('<h5>Cálculo completo</h5>'),
  '<h5>Cálculo completo</h5>\n <p class="tbl-note" style="margin:0 0 2mm">El estado de cada celda ' +
    'está en el anexo C; la tabla de puntos de arriba lo convierte en puntaje. Repetirlo aquí ' +
    'daría la misma información dos veces y ninguna de las dos legible.</p>',
);

const ejecutar = () => {
  if (!fs.existsSync(ORIGEN)) {
    console.error(`✗ falta ${path.relative(raíz, ORIGEN)}`);
    process.exit(1);
  }

  let html = fs.readFileSync(ORIGEN, 'utf8');
  const fallos = [];

  for (const { motivo, busca, pone, veces } of CAMBIOS) {
    const encontradas = (html.match(busca) || []).length;
    if (veces > 0 && encontradas !== veces) {
      fallos.push(`${motivo}\n     esperaba ${veces}, encontró ${encontradas}`);
      continue;
    }
    if (veces === 0 && encontradas === 0) {
      fallos.push(`${motivo}\n     no encontró ninguna aparición`);
      continue;
    }
    html = html.replace(busca, pone);
    console.log(`  ✓ ${encontradas}×  ${motivo}`);
  }

  if (fallos.length) {
    console.error('\n✗ No se escribe nada. Sustituciones que no cuadran:\n');
    for (const f of fallos) console.error(`  · ${f}\n`);
    process.exit(1);
  }

  /* Siete figuras salen ahora de sus datos: las cuatro de la matriz, más la
     cobertura, las conclusiones y la cronología, que se rehacen porque las
     entregadas llevaban dentro el diff entre versiones o rótulos ilegibles. */
  const nuevas = {
    0: figuraCronologia(),
    4: figuraCobertura(),
    5: figuraCapacidades('v2'),
    6: figuraPorCapacidad(porCapacidad('v2'), filas.length),
    7: figuraComparador(filas),
    8: figuraComprobacion(filas),
    11: figuraConclusiones(),
  };

  let i = -1;
  let sustituidas = 0;
  html = html.replace(/<svg[\s\S]*?<\/svg>/g, (svg) => {
    i += 1;
    if (nuevas[i]) {
      sustituidas += 1;
      return nuevas[i];
    }
    return svg;
  });

  if (i + 1 !== 12 || sustituidas !== 7) {
    console.error(
      `✗ Se esperaban 12 figuras y 7 sustituciones; hubo ${i + 1} y ${sustituidas}.`,
    );
    process.exit(1);
  }
  console.log(`  ✓ 7 figuras rehechas desde sus datos, de ${i + 1}`);

  /* La cuenta que da sentido a todo lo anterior. */
  const cuerpo = html.slice(html.indexOf('>Índice<'));
  const restantes = (
    cuerpo
      .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
      .replace(/<div class="hdr">[\s\S]*?<\/div>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .match(/(v0\.\d\.0|v2\.\d\.0|versión anterior|esta versión|ronda de ampliación|La v\d)/g) || []
  ).length;
  console.log(`  · menciones a otras versiones que quedan en el cuerpo: ${restantes}`);

  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, html, 'utf8');
  console.log(
    `\n✓ ${path.relative(raíz, DESTINO).split(path.sep).join('/')} · ` +
      `${Math.round(fs.statSync(DESTINO).size / 1024)} KB`,
  );
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ejecutar();
}
