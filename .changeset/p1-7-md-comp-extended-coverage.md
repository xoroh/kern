---
"@xoroh/kern-tokens": minor
---

P1-7 — extend `md.comp.*` from 12 components to 27.

The board item was "12 components against kern's ~90". This lands 15 more M3-specified
components, taking the table to **27 components / 93 slots** (was 42 slots).

**Added:** outlined-button, elevated-button, text-button, banner, slider, tabs,
segmented-button, carousel, switch, checkbox, radio, progress, divider, top-app-bar,
bottom-sheet.

Two entries are the M3 button family completing its five configurations — M3 defines exactly five,
so `button`/`filled-button`/`tonal-button` were already two-thirds of a colour set that had no
outlined/elevated/text member.

**The generator's reference validation did the real work here.** Every slot must resolve to a role,
spacing key, shape or typescale entry that already exists, so a wrong token is a hard failure, not a
silent bad value. It caught four real mistakes in the first draft: `color: "transparent"` is not a
role (string slot values are read as nested slot names), `icon-12` did not exist, `space-10` is not
a spacing key, and several colour slots needed nesting. `divider` now uses `space-125`, which is
the 10px scale entry, rather than an invented `space-10`.

**One claim was cut rather than shipped.** I first gave `bottom-sheet` an `elevation: level1`
slot, on the strength of the M3 resting-elevation table. `scripts/measure-elevation.mjs` reports the
sheet's import closure carries **no** `--md-sys-elevation-level` token, so the table would have been
asserting a level the component does not implement — the "table claims a value nothing renders"
failure. The slot is removed with the reasoning in place; gating that row belongs with the token
landing on the component. `banner` keeps `elevation: level1` because it **measures** level 1.

No new token values were introduced: every slot resolves to an existing role or scale entry, which
is what keeps `md.comp.*` a table rather than a second source of truth.

Verified: `check:kern` 45/45 + 19/19 resting elevation · `check:contrast` 1242 checks / 0 orphans ·
`check:generated` fresh · kern-tokens typecheck + 39 tests · biome clean.
