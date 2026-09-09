import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { informe01Comparador } from './informe01Comparador';

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
