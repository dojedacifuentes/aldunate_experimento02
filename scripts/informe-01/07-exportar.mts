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
  informe01Hallazgos,
  informe01ResumenEjecutivo,
} from '../../src/data/informe01-hallazgos.js';
import {
  coberturaSvg,
  coberturaVsCapacidadSvg,
  direccionesSvg,
  escaleraSvg,
  lineaTiempoSvg,
  mapaDesarrolloSvg,
  marcaPortadaSvg,
  matrizCapacidadesSvg,
  mecanismosSvg,
} from '../../src/lib/informe01-graficos.js';
import {
  CAPACIDADES,
  celdaCapacidad,
  ESTADOS_CAPACIDAD,
  MECANISMOS,
} from '../../src/lib/informe01-capacidades.js';
import { cifrasInforme01, enPalabras } from '../../src/lib/informe01.js';
import {
  pucvBrechas,
  pucvDobleRevision,
  pucvFavorable,
  pucvLectura,
  pucvRecomendaciones,
} from '../../src/data/informe01-pucv.js';

const VERSION = '0.7.0';
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

/** Decimal en castellano: coma, no punto. */
const dec = (n: number) => String(n).replace('.', ',');

/* ── Modelo de documento ───────────────────────────────────────────────────── */

type Bloque =
  | { t: 'h'; nivel: 1 | 2 | 3 | 4; texto: string; id?: string }
  | { t: 'p'; texto: string }
  | { t: 'nota'; texto: string }
  | { t: 'ul'; items: string[] }
  | { t: 'tabla'; titulo: string; cabecera: string[]; filas: string[][] }
  /**
   * Figura. `svg` llega de `src/lib/informe01-graficos.ts`, el mismo módulo que
   * dibuja las figuras del sitio: no hay dos motores de gráficos, hay uno con dos
   * huéspedes. En Markdown, que no admite SVG, se escribe la lectura declarada y
   * la descripción larga de la figura, que es la alternativa textual que el SVG
   * ya lleva dentro para los lectores de pantalla.
   */
  | { t: 'figura'; pregunta: string; titulo: string; svg: string; nota?: string }
  /**
   * Portada. Existe como bloque propio porque un documento que se envía a una
   * persona necesita una primera página, y la versión anterior abría con un
   * título, dos líneas en negrita y una tabla de metadatos. En Markdown se
   * degrada a encabezado y lista, que es lo que ese formato admite.
   */
  | {
      t: 'portada';
      titulo: string;
      subtitulo: string;
      estado: string;
      marca: string;
      datos: [string, string][];
      pie: string;
    }
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
const figura = (pregunta: string, titulo: string, svg: string, notaFigura?: string) =>
  doc.push({ t: 'figura', pregunta, titulo, svg, nota: notaFigura });
const portada = (b: Extract<Bloque, { t: 'portada' }>) => doc.push(b);

/** Extrae la `<desc>` del SVG: es la alternativa textual que va al Markdown. */
const descripcionDe = (svg: string) =>
  svg
    .match(/<desc>([\s\S]*?)<\/desc>/)?.[1]
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"') ?? '';

/* ── Cifras que la prosa interpola ──────────────────────────────────────────
 * Se calculan aquí, desde los mismos CSV que alimentan el resto del documento,
 * para que el paquete no dependa de la capa compilada de la web. Si un número
 * de la prosa dejara de cuadrar con el dataset, `resolverCifras` fallaría en
 * voz alta antes de escribir nada.                                           */
const verificadas = fuentes.filter((f) => f.verified_by).length;
const cifras: Record<string, string | number> = {
  /*
   * Las cifras derivadas de la capa de capacidades se traen de la misma función
   * que alimenta la web. Podrían recalcularse aquí desde los CSV, y esa fue la
   * primera tentación; pero dos implementaciones de la misma regla son dos
   * implementaciones que pueden separarse en silencio, y el punto de esta cadena
   * es que el documento y el sitio no puedan decir cosas distintas.
   */
  ...cifrasInforme01(),
  corte: '1 de septiembre de 2026',
  universidades: universidades.length,
  fuentes: fuentes.length,
  iniciativas: iniciativas.length,
  evidencias: evidencias.length,
  afirmaciones: afirmaciones.length,
  verificadas,
  noVerificadas: fuentes.length - verificadas,
  porcentajeVerificado: Math.round((verificadas / fuentes.length) * 100),
  razonCobertura: dec(razon),
  universitarios: evidencias.filter((e) => e.institutional_level === 'INSTITUCIONAL_UNIVERSIDAD')
    .length,
  evaluadas: iniciativas.filter((i) => i.current_status === '4').length,
  escalon1: iniciativas.filter((i) => i.current_status === '1').length,
  escalon2: iniciativas.filter((i) => i.current_status === '2').length,
  escalon3: iniciativas.filter((i) => i.current_status === '3').length,
};
const T = (s: string) => resolverCifras(s, cifras);

