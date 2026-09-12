/**
 * Downsizes source images in src/ ahead of the Astro build.
 *
 * Astro generates optimized WebP variants at build time, but it also emits the
 * ORIGINAL file into dist/_astro — so a 12 MB source PNG still costs 12 MB on
 * the deploy. This script fixes the sources themselves.
 *
 * Photographs are re-encoded as JPEG (a 12 MB PNG of a cutting board is a photo
 * stored in a lossless format built for line art). Screenshots, CAD drawings,
 * and renders keep their PNG encoding but still get resized.
 *
 * The untouched originals live in images/ at the repo root. This script never
 * reads or writes that directory, so re-running it is always safe.
 *
 * Usage: node scripts/optimize-images.mjs [--dry]
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import sharp from 'sharp';

const ROOTS = ['src/assets/images', 'src/content/projects'];
const MAX_EDGE = 2400;
const JPEG_QUALITY = 82;
const DRY = process.argv.includes('--dry');

/** Files that are line art / UI / CAD drawings rather than photographs. */
const KEEP_AS_PNG = new Set(['hole-drawing.png', 'support-structure.png']);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const isImage = (f) => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase());
const kb = (n) => Math.round(n / 1024);

let beforeTotal = 0;
let afterTotal = 0;
let converted = 0;

for (const root of ROOTS) {
  for await (const file of walk(root)) {
    if (!isImage(file)) continue;

    const before = (await stat(file)).size;
    beforeTotal += before;

    const name = basename(file);
    const ext = extname(file).toLowerCase();
    const toJpeg = ext === '.png' && !KEEP_AS_PNG.has(name);
    const outPath = toJpeg ? join(dirname(file), basename(file, ext) + '.jpg') : file;
    const tmp = outPath + '.tmp';

    const pipeline = sharp(file).rotate().resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (toJpeg || ext === '.jpg' || ext === '.jpeg') {
      pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else {
      pipeline.png({ compressionLevel: 9, palette: true });
    }

    if (DRY) {
      const buf = await pipeline.toBuffer();
      afterTotal += buf.length;
      console.log(`${file}: ${kb(before)}kB -> ${kb(buf.length)}kB${toJpeg ? ' (png->jpg)' : ''}`);
      continue;
    }

    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;

    // Never let "optimization" make a file bigger.
    if (after >= before && !toJpeg) {
      await unlink(tmp);
      afterTotal += before;
      continue;
    }

    await rename(tmp, outPath);
    if (toJpeg) {
      await unlink(file);
      converted++;
    }
    afterTotal += after;
    console.log(`${file}: ${kb(before)}kB -> ${kb(after)}kB${toJpeg ? ' (png->jpg)' : ''}`);
  }
}

console.log(
  `\n${DRY ? '[dry run] ' : ''}total: ${kb(beforeTotal)}kB -> ${kb(afterTotal)}kB ` +
    `(${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller)` +
    (converted ? `, ${converted} PNG${converted === 1 ? '' : 's'} converted to JPEG` : '')
);

if (converted && !DRY) {
  console.log('\nPNG->JPEG renames happened. Update .md references with:');
  console.log("  grep -rn '\\.png' src/content/projects");
}
