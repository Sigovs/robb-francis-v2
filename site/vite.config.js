// Vite config.
// 1 · Font guard. The licensed display face is referenced before the file exists. Vite's SPA fallback used to
//     answer /fonts/PPEditorialNew-Ultralight.woff2 with index.html (200, text/html): the browser parsed HTML
//     as a font (OTS error) before falling through to the stand-in. Now the @font-face block between the
//     `@font-guard <file>` markers in tokens.css is stripped while public/fonts/<file> is absent, so nothing is
//     requested at all. The check runs per transform: drop the file in and the next load uses it.
// 2 · appType 'mpa': any other missing static path answers 404, never index.html.
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

// A PostCSS plugin, not a file transform: main.css inlines tokens.css through @import, so only the inlined
// stylesheet is what the page loads. Removes the nodes between the two marker comments.
const fontGuard = () => ({
  postcssPlugin: 'rf-font-guard',
  Once(root) {
    root.walkComments((c) => {
      const m = c.text.match(/^@font-guard (\S+)$/);
      if (!m || fs.existsSync(path.resolve(__dirname, 'public/fonts', m[1]))) return;
      let n = c.next();
      while (n && !(n.type === 'comment' && n.text === '@font-guard-end')) { const nx = n.next(); n.remove(); n = nx; }
      c.replaceWith({ type: 'comment', text: `${m[1]} absent: @font-face omitted` });
    });
  },
});

export default defineConfig({
  appType: 'mpa',
  server: { port: 5174, strictPort: true }, // V2; V1 stays on 5173
  css: { postcss: { plugins: [fontGuard()] } },
});
