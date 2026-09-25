// ACT 6 · THE PEAK — silence → rise → release (BRIEF §4).
// The silver car rises from below the fold between the two lines of "By Appointment / Only":
// OVER line 1, UNDER line 2 (occlusion is the one depth idea, DM6), turning ~20° as it climbs.
// The flanks are further back and rise at 0.7×. It ends on the composed frame the static page already is.
//
// SEQUENCE-READY: the car is driven through carSubject(). Today it is a still and the yaw is a CSS rotation.
// When the 24-frame render lands, add to the <img>:
//   data-frames="/img/peak/911-{i}.webp" data-frame-count="24"      (mobile: data-frames-m / data-frame-count-m = 12)
// and the same timeline scrubs frames instead of rotating — nothing else changes.
import gsap from 'gsap';
import { PIN } from './tokens.js';

// YAW is 0 until the real 24-frame render exists (critique 2026-09-24): a 2D rotation of a top-down still reads
// as a sticker spinning, not a car turning. The frame-sequence path below is untouched — with data-frames on the
// <img>, the timeline scrubs frames and the turn is real.
const YAW = 0;           // degrees across the rise, for the still (BRIEF §4 asks ~20° — from frames only)
const FLANK_RATE = 0.7;  // flanks travel at 0.7× the hero car

/** The car as a subject with one control: yaw(p) for p in 0..1 (0 = turned, 1 = square to camera). */
function carSubject(img, mobile) {
  const pattern = img.dataset[mobile ? 'framesM' : 'frames'] || img.dataset.frames;
  const count = parseInt(img.dataset[mobile ? 'frameCountM' : 'frameCount'] || img.dataset.frameCount || '0', 10);

  if (!pattern || !count) {
    // still: the yaw is a rotation of the one photograph
    return { el: img, yaw: (p) => gsap.set(img, { rotation: -YAW * (1 - p) }), cleanup: () => {} };
  }

  // frame sequence: decode every frame up front into ImageBitmaps, draw into a canvas that takes the img's box
  const canvas = document.createElement('canvas');
  canvas.className = img.className; // same box, same CSS
  canvas.setAttribute('aria-hidden', 'true');
  const ctx2d = canvas.getContext('2d');
  const frames = new Array(count);
  let ready = false, last = -1, want = count - 1;
  const draw = (i) => {
    if (!frames[i] || i === last) return;
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    ctx2d.drawImage(frames[i], 0, 0, canvas.width, canvas.height);
    last = i;
  };
  Promise.all(Array.from({ length: count }, (_, i) =>
    fetch(pattern.replace('{i}', String(i).padStart(2, '0')))
      .then((r) => r.blob()).then(createImageBitmap).then((bmp) => { frames[i] = bmp; }),
  )).then(() => {
    canvas.width = frames[0].width; canvas.height = frames[0].height;
    canvas.style.height = getComputedStyle(img).height;
    canvas.style.width = 'auto';
    img.after(canvas);
    img.style.visibility = 'hidden';
    ready = true; last = -1; draw(want);
  }).catch(() => {}); // any failure: the still stays, which is the designed fallback (G7)

  return {
    el: () => (ready ? canvas : img),
    yaw: (p) => {
      want = Math.round((count - 1) * p);
      if (ready) { draw(want); gsap.set(img, { rotation: 0 }); } else gsap.set(img, { rotation: -YAW * (1 - p) });
    },
    cleanup: () => { canvas.remove(); img.style.visibility = ''; frames.forEach((b) => b?.close?.()); },
  };
}

function build(stage, { mobile }) {
  const img = stage.querySelector('.peak__car');
  const flanks = mobile ? [] : [...stage.querySelectorAll('.peak__flank')];
  const release = stage.querySelector('.peak__release');
  if (!img) return;
  stage.classList.add('is-live');
  const car = carSubject(img, mobile);
  const carEl = () => (typeof car.el === 'function' ? car.el() : car.el);

  // keep the static centring the CSS authored, expressed through GSAP so the rise composes with it (G6)
  // (x: 0 first — GSAP would otherwise read the CSS translate(-50%) as pixels and add ours to it)
  gsap.set(img, { x: 0, xPercent: -50, yPercent: 0 });

  // The car ENTERS at progress 0 (critique: no dead scroll with the title alone). Start offset = where the nose
  // sits 6% above the stage's bottom edge, measured from the car's authored final position.
  const NOSE = 0.041; // body top within the cropped frame, × width (= --pk-nose)
  const travel = () => stage.clientHeight * 0.94 - img.offsetTop - img.offsetWidth * NOSE;
  const rise = { p: 0 };
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: `+=${(mobile ? PIN.peakMobile : PIN.peak) * 100}%`,
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  const RISE_END = 0.78;
  tl.fromTo(img, { y: () => travel() }, { y: 0, duration: RISE_END }, 0);
  tl.to(rise, { p: 1, duration: RISE_END, onUpdate: () => car.yaw(rise.p) }, 0);
  flanks.forEach((f) => tl.fromTo(f, { y: () => travel() * FLANK_RATE }, { y: 0, duration: RISE_END }, 0));
  // release: the caption and the one action arrive once the car has stopped
  if (release) tl.fromTo(release, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.1 }, RISE_END + 0.04);
  tl.to({}, { duration: Math.max(0.05, 1 - tl.duration()) });
  car.yaw(0);

  // a canvas that replaces the still must ride the same transform
  const follow = () => { const el = carEl(); if (el !== img) el.style.transform = img.style.transform; };
  tl.eventCallback('onUpdate', follow);

  return () => { car.cleanup(); stage.classList.remove('is-live'); };
}

export const peakDesktop = (section) => build(section.querySelector('.peak__stage'), { mobile: false });
export const peakMobile = (section) => build(section.querySelector('.peak__stage'), { mobile: true });
