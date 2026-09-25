# BRIEF — Rob Francis Sports Cars

The concept gate. **No markup exists before this file does (`DNA1`).** An empty
section is an unfinished gate.

---

## 0. Client brief (Alex, 2026-09-24, verbatim)

> Website redesign / California location
> High End Collection website
> Use existing navigation
> Add sold inventory
> Content only from https://www.rfsportscars.com/ and https://www.facebook.com/robbfrancisportscars/

Motion wish (Alex): full motion, video, rotation, interactive.

**Scope (Alex, 2026-09-24): index page only for now.** Other pages come later.
**Reference (Alex): https://forgeautomotive.co.uk/** ("vot konechno krasivij site"). Captures and analysis go in §12.

### Existing site: facts pulled 2026-09-24

**Navigation (keep as is):**
Home · Inventory · Financing · About Us · Consignment · Virtual Tour · Contact Us
Utility bar: phone `(201) 247-0003` · "By Appointment Only" · CTA **"We buy cars"** ·
"My Collection (00)" (saved cars, `/my-garage/`).
Not in the top nav but live: `/warranty/` · `/privacy-policy/`.

**New section: Sold Inventory.** The current site links to it (`?page_id=280`),
but every candidate URL returns 404. There is no sold archive to migrate, so the
list of sold cars has to come from the client (or from Instagram).

**Platform:** All Auto Network (WordPress). Car detail pages and forms are
rendered client-side, so specs and photos per car could not be scraped. Car URL
pattern: `/{year-make-model}-c-{id}/`.

**Current inventory (homepage, 2026-09-24):**
1974 De Tomaso Pantera Custom · 2020 BMW Z4 sDrive M40i · 1982 Chevrolet Corvette ·
1973 Chevrolet Corvette · 2010 Harley-Davidson Sportster XL 1200 V-Twin

**About (verbatim):** "Robb Francis Sports Cars is an Independent Full Service
Dealership. We specialize in the purchase and sale of Superior Quality Import and
Domestic Collector, Classic and Current State of the Art Sports Cars."
Brands (verbatim): "Porsche, Ferrari, Lotus, Maserati, Alfa Romeo, Vintage Jaguars,
Mercedes Benz, and several renowned Domestic Collector Names like Chevrolet
(Vintage Corvettes) and Specialty Fords (GT 40, Shelby)."

**Locations:** "Historic Peapack, NJ", by appointment only. The Contact page says
"now purchasing collector and performance vehicles across both coasts", serving
"New Jersey and California". **No California address or phone is published anywhere.**

**Contact:** (201) 247-0003 · (908) 234-2100 · sales@rfsportscars.com
**Hours:** Mon, Wed–Sat 9:30 AM – 5:00 PM · Tue & Sun by appointment only
**Social:** instagram.com/robbfrancis_sportscars · facebook.com/robbfrancisportscars
**Services:** Consignment · Financing · Warranty · Buying cars ("We buy cars")

**The California place (photos from Alex, 2026-09-18, in `reference/place/`):**
A small street-front garage gallery. Two glass roll-up doors in a red timber
frame. Inside: navy walls hung with framed motorsport art and posters, a
mezzanine rack of vintage bicycles, and a tight floor of classics: a red
1960s roadster, a silver E-Type and 911s. A lounge corner with a leather club
chair, a desk and a rug. Outside: a patio with teak chairs, a canvas umbrella,
a stone wall and plants. A small white vintage Honda pickup is parked out front.
Warm and intimate, a collector's clubhouse rather than a showroom.
At night the glass doors glow like vitrines.

**Google summary (screenshots from Alex; secondary source):** classic, exotic
and performance dealership "with historical ties serving the Santa
Barbara/Montecito area". HQ and restoration/storage hub at 163 Main St.,
Peapack, NJ, with its "vehicle purchasing and consignment network" expanded
"to the California coast". Takes part in philanthropic auto events: United
Boys & Girls Clubs of Santa Barbara County, Rally4Kids. For California
inquiries, appraisals and appointments, the main office is (908) 234-2100.

**Alex's answers, 2026-09-24:**
1. California contact: use the Google-published (908) 234-2100.
2. Sold inventory: take it from the Facebook page.
3. 3D / rotation: Alex wants it "like Forge". Look for free 3D first; generated assets are allowed for the mockup.
4. **Process: concept and full brief go to Alex for reading BEFORE any build starts.**

