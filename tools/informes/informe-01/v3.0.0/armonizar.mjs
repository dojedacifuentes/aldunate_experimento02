/**
 * De la v2.2.0 a la v3.0.0 · el corpus son 96 y no 74, y la portada lo dice.
 *
 * **El defecto.** El frontis afirmaba en cuatro sitios que el corpus son 74
 * fuentes y que está «verificado al 100 %». El anexo de ampliación, en el mismo
 * documento, afirmaba que el corpus pasó a 96 y que 22 de ellas no han pasado
 * el contraste sustantivo. Las dos cosas no pueden ser ciertas. La cifra
 * correcta es **74 de 96, un 77 %**, y sigue siendo alta.
 *
 * **Por qué es de fondo y no de forma.** Cambia lo que el informe afirma sobre
 * su propia verificación, que es la base de todo lo demás que afirma. El lector
 * que se queda en la portada —que son casi todos— recibía una garantía que el
 * documento desmiente cincuenta páginas después. Y la primera persona que
 * comprobara una cosa contra la otra encontraría la contradicción por su
 * cuenta: es mejor que la encuentre ya resuelta.
 *
 * **Lo que esta versión NO hace.** No degrada ninguna celda, no mueve ninguna
 * posición y no cambia una sola cifra sobre una institución con nombre. Los
 * cierres de la ronda de ampliación siguen donde estaban, con la confianza que
 * la ronda les asignó; lo que cambia es que el documento deja de presentarlos
 * como si hubieran pasado un contraste que no pasaron. El análisis de
 * sensibilidad publicado acota lo que está en juego, y dice que el orden
 * aguanta.
 *
 *   node tools/informes/informe-01/v3.0.0/armonizar.mjs
 *
 * Como en las dos anteriores, toda sustitución declara cuántas apariciones
 * espera y el script no escribe nada si una sola no cuadra.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..', '..');
const entregas = path.join(raíz, 'content/reports/01_ia_escuelas_derecho_chile/entregas');

const ORIGEN = path.join(entregas, 'v2.2.0/informe-01-v2.2.0.html');
const DESTINO = path.join(entregas, 'v3.0.0/informe-01-v3.0.0.html');

/* Una frase de prosa se busca con los espacios flexibles: el documento viene
   con saltos de línea donde el editor los puso, y exigirlos exactos convierte
   cada sustitución en una lotería. */
const frase = (s) =>
  new RegExp(s.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'g');

const CAMBIOS = [];
const cambio = (motivo, busca, pone, veces = 1) => CAMBIOS.push({ motivo, busca, pone, veces });

/* ── 0 · Sello de versión ─────────────────────────────────────────────── */

cambio('Sello de versión en portada, encabezados y pies', /v2\.2\.0/g, 'v3.0.0', 0);

/* ── 1 · Frontis ──────────────────────────────────────────────────────── */

cambio(
  'Frontis · la v3.0.0 sucede a la v2.2.0',
  frase('<td>v3.0.0 · sucede a v2.1.0 del 08-09-2026</td>'),
  '<td>v3.0.0 · sucede a v2.2.0 del 09-09-2026</td>',
);

cambio(
  'Nota de versión · qué corrige esta versión y qué no toca',
  frase(
    'Ésta es la v3.0.0. Corrige la presentación de la versión que la precede —figuras que no leían la misma matriz que las tablas de al lado, rótulos de columna partidos a mitad de palabra y pasajes escritos como comparación con versiones anteriores— y no toca el corpus, las fuentes ni la rúbrica. Ninguna cifra sobre las instituciones cambia por efecto de esta corrección. Las versiones anteriores siguen publicadas con las cifras que sostenían, y el registro de qué cambió en cada una se publica junto a ella.',
  ),
  'Ésta es la v3.0.0. Corrige una contradicción del frontis: declaraba un corpus de 74 fuentes ' +
    'verificado al 100 % mientras su propio anexo de ampliación declaraba un corpus de 96 con 22 ' +
    'sin contrastar. La cifra correcta es 74 de 96, un 77 %. Declara además dos direcciones ' +
    'publicadas que no resuelven y que la versión anterior no advertía, y ordena las letras de los ' +
    'anexos, que repetían una y saltaban otra. <strong>Ninguna celda se degrada, ninguna posición ' +
    'se mueve y ninguna cifra sobre una institución con nombre cambia.</strong> Las versiones ' +
    'anteriores siguen publicadas con las cifras que sostenían, y el registro de qué cambió en ' +
    'cada una se publica junto a ella.',
);

