// Robb Francis Sports Cars — index.
// Scroll layer is live from the first build (DNA90). The choreography lives in src/motion/ (BRIEF §7–8),
// inside one gsap.matchMedia scoped to <main> — desktop, mobile and reduced motion authored separately.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initMotion } from './motion/index.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isMobile = window.matchMedia('(max-width: 767.98px)');
const drawerMode = window.matchMedia('(max-width: 1180px)'); // the nav lives in the drawer up to 1180px (critique: tablet band)

/* ---------- Lenis: one loop, on gsap.ticker; never constructed under reduced motion ---------- */
let lenis = null;
function startLenis() {
  if (lenis || reduceMotion.matches) return;
  lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.055, wheelMultiplier: 0.9 });   // a slower, heavier glide (Alex, 2026-09-28)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis; // verification hook: lenis.scrollTo(y, { immediate: true })
}
function lenisRaf(time) { lenis?.raf(time * 1000); }
function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(lenisRaf);
  lenis.destroy();
  lenis = null;
  window.__lenis = null;
}
startLenis();
reduceMotion.addEventListener('change', () => (reduceMotion.matches ? stopLenis() : startLenis()));

/* ---------- Motion scope (G1, G5): matchMedia is the context; revert() tears every branch down ---------- */
const ctx = initMotion(document.querySelector('main'));

/* ---------- Hero film: plays only when motion is allowed; the visitor keeps a pause control (MJ6) ---------- */
function initHeroVideo() {
  const video = document.querySelector('.hero__video');
  const toggle = document.querySelector('[data-video-toggle]');
  if (!video || !toggle) return;
  const label = toggle.querySelector('[data-video-label]');

  const pickSource = () => {
    if (isMobile.matches) return video.dataset.srcMobile;
    const av1 = video.canPlayType('video/mp4; codecs="av01.0.08M.08"');
    return av1 === 'probably' ? video.dataset.srcDesktopAv1 : video.dataset.srcDesktop;
  };
  const setState = (playing) => {
    toggle.setAttribute('aria-pressed', String(!playing));
    label.textContent = playing ? 'Pause film' : 'Play film';
  };

  toggle.hidden = false;
  let userPaused = false; // only the visitor's own Pause stops the film for good (MJ6)
  video.addEventListener('playing', () => { video.classList.add('is-playing'); setState(true); });
  video.addEventListener('pause', () => setState(false));

  const load = () => { if (!video.src) { video.src = pickSource(); } };
  const play = () => { load(); video.play().catch(() => setState(false)); };

  toggle.addEventListener('click', () => {
    if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
  });

  if (reduceMotion.matches) { userPaused = true; setState(false); return; } // poster + Play, per BRIEF §7
  // stream after LCP (the poster <img> is the LCP element)
  const start = () => play();
  if (document.readyState === 'complete') requestIdleCallback?.(start) ?? setTimeout(start, 200);
  else window.addEventListener('load', () => setTimeout(start, 150), { once: true });

  // pause offscreen / hidden tab (DNA94); resume when it comes back — the film keeps playing
  let inView = true;
  const sync = () => {
    if (userPaused) return; // visitor paused it: respect that
    if (video.ended) return; // v3 plays once: a finished film stays on its last frame
    if (inView && document.visibilityState === 'visible') { if (video.src && video.paused) video.play().catch(() => {}); }
    else if (!video.paused) video.pause();
  };
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.1 }).observe(video);
  document.addEventListener('visibilitychange', sync);
}
initHeroVideo();

/* ---------- Mobile drawer ---------- */
function initDrawer() {
  const btn = document.querySelector('[data-menu-toggle]');
  const drawer = document.querySelector('[data-drawer]');
  if (!btn || !drawer) return;
  const label = btn.querySelector('.menu-toggle__label');
  const set = (open) => {
    drawer.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
    document.documentElement.style.overflow = open ? 'hidden' : '';
    open ? lenis?.stop() : lenis?.start();
    if (open) drawer.querySelector('a')?.focus();
  };
  btn.addEventListener('click', () => set(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { set(false); btn.focus(); } });
  drawerMode.addEventListener('change', () => { if (!drawerMode.matches) set(false); });
}
initDrawer();

/* ---------- Header: collapses to its shield row after the hero on the way DOWN, returns on the way UP ----------
   (critique: content kept sliding under two rows of chrome; closer to Forge). Never collapsed over the hero, never
   while it holds focus, never while the drawer is open. Driven by the native scroll Lenis produces. */
function initHeaderCollapse() {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('.act-hero');
  if (!header || !hero) return;
  let last = window.scrollY, ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY, dy = y - last;
    if (Math.abs(dy) < 4) return;
    const run = hero.parentElement?.classList.contains('pin-spacer') ? hero.parentElement : hero;   // the hero pins now
    const past = y > run.offsetHeight * 0.8;
    const drawerOpen = document.querySelector('[data-drawer]')?.hidden === false;
    const focused = header.contains(document.activeElement) && document.activeElement !== document.body;
    // past the hero it stays put on a solid band (Alex, 2026-09-29: nothing may slide under the nav or show
    // through it, and the nav itself never moves)
    header.classList.toggle('is-solid', past);
    last = y;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  }
