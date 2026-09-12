/**
 * One-shot: pulls the five brand glyphs the site actually uses out of the
 * Font Awesome SVG font, so they can be inlined as SVG and Font Awesome
 * (59 kB CSS + 77 kB woff2) dropped entirely.
 *
 * SVG fonts use a y-up coordinate system, so each path needs flipping when
 * rendered: translate(0, ascent) scale(1, -1).
 */
import { readFileSync, writeFileSync } from 'node:fs';

// The original template assets, kept at the repo root. This script is one-shot
// tooling — its output (scripts/brand-paths.json and the generated component)
// is committed, so deleting assets/ later does not break the build.
const SRC = 'assets/webfonts/fa-brands-400.svg';
const WANT = ['github', 'linkedin', 'instagram', 'pinterest', 'google'];

const svg = readFileSync(SRC, 'utf8');

const face = svg.match(/<font-face[\s\S]*?>/)[0];
const ascent = Number(face.match(/[^-]ascent="(-?\d+)"/)[1]);
const descent = Number(face.match(/descent="(-?\d+)"/)[1]);
const unitsPerEm = Number(face.match(/units-per-em="(\d+)"/)[1]);

// SVG fonts are y-up, so rendering needs y' = ascent - y. Verified in-browser
// by comparing each path's screen-space rect against its <svg> box: at this
// offset every glyph lands inside, and offsetting by ascent - descent instead
// pushes all five past the bottom edge.
const flipOffset = ascent;

const out = {};
for (const name of WANT) {
  const start = svg.indexOf(`glyph-name="${name}"`);
  if (start === -1) {
    console.warn(`!! ${name}: glyph not found`);
    continue;
  }
  const chunk = svg.slice(start, start + 20000);
  const adv = chunk.match(/horiz-adv-x="(\d+)"/);
  const d = chunk.match(/\bd="([^"]+)"/);
  if (!d) {
    console.warn(`!! ${name}: no path data`);
    continue;
  }
  out[name] = {
    width: adv ? Number(adv[1]) : unitsPerEm,
    d: d[1].replace(/\s+/g, ' ').trim(),
  };
}

writeFileSync(
  'scripts/brand-paths.json',
  JSON.stringify({ ascent, descent, unitsPerEm, flipOffset, icons: out }, null, 1)
);

console.log(
  `ascent=${ascent} descent=${descent} unitsPerEm=${unitsPerEm} flipOffset=${flipOffset}`
);
for (const [k, v] of Object.entries(out)) {
  console.log(`  ${k.padEnd(10)} width=${String(v.width).padEnd(4)} ${v.d.length} chars`);
}
const missing = WANT.filter((w) => !out[w]);
console.log(missing.length ? `MISSING: ${missing.join(', ')}` : 'all five extracted');