**Mockup status (Alex, 2026-09-24):** this is a mockup, so image and video
copyright is not checked. Every borrowed asset is listed in §10 and gets
replaced before anything goes live.

**Empty on the live site:** the Virtual Tour page has no embed (only a heading), and
the Consignment and Finance pages show only form titles. No founder name, founding
year or awards are published.

---

## 1. Design Read

_Art director, 2026-09-24. Resolved from `/Users/alex/Desktop/WORK/design_dna/`, the canonical Mac path (no `./design_dna/` in this project). Delivery: **BUILD**, one direction._

- **Deliverable / audience / family.** The homepage (index only) of a by-appointment collector-car dealer. It is read by collectors in the Santa Barbara/Montecito area and by buyers and sellers nationwide who have never been inside. Family: **after-hours vitrine**, a lit room seen from a dark street, with the catalogue voice of a collector's archive.
- **Mandate: REDESIGN.** These carry through untouched, *listed first*:
  1. The RF shield and the "ROBB FRANCIS SPORTS CARS" wordmark lockup. We need a vector file; the 253 px PNG can't be used.
  2. The nav: labels, order and all seven items.
  3. The utility bar: phone · "By Appointment Only" · "We buy cars" · "My Collection (00)".
  4. The black and white of the logo.
  5. The site's own phrases, verbatim: "By Appointment Only", "We buy cars", the About paragraph and the brands list.
  6. The business facts in §0.

  What's in scope: layout, hierarchy, imagery, motion, type and colour. The live site's template has no photographic treatment to carry over.
- **Style mode: HYBRID.**
  - Anchor: `auction-editorial` (confirmed). It fits because what this business actually shows is a *record*: year, make, model, sold/for sale, by appointment. P3 (metadata composed) and P4 (one committed gesture) apply directly.
  - Contrast: `cinematic-industrial` (library). It controls only **light and image behaviour** in two places: the night street (Act 1) and the car stage (Act 4).
  - Signature influence: none. The signature move is bespoke (§6).
  - **Unifying principle:** *the only light on the page is light that comes out of the room*. Everything else behaves like a label on the wall.
- **Dimensionality: SUPPORT.** One constructed-depth act, the orbit peak (Act 4). The page is complete with that act replaced by its composed still (DM1). Every other act is real photography.
- **Motion register: heightened.** Two reasons: Alex's explicit brief ("motion, video, rotation, interactive"), and a concept that is literally a physical passage (a door that opens, a walk around a car). The amplitude goes up; the number of ideas does not (MJ3, MJ2).
- **Vault:** 9 relevant automotive entries, 0 unusable. Leaned on:
  - `vault/unitedcarriers-com` (3, in): long pins pay only if the passage tells a story, and the tail must hold the level. That's why this page has two pins, not eight, and ends in a real room.
  - `vault/semlerpremium-dk…` (3, in): inventory data gets hierarchy, not hiding. That shapes Act 3.
  - `vault/oilstainlab-com` (3, in): demonstration must not bury the car or the info. That's the reason for the Act 4 caption and the drag limits.

## 2. The concept

**The homepage is the California garage after dark. You see the collection through lit glass from the street, the door goes up, and everything after that is what an appointment gets you: the cars on the floor, one car you can walk around, the wall of cars already sold, and the chair where the deal is done.**

