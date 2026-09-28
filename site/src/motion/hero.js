// ACT 1 · the hero holds while its message changes over the film, three times, then releases (Alex, 2026-09-28):
//   "Collector & Classic"  →  "Across Both Coasts"  →  "Import & Domestic"  →  (4th scroll) the page moves on
// Messages slide in from the side, line by line (Alex, 2026-09-28). This yields motion-taste D1 (crossfade over
// travel) by explicit direction. One direction, like a belt: the next message arrives from the right and settles,
// the outgoing one carries on to the left and is gone before it reaches the frame edge (no clipped words, MJ4).
// Leaving text blurs out, arriving text focuses in (Alex, 2026-09-28) — filter on small type blocks only.
// Progressive enhancement (G7): messages 2+ ship as blocks under the hero (static / reduced-motion state). Only
// here, with motion allowed, are they moved over the film. Every stoppable frame is composed (MJ4): the outgoing
// message is gone before the next one starts, and the gap between is the film alone. Scrub is linear inside,
// played in time, not scrubbed: scroll picks the message, the change completes itself (see below).
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
  // The messages are NOT scrubbed (Alex, 2026-09-28: "I make a scroll movement and the text completes by itself").
  // A paused, time-based timeline holds one label per message; scroll only decides WHICH message, and the
  // playhead then travels there on its own (tweenTo), so one flick of the wheel plays a whole change, both ways.
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
  tl.addLabel('m0', 0);
  for (let k = 0; k < n; k++) {
    const t = k;
    const leaving = k === 0 ? outFirst : sets[k - 1];
    tl.to(leaving, { autoAlpha: 0, x: EXIT, filter: BLUR, duration: 0.3, stagger: k === 0 ? 0 : 0.025, ease: 'power2.in' }, t + 0.02);
    tl.to(sets[k], { autoAlpha: 1, x: 0, filter: SHARP, duration: 0.42, stagger: 0.045 }, t + 0.36);
    tl.addLabel(`m${k + 1}`, t + 1);
  }

  let current = 0, travel, busy = false;
  const STEP = 1.1;                                   // seconds per message change
  const playTo = (i, dur) => {
    current = i;
    travel?.kill();
    travel = tl.tweenTo(`m${i}`, { duration: dur, ease: 'power1.inOut' });
  };
  const st = ScrollTrigger.create({
    trigger: section, start: 'top top', end: `+=${100 * n + 30}%`,
    pin: true, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: place,
    // fallback for keyboard, scrollbar, touch (native on phones): nearest message by position, still played in time
    onUpdate(self) {
      if (busy) return;
      const i = gsap.utils.clamp(0, n, Math.round(self.progress * (n + 0.3)));
      if (i !== current) playTo(i, STEP);
    },
  });
  const pos = (i) => st.start + (i / (n + 0.3)) * (st.end - st.start);

  // Wheel / trackpad: ONE gesture = ONE message (Alex: "I make a scroll movement and the text completes by
  // itself"). Inside the pinned run a gesture is caught, the message changes in full, and the page glides to that
  // message's position with it; the rest of the same gesture (trackpad inertia) is swallowed so it cannot skip a
  // message. Past the last message the gesture is let through and the page releases downward.
  const lenis = window.__lenis;
  let lastInput = 0, lastDir = 0, owned = false, release;
  const onGesture = (data) => {
    const e = data.event;
    if (!e || !e.type.includes('wheel')) return true;             // touch stays native (fallback above)
    const dir = Math.sign(data.deltaY);
    if (!dir) return true;
    const now = performance.now();
    const sameGesture = dir === lastDir && now - lastInput < 220;
    lastInput = now; lastDir = dir;
    // the rest of a gesture we already used (or anything during a change) is swallowed, wherever it lands
    if (busy || (sameGesture && owned)) { e.preventDefault(); return false; }
    const y = lenis.scroll;
    const inRun = dir > 0 ? (y >= st.start - 2 && y <= pos(n) + 2 && current < n)
                          : (y >= st.start + 2 && y <= pos(n) + 2 && current > 0);
    owned = inRun;
    if (!inRun) return true;                                      // outside the run: ordinary scrolling
    e.preventDefault();
    busy = true;
    const next = current + dir;
    playTo(next, STEP);
    const done = () => { busy = false; clearTimeout(release); };
    clearTimeout(release); release = setTimeout(done, STEP * 1000 + 120);   // never stay locked
    lenis.scrollTo(pos(next), { duration: STEP, lock: true, easing: (t) => 1 - Math.pow(1 - t, 3), onComplete: done });
    return false;
  };
  if (lenis) lenis.options.virtualScroll = onGesture;

  return () => {
    clearTimeout(release);
    if (lenis && lenis.options.virtualScroll === onGesture) lenis.options.virtualScroll = undefined;
    st.kill(); travel?.kill(); tl.kill();
    gsap.set([outFirst, ...sets.flat()], { clearProps: 'opacity,visibility,transform,filter' });
    section.classList.remove('is-seq');
    more.forEach((c) => { c.style.removeProperty('--seq-top'); block.appendChild(c); });
    block.hidden = false;
  };
}
