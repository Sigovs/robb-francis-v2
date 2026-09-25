// Glyph-pixel contrast (color-taste I6). The bounding-box method in motion-contrast.mjs reports a percentile of
// the text's RECTANGLE, which is mostly ground wherever a word crosses a car; this measures the pixels the glyphs
// actually cover. Per case: screenshot the region with the text visible and with it hidden (color: transparent),
// take the glyph CORE pixels (where the visible render is within 12% of the ink's luminance, so antialiased
// edges don't count), and compare the ink against the hidden render at exactly those pixels.
// Reports the worst core pixel (p0), the 5th percentile (p5) and the median. AA: 4.5 body, 3.0 for ≥ 24px.
//   node scripts/glyph-contrast.mjs
import { chromium } from 'playwright';
import sharp from 'sharp';

const URL = process.env.URL || 'http://127.0.0.1:5174/';
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// [viewport, pinned trigger or null, progress or selector to centre, text selector, floor]
const CASES = [
  ['desktop', null, 'top', '.display--hero', 3],
  ['desktop', null, 'top', '.hero__title .lead', 4.5],
  ['desktop', null, 'top', '.nav', 4.5],
  ['desktop', null, 'top', '.util', 4.5],
  ['desktop', '.door-pin', 0.35, '.nav', 4.5],
  ['desktop', '.door-pin', 0.35, '.util', 4.5],
  ['desktop', '.peak__stage', 0.45, '.peak__line--2', 3],
  ['desktop', '.peak__stage', 0.62, '.peak__line--2', 3],
  ['desktop', '.peak__stage', 0.8, '.peak__line--2', 3],
  ['desktop', '.peak__stage', 1, '.peak__line--1', 3],
  ['desktop', '.peak__stage', 1, '.peak__line--2', 3],
  ['desktop', '.act-chapters', 0.5, '[data-chapter="2"] .chapter__text', 4.5],
    ['desktop', null, '.act-closing', '.closing__copy', 4.5],
  // critique: the nav over the brightest plates, header EXPANDED (as it is on the way back up)
  ['desktop', '.act-services', 0.68, '.nav', 4.5],
  ['desktop', '.act-services', 0.42, '.nav', 4.5],
  ['desktop', '.act-services', 0.68, '.util', 4.5],
  ['desktop', '.door-pin', 0.5, '.nav', 4.5],
  ['desktop', '.door-pin', 0.85, '.nav', 4.5],
  ['desktop', '.door-pin', 0.85, '.door__kicker', 4.5],
  ['desktop', null, '.act-inventory', '.nav', 4.5],
  ['desktop', null, '.act-inventory', '.chapter--inv .chapter__text', 4.5],
  ['desktop', '.act-chapters', 0.5, '[data-chapter="2"] .chapter__text .body', 4.5],
  ['desktop', '.peak__stage', 1, '.peak__release', 4.5],
  ['mobile', '.peak__stage', 1, '.peak__release', 4.5],
  ['mobile', null, 'top', '.util', 4.5],
  ['mobile', null, 'top', '.hero__copy', 4.5],
  ['mobile', '.peak__stage', 0.62, '.peak__line--2', 3],
  ['mobile', '.peak__stage', 1, '.peak__line--1', 3],
  ['mobile', '.peak__stage', 1, '.peak__line--2', 3],
];

