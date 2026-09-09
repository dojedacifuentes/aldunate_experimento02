import { readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import { currentVersion } from '@/lib/informes';

import { informe01Comparador } from './informe01Comparador';
import { reports } from './reports';

/**
 * El comparador del sitio contra su fuente de verdad.
 *
 * Existe por el cuello de botella que cerró esta versión: hasta ahora la regla
 * de D-039 —una figura derivada de un dato no se dibuja aparte del dato—
 * gobernaba el PDF y no la web, porque la web no dibujaba ninguna cifra propia.
 * Desde que la dibuja, el archivo generado puede quedarse atrás de la matriz
 * sin que nadie lo note: basta con editar `matriz-v2.json` y olvidar
 * `npm run informe01:comparador`.
 *
 * Sin esta prueba la garantía sería una cabecera que dice «archivo generado»,
 * que es disciplina y no comprobación. Con ella, un dato regenerado y no
 * recompilado rompe el `verify` en vez de llegar a producción.
 */

/** Recorre un directorio entero, que es como se comprueba una regla sobre todas
    las pantallas y no sólo sobre las que alguien recordó enumerar. */
function listar(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listar(join(dir, e.name)) : [join(dir, e.name)],
  );
}

const MATRIZ = join(
  process.cwd(),
  'tools/informes/informe-01/comparador/matriz-v2.json',
);
const D = JSON.parse(readFileSync(MATRIZ, 'utf8')) as {
  caps: string[];
  v2: Record<string, string[]>;
  aplicados: [string, string, string, string, string, string][];
};

/* La rúbrica del anexo D. Se repite aquí a propósito: si la prueba importara la
   del generador, comprobaría que el generador coincide consigo mismo. */
const PUNTOS: Record<string, number | null> = {
  OPF: 3, OP: 2, INC: 1, ENT: 1, ADY: 1, NL: 0, NC: null,
};

const APARTADA = 'P. U. Católica de Valparaíso';

describe('comparador ordinal · el sitio no puede decir una cifra distinta del documento', () => {
  it('cubre las mismas capacidades que la matriz, en el mismo orden', () => {
    expect(informe01Comparador.capacidades.map((c) => c.clave)).toEqual(D.caps);
  });

  it('cubre las diez instituciones del comparador y ninguna más', () => {
    const enSitio = informe01Comparador.filas.map((f) => f.institucion).sort();
    const enMatriz = Object.keys(D.v2).filter((k) => k !== APARTADA).sort();
    expect(enSitio).toEqual(enMatriz);
    expect(informe01Comparador.filas).toHaveLength(10);
  });

  it('aparta la undécima del orden en vez de puntuarla contra las demás (D-037)', () => {
    expect(informe01Comparador.filas.map((f) => f.institucion)).not.toContain(APARTADA);
    expect(informe01Comparador.apartada?.institucion).toBe(APARTADA);
  });

  it('reproduce celda por celda el estado de la matriz canónica', () => {
    for (const fila of [...informe01Comparador.filas, informe01Comparador.apartada!]) {
      const estados = D.v2[fila.institucion];
      expect(estados, `sin fila en la matriz: ${fila.institucion}`).toBeDefined();
      expect(fila.celdas.map((c) => c.estado)).toEqual(estados);
    }
  });

  it('recalcula piso, techo y celdas sin concluir con la rúbrica del anexo D', () => {
    for (const fila of [...informe01Comparador.filas, informe01Comparador.apartada!]) {
      let piso = 0;
      let sinConcluir = 0;
      for (const estado of D.v2[fila.institucion]) {
        if (estado === 'NC') sinConcluir += 1;
        else piso += PUNTOS[estado] ?? 0;
      }
      expect({ piso: fila.piso, techo: fila.techo, sinConcluir }).toEqual({
        piso,
        techo: piso + sinConcluir * 2,
        sinConcluir,
      });
    }
  });

  it('ordena por piso y luego por techo, que es el orden publicado', () => {
    const f = informe01Comparador.filas;
    for (let i = 1; i < f.length; i += 1) {
      const anterior = f[i - 1];
      const actual = f[i];
      expect(
        anterior.piso > actual.piso ||
          (anterior.piso === actual.piso && anterior.techo >= actual.techo),
        `${anterior.institucion} no puede ir antes que ${actual.institucion}`,
      ).toBe(true);
    }
  });

  it('cuelga de su celda cada uno de los cierres de la ronda de ampliación', () => {
    const todas = [...informe01Comparador.filas, informe01Comparador.apartada!];
    for (const [institucion, capacidad, , , , nota] of D.aplicados) {
      const fila = todas.find((f) => f.institucion === institucion);
      const celda = fila?.celdas.find((c) => c.capacidad === capacidad);
      expect(celda?.cierre?.nota, `${institucion} / ${capacidad}`).toBe(nota);
    }
  });

  it('declara sin contrastar exactamente los cierres que lo están', () => {
    /* Trece de los veintiséis, con veinticinco puntos encima. La cifra está en
       `docs/informes/10-auditoria-sustantiva.md` y si cambia hay que cambiarla
       también allí: no se dejan dos recuentos vivos del mismo hecho. */
    expect(informe01Comparador.cierres.total).toBe(D.aplicados.length);
    expect(informe01Comparador.cierres.expuestos).toBe(13);
    expect(informe01Comparador.cierres.puntosExpuestos).toBe(25);
  });

  it('no publica ninguna cifra que la matriz no sostenga', () => {
    expect(informe01Comparador.maximo).toBe(D.caps.length * 3);
    const techoReal = Math.max(...informe01Comparador.filas.map((f) => f.piso));
    expect(techoReal).toBe(20);
  });
});

