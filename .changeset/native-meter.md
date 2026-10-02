---
"@xoroh/kern-native": minor
---

Add native `Meter` — M3's static-scalar display (storage used, battery level).

Verified as a buildable gap before building. Note the row-ownership metric
initially read `meter` as **zero behaviour lines**, because the web file is a
48-line pass-through to Base UI and the behaviour lives *upstream of kern*. That
was the metric measuring kern's wrapper rather than the component's contract —
the same trap as the filename check two components ago. Re-read against the M3
spec and the accessibility value it publishes, it owns real behaviour.

## Why not a `kind` prop on `Progress`

Both are a bar with a value and both expose min/max/now to assistive tech, but
they mean different things and M3 names them separately: a Meter is a *static
scalar in a range* ("3.2 GB of 8 GB used"), a Progress is *task completion*
("Uploading… 40%"). A consumer picking the wrong one is describing the wrong
thing to a screen-reader user, so the M3 distinction is kept as two components.

## Why `role`, not `accessibilityRole`

RN's platform-trait `AccessibilityRole` union has `progressbar` but **not**
`meter`; the ARIA-aligned `Role` union (the `role` prop) has both. So this sets
`role="meter"` — the same documented mapping `drawer.tsx` uses for
`role="dialog"`. `accessibilityRole="meter"` would not compile.

## Determinate vs indeterminate

Passing no `value` omits `accessibilityValue` entirely. An unknown reading is not
a reading of zero, and announcing `0 of 100` for an indeterminate meter tells a
screen-reader user something false.

Also clamps the indicator to 0-100% and guards a zero-width `min`/`max` range so
the indicator cannot divide by zero — a NaN width silently renders an invisible
bar.

Verified: native jest **183/183** across 16 suites (10 new), native typecheck
PASS.