// @ts-check
import { defineConfig } from 'astro/config';

// User/org Pages site (Portfolio-Max-Song.github.io) — served from the domain
// root, so `base` stays '/'. If this ever moves to a project repo, set
// `base: '/repo-name'` here and nothing else needs to change.
export default defineConfig({
  site: 'https://portfolio-max-song.github.io',
  base: '/',
  image: {
    // Generated variants for responsive srcsets.
    responsiveStyles: true,
  },
  build: {
    format: 'file',
  },
  // The old hand-written pages lived at the site root (/macropad.html). Project
  // pages now live under /projects/, and three slugs were renamed, so every
  // previously-shared link would 404 without these. Static builds emit these as
  // meta-refresh pages.
  // Keys omit the .html extension: with `format: 'file'`, Astro appends it when
  // emitting the redirect page, so '/wood' becomes dist/wood.html.
  // Both TREL pages merged into one, the machining page became the
  // Inventionworks role, and the four passion projects collapsed into
  // /projects/personal — so several of these now point somewhere new.
  redirects: {
    '/trel-manufacturing': '/projects/trel.html',
    '/trel-structures': '/projects/trel.html',
    '/cnc': '/projects/texas-inventionworks.html',
    '/macropad': '/projects/personal.html',
    '/wood': '/projects/personal.html',
    '/songleather': '/projects/personal.html',
    '/recordplayer': '/projects/personal.html',
    '/personal': '/projects/personal.html',
    '/pl8': '/projects/pl8.html',
  },
});
