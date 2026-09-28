// ACTS 2–3 · a frame sequence scrubbed by the scroll (Alex, 2026-09-28): the E-Type drives away up the coast
// under the About paragraph, then the 356 turns on its stand. A canvas, not <video>.currentTime: seeking a
// video per scroll step stutters (Safari worst); pre-decoded WebP frames draw in a frame.
// Scrub is linear in the scroll range (G4), smoothed by scrub: 0.6 against Lenis. Frames load lazily when the
// section comes within two screens, first frame first. Progressive enhancement (G7): the <img> still stays
// underneath until the canvas has drawn, and without motion the still and the fully lit copy ARE the section.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pad = (i) => String(i + 1).padStart(3, '0');

function frameCanvas(canvas, { contain = false } = {}) {
  const base = canvas.dataset.frames;
  const count = +canvas.dataset.count;
  const ctx = canvas.getContext('2d');
  const imgs = new Array(count);
  let drawn = -1, want = 0, started = false;

  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    drawn = -1; draw(want);
  };
  // cover-fit like object-fit: cover; `contain` fits the width instead (the turntable on a phone: the whole car)
  const paint = (img) => {
    const cw = canvas.width, ch = canvas.height, iw = img.naturalWidth, ih = img.naturalHeight;
    if (!contain) {
      const s = Math.max(cw / iw, ch / ih), w = iw * s, h = ih * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      return;
    }
    // contain: a band a little wider than the screen, its top and bottom edges dissolved into the page ground
    const ground = getComputedStyle(document.documentElement).getPropertyValue('--c-ground').trim() || '#12161d';
    const s = Math.min((cw / iw) * 1.45, ch / ih), w = iw * s, h = ih * s, x = (cw - w) / 2, y = (ch - h) / 2 + ch * 0.08;
    ctx.fillStyle = ground; ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
    const edge = h * 0.3;
    for (const [y0, y1] of [[y, y + edge], [y + h, y + h - edge]]) {
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, ground); g.addColorStop(1, ground + '00');
      ctx.fillStyle = g; ctx.fillRect(0, Math.min(y0, y1), cw, edge);
    }
  };
  const nearestLoaded = (i) => {
    for (let d = 0; d < count; d++) {
      if (imgs[i - d]?.complete && imgs[i - d].naturalWidth) return i - d;
      if (imgs[i + d]?.complete && imgs[i + d].naturalWidth) return i + d;
    }
    return -1;
  };
  function draw(i) {
    want = i;
    const k = nearestLoaded(i);
    if (k < 0 || k === drawn || !canvas.width) return;
    paint(imgs[k]); drawn = k;
    canvas.closest('.act-scrub')?.classList.add('is-live');
  }
  const load = () => {
    if (started) return; started = true;
    const order = [0, ...Array.from({ length: count - 1 }, (_, i) => i + 1)];
    let next = 0;
    const pump = () => {
      if (next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => { if (Math.abs(i - want) < 3 || drawn < 0) draw(want); pump(); };
      img.src = `${base}${pad(i)}.webp`;
      imgs[i] = img;
    };
    for (let c = 0; c < 6; c++) pump();                      // six in flight
  };
  return { count, draw, size, load };
}

export function scrubSection(section, { mobile = false } = {}) {
  const canvas = section.querySelector('.scrub__canvas');
  if (!canvas) return;
  const fc = frameCanvas(canvas, { contain: mobile && section.classList.contains('act-turn') });
  const ro = new ResizeObserver(() => fc.size());
  ro.observe(canvas);
  const near = ScrollTrigger.create({ trigger: section, start: 'top bottom+=200%', onEnter: fc.load, onEnterBack: fc.load });
  if (ScrollTrigger.isInViewport(section, -1)) fc.load();

  // words of the About paragraph light up with the scroll
  const para = section.querySelector('[data-words]');
  let original;
  if (para) {
    original = para.innerHTML;
    para.innerHTML = para.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  }
  const words = para ? [...para.querySelectorAll('.w')] : [];
  const ins = [...section.querySelectorAll('[data-scrub-in]')];

  const run = section.classList.contains('act-turn') ? (mobile ? 140 : 190) : (mobile ? 160 : 230);   // % of a screen
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${run}%`, pin: true, scrub: 0.6, anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => fc.draw(Math.round(self.progress * (fc.count - 1))),
    },
  });
  tl.to({}, { duration: 1 }, 0);                              // the film spans the whole run
  if (ins.length) tl.fromTo(ins, { autoAlpha: 0, y: 16, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.12, stagger: 0.04 }, 0.02);
  if (words.length) tl.fromTo(words, { opacity: 0.16 }, { opacity: 1, duration: 0.05, stagger: 0.5 / words.length }, 0.08);

  return () => {
    tl.scrollTrigger?.kill(); tl.kill(); near.kill(); ro.disconnect();
    gsap.set(ins, { clearProps: 'opacity,visibility,transform,filter' });
    if (para) para.innerHTML = original;
    section.classList.remove('is-live');
  };
}
