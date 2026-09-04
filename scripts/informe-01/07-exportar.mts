/**
 * Exporta el Informe 01 a Markdown, HTML, CSV, JSON y ZIP.
 *
 *   npx tsx scripts/informe-01/07-exportar.mts
 *
 * Un solo modelo de documento se renderiza a los dos formatos de texto, de modo
 * que la versión web y la versión Markdown no pueden divergir: es el mismo
 * problema que la cadena de informes del repositorio resuelve para Word y PDF,
 * aplicado aquí.
 *
 * El PDF se imprime desde ese mismo HTML con Chromium, si hay un navegador
 * disponible. No es una segunda cadena de producción: es la misma, renderizada.
 * Si no lo hay, el script lo dice y el paquete sale sin PDF —el manifiesto lo
 * declara y el sitio no dibuja un botón que prometa un archivo inexistente—.
 *
 * Word sigue fuera: su generador es PowerShell 5.1 con Word por COM y sólo corre
 * en el equipo del autor.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { leerCsv, lista } from './csv.mjs';
import { crearZip } from './zip.mjs';
import {
  informe01AuditoriaBase,
  informe01Lagunas,
  informe01TemasPucv,
} from '../../src/data/informe01-editorial.js';
import {
  informe01Agenda,
  informe01Conclusiones,
  informe01Discusion,
  informe01Intereses,
  informe01Introduccion,
  informe01Limitaciones,
  informe01MetodologiaRelato,
  informe01ObjetivoGeneral,
  informe01ObjetivosEspecificos,
  resolverCifras,
} from '../../src/data/informe01-borrador.js';
import {
  pucvBrechas,
  pucvDobleRevision,
  pucvFavorable,
  pucvLectura,
  pucvRecomendaciones,
} from '../../src/data/informe01-pucv.js';

const VERSION = '0.6.0';
const FECHA_VERSION = '2026-09-04';
const CORTE = '2026-09-01';
const BASE = `informe-01-borrador-academico-v${VERSION}`;
const DESTINO = join('public', 'descargas', BASE);
const DATASET = 'content/reports/01_ia_escuelas_derecho_chile/canonical/dataset';

/* ── Datos ─────────────────────────────────────────────────────────────────── */

type Fila = Record<string, string>;
const universidades = leerCsv('universidades.csv') as Fila[];
const fuentes = leerCsv('fuentes.csv') as Fila[];
const iniciativas = leerCsv('iniciativas.csv') as Fila[];
const evidencias = leerCsv('evidencias.csv') as Fila[];
const cobertura = leerCsv('cobertura.csv') as Fila[];
const afirmaciones = leerCsv('afirmaciones.csv') as Fila[];

const DIMENSIONES: [string, string][] = [
  ['pregrado', 'Formación de pregrado'],
  ['formacion-continua', 'Formación continua y postgrado'],
  ['investigacion', 'Investigación y desarrollo'],
  ['vinculacion', 'Vinculación con el medio'],
  ['uso-institucional', 'Uso institucional de IA'],
  ['gobernanza', 'Gobernanza y estrategia'],
  ['recursos', 'Recursos y capacidades'],
  ['continuidad-resultados', 'Continuidad, cobertura y resultados'],
];

const ordenadas = [...universidades].sort((a, b) =>
  a.official_name.localeCompare(b.official_name, 'es'),
);
const cobDe = (id: string) => cobertura.find((c) => c.university_id === id)!;
const media = (xs: Fila[], f: (x: Fila) => number) =>
  Math.round((xs.reduce((s, x) => s + f(x), 0) / xs.length) * 10) / 10;
const piloto = cobertura.filter((c) => c.in_pilot === 'si');
const resto = cobertura.filter((c) => c.in_pilot !== 'si');
const mediaPiloto = media(piloto, (c) => Number(c.sources));
const mediaResto = media(resto, (c) => Number(c.sources));
const razon = Math.round((mediaPiloto / mediaResto) * 10) / 10;

/* ── Modelo de documento ───────────────────────────────────────────────────── */

type Bloque =
  | { t: 'h'; nivel: 1 | 2 | 3 | 4; texto: string; id?: string }
  | { t: 'p'; texto: string }
  | { t: 'nota'; texto: string }
  | { t: 'ul'; items: string[] }
  | { t: 'tabla'; titulo: string; cabecera: string[]; filas: string[][] }
  | { t: 'hr' };

const doc: Bloque[] = [];
const h = (nivel: 1 | 2 | 3 | 4, texto: string, id?: string) =>
  doc.push({ t: 'h', nivel, texto, id });
const p = (texto: string) => doc.push({ t: 'p', texto });
const nota = (texto: string) => doc.push({ t: 'nota', texto });
const ul = (items: string[]) => doc.push({ t: 'ul', items });
const tabla = (titulo: string, cabecera: string[], filas: string[][]) =>
  doc.push({ t: 'tabla', titulo, cabecera, filas });