/* ── 2 · Las cifras del corpus ────────────────────────────────────────── */

cambio(
  'Portada · el subtítulo contaba 74 fuentes verificadas y el corpus son 96',
  frase(
    'Once Facultades, diez capacidades, setenta y cuatro fuentes verificadas una por una, y una pregunta que ninguna de ellas ha respondido todavía.',
  ),
  'Once Facultades, diez capacidades, noventa y seis fuentes —setenta y cuatro de ellas ' +
    'contrastadas una por una—, y una pregunta que ninguna de las Facultades ha respondido todavía.',
);

cambio(
  'Portada · el sello decía «verificado al 100 %»',
  frase('<span class="cv-tag">Corpus verificado al 100 % · contraste externo cerrado</span>'),
  '<span class="cv-tag">Corpus de 96 fuentes · 74 contrastadas (77 %) · contraste externo cerrado</span>',
);

cambio(
  'Metadatos del archivo · repetían la afirmación de la portada',
  frase('Corpus verificado al 100 %, contraste externo cerrado.'),
  'Corpus de 96 fuentes, 74 contrastadas una por una, contraste externo cerrado.',
);

cambio('Ficha · el recuento del corpus en la rejilla de portada', frase('>74 + 31<'), '>96 + 31<');

cambio(
  'Ficha · la fila que declaraba el 100 %',
  frase('<td>74 públicas únicas · <strong>74 contrastadas (100 %)</strong></td>'),
  '<td>96 públicas únicas · <strong>74 contrastadas (77 %)</strong> · 22 de la ronda de ' +
    'ampliación, sin contraste sustantivo</td>',
);

cambio(
  'Resumen ejecutivo · el indicador decía 74 sobre 74',
  frase(
    '<div class="kpi-v">74<span>/74</span></div><div class="kpi-d">100 % del corpus</div>',
  ),
  '<div class="kpi-v">74<span>/96</span></div><div class="kpi-d">77 % del corpus</div>',
);

cambio(
  'Resumen ejecutivo · «las 74 fuentes del corpus» eran las del corpus original',
  frase(
    'No es un borrador: las 74 fuentes del corpus fueron abiertas y contrastadas una por una contra su publicación original,',
  ),
  'No es un borrador: las 74 fuentes del corpus original fueron abiertas y contrastadas una por ' +
    'una contra su publicación original —las 22 que aportó después la ronda de ampliación se ' +
    'marcan como tales y no como contrastadas—,',
);

cambio(
  'Estatuto del documento · se apoyaba en un 100 % que ya no es el del corpus',
  frase('Con el corpus contrastado al 100 % y la ruta de contraste externo recorrida,'),
  'Con el corpus original contrastado al 100 %, las fuentes de la ronda de ampliación declaradas ' +
    'como tales y la ruta de contraste externo recorrida,',
);

cambio(
  'Cobertura · el argumento del sesgo se apoya en el corpus original',
  frase(
    'Con el corpus verificado al 100 %, ese sesgo desaparece: todas las instituciones están contrastadas en la misma proporción.',
  ),
  'Con el corpus original verificado al 100 %, ese sesgo desaparece en él: las once instituciones ' +
    'están contrastadas en la misma proporción. Las 22 fuentes de la ronda de ampliación no ' +
    'reparten esa garantía por igual, y por eso ninguna de ellas mueve una celda sin que la matriz ' +
    'lo declare.',
);

