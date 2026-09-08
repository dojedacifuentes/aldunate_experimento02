/**
 * De la v2.0.0 a la v2.1.0 · aplicar a las figuras y a la prosa la decisión
 * que las tablas ya aplicaban.
 *
 * La v2.0.0 se publicó diciendo dos cosas a la vez. Sus tablas —el orden de la
 * sección 4, el anexo C y el cálculo del anexo D— publican la matriz de la
 * Ronda 2 sobre **diez** instituciones, sin la Pontificia Universidad Católica
 * de Valparaíso. Sus cuatro figuras derivadas de la matriz, y la prosa escrita
 * sobre ellas, publican la matriz anterior sobre **once**, con esa institución
 * dentro y encabezando el orden. La sección 8 explica por qué está fuera; el
 * resumen ejecutivo, seis páginas antes, dice que encabeza.
 *
 * Este archivo no decide nada: aplica lo que las tablas y la sección 8 ya
 * decían, y deja constancia de cada frase que cambia.
 *
 *   node tools/informes/informe-01/v2.1.0/armonizar.mjs
 *
 * **Toda sustitución se comprueba.** Si una frase no aparece el número exacto
 * de veces que se declara, el script se detiene sin escribir nada. Es la única
 * defensa contra una edición silenciosa sobre un documento de 29.000 palabras
 * que afirma cosas sobre diez universidades con nombre.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  apartada,
  comparador,
  figuraCapacidades,
  figuraComparador,
  figuraComprobacion,
  figuraPorCapacidad,
  porCapacidad,
} from '../comparador/figuras.mjs';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..', '..');
const entregas = path.join(
  raíz,
  'content/reports/01_ia_escuelas_derecho_chile/entregas',
);

const ORIGEN = path.join(entregas, 'v2.0.0/informe-01-v2.0.0.html');
const DESTINO = path.join(entregas, 'v2.1.0/informe-01-v2.1.0.html');

const filas = comparador('v2');
const pucv = apartada('v2');

/**
 * Un trozo de prosa, convertido en patrón que tolera el salto de línea.
 *
 * El HTML entregado va plegado a unos 95 caracteres, de modo que casi
 * cualquier frase que valga la pena sustituir lleva saltos dentro y en
 * lugares que no se pueden adivinar. Se buscan por su texto y no por su
 * maquetación.
 */
const frase = (s) =>
  new RegExp(
    s
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s+'),
    'g',
  );

/** Las sustituciones, en el orden en que se aplican. */
const CAMBIOS = [];

const cambio = (motivo, busca, pone, veces = 1) =>
  CAMBIOS.push({ motivo, busca, pone, veces });

/* ── 1 · Portada y metadatos ──────────────────────────────────────────── */

cambio(
  'Sello de versión en portada, encabezados y pies',
  /v2\.0\.0/g,
  'v2.1.0',
  0,
);

cambio(
  'Portada · la cohorte es de once y el comparador de diez, y la portada lo dice',
  frase(
    '<div class="cv-k">Cohorte</div><div class="cv-v">11 Facultades<small>Cohorte cerrada · comparabilidad longitudinal</small></div>',
  ),
  '<div class="cv-k">Cohorte</div><div class="cv-v">11 Facultades' +
    '<small>Cerrada · comparador ordinal de 10</small></div>',
);

/* ── 2 · Resumen ejecutivo · las dos cifras de cabecera ───────────────── */

cambio(
  'Cifra de cabecera · el techo real pasa de 18 a 20 y lo alcanza una sola',
  frase(
    '<div class="kpi-v">18<span>/30</span></div><div class="kpi-d">el techo real</div><div class="kpi-l">Índice de formalización más alto de la cohorte, alcanzado por dos instituciones</div>',
  ),
  '<div class="kpi-v">20<span>/30</span></div><div class="kpi-d">el techo real</div>' +
    '<div class="kpi-l">Índice de formalización más alto del comparador, alcanzado por una sola institución</div>',
);

