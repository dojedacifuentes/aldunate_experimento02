import { informe01Afirmaciones, informe01Iniciativas, informe01Recuento } from '@/data/informe01';
import { informe01Conclusiones } from '@/data/informe01-borrador';
import {
  CAPACIDADES,
  BLOQUES_CAPACIDAD,
  celdaCapacidad,
  distribucionMecanismos,
  ESTADOS_CAPACIDAD,
} from '@/lib/informe01-capacidades';
import {
  coberturaDe,
  distribucionDirecciones,
  distribucionEscalera,
  ESCALONES,
  universidadesOrdenadas,
} from '@/lib/informe01';
import {
  esc,
  figura,
  linea,
  partir,
  rect,
  texto,
  textoMulti,
} from '@/lib/informe01-svg';
import type { Informe01CapacidadEstado } from '@/types';

/**
 * Los gráficos del Informe 01, como funciones puras del dataset.
 *
 * Cada uno responde **una pregunta declarada** y lleva su título en forma de
 * lectura, no de rótulo: «Gráfico 4» no dice nada y «la evaluación está vacía en
 * las once» sí. El título va en el componente y en el exportador, no dentro del
 * SVG, para que el mismo dibujo pueda titularse distinto si el análisis cambia.
 *
 * Ninguna función recibe datos por parámetro salvo cuando el gráfico existe en
 * dos variantes —la cohorte entera y una institución—. Todo lo demás se lee del
 * dataset compilado, de modo que un cambio en un CSV cambia el gráfico sin que
 * nadie toque este archivo.
 */

/* ── Léxico visual compartido ──────────────────────────────────────────────── */

const ORDEN_ESTADOS: Informe01CapacidadEstado[] = [
  'EN_OPERACION',
  'INCIPIENTE',
  'SOLO_ENTORNO',
  'SOLO_ADYACENTE',
  'NO_LOCALIZADA',
  'NO_CONCLUYENTE',
];

/**
 * Cómo se pinta cada estado. El relleno lleva la lectura rápida y el `glifo` la
 * sostiene cuando el color desaparece: impreso en blanco y negro, la matriz
 * sigue distinguiendo los cinco estados.
 */
const PINTURA: Record<
  Informe01CapacidadEstado,
  { relleno: string; borde: string; discontinuo?: boolean; glifo?: string; tinta?: string }
> = {
  EN_OPERACION: { relleno: 'var(--g-op, #1b5e76)', borde: 'var(--g-op, #1b5e76)' },
  INCIPIENTE: { relleno: 'url(#g-tramaGruesa)', borde: 'var(--g-incip, #5c9ead)' },
  SOLO_ENTORNO: {
    relleno: 'var(--g-entorno-fondo, #f6ecd2)',
    borde: 'var(--g-entorno, #c9a227)',
    discontinuo: true,
    glifo: '◇',
    tinta: 'var(--g-entorno, #c9a227)',
  },
  SOLO_ADYACENTE: {
    relleno: 'var(--g-adyacente-fondo, #ece4f2)',
    borde: 'var(--g-adyacente, #7a5ba6)',
    glifo: '▵',
    tinta: 'var(--g-adyacente, #7a5ba6)',
  },
  NO_LOCALIZADA: {
    relleno: 'var(--g-vacio, #ece9e3)',
    borde: 'var(--g-linea, #cfcac1)',
    glifo: '·',
    tinta: 'var(--g-suave, #7b756c)',
  },
  NO_CONCLUYENTE: {
    relleno: 'url(#g-tramaFina)',
    borde: 'var(--g-linea, #cfcac1)',
    discontinuo: true,
    glifo: '?',
    tinta: 'var(--g-suave, #7b756c)',
  },
};

const nombreEstado = (e: Informe01CapacidadEstado) =>
  ESTADOS_CAPACIDAD.find((x) => x.id === e)!.label;

/* ── 1 · Matriz de capacidades institucionales ─────────────────────────────── */

const M = {
  rotulo: 208,
  celda: 52,
  huecoBloque: 9,
  fila: 33,
  cabecera: 96,
  banda: 20,
  leyenda: 96,
};

/**
 * La visualización principal. Once instituciones en filas alfabéticas, diez
 * capacidades en columnas agrupadas por bloque.
 *
 * **No hay total por fila ni por columna, y la falta es el diseño.** Un total
 * convertiría la matriz en el ranking que DEC-102 prohíbe, y además sumaría
 * cosas que no se suman: una capacidad en operación con dos rutas recorridas y
 * otra con once no son la misma unidad.
 *
 * La marca de contraste —la barra del canto derecho— dice si *nosotros* hemos
 * comprobado el registro, no si la institución hace más. Es de un solo tono y
 * **nunca cambia el color de la celda**: la primera versión de esta matriz metía
 * la verificación dentro del estado, y el resultado premiaba a la PUCV por tener
 * el 86 % de sus fuentes contrastadas, que es una propiedad del trabajo de campo.
 */
