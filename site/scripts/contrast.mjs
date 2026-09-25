// AA on the COMPOSITED render (color I6): for every visible text element at each stop, hide all text,
// screenshot the plate beneath, and measure the brightest 5% of pixels under the glyph box (worst case).
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const URL_ = process.env.URL || 'http://127.0.0.1:5174/';
const vps = [['d', 1440, 900], ['m', 390, 844]];
const stops = ['.act-hero', '.act-door', '.about', '[data-chapter="1"]', '[data-chapter="2"]', '[data-chapter="3"]', '.act-statement',
  '[data-svc="1"]', '[data-svc="2"]', '[data-svc="3"]', '[data-svc="4"]', '.peak__stage', '.act-sold', '.act-inventory', '.act-closing', '.site-footer'];
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const out = [];
async function measure(p, tag, sel) {
    const items = await p.evaluate(() => {
    const res = [];
    const els = document.querySelectorAll('a, button, p, h1, h2, h3, li, span.label, figcaption span, .display, .body');
    for (const el of els) {
      if ((!el.offsetParent && getComputedStyle(el).position !== 'fixed') || el.closest('.sr-only,[hidden]')) continue;
      const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const range = document.createRange(); range.selectNodeContents(el);
      for (const r of range.getClientRects()) {
        if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
        res.push({ text: el.textContent.trim().slice(0, 40), color: cs.color, fs: parseFloat(cs.fontSize), fw: +cs.fontWeight,
          x: Math.max(0, r.left), y: Math.max(0, r.top), w: Math.min(innerWidth, r.right) - Math.max(0, r.left), h: Math.min(innerHeight, r.bottom) - Math.max(0, r.top) });
      }
    }
    return res;
  });
  await p.addStyleTag({ content: '*{color:transparent!important;caret-color:transparent!important} .btn{border-color:transparent!important} .scroll-cue__line,.menu-toggle__bars{visibility:hidden}' });
  await p.waitForTimeout(80);
  const buf = await p.screenshot();
  await p.evaluate(() => document.querySelectorAll('style').forEach(s => { if (s.textContent.startsWith('*{color:transparent')) s.remove(); }));
  await p.waitForTimeout(80);
  const withText = await sharp(await p.screenshot()).raw().toBuffer();
  await p.evaluate(() => document.querySelectorAll('style').forEach(s => { if (s.textContent.startsWith('*{color:transparent')) s.remove(); }));
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  for (const it of items) {
    const [tr, tg, tb, ta = 1] = it.color.match(/[\d.]+/g).map(Number);
    const lums = [], all = [];
    for (let yy = Math.floor(it.y); yy < Math.min(info.height, Math.ceil(it.y + it.h)); yy++)
      for (let xx = Math.floor(it.x); xx < Math.min(info.width, Math.ceil(it.x + it.w)); xx++) {
        const i = (yy * info.width + xx) * info.channels;
        const l = L(data[i], data[i + 1], data[i + 2]); all.push(l);
        const d = Math.abs(withText[i] - data[i]) + Math.abs(withText[i + 1] - data[i + 1]) + Math.abs(withText[i + 2] - data[i + 2]);
        if (d > 60) lums.push(l); // pixels the glyphs actually cover
      }
    if (lums.length < 12) lums.push(...all);
    if (!lums.length) continue;
    lums.sort((a, c) => a - c);
    const bg = lums[Math.floor(lums.length * 0.95)];
    const Lt = L(tr, tg, tb);
    const ratio = Lt > bg ? (Lt + 0.05) / (bg + 0.05) : (bg + 0.05) / (Lt + 0.05);
    const large = it.fs >= 24 || (it.fs >= 18.66 && it.fw >= 700);
    const need = large ? 3 : 4.5;
    out.push({ vp: tag, stop: sel, text: it.text, fs: it.fs, ratio: +ratio.toFixed(2), need, pass: ratio >= need });
  }
}
const b = await chromium.launch({ channel: 'chrome' });
for (const [tag, w, h] of vps) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(URL_, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach(i => (i.loading = 'eager')));
  await p.waitForLoadState('networkidle'); await p.waitForTimeout(1200);
  for (const sel of stops) {
    const y = await p.evaluate(s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + scrollY : null; }, sel);
    if (y == null) continue;
    await p.evaluate(y => window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y), y);
    await p.waitForTimeout(350);
    const frames = (sel === '.act-hero') ? [0, 1.2, 2.4, 3.6, 4.8, 6.0, 6.9] : [null];
    for (const t of frames) {
      if (t != null) await p.evaluate(async (t) => { const v = document.querySelector('.hero__video'); if (!v || !v.src) return; v.pause(); v.currentTime = t; await new Promise(r => v.addEventListener('seeked', r, { once: true })); v.classList.add('is-playing'); }, t);
      await measure(p, tag, t != null ? sel + ' @' + t + 's' : sel);
    }
  }
  await p.close();
}
await b.close();
await fs.writeFile('_shots/contrast.json', JSON.stringify(out, null, 1));
const fails = out.filter(o => !o.pass);
const worst = {}; for (const o of out) { const k = o.vp + ' ' + o.stop; if (!worst[k] || o.ratio < worst[k].ratio) worst[k] = o; }
console.log('measured', out.length, 'fails', fails.length);
console.log(fails.map(f => `${f.vp} ${f.stop} "${f.text}" ${f.fs}px ${f.ratio} < ${f.need}`).join('\n'));
console.log('--- min per stop'); for (const [k, o] of Object.entries(worst)) console.log(k, o.ratio, `"${o.text}"`);
