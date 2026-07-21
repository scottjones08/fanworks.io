# Journey footage — spec, sourcing, and swap instructions

The journey scene plays `public/journey.webm` + `public/journey.mp4`,
scrubbed by scroll (scroll position drives `video.currentTime`). The files
currently in the repo are **placeholders rendered from the illustrated
fallback scene** — they exist to prove the pipeline. Replace them with
live-action footage and nothing else needs to change.

## The shot (one continuous take)

- **Camera:** ~2 m behind the subject, shoulder height, gimbal-stabilized,
  slow constant dolly following as they walk. No cuts, no pans, no shake.
- **Subject:** one person, seen from behind the whole time, walking at an
  unhurried pace down a cobblestone alley (Richmond's Fan district alleys
  are the reference). Keep the subject centered in frame — mobile crops the
  sides (`object-fit: cover`), so nothing story-critical near the edges.
- **Light arc (the whole point):** begins pre-dawn dark — alley in shadow,
  one warm lamp, a faint glow at the far end. Ends in full golden-hour
  light flooding the alley mouth. Grade should travel dark → warm dawn →
  bright gold, evenly across the clip's duration, because scroll maps
  linearly onto time.
- **Life arrives progressively:** first stretch empty; then lit windows;
  then window boxes / flowers; around the midpoint a neighbor watering
  plants in a lit doorway; in the last third a couple walking ahead toward
  the opening; birds at the end if you can get them.
- **Duration:** 20–30 s. **Capture:** 4K if possible. **Deliver:** 1920×1080.
- **No audio** (it's stripped anyway).

## Three ways to get it

1. **Film it** — golden hour + one gimbal walk in an actual Fan alley.
   Best option; it's also on-brand for the company to be photographed in
   Richmond rather than anywhere else.
2. **AI-generate it** (Sora / Veo / Runway / Kling). Paste-ready prompt:

   > A single continuous steadicam shot following directly behind a person
   > walking away from the camera down a narrow historic cobblestone alley
   > with brick walls. The shot begins in near-darkness before dawn: deep
   > shadows, one warm wall lantern glowing, a faint golden glow at the far
   > end of the alley. As the walk continues, dawn light gradually floods
   > in and the scene ends in bright golden-hour sunlight at the alley's
   > open end. Along the way, warm window lights turn on one by one, flower
   > boxes and greenery appear along the walls, a neighbor waters plants in
   > a lit doorway, and a couple walks ahead in the distance toward the
   > light. Camera height at shoulder level, constant slow walking pace, no
   > cuts, no camera shake, subject always centered. Photorealistic,
   > cinematic, warm color grade (paper, brick red, ochre, deep green).
   > 24 fps, 1920×1080.

   Most tools cap clips at 5–10 s. Generate 3–4 segments (night → dawn →
   morning → golden) using the last frame of each as the image prompt for
   the next, then concatenate before encoding.
3. **Licensed stock** — search Pexels / Mixkit / Coverr / Artgrid for
   "walking away camera cobblestone alley", "following person alley
   morning". A single clip with the full dark→light arc is unlikely; a
   sunrise-graded clip can be darkened at the head in any NLE to fake the
   arc.

## Encoding (required for smooth scrubbing)

Scroll-scrubbing seeks constantly, so every frame must be a keyframe
(`-g 1`). Normal web encodes stutter badly here.

```sh
# from a master file (any format), strip audio, 1080p, all-intra:
ffmpeg -i master.mov -an -vf scale=1920:-2 \
  -c:v libx264 -preset slow -crf 21 -g 1 -pix_fmt yuv420p \
  -movflags +faststart public/journey.mp4

ffmpeg -i master.mov -an -vf scale=1920:-2 \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -g 1 -row-mt 1 -pix_fmt yuv420p \
  public/journey.webm
```

Keep the pair under ~25 MB combined if you can; all-intra 1080p at these
CRFs usually lands there for a 20–30 s clip.

## Swapping it in

1. Replace `public/journey.mp4` and `public/journey.webm` (same names).
2. That's it. Scroll maps 0→1 onto the clip's duration automatically;
   the illustrated scene remains underneath purely as the loading/failure
   fallback and never shows once the video has a frame.
3. Optional: once real footage is in, re-check the milestone thresholds in
   `src/Scene.tsx`/`DESIGN.md` still land on the right beats (each stage
   *n* of 5 is on screen at progress ≈ n/5 — brief the videographer/AI
   with that timing so windows/people/light hit at card moments).