initHeaderCollapse();

// Teardown hook for a future router (G1)
window.addEventListener('pagehide', () => { ctx.revert(); stopLenis(); });


/* ---------- Hero field (2026-09-29): the title and the car never overlap, at any stop ----------
   The loop is stabilised, so the car holds one box in the film: x 0.335–0.65, y 0.385–0.745 of the frame (measured on
   frames 0/40/83 of hero-loop-master, with a margin). Map that box through the cover crop at this viewport, reserve
   the air left of it for the copy, and size the title so every message's longest line (plus the 32px slide-in)
   ends before the car. Landscape desktop only; the phone and portrait layouts put the copy off the film. */
const CAR = { x0: 0.335, y0: 0.385, x1: 0.65, y1: 0.745 };
// v3 scrubs the raw tracking shot (not the stabilised loop): the car wanders further right, to ~0.68 of the frame
// (measured on the 113 frames, OpenCV, 2026-09-29)
const CAR_SCRUB = { x0: 0.33, y0: 0.38, x1: 0.69, y1: 0.75 };
function heroField() {
  const hero = document.querySelector('.act-hero');
  const root = document.documentElement;
  if (!hero) return;
  const W = window.innerWidth, H = hero.clientHeight || window.innerHeight;
  if (W < 768 || W / H < 1) { ['--hero-field', '--hero-fs', '--hero-side'].forEach((k) => root.style.removeProperty(k)); return; }
  const media = hero.querySelector('.hero__video') || hero.querySelector('.hero__poster img');
  const [px, py] = (getComputedStyle(media).objectPosition || '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
  const s = Math.max(W / 1920, H / 1080), dw = 1920 * s;
  const car = hero.querySelector('.hero__canvas') ? CAR_SCRUB : CAR;
  const carLeft = (W - dw) * px + car.x0 * dw;
  const inset = W * 0.035, gap = Math.max(32, W * 0.025), travel = 32;
  const field = Math.max(160, carLeft - gap - inset);
  // widest title line across all three messages, as a multiple of the font size
  const lines = [...document.querySelectorAll('.hero__copy .display--hero .hl')];
  let ratio = 0;
  const probe = document.createElement('span');
  probe.className = 'display';
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:100px';
  document.body.append(probe);
  lines.forEach((l) => { probe.textContent = l.textContent.trim(); ratio = Math.max(ratio, probe.getBoundingClientRect().width / 100); });
  probe.remove();
  const cap = hero.hasAttribute('data-hero-scrub') ? Math.round(W * 0.05) : 128;   // v3 (Alex's mock): a smaller, more refined title
  const fs = Math.max(40, Math.min(cap, Math.floor((field - travel) / (ratio || 5))));
  root.style.setProperty('--hero-field', `${Math.round(field - travel)}px`);
  // v3: the block on the other side of the car owns the air RIGHT of it
  const carRight = (W - dw) * px + car.x1 * dw;
  root.style.setProperty('--hero-side', `${Math.round(Math.max(200, W - carRight - gap - inset - travel))}px`);
  root.style.setProperty('--hero-fs', `${fs}px`);
}
heroField();
document.fonts?.ready.then(heroField);
window.addEventListener('resize', heroField);



/* ---------- v3 · The Salon: appears in place after the Ferrari, then rises once ----------
   Like every other seam on v3: the Ferrari's turn dissolves to the ground, and this section — lifted one screen so it
   sits behind that last dark frame — fades up where it was, instead of scrolling in after a blank screen (critique
   P1). Without motion it is simply the next section. The hover spotlight is CSS. */
function initFeatured() {
  const sec = document.querySelector('.act-featured');
  if (!sec) return;
  const rise = () => sec.classList.add('is-in');
  if (reduceMotion.matches) { rise(); return; }
  sec.style.marginTop = isMobile.matches ? '-100svh' : '-100vh';
  sec.style.position = 'relative';
  sec.style.zIndex = '4';
  gsap.set(sec, { autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: sec, start: 'top top+=1',
    onEnter: () => { gsap.to(sec, { autoAlpha: 1, duration: 0.9, ease: 'power2.out', overwrite: true }); rise(); },
    onLeaveBack: () => gsap.to(sec, { autoAlpha: 0, duration: 0.4, ease: 'power1.in', overwrite: true }),
  });
  ScrollTrigger.refresh();
}
initFeatured();

// Available Now: a centre-stage carousel. Each card's distance from the middle of the row (in card widths) is written
// to --k on every scroll frame, so the card arriving in the centre grows and brightens as it comes, and the ones
// leaving shrink back. Arrows, swipe, trackpad and a click on a side card all end on a card centred (scroll-snap).
function initCarCarousel() {
  const track = document.querySelector('[data-car-track]');
  if (!track) return;
  const cards = [...track.children];
  const prev = document.querySelector('[data-car-prev]'), next = document.querySelector('[data-car-next]');
  let cur = 0, raf = 0;
  // centres measured on screen (a centred scale leaves the middle of a card where it was), so nothing depends on
  // offsetParent or on 100vw vs a visible scrollbar
  const mid = (el) => { const r = el.getBoundingClientRect(), t = track.getBoundingClientRect(); return r.left + r.width / 2 - t.left - track.clientLeft; };
  const center = (el) => track.scrollLeft + mid(el) - track.clientWidth / 2;
  const go = (i, instant) => {
    i = Math.max(0, Math.min(cards.length - 1, i));
    track.scrollTo({ left: center(cards[i]), behavior: instant || reduceMotion.matches ? 'auto' : 'smooth' });
  };
  const paint = () => {
    raf = 0;
    const half = track.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(mid(c) - half) / (c.offsetWidth || 1);
      c.style.setProperty('--k', Math.min(1, d).toFixed(3));
      if (d < bestD) { bestD = d; best = i; }
    });
    cur = best;
    cards.forEach((c, i) => { c.classList.toggle('is-center', i === cur); c.inert = false; });
    if (prev) prev.disabled = cur === 0;
    if (next) next.disabled = cur === cards.length - 1;
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
  track.addEventListener('scroll', queue, { passive: true });

  // Desktop (Alex, 2026-09-29: "horizontal scroll on the inventory"): the section pins and the page's own scroll
  // walks the row from the first car to the last, settling on a centred car. The padding centres the first card
  // at scrollLeft 0 and the last at the maximum, so progress maps straight onto the scroll range.
  // Phone and reduced motion keep the native swipe with scroll-snap.
  if (!isMobile.matches && !reduceMotion.matches) {
    track.classList.add('is-driven');
    track.closest('.act-cards')?.classList.add('is-driven');
    const n = cards.length;
    const range = () => track.scrollWidth - track.clientWidth;
    const st = ScrollTrigger.create({
      trigger: track.closest('.act-cards'), start: 'top top', end: () => `+=${(n - 1) * innerHeight * 0.6}`,
      pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (self) => { track.scrollLeft = self.progress * range(); },
      snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: 'power2.inOut' },
    });
    const toCard = (i) => {
      const y = st.start + (st.end - st.start) * (i / (n - 1));
      window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: 'smooth' });
    };
    cards.forEach((c, i) => c.addEventListener('click', (e) => { if (i !== cur) { e.preventDefault(); toCard(i); } }));
    addEventListener('resize', queue);
    paint();
    return;
  }
  addEventListener('resize', () => { go(cur, true); queue(); });
  prev?.addEventListener('click', () => go(cur - 1));
  next?.addEventListener('click', () => go(cur + 1));
  cards.forEach((c, i) => c.addEventListener('click', (e) => {
    if (i === cur) return;
    e.preventDefault(); go(i);
  }));
  go(Math.floor((cards.length - 1) / 2), true);   // open on the middle card, cars on either side
  paint();
}
initCarCarousel();

