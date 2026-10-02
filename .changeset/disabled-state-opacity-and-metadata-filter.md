---
"@xoroh/kern-tokens": minor
---

Add M3's fifth state-layer opacity (`disabled`, 38%) and assert all five in `check:kern`.

Closes SPECS-1 finding **F1** (review-m3 currency audit) and research item **A2**, which had been
open since 2026-10-01: kern shipped **four of five** M3 state-layer opacities. The missing one is
the only gap a currency gate could catch here — material-web *does* define `disabled` while being
behind on Expressive, so it is exactly the case where "compare to material-web" and "compare to the
spec" disagree.

Verified against the spec page, not the implementation
(`m3.material.io/foundations/interaction/states/state-layers`, re-read this pass): *"Four overlay
states and their values: Hover +8% · Focus +10% · Press +10% · Drag +16%"*, with the state-opacity
scale listing `0.38 Disabled state layer opacity`. Per SPECS-1 the **completeness** claim is the
spec's; only the individual values may cite an implementation.

**New gate assertion** (`check:kern` section 3b) — the summary now reports `5/5 states`:
- every one of the five must be present, with the exact specified value
- a **sixth** state is a violation too, so this cannot drift upward either

**Mutation-proved three ways**, each reverted:
- remove `disabled-opacity` → *"states.disabled-opacity is missing — M3 defines five state-layer
  opacities"* (this reproduces the F1 gap exactly)
- set it to 50% → *"states.disabled-opacity is 50%, M3 specifies 38%"*
- add a bogus sixth → *"states.hover-alt-opacity is not one of the five M3 state-layer opacities"*

## A real generator bug this exposed

Adding a `$comment` to `states` produced `--md-sys-state-$comment: …` in `tokens.css` — an invalid
custom-property name that made the CSS unparseable and broke `generate:tokens`.

Root cause: `gen-css.mjs` filtered DTCG metadata keys **only for the `elevation` group**. Every other
group (`shape`, `spacing`, `states`) emitted keys raw, so any of them would have leaked the same way
the moment it gained a `$comment`. This is the same leak class as the `$comment` bug fixed in
`tokens-css.test.ts` — that test covered `elevation` only and would not have caught this.

Fixed at the source with a shared `isTokenKey` / `tokenEntries` helper applied to every token group,
so the filter is no longer per-group and cannot be forgotten again. `tokens.css` now emits **0**
metadata-derived variable names.

Verified: `check:kern` 45/45 + 5/5 states + 19/19 resting elevation · `check:contrast` 1242 checks /
0 orphans · `check:generated` fresh · kern-tokens typecheck + 39 tests · biome clean.
