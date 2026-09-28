// Type handled as a material: the hero's lines come up out of their own baseline on load,
// the About paragraph arrives line by line at the door's release, the brands line lights word by word.
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { DUR, STAGGER, EASE, UNLIT } from './tokens.js';

gsap.registerPlugin(SplitText);

/** ACT 1 · the hero's intro on load (Alex, 2026-09-28: an intro for the whole hero, the nav arrives, "not clunky").
 *  One continuous, overlapping move rather than steps: the film surfaces at once from the ground with a long
 *  settle, the header fades down a few pixels, the title lines rise and clear through their masks with long
 *  overlapping tails, then kicker, lead and action settle. Everything on expo/quart outs, nothing linear, no pause
 *  between parts. ~2.4s: yields motion-taste D4 (≤ 1.2s) by explicit direction; nothing waits on it (MJ7).
 *  The film does not wait for the display face; only the type does (else SplitText re-splits on font load). */
export function heroEntrance(section) {
  const title = section.querySelector('.hero__copy--1 .display--hero');
  const kicker = section.querySelector('.hero__copy--1 .hero__kicker');
  const after = [section.querySelector('.hero__copy--1 .hero__title .lead'), section.querySelector('.hero__copy--1 .hero__cta')].filter(Boolean);
  const media = [section.querySelector('.hero__media'), section.querySelector('.scrim--hero')].filter(Boolean);
  const header = document.querySelector('.site-header');
  const foot = [...section.querySelectorAll('.hero__foot > *')];
  if (!title) return;
  const root = document.documentElement;
  let alive = true, split;

  // 1 · the film and the chrome: immediately
  const film = gsap.timeline();
  film.fromTo(media, { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0)
    .to(media, { scale: 1, duration: 2.6, ease: 'expo.out', clearProps: 'transform' }, 0)
    .set(media, { clearProps: 'opacity,visibility' });
  if (header) film.fromTo(header, { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }, 0.5);
  gsap.set([title, kicker, ...after, ...foot], { autoAlpha: 0 });
  root.classList.remove('intro-wait');   // the from-states are set: release the hold

  // 2 · the type: once the display face is in (never later than 1s)
  const type = () => {
    if (!alive) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    gsap.set(title, { autoAlpha: 1 });
    split = SplitText.create(title, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit(self) {
        if (tl.progress() < 1) {
          return tl.fromTo(self.lines, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.8, stagger: 0.16 }, 0);
        }
      },
    });
    tl.fromTo(kicker, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1.4, ease: 'quart.out' }, 0.15)
      .fromTo(after, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.4, stagger: 0.14, ease: 'quart.out', clearProps: 'transform' }, 0.55)
      .fromTo(foot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0.9);
  };
  const wait = Math.max(0, 450 - performance.now());   // let the film lead by a beat
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1000))])
    .then(() => setTimeout(type, wait));

  return () => { alive = false; film.progress(1).kill(); split?.revert(); gsap.set([title, kicker, ...after, ...foot], { clearProps: 'opacity,visibility,transform' }); root.classList.remove('intro-wait'); };
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
