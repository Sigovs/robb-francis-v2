// Floors + paths: type floors (I7 14px, I10 display ≥ 40px), Lenis contract (DNA90), reduced-motion and no-JS paths.
import { chromium } from 'playwright';
const URL_ = process.env.URL || 'http://127.0.0.1:5174/';
const b = await chromium.launch({ channel: 'chrome' });
const res = {};
for (const [tag, w, h] of [['d', 1440, 900], ['m', 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(URL_, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  res[tag] = await p.evaluate(() => {
    const out = { minSans: 99, minSansText: '', minDisplay: 999, minDisplayText: '', displayFamily: '' };
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('.sr-only,[hidden],script,style,svg')) continue;
      if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect(); if (!r.width) continue;
      const fs = parseFloat(cs.fontSize), fam = cs.fontFamily;
      const isDisplay = /Noto Serif Display|Editorial/.test(fam.split(',')[0] + fam.split(',')[1]) && !/Geist/.test(fam.split(',')[0]);
      if (isDisplay) { if (fs < out.minDisplay) { out.minDisplay = fs; out.minDisplayText = el.textContent.trim().slice(0, 30); } out.displayFamily = fam; }
      else if (fs < out.minSans) { out.minSans = fs; out.minSansText = el.textContent.trim().slice(0, 30); }
    }
    const used = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.stretch);
    out.fontsLoaded = [...new Set(used)];
    out.lenis = !!window.__lenis && document.documentElement.classList.contains('lenis');
    out.lenisOptions = window.__lenis ? { autoRaf: window.__lenis.options.autoRaf, anchors: window.__lenis.options.anchors } : null;
    out.videoSrc = document.querySelector('.hero__video').currentSrc;
    out.videoPlaying = !document.querySelector('.hero__video').paused;
    out.panels = document.querySelectorAll('.door__panel').length;
    return out;
  });
  await p.close();
}
// reduced motion
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(URL_, { waitUntil: 'networkidle' });
  res.reduced = await p.evaluate(() => ({ lenis: !!window.__lenis, htmlLenisClass: document.documentElement.classList.contains('lenis'),
    videoPlaying: !document.querySelector('.hero__video').paused, toggle: document.querySelector('[data-video-toggle]').textContent.trim(),
    panelVisibility: getComputedStyle(document.querySelector('.door__panel')).visibility }));
  await p.evaluate(() => document.querySelector('.act-door').scrollIntoView());
  await p.waitForTimeout(600);
  await p.screenshot({ path: '_shots/reduced-2-door.png' });
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  await p.screenshot({ path: '_shots/reduced-1-hero.png' });
  await ctx.close();
}
// scripts removed
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage(); await p.goto(URL_, { waitUntil: 'networkidle' }).catch(() => {});
  await p.waitForTimeout(800);
  await p.screenshot({ path: '_shots/nojs-full.png', fullPage: true });
  res.nojs = await p.title();
  await ctx.close();
}
console.log(JSON.stringify(res, null, 1));
await b.close();
