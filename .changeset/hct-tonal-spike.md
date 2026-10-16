---
"@xoroh/kern-tokens": minor
---

Additive HCT tonal-engine spike (ADR-016, roadmap D-HCT): new `hct` module
backed by `@material/material-color-utilities` (`^0.3.0`, Apache-2.0) with
0–100 tonal ramps (`hctTonalRamp`), HCT key colors (`hctKeyColor`), and
full-scheme role mapping (`hctSchemeRoles` via `SchemeTonalSpot`).

Additive only: the OKLCH engine and all generated artifacts are untouched,
nothing consumes this module yet, and the OKLCH-vs-HCT divergence stays
documented until the review-gated cutover. Pinned to the 0.3.x line because
0.4.0 ships a broken ESM import (`color_spec_2025.js` imports extensionless
`dynamic_color`, unresolvable under vitest); revisit 0.4.x at cutover.
