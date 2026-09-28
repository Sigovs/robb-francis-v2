// Motion module — the whole choreography, branched by gsap.matchMedia (G5) and scoped to <main> (G1, G2).
// Three authored states:
//   desktop — pins and scrubs per BRIEF §7
//   mobile  — its own choreography per BRIEF §8: no pin longer than one screen
//   reduced — nothing is constructed: every act is the designed still in the CSS (door open, statement lit,
//             peak on its final frame); Lenis is not constructed either (main.js)
// Pins are created in page order, one pinned section at a time (DNA47).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './tokens.js';
import { heroEntrance } from './text.js';
import { heroSequence } from './hero.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
window.__ST = ScrollTrigger; // verification hook, beside window.__lenis

const MQ = {
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
};

export function initMotion(root) {
  const act = (sel) => root.querySelector(sel);
  const mm = gsap.matchMedia(root);

  mm.add(MQ, (context) => {
    const { desktop } = context.conditions;
    const undo = [];
    const run = (fn, el) => { if (el) { const u = fn(el); if (typeof u === 'function') undo.push(u); } };

    run(heroEntrance, act('.act-hero'));   // V2: the page is the hero only (Alex, 2026-09-25)
    run((el) => heroSequence(el, { mobile: !desktop }), act('.act-hero'));   // two messages over the film (2026-09-28)

    // Refresh is declared (G8): once when webfonts land (they change the height of every text block
    // above the later pins). Images carry width/height, so they do not move geometry.
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) ScrollTrigger.refresh(); });

    return () => { alive = false; undo.reverse().forEach((u) => u()); };
  });

  return mm;
}
