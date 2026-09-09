/**
 * Las dos figuras del comparador, dibujadas desde la matriz.
 *
 * Existe por un defecto concreto y caro: en la v2.0.0 la tabla de la sección 4
 * y el anexo D publicaban la matriz `.v2` sobre diez instituciones, y la
 * figura de al lado dibujaba once barras con los valores de `.v1`. Las dos
 * cosas salían de sitios distintos, así que nada impedía que divergieran, y
 * divergieron. Aquí salen de `matriz-v2.json` y de ningún otro sitio.
 *
 *   node tools/informes/informe-01/comparador/figuras.mjs
 *
 * La gramática visual —escalas, colores, tamaños, posiciones— está copiada de
 * la figura entregada en la v2.0.0 y medida sobre ella, para que el cambio de
 * origen no se note como un cambio de diseño.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aquí = path.dirname(fileURLToPath(import.meta.url));

export const MATRIZ = JSON.parse(
  fs.readFileSync(path.join(aquí, 'matriz-v2.json'), 'utf8'),
);

/**
 * Quién sale del comparador, y por qué.
 *
 * No es una preferencia de dibujo: es la decisión D-037. Quien firma trabaja
 * en el Programa DIAT de esta Escuela y la PUCV fue una de las tres
 * instituciones del piloto de profundidad. Sigue en la cohorte —las figuras
 * de cobertura y de capacidades la dibujan— y no en el orden.
 */
export const FUERA_DEL_COMPARADOR = ['P. U. Católica de Valparaíso'];

/**
 * Rutas del protocolo recorridas y fuentes por institución.
 *
 * Leídas de la figura de cobertura de la v2.0.0, que es donde se publican.
 * Viven aquí porque la figura de comprobación cruza cobertura con índice y
 * necesita las dos series; si algún día la cobertura se compila a datos
 * tipados, esta tabla se sustituye por esa lectura.
 */
export const COBERTURA = {
  'P. U. Católica de Chile': { rutas: 12, fuentes: 12, piloto: true },
  'P. U. Católica de Valparaíso': { rutas: 11, fuentes: 14, piloto: true },
  'U. Adolfo Ibáñez': { rutas: 6, fuentes: 3 },
  'U. Andrés Bello': { rutas: 8, fuentes: 4 },
  'U. Autónoma de Chile': { rutas: 5, fuentes: 3 },
  'U. Central de Chile': { rutas: 7, fuentes: 4 },
  'U. de Chile': { rutas: 12, fuentes: 16, piloto: true },
  'U. de Concepción': { rutas: 7, fuentes: 4 },
  'U. de los Andes': { rutas: 7, fuentes: 5 },
  'U. del Desarrollo': { rutas: 6, fuentes: 4 },
  'U. Diego Portales': { rutas: 7, fuentes: 3 },
};

/** Cómo se llama cada institución cuando hay sitio, y cuando no lo hay. */
export const NOMBRES = {
  'P. U. Católica de Chile': ['Pontificia Universidad Católica de Chile', 'PUC'],
  'P. U. Católica de Valparaíso': [
    'Pontificia Universidad Católica de Valparaíso',
    'PUCV',
  ],
  'U. Adolfo Ibáñez': ['Universidad Adolfo Ibáñez', 'UAI'],
  'U. Andrés Bello': ['Universidad Andrés Bello', 'UNAB'],
  'U. Autónoma de Chile': ['Universidad Autónoma de Chile', 'U.Aut'],
  'U. Central de Chile': ['Universidad Central de Chile', 'U.Cen'],
  'U. de Chile': ['Universidad de Chile', 'U.Chile'],
  'U. de Concepción': ['Universidad de Concepción', 'UdeC'],
  'U. de los Andes': ['Universidad de los Andes', 'U.Andes'],
  'U. del Desarrollo': ['Universidad del Desarrollo', 'UDD'],
  'U. Diego Portales': ['Universidad Diego Portales', 'UDP'],
};

const FUENTE = "Inter,'Segoe UI',Helvetica,Arial,sans-serif";

const n1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function texto(x, y, s, o = {}) {
  const { size = 6.8, fill = '#8c98a8', peso = 400, anclaje = 'middle' } = o;
  return (
    `<text x="${n1(x)}" y="${n1(y)}" font-family="${FUENTE}" font-size="${size}"` +
    ` fill="${fill}" font-weight="${peso}" text-anchor="${anclaje}"` +
    ` letter-spacing="0" opacity="1">${esc(s)}</text>`
  );
}

/**
 * Piso, techo y celdas sin concluir de una fila de la matriz.
 *
 * Aplica la rúbrica del anexo D, que está cerrada desde antes de calcular y
 * no se toca: `NC` no suma al piso y aporta 2 al techo, que es el valor medio
 * de los estados posibles distintos de cero.
 */
export function puntuar(estados) {
  let piso = 0;
  let techo = 0;
  let nc = 0;
  for (const estado of estados) {
    const p = MATRIZ.puntos[estado];
    if (p === null || p === undefined) {
      nc += 1;
      techo += 2;
    } else {
      piso += p;
      techo += p;
    }
  }
  return { piso, techo, nc };
}