export function matrizCapacidadesSvg(): string {
  const universidades = universidadesOrdenadas;
  const columnas = CAPACIDADES.map((c, i) => {
    const bloqueAnterior = i > 0 ? CAPACIDADES[i - 1].bloque : c.bloque;
    return { def: c, nuevoBloque: i > 0 && c.bloque !== bloqueAnterior };
  });

  // La x de cada columna, contando el respiro extra al cambiar de bloque.
  let x = M.rotulo;
  const xs: number[] = [];
  columnas.forEach((c) => {
    if (c.nuevoBloque) x += M.huecoBloque;
    xs.push(x);
    x += M.celda;
  });
  const ancho = x + 14;
  const y0 = M.cabecera + M.banda;
  const alto = y0 + universidades.length * M.fila + M.leyenda;

  const partes: string[] = [];

  /* Banda de bloques: da estructura sin escribir una línea de leyenda. */
  BLOQUES_CAPACIDAD.forEach((b) => {
    const idx = columnas
      .map((c, i) => (c.def.bloque === b.id ? i : -1))
      .filter((i) => i >= 0);
    if (!idx.length) return;
    const xi = xs[idx[0]];
    const xf = xs[idx[idx.length - 1]] + M.celda;
    partes.push(
      rect(xi, M.cabecera + 3, xf - xi, 13, {
        fill: 'var(--g-banda, #e7e2d8)',
        rx: 2,
      }),
      texto((xi + xf) / 2, M.cabecera + 12.5, b.label, {
        tam: 8.5,
        ancla: 'middle',
        clase: 'g-t g-t-banda',
      }),
    );
  });

  /* Cabecera: rótulos a 45°, que es el ángulo que se lee sin girar la hoja. */
  columnas.forEach((c, i) => {
    partes.push(
      texto(xs[i] + M.celda / 2 - 2, M.cabecera - 8, c.def.short, {
        tam: 10.5,
        ancla: 'start',
        rotar: -45,
        clase: 'g-t g-t-col',
      }),
    );
  });

  /* Filas. */
  universidades.forEach((u, f) => {
    const y = y0 + f * M.fila;
    const cob = coberturaDe(u.id);
    if (f % 2 === 1)
      partes.push(
        rect(0, y, ancho, M.fila, { fill: 'var(--g-cebra, #00000008)' }),
      );

    const lineas = partir(u.officialName, 30).slice(0, 2);
    partes.push(
      textoMulti(6, y + (lineas.length === 1 ? M.fila / 2 + 3.5 : M.fila / 2 - 2), lineas, 11, {
        tam: 10.5,
        clase: 'g-t g-t-fila',
      }),
    );
    if (cob)
      partes.push(
        texto(M.rotulo - 12, y + M.fila / 2 + 3.5, `${cob.routesCompleted}/13`, {
          tam: 9,
          ancla: 'end',
          clase: 'g-t g-t-rutas',
        }),
      );

    columnas.forEach((c, i) => {
      const celda = celdaCapacidad(u.id, c.def.id);
      const p = PINTURA[celda.estado];
      const cx = xs[i] + 3;
      const cy = y + 4;
      const cw = M.celda - 6;
      const ch = M.fila - 8;
      partes.push(
        rect(cx, cy, cw, ch, {
          fill: p.relleno,
          stroke: p.borde,
          'stroke-width': 1,
          ...(p.discontinuo ? { 'stroke-dasharray': '3 2' } : {}),
          rx: 2,
        }),
      );
      if (p.glifo)
        partes.push(
          texto(cx + cw / 2, cy + ch / 2 + 4, p.glifo, {
            tam: 12,
            ancla: 'middle',
            clase: 'g-t',
            ...(p.tinta ? {} : {}),
          }).replace('<text', `<text fill="${p.tinta}"`),
        );
      // La marca de contraste va **fuera** del relleno, pegada al canto derecho.
      // Dentro de la celda se perdía sobre el azul oscuro y gritaba sobre el
      // claro; en el canto se lee igual en los cinco estados y no compite.
      if (celda.contrastada)
        partes.push(
          rect(cx + cw - 2.5, cy + 3, 2.5, ch - 6, {
            fill: 'var(--g-contraste, #8a2432)',
            rx: 1,
          }),
        );
      // Título nativo: al pasar el cursor, la celda explica por qué dice lo que dice.
      partes.push(
        `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="transparent"><title>${esc(
          `${u.officialName} · ${c.def.label}: ${nombreEstado(celda.estado)}. ${celda.motivo}`,
        )}</title></rect>`,
      );
    });
  });

  /* Leyenda. Los cinco estados y la marca de contraste, en dos filas. */
  const yl = y0 + universidades.length * M.fila + 20;
  let lx = 4;
  ORDEN_ESTADOS.forEach((e) => {
    const p = PINTURA[e];
    partes.push(
      rect(lx, yl - 9, 14, 12, {
        fill: p.relleno,
        stroke: p.borde,
        'stroke-width': 1,
        ...(p.discontinuo ? { 'stroke-dasharray': '3 2' } : {}),
        rx: 2,
      }),
    );
    if (p.glifo)
      partes.push(
        texto(lx + 7, yl + 0.5, p.glifo, { tam: 10, ancla: 'middle' }).replace(
          '<text',
          `<text fill="${p.tinta}"`,
        ),
      );
    const etiqueta = ESTADOS_CAPACIDAD.find((x) => x.id === e)!.label;
    partes.push(texto(lx + 19, yl + 1, etiqueta, { tam: 10, clase: 'g-t g-t-leyenda' }));
    lx += 26 + etiqueta.length * 5.6;
  });
  partes.push(
    rect(4, yl + 14, 2.5, 11, { fill: 'var(--g-contraste, #8a2432)', rx: 1 }),
    texto(
      18,
      yl + 24,
      'Al menos una fuente de la celda pasó la verificación sustantiva. Es una propiedad de nuestra investigación, no de la institución.',
      { tam: 9.5, clase: 'g-t g-t-leyenda' },
    ),
    texto(
      4,
      yl + 42,
      'La cifra junto a cada nombre son las rutas del protocolo recorridas, de trece. No hay totales por fila ni por columna: sumar capacidades produciría un ranking.',
      { tam: 9.5, clase: 'g-t g-t-leyenda' },
    ),
  );

  const conteo = ORDEN_ESTADOS.map((e) => {
    const n = universidades.reduce(
      (s, u) =>
        s + CAPACIDADES.filter((c) => celdaCapacidad(u.id, c.id).estado === e).length,
      0,
    );
    return `${n} ${nombreEstado(e).toLowerCase()}`;
  }).join(', ');

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'Capacidades institucionales observadas en las once Facultades',
    descripcion: `Matriz de ${universidades.length} instituciones por ${CAPACIDADES.length} capacidades, ${universidades.length * CAPACIDADES.length} celdas: ${conteo}. Las filas van en orden alfabético y no hay puntaje agregado.`,
    clase: 'g-matriz',
  });
}

