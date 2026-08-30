/**
 * Identidad del sitio, navegación y avisos institucionales.
 *
 * El aviso de prototipo no es decorativo ni negociable: mientras no exista
 * autorización institucional, ninguna pantalla puede sugerir que esto es un
 * sitio oficial de la PUCV ni una voz oficial del profesor.
 */

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
  /** Se sobrescribe en Vercel con la URL real del despliegue. */
  url: 'https://aldunateexperimento02.vercel.app',
  repo: 'https://github.com/dojedacifuentes/aldunate_experimento02',
} as const;

export const disclaimer = {
  short: 'Prototipo académico no oficial',
  long: 'Prototipo académico experimental en desarrollo. No constituye un sitio oficial de la Pontificia Universidad Católica de Valparaíso ni de su Escuela de Derecho, y no habla en nombre del profesor Eduardo Aldunate Lizana.',
  logoNotice:
    'El escudo de la Escuela de Derecho PUCV se muestra como referencia institucional del contexto académico del proyecto. Uso pendiente de autorización formal.',
} as const;

export interface NavEntry {
  href: string;
  label: string;
  /** Una línea. Lo que hay detrás de la puerta, antes de abrirla. */
  hint: string;
  code: string;
}

/**
 * Cuatro entradas. La contención es el diseño: un dashboard saturado obliga a
 * decidir antes de entender.
 */
export const primaryNav: NavEntry[] = [
  {
    href: '/aldunate',
    label: 'Aldunate',
    hint: 'Perfil intelectual, publicaciones, cursos y líneas de investigación.',
    code: '01',
  },
  {
    href: '/laboratorio',
    label: 'Lab IA + Derecho',
    hint: 'Herramientas, prototipos y flujos verificables aplicados al Derecho.',
    code: '02',
  },
  {
    href: '/informes',
    label: 'Informes',
    hint: 'Biblioteca de documentos vivos, versionados y descargables.',
    code: '03',
  },
  {
    href: '/experimentos',
    label: 'Experimentos',
    hint: 'Constitution Lab, Gramatiquerías, juegos y visualizaciones.',
    code: '04',
  },
];

/** Rutas secundarias: existen, pero no compiten por la atención principal. */
export const secondaryNav: NavEntry[] = [
  {
    href: '/investigacion',
    label: 'Investigación',
    hint: 'Registro de fuentes, matriz de evidencia y método.',
    code: '05',
  },
];

export const footerNav = [
  {
    title: 'Aldunate',
    links: [
      { href: '/aldunate', label: 'Perfil' },
      { href: '/aldunate/papers', label: 'Publicaciones' },
      { href: '/aldunate/cursos', label: 'Cursos' },
    ],
  },
  {
    title: 'Trabajo',
    links: [
      { href: '/laboratorio', label: 'Lab IA + Derecho' },
      { href: '/informes', label: 'Informes' },
      { href: '/investigacion', label: 'Investigación' },
    ],
  },
  {
    title: 'Experimentos',
    links: [
      { href: '/experimentos', label: 'Hub' },
      { href: '/experimentos/constitucion', label: 'Constitution Lab' },
      { href: '/experimentos/gramatiquerias', label: 'Gramatiquerías' },
      { href: '/experimentos/juegos', label: 'Juegos' },
    ],
  },
] as const;
