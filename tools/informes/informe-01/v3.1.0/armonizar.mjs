/**
 * De la v3.0.0 a la v3.1.0 · el informe pasa de describir a orientar decisiones.
 *
 * **Lo que faltaba.** Los ocho hallazgos interpretan cada uno su dato y las
 * ocho conclusiones declaran su confianza: la capa de interpretación existía y
 * está bien construida. Lo que no existía era la lectura del **conjunto** —qué
 * dicen los ocho juntos sobre el campo chileno—, la **cuantificación de la
 * oportunidad** que la capacidad vacía deja abierta, y las **prioridades**, que
 * sólo vivían en el documento complementario y por tanto sólo para una
 * institución.
 *
 * **Los tres bloques que se añaden**, todos dentro de la sección 10, que en la
 * v3.0.0 recuperó su encabezado:
 *
 *   1. «Lo que dicen los ocho hallazgos juntos» — las tres formas de ausencia
 *      —unánime, bimodal, de umbral—, cada una con su recuento sobre la matriz
 *      de cien celdas.
 *   2. «La celda que nadie ha ocupado» — los treinta puntos vacíos de
 *      evaluación de efecto, y el orden de magnitud publicado de lo que
 *      costaría ocuparlos.
 *   3. «De los datos a la decisión» — cuatro prioridades, con evidencia, actor
 *      y qué falta saber en cada una.
 *
 * **El límite que las hace publicables.** Las cuatro prioridades son del campo,
 * del regulador o del gremio. **Ninguna se dirige a una universidad nombrada
 * del comparador**, y no por cortesía: quien firma tiene conflicto declarado
 * con una de las once instituciones de la cohorte, y prescribir a las diez
 * restantes desde ahí es exactamente lo que la sección 8 existe para evitar. Lo
 * prescriptivo sobre la institución apartada sigue viviendo en el complemento.
 *
 * **Ninguna cifra cambia.** Cada recuento nuevo se deriva de la matriz ya
 * publicada o del anexo E, y el guion lo comprueba antes de escribir.
 *
 *   node tools/informes/informe-01/v3.1.0/armonizar.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..', '..');
const entregas = path.join(raíz, 'content/reports/01_ia_escuelas_derecho_chile/entregas');

const ORIGEN = path.join(entregas, 'v3.0.0/informe-01-v3.0.0.html');
const DESTINO = path.join(entregas, 'v3.1.0/informe-01-v3.1.0.html');

/* ── Las cifras se derivan, no se escriben ────────────────────────────────
   Todo recuento que aparece en la prosa nueva sale de aquí, y si la matriz
   cambiara y dejara de sostenerlo, el guion se detiene antes de escribir. Es
   D-039 aplicada también al texto: una afirmación derivada de un dato no se
   redacta aparte del dato. */
const MATRIZ = JSON.parse(
  fs.readFileSync(path.join(raíz, 'tools/informes/informe-01/comparador/matriz-v2.json'), 'utf8'),
);
const APARTADA = 'P. U. Católica de Valparaíso';
const comparador = Object.entries(MATRIZ.v2).filter(([k]) => k !== APARTADA);

const reparto = (capacidad) => {
  const i = MATRIZ.caps.indexOf(capacidad);
  const c = { OPF: 0, OP: 0, INC: 0, ENT: 0, ADY: 0, NL: 0, NC: 0 };
  for (const [, estados] of comparador) c[estados[i]] += 1;
  return c;
};

const D = {
  instituciones: comparador.length,
  celdas: comparador.length * MATRIZ.caps.length,
  formales: comparador.reduce((s, [, e]) => s + e.filter((x) => x === 'OPF').length, 0),
  sinNingunFormal: comparador.filter(([, e]) => !e.includes('OPF')).length,
  porInstitución: comparador
    .map(([k, e]) => [k, e.filter((x) => x === 'OPF').length])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]),
  evaluacion: reparto('Evaluacion'),
  norma: reparto('Norma'),
  investigacion: reparto('Investigacion'),
  transferencia: reparto('Transferencia'),
};

/* Los guardianes. Si una sola de estas afirmaciones deja de ser cierta, la
   prosa que se inserta abajo mentiría, y es preferible no publicar. */
