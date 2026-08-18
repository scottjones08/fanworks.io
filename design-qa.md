# FanWorks Operations Journey Design QA

## Evidence

- People-filled panoramic source: `/Users/scottjones/.codex/generated_images/019f8556-3eba-72b1-be09-1349b132ac29/exec-0a8834ec-e77a-47ba-82e7-17cc31694580.png`
- Production panoramic asset: `/Users/scottjones/Documents/GitHub/fanworks.io/public/fanworks-cutaway-panorama-v7.webp`
- Illustrated panoramic source: `/Users/scottjones/.codex/generated_images/019f8556-3eba-72b1-be09-1349b132ac29/call_IYURDpRQdE9j4G8LvqvqX3to.png`
- Operator-proof illustration: `/Users/scottjones/Documents/GitHub/fanworks.io/public/fanworks-operator-proof-v2.webp`
- Illustrated operator-proof source: `/Users/scottjones/.codex/generated_images/019f8556-3eba-72b1-be09-1349b132ac29/call_Cpp1INLNWAamsBwPmzXLvsnx.png`
- Bright-office panoramic source: `/Users/scottjones/.codex/generated_images/019f8556-3eba-72b1-be09-1349b132ac29/exec-3ed9ad45-61cc-4449-b4c1-a1844104c584.png`
- Customer-counter panoramic source: `/Users/scottjones/.codex/generated_images/019f8556-3eba-72b1-be09-1349b132ac29/exec-3ce8bb2b-1f7a-4cf7-abb4-84ee566bfe57.png`
- Corrected customer-counter source: `/Users/scottjones/.codex/generated_images/019f8556-3eba-72b1-be09-1349b132ac29/exec-a0ce88a2-b290-4bc8-8a4b-02520c57622f.png`
- Human progression, desktop opening: `/tmp/fanworks-human-progression-desktop-start.png`
- Human progression, desktop final office: `/tmp/fanworks-human-progression-desktop-final.png`
- Human progression, mobile opening: `/tmp/fanworks-human-progression-mobile-start.png`
- Human progression, mobile final office: `/tmp/fanworks-human-progression-mobile-final.png`
- Final people-filled hero: `/tmp/fanworks-people-hero-desktop.png`
- Final target-market and friction section: `/tmp/fanworks-friction-market-desktop.png`
- Final How We Work section without diagonal: `/tmp/fanworks-how-we-work-no-slash.png`
- Final operator proof, stats, and KPI band: `/tmp/fanworks-operator-proof-kpis.png`
- Desktop implementation, first room: `/tmp/fanworks-cutaway-desktop-room2-final.png`
- Desktop implementation, automation room: `/tmp/fanworks-cutaway-desktop-room4.png`
- Mobile implementation, first room: `/tmp/fanworks-cutaway-mobile-room1.png`
- Mobile implementation, assessment room: `/tmp/fanworks-cutaway-mobile-room2.png`
- Final first-hero desktop state: `/tmp/fanworks-cutaway-first-hero-desktop.png`
- Final first-hero mobile state: `/tmp/fanworks-cutaway-first-hero-mobile.png`
- Rounded operator worktable story section: `/tmp/fanworks-story-rounded-worktable.png`
- Mobile menu over cutaway hero: `/tmp/fanworks-mobile-menu-cutaway.png`
- Final side-by-side comparison: `/tmp/fanworks-cutaway-design-comparison-final.png`
- Viewports: 1280 × 720 desktop and 390 × 844 mobile.
- States: hero, Listen, Assess, Integrate, and Automate scroll positions.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Fonts and typography: room headlines now use a condensed display face and optical weight that matches the selected concept; body and utility copy retain the existing FanWorks sans/monospace system. All tested headings wrap without clipping.
- Spacing and layout rhythm: the building remains the dominant spatial canvas, the narrative block holds a consistent lower-left position, and header/progress elements stay aligned across camera states.
- Colors and visual tokens: deep navy, warm brick, porch green, paper, teal, coral, and glowing ochre create a brighter premium palette while retaining FanWorks' industrial character. Text contrast remains readable over the illustrated cutaway.
- Image quality and asset fidelity: the production hero is a dedicated 1934 × 813 WebP panorama, not a stretched mockup. It contains the requested customer-and-staff intake scene, detailed assessment room, credible server-rack integration, and clean production-ready automation room. The separate 1586 × 992 operator illustration uses the same editorial-cartoon rendering, materials, lighting, and golden system line.
- Copy and content: each room explains a distinct business-system stage—Listen, Assess, Integrate, and Automate—without generic growth metaphors.
- Interaction and accessibility: vertical scroll continuously controls horizontal camera translation, vertical drift, and scale. The active room updates the visible narrative and progress state. Reduced-motion users receive a static final-room composition. Semantic headings, aria-hidden state, mobile navigation, and contact behavior remain intact.
- Hero and story continuity: the people-filled cutaway remains the initial viewport. The lower story artwork now uses a matching generated operator-floor illustration in a rounded editorial frame, carrying the ochre pipeline and industrial palette into the proof section.
- Market clarity: the first room explicitly names growing service businesses and founder-led manufacturers. “Where we help” now names five operating frictions instead of repeating the four-step hero journey.
- Operator proof: the page now leads with the supported “20+ years” fact, manufacturing expertise, an operator-led claim, and a KPI band for cycle time, throughput, gross margin, and on-time delivery. No invented client-result percentages were introduced.
- Responsive review: the current desktop states were captured at 1280 × 720. The existing 390 × 844 baseline and the current breakpoint rules were rechecked; the tablet work-intro grid and mobile story-image height were corrected during this pass.

