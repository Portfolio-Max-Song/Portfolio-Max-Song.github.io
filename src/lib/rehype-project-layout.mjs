/**
 * Restructures a project page's Markdown output into the layout the site uses.
 *
 *   - The opening paragraphs become the page's standfirst, spanning full width
 *     above the first section heading.
 *   - A lone image is paired with the prose that follows it, and those pairs
 *     alternate sides down the page.
 *   - A run of images with no prose between them becomes a side-by-side group
 *     instead, kept at natural proportions so nothing is cropped out of a
 *     document scan or a dense screenshot.
 *
 * Alternation runs continuously rather than restarting at each heading: most
 * sections here hold a single image, so a per-section reset would put every
 * image on the left and produce no zig-zag at all.
 *
 * Markdown hands us a flat run of siblings, so all of this has to be inferred
 * from what a node contains. Note that two `![]()` on consecutive lines are a
 * single paragraph holding two images, while the same two separated by a blank
 * line are two paragraphs — both have to count as a run.
 */

const isElement = (node, tag) => node.type === 'element' && node.tagName === tag;

const isBlank = (node) => node.type === 'text' && node.value.trim() === '';

/** Every image carried by a node that holds nothing but images. */
function imagesIn(node) {
  if (isElement(node, 'img')) return [node];
  if (!isElement(node, 'p')) return null;
  const kids = node.children.filter((c) => !isBlank(c));
  if (!kids.length) return null;
  return kids.every((k) => isElement(k, 'img')) ? kids : null;
}

// Blocks that end a run of prose. Tables are excluded from the paired text
// because a table in a half-width column is unreadable. h3/h4 removed so they pair.
const BREAKS = new Set(['h1', 'h2', 'table', 'hr']);

const wrap = (className, children) => ({
  type: 'element',
  tagName: 'div',
  properties: { className },
  children,
});

export default function rehypeProjectLayout() {
  return (tree) => {
    const src = tree.children.filter((n) => !isBlank(n));
    const out = [];
    let i = 0;

    while (i < src.length && isElement(src[i], 'p') && !imagesIn(src[i])) {
      out.push(wrap(['project-lead'], [src[i++]]));
    }

    let flipped = false;
    while (i < src.length) {
      const node = src[i];

      const images = imagesIn(node);
      if (!images) {
        out.push(node);
        i += 1;
        continue;
      }

      // Absorb every following image-only block into the same run.
      const run = [...images];
      let next = i + 1;
      while (next < src.length) {
        const more = imagesIn(src[next]);
        if (!more) break;
        run.push(...more);
        next += 1;
      }

      if (run.length > 1) {
        out.push(wrap(['image-row'], run.map((im) => wrap(['image-cell'], [im]))));
        flipped = !flipped;
        i = next;
        continue;
      }

      const text = [];
      let j = next;
      while (j < src.length) {
        const candidate = src[j];
        if (imagesIn(candidate)) break;
        if (candidate.type === 'element' && BREAKS.has(candidate.tagName)) break;
        text.push(candidate);
        j += 1;
      }

      // An image with no prose after it has nothing to sit beside, so it
      // becomes a full-width figure rather than half a row with a hole in it.
      // It needs its own wrapper: left as a <p> it would inherit the prose
      // width cap meant for running text.
      if (text.length === 0) {
        out.push(wrap(['figure-full'], run));
        i = next;
        continue;
      }

      out.push(
        wrap(['section-row', ...(flipped ? ['is-flipped'] : [])], [
          wrap(['row-media'], run),
          wrap(['row-text'], text),
        ])
      );
      flipped = !flipped;
      i = j;
    }

    tree.children = out;
  };
}