const hr = () => doc.push({ t: 'hr' });

/* ── Cifras que la prosa interpola ──────────────────────────────────────────
 * Se calculan aquí, desde los mismos CSV que alimentan el resto del documento,
 * para que el paquete no dependa de la capa compilada de la web. Si un número
 * de la prosa dejara de cuadrar con el dataset, `resolverCifras` fallaría en
 * voz alta antes de escribir nada.                                           */
const verificadas = fuentes.filter((f) => f.verified_by).length;
const cifras: Record<string, string | number> = {
  corte: '1 de septiembre de 2026',
  universidades: universidades.length,
  fuentes: fuentes.length,
  iniciativas: iniciativas.length,
  evidencias: evidencias.length,
  afirmaciones: afirmaciones.length,
  verificadas,
  noVerificadas: fuentes.length - verificadas,
  porcentajeVerificado: Math.round((verificadas / fuentes.length) * 100),
  razonCobertura: razon,
  universitarios: evidencias.filter((e) => e.institutional_level === 'INSTITUCIONAL_UNIVERSIDAD')
    .length,
  evaluadas: iniciativas.filter((i) => i.current_status === '4').length,
};
const T = (s: string) => resolverCifras(s, cifras);

h(1, 'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile');
p('**Mapeo comparado de evidencia pública e institucionalización.**');
p('**Borrador académico para revisión.** No es un informe de resultados.');

tabla('Ficha del documento', ['Campo', 'Valor'], [
  ['Versión', `v${VERSION}`],
  ['Estado', 'Borrador académico para revisión'],
  ['Fecha de publicación', FECHA_VERSION],
  ['Fecha de corte', CORTE],
  ['Autoría', 'Diego Hernán Ojeda Cifuentes'],
  ['Cohorte', 'COHORTE_IA_DERECHO_CHILE_11_V1 · once instituciones, cerrada'],
  ['Protocolo', 'METODOLOGIA_IA_DERECHO_V2.0'],
  ['Universidades', String(universidades.length)],
  ['Fuentes públicas únicas', String(fuentes.length)],
  ['Iniciativas deduplicadas', String(iniciativas.length)],
  ['Evidencias', String(evidencias.length)],
  ['Afirmaciones', String(afirmaciones.length)],
  [
    'Fuentes con verificación sustantiva',
    `${verificadas} de ${fuentes.length} (${cifras.porcentajeVerificado}%)`,
  ],
  [
    'Iniciativas con evaluación de efecto',
    String(iniciativas.filter((i) => i.current_status === '4').length),
  ],
  ['URL del informe', 'https://aldunateexperimento02.vercel.app/informes/ia-escuelas-derecho-chile'],
]);

hr();
h(2, 'Cómo leer este documento', 'como-leer');
nota(
  'Este documento es un borrador para revisión y no debe citarse como informe de resultados. De sus ' +
    fuentes.length +
    ' fuentes, ' +
    verificadas +
    ' fueron abiertas y contrastadas contra su publicación original —el ' +
    cifras.porcentajeVerificado +
    '% del corpus—, y once de ellas no decían lo que el registro les atribuía. Las ' +
    (fuentes.length - verificadas) +
    ' restantes conservan el contenido que les asignó la investigación previa. Ningún registro está aceptado: la aceptación exige decisión humana registrada.',
);
p(
  'El documento tampoco publica ranking, tabla de posiciones ni puntaje agregado por universidad. La razón está medida: la cobertura de investigación es ' +
    razon +
    ' veces mayor en las tres instituciones del piloto de profundidad que en las otras ocho. Ordenar sobre esa base produciría un ranking del trabajo de campo disfrazado de ranking de universidades.',
);
p(
  'Lo que sí publica es una cadena completa y recorrible hacia atrás: fuente → evidencia → iniciativa → afirmación. Cada afirmación trae su razonamiento, su contraevidencia, sus límites y su confianza, y cada evidencia dice qué prueba exactamente su fuente y qué no alcanza a probar.',
);

hr();
h(2, 'Qué muestra la evidencia', 'hallazgos');
ul([
  'Cuatro Facultades de Derecho crearon entre 2025 y 2026 una estructura dedicada a tecnología o inteligencia artificial. Es un cambio de naturaleza respecto de la sucesión de seminarios, pero **ninguna de las cuatro publica el acto que la constituye**: sólo una tiene respaldo orgánico, en el organigrama de su Facultad.',
  'El uso interno de IA dejó de ser una casilla vacía: cuatro instituciones documentan herramientas o formación desplegadas dentro de la enseñanza del Derecho.',
  'La formación continua es el único eje con serie temporal documentada, y la serie es de una sola institución: dos graduaciones consecutivas, de más de 90 y más de 100 titulados. El programa equivalente de otra universidad de la cohorte figura cerrado desde 2022.',
  'Del corpus, una sola norma sobre uso de IA fue dictada por una Facultad de Derecho, con órgano aprobador identificado y sanción asociada. Los otros dos instrumentos son universitarios y de carácter orientador.',
  T(
    '{universitarios} registros corresponden a capacidades de la universidad y no de la Facultad, y quedan atribuidos como tales.',
  ),
]);