cambio(
  'Cifra de cabecera · la norma propia se cuenta sobre las diez del comparador',
  frase(
    '<div class="kpi-v">1</div><div class="kpi-d">de once</div><div class="kpi-l">Facultades con norma propia sobre uso de IA en evaluación, de once</div>',
  ),
  '<div class="kpi-v">2</div><div class="kpi-d">de diez</div>' +
    '<div class="kpi-l">Facultades del comparador con norma propia sobre uso de IA, con instrumento citable</div>',
);

/* ── 3 · Resumen ejecutivo · el párrafo de la PUCV ────────────────────── */

cambio(
  'Resumen ejecutivo · la PUCV decía encabezar un comparador del que está fuera',
  frase(
    'La evidencia corrige de entrada una idea que el documento antecedente podía sugerir: la PUCV no parte de cero, y de hecho encabeza el comparador.',
  ),
  'Esta institución no aparece en el comparador, y la sección 8 explica por qué: quien firma ' +
    'trabaja en su Escuela de Derecho, y un orden en el que el autor tiene interés directo ' +
    'compromete el instrumento entero y no sólo una fila. Su examen se publica aparte, en un ' +
    'documento complementario que no puntúa, no ordena y no compara. Lo que sigue es lo que el ' +
    'corpus permite decir de ella sin ordenarla. La evidencia corrige de entrada una idea que el ' +
    'documento antecedente podía sugerir: la PUCV no parte de cero.',
);

cambio(
  'Resumen ejecutivo · tiene dos instrumentos formales, no uno',
  frase('—el único instrumento formal de todo su conjunto—'),
  '—uno de los dos instrumentos formales de todo su conjunto, junto al convenio con la Corte Suprema—',
);

cambio(
  'Resumen ejecutivo · tras la Ronda 2 seis instituciones tienen banda cerrada',
  frase(
    'Es, además, la única institución de las once cuyo perfil no tiene ninguna celda sin concluir.',
  ),
  'Fue, además, la primera institución de la cohorte cuyo perfil quedó sin ninguna celda sin ' +
    'concluir, ya antes de que la ronda de ampliación cerrara las del resto.',
);

cambio(
  'Resumen ejecutivo · los doce puntos que faltan tienen tres formas distintas, y decirlo es el análisis',
  frase(
    'alcanza 18 puntos de 30</strong>, y en que los doce puntos que faltan corresponden a las cuatro cosas más baratas de hacer: dictar una norma de Facultad, publicar el acto que crea la unidad, declarar el alcance real de lo que ya se ejecuta y medir una sola vez el efecto de una sola actividad. Ninguna de las cuatro exige presupuesto nuevo relevante, y las cuatro son verificables desde fuera.',
  ),
  'alcanza 18 puntos de 30</strong> con la misma rúbrica que se aplica a las demás, y en que los ' +
    'doce que faltan no se reparten al azar: se reparten en tres formas de ausencia muy distintas. ' +
    '<strong>Tres puntos</strong> son la evaluación de efecto, que no ha hecho ninguna Facultad ' +
    'del país y sobre la que no hay un solo proyecto financiado. <strong>Cuatro puntos</strong> ' +
    'son dos capacidades que existen en la universidad y no en la Facultad —la regla de uso y la ' +
    'adopción declarada en la enseñanza—, y que se cierran decidiendo en el nivel correcto, no ' +
    'construyendo nada nuevo. Y <strong>cinco puntos</strong> se pierden de uno en uno, en cinco ' +
    'capacidades que ya están en operación y a las que sólo les falta el instrumento citable que ' +
    'las acredite: publicar el acto que crea la unidad, el código de la asignatura, el del ' +
    'programa formativo, el alcance real de lo que ya se ejecuta y el del proyecto adjudicado. ' +
    'Ninguna de las tres clases exige presupuesto nuevo relevante, y las tres son verificables ' +
    'desde fuera.',
);