## Comparison History

### Iteration 1

- P2 finding: room headlines used the broad Arial Black display face, while the selected architectural concept used a narrow editorial headline. The broader face reduced negative space and made the composition feel heavier than the source.
- Fix: scoped room headlines to `Impact`, `Arial Narrow`, then the existing display fallback; adjusted weight, tracking, and line height.
- Post-fix evidence: `/tmp/fanworks-cutaway-design-comparison-final.png` shows the corrected narrow hierarchy alongside the selected design.

### Iteration 2

- Result: no actionable P0, P1, or P2 mismatches remained in the full-view comparison or focused headline/camera review.

### Iteration 3

- User-directed refinement: promoted the cutaway to the first hero, moved navigation into the sticky camera scene, replaced the mismatched illustrated lower graphic with the operator worktable photograph, and introduced restrained rounded corners on labels, controls, and the story image.
- Post-fix evidence: `/tmp/fanworks-cutaway-first-hero-desktop.png`, `/tmp/fanworks-cutaway-first-hero-mobile.png`, and `/tmp/fanworks-story-rounded-worktable.png` show the unified art direction and unobstructed responsive layout.
- Result: no actionable P0, P1, or P2 findings in desktop hero, mobile hero/menu, or story-section review.

### Iteration 4

- User-directed refinement: populated every hero room with the requested people and operating detail; separated target-market friction from the process story; removed the red diagonal; replaced the coffee-table stock image with a matching operator-floor illustration; and added operator proof plus KPI language.
- P2 finding: the new work-intro block retained desktop grid column 2 between 701 and 900 pixels, which could create an unintended implicit tablet column. The later mobile image override also left the story artwork taller than intended at phone widths.
- Fix: pinned the work-intro block to the single tablet column and restored the 23rem phone artwork height in the final cascade.
- Post-fix evidence: `/tmp/fanworks-people-hero-desktop.png`, `/tmp/fanworks-friction-market-desktop.png`, `/tmp/fanworks-how-we-work-no-slash.png`, and `/tmp/fanworks-operator-proof-kpis.png`.
- Result: no actionable P0, P1, or P2 findings remain in the updated desktop narrative, proof section, or reviewed responsive rules.

### Iteration 5

- User-directed refinement: simplified the journey and supporting copy into plain, human language; rebuilt the fourth room as a bright modern office with three people working calmly together; and kept the golden conduit as the continuous visual thread.
- P2 finding: the final narrative previously became active before the camera had fully revealed the fourth room, making the payoff feel partially hidden.
- Fix: delayed the fourth narrative threshold, increased the final camera travel on desktop and mobile, brightened the image progressively, and reduced the right-side vignette. The final office now fills the phone viewport and remains clearly readable at the end of the desktop journey.
- Post-fix evidence: `/tmp/fanworks-human-progression-desktop-start.png`, `/tmp/fanworks-human-progression-desktop-final.png`, `/tmp/fanworks-human-progression-mobile-start.png`, and `/tmp/fanworks-human-progression-mobile-final.png`.
- Result: the four stages read as one clear progression—busy, understood, connected, calm—with no actionable P0, P1, or P2 findings in the reviewed desktop or mobile states.

