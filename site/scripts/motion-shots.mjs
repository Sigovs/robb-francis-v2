// Motion verification: stops the scroll at named positions (DNA87, MJ4) and records each as a frame.
// Scrolls through Lenis (DNA90): lenis.scrollTo(y, { immediate: true }), never window.scrollTo.
//   node scripts/motion-shots.mjs [desktop|mobile|reduced|all] [--only=door,peak]
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';

const URL = process.env.URL || 'http://127.0.0.1:5174/';
const OUT = '_shots/motion';
await fs.mkdir(OUT, { recursive: true });
const mode = process.argv[2] || 'all';
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);

const VIEWS = {
  desktop: { viewport: { width: 1440, height: 900 }, prefix: 'd' },
  mobile: { viewport: { width: 390, height: 844 }, prefix: 'm', isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  reduced: { viewport: { width: 1440, height: 900 }, prefix: 'r', reducedMotion: 'reduce' },
};

/** Stops, resolved in the page: pinned acts by their ScrollTrigger progress, the rest by element position. */
function planStops(prefix) {
  const ST = window.__ST;
  const pins = ST ? ST.getAll().filter((t) => t.pin) : [];
  const pinOf = (sel) => pins.find((t) => t.trigger.matches(sel));
  const at = (sel, p) => { const t = pinOf(sel); return t ? t.start + p * (t.end - t.start) : null; };
  const top = (sel, off = 0) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return r.top + scrollY + off * innerHeight; };
  const mid = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return r.top + scrollY + r.height / 2 - innerHeight / 2; };
  const s = [];
  const add = (group, name, y) => { if (y != null) s.push({ group, name: `${prefix}-${name}`, y: Math.max(0, Math.round(y)) }); };
  add('hero', '01-hero', 0);
  if (pinOf('.door-pin')) {
    [0, 0.2, 0.35, 0.5, 0.65, 0.85].forEach((p, i) => add('door', `02-door-${i + 1}-${Math.round(p * 100)}`, at('.door-pin', p)));
  } else {
    const st = ST?.getAll().find((t) => t.trigger.matches?.('.door-stage--m'));
    if (st) [0, 0.3, 0.55, 0.85].forEach((p, i) => add('door', `02-door-${i + 1}-${Math.round(p * 100)}`, st.start + p * (st.end - st.start)));
    else add('door', '02-door', top('.act-door'));
  }
  add('door', '02-door-7-about', mid('.about'));
  if (pinOf('.act-chapters')) [0.1, 0.3, 0.5, 0.63, 0.9].forEach((p, i) => add('chapters', `03-ch-${i + 1}-${Math.round(p * 100)}`, at('.act-chapters', p)));
  else ['[data-chapter="1"]', '[data-chapter="2"]', '[data-chapter="3"]'].forEach((c, i) => add('chapters', `03-ch-${i + 1}`, top(c)));
  add('statement', '04-statement-in', top('.act-statement', -0.45));
  add('statement', '04-statement', mid('.statement'));
  if (pinOf('.act-services')) [0.1, 0.2, 0.42, 0.68, 0.95].forEach((p, i) => add('services', `05-svc-${i + 1}-${Math.round(p * 100)}`, at('.act-services', p)));
  else ['[data-svc="1"]', '[data-svc="3"]'].forEach((c, i) => add('services', `05-svc-${i + 1}`, top(c)));
  add('peak', '06-peak-0-silence', mid('.peak__silence'));
  if (pinOf('.peak__stage')) [0, 0.25, 0.45, 0.62, 0.8, 1].forEach((p, i) => add('peak', `06-peak-${i + 1}-${Math.round(p * 100)}`, at('.peak__stage', p)));
  else add('peak', '06-peak', top('.peak__stage'));
  add('sold', '07-sold', mid('.act-sold'));
  add('inventory', '07-inventory-in', top('.act-inventory', -0.5));
  add('inventory', '07-inventory', top('.act-inventory'));
  add('closing', '08-closing', top('.act-closing'));
  return s;
}