cambio(
  'Comparador · la asimetría de rutas se argumentaba sobre el 100 %',
  frase(
    'La primera es que la asimetría en rutas recorridas es de 1,8 : 1 y el corpus está contrastado al 100 % en las once.',
  ),
  'La primera es que la asimetría en rutas recorridas es de 1,8 : 1 y el corpus original está ' +
    'contrastado al 100 % en las once.',
);

cambio(
  'Conclusión C-6 · misma corrección',
  frase('y el corpus está contrastado al 100 % en todas.'),
  'y el corpus original está contrastado al 100 % en todas.',
);

cambio(
  'Limitaciones · el recuento de fuentes propias frente al total',
  frase('74 de 105 fuentes siguen siendo comunicación de las propias instituciones observadas'),
  '96 de 127 fuentes siguen siendo comunicación de las propias instituciones observadas',
);

/* ── 3 · Las direcciones que no resuelven ─────────────────────────────── */

cambio(
  'Anexo de ampliación · eran dos advertencias y son cuatro',
  frase(
    'Dos merecen advertencia expresa. La resolución de la Universidad Central, que es la que corrige la conclusión C-2, <strong>devuelve error en la dirección publicada</strong> y no pudo abrirse. La resolución de la Universidad Autónoma existe pero es <strong>un documento escaneado sin texto seleccionable</strong>, de modo que su contenido no pudo leerse por medios automáticos. Ambas se integran con la confianza que la ronda les asigna, y ambas quedan señaladas para recuperación.',
  ),
  'Cuatro merecen advertencia expresa, y tres de ellas por la misma causa: <strong>la dirección ' +
    'publicada no resuelve</strong>. La resolución de la Universidad Central, que es la que corrige ' +
    'la conclusión C-2, devuelve error. También devuelven error la referencia del seminario de la ' +
    'Pontificia Universidad Católica de Chile y la del curso de la Universidad del Desarrollo, ' +
    'que sostienen dos puntos cada una. La cuarta es de otra clase: la resolución de la Universidad ' +
    'Autónoma existe pero es <strong>un documento escaneado sin texto seleccionable</strong>, de ' +
    'modo que su contenido no pudo leerse por medios automáticos. Las cuatro se integran con la ' +
    'confianza que la ronda les asigna, las cuatro quedan señaladas para recuperación, y ninguna ' +
    'de ellas mueve por sí sola una posición del comparador: si las cuatro cayeran a la vez, el ' +
    'orden publicado sólo intercambiaría dos puestos y lo que se ensancharía son las bandas.',
);

/* ── 4 · Las letras de los anexos ─────────────────────────────────────── */

cambio(
  'Índice · dos anexos llevaban la letra I, la H no se usaba y el orden no era el del documento',
  frase(
    '<div class="toc-i"><span class="toc-n">I</span><span class="toc-t">Ampliación del corpus: fuentes de la segunda ronda</span></div><div class="toc-i"><span class="toc-n">G</span><span class="toc-t">Candidatas fuera de cohorte</span></div><div class="toc-i"><span class="toc-n">I</span><span class="toc-t">Registro completo de fuentes</span></div>',
  ),
  '<div class="toc-i"><span class="toc-n">G</span><span class="toc-t">Candidatas fuera de ' +
    'cohorte</span></div><div class="toc-i"><span class="toc-n">H</span><span class="toc-t">' +
    'Registro completo de fuentes</span></div><div class="toc-i"><span class="toc-n">I</span>' +
    '<span class="toc-t">Ampliación del corpus: fuentes de la segunda ronda</span></div>',
);

cambio(
  'Anexo del registro de fuentes · pasa de I a H, que es su sitio en el orden de lectura',
  frase('<span>Anexo I · v3.0.0 · corte 06-09-2026</span>'),
  '<span>Anexo H · v3.0.0 · corte 06-09-2026</span>',
);

cambio(
  'Anexo del registro de fuentes · el rótulo de su primera página',
  frase('<p class="eyebrow">Anexo I</p>'),
  '<p class="eyebrow">Anexo H</p>',
);

