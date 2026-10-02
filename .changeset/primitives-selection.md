---
"@xoroh/kern-primitives": patch
---

Extract the collection/selection model as the layer's second real primitive.

## What was verified before anything was written

The brief said to check whether roving focus and collection/selection are
genuinely platform-free first, because if they need a platform they are contract
data rather than primitives. Measured rather than assumed:

- **Roving focus does not exist as Kern code.** Web delegates it entirely to
  Base UI's Tabs; native `Tabs` has no keyboard handling at all. There is nothing
  to extract — extracting it would mean inventing behaviour neither renderer owns.
- **Collection/selection is real and duplicated.** Native `SegmentedButton`
  implements single-vs-multiple selection directly; web delegates to Base UI's
  `multiple` prop. The model is shared; the rendering is not.

So this extracts the selection model, and leaves roving focus alone.

## What it is

`is this value selected` and `what does activating it do` differ in exactly one
way — exclusive or additive — and that difference is a Kern decision, not a
platform detail. Selection is ALWAYS an array, including single mode where it
holds at most one entry, which removes the `isMultiple ? values : [value]` branch
every consumer otherwise writes.

Built on `useControllableState`, which proves the layer composes.

## Two real defects the tests caught before commit

1. **`select` lost its identity every render.** The `onChange` bridge was an
   inline arrow, and `useControllableState` keeps `onChange` in its setter's deps
   — so a fresh closure rebuilt `setRaw` and therefore `select` each render,
   breaking any consumer memoising on it. Now `useCallback`'d.
2. **Re-activating the selected item reported a change that did not happen.**
   `useControllableState` skips when `Object.is` matches, and two arrays with
   equal contents are never identical — so single-mode re-activation always
   reported a change, and a consumer wiring `onChange` to a state setter would
   loop. Now compared by value.

Both were found by writing the behaviour down first, which is the point of doing
it in that order.

Mutation-proven (each reverted byte-identical):

- single mode stops truncating      -> 2 failed
- multiple mode stops deduplicating -> 2 failed
- single mode toggles instead of replacing -> 2 failed
- the value-equality guard is removed -> 1 failed

Memoisation is proven differently and better: that test genuinely failed on the
real defect before the fix, so it is not a synthetic mutation.

Verified: 33/33 primitives tests, `check:primitives` PASS (now exercised by a
second real primitive, not just the empty package), `check:layers` PASS,
`typecheck` PASS, `preflight:publish` PASS across all 6 packages.

Consumers are not repointed yet — SegmentedButton, ToggleGroup, Accordion and
Select each still carry their own selection handling. That is the next slice.