/* ── 2 · Cobertura de investigación frente a capacidad observada ───────────── */

/**
 * El gráfico que separa las dos variables que el informe no puede confundir.
 *
 * En el eje horizontal, cuánto se investigó a cada institución. En el vertical,
 * cuántas de las diez capacidades constan en operación. Si fueran la misma
 * variable, los puntos caerían sobre una recta; el interés está en los que no.
 *
 * **El eje vertical no es un puntaje de calidad y por eso no se ordena por él.**
 * Es el recuento de preguntas que el corpus contesta que sí, y está acotado por
 * arriba por lo que se buscó: por eso cada punto lleva, en gris, cuántas de sus
 * diez celdas quedaron sin concluir. Un punto bajo con muchas celdas grises no
 * dice «hace poco», dice «no lo sabemos» (DEC-118).
 */
export function coberturaVsCapacidadSvg(): string {
  const ancho = 760;
  const alto = 430;
  const m = { i: 54, d: 20, s: 26, inf: 62 };
  const w = ancho - m.i - m.d;
  const h = alto - m.s - m.inf;

  const puntos = universidadesOrdenadas.map((u) => {
    const cob = coberturaDe(u.id)!;
    const celdas = CAPACIDADES.map((c) => celdaCapacidad(u.id, c.id));
    return {
      u,
      rutas: cob.routesCompleted,
      operacion: celdas.filter((c) => c.estado === 'EN_OPERACION').length,
      sinConcluir: celdas.filter((c) => c.estado === 'NO_CONCLUYENTE').length,
      piloto: cob.inPilot,
    };
  });

  const xMax = 13;
  const yMax = 10;
  const px = (v: number) => m.i + (v / xMax) * w;
  const py = (v: number) => m.s + h - (v / yMax) * h;

  const partes: string[] = [];

  /* Rejilla discreta. Sirve para leer un valor, no para decorar. */
  for (let v = 0; v <= yMax; v += 2)
    partes.push(
      linea(m.i, py(v), m.i + w, py(v), {
        stroke: 'var(--g-linea, #cfcac1)',
        'stroke-width': 0.5,
      }),
      texto(m.i - 8, py(v) + 3.5, String(v), { tam: 9.5, ancla: 'end', clase: 'g-t g-t-eje' }),
    );
  for (let v = 0; v <= xMax; v += 2)
    partes.push(
      texto(px(v), m.s + h + 15, String(v), { tam: 9.5, ancla: 'middle', clase: 'g-t g-t-eje' }),
    );

  /* La diagonal de referencia: dónde caerían los puntos si investigar y hacer
     fueran la misma cosa. No es una regresión y el rótulo lo dice. */
  partes.push(
    linea(px(0), py(0), px(13), py(10), {
      stroke: 'var(--g-suave, #7b756c)',
      'stroke-width': 1,
      'stroke-dasharray': '4 4',
    }),
    texto(px(11.4), py(9.6), 'si fueran la misma variable', {
      tam: 9,
      ancla: 'end',
      clase: 'g-t g-t-eje',
    }),
  );

  partes.push(
    texto(m.i + w / 2, alto - 30, 'Rutas del protocolo recorridas, de trece  →  trabajo de campo', {
      tam: 10.5,
      ancla: 'middle',
      clase: 'g-t g-t-eje',
    }),
    texto(0, 0, 'Capacidades en operación, de diez  →  institución', {
      tam: 10.5,
      ancla: 'middle',
      clase: 'g-t g-t-eje',
    }).replace('<text x="0" y="0"', `<text x="0" y="0" transform="translate(14 ${m.s + h / 2}) rotate(-90)"`),
  );

  /* Puntos. El halo gris es proporcional a las celdas sin concluir. */
  puntos.forEach((p) => {
    const cx = px(p.rutas);
    const cy = py(p.operacion);
    if (p.sinConcluir)
      partes.push(
        `<circle cx="${cx}" cy="${cy}" r="${6 + p.sinConcluir * 1.5}" fill="var(--g-halo, #7b756c1f)"/>`,
      );
    partes.push(
      `<circle cx="${cx}" cy="${cy}" r="5.5" fill="${p.piloto ? 'var(--g-contraste, #8a2432)' : 'var(--g-op, #1b5e76)'}"><title>${esc(
        `${p.u.officialName}: ${p.rutas} de 13 rutas recorridas, ${p.operacion} de 10 capacidades en operación, ${p.sinConcluir} celdas sin concluir.`,
      )}</title></circle>`,
    );
  });

  /**
   * Rótulos. Con once puntos y cuatro de ellos amontonados abajo a la izquierda,
   * colocarlos todos encima los superpone. La regla es: a la derecha del punto
   * mientras quepa, y a la izquierda cuando no; después se resuelven las
   * colisiones verticales bajando el rótulo de a un renglón. Es un reparto
   * determinista, de modo que la figura del PDF y la de la web son idénticas.
   */
  const ocupados: { x1: number; x2: number; y: number }[] = [];
  const anchoTexto = (s: string) => s.length * 4.55;
  [...puntos]
    .sort((a, b) => a.operacion - b.operacion || a.rutas - b.rutas)
    .forEach((p) => {
      const cx = px(p.rutas);
      const cy = py(p.operacion);
      const corto = p.u.officialName
        .replace('Pontificia Universidad Católica', 'P. U. Católica')
        .replace('Universidad ', 'U. ');
      const w = anchoTexto(corto);
      const cabeADerecha = cx + 11 + w < ancho - m.d;
      let tx = cabeADerecha ? cx + 11 : cx - 11;
      const anclaje: 'start' | 'end' = cabeADerecha ? 'start' : 'end';
      let ty = cy + 3.5;
      const caja = () => ({
        x1: anclaje === 'start' ? tx : tx - w,
        x2: anclaje === 'start' ? tx + w : tx,
        y: ty,
      });
      let intentos = 0;
      while (
        intentos < 8 &&
        ocupados.some((o) => {
          const c = caja();
          return Math.abs(o.y - c.y) < 11 && o.x1 < c.x2 && c.x1 < o.x2;
        })
      ) {
        ty -= 12;
        intentos += 1;
      }
      // Si subir no despeja, se prueba el lado contrario a la altura del punto.
      if (intentos === 8) {
        tx = cabeADerecha ? cx - 11 : cx + 11;
        ty = cy + 3.5;
      }
      ocupados.push(caja());
      partes.push(
        texto(tx, ty, corto, {
          tam: 9.5,
          ancla: intentos === 8 ? (cabeADerecha ? 'end' : 'start') : anclaje,
          clase: 'g-t g-t-punto',
        }),
      );
    });

  const extremos = [...puntos].sort((a, b) => a.rutas - b.rutas);
  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'Cuánto se investigó frente a cuánta capacidad consta',
    descripcion: `Dispersión de las once instituciones. En horizontal, rutas del protocolo recorridas, de trece; en vertical, capacidades en operación, de diez. ${extremos[0].u.officialName} recorre ${extremos[0].rutas} rutas y acredita ${extremos[0].operacion} capacidades; ${extremos[extremos.length - 1].u.officialName} recorre ${extremos[extremos.length - 1].rutas} y acredita ${extremos[extremos.length - 1].operacion}. El halo gris de cada punto es proporcional a sus celdas no concluyentes.`,
    clase: 'g-dispersion',
  });
}