h(2, 'Qué no alcanza a mostrar', 'limites');
ul([
  'Si algo de esto funciona. **Ninguna de las ' +
    iniciativas.length +
    ' iniciativas registradas alcanza evidencia pública de evaluación de efecto sobre el aprendizaje.** Es la tercera ronda independiente de investigación que llega a la misma ausencia.',
  'Qué se enseña de verdad. No se localizó ningún syllabus de 2026 con obligatoriedad, semestre, créditos y matrícula real, en ninguna de las once.',
  'Con qué se sostiene. Dos de las ocho dimensiones —recursos y capacidades, y continuidad, cobertura y resultados— no reúnen una sola evidencia en toda la cohorte.',
  'Qué diría un tercero. Ninguna fuente del corpus proviene de contraste externo: la ruta 13 del protocolo está sin recorrer en las once instituciones.',
]);

hr();
h(2, '1 · Introducción', 'introduccion');
for (const parrafo of informe01Introduccion) p(T(parrafo));

hr();
h(2, '2 · Objetivos', 'objetivos');
h(3, 'Objetivo general');
p(T(informe01ObjetivoGeneral));
h(3, 'Objetivos específicos');
ul(informe01ObjetivosEspecificos.map(T));

hr();
h(2, '3 · Metodología', 'metodologia');
for (const bloque of informe01MetodologiaRelato) {
  h(3, bloque.titulo);
  for (const parrafo of bloque.parrafos) p(T(parrafo));
}
h(3, 'Declaración de intereses');
for (const parrafo of informe01Intereses) nota(T(parrafo));

hr();
h(2, 'Cobertura de la investigación', 'cobertura');
p(
  'Cuánto se investigó cada institución, que no es lo mismo que cuánto hace. Va antes que cualquier comparación porque sin este denominador la comparación engaña.',
);
tabla(
  'Rutas del protocolo recorridas por institución',
  ['Institución', 'Piloto', 'Rutas de 13', 'Fuentes', 'Iniciativas', 'Evidencias', 'Dimensiones de 8'],
  ordenadas.map((u) => {
    const c = cobDe(u.university_id);
    return [
      u.official_name,
      c.in_pilot === 'si' ? 'sí' : '—',
      `${c.routes_completed}`,
      c.sources,
      c.initiatives,
      c.evidence,
      c.dimensions_covered,
    ];
  }),
);
p(
  `Media del piloto: ${mediaPiloto} fuentes y ${media(piloto, (c) => Number(c.routes_completed))} rutas. Media de las otras ocho: ${mediaResto} fuentes y ${media(resto, (c) => Number(c.routes_completed))} rutas. Razón de ${razon}:1.`,
);
nota(
  'La institución con menos rutas recorridas de las once aporta la única cobertura docente cuantificada de todo el corpus. Si cobertura de investigación y madurez institucional fueran la misma variable, eso sería imposible.',
);

hr();
h(2, 'Evidencia localizada por universidad y dimensión', 'matriz');
p(
  'Cada celda indica el número de evidencias localizadas y, entre paréntesis, el escalón más alto que alcanza alguna iniciativa de esa universidad en esa dimensión. **No es un puntaje de madurez y no debe sumarse.** Las filas van en orden alfabético.',
);
tabla(
  'Evidencia pública localizada, al corte del ' + CORTE,
  ['Institución', ...DIMENSIONES.map(([, l]) => l)],
  ordenadas.map((u) => [
    u.official_name,
    ...DIMENSIONES.map(([id]) => {
      const evs = evidencias.filter(
        (e) => e.university_id === u.university_id && e.dimension === id,
      );
      const inis = iniciativas.filter(
        (i) => i.university_id === u.university_id && i.primary_dimension === id,
      );
      if (evs.length === 0) return '—';
      const max = Math.max(...inis.map((i) => Number(i.current_status)));
      return `${evs.length} (niv ${max})`;
    }),
  ]),
);

hr();
h(2, 'Escalera de institucionalización', 'escalera');
p(
  'La escalera se aplica a la **iniciativa** y no a la universidad, y no se promedia: una institución puede exhibir muchas actividades con baja institucionalización y otra pocas pero formalizadas, y un promedio borraría justo esa diferencia.',
);
tabla(
  'Distribución de las iniciativas por escalón',
  ['Nivel', 'Nombre', 'Condición mínima', 'Iniciativas'],
  [
    ['0', 'Sin evidencia pública', 'El protocolo se recorrió y no se localizó evidencia verificable.', '0'],
    ['1', 'Exploración', 'Anuncio, evento, piloto o iniciativa aislada.', ''],
    ['2', 'Operación', 'Actividad recurrente, curso activo o proyecto en ejecución.', ''],
    ['3', 'Institucionalización', 'Responsable formal, continuidad, cobertura, política, recursos o integración curricular.', ''],
    ['4', 'Evaluación', 'Productos, resultados o efectos públicamente revisables.', ''],
  ].map((f) => {
    const n = iniciativas.filter((i) => i.current_status === f[0]).length;
    return [f[0], f[1], f[2], String(n)];
  }),
);
nota(
  'El cuarto peldaño está vacío. Se localizaron métricas de cobertura —cerca del 80 % del profesorado de Derecho de una Facultad, unos noventa participantes en un taller, dos cohortes graduadas— y ninguna es una medición de efecto. Cuántos asistieron no dice si algo cambió.',
);

