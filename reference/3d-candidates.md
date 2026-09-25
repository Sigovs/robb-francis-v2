# 3D model candidates — Robb Francis homepage mockup

Researched 24 Sep 2026. Nothing was downloaded. Model data comes from the public Sketchfab API (`/v3/search?downloadable=true` and `/v3/models/{uid}`): name, licence, face and vertex counts, material and texture counts, description. Thumbnails were checked by eye.

**What applies to every Sketchfab entry**
- **Format:** Sketchfab auto-converts every downloadable model to glTF and GLB (plus USDZ), and the original source file (usually FBX or BLEND) is also offered. File sizes are hidden from anonymous API calls.
- **Login:** a download needs a free Sketchfab account. There is no paywall.
- **Interior / wheels:** "seen in thumb" means the cabin is visible through the glass in the preview render. "Likely" means the model is a game-asset rip (Forza, CSR2 or Test Drive), and those almost always ship four separate wheel meshes plus a low-poly interior. Check the node tree in Blender or at gltf.report before relying on wheel spin.
- **Provenance flag:** the `ddiaz-design`, `outpiston` and `heynic` (vecarz) uploads are ripped game assets. The uploader says so in each description. The `tangwang920` account re-uploads ddiaz models with the licence relabelled from NC-SA to CC-BY. Treat those relabels as licence laundering and do not rely on them. None of this blocks a mockup, but none of these rips could ship to production.
- **Trademark:** every car design belongs to its manufacturer, whatever the mesh licence says. Lionsharp's page states this outright.

## Ranked shortlist

| Rank | Car & year | URL | Licence | Faces | Verdict | Interior | Separate wheels | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Porsche 911 (930) Turbo, 1975 | https://sketchfab.com/3d-models/free-1975-porsche-911-930-turbo-8568d9d14a994b9cae59499f0dbed21e | CC-BY (credit Lionsharp Studios) | 241k (200k tris plus a 40k clear-coat shell) | **Hero-grade** | Likely: the page describes it as "game-ready AAA" | Likely | 14 materials and 33 textures (Substance). Fuchs wheels and Pirelli P7 tyres. The most-liked free car on Sketchfab (7.2k likes, 850k views). Original, not a rip, so it is the cleanest licence here. The optional clear-coat mesh can be dropped and replaced with `MeshPhysicalMaterial.clearcoat`. |
| 2 | Jaguar E-Type Series 1 4.2 coupe, 1963 | https://sketchfab.com/3d-models/1963-jaguar-e-type-xk-e-series-1-42-d526aafcb857434284b1a432993a77cf | CC-BY-NC-SA | 178k | **Hero-grade** (render) | Yes, seen in thumb | Likely (Forza rip) | Wire wheels and full chrome. The strongest E-Type available. |
| 3 | Ferrari 250 GTO, 1962 | https://sketchfab.com/3d-models/1962-ferrari-250-gto-0d2a7ee6ace246c0b545280ca5cc4031 | CC-BY-NC-SA | 337k | **Hero-grade** | Yes, seen in thumb | Likely | Borrani wire wheels. The highest fidelity of the Ferrari options. |
| 4 | Corvette C3 Stingray T-Top 350, 1971 | https://sketchfab.com/3d-models/1971-corvette-c3-stingray-t-top-350-d06fc557cafb47c995418af60e3e72f8 | CC-BY-NC-SA | 234k | **Hero-grade** | Yes (tan cabin seen in thumb) | Likely (CSR2 rip) | Black paint with chrome bumpers. Photogenic in a dark studio. |
| 5 | De Tomaso Pantera GT5-S, 1984 | https://sketchfab.com/3d-models/1984-de-tomaso-pantera-gt5-s-c33032e088fd41e98518e3558645a718 | CC-BY-NC-SA | 248k | **Hero-grade** | Yes, seen in thumb | Likely (CSR2 rip) | 26 materials and 36 textures. This is the wide-body GT5-S with its big wing, not the purer early-70s Pantera. |
| 6 | Ferrari 550 Barchetta, 2000 (Azzurro Hyperion) | https://sketchfab.com/3d-models/ferrari-550-barchetta-2000-azzurro-hyperion-45f7f9a0276a465fa44156b02b4fddd8 | CC-BY-NC | 120k | **Hero-grade** | Yes (low-poly version, tan leather seen in thumb) | Yes: the description lists wheels as parts, and wheels sit on the suspension | 79 materials, so merge them for web. Built from a Test Drive: Ferrari Racing Legends asset by Alex.Ka. A CC-BY duplicate exists at `…ferrari-550-barchetta-e5de7426…` by cloudhub, but it looks like a re-upload. |
| 7 | Aston Martin DB5 Vantage, 1964 | https://sketchfab.com/3d-models/1964-aston-martin-db5-vantage-13ba7b76cd0148d8bf7e6c3f5062b633 | CC-BY-NC-SA | 175k | **Hero-grade** | Yes, seen in thumb | Likely (Forza 4 rip) | Silver-birch paint and wire wheels. The best DB5 found. |
| 8 | Porsche 911 Carrera RS 2.7, 1972 | https://sketchfab.com/3d-models/1972-porsche-911-carrera-rs-7b8685a3bfc746c3ab64753346a36332 | CC-BY-NC-SA | 26k | **Okay → good**: very light, clean silhouette | Yes, seen in thumb | Likely | Yellow with a Carrera script. A good lightweight option when the scene needs to stay small. |
| 9 | Porsche 911 (930) Turbo, 1975 | https://sketchfab.com/3d-models/porsche-911-930-turbo-1975-de1ffd344c41481892511f7fd332c136 | CC-BY | 61k | **Okay → good** | Yes, visible | Likely | An original model by Lexyc16 (tagged "noai"), with 1.4k likes. A lighter CC-BY alternative to #1. |
| 10 | Alfa Romeo Giulia Sprint GT, 1965 | https://sketchfab.com/3d-models/alfa-romeo-giulia-1965-ee5f8e442fc443b284d35c917671d144 | CC-BY | 1.15M | **Okay** | "Rough interior" per the author | Unknown | The body has been altered from the real car (the author says so), and the model is heavy. It needs decimation. |

