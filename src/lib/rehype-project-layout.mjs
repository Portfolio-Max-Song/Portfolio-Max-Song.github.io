/**
 * Restructures a project page's Markdown output into the layout the site uses.
 *
 *   - The opening paragraph becomes the page's standfirst. Only the first one:
 *     the whole pre-heading run is often several hundred words, which set full
 *     width would be unreadable.
 *   - Each image is paired with the prose that follows it, and those pairs
 *     alternate sides down the page.
 *
 * Alternation runs continuously rather than restarting at each heading: most
 * sections here hold a single image, so a per-section reset would put every
 * image on the left and produce no zig-zag at all.
 *
 * Markdown hands us a flat run of siblings, so the pairing has to be inferred.
 * An image block is a <p> holding nothing but an <img>; the prose it belongs
 * with is every following sibling up to the next image, heading, table or rule.
 */

const isElement = (node, tag) => node.type === 'element' && node.tagName === tag;

const isBlank = (node) => node.type === 'text' && node.value.trim() === '';

/** The <img> carried by this node, if the node is nothing but an image. */
function imageIn(node) {
  if (isElement(node, 'img')) return node;
  if (!isElement(node, 'p')) return null;
  const kids = node.children.filter((c) => !isBlank(c));
  return kids.length === 1 && isElement(kids[0], 'img') ? kids[0] : null;
}

// Blocks that end a run of prose. Tables are excluded from the paired text
// because a table in a half-width column is unreadable.
const BREAKS = new Set(['h1', 'h2', 'h3', 'h4', 'table', 'hr']);

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

    if (i < src.length && isElement(src[i], 'p')) {
      out.push(wrap(['project-lead'], [src[i++]]));
    }

    let flipped = false;
    while (i < src.length) {
      const node = src[i];

      if (isElement(node, 'h2')) {
        out.push(node);
        i += 1;
        continue;
      }

      const img = imageIn(node);
      if (!img) {
        out.push(node);
        i += 1;
        continue;
      }

      const text = [];
      let j = i + 1;
      while (j < src.length) {
        const next = src[j];
        if (imageIn(next)) break;
        if (next.type === 'element' && BREAKS.has(next.tagName)) break;
        text.push(next);
        j += 1;
      }

      // An image with no prose after it has nothing to sit beside, so it stays
      // a full-width figure rather than half a row with a hole in it.
      if (text.length === 0) {
        out.push(node);
        i += 1;
        continue;
      }

      out.push(
        wrap(['section-row', ...(flipped ? ['is-flipped'] : [])], [
          wrap(['row-media'], [img]),
          wrap(['row-text'], text),
        ])
      );
      flipped = !flipped;
      i = j;
    }

    tree.children = out;
  };
}