cambio(
  'Resumen ejecutivo · remitía a una sección 10 que se trasladó al complemento',
  frase(
    'La sección 10 la formula con los referentes a la vista, un indicador por cada decisión y una estimación explícita de lo que cuesta no tomarla.',
  ),
  'El documento complementario la formula con los referentes a la vista, un indicador por cada ' +
    'decisión y una estimación explícita de lo que cuesta no tomarla.',
);

/* ── 3b · Frontis · qué versión es ésta y sobre cuántas instituciones ─── */

/* El sello de versión ya pasó por aquí: esta línea busca lo que quedó
   después de él, no lo que decía el original. */
cambio(
  'Frontis · la v2.1.0 sucede a la v2.0.0, no a la v0.8.0',
  frase('<td>v2.1.0 · sucede a v0.8.0 del 04-09-2026</td>'),
  '<td>v2.1.0 · sucede a v2.0.0 del 06-09-2026</td>',
);

cambio(
  'Frontis · la matriz cubre diez instituciones y cien celdas',
  frase(
    '<td class="k" style="width:36mm">Capacidades comparadas</td><td>10 sobre 11 instituciones = 110 celdas</td>',
  ),
  '<td class="k" style="width:36mm">Capacidades comparadas</td>' +
    '<td>10 sobre 10 instituciones = 100 celdas · la undécima de la cohorte se examina aparte, ' +
    'por la razón de la sección 8</td>',
);

cambio(
  'Frontis · antes de los seis cambios de la v2.0.0 va lo que corrige la v2.1.0',
  frase('<h3 style="margin-top:6mm">Seis cambios respecto de la v0.8.0</h3>'),
  '<h3 style="margin-top:6mm">Qué corrige la v2.1.0</h3>\n' +
    ' <p>Esta versión no incorpora evidencia nueva: el corpus, las fuentes y la rúbrica son los ' +
    'mismos de la v2.0.0. Lo que corrige es una contradicción interna de esa versión, y por eso ' +
    'cambia cifras publicadas y no puede ser una corrección silenciosa.</p>\n' +
    ' <p>La v2.0.0 publicaba dos matrices a la vez. Sus tablas —el orden de la sección 4, el anexo ' +
    'C y el cálculo del anexo D— aplicaban la ronda de ampliación sobre <strong>diez</strong> ' +
    'instituciones, sin la Pontificia Universidad Católica de Valparaíso, que es lo que su propia ' +
    'sección 8 declara y funda. Sus cuatro figuras derivadas de la matriz, y la prosa escrita ' +
    'sobre ellas, seguían publicando la matriz anterior sobre <strong>once</strong>, con esa ' +
    'institución dentro y encabezando el orden. El resumen ejecutivo decía que encabezaba el ' +
    'comparador seis páginas antes de que la sección 8 explicara por qué no estaba en él.</p>\n' +
    ' <p>La v2.1.0 aplica a las figuras y a la prosa lo que las tablas ya aplicaban. Las cuatro ' +
    'figuras se rehacen desde la matriz —de modo que no puedan volver a divergir de ella—, el ' +
    'techo del comparador pasa de 18 a 20 puntos y lo alcanza una sola institución, el promedio de ' +
    'los pisos pasa de 9,4 a 11,4, las celdas sin concluir pasan de 31 sobre 110 a 5 sobre 100, y ' +
    'la lectura de dónde se pierden los puntos se rehace entera. La v2.0.0 permanece publicada, ' +
    'con esta contradicción dentro y declarada aquí.</p>\n' +
    ' <div class="box acc" style="margin:5mm 0">\n' +
    '  <h5>Once y diez, y por qué las dos cifras son correctas</h5>\n' +
    '  <p>La <strong>cohorte</strong> es de once instituciones: es la que define el corpus, la que ' +
    'recorre las rutas del protocolo, la que puebla el registro de fuentes y la que tiene una ' +
    'ficha en el anexo A. Todo recuento sobre trabajo de campo, fuentes o iniciativas dice ' +
    '<em>once</em>. El <strong>comparador</strong> y la <strong>matriz de capacidades</strong> son ' +
    'de diez: la undécima se aparta porque quien firma tiene un conflicto de interés directo sobre ' +
    'ella. Todo recuento sobre capacidades, puntos o posiciones dice <em>diez</em>. Cuando en este ' +
    'documento las dos cifras aparecen cerca, no se contradicen: cuentan cosas distintas.</p>\n' +
    ' </div>\n' +
    ' <h3 style="margin-top:6mm">Seis cambios de la v2.0.0 respecto de la v0.8.0</h3>',
);

