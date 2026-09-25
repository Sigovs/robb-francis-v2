// GI4 retouch (critique 2026-09-24): the generated closing cars carried marque marks — a script badge on the left
// coupé's tail, the lettered name and a model badge on the green coupé's engine lid. A generated frame may not
// carry a real maker's mark. Each mark is inpainted column by column: every column of the rectangle is linearly
// interpolated between the clean paint just above and just below it (the lids are smooth vertical gradients),
// plus the frame's own grain. The untouched master is kept in public/img/gen/_alts/*.orig.png.
//   node scripts/retouch-gen.mjs && ONLY=gen-close node scripts/build-images.mjs
import sharp from 'sharp';
import fs from 'node:fs/promises';

const JOBS = {
  'public/img/gen/gen-close-trio.png': [
    { name: 'left coupé script badge', x0: 383, x1: 470, y0: 753, y1: 769, aboveOnly: true }, // below it is the lid's shadow line
    { name: 'green coupé model badge', x0: 2292, x1: 2360, y0: 765, y1: 784 },
    { name: 'green coupé lettered name', x0: 2213, x1: 2480, y0: 818, y1: 841 },
  ],
};

let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
for (const [file, rects] of Object.entries(JOBS)) {
  const orig = file.replace('/gen/', '/gen/_alts/').replace('.png', '.orig.png');
  try { await fs.access(orig); } catch { await fs.copyFile(file, orig); }
  const { data, info } = await sharp(orig).raw().toBuffer({ resolveWithObject: true });
  const C = info.channels, W = info.width;
  const px = (x, y, c) => data[(y * W + x) * C + c];
  for (const r of rects) {
    const pad = 3, rows = 4, win = 7; // average 4 clean rows, then smooth ±7 columns: no per-column streaks
    const sample = (x, y0, dir) => [0, 1, 2].map((c) => { let t = 0; for (let k = 0; k < rows; k++) t += px(x, y0 + dir * k, c); return t / rows; });
    const smooth = (arr) => arr.map((_, i) => [0, 1, 2].map((c) => { let t = 0, n = 0; for (let j = Math.max(0, i - win); j <= Math.min(arr.length - 1, i + win); j++) { t += arr[j][c]; n++; } return t / n; }));
    const xs = []; for (let x = r.x0; x <= r.x1; x++) xs.push(x);
    const A = smooth(xs.map((x) => sample(x, r.y0 - pad, -1)));
    const B = r.aboveOnly ? A : smooth(xs.map((x) => sample(x, r.y1 + pad, 1)));
    xs.forEach((x, xi) => {
      for (let y = r.y0 - pad + 1; y < r.y1 + pad; y++) {
        const t = (y - (r.y0 - pad)) / ((r.y1 + pad) - (r.y0 - pad));
        const edgeX = Math.min(1, Math.min(x - r.x0, r.x1 - x) / 6);
        const n = rnd() * 5;
        for (let c = 0; c < 3; c++) {
          const i = (y * W + x) * C + c;
          const fill = A[xi][c] * (1 - t) + B[xi][c] * t + n;
          data[i] = Math.round(data[i] * (1 - edgeX) + fill * edgeX);
        }
      }
    });
    console.log('retouched', r.name);
  }
  await sharp(data, { raw: info }).png().toFile(file);
}
