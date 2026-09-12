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
  redirects: {
    '/trel-manufacturing': '/projects/trel-manufacturing.html',
    '/trel-structures': '/projects/trel-structures.html',
    '/macropad': '/projects/macropad.html',
    '/cnc': '/projects/cnc.html',
    '/wood': '/projects/woodworking.html',
    '/songleather': '/projects/song-leather.html',
    '/pl8': '/projects/pl8.html',
    '/recordplayer': '/projects/record-player.html',
    '/personal': '/projects/personal.html',
  },
});
