---
"@xoroh/kern": minor
"@xoroh/kern-native": minor
"@xoroh/kern-tokens": patch
---

Variant + resting-elevation conformance against the M3 spec pages, verified from primary
sources (m3.material.io), replacing the secondary summaries the tables previously rested on.

**Three variant rows were wrong.**

- **`Button`** — the spec says *"Five color options: elevated, filled, tonal, outlined, and
  text."* kern listed four, including **`destructive`, which M3 does not define for buttons**.
  An error-coloured button is a filled button on the error roles — a caller colour choice, not a
  sixth axis — so `destructive` is removed and `elevated`/`outlined` added, on both renderers.
  `tonal` also moves from kern's `surfaceTonal` to M3's `secondaryContainer`.
  **Breaking:** `variant="destructive"` no longer exists; `variant="outlined"` is new.
- **`Chip`** — *"Four variants: assist, filter, input, and suggestion."* **`input` was missing**
  on both renderers. **Breaking:** `variant="input"` is new.
- **`Fab`** — *"Three variants: FAB, medium FAB, large FAB."* That is a **size** axis, so
  `variant: primary | tonal` asserted an axis M3 does not define. The axis moves to `size`
  (`medium` 96dp, `large` 128dp added) and the FAB fill becomes `primaryContainer`.
  **Breaking:** `variant` is removed from `Fab`/`NativeFabVariant`; use `size`.

`Card`, `Text`, `FieldMessage` and `Badge` were checked against their spec pages and are
correct as written — unchanged. `docs/platform-parity.md`'s variant law now cites the page for
each corrected row.

**Three resting-elevation defects.** M3's component-elevation table assigns resting level 2 to
*Navigation bar*, *Rich tooltip* and *Toolbar*. kern shipped all three with **no elevation
token**. Fixed to `elevation-level2`.

**Gate gap closed.** `m3-elevation.ts` did not tabulate those three components, so the
conformance check asserted nothing about them: a mutation that deleted the newly-added token
**still passed `check:kern`** (proved, then fixed). The three rows are now in
`M3_ELEVATION_COMPONENTS` and the count moves **8 → 11 components**, all conformant.

Verified: `check:kern` 45/45 + 11/11 resting elevation · `check:contrast` 1242 checks, 0 orphans ·
`check:parity` passes · typecheck 5/5 · 424 tests · build 5/5. Four mutations proven to fail
(stripped navigation-bar elevation, stripped tooltip elevation, wrong card level, reverted
tonal colour).
