/** Generates src/components/SocialIcon.astro from the extracted brand paths. */
import { readFileSync, writeFileSync } from 'node:fs';

const { flipOffset, unitsPerEm, icons } = JSON.parse(
  readFileSync('scripts/brand-paths.json', 'utf8')
);

const entries = Object.entries(icons)
  .map(
    ([name, { width, d }]) =>
      `  ${name}: {\n    width: ${width},\n    d: '${d.replace(/'/g, "\\'")}',\n  },`
  )
  .join('\n');

const file = `---
// Brand marks extracted from the Font Awesome SVG font (see
// scripts/extract-brand-icons.mjs), inlined so the site ships neither the
// 59 kB Font Awesome stylesheet nor the 77 kB brands woff2 for five icons.
//
// SVG fonts are y-up, so each path is flipped with translate(0, ${flipOffset}) scale(1, -1).
const ICONS: Record<string, { width: number; d: string }> = {
${entries}
};

interface Props {
  name: keyof typeof ICONS | string;
  label: string;
}

const { name, label } = Astro.props;
const icon = ICONS[name];
if (!icon) throw new Error(\`SocialIcon: unknown icon "\${name}"\`);
---

<svg
  class="social-icon"
  viewBox="0 0 ${unitsPerEm} ${unitsPerEm}"
  role="img"
  aria-label={label}
  focusable="false"
>
  <!-- Uniform ${unitsPerEm}x${unitsPerEm} viewBox so every icon scales identically;
       glyphs narrower than the em are centred by the x offset. -->
  <path
    transform={\`translate(\${(${unitsPerEm} - icon.width) / 2}, ${flipOffset}) scale(1, -1)\`}
    d={icon.d}
  />
</svg>
`;

writeFileSync('src/components/SocialIcon.astro', file);
console.log(
  `wrote src/components/SocialIcon.astro (${Object.keys(icons).length} icons, ${Math.round(
    file.length / 1024
  )} kB)`
);
