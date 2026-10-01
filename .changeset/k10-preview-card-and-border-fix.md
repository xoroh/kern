---
"@xoroh/kern": patch
---

Record the K10 `preview-card` ruling and drop its non-conformant card border.

Cites `review-m3`'s ruling
(`.team/reports/reviews/m3/2026-10-01-preview-card-ruling.md`, registered as K10
in `.team/programs/K-01-deviations.md`) in `docs/parity-contract.md`:

- The M3-source cell for `preview-card` moves from "none — see note / GAP" to
  "none — K10 (kern extension, `ext:` band)", and the row resolves as a
  **deliberate web-only asymmetry** — hover/focus preview has no touch analogue,
  the same asymmetry class as `kbd`.
- M3's component taxonomy contains no preview-card, so no canonical name exists
  and the strict reading of the naming law would fail. `review-m3` ruled
  **invention → deviation, accepted**: a real web affordance M3 does not cover,
  scoped to the `ext:` band via T4-V2 rather than the naming law being silently
  broken.
- `check:parity` now tracks `preview-card` among the ruled asymmetries, so
  dropping the citation later is a visible gate failure rather than a silent
  un-ruling.

Cosmetic (D-2): `preview-card.tsx:42` used `border border-(--md-sys-color-outline)`
on the popup. M3 Don't — "never use `outline` for dividers or card borders" —
and the same line already applies `shadow-(--md-sys-elevation-level2)`, so the
border mixed two separation languages and used the wrong role for decoration
(`outline-variant` is the decoration role). Border dropped; elevation separates
the surface. No behaviour change.