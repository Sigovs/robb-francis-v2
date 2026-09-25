# V2 — working version (started 2026-09-25)

**V1 is kept as a failed test** in `../______ROBB FRANCIS SEPTEMBER REDESIGN/` (see `V1-RETRO.md`). This folder started as a copy of V1 and is where V2 gets built.

**Carried from V1 as ideas only (per Alex):** the section under the header (the door), "By Appointment Only" as the peak, and the closing before the footer.
**Rule for V2: media first.** Decide which real photos and footage exist and what gets shot or generated before laying out the acts.
**New since V1:** the client's master vector logo (`LOGO/`, installed as `site/public/img/brand/rf-logo.svg` and `rf-shield.svg`, replacing the traces).

Everything below is the V1 brief, to be revised for V2.

---

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

_Art director, v2, 2026-09-24. This rewrite follows **Alex's decision: Forge's skeleton and language almost 1:1, filled with Robb Francis content.** The previous direction ("The visit") is saved as `BRIEF.backup-2026-09-24-visit.md`. Resolved from `/Users/alex/Desktop/WORK/design_dna/`, the canonical path. Delivery: **BUILD**._

- **Deliverable / audience / family.**
  - Deliverable: the homepage (index only) of a by-appointment collector-car dealer.
  - Audience: collectors and sellers in NJ and California who judge the brand before calling.
  - Family: **nocturne automotive editorial.** Black ground, one thin didone, pinned chapters, and a type-plus-car peak.
- **Mandate: REDESIGN.** These carry through untouched:
  1. The RF shield + wordmark. We need an SVG; the 253 px PNG can't be used.
  2. The 7 nav items and the utility bar (phone · By Appointment Only · We buy cars · My Collection).
  3. The black and white of the logo.
  4. The verbatim phrases: About paragraph, brands list, "By Appointment Only", "We buy cars".
  5. The business facts in §0.
- **Style mode: DIRECTED HYBRID.**
  - **Anchor: the Forge reference.** It governs grammar, type, ground, pacing and CTA shape, under DNA3 reference authority by Alex's explicit instruction. In dialect terms it reads as `cinematic-industrial` (dark ground, the lit car as the one mass, heavy eased motion).
  - **Contrast: `auction-editorial` (confirmed).** Only on information: the Sold wall's museum labels, inventory as a composed record, and small caps as metadata.
  - **Signature: bespoke**, the roll-up door (§6).
  - **Unifying principle:** *Forge's black stage, lit only by real Robb Francis cars and the real California garage.*
