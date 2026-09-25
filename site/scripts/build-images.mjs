// Responsive derivatives for the index. Masters are never modified.
// HEIC originals are converted with `sips` first (sharp's prebuilt libheif decodes AVIF only):
//   sips -s format jpeg -s formatOptions best IMG_*.heic --out _masters/place/<id>.jpg
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const R = '../reference';
const PLACE = process.env.PLACE_MASTERS || '_masters/place';
const OUT = 'public/img';
await fs.mkdir(OUT, { recursive: true });

const Q = { avif: { quality: 52, effort: 5 }, webp: { quality: 78 }, jpeg: { quality: 80, mozjpeg: true } };

// ONLY=door,interior node scripts/build-images.mjs — rebuild just the named jobs (prefix match)
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const wanted = (name) => !ONLY.length || ONLY.some((o) => name === o || name.startsWith(`${o}-`));

/** White balance (taste pass, 2026-09-24). The place photographs are tungsten-lit: their low-chroma pixels
 *  (walls, aluminium, concrete) measured 9–20 points warmer in R than in B, and that cast — not the grade —
 *  is what pushed the page brown. Gray-world on near-neutral pixels only, so the red door frame and the red
 *  cars keep their hue: per-channel gains that bring the neutrals to equal R/B with a hint of the gallery navy. */
