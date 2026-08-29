import type { EvaMessage, EvaPortraitKey } from '@/types';

/**
 * EVA — guía residente.
 *
 * Identidad visible:
 *   EVA · Representante legal de tecnologías obsoletas.
 *
 * EVA es un avatar digital experimental. No finge ser una persona real, no
 * habla en nombre de la PUCV ni del profesor Aldunate, y no opina sobre el
 * fondo jurídico de nada.
 *
 * Reglas de comportamiento (implementadas en EvaProvider):
 *  - habla cuando cambia la ruta, nunca por temporizador;
 *  - una sola aparición automática, en la primera visita;
 *  - se puede cerrar y silenciar de forma persistente;
 *  - no bloquea la navegación ni tapa el contenido;
 *  - sin audio automático;
 *  - respeta `prefers-reduced-motion`.
 */

export const eva = {
  name: 'EVA',
  role: 'Representante legal de tecnologías obsoletas',
  disclosure:
    'EVA es un personaje digital experimental de este prototipo. No es una persona, no representa a la PUCV y no emite opinión jurídica.',
} as const;

export const evaPortraits: Record<EvaPortraitKey, { src: string; alt: string }> = {
  cyberpunk: { src: '/eva/eva-cyberpunk.png', alt: 'EVA, retrato en clave nocturna' },
  courtyard: { src: '/eva/eva-pucv-courtyard.png', alt: 'EVA en un patio universitario' },
  desk: { src: '/eva/eva-desk.png', alt: 'EVA en un escritorio de trabajo' },
  presenter: { src: '/eva/eva-presenter.png', alt: 'EVA en actitud de presentación' },
  lifestyle: { src: '/eva/eva-lifestyle-grid.png', alt: 'EVA, serie de retratos cotidianos' },
  neutral: { src: '/eva/eva-headshot-neutral.png', alt: 'EVA, retrato neutro' },
  smile: { src: '/eva/eva-headshot-smile.png', alt: 'EVA, retrato sonriente' },
  cafe: { src: '/eva/eva-cafe.png', alt: 'EVA en un café' },
  sunset: { src: '/eva/eva-sunset.png', alt: 'EVA al atardecer' },
  studio: { src: '/eva/eva-studio-grid.png', alt: 'EVA, serie de estudio' },
};

/**
 * Mensajes anclados a ruta. El emparejamiento toma el prefijo más largo, de
 * modo que `/informes/[slug]` gana sobre `/informes`.
 */
