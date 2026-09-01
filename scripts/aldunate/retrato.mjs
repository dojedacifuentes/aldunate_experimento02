/**
 * Prepara los derivados del retrato editorial.
 *
 * Entra un PNG de 1122×1402 (2,2 MB) y salen tres archivos: el retrato en WebP
 * para el hero, la composición 1200×630 para Open Graph y un `blurDataURL`
 * minúsculo que evita el salto de layout mientras carga.
 *
 * El recorte no es arbitrario. La corbata del retrato lleva un escudo
 * heráldico ornamental bordado; no es el escudo de la PUCV, pero la regla dura
 * institucional del repositorio se cumple mirando el píxel y no el nombre del
 * componente (CLAUDE.md §3, y la lección de `eva-pucv-courtyard.png`). El
 * encuadre termina en 1210 px, sobre el nudo, de modo que el emblema queda
 * fuera del archivo publicado y no solo fuera de la vista.
 *
 *   node scripts/aldunate/retrato.mjs <origen.png>
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const source = process.argv[2];
if (!source) {
  console.error('Uso: node scripts/aldunate/retrato.mjs <origen.png>');
  process.exit(1);
}

const outDir = path.join(process.cwd(), 'public', 'aldunate');
await mkdir(outDir, { recursive: true });

/** Cabeza y hombros. Deja fuera el emblema de la corbata. Ver cabecera. */
const CROP = { left: 60, top: 30, width: 1000, height: 1180 };

const portrait = sharp(source).extract(CROP);

await portrait
  .clone()
  .webp({ quality: 84, effort: 6 })
  .toFile(path.join(outDir, 'retrato-editorial.webp'));

// Respaldo para navegadores sin WebP y para el `content` de Open Graph.
await portrait
  .clone()
  .resize({ width: 800 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(outDir, 'retrato-editorial.jpg'));

/* ── Composición Open Graph 1200×630 ── */

const OG = { width: 1200, height: 630 };

const portraitTile = await portrait
  .clone()
  .resize({ width: 470, height: OG.height, fit: 'cover', position: 'top' })
  .toBuffer();

const backdrop = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1220"/>
      <stop offset="100%" stop-color="#111C2E"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0A1220" stop-opacity="1"/>
      <stop offset="100%" stop-color="#0A1220" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${OG.width}" height="${OG.height}" fill="url(#bg)"/>
  <g stroke="#3E6E9E" stroke-opacity="0.28" stroke-width="1">
    <line x1="72" y1="196" x2="300" y2="140"/>
    <line x1="300" y1="140" x2="470" y2="250"/>
    <line x1="72" y1="196" x2="210" y2="330"/>
    <line x1="210" y1="330" x2="470" y2="250"/>
  </g>
  <g fill="#5FA8D8" fill-opacity="0.7">
    <circle cx="72" cy="196" r="4"/><circle cx="300" cy="140" r="3"/>
    <circle cx="210" cy="330" r="3"/><circle cx="470" cy="250" r="4"/>
  </g>
</svg>`);

const foreground = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
  <rect x="730" y="0" width="120" height="${OG.height}" fill="url(#fade)" transform="scale(-1,1) translate(-1700,0)"/>
  <text x="72" y="404" font-family="Georgia, 'Times New Roman', serif" font-size="62" fill="#F2F6FB">Eduardo Aldunate</text>
  <text x="74" y="452" font-family="Consolas, monospace" font-size="21" letter-spacing="3" fill="#7FC0E8">DERECHO CONSTITUCIONAL</text>
  <text x="74" y="512" font-family="Segoe UI, Helvetica, sans-serif" font-size="23" fill="#93A6BD">Catálogo académico con sus fuentes</text>
  <text x="74" y="566" font-family="Consolas, monospace" font-size="16" letter-spacing="2" fill="#6B7F96">PROTOTIPO ACADÉMICO — NO OFICIAL PUCV</text>
</svg>`);

await sharp(backdrop)
  .composite([
    { input: portraitTile, left: OG.width - 470, top: 0 },
    { input: foreground, left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(outDir, 'og-aldunate.jpg'));

/* ── Placeholder para evitar CLS ── */

const blur = await portrait.clone().resize({ width: 12 }).webp({ quality: 28 }).toBuffer();
const blurDataURL = `data:image/webp;base64,${blur.toString('base64')}`;

await writeFile(
  path.join(process.cwd(), 'src', 'data', 'aldunate', 'portrait.ts'),
  `/**
 * Metadatos del retrato. Generado por \`scripts/aldunate/retrato.mjs\`.
 * No editar a mano: se regenera junto con la imagen.
 */
export const portrait = {
  src: '/aldunate/retrato-editorial.webp',
  fallback: '/aldunate/retrato-editorial.jpg',
  og: '/aldunate/og-aldunate.jpg',
  width: ${CROP.width},
  height: ${CROP.height},
  /**
   * El retrato es una recreación editorial a partir de fotografías, no una
   * fotografía documental. La página lo declara junto a la imagen.
   */
  alt: 'Retrato editorial digital de Eduardo Aldunate Lizana',
  credit: 'Retrato editorial digital · recreación a partir de fotografías',
  blurDataURL:
    '${blurDataURL}',
} as const;
`,
  'utf8',
);

console.log('retrato-editorial.webp, .jpg, og-aldunate.jpg y portrait.ts generados');
