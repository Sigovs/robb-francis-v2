// Light touches (BRIEF §7 Act 7–8). Each settles as its section arrives and is finished by the time the
// section owns the screen — nothing moves while it is being read (DM9), and nothing is ever hidden.
import gsap from 'gsap';

/** Inventory (chapter device): its blurred field settles — a short dolly back — as the panel arrives. */
export function inventorySettle(section) {
  const img = section.querySelector('.chapter__field img');
  if (!img) return;
  gsap.fromTo(img, { scale: 1.16 }, {
    scale: 1.08, ease: 'none',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true },
  });
}

/** Closing: the three cars roll the last metre into their places, then everything stops (release). */
export function closingSettle(section) {
  const cars = section.querySelector('.closing__cars');
  if (!cars) return;
  gsap.fromTo(cars, { yPercent: 8 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 15%', scrub: true },
  });
}