/**
 * La ficha del sitio contra la versión que sirve.
 *
 * Existe porque el defecto ya ocurrió dos veces con la misma forma. La v3.0.0
 * corrigió dentro del documento la contradicción entre un frontis que declaraba
 * el corpus contrastado al 100 % y un anexo que declaraba 96 fuentes con 22 sin
 * contrastar (D-043) — y `reports.ts` se quedó con las cifras viejas, de modo
 * que lo primero que veía quien llegaba al sitio contradecía al documento que la
 * propia ficha sirve.
 *
 * Los recuentos de instituciones no se comprueban contra un número escrito aquí
 * sino contra la matriz: si mañana una Facultad acredita su unidad, la prueba
 * falla y obliga a corregir la prosa, que es exactamente lo que no ocurrió.
 */
const EN_PALABRAS: Record<number, string> = {
  1: 'una', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
  6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
};

const enOperación = (capacidad: string) =>
  informe01Comparador.filas.filter((f) =>
    ['OPF', 'OP'].includes(f.celdas.find((c) => c.capacidad === capacidad)!.estado),
  ).length;

const conInstrumento = (capacidad: string) =>
  informe01Comparador.filas.filter(
    (f) => f.celdas.find((c) => c.capacidad === capacidad)!.estado === 'OPF',
  ).length;

