// ACT 1 · the hero holds while its message changes over the film, three times, then releases (Alex, 2026-09-28):
//   "Collector & Classic"  →  "Across Both Coasts"  →  "Import & Domestic"  →  (4th scroll) the page moves on
// Messages slide in from the side, line by line (Alex, 2026-09-28). This yields motion-taste D1 (crossfade over
// travel) by explicit direction. One direction, like a belt: the next message arrives from the right and settles,
// the outgoing one carries on to the left and is gone before it reaches the frame edge (no clipped words, MJ4).
// Leaving text blurs out, arriving text focuses in (Alex, 2026-09-28) — filter on small type blocks only.
// Progressive enhancement (G7): messages 2+ ship as blocks under the hero (static / reduced-motion state). Only
// here, with motion allowed, are they moved over the film. Every stoppable frame is composed (MJ4): the outgoing
// message is gone before the next one starts, and the gap between is the film alone. Scrub is linear inside,
// smoothed by scrub: 0.8 against Lenis (G4).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ENTER = () => Math.min(window.innerWidth * 0.05, 72);       // px: arrives from the right


export function heroSequence(section, { mobile = false } = {}) {
  const block = document.querySelector('[data-hero2]');
  const first = section.querySelector('.hero__copy--1');
  const more = block ? [...block.querySelectorAll('.hero__copy')] : [];
  if (!first || !more.length) return;

  // move messages 2+ over the film, in order
  let anchor = first;
  more.forEach((c) => { anchor.after(c); anchor = c; });
  block.hidden = true;
  section.classList.add('is-seq');
  // phone: the copy sits in flow above the film band, so the later ones take the first one's place exactly
  const place = () => { if (mobile) more.forEach((c) => c.style.setProperty('--seq-top', `${first.offsetTop}px`)); };
  place();

  // message 1 leaves as one wrapper (the load entrance owns its lines, G6); later messages move by parts
  const partsOf = (copy) => {
    const inn = copy.querySelector('[data-seq-in]');
    return [inn.querySelector('.hero__kicker'), ...inn.querySelectorAll('.hl'), ...inn.querySelectorAll('.lead__l'), inn.querySelector('.hero__cta')].filter(Boolean);
  };
  const outFirst = first.querySelector('[data-seq-out]');
  const sets = more.map(partsOf);
  // leaves to the left, but never past the frame edge: stops short of the copy's own inset
  const EXIT = () => -Math.max(0, Math.min(first.getBoundingClientRect().left - 6, 64));
  const BLUR = 'blur(12px)', SHARP = 'blur(0px)';   // text goes soft as it leaves and comes into focus as it arrives (Alex)
  sets.forEach((p) => gsap.set(p, { autoAlpha: 0, x: ENTER, filter: BLUR }));
  gsap.set(outFirst, { filter: SHARP });

  const n = more.length;                         // transitions
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${100 * n + 30}%`,
      pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: place,
    },
  });
  // one unit per transition: hold · out (0.12–0.37) · film alone · in (0.48–0.78) · hold
  for (let k = 0; k < n; k++) {
    const t = k;
    const leaving = k === 0 ? outFirst : sets[k - 1];
    tl.to(leaving, { autoAlpha: 0, x: EXIT, filter: BLUR, duration: 0.3, stagger: k === 0 ? 0 : 0.025 }, t + 0.1);
    tl.to(sets[k], { autoAlpha: 1, x: 0, filter: SHARP, duration: 0.26, stagger: 0.035 }, t + 0.46);
  }
  tl.to({}, { duration: 0.3 }, n);                // the last message holds, then the page releases (4th scroll)

  return () => {
    tl.scrollTrigger?.kill(); tl.kill();
    gsap.set([outFirst, ...sets.flat()], { clearProps: 'opacity,visibility,transform,filter' });
    section.classList.remove('is-seq');
    more.forEach((c) => { c.style.removeProperty('--seq-top'); block.appendChild(c); });
    block.hidden = false;
  };
}