/* ── 3 · Mecanismos institucionales ────────────────────────────────────────── */

/**
 * Con qué instrumentos se hace lo que se hace, en toda la cohorte, separando lo
 * que sostiene la Facultad de lo que le presta su entorno. Sustituye al recuento
 * de iniciativas, que ponía en la misma unidad un diplomado y un seminario.
 */
export function mecanismosSvg(): string {
  const datos = distribucionMecanismos()
    .map((m) => ({ ...m, total: m.iniciativas.length }))
    .filter((m) => m.total > 0)
    .sort((a, b) => b.total - a.total);
  const max = Math.max(...datos.map((d) => d.total));

  const rotulo = 150;
  const barra = 470;
  const fila = 30;
  const ancho = rotulo + barra + 56;
  const alto = datos.length * fila + 62;
  const partes: string[] = [];

  datos.forEach((d, i) => {
    const y = 12 + i * fila;
    const wF = (d.deLaFacultad / max) * barra;
    const wE = ((d.total - d.deLaFacultad) / max) * barra;
    partes.push(
      texto(rotulo - 10, y + 13, d.label, { tam: 11, ancla: 'end', clase: 'g-t g-t-fila' }),
      rect(rotulo, y + 3, wF, 16, { fill: 'var(--g-op, #1b5e76)', rx: 2 }),
      rect(rotulo + wF, y + 3, wE, 16, {
        fill: 'var(--g-entorno-fondo, #f6ecd2)',
        stroke: 'var(--g-entorno, #c9a227)',
        'stroke-width': 1,
        'stroke-dasharray': '3 2',
        rx: 2,
      }),
      texto(rotulo + wF + wE + 8, y + 15.5, String(d.total), {
        tam: 11,
        clase: 'g-t g-t-cifra',
      }),
      `<rect x="${rotulo}" y="${y + 3}" width="${barra}" height="16" fill="transparent"><title>${esc(
        `${d.label}: ${d.total} iniciativas, ${d.deLaFacultad} de la Facultad y ${d.total - d.deLaFacultad} del entorno. ${d.definicion}`,
      )}</title></rect>`,
    );
  });

  const yl = 12 + datos.length * fila + 16;
  partes.push(
    rect(rotulo, yl - 9, 14, 12, { fill: 'var(--g-op, #1b5e76)', rx: 2 }),
    texto(rotulo + 19, yl + 1, 'de la Facultad, su centro o un equipo académico', {
      tam: 10,
      clase: 'g-t g-t-leyenda',
    }),
    rect(rotulo + 292, yl - 9, 14, 12, {
      fill: 'var(--g-entorno-fondo, #f6ecd2)',
      stroke: 'var(--g-entorno, #c9a227)',
      'stroke-width': 1,
      'stroke-dasharray': '3 2',
      rx: 2,
    }),
    texto(rotulo + 311, yl + 1, 'de la universidad, un individuo o los estudiantes', {
      tam: 10,
      clase: 'g-t g-t-leyenda',
    }),
  );

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'Con qué instrumentos se hace lo que se hace',
    descripcion: `Las ${informe01Recuento.iniciativas} iniciativas del corpus, repartidas por clase de mecanismo institucional: ${datos.map((d) => `${d.label.toLowerCase()} ${d.total}`).join(', ')}.`,
    clase: 'g-mecanismos',
  });
}

/* ── 4 · Escalera de institucionalización ──────────────────────────────────── */

/**
 * Los cuatro peldaños, con el último vacío. La forma de escalera no es adorno:
 * hace que el escalón que falta se vea antes de leer la cifra.
 */