async function goTo(p, y) {
  await p.evaluate(async (y) => {
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
    window.__ST?.update();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, y);
  await p.waitForTimeout(450);
}

/** Frame-time sweep: scroll the whole page through Lenis in small steps, one step per frame. */
async function sweep(p) {
  return p.evaluate(async () => {
    const long = [];
    let po;
    try { po = new PerformanceObserver((l) => l.getEntries().forEach((e) => long.push(Math.round(e.duration)))); po.observe({ type: 'longtask', buffered: false }); } catch {}
    const max = document.documentElement.scrollHeight - innerHeight;
    const deltas = [];
    let last = performance.now();
    for (let y = 0; y <= max; y += 24) {
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      const now = performance.now(); deltas.push(now - last); last = now;
    }
    po?.disconnect();
    deltas.sort((a, b) => a - b);
    const pct = (q) => Math.round(deltas[Math.floor(q * (deltas.length - 1))] * 10) / 10;
    return { frames: deltas.length, p50: pct(0.5), p95: pct(0.95), p99: pct(0.99), over50ms: deltas.filter((d) => d > 50).length, longTasks: long };
  });
}

const report = {};
const b = await chromium.launch({ channel: 'chrome' });
for (const [key, v] of Object.entries(VIEWS)) {
  if (mode !== 'all' && mode !== key) continue;
  const ctx = await b.newContext({ viewport: v.viewport, isMobile: v.isMobile, hasTouch: v.hasTouch, deviceScaleFactor: v.deviceScaleFactor || 1, reducedMotion: v.reducedMotion || 'no-preference' });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto(URL, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1800);
  const stops = (await p.evaluate(planStops, v.prefix)).filter((s) => !only.length || only.includes(s.group));
  const rec = { stops: [], errors };
  for (const s of stops) {
    await goTo(p, s.y);
    // eager-load anything lazy that is now in view, then settle
    await p.evaluate(() => Promise.all([...document.images].filter((i) => !i.complete && i.getBoundingClientRect().top < innerHeight * 1.5 && i.getBoundingClientRect().bottom > -innerHeight).map((i) => new Promise((r) => { i.loading = 'eager'; i.onload = i.onerror = r; setTimeout(r, 3000); }))));
    await p.waitForTimeout(250);
    const file = `${OUT}/${s.name}.png`;
    await p.screenshot({ path: file });
    const hscroll = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    rec.stops.push({ ...s, file, hscroll });
  }
  if (!only.length) rec.sweep = await sweep(p);
  report[key] = rec;
  await ctx.close();
}
await b.close();
await fs.writeFile(`${OUT}/report-${mode}.json`, JSON.stringify(report, null, 2));
for (const [k, r] of Object.entries(report)) {
  console.log(k, 'errors:', r.errors.length ? r.errors : 'none', 'sweep:', JSON.stringify(r.sweep || {}));
  console.log('  hscroll>0 at:', r.stops.filter((s) => s.hscroll > 0).map((s) => s.name).join(', ') || 'none');
  console.log('  ', r.stops.map((s) => `${s.name}@${s.y}`).join('  '));
}

// contact sheet per view
for (const [k, r] of Object.entries(report)) {
  const W = 360, H = Math.round(W * (VIEWS[k].viewport.height / VIEWS[k].viewport.width)), cols = k === 'mobile' ? 8 : 5;
  const tiles = await Promise.all(r.stops.map((s) => sharp(s.file).resize(W, H).toBuffer()));
  const rows = Math.ceil(tiles.length / cols);
  await sharp({ create: { width: W * cols, height: H * rows, channels: 3, background: '#333' } })
    .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * W, top: Math.floor(i / cols) * H })))
    .jpeg({ quality: 82 }).toFile(`${OUT}/_sheet-${k}.jpg`);
}