describe('la ficha del sitio no puede contradecir a la versión que sirve', () => {
  const informe = reports.find((r) => r.slug === 'ia-escuelas-derecho-chile');
  const presentación = `${informe?.subtitle ?? ''} ${informe?.executiveSummary ?? ''}`;

  it('encuentra el informe en el registro', () => {
    expect(informe).toBeDefined();
    expect(informe?.subtitle).toBeTruthy();
    expect(informe?.executiveSummary).toBeTruthy();
  });

  it('no promete un corpus contrastado al 100 %', () => {
    /* La cifra correcta es 74 de 96. Un porcentaje que el propio documento
       desmiente cincuenta páginas después no es un redondeo: es la afirmación
       más visible del sitio contradiciendo a la que la sostiene. */
    expect(presentación).not.toMatch(/(contrastad|verificad)\w* al 100 ?%/i);
  });

  it('declara el corpus completo y no sólo el original', () => {
    expect(presentación).toContain('96 fuentes');
  });

  it('cuenta las unidades especializadas que cuenta la matriz', () => {
    expect(informe?.executiveSummary).toContain(
      `${EN_PALABRAS[enOperación('Unidad')]} Facultades sostienen una unidad especializada`,
    );
  });

  it('cuenta las normas propias que cuenta la matriz', () => {
    expect(informe?.executiveSummary).toContain(
      `${EN_PALABRAS[conInstrumento('Norma')]} han dictado norma propia`,
    );
  });

  it('no se fecha antes que la versión vigente que publica', () => {
    const vigente = informe ? currentVersion(informe) : undefined;
    expect(vigente).toBeDefined();
    /* Las fechas van en ISO, de modo que comparar cadenas es comparar fechas. */
    expect(informe!.updatedAt >= vigente!.date).toBe(true);
  });
});

describe('la afirmación de corpus sólo puede vivir en el registro versionado', () => {
  /*
    La contradicción reapareció tres veces en tres capas distintas: el documento
    (D-043), los datos de presentación y —esto— una cadena escrita a mano dentro
    de una pantalla. Un componente que afirma un porcentaje del corpus no tiene
    forma de enterarse de que el corpus creció.

    La regla que se adopta: el porcentaje de contraste se enuncia en la entrada
    de versión que lo sostenía, y en ningún otro sitio del código. En `reports.ts`
    es historia —el `headline` de la v2.0.0 decía lo que esa versión sostenía y
    no se reescribe—; en una pantalla es una afirmación en presente.
  */
  const AFIRMACIÓN = /(contrastad|verificad)\w* al 100 ?%/i;

  const archivos = ['src/app', 'src/components']
    .flatMap((dir) => listar(join(process.cwd(), dir)))
    .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));

  it('encuentra pantallas que revisar', () => {
    expect(archivos.length).toBeGreaterThan(20);
  });

  it('ninguna pantalla afirma un corpus contrastado al 100 %', () => {
    const culpables = archivos.filter((f) => AFIRMACIÓN.test(readFileSync(f, 'utf8')));
    /* Se normaliza el separador para que el mensaje de fallo se lea igual en
       Windows y en CI, sin depender del sistema donde corra la prueba. */
    expect(culpables.map((f) => f.slice(process.cwd().length).split(sep).join('/'))).toEqual([]);
  });
});

describe('la institución apartada no recibe orden, puntuación ni lugar', () => {
  /*
    D-037 la sacó del comparador; la v3.2.0 sacó además su puntuación del texto,
    porque la secci\u00f3n 8 declaraba que no la recibe y a la vez publicaba «18
    puntos, es decir el segundo lugar del orden». La bandera existe para que la
    exclusión sea comprobable por cualquier consumidor del dato y no una
    convención sobre en qué campo vive.
  */
  it('marca la apartada con la bandera, y sólo a ella', () => {
    expect(informe01Comparador.apartada?.excluidaDelOrden).toBe(true);
    expect(informe01Comparador.filas.map((f) => f.excluidaDelOrden)).toEqual(
      informe01Comparador.filas.map(() => false),
    );
  });

  it('ninguna fila del orden lleva el nombre de la apartada', () => {
    expect(informe01Comparador.filas.some((f) => f.institucion === APARTADA)).toBe(false);
  });

  it('el comparador no dibuja la banda de la apartada', () => {
    /* La banda junto a un orden es una posición aunque no lleve número. El dato
       se conserva para trazabilidad; lo que no puede es pintarse. */
    const fuente = readFileSync(
      join(process.cwd(), 'src/components/informes/Comparador.tsx'),
      'utf8',
    );
    const trasApartada = fuente.slice(fuente.indexOf('apartada.celdas.map'));
    expect(trasApartada).not.toMatch(/<Banda\s+fila=\{apartada\}/);
    expect(trasApartada).toContain('sin puntuación');
  });
});
