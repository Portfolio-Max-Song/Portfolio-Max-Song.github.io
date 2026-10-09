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

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Width over height of a JPEG or PNG beside the Markdown file, read from its
 * header, or null if it can't be read. Lets side-by-side images be sized to
 * share one height.
 */
function aspectOf(file, url) {
  try {
    if (!file?.path || typeof url !== 'string' || /^[a-z]+:|^\//i.test(url)) return null;
    const buf = readFileSync(resolve(dirname(file.path), decodeURI(url)));
    if (buf.readUInt32BE(0) === 0x89504e47) return buf.readUInt32BE(16) / buf.readUInt32BE(20);
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let at = 2;
      while (at < buf.length) {
        const marker = buf[at + 1];
        const len = buf.readUInt16BE(at + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return buf.readUInt16BE(at + 7) / buf.readUInt16BE(at + 5);
        }
        at += 2 + len;
      }
    }
  } catch {}
  return null;
}

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

// Inline HTML arrives unparsed, so a caption is matched by its markup.
const isCaption = (node) => node?.type === 'raw' && /^<p class="caption[\s"]/.test(node.value);

// Also stops at a heading written as inline HTML, which arrives unparsed, and
// at a full-width paragraph or list, which never belongs in a half-width column.
const isBreak = (node) =>
  (node.type === 'element' && BREAKS.has(node.tagName)) ||
  (node.type === 'raw' && /^<(h[1-6][\s>]|(p|ul) class="text-full")/.test(node.value));

const wrap = (className, children) => ({
  type: 'element',
  tagName: 'div',
  properties: { className },
  children,
});

