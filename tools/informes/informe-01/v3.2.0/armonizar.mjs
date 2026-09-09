/**
 * De la v3.1.0 a la v3.2.0 · cierre editorial antes de la entrega.
 *
 * Dos correcciones de alcance, las dos en la misma dirección: **el informe
 * afirmaba más de lo que su evidencia sostiene**, y se le baja el alcance hasta
 * que coincida exactamente con lo que la fuente permite.
 *
 * **Uno · adjudicación no es solicitud.** La base histórica de ANID recoge
 * proyectos *adjudicados*. De su silencio se sigue que ningún proyecto sobre
 * enseñanza del Derecho con IA se financió; **no** se sigue que ninguno se
 * presentara, porque una postulación rechazada no deja rastro en ese registro.
 * El documento daba el paso de más en seis sitios —incluida una figura y el
 * título de la conclusión de mayor confianza declarada del informe—, y uno de
 * ellos se escribió en la v3.1.0. El argumento no se pierde: lo que la base sí
 * acredita es que otras seis disciplinas obtuvieron adjudicaciones y Derecho
 * no, y ese contraste queda intacto.
 *
 * **Dos · la institución apartada no recibe puntuación ni lugar.** La sección 8
 * se contradecía a sí misma: su recuadro declaraba que la institución «no
 * recibe puntuación ni lugar» y el párrafo inmediatamente anterior publicaba
 * las dos —«18 puntos […] es decir el segundo lugar del orden»—. Publicar la
 * posición de la institución que se excluyó del orden vacía la exclusión de
 * sentido, y con un agravante: la razón declarada para excluirla es que el
 * piloto de profundidad **infla mecánicamente** lo que acredita, de modo que
 * esa cifra no es comparable con las demás y publicarla como posición es dos
 * veces incorrecto.
 *
 * Lo que **no** cambia: el reparto de los doce puntos que le faltan en tres
 * formas de ausencia. Es descripción de sus propias capacidades, no comparación
 * con nadie, es lo más accionable del documento y el complemento lo publica por
 * diseño. Se conserva sin la puntuación ni el lugar que lo enmarcaban.
 *
 * **Tres · «del país».** La cohorte es cerrada y de once instituciones. Las
 * afirmaciones nacionales que descansan en fuentes realmente nacionales —la
 * base de ANID para adjudicaciones, la CNA, el Colegio de Abogados, la Política
 * Nacional— se conservan; las que sólo descansaban en el corpus se acotan a él.
 *
 *   node tools/informes/informe-01/v3.2.0/armonizar.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { figuraConclusiones } from '../comparador/figuras.mjs';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..', '..');
const entregas = path.join(raíz, 'content/reports/01_ia_escuelas_derecho_chile/entregas');

const ORIGEN = path.join(entregas, 'v3.1.0/informe-01-v3.1.0.html');
const DESTINO = path.join(entregas, 'v3.2.0/informe-01-v3.2.0.html');

const frase = (s) =>
  new RegExp(s.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g');

const CAMBIOS = [];
const cambio = (motivo, busca, pone, veces = 1) => CAMBIOS.push({ motivo, busca, pone, veces });

/* ── 0 · Sello de versión y frontis ───────────────────────────────────── */

cambio('Sello de versión en portada, encabezados y pies', /v3\.1\.0/g, 'v3.2.0', 0);

cambio(
  'Frontis · la v3.2.0 sucede a la v3.1.0',
  frase('<td>v3.2.0 · sucede a v3.0.0 del 09-09-2026</td>'),
  '<td>v3.2.0 · sucede a v3.1.0 del 09-09-2026</td>',
);

cambio(
  'Nota de versión',
  /<h3 style="margin-top:6mm">Nota de versión<\/h3>\s*<p>Ésta es la v3\.2\.0\.[\s\S]*?<\/p>/,
  '<h3 style="margin-top:6mm">Nota de versión</h3>\n' +
    '<p>Ésta es la v3.2.0, de cierre editorial. Baja el alcance de dos familias de afirmaciones ' +
    'hasta lo que su fuente permite. La base de ANID recoge proyectos <strong>adjudicados</strong>: ' +
    'acredita que ningún proyecto sobre enseñanza del Derecho con inteligencia artificial se ' +
    'financió, y no que ninguno se presentara, de modo que el informe deja de afirmar que nadie lo ' +
    'solicitó. Y la institución apartada del comparador <strong>deja de recibir puntuación y ' +
    'lugar</strong> también en el texto: la sección 8 declaraba que no los recibe y a la vez los ' +
    'publicaba. <strong>Ninguna cifra sobre las diez instituciones comparadas cambia</strong>, y el ' +
    'contraste que sí sostiene la base —otras seis disciplinas obtuvieron adjudicaciones y Derecho ' +
    'no— queda intacto. Las versiones anteriores siguen publicadas con las cifras que sostenían.</p>',
);

