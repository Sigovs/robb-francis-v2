// Motion tokens (motion I3, G4). Event durations and easing are READ from tokens.css — one source.
// Scroll ranges (how much scroll each pinned act consumes) live here: they govern scrubs, not durations.
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

const css = getComputedStyle(document.documentElement);
const read = (name) => css.getPropertyValue(name).trim();
const ms = (name) => parseFloat(read(name)) / 1000;
const bezier = (name) => {
  const m = read(name).match(/cubic-bezier\(([^)]+)\)/);
  return m ? m[1].split(',').map((n) => parseFloat(n)).join(',') : '0.22,1,0.36,1';
};

CustomEase.create('rf-out', bezier('--ease-out'));
CustomEase.create('rf-in', bezier('--ease-in'));
CustomEase.create('rf-inout', bezier('--ease-in-out'));

export const DUR = { 1: ms('--dur-1'), 2: ms('--dur-2'), 3: ms('--dur-3'), 4: ms('--dur-4') };
export const STAGGER = { words: ms('--stagger-1'), lines: ms('--stagger-2') };
export const EASE = { out: 'rf-out', in: 'rf-in', inout: 'rf-inout', scrub: 'none' };
export const UNLIT = parseFloat(read('--unlit')) || 0.42;
export const RISE_REM = parseFloat(read('--rise')) || 0.5;

/** Pinned scroll ranges, in viewport heights of scroll held beyond the act's own screen (BRIEF §7, §9). */
export const PIN = {
  door: 1.3,        // 5 panels × 2 doors roll up, then the open door holds
  chapters: 2.0,    // three chapters, one screen each
  services: 2.0,    // four panels, three wipes (critique: 2.7 → 2.0, the room goes to the peak)
  peak: 2.2,        // the rise — the page's culmination gets the most scroll (critique: 1.4 → 2.2)
  peakMobile: 1.0,  // §8: no pin longer than one screen
};

/** Where each act's pin breathes: hold fractions of the timeline (0–1). */
export const DOOR = { holdIn: 0.06, rollEnd: 0.8 };
