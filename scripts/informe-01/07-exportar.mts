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
  conclusionesSvg,
  frecuenciaCapacidadesSvg,
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

const VERSION = '0.8.0';
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
  /**
   * Indice. Es un marcador: cuando se empuja no existe todavia el documento que
   * tiene que listar. Los dos renderizadores lo resuelven al final, recorriendo
   * los encabezados que ya llevan `id`, de modo que no hay una lista que
   * mantener a mano y no puede quedarse vieja al mover un capitulo.
   */
  | { t: 'indice' }
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
const indice = () => doc.push({ t: 'indice' });
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

indice();

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

figura(
  '¿Qué capacidades están extendidas y cuáles son todavía excepcionales?',
  'La misma matriz, leída por filas: en cuántas de las once Facultades consta cada capacidad',
  frecuenciaCapacidadesSvg(),
  'La parte gris de cada barra importa tanto como la azul: una capacidad puede parecer rara porque lo es o porque no se buscó, y aquí las dos cosas se leen a la vez. Se ordena por capacidades en operación, que es lo único que la barra permite comparar sin ambigüedad; no hay ninguna institución nombrada, de modo que no ordena Facultades sino cuánto se ha extendido cada cosa.',
);

tabla(
  'Los seis estados',
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
figura(
  '¿Qué puede sostener este estudio, y con qué firmeza?',
  'Las siete conclusiones, con la clase de afirmación que son y la confianza declarada de lo que las sostiene',
  conclusionesSvg(),
  'La barra es la confianza de la afirmación más débil en que se apoya cada conclusión: una conclusión no es más firme que su apoyo más flojo. La escala arranca en 50 y no en 0 porque ninguna baja de 70; la referencia se dibuja para que esa elección quede a la vista. El orden es el del documento y no el de la confianza: ordenar por firmeza invitaría a leer la lista como un ranking de solidez y a descartar el final, que es donde está la única inferencia.',
);
p(
  'Cada conclusión cita las afirmaciones del dataset que la sostienen y ninguna introduce información que no aparezca antes en el documento. Las dos marcadas quedaron **acotadas por el análisis de sensibilidad**: siguen siendo hechos sobre el corpus, y como afirmación sobre cada Facultad quedan abiertas allí donde la ruta que las acreditaría no se recorrió.',
);
for (const c of informe01Conclusiones) {
  h(3, `${c.id} · ${c.titulo}`, c.id.toLowerCase());
  p(T(c.cuerpo));
  p(
    `**${c.clase === 'HECHO' ? 'Hecho sobre el corpus' : 'Inferencia'}${c.acotada ? ', de alcance acotado' : ''}.** Se apoya en ${c.apoyo.join(', ')}.`,
  );
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
h(2, 'Anexo D · Las capacidades, celda por celda', 'capacidades-tabla');
p(
  'La matriz del cuerpo en texto, para quien quiera el dato exacto, imprima en blanco y negro o llegue con un lector de pantalla. Es la misma información que dibuja la figura y sale de la misma función: no puede decir otra cosa.',
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

hr();
h(2, 'Anexo E · Matriz de evidencia localizada por dimensión', 'matriz');
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

/**
 * Entradas del indice: los capitulos de nivel 2 que declararon `id`.
 *
 * Se separa el cuerpo de los anexos porque son dos cosas distintas para quien
 * decide que leer: lo primero es el argumento y lo segundo el aparato que lo
 * sostiene. La marca es el propio titulo, que ya empieza por «Anexo».
 */
const entradasIndice = doc
  .filter((b): b is Extract<Bloque, { t: 'h' }> => b.t === 'h' && b.nivel === 2 && !!b.id)
  .map((b) => ({ id: b.id!, texto: b.texto, anexo: /^Anexo\b/.test(b.texto) }));

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
      case 'indice': {
        const linea = (e: (typeof entradasIndice)[number]) =>
          `- [${e.texto}](#${e.id})`;
        const cuerpo = entradasIndice.filter((e) => !e.anexo).map(linea);
        const anexos = entradasIndice.filter((e) => e.anexo).map(linea);
        return [
          '## Índice',
          '',
          cuerpo.join('\n'),
          anexos.length ? `\n**Anexos**\n\n${anexos.join('\n')}` : '',
        ]
          .filter(Boolean)
          .join('\n');
      }
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
          b.datos
            .map(([k, v]) => `<div><dt>${inline(k)}</dt><dd>${inline(v)}</dd></div>`)
            .join(''),
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
      case 'indice': {
        const lista = (xs: typeof entradasIndice) =>
          xs
            .map((e) => `<li><a href="#${e.id}">${esc(e.texto)}</a></li>`)
            .join('');
        const cuerpo = entradasIndice.filter((e) => !e.anexo);
        const anexos = entradasIndice.filter((e) => e.anexo);
        return [
          '<nav class="indice" id="indice" aria-labelledby="indice-t">',
          '<h2 id="indice-t">Índice</h2>',
          `<ol class="indice-lista">${lista(cuerpo)}</ol>`,
          anexos.length
            ? `<p class="indice-rotulo">Anexos</p><ol class="indice-lista indice-anexos">${lista(anexos)}</ol>`
            : '',
          '</nav>',
        ].join('');
      }
      case 'hr':
        return '<hr>';
    }
  })
  .join('\n');