- **Dimensionality: SUPPORT.** The peak is a layered, scroll-driven rise. The car is a baked render from the 3D model with a small rotation, passing between the two lines of the title. Nothing else is constructed. With the car layer removed, the page is still complete (DM1). three.js is **not loaded at runtime**: the GLB is rendered offline to frames, because it's the lowest method that is enough (DNA45).
- **Motion register: heightened.** Reason: Alex's explicit brief ("motion, video, rotation, interactive") and a reference built on scroll choreography. One primary idea per viewport (MJ2).
- **Yields, stated:**
  - DNA36 (vary the grammar between builds) and DNA37 (a signature that can't be mistaken for a known device) yield to DNA3, because Alex directed the reference skeleton. The door stays the one bespoke move.
  - `auction-editorial` P1 (subtract before adding) and P8 (motion seasons, it doesn't perform) yield to the directed reference.
  - **Floors kept:** U11 (one art direction), color I1/I6 (AA on the composited render), typography I7/I10 (14 px floor; the thin didone verified in the render and never used below ~40 px), and GI3.
- **Vault:**
  - `vault/unitedcarriers-com` (3, in): a tail that drops the level fails. That's why Acts 7–8 are designed as carefully as the peak.
  - `vault/rolls-roycemotorcars-com…` (3, in): video should read as a continuation of the environment. That's the brief for the hero footage.

## 2. The concept

**Robb Francis on Forge's black stage: a thin serif voice and pinned chapters that end in one car rising through "By Appointment Only", with the one thing Forge can't have, a real California garage whose glass door rolls up to let you in.**

(It could be wrong. The case against: the Forge skeleton is a *service* site, and this is a *dealer*. So current and sold inventory must arrive as full-bleed CTAs, not as an afterthought. Act 7 is built to carry that.)

## 3. The feeling curve (`DNA29`)

| # | Feeling | Caused by |
|---|---|---|
| 1 | **Allure** | Real footage: a white 356 Speedster driving at you out of a forest road, with a thin didone line over it. |
| 2 | **Being let in** | The glass roll-up door of the California garage rises and the lit interior is behind it. Then the About line, verbatim. |
| 3 | **Understanding what they sell** | Three pinned chapters: 01 Collector · 02 Classic · 03 Current State of the Art. Each is a real image drifting over a blurred copy of itself. |
| 4 | **Breadth** | One statement screen: the brands list, verbatim, set as a single long didone sentence. |
| 5 | **Practical confidence** | Four pinned service panels: We buy cars · Consignment · Financing · Warranty. |
| 6 | **Awe (the peak)** | Silence, then a 911 rising from below through a giant "By Appointment / Only", flanked by two darker cars. |
| 7 | **Proof, then choice** | Two full-bleed panels: Sold Inventory (the salon wall of 5) and Inventory (the current five). |
| 8 | **Resolution** | Three cars from behind, in front of the garage glowing at night. "Across both coasts", the phone, By Appointment Only. |

Adjacent acts differ. The main risk is 3 against 5, two pinned text-and-image runs back to back. That's why they are separated by Act 4 and use different devices: inset-over-blur for the chapters, split panel for the services.

## 4. The peak (`DNA28`)

> *"Near the end the screen goes black, and a silver 911 slides up out of the bottom right through the words BY APPOINTMENT ONLY, turning slightly, with two dark cars either side, exactly like Forge but it's their thing."*

It gets:
- **The largest image asset** (a 24-frame baked sequence).
- **0.5 vh of silence in front:** black, one small-caps line.
- **The most scroll room:** 2.2 vh pinned (as built, critique pass 2026-09-24; services were cut to 2.0 to pay for it).

**Mechanics:**
- The title is two lines, "By Appointment" / "Only", in didone at about 12–14 vw (Forge's scale).
- The car enters from below the fold. As it rises it goes **over** line 1 and **under** line 2, which gives depth through occlusion (one depth idea, DM6).
- It turns about 20° in yaw across the rise, using baked frames: that's the "rotation". **As built: yaw 0 until the 24-frame render exists** — a 2D spin of a top-down still read as a rotating sticker (critique). The `data-frames` hook is in place.
- **As built:** the car (cropped to its silhouette, painted ~40vw) enters from the first scroll, its nose settles over line 1's lower band, "Only" crosses its roof, and at release it overshoots the bottom edge like Forge. The release (location, **Contact Us**, phone, stand-in disclosure) flanks the car on desktop and sits below it on tablet portrait and phone.
- The flank cars (generated, darker by about 2 stops) rise at 0.7× speed for parallax, since they're further back.

**Dependency (C17):**
- **Mockup:** the Lionsharp 1975 911 Turbo (CC-BY), with the caption "3D stand-in, not stock" (GI3).
- **Production:** a real top-down shot of a featured car, or the brand line only.
- **Fallback chain:** §10.

## 5. Page grammar (`DNA36`)

**Chaptered editorial, Forge's grammar, taken on purpose.**

hero → statement-slot (our door) → 3 pinned chapters → statement line → pinned service panels → type+car peak → 2 full-bleed CTA panels → closing three-car screen + footer.

**Masses (C15):**
1. Hero footage
2. Door/interior
3. Chapters
4. Brands line
5. Services
6. Peak
7. CTA pair
8. Closing

**Where it differs from Forge, deliberately:**
- **The statement slot is the real door**, not a text block.
- **Chapters and panels use real photographs** of the place and of real cars, not studio renders. Generated images appear only as darker flank cars and background cars, and are labelled.
- **4 service panels, not 6.** Forge's run of six is one idea repeated.
- **The CTA pair includes a Sold archive** Forge doesn't have.
- **The closing is set in front of *our* garage.**
- **Total 17 vh**, against Forge's ~18.

## 6. The signature move (`DNA37`)

**"The door goes up"**, kept from v1. The real glass roll-up door of the California garage is cut along its own aluminium rails into its 5 panels. With your scroll it rolls up panel by panel, each panel tipping back onto its overhead track, and the lit garage is behind it. Scroll back and it comes down.

- **Placement:** it takes Forge's "Our Approach" slot. The About paragraph arrives on black beneath the docked interior at release.
- **Role:** narrative progression, outside → inside (MJ1).
- **What each stage delivers (MJ10):** the closed door says *where*; the open door says *what's inside*; the release delivers the About paragraph.

**Type & colour direction** (families only):
- **Type: two voices, as Forge.**
  - A thin high-contrast **didone** for display: Forge's face is PP Editorial New at weight ~200; license it for live, trial it for the mockup. Set at 80–140 px with about −2 px tracking, and **never below ~40 px** (typography I10).
  - A **Geist**-class grotesque (OFL) for body at 16–18 px and for tracked small caps at ≥ 14 px (the I7 floor; Forge's 11–12 px labels are *not* copied).
  - Tabular figures for years and phone numbers.
- **Colour.**
  - Near-black ground, bone/off-white text, and one mid-grey for secondary text, verified AA on the composited render (color I6). Forge's dim grey headings in their "unlit" state count as decoration and carry no information.
  - Accent derived from the red of the California door frame and the RF crest (oxblood). It's used only for focus, active state and the progress rule's head, never as the only carrier of meaning.
  - Robb-site's navy and mauve are **dropped**. Navy appears only where it really is: the walls in the photographs.

## 7. Shot list (`DNA27`, `DNA50`) — desktop

**Common rules:**
- Lenis from the first build, on `gsap.ticker` (DNA90).
- **One pinned section at a time** (DNA47).
- Chrome as Forge: the social icons and the utility bar sit top-left, the RF shield top-centre, and the nav is the 7 fixed items. Since the IA is fixed, the nav is not Forge's "Navigate" drawer: it runs inline on desktop and becomes a drawer on mobile.
- The header is transparent with no fill and never goes opaque over moving plates (U16).

| Act | Shot | Device | vh |
|---|---|---|---|
| **1 Hero** | **push-in** (the car drives at the camera) | `hero1d.mp4` full-bleed, muted, looping, with a visible pause control (MJ6). The poster frame paints first; LCP is the poster plus the HTML H1. **Didone H1 from the verbatim About line:** "Collector, Classic" over a small-caps line "and current state of the art sports cars". Small caps "By Appointment Only" + scroll cue. Headline in the dark upper-left forest area; AA checked per frame (DM5). | 1.0 |
| **2 The door** *(signature)* | **reveal** — *as built: pin 1.3; plate at 100svh; panels carry only their rails + a 10% frost, so the room behind the glass is 180609 from the first frame* | Pinned. Frontal door plate (HEIC 180304), 5 panels lift and hinge back. The interior (HEIC 180609) settles 1.06 → 1.0 behind. **Release:** the interior docks into the upper ~60%. Beneath it on black: small caps "About Us", then the About paragraph verbatim at Forge's statement scale (didone ~48–56 px, never below 40). | 2.3 (pin 1.3) |
| **3 Chapters 01/03** | **dolly**: the inset drifts across its own blurred field | Pinned, **"01 / 03" counter** top-right in didone, **progress rule** along the bottom (Forge d00 proportions: inset ~31% width at left-centre, text block right, title in didone ~96 px).<br>**01 Collector:** interior garage wall with the framed art (HEIC 180316 crop). Real.<br>**02 Classic:** `356speedster_front34_forest.jpg`. Real.<br>**03 Current State of the Art:** the 2020 BMW Z4 M40i listing photo (captured, R).<br>Each gets one line of body text drawn only from §0: 01 the brands' collector names; 02 "Vintage Jaguars… Vintage Corvettes"; 03 "Current State of the Art Sports Cars". Where no verbatim sentence fits, the chapter carries only title + image; no copy is invented. The blurred field is a pre-blurred copy of the same image (not a live filter). | 3.0 (pin 2.0; snap to whole chapters) |
| **4 Statement** | **hold** (the camera still, the type is the event) | Black. The brands list verbatim ("Porsche, Ferrari, Lotus, Maserati, Alfa Romeo, Vintage Jaguars, Mercedes Benz, and several renowned Domestic Collector Names like Chevrolet (Vintage Corvettes) and Specialty Fords (GT 40, Shelby).") in didone ~56–64 px, centred, max 22 ch per line. Words brighten from grey to bone as you scroll (Forge's reveal); only colour moves, not layout. The fully lit state is the reduced-motion state. | 1.0 |
| **5 Services** | **cut** between panels (each seam = a new service) | Pinned, **text left / image right** (Forge d01–d04: a 50/50 split, text block at ~9% from the left edge), progress rule along the bottom. Small caps "Service"; didone title; body verbatim where the site has it. **As built: the title is the link (with a →); the four outlined buttons were cut** — four identical buttons under four titles were one ask four times (critique, D6).<br>**We buy cars:** `356speedster_front_road.jpg` (the car coming to you). CTA "We buy cars".<br>**Consignment:** lounge HEIC 180321. CTA "Consignment".<br>**Financing:** desk corner HEIC 180316. CTA "Financing".<br>**Warranty:** `356speedster_rear_road.jpg`. CTA "Warranty".<br>Image change = a vertical wipe of the right half (Forge d03–d04), 1 device. | 3.0 (pin 2.0; snap to whole panels) |
| **6 Peak** | **silence → rise** (a vertical dolly with a small yaw turn) → **release** | 0.5 vh of black + small caps "Robb Francis Sports Cars". Pinned rise as in §4: 24-frame WebP-alpha sequence of the car + 2 generated flank cars + a darkened dust/asphalt ground plane. At release: caption + **Contact Us** + "(908) 234-2100". | 3.7 (0.5 silence + 1 + pin 2.2) |
| **7 CTA pair** | **reveal** (full-bleed, as Forge d09/d10) | **Panel A, Sold Inventory:** black field, the 5 Instagram photos hung as a salon wall (the Sunbeam Tiger dominant), each with a museum label (year/make/model + "SOLD · to confirm", CP4). Didone title "Sold Inventory" and CTA "View Sold Inventory".<br>**Panel B, Inventory:** *as built:* the chapter device — the Pantera as a landscape inset over its own blurred field (the listing photo is too small for a bleed, per §10) — (1974 De Tomaso Pantera Custom listing photo, captured). Didone "Inventory", a small-caps list of the 5 current cars (verbatim names), and CTA "Browse Inventory".<br>No prices, no counters. | 2.0 |
| **8 Closing** | **release**: everything stops | As Forge d11–d18: small caps line, didone two-line title, CTA, three cars from behind. **Our set:** the real night facade (HEIC 180331) as a dim, softened background plate. In front: three **generated** cars seen from behind (centre light-coloured, flanks darker), as a separate layer and **labelled as a stand-in composite** (see §10 and GI3). Small caps: "Now purchasing collector and performance vehicles across both coasts". Didone two-line title: **"New Jersey / California"** ("By Appointment Only" stays the peak's line and isn't repeated). CTA "Contact Us". Small caps "(908) 234-2100 · By Appointment Only". Footer below: Historic Peapack, NJ + hours + (201) 247-0003 · California · email · socials · Privacy · the 3D model credit. | 1.5 |

**Motion read** (short form):
- **Primary ideas:** footage / door / drifting inset / words lighting / panel wipe / rise / none / none.
- **Transport:** always the reader's.
- **Reduced motion:**
  - Hero is the poster with Play.
  - The door is open.
  - Chapters and services stack as static text + image pairs.
  - The brands line is fully lit.
  - The peak is the composed final frame.
  - Lenis off.
- **Cost (as built, 2026-09-24):** 4 pins totalling 7.5 vh (door 1.3, chapters 2.0, services 2.0, peak 2.2). The pinned runs snap to whole chapters/panels (Lenis snap, proximity, --dur-3); outside them the scroll is free. That's the price of the Forge skeleton, and it's accepted by direction. Each pin earns it: every panel or chapter delivers a different fact.
- **Cut:**
  - Forge's 6th and 5th service panels.
  - The hero push-in from facade to door.
  - The videomap.
  - The cursor follower.
  - Parallax on the Sold wall.
  - A live three.js orbit (replaced by a baked rise).

## 8. Mobile shot list (`DNA67`, `MJ8`) — authored separately

About 15 phone screens. **No pins longer than 1 screen**, no WebGL, no live blur.

| Act | Mobile |
|---|---|
| 1 Hero | **As built (gates, C22):** a 9:16 full-height frame of the 1080p footage cannot hold the car (≤ 499 source px wide; the car is 576), so the phone hero is a separate composition: copy on the ground under the header, the film as an authored **4:5 band** (`hero-720x900`, 864×1080 crop centred on the car). The loop is trimmed to 0–3.8 s on every format: the close shot after the 3.87 s cut clipped the car. |
| 2 Door | In-flow, no pin: an authored 4:5 crop of the **left door** whose 5 panels slide up as it crosses the centre. The interior (4:5 crop on the red roadster) is revealed, with the About paragraph below. |
| 3 Chapters | Three stacked blocks: "01 / 03" small caps, didone title (≥ 40 px), the image **full width** (no inset/blur pair). |
| 4 Statement | The brands sentence is set in Geist at 22 px. Only its opening, "Porsche, Ferrari, Lotus", is in didone at 44 px, because below ~40 px the thin didone stops being drawn (I10). |
| 5 Services | 4 stacked text + image pairs; the image comes first, then the text. |
| 6 Peak | Title stacked ("By / Appointment" on two tight lines, then "Only") at 17vw. **As built:** the car rises from the first scroll over ~1 screen, sticky (12-frame sequence when it exists). Release + stand-in disclosure below the car. Flanks dropped (no room). |
| 7 CTA pair | **Sold:** dominant frame full width + a 2×2 of the other four, with labels ≥ 14 px. **Inventory:** the lead image + a list of 5. |
| 8 Closing | An authored 4:5 closing composition: the centre car only, with the facade behind. Title + tap-to-call (44 px target) + footer stacked. |

## 9. Budget (`DNA38`, `DNA72`, `DM3`)

- **Total viewport-heights:** desktop **17.0 vh** (1.0 + 2.0 + 3.0 + 1.0 + 3.6 + 2.9 + 2.0 + 1.5). Mobile ≈ 15 screens.
- **Total payload:**
  - Desktop **≤ 15 MB**, of which **≤ 1.2 MB before the first scroll**: poster AVIF ≤ 300 KB + fonts ≤ 150 KB + JS ≤ 120 KB. The video streams after LCP.
  - Mobile **≤ 6 MB**.
- **Largest single asset:** the hero video, **≤ 4 MB** (1080p, AV1 + H.264, re-encoded from 10 MB). Mobile 720p ≤ 1.8 MB. The peak sequence: 24 × ≤ 110 KB (1600 w WebP-alpha) ≈ 2.6 MB desktop, 12 × 60 KB mobile.
- **Frame budget:** 60 fps desktop and mobile. DOM is transform/opacity only (DNA76). Canvas or `<img>` swap for the sequence, with no per-frame decode stalls (preload into ImageBitmaps).
- **LCP target:** ≤ 2.0 s desktop and ≤ 2.5 s mobile on 4G. The LCP element is the poster image or the H1, never the video or a canvas.

### Open factual questions (max 3)

- **Q1.** A **"MILPAS MOTORS"** sign hangs inside the California garage. Whose space is it, and what name, town and address may the page show for California?
- **Q2.** Which of the 5 Instagram vehicles (1965 Sunbeam Tiger 260, 1988 Mustang GT Convertible, 1999 Defender 90, 1948 MG TC, 1933 BSA 249cc) are actually sold? Are there more?
- **Q3.** Is the 356 Speedster footage and its stills Robb Francis's own car or shoot? The hero, chapter 02 and two service panels now depend on it.

**Assumptions:** the utility bar shows (908) 234-2100 (client promo + Google summary); the footer shows both numbers, each labelled with its location.

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

### Asset needs, per act (v2, Forge skeleton, 2026-09-24)

**Origin key:**
- **R** = real / client
- **L** = licensed or borrowed (mockup only, replaced before live)
- **G** = generated: `gen-` prefix + a sidecar with model, date and exact prompt (GI6), and **labelled "stand-in" in the mockup**

**GI3 applies to every row:** nothing generated shows the premises, a car that is for sale, or a person. No generated frame contains text, badges, plates or logos (GI4).

| Act | Asset | Origin | Intent / processing |
|---|---|---|---|
| 1 Hero | `hero1d.mp4` | R? (Q3) | Re-encode: 1080p AV1 + H.264 ≤ 4 MB, and an authored 9:16 720p ≤ 1.8 MB. Poster = first frame as AVIF. |
| 2 Door | HEIC 180304 (door), 180609 (interior) | R | 5 panels per door masked by hand from the same file. Production: two night plates from one tripod, door closed and door open. |
| 3 Chapters | 01: HEIC 180316 crop · 02: `356speedster_front34_forest.jpg` · 03: the BMW Z4 listing photo | R | Each gets a pre-blurred copy (a 40 px Gaussian, 1/4 resolution) for the full-bleed field. Z4: capture from rfsportscars.com with a headless browser; if it's missing, a visibly marked placeholder (CP4). |
| 5 Services | `356speedster_front_road`, HEIC 180321, HEIC 180316, `356speedster_rear_road` | R | Crops for a 50% × 100 vh half-frame. |
| 6 Peak, hero car | Lionsharp 1975 911 (930) Turbo GLB, CC-BY | L | Rendered **offline** (Blender or three.js offline) as a **24-frame sequence, camera directly overhead (top-down, ~20 mm-equivalent flattened by a long lens, i.e. near-orthographic), car yawing 0° → 20°**, WebP with alpha, 1600 px tall. Light: `studio_small_03` (CC0) plus one large soft overhead key and a thin warm rim, so the silhouette separates from black. Paint silver-grey, clearcoat. Baked contact shadow as a separate soft-alpha layer. Mobile: 12 frames at 900 px. Credit in the footer. |
| 6 Peak, fallback 1 | 1972 911 Carrera RS GLB (26k faces) | L | Same pipeline. |
| 6 Peak, fallback 2 | **Generated top-down hero car (still, no yaw)** | G | *"A classic 1970s rear-engine sports coupé photographed from directly overhead, perfectly top-down, nose pointing to the top of the frame. Silver-grey paint with a soft clearcoat sheen, round headlamps, period alloy wheels just visible at the arches. Isolated on a pure black background, one large soft overhead light with a thin warm edge light, gentle contact shadow. Full car in frame with 10% margin all round. No badges, no licence plates, no text, no people. Portrait 2:3, 2048×3072."* File `gen-peak-car-topdown.png`. Keyed to alpha. |
| 6 Peak, fallback 3 | Composed final-frame still | — | Title + a single still. The page is unchanged otherwise. |
| 6 Peak, flanks | **Two generated flank cars, top-down, darker** | G | Flank A: *"A generic 1960s front-engine grand touring coupé photographed from directly overhead, perfectly top-down, nose to the top of the frame, very dark charcoal-black paint, minimal chrome, lit only by a dim overhead softbox so the body reads about two stops darker than a silver car, isolated on pure black, full car with 10% margin, no badges, no plates, no text. Portrait 2:3, 2048×3072."* Flank B: the same, but *"a generic 1960s open two-seat roadster, dark British-green-black, tonneau cover closed"*. Files `gen-peak-flank-a.png`, `gen-peak-flank-b.png`. Keyed to alpha. The same light direction as the hero car's render (DNA23). |
| 6 Peak, ground | Dark asphalt / dust texture | G or CC0 | A CC0 asphalt texture (Poly Haven) darkened to about 6% luminance, top-down, tileable. Generate only if needed: *"top-down macro of dark fine-grain asphalt with faint dust, evenly lit, no markings, tileable"*, `gen-peak-ground.png`. |
| 7 Sold panel | `reference/sold/*.jpg` (5 × 1440²) | R | Used as they are. Labels read "SOLD · to confirm" until Q2 is answered. |
| 7 Inventory panel | The 1974 De Tomaso Pantera Custom listing photo + the 5 names | R | Captured from rfsportscars.com at ≥ 2000 w if available. If smaller, the panel uses it as an inset over its blurred copy (the chapter device) rather than stretching it. |
| 8 Closing, background | HEIC 180331 (night facade) | R | Darkened about 1.5 EV and softened (lens blur ~8 px) so it reads as a background plate. |
| 8 Closing, cars | **Three generated cars from behind** | G | *"Three classic sports cars parked side by side, seen from directly behind at standing eye level about eight metres away, on dark wet-looking asphalt at night. The centre car is a cream 1950s open roadster, slightly forward and fully lit by warm light falling on it from ahead. The two flanking cars are a dark charcoal 1960s coupé (left) and a dark green 1970s coupé (right), lit two stops darker. Taillights off. Isolated on a pure black background for keying, with soft contact shadows. No badges, no licence plates, no text, no people, no buildings. Landscape 16:9, 2752×1536."* Mobile: its own frame, the centre car alone, *"…single cream 1950s open roadster seen from directly behind … portrait 4:5, 1536×1920"* (GI8). Files `gen-close-trio.png`, `gen-close-single-m.png`. |
| All | RF shield + wordmark SVG | R | Ask the client. For the mockup, trace the PNG, labelled `trace-`. |

**Known compromise (GI3), named rather than hidden:**
- **The closing puts generated cars in front of a real photograph of the premises.**
- In the mockup it ships with a visible "stand-in composite" caption, and the generated layer never goes live.
- **Production:** a real night photograph of three real Robb Francis cars in front of the California garage. The client can shoot it on one evening, and it is the single most valuable photograph on this list.

**Killed for the index:**
- `videomap` / `map.png`: a coverage claim the sources don't support (CP7).
- `gen_etype_coast-village`: reads as Italy.
- `gen_911` garages ×2: a generated garage would read as the premises.
- `gen_etype_coast-road_golden` and the `gen_jaguar-mascot` pair: no slot in the Forge skeleton.
- `buy1–6`: year/make/model unknown.
- `hero_desk`, `whyrobb`, `footer.jpg`: a second image system.
- Promo pop-ups: content kept for the closing line and phone, style dropped.

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
| "Sold" status on the 5 Sold-panel vehicles (Act 7) | **NOT CONFIRMED.** Instagram shows them as featured / for sale (`reference/sold/SOLD.md`). Rendered as "SOLD · to confirm" until Robb confirms (Q2) | 2026-09-24 |
| Year/make/model of the 5 Sold-panel vehicles (Act 7) | Instagram captions, verbatim in `SOLD.md` | 2026-09-24 |
| "…is now purchasing collector and performance vehicles across both coasts. Wherever you are, our team is ready to evaluate your car." (Act 8 closing, verbatim) | Client's own promo pop-up, `reference/found/pop up.png` | 2026-09-24 |
| (908) 234-2100 for California | Client promo pop-up + Google summary | 2026-09-24 |
| "By Appointment Only" · "We buy cars" | rfsportscars.com utility bar | 2026-09-24 |
| "Collector, Classic and Current State of the Art Sports Cars" (hero subline) | rfsportscars.com/about-us | 2026-09-24 |
| 1975 Porsche 911 Turbo in Act 6 (peak) | **Not a stock claim.** 3D stand-in, captioned as such; Lionsharp CC-BY | 2026-09-24 |
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

**v2, Alex's decision (2026-09-24): take Forge's skeleton and language almost 1:1.** This replaces the earlier "What to take / What not to take" above.

**Taken nearly as-is (proportions from d00–d18):**
- **Ground and type:** black ground. One thin didone at 80–140 px with −2 px tracking, plus Geist-class small caps (at 14 px or more, not Forge's 11–12 px).
- **Chapters:** pinned chapters with a "01 / 03" counter, top-right, in didone.
- **Progress rule:** a hairline along the bottom at ~16 px inset, with the filled part in bone.
- **Inset over blur:** an inset image (~31% width, left-centre) drifting over a blurred full-bleed copy of itself.
- **Service panels:** text left / image right at 50/50, text block starting ~9% from the left edge, with an outlined CTA button.
- **Peak:** a car rising through a two-line didone title at ~12–14 vw, flanked by darker cars.
- **CTA panels:** two full-bleed panels, with the title centred low and a small outlined button.
- **Closing screen:** a small-caps kicker, a two-line didone title, a CTA, and three cars from behind on dark ground.

**Changed, with the reason:**
- **"Our Approach" slot → the roll-up door.** It's the one bespoke move, and the real place.
- **Six service panels → four.** Robb Francis has four services on record.
- **Forge's Navigate drawer → inline nav.** The 7-item IA is fixed.
- **Studio-render SUVs → real photographs.** Everywhere except the peak (a labelled CC-BY model) and the flank and closing cars (labelled generated stand-ins).
- **Label size → at least 14 px.** Forge's labels sit below the typography I7 floor.
- **Grey-on-black text → checked for AA.** Its unlit grey state carries no information.
- **Closing title → "New Jersey / California"** and the verbatim "across both coasts" line, not a slogan.

**Additional observations from `reference/place/`, relevant to the build:**
- The RF red shield crest hangs on the lounge wall.
- A Rally4Kids / United Boys & Girls Clubs of Santa Barbara County poster hangs in the lounge. It is visible, but it's not used as a claim (the Google summary is a secondary source).
- **A "MILPAS MOTORS" sign hangs inside the garage** (visible through the glass in 180331 and 180522). See Q1.