async function wbGains(src, extract, { strength = 1, cool = 0.015 } = {}) {
  let img = sharp(src, { limitInputPixels: false }).rotate();
  if (extract) img = img.extract(extract);
  const { data } = await img.resize({ width: 320 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  // iterate: re-select the neutrals under the current gains, so a warm-biased selection converges
  let gains = [1, 1, 1];
  for (let it = 0; it < 6; it++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < data.length; i += 3) {
      const R = data[i] * gains[0], G = data[i + 1] * gains[1], B = data[i + 2] * gains[2];
      const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
      if (mx > 36 && mx < 245 && mx - mn < 44) { r += R; g += G; b += B; n++; }
    }
    if (!n) break;
    const m = (r + g + b) / (3 * n);
    gains = [gains[0] * (m * (1 - cool)) / (r / n), gains[1] * m / (g / n), gains[2] * (m * (1 + cool)) / (b / n)];
  }
  return gains.map((k) => 1 + strength * (k - 1));
}

/** one job: src → name-{w}.{avif,webp,jpg} */
async function job(name, src, { widths, extract, grade, formats = ['avif', 'webp', 'jpeg'], blur, wb } = {}) {
  if (!wanted(name)) return;
  const gains = wb ? await wbGains(src, extract, wb === true ? {} : wb) : null;
  for (const w of widths) {
    for (const f of formats) {
      let img = sharp(src, { limitInputPixels: false }).rotate();
      if (extract) img = img.extract(extract);
      img = img.resize({ width: w, withoutEnlargement: false });
      // sharp keeps ONE linear() per pipeline: white balance and the grade's own linear go in the same call
      const la = grade?.linear?.[0] ?? 1, lb = grade?.linear?.[1] ?? 0;
      if (grade?.modulate) img = img.modulate(grade.modulate);
      if (gains) img = img.linear(gains.map((k) => k * la), [lb, lb, lb]);
      else if (grade?.linear) img = img.linear(la, lb);
      if (blur) img = img.blur(blur);
      const ext = f === 'jpeg' ? 'jpg' : f;
      const file = path.join(OUT, `${name}-${w}.${ext}`);
      await img.toFormat(f, Q[f]).toFile(file);
    }
  }
  console.log('ok', name, widths.join(','), gains ? `wb ${gains.map((x) => x.toFixed(3)).join('/')}` : '');
}
const px = async (src) => { const m = await sharp(src).metadata(); return { w: m.width, h: m.height }; };
// fractional crop helper
const frac = async (src, x, y, w, h) => { const { w: W, h: H } = await px(src); return { left: Math.round(x * W), top: Math.round(y * H), width: Math.round(w * W), height: Math.round(h * H) }; };

const nocturne = { modulate: { brightness: 0.9, saturation: 0.92 } };
const daylight = { modulate: { brightness: 0.78, saturation: 0.85 } }; // inventory snapshots pulled toward the page grade (DNA23)

// ---------- Act 1: hero poster (first frame of hero1d.mp4)
await job('hero-poster', '_masters/hero-frame0.png', { widths: [1920, 1280] });
// phone poster = the first frame of the 4:5 film band (864×1080 at x 557), so poster and film are one frame
await job('hero-poster-m', '_masters/hero-frame0.png', { widths: [720], extract: { left: 557, top: 0, width: 864, height: 1080 } });

// ---------- Act 2: the door (HEIC 180304) + interior (HEIC 180609)
// door: partial correction — at full strength the aluminium rails went periwinkle (B gain 1.24)
await job('door', `${PLACE}/180304.jpg`, { widths: [2560, 1600], wb: { strength: 0.55 } });
// mobile: authored 4:5 crop of the LEFT door (panel rails re-measured against this crop in CSS)
await job('door-m', `${PLACE}/180304.jpg`, { widths: [900], wb: { strength: 0.55 }, extract: { left: 327, top: 0, width: 1796, height: 2245 } });
// interior: the GALLERY, not the bonnet — the art wall, bike rack and the cars' rooflines (top 54% of the frame).
// The red roadster is reduced to its windscreen line so it stops reading as a close-up behind the glass.
await job('interior', `${PLACE}/180609.jpg`, { widths: [2560, 1600], grade: nocturne, wb: true, extract: await frac(`${PLACE}/180609.jpg`, 0, 0.02, 1, 0.54) });
// mobile: an authored 4:5 of what stands behind the LEFT door — the art wall and the silver E-Type
await job('interior-m', `${PLACE}/180609.jpg`, { widths: [900], grade: nocturne, wb: true, extract: await frac(`${PLACE}/180609.jpg`, 0.05, 0, 0.36, 0.6) });

// Door panels as RAILS ONLY (critique 2026-09-24): the glass panes showed the street-side plate's view of the room
// while the room revealed behind was 180609, and the seam showed. Now the panes are cut to alpha — only the
// aluminium (measured off the plate by brightness profile) and a ~10% cool frost travel with the door, and the
// room behind the glass is the same room from the first frame. Bands in fractions of the master (5139 × 2375),
// padded ±0.004 so the rail's own edge and shadow line travel with it.
const RAIL_Y = [[0.036, 0.066], [0.151, 0.201], [0.345, 0.39], [0.531, 0.577], [0.718, 0.763], [0.902, 0.953]];
const RAIL_X = [[0, 0.01], [0.2211, 0.2423], [0.461, 0.48], [0.533, 0.5515], [0.7686, 0.7883], [0.985, 1]];
const FROST = { rgb: [222, 226, 232], alpha: 0.1 };
async function rails(name, src, widths, { extract, wb } = {}) {
  if (!wanted(name)) return;
  const M = await sharp(src).metadata();
  const box = extract || { left: 0, top: 0, width: M.width, height: M.height };
  const gains = wb ? await wbGains(src, extract, wb) : null;
  for (const w of widths) {
    let img = sharp(src, { limitInputPixels: false }).extract(box).resize({ width: w });
    if (gains) img = img.linear(gains, [0, 0, 0]);
    const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const k = box.width / info.width, feather = 1.5;
    const band = (v, [a, b]) => Math.max(0, Math.min(1, Math.min(v - a, b - v) / feather + 0.5));
    const ay = RAIL_Y.map(([a, b]) => [a * M.height, b * M.height]), ax = RAIL_X.map(([a, b]) => [a * M.width, b * M.width]);
    const out = Buffer.alloc(info.width * info.height * 4);
    for (let y = 0; y < info.height; y++) {
      const my = box.top + (y + 0.5) * k;
      const ry = Math.max(...ay.map((r) => band(my / k, [r[0] / k, r[1] / k])));
      for (let x = 0; x < info.width; x++) {
        const mx = box.left + (x + 0.5) * k;
        const rx = Math.max(...ax.map((r) => band(mx / k, [r[0] / k, r[1] / k])));
        const a = Math.max(rx, ry), i = (y * info.width + x) * 3, o = (y * info.width + x) * 4;
        for (let c = 0; c < 3; c++) out[o + c] = Math.round(data[i + c] * a + FROST.rgb[c] * (1 - a));
        out[o + 3] = Math.round(255 * (a + (1 - a) * FROST.alpha));
      }
    }
    await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 82, alphaQuality: 90 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  console.log('ok rails', name);
}
await rails('door-rails', `${PLACE}/180304.jpg`, [2560, 1600], { wb: { strength: 0.55 } });
await rails('door-rails-m', `${PLACE}/180304.jpg`, [900], { wb: { strength: 0.55 }, extract: { left: 327, top: 0, width: 1796, height: 2245 } });

// ---------- Act 3: chapters — square insets + pre-blurred full-bleed fields
await job('ch01', `${PLACE}/180316.jpg`, { widths: [1000, 700], grade: nocturne, wb: true, extract: await frac(`${PLACE}/180316.jpg`, 0.355, 0.1, 0.52, 0.6933) });
await job('ch01-field', `${PLACE}/180316.jpg`, { widths: [480], grade: nocturne, wb: true, blur: 10, formats: ['webp', 'jpeg'] });
await job('ch02', `${R}/found/356speedster_front34_forest.jpg`, { widths: [960, 700], extract: { left: 180, top: 0, width: 961, height: 961 } });
await job('ch02-field', `${R}/found/356speedster_front34_forest.jpg`, { widths: [480], blur: 10, formats: ['webp', 'jpeg'] });
await job('ch03', '_capture/inv-2020-z4.jpg', { widths: [1000, 700], grade: daylight, wb: true, extract: { left: 170, top: 60, width: 1500, height: 1500 } });
await job('ch03-field', '_capture/inv-2020-z4.jpg', { widths: [480], grade: daylight, wb: true, blur: 10, formats: ['webp', 'jpeg'], extract: { left: 0, top: 0, width: 1920, height: 1200 } });

// ---------- Act 5: services — full frames, cropped by object-position per panel
await job('svc-buy', `${R}/found/356speedster_front_road.jpg`, { widths: [1440, 900] });
await job('svc-consign', `${PLACE}/180321.jpg`, { widths: [1600, 900], grade: nocturne, wb: true });
// Financing: the office entrance (HEIC 180532) — 180316 is chapter 01's image and was used twice
await job('svc-finance', `${PLACE}/180532.jpg`, { widths: [1600, 900], grade: nocturne, wb: true });
await job('svc-warranty', `${R}/found/356speedster_rear_road.jpg`, { widths: [1440, 900] });

// ---------- Act 7: sold wall + inventory
// Sold wall: ONE grade across all five (critique) — five Instagram photos with five white balances and five
// contrast curves read as five art directions. Same white balance, saturation 0.8, blacks lifted to the ground
// (linear 0.96x + 10 ≈ --c-ground), one crop ratio (the sources are all 1:1 already).
const soldGrade = { modulate: { saturation: 0.8 }, linear: [0.96, 10] };
for (const f of ['1965-sunbeam-tiger-260', '1988-ford-mustang-gt-convertible', '1999-land-rover-defender-90', '1948-mg-tc', '1933-bsa-249cc'])
  await job(`sold-${f}`, `${R}/sold/${f}.jpg`, { widths: [1000, 600], grade: soldGrade, wb: { strength: 0.8 } });
await job('inv-pantera', '_capture/inv-1974-pantera.jpg', { widths: [1920, 1280], grade: daylight, extract: { left: 0, top: 0, width: 1920, height: 1200 } });
// Act 7 inventory uses the chapter device (brief §10): the Pantera as an inset over its own blurred field
await job('inv-pantera-field', '_capture/inv-1974-pantera.jpg', { widths: [480], grade: daylight, blur: 10, formats: ['webp', 'jpeg'], extract: { left: 0, top: 0, width: 1920, height: 1200 } });
await job('inv-pantera-m', '_capture/inv-1974-pantera.jpg', { widths: [900], grade: daylight, extract: { left: 0, top: 0, width: 1500, height: 1875 } });

// ---------- Act 8: closing plate — the real night facade, ~1.5 EV down and softened
await job('facade-night', `${PLACE}/180331.jpg`, { widths: [2560, 1440], grade: { modulate: { brightness: 0.36, saturation: 0.7 } }, blur: 6, wb: { strength: 0.85 } });

// ---------- Generated (G): keyed to alpha so they sit on any dark ground without a halo box
async function keyed(name, src, widths, { floor = 7, ramp = 14, crop } = {}) {
  if (!wanted(name)) return;
  const box = crop ? await frac(src, ...crop) : null;
  for (const w of widths) {
    let img = sharp(src);
    if (box) img = img.extract(box);
    const { data, info } = await img.resize({ width: w }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const n = info.width * info.height, rgba = Buffer.alloc(n * 4);
    for (let i = 0; i < n; i++) {
      const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
      const l = Math.max(r, g, b);
      rgba[i * 4] = r; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = b;
      rgba[i * 4 + 3] = Math.max(0, Math.min(255, Math.round(((l - floor) / ramp) * 255)));
    }
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 80, alphaQuality: 90 }).toFile(path.join(OUT, 'gen', `${name}-${w}.webp`));
  }
  console.log('ok keyed', name);
}
// ---------- Act 8: the generated closing cars (G). Taste pass: the prompt's "warm light" came out amber and
// carried the brown back in at the end of the page — neutralised like the place photographs (85%).
async function closing(name, src, widths, { saturation = 1 } = {}) {
  if (!wanted(name)) return;
  // clamped: a frame that is nearly all lamp-light has few true neutrals, and gray-world over-reaches (B 2.18)
  const gains = (await wbGains(src, null, { strength: 0.85 })).map((k) => Math.min(1.28, Math.max(0.8, k)));
  for (const w of widths) {
    const base = () => sharp(src).resize({ width: w }).modulate({ saturation }).linear(gains, [0, 0, 0]);
    await base().avif(Q.avif).toFile(`${OUT}/gen/${name}-${w}.avif`);
    await base().jpeg(Q.jpeg).toFile(`${OUT}/gen/${name}-${w}.jpg`);
  }
  console.log('ok', name, gains.map((x) => x.toFixed(3)).join('/'));
}
await closing('gen-close-trio', `${OUT}/gen/gen-close-trio.png`, [2400, 1440]);
// the mobile frame is almost all sodium light: past the clamp, the rest of the cast is taken out by desaturation
await closing('gen-close-single-m', `${OUT}/gen/gen-close-single-m.png`, [900], { saturation: 0.45 });

// Peak car cropped to its SILHOUETTE (critique 2026-09-24): the frame carried ~27% air each side and a key-light
// halo, so its painted width could not be set. Body measured on the keyed still: x .267–.730, y .166–.851;
// cropped with a thin margin for the contact shadow. Painted width is now the CSS width, directly.
await keyed('gen-peak-car-body', `${OUT}/gen/gen-peak-car-topdown.png`, [1200, 700], { crop: [0.245, 0.152, 0.507, 0.713] });

if (!ONLY.length) {
await keyed('gen-peak-car-topdown', `${OUT}/gen/gen-peak-car-topdown.png`, [1100, 640]);
await keyed('gen-peak-flank-a', `${OUT}/gen/gen-peak-flank-a.png`, [900, 520], { floor: 9, ramp: 10 });
await keyed('gen-peak-flank-b', `${OUT}/gen/gen-peak-flank-b.png`, [900, 520]);


}
// ---------- Procedural ground grain for the peak (G, procedural noise, no source image)
if (!ONLY.length) {
  const S = 256, buf = Buffer.alloc(S * S);
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < buf.length; i++) buf[i] = 10 + Math.round(rnd() * 14 * rnd());
  await sharp(buf, { raw: { width: S, height: S, channels: 1 } }).blur(0.5).png({ palette: true, colors: 16 }).toFile(`${OUT}/ground-grain.png`);
}
console.log('done');
