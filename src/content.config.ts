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
      // Where the work happened. The index card shows this and the date,
      // nothing else — so keep it to the organisation's name.
      org: z.string().optional(),
      // Job title, shown only on the project page. Absent for student orgs
      // and personal work, where there is no title worth printing.
      role: z.string().optional(),
      // Display string for the card, e.g. 'January – August 2026'. Free text
      // rather than a real date because several of these are open-ended
      // ranges; `order` below is what actually sorts the list.
      date: z.string(),
      // Shown on the projects index card.
      blurb: z.string(),
      // Used for <meta name="description"> and link previews. Kept separate
      // from blurb so the card copy and the search-result copy can differ.
      description: z.string(),
      skills: z.array(z.string()),
      // Optional so a page can be written before its photos exist.
      hero: image().optional(),
      heroAlt: z.string().optional(),
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
