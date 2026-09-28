// Builds ../preview/: a copy of the page that opens by double-click (file://) and doubles as the GitHub Pages
// build. file:// cannot load ES modules, so the bundle is a classic IIFE script with relative paths, and only the
// files the page actually references are copied (public/ holds ~60 MB of V1 images the page no longer uses).
//   npm run preview:build
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.resolve(root, '../preview');

fs.rmSync(out, { recursive: true, force: true });
await build({
  root,
  base: './',
  logLevel: 'warn',
  build: {
    outDir: out,
    emptyOutDir: true,
    copyPublicDir: false,
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: { output: { format: 'iife' } },
  },
});

// classic script, not a module; relative media paths the bundler does not see (data-src-* on the video)
const htmlPath = path.join(out, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8')
  .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
  .replace(/ crossorigin(?=[ >])/g, '')
  .replace(/"\/video\//g, '"./video/');
fs.writeFileSync(htmlPath, html);

// copy every local file the page and its CSS reference
const refs = new Set();
for (const m of html.matchAll(/(?:src|href|srcset|data-src[\w-]*)="([^"]+)"/g))
  for (const part of m[1].split(','))
    { const u = part.trim().split(/\s+/)[0]; if (u && !/^(https?:|#|tel:|mailto:|\/)/.test(u)) refs.add(u.replace(/^\.\//, '')); }
for (const f of fs.readdirSync(path.join(out, 'assets')).filter((f) => f.endsWith('.css')))
  for (const m of fs.readFileSync(path.join(out, 'assets', f), 'utf8').matchAll(/url\(([^)]+)\)/g)) {
    const u = m[1].replace(/['"]/g, '');
    if (!/^(data:|https?:)/.test(u)) refs.add(path.normalize(path.join('assets', u)));
  }
let bytes = 0;
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