/**
 * El comparador, ordenado y sin las instituciones apartadas.
 *
 * `matriz` es `'v1'` o `'v2'`. La canónica de la v2.1.0 es `v2`: es la que
 * publicaban ya la tabla de la sección 4 y el anexo D de la v2.0.0.
 */
export function comparador(matriz = 'v2') {
  return Object.entries(MATRIZ[matriz])
    .filter(([nombre]) => !FUERA_DEL_COMPARADOR.includes(nombre))
    .map(([nombre, estados]) => ({
      clave: nombre,
      nombre: NOMBRES[nombre][0],
      corto: NOMBRES[nombre][1],
      ...COBERTURA[nombre],
      ...puntuar(estados),
    }))
    .sort((a, b) => b.piso - a.piso || b.techo - a.techo);
}

/** La institución apartada, con su puntuación, para el complemento. */
export function apartada(matriz = 'v2') {
  const clave = FUERA_DEL_COMPARADOR[0];
  return {
    clave,
    nombre: NOMBRES[clave][0],
    corto: NOMBRES[clave][1],
    ...COBERTURA[clave],
    ...puntuar(MATRIZ[matriz][clave]),
  };
}

const lectura = (nc) =>
  nc === 0 ? 'banda cerrada' : nc <= 2 ? 'banda estrecha' : 'banda ancha';

/**
 * Figura del comparador · barras de banda.
 *
 * La barra sólida es el piso; la banda punteada, lo que el informe no sabe.
 * El tono más oscuro marca las filas con una celda sin concluir o ninguna:
 * el color dice cuánta duda hay antes de que el lector lea la cifra.
 */