// Closing (Alex, 2026-09-29: "animate it"). The plate comes up with the scroll: the garage settles from a slow push
// and the three cars rise out of the dark and light up. When the copy is well in view it plays once, in steps: the
// kicker, then each title line out of its own mask a beat apart, then the action and the phone. Reduced motion: the
// section as it stands.
function initClosing() {
  const sec = document.querySelector('.act-closing');
  if (!sec || reduceMotion.matches) return;
  const facade = sec.querySelector('.closing__facade'), cars = sec.querySelector('.closing__cars');
  const kicker = sec.querySelector('.closing__kicker'), lines = sec.querySelectorAll('.cl__in');
  const tail = [sec.querySelector('.closing__copy .btn'), sec.querySelector('.closing__phone')].filter(Boolean);
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom bottom', scrub: 1 } })
    .fromTo(facade, { scale: 1.12, opacity: 0.2 }, { scale: 1, opacity: 0.55 }, 0)
    .fromTo(cars, { yPercent: 14, filter: 'brightness(0.25)' }, { yPercent: 0, filter: 'brightness(1)' }, 0);
  gsap.set(facade, { xPercent: -50, x: 0 });   // CSS centres it with translateX(-50%); GSAP owns the transform now
  gsap.set(kicker, { autoAlpha: 0, y: 18 });
  gsap.set(lines, { yPercent: 110 });
  gsap.set(tail, { autoAlpha: 0, y: 16 });
  gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 55%', once: true } })
    .to(kicker, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0)
    .to(lines, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.14 }, 0.15)
    .to(tail, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.7);
}
initClosing();