const GUARDIANES = [
  ['la evaluación de efecto es no localizada en las diez', D.evaluacion.NL === 10],
  ['ninguna celda de evaluación queda sin concluir', D.evaluacion.NC === 0],
  ['norma propia no tiene estados intermedios', D.norma.OP === 0 && D.norma.INC === 0],
  ['norma propia: 2 con instrumento formal, 3 en el entorno, 5 no localizada',
    D.norma.OPF === 2 && D.norma.ENT === 3 && D.norma.NL === 5],
  ['investigación no tiene estados intermedios', D.investigacion.OP === 0 && D.investigacion.INC === 0],
  ['investigación: 4 con instrumento formal, 1 en el entorno, 5 no localizada',
    D.investigacion.OPF === 4 && D.investigacion.ENT === 1 && D.investigacion.NL === 5],
  ['transferencia: ninguna alcanza instrumento formal', D.transferencia.OPF === 0],
  ['transferencia: 6 incipientes y 3 en operación', D.transferencia.INC === 6 && D.transferencia.OP === 3],
  ['diez celdas de cien con instrumento formal', D.formales === 10 && D.celdas === 100],
  ['cinco Facultades sin un solo instrumento formal', D.sinNingunFormal === 5],
  ['el reparto de instrumentos formales es 4, 3, 1, 1, 1',
    D.porInstitución.map(([, n]) => n).join(',') === '4,3,1,1,1'],
];

const rotos = GUARDIANES.filter(([, ok]) => !ok).map(([q]) => q);
if (rotos.length) {
  console.error('✗ La matriz ya no sostiene la prosa que este guion inserta:\n');
  for (const r of rotos) console.error(`  · ${r}`);
  process.exit(1);
}