const b = await chromium.launch({ channel: 'chrome' });
const rows = [];
for (const vp of ['desktop', 'mobile']) {
  const p = await b.newPage({ viewport: vp === 'desktop' ? { width: 1440, height: 900 } : { width: 390, height: 844 } });
  await p.goto(URL, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(2200); // hero entrance finished
  for (const [v, pin, pos, sel, floor] of CASES.filter((c) => c[0] === vp)) {
    const y = await p.evaluate(([pin, pos]) => {
      if (pin) { const t = __ST.getAll().find((t) => t.pin && t.trigger.matches(pin)); return t.start + pos * (t.end - t.start); }
      if (pos === 'top') return 0;
      const r = document.querySelector(pos).getBoundingClientRect(); return r.top + scrollY;
    }, [pin, pos]);
    await p.evaluate((y) => { (window.__lenis ? __lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y)); __ST?.update(); }, y);
    await p.waitForTimeout(300);   // let the scroll's own frame run first (it may collapse the header)
    await p.evaluate(() => document.querySelector('[data-header]').classList.remove('is-collapsed'));   // measure the full header
    await p.waitForTimeout(600);
    const info = await p.evaluate((sel) => {
      const el = document.querySelector(sel); const r = el.getBoundingClientRect();
      const probe = el.matches('a, span, p, h1, h2, h3') ? el : el.querySelector('a, span, p, h1, h2, h3') || el;
      return { x: Math.max(0, Math.floor(r.left)), y: Math.max(0, Math.floor(r.top)), w: Math.floor(Math.min(r.right, innerWidth) - Math.max(0, r.left)), h: Math.floor(Math.min(r.bottom, innerHeight) - Math.max(0, r.top)), color: getComputedStyle(probe).color };
    }, sel);
    if (info.w < 4 || info.h < 4) { rows.push({ v, sel, at: pin ? `${pin} ${pos}` : pos, note: 'off-screen' }); continue; }
    const clip = { x: info.x, y: info.y, width: info.w, height: info.h };
    const shown = await p.screenshot({ clip });
    await p.addStyleTag({ content: `${sel}, ${sel} * { color: transparent !important; border-color: transparent !important; } ${sel} *::before, ${sel} *::after, ${sel}::after { opacity: 0 !important; }` }).then((h) => h.evaluate((n) => n.setAttribute('data-glyph-hide', '')));
    await p.waitForTimeout(80);
    const hidden = await p.screenshot({ clip });
    await p.evaluate(() => document.querySelectorAll('[data-glyph-hide]').forEach((n) => n.remove()));
    const A = await sharp(shown).removeAlpha().raw().toBuffer();
    const B = await sharp(hidden).removeAlpha().raw().toBuffer();
    const [tr, tg, tb] = info.color.match(/[\d.]+/g).map(Number);
    const tL = L(tr, tg, tb);
    const rs = [];
    for (let i = 0; i < A.length; i += 3) {
      const la = L(A[i], A[i + 1], A[i + 2]);
      if (Math.abs(la - tL) > tL * 0.12) continue;                    // not a glyph core pixel
      const lb = L(B[i], B[i + 1], B[i + 2]);
      if (Math.abs(la - lb) < 0.02) continue;                           // unchanged by hiding: not text
      rs.push(ratio(tL, lb));
    }
    rs.sort((a, b) => a - b);
    const q = (k) => (rs.length ? +rs[Math.floor(k * (rs.length - 1))].toFixed(2) : null);
    rows.push({ v, sel, at: pin ? `${pin} ${pos}` : pos, px: rs.length, p0: q(0), p5: q(0.05), median: q(0.5), floor, pass: rs.length ? q(0.05) >= floor : null });
  }
  await p.close();
}
// reduced motion: the hero is its poster (no film) — the critique found the nav failing there
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(URL, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  for (const sel of ['.nav', '.util', '.display--hero']) {
    const info = await p.evaluate((sel) => { const el = document.querySelector(sel); const r = el.getBoundingClientRect(); const probe = el.querySelector('a, span') || el; return { x: Math.floor(r.left), y: Math.floor(r.top), w: Math.floor(r.width), h: Math.floor(r.height), color: getComputedStyle(probe).color }; }, sel);
    const clip = { x: info.x, y: info.y, width: info.w, height: info.h };
    const shown = await p.screenshot({ clip });
    const h = await p.addStyleTag({ content: `${sel}, ${sel} * { color: transparent !important; border-color: transparent !important; } ${sel} *::before, ${sel} *::after { opacity: 0 !important; }` });
    await p.waitForTimeout(80); const hidden = await p.screenshot({ clip }); await h.evaluate((n) => n.remove());
    const A = await sharp(shown).removeAlpha().raw().toBuffer(), B = await sharp(hidden).removeAlpha().raw().toBuffer();
    const [tr, tg, tb] = info.color.match(/[\d.]+/g).map(Number); const tL = L(tr, tg, tb); const rs = [];
    for (let i = 0; i < A.length; i += 3) { const la = L(A[i], A[i + 1], A[i + 2]); if (Math.abs(la - tL) > tL * 0.12) continue; const lb = L(B[i], B[i + 1], B[i + 2]); if (Math.abs(la - lb) < 0.02) continue; rs.push(ratio(tL, lb)); }
    rs.sort((a, b) => a - b); const q = (k) => (rs.length ? +rs[Math.floor(k * (rs.length - 1))].toFixed(2) : null);
    rows.push({ v: 'reduced', sel, at: 'top', px: rs.length, p0: q(0), p5: q(0.05), median: q(0.5), floor: sel === '.display--hero' ? 3 : 4.5, pass: rs.length ? q(0.05) >= (sel === '.display--hero' ? 3 : 4.5) : null });
  }
  await ctx.close();
}
await b.close();
console.table(rows);