export function escaleraSvg(): string {
  const dist = distribucionEscalera().filter((d) => d.nivel > 0);
  const max = Math.max(...dist.map((d) => d.iniciativas.length), 1);
  const ancho = 700;
  const anchoPeldano = 160;
  const alto = 306;
  const base = 214;
  const partes: string[] = [];

  /* La condición del kit es una frase larga; bajo la barra sólo cabe su núcleo,
     y truncarla dejaba «Varios eventos no». La condición completa se publica en
     la prosa que acompaña a la figura. */
  const resumido: Record<number, string> = {
    1: 'Anuncio, evento o piloto aislado',
    2: 'Actividad recurrente o proyecto en ejecución',
    3: 'Responsable formal, continuidad, política o recursos',
    4: 'Resultados públicamente revisables',
  };

  dist.forEach((d, i) => {
    const n = d.iniciativas.length;
    const x = 18 + i * (anchoPeldano + 8);
    const h = (n / max) * 150;
    const def = ESCALONES.find((e) => e.nivel === d.nivel)!;
    const vacio = n === 0;

    /* El peldaño: una banda baja que dibuja la escalera aunque la barra sea cero. */
    partes.push(
      rect(x, base + 6, anchoPeldano, 5 + i * 5, {
        fill: 'var(--g-banda, #e7e2d8)',
        rx: 1,
      }),
    );
    partes.push(
      vacio
        ? rect(x, base - 30, anchoPeldano, 30, {
            fill: 'url(#g-tramaFina)',
            stroke: 'var(--g-linea, #cfcac1)',
            'stroke-width': 1,
            'stroke-dasharray': '4 3',
            rx: 2,
          })
        : rect(x, base - h, anchoPeldano, h, {
            fill: `var(--g-esc-${d.nivel}, ${['', '#a9cdd8', '#6ba7bb', '#2f7f97', '#1b5e76'][d.nivel]})`,
            rx: 2,
          }),
      texto(x + anchoPeldano / 2, vacio ? base - 10 : base - h - 10, vacio ? 'ninguna' : String(n), {
        tam: vacio ? 12 : 19,
        ancla: 'middle',
        peso: vacio ? 400 : 500,
        clase: vacio ? 'g-t g-t-eje' : 'g-t g-t-cifra',
      }),
      texto(x + anchoPeldano / 2, base + 30 + i * 5, `${d.nivel} · ${def.label}`, {
        tam: 11,
        ancla: 'middle',
        peso: 500,
        clase: 'g-t g-t-fila',
      }),
      textoMulti(x + anchoPeldano / 2, base + 46 + i * 5, partir(resumido[d.nivel], 28), 11, {
        tam: 9,
        ancla: 'middle',
        clase: 'g-t g-t-leyenda',
      }),
    );
  });

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'La escalera se llena hasta el tercer peldaño y se detiene',
    descripcion: `Reparto de las ${informe01Recuento.iniciativas} iniciativas por peldaño de institucionalización: ${dist.map((d) => `${d.nivel} ${d.iniciativas.length}`).join(', ')}. El peldaño 4, evaluación de efecto, está vacío en las once instituciones.`,
    clase: 'g-escalera',
  });
}

/* ── 5 · Línea de tiempo ───────────────────────────────────────────────────── */

/**
 * Cuándo empezó cada iniciativa fechada. Es la visualización que la v0.6.0
 * declaraba y no tenía, y resulta ser una de las que más dice: el fenómeno
 * completo cabe en dos años.
 */
export function lineaTiempoSvg(): string {
  const conFecha = informe01Iniciativas.filter((i) => i.startDate);
  const anios = conFecha.map((i) => Number(i.startDate!.slice(0, 4)));
  const DESDE = 2020;
  const HASTA = Math.max(...anios);
  const antes = conFecha.filter((i) => Number(i.startDate!.slice(0, 4)) < DESDE);
  const columnas: { etiqueta: string; anio: number | null; n: number }[] = [
    { etiqueta: `antes de ${DESDE}`, anio: null, n: antes.length },
    ...Array.from({ length: HASTA - DESDE + 1 }, (_, k) => {
      const a = DESDE + k;
      return {
        etiqueta: String(a),
        anio: a,
        n: conFecha.filter((i) => Number(i.startDate!.slice(0, 4)) === a).length,
      };
    }),
  ];
  const max = Math.max(...columnas.map((c) => c.n));

  const ancho = 700;
  const alto = 300;
  const base = 214;
  const w = 62;
  const hueco = 12;
  const x0 = (ancho - (columnas.length * (w + hueco) - hueco)) / 2;
  const partes: string[] = [];

  columnas.forEach((c, i) => {
    const x = x0 + i * (w + hueco);
    const h = c.n ? Math.max(4, (c.n / max) * 160) : 0;
    const futuro = c.anio !== null && c.anio > 2026;
    partes.push(
      c.n
        ? rect(x, base - h, w, h, {
            fill: futuro
              ? 'url(#g-tramaGruesa)'
              : c.anio === null
                ? 'var(--g-vacio, #ece9e3)'
                : 'var(--g-op, #1b5e76)',
            stroke: futuro || c.anio === null ? 'var(--g-linea, #cfcac1)' : 'none',
            'stroke-width': 1,
            rx: 2,
          })
        : '',
      texto(x + w / 2, base - h - 8, c.n ? String(c.n) : '—', {
        tam: c.n ? 13 : 10,
        ancla: 'middle',
        clase: c.n ? 'g-t g-t-cifra' : 'g-t g-t-eje',
      }),
      texto(x + w / 2, base + 18, c.etiqueta, {
        tam: c.anio === null ? 9 : 11,
        ancla: 'middle',
        clase: 'g-t g-t-fila',
      }),
    );
  });

  const desde2025 = conFecha.filter((i) => Number(i.startDate!.slice(0, 4)) >= 2025).length;
  partes.push(
    linea(x0 - 6, base + 1, x0 + columnas.length * (w + hueco) - hueco + 6, base + 1, {
      stroke: 'var(--g-linea, #cfcac1)',
      'stroke-width': 1,
    }),
    texto(
      x0,
      base + 44,
      `${desde2025} de las ${conFecha.length} iniciativas fechadas empiezan en 2025 o después. Cuatro no declaran fecha y una anuncia su inicio para 2027.`,
      { tam: 10, clase: 'g-t g-t-leyenda' },
    ),
  );

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'El campo entero cabe en dos años',
    descripcion: `Iniciativas por año de inicio declarado: ${columnas.map((c) => `${c.etiqueta} ${c.n}`).join(', ')}. ${desde2025} de ${conFecha.length} comienzan en 2025 o después.`,
    clase: 'g-tiempo',
  });
}

