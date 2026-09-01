import type { AcademicSource } from '@/types';

/**
 * Fuentes del perfil académico.
 *
 * Orden de preferencia aplicado (encargo §27): índice bibliográfico o
 * publicación original antes que ficha institucional, y ficha institucional
 * antes que sitio colaborativo. Cuando una ficha secundaria es lo único que
 * hay, se usa —y el dato baja a `SIGNAL`, no se presenta como hecho.
 *
 * `supports` existe para impedir el abuso más común de una bibliografía: citar
 * la misma fuente al pie de todo. Si un dato no cae dentro de lo que la fuente
 * declara sostener, esa fuente no lo respalda.
 */
export const sources: AcademicSource[] = [
  {
    id: 'dialnet-autor',
    title: 'Eduardo Aldunate Lizana — ficha de autor',
    publisher: 'Dialnet, Universidad de La Rioja',
    tier: 'indice',
    url: 'https://dialnet.unirioja.es/servlet/autor?codigo=608485',
    supports:
      'Catálogo bibliográfico: título exacto, revista, volumen, número, año, páginas y coautoría de los artículos indexados.',
    accessedDate: '2026-09-01',
    caveat:
      'Índice, no repositorio de texto completo. Cubre lo indexado: la ausencia de una obra aquí no prueba que no exista.',
  },
  {
    id: 'scielo-expropiacion',
    title:
      'Limitación y expropiación: Scilla y Caribdis de la dogmática constitucional de la propiedad',
    publisher: 'Revista Chilena de Derecho 33(2), pp. 285–303 · SciELO Chile',
    tier: 'publicacion',
    url: 'https://www.scielo.cl/scielo.php?pid=S0718-34372006000200005&script=sci_abstract',
    supports:
      'Año (2006), volumen, páginas y título literal del artículo sobre limitación y expropiación.',
    accessedDate: '2026-09-01',
  },
  {
    id: 'scielo-fuerza-normativa',
    title: 'La fuerza normativa de la Constitución y el sistema de fuentes del derecho',
    publisher:
      'Revista de Derecho de la Pontificia Universidad Católica de Valparaíso 32(1), pp. 443–484 · SciELO Chile',
    tier: 'publicacion',
    url: 'https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0718-68512009000100013',
    supports:
      'Año (2009), volumen, páginas y planteamiento declarado del artículo sobre fuerza normativa y sistema de fuentes.',
    accessedDate: '2026-09-01',
  },
  {
    id: 'projure-pucv',
    title: 'Pro Jure — Revista de Derecho PUCV, ficha del artículo',
    publisher: 'Escuela de Derecho, Pontificia Universidad Católica de Valparaíso',
    tier: 'publicacion',
    url: 'https://www.projurepucv.cl/index.php/rderecho/article/view/700',
    supports: 'Alojamiento institucional del artículo de 2009 en la revista que lo publicó.',
    accessedDate: '2026-09-01',
  },
  {
    id: 'derechopedia',
    title: 'Eduardo Aldunate Lizana',
    publisher: 'DerechoPedia',
    tier: 'secundaria',
    url: 'https://derechopedia.cl/Eduardo_Aldunate_Lizana',
    supports:
      'Formación (licenciatura 1991, doctorado 1997), título de la tesis doctoral, ejercicio en la Subsecretaría de Pesca (1998–2001) y dirección de la Academia Judicial (2011–2018).',
    accessedDate: '2026-09-01',
    caveat:
      'Ficha colaborativa, sin aparato de referencias. Lo que solo consta aquí se publica como SIGNAL.',
  },
  {
    id: 'pucv-derecho',
    title: 'Escuela de Derecho PUCV — noticias institucionales',
    publisher: 'Pontificia Universidad Católica de Valparaíso',
    tier: 'institucional',
    url: 'https://www.pucv.cl/uuaa/derecho-pucv/noticias',
    supports:
      'Ejercicio del cargo de director de la Escuela de Derecho en el período actual y adscripción del programa DIAT a la Escuela.',
    accessedDate: '2026-09-01',
  },
  {
    id: 'academia-edu',
    title: 'Perfil de autor en Academia.edu',
    publisher: 'Academia.edu · afiliación PUCV',
    tier: 'secundaria',
    url: 'https://pucv.academia.edu/EduardoAldunate',
    supports: 'Afiliación institucional declarada y disponibilidad de textos subidos por el autor.',
    accessedDate: '2026-09-01',
    caveat: 'Perfil autogestionado. No es un índice arbitrado.',
  },
  {
    id: 'researchgate',
    title: 'Perfil de investigación en ResearchGate',
    publisher: 'ResearchGate · School of Law, PUCV',
    tier: 'secundaria',
    url: 'https://www.researchgate.net/profile/Eduardo-Aldunate-Lizana',
    supports: 'Afiliación declarada y acceso parcial a textos.',
    accessedDate: '2026-09-01',
    caveat:
      'Los recuentos de publicaciones y citas de la plataforma reflejan lo que se subió a ella, no la obra completa. No se usan como indicador bibliométrico.',
  },
];

/** Índice por id. Evita el `find` repetido en cada componente. */
export const sourceById = new Map(sources.map((s) => [s.id, s]));
