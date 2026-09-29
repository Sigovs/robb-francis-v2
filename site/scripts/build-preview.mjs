// Builds ../preview/: a copy of the page that opens by double-click (file://) and doubles as the GitHub Pages
// build. file:// cannot load ES modules, so the bundle is a classic IIFE script with relative paths, and only the
// files the page actually references are copied (public/ holds ~60 MB of V1 images the page no longer uses).
//   npm run preview:build   (index.html + v3.html)
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.resolve(root, '../preview');

fs.rmSync(out, { recursive: true, force: true });
// one IIFE build per page (IIFE cannot code-split across inputs): index.html, and v3.html (the scrubbed hero)
const pages = ['index.html', 'v3.html'].filter((f) => fs.existsSync(path.join(root, f)));
let bytes = 0;
const refs = new Set();
for (const [n, page] of pages.entries()) {
  await build({
    root,
    base: './',
    logLevel: 'warn',
    build: {
      outDir: out,
      emptyOutDir: n === 0,
      copyPublicDir: false,
      modulePreload: false,
      cssCodeSplit: false,
      rollupOptions: { input: path.join(root, page), output: { format: 'iife' } },
    },
  });

  // classic script, not a module; relative media paths the bundler does not see (data-src-* on the video)
  const htmlPath = path.join(out, page);
  const html = fs.readFileSync(htmlPath, 'utf8')
    .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
    .replace(/ crossorigin(?=[ >])/g, '')
    .replace(/"\/video\//g, '"./video/')
    .replace(/"\/frames\//g, '"./frames/');
  fs.writeFileSync(htmlPath, html);

  // copy every local file the page and its CSS reference
  for (const m of html.matchAll(/(?:src|href|srcset|data-src[\w-]*)="([^"]+)"/g))
    for (const part of m[1].split(','))
      { const u = part.trim().split(/\s+/)[0]; if (u && !/^(https?:|#|tel:|mailto:|\/)/.test(u)) refs.add(u.replace(/^\.\//, '')); }
  for (const f of fs.readdirSync(path.join(out, 'assets')).filter((f) => f.endsWith('.css')))
    for (const m of fs.readFileSync(path.join(out, 'assets', f), 'utf8').matchAll(/url\(([^)]+)\)/g)) {
      const u = m[1].replace(/['"]/g, '');
      if (!/^(data:|https?:)/.test(u)) refs.add(path.normalize(path.join('assets', u)));
    }
  // frame sequences are requested by script (data-frames): copy the folders whole
  for (const m of html.matchAll(/data-frames="\.\/([^"]+)"/g)) {
    if (fs.existsSync(path.join(out, m[1]))) continue;
    fs.cpSync(path.join(root, 'public', m[1]), path.join(out, m[1]), { recursive: true });
    bytes += fs.readdirSync(path.join(out, m[1])).reduce((a, f) => a + fs.statSync(path.join(out, m[1], f)).size, 0);
  }
}
for (const r of refs) {
  const dst = path.join(out, r);
  if (fs.existsSync(dst)) continue;                       // built assets are already there
  const src = path.join(root, 'public', r);
  if (!fs.existsSync(src)) { console.warn('missing', r); continue; }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst); bytes += fs.statSync(src).size;
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`preview → ${out} · ${refs.size} files · ${(bytes / 1e6).toFixed(1)} MB copied`);