export const evaMessages: EvaMessage[] = [
  {
    id: 'home',
    route: '/',
    title: 'Bienvenida. Brevemente.',
    body: 'Esto es un laboratorio, no una página de profesor. Hay cuatro puertas y ninguna urgencia. Puede entrar por donde quiera; el orden es suyo.',
    portrait: 'courtyard',
    caveat: 'Prototipo en construcción. Lo que falta está declarado como faltante.',
  },
  {
    id: 'aldunate',
    route: '/aldunate',
    title: 'Sobre lo que todavía no está',
    body: 'Esta sección tiene menos contenido del que tendrá. Es deliberado: preferimos un vacío rotulado antes que un dato verosímil sin respaldo. Nada de lo académico se completa por analogía.',
    portrait: 'courtyard',
  },
  {
    id: 'papers',
    route: '/aldunate/papers',
    title: 'Catálogo en espera',
    body: 'Sin publicaciones cargadas. Podría haber inventado tres títulos plausibles y nadie lo habría notado hasta la primera cita. Por eso no lo hice.',
    portrait: 'lifestyle',
  },
  {
    id: 'cursos',
    route: '/aldunate/cursos',
    title: 'Docencia',
    body: 'Los cursos se incorporan confirmados o no se incorporan. Un programa mal atribuido sobrevive años en internet.',
    portrait: 'presenter',
  },
  {
    id: 'laboratorio',
    route: '/laboratorio',
    title: 'Herramientas, no logos',
    body: 'Cada ficha declara qué entra, qué sale y qué no hace. La tercera parte es la interesante. No todo lo que tiene un gradiente azul necesita llamarse inteligencia artificial.',
    portrait: 'cyberpunk',
  },
  {
    id: 'informes',
    route: '/informes',
    title: 'Documentos vivos',
    body: 'Dos informes abiertos, ninguno concluido. Se versionan hacia adelante: nada se sobrescribe en silencio. Detecté una tecnología obsoleta —el PDF de noventa y seis páginas sin índice— y procedo a representar legalmente a la víctima.',
    portrait: 'desk',
  },
  {
    id: 'informe-detalle',
    route: '/informes/',
    title: 'Tres capas de lectura',
    body: 'Resumen ejecutivo, metodología y fuentes. Puede quedarse en la primera capa sin culpa: para eso existe. He reducido el sufrimiento humano a tres niveles de profundidad.',
    portrait: 'desk',
    caveat: 'Informe en fase de investigación: alcance definido, hallazgos pendientes.',
  },
  {
    id: 'experimentos',
    route: '/experimentos',
    title: 'Aquí se puede romper cosas',
    body: 'Prototipos y piezas jugables. Lo que vea con contenido de demostración está rotulado como tal. La Constitución todavía no tiene botón de deshacer; estos experimentos sí.',
    portrait: 'cyberpunk',
  },
  {
    id: 'constitucion',
    route: '/experimentos/constitucion',
    title: 'Constitution Lab',
    body: 'Cambie una palabra y siga la onda expansiva. Es más instructivo que discutirlo en abstracto y considerablemente más barato que hacerlo en la realidad.',
    portrait: 'cyberpunk',
    caveat: 'Contenido de demostración. No corresponde a texto constitucional vigente.',
  },
  {
    id: 'gramatiquerias',
    route: '/experimentos/gramatiquerias',
    title: 'La coma que decide el caso',
    body: 'Ambigüedad sintáctica con consecuencias jurídicas. Si alguna vez sospechó que el Derecho es filosofía del lenguaje con toga, esta sección no lo va a tranquilizar.',
    portrait: 'lifestyle',
  },
  {
    id: 'juegos',
    route: '/experimentos/juegos',
    title: 'Consecuencias diferidas',
    body: 'Se decide rápido y con información incompleta. Los efectos aparecen varias jugadas después, cuando ya nadie recuerda quién los causó. Cualquier parecido con la realidad legislativa es estructural.',
    portrait: 'sunset',
  },
  {
    id: 'investigacion',
    route: '/investigacion',
    title: 'La capa aburrida e imprescindible',
    body: 'Fuente, evidencia, dato, visualización, conclusión. En ese orden y sin saltarse pasos. Un gráfico bonito sobre evidencia débil sigue siendo evidencia débil, solo que más persuasiva.',
    portrait: 'desk',
  },
];

/** Mensaje de primera visita. Aparece una vez y luego se calla. */
export const evaWelcome = {
  title: 'EVA',
  role: eva.role,
  body: 'Soy la guía de este laboratorio. Aparezco cuando cambia de sección, resumo lo que hay y advierto lo que falta. Puede silenciarme cuando quiera; no me lo tomo a mal, carezco de la facultad.',
  portrait: 'neutral' as EvaPortraitKey,
};

/**
 * Selecciona el mensaje cuyo `route` es el prefijo más largo del pathname.
 * `/` es un caso especial: solo coincide consigo mismo.
 */
export function evaMessageForRoute(pathname: string): EvaMessage | undefined {
  let best: EvaMessage | undefined;
  for (const m of evaMessages) {
    if (m.route === '/') {
      if (pathname === '/') best = m;
      continue;
    }
    if (pathname === m.route || pathname.startsWith(m.route)) {
      if (!best || m.route.length > best.route.length) best = m;
    }
  }
  return best;
}
