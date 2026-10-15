import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// Windows folder edits can leave Vite's image glob cached. Refresh the preview
// when gallery filenames change; this plugin does no work in production builds.
export default function galleryRefresh() {
  return {
    name: 'refresh-gallery-files',
    configureServer(server) {
      const directory = resolve(server.config.root, 'src/assets/images/fusion-gallery');
      let previous;
      let checking = false;
      let closed = false;
      async function checkFiles() {
        if (checking || closed) return;
        checking = true;
        try {
          let names;
          try {
            names = (await readdir(directory)).filter(name => name.endsWith('.png')).sort();
          } catch (error) {
            if (error.code !== 'ENOENT') throw error;
            names = [];
          }
          const current = JSON.stringify(names);
          if (!closed && previous !== undefined && current !== previous) {
            server.moduleGraph.invalidateAll();
            server.ws.send({ type: 'full-reload' });
          }
          previous = current;
        } catch (error) {
          server.config.logger.warn(`Could not refresh gallery files: ${error.message}`);
        } finally {
          checking = false;
        }
      }
      void checkFiles();
      const timer = setInterval(checkFiles, 500);
      timer.unref();
      server.httpServer?.once('close', () => {
        closed = true;
        clearInterval(timer);
      });
    },
  };
}
