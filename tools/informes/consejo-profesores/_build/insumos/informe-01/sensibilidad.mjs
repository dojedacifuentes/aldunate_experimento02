/**
 * Análisis de sensibilidad del comparador ordinal.
 *
 * **Qué pregunta.** Cuánto de lo que el informe publica depende de evidencia
 * que todavía no ha pasado el contraste sustantivo. La respuesta no es una
 * opinión: se recalcula el orden entero bajo escenarios declarados y se mira
 * qué se mueve.
 *
 * **Por qué se amplió.** La primera versión cubría dos escenarios —las dos
 * fuentes que el propio informe declara que no pudo abrir— y ésos eran los
 * casos visibles, no los únicos. La auditoría de la fase 1
 * (`docs/informes/10-auditoria-sustantiva.md`) contó **trece de los veintiséis
 * cierres** apoyados en fuentes de la Ronda 2 sin contrastar, con veinticinco
 * puntos encima. Un análisis que sólo mira dos deja once fuera y da una falsa
 * sensación de acotamiento.
 *
 * **Y por qué se corrigió.** La versión anterior metía a la institución
 * apartada en el orden y publicaba su posición —«PUCV queda #2»—, que es
 * exactamente lo que D-037 existe para impedir. Aquí su perfil se calcula y se
 * imprime aparte, sin número de posición, en todos los escenarios.
 *
 * Uso: `node tools/informes/informe-01/comparador/sensibilidad.mjs`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* La ruta se resuelve desde el propio archivo y no desde el directorio de
   trabajo: si no, el guion sólo corre estando dentro de su carpeta, que es
   justo lo que nadie recuerda al volver meses después. */
const aquí = path.dirname(fileURLToPath(import.meta.url));
const D = JSON.parse(fs.readFileSync(path.join(aquí, 'matriz-v2.json'), 'utf8'));

const P = { OPF: 3, OP: 2, INC: 1, ENT: 1, ADY: 1, NL: 0, NC: null };
const calc = (m) =>
  Object.fromEntries(
    Object.entries(m).map(([k, f]) => {
      let piso = 0;
      let nc = 0;
      for (const c of f) {
        if (c === 'NC') nc++;
        else piso += P[c];
      }
      return [k, { piso, techo: piso + nc * 2, nc }];
    }),
  );
const orden = (r) =>
  Object.entries(r).sort(
    (a, b) => b[1].piso - a[1].piso || b[1].techo - a[1].techo || a[0].localeCompare(b[0]),
  );
const clonar = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, [...v]]));
const i = (n) => D.caps.indexOf(n);

/* La institución apartada (D-037) no ocupa posición: se calcula su perfil pero
   no entra en el orden, ni antes ni después de mover nada. */
const APARTADA = 'P. U. Católica de Valparaíso';
const sinApartada = (o) => o.filter(([n]) => n !== APARTADA);

/* Las diez referencias que la ronda repetía y que ya constaban en el corpus:
   ésas sí están contrastadas y no se ponen en duda aquí. */
const YA_EN_CORPUS = new Set([
  'R2-UC-02', 'R2-UNAB-02', 'R2-UAUT-05', 'R2-UAUT-06', 'R2-UCEN-02',
  'R2-UCH-01', 'R2-UDEC-01', 'R2-UDP-01', 'R2-UDP-02', 'R2-PUCV-03',
]);

const fuentesDe = (a) =>
  a[4] === '—' ? [] : a[4].split(';').map((s) => s.trim()).filter(Boolean);

/* Los cierres expuestos: los que dependen de al menos una fuente de la ronda
   que no pasó el contraste. Un cierre sin fuente es una ruta del protocolo
   recorrida sin hallar nada, y eso no es evidencia sin verificar: es una
   ausencia comprobada. No entra. */
const expuestos = D.aplicados.filter((a) => {
  const f = fuentesDe(a);
  return f.length > 0 && f.some((x) => !YA_EN_CORPUS.has(x));
});

