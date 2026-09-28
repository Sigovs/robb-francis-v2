// Chapter images (Forge's 01/03 device): drop 01, 02, 03 (jpg/png/webp/heic) into _masters/chapters/ and run
//   npm run chapters
// Each becomes a square inset (1200px, WebP) and a tiny pre-blurred field (the full-bleed background is this
// 48px image scaled up: soft for free, no CSS blur on a full-screen layer).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, '_masters/chapters');
const out = path.join(root, 'public/img/chapters');
fs.mkdirSync(out, { recursive: true });
for (const n of ['01', '02', '03']) {
  const file = fs.readdirSync(src).find((f) => f.startsWith(n + '.'));
  if (!file) { console.warn('missing', n); continue; }
  const img = sharp(path.join(src, file)).rotate();
  await img.clone().resize(1200, 1200, { fit: 'cover', position: 'attention' }).webp({ quality: 80 }).toFile(path.join(out, `${n}.webp`));
  await img.clone().resize(48, 27, { fit: 'cover' }).modulate({ brightness: 0.62, saturation: 0.85 }).blur(1.2).jpeg({ quality: 80 }).toFile(path.join(out, `${n}-field.jpg`));
  console.log('ok', n, file);
}