/* ── 1 · Adjudicación no es solicitud ─────────────────────────────────── */

cambio(
  'H-5 · la lectura convertía una ausencia de adjudicación en una ausencia de solicitud',
  frase(
    'El contraste externo fija la naturaleza de esta ausencia: no es que no se haya encontrado la medición, es que ninguna Facultad de Derecho chilena ha pedido siquiera financiamiento para hacerla, mientras otras disciplinas sí lo pidieron y lo obtuvieron.',
  ),
  'El contraste externo fija la naturaleza de esta ausencia: no es que no se haya encontrado la ' +
    'medición, es que <strong>no consta ninguna adjudicación para hacerla</strong>, mientras otras ' +
    'disciplinas sí las obtuvieron. La base recoge proyectos adjudicados, de modo que acredita que ' +
    'nadie lo consiguió y no que nadie lo intentara: una postulación rechazada no deja rastro en ' +
    'ese registro.',
);

cambio(
  'H-5 · el límite no declaraba la diferencia entre adjudicar y postular',
  frase(
    '<strong>Límite.</strong> La ausencia está confirmada por el lado del financiamiento público competitivo.',
  ),
  '<strong>Límite.</strong> La ausencia está confirmada por el lado del financiamiento público ' +
    'competitivo <em>efectivamente obtenido</em>: el registro consultado recoge adjudicaciones y no ' +
    'postulaciones, de modo que no permite saber cuántas hubo ni cuántas se rechazaron.',
);

cambio(
  'Discusión · «tampoco la han solicitado»',
  frase('Y la sección siguiente muestra que tampoco la han solicitado.'),
  'Y la sección siguiente muestra que tampoco consta financiada.',
);

cambio(
  'Contraste externo · «no han solicitado nunca financiamiento»',
  frase('No han solicitado nunca financiamiento para estudiar cómo enseñan.'),
  'No consta que hayan obtenido nunca financiamiento para estudiar cómo enseñan; el registro ' +
    'recoge adjudicaciones y no postulaciones, de modo que no dice si llegaron a pedirlo.',
);

cambio(
  'C-5 · el título afirmaba la no solicitud',
  frase(
    '<span class="hall-t">Ninguna iniciativa acredita evaluación de efecto, y ninguna la ha solicitado</span>',
  ),
  '<span class="hall-t">Ninguna iniciativa acredita evaluación de efecto, y ninguna figura entre lo adjudicado</span>',
);

cambio(
  'C-5 · «la ausencia pasa a ser de solicitud»',
  frase('La ausencia deja de ser de evidencia y pasa a ser de solicitud.'),
  'La ausencia deja de ser de evidencia y pasa a ser de adjudicación: el registro acredita que ' +
    'ningún proyecto se financió, no que ninguno se presentara.',
);

cambio(
  'Sección 10 · el pasaje que la v3.1.0 escribió con el mismo exceso',
  frase(
    '<strong>No es que no se haya encontrado la medición: es que nadie ha pedido financiamiento para hacerla.</strong>',
  ),
  '<strong>No es que no se haya encontrado la medición: es que ninguna se ha financiado.</strong> ' +
    'La base recoge adjudicaciones, de modo que acredita ausencia de financiamiento y no ausencia ' +
    'de intentos.',
);

cambio(
  'Sección 10 · el recuadro de la oportunidad repetía la afirmación',
  frase(
    'y que <strong>ninguna Facultad de Derecho chilena lo ha solicitado nunca para este objeto</strong>.',
  ),
  'y que <strong>no consta ninguna adjudicación a una Facultad de Derecho chilena para este ' +
    'objeto</strong>.',
);

cambio(
  'Prioridad P-1 · «falta saber por qué no se ha pedido» presuponía que no se pidió',
  frase(
    'Por qué no se ha pedido. El corpus prueba que nadie lo solicitó, no la razón. Desconocimiento del instrumento, ausencia de equipos con esa formación metodológica o decisión deliberada son explicaciones compatibles con la misma evidencia.',
  ),
  'Si llegó a pedirse. El registro consultado recoge adjudicaciones y no postulaciones: acredita ' +
    'que ningún proyecto se financió y no dice cuántos se presentaron ni cuántos se rechazaron. ' +
    'Desconocimiento del instrumento, ausencia de equipos con esa formación metodológica, ' +
    'postulaciones rechazadas o decisión deliberada son explicaciones compatibles con la misma ' +
    'evidencia.',
);