const aNC = (m, cierres) => {
  const c = clonar(m);
  for (const a of cierres) c[a[0]][i(a[1])] = 'NC';
  return c;
};
const porFuente = (id) => expuestos.filter((a) => fuentesDe(a).includes(id));

/* ── Escenarios ──────────────────────────────────────────────────────────
   Los dos primeros son las fuentes que el informe declara irrecuperables. El
   tercero y el cuarto añaden las dos que la comprobación de resolubilidad
   encontró rotas y el documento no declara. El último es la cota superior. */
const rotas = {
  'R2-UCEN-01': 'Resolución 13/2025, U. Central · HTTP 404, declarada en el informe',
  'R2-UAUT-02': 'Resolución 118/2020, U. Autónoma · PDF escaneado, declarada en el informe',
  'R2-UC-01': 'Seminario IA y Derecho, PUC de Chile · HTTP 404, NO declarada',
  'R2-UDD-02': 'Curso Herramientas de IA, U. del Desarrollo · HTTP 404, NO declarada',
};

const acumulado = [];
const escenarios = [['BASE · la Ronda 2 aceptada tal cual', D.v2]];
for (const [id, glosa] of Object.entries(rotas)) {
  acumulado.push(...porFuente(id));
  escenarios.push(['Si cae ' + glosa, aNC(D.v2, [...acumulado])]);
}
escenarios.push(['COTA SUPERIOR · si ninguna de las 22 se sostuviera', aNC(D.v2, expuestos)]);

const base = calc(D.v2);
const posBase = new Map(sinApartada(orden(base)).map(([k], n) => [k, n + 1]));

console.log('Cierres de la Ronda 2: ' + D.aplicados.length);
console.log('  apoyados en fuente sin contrastar: ' + expuestos.length);
console.log('  puntos en juego: ' + expuestos.reduce((s, a) => s + (P[a[3]] ?? 0), 0));
console.log(
  '  de ellos, con instrumento formal (OPF, 3 p): ' +
    expuestos.filter((a) => a[3] === 'OPF').map((a) => a[0] + ' / ' + a[1]).join(' · '),
);

for (const [nombre, m] of escenarios) {
  const r = calc(m);
  const o = sinApartada(orden(r));
  const v = o.map(([, x]) => x);
  console.log('\n■ ' + nombre);
  o.forEach(([inst, x], k) => {
    const mueve =
      posBase.get(inst) !== k + 1 ? '   se mueve ' + posBase.get(inst) + ' → ' + (k + 1) : '';
    console.log(
      '   ' + String(k + 1).padStart(2) + '. ' + inst.padEnd(30) +
        (x.piso + '–' + x.techo).padEnd(7) + (x.nc ? '(' + x.nc + ' s/c)' : '       ') + mueve,
    );
  });
  console.log(
    '      techo ' + Math.max(...v.map((x) => x.techo)) +
      ' · promedio de pisos ' + (v.reduce((s, x) => s + x.piso, 0) / v.length).toFixed(1) +
      ' · celdas sin concluir ' + v.reduce((s, x) => s + x.nc, 0) +
      ' · posiciones movidas ' + o.filter(([inst], k) => posBase.get(inst) !== k + 1).length,
  );
  const ap = r[APARTADA];
  console.log('      apartada, fuera del orden y sin posición: ' + ap.piso + '–' + ap.techo);
}

console.log(
  '\nLectura. Lo que depende de las fuentes sin contrastar no es tanto quién va primero\n' +
    'como la RESOLUCIÓN del orden: cuantos más cierres caen, más bandas se ensanchan y\n' +
    'más pares dejan de poder distinguirse. La cota superior no es un pronóstico —es\n' +
    'imposible que las veintidós caigan a la vez— sino el límite de lo que este\n' +
    'comparador puede afirmar hoy.',
);
