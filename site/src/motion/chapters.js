// ACT 3 · CHAPTERS 01/03 — dolly: each inset drifts across its own blurred field (BRIEF §7).
// One pinned stage; chapters stacked. Seams are sequenced, not superimposed: the outgoing inset and text
// leave, the fields dissolve, the incoming inset and text arrive — no frame shows two insets ghosted (MJ4).
import gsap from 'gsap';
import { PIN } from './tokens.js';
import { liveRule, activeSetter, focusFollows, OPEN, CLOSED_UP, CLOSED_DOWN } from './stack.js';
import { snapPoints } from './snap.js';

export function chaptersDesktop(section) {
  const chapters = [...section.querySelectorAll('.chapter')];
  if (chapters.length < 2) return;
  const q = (c, s) => c.querySelector(s);
  const n = chapters.length;
  // the text block's own lines: numeral, title, sentence, action — each masked by its own box
  const lines = (c) => [...q(c, '.chapter__text').children];

  section.classList.add('is-stack');
  const rule = liveRule(section.querySelectorAll('.chapter .rule'));
  const setActive = activeSetter(chapters);
  setActive(0);

  // later chapters start closed (set by script only — the static page shows all three, G7)
  // the inset's open mask leaves room below the square for its caption (chapter 03 names the car)
  // insets grow from, and close to, their CENTRE — both edges at once (critique)
  const I_OPEN = 'inset(0% 0% -14% 0%)', I_SHUT = 'inset(50% 0% 50% 0%)';
  gsap.set(q(chapters[0], '.chapter__inset'), { clipPath: I_OPEN });
  gsap.set(lines(chapters[0]), { clipPath: OPEN });
  chapters.slice(1).forEach((c) => {
    gsap.set(q(c, '.chapter__field'), { autoAlpha: 0 });
    gsap.set(q(c, '.chapter__inset'), { clipPath: I_SHUT, autoAlpha: 0 });
    gsap.set(lines(c), { clipPath: CLOSED_DOWN, yPercent: 40, autoAlpha: 0 });
  });

  let st;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${PIN.chapters * 100}%`,
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onRefresh: rule.measure,
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n + 0.0001))),
    },
  });
  st = tl.scrollTrigger;

  chapters.forEach((c, k) => {
    // the dolly: the inset travels right across the field; the field drifts the other way, slower
    const from = Math.max(0, k - 0.25), to = Math.min(n, k + 1.25);
    tl.fromTo(q(c, '.chapter__inset'), { xPercent: -7 }, { xPercent: 7, duration: to - from }, from);
    tl.fromTo(q(c, '.chapter__field img'), { xPercent: 1.6 }, { xPercent: -1.6, duration: to - from }, from);
  });

  // Seams are SEQUENCED, never superimposed (MJ4). Critique pass: every outgoing line finishes its exit — clip AND
  // opacity 0 — before the seam's midpoint (b - .02), and nothing incoming starts before it. Insets close to and
  // open from their centre. The seam is ~0.26 of a chapter, and snap (below) settles the scroll on whole chapters,
  // so a resting frame is never a seam.
  //   b-.14 → b-.07  outgoing lines leave (clip up + fade), inset closes to its centre + fades
  //   b-.07 → b-.02  outgoing field dips to the ground
  //   b-.02 → b+.04  incoming field comes up                      ← midpoint: ground + one field, nothing else
  //   b+.03 → b+.09  incoming inset opens from its centre
  //   b+.06 → b+.12  incoming lines rise into their masks
  for (let b = 1; b < n; b++) {
    const out = chapters[b - 1], inc = chapters[b];
    tl.to(lines(out), { clipPath: CLOSED_UP, yPercent: -40, autoAlpha: 0, duration: 0.05, stagger: 0.006 }, b - 0.14);
    tl.to(q(out, '.chapter__inset'), { clipPath: I_SHUT, autoAlpha: 0, duration: 0.06 }, b - 0.13);
    tl.to(q(out, '.chapter__field'), { autoAlpha: 0, duration: 0.05 }, b - 0.07);
    tl.to(q(inc, '.chapter__field'), { autoAlpha: 1, duration: 0.06 }, b - 0.02);
    tl.fromTo(q(inc, '.chapter__inset'), { clipPath: I_SHUT, autoAlpha: 0 }, { clipPath: I_OPEN, autoAlpha: 1, duration: 0.06 }, b + 0.03);
    tl.fromTo(lines(inc), { clipPath: CLOSED_DOWN, yPercent: 40, autoAlpha: 0 }, { clipPath: OPEN, yPercent: 0, autoAlpha: 1, duration: 0.05, stagger: 0.006 }, b + 0.06);
  }
  tl.fromTo(rule.el, { '--p': 0 }, { '--p': 1, duration: n }, 0);

  const unfocus = focusFollows(section, chapters, () => st);
  // snap: the settled middle of each chapter (unit k + 0.45), as scroll positions of this pin
  const unsnap = snapPoints(() => (st ? chapters.map((_, k) => st.start + ((k + 0.45) / n) * (st.end - st.start)) : []));
  return () => { unsnap(); unfocus(); rule.cleanup(); section.classList.remove('is-stack'); chapters.forEach((c) => { c.classList.remove('is-active'); gsap.set([q(c, '.chapter__inset'), ...lines(c)], { clearProps: 'clipPath,transform,opacity,visibility' }); }); };
}
