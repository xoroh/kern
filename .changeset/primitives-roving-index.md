---
"@xoroh/kern-primitives": minor
---

Add the roving-index model — one tab stop per composite, arrow traversal within.

This is the primitive that was previously **cut as an honest gap**. On web,
Base UI owns the axis and no renderer-neutral Kern implementation existed to
extract. Native Carousel ("one tab stop for the item track, arrow keys move
between items") and native TimePicker ("roving tabindex per field — three tab
stops for three fields, not one") both need it, which is what makes it real
shared behaviour with a real contract rather than a single-use helper.

**The mechanism is deliberately NOT here.** Web presses ArrowLeft/ArrowRight;
React Native has no arrow keys at all, because a touch device has no keyboard.
Each renderer supplies its own input handling; the model supplies state and the
derived per-item facts. Folding key handling in would make the "platform-free"
claim false — the same mistake a SheetSurface extraction would have made.

`describe(index)` returns `isActive` and `isTabbable`, deliberately NOT named
`tabIndex` or `focused`: `tabIndex` is web vocabulary, and a native renderer maps
`isTabbable` onto `accessibilityState.selected`. A model that encoded which
platform consumes it would force a third renderer to work around the web one.

## Two real bugs the tests caught on first run

1. **An empty group reported a tab stop that did not exist.** `clamp(0, 0) === 0
   === current`, so `describe(0).isTabbable` was `true` for a group with no
   items. Now nothing is tabbable when `count` is 0.
2. **A "controlled" model moved itself.** `commit` mutated `current` and *then*
   notified, so the model would drift from the host's prop until the next
   render. Controlled now reports and stops.

Both were found by the first run of the tests, not by reading the diff.

## Also fixed: a pre-existing type error

`selection.test.ts:163` called `useSelection({ defaultValue: "a" })`, which
infers the key type as the literal `"a"`, so selecting `"b"` was a type error.
Present in `HEAD`, surfaced by building this package properly rather than
through the root script that had been skipping it. Fixed with an explicit
`<string>`.

`first()`/`last()` also had to stop returning `commit()`'s void, which only
surfaced once `commit` was corrected in (2).

Verified: primitives **57/57** across 3 files (15 new) · build green ·
`check:primitives` PASS (the boundary holds with a real file in it) ·
`check:layers` PASS · `check:parity` PASS · `check:kern` PASS.