# Rob Francis Sports Cars

> Built to Alex's design system. The rules are **not vendored here** — they are
> resolved live, so this project never drifts from a stale copy.

# DESIGN DNA

**Read before producing anything visual** — a page, a component, a scene, CSS,
tokens, an image — and before any art direction, palette, type scale, spacing
ramp, motion or composition decision.

1. `/Users/alex/Desktop/WORK/design_dna/TASTE.md`
   — the manifest: operating rules, the two tiers, the Design Read, the dialect index.
2. `/Users/alex/Desktop/WORK/design_dna/.claude/rules/design-dna.md`
   — the build standard, `DNA1`–`DNA94`.
3. `/Users/alex/Desktop/WORK/design_dna/skills` — load the skills the task actually touches.
4. Fallback if this machine has no working copy: https://github.com/Sigovs/design_dna

**Say which path resolved, in one line, at the top of the report.**

## For scroll-driven or cinematic work

Load the **`scroll-site`** skill first. It carries the stack, the scaffold, the
concept gate and the definition of done.

## Stack

**Lenis ships on this project (`DNA90`)**, off under reduced motion, on one
loop with GSAP when GSAP is present.

## The concept gate

**`BRIEF.md` is complete before the first line of markup (`DNA1`).** An empty
section in it is an unfinished gate, not a detail to fill in later.

## Order of authority

1. Truth and access — contrast, provenance, reduced motion, discoverability.
2. `TASTE.md` and the INVARIANT tier of the skills.
3. The build standard, `DNA1`–`DNA94`.
4. The selected dialect, and this project's own direction below.
5. Plugins — `frontend-design`, Scrollcraft, `threejs-webgl`,
   `gsap-scrolltrigger`. **Reference only. They bind nothing** and are never the
   reason for a design decision. Neither is a library name.

## Working style

Never ask yes/no or confirmation questions to resolve taste — make the senior
call and note it in the report. Questions about **facts** — scope, content,
constraints, contradictions, missing assets — are expected. Three at most.

## Project direction

_A project direction is a brief executed inside the invariants, never instead of
them. Write it here: the business goal, the audience, what must not change._

Redesign of rfsportscars.com as a high-end collection site with a California
location. Content comes only from the live site and the Facebook page. Sources
and dates are in `BRIEF.md §0`.

**Must not change:** the navigation. Home · Inventory · Financing · About Us ·
Consignment · Virtual Tour · Contact Us, plus the utility bar (phone, By
Appointment Only, "We buy cars", My Collection).
**Adds:** a Sold Inventory section.
**Wish:** full motion, video, rotation, interactivity (scroll-site route).

## Feedback log

- **v4 = working copy of v3** (2026-10-11). `site/v4.html` runs on its own `site/src/v4/` (styles, main.js,
  motion), so v4 edits never touch v3 or index. v3 is frozen as the approved reference.
- **v4 navigation (client, 2026-10-11):** Inventory / Sell Your Car / Consign / About / Contact. Financing and
  Virtual Tour are out of the nav.
- **v4 header (client, 2026-10-11):** logo on the left and larger (56px desktop, 48 tablet, 40 phone); nav on the
  right in one row. Replaces the centred-logo split nav. Both edges sit on the hero copy's 3.5vw line.
- **v4 hero = the Jaguar film, not a scroll scrub (client, 2026-10-11).** `_masters/video/scrub-etype.mp4` (generated)
  encoded to `public/video/hero-jaguar-*` (AV1 1080 / H.264 1080 / 720×900 phone crop). Plays once and holds its last
  frame: it is a pull-back, so a loop would jump-cut to the close-up every 8s. Pause/Play kept. Reduced motion shows
  the last frame as the still. Rejected for this film: a centred crop, a California card on the right (the car fills
  the right in every frame — the card takes the title's place on scroll instead, `data-hero-swap`).
- **v4: Finance section removed (client, 2026-10-11).** Chapters are now 01 Consign · 02 Inventory (counters 01/02);
  its picture (`img/chapters/v3/01.webp`) dropped from the frame. Financing is no longer on the v4 page or in its nav.
- **v4 films swapped (client, 2026-10-11):** hero = Jaguar, About = the Porsche 356 film from the earlier hero. Both
  play by themselves (autoplay on scroll: About starts when it comes into view, pauses off screen), never scrubbed.
  Client wants **video, not scroll animation** — don't bring frame scrubs back for these.
- **v4 hero title on two lines (client):** "Collector. / Classic. Current."
- **v4 chapter images = real premises (client):** Consign = the office looking into the garage (180316); Inventory =
  the night facade's garage doors (180522, white pickup removed by AI edit — master `_masters/place/180522-no-truck.jpg`).
- **v4 hero bottom line (client, 2026-10-11):** copy and California card stand together on ONE bottom line
  (`--hero-base`, with air), card visible from the start, low and wide (horizontal). **Rejected:** the card stretched
  to the copy's height ("very bad"); the card arriving on scroll / taking the title's place on desktop. Pause/Play sits
  beside "View Inventory". Portrait tablets: card top right; phone unchanged.
- **v4 hero film loops through the dark** (fades to the ground, restarts under the veil) and the **intro rises out of
  that same dark** — no staircase in v4.
- **v4 scroll speed (client: "too slow, no scrub here except the Ferrari"):** Lenis back to defaults (lerp 0.1,
  wheel 1). Pins that only carried a handover are short: hero 55% of a screen (desktop), About 90%; chapters 120svh
  per chapter (was 190). The Ferrari walk-around keeps its scrub and its length. Don't lengthen pins without a scrub.
