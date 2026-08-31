/**
 * Optimisation des images du dossier src/assets.
 *
 * Redimensionne + recompresse EN PLACE, en gardant le même nom et le même
 * format : aucun import à modifier dans le code.
 *
 * Les originaux sont versionnés dans git : `git checkout -- src/assets`
 * permet de tout restaurer.
 *
 *   node scripts/optimize-images.mjs           # applique
 *   node scripts/optimize-images.mjs --dry-run # simule et affiche le gain
 */

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dirname, '../src/assets');
const DRY_RUN = process.argv.includes('--dry-run');

// Largeur max par dossier, selon la taille réelle d'affichage (x2 pour les
// écrans retina). Tout ce qui n'est pas listé retombe sur DEFAULT.
const RULES = [
  { match: /logo\.png$/i, maxWidth: 600 },
  { match: /[\\/]logo-partener[\\/]/i, maxWidth: 480 },
  { match: /[\\/]icone[\\/]/i, maxWidth: 320 },
  // Avatars ronds (192 px max) + photo de la modale (~480 px de haut).
  { match: /[\\/]team[\\/]/i, maxWidth: 640 },
  { match: /[\\/]gallery hero[\\/]/i, maxWidth: 1920 },
  { match: /[\\/]gallery[\\/]last image[\\/]/i, maxWidth: 1800 },
  { match: /[\\/]gallery-cabinet[\\/]/i, maxWidth: 1600 },
  { match: /[\\/]gallery[\\/]/i, maxWidth: 1600 },
];
const DEFAULT_MAX_WIDTH = 1600;

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function maxWidthFor(file) {
  const rule = RULES.find((r) => r.match.test(file));
  return rule ? rule.maxWidth : DEFAULT_MAX_WIDTH;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function encode(input, ext, maxWidth) {
  const pipeline = sharp(input, { failOn: 'none' }).rotate();
  const meta = await pipeline.metadata();

  // On ne fait jamais grossir une image.
  const resized =
    meta.width && meta.width > maxWidth
      ? pipeline.resize({ width: maxWidth, withoutEnlargement: true })
      : pipeline;

  if (ext === '.png') {
    // Palette (quantification) : très efficace sur les logos et les
    // détourages, tout en conservant la transparence.
    return resized.png({ compressionLevel: 9, palette: true, quality: 82, effort: 8 }).toBuffer();
  }
  if (ext === '.webp') {
    return resized.webp({ quality: 78, effort: 5 }).toBuffer();
  }
  return resized.jpeg({ quality: 74, mozjpeg: true, progressive: true }).toBuffer();
}

const kb = (n) => `${(n / 1024).toFixed(0)} Ko`;

async function main() {
  let before = 0;
  let after = 0;
  let touched = 0;
  const rows = [];

  for await (const file of walk(ASSETS)) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTENSIONS.has(ext)) continue;

    const { size } = await stat(file);
    const input = await readFile(file);

    let output;
    try {
      output = await encode(input, ext, maxWidthFor(file));
    } catch (err) {
      console.warn(`⚠️  ignoré ${path.relative(ASSETS, file)} : ${err.message}`);
      before += size;
      after += size;
      continue;
    }

    before += size;

    // On ne réécrit que si le gain est réel (>3 %), pour éviter de dégrader
    // une image déjà optimisée.
    if (output.length < size * 0.97) {
      if (!DRY_RUN) await writeFile(file, output);
      after += output.length;
      touched += 1;
      rows.push([path.relative(ASSETS, file), size, output.length]);
    } else {
      after += size;
    }
  }

  rows.sort((a, b) => b[1] - b[2] - (a[1] - a[2]));
  for (const [name, from, to] of rows.slice(0, 15)) {
    console.log(`  ${name.padEnd(46)} ${kb(from).padStart(9)} → ${kb(to).padStart(9)}`);
  }

  console.log(
    `\n${DRY_RUN ? '[dry-run] ' : ''}${touched} image(s) optimisée(s) : ` +
      `${(before / 1048576).toFixed(1)} Mo → ${(after / 1048576).toFixed(1)} Mo ` +
      `(-${Math.round((1 - after / before) * 100)} %)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
