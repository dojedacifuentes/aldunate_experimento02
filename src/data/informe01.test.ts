import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
} from './informe01-borrador';
import { informe01Lagunas, informe01TemasPucv } from './informe01-editorial';
import {
  pucvBrechas,
  pucvDobleRevision,
  pucvFavorable,
  pucvLectura,
  pucvRecomendaciones,
} from './informe01-pucv';
import { informe01Hallazgos, informe01ResumenEjecutivo } from './informe01-hallazgos';
import { cifrasInforme01, universidadesOrdenadas } from '@/lib/informe01';
import {
  CAPACIDADES,
  celdaCapacidad,
  MECANISMOS,
} from '@/lib/informe01-capacidades';
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
} from '@/lib/informe01-graficos';

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

/**
 * La capa narrativa es la que un lector cita, y la que más fácilmente se
 * desincroniza de los datos. Estas pruebas la atan al dataset.
 */
describe('informe 01 · el borrador, atado a sus datos', () => {
  const cifras = cifrasInforme01();
  const todaLaProsa = [
    ...informe01Introduccion,
    informe01ObjetivoGeneral,
    ...informe01ObjetivosEspecificos,
    ...informe01MetodologiaRelato.flatMap((b) => [b.titulo, ...b.parrafos]),
    ...informe01Intereses,
    ...informe01Discusion.flatMap((b) => [b.titulo, ...b.parrafos]),
    ...informe01Conclusiones.flatMap((c) => [c.titulo, c.cuerpo]),
    ...informe01Limitaciones,
    ...informe01Agenda.flatMap((a) => [a.pregunta, a.porQue, a.comoSeCierra]),
    ...pucvLectura,
    ...pucvFavorable.flatMap((f) => [f.hecho, f.fuerza]),
    ...pucvBrechas.flatMap((b) => [b.brecha, b.evidencia, b.comparador]),
    ...pucvDobleRevision.flatMap((d) => [d.pregunta, d.respuesta]),
    ...pucvRecomendaciones.flatMap((r) => [r.problema, r.evidencia, r.referente, r.accion, r.indicador]),
  ];

  it('no cita ninguna cifra que el dataset no defina', () => {
    for (const texto of todaLaProsa) expect(() => resolverCifras(texto, cifras)).not.toThrow();
  });

  it('no escribe a mano los números que el dataset ya conoce', () => {
    // Un «74» suelto en un párrafo es la forma en que un informe empieza a
    // contradecirse a sí mismo. Los recuentos volátiles van por marca.
    const volatiles = [
      informe01Recuento.fuentes,
      informe01Recuento.iniciativas,
      informe01Recuento.evidencias,
      informe01Recuento.fuentesVerificadas,
    ];
    for (const texto of todaLaProsa)
      for (const n of volatiles)
        expect(texto, `«${texto.slice(0, 60)}…» escribe ${n} en vez de usar una marca`).not.toMatch(
          new RegExp(`(?<![\d{])${n}(?![\d}])`),
        );
  });

  it('apoya cada conclusión en afirmaciones que existen', () => {
    const ids = new Set(informe01Afirmaciones.map((c) => c.id));
    for (const c of informe01Conclusiones) {
      expect(c.apoyo.length, c.id).toBeGreaterThan(0);
      for (const a of c.apoyo) expect(ids.has(a), `${c.id} cita ${a}`).toBe(true);
    }
  });

  it('no convierte ausencia de evidencia pública en inexistencia', () => {
    // El kit §13 es explícito: «no se encontró evidencia pública verificable»,
    // nunca «la actividad no existe». Estas formas son las que se cuelan.
    const prohibidas = [
      /\bno existe[n]?\b(?! todavía una línea)/i,
      /\bninguna (?:publica|tiene|dicta|cuenta con)\b/i,
      /\bcarece[n]? de\b/i,
    ];
    for (const c of informe01Conclusiones)
      for (const p of prohibidas)
        expect(`${c.titulo} ${c.cuerpo}`, `${c.id} afirma inexistencia`).not.toMatch(p);
  });

  it('declara el conflicto de interés sin exponer el proceso privado', () => {
    const intereses = informe01Intereses.join(' ');
    // El conflicto se declara: es practica academica y se conserva.
    expect(intereses).toMatch(/autor/i);
    expect(intereses).toMatch(/particip/i);
  });

  /*
   * El documento es publico y debe bastarse solo. Quien lo recibe, de quien es
   * el encargo y que se converso durante su elaboracion son datos del proceso,
   * no del objeto de estudio, y nombran a personas que no lo han escrito.
   *
   * No alcanza a las fuentes: el corpus cita noticias institucionales cuyo
   * titulo nombra a un profesor, y esas se conservan porque son la referencia
   * bibliografica. La regla mira la prosa que el informe escribe, no la que
   * cita.
   */
  it('la prosa no expone el proceso privado de elaboración', () => {
    const prosa = [
      ...informe01Intereses,
      ...informe01Limitaciones,
      ...informe01Conclusiones.map((c) => `${c.titulo} ${c.cuerpo}`),
      ...informe01ResumenEjecutivo,
      ...informe01Hallazgos.map((h) => `${h.enunciado} ${h.dato} ${h.lectura} ${h.limite}`),
    ].join(' ');
    for (const marca of [
      /destinatario/i,
      /encargo del profesor/i,
      /seg[uú]n conversaci[oó]n/i,
      /lectura privada/i,
      /nota para /i,
    ])
      expect(prosa, `la prosa contiene ${marca}`).not.toMatch(marca);
  });

  it('reconoce evidencia favorable de la PUCV antes de exponer brechas', () => {
    expect(pucvFavorable.length).toBeGreaterThanOrEqual(pucvBrechas.length);
    for (const f of pucvFavorable) expect(f.fuente, f.hecho.slice(0, 40)).toMatch(/^src-/);
    // Las brechas que alcanzan a toda la cohorte deben declararse como tales, o
    // la sección imputa a la PUCV lo que es de las once.
    expect(pucvBrechas.some((b) => b.esDeCohorte)).toBe(true);
  });

  it('publica la doble revisión de la sección PUCV, no la resuelve en privado', () => {
    expect(pucvDobleRevision).toHaveLength(2);
    for (const d of pucvDobleRevision) expect(d.respuesta.length).toBeGreaterThan(80);
  });

  it('acompaña cada recomendación de problema, evidencia, referente, acción e indicador', () => {
    for (const r of pucvRecomendaciones)
      for (const [k, v] of Object.entries(r))
        expect(String(v).length, `${r.id}.${k}`).toBeGreaterThan(k === 'id' ? 2 : 30);
  });
});

