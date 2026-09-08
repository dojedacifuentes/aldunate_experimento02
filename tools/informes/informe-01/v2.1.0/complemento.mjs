/**
 * Del complemento v1.0 al v1.1 · el perfil que faltaba.
 *
 * El complemento de la v2.0.0 explicaba bien por qué la Pontificia
 * Universidad Católica de Valparaíso sale del comparador, y desarrollaba
 * cuatro proyecciones y un optativo. Lo que no traía era **el dato**: sus diez
 * capacidades, su puntuación con la misma rúbrica que se aplica a las demás y
 * el detalle de dónde están los doce puntos que le faltan. Sin eso, el informe
 * principal retiraba una institución del orden y el documento que la recibe no
 * decía qué recibía.
 *
 *   node tools/informes/informe-01/v2.1.0/complemento.mjs
 *
 * La sección nueva entra como 4 y las cinco posteriores corren un número. No
 * hay índice que rehacer —el documento no lo tiene— y la única referencia
 * cruzada a una sección apunta al informe principal, así que se desambigua.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { apartada, figuraPerfil } from '../comparador/figuras.mjs';

const aquí = path.dirname(fileURLToPath(import.meta.url));
const raíz = path.resolve(aquí, '..', '..', '..', '..');
const entregas = path.join(
  raíz,
  'content/reports/01_ia_escuelas_derecho_chile/entregas',
);

const ORIGEN = path.join(entregas, 'v2.0.0/complemento-pucv-v1.0.html');
const DESTINO = path.join(entregas, 'v2.1.0/complemento-pucv-v1.1.html');

const pucv = apartada('v2');

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

cambio('Sello de versión del complemento', /v1\.0(?![.\d])/g, 'v1.1', 0);

/* Las cinco secciones posteriores corren un número para dejar sitio a la
   nueva. Se sustituye el `<h2>` completo para no tocar ninguna otra cifra. */
const RENUMERAR = [
  ['4 · Cuatro cosas construibles sobre esa base', '5 · Cuatro cosas construibles sobre esa base'],
  [
    '5 · Un optativo cuyo proyecto final es la medición',
    '6 · Un optativo cuyo proyecto final es la medición',
  ],
  [
    '6 · Los productos, y por qué importan fuera del aula',
    '7 · Los productos, y por qué importan fuera del aula',
  ],
  ['7 · Limitaciones de este complemento', '8 · Limitaciones de este complemento'],
  ['8 · Implicancias y ventana de decisión', '9 · Implicancias y ventana de decisión'],
];

/* De abajo arriba: renumerar 4→5 antes que 5→6 dejaría dos secciones con el
   mismo número a mitad de camino y la segunda sustitución tocaría las dos. */
for (const [antes, después] of [...RENUMERAR].reverse()) {
  cambio(`Renumeración · ${antes} pasa a ${después}`, frase(`<h2>${antes}</h2>`), `<h2>${después}</h2>`);
}

cambio(
  'Alcance · las proyecciones ya no son «las secciones siguientes»: el perfil se interpone',
  frase('Cada una de las cuatro secciones siguientes declara cuatro cosas:'),
  'Cada una de las cuatro proyecciones de la sección 5 declara cuatro cosas:',
);

cambio(
  'Anexo H · la sección 8 que se cita es la del informe principal, no la de aquí',
  frase('porque la sección 8 hace afirmaciones sobre esta institución'),
  'porque la sección 8 del informe principal hace afirmaciones sobre esta institución',
);

/* ── La sección nueva ─────────────────────────────────────────────────── */