## Everything else checked

| Car & year | URL | Licence | Faces | Verdict | Interior / wheels | Notes |
|---|---|---|---|---|---|---|
| Porsche 911 Turbo 3.3 (930), 1977 | https://sketchfab.com/3d-models/1977-porsche-911-turbo-33-930-g-series-e3465539677d4aeea9b4c017ddffaf7d | CC-BY | 148k | Okay | Interior seen in thumb | By supercarmodels. Flat materials in the thumbnail. |
| Porsche 911 Classic (subdivision) | https://sketchfab.com/3d-models/porsche-911-classic-2910bf16b3724296b19e7e4a7384cb4e | CC-BY | 629k | Toy / clay | No / ? | Untextured clay model. |
| Classic Porsche 911 80s | https://sketchfab.com/3d-models/classic-porsche-911-80s-51cca123a7f045999d8d70cde093b3a6 | CC-BY | 472k | Toy | ? | No textures. Built for printing. |
| Jaguar E-Type (Blender 2.93) | https://sketchfab.com/3d-models/jaguar-e-type-32aa25ea6e1b40f395b2aff33ca0a279 | CC-BY | 126k | Okay | Interior seen / ? | Original model by kikumi. Dark green. The CC-BY fallback for the E-Type. |
| Jaguar E-Type Lightweight GT | https://sketchfab.com/3d-models/jaguar-e-type-lightweight-gt-8c53321301234400b70975fa6abb5e5d | CC-BY | 96k | Okay | Interior seen | Game-optimised. |
| Jaguar E-Type, 1961 | https://sketchfab.com/3d-models/1961-jaguar-e-type-7635322299b740e19b874e0ae9bd7748 | CC-BY | 70k | Toy | No | Not UV-mapped and has no materials, per the author. |
| De Tomaso Pantera GTS, 1985 | https://sketchfab.com/3d-models/1985-de-tomaso-pantera-gts-0b04448a71ad43f88937c13c2fcf502d | CC-BY | 8.7k | Toy / low-poly | ? | Yellow and black. Game-grade only. |
| Corvette C3 HQ Interior | https://sketchfab.com/3d-models/chevrolet-corvette-c3-hq-interior-84934735e6484865b22b6f2abc2aa167 | CC-BY | 2.65M | Okay (heavy) | Yes (HQ interior) | By niev. No textures. Far too heavy for web without heavy decimation. |
| Corvette Stingray 427, 1969 | https://sketchfab.com/3d-models/1969-chevrolet-corvette-stingray-427-1114862363224283b50070bb79217b13 | CC-BY-NC-SA | 33k | Good (light) | Interior seen | Blue. A lighter C3 than #4. |
| Ferrari 250 GTO, 1962 | https://sketchfab.com/3d-models/1962-ferrari-250-gto-b12954e759df43e882a0136c1403a800 | CC-BY | 46k | Okay → good | Interior seen | Identical face count to the outpiston rip, so probably a re-upload. |
| Ferrari 250 GTO (vecarz) | https://sketchfab.com/3d-models/ferrari-250-gto-wwwvecarzcom-8cc6b4f13e5c4b179e39009a164fdcb4 | CC-BY (claimed) | 1.47M | Okay (heavy) | ? | The account admits its models are sourced from third parties. |
| Ferrari 275 GTB | https://sketchfab.com/3d-models/ferrari-275-gtb-c1be6d5d30e3410db1e71e73bf96652c | CC-BY | 193k | Okay | Interior seen | By niev. No textures (0 texture maps). |
| Ferrari 365 GTB/4 Daytona | https://sketchfab.com/3d-models/ferrari-365-gtb4-daytona-berlinetta-28aae27985a648aba2d561f98508dc73 | CC-BY | 1.34M | Okay (heavy) | ? | By niev. No textures. The only free Daytona found. |
| Ferrari 250 GT California Spyder | https://sketchfab.com/3d-models/ferrari-250-gt-california-81d3f595620f4a999e7970606019697f | CC-BY | 229k | Okay | Interior seen | 70 materials. The thumbnail shading is flat. |
| Alfa Romeo Spider, 1970 | https://sketchfab.com/3d-models/alfa-romeo-spider-c7d2ea0a66094d1aa68c2715722a090b | CC-BY | 153k | Okay | Interior seen | By kikumi. The Duetto shape reads correctly. |
| Alfa Romeo Giulia Sprint, 1965 (race livery) | https://sketchfab.com/3d-models/1965-alfa-romeo-giulia-sprint-3b30a0277a7b45a58496c843e6588212 | CC-BY | 110k | Okay | Engine and doors open | Race livery "21". Not a showroom look. |
| Aston Martin DB5 | https://sketchfab.com/3d-models/aston-martin-db5-bf1fe23e1578417ab11db67dc89fbe32 | CC-BY | 52k | Toy | ? | Cyan, reads as game-grade. |
| Aston Martin DB5 (007) | https://sketchfab.com/3d-models/aston-martin-db5-007-ddaf22acac9a43e7831166609af26058 | CC-BY | 859k | Okay | ? | Original (Blender plus Substance). A single material, so repainting is awkward. |
| Aston Martin DB5 (jpo1703) | https://sketchfab.com/3d-models/aston-martin-db5-24de747640094583b0287d1c8adaca4e | CC-BY | 1.37M | Toy / clay | No | Untextured. |
| Aston Martin V8 Vantage V600, 1998 | https://sketchfab.com/3d-models/aston-martin-v8-vantage-v600-1998-4848f5e2395b49219bcb8b235b9d5525 | CC-BY-NC | 136k | Hero-grade | Interior seen | By Alex.Ka. A 90s Vantage, not a classic, but it fits a collector stock list. |
| **three.js example car:** Ferrari 458 Italia | https://threejs.org/examples/models/gltf/ferrari.glb (demo: https://threejs.org/examples/#webgl_materials_car) | Sketchfab source by vicent091036 is no longer public, so the licence can't be confirmed; it ships in the MIT repo as a demo asset | 1.68 MB GLB (Draco) | Hero-grade for web | Yes: named nodes `body`, `glass`, `trim`, `rim_fl/fr/rl/rr`, `wheel_fl/fr/rl/rr` | A **modern car, off-brief**, but the best reference for how a web-ready car GLB should be structured. |

