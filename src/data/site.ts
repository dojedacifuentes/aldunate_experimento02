/**
 * Identidad del sitio, navegación y avisos institucionales.
 *
 * El aviso de prototipo no es decorativo ni negociable: mientras no exista
 * autorización institucional, ninguna pantalla puede sugerir que esto es un
 * sitio oficial de la PUCV ni una voz oficial del profesor.
 */

/**
 * Responsable intelectual del laboratorio y de sus informes.
 *
 * Sustituye a «Equipo Experimento 02», que era una autoría genérica sobre un
 * trabajo con un responsable identificable: nadie puede pedirle cuentas a un
 * equipo. Un informe que se quiere citable necesita un nombre que responda.
 */
export const autor = {
  name: 'Diego Hernán Ojeda Cifuentes',
  credential: 'Licenciado en Ciencias Jurídicas',
  role: 'Asesor en inteligencia artificial',
  /** Cómo firma en portadas y fichas: nombre, y debajo qué lo habilita. */
  byline: 'Diego Hernán Ojeda Cifuentes · Licenciado en Ciencias Jurídicas · Asesor en inteligencia artificial',
} as const;

export const site = {
  name: 'Aldunate — Experimento 02',
  version: '0.3.0',
  shortName: 'ALDUNATE',
  subject: 'Eduardo Aldunate Lizana',
  tagline: 'Derecho constitucional, lenguaje y otras complicaciones.',
  description:
    'Laboratorio digital experimental dedicado al trabajo del profesor Eduardo Aldunate Lizana: Derecho constitucional, lenguaje, investigación, enseñanza e inteligencia artificial. Prototipo académico en construcción.',
  locale: 'es_CL',
  eyebrow: 'Un experimento digital',
  /**
   * Jerarquía de la portada: PRODUCTO → CAMPO → PROPUESTA → ACCIÓN.
   *
   * El `<h1>` era el nombre del profesor a 72 px. Dos problemas: el producto no
   * quedaba explicado, y una portada encabezada por su nombre se lee como sitio
   * suyo —y no lo es: no lo encargó y todavía no sabe que existe—. El nombre
   * baja a contexto; el laboratorio sube a titular.
   */
  field: 'Derecho, lenguaje, enseñanza e inteligencia artificial.',
  proposition:
    'Laboratorio académico experimental. Publica su cadena de evidencia completa —fuente, hallazgo, afirmación, conclusión— para que cualquiera pueda recorrerla hacia atrás y discutirla.',
  /** Se sobrescribe en Vercel con la URL real del despliegue. */
  url: 'https://aldunateexperimento02.vercel.app',
  repo: 'https://github.com/dojedacifuentes/aldunate_experimento02',
} as const;

/**
 * El sitio no muestra signos institucionales. El escudo de la Escuela de
 * Derecho se retiró el 31-08-2026 hasta que exista autorización expresa: un
 * descargo colocado bajo un escudo se lee como nota al pie, no como negación.
 * Ver `docs/DECISIONS.md` D-033.
 */
export const disclaimer = {
  short: 'Prototipo académico no oficial',
  long: 'Prototipo académico experimental en desarrollo. No constituye un sitio oficial de la Pontificia Universidad Católica de Valparaíso ni de su Escuela de Derecho, y no habla en nombre del profesor Eduardo Aldunate Lizana.',
} as const;

export interface NavEntry {
  href: string;
  label: string;
  /** Una línea. Lo que hay detrás de la puerta, antes de abrirla. */
  hint: string;
  code: string;
}

/**
 * Tres entradas primarias, dos secundarias.
 *
 * El orden manda: primero lo que se puede leer, tocar o usar. `/aldunate` era
 * la primera puerta y son tres páginas que declaran su propio hueco, mientras
 * `/investigacion` —veinticuatro fuentes registradas— vivía como secundaria y
 * ni siquiera aparecía en el header de escritorio. Estaba invertido.
 *
 * El código numérico es el orden de navegación, no un identificador estable:
 * si cambia el orden, cambian los códigos, y hay que renumerar también los
 * `code` de cada `PageHeader`.
 */
export const primaryNav: NavEntry[] = [
  {
    href: '/informes',
    label: 'Informes',
    hint: 'Biblioteca de documentos vivos, versionados y descargables.',
    code: '01',
  },
  {
    href: '/experimentos',
    label: 'Experimentos',
    // La pista nombra lo único que se puede jugar. Sin nombrarlo, desde la
    // portada el juego está a tres clics y no se llama de ninguna manera.
    hint: 'Constitution Lab, Gramatiquerías y La Ley de los Audaces, RPG jurídico jugable.',
    code: '02',
  },
  {
    href: '/laboratorio',
    label: 'Lab IA + Derecho',
    hint: 'Herramientas, prototipos y flujos verificables aplicados al Derecho.',
    code: '03',
  },
];

/**
 * Secundarias: sostienen a las primarias en vez de competir con ellas.
 * Investigación es de dónde sale la evidencia; Aldunate, sobre qué trabajo
 * versa el laboratorio.
 */
export const secondaryNav: NavEntry[] = [
  {
    href: '/investigacion',
    label: 'Investigación',
    hint: 'Registro de fuentes, matriz de evidencia y método.',
    code: '04',
  },
  {
    href: '/aldunate',
    label: 'Aldunate',
    hint: 'El trabajo que este laboratorio toma como objeto: temas, publicaciones y cursos.',
    code: '05',
  },
];

/**
 * El footer cierra; no vuelve a contar el sitio.
 *
 * Eran tres columnas con once enlaces —un segundo índice completo, con las
 * piezas sueltas de Experimentos incluidas—. Ahora es una sola fila con las
 * cinco secciones más la política de correcciones; las hijas se alcanzan desde
 * su sección, que es donde tienen
 * contexto.
 */
export const footerNav = [
  { href: '/informes', label: 'Informes' },
  { href: '/experimentos', label: 'Experimentos' },
  { href: '/laboratorio', label: 'Lab IA + Derecho' },
  { href: '/investigacion', label: 'Investigación' },
  { href: '/aldunate', label: 'Aldunate' },
  { href: '/correcciones', label: 'Correcciones' },
] as const;
