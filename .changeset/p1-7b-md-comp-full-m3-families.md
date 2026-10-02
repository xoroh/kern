---
"@xoroh/kern-tokens": minor
---

P1-7b — `md.comp.*` now covers every M3 component family: 27 → 42 components, 93 → 142 slots.

**On the target.** The brief said "the full component inventory (every row the mcp manifest knows
about)". Measured before building: the manifest holds **345 primitive rows** collapsing to ~133
families, and many are kern/Base-UI constructs M3 never specified — `accordion`, `avatar`,
`badge`-adjacent `empty-state`, `command`, `country-select`. Generating `md.comp.*` tokens for those
would assert M3 token specs for concepts the spec does not define, which is precisely the
"table becomes a second source of truth" failure this table was built to avoid.

The real target is the **37 component families on m3.material.io/components** (verified against the
live catalog this pass). Diffing those against the previous 27 found **16 genuine gaps**, all now
filled: badges, button-group, extended-fab, fab-menu, loading-indicator, menus, navigation-drawer,
navigation-rail, search, side-sheet, split-button, text-field, date-picker, time-picker, toolbars,
and `all-buttons` (covered by the five button configurations).

42 components covers all 37 M3 families, the extra 5 being the button variants M3 defines as
distinct colour configurations (filled, tonal, outlined, elevated, text).

**The generator's reference validation caught four more authoring errors**, all of the same shape:
the walk is `component -> slot -> entries -> attr`, and every leaf must be a string. I wrote
`"outline-color": "outline"` and `"selected-day-on-color": "on-primary"` one level too shallow, and
nested `menus.container.elevation` inside `container` — which puts an *object* where the loop
expects a string, a `TypeError` rather than a clean validation error. `elevation` is a sibling slot,
matching `banner`/`dialog`/`card`. Each is now commented at the site so the next author does not
repeat it.

**Elevation is only asserted where the component carries a token.** `loading-indicator` and
`side-sheet` rest at M3 level 0, so they get no elevation slot — absence is the conformant state,
the same ruling as `chip`/`slider`/`tabs`/`carousel` in `check:kern`.

Verified: `check:kern` 45/45 + 19/19 resting elevation · `check:contrast` 1242 checks / 0 orphans ·
`check:generated` fresh (codegen diff clean) · kern-tokens typecheck + 39 tests · biome clean.