/* ── 4 · Hallazgos · recuentos que salen de la matriz ─────────────────── */

cambio(
  'Hallazgo · la unidad especializada, contada sobre las diez del comparador',
  frase('En cinco de las once Facultades consta una unidad especializada en funcionamiento;'),
  'En seis de las diez Facultades del comparador consta una unidad especializada en funcionamiento;',
);

cambio(
  'Hallazgo · el mismo recuento, en su ficha',
  frase('En cinco de las once Facultades consta una unidad especializada en operación.'),
  'En seis de las diez Facultades del comparador consta una unidad especializada en operación.',
);

cambio(
  'Hallazgo · la ruta de políticas propias sí se recorrió: la Ronda 2 la cerró en todas',
  frase(
    'La ruta que acredita políticas propias no se recorrió en ocho de las once instituciones. La asimetría entre unidades y normas es firme sobre lo hallado.',
  ),
  'La ronda de ampliación recorrió la ruta que acredita políticas propias en las diez ' +
    'instituciones del comparador, y ninguna celda de esa capacidad queda sin concluir. La ' +
    'asimetría entre unidades y normas deja de estar acotada por cobertura: seis Facultades ' +
    'acreditan unidad en operación y sólo dos, una regla propia con instrumento citable.',
);

cambio(
  'Hallazgo · formación y presencia, recontadas sobre la matriz de la Ronda 2',
  frase(
    'La formación estructurada consta en operación en seis de las once; la presencia en pregrado, en tres.',
  ),
  'La formación estructurada consta en operación en siete de las diez; la presencia en pregrado, en cinco.',
);

cambio(
  'Hallazgo · quedan tres celdas de pregrado sin concluir, no cinco',
  frase(
    'Las rutas de malla y de programas de asignatura quedaron sin recorrer en cinco de las once.',
  ),
  'Las rutas de malla y de programas de asignatura quedaron sin recorrer en tres de las diez.',
);

cambio(
  'Hallazgo · la transferencia incipiente, recontada',
  frase('La capacidad de transferencia aparece como incipiente en seis de las once:'),
  'La capacidad de transferencia aparece como incipiente en siete de las diez:',
);

/* ── 5 · La matriz de capacidades · sus dos figuras y sus rótulos ─────── */

cambio(
  'Figura de la matriz · su rótulo contaba once Facultades y 31 celdas abiertas',
  frase(
    'Diez capacidades, once Facultades, y 31 de 110 celdas todavía sin respuesta<br> <span style="font-size:9pt;font-weight:400;color:#5d6b7d">frente a 47 en la versión anterior</span>',
  ),
  'Diez capacidades, diez Facultades, y 5 de 100 celdas todavía sin respuesta<br> ' +
    '<span style="font-size:9pt;font-weight:400;color:#5d6b7d">eran 31 antes de la ronda de ampliación</span>',
);

cambio(
  'Figura de la matriz por filas · el mismo recuento',
  frase('La misma matriz leída por filas: en cuántas de las once Facultades consta cada capacidad'),
  'La misma matriz leída por filas: en cuántas de las diez Facultades consta cada capacidad',
);

