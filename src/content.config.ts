import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each project is a folder under src/content/projects/ holding an index.md and
// its own photos, e.g.
//
//   src/content/projects/macropad/
//     index.md
//     images/main.jpg
//
// The slug is the folder name, and image paths in frontmatter resolve relative
// to index.md — so adding a project means adding a folder, nothing else.
const projects = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Shown on the projects index card.
      blurb: z.string(),
      // Used for <meta name="description"> and link previews. Kept separate
      // from blurb so the card copy and the search-result copy can differ.
      description: z.string(),
      skills: z.array(z.string()),
      hero: image(),
      heroAlt: z.string(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string() }))
        .default([]),
      // Controls ordering on the projects index (lower = higher up).
      order: z.number(),
      // Optional outbound link, e.g. Song Leather's storefront.
      link: z.object({ label: z.string(), href: z.string().url() }).optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