const indiceRail = entradasIndice
  .map((e) => `<a href="#${e.id}">${esc(e.texto)}</a>`)
  .join('');

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap">
<title>Informe 01 · IA en Escuelas y Facultades de Derecho en Chile · v${VERSION}</title>
<style>
  :root{
    --paper:#FBFCFD; --surface:#F1F5F7; --surface-2:#E8EEF2; --plate:#FFFFFF;
    --ink:#0F1720; --ink-2:#3A4654; --muted:#5F6E7C; --rule:#DDE4EA; --rule-2:#C7D2DA;
    --navy:#1B3A5C; --teal:#276E7C; --ochre:#8A5E13; --brick:#93372A; --sage:#3F6444;
    --navy-soft:#E6EDF4; --teal-soft:#E0EEF1; --ochre-soft:#F6EEDD; --brick-soft:#F7E7E4; --sage-soft:#E6EFE7;
    --shadow:0 1px 2px rgba(15,23,32,.05), 0 8px 24px -12px rgba(15,23,32,.18);
    --sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
    --serif:"Spectral",Georgia,"Times New Roman",serif;
    --mono:"IBM Plex Mono",ui-monospace,"Cascadia Mono",Consolas,monospace;
    --rail:272px; --measure:68ch; --wide:1040px;
  }
  /*
    Paleta del motor de graficos. Son los mismos nombres que declara
    src/app/globals.css y los valores derivan ahora de las cinco tintas de
    arriba, de modo que una figura pertenece a la misma familia que el texto que
    la rodea. Si alla se renombra una variable, aqui hay que renombrarla.
    (Sin acentos graves: este bloque vive dentro de una plantilla de texto.)
  */
  :root{
    --g-op:#1B3A5C; --g-incip:#6E93B4; --g-incip-fondo:#E6EDF4;
    --g-entorno:#8A5E13; --g-entorno-fondo:#F6EEDD;
    --g-adyacente:#3F6444; --g-adyacente-fondo:#E6EFE7;
    --g-trama:#A9B6C1;
    --g-trama-fondo:#F2F5F7;
    --g-vacio:#EDF1F4; --g-linea:#C7D2DA; --g-suave:#5F6E7C; --g-banda:#E8EEF2;
    --g-cebra:rgba(15,23,32,.028); --g-contraste:#93372A; --g-halo:rgba(95,110,124,.15);
    --g-esc-1:#CBDCE8; --g-esc-2:#93B4CB; --g-esc-3:#4A7C9A; --g-esc-4:#1B3A5C;
    --g-tinta-op:#FBFCFD; --g-tinta-esc-3:#0F1720; --g-tinta-esc-2:#0F1720;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --paper:#0D1319; --surface:#151D25; --surface-2:#1C262F; --plate:#141C24;
      --ink:#E8EEF3; --ink-2:#B4C0CA; --muted:#8A98A4; --rule:#243039; --rule-2:#324150;
      --navy:#8FB3D4; --teal:#63B7C6; --ochre:#D8A852; --brick:#DD8375; --sage:#93BC94;
      --navy-soft:#182838; --teal-soft:#142C31; --ochre-soft:#2C2416; --brick-soft:#301C19; --sage-soft:#1A281B;
      --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px -14px rgba(0,0,0,.7);
      --g-op:#5E9BC4; --g-incip:#31607F; --g-incip-fondo:#152634;
      --g-entorno:#D8A852; --g-entorno-fondo:#2C2416;
      --g-adyacente:#93BC94; --g-adyacente-fondo:#1A281B;
      --g-trama:#46586A;
      --g-trama-fondo:#131C25;
      --g-vacio:#18222B; --g-linea:#324150; --g-suave:#8A98A4; --g-banda:#1C262F;
      --g-cebra:rgba(255,255,255,.026); --g-contraste:#DD8375; --g-halo:rgba(138,152,164,.18);
      --g-esc-1:#25455C; --g-esc-2:#356986; --g-esc-3:#5E9BC4; --g-esc-4:#8FC4E4;
      --g-tinta-op:#0D1319; --g-tinta-esc-3:#0D1319; --g-tinta-esc-2:#FBFCFD;
    }
  }

  :root[data-theme="dark"]{
    --paper:#0D1319; --surface:#151D25; --surface-2:#1C262F; --plate:#141C24;
    --ink:#E8EEF3; --ink-2:#B4C0CA; --muted:#8A98A4; --rule:#243039; --rule-2:#324150;
    --navy:#8FB3D4; --teal:#63B7C6; --ochre:#D8A852; --brick:#DD8375; --sage:#93BC94;
    --navy-soft:#182838; --teal-soft:#142C31; --ochre-soft:#2C2416; --brick-soft:#301C19; --sage-soft:#1A281B;
    --shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px -14px rgba(0,0,0,.7);
    --g-op:#5E9BC4; --g-incip:#31607F; --g-incip-fondo:#152634;
    --g-entorno:#D8A852; --g-entorno-fondo:#2C2416;
    --g-adyacente:#93BC94; --g-adyacente-fondo:#1A281B;
    --g-vacio:#18222B; --g-linea:#324150; --g-suave:#8A98A4; --g-banda:#1C262F;
    --g-cebra:rgba(255,255,255,.026); --g-contraste:#DD8375; --g-halo:rgba(138,152,164,.18);
    --g-esc-1:#25455C; --g-esc-2:#356986; --g-esc-3:#5E9BC4; --g-esc-4:#8FC4E4;
    --g-tinta-op:#0D1319; --g-tinta-esc-3:#0D1319; --g-tinta-esc-2:#FBFCFD;
  }
  *{box-sizing:border-box}
  body{
    margin:0; background:var(--paper); color:var(--ink);
    font-family:var(--serif); font-size:17px; line-height:1.66;
    -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
  }
  ::selection{background:var(--teal-soft); color:var(--ink)}
  a{color:var(--teal); text-underline-offset:.18em; text-decoration-thickness:.06em; overflow-wrap:anywhere}
  :focus-visible{outline:2px solid var(--teal); outline-offset:3px; border-radius:2px}

  #prog{position:fixed; top:0; left:0; height:2px; width:0; background:var(--teal); z-index:60; transition:width .1s linear}

  /* ---------- armazon ---------- */
  .shell{display:grid; grid-template-columns:var(--rail) minmax(0,1fr); max-width:1440px; margin:0 auto}
  .rail{
    position:sticky; top:0; align-self:start; height:100vh; overflow-y:auto; overscroll-behavior:contain;
    border-right:1px solid var(--rule); padding:34px 20px 40px 32px; background:var(--paper);
  }
  .rail::-webkit-scrollbar{width:6px}
  .rail::-webkit-scrollbar-thumb{background:var(--rule-2); border-radius:3px}
  .rail .brandmark{font-family:var(--mono); font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:var(--teal); font-weight:600; margin-bottom:6px}
  .rail .brandttl{font-family:var(--sans); font-size:14px; font-weight:600; line-height:1.32; color:var(--ink); margin:0 0 4px; text-wrap:balance}
  .rail .brandsub{font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:.04em; margin:0 0 20px}
  .rail nav{border-top:1px solid var(--rule); padding-top:16px}
  .rail nav a{
    display:block; font-family:var(--sans); font-size:12.6px; line-height:1.4; color:var(--ink-2);
    text-decoration:none; padding:5px 0 5px 11px; border-left:2px solid transparent;
  }
  .rail nav a:hover{color:var(--ink); border-left-color:var(--rule-2)}
  .rail nav a.on{color:var(--navy); border-left-color:var(--navy); font-weight:600}
  .railfoot{margin-top:26px; padding-top:16px; border-top:1px solid var(--rule); font-family:var(--mono); font-size:9.6px; line-height:1.7; color:var(--muted)}
  main{min-width:0; padding:0 clamp(20px,4vw,64px) 110px}

  /* ---------- portada ---------- */
  .portada{padding:clamp(48px,8vh,92px) 0 40px; max-width:var(--wide); border-bottom:1px solid var(--rule); margin-bottom:8px}
  .portada-eyebrow{font-family:var(--mono); font-size:10.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--teal); font-weight:600; margin:0}
  .portada h1{
    font-family:var(--sans); font-weight:700; letter-spacing:-.021em; line-height:1.08;
    font-size:clamp(2.1rem,4.6vw,3.4rem); margin:16px 0 0; text-wrap:balance; color:var(--ink); max-width:17ch;
  }
  .portada-sub{font-size:clamp(1.04rem,1.7vw,1.2rem); color:var(--ink-2); font-weight:300; font-style:normal; line-height:1.55; margin:20px 0 0; max-width:58ch}
  .portada-estado{
    display:inline-block; font-family:var(--mono); font-size:9.8px; font-weight:600; letter-spacing:.075em;
    text-transform:uppercase; padding:4px 9px; border-radius:2px; margin:24px 0 0;
    background:var(--ochre-soft); color:var(--ochre); border:1px solid color-mix(in srgb,var(--ochre) 30%,transparent);
  }
  .portada-marca{max-width:15rem; margin:30px 0 0; opacity:.95}
  .portada-marca .g-fig{width:100%}
  .portada-datos{
    display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:1px; background:var(--rule);
    border:1px solid var(--rule); margin:34px 0 0; font-family:var(--sans);
  }
  .portada-datos > div{background:var(--paper); padding:14px}
  .portada-datos dt{
    font-family:var(--mono); font-size:9.5px; letter-spacing:.09em; text-transform:uppercase;
    color:var(--muted);
  }
  .portada-datos dd{margin:5px 0 0; color:var(--ink-2); font-size:13.4px; line-height:1.45}
  .portada-pie{font-family:var(--sans); font-size:12.4px; line-height:1.6; color:var(--muted); margin:26px 0 0; max-width:70ch}

  /* ---------- indice ----------
     Dos columnas en pantalla ancha: veinticuatro capitulos en una sola columna
     obligan a desplazarse para ver el mapa entero, que es justo lo que el
     indice existe para evitar. El numero va fuera del texto, en mono, para que
     los titulos queden alineados entre si.                                   */
  .indice{max-width:var(--wide); margin:0; padding:44px 0 8px}
  .indice h2{margin:0; font-size:clamp(1.3rem,2.2vw,1.6rem)}
  .indice h2::after{margin:14px 0 22px}
  .indice-lista{list-style:none; margin:0; padding:0; counter-reset:ix;
    columns:2; column-gap:44px}
  .indice-anexos{counter-reset:ax}
  .indice-lista li{
    break-inside:avoid; position:relative; padding-left:34px; margin:0 0 9px;
    font-family:var(--sans); font-size:14.2px; line-height:1.42;
  }
  .indice-lista li::before{
    counter-increment:ix; content:counter(ix,decimal-leading-zero);
    position:absolute; left:0; top:.18em; font-family:var(--mono); font-size:10.5px;
    color:var(--muted); letter-spacing:.04em;
  }
  .indice-anexos li::before{counter-increment:ax; content:counter(ax,upper-alpha)}
  .indice-lista a{color:var(--ink-2); text-decoration:none; border-bottom:1px solid transparent}
  .indice-lista a:hover{color:var(--navy); border-bottom-color:var(--rule-2)}
  .indice-rotulo{
    font-family:var(--mono); font-size:10.2px; letter-spacing:.15em; text-transform:uppercase;
    color:var(--teal); font-weight:600; margin:26px 0 12px; padding-top:16px;
    border-top:1px solid var(--rule); max-width:none;
  }

  /* ---------- tipografia del cuerpo ---------- */
  h2{
    font-family:var(--sans); font-weight:700; font-size:clamp(1.6rem,2.9vw,2.15rem);
    line-height:1.13; letter-spacing:-.018em; color:var(--ink); text-wrap:balance;
    max-width:var(--measure); margin:78px 0 0; padding-top:0; border:0; scroll-margin-top:20px;
  }
  h2::after{content:""; display:block; border-top:2px solid var(--navy); width:52px; margin:18px 0 24px}
  h3{font-family:var(--sans); font-weight:600; font-size:1.22rem; line-height:1.3; letter-spacing:-.008em; color:var(--navy); margin:42px 0 12px; max-width:var(--measure); text-wrap:balance}
  h4{font-family:var(--mono); font-weight:600; font-size:.76rem; letter-spacing:.1em; text-transform:uppercase; color:var(--teal); margin:26px 0 8px; max-width:var(--measure)}
  p{margin:0 0 18px; max-width:var(--measure)}
  strong{font-weight:600; color:var(--ink)}
  code{font-family:var(--mono); font-size:.85em; background:var(--surface); padding:.1em .34em; border-radius:2px; color:var(--navy)}
  ul{max-width:var(--measure); margin:0 0 22px; padding:0; list-style:none}
  ul li{position:relative; padding-left:22px; margin-bottom:11px}
  ul li::before{content:""; position:absolute; left:2px; top:.62em; width:6px; height:6px; background:var(--teal)}
  hr{border:0; border-top:1px solid var(--rule); margin:44px 0; max-width:var(--measure)}

  aside{
    margin:32px 0; padding:20px 24px; background:var(--surface);
    border-left:3px solid var(--ochre); max-width:var(--measure);
    font-family:var(--sans); font-size:14.6px; line-height:1.6; color:var(--ink-2);
  }
  aside strong{color:var(--ink)}

  /* ---------- tablas ---------- */
  figure{margin:38px 0; max-width:min(100%,var(--wide))}
  figure > figcaption{
    font-family:var(--mono); font-size:10.2px; letter-spacing:.13em; text-transform:uppercase;
    color:var(--navy); font-weight:600; margin:0 0 11px;
  }
  .scroll{overflow-x:auto; border-top:2px solid var(--navy); border-bottom:2px solid var(--navy)}
  table{border-collapse:collapse; width:100%; min-width:620px; font-family:var(--sans); font-size:13.2px; line-height:1.48}
  thead th{
    background:var(--surface-2); color:var(--navy); font-weight:600; text-align:left;
    padding:11px 12px; vertical-align:bottom; border-bottom:1px solid var(--navy);
    font-size:12.1px; text-transform:none; letter-spacing:.005em;
  }
  tbody td, tbody th{padding:10px 12px; vertical-align:top; border-bottom:1px solid var(--rule); color:var(--ink-2); text-align:left}
  tbody th{font-weight:600; color:var(--ink)}
  tbody tr:nth-child(even) td, tbody tr:nth-child(even) th{background:var(--surface)}
  tbody tr:last-child td, tbody tr:last-child th{border-bottom:0}

  /* ---------- figuras ----------
     El SVG sale sin atributos de ancho ni de alto: el viewBox fija la
     proporcion y estas reglas fijan el tamano. Con un alto automatico el
     navegador recortaba la matriz por abajo sin avisar de nada.            */
  .g-figura{margin:48px 0; max-width:min(100%,var(--wide))}
  .g-figura figcaption{display:block; margin:0 0 14px; font-family:var(--sans); text-transform:none; letter-spacing:0; color:inherit}
  .g-pregunta{display:block; font-family:var(--mono); font-size:10.2px; text-transform:uppercase; letter-spacing:.15em; color:var(--teal); font-weight:600}
  .g-titulo{display:block; margin-top:8px; font-family:var(--sans); font-weight:600; font-size:1.18rem; line-height:1.32; letter-spacing:-.01em; color:var(--ink); text-wrap:balance; max-width:56ch}
  .g-caja{overflow-x:auto; overflow-y:hidden; background:var(--plate); border:1px solid var(--rule); box-shadow:var(--shadow); padding:14px; border-radius:2px}
  .g-caja .g-fig{min-width:34rem}
  .g-nota{margin:12px 0 0; font-family:var(--sans); font-size:12.4px; line-height:1.55; color:var(--muted); max-width:78ch}
  .g-fig{display:block; width:100%; height:auto; max-width:100%; font-family:var(--sans); overflow:visible}
  .g-t{fill:var(--ink)}
  .g-t-fila,.g-t-col,.g-t-punto{fill:var(--ink)}
  .g-t-eje,.g-t-leyenda,.g-t-rutas,.g-t-banda{fill:var(--g-suave)}
  .g-t-cifra{fill:var(--ink); font-variant-numeric:tabular-nums}
  .g-t-sobre-op{fill:var(--g-tinta-op); font-variant-numeric:tabular-nums}
  .g-t-sobre-esc-3{fill:var(--g-tinta-esc-3); font-variant-numeric:tabular-nums}
  .g-t-sobre-esc-2{fill:var(--g-tinta-esc-2); font-variant-numeric:tabular-nums}

  /* ---------- toggle de tema ---------- */
  .tt{
    position:fixed; right:18px; top:16px; z-index:55; width:34px; height:34px;
    display:grid; place-items:center; border:1px solid var(--rule); background:var(--paper);
    color:var(--muted); border-radius:50%; cursor:pointer; padding:0;
  }
  .tt:hover{color:var(--ink); border-color:var(--rule-2)}

  /* ---------- responsive ---------- */
  @media (max-width:1080px){
    :root{--rail:0px}
    .shell{grid-template-columns:1fr}
    .rail{display:none}
    main{padding:0 clamp(18px,5vw,40px) 84px}
    .indice-lista{columns:1}
    body{font-size:16.4px}
    .tt{top:10px; right:10px}
  }
  @media (prefers-reduced-motion:reduce){
    *{animation:none!important; transition:none!important; scroll-behavior:auto!important}
  }
  html{scroll-behavior:smooth}

  @media print{
    :root{
      --paper:#fff; --plate:#fff; --surface:#f4f6f8; --surface-2:#eef2f5;
      --ink:#111; --ink-2:#333; --muted:#555; --rule:#c9cfd5; --rule-2:#aab3bb;
      --navy:#17324f; --teal:#215c68; --ochre:#7a5211; --brick:#7a2d22; --sage:#365539;
      --shadow:none;
      --g-op:#17324f; --g-incip:#7d9db8; --g-incip-fondo:#e9eff5;
      --g-entorno:#7a5211; --g-entorno-fondo:#f4ecda;
      --g-adyacente:#365539; --g-adyacente-fondo:#e8efe9;
      --g-trama:#8d8d88;
      --g-trama-fondo:#f4f4f2;
      --g-vacio:#f0f3f5; --g-linea:#aab3bb; --g-suave:#444; --g-banda:#eef2f5;
      --g-cebra:rgba(0,0,0,.04); --g-contraste:#7a2d22; --g-halo:rgba(0,0,0,.09);
      --g-esc-1:#ccdae6; --g-esc-2:#93b2c9; --g-esc-3:#3f6d92; --g-esc-4:#17324f;
      --g-tinta-op:#fff; --g-tinta-esc-3:#111; --g-tinta-esc-2:#111;
    }
    body{background:#fff; color:#111; font-size:10.5pt}
    .shell{display:block; max-width:none}
    .rail,.tt,#prog{display:none}
    main{padding:0; max-width:none}
    a{color:#111; text-decoration:none}
    h2{margin-top:26pt; font-size:16pt}
    h3{font-size:12.5pt}
    aside{border-left-color:#111; background:none; break-inside:avoid}
    /*
      En pantalla las tablas anchas se desplazan dentro de su caja. En papel no
      hay a donde desplazarse: overflow auto recorta la columna de la derecha y
      el lector no se entera. El registro de 74 fuentes perdia asi su URL.
    */
    .scroll{overflow:visible}
    .g-caja{overflow:visible; border:0; box-shadow:none; padding:0}
    .g-caja .g-fig{min-width:0}
    .portada{min-height:0; height:92vh; break-after:page; border-bottom:0; padding-top:0}
    .indice{break-after:page; padding-top:0}
    .indice-lista{columns:2; column-gap:30px}
    .indice-lista li{font-size:9.5pt; margin-bottom:5px}
    .portada h1{font-size:24pt}
    .g-figura,.g-fig{break-inside:avoid}
    .g-titulo{font-size:11pt}
    table{table-layout:fixed; width:100%; min-width:0; font-size:7pt}
    th,td{overflow-wrap:anywhere; padding:.28rem .35rem}
    /* Una tabla de 74 filas no cabe en una pagina: se parte, pero no por dentro
       de una fila. Reservar la tabla entera dejaba paginas casi vacias. */
    figure{break-inside:auto}
    tr{break-inside:avoid}
    thead{display:table-header-group}
    h2,h3{break-after:avoid}
  }
</style>
</head>
<body>
<div id="prog"></div>
<button class="tt" id="tt" type="button" aria-label="Cambiar entre claro y oscuro">
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"
       stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/>
  <path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.1 6.1 4.6 4.6M19.4 19.4l-1.5-1.5M17.9 6.1l1.5-1.5M4.6 19.4l1.5-1.5"/></svg>
</button>
<div class="shell">
<aside class="rail">
  <p class="brandmark">Informe 01</p>
  <p class="brandttl">Uso y enseñanza de inteligencia artificial en Escuelas y Facultades de Derecho en Chile</p>
  <p class="brandsub">v${VERSION} · corte ${CORTE}</p>
  <nav aria-label="Índice del documento">${indiceRail}</nav>
  <p class="railfoot">Prototipo académico experimental.<br>No es un sitio oficial de la PUCV.<br>Documento generado el ${FECHA_VERSION}.</p>
</aside>
<main>
${cuerpoHtml}
<hr>
<p><small>Documento generado el ${FECHA_VERSION} desde el dataset canónico del repositorio
<code>dojedacifuentes/aldunate_experimento02</code>. Prototipo académico experimental: no es un
sitio oficial de la PUCV ni de su Escuela de Derecho, y no habla en nombre de ninguna persona.</small></p>
</main>
</div>
<script>
(function(){
  /* Barra de progreso y capitulo activo. Sin dependencias: el documento tiene
     que abrirse desde un disco, sin red y sin nada instalado.               */
  var prog=document.getElementById('prog');
  var enlaces=[].slice.call(document.querySelectorAll('.rail nav a'));
  var destinos=enlaces.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  function alDesplazar(){
    var h=document.documentElement;
    var alto=h.scrollHeight-h.clientHeight;
    if(prog) prog.style.width=(alto>0?(h.scrollTop/alto)*100:0)+'%';
    var activo=-1;
    for(var i=0;i<destinos.length;i++){
      var d=destinos[i];
      if(d&&d.getBoundingClientRect().top<=140) activo=i;
    }
    enlaces.forEach(function(a,i){a.classList.toggle('on',i===activo)});
  }
  addEventListener('scroll',alDesplazar,{passive:true});
  addEventListener('resize',alDesplazar,{passive:true});
  alDesplazar();

  /* El tema arranca en el del sistema y el boton lo fija. Se recuerda, porque
     quien elige claro para leer sesenta paginas no quiere volver a elegirlo. */
  var raiz=document.documentElement, clave='informe01-tema';
  try{ var g=localStorage.getItem(clave); if(g) raiz.setAttribute('data-theme',g); }catch(e){}
  var b=document.getElementById('tt');
  if(b) b.addEventListener('click',function(){
    var oscuroAhora = raiz.getAttribute('data-theme')
      ? raiz.getAttribute('data-theme')==='dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    var nuevo = oscuroAhora ? 'light' : 'dark';
    raiz.setAttribute('data-theme',nuevo);
    try{ localStorage.setItem(clave,nuevo); }catch(e){}
  });
})();
</script>
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
  official: false,
  status: 'borrador',
  methodology_version: 'METODOLOGIA_IA_DERECHO_V2.1',
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
