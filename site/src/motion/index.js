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
import { doorDesktop, doorMobile } from './door.js';
import { chaptersDesktop } from './chapters.js';
import { servicesDesktop, servicesMobile } from './services.js';
import { peakDesktop, peakMobile } from './peak.js';
import { heroEntrance, aboutLines, statementLight } from './text.js';
import { inventorySettle, closingSettle } from './light.js';

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

    run(heroEntrance, act('.act-hero'));
    run(desktop ? doorDesktop : doorMobile, act('.act-door'));
    run(aboutLines, act('.act-door'));
    if (desktop) run(chaptersDesktop, act('.act-chapters'));
    if (desktop) run(statementLight, act('.act-statement'));     // mobile sets it in Geist 22px: stays lit (AA)
    run(desktop ? servicesDesktop : servicesMobile, act('.act-services'));
    run(desktop ? peakDesktop : peakMobile, act('.act-peak'));
    run(inventorySettle, act('.act-inventory'));
    run(closingSettle, act('.act-closing'));

    // Refresh is declared (G8): once when webfonts land (they change the height of every text block
    // above the later pins). Images carry width/height, so they do not move geometry.
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) ScrollTrigger.refresh(); });

    return () => { alive = false; undo.reverse().forEach((u) => u()); };
  });

  return mm;
}