h(3, 'Iniciativas por dirección');
tabla(
  'Qué clase de relación con la IA',
  ['Dirección', 'Iniciativas', 'Qué significa'],
  [
    ['IA_PARA_DERECHO', '', 'La IA se usa para enseñar, investigar, redactar, litigar o atender.'],
    ['DERECHO_DE_IA', '', 'La IA es el objeto jurídico: regulación, responsabilidad, datos, debido proceso.'],
    ['AMBOS', '', 'La iniciativa integra las dos de forma sustantiva.'],
    ['ADYACENTE', '', 'Innovación, datos o tecnología donde la IA no es un componente central verificable.'],
  ].map((f) => [f[0], String(iniciativas.filter((i) => i.direction === f[0]).length), f[2]]),
);

hr();
h(2, 'Las once instituciones', 'instituciones');
for (const u of ordenadas) {
  const c = cobDe(u.university_id);
  const inis = iniciativas.filter((i) => i.university_id === u.university_id);
  const fs = fuentes.filter((f) => f.university_id === u.university_id);
  h(3, u.official_name, `ficha-${u.university_id}`);
  p(`**${u.unit_name}** · ${u.notes}`);
  p(
    `Cobertura: ${c.routes_completed} de ${c.routes_total} rutas del protocolo · ${fs.length} fuentes · ${inis.length} iniciativas · ${c.dimensions_covered} de ${c.dimensions_total} dimensiones · 0 fuentes con verificación sustantiva.`,
  );
  if (c.routes_missing) p(`Rutas sin recorrer: ${c.routes_missing.replaceAll('; ', ', ')}.`);
  tabla(
    `Iniciativas registradas · ${u.official_name}`,
    ['Iniciativa', 'Nivel', 'Atribución', 'Dirección', 'Trayectoria', 'Fuentes'],
    inis.map((i) => [
      i.name,
      i.current_status,
      i.institutional_level,
      i.direction,
      i.temporal_change,
      lista(i.source_ids).join(', '),
    ]),
  );
  const notas = inis.filter((i) => i.notes);
  if (notas.length > 0) {
    h(4, 'Advertencias de lectura');
    ul(notas.map((i) => `**${i.name}.** ${i.notes}`));
  }
}

hr();
h(2, '4 · Discusión', 'discusion');
for (const bloque of informe01Discusion) {
  h(3, bloque.titulo);
  for (const parrafo of bloque.parrafos) p(T(parrafo));
}

hr();
h(2, '5 · La PUCV en contexto', 'pucv');
p(
  'La sección reconoce primero lo que existe. El antecedente describía a la PUCV como un conjunto de iniciativas inconexas y la evidencia de 2026 no sostiene esa lectura.',
);

h(3, 'Evidencia favorable localizada');
tabla(
  'Siete hechos verificados',
  ['Hecho', 'Por qué cuenta', 'Fuente'],
  pucvFavorable.map((f) => [f.hecho, f.fuerza, f.fuente]),
);

h(3, 'Brechas');
tabla(
  'Seis brechas, con su comparador',
  ['Brecha', 'Alcance', 'Evidencia', 'Comparador'],
  pucvBrechas.map((b) => [
    b.brecha,
    b.esDeCohorte ? 'Alcanza a las once' : 'Propia de la PUCV',
    b.evidencia,
    b.comparador,
  ]),
);

h(3, 'Lectura');
for (const parrafo of pucvLectura) p(T(parrafo));

h(3, 'Doble revisión de la sección');
for (const d of pucvDobleRevision) nota(`**${d.pregunta}** ${T(d.respuesta)}`);

h(3, 'Recomendaciones de desarrollo institucional');
for (const r of pucvRecomendaciones) {
  h(4, `${r.id} · ${r.problema}`);
  p(`**Evidencia.** ${r.evidencia}`);
  p(`**Referente.** ${r.referente}`);
  p(`**Acción.** ${r.accion}`);
  p(`**Indicador.** ${r.indicador}`);
}

