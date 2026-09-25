// Capture current-inventory listing photos from rfsportscars.com (JS-rendered detail pages).
// Mockup only: listing photos are client assets (origin R), captured 2026-09-24.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const OUT = new URL('../_capture/', import.meta.url);
await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.rfsportscars.com/', { waitUntil: 'networkidle', timeout: 60000 });
const links = [...new Set(await page.$$eval('a[href*="-c-"]', as => as.map(a => a.href.split('#')[0])))];
console.log('car links', links);
const result = [];
for (const url of links) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const imgs = new Set();
  p.on('response', r => { const u = r.url(); if (/\.(jpe?g|png|webp)(\?|$)/i.test(u) && r.request().resourceType() === 'image') imgs.add(u); });
  try { await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); await p.waitForTimeout(2500); } catch (e) { console.log('ERR', url, e.message); }
  const title = await p.title();
  const domImgs = await p.$$eval('img', is => is.map(i => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight })).filter(i => i.w >= 600));
  result.push({ url, title, domImgs, net: [...imgs].slice(0, 60) });
  await p.close();
}
await fs.writeFile(new URL('inventory.json', OUT), JSON.stringify(result, null, 2));
await browser.close();
console.log(JSON.stringify(result.map(r => ({ url: r.url, title: r.title, n: r.domImgs.length, first: r.domImgs.slice(0, 3) })), null, 1));