/* ── 2 · La institución apartada no recibe puntuación ni lugar ────────── */

cambio(
  'Sección 8 · publicaba la puntuación y la posición que el recuadro de al lado declara no otorgar',
  frase(
    '<p>Con la misma rúbrica que se aplica a las demás, su perfil da 18 puntos con banda cerrada, es decir el segundo lugar del orden. Ese dato se publica aquí precisamente porque el informe no lo usa: ocultarlo sería administrar el sesgo en la dirección contraria.</p>',
  ),
  '<p>Por esa razón este informe <strong>no publica su puntuación ni su lugar</strong>. Una cifra ' +
    'calculada sobre un esfuerzo de investigación mayor que el aplicado a las demás no es ' +
    'comparable con las suyas, y presentarla como posición sería usar contra las otras diez ' +
    'justamente el instrumento del que esta institución acaba de ser retirada. Su perfil se ' +
    'describe capacidad por capacidad en el documento complementario, que no puntúa contra nadie ' +
    'y no ordena.</p>',
);

cambio(
  'Resumen ejecutivo · enmarcaba las tres formas de ausencia con una puntuación y un superlativo',
  frase(
    'Está en que <strong>ese perfil, el mejor documentado de la cohorte, alcanza 18 puntos de 30</strong> con la misma rúbrica que se aplica a las demás, y en que los doce que faltan no se reparten al azar: se reparten en tres formas de ausencia muy distintas.',
  ),
  'Está en que <strong>ese perfil —el que más rutas del protocolo acumula, por la misma razón que ' +
    'obliga a apartarlo— deja doce puntos de la rúbrica sin acreditar</strong>, y en que esos doce ' +
    'no se reparten al azar: se reparten en tres formas de ausencia muy distintas.',
);

/* ── 3 · «del país» donde sólo lo sostiene el corpus ──────────────────── */

cambio(
  'Resumen ejecutivo · «ninguna Facultad del país» sobre la evaluación de efecto',
  frase(
    'son la evaluación de efecto, que no ha hecho ninguna Facultad del país y sobre la que no hay un solo proyecto financiado.',
  ),
  'son la evaluación de efecto, que no acredita ninguna de las instituciones observadas y sobre la ' +
    'que no consta ningún proyecto adjudicado.',
);

cambio(
  'Conclusiones · «la primera del país en poder demostrarlo»',
  frase(
    'Cinco documentos, y la Facultad que los publique será, con la evidencia de este informe a la vista, la primera del país en poder demostrarlo.',
  ),
  'Cinco documentos, y la Facultad que los publique será, con la evidencia de este informe a la ' +
    'vista, la primera en poder demostrarlo.',
);

cambio(
  'La ventana de la evaluación · repetía la afirmación sobre la solicitud',
  frase('Ninguna universidad chilena ha pedido financiamiento público para hacerlo.'),
  'No consta ninguna adjudicación de financiamiento público chileno para hacerlo.',
);

cambio(
  'Comparador · el techo se comentaba con un superlativo nacional sobre una cohorte de once',
  frase(
    'Dicho de otro modo: la Facultad de Derecho chilena mejor documentada del país en esta materia deja sin acreditar un tercio de lo que una rúbrica razonable le pediría, y la Facultad mediana deja sin acreditar casi dos tercios.',
  ),
  'Dicho de otro modo: la Facultad mejor situada de las diez comparadas deja sin acreditar un ' +
    'tercio de lo que una rúbrica razonable le pediría, y la Facultad mediana deja sin acreditar ' +
    'casi dos tercios.',
);

cambio(
  'Sección 10 · «el perfil mejor documentado del país» sobre la institución apartada',
  frase(
    'No dice que la Escuela de Derecho de la PUCV esté rezagada. Dice lo contrario: tiene el perfil mejor documentado del país en esta materia, y su banda está cerrada porque no le queda ninguna celda sin concluir.',
  ),
  'No dice que la Escuela de Derecho de la PUCV esté rezagada. Dice lo contrario: es la ' +
    'institución sobre la que más rutas del protocolo se recorrieron, y no le queda ninguna celda ' +
    'sin concluir, de modo que cada una de sus ausencias está comprobada y no es un hueco de ' +
    'investigación.',
);

cambio(
  'Sección 10 · la v3.1.0 escribió el mismo superlativo nacional',
  frase(
    'será, con la evidencia de este informe a la vista, la primera del país en poder demostrar lo que las demás afirman.',
  ),
  'será, con la evidencia de este informe a la vista, la primera en poder demostrar lo que las ' +
    'demás afirman.',
);

/* ── Aplicación ───────────────────────────────────────────────────────── */

