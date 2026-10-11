// v4 · the phone's own motion (client, 2026-10-11: "why take all the animation out? the 01/02/03 pictures can come
// in from the side"). One idea carried down the page instead of a fade on every block:
//   pictures are CUT IN from the side by the scroll — a clip wipe that alternates left / right chapter to chapter,
//   the photograph settling from a slight push inside its frame as it opens (scrubbed: the scroll draws it);
//   About's film opens the same way, from a framed inset to the full band;
//   each block's copy then arrives by itself (not scrubbed): the title rises out of its mask like the hero's lines,
//   the rest follows. Clip-path, transform and opacity only.
// Progressive enhancement (G7): nothing is hidden in CSS. Only here, with motion allowed on a phone, are the start
// states set; the matchMedia context (index.js) reverts every one of them when the phone or the preference changes.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OPEN = 'inset(0% 0% 0% 0%)';

// a picture frame cut in from one side, its image settling inside it
function cutIn(frame, img, fromLeft) {
  gsap.set(frame, { clipPath: fromLeft ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)' });
  gsap.set(img, { scale: 1.16, transformOrigin: fromLeft ? '0% 50%' : '100% 50%' });
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: frame, start: 'top 92%', end: 'top 34%', scrub: 0.6 } })
    .to(frame, { clipPath: OPEN, ease: 'power2.out', duration: 1 }, 0)
    .to(img, { scale: 1, ease: 'power1.out', duration: 1 }, 0);
}

// a copy block: the title rises out of its mask, the rest follows; once, by itself
function copyIn(block, titleSel) {
  const title = block.querySelector(titleSel);
  const rest = [...block.children].filter((el) => el !== title);
  if (title) gsap.set(title, { clipPath: 'inset(0% -4% 100% -4%)', yPercent: 40 });
  gsap.set(rest, { autoAlpha: 0, y: 18 });
  const tl = gsap.timeline({ paused: true });
  const before = title ? rest.filter((el) => el.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING) : [];
  const after = rest.filter((el) => !before.includes(el));
  if (before.length) tl.to(before, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
  if (title) tl.to(title, { clipPath: 'inset(-10% -4% -30% -4%)', yPercent: 0, duration: 1.1, ease: 'expo.out', clearProps: 'clipPath' }, 0.08);
  if (after.length) tl.to(after, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09 }, 0.3);
  ScrollTrigger.create({ trigger: block, start: 'top 84%', once: true, onEnter: () => tl.play() });
}

export function phoneReveals(root) {
  // chapters: 01 from the left, 02 from the right, 03 from the left
  root.querySelectorAll('.act-chapters .ch__copy').forEach((c, i) => {
    const frame = c.querySelector('.ch__pic-frame');
    const img = frame?.querySelector('.ch__pic');
    if (frame && img) cutIn(frame, img, i % 2 === 0);
    const inner = c.querySelector('.ch__inner');
    if (inner) copyIn(inner, '.ch__title');
  });

  // About: the film opens from a framed inset to the full band, the copy follows
  const about = root.querySelector('.act-about');
  const stage = about?.querySelector('.scrub__stage');
  if (stage) {
    const media = [...stage.querySelectorAll('.scrub__still, .scrub__video')];
    gsap.set(stage, { clipPath: 'inset(7% 7% 7% 7%)' });
    gsap.set(media, { scale: 1.12 });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: stage, start: 'top 90%', end: 'top 25%', scrub: 0.6 } })
      .to(stage, { clipPath: OPEN, ease: 'power2.out', duration: 1 }, 0)
      .to(media, { scale: 1, ease: 'power1.out', duration: 1 }, 0);
  }
  const aboutCopy = about?.querySelector('.scrub__copy');
  if (aboutCopy) copyIn(aboutCopy, '.about__title');
}
