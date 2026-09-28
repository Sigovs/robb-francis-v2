// ACT 1 · the hero holds for one screen of scroll while its message changes over the film (Alex, 2026-09-28):
//   "Collector. Classic. Current."  →  "Across Both Coasts"
// Progressive enhancement (G7): the second message ships as its own block under the hero (the static and
// reduced-motion state). Only here, with motion allowed, is it moved over the film and sequenced.
// Every stoppable frame is composed (MJ4): the first message is fully gone before the second starts, and the
// gap between them is the film alone. Scrub is linear inside, smoothed by scrub: 0.8 against Lenis (G4).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function heroSequence(section, { mobile = false } = {}) {
  const block = document.querySelector('[data-hero2]');
  const copy1 = section.querySelector('.hero__copy--1');
  const copy2 = block?.querySelector('.hero__copy--2');
  if (!copy1 || !copy2) return;

  // move the second message over the film
  copy1.after(copy2);
  block.hidden = true;
  section.classList.add('is-seq');
  // phone: the copy sits in flow above the film band, so the second one takes the first one's place exactly
  const place = () => { if (mobile) copy2.style.setProperty('--seq-top', `${copy1.offsetTop}px`); };
  place();

  // the exit animates the wrapper (the load entrance owns the lines inside it, G6); the entry animates parts
  const out = copy1.querySelector('[data-seq-out]');
  const inn = copy2.querySelector('[data-seq-in]');
  const parts = [inn.querySelector('.hero__kicker'), ...inn.querySelectorAll('.hl'), ...inn.querySelectorAll('.lead__l')];
  gsap.set(parts, { autoAlpha: 0, y: 28 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: '+=120%',
      pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: place,
    },
  });
  tl.to(out, { autoAlpha: 0, y: -32, duration: 0.25 }, 0.12)                    // first message leaves
    .to(parts, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.035 }, 0.48)     // film alone, then the second arrives
    .to({}, { duration: 0.12 });                                                 // it holds before the page ends

  return () => {
    tl.scrollTrigger?.kill(); tl.kill();
    gsap.set([out, ...parts], { clearProps: 'opacity,visibility,transform' });
    section.classList.remove('is-seq');
    copy2.style.removeProperty('--seq-top');
    block.appendChild(copy2);
    block.hidden = false;
  };
}
