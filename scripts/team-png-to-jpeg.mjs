/**
 * Les portraits de src/assets/team sont des PNG dont le canal alpha est
 * entièrement opaque : le PNG coûte 4 à 5 fois plus cher qu'un JPEG pour un
 * rendu strictement identique (les avatars sont détourés en rond par CSS).
 *
 * Ce script convertit uniquement les PNG 100 % opaques en JPEG, supprime le
 * PNG d'origine et met à jour les imports de TeamSection.tsx.
 *
 *   node scripts/team-png-to-jpeg.mjs
 *
 * Pour revenir en arrière : `git checkout -- src/assets/team src/app/components/TeamSection.tsx`
 */

import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEAM_DIR = path.resolve(__dirname, '../src/assets/team');
const COMPONENT = path.resolve(__dirname, '../src/app/components/TeamSection.tsx');
const MAX_WIDTH = 640;

const kb = (n) => `${(n / 1024).toFixed(0)} Ko`;

async function main() {
  const files = (await readdir(TEAM_DIR)).filter((f) => f.toLowerCase().endsWith('.png'));
  const converted = [];

  for (const file of files) {
    const full = path.join(TEAM_DIR, file);
    const input = await readFile(full);
    const stats = await sharp(input).stats();

    if (!stats.isOpaque) {
      console.log(`  ${file} : transparence utilisée, conservé en PNG`);
      continue;
    }

    const output = await sharp(input)
      .rotate()
      .flatten({ background: '#ffffff' })
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toBuffer();

    const target = file.replace(/\.png$/i, '.jpg');
    await writeFile(path.join(TEAM_DIR, target), output);
    await unlink(full);
    converted.push([file, target]);
    console.log(`  ${file.padEnd(20)} ${kb(input.length).padStart(9)} → ${target} ${kb(output.length)}`);
  }

  if (!converted.length) return;

  let source = await readFile(COMPONENT, 'utf8');
  for (const [from, to] of converted) {
    source = source.split(`team/${from}`).join(`team/${to}`);
  }
  await writeFile(COMPONENT, source);

  console.log(`\n${converted.length} portrait(s) converti(s), imports de TeamSection.tsx mis à jour.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
