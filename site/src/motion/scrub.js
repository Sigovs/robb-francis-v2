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

function frameCanvas(canvas, { contain = false, containScale = 1, onPaint } = {}) {
  const base = canvas.dataset.frames;
  const count = +canvas.dataset.count;
  const ctx = canvas.getContext('2d');
  const imgs = new Array(count);
  let drawn = -1, want = 0, started = false;
  let box = null;                                   // last paint rect on the canvas (device px)

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
      box = { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
      ctx.drawImage(img, box.x, box.y, w, h);
      return;
    }
    // contain: the whole car, a little inside the frame and low, every edge dissolved into the page ground —
    // the studio wall above it becomes the reading field for the title (desktop), the band fits a phone
    const ground = getComputedStyle(document.documentElement).getPropertyValue('--c-ground').trim() || '#12161d';
    const k = containScale;
    const s = Math.min((cw / iw) * k, (ch / ih) * 1.1), w = iw * s, h = ih * s, x = (cw - w) / 2, y = (ch - h) / 2 + ch * 0.1;
    ctx.fillStyle = ground; ctx.fillRect(0, 0, cw, ch);
    box = { x, y, w, h };
    ctx.drawImage(img, x, y, w, h);
    const fade = (x0, y0, x1, y1, rx, ry, rw, rh) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, ground); g.addColorStop(1, ground + '00');
      ctx.fillStyle = g; ctx.fillRect(rx, ry, rw, rh);
    };
    const eh = h * 0.28, ew = w * 0.14;
    fade(0, y, 0, y + eh, 0, y, cw, eh);                     // top
    fade(0, y + h, 0, y + h - eh, 0, y + h - eh, cw, eh);    // bottom
    if (x > 0) { fade(x, 0, x + ew, 0, x, y, ew, h); fade(x + w, 0, x + w - ew, 0, x + w - ew, y, ew, h); }   // sides
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
    onPaint?.();
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
  // image point (0–1) → CSS px within the canvas, through the same fit as the paint
  const map = (xf, yf) => { if (!box) return null; const d = canvas.width / canvas.clientWidth || 1; return { x: (box.x + xf * box.w) / d, y: (box.y + yf * box.h) / d }; };
  return { count, draw, size, load, map, get frame() { return drawn; } };
}

export function scrubSection(section, { mobile = false } = {}) {
  const canvas = section.querySelector('.scrub__canvas');
  if (!canvas) return;
  const turn = section.classList.contains('act-turn');
  const fc = frameCanvas(canvas, { contain: turn, containScale: mobile ? 1.12 : 0.9 });
  const ro = new ResizeObserver(() => fc.size());
  ro.observe(canvas);
  const near = ScrollTrigger.create({ trigger: section, start: 'top bottom+=200%', onEnter: fc.load, onEnterBack: fc.load });
  if (ScrollTrigger.isInViewport(section, -1)) fc.load();

  // soft arrival (Alex, 2026-09-28: "softer"): the copy block rises out of a blur once, early in the run
  const soft = section.querySelector('[data-soft-in]');
  const ins = soft ? [...soft.children] : [...section.querySelectorAll('[data-scrub-in]')];

  const isTurn = section.classList.contains('act-turn');
  const run = isTurn ? (mobile ? 280 : 400) : (mobile ? 160 : 230);   // film run, % of a screen (the turn: slow, Alex 2026-09-28)
  // About hands over by being covered (Alex: "on the last scroll the film darkens and goes into the background"):
  // it stays pinned one more screen while the next section slides up over it (Forge's stacking).
  const next = !isTurn ? section.parentElement.querySelector('.act-turn') : null;
  const overlap = next ? 100 : 0;
  const dark = next ? 70 : 0;                                  // the film goes into the dark of the ground, THEN the next scene arrives
  if (next) next.style.marginTop = mobile ? '-100svh' : '-100vh';   // the next scene enters during the last screen of this pin
  const total = run + dark + overlap;
  const f = run / total;                                       // share of the timeline that plays the film
  const fd = (run + dark) / total;                             // …and the end of the dark

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${total}%`, pin: true, scrub: 1, anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => fc.draw(Math.round(Math.min(1, self.progress / f) * (fc.count - 1))),
    },
  });
  tl.to({}, { duration: 1 }, 0);
  if (ins.length) tl.fromTo(ins, { autoAlpha: 0, y: 24, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.16 * f, stagger: 0.045 * f, ease: 'power2.out' }, 0.03 * f);

  const stage = section.querySelector('.scrub__stage');
  const inset = section.querySelector('[data-rise]');
  const dim = section.querySelector('.scrub__dim');
  if (soft) tl.fromTo(soft, { y: () => innerHeight * 0.06 }, { y: () => -innerHeight * 0.06, duration: f }, 0);   // the copy drifts up
  if (inset) {
    tl.fromTo(inset, { y: () => innerHeight * 0.75 }, { y: 0, duration: 0.62 * f, ease: 'power2.out' }, 0.1 * f)   // rises from below
      .fromTo(inset.querySelector('img'), { scale: 1.12 }, { scale: 1, duration: 0.62 * f }, 0.1 * f)
      .to(inset, { y: () => -innerHeight * 0.05, duration: 0.28 * f }, 0.72 * f);
  }
  if (overlap) {                                               // into the dark: the film only darkens to the page ground (no scale, Alex)
    tl.to(dim, { opacity: 0.94, duration: fd - f, ease: 'power1.in' }, f)
      .to([soft, inset].filter(Boolean), { autoAlpha: 0, y: '-=30', filter: 'blur(10px)', duration: 0.7 * (fd - f), ease: 'power1.in' }, f)
      .to(dim, { opacity: 1, duration: 1 - fd }, fd);
  }

  return () => {
    tl.scrollTrigger?.kill(); tl.kill(); near.kill(); ro.disconnect();
    if (next) next.style.marginTop = '';
    gsap.set([...ins, soft, inset, stage, dim].filter(Boolean), { clearProps: 'opacity,visibility,transform,filter' });
    section.classList.remove('is-live');
  };
}