/* ── 6 · Sección 4 · el comparador ───────────────────────────────────── */

cambio(
  'Comparador · el rótulo de la figura declaraba un techo de 18',
  frase(
    'Ninguna institución de la cohorte supera los 20 puntos de 30, y la mejor documentada llega a 18',
  ),
  'Una sola de las diez instituciones del comparador llega a 20 puntos de 30, y el promedio de los pisos es 11,4',
);

cambio(
  'Comparador · el pie de la figura atribuía a la PUCV una banda que ya no dibuja',
  frase(
    'La Pontificia Universidad Católica de Valparaíso es la única con banda cerrada, porque es la única sin ninguna celda sin concluir.',
  ),
  'Tras la ronda de ampliación seis de las diez tienen banda cerrada y ninguna tiene banda ancha: ' +
    'quedan cinco celdas sin concluir, repartidas en cuatro instituciones. La Pontificia ' +
    'Universidad Católica de Valparaíso no aparece en esta figura; la sección 8 explica por qué, y ' +
    'el documento complementario la examina como caso.',
);

cambio(
  'Comparador · la caja del dato que el orden hace visible',
  frase(
    'El máximo alcanzado en la cohorte es de <strong>18 puntos sobre 30</strong>, y lo alcanzan dos instituciones. El promedio de los pisos es de 9,4. Dicho de otro modo: incluso la Facultad de Derecho chilena mejor documentada del país en esta materia deja sin acreditar dos quintas partes de lo que una rúbrica razonable le pediría.',
  ),
  'El máximo alcanzado en el comparador es de <strong>20 puntos sobre 30</strong>, y lo alcanza ' +
    'una sola institución. El promedio de los pisos es de 11,4 y la mediana, de 11. Dicho de otro ' +
    'modo: la Facultad de Derecho chilena mejor documentada del país en esta materia deja sin ' +
    'acreditar un tercio de lo que una rúbrica razonable le pediría, y la Facultad mediana deja ' +
    'sin acreditar casi dos tercios.',
);

/* ── 7 · Sección 4 · dónde se pierden los puntos, con lectura ─────────── */

