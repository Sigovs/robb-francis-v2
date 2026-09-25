# Generated assets: provenance (GI6)

Everything here is **generated** and is a **mockup stand-in**. Nothing depicts a real Robb Francis car or the premises (GI3).

- Model: fal.ai `fal-ai/nano-banana-pro`, 2K, 2026-09-24.
- Prompts: verbatim from BRIEF.md §10, "Asset needs" table.

| File | Prompt row | Post-processing |
|---|---|---|
| gen-peak-car-topdown.png | Peak, fallback 2 (top-down hero car) | Rotated 180° so the nose points up. A faint crest was noted on the hood; re-checked 2026-09-24 at the 40vw display scale on the silhouette crop (`gen-peak-car-body-*`): not visible. |
| gen-peak-flank-a.png | Peak flank A (dark GT coupé) | Softbox removed by cropping the top 13%, padded with black. |
| gen-peak-flank-b.png | Peak flank B (dark green roadster) | Rotated 180°. |
| gen-close-trio.png | Closing, three cars from behind | None. The plate areas are blank. |
| gen-close-single-m.png | Closing, mobile single roadster | None. |
| _alts/ | Rejected variants | Kept for comparison. |

None of these has an alpha channel yet: they sit on a black ground and can be keyed or used with `mix-blend-mode: lighten` on black.

## Edits after generation (2026-09-24, critique pass)

- `gen-close-trio.png` — **retouched (GI4)**: the model had drawn three marque marks — a script badge on the left
  coupé's tail, and the lettered maker's name plus a model badge on the green coupé's engine lid. Removed by
  column-wise inpainting from the clean paint above/below (`scripts/retouch-gen.mjs`). Untouched master:
  `_alts/gen-close-trio.orig.png`. `gen-close-single-m.png` was checked: blank plate, generic emblem, no lettering.
- `gen-close-*` derivatives — white-balanced (the prompt's warm light came out amber); the mobile frame also
  desaturated to 0.45. `gen-peak-car-body-*` — the peak car cropped to its silhouette. See `scripts/build-images.mjs`.