export function figuraComparador(filas) {
  const X0 = 238;
  const ANCHO = 426;
  const MAX = 30;
  const px = (p) => X0 + (p / MAX) * ANCHO;
  const ALTO_BARRA = 12;
  const PASO = 27;
  const Y0 = 14;

  const ejeAbajo = Y0 + PASO * (filas.length - 1) + ALTO_BARRA + 15;
  const partes = [];

  for (let p = 0; p <= MAX; p += 5) {
    partes.push(
      `<line x1="${n1(px(p))}" y1="8.0" x2="${n1(px(p))}" y2="${n1(ejeAbajo)}"` +
        ` stroke="#eef1f5" stroke-width="0.5"/>`,
    );
    partes.push(texto(px(p), ejeAbajo + 12, String(p)));
  }
  partes.push(
    texto(
      px(15),
      ejeAbajo + 24,
      'Índice de Formalización de Capacidad · de 30 puntos posibles',
      { size: 7.1, fill: '#5d6b7d', peso: 500 },
    ),
  );

  filas.forEach((f, i) => {
    const y = Y0 + PASO * i;
    const base = y + ALTO_BARRA - 2.4;
    const primera = i === 0;

    partes.push(
      texto(X0 - 9, base, f.nombre, {
        size: 8.4,
        fill: primera ? '#0d1420' : '#26313f',
        peso: primera ? 650 : 500,
        anclaje: 'end',
      }),
    );
    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(ANCHO)}" height="${n1(ALTO_BARRA)}"` +
        ` rx="1.4" fill="#eef1f5" opacity="1"/>`,
    );

    if (f.techo > f.piso) {
      const x = px(f.piso);
      const w = px(f.techo) - x;
      partes.push(
        `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(ALTO_BARRA)}"` +
          ` rx="1.4" fill="#7ad0cd" opacity="0.55"/>`,
      );
      partes.push(
        `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${ALTO_BARRA}"` +
          ` rx="1.4" fill="none" stroke="#00a3a3" stroke-width=".7" stroke-dasharray="2.5 2"/>`,
      );
    }

    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(px(f.piso) - X0)}"` +
        ` height="${n1(ALTO_BARRA)}" rx="1.4" fill="${f.nc <= 1 ? '#0f4c81' : '#1a6fa8'}" opacity="1"/>`,
    );

    partes.push(
      texto(X0 + ANCHO + 8, base, f.techo > f.piso ? `${f.piso}–${f.techo}` : String(f.piso), {
        size: 8.8,
        fill: '#0d1420',
        peso: 650,
        anclaje: 'start',
      }),
    );
    partes.push(
      texto(
        779,
        base,
        f.nc === 0 ? 'banda cerrada' : `${f.nc} ${f.nc === 1 ? 'celda' : 'celdas'} sin concluir`,
        { size: 6.9, fill: '#8c98a8', peso: 400, anclaje: 'end' },
      ),
    );
  });

  const alto = ejeAbajo + 30;
  return (
    `<svg viewBox="0 0 780 ${alto}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/**
 * Figura de comprobación · cobertura contra índice.
 *
 * Responde si el informe mide lo que hacen las Facultades o dónde miramos
 * nosotros. El halo gris es proporcional a las celdas sin concluir: un punto
 * bajo con halo grande no dice «hace poco», dice «no lo sabemos».
 */
export function figuraComprobacion(filas) {
  const X0 = 44;
  const X1 = 746;
  const Y0 = 20;
  const Y1 = 248;
  const RUTAS = 13;
  const TOPE = Math.max(20, ...filas.map((f) => f.piso));
  const px = (r) => X0 + (r / RUTAS) * (X1 - X0);
  const py = (p) => Y1 - (p / TOPE) * (Y1 - Y0);

  const partes = [];
  for (let r = 0; r <= 12; r += 2) {
    partes.push(
      `<line x1="${n1(px(r))}" y1="${n1(Y0)}" x2="${n1(px(r))}" y2="${n1(Y1)}"` +
        ` stroke="#eef1f5" stroke-width="0.5"/>`,
    );
    partes.push(texto(px(r), Y1 + 13, String(r)));
  }
  for (let p = 0; p <= TOPE; p += 5) {
    partes.push(
      `<line x1="${n1(X0)}" y1="${n1(py(p))}" x2="${n1(X1)}" y2="${n1(py(p))}"` +
        ` stroke="#eef1f5" stroke-width="0.5"/>`,
    );
    partes.push(texto(X0 - 6, py(p) + 2.4, String(p), { anclaje: 'end' }));
  }

  partes.push(
    `<path d="M${X0},${Y1} L${n1(X1)},${n1(Y0)}" stroke="#b9c4d1"` +
      ` stroke-width=".8" stroke-dasharray="4 3"/>`,
  );
  /* La etiqueta de la diagonal vivía en el vértice superior derecho, que con
     la matriz anterior estaba vacío. Con la Ronda 2 la primera institución
     sube a 20 —el tope del eje— y aterriza justo ahí: la etiqueta se baja al
     centro de la diagonal, que sigue libre. */
  partes.push(
    texto((X0 + X1) / 2 + 4, (Y0 + Y1) / 2 + 12, 'si fueran la misma variable', {
      size: 6.9,
      peso: 400,
      anclaje: 'start',
    }),
  );
  partes.push(
    texto(X0, Y1 + 27, 'Rutas del protocolo recorridas, de trece  →  nuestro trabajo de campo', {
      size: 7.1,
      fill: '#5d6b7d',
      peso: 500,
      anclaje: 'start',
    }),
  );
  partes.push(
    texto(X0 - 6, 12, 'IFC (piso)', {
      size: 7.1,
      fill: '#5d6b7d',
      peso: 600,
      anclaje: 'end',
    }),
  );

  /* Dos instituciones pueden caer en el mismo punto —la de Concepción y la de
     los Andes comparten siete rutas y un piso de cinco— y sus rótulos se
     superponían hasta quedar ilegibles. El segundo y siguientes de cada
     coincidencia se escalonan hacia abajo. */
  const ocupados = new Map();

  for (const f of filas) {
    const cx = px(f.rutas);
    const cy = py(f.piso);
    const llave = `${f.rutas}:${f.piso}`;
    const repetido = ocupados.get(llave) ?? 0;
    ocupados.set(llave, repetido + 1);
    const desvío = repetido * 9;
    if (f.nc > 0) {
      partes.push(
        `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(3.4 + 1.5 * f.nc)}"` +
          ` fill="#e3e8ee" opacity=".55"/>`,
      );
    }
    partes.push(
      `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="4" fill="${f.piloto ? '#0f4c81' : '#00a3a3'}"/>`,
    );
    partes.push(
      texto(cx + 7, cy + 2.6 + desvío, f.corto, {
        size: 6.9,
        fill: '#26313f',
        peso: f.piloto ? 600 : 400,
        anclaje: 'start',
      }),
    );
    if (desvío) {
      partes.push(
        `<line x1="${n1(cx + 4.5)}" y1="${n1(cy + 1)}" x2="${n1(cx + 6)}"` +
          ` y2="${n1(cy + desvío)}" stroke="#b9c4d1" stroke-width=".5"/>`,
      );
    }
  }

  return (
    `<svg viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/**
 * Cómo se dibuja cada estado en la matriz de capacidades.
 *
 * El color dice el estado y no el puntaje: `INC` y `ENT` valen los dos un
 * punto y no comparten tinta, porque significan cosas distintas. Los cuatro
 * estados de borde llevan además glifo, de modo que la figura sobreviva a una
 * impresión en blanco y negro.
 *
 * `ADY` no tenía dibujo: la v0.8.0 dejó el vocabulario vigente sin ninguna
 * celda en ese estado, y la Ronda 2 devuelve una —la unidad especializada de
 * la Universidad Adolfo Ibáñez—. Comparte tinta con `ENT`, que es el otro
 * «existe algo, y no es lo que la capacidad pregunta», y se separa por glifo.
 */
export const ESTADOS = {
  OPF: { fill: '#0f4c81', glifo: '★', tinta: '#fff', tamaño: 7.6 },
  OP: { fill: '#00a3a3' },
  ENT: { fill: '#c7d5e3' },
  ADY: { fill: '#c7d5e3', glifo: '~', tinta: '#5d6b7d', tamaño: 8 },
  INC: { fill: '#e8b384' },
  NL: { fill: '#f0f2f5', glifo: '·', tinta: '#8c98a8', tamaño: 9 },
  NC: { borde: '#c3ccd6', glifo: '?', tinta: '#8c98a8', tamaño: 8 },
};

/** Los cinco grupos de la matriz, y cuántas capacidades cubre cada uno. */
const GRUPOS = [
  ['Estructura y gobernanza', 2],
  ['Docencia y formación', 3],
  ['Herramientas y adopción', 2],
  ['Conocimiento y vínculo', 2],
  ['Resultado', 1],
];

/** Los rótulos de columna, partidos en las dos líneas de la cabecera. */
const COLUMNAS = [
  ['Unidad', 'especializada'],
  ['Norma', 'propia'],
  ['Presencia', 'en pregrado'],
  ['Formación', 'estructurada'],
  ['Herramienta', 'desplegada'],
  ['Adopción', 'en la enseñanza'],
  ['Alcance', 'declarado'],
  ['', 'Investigación'],
  ['', 'Transferencia'],
  ['Evaluación', 'de efecto'],
];

/**
 * Figura de capacidades · la matriz entera, celda por celda.
 *
 * Es la misma información que publica el anexo C y sale de la misma matriz:
 * no puede decir otra cosa. Las filas van en el orden de la cohorte y no por
 * puntuación, porque esta figura no ordena.
 */
export function figuraCapacidades(matriz = 'v2') {
  const X0 = 151;
  const ANCHO = 49.6;
  const PASO_X = 52.6;
  const Y0 = 55;
  const ALTO = 15;
  const PASO_Y = 21;

  const claves = Object.keys(MATRIZ[matriz]).filter(
    (n) => !FUERA_DEL_COMPARADOR.includes(n),
  );
  const cx = (c) => X0 + PASO_X * c + ANCHO / 2;
  const partes = [];

  let col = 0;
  for (const [rótulo, n] of GRUPOS) {
    const x = X0 - 1 + PASO_X * col;
    const w = PASO_X * n - 3;
    partes.push(
      `<rect x="${n1(x)}" y="39.0" width="${n1(w)}" height="2.0" rx="1"` +
        ` fill="#00a3a3" opacity="0.5"/>`,
    );
    partes.push(
      texto(x + w / 2, 35, rótulo, { size: 6.7, fill: '#5d6b7d', peso: 650 }),
    );
    col += n;
  }

  COLUMNAS.forEach(([arriba, abajo], c) => {
    if (arriba) {
      partes.push(texto(cx(c), 40.6, arriba, { size: 6.6, fill: '#0d1420', peso: 600 }));
    }
    partes.push(texto(cx(c), 48, abajo, { size: 6.6, fill: '#0d1420', peso: 600 }));
  });

  claves.forEach((clave, f) => {
    const y = Y0 + PASO_Y * f;
    const cob = COBERTURA[clave];
    partes.push(
      texto(142, y + 10, NOMBRES[clave][0], {
        size: 7.8,
        fill: cob.piloto ? '#0d1420' : '#26313f',
        peso: cob.piloto ? 650 : 450,
        anclaje: 'end',
      }),
    );

    MATRIZ[matriz][clave].forEach((estado, c) => {
      const e = ESTADOS[estado];
      const x = X0 + PASO_X * c;
      partes.push(
        e.borde
          ? `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(ANCHO)}" height="${n1(ALTO)}"` +
            ` rx="1.2" fill="#ffffff" opacity="1" stroke="${e.borde}" stroke-width=".7"/>`
          : `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(ANCHO)}" height="${n1(ALTO)}"` +
            ` rx="1.2" fill="${e.fill}" opacity="1"/>`,
      );
      if (e.glifo) {
        partes.push(
          texto(cx(c), y + 11.5, e.glifo, {
            size: e.tamaño,
            fill: e.tinta,
            peso: 650,
          }),
        );
      }
    });

    partes.push(
      texto(679, y + 11, `${cob.rutas}/13`, { size: 6.8, peso: 500, anclaje: 'end' }),
    );
  });

  const alto = Y0 + PASO_Y * (claves.length - 1) + ALTO + 33;
  return (
    `<svg viewBox="0 0 680 ${alto}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/** Los rótulos largos de las diez capacidades, en el orden de la matriz. */
export const CAPACIDADES = [
  'Unidad especializada',
  'Norma propia',
  'Presencia en pregrado',
  'Formación estructurada',
  'Herramienta desplegada',
  'Adopción en la enseñanza',
  'Alcance declarado',
  'Investigación',
  'Transferencia',
  'Evaluación de efecto',
];

/**
 * En cuántas instituciones consta cada capacidad en operación.
 *
 * «En operación» son los dos estados que acreditan funcionamiento —con
 * instrumento formal y sin él—; lo incipiente, lo del entorno y lo adyacente
 * no cuentan, porque la pregunta de esta figura es qué está extendido y no
 * qué está anunciado.
 */
export function porCapacidad(matriz = 'v2') {
  const claves = Object.keys(MATRIZ[matriz]).filter(
    (n) => !FUERA_DEL_COMPARADOR.includes(n),
  );
  return CAPACIDADES.map((nombre, c) => ({
    nombre,
    n: claves.filter((k) => ['OPF', 'OP'].includes(MATRIZ[matriz][k][c])).length,
  })).sort((a, b) => b.n - a.n);
}

/**
 * Figura de capacidades leída por filas.
 *
 * La escala se ajusta al valor máximo observado y no al tamaño de la cohorte:
 * la barra llena no dice «todas», dice «la más extendida». La cifra al final
 * de cada barra es la que manda, y por eso va siempre.
 */
export function figuraPorCapacidad(filas, total) {
  const X0 = 150;
  const PISTA = 484;
  const ALTO = 11.5;
  const PASO = 21;
  const Y0 = 18;
  const tope = Math.max(1, ...filas.map((f) => f.n));
  const escala = PISTA / tope;

  const partes = [];
  filas.forEach((f, i) => {
    const y = Y0 + PASO * i;
    const w = f.n * escala;
    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(PISTA)}" height="${n1(ALTO)}"` +
        ` rx="1.4" fill="#eef1f5" opacity="1"/>`,
    );
    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(w)}" height="${n1(ALTO)}"` +
        ` rx="1.4" fill="#0f4c81" opacity="1"/>`,
    );
    partes.push(
      texto(X0 - 6, y + 8.9, f.nombre, {
        size: 8.2,
        fill: '#26313f',
        peso: 500,
        anclaje: 'end',
      }),
    );
    partes.push(
      texto(X0 + w + 5, y + 8.9, String(f.n), {
        size: 8.6,
        fill: '#0d1420',
        peso: 650,
        anclaje: 'start',
      }),
    );
  });

  partes.push(
    texto(X0, Y0 + PASO * filas.length + 8, `de ${total} instituciones`, {
      size: 6.8,
      fill: '#8c98a8',
      peso: 500,
      anclaje: 'start',
    }),
  );

  const alto = Y0 + PASO * filas.length + 22;
  return (
    `<svg viewBox="0 0 680 ${alto}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/**
 * Parte un rótulo en líneas que caben en un ancho dado.
 *
 * Sin esto, la figura de conclusiones escribía ochenta y cinco caracteres a
 * 8,1 pt desde la izquierda y las barras arrancaban en un punto fijo: el
 * rótulo pasaba por debajo de la barra y se leía «La cobertura desigual acota,
 * pero ya no impide, la compar». Un ancho medido en caracteres es una
 * aproximación —la fuente es proporcional— y basta, porque el objetivo no es
 * justificar sino no invadir la columna de al lado.
 */
function partir(s, anchoPx, tamaño) {
  /* 0,52 em por carácter es la media de Inter en minúsculas; se queda corto a
     propósito, que es el lado seguro. */
  const porLínea = Math.max(8, Math.floor(anchoPx / (tamaño * 0.52)));
  const líneas = [];
  let actual = '';
  for (const palabra of s.split(' ')) {
    if (actual && `${actual} ${palabra}`.length > porLínea) {
      líneas.push(actual);
      actual = palabra;
    } else {
      actual = actual ? `${actual} ${palabra}` : palabra;
    }
  }
  if (actual) líneas.push(actual);
  return líneas;
}

/** Varias líneas de texto, centradas verticalmente sobre `y`. */
function textoMulti(x, y, líneas, o = {}) {
  const salto = (o.size ?? 8) * 1.28;
  const arriba = y - ((líneas.length - 1) * salto) / 2;
  return líneas.map((l, i) => texto(x, arriba + salto * i, l, o)).join('');
}

/**
 * Qué le falta a cada capacidad para llegar a tres, y de qué clase es la falta.
 *
 * No es una opinión sobre la institución: es la lectura mecánica de la
 * rúbrica. Un punto que falta desde `OP` es un instrumento que no se publicó;
 * dos que faltan desde `ENT` son una capacidad que existe en la universidad y
 * no en la Facultad; y tres desde `NL` son una capacidad que no consta.
 */
const FALTA = {
  OPF: ['', 'completa'],
  OP: ['instrumento', 'falta el objeto citable que la acredite'],
  ENT: ['nivel', 'existe en la universidad, no en la Facultad'],
  ADY: ['objeto', 'existe algo del ámbito vecino, sin componente de IA'],
  INC: ['ejecución', 'anunciada, sin constancia de ejecución'],
  NL: ['todo', 'no consta'],
};

/**
 * Figura de perfil · una institución, sus diez capacidades y lo que le falta.
 *
 * Se dibuja como escalera de tres peldaños por capacidad porque la pregunta
 * que responde no es «cuánto suma» sino «cuánto le falta y de qué clase es lo
 * que le falta». La suma va al pie, y no encabeza nada: esta figura describe
 * un caso y no una posición.
 */
export function figuraPerfil(clave, matriz = 'v2') {
  const X0 = 168;
  const PASO_X = 26;
  const ANCHO = 23;
  const ALTO = 14;
  const PASO_Y = 21;
  const Y0 = 20;

  const estados = MATRIZ[matriz][clave];
  const orden = CAPACIDADES.map((nombre, c) => ({
    nombre,
    estado: estados[c],
    puntos: MATRIZ.puntos[estados[c]] ?? 0,
  })).sort((a, b) => b.puntos - a.puntos);

  const partes = [];
  orden.forEach((cap, i) => {
    const y = Y0 + PASO_Y * i;
    partes.push(
      texto(X0 - 10, y + 10, cap.nombre, {
        size: 8,
        fill: cap.puntos === 3 ? '#0d1420' : '#26313f',
        peso: cap.puntos === 3 ? 650 : 450,
        anclaje: 'end',
      }),
    );
    for (let p = 0; p < 3; p += 1) {
      const x = X0 + PASO_X * p;
      partes.push(
        p < cap.puntos
          ? `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(ANCHO)}" height="${n1(ALTO)}"` +
            ` rx="1.2" fill="#0f4c81" opacity="1"/>`
          : `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(ANCHO)}" height="${n1(ALTO)}"` +
            ` rx="1.2" fill="#ffffff" stroke="#c3ccd6" stroke-width=".7"` +
            ` stroke-dasharray="2.5 2"/>`,
      );
    }
    partes.push(
      texto(X0 + PASO_X * 3 + 6, y + 10, String(cap.puntos), {
        size: 8.6,
        fill: '#0d1420',
        peso: 650,
        anclaje: 'start',
      }),
    );
    partes.push(
      texto(X0 + PASO_X * 3 + 22, y + 10, FALTA[cap.estado][1], {
        size: 7,
        fill: cap.puntos === 3 ? '#5d6b7d' : '#8c98a8',
        peso: 400,
        anclaje: 'start',
      }),
    );
  });

  const total = orden.reduce((a, c) => a + c.puntos, 0);
  const yPie = Y0 + PASO_Y * orden.length + 6;
  partes.push(
    `<line x1="${n1(X0 - 150)}" y1="${n1(yPie - 6)}" x2="672" y2="${n1(yPie - 6)}"` +
      ` stroke="#eef1f5" stroke-width="0.5"/>`,
  );
  partes.push(
    texto(X0 - 10, yPie + 8, 'Suma de la rúbrica, sin posición', {
      size: 7.4,
      fill: '#5d6b7d',
      peso: 600,
      anclaje: 'end',
    }),
  );
  partes.push(
    texto(X0, yPie + 8, `${total} de 30`, {
      size: 9,
      fill: '#0d1420',
      peso: 650,
      anclaje: 'start',
    }),
  );
  partes.push(
    texto(X0 + 52, yPie + 8, 'ninguna celda sin concluir · esta figura no ordena', {
      size: 7,
      fill: '#8c98a8',
      peso: 400,
      anclaje: 'start',
    }),
  );

  return (
    `<svg viewBox="0 0 680 ${yPie + 20}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/**
 * Figura de cobertura · cuánto se investigó cada institución.
 *
 * La versión anterior de esta figura llevaba dentro una marca de «hasta aquí
 * llegaba la v0.8.0» y una leyenda que la explicaba. Eso obliga al lector a
 * conocer una versión que no tiene delante, y se retira: la figura dice cuánto
 * se recorrió, y la asimetría entre el piloto y el resto se lee sola porque el
 * piloto va marcado.
 */
export function figuraCobertura() {
  const X0 = 258;
  const ANCHO = 380;
  const RUTAS = 13;
  const ALTO = 13;
  const PASO = 26;
  const Y0 = 14;
  const px = (r) => X0 + (r / RUTAS) * ANCHO;

  const filas = Object.entries(COBERTURA).map(([clave, c]) => ({
    nombre: NOMBRES[clave][0],
    ...c,
  }));

  const ejeAbajo = Y0 + PASO * (filas.length - 1) + ALTO + 13;
  const partes = [];

  for (let r = 0; r <= 12; r += 2) {
    partes.push(
      `<line x1="${n1(px(r))}" y1="8.0" x2="${n1(px(r))}" y2="${n1(ejeAbajo)}"` +
        ` stroke="#eef1f5" stroke-width="0.5"/>`,
    );
    partes.push(texto(px(r), ejeAbajo + 12, String(r)));
  }
  partes.push(
    texto(px(6.5), ejeAbajo + 24, 'Rutas del protocolo recorridas, de trece', {
      size: 7.1,
      fill: '#5d6b7d',
      peso: 500,
    }),
  );

  filas.forEach((f, i) => {
    const y = Y0 + PASO * i;
    const base = y + ALTO - 3.2;
    if (f.piloto) {
      partes.push(
        `<rect x="0" y="${n1(y)}" width="3" height="${n1(ALTO)}" rx="1.5"` +
          ` fill="#00a3a3" opacity="1"/>`,
      );
    }
    partes.push(
      texto(X0 - 10, base, f.nombre, {
        size: 8,
        fill: f.piloto ? '#0d1420' : '#26313f',
        peso: f.piloto ? 650 : 450,
        anclaje: 'end',
      }),
    );
    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(ANCHO)}" height="${n1(ALTO)}"` +
        ` rx="1.4" fill="#eef1f5" opacity="1"/>`,
    );
    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(px(f.rutas) - X0)}"` +
        ` height="${n1(ALTO)}" rx="1.4" fill="${f.piloto ? '#0f4c81' : '#1a6fa8'}" opacity="1"/>`,
    );
    partes.push(
      texto(X0 + ANCHO + 9, base, `${f.rutas}/13`, {
        size: 8.4,
        fill: '#0d1420',
        peso: 650,
        anclaje: 'start',
      }),
    );
    partes.push(
      texto(752, base, `${f.fuentes} ${f.fuentes === 1 ? 'fuente' : 'fuentes'}`, {
        size: 7,
        peso: 400,
        anclaje: 'end',
      }),
    );
  });

  return (
    `<svg viewBox="0 0 760 ${ejeAbajo + 32}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/**
 * Las ocho conclusiones, su clase y la confianza que las sostiene.
 *
 * Transcritas de la figura entregada. La C-6 pierde el «ya no impide», que
 * sólo significa algo para quien leyó la versión anterior; dice ahora lo mismo
 * en presente.
 */
export const CONCLUSIONES = [
  ['C-1', 'La institucionalización avanza por denominación, no por constitución', 70, 'hecho'],
  ['C-2', 'Dos Facultades dictaron norma propia; sólo una publica el instrumento', 70, 'hecho'],
  ['C-3', 'La continuidad dejó de ser excepcional, y sigue sin llegar a resultados', 80, 'hecho'],
  ['C-4', 'No hay línea curricular obligatoria documentada en ninguna de las once', 80, 'hecho'],
  /* «y ninguna la ha solicitado» decía más de lo que la fuente permite: la base
     de ANID recoge proyectos ADJUDICADOS, de modo que acredita que ninguno se
     financió y no que ninguno se presentara. Una postulación rechazada no deja
     rastro en ese registro. */
  ['C-5', 'Ninguna iniciativa acredita evaluación de efecto, y ninguna figura entre lo adjudicado', 95, 'hecho'],
  ['C-6', 'La cobertura desigual acota la comparación ordinal, y no la impide', 80, 'inferencia'],
  ['C-7', 'El fenómeno está en tránsito de la actividad a la estructura, sin llegar al resultado', 75, 'inferencia'],
  ['C-8', 'Ninguna institución chilena tiene mandato para verificar lo que las Facultades afirman', 90, 'hecho'],
];

/**
 * Figura de conclusiones · confianza de la afirmación más débil de cada una.
 *
 * El rótulo vivía en una línea sin ancho máximo y la barra empezaba en un
 * punto fijo: los siete rótulos largos pasaban por debajo de las barras. Ahora
 * el texto se parte dentro de su columna y la barra empieza donde termina.
 */
export function figuraConclusiones() {
  const X_TEXTO = 26;
  const ANCHO_TEXTO = 206;
  const X0 = 250;
  const ANCHO = 392;
  const MIN = 50;
  const MAX = 100;
  const ALTO = 11;
  const PASO = 32;
  const Y0 = 11;
  const px = (v) => X0 + ((v - MIN) / (MAX - MIN)) * ANCHO;

  const partes = [];
  CONCLUSIONES.forEach(([código, texto_, confianza, clase], i) => {
    const y = Y0 + PASO * i;
    const medio = y + ALTO / 2 + 2.6;
    partes.push(
      texto(0, medio, código, { size: 8, fill: '#0d1420', peso: 650, anclaje: 'start' }),
    );
    partes.push(
      textoMulti(X_TEXTO, medio, partir(texto_, ANCHO_TEXTO, 8.1), {
        size: 8.1,
        fill: '#26313f',
        peso: 400,
        anclaje: 'start',
      }),
    );
    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(ANCHO)}" height="${n1(ALTO)}"` +
        ` rx="1.4" fill="#eef1f5" opacity="1"/>`,
    );
    partes.push(
      `<rect x="${n1(X0)}" y="${n1(y)}" width="${n1(px(confianza) - X0)}"` +
        ` height="${n1(ALTO)}" rx="1.4"` +
        ` fill="${clase === 'hecho' ? '#0f4c81' : '#c2703a'}" opacity="1"/>`,
    );
    partes.push(
      texto(px(confianza) + 6, medio, String(confianza), {
        size: 8.4,
        fill: '#0d1420',
        peso: 650,
        anclaje: 'start',
      }),
    );
  });

  const ejeAbajo = Y0 + PASO * CONCLUSIONES.length;
  for (const v of [50, 75, 100]) {
    partes.push(texto(px(v), ejeAbajo + 12, String(v)));
  }
  partes.push(
    texto(px(75), ejeAbajo + 22, 'Confianza declarada de la afirmación más débil que la sostiene', {
      size: 7,
      fill: '#5d6b7d',
      peso: 500,
    }),
  );

  return (
    `<svg viewBox="0 0 680 ${ejeAbajo + 30}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/**
 * Iniciativas por año de inicio declarado.
 *
 * Transcrito de la figura entregada: 49 iniciativas fechadas, cuatro sin
 * fecha. La anotación de la banda se apoyaba sobre las cifras de las barras y
 * las tapaba; ahora vive encima del área de trazado, que está vacía.
 */
export const CRONOLOGIA = [
  ['antes de 2020', 2],
  ['2020', 1],
  ['2021', 2],
  ['2022', 0],
  ['2023', 0],
  ['2024', 3],
  ['2025', 23],
  ['2026', 17],
  ['2027', 1],
];

/** Figura de cronología · el campo entero cabe en dos años. */
export function figuraCronologia() {
  const X0 = 14;
  const ANCHO = 652;
  const Y_BASE = 176;
  const ALTO_MAX = 128;
  const n = CRONOLOGIA.length;
  const paso = ANCHO / n;
  const barra = paso * 0.66;
  const tope = Math.max(...CRONOLOGIA.map(([, v]) => v));
  const desde = CRONOLOGIA.findIndex(([a]) => a === '2025');

  const partes = [];

  /* La banda marca los tres años que concentran el campo. Va detrás de las
     barras y su rótulo, arriba del todo, donde no hay ninguna cifra. */
  const xBanda = X0 + paso * desde + (paso - barra) / 2 - 6;
  partes.push(
    `<rect x="${n1(xBanda)}" y="14.0" width="${n1(ANCHO - (paso * desde) - (paso - barra) / 2 + 6)}"` +
      ` height="${n1(Y_BASE - 14)}" rx="2" fill="#eef1f5" opacity="0.75"/>`,
  );
  partes.push(
    texto(xBanda + 8, 24, '41 de las 49 iniciativas fechadas', {
      size: 7.2,
      fill: '#5d6b7d',
      peso: 600,
      anclaje: 'start',
    }),
  );

  CRONOLOGIA.forEach(([año, v], i) => {
    const x = X0 + paso * i + (paso - barra) / 2;
    const h = v === 0 ? 0 : Math.max(3, (v / tope) * ALTO_MAX);
    const y = Y_BASE - h;
    if (v === 0) {
      partes.push(
        `<line x1="${n1(x + barra / 2 - 5)}" y1="${n1(Y_BASE - 3)}"` +
          ` x2="${n1(x + barra / 2 + 5)}" y2="${n1(Y_BASE - 3)}"` +
          ` stroke="#b9c4d1" stroke-width="1.2"/>`,
      );
    } else {
      partes.push(
        `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(barra)}" height="${n1(h)}"` +
          ` rx="1.4" fill="${i >= desde ? '#0f4c81' : '#1a6fa8'}" opacity="1"/>`,
      );
    }
    partes.push(
      texto(x + barra / 2, (v === 0 ? Y_BASE - 3 : y) - 5, v === 0 ? '—' : String(v), {
        size: 8.6,
        fill: v === 0 ? '#8c98a8' : '#0d1420',
        peso: 650,
      }),
    );
    partes.push(
      texto(x + barra / 2, Y_BASE + 13, año, {
        size: 7.2,
        fill: i >= desde ? '#26313f' : '#8c98a8',
        peso: i >= desde ? 600 : 400,
      }),
    );
  });

  partes.push(
    `<line x1="${n1(X0)}" y1="${n1(Y_BASE)}" x2="${n1(X0 + ANCHO)}" y2="${n1(Y_BASE)}"` +
      ` stroke="#c3ccd6" stroke-width="0.6"/>`,
  );

  return (
    `<svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" style="max-width:100%">${partes.join('')}</svg>`
  );
}

