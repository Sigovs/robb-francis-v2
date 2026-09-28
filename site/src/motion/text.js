// Type handled as a material: the hero's lines come up out of their own baseline on load,
// the About paragraph arrives line by line at the door's release, the brands line lights word by word.
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { DUR, STAGGER, EASE, UNLIT } from './tokens.js';

gsap.registerPlugin(SplitText);

/** ACT 1 · the hero's intro on load (Alex, 2026-09-28: "an intro for the whole hero, the nav slides in").
 *  The film surfaces from black with a slow settle, the header slides down, then the copy and the call to action
 *  arrive in reading order. ~1.8s in all: this yields motion-taste D4 (one entrance ≤ 1.2s) by explicit
 *  direction; nothing waits on it (the page is usable at once, MJ7) and it runs once. Reduced motion: none. */
export function heroEntrance(section) {
  const title = section.querySelector('.hero__copy--1 .display--hero');
  const kicker = section.querySelector('.hero__copy--1 .hero__kicker');
  const lead = section.querySelector('.hero__copy--1 .hero__title .lead');
  const media = [section.querySelector('.hero__media'), section.querySelector('.scrim--hero')].filter(Boolean);
  const header = document.querySelector('.site-header');
  const foot = [...section.querySelectorAll('.hero__foot > *')];
  if (!title) return;
  let tl, split, alive = true;
  // start once the display face is in (else SplitText re-splits on font load and replays the lines mid-intro);
  // never wait longer than 1.2s for it
  const start = () => {
    if (!alive || tl) return;
    tl = gsap.timeline({ defaults: { ease: EASE.out } });
    tl.from(media, { autoAlpha: 0, scale: 1.08, duration: 1.6, clearProps: 'opacity,visibility,transform' }, 0);
    if (header) tl.from(header, { yPercent: -110, autoAlpha: 0, duration: DUR[3] * 1.6, clearProps: 'opacity,visibility,transform' }, 0.35);
    tl.from(kicker, { autoAlpha: 0, y: 10, duration: DUR[3] }, 0.6);
    split = SplitText.create(title, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit(self) {
        // first split: part of the intro. A later re-split (resize): lines simply stay put.
        if (tl.progress() < 1) return tl.from(self.lines, { yPercent: 104, duration: DUR[3] * 1.4, stagger: STAGGER.lines * 1.5 }, 0.7);
      },
    });
    tl.from(lead, { autoAlpha: 0, y: 10, duration: DUR[3] }, 1.05)
      .from(foot, { autoAlpha: 0, y: 12, duration: DUR[3], stagger: 0.08, clearProps: 'opacity,visibility,transform' }, 1.2);
    document.documentElement.classList.remove('intro-wait');   // from() states are set: release the hold
  };
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]).then(start);
  return () => { alive = false; tl?.progress(1).kill(); split?.revert(); document.documentElement.classList.remove('intro-wait'); };
}

/** ACT 2 · release: the About paragraph, line by line, once — the third stage of the door (MJ10). */
export function aboutLines(section) {
  const para = section.querySelector('.display--about');
  if (!para) return;
  const split = SplitText.create(para, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 104, duration: DUR[3], stagger: STAGGER.lines, ease: EASE.out,
        scrollTrigger: { trigger: para, start: 'top 82%', once: true },
      });
    },
  });
  return () => split.revert();
}

/** ACT 4 · the brands line lights word by word with the scroll; only opacity moves (BRIEF §7).
 *  Unlit is --unlit (≈3.4:1, AA for display sizes); fully lit by the time the line is centred. */
export function statementLight(section) {
  const p = section.querySelector('.statement');
  if (!p) return;
  let tween;
  const split = SplitText.create(p, {
    type: 'words', wordsClass: 'word', autoSplit: true,
    onSplit(self) {
      p.classList.add('is-live');
      tween = gsap.fromTo(self.words, { opacity: UNLIT }, {
        opacity: 1, ease: EASE.scrub, stagger: 0.1,
        scrollTrigger: { trigger: p, start: 'top 80%', end: 'center 50%', scrub: true },
      });
      return tween;
    },
  });
  return () => { p.classList.remove('is-live'); split.revert(); };
}
