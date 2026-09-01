import { describe, expect, it } from 'vitest';

import {
  concepts,
  conceptEdges,
  conceptsWithCounts,
  corpusStats,
  doctrinalTopics,
  profileFacts,
  publications,
  sources,
  timeline,
} from './index';

/**
 * Integridad del perfil académico.
 *
 * El encargo pedía «un script de validación de fuentes». Es mejor una prueba:
 * corre en `npm run verify` y en CI, de modo que un `sourceId` mal escrito
 * rompe el pipeline en vez de desaparecer en silencio detrás de un `undefined`
 * filtrado por la interfaz. Es el defecto exacto que documenta
 * `docs/informes/07-puente-con-el-sitio.md`.
 *
 * Ninguna de estas pruebas mira el diseño. Todas miran si el sitio puede
 * sostener lo que afirma.
 */

const sourceIds = new Set(sources.map((s) => s.id));
const conceptIds = new Set(concepts.map((c) => c.id));
const publicationIds = new Set(publications.map((p) => p.id));

describe('fuentes', () => {
  it('ninguna fuente se repite', () => {
    expect(sourceIds.size).toBe(sources.length);
  });

  it('toda fuente declara qué sostiene y cuándo se consultó', () => {
    const incompletas = sources.filter((s) => !s.supports.trim() || !s.accessedDate);
    expect(incompletas.map((s) => s.id)).toEqual([]);
  });

  it('las URL, cuando existen, son absolutas y https', () => {
    const malas = sources.filter((s) => s.url !== undefined && !s.url.startsWith('https://'));
    expect(malas.map((s) => s.id)).toEqual([]);
  });

  it('toda fuente secundaria declara su reserva', () => {
    const sinCaveat = sources.filter((s) => s.tier === 'secundaria' && !s.caveat);
    expect(sinCaveat.map((s) => s.id)).toEqual([]);
  });
});

describe('publicaciones', () => {
  it('ningún id se repite', () => {
    expect(publicationIds.size).toBe(publications.length);
  });

  it('toda publicación cita al menos una fuente, y esa fuente existe', () => {
    const rotas = publications.filter(
      (p) => !p.sourceIds?.length || p.sourceIds.some((id) => !sourceIds.has(id)),
    );
    expect(rotas.map((p) => p.id)).toEqual([]);
  });

  it('toda publicación tiene año y sede', () => {
    const incompletas = publications.filter((p) => !p.year || !p.venue);
    expect(incompletas.map((p) => p.id)).toEqual([]);
  });

  it('los conceptos etiquetados existen en el mapa', () => {
    const rotas = publications.filter((p) => p.concepts?.some((c) => !conceptIds.has(c)));
    expect(rotas.map((p) => p.id)).toEqual([]);
  });

  it('`relatedWorks` apunta a obras del propio catálogo', () => {
    const rotas = publications.filter((p) => p.relatedWorks?.some((w) => !publicationIds.has(w)));
    expect(rotas.map((p) => p.id)).toEqual([]);
  });

  it('ninguna obra afirma una tesis: el campo se llena leyendo, no deduciendo', () => {
    // CLAUDE.md §2 y el encabezado de `publications.ts`. Si algún día alguien
    // lee los textos, esta prueba se cambia junto con el dato — a conciencia.
    const conTesis = publications.filter((p) => p.thesis);
    expect(conTesis.map((p) => p.id)).toEqual([]);
  });
});

describe('conceptos', () => {
  it('ningún concepto está vacío: todos etiquetan al menos una obra', () => {
    const huerfanos = conceptsWithCounts.filter((c) => c.count === 0);
    expect(huerfanos.map((c) => c.id)).toEqual([]);
  });

  it('las aristas del grafo unen conceptos existentes', () => {
    const rotas = conceptEdges.filter(
      (e) => !conceptIds.has(e.source) || !conceptIds.has(e.target),
    );
    expect(rotas).toEqual([]);
  });

  it('cada arista registra las obras que la sostienen', () => {
    const sinRespaldo = conceptEdges.filter((e) => e.publicationIds.length !== e.weight);
    expect(sinRespaldo).toEqual([]);
  });
});

describe('ficha y cronología', () => {
  it('todo dato de la ficha cita fuentes existentes', () => {
    const rotas = profileFacts.filter(
      (f) => !f.sourceIds.length || f.sourceIds.some((id) => !sourceIds.has(id)),
    );
    expect(rotas.map((f) => f.id)).toEqual([]);
  });

  it('un dato con una sola fuente secundaria no puede ir como FACT', () => {
    // El criterio declarado en `profile.ts`. Sin esta prueba, la regla es un
    // comentario; con ella, es una condición de compilación.
    const infladas = profileFacts.filter((f) => {
      if (f.classification !== 'FACT') return false;
      const tiers = f.sourceIds.map((id) => sources.find((s) => s.id === id)?.tier);
      return tiers.length === 1 && tiers[0] === 'secundaria';
    });
    expect(infladas.map((f) => f.id)).toEqual([]);
  });

  it('todo dato con nivel SIGNAL explica por qué no es FACT', () => {
    const sinNota = profileFacts.filter((f) => f.classification === 'SIGNAL' && !f.note);
    expect(sinNota.map((f) => f.id)).toEqual([]);
  });

  it('la cronología cita fuentes existentes y no viaja al futuro', () => {
    const rotas = timeline.filter(
      (t) =>
        t.sourceIds.some((id) => !sourceIds.has(id)) ||
        t.year > 2026 ||
        (t.endYear !== undefined && t.endYear < t.year),
    );
    expect(rotas.map((t) => t.id)).toEqual([]);
  });
});

describe('preguntas doctrinales', () => {
  it('cada entrada apunta a un concepto y a obras que existen', () => {
    const rotas = doctrinalTopics.filter(
      (t) =>
        !conceptIds.has(t.conceptId) ||
        !t.publicationIds.length ||
        t.publicationIds.some((id) => !publicationIds.has(id)),
    );
    expect(rotas.map((t) => t.id)).toEqual([]);
  });

  it('ninguna entrada se presenta como FACT', () => {
    // Sin los textos completos, una posición doctrinal no puede ser un hecho.
    const infladas = doctrinalTopics.filter((t) => t.classification === 'FACT');
    expect(infladas.map((t) => t.id)).toEqual([]);
  });

  it('toda entrada basada en resumen declara esa limitación', () => {
    const sinNota = doctrinalTopics.filter((t) => t.classification === 'SIGNAL' && !t.note);
    expect(sinNota.map((t) => t.id)).toEqual([]);
  });
});

describe('cifras que la interfaz muestra', () => {
  it('los recuentos se derivan del catálogo, no de un número escrito a mano', () => {
    expect(corpusStats.total).toBe(publications.length);
    expect(corpusStats.books + corpusStats.articles).toBe(publications.length);
    expect(corpusStats.concepts).toBe(concepts.length);
  });

  it('el tramo temporal cubre el catálogo completo', () => {
    const years = publications.map((p) => p.year).filter((y): y is number => typeof y === 'number');
    expect(corpusStats.span.from).toBe(Math.min(...years));
    expect(corpusStats.span.to).toBe(Math.max(...years));
  });
});
