/**
 * bake.mjs — hornea el arte procedural a PNG.
 *
 *   node scripts/rpg-art/bake.mjs            # sólo lo que falta
 *   node scripts/rpg-art/bake.mjs --all      # todo, otra vez
 *   node scripts/rpg-art/bake.mjs judge_achurra prosecutor_naveas
 *
 * El motor de dibujo (`src/lib/rpg/art/`) está en `.mjs` justamente para correr
 * aquí sin compilador. Este script no dibuja nada: pide lienzos y los escribe
 * donde `asset-paths.mjs` dice, que es el mismo sitio donde el registro de
 * personajes los va a buscar.
 *
 * Al terminar regenera `manifest.json` recorriendo el directorio: el manifiesto
 * declara lo que existe de verdad, no lo que este script creyó escribir.
 */

import { mkdirSync, existsSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { encodePNG } from './png.mjs';
import {
  ASSET_IDS,
  ASSET_LOCATION,
  spritePath,
  portraitPath,
  animationPath,
  evaStripPath,
} from '../../src/lib/rpg/art/asset-paths.mjs';
import {
  spriteSheetFor,
  portraitFor,
  evaIdleStrip,
  evaAppearStrip,
  MOODS,
  SHEET_LAYOUT,
} from '../../src/lib/rpg/art/character-art.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PUBLICO = join(RAIZ, 'public');

const argv = process.argv.slice(2);
const forzarTodo = argv.includes('--all');
const idsPedidos = argv.filter((a) => !a.startsWith('--'));

const rutaLocal = (rutaPublica) => join(PUBLICO, rutaPublica.replace(/^\//, ''));

function escribir(rutaPublica, buffer) {
  const destino = rutaLocal(rutaPublica);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, buffer);
  return destino;
}

function escribirLienzo(rutaPublica, lienzo) {
  return escribir(rutaPublica, encodePNG(lienzo.width, lienzo.height, lienzo.toRGBA()));
}

/** Clips estándar. Espeja `standardAnimations()` de data/rpg/characters.ts. */
function clipsEstandar() {
  const idle = (row) => ({ row, frames: [4, 5], fps: 2, loop: true });
  const walk = (row) => ({ row, frames: [0, 1, 2, 3], fps: 8, loop: true });
  return {
    idle_down: idle(0),
    idle_up: idle(1),
    idle_left: idle(2),
    idle_right: idle(3),
    walk_down: walk(0),
    walk_up: walk(1),
    walk_left: walk(2),
    walk_right: walk(3),
    talk: { row: 4, frames: [0, 1, 2, 3], fps: 6, loop: true },
    thinking: { row: 5, frames: [0, 1, 2, 3], fps: 3, loop: true },
  };
}

function moodsDe(id) {
  const base = MOODS.filter((m) => m !== 'eva_glitch');
  if (id === 'eva') return [...base, 'eva_glitch'];
  return base;
}

function yaHorneado(id) {
  return existsSync(rutaLocal(spritePath(id)));
}

const objetivo = idsPedidos.length
  ? idsPedidos
  : ASSET_IDS.filter((id) => forzarTodo || !yaHorneado(id));

if (objetivo.length === 0) {
  console.log('[bake] nada que hornear. Usa --all para rehacer todo.');
} else {
  console.log(`[bake] horneando ${objetivo.length}: ${objetivo.join(', ')}`);
}

for (const id of objetivo) {
  if (!ASSET_LOCATION[id]) {
    console.error(`[bake] sin ubicación declarada para "${id}" — revisa asset-paths.mjs`);
    process.exitCode = 1;
    continue;
  }

  escribirLienzo(spritePath(id), spriteSheetFor(id));
  for (const mood of moodsDe(id)) {
    escribirLienzo(portraitPath(id, mood), portraitFor(id, mood));
  }
  escribir(
    animationPath(id),
    Buffer.from(
      `${JSON.stringify(
        {
          id,
          sheet: { cell: SHEET_LAYOUT.cell, columns: SHEET_LAYOUT.columns, rows: SHEET_LAYOUT.rows },
          clips: clipsEstandar(),
        },
        null,
        2,
      )}\n`,
      'utf8',
    ),
  );

  if (id === 'eva') {
    escribirLienzo(evaStripPath('idle'), evaIdleStrip());
    escribirLienzo(evaStripPath('appear'), evaAppearStrip());
  }
}

/* ── Manifiesto ─────────────────────────────────────────────────────────── */

const baseCharacters = join(PUBLICO, 'rpg', 'characters');

function recorrer(dir) {
  const salida = [];
  for (const entrada of readdirSync(dir)) {
    if (entrada.startsWith('.')) continue;
    const completa = join(dir, entrada);
    if (statSync(completa).isDirectory()) salida.push(...recorrer(completa));
    else if (entrada !== 'manifest.json' && !entrada.endsWith('.md')) salida.push(completa);
  }
  return salida;
}

const archivos = recorrer(baseCharacters)
  .map((p) => `/rpg/characters/${relative(baseCharacters, p).split(sep).join('/')}`)
  .sort();

writeFileSync(
  join(baseCharacters, 'manifest.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), files: archivos }, null, 2)}\n`,
  'utf8',
);

console.log(`[bake] manifiesto actualizado: ${archivos.length} archivos.`);