/* `import.meta.url` llega como `file:///C:/…` y `argv[1]` como `C:\…`: comparar
   las dos cadenas nunca da verdadero en Windows. Se comparan las rutas. */
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const filas = comparador('v2');
  const salida = path.join(aquí, 'figuras');
  fs.mkdirSync(salida, { recursive: true });
  fs.writeFileSync(path.join(salida, 'comparador.svg'), figuraComparador(filas));
  fs.writeFileSync(path.join(salida, 'comprobacion.svg'), figuraComprobacion(filas));
  fs.writeFileSync(path.join(salida, 'capacidades.svg'), figuraCapacidades('v2'));
  fs.writeFileSync(
    path.join(salida, 'por-capacidad.svg'),
    figuraPorCapacidad(porCapacidad('v2'), filas.length),
  );
  fs.writeFileSync(path.join(salida, 'cobertura.svg'), figuraCobertura());
  fs.writeFileSync(path.join(salida, 'conclusiones.svg'), figuraConclusiones());
  fs.writeFileSync(path.join(salida, 'cronologia.svg'), figuraCronologia());
  fs.writeFileSync(
    path.join(salida, 'perfil-apartada.svg'),
    figuraPerfil(FUERA_DEL_COMPARADOR[0]),
  );

  const pisos = filas.map((f) => f.piso);
  const promedio = pisos.reduce((a, b) => a + b, 0) / pisos.length;
  console.log(`✓ ${filas.length} instituciones en el comparador`);
  for (const f of filas) {
    console.log(
      `  ${String(f.piso).padStart(2)}–${String(f.techo).padStart(2)}  nc=${f.nc}  ` +
        `${lectura(f.nc).padEnd(14)} ${f.nombre}`,
    );
  }
  console.log(`  techo real ${Math.max(...pisos)}/30 · promedio de pisos ${promedio.toFixed(1)}`);
  const nc = filas.reduce((a, f) => a + f.nc, 0);
  console.log(`  celdas sin concluir ${nc} de ${filas.length * 10}`);
  console.log('  en operación, por capacidad:');
  for (const c of porCapacidad('v2')) {
    console.log(`    ${String(c.n).padStart(2)}/${filas.length}  ${c.nombre}`);
  }
  const ap = apartada('v2');
  console.log(`  apartada: ${ap.nombre} ${ap.piso}–${ap.techo} nc=${ap.nc}`);
}
