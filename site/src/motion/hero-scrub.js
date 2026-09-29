// ACT 1 · v3 (Alex, 2026-09-29): the hero is a scrubbed film too, with ONE message that slides in from the side.
// The tracking shot (source frames n3–n115 of reference/found/hero1d.mp4, between its two cuts) is drawn on a
// canvas by the scroll: the 356 comes down the forest road as you scroll. The message arrives by itself on load
// (time-based), holds while the film runs, and blurs away as the film goes dark. The chapters then APPEAR IN
// PLACE (fade up where the hero was), the same handover as About → The Collection (scrub.js).
// Progressive enhancement (G7): the still (frame 1) and the lit message are the section without motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { frameCanvas } from './scrub.js';

gsap.registerPlugin(ScrollTrigger);

const ENTER = () => (window.innerWidth >= 768 ? 32 : Math.min(window.innerWidth * 0.05, 24));   // budgeted into heroField (main.js)

export function heroScrub(section, { mobile = false } = {}) {
  const canvas = section.querySelector('.hero__canvas');
  const still = section.querySelector('.hero__poster img');
  if (!canvas) return;
  const root = document.documentElement;
  section.classList.add('is-scrub');

  // the canvas crops exactly like the still under it (object-position from CSS: 20% 45% landscape, centred on a phone)
  const pos = () => (getComputedStyle(still || canvas).objectPosition || '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
  const fc = frameCanvas(canvas, { pos, onPaint: () => section.classList.add('is-live') });
  const ro = new ResizeObserver(() => fc.size());
  ro.observe(canvas);
  fc.load();

  // ---- the intro: film surfaces, the header settles, the one message slides in from the right and focuses ----
  const inner = section.querySelector('.hero__copy--1 [data-seq-out]');
  const parts = inner ? [inner.querySelector('.hero__kicker'), ...inner.querySelectorAll('.hl'), ...inner.querySelectorAll('.lead__l'), inner.querySelector('.hero__cta')].filter(Boolean) : [];
  const media = [section.querySelector('.hero__media'), section.querySelector('.scrim--hero')].filter(Boolean);
  const header = document.querySelector('.site-header');
  gsap.set(parts, { autoAlpha: 0, x: ENTER, filter: 'blur(12px)' });
  const intro = gsap.timeline();
  intro.fromTo(media, { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0)
    .to(media, { scale: 1, duration: 2.6, ease: 'expo.out', clearProps: 'transform' }, 0)
    .set(media, { clearProps: 'opacity,visibility' });
  if (header) intro.fromTo(header, { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }, 0.5);
  root.classList.remove('intro-wait');
  let alive = true;
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1000))]).then(() => {
    if (!alive) return;
    intro.to(parts, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 1.3, stagger: 0.07, ease: 'expo.out' }, Math.max(0.45, intro.time()));
  });

  // ---- the run: film → a short hold on the last frame → into the dark; the next section appears in place ----
  const run = mobile ? 160 : 230, hold = 40, dark = 70;
  const total = run + hold + dark;
  const f = run / total, fh = (run + hold) / total, fd = 1;
  const dim = section.querySelector('.scrub__dim');
  const next = section.parentElement.querySelector('.act-chapters');
  if (next) {
    next.style.marginTop = mobile ? '-100svh' : '-100vh';     // travels up hidden behind the pin, reaches the top as the dark completes
    next.style.zIndex = '3';
    gsap.set(next, { autoAlpha: 0 });
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${total}%`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (self) => fc.draw(Math.round(Math.min(1, self.progress / f) * (fc.count - 1))),
      onLeave: () => next && gsap.to(next, { autoAlpha: 1, duration: 0.9, ease: 'power2.out', overwrite: true }),
      onEnterBack: () => next && gsap.to(next, { autoAlpha: 0, duration: 0.4, ease: 'power1.in', overwrite: true }),
    },
  });
  tl.to({}, { duration: 1 }, 0);
  if (inner) tl.fromTo(inner, { y: 0 }, { y: () => (mobile ? 0 : -innerHeight * 0.04), duration: f }, 0)     // the message barely drifts while the car comes on (not on a phone: it sits under the header)
    .to(inner, { autoAlpha: 0, y: '-=30', filter: 'blur(10px)', duration: 0.7 * (fd - fh), ease: 'power1.in' }, fh);
  if (dim) tl.to(dim, { opacity: 0.94, duration: fd - fh, ease: 'power1.in' }, fh);   // only darkens to the ground, no scale (Alex)

  return () => {
    alive = false;
    intro.progress(1).kill();
    tl.scrollTrigger?.kill(); tl.kill(); ro.disconnect();
    if (next) { next.style.marginTop = ''; next.style.zIndex = ''; gsap.set(next, { clearProps: 'opacity,visibility' }); }
    gsap.set([...parts, inner, dim].filter(Boolean), { clearProps: 'opacity,visibility,transform,filter' });
    section.classList.remove('is-scrub', 'is-live');
    root.classList.remove('intro-wait');
  };
}
