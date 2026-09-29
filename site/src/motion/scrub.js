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

export function frameCanvas(canvas, { contain = false, containScale = 1, lower = 0.1, shift = 0, pos, onPaint } = {}) {
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
      const [px, py] = pos ? pos() : [0.5, 0.5];              // like object-position (the v3 hero follows its still)
      box = { x: (cw - w) * px, y: (ch - h) * py, w, h };
      ctx.drawImage(img, box.x, box.y, w, h);
      return;
    }
    // contain: the whole car, a little inside the frame and low, every edge dissolved into the page ground —
    // the studio wall above it becomes the reading field for the title (desktop), the band fits a phone
    const ground = getComputedStyle(document.documentElement).getPropertyValue('--c-ground').trim() || '#12161d';
    const k = containScale;
    const s = Math.min((cw / iw) * k, (ch / ih) * 1.1), w = iw * s, h = ih * s, x = (cw - w) / 2 + cw * shift, y = (ch - h) / 2 + ch * lower;
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
  // shift: a film whose car ends wide (the v3 Ferrari, data-shift) sits a little left so the spec card keeps its air
  let placeCardLater = () => {};
  const fc = frameCanvas(canvas, { onPaint: () => placeCardLater(), contain: turn, containScale: mobile ? 1.12 : 0.84, lower: mobile ? 0.18 : 0.1, shift: mobile ? 0 : +(canvas.dataset.shift || 0), ...(canvas.dataset.lower && !mobile ? { lower: +canvas.dataset.lower } : {}) });
  const ro = new ResizeObserver(() => fc.size());
  ro.observe(canvas);
  const near = ScrollTrigger.create({ trigger: section, start: 'top bottom+=200%', onEnter: fc.load, onEnterBack: fc.load });
  if (ScrollTrigger.isInViewport(section, -1)) fc.load();

  // soft arrival (Alex, 2026-09-28: "softer"): the copy block rises out of a blur once, early in the run
  const soft = section.querySelector('[data-soft-in]');
  const ins = soft ? [...soft.children] : [...section.querySelectorAll('[data-scrub-in]')];

  const isTurn = section.classList.contains('act-turn');
  // appear in place instead of sliding up: the turn after About, and (v3, data-appear) About after the chapters —
  // it travels up hidden behind the section before it and fades up once that one has gone dark
  const appear = (isTurn && !!document.querySelector('.act-about')) || section.hasAttribute('data-appear');
  if (appear) gsap.set(section, { autoAlpha: 0 });
  if (section.hasAttribute('data-appear')) { section.style.marginTop = mobile ? '-100svh' : '-100vh'; section.style.zIndex = '3'; }   // over the section it covers (the chapters are z 3 too; later in the page wins)
  const run = isTurn ? (mobile ? 280 : 400) : (mobile ? 160 : 230);   // film run, % of a screen (the turn: slow, Alex 2026-09-28)
  // About hands over by being covered (Alex: "on the last scroll the film darkens and goes into the background"):
  // it stays pinned one more screen while the next section slides up over it (Forge's stacking).
  const next = !isTurn ? section.parentElement.querySelector('.act-turn') : null;
  const overlap = 0;                                           // no slide-over: the next scene appears in place (Alex)
  const dark = next ? 70 : 0;
  const exit = isTurn ? 60 : 0;                                // the walk-around fades out in place at the end
  const hold = isTurn ? +(canvas.dataset.hold || 50) : 40;   // v3 Ferrari: a long hold so the card can be read (data-hold, Alex 2026-09-29); otherwise a small pause on the last frame
  // the next scene sits right behind this pin (-1 screen): it reaches the top exactly as the dark completes, hidden
  // until then, and appears in place (fades up) instead of sliding in from below (Alex, 2026-09-28)
  if (next) next.style.marginTop = mobile ? '-100svh' : '-100vh';
  const total = run + hold + dark + overlap + exit;
  const f = run / total;                                       // share of the timeline that plays the film
  const fh = (run + hold) / total;                             // end of the pause on the last frame
  const fd = (run + hold + dark) / total;                      // …and the end of the dark
  const fe = (run + hold + dark + overlap) / total;            // start of the in-place exit

  // the spec card: once the turn reaches its last frames it flies in from the right BY ITSELF and completes, rows
  // cascading after it (Alex: "not scrubbed, it should arrive on its own"). It leaves only after a clear scroll back
  // (hysteresis 0.8 → 0.62), so it never flickers at the threshold.
  const card = section.querySelector('[data-card]');
  const copyBlock = section.querySelector('.turn__copy');
  const rows = card ? [card.querySelector('.spec-card__kicker'), card.querySelector('.spec-card__title'), ...card.querySelectorAll('dt, dd'), card.querySelector('.text-link')].filter(Boolean) : [];
  let cardOn = false;
  let cardAt = 0.8, cardOff = 0.62;                                          // set once the run's shares are known
  const FROM = () => (mobile ? 60 : Math.min(innerWidth * 0.1, 140));
  if (card) { gsap.set(card, { autoAlpha: 0, x: FROM, filter: 'blur(12px)' }); gsap.set(rows, { autoAlpha: 0, y: 10 }); }
  const toggleCard = (p) => {
    if (!card) return;
    const on = cardOn ? p > cardOff : p >= cardAt;
    if (on === cardOn) return;
    cardOn = on;
    gsap.killTweensOf([card, ...rows]);
    if (mobile && copyBlock) { gsap.killTweensOf(copyBlock); gsap.to(copyBlock, { autoAlpha: on ? 0 : 1, y: on ? -16 : 0, duration: on ? 0.45 : 0.6, ease: on ? 'power2.in' : 'power2.out' }); }
    if (on) {
      gsap.to(card, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' });
      gsap.to(rows, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.045, delay: 0.25, ease: 'power2.out' });
    } else {
      gsap.to(rows, { autoAlpha: 0, y: 6, duration: 0.25, stagger: { each: 0.02, from: 'end' }, ease: 'power1.in' });
      gsap.to(card, { autoAlpha: 0, x: FROM, filter: 'blur(12px)', duration: 0.55, delay: 0.1, ease: 'power2.in' });
    }
  };

  // v3: the turn's four stops light the numbered notes under the film, each when the turn reaches it (stop 2 →
  // note 01 …). Only state classes: no scrubbed text. (The 01—04 counter was removed, Alex 2026-09-29.)
  const notes = [...section.querySelectorAll('.turn-notes__item')];
  let lastStep = 0;
  const stops = (p) => {
    const step = Math.min(4, Math.floor(p * 4) + 1);
    if (step === lastStep) return;
    lastStep = step;
    notes.forEach((n, i) => { n.classList.toggle('is-active', i === step - 2); n.classList.toggle('is-past', i < step - 2); });
  };

  // v3 (Alex, 2026-09-29: "align the right part to something, closer to the car"): the hairline panel is placed
  // FROM THE CAR — its rule a fixed gap behind the car's tail, its middle on the car's middle — measured on the last
  // frame (data-car: x0,y0,x1,y1 of the frame, roll hoops to tyre contact) and mapped through the same fit as the paint.
  const carBox = canvas.dataset.car ? canvas.dataset.car.split(',').map(Number) : null;
  placeCardLater = () => placeCard();
  const placeCard = () => {
    if (!card || !carBox || mobile) return;
    const tail = fc.map(carBox[2], (carBox[1] + carBox[3]) / 2);
    if (!tail) return;
    const gap = Math.max(48, innerWidth * 0.045);
    const left = Math.round(tail.x + gap);
    card.style.left = `${left}px`;
    card.style.right = 'auto';
    card.style.width = `${Math.round(Math.min(352, innerWidth * 0.965 - left))}px`;
    card.style.top = `${Math.round(tail.y - card.offsetHeight / 2)}px`;
  };

  cardAt = f * 0.9; cardOff = f * 0.72;                        // the card lands on the last frames of the turn
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${total}%`, pin: true, scrub: 1, anticipatePin: 1,
      invalidateOnRefresh: true,
      // the walk-around appears in place when the About film has gone dark (it travelled up hidden behind it)
      onEnter: () => appear && gsap.to(section, { autoAlpha: 1, duration: 0.9, ease: 'power2.out', overwrite: true }),
      onLeaveBack: () => appear && gsap.to(section, { autoAlpha: 0, duration: 0.4, ease: 'power1.in', overwrite: true }),
      // never scroll away visible: when the pin lets go, the veil is complete whatever the scrub lag (Alex)
      onLeave: () => { const v = section.querySelector('.scrub__veil'); if (v && isTurn) { gsap.killTweensOf(v); gsap.set(v, { opacity: 1 }); } },
      onUpdate: (self) => { fc.draw(Math.round(Math.min(1, self.progress / f) * (fc.count - 1))); toggleCard(self.progress); stops(Math.min(1, self.progress / f)); },
    },
  });
  tl.to({}, { duration: 1 }, 0);
  if (ins.length) tl.fromTo(ins, { autoAlpha: 0, y: 24, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.16 * f, stagger: 0.045 * f, ease: 'power2.out' }, 0.03 * f);

  const stage = section.querySelector('.scrub__stage');
  const dim = section.querySelector('.scrub__dim');
  if (soft) tl.fromTo(soft, { y: () => innerHeight * 0.06 }, { y: () => -innerHeight * 0.06, duration: f }, 0);   // the copy drifts up
  const veil = section.querySelector('.scrub__veil');
  if (exit && veil) tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.6 * (1 - fe), ease: 'power1.in' }, fe);   // fully gone well before the pin lets go
  if (next) {                                                  // into the dark: the film only darkens to the page ground (no scale, Alex)
    tl.to(dim, { opacity: 0.94, duration: fd - fh, ease: 'power1.in' }, fh)
      .to([soft].filter(Boolean), { autoAlpha: 0, y: '-=30', filter: 'blur(10px)', duration: 0.7 * (fd - fh), ease: 'power1.in' }, fh)
      .to(dim, { opacity: 1, duration: 1 - fd }, fd);
  }

  return () => {
    tl.scrollTrigger?.kill(); tl.kill(); near.kill(); ro.disconnect();
    if (appear) gsap.set(section, { clearProps: 'opacity,visibility' });
    if (section.hasAttribute('data-appear')) { section.style.marginTop = ''; section.style.zIndex = ''; }
    if (veil) gsap.set(veil, { clearProps: 'opacity' });
    if (card) gsap.set([card, copyBlock, ...rows].filter(Boolean), { clearProps: 'opacity,visibility,transform,filter' });
    if (card && carBox) ['left', 'right', 'width', 'top'].forEach((k) => card.style.removeProperty(k));
    if (next) next.style.marginTop = '';
    gsap.set([...ins, soft, stage, dim].filter(Boolean), { clearProps: 'opacity,visibility,transform,filter' });
    section.classList.remove('is-live');
  };
}
