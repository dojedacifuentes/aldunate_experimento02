import { describe, expect, it } from 'vitest';

import { claims, sources } from './research';
import { reports } from './reports';
import { labTools } from './lab';
import { footerNav, primaryNav, secondaryNav } from './site';

/**
 * Pruebas de la capa de datos del sitio.
 *
 * Hasta ahora las 46 pruebas del repositorio eran **todas del juego**: ni una
 * sola tocaba `src/data/` ni las rutas. Los dos defectos que encontró la
 * auditoría del 31-08-2026 —un contador que dejó de contar, una vista que
 * afirmaba «registros vacíos» sobre veinticuatro fuentes cargadas— compilaban,
 * pasaban el lint y superaban el build. `npm run verify` no puede detectar un
 * dato falso que es sintácticamente correcto; una prueba, sí.
 *
 * Lo que se verifica aquí no es el diseño: son las afirmaciones que el sitio
 * hace sobre sí mismo.
 */

describe('trazabilidad de la evidencia', () => {
  it('cada afirmación cita fuentes que existen', () => {
    const ids = new Set(sources.map((s) => s.id));
    const rotas = claims.flatMap((c) =>
      c.sourceIds.filter((id) => !ids.has(id)).map((id) => `${c.id} → ${id}`),
    );
    expect(rotas).toEqual([]);
  });

  it('cada afirmación cita al menos una fuente', () => {
    const huerfanas = claims.filter((c) => c.sourceIds.length === 0).map((c) => c.id);
    expect(huerfanas).toEqual([]);
  });

  it('no hay identificadores repetidos', () => {
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length);
    expect(new Set(claims.map((c) => c.id)).size).toBe(claims.length);
  });

  it('los informes citan fuentes que existen', () => {
    const ids = new Set(sources.map((s) => s.id));
    const rotas = reports.flatMap((r) =>
      r.sourceIds.filter((id) => !ids.has(id)).map((id) => `${r.slug} → ${id}`),
    );
    expect(rotas).toEqual([]);
  });
});

describe('fechas con precisión declarada', () => {
  /**
   * `2025`, `2025-06` y `2025-06-25` son las tres formas admitidas, y cada una
   * dice cuánto se sabe. Lo que no se admite es `2025-01-01` puesto para que la
   * ficha parezca completa: inventar precisión es inventar un dato.
   */
  const FORMATO = /^\d{4}(-\d{2}(-\d{2})?)?$/;

  it('toda fecha de publicación tiene un formato reconocible', () => {
    const malas = sources
      .filter((s) => s.publishedDate && !FORMATO.test(s.publishedDate))
      .map((s) => `${s.id}: ${s.publishedDate}`);
    expect(malas).toEqual([]);
  });

  it('ninguna fecha es el 1 de enero, que es el relleno habitual', () => {
    const sospechosas = sources
      .filter((s) => s.publishedDate?.endsWith('-01-01'))
      .map((s) => `${s.id}: ${s.publishedDate}`);
    expect(sospechosas).toEqual([]);
  });
});

describe('navegación', () => {
  it('los códigos son únicos y consecutivos desde 01', () => {
    const codigos = [...primaryNav, ...secondaryNav].map((e) => e.code);
    expect(codigos).toEqual(codigos.map((_, i) => String(i + 1).padStart(2, '0')));
  });

  it('ninguna ruta está a la vez en primaria y en secundaria', () => {
    const p = new Set(primaryNav.map((e) => e.href));
    expect(secondaryNav.filter((e) => p.has(e.href))).toEqual([]);
  });

  it('el footer enlaza exactamente las cinco secciones de la navegación', () => {
    const nav = [...primaryNav, ...secondaryNav].map((e) => e.href).sort();
    expect(footerNav.map((l) => l.href).sort()).toEqual(nav);
  });
});

describe('lo que el sitio afirma de sí mismo', () => {
  it('ninguna ficha del Lab se declara estable sin artefacto que abrir', () => {
    const mentirosas = labTools
      .filter((t) => t.status === 'stable' && !t.demoUrl && !t.repoUrl)
      .map((t) => t.id);
    expect(mentirosas).toEqual([]);
  });

  it('todo informe tiene al menos una versión', () => {
    expect(reports.filter((r) => r.versions.length === 0)).toEqual([]);
  });

  it('las versiones publicadas de un informe no se repiten', () => {
    for (const r of reports) {
      const v = r.versions.map((x) => x.version);
      expect(new Set(v).size, `versiones repetidas en ${r.slug}`).toBe(v.length);
    }
  });
});
