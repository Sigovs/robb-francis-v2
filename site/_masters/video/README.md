# Hero film masters

Untouched encodes as delivered at the static pass. `public/video/` holds the trimmed loops (critique pass, 2026-09-24):

- `hero-1080.mp4` / `.av1.mp4`: **0–3.8 s** (the gates showed 0–5.0 still let the close shot drive the car under the headline). After ~5.5 s the close push-in (the shot that starts at the 3.87 s cut)
  takes the car's left bumper past the frame edge in the 1440×900 cover crop — a clipped silhouette (C22).
- `hero-720x900.mp4` (replaces `hero-720x1280.mp4`): **0–3.8 s**, an authored **4:5** crop (864×1080 at x 557 of
  the 1080p master), centred on the car's path. A 9:16 full-height phone frame of a 1080p source is at most
  499 source px wide and the car on the first frame is 576 — it could not hold the car at all (gates: clipped left
  and right at t=0). The phone hero is therefore a separate composition: copy on the ground, the film as a band.

Re-derive from these masters; never re-trim the trimmed files.

## Seamless loop (V2, 2026-09-25)

`public/video/*` is now a **2.8 s seamless loop** built from source frames n14–n113 of `reference/found/hero1d.mp4`
(the tracking shot between the cuts at 0.1 s and 3.87 s):
- The car is tracked by multi-scale template matching (OpenCV) and locked to one size and position (max zoom 1.19×).
- The tail dissolves into the head over 16 frames (smoothstep). The forest carries the seam; the car does not ghost.
- Master: `hero-loop-master.mp4` (CRF 14). Web: H.264 CRF 26 (2.9 MB), AV1 CRF 42 (1.6 MB), phone 4:5 crop
  864×1080 at x 557 → 720×900 (1.6 MB).
- Poster = loop frame 1 (`_masters/hero-frame0.png`; the previous one is kept as `hero-frame0.orig.png`).