hr();
h(2, 'Doce temas de capacidad institucional', 'pucv-temas');
nota(
  'La PUCV es una de las tres del piloto: se recorrieron ' +
    cobDe('pucv').routes_completed +
    ' de 13 rutas y se localizaron ' +
    cobDe('pucv').sources +
    ' fuentes, frente a una media de ' +
    mediaResto +
    ' en las ocho restantes. Una carencia sólo se ve donde se ha buscado, de modo que la tabla describe una asimetría de evidencia y no una asimetría demostrada de actividad.',
);
tabla(
  'Doce temas de capacidad institucional',
  ['Tema', 'Estado', 'Qué muestra la evidencia pública', 'Próximo salto verificable'],
  informe01TemasPucv.map((t) => [
    t.tema,
    t.estado === 'existe' ? 'Existe' : t.estado === 'parcial' ? 'Parcial' : 'No demostrado públicamente',
    t.evidencia,
    t.salto,
  ]),
);

hr();
h(2, 'Afirmaciones', 'afirmaciones');
p(
  'Ninguna está aceptada. El nivel epistemológico dice qué clase de cosa es la afirmación; el estado editorial, cuánto ha caminado por el procedimiento.',
);
for (const c of afirmaciones) {
  h(3, c.claim_text, c.claim_id);
  p(
    `\`${c.claim_id}\` · **${c.classification}** · ${c.workflow_status} · confianza ${c.confidence}/100 · ` +
      (c.verified_by ? `contrastada el ${c.last_verified}` : 'verificación sustantiva pendiente'),
  );
  p(`**Razonamiento.** ${c.reasoning}`);
  p(`**Límites.** ${c.limitations}`);
  if (c.evidence_ids) p(`**Evidencia.** ${c.evidence_ids.replaceAll('; ', ', ')}`);
  if (c.counterevidence_ids)
    p(`**Contraevidencia.** ${c.counterevidence_ids.replaceAll('; ', ', ')}`);
}

hr();
h(2, 'Lagunas declaradas', 'lagunas');
p('Quien vaya a citar este informe necesita saber qué no puede citar.');
for (const l of informe01Lagunas) {
  h(3, `${l.id} · ${l.titulo}`, l.id);
  p(l.cuerpo);
  p(`**Qué la cerraría.** ${l.cierre}`);
}

hr();
h(2, '6 · Conclusiones', 'conclusiones');
p(
  'Cada conclusión cita las afirmaciones del dataset que la sostienen y ninguna introduce información que no aparezca antes en el documento.',
);
for (const c of informe01Conclusiones) {
  h(3, `${c.id} · ${c.titulo}`, c.id.toLowerCase());
  p(T(c.cuerpo));
  p(`**${c.clase}.** Se apoya en ${c.apoyo.join(', ')}.`);
}

hr();
h(2, '7 · Limitaciones', 'limitaciones');
p('Lo que este método no puede ver, dicho antes de que lo diga un lector.');
ul(informe01Limitaciones.map(T));

hr();
h(2, '8 · Agenda de investigación', 'agenda');
for (const a of informe01Agenda) {
  h(3, `${a.id} · ${T(a.pregunta)}`, a.id.toLowerCase());
  p(`**Por qué importa.** ${T(a.porQue)}`);
  p(`**Cómo se cierra.** ${T(a.comoSeCierra)}`);
}

hr();
h(2, 'Auditoría de la línea base', 'auditoria');
p(
  'El informe antecedente declaraba cinco dimensiones con un máximo de tres puntos cada una y, a la vez, asignaba valores de 0,25 a 1,50 a actividades individuales. Cuatro de sus totales no salen de sus propias puntuaciones.',
);
tabla(
  'Totales del antecedente que no cuadran con sus sumandos',
  ['Institución', 'Suma declarada', 'Total escrito', 'Qué ocurre'],
  informe01AuditoriaBase.map((f) => [f.institucion, f.suma, f.total, f.nota]),
);
p(
  '**Consecuencia registrada: ninguna puntuación heredada se arrastra.** El archivo antecedente se conserva sin modificar, con su error a la vista: corregirlo en silencio destruiría la prueba de que el error existió. Por la misma razón este documento no publica un gráfico de pendiente entre 2025 y 2026.',
);

hr();
h(2, 'Registro de fuentes', 'fuentes');
p(
  `Las ${fuentes.length} fuentes del corpus, con su estado editorial. La confianza es **documental** y se deriva de la jerarquía de fuentes del protocolo: no es una medida de madurez institucional.`,
);
tabla(
  'Registro completo de fuentes',
  ['ID', 'Institución', 'Título', 'Emisor', 'Tipo', 'Publicada', 'Estado', 'URL'],
  fuentes.map((f) => [
    f.source_id,
    f.university_id || '—',
    f.title,
    f.publisher,
    f.source_type,
    f.published_date === 'FECHA_NO_DECLARADA' ? 'no declarada' : f.published_date,
    f.workflow_status,
    f.url,
  ]),
);