const SECCIÓN = `
<!-- ═══════════════ 4 · EL PERFIL ═══════════════ -->
<div class="page">
  <div class="hdr"><span>Informe 01 · complemento</span><span>La PUCV como caso de proyección · v1.1</span></div>
  <p class="eyebrow">El dato</p>
  <h2>4 · El perfil completo, capacidad por capacidad</h2>
  <div class="rule"></div>

  <p class="lead">El informe principal retira a esta institución del comparador. Retirarla del orden no
  es retirarle el dato: la rúbrica se le aplicó igual que a las demás, y el resultado se publica aquí
  entero. Ocultarlo sería administrar el conflicto de interés en la dirección contraria, y dejaría al
  lector con una institución apartada de la que no puede saber nada.</p>

  <div class="box acc nobreak">
    <h5>Qué es este número y qué no es</h5>
    <p>Los 18 puntos que siguen son la suma de la rúbrica del anexo D aplicada a este perfil.
    <strong>No son una posición.</strong> Un orden se construye comparando, y el instrumento que
    ordena excluye a esta institución por construcción: no hay lugar en el que ponerla, y ponerla
    igualmente sería reintroducir por la puerta de atrás lo que la sección 8 del informe principal
    retiró por la de delante. El número está aquí para que el lector pueda auditar la decisión —ver
    qué se retiró— y para que las proyecciones de las secciones siguientes se apoyen en una base
    verificable en lugar de en adjetivos.</p>
  </div>

  <figure class="nobreak">
    <p class="fig-q">¿Qué acredita esta Escuela, y qué le falta para acreditar el resto?</p>
    <p class="fig-t">Dos capacidades completas, cinco a las que sólo les falta el instrumento, dos que
    existen un nivel más arriba y una que no consta</p>
    ${figuraPerfil('P. U. Católica de Valparaíso')}
    <figcaption>Cada capacidad vale hasta tres puntos. Los peldaños llenos son lo que la evidencia
    pública acredita hoy; los punteados, lo que la rúbrica pide y no encuentra. El perfil no tiene
    ninguna celda sin concluir: las trece rutas del protocolo que le corresponden se recorrieron, de
    modo que cada ausencia es una ausencia comprobada y no un hueco de investigación. La figura no
    ordena y no admite lectura comparativa.</figcaption>
  </figure>
</div>

<div class="page">
  <div class="hdr"><span>Informe 01 · complemento</span><span>La PUCV como caso de proyección · v1.1</span></div>

  <h3>Los doce puntos que faltan tienen tres formas, y sólo una es cara</h3>

  <p>El reparto importa más que la suma, porque cada forma se cierra con un acto distinto y cuesta
  una cosa distinta. Doce puntos repartidos en doce capacidades vacías serían un problema de
  construcción institucional. Repartidos como están, son sobre todo un problema de publicación.</p>

  <table>
    <thead><tr><th style="width:30mm">Forma</th><th style="width:14mm">Puntos</th><th>Qué falta, y qué acto lo cierra</th></tr></thead>
    <tbody>
      <tr><td class="k">Falta el instrumento</td><td>5</td>
          <td><strong>Cinco capacidades están en operación y ninguna publica el objeto citable que
          las acredita.</strong> Unidad especializada, presencia en pregrado, formación estructurada,
          alcance declarado e investigación pierden un punto cada una, y cada una lo recupera
          publicando un documento que en la mayoría de los casos ya existe: el acto que crea el
          programa, el código y los créditos de la asignatura, el del programa formativo, el alcance
          real de lo que se ejecuta y el código del proyecto adjudicado. Ninguno de los cinco exige
          decidir nada nuevo. Exigen publicar lo decidido.</td></tr>
      <tr><td class="k">Falta el nivel</td><td>4</td>
          <td><strong>Dos capacidades existen en la Universidad y no en la Escuela.</strong> La regla
          de uso de inteligencia artificial y la adopción declarada en la enseñanza constan como
          instrumentos universitarios de carácter orientador, no como decisiones de la unidad
          jurídica. Valen un punto en lugar de tres por esa razón y no por su contenido. Se cierran
          decidiendo en el nivel que la rúbrica pregunta —un acuerdo de Consejo de Escuela con
          deberes exigibles—, no construyendo nada nuevo. Es el único de los tres huecos que exige
          una decisión de gobierno.</td></tr>
      <tr><td class="k">Falta todo</td><td>3</td>
          <td><strong>La evaluación de efecto no consta, y no consta en ninguna Facultad del
          país.</strong> Es la única de las tres formas que no se cierra con un trámite: exige
          producir evidencia que hoy no existe. También es la única donde el esfuerzo no compra una
          posición sino una primicia, porque las diez instituciones del comparador están igualmente
          en cero y no hay un solo proyecto financiado en la materia. Las secciones 5 a 7 desarrollan
          exactamente esta vía.</td></tr>
    </tbody>
  </table>

  <div class="box key nobreak">
    <p>Nueve de los doce puntos que faltan —los cinco del instrumento y los cuatro del nivel— no
    dependen de construir nada. Dependen de publicar y de decidir dónde corresponde. Es la lectura
    más incómoda de este documento y también la más accionable: <strong>la distancia entre lo que
    esta Escuela hace y lo que puede acreditar es, en tres cuartas partes, una distancia
    documental.</strong></p>
  </div>

  <h3>Lo que el perfil sí acredita, y con qué</h3>

  <p>Las dos capacidades completas son las únicas de todo el corpus en las que esta institución
  alcanza el grado más alto de la rúbrica, y las dos lo alcanzan por la misma razón: existe un objeto
  con identificador que cualquiera puede comprobar sin preguntarle nada a la institución.</p>

  <table>
    <thead><tr><th style="width:44mm">Capacidad</th><th>Instrumento formal que la acredita</th></tr></thead>
    <tbody>
      <tr><td class="k">Herramienta desplegada</td>
          <td>Registro de propiedad intelectual de ScribeClaroPUCV, Certificado nº 2026-A-6558 de
          23-06-2026. Un asistente de redacción jurídica construido en la Escuela, accesible sin
          registro y con uso documentado fuera de la Universidad. No publica métricas de uso, y ése
          es el límite del registro.</td></tr>
      <tr><td class="k">Transferencia</td>
          <td>Convenio con la Corte Suprema de agosto de 2020, con decana y presidente de la Corte
          identificados y actividad derivada documentada. Es el único convenio del corpus con
          contraparte de esa jerarquía y con continuidad verificable.</td></tr>
    </tbody>
  </table>

  <div class="limite"><strong>Límite.</strong> Que estas dos capacidades estén completas no dice que
  la Escuela sea mejor en ellas que las demás: dice que en estas dos publicó el objeto que la rúbrica
  pide, y que en las otras ocho no. La rúbrica mide trazabilidad, no mérito, y ésa es la única cosa
  que un método basado en evidencia pública puede medir.</div>
</div>
`;

cambio(
  'Entra la sección nueva, antes de las proyecciones',
  frase('<!-- ═══════════════ 4 · PROYECCIONES ═══════════════ -->'),
  `${SECCIÓN}\n<!-- ═══════════════ 5 · PROYECCIONES ═══════════════ -->`,
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

  fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
  fs.writeFileSync(DESTINO, html, 'utf8');

  const palabras = html
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  console.log(
    `\n✓ ${path.relative(raíz, DESTINO).split(path.sep).join('/')} · ` +
      `${Math.round(fs.statSync(DESTINO).size / 1024)} KB · ${palabras} palabras`,
  );
  console.log(
    `  perfil publicado: ${pucv.piso} de 30 · ${pucv.nc} celdas sin concluir · sin posición`,
  );
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ejecutar();
}