const frase = (s) =>
  new RegExp(s.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g');

const CAMBIOS = [];
const cambio = (motivo, busca, pone, veces = 1) => CAMBIOS.push({ motivo, busca, pone, veces });

/* ── 0 · Sello de versión y frontis ───────────────────────────────────── */

cambio('Sello de versión en portada, encabezados y pies', /v3\.0\.0/g, 'v3.1.0', 0);

cambio(
  'Frontis · la v3.1.0 sucede a la v3.0.0',
  frase('<td>v3.1.0 · sucede a v2.2.0 del 09-09-2026</td>'),
  '<td>v3.1.0 · sucede a v3.0.0 del 09-09-2026</td>',
);

cambio(
  'Nota de versión',
  /<h3 style="margin-top:6mm">Nota de versión<\/h3>\s*<p>Ésta es la v3\.1\.0\.[\s\S]*?<\/p>/,
  '<h3 style="margin-top:6mm">Nota de versión</h3>\n' +
    '<p>Ésta es la v3.1.0. Añade a la sección 10 lo que el informe no tenía: la lectura del ' +
    'conjunto de los ocho hallazgos, la cuantificación de la capacidad que ninguna institución ' +
    'ha construido, y cuatro prioridades con su evidencia, su actor y lo que falta saber en cada ' +
    'una. <strong>Ninguna cifra cambia</strong>: todo recuento nuevo se deriva de la matriz y del ' +
    'contraste externo ya publicados. Las prioridades son del campo, del regulador o del gremio, y ' +
    'ninguna se dirige a una universidad nombrada del comparador, por la razón que declara la ' +
    'sección 8. Las versiones anteriores siguen publicadas con las cifras que sostenían.</p>',
);

/* ── 1 · Los tres bloques nuevos ──────────────────────────────────────── */

const ANCLA = '<p class="eyebrow">17</p>\n <h2>10 · Implicancias</h2>\n <div class="rule"></div>';

const patrones = `
 <h3 style="margin-top:6mm">Lo que dicen los ocho hallazgos juntos</h3>
 <p class="lead">Cada hallazgo describe su capacidad. Leídos como conjunto, las ${D.celdas} celdas de
 la matriz dibujan <strong>tres formas de ausencia distintas</strong>, y distinguirlas importa
 porque cada una se cierra de una manera diferente.</p>

 <ul class="clean">
  <li><strong>Ausencia unánime.</strong> La evaluación de efecto figura como no localizada en las
  ${D.instituciones} instituciones del comparador, y —única entre las diez capacidades— sin una sola
  celda sin concluir. La ruta se recorrió entera en todas y no apareció nada en ninguna. No es un
  hueco de investigación: es una ausencia comprobada, y por eso es la única capacidad sobre la que
  este informe puede afirmar algo del campo entero y no sólo de lo que alcanzó a mirar.</li>

  <li><strong>Ausencia bimodal.</strong> La norma propia y la investigación no admiten término
  medio: en las dos, <strong>ninguna institución ocupa un estado intermedio</strong>. En norma
  propia hay ${D.norma.OPF} con instrumento formal, ${D.norma.ENT} donde la regla existe en la
  universidad y no en la Facultad, y ${D.norma.NL} donde no se localizó. En investigación,
  ${D.investigacion.OPF} con instrumento formal, ${D.investigacion.ENT} sólo en el entorno y
  ${D.investigacion.NL} no localizada. Son capacidades que se acreditan con un acto o no se
  acreditan: no hay forma incipiente de haber dictado una norma.</li>

  <li><strong>Ausencia de umbral.</strong> La transferencia es el caso contrario.
  ${D.transferencia.INC + D.transferencia.OP} de las ${D.instituciones} están entre incipiente y en
  operación —${D.transferencia.INC} y ${D.transferencia.OP} respectivamente— y
  <strong>ninguna alcanza el instrumento formal</strong>. Aquí no falta actividad: falta el acto que
  la convierte en relación estable, y todas se detienen debajo del mismo techo.</li>
 </ul>

 <p>La cifra que ordena las tres es la misma. De las ${D.celdas} celdas del comparador, sólo
 <strong>${D.formales} alcanzan el estado con instrumento formal publicado</strong>, y se reparten
 muy desigual: una institución concentra ${D.porInstitución[0][1]}, otra ${D.porInstitución[1][1]},
 y otras tres tienen una cada una. <strong>${D.sinNingunFormal} de las ${D.instituciones} Facultades
 del comparador no acreditan un solo instrumento formal en ninguna de las diez capacidades.</strong></p>

 <p>Lo que el conjunto describe, entonces, no es un campo desigual en cantidad de actividad —la
 actividad abunda y está repartida— sino un campo donde <strong>la actividad rara vez llega al acto
 que la hace verificable desde fuera</strong>. Es consistente con lo que el hallazgo sobre la
 verificación institucional establece por otra vía: donde nadie exige el acto, el costo de no
 publicarlo es cero.</p>

 <div class="limite"><strong>Límite.</strong> El instrumento mide capacidad acreditada por evidencia
 pública. Una Facultad puede haber dictado el acto y no haberlo publicado, y aparecería aquí igual
 que una que no lo dictó. La distinción entre las dos no la puede hacer ningún método basado en
 evidencia pública, y este informe no la hace.</div>
`;

const oportunidad = `
 <h3 style="margin-top:7mm">La celda que nadie ha ocupado, y qué costaría ocuparla</h3>
 <p>La evaluación de efecto vale tres puntos por institución en la rúbrica del anexo D: son
 <strong>${D.instituciones * 3} puntos</strong> repartidos en el comparador, y están todos vacíos.
 Es la única capacidad del instrumento en esa situación.</p>

 <p>El contraste externo fija la naturaleza de esa ausencia y la separa de las demás: la consulta
 exhaustiva de los 49.014 proyectos adjudicados por ANID desde 1982 no devuelve un solo proyecto
 sobre enseñanza del Derecho con inteligencia artificial, en ninguna universidad y en ningún año.
 <strong>No es que no se haya encontrado la medición: es que nadie ha pedido financiamiento para
 hacerla.</strong></p>

 <p>Y no ocurre porque falte el instrumento. Entre 2024 y 2026 se adjudicaron diez proyectos que
 cruzan inteligencia artificial con enseñanza o educación superior, repartidos en seis disciplinas
 —Ciencias de la Educación, Humanidades, Informática, Escuelas de Negocios y Ciencias de la Salud—.
 Ninguno es de Derecho. El instrumento existe, está en uso, y otras disciplinas lo están usando para
 estudiar su propia transformación docente.</p>

 <div class="box acc" style="margin:5mm 0">
  <h5>El orden de magnitud, con las cifras que ya publica el anexo E</h5>
  <p>Los siete proyectos vigentes de disciplina Derecho con objeto de inteligencia artificial suman
  <strong>473.162.000 pesos</strong>. La mediana es de 55.610.000 y seis de los siete están entre
  39,7 y 60,8 millones, todos a 48 meses. Ése es el tamaño publicado de un Fondecyt Regular en esta
  disciplina y en este objeto.</p>
  <p>Lo que la evidencia <strong>no</strong> permite afirmar es que evaluar el efecto de la
  enseñanza cueste eso: un diseño con grupo de comparación no tiene por qué costar lo que un
  proyecto de dogmática, y podría costar bastante menos. Lo que sí permite afirmar es que el
  instrumento con el que se financiaría está disponible, que su orden de magnitud en esta disciplina
  es público, y que <strong>ninguna Facultad de Derecho chilena lo ha solicitado nunca para este
  objeto</strong>.</p>
 </div>

 <p>Qué tendría que contener para contar. La escalera de institucionalización sitúa la evaluación en
 su cuarto peldaño, y ese peldaño exige <strong>resultados públicamente revisables</strong>: no
 basta con contar asistentes ni con una encuesta de satisfacción, que es lo que hoy existe. La única
 medición de resultado de todo el corpus la publica una vicerrectoría de transformación digital
 sobre el conjunto de su universidad, es correlacional y no distingue a los estudiantes de Derecho.
 La primera Facultad que publique una medición con diseño, instrumento declarado y grupo de
 comparación será, con la evidencia de este informe a la vista, la primera del país en poder
 demostrar lo que las demás afirman.</p>
`;

const decisiones = `
 <h3 style="margin-top:7mm">De los datos a la decisión</h3>
 <p class="lead">Cuatro prioridades. Ninguna se sigue automáticamente de un dato: cada una declara
 la evidencia que la sostiene, quién puede tomarla y qué haría falta saber para tomarla mejor.</p>

 <p>Las cuatro son <strong>del campo, del regulador o del gremio</strong>. Ninguna se dirige a una
 universidad nombrada del comparador, y no es una cortesía: quien firma este informe tiene un
 conflicto de interés declarado con una de las instituciones de la cohorte, y prescribir a las
 demás desde esa posición es exactamente lo que la sección 8 existe para evitar. Lo prescriptivo
 sobre la institución apartada se publica en el documento complementario, que no puntúa y no
 compara.</p>

 <div class="rec">
  <div class="rec-h"><span class="rec-id">P-1</span><span class="rec-t">Financiar la investigación sobre la propia enseñanza, con el instrumento que ya existe</span></div>
  <div class="rec-g">
   <div class="rec-k">Evidencia</div><div>Cero proyectos sobre enseñanza del Derecho con inteligencia artificial en 49.014 adjudicados por ANID desde 1982, frente a diez proyectos 2024-2026 que cruzan IA con enseñanza en otras seis disciplinas. Anexo E.</div>
   <div class="rec-k">Problema</div><div>La capacidad de investigar la IA como problema jurídico está construida y financiada; la de investigar cómo se enseña, no se ha constituido. Sin ella, ninguna afirmación sobre eficacia formativa es verificable.</div>
   <div class="rec-k">Actor</div><div>Las Facultades como postulantes. No requiere que ANID cree nada: el instrumento se está usando para este objeto en otras disciplinas.</div>
   <div class="rec-k">Falta saber</div><div>Por qué no se ha pedido. El corpus prueba que nadie lo solicitó, no la razón. Desconocimiento del instrumento, ausencia de equipos con esa formación metodológica o decisión deliberada son explicaciones compatibles con la misma evidencia.</div>
  </div>
 </div>

 <div class="rec">
  <div class="rec-h"><span class="rec-id">P-2</span><span class="rec-t">Publicar el acto de lo que ya está en operación</span></div>
  <div class="rec-g">
   <div class="rec-k">Evidencia</div><div>Sólo ${D.formales} de las ${D.celdas} celdas del comparador alcanzan el estado con instrumento formal, y ${D.sinNingunFormal} Facultades no acreditan ninguno. De las cuatro unidades creadas entre 2025 y 2026, ninguna publica el acto que la constituye.</div>
   <div class="rec-k">Problema</div><div>Buena parte de la distancia entre instituciones no mide qué se ha construido sino qué se ha dejado por escrito. Una capacidad real sin acto publicado es indistinguible desde fuera de una que no existe.</div>
   <div class="rec-k">Actor</div><div>Cada Facultad, en su propio nivel de decisión. Es la prioridad más barata de las cuatro: no exige presupuesto nuevo, sino publicar lo que ya se decidió.</div>
   <div class="rec-k">Falta saber</div><div>Si la no publicación es una decisión o una inercia administrativa. La evidencia pública no distingue entre las dos, y la respuesta cambia si el remedio es una política o un procedimiento.</div>
  </div>
 </div>

 <div class="rec">
  <div class="rec-h"><span class="rec-id">P-3</span><span class="rec-t">Cerrar la regla de uso antes de que la cierre el estándar profesional</span></div>
  <div class="rec-g">
   <div class="rec-k">Evidencia</div><div>${D.norma.OPF} de ${D.instituciones} Facultades acreditan norma propia con acto citable. La guía del Colegio de Abogados de 6 de julio de 2026 ya impone al abogado en ejercicio verificación personal de citas, competencia tecnológica y prohibición de delegar el juicio profesional. Sección 6.</div>
   <div class="rec-k">Problema</div><div>Una Facultad que titula abogados sin haber definido qué se permite en sus propias evaluaciones está formando para un estándar profesional que ya existe y que ella no aplica. El contraste internacional de la sección 7 muestra además que, donde el instrumento existe, el modelo dominante es el de deberes de declaración con consecuencia asociada.</div>
   <div class="rec-k">Actor</div><div>Cada Facultad en su régimen de evaluación, y el gremio en la articulación entre formación y ejercicio.</div>
   <div class="rec-k">Falta saber</div><div>Si una norma de Facultad cambia la conducta de quien estudia. No hay ninguna medición al respecto en el corpus, y obtenerla es precisamente la prioridad P-1.</div>
  </div>
 </div>

 <div class="rec">
  <div class="rec-h"><span class="rec-id">P-4</span><span class="rec-t">Dotar de contraparte a lo que las Facultades dicen de sí mismas</span></div>
  <div class="rec-g">
   <div class="rec-k">Evidencia</div><div>La Comisión Nacional de Acreditación ha dictado criterios específicos sólo para Pedagogía, Medicina y Odontología; Derecho no tiene criterios propios y su acreditación de carrera es voluntaria. El Colegio de Abogados regula al abogado en ejercicio, la Academia Judicial se dirige a juezas y jueces, y la Política Nacional de Inteligencia Artificial contempla a las instituciones de educación superior sin una sola mención a la formación jurídica.</div>
   <div class="rec-k">Problema</div><div>Lo que una Facultad publica sobre cómo enseña inteligencia artificial no tiene hoy contraparte evaluadora en ninguna institución chilena. En ese vacío, la calidad de la autodescripción depende enteramente de la disciplina de quien la escribe.</div>
   <div class="rec-k">Actor</div><div>La Comisión Nacional de Acreditación, el Ministerio de Ciencia en la revisión de la Política Nacional, y el gremio.</div>
   <div class="rec-k">Falta saber</div><div>Si la verificación externa produciría capacidad o sólo cumplimiento formal. Este mismo informe da una razón para dudar: el campo ya anuncia estructura antes de constituirla, y un criterio de acreditación mal diseñado premiaría el anuncio.</div>
  </div>
 </div>

 <div class="limite"><strong>Límite de las cuatro.</strong> Son prioridades sobre el campo, no un
 plan de trabajo para nadie en particular, y ninguna de las cuatro está respaldada por evidencia de
 que funcione: no existe en Chile una sola medición del efecto de estas decisiones, que es
 justamente lo que la primera de ellas propone construir. Se publican como lo que son —lo que la
 evidencia disponible hace razonable considerar— y no como lo que la evidencia demuestra.</div>
`;

cambio(
  'Sección 10 · se añaden los patrones transversales, la oportunidad cuantificada y las prioridades',
  frase(ANCLA),
  ANCLA + '\n' + patrones + oportunidad + decisiones,
);

/* ── 2 · El índice recoge la sección nueva ────────────────────────────── */

cambio(
  'Índice · la sección 10 pasa a llamarse por lo que ahora contiene',
  frase('<span class="toc-t">10 · Implicancias</span>'),
  '<span class="toc-t">10 · Implicancias y decisiones</span>',
);

cambio(
  'Cabecera corriente de la sección 10',
  /<span>10 · Implicancias · v3\.1\.0 · corte 06-09-2026<\/span>/g,
  '<span>10 · Implicancias y decisiones · v3.1.0 · corte 06-09-2026</span>',
  0,
);

cambio(
  'Encabezado de la sección 10',
  frase('<h2>10 · Implicancias</h2>'),
  '<h2>10 · Implicancias y decisiones</h2>',
);

/* ── Aplicación ───────────────────────────────────────────────────────── */

export const ejecutar = () => {
  let html = fs.readFileSync(ORIGEN, 'utf8');
  const fallos = [];

  console.log(`De ${path.basename(ORIGEN)} a ${path.basename(DESTINO)}\n`);
  console.log(`  matriz: ${D.formales}/${D.celdas} celdas con instrumento formal · ` +
    `${D.sinNingunFormal} Facultades sin ninguno · evaluación ${D.evaluacion.NL}/${D.instituciones} no localizada\n`);

  for (const { motivo, busca, pone, veces } of CAMBIOS) {
    const halladas = (html.match(busca) || []).length;
    if (veces === 0 ? halladas === 0 : halladas !== veces) {
      fallos.push(`${motivo}\n    esperaba ${veces === 0 ? '≥ 1' : veces} y encontró ${halladas}`);
      continue;
    }
    html = html.replace(busca, pone);
    console.log(`  ✓ ${halladas.toString().padStart(3)} · ${motivo}`);
  }

  if (fallos.length) {
    console.error('\n✗ No se escribe nada. Sustituciones que no cuadran:\n');
    for (const f of fallos) console.error(`  · ${f}\n`);
    process.exit(1);
  }

  /* Criterio 2 del encargo: cero recomendaciones a una universidad nombrada del
     comparador.
     Se comprueba sólo sobre los bloques de prioridad —los que llevan un
     identificador P-n— y no sobre todos los `.rec` del documento: esa misma
     clase la usan desde antes las siete preguntas de la agenda de
     investigación, y ésas sí nombran instituciones, como corresponde a una
     pregunta de investigación. Confundirlas hacía fallar el guion por un
     bloque que no es prescriptivo. */
  const prioridades = html.match(
    /<div class="rec">\s*<div class="rec-h"><span class="rec-id">P-\d[\s\S]*?<\/div>\s*<\/div>/g,
  ) || [];
  const prescriptivo = prioridades.join(' ');
  const nombradas = comparador
    .map(([k]) => k)
    .filter(
      (k) =>
        prescriptivo.includes(k) ||
        prescriptivo.includes(k.replace('U. ', 'Universidad ')) ||
        prescriptivo.includes(k.replace('P. U. ', 'Pontificia Universidad ')),
    );
  console.log(`  · prioridades publicadas: ${prioridades.length}`);
  console.log(`  · universidades del comparador nombradas en ellas: ${nombradas.length}`);
  if (prioridades.length < 3 || prioridades.length > 5) {
    console.error(`\n✗ El encargo pide de 3 a 5 prioridades y hay ${prioridades.length}.`);
    process.exit(1);
  }
  if (nombradas.length) {
    console.error(`\n✗ Una prioridad nombra a ${nombradas.join(', ')}. Criterio 2 del encargo.`);
    process.exit(1);
  }

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