/* ── 6 · Direcciones de la relación IA–Derecho ─────────────────────────────── */

/** Enseñar con IA y estudiar el Derecho de la IA no son lo mismo. */
export function direccionesSvg(): string {
  const datos = distribucionDirecciones().map((d) => ({ ...d, n: d.iniciativas.length }));
  const total = datos.reduce((s, d) => s + d.n, 0);
  const ancho = 700;
  const alto = 236;
  const barra = ancho - 24;
  const partes: string[] = [];
  const tonos = [
    'var(--g-op, #1b5e76)',
    'var(--g-esc-3, #2f7f97)',
    'var(--g-esc-2, #6ba7bb)',
    'var(--g-vacio, #ece9e3)',
  ];

  let x = 12;
  datos.forEach((d, i) => {
    const w = (d.n / total) * barra;
    partes.push(
      rect(x, 16, w, 34, {
        fill: tonos[i],
        stroke: i === 3 ? 'var(--g-linea, #cfcac1)' : 'none',
        'stroke-width': 1,
      }),
      w > 26
        ? texto(x + w / 2, 38, String(d.n), {
            tam: 13,
            ancla: 'middle',
            clase: `g-t ${['g-t-sobre-op', 'g-t-sobre-esc-3', 'g-t-sobre-esc-2', 'g-t-cifra'][i]}`,
          })
        : '',
      `<rect x="${x}" y="16" width="${w}" height="34" fill="transparent"><title>${esc(`${d.label}: ${d.n} iniciativas. ${d.definition}`)}</title></rect>`,
    );
    x += w;
  });

  datos.forEach((d, i) => {
    const y = 76 + i * 38;
    partes.push(
      rect(12, y - 9, 13, 12, {
        fill: tonos[i],
        stroke: i === 3 ? 'var(--g-linea, #cfcac1)' : 'none',
        'stroke-width': 1,
        rx: 2,
      }),
      texto(32, y + 1, `${d.label} · ${d.n}`, { tam: 11, peso: 500, clase: 'g-t g-t-fila' }),
      textoMulti(32, y + 15, partir(d.definition, 104).slice(0, 2), 11, {
        tam: 9.5,
        clase: 'g-t g-t-leyenda',
      }),
    );
  });

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'La mayoría usa la IA; una minoría la estudia como objeto jurídico',
    descripcion: `Reparto de las ${total} iniciativas por dirección: ${datos.map((d) => `${d.label} ${d.n}`).join(', ')}.`,
    clase: 'g-direcciones',
  });
}

/* ── 7 · Cobertura de investigación por institución ────────────────────────── */

/**
 * Cuánto se investigó cada una. Va **antes** que cualquier comparación: sin este
 * denominador, una fila más poblada se lee como una universidad que hace más.
 */
export function coberturaSvg(): string {
  const filas = universidadesOrdenadas.map((u) => ({ u, c: coberturaDe(u.id)! }));
  const rotulo = 216;
  const barra = 380;
  const fila = 27;
  const ancho = rotulo + barra + 120;
  const alto = filas.length * fila + 72;
  const partes: string[] = [];

  filas.forEach(({ u, c }, i) => {
    const y = 10 + i * fila;
    const w = (c.routesCompleted / c.routesTotal) * barra;
    const verificado = c.sources ? Math.round((c.substantivelyVerifiedSources / c.sources) * 100) : 0;
    partes.push(
      texto(rotulo - 10, y + 13, u.officialName, {
        tam: 10.5,
        ancla: 'end',
        clase: 'g-t g-t-fila',
      }),
      rect(rotulo, y + 4, barra, 14, { fill: 'var(--g-vacio, #ece9e3)', rx: 2 }),
      rect(rotulo, y + 4, w, 14, {
        fill: c.inPilot ? 'var(--g-contraste, #8a2432)' : 'var(--g-op, #1b5e76)',
        rx: 2,
      }),
      texto(rotulo + barra + 10, y + 15, `${c.routesCompleted}/13 rutas`, {
        tam: 9.5,
        clase: 'g-t g-t-eje',
      }),
      texto(rotulo + barra + 74, y + 15, `${verificado}% verif.`, {
        tam: 9.5,
        clase: 'g-t g-t-eje',
      }),
      `<rect x="${rotulo}" y="${y + 4}" width="${barra}" height="14" fill="transparent"><title>${esc(
        `${u.officialName}: ${c.routesCompleted} de ${c.routesTotal} rutas, ${c.sources} fuentes, ${c.substantivelyVerifiedSources} contrastadas (${verificado} %).`,
      )}</title></rect>`,
    );
  });

  const yl = 10 + filas.length * fila + 18;
  partes.push(
    rect(rotulo, yl - 9, 13, 12, { fill: 'var(--g-contraste, #8a2432)', rx: 2 }),
    texto(rotulo + 18, yl + 1, 'piloto de profundidad', { tam: 10, clase: 'g-t g-t-leyenda' }),
    texto(
      rotulo,
      yl + 18,
      'La segunda cifra es la proporción de fuentes contrastadas. Las dos miden nuestro trabajo, no el de la institución.',
      { tam: 10, clase: 'g-t g-t-leyenda' },
    ),
  );

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'Cuánto se investigó cada institución',
    descripcion: `Rutas del protocolo recorridas por institución, de trece, con la proporción de fuentes contrastadas: ${filas.map(({ u, c }) => `${u.officialName} ${c.routesCompleted}`).join(', ')}.`,
    clase: 'g-cobertura',
  });
}

