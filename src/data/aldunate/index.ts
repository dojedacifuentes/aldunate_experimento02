import type { Course, CorpusConcept, ResearchLine } from '@/types';

import { concepts, conceptById } from './concepts';
import { doctrinalTopics } from './doctrinal';
import { profile, profileFacts, pendingContent, timeline } from './profile';
import { corpusSpan, publications, publicationById } from './publications';
import { sources, sourceById } from './sources';

export {
  concepts,
  conceptById,
  corpusSpan,
  doctrinalTopics,
  pendingContent,
  profile,
  profileFacts,
  publicationById,
  publications,
  sourceById,
  sources,
  timeline,
};

/**
 * Grafo de conceptos, derivado.
 *
 * Dos conceptos se conectan si al menos una obra los reúne. Las aristas no se
 * escriben a mano a propósito: escribirlas permitiría dibujar una relación que
 * el corpus no sostiene, que es exactamente el error que este archivo evita.
 * El peso de la arista es el número de obras compartidas, y es lo que la
 * visualización usa para el grosor de la línea.
 */
export interface ConceptEdge {
  source: string;
  target: string;
  weight: number;
  publicationIds: string[];
}

function buildEdges(): ConceptEdge[] {
  const pairs = new Map<string, ConceptEdge>();

  for (const pub of publications) {
    const ids = [...new Set(pub.concepts ?? [])].sort();
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const key = `${ids[i]}|${ids[j]}`;
        const existing = pairs.get(key);
        if (existing) {
          existing.weight += 1;
          existing.publicationIds.push(pub.id);
        } else {
          pairs.set(key, {
            source: ids[i],
            target: ids[j],
            weight: 1,
            publicationIds: [pub.id],
          });
        }
      }
    }
  }

  return [...pairs.values()].sort((a, b) => b.weight - a.weight);
}

export const conceptEdges: ConceptEdge[] = buildEdges();

/** Obras por concepto, ordenadas de la más reciente a la más antigua. */
export const publicationsByConcept = new Map(
  concepts.map((concept) => [
    concept.id,
    publications
      .filter((p) => p.concepts?.includes(concept.id))
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
  ]),
);

/** Vecinos de un concepto, con el peso de la relación. */
export const conceptNeighbours = new Map(
  concepts.map((concept) => [
    concept.id,
    conceptEdges
      .filter((e) => e.source === concept.id || e.target === concept.id)
      .map((e) => ({
        id: e.source === concept.id ? e.target : e.source,
        weight: e.weight,
      }))
      .sort((a, b) => b.weight - a.weight),
  ]),
);

/**
 * Conceptos con su recuento real de obras. La cifra que muestra la interfaz
 * sale de aquí: el encargo permite mostrarla «solo si se calcula a partir de
 * datos reales», y esta se calcula.
 */
export const conceptsWithCounts: (CorpusConcept & { count: number })[] = concepts
  .map((c) => ({ ...c, count: publicationsByConcept.get(c.id)?.length ?? 0 }))
  .sort((a, b) => b.count - a.count);

/** Recuentos del corpus, todos derivados. Ninguno escrito a mano. */
export const corpusStats = {
  total: publications.length,
  books: publications.filter((p) => p.kind === 'libro').length,
  articles: publications.filter((p) => p.kind === 'articulo').length,
  concepts: concepts.length,
  coauthored: publications.filter((p) => (p.coauthors?.length ?? 0) > 0).length,
  venues: new Set(publications.map((p) => p.venue).filter(Boolean)).size,
  span: corpusSpan,
  years: corpusSpan.to - corpusSpan.from,
};

/** Publicaciones agrupadas por década, para la vista temporal. */
export const publicationsByDecade = [...publications]
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
  .reduce<Map<number, typeof publications>>((acc, pub) => {
    if (typeof pub.year !== 'number') return acc;
    const decade = Math.floor(pub.year / 10) * 10;
    const bucket = acc.get(decade);
    if (bucket) bucket.push(pub);
    else acc.set(decade, [pub]);
    return acc;
  }, new Map());

/**
 * Ejes temáticos del laboratorio.
 *
 * Se conservan del diseño anterior y siguen describiendo **el alcance de este
 * sitio**, no la obra del profesor (CLAUDE.md §2). Ahora conviven con el mapa
 * de conceptos, que sí sale del corpus: son dos cosas distintas y la interfaz
 * las mantiene separadas.
 */
export const researchLines: ResearchLine[] = [
  {
    id: 'constitucional',
    title: 'Derecho constitucional',
    summary:
      'Estructura, interpretación y límites del texto constitucional. Qué hace una constitución cuando nadie la está mirando.',
    related: ['lenguaje', 'interpretacion'],
    status: 'activa',
  },
  {
    id: 'lenguaje',
    title: 'Lenguaje y Derecho',
    summary:
      'La norma como acto de lenguaje. Ambigüedad, vaguedad, textura abierta y las decisiones que se esconden en una coma.',
    related: ['constitucional', 'interpretacion', 'ia-derecho'],
    status: 'activa',
  },
  {
    id: 'interpretacion',
    title: 'Interpretación',
    summary:
      'Reglas sobre cómo seguir reglas. El punto donde la teoría del Derecho y la filosofía del lenguaje dejan de ser disciplinas distintas.',
    related: ['lenguaje', 'constitucional'],
    status: 'activa',
  },
  {
    id: 'ensenanza',
    title: 'Enseñanza del Derecho',
    summary:
      'Métodos, evaluación y competencias. Qué se transmite realmente en una sala de clases de Derecho y qué solo se supone transmitido.',
    related: ['ia-derecho', 'lenguaje'],
    status: 'activa',
  },
  {
    id: 'ia-derecho',
    title: 'Inteligencia artificial y Derecho',
    summary:
      'Uso, límites y trazabilidad de sistemas generativos en trabajo jurídico y en formación jurídica. Verificación antes que entusiasmo.',
    related: ['ensenanza', 'lenguaje', 'experimentacion'],
    status: 'activa',
  },
  {
    id: 'experimentacion',
    title: 'Experimentación',
    summary:
      'Prototipos, juegos y visualizaciones como forma de argumentar. Un experimento que se puede tocar discute mejor que un párrafo.',
    related: ['ia-derecho', 'interpretacion'],
    status: 'en-formacion',
  },
];

/** Vacío por diseño: no se ha verificado ningún curso. Ver CLAUDE.md §2. */
export const courses: Course[] = [];