cambio(
  'Anexo del registro · las 74 son las del corpus original, y las 22 están en el anexo I',
  frase(
    'Las 74 fuentes del corpus, todas contrastadas contra su publicación original al 6 de septiembre de 2026.',
  ),
  'Las 74 fuentes del corpus original, todas contrastadas contra su publicación original al 6 de ' +
    'septiembre de 2026. Las 22 que aportó la ronda de ampliación se listan aparte, en el anexo I, ' +
    'y no han pasado ese contraste.',
);

cambio(
  'Anexo de ampliación · no tenía letra y le corresponde la I, que es la última',
  frase('<span>Anexo · Ampliación del corpus · v3.0.0</span>'),
  '<span>Anexo I · v3.0.0 · corte 06-09-2026</span>',
);

cambio(
  'Anexo de ampliación · el rótulo de su primera página',
  frase('<p class="eyebrow">Anexo</p>\n <h2>Ampliación del corpus: las fuentes de la segunda ronda</h2>'),
  '<p class="eyebrow">Anexo I</p>\n <h2>Ampliación del corpus: las fuentes de la segunda ronda</h2>',
);

/* ── 5 · El índice ────────────────────────────────────────────────────── */

cambio(
  'Índice · la nota declaraba inexistentes dos secciones que existen',
  frase(
    'El cuerpo va numerado del 1 al 12 y los anexos de la A a la I. La numeración salta en dos puntos —no hay sección 2 ni sección 10— porque el sumario se estabilizó antes que el texto y renumerarlo rompería las citas ya hechas.',
  ),
  'El cuerpo va numerado del 1 al 12 y los anexos de la A a la I, sin saltos. La sección 2 se lee ' +
    'dentro de la 1, de la que es continuación natural, y por eso el sumario las numera seguidas.',
);

cambio(
  'Índice · faltaba la entrada de la sección 10, y el sumario saltaba del 16 al 18',
  frase(
    '<div class="toc-i"><span class="toc-n">16</span><span class="toc-t">9 · Conclusiones</span></div><div class="toc-i"><span class="toc-n">18</span><span class="toc-t">11 · Limitaciones</span></div>',
  ),
  '<div class="toc-i"><span class="toc-n">16</span><span class="toc-t">9 · Conclusiones</span>' +
    '</div><div class="toc-i"><span class="toc-n">17</span><span class="toc-t">10 · Implicancias' +
    '</span></div><div class="toc-i"><span class="toc-n">18</span><span class="toc-t">11 · ' +
    'Limitaciones</span></div>',
);

cambio(
  'Sección 10 · existía con cabecera corriente propia pero sin encabezado ni entrada de índice',
  frase('<h3 style="margin-top:0">La ventana, y qué cuesta dejarla pasar</h3>'),
  '<p class="eyebrow">17</p>\n <h2>10 · Implicancias</h2>\n <div class="rule"></div>\n' +
    ' <h3 style="margin-top:6mm">La ventana, y qué cuesta dejarla pasar</h3>',
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

  /* Las cuentas que dan sentido a todo lo anterior. Si alguna no da cero, el
     documento sigue afirmando lo que esta versión vino a corregir. */
  const texto = html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const quedan = {
    'corpus «verificado al 100 %»': (texto.match(/corpus (verificado|contrastado) al 100 ?%(?! en| en las)/g) || []).length,
    'anexos con letra repetida': new Set(
      [...html.matchAll(/<span class="toc-n">([A-I])<\/span>/g)].map((m) => m[1]),
    ).size !== (html.match(/<span class="toc-n">([A-I])<\/span>/g) || []).length ? 1 : 0,
  };
  for (const [k, v] of Object.entries(quedan)) console.log(`  · ${k}: ${v}`);
  if (Object.values(quedan).some((v) => v !== 0)) {
    console.error('\n✗ Queda una afirmación que esta versión venía a corregir.');
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
