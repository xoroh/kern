---
"@xoroh/kern-tokens": patch
---

Gate Button's resting elevation, and add `scripts/measure-elevation.mjs` so the
next sweep measures before it adds.

M3 tabulates buttons twice — "button (elevated)" at level 1 and "buttons (filled,
tonal, outlined)" at level 0 — and Kern's Button covers both through its `variant`
axis, so the row takes `variants: [0, 1]`. Button shipped level 1 ungated, so
nothing asserted it.

Verified rather than assumed: `check:kern` goes from `resting elevation 11/11` to
`12/12`, and mutating Button's token to level 4 now fails with "button: ships
elevation level4, M3 assigns level0/1".

**`measure-elevation.mjs` exists because the obvious sweep is a trap.** A sweep of
M3's table shows 15 spec rows ungated-but-shipped, which reads like an easy win.
But `check:kern` resolves a level by scanning the component's import closure for
`--md-sys-elevation-level<N>`, and for `chip`, `banner`, `slider`, `tabs`,
`segmented-button`, `carousel` and `list` it finds nothing. A row for those
measures `null`, is counted unasserted, and makes the summary read
"resting elevation 18/18" while asserting nothing at all.

So the script prints, per component, whether a row would actually be assertable.
The honest fix for those seven is the token, which is design work — not the row.

Recorded in the module header so the next sweep does not re-derive it.