/**
 * El paquete de descargas publica un manifiesto de integridad. Que falle es
 * peor que no tenerlo: enseña a ignorarlo.
 *
 * Falló una vez, y no por un error de cálculo. `core.autocrlf` convertía los
 * CSV a LF al guardarlos en git mientras el manifiesto describía los CRLF que
 * escribió el exportador, de modo que el paquete verificaba en el equipo del
 * autor y fallaba en producción. Lo arregla `.gitattributes`; esto lo vigila.
 */
describe('informe 01 · el paquete de descargas dice la verdad sobre sí mismo', () => {
  const dir = join(process.cwd(), 'public', 'descargas', 'informe-01-borrador-academico-v0.7.0');
  const manifiesto = readFileSync(join(dir, 'checksums.sha256'), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const [hash, ...resto] = l.trim().split(/\s+/);
      return { hash, archivo: resto.join(' ') };
    });

  it('publica un checksum por cada archivo del paquete', () => {
    expect(manifiesto.length).toBeGreaterThanOrEqual(11);
  });

  it('cuadra cada checksum con el archivo que describe', () => {
    for (const { hash, archivo } of manifiesto) {
      const ruta = join(dir, ...archivo.split('/'));
      const real = createHash('sha256').update(readFileSync(ruta)).digest('hex');
      expect(real, archivo).toBe(hash);
    }
  });

  it('publica el paquete con un solo final de línea, para que sea portable', () => {
    // Un CRLF aquí significa que el exportador copió el CSV canónico sin
    // normalizar, y que el manifiesto describe bytes que dependen del sistema
    // operativo de quien lo generó.
    for (const { archivo } of manifiesto) {
      if (!/\.(csv|md|json|sha256)$/.test(archivo)) continue;
      const texto = readFileSync(join(dir, ...archivo.split('/')), 'utf8');
      expect(texto.includes('\r\n'), `${archivo} lleva CRLF`).toBe(false);
    }
  });
});