/* ── 8 · Mapa de desarrollo de una institución ─────────────────────────────── */

/**
 * Las diez capacidades de una sola institución, en dos columnas: lo que consta y
 * lo que faltaría demostrar para pasar al estado siguiente.
 *
 * **No es un semáforo.** No hay rojo, no hay puntaje y no hay meta declarada por
 * el informe: cada fila dice en qué estado está la evidencia y qué instrumento
 * usaron las Facultades donde esa misma capacidad ya consta en operación. La
 * decisión de si eso conviene o no es de la institución.
 */
export function mapaDesarrolloSvg(universityId: string): string {
  const u = universidadesOrdenadas.find((x) => x.id === universityId)!;
  const filas = CAPACIDADES.map((c) => {
    const celda = celdaCapacidad(universityId, c.id);
    const referentes = universidadesOrdenadas
      .filter((o) => o.id !== universityId)
      .filter((o) => celdaCapacidad(o.id, c.id).estado === 'EN_OPERACION');
    return { def: c, celda, referentes };
  });

  const rotulo = 176;
  const estado = 128;
  const fila = 30;
  const ancho = 720;
  const alto = filas.length * fila + 76;
  const partes: string[] = [];

  partes.push(
    texto(6, 16, 'Capacidad', { tam: 9.5, peso: 500, clase: 'g-t g-t-banda' }),
    texto(rotulo + 6, 16, 'Lo que consta', { tam: 9.5, peso: 500, clase: 'g-t g-t-banda' }),
    texto(rotulo + estado + 12, 16, 'Dónde ya está en operación', {
      tam: 9.5,
      peso: 500,
      clase: 'g-t g-t-banda',
    }),
    linea(0, 22, ancho, 22, { stroke: 'var(--g-linea, #cfcac1)', 'stroke-width': 1 }),
  );

  filas.forEach((f, i) => {
    const y = 30 + i * fila;
    const p = PINTURA[f.celda.estado];
    if (i % 2 === 1)
      partes.push(rect(0, y - 4, ancho, fila, { fill: 'var(--g-cebra, #00000008)' }));
    partes.push(
      texto(6, y + 14, f.def.label, { tam: 10.5, clase: 'g-t g-t-fila' }),
      rect(rotulo, y + 3, 12, 12, {
        fill: p.relleno,
        stroke: p.borde,
        'stroke-width': 1,
        ...(p.discontinuo ? { 'stroke-dasharray': '3 2' } : {}),
        rx: 2,
      }),
      texto(rotulo + 18, y + 13, nombreEstado(f.celda.estado), {
        tam: 10,
        clase: 'g-t g-t-fila',
      }),
      texto(
        rotulo + estado + 12,
        y + 13,
        f.referentes.length
          ? f.referentes
              .map((r) =>
                r.officialName
                  .replace('Pontificia Universidad Católica de', 'P. U. Católica de')
                  .replace('Universidad ', 'U. '),
              )
              .join(' · ')
          : 'en ninguna de las otras diez',
        { tam: 9.5, clase: f.referentes.length ? 'g-t g-t-leyenda' : 'g-t g-t-eje' },
      ),
      `<rect x="0" y="${y - 4}" width="${ancho}" height="${fila}" fill="transparent"><title>${esc(
        `${f.def.label}: ${nombreEstado(f.celda.estado)}. ${f.celda.motivo}`,
      )}</title></rect>`,
    );
  });

  const enOperacion = filas.filter((f) => f.celda.estado === 'EN_OPERACION').length;
  const sinConcluir = filas.filter((f) => f.celda.estado === 'NO_CONCLUYENTE').length;

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: `Mapa de desarrollo institucional · ${u.officialName}`,
    descripcion: `De las diez capacidades, ${enOperacion} constan en operación y ${sinConcluir} quedan sin concluir porque su ruta del protocolo no se recorrió. La tercera columna nombra las Facultades donde la misma capacidad consta en operación.`,
    clase: 'g-mapa',
  });
}

/* ── 9 · Marca de portada ──────────────────────────────────────────────────── */

/**
 * La matriz de capacidades reducida a su retícula, sin rótulos ni cifras.
 *
 * Es la única figura del informe que no responde una pregunta, y por eso es la
 * única que puede ir en una portada. No pretende leerse: pretende que el lector
 * reconozca, veinte páginas después, que la portada era el documento. Y como
 * sale del mismo cálculo que la matriz, no puede quedar desactualizada respecto
 * de ella ni decir una cosa distinta.
 */
/* ── 10 · Las conclusiones ─────────────────────────────────────────────────── */

/**
 * Qué puede sostener el estudio, y con qué firmeza.
 *
 * Es la unica figura que no habla de las Facultades sino del propio informe. La
 * barra es la confianza declarada de la afirmacion que sostiene cada conclusion
 * —un numero que ya estaba en el dataset y que hasta ahora solo se leia abriendo
 * el anexo—, y el color separa lo que es un hecho sobre el corpus de lo que es
 * una inferencia. La marca lateral señala las dos que el analisis de sensibilidad
 * dejo mas restringidas al cambiar de instrumento.
 *
 * No se ordena por confianza a proposito: el orden es el del documento, porque
 * ordenar por firmeza invitaria a leer la lista como un ranking de solidez y a
 * descartar el final, que es justo donde esta la unica inferencia.
 */
