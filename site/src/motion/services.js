// ACT 5 · SERVICES — cut between panels (BRIEF §7). Pinned; text left, image right.
// Each seam is one device: the next photograph wipes up over the right half (Forge d03–d04) while the
// text on the left hands over in place. Four panels, three wipes, one rule.
import gsap from 'gsap';
import { PIN } from './tokens.js';
import { liveRule, activeSetter, focusFollows, OPEN, CLOSED_UP, CLOSED_DOWN } from './stack.js';
import { snapPoints } from './snap.js';

export function servicesDesktop(section) {
  const panels = [...section.querySelectorAll('.svc')];
  if (panels.length < 2) return;
  const q = (p, s) => p.querySelector(s);
  const n = panels.length;

  section.classList.add('is-stack');
  const rule = liveRule(section.querySelectorAll('.svc .rule'));
  const setActive = activeSetter(panels);
  setActive(0);

  const lines = (p) => [...q(p, '.svc__text').children];
  gsap.set(lines(panels[0]), { clipPath: OPEN });
  panels.slice(1).forEach((p) => {
    gsap.set(lines(p), { clipPath: CLOSED_DOWN, yPercent: 40, autoAlpha: 0 });
    gsap.set(q(p, '.svc__media'), { clipPath: 'inset(100% 0% 0% 0%)' });
  });

  let st;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${PIN.services * 100}%`,
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onRefresh: rule.measure,
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n + 0.0001))),
    },
  });
  st = tl.scrollTrigger;

  for (let b = 1; b < n; b++) {
    const out = panels[b - 1], inc = panels[b];
    const W = 0.34; // the wipe's share of a panel's scroll
    // text: the same masked-line handover as the chapters (one text grammar for both pinned runs), never a fade
    tl.to(lines(out), { clipPath: CLOSED_UP, yPercent: -40, autoAlpha: 0, duration: 0.06, stagger: 0.008 }, b - 0.26);   // gone before the wipe's midpoint
    tl.fromTo(q(inc, '.svc__media'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: W }, b - W);
    tl.fromTo(q(inc, '.svc__media img'), { yPercent: 12 }, { yPercent: 0, duration: W }, b - W);
    tl.fromTo(lines(inc), { clipPath: CLOSED_DOWN, yPercent: 40, autoAlpha: 0 }, { clipPath: OPEN, yPercent: 0, autoAlpha: 1, duration: 0.06, stagger: 0.008 }, b - 0.1);  // arrives after it
  }
  tl.fromTo(rule.el, { '--p': 0 }, { '--p': 1, duration: n }, 0);

  const unfocus = focusFollows(section, panels, () => st);
  const unsnap = snapPoints(() => (st ? panels.map((_, k) => st.start + ((k + 0.3) / n) * (st.end - st.start)) : []));
  return () => { unsnap(); unfocus(); rule.cleanup(); section.classList.remove('is-stack'); panels.forEach((p) => { p.classList.remove('is-active'); gsap.set(lines(p), { clearProps: 'clipPath,transform,opacity,visibility' }); }); };
}

/** Mobile (§8): four stacked pairs, image first. The desktop wipe survives as a short reveal on entry. */
export function servicesMobile(section) {
  section.querySelectorAll('.svc__media').forEach((m) => {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: m, start: 'top 95%', end: 'top 45%', scrub: true },
    })
      .fromTo(m, { clipPath: 'inset(16% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }, 0)
      .fromTo(m.querySelector('img'), { yPercent: 8 }, { yPercent: 0 }, 0);
  });
}