(It could be wrong. The case against: a buyer wants the cars, not the building. The answer is Act 3, which is inventory, arriving 3 viewports in, sooner than Forge's first product.)

## 3. The feeling curve (`DNA29`)

| # | Feeling | Caused by |
|---|---|---|
| 1 | **Pull**: the curiosity of a passer-by | The real night facade: two glass roll-up doors glowing in a dark street, cars and framed art visible behind the mullions. The lights come up once on load. |
| 2 | **Being let in** | The door itself rolls up with your scroll, panel by panel, and the lit interior (red roadster, bicycles on the mezzanine) is behind it. |
| 3 | **Appetite, choosing** | Current inventory as a typographic index. Five names, one lit frame that changes with the row you're on. |
| 4 | **Intimacy, awe (the peak)** | The room goes dark, and under the garage's track spots you walk around one car while BY APPOINTMENT ONLY stands behind it. |
| 5 | **Trust** | The wall of sold cars, hung salon-style like the real framed art on the navy walls, each with a museum label. |
| 6 | **Openness, your car next** | A hard cut to daylight: real footage of a 356 Speedster driving towards you. "…purchasing collector and performance vehicles across both coasts." |
| 7 | **Ease, being received** | The real lounge: leather chair, RF crest on the wall. The appointment, the phone, both locations. The page stops here. |

No two adjacent acts share a feeling. 3 and 4 are both about wanting a car, but 3 is *choosing among* and 4 is *being alone with*. They differ in kind, so neither is filler.

## 4. The peak (`DNA28`)

> *"Halfway down the lights drop and you're walking round a '75 Turbo under their garage spotlights, BY APPOINTMENT ONLY behind it in huge letters, like you'd been let in after closing."*

It gets:
- **The asset budget:** the only 3D scene and the largest single file.
- **The silence in front of it:** 0.4 vh of near-black with nothing but one mono line.
- **The most scroll room:** 2.4 vh pinned.

The type is the business's own utility-bar phrase, not a slogan written for the page.

**Dependency (C17):** the peak depends on one car.
- **Mockup:** the CC-BY 1975 911 Turbo model, captioned as a stand-in, not stock (GI3).
- **Production:** the slot is *the featured car*, shot as a real photographed orbit in the room (§10). When that car sells, it moves to the wall in Act 5, and the next featured car takes the stage.

## 5. Page grammar (`DNA36`)

**"The visit"**, a named new grammar: one continuous walk through a real place, with one excursion.

street → threshold → the floor → one car → the wall → *(out on the road: cut)* → the chair

Ground follows the place: night ink → gallery navy → black (the peak) → navy → daylight (footage only) → navy. Every ground change is a seam that says what changed (DNA64). The road is the only hard cut.

**Masses (C15):**
1. Street
2. Door/interior
3. Index + vitrine
4. Car stage
5. Wall
6. Road
7. Chair/close

The primary centre is Act 4. Acts 1–3 lead down to it and 5–7 exhale from it.

**How it differs from Forge** (its grammar is chaptered editorial: statement → 3 pinned chapters → 6 identical pinned service panels → type+car peak → 2 CTA panels → footer):
- **2 pins in the whole page (door, orbit), not ~9.** Each pin exists because a physical passage happens inside it.
- **Real place, real photographs.** The one CG object is visibly a stand-in and is lit as *our* room, not as a studio.
- **Services are 4 lines in Act 7, not 6 panels.**
- **A sold archive Forge has no equivalent for.**
- **~11.5 vh total against Forge's ~18.**
- **It ends in a real room**, not on a three-car render.

## 6. The signature move (`DNA37`)

**"The door goes up."** The real glass sectional door of the California garage is cut along its own aluminium rails into its five real panels. With your scroll it rolls up panel by panel, each panel tipping back onto its overhead track as it clears the top. Behind it is the lit interior. Scroll back and it comes down.

- **Why it's bespoke:** it only exists because this building has glass roll-up doors in a red timber frame. Nobody who's seen another build would mistake it for a mask wipe.
- **Role (MJ1):** narrative progression and continuity, outside → inside.
- **What each stage delivers (MJ10):** the closed door says *where*; the open door says *what's inside*. The release frame delivers the About line.

**Type & colour direction** (families only, no tokens yet):
- **Type: three voices, each with a job.**
  - **Extended grotesque** for display and scenery type (Monument Extended; Archivo at width 125 for the mockup). It's derived from the RF wordmark's extended caps and survives from `robb-site`.
  - **Book serif with a real italic** for car names, museum labels and reading text (Tiempos-class; Newsreader for the mockup). This is the catalogue/archive voice.
  - **Mono** for years, "Sold", phone and hours (Plex Mono-class), in tabular figures.
  - Forge's thin didone is *not* taken.
- **Colour.**
  - Grounds: **night ink** (the blue-black of the street) and **gallery navy** (the California walls).
  - Text: **lamplight cream** (the umbrella canvas under warm light), not robb-site's mauve.
  - One accent, **oxblood**, derived from the door's red timber frame and the red RF crest. It's used only for state and focus and never as the only carrier of meaning.
  - Daylight exists only inside the Act 6 footage.
  - Dark ground (DNA22): the subject *is* night and a lit room.

## 7. Shot list (`DNA27`, `DNA50`) — desktop

The whole page runs on Lenis from the first build (DNA90): on `gsap.ticker`, `autoRaf:false`, not constructed under reduced motion.

**Chrome during the pins:** the header retracts on scroll-down and returns on scroll-up. It stays transparent with a hairline and never goes opaque over a moving plate (U10, U16).

| Act | Shot | Device | vh |
|---|---|---|---|
| **1 Street** | **reveal**: the camera holds and the lights come on | Full-screen scene: the night facade (HEIC 180331) as a lit band in a dark field. A 1.2 s one-time exposure crossfade from a graded "lights-off" copy of the *same* frame. H1 and utility bar are HTML and visible at first paint. No scroll motion. | 1.0 |
| **2 The door** *(signature)* | **push-in → reveal**: door frontal, then the panels lift | Pinned. Frontal door plate (HEIC 180304) sliced along its real rails. The panels translate up and hinge back (rotateX) at the top edge. The interior plate (HEIC 180609) settles 1.06 → 1.0 behind. **Release:** the interior docks into the top ~65%, and a navy field below carries the About paragraph verbatim. No type over either plate. | 2.0 (pin 1.6) |
| **3 On the floor**: current inventory | **dolly**: the eye travels the list, the frame follows | Not pinned. Left: one sticky "vitrine" frame (4:3). Right: 5 rows (year in mono · name in serif · Save → My Collection · row links to the car page). The row nearest centre, or under hover or focus, crossfades the vitrine (240 ms). "All inventory →". No prices or specs (none sourced). | 1.4 |
| **4 The peak** | **silence**, then an **orbit** (~110° arc, fixed radius, target fixed on the car), then **release** | 0.4 vh near-black with one mono line. Pinned three.js scene (SUPPORT). BY / APPOINTMENT / ONLY in extended caps sits behind the car, and the roofline crosses the word mid-arc. The camera goes from a low front-3/4 to the rear-3/4. Scroll sets a target and damping moves the camera (DNA53). **At release:** drag continues the orbit within ±40° only, with a visible "Drag to walk around" label and ← → keys (DM7). Caption: "1975 Porsche 911 Turbo · 3D stand-in, not stock". CTA: Contact Us. | 3.2 (pin 2.4) |
| **5 The wall**: sold | **reveal** by composition, not by motion | Section title "Sold Inventory" (the site's own nav name). A salon hang on gallery navy, **built for the 5 real items we have** (`reference/sold/`: 1965 Sunbeam Tiger 260 · 1988 Mustang GT Convertible · 1999 Defender 90 · 1948 MG TC · 1933 BSA 249cc).<br>**Hang:** one dominant frame (the Sunbeam Tiger, about 2× the others) with four smaller square frames hung around it off-centre. It is *not* a grid of equal cards.<br>**Hang templates:** 4, 5, 7 and 9. New items join the hang around the dominant frame. Past 9, the oldest drop off and "All sold cars →" takes over (C17).<br>**Frames** are CSS (hairline + cream mat). The square 1440 px photos are used as they are.<br>**Museum label:** year/make/model in serif, status in mono. The status wording is a **claim pending client confirmation** (§11). Until Robb confirms, the mockup renders it as a visible placeholder, "SOLD · to confirm" (CP4). No dates, no counter, no total (CP7).<br>**Hover:** 2 px lift, nothing more. | 1.4 |
| **6 The road** | **interruption** (a hard cut to daylight), then the car **approaches** | hero1d.mp4 full-bleed. It plays once on entry and holds the last frame, with a visible Play/Pause control (MJ6). No loop beside text (DM9). Text in the dark left third of the forest frame (AA checked per frame, DM5). Copy from the client's promo, verbatim. CTAs: **We buy cars** (primary) · Consignment. | 1.2 |
| **7 The chair** | **release**: the camera settles and nothing moves | Lounge photo (HEIC 180321: chairs, RF crest, poster). "By Appointment Only" + the California phone (908) 234-2100. Four service lines: We buy cars · Consignment · Financing · Warranty. Footer: Historic Peapack, NJ with hours + (201) 247-0003 · California · email · Instagram/Facebook · Virtual Tour · Privacy · CC-BY credit for the 3D model. The type reaches its quietest setting. | 1.3 |

**Act 1 hero declaration** (TASTE §2):

| Item | Declaration |
|---|---|
| Viewport ownership | Full first screen |
| Scene | The real street at night |
| Object scale | The frontage spans ~100% of the width as a band ~40% of the height, set low; above it is dark field |
| Focal point | The left door's lit panes and the red roadster behind them |
| Negative space | The dark field above the band is the text-safe zone for: H1 "Robb Francis Sports Cars"; the verbatim subline "Collector, Classic and Current State of the Art Sports Cars"; the place line "California · Historic Peapack, NJ" (California wording pending Q1); and "By Appointment Only" |
| Excluded | Utility bar and nav, counted as chrome |
| Desktop crop | Full panorama width; the truck crops at the right edge on 16:10 |
| Mobile crop | Authored separately (§8) |
| Asset suitability | 5175 px original, suitable |

**Motion read** (short form):
- **Primary idea per viewport:** one each (lights on / door / list focus / orbit / none / footage / none).
- **Transport:** always the reader's (no autoplay pacing, no scroll-jack beyond the two honest pins).
- **Reduced motion:**
  - Act 1 is the lit frame.
  - Act 2 is the open-door interior with the About line.
  - Act 4 is the composed rear-3/4 still with the same type.
  - Act 6 is the poster still with a Play button.
  - Lenis off.
- **Cost:** the orbit costs about 5 MB and one pin of 2.4 vh. The door costs 1.6 vh. Both return a new truth at every stage.
- **Cut:** the videomap hub map, a marquee of brands, parallax on the sold wall, the hero push-in from facade to door (two photos, two times of day; a cut is more honest), a second road still, entrance fades on every section, and a cursor follower.

## 8. Mobile shot list (`DNA67`, `MJ8`) — authored separately

About 12 phone screens. No WebGL. No pins longer than 1 vh.

| Act | Mobile composition |
|---|---|
| **1 Street** | Wordmark + H1 on night ink *above* the image. Image: an authored 4:5 crop of the **left door + red post** (HEIC 180304), not the panorama. Lights-on crossfade kept (it's cheap). |
| **2 Door** | In-flow, no pin. As the door image crosses the centre, its five panels slide up across ~0.6 screen, revealing the interior (authored 4:5 crop of 180609 centred on the red roadster). About paragraph below. |
| **3 Floor** | Five stacked rows, each with **its own** 4:3 image above name, year and Save. No sticky vitrine. Content parity with desktop (U7). |
| **4 Peak** | Type stacked *above* the car (not behind). A **24-frame baked sequence** (4:5, 750 w) rendered from the same scene, scrubbed in-flow over ~1 screen with a short sticky. No drag. Reduced motion shows the rear-3/4 still. |
| **5 Wall** | The dominant frame full width, then the other four as a 2×2 of equal squares. The content is parallel, so equal size is argued here (DNA9). Labels under the frames at 14 px or more, with the same "SOLD · to confirm" placeholder. "All sold cars →". |
| **6 Road** | An authored 9:16 centre crop of the footage (720×1280; the car's path is central). Plays once. Text *below*, not over. |
| **7 Chair** | Portrait crop of 180321 (chair + crest). Tap-to-call (908) 234-2100 as a 44 px target. Footer stacked. |

## 9. Budget (`DNA38`, `DNA72`, `DM3`)

- **Total viewport-heights:** desktop **11.5 vh** (1.0 + 2.0 + 1.4 + 3.2 + 1.4 + 1.2 + 1.3); mobile ≈ 12 screens.
- **Total payload:**
  - Desktop **≤ 14 MB** for the whole page, with **≤ 1 MB before the first scroll** (hero AVIF ≤ 400 KB + fonts ≤ 150 KB + JS).
  - The GLB loads when Act 3 enters, and the video when Act 5 enters.
  - Mobile ≤ 6 MB.
- **Largest single asset:** the car GLB, **≤ 4.5 MB** (Draco + KTX2, with the clear-coat shell dropped for `MeshPhysicalMaterial.clearcoat`). Hero triangles ~200k. Textures 1024, and 2048 only for body paint (no macro shot). The video is ≤ 4 MB desktop (re-encoded from 10 MB) and ≤ 1.8 MB mobile.
- **Frame budget:**
  - Desktop: 60 fps during the orbit, < 100 draw calls, DPR capped at 1.75. The loop pauses offscreen and on a hidden tab (DNA75).
  - Mobile: 60 fps on the frame sequence and DOM transforms only.
- **LCP target:** ≤ 2.0 s desktop and ≤ 2.5 s mobile on 4G. The LCP element is the hero image or the H1 as HTML, never a canvas (DNA74).

### Open factual questions (max 3)

- **Q1.** A **"MILPAS MOTORS"** sign hangs inside the California garage. Is the space Robb Francis's own, shared, or Milpas Motors'? And what name, town and address may the page show for California? This affects the Act 1 place line and the footer.
- **Q2.** Sold inventory: the only candidates are 5 Instagram features from Oct 2025 – Feb 2026: 1965 Sunbeam Tiger 260, 1988 Mustang GT Convertible, 1999 Defender 90, 1948 MG TC and 1933 BSA 249cc. None of them says "sold". Can Robb confirm which of these are sold, and send any other sold cars he wants shown?
- **Q3.** Is the 356 Speedster footage (`hero1d.mp4` + stills) Robb Francis's own car or shoot? If yes, Act 6 can caption it. If not, it runs uncaptioned as mockup-only.

**Assumptions taken meanwhile:**
- The utility bar shows (908) 234-2100. The client's own promo and the Google summary both give it for California.
- The footer carries both numbers, each labelled with its location.

## 10. Assets (`GI3`, `GI6`)

_Real, licensed, or generated. Generated assets depict nothing real and carry
provenance._

- `reference/place/`: 8 real photos of the California location (phone, night, low quality; they show the place).
- `reference/repo-images/`: from github.com/Sigovs/robb-francis-website. Logo (253×54 PNG, too small, needs a vector), hero_desk 1920×1200, footer/whyrobb 1235w, buy1–6 at 408×230 (thumbnails only).
- `../_____video test/hero1d.mp4`, `../UNSORTED/videomap.mp4`: not reviewed yet.
- **`reference/found/` (Alex: "the good big photos", 2026-09-24):**
  - `hero1d.mp4`: 1920×1080, 7.1 s. A white Porsche 356 Speedster drives towards the camera on a forest road. **Real footage. Hero candidate.**
  - `356speedster_front_road / rear_road / front34_forest.jpg`: 1440×961, real photos of the same car and shoot.
  - `videomap.mp4` (1920×1080, 9.9 s) + `map.png`: US network map with glowing nodes, for "coast to coast NJ ↔ CA".
  - `pop up.png / pop up2.png`: old "We've expanded coast to coast" promo (red). Content only; the style is not carried over.
  - `gen_*`: generated 2752×1536. E-Type on a golden coast road (reads as Big Sur, usable); E-Type in a Mediterranean village (reads as Italy, not California, so avoid); grey 911 rear in a garage; navy 911 in a concrete garage; Jaguar mascot, vertical.
  - `robb_index.jpg`: darkened 356 frame from the earlier robb-site.
- The place photos are HEIC originals up to 5712 px in `../UNSORTED/do not git/` (the copies in `reference/place/` are 1200 px previews).
- No 3D models. No 360° photo sequences.

### Asset needs, per act (art director, 2026-09-24)

**Origin key:**
- **R** = real / client
- **L** = licensed or borrowed. Mockup only; replace before live (§0 mockup status).
- **G** = generated (`gen-` prefix + sidecar, GI6)

**Rule GI3 applies:** nothing generated may show the premises or a car that is for sale. The only place pictures are real ones.

| Act | Asset | Origin | Exact intent / processing |
|---|---|---|---|
| 1 Street | Night facade | R | `IMG_…180331.heic` (5175 px) → AVIF/WebP 2560 + 1440. The "lights-off" copy is a **grade of the same frame** (doors masked down about 2.5 EV, no content changed). It is not a generated image. **Production upgrade:** a locked-off real clip (8–10 s) of the doors from across the street at dusk, lights coming on. |
| 1 Street, mobile | Left door + red post | R | Authored 4:5 crop of `…180304.heic`. |
| 2 Door | Frontal door plate | R | `…180304.heic` (5139 px), masked by hand into the 5 real panels per door, using the same file. **Production upgrade:** two night plates from **one tripod position**, one door closed and one open, so the reveal registers perfectly. |
| 2 Door | Interior plate | R | `…180609.heic` (5712 px), red roadster centred. Mobile: authored 4:5 crop. |
| 3 Floor | 5 current-inventory photos | R | Capture from rfsportscars.com car pages with a headless browser. The pages render client-side, so a real browser can reach them. Aim for one consistent angle (front 3/4) at ≥ 1600 w. If smaller, the vitrine is set smaller, never generatively upscaled. A missing image gets a visibly marked placeholder frame (CP4). |
| 4 Peak | Car | L | Lionsharp **1975 Porsche 911 (930) Turbo**, Sketchfab, CC-BY: credit in the footer, drop the clear-coat shell, Draco + KTX2. If the wheels are separate meshes, turn the front wheels ~12° so it reads as parked, not as a CAD model. Caption: "3D stand-in, not stock". |
| 4 Peak | Light & reflection | L + built | Poly Haven `studio_small_03` (CC0) is only a dim specular base. Over it goes a built **"gallery box"** environment: navy walls, **4 warm track-spot strips** overhead (the California ceiling), and **1 cool vertical strip** camera-left (the glass door's glow). Navy-black ground plane with a baked contact shadow (DNA59). ACES, sRGB. Reflections must read as *this room*, not a studio (DNA58). |
| 4 Peak | Mobile & reduced-motion frames | Rendered | From the same scene: a **24-frame 4:5 WebP sequence** (750 w) and one **rear-3/4 still** (2400 w). |
| 4 Peak | **Fallback ladder** if the GLB is unusable | L → G | **(a)** 1972 911 Carrera RS (26k faces), same pipeline. **(b) A generated orbit:** generate one still, run image-to-video with an orbit camera, extract 48 frames, deflicker, and play as a scroll-scrubbed canvas sequence. Prompt intent: *"a 1970s rear-engine sports coupé, silver-grey, alone on a dark polished floor in a small gallery garage with deep navy walls; three warm overhead track spotlights; one cool vertical light strip from a glass door off-frame left; camera at wheel-hub height, slow 110° arc from front three-quarter to rear three-quarter; upper 40% of frame an even, dark navy wall with no objects (reading zone); no people, no text, no badges, no licence plates, no legible artwork."* Filename `gen-orbit-*`. Captioned as a stand-in. **(c)** Composed still only, with the peak type unchanged. |
| 5 Wall | 5 featured vehicles | R | `reference/sold/*.jpg` (1440×1440, first frame of each Instagram post; sources in `SOLD.md`). Facebook gave nothing usable while logged out. Square crops are used as they are. The Sunbeam Tiger is the dominant frame. `buy1–buy6` are **dropped**: their year/make/model is unknown. |
| 6 Road | Footage | R? | `reference/found/hero1d.mp4` re-encoded: desktop 1920 H.264 + AV1 ≤ 4 MB; mobile authored 9:16 crop 720×1280 ≤ 1.8 MB. Poster: `robb_index.jpg`. Reduced-motion still: `356speedster_front_road.jpg`. Contrast in the left-third reading zone is checked per frame. Caption depends on Q3. |
| 7 Chair | Lounge | R | `…180321.heic` (5024 px): chairs, RF crest, poster. Mobile: portrait crop on the chair + crest. |
| All | Logo | R | **An SVG of the RF shield + wordmark is required.** Ask the client. For the mockup only, trace the PNG and label it `trace-`. |

**Killed for the index (reasons given, so the kill sticks):**
- `videomap.mp4` / `map.png`: ~40 glowing hubs claim a network the sources don't support. The business has two points (CP7).
- `gen_etype_coast-village`: reads as Italy.
- `gen_911-grey_rear_garage` and `gen_911-navy_concrete-garage`: a generated garage next to the real one would read as the premises (GI3).
- `gen_etype_coast-road_golden`: a second road splits Act 6. Held in reserve for Consignment or About.
- `gen_jaguar-mascot` ×2: another maker's emblem used as ornament.
- `hero_desk`, `whyrobb`, `footer.jpg`: old stock, and a second image system (DNA23).
- The red promo pop-ups: **content kept** (its wording is the Act 6 copy and a phone source), **style dropped**.

**What survives from `../robb-site/`:**
- **Navy.** Re-derived from the real California walls, not inherited.
- **Monument Extended.** Re-derived from the wordmark's extended caps.

Everything else is killed:
- The mauve-cream text, and the burgundy + coral pair.
- The 10-section structure.
- All of its copy: "We find the cars not yet for sale", "This is not a dealership", network stats, the 1958 356A dossier, "MMVIII". None of it traces to §0, and "not a dealership" contradicts "Independent Full Service Dealership".

## 11. Claims ledger (`CP1`)

Every claim-shaped string — price, count, date, duration, guarantee, coverage,
superlative — with its source.

| Claim | Source | Date |
|---|---|---|
| Independent Full Service Dealership | rfsportscars.com/about-us | 2026-09-24 |
| Brands list (Porsche … Shelby) | rfsportscars.com/about-us | 2026-09-24 |
| Historic Peapack, NJ · by appointment only | rfsportscars.com/about-us | 2026-09-24 |
| Buying across both coasts, NJ + California | rfsportscars.com/contact-us | 2026-09-24 |
| Phones, email, hours | rfsportscars.com/contact-us | 2026-09-24 |
| California address / phone | **MISSING, needs a source from the client** | — |
| Sold cars (list, dates, prices shown?) | **MISSING, needs a source from the client** | — |
| "Sold" status on the 5 Act 5 vehicles | **NOT CONFIRMED.** Instagram shows them as featured / for sale (`reference/sold/SOLD.md`). Rendered as "SOLD · to confirm" until Robb confirms (Q2) | 2026-09-24 |
| Year/make/model of the 5 Act 5 vehicles | Instagram captions, verbatim in `SOLD.md` | 2026-09-24 |
| "…is now purchasing collector and performance vehicles across both coasts. Wherever you are, our team is ready to evaluate your car." (Act 6, verbatim) | Client's own promo pop-up, `reference/found/pop up.png` | 2026-09-24 |
| (908) 234-2100 for California | Client promo pop-up + Google summary | 2026-09-24 |
| "By Appointment Only" · "We buy cars" | rfsportscars.com utility bar | 2026-09-24 |
| "Collector, Classic and Current State of the Art Sports Cars" (hero subline) | rfsportscars.com/about-us | 2026-09-24 |
| 1975 Porsche 911 Turbo in Act 4 | **Not a stock claim.** 3D stand-in, captioned as such; Lionsharp CC-BY | 2026-09-24 |
| Santa Barbara / Montecito wording | **Secondary only (Google summary). Not rendered until Q1 is answered** | — |

## 12. Reference (`DNA3`)

_If a storyboard or reference image exists, it lives here and it is the primary
visual authority for composition, scale, lighting, spacing and hierarchy. It never
overrides contrast, the type floor, or provenance._

- **https://forgeautomotive.co.uk/**: named by Alex on 2026-09-24. Captures are in `reference/forge/` (1440×900, 19 scroll stops).
  What it does: black ground; one thin didone (`editorial`, weight 200, 80–140px, −2px tracking) + Geist small caps;
  Lenis; about 18 viewport-heights. Acts: full-bleed hero → "Our Approach" → 3 pinned chapters "01/03" with an inset
  image drifting over a blurred full-bleed version of itself → a statement line → 6 pinned service panels
  (text left, image right, progress rule along the bottom) → **the peak: a top-down red car rising through a
  giant "Ordinary / Ends Here" title, flanked by dark SUVs** → 2 full-bleed CTA panels (Builds, Stock) →
  footer "Refuse Ordinary" with three cars shot from behind.
  **What to take:** the restraint (one typeface voice, black, a single warm accent from the car itself), pinned
  chapters paced by a progress rule, and a peak built from type and car together.
  **What not to take:** its pace (six identical service panels in a row are one idea repeated) and its
  studio-render cars (we have real cars in a real place).

**Art director's read of Forge**, stated as principles rather than descriptions (TASTE §6):
- Forge solves *"a service business with little physical to show"* by pacing a few images through pinned chapters with a progress rule. **Here that means** pins are spent only where a physical passage happens: the door (Act 2) and the walk-around (Act 4). That's two pins in the page, and Act 4 carries a progress rule.
- Forge solves *"the peak must be felt, not read"* by making type and car one object at one scale (the car rises through the title). **Here that means** our car's roofline crosses the business's own phrase, BY APPOINTMENT ONLY, while the camera walks around it. The type is theirs, the move is an orbit, and the stage is lit as their room.
- Forge solves restraint with one voice on black, where the car's red is the only colour. **Here that means** the only colour is what the California place emits: warm light through the glass and the oxblood of the door frame.
- **Not taken:**
  - The six equal service panels: services become four lines in Act 7.
  - The studio renders: real photographs throughout, and the single CG car is captioned as a stand-in and lit as our room.
  - The three-car "Refuse Ordinary" footer: the page ends in the real lounge.
- Visited live? No. The 19 captures answered every question.
- **Invariant check on the reference:** Forge's grey-on-black body copy at about 15 px needs AA measured on our build. Its taste does not waive `color I1`.

**Additional observations from `reference/place/`, relevant to the build:**
- The RF red shield crest hangs on the lounge wall.
- A Rally4Kids / United Boys & Girls Clubs of Santa Barbara County poster hangs in the lounge. It is visible, but it's not used as a claim (the Google summary is a secondary source).
- **A "MILPAS MOTORS" sign hangs inside the garage** (visible through the glass in 180331 and 180522). See Q1.
