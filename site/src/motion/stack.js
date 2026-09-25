// Shared machinery for the two pinned runs (Act 3 chapters, Act 5 services):
// panels stacked on one pinned stage, one live progress rule, the active panel owning pointer and focus.
import gsap from 'gsap';

/** Mask states for the seams: a box open, closed toward its top (leaving upward), closed toward its bottom
 *  (so opening it reveals from the bottom up — the direction the scroll travels). */
export const OPEN = 'inset(0% 0% 0% 0%)';
export const CLOSED_UP = 'inset(0% 0% 100% 0%)';
export const CLOSED_DOWN = 'inset(100% 0% 0% 0%)';

/** One progress rule for the whole pin: fill by scaleX, head by translateX. Returns the tween target. */
export function liveRule(rules) {
  const [live, ...rest] = [...rules].reverse(); // the top-most panel's rule is never covered
  gsap.set(rest, { autoAlpha: 0 });
  live.classList.add('rule--live');
  const measure = () => live.style.setProperty('--rule-w', `${live.getBoundingClientRect().width}px`);
  measure();
  gsap.set(live, { '--p': 0 });
  return { el: live, measure, cleanup: () => { live.classList.remove('rule--live'); live.style.removeProperty('--rule-w'); } };
}

/** Mark the active panel; the rest give up the pointer (they are transparent, not gone). */
export function activeSetter(panels) {
  let current = -1;
  return (i) => {
    if (i === current) return;
    current = i;
    panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
  };
}

/**
 * Keyboard parity (motion I2, MJ6): tabbing into a panel that is not on screen moves the scroll to it,
 * so a focused control is always the visible one.
 */
export function focusFollows(section, panels, getTrigger) {
  const onFocus = (e) => {
    const k = panels.findIndex((p) => p.contains(e.target));
    const st = getTrigger();
    if (k < 0 || !st) return;
    const y = st.start + ((k + 0.5) / panels.length) * (st.end - st.start);
    const lenis = window.__lenis;
    lenis ? lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
  };
  section.addEventListener('focusin', onFocus);
  return () => section.removeEventListener('focusin', onFocus);
}
