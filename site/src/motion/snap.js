// Snap for the two pinned runs (critique 2026-09-24): a stop mid-seam showed sliced type, so the scroll settles on
// whole chapters and panels. Lenis' own snap module, not ScrollTrigger's (which tweens the native scroll and
// fights Lenis for it). Proximity only, with points only INSIDE the pins: outside them there is nothing within
// the threshold and the page scrolls free (the user keeps the transport, MJ6). Duration --dur-3. Threshold 36% of the
// viewport = just over half the chapter spacing (2.0 screens / 3), so any stop inside a run has a point in reach.
// Points are recomputed on every ScrollTrigger refresh, because pin geometry changes with the viewport.
import Snap from 'lenis/snap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DUR } from './tokens.js';

const sources = new Set();   // () => number[] (scroll positions)
let snap = null, removers = [];

function rebuild() {
  if (!snap) return;
  removers.forEach((r) => r()); removers = [];
  sources.forEach((fn) => fn().forEach((y) => removers.push(snap.add(Math.round(y)))));
}

/** main.js hands over the Lenis instance (or null when it is torn down under reduced motion). */
export function attachSnap(lenis) {
  snap?.destroy(); snap = null; removers = [];
  if (!lenis) return;
  const ease = gsap.parseEase('rf-inout');
  snap = new Snap(lenis, { type: 'proximity', distanceThreshold: '36%', duration: DUR[3], easing: (t) => ease(t), debounce: 140 });
  rebuild();
}

/** A pinned run registers where its whole frames are. Returns the unregister function. */
export function snapPoints(fn) {
  sources.add(fn); rebuild();
  return () => { sources.delete(fn); rebuild(); };
}

ScrollTrigger.addEventListener('refresh', rebuild);
