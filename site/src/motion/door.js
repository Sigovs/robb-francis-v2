// ACT 2 · THE DOOR — the signature move (BRIEF §6).
// A sectional roll-up door is modelled, not faked: every panel travels up with the door (offset d),
// and when its top edge reaches the head it turns back onto the overhead track, hinged at the head.
// The turn angle is solved per frame so the panel's PROJECTED bottom edge meets the top of the panel
// below it — the door stays one continuous surface while it rolls, in perspective, at every frame.
import gsap from 'gsap';
import { DOOR, PIN } from './tokens.js';

const PERSPECTIVE = 1000; // px — matches .door.is-live in motion.css
const SHADE_MAX = 0.62;   // how dark the glass reads when it has turned onto the track

function readDoor(door) {
  const num = (el, v) => parseFloat(el.style.getPropertyValue(v));
  const panels = [...door.querySelectorAll('.door__panel')].map((el) => ({
    el, pt: num(el, '--pt'), ph: num(el, '--ph'), state: '',
  }));
  return {
    door, panels,
    interior: door.querySelector('.door__interior'),
    l: num(door, '--l'), t: num(door, '--t'), w: num(door, '--w'), h: num(door, '--h'),
    H: 0,
  };
}

/** Projected height of a panel of height h (px) hinged at the perspective origin, turned back by theta. */
const projected = (h, theta) => (h * Math.cos(theta) * PERSPECTIVE) / (PERSPECTIVE + h * Math.sin(theta));

/** Solve theta so the projected height equals v (0 ≤ v ≤ h). Monotonic — bisection, 14 steps. */
function solveTheta(h, v) {
  let lo = 0, hi = Math.PI / 2;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    if (projected(h, mid) > v) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Place every panel of one door for offset d (fraction of the door's height, 0 closed → 1 open). */
function render(D, d) {
  for (const p of D.panels) {
    const { el, pt, ph } = p;
    if (d <= pt) {                           // still below the head: rides up, flat
      el.style.visibility = '';
      el.style.transform = `translate3d(0, ${(-d / ph) * 100}%, 0)`;
      el.style.setProperty('--shade', '0');
      // the rail's contact shadow shows only once there is room beneath it (the door has started to rise)
      el.style.setProperty('--lift', String(Math.min(1, d / 0.04)));
    } else if (d < pt + ph) {                // crossing the head: hinged there, turning back
      const h = ph * D.H;
      const v = (pt + ph - d) * D.H;         // what is still below the head
      const theta = solveTheta(h, v);
      el.style.visibility = '';
      el.style.transform = `translate3d(0, ${(-pt / ph) * 100}%, 0) rotateX(${(-theta * 180) / Math.PI}deg)`;
      el.style.setProperty('--shade', String(SHADE_MAX * Math.sin(theta)));
      el.style.setProperty('--lift', String(1 - Math.sin(theta)));
    } else {                                 // on the track, out of the opening
      el.style.visibility = 'hidden';
    }
  }
}

function prepare(D) {
  D.door.classList.add('is-live');
  // the interior settles around the centre of the whole stage, so both doors read as one room
  const ox = ((0.5 - D.l) / D.w) * 100, oy = ((0.5 - D.t) / D.h) * 100;
  gsap.set(D.interior, { transformOrigin: `${ox}% ${oy}%` });
  D.H = D.door.getBoundingClientRect().height;
}

function cleanup(doors) {
  for (const D of doors) {
    D.door.classList.remove('is-live');
    for (const { el } of D.panels) { el.style.transform = ''; el.style.visibility = ''; el.style.removeProperty('--shade'); el.style.removeProperty('--lift'); }
    D.interior.style.removeProperty('--dim');
  }
}

/** Desktop: pinned. Left door leads, the right one follows a beat later (two doors, two motors). */
export function doorDesktop(section) {
  const pin = section.querySelector('.door-pin');
  const doors = [...section.querySelectorAll('.door-stage--d .door')].map(readDoor);
  if (!pin || !doors.length) return;
  doors.forEach(prepare);

  const LAG = 0.1;                                   // right door's delay, in timeline units
  const roll = DOOR.rollEnd - DOOR.holdIn - LAG;     // each door's own roll length
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: pin, start: 'top top', end: `+=${PIN.door * 100}%`,
      pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onRefresh: () => doors.forEach((D) => { D.H = D.door.getBoundingClientRect().height; }),
    },
  });
  doors.forEach((D, i) => {
    const s = { d: 0 };
    tl.to(s, { d: 1, duration: roll, onUpdate: () => render(D, s.d) }, DOOR.holdIn + i * LAG);
  });
  tl.fromTo(doors.map((D) => D.interior), { scale: 1.06, '--dim': 1 }, { scale: 1, '--dim': 0, duration: DOOR.rollEnd - DOOR.holdIn + 0.1 }, DOOR.holdIn);
  tl.to({}, { duration: Math.max(0.1, 1 - tl.duration()) });   // the open door holds
  doors.forEach((D) => render(D, 0));
  return () => cleanup(doors);
}

/** Mobile (§8): in flow, no pin. The left door rolls up as it crosses the centre of the screen. */
export function doorMobile(section) {
  const stage = section.querySelector('.door-stage--m');
  const D = stage && readDoor(stage.querySelector('.door'));
  if (!D) return;
  prepare(D);
  const s = { d: 0 };
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top 55%', end: 'bottom 45%', scrub: true, invalidateOnRefresh: true,
      onRefresh: () => { D.H = D.door.getBoundingClientRect().height; },
    },
  })
    .to(s, { d: 1, duration: 0.85, onUpdate: () => render(D, s.d) }, 0)
    .fromTo(D.interior, { scale: 1.06, '--dim': 1 }, { scale: 1, '--dim': 0, duration: 1 }, 0);
  render(D, 0);
  return () => cleanup([D]);
}