hr();
h(2, 'Nota metodológica', 'metodo');
ul([
  '**Cohorte cerrada.** Once instituciones. El piloto de tres se conserva como profundidad, no como universo.',
  '**Universidad no es Facultad.** Toda evidencia se atribuye a la unidad que la fuente identifica. Una licencia de toda la universidad no es una capacidad de su Facultad de Derecho.',
  '**Un cero heredado no se arrastra.** La ausencia de evidencia pública en una ronda anterior no es evidencia de inexistencia.',
  '**Sin línea base congelada de 2025**, ninguna afirmación de la forma «X aumentó desde 2025» es publicable.',
  '**Las escalas no son comparables.** La del antecedente y la escalera 0–4 miden cosas distintas y no se restan.',
  '**La verificación sustantiva no se delega.** Ninguna fuente lleva fecha de verificación y ningún registro está aceptado.',
]);

p(
  'Fuente de verdad del documento: los seis CSV de `content/reports/01_ia_escuelas_derecho_chile/canonical/dataset/`, incluidos en este paquete. Los cinco documentos de investigación profunda que lo originaron están versionados en el repositorio y no se editan.',
);

/* ── Renderizado ───────────────────────────────────────────────────────────── */

const enlaceMd = (s: string) => s;
const md = doc
  .map((b) => {
    switch (b.t) {
      case 'h':
        return `${'#'.repeat(b.nivel)} ${b.texto}`;
      case 'p':
        return enlaceMd(b.texto);
      case 'nota':
        return `> ${b.texto}`;
      case 'ul':
        return b.items.map((i) => `- ${i}`).join('\n');
      case 'tabla':
        return [
          `**${b.titulo}**`,
          '',
          `| ${b.cabecera.join(' | ')} |`,
          `|${b.cabecera.map(() => '---').join('|')}|`,
          ...b.filas.map((f) => `| ${f.map((c) => c.replaceAll('|', '\\|')).join(' | ')} |`),
        ].join('\n');
      case 'hr':
        return '---';
    }
  })
  .join('\n\n');

const esc = (s: string) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const inline = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');

