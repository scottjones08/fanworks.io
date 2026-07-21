# FanWorks design system

The rules that keep this site looking deliberate. Read this before touching any
markup or CSS. Every constraint below is enforced as a token in
`src/styles.css` — change the token, not individual call sites.

## Direction

A scroll-driven walk. The camera sits behind a subject walking a cobblestone
alley: home is dark, and light grows with every problem solved — windows
light up, flowers appear, people come around — until the alley opens into
opportunity. Services are milestones passed along the walk. The visual
language stays warm editorial print-shop: paper, ink, brick, ochre, porch
green; serif display type in mixed case; mono labels; letterpress-style
cards.

## The journey (src/Scene.tsx + .journey styles)

- The visual layer is **scroll-scrubbed live-action video**
  (`public/journey.webm` + `.mp4`, all-intra encodes — see FOOTAGE.md for
  the shot spec and swap instructions). Scroll progress maps onto
  `video.currentTime`; the illustrated SVG alley underneath is the
  loading/failure fallback and mirrors the same arc via `--p`. The files
  currently committed are placeholders rendered from the fallback scene.
- `.journey` is a 600svh track: a sticky 100svh scene plus six 100svh
  stages (hero, four milestones, finale). The first stage is pulled up over
  the scene with a negative top margin — never put the negative margin on
  the sticky scene itself, or its sticky travel extends past the journey
  and the positioned scene paints over the static sections that follow.
- Scroll progress is written to `--p` (0 → 1) on the track by a
  rAF-throttled scroll handler. Stage *n* of 5 is on screen at `--p ≈ n/5`.
- Scene elements opt into progress with `.tl` + a `--t` threshold
  (`--v = clamp(0, (var(--p) - var(--t)) * 4, 1)`), then `.fade`, `.grow`,
  or `.rise` map `--v` onto opacity/transform. Pair each element's
  threshold with the milestone it should accompany.
- Light arc: night sky → dawn → day layers crossfade on `--p`; walls,
  ground, and the end-of-alley skyline lighten via soft-light washes; the
  vignette fades to zero; the walker's shadow lengthens toward the camera.
- `.d-only` / `.m-only` swap side elements between desktop and phone
  framing — the 1440x900 viewBox is center-cropped on portrait screens
  (`preserveAspectRatio="xMidYMax slice"`), so anything outside
  x ∈ [512, 928] needs a mobile counterpart placed nearer the center.
- Reduced motion pins `--p: 1` (bright, everything present) and kills the
  walker bob and scroll cue.

## Ban list

- No purple, no gradients.
- No emoji as icons. Lucide stroke icons only, and only where they do work
  (nav toggle, directional arrows).
- No Inter, and no system-default font stacks for display type.
- No stock-photo placeholders. Only the commissioned worktable photo and the
  workflow sketch.
- No centered-everything layouts. Sections are asymmetric two-column grids
  with a narrow mark column or a media split.
- Nothing bounces. No easing overshoot anywhere.

## Type

| Role    | Token            | Font                     | Notes                          |
| ------- | ---------------- | ------------------------ | ------------------------------ |
| Display | `--text-display` | Fraunces (opsz variable) | weight 540, `SOFT 0, WONK 0`   |
| H2      | `--text-h2`      | Fraunces                 | tracking `-0.02em`, lh 1.06    |
| H3      | `--text-h3`      | Fraunces                 | lh 1.2                         |
| Lede    | `--text-lede`    | Public Sans              | lh 1.55                        |
| Body    | `--text-body`    | Public Sans              | lh 1.65                        |
| Label   | `--text-label`   | IBM Plex Mono 600        | uppercase, tracking `0.16em`   |

Fonts are self-hosted via `@fontsource` imports in `src/main.tsx` — no
external font requests at runtime.

## Color

`--paper #f5f1e6` · `--ink #1b1d19` · `--brick #922b21` · `--brick-deep
#6f211a` · `--green-deep #16382a` · `--ochre #d5a13b`

Section sequence: dark journey (arcing to bright) → paper-deep ethos →
sketch band → paper contact → ink footer. Ochre is an accent on dark
grounds only; on paper, use brick (ochre fails contrast on paper). Copy
over the scene's dark stretch must be paper/paper-soft or sit on a paper
card — the milestone and finale panels exist because ink on the scene
fails contrast.

## Rhythm

Spacing steps: `--s-xs 0.5rem` through `--s-2xl 5rem`, plus `--section` for
vertical section padding and `--pad` for the page gutter. Do not invent
one-off margins; pick a step.

## Motion

- Hover and focus transitions: `--t-fast` (200ms), `--ease-out`, color or
  ≤4px translate only.
- Scroll reveals: `[data-reveal]` + IntersectionObserver in `App.tsx`, 550ms,
  18px rise, staggered ≤80ms per sibling.
- `prefers-reduced-motion` collapses all of it.

## The one CTA

Every section funnels to **Start a conversation** (`#engage`). Nav, hero,
work footer, story, and the form submit all repeat the same action. Do not
add a second competing action.

## QA checklist (run before shipping design changes)

1. `npm run build`, serve `dist`, screenshot at 1440px and 375px — and for
   the journey, capture at progress steps (p = 0, 0.2, …, 1) plus the
   journey→ethos handoff, not just the page top.
2. Zero horizontal overflow at both widths.
3. Zero console errors.
4. Capture pitfalls: full-page screenshots don't scrub the sticky scene
   (each stage renders against wherever the scene happens to be), and
   `scrollIntoView`/`window.scrollTo(x, y)` animate because of
   `scroll-behavior: smooth` — use `behavior: "instant"` when positioning
   for a capture. The sketch illustration's `mix-blend-mode: multiply` can
   also render blank in full-page captures; verify with a viewport shot.
