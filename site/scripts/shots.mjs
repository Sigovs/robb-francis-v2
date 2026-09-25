// Screenshot every act at desktop 1440×900 and mobile 390×844, scrolling THROUGH Lenis.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const URL_ = process.env.URL || 'http://127.0.0.1:5174/';
const OUT = '_shots';
await fs.mkdir(OUT, { recursive: true });
const only = process.argv[2]; // 'd' | 'm'
const vps = [['d', 1440, 900], ['m', 390, 844]].filter(v => !only || v[0] === only);
const stops = [
  ['1-hero', '.act-hero'], ['2-door', '.act-door'], ['2b-about', '.about'],
  ['3a-ch01', '[data-chapter="1"]'], ['3b-ch02', '[data-chapter="2"]'], ['3c-ch03', '[data-chapter="3"]'],
  ['4-statement', '.act-statement'],
  ['5a-buy', '[data-svc="1"]'], ['5b-consign', '[data-svc="2"]'], ['5c-finance', '[data-svc="3"]'], ['5d-warranty', '[data-svc="4"]'],
  ['6a-silence', '.peak__silence'], ['6b-peak', '.peak__stage'],
  ['7a-sold', '.act-sold'], ['7b-inventory', '.act-inventory'],
  ['8-closing', '.act-closing'], ['9-footer', '.site-footer'],
];
const b = await chromium.launch({ channel: 'chrome' });
const report = {};
for (const [tag, w, h] of vps) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto(URL_, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { await document.fonts.ready; });
  // force lazy images to load
  await p.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach(i => (i.loading = 'eager')));
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(1500);
  const r = report[tag] = { hscroll: await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })) };
  for (const [name, sel] of stops) {
    const y = await p.evaluate((s) => { const el = document.querySelector(s); if (!el) return null; return el.getBoundingClientRect().top + window.scrollY; }, sel);
    if (y == null) continue;
    await p.evaluate((y) => { if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); }, y);
    await p.waitForTimeout(450);
    await p.screenshot({ path: `${OUT}/${tag}-${name}.png` });
  }
  // full page (scaled later)
  await p.evaluate(() => { window.__lenis?.scrollTo(0, { immediate: true, force: true }); window.scrollTo(0, 0); });
  await p.screenshot({ path: `${OUT}/${tag}-full.png`, fullPage: true });
  await p.close();
}
await fs.writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
await b.close();
