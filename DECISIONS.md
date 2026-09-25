# Locked build decisions (index, static pass, 2026-09-24)

- Stack: Vite + plain HTML/CSS/JS in `site/`. gsap 3.15.0, lenis 1.3.26 (autoRaf false, gsap.ticker, anchors, off under reduced motion). No three.js.
- Display face: `--font-display` in `site/src/styles/tokens.css`. Stand-in Noto Serif Display wght 250 / wdth 70 (closest in render to PP Editorial New Ultralight). Drop `PPEditorialNew-Ultralight.woff2` in `site/public/fonts/` and set `--display-wght: 200; --display-wdth: 100%`. `font-stretch` alone drives the wdth axis (measured identical); no `font-variation-settings` anywhere. While the file is absent, `vite.config.js` strips the @font-face block (PostCSS, marker comments) so nothing is requested.
- Sans: Geist 400/500. Labels 14px tracked caps. Display never < 40px.
- Accent: door-frame red sampled #751205; lifted #c8412c for focus/active/rule head only.
- Header: transparent + one soft top falloff (::before), never opaque.
- Door: 2 doors x 5 panels (rails at .1806/.3448/.5524/.7364/.9457 of plate height), each panel carries its own plate slice; interior 180609 behind. Static = closed; reduced motion = open.
- Hero H1 stacked "Collector, / Classic" (AA on every film frame needed the narrower block).
- Logo: `trace-logo.svg` / `trace-shield.svg`, traced from the 6300px raster embedded in the live site's brand-logo.svg. Replace with the client master.
- Inventory photos: captured from rfsportscars.com /imagetag/{id}/main/l/ (1920w) into `site/_capture/`.

## Taste pass (2026-09-24, while Alex was away)

- **Palette rebuilt, warm ladder removed.** `--c-ground #0a0b0f` (near-black with ~6% of the gallery navy, sampled off the lounge wall at rgb 11,12,33), `--c-ground-2 #101218`, `--c-deep #06070a` (closing/footer, was #000), `--c-ink #eceef1`, `--c-ink-2 #a7abb2`, `--c-ink-3 #8c9199`, hairlines from ink. `--c-bone`/`--c-grey*` no longer exist. The names bone/grey were retired deliberately.
- **The brown was in the source photos, not the grade.** `build-images.mjs` white-balances the place photographs (iterated gray-world on near-neutral pixels, so the red frame and red cars keep their hue). Door at 55% strength (the full correction turned the aluminium periwinkle). Generated closing cars neutralised (gains clamped 0.8–1.28; the mobile frame is also desaturated to 0.45). `ONLY=<job>` rebuilds a subset.
- **Type scale: four ranks.** `--fs-peak` (min(11vw, 17.5svh) on the stage), `--fs-d1` (all act titles), `--fs-d2` (About + brands sentence), `--fs-count`. Roles added: `.lead` (sentence-case sans, e.g. the hero sub-line and the closing sentence) and `.vehicle` (every car name, proper case, 16px 500). Caps stay short (I4).
- **Header:** the shield leads; the utility row and the nav are in ink-2 at 0.12em; only the current page and "We buy cars" carry full ink. Social links live in the footer only. `--header-h` is 6.5rem.
- **Door:** the interior plate is now the gallery (top 54% of 180609; mobile is a 4:5 of the art wall and E-Type). It is dimmed until the door clears (`--dim`), and each panel's rail throws a contact shadow (`--lift`).
- **Chapter/service seams:** sequenced masks, never crossfades. Text lines leave and enter through their own clip, the inset closes and opens, and fields dip through the ground.
- **Peak final frame:** "By Appointment" / car / "Only". The nose sits over line 1's lower band; "Only" sits over the rear deck, with a local radial scrim (no text-shadow). Everything is keyed to `--pk`, and the release hangs off line 2. The stand-in disclosure is at the left edge, mid-height.
- "By Appointment Only" is removed from the hero foot and the About foot: the header carries it and the peak is its climax.
- Before/after: `site/_shots/before-taste/motion/` versus `site/_shots/motion/`; the multi-viewport peak frames are in `site/_shots/taste/`.

## Critique pass (2026-09-24, same evening)

- **Header:** the drawer takes the nav at ≤1180px, and the utility bar becomes two rows there. "By Appointment Only" is visible at every width (the phone has its own row). The nav is in `--c-ink`, and the header scrim holds ≥0.86 down to 108px. After the hero, the header collapses to the shield row on the way down and comes back on the way up or on focus (`initHeaderCollapse`, main.js).
- **Seams:** lines exit (clip + opacity 0) before the seam's midpoint; insets open and close from their centre. **Lenis snap** (`src/motion/snap.js`) runs in proximity mode at 36%, with points only inside the two pins, at `--dur-3`.
- **Peak:** the car is `gen-peak-car-body` (silhouette crop), painted at about 39.6vw, and overshoots the bottom at release. It enters from progress 0. `YAW = 0` until the frame render exists. Pins: peak 2.2, services 2.0. The release flanks the car on desktop and sits below it on tablet portrait and phone, with the stand-in disclosure inside the release.
- **Door:** the panels are `door-rails-*` (the aluminium plus a 10% frost, panes cut to alpha), and the plate covers 100svh.
- **Hero film:** the loop is trimmed to 0–3.8s (the close shot after the 3.87s cut clipped the car). The phone hero is a separate composition: copy on the ground plus a 4:5 film band (`hero-720x900`). On tablet portrait, the copy runs as one line beneath the car. Masters are in `site/_masters/video/`.
- **Act 7:** Inventory takes the chapter device (the Pantera as a landscape inset). The Sold wall has one grade (white balance, saturation 0.8, blacks lifted).
- **CTAs:** the service titles are the links (→), the four service buttons are gone, and "Browse Inventory" is removed from chapter 03.
- **GI4:** the marque marks are retouched out of `gen-close-trio.png` (`scripts/retouch-gen.mjs`; the original is in `_alts/`).
- **Gates:** declared in `site/.gates/declare.json` plus `content-ledger.json`, and copied into `dist/.gates/` after `npm run build`. Last run is in `site/.gates/last-run/`. Gate 5 is Alex's.