export function conclusionesSvg(): string {
  const datos = informe01Conclusiones.map((c) => {
    const apoyos = c.apoyo
      .map((id) => informe01Afirmaciones.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => !!a);
    /* La mas floja manda: una conclusion no es mas firme que su apoyo mas debil. */
    const confianza = apoyos.length ? Math.min(...apoyos.map((a) => a.confidence)) : 0;
    return { ...c, confianza, apoyos: apoyos.length };
  });

  const rotulo = 300;
  const barra = 300;
  const fila = 46;
  const ancho = rotulo + barra + 72;
  const alto = datos.length * fila + 74;
  const partes: string[] = [];

  /* Eje: la confianza declarada va de 0 a 100 y ninguna baja de 70, de modo que
   * la escala arranca en 50. Empezar en cero aplastaria las diferencias; empezar
   * en 70 las exageraria hasta sugerir que una de 90 vale el triple que una de
   * 75. La referencia se dibuja para que la eleccion quede a la vista.        */
  const min = 50;
  const escala = (v: number) => ((v - min) / (100 - min)) * barra;

  for (const v of [50, 75, 100]) {
    const x = rotulo + escala(v);
    partes.push(
      linea(x, 4, x, datos.length * fila + 14, {
        stroke: 'var(--g-linea, #cfcac1)',
        'stroke-width': 1,
        'stroke-dasharray': v === 100 ? '0' : '2 3',
      }),
      texto(x, datos.length * fila + 28, String(v), {
        tam: 9.5,
        ancla: 'middle',
        clase: 'g-t g-t-eje',
      }),
    );
  }
  partes.push(
    texto(rotulo + barra / 2, datos.length * fila + 44, 'confianza declarada de la afirmación que la sostiene', {
      tam: 9.5,
      ancla: 'middle',
      clase: 'g-t g-t-eje',
    }),
  );

  datos.forEach((d, i) => {
    const y = 12 + i * fila;
    const esHecho = d.clase === 'HECHO';
    const w = escala(d.confianza);

    partes.push(
      texto(0, y + 11, d.id, { tam: 10.5, clase: 'g-t g-t-eje', peso: 600 }),
      textoMulti(34, y + 8, partir(d.titulo, 46).slice(0, 2), 13, {
        tam: 11,
        clase: 'g-t g-t-fila',
      }),
      rect(rotulo, y + 1, w, 15, {
        fill: esHecho ? 'var(--g-op, #1b5e76)' : 'url(#g-tramaGruesa)',
        stroke: esHecho ? 'none' : 'var(--g-incip, #5c9ead)',
        'stroke-width': esHecho ? 0 : 1,
        rx: 2,
      }),
      texto(rotulo + w + 8, y + 13, String(d.confianza), { tam: 11, clase: 'g-t g-t-cifra' }),
      d.acotada
        ? rect(rotulo - 6, y + 1, 3, 15, { fill: 'var(--g-contraste, #8a2432)', rx: 1 })
        : '',
      `<rect x="0" y="${y - 4}" width="${ancho}" height="${fila - 6}" fill="transparent"><title>${esc(
        `${d.id}. ${d.titulo}. ${esHecho ? 'Hecho sobre el corpus' : 'Inferencia'}, confianza ${d.confianza} sobre 100, apoyada en ${d.apoyos === 1 ? 'una afirmación' : `${d.apoyos} afirmaciones`}.${d.acotada ? ' El análisis de sensibilidad la dejó acotada.' : ''}`,
      )}</title></rect>`,
    );
  });

  const yl = 12 + datos.length * fila + 56;
  partes.push(
    rect(0, yl - 9, 14, 12, { fill: 'var(--g-op, #1b5e76)', rx: 2 }),
    texto(19, yl + 1, 'Hecho sobre el corpus', { tam: 10, clase: 'g-t g-t-leyenda' }),
    rect(168, yl - 9, 14, 12, {
      fill: 'url(#g-tramaGruesa)',
      stroke: 'var(--g-incip, #5c9ead)',
      'stroke-width': 1,
      rx: 2,
    }),
    texto(187, yl + 1, 'Inferencia', { tam: 10, clase: 'g-t g-t-leyenda' }),
    rect(268, yl - 9, 3, 12, { fill: 'var(--g-contraste, #8a2432)', rx: 1 }),
    texto(278, yl + 1, 'acotada por el análisis de sensibilidad', {
      tam: 10,
      clase: 'g-t g-t-leyenda',
    }),
  );

  const hechos = datos.filter((d) => d.clase === 'HECHO').length;
  const acotadas = datos.filter((d) => d.acotada).length;

  return figura(partes.join(''), {
    ancho,
    alto: alto + 20,
    titulo: `${hechos} de las ${datos.length} conclusiones son hechos sobre el corpus; ${
      datos.length - hechos === 1 ? 'la otra es una inferencia' : 'las otras son inferencias'
    }, y ${acotadas} quedan acotadas por lo que no se recorrió`,
    descripcion: datos
      .map(
        (d) =>
          `${d.id}: ${d.titulo}. ${d.clase === 'HECHO' ? 'Hecho' : 'Inferencia'}, confianza ${d.confianza}${d.acotada ? ', acotada' : ''}.`,
      )
      .join(' '),
    clase: 'g-conclusiones',
  });
}

export function marcaPortadaSvg(): string {
  const cols = universidadesOrdenadas.map((u) => u.id);
  const lado = 13;
  const hueco = 3;
  const ancho = cols.length * (lado + hueco) - hueco;
  const alto = CAPACIDADES.length * (lado + hueco) - hueco;

  const partes = CAPACIDADES.flatMap((c, f) =>
    cols.map((id, i) => {
      const p = PINTURA[celdaCapacidad(id, c.id).estado];
      return rect(i * (lado + hueco), f * (lado + hueco), lado, lado, {
        fill: p.relleno,
        stroke: p.borde,
        'stroke-width': 0.75,
        ...(p.discontinuo ? { 'stroke-dasharray': '2 1.5' } : {}),
        rx: 1.5,
      });
    }),
  );

  return figura(partes.join(''), {
    ancho,
    alto,
    titulo: 'Marca de portada',
    descripcion: `Retícula de ${CAPACIDADES.length} capacidades por ${cols.length} instituciones, con el estado de cada celda en color. Es la matriz de capacidades del informe, reducida y sin rótulos.`,
    clase: 'g-marca',
  });
}
