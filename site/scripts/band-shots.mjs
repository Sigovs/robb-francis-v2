// Band shots (critique 2026-09-24): the viewports between the two authored ones, where layouts are least
// looked at. Per band: the header over the hero, the peak at entry / mid-rise / final, the closing and the last
// frame. Also records overlaps that must never happen, measured as rects, not by eye:
//   - nav/utility items wrapping or touching the shield
//   - the peak's stand-in disclosure on the release, or either on the car's body
//   node scripts/band-shots.mjs [--only=peak]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const URL = process.env.URL || 'http://127.0.0.1:5173/';
const OUT = '_shots/bands';
await fs.mkdir(OUT, { recursive: true });
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const BANDS = [[768, 1024], [1024, 768], [1180, 820], [1280, 720], [1440, 900], [390, 844], [360, 740]];

const b = await chromium.launch({ channel: 'chrome' });
const report = {};
for (const [w, h] of BANDS) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(URL, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1600);
  const go = async (y) => {
    await p.evaluate((y) => { (window.__lenis ? __lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y)); window.__ST?.update(); }, y);
    await p.waitForTimeout(500);
    await p.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete && i.getBoundingClientRect().top < innerHeight * 1.5).map((i) => new Promise((r) => { i.loading = 'eager'; i.onload = i.onerror = r; setTimeout(r, 3000); }))));
    await p.waitForTimeout(150);
  };
  const shot = (name) => p.screenshot({ path: `${OUT}/${w}x${h}-${name}.png` });
  const rec = {};
  if (!only.length || only.includes('hero')) {
    await go(0); await shot('hero');
    rec.header = await p.evaluate(() => {
      const R = (e) => e.getBoundingClientRect();
      const hit = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
      const vis = (e) => { const cs = getComputedStyle(e); const r = R(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0; };
      const shield = R(document.querySelector('.brand img'));
      const items = [...document.querySelectorAll('.util__item, .util .btn, .nav a, .menu-toggle, .util-call')].filter(vis);
      const lines = items.map((e) => ({ t: e.textContent.trim().replace(/\s+/g, ' '), lines: Math.round(R(e).height / parseFloat(getComputedStyle(e).lineHeight || 20)) }));
      return {
        touchingShield: items.filter((e) => hit(R(e), shield)).map((e) => e.textContent.trim()),
        wrapped: items.filter((e) => e.matches('.nav a, .util__item') && e.getClientRects().length > 1).map((e) => e.textContent.trim()),
        apptVisible: items.some((e) => /By Appointment Only/i.test(e.textContent) && vis(e)),
        headerBottom: Math.round(R(document.querySelector('.site-header')).bottom),
        drawerMode: vis(document.querySelector('.menu-toggle')),
      };
    });
  }
  if (!only.length || only.includes('peak')) {
    const st = await p.evaluate(() => { const t = __ST?.getAll().find((t) => t.pin && t.trigger.matches('.peak__stage')); return t ? [t.start, t.end] : null; });
    if (st) {
      for (const [k, prog] of [['peak-0', 0], ['peak-40', 0.4], ['peak-final', 1]]) { await go(st[0] + prog * (st[1] - st[0])); await shot(k); }
    } else { await p.evaluate(() => document.querySelector('.peak__stage').scrollIntoView()); await p.waitForTimeout(400); await shot('peak-final'); }
    rec.peakFinal = await p.evaluate(() => {
      const R = (s) => document.querySelector(s).getBoundingClientRect();
      const hit = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
      const car = R('.peak__car'), rel = R('.peak__release'), sd = R('.peak__release .standin'), l1 = R('.peak__line--1'), nav = document.querySelector('.site-header').getBoundingClientRect();
      const relItems = [...document.querySelectorAll('.peak__release-a > *, .peak__release-b > *')].map((e) => e.getBoundingClientRect());
      // the car's BODY box (the frame carries a 5% feather each side)
      const body = { left: car.left + car.width * 0.05, right: car.right - car.width * 0.05, top: car.top + car.width * 0.041, bottom: car.bottom };
      return {
        l1ClearsHeader: Math.round(l1.top - nav.bottom),
        standinOnRelease: [...document.querySelectorAll('.peak__release-b > *')].some((e) => hit(sd, e.getBoundingClientRect())),
        releaseItemsOnCar: relItems.filter((r) => hit(r, body)).length,
        carWidthVw: +(100 * (body.right - body.left) / innerWidth).toFixed(1),
        carOvershootsBottom: Math.round(car.bottom - innerHeight),
        releaseBottomInFrame: rel.bottom <= innerHeight,
      };
    });
  }
  if (!only.length || only.includes('closing')) {
    await go(await p.evaluate(() => document.querySelector('.act-closing').getBoundingClientRect().top + scrollY)); await shot('closing');
    await go(await p.evaluate(() => document.documentElement.scrollHeight)); await shot('last');
  }
  rec.hscroll = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  report[`${w}x${h}`] = rec;
  await p.close();
}
await b.close();
await fs.writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