/**
 * La capa de capacidades (metodología 2.1).
 *
 * Es un derivado, no un dato: se calcula entero desde los CSV. Eso la vuelve
 * barata de comprobar y peligrosa de dejar sin comprobar, porque un error en una
 * regla no rompe nada —produce una matriz plausible y falsa—.
 *
 * Lo que estas pruebas vigilan no es que las cifras sean unas u otras: es que el
 * instrumento siga respondiendo la pregunta para la que se construyó.
 */
describe('informe 01 · la capa de capacidades', () => {
  const ids = universidadesOrdenadas.map((u) => u.id);
  const celdas = ids.flatMap((id) => CAPACIDADES.map((c) => celdaCapacidad(id, c.id)));

  it('clasifica las iniciativas dentro del vocabulario cerrado de mecanismos', () => {
    const vocabulario = new Set(MECANISMOS.map((m) => m.id));
    for (const i of informe01Iniciativas)
      expect(vocabulario.has(i.mechanism), `${i.id} declara «${i.mechanism}»`).toBe(true);
  });

  it('publica una celda por cada par de institución y capacidad', () => {
    expect(celdas.length).toBe(ids.length * CAPACIDADES.length);
  });

  /*
   * La regla que separa cobertura de capacidad, comprobada en las dos
   * direcciones. Si alguien invierte el condicional, la matriz sigue dibujándose
   * y empieza a leer el trabajo de campo como si fuera actividad institucional.
   */
  it('sólo declara no concluyente donde falta una ruta del protocolo', () => {
    for (const celda of celdas) {
      if (celda.estado === 'NO_CONCLUYENTE')
        expect(
          celda.rutasSinRecorrer.length,
          `${celda.universityId}/${celda.capacidad} no concluyente sin ruta pendiente`,
        ).toBeGreaterThan(0);
      if (celda.estado === 'NO_LOCALIZADA')
        expect(
          celda.rutasSinRecorrer.length,
          `${celda.universityId}/${celda.capacidad} no localizada con ruta pendiente`,
        ).toBe(0);
    }
  });

  it('no marca como contrastada ninguna celda sin iniciativas que la sostengan', () => {
    for (const celda of celdas)
      if (celda.contrastada)
        expect(
          celda.iniciativas.length,
          `${celda.universityId}/${celda.capacidad}`,
        ).toBeGreaterThan(0);
  });

  /*
   * La verificación viaja fuera del estado. Es la corrección que impidió que la
   * matriz premiara a la PUCV por tener el 86 % de sus fuentes contrastadas, y la
   * forma de comprobarla es que ambos valores del booleano aparezcan dentro del
   * mismo estado: si `contrastada` volviera a decidir el estado, no podrían.
   */
  it('mantiene la verificación separada del estado', () => {
    const enOperacion = celdas.filter((c) => c.estado === 'EN_OPERACION');
    expect(enOperacion.some((c) => c.contrastada)).toBe(true);
    expect(enOperacion.some((c) => !c.contrastada)).toBe(true);
  });

  it('declara la pregunta que responde cada capacidad', () => {
    for (const c of CAPACIDADES) {
      expect(c.pregunta.startsWith('¿'), c.id).toBe(true);
      expect(c.pregunta.endsWith('?'), c.id).toBe(true);
    }
  });

  /*
   * DEC-102 y DEC-115. No existe una función que devuelva un número comparable
   * por universidad, y la ausencia es la garantía: en cuanto exista, alguien
   * ordenará por ella y el informe publicará el ranking que su cobertura
   * desigual prohíbe.
   */
  it('no exporta ningún agregado por universidad que pueda ordenarse', () => {
    const prohibidas = ['puntaje', 'score', 'ranking', 'total', 'promedio', 'nota'];
    const fuente = readFileSync(
      join(process.cwd(), 'src', 'lib', 'informe01-capacidades.ts'),
      'utf8',
    );
    const exportados = [...fuente.matchAll(/export function (\w+)/g)].map((m) => m[1]);
    for (const nombre of exportados)
      for (const prohibida of prohibidas)
        expect(nombre.toLowerCase().includes(prohibida), nombre).toBe(false);
  });
});

