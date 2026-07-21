# FanWorks design system

The rules that keep this site looking deliberate. Read this before touching any
markup or CSS. Every constraint below is enforced as a token in
`src/styles.css` — change the token, not individual call sites.

## Direction

Warm editorial print-shop. Paper, ink, brick, ochre, porch green. Serif display
type in mixed case, mono labels, asymmetric layouts. The photography and the
hand-drawn illustration carry the warmth; the type system carries the
discipline.

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

Section band sequence: paper → paper → green → paper → brick → ink. Ochre is
an accent on dark grounds only; on paper, use brick (ochre fails contrast on
paper).

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

1. `npm run build`, serve `dist`, screenshot at 1440px and 375px.
2. Zero horizontal overflow at both widths.
3. Zero console errors.
4. Known capture artifact: the story illustration uses
   `mix-blend-mode: multiply` and can render blank in *full-page* Playwright
   captures — verify it with a viewport screenshot scrolled to `#story`
   before treating it as a bug.