cambio(
  'Comparador · la lectura de las pérdidas se rehace sobre la matriz de la Ronda 2 y deja de ser una lista',
  frase(
    '<h4>Dónde se pierden los puntos, en toda la cohorte</h4>\n <p>La distribución de las pérdidas es notablemente uniforme y señala un problema de campo antes que\n de instituciones concretas. Las once pierden los tres puntos de <strong>evaluación de efecto</strong>.\n Diez de once pierden dos o tres puntos de <strong>norma propia</strong>. Ocho de once no acreditan\n <strong>presencia en pregrado</strong> con instrumento. Y siete de once no acreditan\n <strong>adopción en la enseñanza</strong>, que es la capacidad que mide si lo que se instala se\n usa. Las capacidades mejor pobladas —alcance declarado, formación estructurada, unidad especializada— son precisamente aquellas cuya acreditación no exige decidir nada difícil.',
  ),
  '<h4>Dónde se pierden los puntos, y qué forma tiene cada pérdida</h4>\n' +
    ' <p>Las diez instituciones del comparador acreditan 114 de los 285 puntos que ponen en juego ' +
    'sus 95 celdas resueltas: <strong>tres de cada cinco puntos disponibles no están ' +
    'acreditados</strong>. Ese agregado es el dato menos interesante de la tabla. Lo interesante ' +
    'es que las pérdidas no tienen todas la misma forma, y que la forma dice qué habría que hacer ' +
    'para revertirlas.</p>\n' +
    '\n <p><strong>La ausencia unánime.</strong> <em>Evaluación de efecto</em> obtiene 0 de 30. No ' +
    'es que puntúe bajo: no puntúa. Las diez instituciones pierden los tres puntos, sin una sola ' +
    'excepción y sin una sola celda sin concluir que permita esperar otra cosa. Una capacidad en ' +
    'la que todo el campo obtiene cero no describe a las instituciones: describe al campo, y la ' +
    'sección 6 muestra que tampoco hay un peso de financiamiento público detrás.</p>\n' +
    '\n <p><strong>La ausencia bimodal.</strong> <em>Investigación</em> obtiene 13 de 30 repartidos ' +
    'en dos grupos casi sin término medio: cuatro instituciones acreditan proyecto adjudicado con ' +
    'código —el grado más alto de la rúbrica— y cinco no acreditan nada. Sólo una queda entre las ' +
    'dos. Aquí la puntuación no mide gradualidad sino un umbral: se entra al Fondecyt o no se ' +
    'entra, y el instrumento que acredita la capacidad es el mismo que la financia.</p>\n' +
    '\n <p><strong>La ausencia por umbral.</strong> <em>Transferencia</em> obtiene también 13 de ' +
    '30, y su distribución es la contraria: ninguna institución obtiene cero y siete obtienen ' +
    'exactamente un punto. Todas hacen algo hacia fuera —seminarios, jornadas, actividades de una ' +
    'sola ocurrencia— y casi ninguna lo sostiene en un convenio firmado. Es la capacidad donde más ' +
    'barato sería subir, y donde subir exigiría convertir actividad en compromiso.</p>\n' +
    '\n <p>Las tres formas se ordenan de mayor a menor pérdida así: <em>evaluación de efecto</em> ' +
    'pierde 30 puntos de 30; <em>herramienta desplegada</em>, 22; <em>norma propia</em>, 21; ' +
    '<em>presencia en pregrado</em>, 18; <em>adopción</em>, <em>alcance</em>, ' +
    '<em>investigación</em> y <em>transferencia</em>, 17 cada una; <em>unidad especializada</em>, ' +
    '15; y <em>formación estructurada</em>, 12. Ninguna capacidad de las diez llega a dos tercios ' +
    'de lo que la rúbrica le pide, y la mejor poblada —la formación— es la que menos compromete a ' +
    'quien la ofrece. Las capacidades que exigen decidir algo difícil, dictar una regla o medir un ' +
    'resultado, son exactamente las que están vacías.',
);

/* ── 8 · La comprobación que cruza cobertura con índice ───────────────── */

cambio(
  'Comprobación · el par de valores que la sostiene cambió, y ahora es más fuerte',
  frase(
    'La Universidad Autónoma de Chile recorrió 5 de trece rutas y obtiene un piso de 12 puntos. La Universidad de Chile recorrió 12 y obtiene el mismo piso de 12. Si el trabajo de campo determinara el resultado, ese par de valores no podría existir. Lo que sí se observa —y hay que decirlo igual— es que las dos instituciones con más rutas recorridas están entre las tres de mayor piso. La correlación existe y no es perfecta; el informe la publica y no la explica.',
  ),
  'La Universidad Autónoma de Chile recorrió 5 de trece rutas y obtiene un piso de 17 puntos. La ' +
    'Universidad de Chile recorrió 12 —más del doble— y obtiene 12. Si el trabajo de campo ' +
    'determinara el resultado, ese par de valores no podría existir, y menos aún en ese orden. ' +
    'Medida sobre las diez, la correlación entre rutas recorridas y piso del índice es de 0,34: ' +
    'existe, es débil, y da cuenta de algo más de un décimo de la variación. La versión anterior ' +
    'de esta comprobación observaba que las dos instituciones con más rutas recorridas estaban ' +
    'entre las tres de mayor piso; con la matriz de la ronda de ampliación eso deja de ser cierto. ' +
    'De las dos que recorrieron doce rutas, una encabeza el comparador y la otra es cuarta, por ' +
    'debajo de dos instituciones investigadas con cinco y con siete.',
);