/**
 * El motor de gráficos.
 *
 * Las figuras salen de funciones puras y las consumen dos huéspedes con hojas de
 * estilo distintas: el sitio y el exportador. Un color escrito dentro de una
 * figura funciona en uno de los dos y falla en el otro sin avisar —texto negro
 * sobre fondo azul-negro, o una trama invisible en papel—, y por eso el contrato
 * es que ninguna figura escriba un color que no venga de una variable CSS.
 */
describe('informe 01 · el motor de gráficos', () => {
  const figuras: [string, string][] = [
    ['matriz de capacidades', matrizCapacidadesSvg()],
    ['cobertura frente a capacidad', coberturaVsCapacidadSvg()],
    ['mecanismos', mecanismosSvg()],
    ['escalera', escaleraSvg()],
    ['línea de tiempo', lineaTiempoSvg()],
    ['direcciones', direccionesSvg()],
    ['cobertura', coberturaSvg()],
    ['mapa de desarrollo', mapaDesarrolloSvg('pucv')],
    ['marca de portada', marcaPortadaSvg()],
  ];

  it('publica cada figura con título y descripción para lectores de pantalla', () => {
    for (const [nombre, svg] of figuras) {
      expect(svg.includes('role="img"'), nombre).toBe(true);
      expect(/<title id="[^"]+">[^<]+<\/title>/.test(svg), nombre).toBe(true);
      expect(/<desc>[^<]{40,}<\/desc>/.test(svg), nombre).toBe(true);
    }
  });

  /*
   * Sin atributos de ancho ni de alto. Con un alto declarado como automático el
   * navegador recortaba la matriz por abajo y se perdían cuatro de las once filas
   * sin que nada fallara: el viewBox fija la proporción y el huésped, el tamaño.
   */
  it('deja el tamaño al huésped y la proporción al viewBox', () => {
    for (const [nombre, svg] of figuras) {
      const raiz = svg.slice(0, svg.indexOf('>'));
      expect(raiz.includes('viewBox="0 0 '), nombre).toBe(true);
      expect(raiz.includes(' width='), `${nombre} fija el ancho`).toBe(false);
      expect(raiz.includes(' height='), `${nombre} fija el alto`).toBe(false);
    }
  });

  it('no escribe ningún color fuera de una variable CSS con reserva', () => {
    for (const [nombre, svg] of figuras) {
      // Se admite `var(--g-algo, #hex)`: el hexadecimal es la reserva de la
      // variable, no un color escrito a mano. Cualquier otro es un color suelto.
      const sinVariables = svg.replace(/var\(--[a-z0-9-]+,\s*#[0-9a-fA-F]{3,8}\)/g, '');
      const sueltos = sinVariables.match(/#[0-9a-fA-F]{3,8}/g) ?? [];
      expect(sueltos, `${nombre} escribe ${sueltos.join(', ')}`).toEqual([]);
    }
  });

  it('escapa el texto que inserta, incluidos los nombres con ampersand', () => {
    for (const [nombre, svg] of figuras) {
      const textos = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
      for (const t of textos)
        expect(t.includes('&') && !t.includes('&amp;'), nombre).toBe(false);
    }
  });
});

/*
 * Legibilidad del color.
 *
 * `--muted` es la superficie sobre la que se apoyan las tarjetas y `--muted-foreground`
 * es la tinta que se lee encima. Los nombres se parecen y la clase de Tailwind que
 * sale de cada uno se parece más: `text-muted` frente a `text-muted-foreground`.
 * Escribir la primera pinta la prosa del color del papel —1,11 de contraste en el
 * tema claro y 1,20 en el oscuro, es decir, invisible en los dos— y no falla nada:
 * el texto está en el DOM, lo lee un lector de pantalla y sale en el buscador.
 * Ciento cincuenta y dos elementos del informe estuvieron así.
 */
describe('informe 01 · la prosa se ve', () => {
  const componentes = [
    'Borrador.tsx',
    'Publicacion.tsx',
    'Pucv.tsx',
    'Matriz.tsx',
    'Cobertura.tsx',
  ];

  it('no pinta texto con un token de superficie', () => {
    for (const nombre of componentes) {
      const fuente = readFileSync(join('src', 'components', 'informe01', nombre), 'utf8');
      // `text-muted-foreground` sí; `text-muted` a secas, no.
      const sueltos = fuente.match(/text-muted(?!-foreground)/g) ?? [];
      expect(sueltos, `${nombre} usa text-muted como color de letra`).toEqual([]);
    }
  });

  /*
   * La cifra que va escrita encima de una banda de color toma su tinta de la
   * banda. `--background` sólo acierta cuando la banda contrasta con el papel, y
   * sobre los tonos medios de la escalera no lo hace.
   */
  it('no escribe cifras sobre banda con el color del papel', () => {
    const motor = readFileSync(join('src', 'lib', 'informe01-graficos.ts'), 'utf8');
    expect(motor.includes('g-t-cifra-clara')).toBe(false);
    const hoja = readFileSync(join('src', 'app', 'globals.css'), 'utf8');
    for (const clase of ['g-t-sobre-op', 'g-t-sobre-esc-3', 'g-t-sobre-esc-2'])
      expect(hoja.includes(`.${clase}`), `falta ${clase} en globals.css`).toBe(true);
  });
});

/**
 * Los hallazgos principales. Van antes que todo lo demás en el documento, de
 * modo que un hallazgo mal formado es lo primero que un lector encuentra.
 */
describe('informe 01 · los hallazgos', () => {
  const cifras = cifrasInforme01();

  it('publica entre cuatro y siete hallazgos', () => {
    expect(informe01Hallazgos.length).toBeGreaterThanOrEqual(4);
    expect(informe01Hallazgos.length).toBeLessThanOrEqual(7);
  });

  /*
   * El límite es parte del hallazgo y no un descargo al pie. Sin esta prueba, el
   * primer hallazgo que se escriba con prisa saldrá sin él.
   */
  it('acompaña cada hallazgo de su dato, su lectura y su límite', () => {
    for (const h of informe01Hallazgos) {
      expect(h.enunciado.length, h.id).toBeGreaterThan(20);
      expect(h.dato.length, h.id).toBeGreaterThan(60);
      expect(h.lectura.length, h.id).toBeGreaterThan(60);
      expect(h.limite.length, h.id).toBeGreaterThan(60);
      expect(h.apoyo.length, h.id).toBeGreaterThan(0);
    }
  });

  it('resuelve desde el dataset todas las cifras que cita', () => {
    const textos = [
      ...informe01ResumenEjecutivo,
      ...informe01Hallazgos.flatMap((h) => [h.enunciado, h.dato, h.lectura, h.limite]),
    ];
    // `resolverCifras` lanza si una marca no está definida: basta con recorrer.
    for (const t of textos) expect(() => resolverCifras(t, cifras)).not.toThrow();
  });

  it('escribe el resumen ejecutivo en párrafos y no en una sola parrafada', () => {
    expect(informe01ResumenEjecutivo.length).toBeGreaterThanOrEqual(5);
    for (const p of informe01ResumenEjecutivo) expect(p.length).toBeLessThan(1300);
  });
});
