// Contrast at the stops (DM5, color I1): text colour (computed, × opacity) against the WORST background pixel
// region behind the text box (90th-percentile luminance of pixels that are not glyph pixels).
import { chromium } from 'playwright';
import sharp from 'sharp';
const L = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const CHECKS = [
  ['desktop', '.act-chapters', 0.1, '[data-chapter="1"] .chapter__text .body'],
  ['desktop', '.act-chapters', 0.5, '[data-chapter="2"] .chapter__text .display--l'],
  ['desktop', '.act-chapters', 0.9, '[data-chapter="3"] .chapter__text .body'],
  ['desktop', '.act-services', 0.42, '[data-svc="2"] .svc__text .display--l'],
  ['desktop', '.peak__stage', 0.62, '.peak__line--2'],
  ['desktop', '.peak__stage', 1, '.peak__release .label'],
  ['desktop', null, '.act-statement', '.statement .word'],
  ['desktop', null, '.act-inventory', '.chapter--inv .inv__list a'],
  // taste pass 2026-09-24: the quieter header (ink-2) over the two photographic grounds it crosses,
  // the hero lead (now sentence-case sans), and both peak lines on the composed final frame
  ['desktop', null, '.act-hero', '.util__item'],
  ['desktop', null, '.act-hero', '.nav li:nth-child(2) a'],
  ['desktop', null, '.act-hero', '.hero__title .lead'],
  ['desktop', '.door-pin', 0.35, '.nav li:nth-child(5) a'],
  ['desktop', '.door-pin', 0.35, '.util__right .util__item'],
  ['desktop', '.peak__stage', 1, '.peak__line--1'],
  ['desktop', '.peak__stage', 0.45, '.peak__line--2'],
  ['mobile', '.peak__stage', 1, '.peak__line--2'],
  ['mobile', '.peak__stage', 0.62, '.peak__line--2'],
  ['mobile', '.peak__stage', 1, '.peak__release .label'],
];
const b = await chromium.launch({ channel: 'chrome' });
const out = [];
for (const vpName of ['desktop', 'mobile']) {
  const p = await b.newPage({ viewport: vpName === 'desktop' ? { width: 1440, height: 900 } : { width: 390, height: 844 } });
  await p.goto('http://127.0.0.1:5174/', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  for (const [v, pin, pos, sel] of CHECKS.filter((c) => c[0] === vpName)) {
    const y = await p.evaluate(([pin, pos]) => {
      if (pin) { const t = __ST.getAll().find((t) => t.pin && t.trigger.matches(pin)); return t.start + pos * (t.end - t.start); }
      if (pos === '.act-hero') return 0;
      const r = document.querySelector(pos).getBoundingClientRect(); return r.top + scrollY + r.height / 2 - innerHeight / 2;
    }, [pin, pos]);
    await p.evaluate((y) => __lenis.scrollTo(y, { immediate: true, force: true }), y);
    await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('[data-header]')?.classList.remove('is-collapsed')); // measure the full header
    await p.waitForTimeout(500);
    const box = await p.evaluate((sel) => {
      const el = document.querySelector(sel); const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      let o = 1; for (let n = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
      return { x: Math.max(0, r.left), y: Math.max(0, r.top), w: Math.min(r.width, innerWidth - r.left), h: Math.min(r.height, innerHeight - r.top), color: cs.color, o };
    }, sel);
    const buf = await p.screenshot({ clip: { x: box.x, y: box.y, width: box.w, height: box.h } });
    const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const lums = []; for (let i = 0; i < info.width * info.height; i++) lums.push(L(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]));
    lums.sort((a, b) => a - b);
    const [r, g, bb] = box.color.match(/[\d.]+/g).map(Number);
    const bg90 = lums[Math.floor(lums.length * 0.6)]; // glyphs are the brightest ~40% at most; below that is ground
    const bgMed = lums[Math.floor(lums.length * 0.3)];
    // text composite against the median background
    const txtL = L(r * box.o + 0 * (1 - box.o), g * box.o, bb * box.o) + (1 - box.o) * bgMed;
    out.push({ v, sel, at: pin ? `${pin} ${pos}` : pos, textOpacity: +box.o.toFixed(2), worstBg: +ratio(txtL, bg90).toFixed(2), medianBg: +ratio(txtL, bgMed).toFixed(2) });
  }
  await p.close();
}
await b.close();
console.table(out);
