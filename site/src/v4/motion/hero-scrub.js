// ACT 1 · v3 (Alex, 2026-09-29): ONE message that slides in from the side; on scroll the California card arrives.
// Later the same day: "keep video running like before" — the looping film is back; the canvas scrub below stays
// available (a .hero__canvas in the markup switches it on) but v3 ships without it.
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
  const canvas = section.querySelector('.hero__canvas');   // optional: without it the looping film plays (Alex, 2026-09-29)
  const still = section.querySelector('.hero__poster img');
  const root = document.documentElement;
  section.classList.add('is-scrub');
  // v4 (client, 2026-10-11): the California card stands in the hero's bottom right corner from the start (CSS), arriving
  // with the title instead of on scroll. The phone keeps its turn-taking with the title.
  const corner = !mobile && section.hasAttribute('data-hero-corner');
  const swap = mobile;

  // the canvas crops exactly like the still under it (object-position from CSS: 20% 45% landscape, centred on a phone)
  const pos = () => (getComputedStyle(still || canvas).objectPosition || '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
  const fc = canvas ? frameCanvas(canvas, { pos, onPaint: () => section.classList.add('is-live') }) : null;
  const ro = fc ? new ResizeObserver(() => fc.size()) : null;
  if (fc) { ro.observe(canvas); fc.load(); }

  // ---- the intro (v3, in steps — Alex, 2026-09-29: "more interesting, like a staircase"; v4 rises from the dark, below) ----
  // 1 · the frame opens as a flight of steps: ground-coloured columns lift away one after another, left to right,
  //     while the film settles from a slight push-in; 2 · the header drops in; 3 · the title climbs — each line rises
  //     out of its own mask a beat after the one above and from a step further right, so the three lines draw a
  //     staircase as they land; 4 · the lead and the action follow. ~2.6s; nothing waits on it (MJ7).
  const inner = section.querySelector('.hero__copy--1 [data-seq-out]');
  const kicker = inner?.querySelector('.hero__kicker');
  const lines = inner ? [...inner.querySelectorAll('.hl')] : [];
  const after = inner ? [...inner.querySelectorAll('.lead__l'), inner.querySelector('.hero__cta'), inner.querySelector('.hero__pause')].filter(Boolean) : [];
  const parts = [kicker, ...lines, ...after].filter(Boolean);
  const media = [section.querySelector('.hero__media'), section.querySelector('.scrim--hero')].filter(Boolean);
  const header = document.querySelector('.site-header');
  // v4 (client, 2026-10-11: "a slightly different intro"): the hero rises OUT OF THE DARK — the same page-ground veil
  // the film loops through (main.js) starts closed and lifts while the picture eases back with the camera's pull-back;
  // the title lines rise straight out of their masks (no staircase). Without a veil (v3) the steps stay.
  const veil = section.querySelector('.hero__veil');
  let steps = null;
  if (!veil) {
    const N = mobile ? 4 : 6;
    steps = document.createElement('div');
    steps.className = 'hero__steps';
    steps.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < N; i++) steps.append(document.createElement('span'));
    section.querySelector('.hero__media')?.after(steps);
  }
  gsap.set(kicker, { autoAlpha: 0, y: 12 });
  gsap.set(lines, { autoAlpha: 0, yPercent: 70, x: (i) => (veil ? 0 : (i + 1) * (mobile ? 12 : 26)), clipPath: 'inset(0% -5% 100% -5%)' });
  gsap.set(after, { autoAlpha: 0, y: 16 });
  if (header) gsap.set(header, { autoAlpha: 0, y: -14 });
  const intro = gsap.timeline({ onComplete: () => steps?.remove() });
  if (veil) {
    // GSAP owns the veil's opacity for the intro only; its CSS transition is off meanwhile so the two never fight
    intro.fromTo(veil, { opacity: 1, transition: 'none' }, { opacity: 0, duration: 1.9, ease: 'power2.inOut', clearProps: 'opacity,transition' }, 0.1)
      .fromTo(media, { scale: 1.06 }, { scale: 1, duration: 3, ease: 'power2.out', clearProps: 'transform' }, 0);
  } else {
    intro.fromTo(steps.children, { scaleY: 1 }, { scaleY: 0, duration: 1.15, ease: 'expo.inOut', stagger: 0.085 }, 0.05)
      .fromTo(media, { scale: 1.08 }, { scale: 1, duration: 2.6, ease: 'expo.out', clearProps: 'transform' }, 0);
  }
  if (header) intro.to(header, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }, 0.75);
  root.classList.remove('intro-wait');
  let alive = true;
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1000))]).then(() => {
    if (!alive) return;
    const t = Math.max(0.7, intro.time());
    intro.to(kicker, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, t)
      .to(lines, { autoAlpha: 1, yPercent: 0, x: 0, clipPath: 'inset(-10% -5% -30% -5%)', duration: 1.25, ease: 'expo.out', stagger: 0.16, clearProps: 'clipPath' }, t + 0.15)
      .to(after, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, t + 0.15 + 0.16 * lines.length + 0.2);
    if (corner) intro.call(() => toggleSide(1, 0, -1), null, t + 0.15 + 0.16 * lines.length + 0.5);   // the card lands after the title
  });

  // ---- the second block, on the other side of the car: once the film is under way it arrives from the right by
  // itself and completes (not scrubbed, like the spec card), and goes back only after a clear scroll back ----
  const side = section.querySelector('[data-hero-side]');
  const sideInner = side?.querySelector('[data-loc-inner]');
  const sideParts = side ? (sideInner ? [sideInner] : [...side.children]) : [];
  let sideOn = false;
  if (side) gsap.set(sideParts, { autoAlpha: 0, x: ENTER() * 1.5, filter: 'blur(12px)' });
  const placeSide = () => {
    if (!side || !inner) return;
    if (mobile) { side.style.top = `${inner.parentElement.offsetTop + inner.offsetTop}px`; return; }   // phone: exactly where the title stands
    if (corner) return;   // v4: placed by CSS, bottom right
    // landscape desktop (Alex, 2026-09-29: "align it"): the card's foot sits on the CTA's foot — one line across
    // the hero. Measured without the scroll drift on the message (its GSAP y).
    const cta = inner.querySelector('.hero__cta');
    const landscape = innerWidth >= 768 && innerWidth / section.clientHeight >= 1;
    if (!cta || !landscape) { side.style.removeProperty('bottom'); return; }
    const foot = cta.getBoundingClientRect().bottom - section.getBoundingClientRect().top - (+gsap.getProperty(inner, 'y') || 0);
    side.style.bottom = `${Math.round(section.clientHeight - foot)}px`;
  };
  const placeSoon = () => requestAnimationFrame(placeSide);   // after heroField (main.js) has sized the title
  placeSide(); placeSoon();
  document.fonts?.ready.then(placeSoon);
  addEventListener('resize', placeSoon);
  const toggleSide = (p, at, off) => {
    if (!side) return;
    const on = sideOn ? p > off : p >= at;
    if (on === sideOn) return;
    sideOn = on;
    gsap.killTweensOf(sideParts);
    // phone: no air beside the car, so the two take turns in the title's place (the old belt: out left, in from right)
    if (swap) {
      gsap.killTweensOf(parts);
      gsap.to(parts, on
        ? { autoAlpha: 0, x: -24, filter: 'blur(12px)', duration: 0.35, stagger: 0.03, ease: 'power2.in' }
        : { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.05, delay: 0.3, ease: 'expo.out' });
    }
    side.classList.toggle('is-on', on);                    // starts the card's own CSS choreography (the picture opens, the copy rises)
    if (on) gsap.to(sideParts, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.07, delay: swap ? 0.3 : 0, ease: 'expo.out' });
    else gsap.to(sideParts, { autoAlpha: 0, x: ENTER() * 1.5, filter: 'blur(12px)', duration: 0.5, stagger: { each: 0.04, from: 'end' }, ease: 'power2.in' });
  };

  // ---- the run: film → a short hold on the last frame → into the dark; the next section appears in place ----
  // the film loops by itself now: the pinned run only has to carry the card's arrival and a read of it
  // v4 (client: "too slow, there is no scrub here"): with the card in its corner the desktop pin only carries the
  // handover into the dark; the phone keeps a short run for the card taking the title's place
  const run = fc ? (mobile ? 160 : 230) : corner ? 0 : (mobile ? 50 : 90), hold = corner ? 0 : 30, dark = corner ? 55 : 60;
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
      trigger: section, start: 'top top', end: `+=${total}%`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: placeSide,
      onUpdate: (self) => { fc?.draw(Math.round(Math.min(1, self.progress / f) * (fc.count - 1))); if (!corner) toggleSide(self.progress, fc ? f * 0.3 : f * 0.12, fc ? f * 0.18 : f * 0.05); },
      onLeave: () => next && gsap.to(next, { autoAlpha: 1, duration: 0.9, ease: 'power2.out', overwrite: true }),
      onEnterBack: () => next && gsap.to(next, { autoAlpha: 0, duration: 0.4, ease: 'power1.in', overwrite: true }),
    },
  });
  tl.to({}, { duration: 1 }, 0);
  // no drift on the message while the film runs: the card's foot is aligned to the CTA's foot (Alex)
  if (inner) tl.to(inner, { autoAlpha: 0, y: '-=30', filter: 'blur(10px)', duration: 0.7 * (fd - fh), ease: 'power1.in' }, fh);
  if (side) tl.fromTo(side, { autoAlpha: 1 }, { autoAlpha: 0, filter: 'blur(10px)', duration: 0.7 * (fd - fh), ease: 'power1.in', immediateRender: false }, fh);   // leaves with the title, into the dark (no y: the CSS centring owns transform)
  const foot = section.querySelector('.hero__foot');
  if (foot) tl.fromTo(foot, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5 * (fd - fh), immediateRender: false }, fh);   // the film control goes with the film
  if (dim) tl.to(dim, { opacity: 0.94, duration: fd - fh, ease: 'power1.in' }, fh);   // only darkens to the ground, no scale (Alex)

  return () => {
    alive = false;
    intro.progress(1).kill(); steps?.remove();
    tl.scrollTrigger?.kill(); tl.kill(); ro?.disconnect();
    removeEventListener('resize', placeSoon);
    if (side) { side.style.top = ''; side.style.bottom = ''; side.classList.remove('is-on'); }
    if (next) { next.style.marginTop = ''; next.style.zIndex = ''; gsap.set(next, { clearProps: 'opacity,visibility' }); }
    gsap.set([...parts, ...sideParts, inner, side, dim, section.querySelector('.hero__foot')].filter(Boolean), { clearProps: 'opacity,visibility,transform,filter,clipPath' });
    section.classList.remove('is-scrub', 'is-live');
    root.classList.remove('intro-wait');
  };
}
