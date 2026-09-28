// ACT 2 · Chapters 01/03 (Forge's device, Alex 2026-09-28). The section pins; each next chapter rises from below
// and covers the last: its soft field wipes up, its square inset rises into place, the outgoing copy goes into a
// blur and the incoming copy comes out of one. A rule along the bottom tracks the run.
// Scrubbed against the scroll (linear inside, smoothed by scrub: 1 against Lenis), like the reference.
// Progressive enhancement (G7): without motion the chapters are three ordinary stacked screens.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function chaptersSection(section, { mobile = false } = {}) {
  const chs = [...section.querySelectorAll('[data-ch]')];
  if (chs.length < 2) return;
  section.classList.add('is-seq');
  const parts = (ch) => [ch.querySelector('.ch__count'), ch.querySelector('.ch__title'), ch.querySelector('.ch__text'), ch.querySelector('.text-link')].filter(Boolean);
  const rule = section.querySelector('.ch__rule span');

  chs.slice(1).forEach((ch) => {
    gsap.set(ch.querySelector('.ch__field'), { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(ch.querySelector('.ch__inset'), { y: () => innerHeight });
    gsap.set(parts(ch), { autoAlpha: 0, y: 30, filter: 'blur(8px)' });
  });

  const n = chs.length - 1;                                      // transitions
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: `+=${n * (mobile ? 90 : 110) + 40}%`,
      pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  for (let k = 1; k <= n; k++) {
    const t = k - 1, prev = chs[k - 1], ch = chs[k];
    tl.to(parts(prev), { autoAlpha: 0, y: -30, filter: 'blur(8px)', duration: 0.25, stagger: 0.03 }, t + 0.08)
      .to(prev.querySelector('.ch__inset'), { scale: 0.95, autoAlpha: 0, duration: 0.4 }, t + 0.18)   // gone before the next one covers it: no strip peeking out
      .to(ch.querySelector('.ch__field'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6 }, t + 0.15)
      .to(ch.querySelector('.ch__inset'), { y: 0, duration: 0.6, ease: 'power1.out' }, t + 0.2)
      .to(parts(ch), { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.28, stagger: 0.04 }, t + 0.52);
  }
  tl.to({}, { duration: 0.35 }, n);                              // the last chapter holds before the page moves on
  if (rule) tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: tl.duration() }, 0);

  return () => {
    tl.scrollTrigger?.kill(); tl.kill();
    section.classList.remove('is-seq');
    chs.forEach((ch) => gsap.set([ch.querySelector('.ch__field'), ch.querySelector('.ch__inset'), ...parts(ch)], { clearProps: 'all' }));
    if (rule) gsap.set(rule, { clearProps: 'all' });
  };
}