export const ejecutar = () => {
  let html = fs.readFileSync(ORIGEN, 'utf8');
  const fallos = [];

  console.log(`De ${path.basename(ORIGEN)} a ${path.basename(DESTINO)}\n`);

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

  /* La figura de conclusiones lleva dentro el título de C-5. Se rehace desde su
     dato en vez de editarse: es la regla de D-039 y es la razón de que este
     cambio no pueda dejar la figura diciendo una cosa y la tabla otra. */
  let i = -1;
  let rehecha = false;
  html = html.replace(/<svg[\s\S]*?<\/svg>/g, (svg) => {
    i += 1;
    if (i === 11) {
      rehecha = true;
      return figuraConclusiones();
    }
    return svg;
  });
  if (i + 1 !== 12 || !rehecha) {
    console.error(`✗ Se esperaban 12 figuras y rehacer la 11; hubo ${i + 1} y ${rehecha}.`);
    process.exit(1);
  }
  console.log('  ✓   1 · Figura de conclusiones rehecha desde su dato');

  /* Los guardianes de esta versión. Cada uno es una afirmación que el documento
     hacía y ya no debe hacer. */
  const texto = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const quedan = {
    'afirma que no se solicitó financiamiento':
      (texto.match(/(ha pedido|han pedido|ha solicitado|han solicitado|pasa a ser de solicitud|lo pidieron)/g) || []).length,
    'asigna posición o puntuación a la institución apartada':
      (texto.match(/(segundo lugar del orden|da 18 puntos|alcanza 18 puntos|18 puntos de 30)/g) || []).length,
    'afirma «del país» sin fuente nacional':
      (texto.match(/(ninguna Facultad del país|la primera del país|mejor documentad\w+ del país)/g) || []).length,
  };
  for (const [k, v] of Object.entries(quedan)) console.log(`  · ${k}: ${v}`);
  if (Object.values(quedan).some((v) => v !== 0)) {
    console.error('\n✗ Queda una afirmación que esta versión venía a retirar.');
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, html, 'utf8');
  console.log(
    `\n✓ ${path.relative(raíz, DESTINO).split(path.sep).join('/')} · ` +
      `${Math.round(fs.statSync(DESTINO).size / 1024)} KB`,
  );

  /* ── El complemento ────────────────────────────────────────────────────
     La regla del alcance es transversal y el complemento es donde vive la
     institución apartada, de modo que hay que auditarlo igual. Sólo tenía una
     afirmación fuera de alcance —«en ninguna Facultad del país», sostenida por
     una cohorte de once—, y por eso pasa a v1.2 en vez de rehacerse.

     Lo que aquí NO se toca: la puntuación. El complemento sí publica el perfil
     capacidad por capacidad porque no puntúa contra nadie y no ordena; es el
     informe el que deja de hacerlo. */
  const O_COMP = path.join(entregas, 'v3.1.0/complemento-pucv-v1.1.html');
  const D_COMP = path.join(entregas, 'v3.2.0/complemento-pucv-v1.2.html');
  let comp = fs.readFileSync(O_COMP, 'utf8');

  const compCambios = [
    ['Sello de versión del complemento', /v1\.1/g, 'v1.2', 0],
    [
      'Las tres formas · «en ninguna Facultad del país» lo sostiene una cohorte de once',
      frase('La evaluación de efecto no consta, y no consta en ninguna Facultad del país.'),
      'La evaluación de efecto no consta, y no consta en ninguna de las instituciones observadas.',
      1,
    ],
  ];

  for (const [motivo, busca, pone, veces] of compCambios) {
    const halladas = (comp.match(busca) || []).length;
    if (veces === 0 ? halladas === 0 : halladas !== veces) {
      console.error(`\n✗ Complemento · ${motivo}: esperaba ${veces === 0 ? '≥ 1' : veces} y encontró ${halladas}.`);
      process.exit(1);
    }
    comp = comp.replace(busca, pone);
    console.log(`  ✓ ${halladas.toString().padStart(3)} · complemento · ${motivo}`);
  }

  const compTexto = comp.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const compQuedan = (compTexto.match(/(Facultad del país|primera del país|segundo lugar|ha solicitado|han solicitado)/g) || []).length;
  console.log(`  · complemento · afirmaciones fuera de alcance: ${compQuedan}`);
  if (compQuedan !== 0) {
    console.error('\n✗ El complemento conserva una afirmación fuera de alcance.');
    process.exit(1);
  }

  fs.writeFileSync(D_COMP, comp, 'utf8');
  console.log(
    `✓ ${path.relative(raíz, D_COMP).split(path.sep).join('/')} · ` +
      `${Math.round(fs.statSync(D_COMP).size / 1024)} KB`,
  );
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ejecutar();
}
