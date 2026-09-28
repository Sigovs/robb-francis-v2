// ACT 2 · Chapters 01/03, built the way the reference is (Alex, 2026-09-28: "the image appears inside the image,
// the right side with the text scrolls"). The picture side is sticky; the text column scrolls past it in ordinary
// flow. As each chapter's text rises into view, its picture is revealed INSIDE the same square frame (a wipe from
// the bottom, settling from a slight push-in) and its soft field comes up behind. The frame drifts a little across
// the whole section and a rule along the bottom tracks it.
// Scrubbed against the scroll (linear inside, smoothed by scrub against Lenis). Without motion: the first picture
// holds and the texts scroll by — the page is complete (G7).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function chaptersSection(section) {
  const imgs = [...section.querySelectorAll('.ch__img')];
  const fields = [...section.querySelectorAll('.ch__field')];
  const copies = [...section.querySelectorAll('.ch__copy')];
  if (imgs.length < 2 || copies.length !== imgs.length) return;
  section.classList.add('is-seq');
  const frame = section.querySelector('.ch__frame');
  const rule = section.querySelector('.ch__rule span');
  const triggers = [];

  imgs.slice(1).forEach((img) => gsap.set(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 }));
  fields.slice(1).forEach((f) => gsap.set(f, { opacity: 0 }));

  // each chapter after the first: its picture comes up inside the frame as its text comes up the column
  for (let k = 1; k < imgs.length; k++) {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: copies[k], start: 'top 90%', end: 'top 30%', scrub: 0.8 },
    });
    tl.to(imgs[k], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
      .to(imgs[k], { scale: 1, duration: 1 }, 0)
      .to(imgs[k - 1], { scale: 1.06, duration: 1 }, 0)
      .to(fields[k], { opacity: 1, duration: 0.8 }, 0.1);
    triggers.push(tl);
  }

  // the copy of each chapter settles in as it arrives and lets go as it leaves (small, so it still reads as scrolling)
  copies.forEach((c) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 85%', end: 'bottom 15%', scrub: 0.6 } });
    tl.fromTo(c.children, { autoAlpha: 0.15, y: 24, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.3, stagger: 0.03, ease: 'none' }, 0)
      .to({}, { duration: 0.4 })
      .to(c.children, { autoAlpha: 0.15, y: -24, filter: 'blur(6px)', duration: 0.3, stagger: 0.03, ease: 'none' });
    triggers.push(tl);
  });

  // the frame drifts across the section; the rule tracks it
  const whole = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
  if (frame) whole.fromTo(frame, { xPercent: -4 }, { xPercent: 4, duration: 1 }, 0);
  if (rule) whole.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
  triggers.push(whole);

  return () => {
    triggers.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    section.classList.remove('is-seq');
    gsap.set([...imgs, ...fields, frame, rule, ...copies.flatMap((c) => [...c.children])].filter(Boolean), { clearProps: 'all' });
  };
}
