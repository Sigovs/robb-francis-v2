// Type handled as a material: the hero's lines come up out of their own baseline on load,
// the About paragraph arrives line by line at the door's release, the brands line lights word by word.
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { DUR, STAGGER, EASE, UNLIT } from './tokens.js';

gsap.registerPlugin(SplitText);

/** ACT 1 · hero entrance on load — one entrance, ≤ --dur-4 in total (motion D4). The film is untouched. */
export function heroEntrance(section) {
  const title = section.querySelector('.display--hero');
  const kicker = section.querySelector('.hero__kicker');
  const lead = section.querySelector('.hero__title .lead');
  if (!title) return;
  const tl = gsap.timeline({ defaults: { ease: EASE.out } });
  const split = SplitText.create(title, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit(self) {
      return tl.from(self.lines, { yPercent: 104, duration: DUR[3], stagger: STAGGER.lines }, 0.1);
    },
  });
  tl.from(kicker, { autoAlpha: 0, y: 8, duration: DUR[3] }, 0)
    .from(lead, { autoAlpha: 0, y: 8, duration: DUR[3] }, 0.5);
  return () => split.revert();
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
