---
"@xoroh/kern": patch
---

P1-6 — `tokens.states` ruling: consume (partial migration), and gate the failure mode.

**The defect.** `tokens.states` (hover 8% / focus 10% / press 10% / drag 16%) generated four CSS
vars that **no component referenced** — zero consumers outside the generated `tokens.css`. The
group passed every gate while changing nothing.

**Ruling: keep the group and wire it up, rather than delete it.** Deleting would have been wrong:
M3's own state-layer page publishes exactly these four values
(`m3.material.io/foundations/interaction/states/state-layers` — *Hover +8% · Focus +10% ·
Press +10% · Drag +16%*). The tokens were spec-correct and merely unwired; deleting a correct group
to quiet a gate is the wrong trade.

**Migrated — 6 expressions across 3 components** now use
`hover:opacity-[var(--md-sys-state-hover)]`. Two were not just unwired but **wrong against the
spec**: they used `/90` and `/80` hovers, where M3 is explicit that a state layer *"uses the same
colour as the content"* at a fixed per-state opacity. `icon-button`'s hand-typed `/8` was M3's 8%
re-typed by hand — now the token.

**Not migrated:** `focus` (drawn as a focus ring), `press` (an opacity dim of 0.82/0.9 across 19
sites) and `drag` (no implementation). Converting those is a visual change across the component
set, not a token fix; recorded as P1-6 follow-up.

**New gate.** `check:m3` now fails when a `tokens.json` group is generated but read by no source
file, unless it carries a written exemption. Two refinements made it honest rather than
decorative:

- The first draft failed on `palettes`/`spectrum`, which are consumed by a **generator**
  (`gen-tones-css.mjs`), not by a component — exempted with that reason rather than by loosening
  the check.
- The `states` exemption is **value-scoped, not group-scoped**: `hover-opacity` must stay consumed
  or the gate fails. A blanket group exemption would have re-created the blind spot the gate
  exists to close.

**Mutation-proved three ways:** adding an unused group fails; reverting *all* hover consumption
fails with *"hover-opacity is consumed by NO source file"*; the original zero-consumer state is now
unreachable without a gate failure.

Verified: `check:m3` 45/45 + 19/19 resting elevation · `check:contrast` 1242 checks / 0 orphans ·
`check:parity` passes · `check:generated` fresh · 429 tests pass.
