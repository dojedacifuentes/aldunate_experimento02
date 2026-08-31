/**
 * build.mjs — compone la versión de un solo archivo.
 *
 *   npx tsx scripts/standalone/dump.mts   # vuelca el guion a .tmp/data.json
 *   node scripts/standalone/build.mjs     # escribe dist/audaces.html
 *
 * El resultado no hace una sola petición de red: Phaser, el guion y todo el
 * arte viajan dentro del archivo. Es lo que permite publicarlo como una página
 * suelta sin depender de nada.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const leer = (p) => readFileSync(join(RAIZ, p), 'utf8');
const dataURI = (p) => `data:image/png;base64,${readFileSync(join(RAIZ, p)).toString('base64')}`;

const datos = JSON.parse(leer('.tmp/data.json'));

/**
 * `--fragmento` omite el esqueleto del documento.
 *
 * Para abrir con doble clic hace falta un documento completo. Para publicarlo
 * como página en una plataforma que ya envuelve el contenido, el esqueleto
 * sobra y duplicarlo produce HTML inválido. Un archivo, dos envolturas.
 */
const fragmento = process.argv.includes('--fragmento');

const cabeza = fragmento
  ? ''
  : `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
`;
const abreCuerpo = fragmento ? '' : '</head>\n<body>\n';
const cierraCuerpo = fragmento ? '' : '\n</body>\n</html>';

/** Dónde vive el arte de cada personaje. Espeja `asset-paths.mjs`. */
const UBICACION = {
  player_tomas: ['player', 'tomas'],
  player_renata: ['player', 'renata'],
  director_sofia: ['director', 'sofia'],
  rival_ignacio: ['rival', 'ignacio'],
  counterparty_hector: ['counterparty', 'hector'],
  judge_achurra: ['court', 'achurra'],
  prosecutor_naveas: ['court', 'naveas'],
  witness_zapata: ['court', 'zapata'],
  eva: ['eva', 'eva'],
};

/** En escena. Necesitan hoja de sprites. */
const EN_ESCENA = [
  'judge_achurra',
  'prosecutor_naveas',
  'witness_zapata',
  'player_tomas',
  'player_renata',
  'director_sofia',
  'rival_ignacio',
  'counterparty_hector',
];

/** Hablan o se eligen. Necesitan retratos. */
const CON_RETRATO = [
  'judge_achurra',
  'prosecutor_naveas',
  'witness_zapata',
  'director_sofia',
  'rival_ignacio',
  'eva',
  'player_tomas',
  'player_renata',
];

const sprites = {};
for (const id of EN_ESCENA) {
  const [grupo, slug] = UBICACION[id];
  sprites[id] = dataURI(`public/rpg/characters/${grupo}/sprites/${slug}.png`);
}

const portraits = {};
for (const id of CON_RETRATO) {
  const [grupo, slug] = UBICACION[id];
  for (const mood of datos.personajes[id].expressions) {
    portraits[`${id}-${mood}`] = dataURI(`public/rpg/characters/${grupo}/portraits/${slug}-${mood}.png`);
  }
}

/**
 * Documento completo, no un fragmento.
 *
 * Este archivo se abre con doble clic desde el disco: necesita su propio
 * doctype, idioma, codificación y viewport. Sin ellos el navegador entra en modo
 * de compatibilidad, los acentos pueden romperse y los cortes responsivos no se
 * aplican en un teléfono.
 *
 * Tampoco pide tipografías por red: usa las del sistema. «Funciona sin
 * internet» sólo es cierto si no queda ninguna petición externa.
 */
const html = `${cabeza}<title>La Ley de los Audaces</title>
<style>
${leer('scripts/standalone/estilos.css')}
</style>
${abreCuerpo}
<div id="app"><div id="pantalla"></div></div>
<p id="franja" class="mono">Prototipo · alpha 0.1 — ficción. No es asesoría jurídica ni un sitio institucional.</p>

<script>${leer('node_modules/phaser/dist/phaser.min.js')}</script>
<script>
window.__AUDACES__ = ${JSON.stringify(datos)};
window.__ART__ = ${JSON.stringify({ sprites, portraits })};
</script>
<script>
${leer('scripts/standalone/juego.js')}
</script>${cierraCuerpo}
`;

mkdirSync(join(RAIZ, 'dist'), { recursive: true });
const destino = fragmento ? 'dist/audaces-pagina.html' : 'dist/audaces.html';
writeFileSync(join(RAIZ, destino), html, 'utf8');

const mb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log(`[standalone] ${destino} · ${mb} MB · ${Object.keys(portraits).length} retratos · ${Object.keys(sprites).length} hojas`);
