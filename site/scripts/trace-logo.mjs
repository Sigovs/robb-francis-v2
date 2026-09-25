// Trace the RF shield + wordmark to a two-tone SVG for the MOCKUP (file prefix "trace-").
// Source: the 6300x1500 raster embedded in rfsportscars.com's brand-logo.svg (origin R, fetched 2026-09-24),
// which is far sharper than the 253x54 repo PNG. Production needs the client's real vector.
import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'node:fs/promises';

const SRC = '_capture/brand-logo-embedded.png';
const trace = (buf, opts) => new Promise((res, rej) =>
  potrace.trace(buf, { turdSize: 20, optTolerance: 0.3, threshold: 128, ...opts }, (e, svg) => e ? rej(e) : res(svg)));

const { data, info } = await sharp(SRC).trim().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const white = Buffer.alloc(W * H), black = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
  const lum = (r + g + b) / 3;
  white[i] = a > 128 && lum > 128 ? 0 : 255; // potrace traces dark pixels
  black[i] = a > 128 && lum <= 128 ? 0 : 255;
}
const toPng = b => sharp(b, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
const pathOf = svg => (svg.match(/ d="([^"]+)"/) || [])[1];
const wPath = pathOf(await trace(await toPng(white)));
const kPath = pathOf(await trace(await toPng(black)));

// Split: the shield sits in the left ~22% of the trimmed raster.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Robb Francis Sports Cars">
  <!-- trace-logo.svg: MOCKUP TRACE of the RF shield + wordmark. Replace with the client's master vector before live. -->
  <path fill="#ffffff" fill-rule="evenodd" d="${wPath}"/>
  <path fill="#000000" fill-rule="evenodd" d="${kPath}"/>
</svg>
`;
await fs.writeFile('public/img/brand/trace-logo.svg', svg);

// Shield alone (for the centred header mark): crop the trimmed raster to the shield and trace again.
const shieldW = Math.round(W * 0.222);
const crop = async (buf) => sharp(buf, { raw: { width: W, height: H, channels: 1 } }).extract({ left: 0, top: 0, width: shieldW, height: H }).png().toBuffer();
const wS = pathOf(await trace(await crop(white)));
const kS = pathOf(await trace(await crop(black)));
await fs.writeFile('public/img/brand/trace-shield.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${shieldW} ${H}" role="img" aria-label="Robb Francis Sports Cars">
  <!-- trace-shield.svg: MOCKUP TRACE. Replace with the client's master vector before live. -->
  <path fill="#ffffff" fill-rule="evenodd" d="${wS}"/>
  <path fill="#000000" fill-rule="evenodd" d="${kS}"/>
</svg>
`);
console.log('traced', W, H, 'shield', shieldW, (wPath||'').length, (kPath||'').length);