const cuerpoHtml = doc
  .map((b) => {
    switch (b.t) {
      case 'h':
        return `<h${b.nivel}${b.id ? ` id="${b.id}"` : ''}>${inline(b.texto)}</h${b.nivel}>`;
      case 'p':
        return `<p>${inline(b.texto)}</p>`;
      case 'nota':
        return `<aside>${inline(b.texto)}</aside>`;
      case 'ul':
        return `<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
      case 'tabla':
        return `<figure><figcaption>${inline(b.titulo)}</figcaption><div class="scroll"><table><thead><tr>${b.cabecera
          .map((c) => `<th scope="col">${inline(c)}</th>`)
          .join('')}</tr></thead><tbody>${b.filas
          .map(
            (f) =>
              `<tr>${f.map((c, i) => (i === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join('')}</tr>`,
          )
          .join('')}</tbody></table></div></figure>`;
      case 'hr':
        return '<hr>';
    }
  })
  .join('\n');

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Informe 01 · IA en Escuelas y Facultades de Derecho en Chile · v${VERSION}</title>
<style>
  :root { --tinta:#1a1a1a; --papel:#faf8f3; --suave:#5c5c5c; --linea:#dcd8d0; --acento:#8a2432; --azul:#29588c; }
  @media (prefers-color-scheme: dark) {
    :root { --tinta:#e8e6e1; --papel:#14161a; --suave:#9a9a9a; --linea:#2c2f36; --acento:#d98b96; --azul:#7aa7d9; }
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--papel); color:var(--tinta);
    font: 16px/1.65 Georgia, 'Times New Roman', serif; }
  main { max-width: 46rem; margin: 0 auto; padding: 3rem 1.25rem 6rem; }
  h1 { font-size: 1.9rem; line-height:1.2; margin: 0 0 .75rem; }
  h2 { font-size: 1.4rem; margin: 3rem 0 .75rem; padding-top: .5rem; border-top: 1px solid var(--linea); }
  h3 { font-size: 1.1rem; margin: 2rem 0 .5rem; }
  h4 { font-size: .95rem; margin: 1.25rem 0 .4rem; color: var(--suave); }
  p, li { margin: 0 0 .9rem; }
  aside { margin: 1.25rem 0; padding: .85rem 1.1rem; border-left: 3px solid var(--acento);
    background: color-mix(in srgb, var(--acento) 7%, transparent); font-size: .95rem; }
  code { font: .85em ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace; }
  a { color: var(--azul); overflow-wrap: anywhere; }
  hr { border:0; border-top:1px solid var(--linea); margin: 2.5rem 0; }
  figure { margin: 1.5rem 0; }
  figcaption { font-size: .8rem; color: var(--suave); margin-bottom: .5rem;
    font-family: ui-sans-serif, system-ui, sans-serif; text-transform: uppercase; letter-spacing: .06em; }
  .scroll { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; font-size: .82rem;
    font-family: ui-sans-serif, system-ui, sans-serif; }
  th, td { text-align: left; vertical-align: top; padding: .5rem .6rem; border-bottom: 1px solid var(--linea); }
  thead th { border-bottom: 1px solid var(--tinta); font-size: .72rem; text-transform: uppercase; letter-spacing: .05em; }
  tbody th { font-weight: 600; }
  @media print {
    body { background: #fff; color: #000; font-size: 10.5pt; }
    main { max-width: none; padding: 0; }
    a { color: #000; text-decoration: none; }
    aside { border-left-color: #000; background: none; break-inside: avoid; }
    /*
      En pantalla las tablas anchas se desplazan dentro de su caja. En papel no
      hay a dónde desplazarse: overflow auto recorta la columna de la derecha
      y el lector no se entera. El registro de 74 fuentes perdía así su URL.
      Aquí el desbordamiento se abre y la tabla se reparte el ancho de la página.
    */
    .scroll { overflow: visible; }
    table { table-layout: fixed; width: 100%; font-size: 7pt; }
    th, td { overflow-wrap: anywhere; padding: .28rem .35rem; }
    /* Una tabla de 74 filas no cabe en una página: se parte, pero no por dentro
       de una fila. Reservar la tabla entera dejaba páginas casi vacías. */
    figure { break-inside: auto; }
    tr { break-inside: avoid; }
    thead { display: table-header-group; }
    h2, h3 { break-after: avoid; }
  }
</style>
</head>
<body>
<main>
${cuerpoHtml}
<hr>
<p><small>Documento generado el ${FECHA_VERSION} desde el dataset canónico del repositorio
<code>dojedacifuentes/aldunate_experimento02</code>. Prototipo académico experimental: no es un
sitio oficial de la PUCV ni de su Escuela de Derecho, y no habla en nombre de ninguna persona.</small></p>
</main>
</body>
</html>
`;

/* ── Escritura del paquete ─────────────────────────────────────────────────── */

rmSync(DESTINO, { recursive: true, force: true });
mkdirSync(join(DESTINO, 'dataset'), { recursive: true });

const archivos: { nombre: string; contenido: Buffer }[] = [];
const escribir = (nombre: string, contenido: string | Buffer) => {
  const buf = Buffer.isBuffer(contenido) ? contenido : Buffer.from(contenido, 'utf8');
  writeFileSync(join(DESTINO, nombre), buf);
  archivos.push({ nombre, contenido: buf });
};

escribir(`${BASE}.md`, md);
escribir(`${BASE}.html`, html);

const CSVS = [
  'universidades.csv',
  'fuentes.csv',
  'iniciativas.csv',
  'evidencias.csv',
  'cobertura.csv',
  'afirmaciones.csv',
];
for (const csv of CSVS) escribir(join('dataset', csv), readFileSync(join(DATASET, csv)));

escribir(
  `${BASE}.json`,
  JSON.stringify(
    {
      report_id: 'informe-01',
      slug: 'ia-escuelas-derecho-chile',
      title:
        'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile',
      version: VERSION,
      release_date: FECHA_VERSION,
      cutoff_date: CORTE,
      universidades,
      fuentes,
      iniciativas,
      evidencias,
      cobertura,
      afirmaciones,
      lagunas: informe01Lagunas,
      auditoria_linea_base: informe01AuditoriaBase,
      temas_pucv: informe01TemasPucv,
    },
    null,
    2,
  ),
);

/* ── PDF, impreso del mismo HTML ───────────────────────────────────────────── */

/**
 * Imprime el HTML ya escrito. Devuelve `true` si el archivo quedó en disco.
 *
 * Chromium es opcional a propósito: `npm run verify` no debe depender de que
 * haya un navegador. Si falta, se avisa y el paquete sale sin PDF en vez de
 * fallar la construcción entera por un formato de salida.
 */
async function imprimirPdf(): Promise<Buffer | null> {
  let chromium: typeof import('playwright-core').chromium;
  try {
    ({ chromium } = await import('playwright-core'));
  } catch {
    console.warn('  playwright-core no está disponible: el paquete sale sin PDF.');
    return null;
  }
  const cabecera =
    'font-family: Georgia, serif; font-size: 7.5pt; color: #666; width: 100%; padding: 0 14mm;';
  // `playwright-core` no trae navegador. Se prueban, en orden, el que indique el
  // entorno, el Chrome del sistema y el Edge del sistema: en Windows casi
  // siempre hay uno de los dos, y así el PDF no exige instalar nada.
  const intentos = [
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : null,
    { channel: 'chrome' as const },
    { channel: 'msedge' as const },
    {},
  ].filter((x) => x !== null);
  let navegador = null;
  for (const opcion of intentos) {
    try {
      navegador = await chromium.launch({ ...opcion, args: ['--no-sandbox'] });
      break;
    } catch {
      /* se prueba el siguiente */
    }
  }
  if (!navegador) {
    console.warn('  No se encontró Chrome, Edge ni Chromium: el paquete sale sin PDF.');
    return null;
  }
  try {
    const pagina = await navegador.newPage();
    await pagina.goto(pathToFileURL(join(DESTINO, `${BASE}.html`)).href, { waitUntil: 'load' });
    await pagina.emulateMedia({ media: 'print', colorScheme: 'light' });
    return await pagina.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="${cabecera}"><span style="float:left">Informe 01 · IA en Escuelas y Facultades de Derecho en Chile</span><span style="float:right">v${VERSION} · corte ${CORTE.split('-').reverse().join('-')}</span></div>`,
      footerTemplate: `<div style="${cabecera}"><span style="float:left">Mapeo de evidencia pública · no es un informe de resultados</span><span style="float:right"><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
    });
  } finally {
    await navegador.close();
  }
}

const pdf = await imprimirPdf();
if (pdf) escribir(`${BASE}.pdf`, pdf);

const manifiesto = {
  report_id: 'informe-01',
  report_title:
    'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile',
  report_subtitle:
    'Mapeo comparado de evidencia pública e institucionalización · borrador académico para revisión',
  version: VERSION,
  release_date: FECHA_VERSION,
  cutoff_date: CORTE,
  author: 'Diego Hernán Ojeda Cifuentes',
  primary_recipient: 'Profesor Eduardo Aldunate Lizana',
  official: false,
  status: 'borrador',
  methodology_version: 'METODOLOGIA_IA_DERECHO_V2.0',
  cohort_version: 'COHORTE_IA_DERECHO_CHILE_11_V1',
  universities_count: universidades.length,
  sources_count: fuentes.length,
  initiatives_count: iniciativas.length,
  evidence_count: evidencias.length,
  claims_count: afirmaciones.length,
  // Ninguno de estos números se escribe a mano: si el dataset cambia, el
  // manifiesto cambia con él o el paquete queda mintiendo sobre su contenido.
  accepted_claims: afirmaciones.filter((c) => c.workflow_status === 'ACEPTADO').length,
  pending_claims: afirmaciones.filter((c) => c.workflow_status !== 'ACEPTADO').length,
  substantively_verified_sources: verificadas,
  substantively_verified_percent: cifras.porcentajeVerificado,
  initiatives_at_evaluation_level: iniciativas.filter((i) => i.current_status === '4').length,
  coverage_ratio_pilot_to_rest: razon,
  formats: ['md', 'html', ...(pdf ? ['pdf'] : []), 'csv', 'json', 'zip'],
  formats_missing: {
    docx: 'La cadena de documentos del repositorio es PowerShell 5.1 con Word por COM y sólo corre en el equipo del autor. Mientras el archivo no exista, el sitio no muestra el botón.',
    ...(pdf
      ? {}
      : {
          pdf: 'No se encontró un Chromium con el que imprimir el HTML. El PDF se genera con el mismo script cuando lo hay.',
        }),
  },
  pdf_note: pdf
    ? 'El PDF es una impresión del HTML de este mismo paquete, no un documento redactado aparte: los dos salen del mismo modelo y no pueden divergir.'
    : undefined,
  files: archivos.map((a) => a.nombre.replace(/\\/g, '/')),
  canonical_dataset: `${DATASET}/`,
  source_documents:
    'content/reports/01_ia_escuelas_derecho_chile/sources/investigacion-profunda/',
  citation_note:
    `Borrador académico para revisión. ${verificadas} de ${fuentes.length} fuentes (${cifras.porcentajeVerificado}%) fueron contrastadas contra su publicación original; las ${fuentes.length - verificadas} restantes conservan el contenido que les asignó la investigación previa. Ninguna afirmación está aceptada: aceptar exige decisión humana registrada. Cítese siempre con el número de versión, la fecha de consulta y la indicación de que es un borrador.`,
};
escribir('manifest.json', JSON.stringify(manifiesto, null, 2));

const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const checksums = archivos
  .map((a) => `${sha(a.contenido)}  ${a.nombre.replace(/\\/g, '/')}`)
  .join('\n');
escribir('checksums.sha256', `${checksums}\n`);

const zip = crearZip(
  archivos.map((a) => ({ nombre: `${BASE}/${a.nombre.replace(/\\/g, '/')}`, contenido: a.contenido })),
);
writeFileSync(join('public', 'descargas', `${BASE}.zip`), zip);

console.log(`Paquete escrito en ${DESTINO}/`);
for (const a of archivos) console.log(`  · ${a.nombre.replace(/\\/g, '/')}`);
console.log(`ZIP: public/descargas/${BASE}.zip · ${(zip.length / 1024).toFixed(0)} KB`);
console.log(`Markdown: ${(md.length / 1024).toFixed(0)} KB · HTML: ${(html.length / 1024).toFixed(0)} KB`);
console.log(pdf ? `PDF: ${(pdf.length / 1024).toFixed(0)} KB` : 'PDF: no generado (sin Chromium)');