cambio(
  'Comprobación · el límite se recalcula: quedan cinco celdas abiertas, no treinta y una',
  frase(
    'No prueba que la cobertura sea irrelevante, y con 31 de 110 celdas sin concluir el piso de cualquier institución poco investigada sigue siendo un piso.',
  ),
  'No prueba que la cobertura sea irrelevante. La ronda de ampliación redujo las celdas sin ' +
    'concluir de 31 a 5, de modo que el margen de duda dejó de ser general y quedó concentrado: ' +
    'las cinco celdas se reparten en cuatro instituciones, y sólo una de ellas —la Universidad de ' +
    'los Andes— tiene más de una. Para las seis restantes el piso ya no es un piso: es la medida.',
);

cambio(
  'Hallazgo 7 · el mismo límite, en su ficha',
  frase(
    'Con 31 de 110 celdas sin concluir, el piso de cualquier institución poco investigada es un piso y no una medida.',
  ),
  'Con 5 de las 100 celdas del comparador sin concluir, el margen de duda queda concentrado en ' +
    'cuatro instituciones y para las otras seis el piso es ya la medida.',
);

/* ── 9 · Discusión, conclusiones y limitaciones ───────────────────────── */

cambio(
  'Discusión · el techo de la banda ya no deja cuatro órdenes sin resolver',
  frase(
    'Con 31 de 110 celdas sin concluir, cuatro instituciones tienen un techo igual o superior al piso de la primera, y el orden entre ellas no es resoluble con lo disponible.',
  ),
  'Con 5 de las 100 celdas del comparador sin concluir, ninguna institución tiene ya un techo ' +
    'igual o superior al piso de la primera, y el único orden que sigue sin resolverse es el de ' +
    'los dos empates: la Autónoma con la Central en 17, y la Adolfo Ibáñez con la Andrés Bello en 11.',
);

cambio(
  'Limitaciones · la misma frase, en la lista de límites declarados',
  frase(
    'Con 31 de 110 celdas sin concluir, cuatro instituciones tienen un techo igual o superior al piso de la primera y el orden entre ellas no es resoluble.',
  ),
  'Con 5 de las 100 celdas del comparador sin concluir, ningún techo alcanza ya el piso de la ' +
    'primera, y lo que queda sin resolver son dos empates y no un tramo entero del orden.',
);

cambio(
  'Complemento · la PUCV no encabeza un orden en el que no está',
  frase(
    'encabeza su cohorte, con el perfil mejor documentado del país y la única banda cerrada de las once.',
  ),
  'tiene el perfil mejor documentado del país en esta materia, y su banda ya estaba cerrada antes ' +
    'de la ronda de ampliación que cerró las de las demás.',
);

/* ── 10 · Anexo D · rúbrica y cálculo ─────────────────────────────────── */

cambio(
  'Anexo D · el recuento que justifica por qué el techo usa 2 y no 3',
  frase(
    'de las 79 celdas resueltas, sólo 13 alcanzan el estado con instrumento',
  ),
  'de las 95 celdas resueltas del comparador, sólo 10 alcanzan el estado con instrumento',
);

cambio(
  'Metodología · la regla de «no localizada» contra «no concluyente», con las cifras de la Ronda 2',
  frase(
    'De las 110 celdas de la matriz de capacidades, 31 son de la segunda clase, frente a 47 en la versión anterior.',
  ),
  'De las 100 celdas de la matriz de capacidades, 5 son de la segunda clase: eran 31 antes de la ' +
    'ronda de ampliación y 47 en la v0.8.0.',
);

/* La tabla de instrumentos del anexo D se rehace entera: pierde las dos filas
   de la institución que sale del comparador y gana las dos que la ronda de
   ampliación acreditó con resolución citable. Se sustituye el `<tbody>`
   completo porque una tabla a medio corregir es peor que la anterior. */