export default function rehypeProjectLayout() {
  return (tree, file) => {
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

      // A run whose first image is titled "carousel" becomes a row of pages
      // shown a few at a time, stepped through with buttons rather than
      // scrolled. The script on the project page wires up the buttons.
      if (run[0].properties?.title === 'carousel') {
        delete run[0].properties.title;
        const button = (dir, label, glyph) => ({
          type: 'element',
          tagName: 'button',
          properties: { type: 'button', className: ['page-carousel-button', `is-${dir}`], ariaLabel: label },
          children: [{ type: 'text', value: glyph }],
        });
        out.push(
          wrap(['page-carousel'], [
            button('prev', 'Previous pages', '‹'),
            wrap(['page-carousel-viewport'], [
              wrap(['page-carousel-track'], run.map((im) => wrap(['page-carousel-item'], [im]))),
            ]),
            button('next', 'Next pages', '›'),
          ])
        );
        i = next;
        continue;
      }

      // A run whose first image is titled "grid" becomes a three-column grid
      // of square tiles.
      if (run[0].properties?.title === 'grid') {
        delete run[0].properties.title;
        out.push(wrap(['image-grid'], run.map((im) => wrap(['image-grid-cell'], [im]))));
        i = next;
        continue;
      }

      // A run carrying "left-grid" or "right-grid" (on any image) becomes a
      // two-column grid of images on that side of the prose after it, each
      // with its caption under it, the captions taken in order.
      const gridSide = run.map((im) => im.properties?.title).find((t) => t === 'left-grid' || t === 'right-grid');
      if (run.length > 1 && gridSide) {
        run.forEach((im) => { if (im.properties?.title === gridSide) delete im.properties.title; });
        const captions = [];
        while (captions.length < run.length && isCaption(src[next])) captions.push(src[next++]);
        const cells = run.map((im, k) => wrap(['figure-cell'], captions[k] ? [im, captions[k]] : [im]));
        const text = [];
        while (next < src.length && !imagesIn(src[next]) && !isBreak(src[next])) text.push(src[next++]);
        out.push(
          wrap(['section-row', 'has-grid', ...(gridSide === 'right-grid' ? ['is-flipped'] : [])], [
            wrap(['row-media', 'row-media-grid'], cells),
            wrap(['row-text'], text),
          ])
        );
        i = next;
        continue;
      }

      // A run whose first image is titled "full" stays above the prose that
      // follows it instead of pairing with that prose as a half-width row:
      // one image at banner width, or several side by side with a small gap.
      // Captions that follow a side-by-side run go under the images in order.
      // The marker can sit on any image in the run, not just the first.
      if (run.some((im) => im.properties?.title === 'full')) {
        run.forEach((im) => { if (im.properties?.title === 'full') delete im.properties.title; });
        if (run.length === 1) {
          out.push(wrap(['figure-full', 'is-wide'], run));
        } else {
          const captions = [];
          while (captions.length < run.length && isCaption(src[next])) captions.push(src[next++]);
          const cells = run.map((im, k) => wrap(['figure-cell'], captions[k] ? [im, captions[k]] : [im]));
          out.push(wrap(['figure-full', 'is-wide', 'is-pair'], cells));
        }
        i = next;
        continue;
      }

      // A run carrying "left-pair" or "right-pair" (on any image) puts its
      // images side by side on that side of the prose after it, each with
      // its caption under it, the captions taken in order.
      const pairSide = run.map((im) => im.properties?.title).find((t) => t === 'left-pair' || t === 'right-pair');
      if (run.length > 1 && pairSide) {
        run.forEach((im) => { if (im.properties?.title === pairSide) delete im.properties.title; });
        const captions = [];
        while (captions.length < run.length && isCaption(src[next])) captions.push(src[next++]);
        const cells = run.map((im, k) => wrap(['figure-cell'], captions[k] ? [im, captions[k]] : [im]));
        // Each image's column is as wide as its aspect ratio, so the two come
        // out the same height.
        const ratios = run.map((im) => aspectOf(file, im.properties?.src));
        const media = wrap(['row-media', 'row-media-side-pair'], cells);
        if (ratios.every(Boolean)) {
          media.properties.style = `grid-template-columns: ${ratios.map((a) => `minmax(0, ${a.toFixed(3)}fr)`).join(' ')}`;
        }
        const text = [];
        while (next < src.length && !imagesIn(src[next]) && !isBreak(src[next])) text.push(src[next++]);
        out.push(
          wrap(['section-row', 'has-side-pair', ...(pairSide === 'right-pair' ? ['is-flipped'] : [])], [
            media,
            wrap(['row-text'], text),
          ])
        );
        i = next;
        continue;
      }

      // A run titled "beside" goes to the right of the paragraphs just before
      // it (back to the last heading), with a caption that follows it kept
      // directly under the images in the same column.
      if (run.length > 1 && run[0].properties?.title === 'beside') {
        delete run[0].properties.title;
        const lead = [];
        while (out.length && isElement(out[out.length - 1], 'p')) lead.unshift(out.pop());
        const media = [wrap(['row-media-pair'], run)];
        if (isCaption(src[next])) {
          media.push(src[next]);
          next += 1;
        }
        out.push(wrap(['section-row', 'has-pair'], [wrap(['row-text'], lead), wrap(['row-media'], media)]));
        i = next;
        continue;
      }

      // A lone image titled "left" or "right" sits on that side of the prose
      // after it, with a caption that follows it kept under the image. A
      // "-small" suffix also scales the image down inside its column, and a
      // number such as "right-80" scales it to that percentage of the column.
      const side = run.length === 1 ? run[0].properties?.title : null;
      const placed = typeof side === 'string' && side.match(/^(left|right)(?:-(small|\d{1,3}))?$/);
      if (placed) {
        delete run[0].properties.title;
        const media = [...run];
        if (isCaption(src[next])) {
          media.push(src[next]);
          next += 1;
        }
        const text = [];
        while (next < src.length && !imagesIn(src[next]) && !isBreak(src[next])) text.push(src[next++]);
        const classes = [
          'section-row',
          'has-caption',
          ...(placed[1] === 'right' ? ['is-flipped'] : []),
          ...(placed[2] === 'small' ? ['is-small'] : []),
          ...(/^\d/.test(placed[2] ?? '') ? ['is-scaled'] : []),
        ];
        const row = wrap(classes, [wrap(['row-media'], media), wrap(['row-text'], text)]);
        if (/^\d/.test(placed[2] ?? '')) row.properties.style = `--media-scale: ${placed[2]}%`;
        out.push(row);
        i = next;
        continue;
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
        if (isBreak(candidate)) break;
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