portada({
  t: 'portada',
  titulo:
    'Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile',
  subtitulo: 'Mapeo comparado de evidencia pública e institucionalización',
  estado: 'Borrador académico para revisión · no es un informe de resultados',
  marca: marcaPortadaSvg(),
  datos: [
    ['Versión', `v${VERSION}`],
    ['Fecha de corte', '1 de septiembre de 2026'],
    ['Cohorte', `${universidades.length} Escuelas y Facultades de Derecho`],
    ['Corpus', `${fuentes.length} fuentes · ${verificadas} contrastadas`],
    ['Autoría', 'Diego Hernán Ojeda Cifuentes'],
    ['Protocolo', 'METODOLOGIA_IA_DERECHO_V2.1'],
  ],
  pie: 'Prototipo académico experimental. No es una publicación oficial de la Pontificia Universidad Católica de Valparaíso ni de su Escuela de Derecho, y no habla en nombre de ninguna persona.',
});

tabla('Ficha del documento', ['Campo', 'Valor'], [
  ['Versión', `v${VERSION}`],
  ['Estado', 'Borrador académico para revisión'],
  ['Fecha de publicación', FECHA_VERSION],
  ['Fecha de corte', CORTE],
  ['Autoría', 'Diego Hernán Ojeda Cifuentes'],
  ['Cohorte', 'COHORTE_IA_DERECHO_CHILE_11_V1 · once instituciones, cerrada'],
  ['Protocolo', 'METODOLOGIA_IA_DERECHO_V2.1 · enmienda de la V2.0, que se conserva'],
  ['Capacidades comparadas', String(CAPACIDADES.length)],
  ['Mecanismos institucionales', String(MECANISMOS.length)],
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
    dec(razon) +
    ' veces mayor en las tres instituciones del piloto de profundidad que en las otras ocho. Ordenar sobre esa base produciría un ranking del trabajo de campo disfrazado de ranking de universidades.',
);
p(
  'Lo que sí publica es una cadena completa y recorrible hacia atrás: fuente → evidencia → iniciativa → afirmación. Cada afirmación trae su razonamiento, su contraevidencia, sus límites y su confianza, y cada evidencia dice qué prueba exactamente su fuente y qué no alcanza a probar.',
);

hr();
h(2, 'Resumen ejecutivo', 'resumen');
for (const parrafo of informe01ResumenEjecutivo) p(T(parrafo));

hr();
h(2, `Los ${enPalabras(informe01Hallazgos.length)} hallazgos principales`, 'hallazgos');
p(
  'Cada hallazgo declara el dato que lo sostiene, la lectura que permite y el límite hasta el que llega. **El límite no es un descargo: es parte del hallazgo**, y por eso ninguno se publica sin él.',
);
for (const hz of informe01Hallazgos) {
  h(3, `${hz.id} · ${hz.enunciado}`);
  p(`**Dato.** ${T(hz.dato)}`);
  p(`**Lectura.** ${T(hz.lectura)}`);
  nota(`**Límite.** ${T(hz.limite)}`);
  p(`*Se apoya en: ${hz.apoyo.join(' · ')}.*`);
}

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
h(2, 'Panorama del conjunto', 'panorama');
p(
  'Antes de comparar instituciones conviene ver la forma del conjunto: cuándo empezó, con qué instrumentos se está haciendo y hasta dónde ha llegado.',
);

figura(
  '¿Desde cuándo existe este fenómeno en las Facultades chilenas?',
  T(
    'El campo entero cabe en dos años: {iniciativasDesde2025} de las {iniciativasFechadas} iniciativas fechadas empiezan en 2025 o después',
  ),
  lineaTiempoSvg(),
  T(
    'El año es el de inicio declarado por la fuente, no el de su publicación. {iniciativasSinFecha} iniciativas no declaran fecha y no se les inventa una. Las dos anteriores a 2020 son unidades que existían antes de la inteligencia artificial generativa y que incorporaron el tema más tarde: su antigüedad no es antigüedad en esta materia.',
  ),
);

figura(
  '¿Con qué instrumentos institucionales se está incorporando la inteligencia artificial?',
  'Predominan los programas formativos y las herramientas; los convenios y las publicaciones son marginales',
  mecanismosSvg(),
  'El mecanismo es un eje nuevo de la metodología 2.1, ortogonal a la dimensión: la dimensión dice en qué ámbito académico ocurre algo y el mecanismo, con qué instrumento se hace. La clasificación no aporta evidencia nueva —reordena la que ya estaba verificada en el nombre, la unidad responsable y los productos de cada registro— y por eso no reabre la verificación de ninguna fuente.',
);

tabla(
  'Vocabulario de mecanismos institucionales',
  ['Mecanismo', 'Qué comprende', 'Iniciativas', 'De la Facultad'],
  MECANISMOS.map((m) => {
    const xs = iniciativas.filter((i) => i.mechanism_type === m.id);
    const propias = xs.filter((i) =>
      ['FACULTAD_DERECHO', 'CENTRO_PROGRAMA', 'EQUIPO'].includes(i.institutional_level),
    );
    return [m.label, m.definicion, String(xs.length), String(propias.length)];
  }),
);

figura(
  '¿Hasta dónde llega la institucionalización de lo que se hace?',
  'La escalera se llena hasta el tercer peldaño y se detiene antes del cuarto',
  escaleraSvg(),
  'El peldaño se aplica a la iniciativa y nunca a la universidad, y no se promedia: una institución puede exhibir muchas actividades con baja institucionalización y otra pocas pero formalizadas. Un promedio borraría justo esa diferencia.',
);
nota(
  'El cuarto peldaño está vacío. Se localizaron métricas de cobertura —cerca del 80 % del profesorado de Derecho de una Facultad, unos noventa participantes en un taller, dos cohortes graduadas— y ninguna es una medición de efecto: cuántos asistieron no dice si algo cambió. Con todo, la ruta del protocolo que acreditaría una evaluación publicada sólo se recorrió en dos de las once instituciones, de modo que la afirmación es firme sobre el corpus y sigue abierta sobre cada Facultad.',
);

figura(
  '¿Se está usando la IA para enseñar Derecho, o se la está estudiando como objeto jurídico?',
  'Tres de cada cuatro iniciativas usan la IA; una minoría la estudia como problema jurídico',
  direccionesSvg(),
  'Cada iniciativa recibe una sola dirección, y las que integran las dos de forma sustantiva se registran como AMBOS en vez de contarse dos veces. La categoría ADYACENTE existe para lo contrario: tratar como inteligencia artificial una tecnología digital que no lo es —realidad virtual, un laboratorio de innovación legal, una plataforma de búsqueda— es el modo de inflar un mapa sin inventar una sola fuente.',
);

hr();
h(2, 'Cobertura de la investigación', 'cobertura');
p(
  'Cuánto se investigó cada institución, que no es lo mismo que cuánto hace. Va antes que cualquier comparación porque sin este denominador la comparación engaña.',
);

figura(
  '¿Con qué profundidad se investigó cada institución?',
  'El trabajo de campo es desigual por diseño, y su reparto condiciona todo lo demás',
  coberturaSvg(),
  'Las dos cifras de la derecha miden nuestro trabajo, no el de la institución. La ruta 13 —fuentes externas de contraste— está sin recorrer en las once, de modo que el corpus hereda íntegro el sesgo de autodescripción: mide lo que las instituciones cuentan de sí mismas, y eso no se corrige agregando más fuentes del mismo tipo.',
);

tabla(
  'Rutas del protocolo recorridas por institución',
  ['Institución', 'Piloto', 'Rutas de 13', 'Fuentes', 'Contrastadas', 'Iniciativas', 'Evidencias'],
  ordenadas.map((u) => {
    const c = cobDe(u.university_id);
    const pct = Math.round((Number(c.substantively_verified_sources) / Number(c.sources)) * 100);
    return [
      u.official_name,
      c.in_pilot === 'si' ? 'sí' : '—',
      `${c.routes_completed}`,
      c.sources,
      `${c.substantively_verified_sources} (${pct} %)`,
      c.initiatives,
      c.evidence,
    ];
  }),
);
p(
  `Media del piloto: ${dec(mediaPiloto)} fuentes y ${dec(media(piloto, (c) => Number(c.routes_completed)))} rutas. Media de las otras ocho: ${dec(mediaResto)} fuentes y ${dec(media(resto, (c) => Number(c.routes_completed)))} rutas. Razón de ${dec(razon)} a 1.`,
);
nota(
  'La verificación tiene además su propio sesgo, y es de segundo orden. La PUCV llega al 86 % de sus fuentes contrastadas y la Universidad Autónoma al 0 %, de modo que la institución sobre la que este informe debe ser más cuidadoso es también la mejor comprobada. Por eso la marca de verificación de la matriz de capacidades se dibuja aparte del estado y nunca lo modifica.',
);

hr();
h(2, 'Capacidades institucionales comparadas', 'capacidades');
p(
  'El comparador principal de esta versión. Responde «¿qué capacidad demuestra cada Facultad?» y no «¿cuánta evidencia encontramos de ella?», que es la pregunta que contestaba la matriz de la versión anterior y que hacía leer una fila más poblada como una universidad que hace más.',
);
p(
  T(
    'Cada celda se calcula con una regla mecánica sobre el dataset. Una capacidad está **en operación** cuando la Facultad, un centro suyo o un equipo académico sostiene un mecanismo en el segundo peldaño de la escalera o más arriba. Las ausencias se separan en dos, y ésa es la corrección metodológica de la versión: **no localizada** significa que se recorrió la ruta del protocolo que la habría encontrado, y **no concluyente**, que esa ruta no se recorrió en esa institución. {celdasNoConcluyente} de las {celdas} celdas son de la segunda clase.',
  ),
);

figura(
  '¿Qué capacidad institucional demuestra cada Facultad, y dónde no podemos saberlo?',
  T('Diez capacidades, once Facultades, y {celdasNoConcluyente} de {celdas} celdas todavía sin respuesta'),
  matrizCapacidadesSvg(),
  'No hay total por fila ni por columna, y la falta es el diseño: sumar capacidades produciría un número por institución, y ese número sería un ranking del trabajo de campo tanto como del trabajo institucional.',
);

tabla(
  'Las diez capacidades y la pregunta que responde cada una',
  ['Capacidad', 'Pregunta', 'Rutas del protocolo que la acreditan'],
  CAPACIDADES.map((c) => [
    c.label,
    c.pregunta,
    c.rutas.length ? c.rutas.join(', ') : 'derivada de los registros, sin ruta propia',
  ]),
);

tabla(
  'Estado de cada capacidad por institución',
  ['Institución', ...CAPACIDADES.map((c) => c.short)],
  ordenadas.map((u) => [
    u.official_name,
    ...CAPACIDADES.map((c) => {
      const celdaCap = celdaCapacidad(u.university_id, c.id);
      const corto = ESTADOS_CAPACIDAD.find((e) => e.id === celdaCap.estado)!.corto;
      return celdaCap.contrastada ? `${corto} ·` : corto;
    }),
  ]),
);
nota(
  'El punto que sigue al estado marca que al menos una fuente de esa celda pasó la verificación sustantiva. Es una propiedad de esta investigación y no de la institución, y por eso viaja aparte del estado.',
);

tabla(
  'Los cinco estados',
  ['Estado', 'Qué significa'],
  ESTADOS_CAPACIDAD.map((e) => [e.label, e.definicion]),
);

hr();
h(2, 'La comprobación que impide leer mal todo lo anterior', 'control');
p(
  'Si cuánto se investiga y cuánto hacen las Facultades fueran la misma variable, el informe entero estaría midiendo su propio trabajo de campo. La comprobación es directa: se cruzan las dos.',
);

figura(
  '¿Cuánto de lo que vemos es lo que hacen las Facultades, y cuánto es dónde miramos?',
  T('{menosInvestigada} acredita tantas capacidades en operación como {masInvestigada} con una quinta parte del trabajo de campo'),
  coberturaVsCapacidadSvg(),
  'El eje vertical no es una nota ni un puntaje: es el recuento de preguntas que el corpus contesta afirmativamente, y está acotado por arriba por lo que se buscó. Cada punto lleva un halo gris proporcional a sus celdas sin concluir; un punto bajo con halo grande no dice «hace poco», dice «no lo sabemos».',
);
nota(
  T(
    'Este par de valores es la razón concreta por la que el informe no publica ranking. {menosInvestigada} es la institución menos investigada de las once —{menosInvestigadaRutas} de trece rutas, ninguna fuente contrastada— y aporta la única cobertura docente cuantificada de todo el corpus. Si el trabajo de campo y la capacidad institucional fueran la misma variable, ese punto no podría existir.',
  ),
);

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

figura(
  '¿Qué capacidades constan hoy en la PUCV y con qué instrumento las resolvieron las Facultades donde ya están en operación?',
  'Seis de las diez capacidades constan en operación; las otras cuatro no se reparten por igual',
  mapaDesarrolloSvg('pucv'),
  'No es un semáforo. La tercera columna no propone una meta: nombra las Facultades donde esa misma capacidad consta en operación, para que la comparación sea con un mecanismo concreto y no con un adjetivo. Que una capacidad quede sin concluir no es un reproche a la institución: es una tarea pendiente de esta investigación.',
);

h(3, 'Qué falta, y con qué instrumento lo resolvió quien ya lo resolvió');
p(
  'Cada fila nombra la capacidad, lo que aquí consta y el mecanismo concreto —con su institución— allí donde la misma capacidad está en operación. No propone qué hacer: pone el referente a la vista. Una capacidad sin referente también aparece, porque que nadie la haya resuelto es tan informativo como que alguien sí.',
);
tabla(
  'Comparador de mecanismos · PUCV',
  ['Capacidad', 'Estado aquí', 'Lo que consta', 'Mecanismo observado en otras Facultades'],
  CAPACIDADES.filter((c) => celdaCapacidad('pucv', c.id).estado !== 'EN_OPERACION').map((c) => {
    const propia = celdaCapacidad('pucv', c.id);
    const referentes = ordenadas
      .filter((o) => o.university_id !== 'pucv')
      .map((o) => ({ o, celda: celdaCapacidad(o.university_id, c.id) }))
      .filter((x) => x.celda.estado === 'EN_OPERACION');
    return [
      c.label,
      ESTADOS_CAPACIDAD.find((e) => e.id === propia.estado)!.label,
      propia.iniciativas.length
        ? propia.iniciativas.map((i) => i.name).join(' · ')
        : propia.motivo,
      referentes.length
        ? referentes
            .map((r) => `${r.celda.iniciativas.map((i) => i.name).join(', ')} (${r.o.official_name})`)
            .join(' · ')
        : 'En ninguna de las otras diez consta en operación.',
    ];
  }),
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
h(2, '6 bis · Implicancias para la PUCV', 'implicancias');
p(
  'Las conclusiones dicen qué muestra la evidencia. Esto dice qué preguntas de gestión abre esa evidencia, que es cosa distinta y no equivale a una recomendación. Ninguno de estos bloques afirma qué debe hacer la institución: enuncia un problema observado, la evidencia que lo sostiene, el referente donde ese mismo problema ya tiene un mecanismo, la decisión que eso abre y el indicador con el que podría comprobarse más adelante si se tomó.',
);
tabla(
  'De la evidencia a la decisión institucional',
  ['', 'Problema observado', 'Evidencia', 'Referente observado', 'Decisión que abre', 'Indicador'],
  pucvRecomendaciones.map((r) => [r.id, r.problema, r.evidencia, r.referente, r.accion, r.indicador]),
);

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
h(2, 'Anexo A · Las once instituciones, una por una', 'instituciones');
for (const u of ordenadas) {
  const c = cobDe(u.university_id);
  const inis = iniciativas.filter((i) => i.university_id === u.university_id);
  const fs = fuentes.filter((f) => f.university_id === u.university_id);
  h(3, u.official_name, `ficha-${u.university_id}`);
  p(`**${u.unit_name}** · ${u.notes}`);
  p(
    `Cobertura: ${c.routes_completed} de ${c.routes_total} rutas del protocolo · ${fs.length} fuentes, ${c.substantively_verified_sources} contrastadas · ${inis.length} iniciativas · ${c.dimensions_covered} de ${c.dimensions_total} dimensiones.`,
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
h(2, 'Anexo B · Afirmaciones, con su cadena completa', 'afirmaciones');
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
h(2, 'Anexo C · Lagunas declaradas', 'lagunas');
p('Quien vaya a citar este informe necesita saber qué no puede citar.');
for (const l of informe01Lagunas) {
  h(3, `${l.id} · ${l.titulo}`, l.id);
  p(T(l.cuerpo));
  p(`**Qué la cerraría.** ${T(l.cierre)}`);
}

hr();
h(2, 'Anexo D · Matriz de evidencia localizada por dimensión', 'matriz');
p(
  'Es el comparador con que se publicó la versión 0.6.0, bajo la metodología 2.0, y se conserva por dos razones. La primera es de trazabilidad: quien leyó la versión anterior debe poder reencontrar lo que leyó. La segunda es de honestidad metodológica: la matriz de capacidades es una propuesta nueva, y hacer desaparecer la anterior impediría comprobar si el cambio de instrumento cambió las conclusiones o sólo su presentación.',
);
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
nota(
  'Dos de las ocho dimensiones —recursos y capacidades, y continuidad, cobertura y resultados— no reúnen una sola evidencia en toda la cohorte. La metodología 2.1 sostiene que esa doble columna vacía es en parte un artefacto del modelo: no son ámbitos donde una iniciativa ocurra, sino atributos que cualquier iniciativa puede tener, y como el dataset obliga a elegir una dimensión primaria, ninguna cae nunca ahí. El diplomado con dos cohortes graduadas se clasifica en formación continua, y su continuidad —que es el dato— queda invisible.',
);

hr();
h(2, 'Anexo E · Doce temas de capacidad institucional en la PUCV', 'pucv-temas');
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
h(2, 'Anexo F · Auditoría de la línea base de 2025', 'auditoria');
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
h(2, 'Anexo G · Registro completo de fuentes', 'fuentes');
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
  '**Contrastar no es aceptar.** {verificadas} de las {fuentes} fuentes fueron abiertas y contrastadas contra su publicación original, y llevan fecha y firma. Ninguna está **aceptada**: la aceptación exige una decisión humana registrada que el procedimiento todavía no ha recogido.',
  '**Una ausencia sólo informa si se buscó donde correspondía.** La matriz de capacidades separa «no localizada» de «no concluyente» según se recorriera o no la ruta del protocolo que habría acreditado esa capacidad en esa institución.',
  '**El mecanismo no es la dimensión.** La dimensión dice en qué ámbito académico ocurre algo; el mecanismo, con qué instrumento se hace. Son ejes ortogonales y se publican por separado.',
].map(T));

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
      case 'portada':
        return [
          `# ${b.titulo}`,
          '',
          `**${b.subtitulo}**`,
          '',
          `**${b.estado}**`,
          '',
          ...b.datos.map(([k, v]) => `- ${k}: ${v}`),
          '',
          `> ${b.pie}`,
        ].join('\n');
      case 'figura':
        // El Markdown no admite SVG. Se escribe la lectura declarada, la
        // pregunta que la figura responde y su descripción larga, que es la
        // misma alternativa textual que el SVG lleva dentro para un lector de
        // pantalla. Quien lea el Markdown recibe el contenido, no un hueco.
        return [
          `**${b.titulo}**`,
          '',
          `*${b.pregunta}*`,
          '',
          descripcionDe(b.svg),
          ...(b.nota ? ['', `> ${b.nota}`] : []),
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
      case 'portada':
        return [
          '<section class="portada">',
          `<p class="portada-eyebrow">Informe 01 · Prototipo académico experimental</p>`,
          `<h1>${inline(b.titulo)}</h1>`,
          `<p class="portada-sub">${inline(b.subtitulo)}</p>`,
          `<p class="portada-estado">${inline(b.estado)}</p>`,
          `<div class="portada-marca">${b.marca}</div>`,
          '<dl class="portada-datos">',
          b.datos.map(([k, v]) => `<dt>${inline(k)}</dt><dd>${inline(v)}</dd>`).join(''),
          '</dl>',
          `<p class="portada-pie">${inline(b.pie)}</p>`,
          '</section>',
        ].join('');
      case 'figura':
        return [
          '<figure class="g-figura">',
          `<figcaption><span class="g-pregunta">${inline(b.pregunta)}</span>`,
          `<span class="g-titulo">${inline(b.titulo)}</span></figcaption>`,
          `<div class="g-caja">${b.svg}</div>`,
          b.nota ? `<p class="g-nota">${inline(b.nota)}</p>` : '',
          '</figure>',
        ].join('');
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
  /*
    Paleta del motor de gráficos. Son los mismos nombres que declara
    src/app/globals.css: el SVG no escribe un solo color, de modo que la misma
    figura se pinta aquí, en el sitio y en papel sin existir tres veces. Si allá
    se renombra una variable, aquí hay que renombrarla; es un contrato.
    (Sin acentos graves: este bloque vive dentro de una plantilla de texto.)
  */
  :root {
    --g-op:#1F5F84; --g-incip:#6FA3C4; --g-incip-fondo:#DCE8F1;
    --g-entorno:#B78C30; --g-entorno-fondo:#F5EBD5;
    --g-vacio:#E8E2D6; --g-linea:#C9C0AE; --g-suave:#6A6255; --g-banda:#E5DECF;
    --g-cebra:rgba(26,24,19,.035); --g-contraste:#8A2432; --g-halo:rgba(106,98,85,.16);
    --g-esc-1:#BDD5E5; --g-esc-2:#86B2CE; --g-esc-3:#4B87AE; --g-esc-4:#1F5F84;
  }
  @media (prefers-color-scheme: dark) {
    :root { --tinta:#e8e6e1; --papel:#14161a; --suave:#9a9a9a; --linea:#2c2f36; --acento:#d98b96; --azul:#7aa7d9; }
    :root {
      --g-op:#3E9CC4; --g-incip:#2F7191; --g-incip-fondo:#12283A;
      --g-entorno:#C7A34E; --g-entorno-fondo:#2A2417;
      --g-vacio:#152735; --g-linea:#2A4256; --g-suave:#9aa6ae; --g-banda:#1c2431;
      --g-cebra:rgba(255,255,255,.028); --g-contraste:#E08A97; --g-halo:rgba(147,166,181,.18);
      --g-esc-1:#234A61; --g-esc-2:#2E6C8A; --g-esc-3:#3E9CC4; --g-esc-4:#6FC5E4;
    }
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

  /* ── Figuras ────────────────────────────────────────────────────────────
     El SVG sale sin atributos de ancho ni de alto: el viewBox fija la
     proporción y estas reglas fijan el tamaño. Con un alto declarado como
     automático el navegador recortaba la matriz de capacidades por abajo, y
     no avisaba de nada.                                                    */
  /*
     Una figura no cabe en la columna de lectura. El cuerpo se mide para la
     prosa —46rem, unos 75 caracteres— y una matriz de once filas por diez
     columnas reducida a ese ancho deja de leerse. En pantallas anchas la figura
     se sale de la columna y se centra sobre el eje del texto; en papel manda el
     margen de la página y esta regla se apaga sola.
  */
  /* ── Portada ───────────────────────────────────────────────────────────── */
  .portada { min-height: 88vh; display: flex; flex-direction: column; justify-content: center;
    padding-bottom: 2rem; border-bottom: 1px solid var(--linea); }
  .portada-eyebrow { font-family: ui-sans-serif, system-ui, sans-serif; font-size: .7rem;
    text-transform: uppercase; letter-spacing: .12em; color: var(--acento); margin: 0 0 1.5rem; }
  .portada h1 { font-size: 2.5rem; line-height: 1.12; margin: 0 0 1rem; max-width: 22ch; }
  .portada-sub { font-style: italic; font-size: 1.15rem; color: var(--suave); margin: 0 0 1.75rem; }
  .portada-estado { display: inline-block; align-self: flex-start; font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: .78rem; padding: .4rem .8rem; border: 1px solid var(--acento); border-radius: 3px;
    color: var(--acento); margin: 0 0 2.5rem; }
  .portada-marca { max-width: 15rem; margin: 0 0 2.5rem; opacity: .92; }
  .portada-marca .g-fig { width: 100%; }
  .portada-datos { display: grid; grid-template-columns: max-content 1fr; gap: .35rem 1.25rem;
    font-family: ui-sans-serif, system-ui, sans-serif; font-size: .82rem; margin: 0 0 2rem;
    border-top: 1px solid var(--linea); padding-top: 1.25rem; }
  .portada-datos dt { color: var(--suave); text-transform: uppercase; font-size: .68rem;
    letter-spacing: .07em; padding-top: .15rem; }
  .portada-datos dd { margin: 0; color: var(--tinta); }
  .portada-pie { font-family: ui-sans-serif, system-ui, sans-serif; font-size: .72rem;
    line-height: 1.55; color: var(--suave); margin: 0; max-width: 46ch; }

  .g-figura { margin: 2rem 0; }
  @media (min-width: 62rem) {
    .g-figura { width: 58rem; margin-left: 50%; transform: translateX(-50%); }
  }
  .g-figura figcaption { display: block; margin-bottom: .75rem;
    font-family: ui-sans-serif, system-ui, sans-serif; text-transform: none; letter-spacing: 0; }
  .g-pregunta { display: block; font-size: .68rem; text-transform: uppercase;
    letter-spacing: .08em; color: var(--acento); }
  .g-titulo { display: block; margin-top: .3rem; font-family: Georgia, serif;
    font-size: 1.05rem; line-height: 1.3; color: var(--tinta); }
  .g-nota { margin-top: .6rem; padding-top: .5rem; border-top: 1px solid var(--linea);
    font-family: ui-sans-serif, system-ui, sans-serif; font-size: .74rem; line-height: 1.5;
    color: var(--suave); }
  .g-caja { overflow-x: auto; overflow-y: hidden; }
  /* Una figura densa no se encoge por debajo de lo legible: se desplaza. */
  .g-caja .g-fig { min-width: 34rem; }
  .g-fig { display: block; width: 100%; height: auto; max-width: 100%;
    font-family: ui-sans-serif, system-ui, sans-serif; overflow: visible; }
  .g-t { fill: var(--tinta); }
  .g-t-fila, .g-t-col, .g-t-punto { fill: var(--tinta); }
  .g-t-eje, .g-t-leyenda, .g-t-rutas, .g-t-banda { fill: var(--g-suave); }
  .g-t-cifra { fill: var(--tinta); font-variant-numeric: tabular-nums; }
  .g-t-cifra-clara { fill: var(--papel); font-variant-numeric: tabular-nums; }
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
    /* Lo mismo vale para una figura: en papel no hay a dónde desplazarse. */
    .g-caja { overflow: visible; }
    .g-caja .g-fig { min-width: 0; }
    /* En papel manda el margen de la página: la figura vuelve a la columna. */
    .g-figura { width: auto; margin-left: 0; transform: none; }
    /* La portada ocupa la primera hoja entera y nada se le sube detrás. */
    .portada { min-height: 0; height: 92vh; break-after: page; border-bottom: 0; }
    .portada h1 { font-size: 24pt; }
    .g-figura, .g-fig { break-inside: avoid; }
    .g-titulo { font-size: 11pt; }
    /* En papel manda el juego claro, con más contraste y sin tramas tenues. */
    :root {
      --g-op:#1a4d80; --g-incip:#5a86a6; --g-incip-fondo:#e6edf3;
      --g-entorno:#7a5c14; --g-entorno-fondo:#f2ead6;
      --g-vacio:#eeedea; --g-linea:#9a9a95; --g-suave:#444444; --g-banda:#eceae6;
      --g-cebra:rgba(0,0,0,.04); --g-contraste:#7a2030; --g-halo:rgba(0,0,0,.09);
      --g-esc-1:#c5d7e4; --g-esc-2:#8fb0c6; --g-esc-3:#4c7fa3; --g-esc-4:#1a4d80;
      --tinta:#111; --papel:#fff; --acento:#7a2030;
    }
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
// Los CSV canónicos se editan en Windows y llevan CRLF. El paquete se publica
// con un solo final de línea —el mismo del Markdown, el HTML y el JSON— para
// que sea portable y para que su manifiesto de integridad describa unos bytes
// que no dependan del sistema operativo de quien lo genere.
for (const csv of CSVS)
  escribir(
    join('dataset', csv),
    Buffer.from(readFileSync(join(DATASET, csv), 'utf8').replace(/\r\n/g, '\n'), 'utf8'),
  );

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
