/**
 * Removes build assets nothing references.
 *
 * Astro emits the ORIGINAL of every image imported from src/ into dist/_astro,
 * in addition to optimized variants. Keep originals used by image lightboxes
 * and remove only assets nothing references.
 *
 * This walks every emitted .html and .css file, collects the asset filenames
 * they mention, and deletes the rest. Conservative by design: it matches on
 * bare filename, so an asset referenced from anywhere at all is kept.
 *
 * Runs automatically as part of `npm run build`.
 */
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const DIST = 'dist';
const ASSET_DIR = join(DIST, '_astro');
// Never prune these, even if unreferenced by markup.
const ALWAYS_KEEP = new Set(['.css', '.js']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// Collect every filename mentioned by any HTML or CSS in the build.
const referenced = new Set();
for await (const file of walk(DIST)) {
  const ext = extname(file).toLowerCase();
  if (ext !== '.html' && ext !== '.css') continue;
  const text = await readFile(file, 'utf8');
  // Original-image URLs in quoted attributes can contain literal spaces.
  for (const m of text.matchAll(/["']\/_astro\/([^"'<>?#]+)["']/gi)) {
    referenced.add(basename(decodeURIComponent(m[1])));
  }
  // Optimized image URLs encode spaces. Decode the full asset URL before
  // comparing it with the name on disk.
  for (const m of text.matchAll(/\/_astro\/([^\s"'<>?#)]+)/gi)) {
    try {
      referenced.add(basename(decodeURIComponent(m[1])));
    } catch {
      referenced.add(basename(m[1]));
    }
  }
  for (const m of text.matchAll(/[\w.-]+\.(?:webp|jpe?g|png|avif|gif|svg|css|js)/gi)) {
    referenced.add(m[0]);
  }
}

let removed = 0;
let freed = 0;
let kept = 0;

for await (const file of walk(ASSET_DIR)) {
  const name = basename(file);
  if (ALWAYS_KEEP.has(extname(file).toLowerCase()) || referenced.has(name)) {
    kept++;
    continue;
  }
  freed += (await stat(file)).size;
  await unlink(file);
  removed++;
}

console.log(
  `prune-dist: removed ${removed} unreferenced asset${removed === 1 ? '' : 's'} ` +
    `(${(freed / 1024 / 1024).toFixed(1)} MB), kept ${kept}`
);