const FILA = (institución, capacidad, instrumento) =>
  `<tr><td class="k">${institución}</td><td>${capacidad}</td>` +
  `<td style="font-size:8pt">${instrumento}</td></tr>`;

cambio(
  'Anexo D · la tabla de instrumentos formales pierde las dos filas de la PUCV y gana las dos de la Ronda 2',
  frase(
    '<h5>Las trece celdas que alcanzan el estado con instrumento formal, y cuál es</h5>',
  ),
  '<h5>Las diez celdas que alcanzan el estado con instrumento formal, y cuál es</h5>',
);

cambio(
  'Anexo D · las dos filas de la institución apartada salen de la tabla de instrumentos',
  frase(
    '<tr><td class="k">P. U. Católica de Valparaíso</td><td>Herramienta desplegada</td><td style="font-size:8pt">Registro de propiedad intelectual de ScribeClaroPUCV, Certificado nº 2026-A-6558 de 23-06-2026</td></tr><tr><td class="k">P. U. Católica de Valparaíso</td><td>Transferencia</td><td style="font-size:8pt">Convenio con la Corte Suprema de agosto de 2020, con decana y presidente de la Corte identificados y actividad derivada documentada</td></tr>',
  ),
  '',
);

cambio(
  'Anexo D · entran los dos instrumentos que la ronda de ampliación acreditó',
  frase(
    '<tr><td class="k">U. Autónoma de Chile</td><td>Formación estructurada</td>',
  ),
  FILA(
    'U. Autónoma de Chile',
    'Unidad especializada',
    'Instituto de Investigación en Derecho creado por Resolución VRIP 118/2020, adscrito a la Facultad de Derecho',
  ) +
    FILA(
      'U. Central de Chile',
      'Norma propia',
      'Resolución 13/2025 del decano, que aprueba el instructivo de uso académico de inteligencia artificial',
    ) +
    '<tr><td class="k">U. Autónoma de Chile</td><td>Formación estructurada</td>',
);

cambio(
  'Anexo D · el pie de la tabla cuenta filas y celdas que ya no son las mismas',
  frase(
    'Diez filas para trece celdas: tres instituciones acreditan una misma capacidad mediante varios instrumentos, que se agrupan en una sola fila.',
  ),
  'Diez filas para diez celdas. Dos de ellas acreditan la capacidad mediante varios instrumentos ' +
    '—los proyectos adjudicados—, que se agrupan en una sola fila. Las dos últimas filas las ' +
    'aportó la ronda de ampliación; las dos que la v2.0.0 asignaba a la Pontificia Universidad ' +
    'Católica de Valparaíso se trasladaron al documento complementario.',
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

  /* Las cuatro figuras derivadas de la matriz, por su posición. El resto
     —corpus, iniciativas, ANID, escala internacional— no depende de ella y se
     conserva byte a byte. */
  const nuevas = {
    5: figuraCapacidades('v2'),
    6: figuraPorCapacidad(porCapacidad('v2'), filas.length),
    7: figuraComparador(filas),
    8: figuraComprobacion(filas),
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

  if (i + 1 !== 12 || sustituidas !== 4) {
    console.error(
      `✗ Se esperaban 12 figuras y 4 sustituciones; hubo ${i + 1} y ${sustituidas}.`,
    );
    process.exit(1);
  }
  console.log(`  ✓ 4 figuras rehechas desde la matriz, de ${i + 1}`);

  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, html, 'utf8');
  console.log(
    `\n✓ ${path.relative(raíz, DESTINO).split(path.sep).join('/')} · ` +
      `${Math.round(fs.statSync(DESTINO).size / 1024)} KB`,
  );
  console.log(
    `  comparador de ${filas.length} · techo ${Math.max(...filas.map((f) => f.piso))}/30 · ` +
      `${filas.reduce((a, f) => a + f.nc, 0)} celdas sin concluir · ` +
      `${pucv.corto} aparte con ${pucv.piso}`,
  );
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ejecutar();
}
