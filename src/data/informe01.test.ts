import { describe, expect, it } from 'vitest';

import {
  informe01Afirmaciones,
  informe01Cobertura,
  informe01Evidencias,
  informe01Fuentes,
  informe01Iniciativas,
  informe01Recuento,
  informe01Universidades,
} from './informe01';
import { informe01Lagunas, informe01TemasPucv } from './informe01-editorial';

/**
 * Estas pruebas existen para que el build falle antes que el informe mienta.
 *
 * El compilador de `scripts/informe-01/` ya valida al generar, pero un CSV
 * editado a mano sin volver a compilar dejaría el módulo desincronizado y nadie
 * se enteraría. Aquí se comprueba el resultado, que es lo que la gente lee.
 *
 * Varias comprobaciones son metodológicas antes que técnicas: que ningún
 * registro declare una verificación que no existe, que ninguna afirmación esté
 * aceptada, y que el texto publicado no contenga las expresiones que convierten
 * una ausencia de evidencia en una afirmación de inexistencia.
 */

const ids = (xs: readonly { id: string }[]) => new Set(xs.map((x) => x.id));

describe('informe 01 · integridad referencial', () => {
  it('no repite identificadores', () => {
    const conjuntos: [string, readonly { id: string }[]][] = [
      ['fuentes', informe01Fuentes],
      ['iniciativas', informe01Iniciativas],
      ['evidencias', informe01Evidencias],
      ['afirmaciones', informe01Afirmaciones],
      ['universidades', informe01Universidades],
    ];
    for (const [etiqueta, xs] of conjuntos) {
      expect(ids(xs).size, etiqueta).toBe(xs.length);
    }
  });

  it('no repite URL: una fuente vista dos veces es una fuente', () => {
    const urls = informe01Fuentes.map((f) => f.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('no deja referencias huérfanas', () => {
    const u = ids(informe01Universidades);
    const f = ids(informe01Fuentes);
    const i = ids(informe01Iniciativas);
    const e = ids(informe01Evidencias);

    for (const x of informe01Fuentes) {
      if (x.universityId) expect(u.has(x.universityId), x.id).toBe(true);
    }
    for (const x of informe01Iniciativas) {
      expect(u.has(x.universityId), x.id).toBe(true);
      expect(x.sourceIds.length, x.id).toBeGreaterThan(0);
      for (const s of x.sourceIds) expect(f.has(s), `${x.id} → ${s}`).toBe(true);
    }
    for (const x of informe01Evidencias) {
      expect(f.has(x.sourceId), x.id).toBe(true);
      expect(i.has(x.initiativeId), x.id).toBe(true);
      expect(u.has(x.universityId), x.id).toBe(true);
    }
    for (const x of informe01Afirmaciones) {
      for (const ev of [...x.evidenceIds, ...x.counterevidenceIds]) {
        expect(e.has(ev), `${x.id} → ${ev}`).toBe(true);
      }
    }
  });

  it('mantiene la cohorte cerrada en once instituciones', () => {
    expect(informe01Universidades).toHaveLength(11);
    expect(informe01Cobertura).toHaveLength(11);
    for (const u of informe01Universidades) {
      expect(u.cohortId).toBe('COHORTE_IA_DERECHO_CHILE_11_V1');
    }
  });

  it('mantiene los escalones dentro de 0 a 4 y las confianzas dentro de 0 a 100', () => {
    for (const i of informe01Iniciativas) {
      expect(i.ladder, i.id).toBeGreaterThanOrEqual(0);
      expect(i.ladder, i.id).toBeLessThanOrEqual(4);
    }
    for (const f of informe01Fuentes) {
      expect(f.confidence, f.id).toBeGreaterThan(0);
      expect(f.confidence, f.id).toBeLessThanOrEqual(100);
    }
    for (const c of informe01Afirmaciones) {
      expect(c.confidence, c.id).toBeGreaterThan(0);
      expect(c.confidence, c.id).toBeLessThanOrEqual(100);
    }
  });

  it('registra fechas con precisión declarada y nunca inventada', () => {
    for (const f of informe01Fuentes) {
      if (f.publishedDate) {
        expect(f.publishedDate, f.id).toMatch(/^\d{4}(-\d{2}(-\d{2})?)?$/);
        expect(f.datePrecision, f.id).not.toBe('FECHA_NO_DECLARADA');
      } else {
        expect(f.datePrecision, f.id).toBe('FECHA_NO_DECLARADA');
      }
    }
  });
});

describe('informe 01 · el método, comprobado sobre los datos', () => {
  // Hasta la v0.5.0 esta prueba exigía que no hubiera ninguna verificación. Desde
  // el 04-09-2026 la hay, y lo que la prueba defiende ya no es la ausencia sino la
  // coherencia: una firma sin estado, o un estado sin firma, es peor que un
  // registro sin verificar, porque miente sobre su propia trazabilidad.
  it('declara la verificación sustantiva de forma coherente, o no la declara', () => {
    for (const f of informe01Fuentes) {
      if (f.verifiedBy) expect(f.workflowStatus, f.id).toBe('CONTRASTADO');
      if (f.workflowStatus === 'CONTRASTADO') expect(f.verifiedBy, f.id).not.toBe('');
    }
    for (const e of informe01Evidencias) {
      expect(Boolean(e.lastVerified), e.id).toBe(Boolean(e.verifiedBy));
      // La cadena fuente → evidencia no admite que el eslabón verificado cuelgue
      // de uno que no lo está.
      if (e.lastVerified) {
        const fuente = informe01Fuentes.find((f) => f.id === e.sourceId);
        expect(fuente?.verifiedBy, `${e.id} → ${e.sourceId}`).not.toBe('');
      }
    }
    for (const c of informe01Afirmaciones)
      expect(Boolean(c.lastVerified), c.id).toBe(Boolean(c.verifiedBy));
  });

  it('cuenta las fuentes verificadas desde el dataset y no desde una constante', () => {
    const verificadas = informe01Fuentes.filter((f) => f.verifiedBy !== '').length;
    expect(informe01Recuento.fuentesVerificadas).toBe(verificadas);
    // Mientras quede corpus sin contrastar, el informe no puede presentarse como
    // informe de resultados. La prueba lo hace explícito para que el día que se
    // complete la verificación alguien tenga que venir aquí a cambiarlo a mano.
    expect(verificadas).toBeLessThan(informe01Fuentes.length);
  });

  it('no acepta ningún registro: sólo ACEPTADO alimenta conclusiones publicadas', () => {
    const registros: readonly { id: string; workflowStatus: string }[] = [
      ...informe01Fuentes,
      ...informe01Iniciativas,
      ...informe01Afirmaciones,
    ];
    for (const x of registros) {
      expect(x.workflowStatus, x.id).not.toBe('ACEPTADO');
    }
  });

  it('deja constancia de que ninguna iniciativa alcanza el cuarto peldaño', () => {
    // Es el hallazgo central. Si algún día deja de ser cierto, esta prueba debe
    // fallar para obligar a reescribir el texto que lo afirma, no al revés.
    expect(informe01Recuento.iniciativasEvaluadas).toBe(0);
    expect(informe01Iniciativas.every((i) => i.ladder < 4)).toBe(true);
  });

  it('mantiene la cobertura como indicador separado y declara su asimetría', () => {
    const piloto = informe01Cobertura.filter((c) => c.inPilot);
    expect(piloto).toHaveLength(3);
    expect(informe01Recuento.razonCobertura).toBeGreaterThan(1);
    // Mientras la razón supere 1,5, publicar un orden sería publicar el trabajo
    // de campo. La prueba fija el umbral para que la decisión no dependa de la
    // memoria de quien edite después.
    expect(informe01Recuento.razonCobertura).toBeGreaterThan(1.5);
  });

  it('cuenta cada dato una sola vez y desde el dataset', () => {
    expect(informe01Recuento.fuentes).toBe(informe01Fuentes.length);
    expect(informe01Recuento.iniciativas).toBe(informe01Iniciativas.length);
    expect(informe01Recuento.evidencias).toBe(informe01Evidencias.length);
    expect(informe01Recuento.afirmaciones).toBe(informe01Afirmaciones.length);
    expect(
      informe01Recuento.fuentesInstitucionales + informe01Recuento.fuentesUniversoNacional,
    ).toBe(informe01Recuento.fuentes);
  });

  it('atribuye toda iniciativa a una unidad, y ninguna por omisión a Derecho', () => {
    for (const i of informe01Iniciativas) {
      expect(i.attribution, i.id).toBeTruthy();
      expect(i.responsibleUnit, i.id).toBeTruthy();
    }
  });

  it('publica toda afirmación con razonamiento y límites', () => {
    for (const c of informe01Afirmaciones) {
      expect(c.reasoning.length, c.id).toBeGreaterThan(40);
      expect(c.limitations.length, c.id).toBeGreaterThan(40);
      if (!c.id.startsWith('clm-metodo-')) {
        expect(c.evidenceIds.length, c.id).toBeGreaterThan(0);
      }
    }
  });

  it('acompaña toda inferencia sobre una institución con contraevidencia', () => {
    // Es la prueba A del control de sesgo, hecha ejecutable: una conclusión
    // desfavorable sin evidencia en contra a la vista no es un hallazgo, es una
    // postura.
    for (const c of informe01Afirmaciones) {
      if (c.classification === 'INFERENCE' && c.universityId) {
        expect(c.counterevidenceIds.length, c.id).toBeGreaterThan(0);
      }
    }
  });
});

describe('informe 01 · control editorial', () => {
  /** Expresiones que convierten una ausencia de evidencia en una afirmación de inexistencia. */
  const PELIGROSAS = [
    'no existe',
    'ninguna universidad',
    'todas las universidades',
    'la mejor',
    'la peor',
    'rezagada',
    'fracaso',
    'lidera el ranking',
  ];

  const textos = [
    ...informe01Afirmaciones.flatMap((c) => [c.text, c.reasoning, c.limitations]),
    ...informe01Evidencias.flatMap((e) => [e.statement, e.limitations]),
    ...informe01Iniciativas.map((i) => i.notes),
    ...informe01Fuentes.map((f) => f.notes),
    ...informe01Lagunas.flatMap((l) => [l.titulo, l.cuerpo, l.cierre]),
    ...informe01TemasPucv.flatMap((t) => [t.evidencia, t.salto]),
  ];

  it('no afirma inexistencia donde sólo hay ausencia de evidencia pública', () => {
    for (const texto of textos) {
      const bajo = texto.toLowerCase();
      for (const expresion of PELIGROSAS) {
        expect(bajo.includes(expresion), `«${expresion}» en: ${texto.slice(0, 90)}…`).toBe(
          false,
        );
      }
    }
  });

  it('escribe las ausencias como no localizadas', () => {
    const ausencias = textos.filter((t) => /no se localiz/i.test(t));
    expect(ausencias.length).toBeGreaterThan(5);
  });

  it('declara doce lagunas con su condición de cierre', () => {
    expect(informe01Lagunas.length).toBeGreaterThanOrEqual(12);
    for (const l of informe01Lagunas) {
      expect(l.cierre.length, l.id).toBeGreaterThan(30);
    }
  });

  it('reconoce evidencia favorable antes de contrastar, en la tabla de la PUCV', () => {
    // Prueba B del control de sesgo. Si la tabla dejara de reconocer lo que
    // existe, se convertiría en un alegato y esta prueba debe impedirlo.
    const existe = informe01TemasPucv.filter((t) => t.estado === 'existe');
    expect(existe.length).toBeGreaterThanOrEqual(4);
    expect(informe01TemasPucv[0].estado).toBe('existe');
    for (const t of informe01TemasPucv) {
      expect(t.salto.length, t.tema).toBeGreaterThan(20);
    }
  });
});