### Iteration 6

- User-directed refinement: replaced the fourth-room coworking scene with a bright customer-at-counter interaction that intentionally mirrors the opening room.
- Source-preservation review: rooms 1–3, the cutaway architecture, and the continuous golden conduit remain recognizable and aligned. Room 4 now contains one customer on the visitor side and one attentive staff member behind a clean service counter.
- Human and object review: both people have natural posture, hands, eye lines, proportions, and clothing. A focused second edit moved and rotated the desk phone toward the staff member. The monitor back faces the customer while the keyboard, mouse, terminal, paperwork, and phone controls remain reachable from the staff side.
- Copy alignment: the final narrative now reads “Make every interaction easier” and connects quiet background systems to giving the customer full attention.

### Iteration 7

- User-directed refinement: replaced photoreal miniature rendering with a polished editorial-cartoon art direction across the hero journey and operator-proof section.
- Source-preservation review: the four-room order, architectural cutaway, human actions, customer-counter bookends, and continuous golden conduit remain intact.
- Finish review: varied linework, tactile painted texture, richer material definition, layered lighting, correctly oriented equipment, and a controlled bright palette make both scenes feel commissioned and art-directed while avoiding uncanny photoreal humans.
- Detail review: purposeful papers and call activity support Listen; maps, notes, plans, and tools support Assess; patch panels, cable organization, status lights, and abstract data flows support Integrate; premium millwork, plants, warm daylight, and a calm customer interaction support Automate.
- Export review: the 1934 × 813 production WebP retains the full panorama and dark layout-safe negative space without cropping any room. The matching operator-proof illustration exports at 1586 × 992.

## Primary Interactions Tested

- Scrolled continuously through all four desktop room stops and verified the camera, active narrative, room count, and progress line.
- Verified the first two mobile room stops at 390 × 844 with no horizontal page overflow or clipped narrative content.
- Verified the hero-to-cutaway transition and corrected the mobile hero headline width.
- Verified the cutaway as the initial page state, the floating navigation, the open mobile navigation, and the rounded story image.
- Checked browser warnings and errors after desktop and mobile traversal; none were present.

## Follow-up Polish

- P3: pointer-position parallax could add subtle depth on desktop, but it is not necessary for the scroll story and should remain restrained.

## Data Layer Redesign — Option 1

### Evidence

- Selected ImageGen reference: `/Users/scottjones/.codex/generated_images/01a014d3-5d84-7451-94ea-549f0179d8bf/exec-ef863d33-c649-4343-b3a7-55a6fad9dc57.png`
- Final desktop implementation: `/tmp/fanworks-data-layer-desktop-final.png`
- Final mobile implementation: `/tmp/fanworks-data-layer-mobile-final.png`
- Side-by-side reference comparison: `/tmp/fanworks-data-layer-comparison.png`
- Reviewed viewports: 1280 × 900 desktop and 390 × 844 mobile.

### Findings

- No actionable P0, P1, or P2 findings remain.
- The desktop layout preserves the selected concept's split editorial heading, converging source systems, ochre directional line, and green operating-layer result.
- Connector angles now resolve ten source systems into one central handoff before the result card, making the before-to-after logic explicit.
- The mobile breakpoint replaces the desktop convergence field with a readable two-column source grid, vertical handoff arrow, and full-width result card without horizontal overflow.
- The existing FanWorks header, condensed display typography, monochrome utility type, dark palette, ochre accent, and section-corner details remain consistent with the rest of the site.
- Mobile navigation opens and closes correctly, restores page scrolling, and exposes the expected navigation options.
- Browser console review showed no errors or warnings; only normal Vite and React development messages were present.

### Iteration 8

- User selection: implemented Data Layer Option 1 as the production section instead of embedding the generated image.
- P2 finding: the first pass used a left-pointing convergence wedge and shallow connector angles, which weakened the source-to-layer reading.
- Fix: reversed and aligned the convergence wedge, increased the connector angles so all ten inputs meet at one handoff, and retained the clear rightward ochre arrow.
- Result: desktop and mobile comparisons match the selected hierarchy and operating logic with no actionable P0, P1, or P2 findings.

final result: passed