**Other sources**
- **Poly Pizza:** low-poly game assets only (Quaternius and similar, plus F40, DeLorean and Rolls-Royce toys). Nothing collector-grade.
- **Poly Haven:** no vehicle models.
- **Free3D, TurboSquid, CGTrader:** all three returned 403 or empty pages to the fetcher, so none could be verified. Search results show a TurboSquid "Porsche 911 Carrera RS 1973" (https://www.turbosquid.com/3d-models/3d-porsche-911-carrera-rs-1397960), but whether it is free or paid, and in which formats, is **unverified**. All three sites need a login to download.

## HDRI environments (Poly Haven, CC0, up to 16k, no login)

| HDRI | URL | Why |
|---|---|---|
| **studio_small_03** | https://polyhaven.com/a/studio_small_03 | A dark ceiling and walls with a single large octabox. Gives one clean highlight sweep on paint and chrome. The best "moody studio" choice. |
| **ferndale_studio_11** | https://polyhaven.com/a/ferndale_studio_11 | A dark studio lit by vertical tube lights. Draws long strip reflections down the body sides, the classic car-photography look. |
| studio_small_08 | https://polyhaven.com/a/studio_small_08 | A softer, lower-contrast alternative to studio_small_03. |
| parking_garage | https://polyhaven.com/a/parking_garage | The nearest thing to a "garage". It is daylit, not night: drop exposure and desaturate it for a night-garage mood. Poly Haven has no true night garage. |

Load it with `RGBELoader` at 1k or 2k resolution for the environment map only. Keep the page background a solid CSS or scene colour so the HDRI is never shown directly.
