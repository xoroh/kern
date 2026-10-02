---
"@xoroh/kern-native": minor
---

M3 FAB / overflow-action family, tranche 2 of the native-parity work (P2b-3):
`ExtendedFab`, `FabMenu` and `SplitButton` now ship natively. Also fixes the
`Dialog`'s missing role, which announced modal dialogs as unstructured views.

The three components own behaviour rather than wrapping a primitive — React
Native has no extended FAB, FAB menu or split button to wrap, so unlike their web
counterparts (thin pass-throughs over Base UI) each one implements its own
collapse, expand/dismiss and press-splitting.

- **`ExtendedFab`** — the collapse M3 specifies when the label no longer fits,
  triggered through an **imperative handle** rather than a gesture (scroll
  position is host state the component cannot see), plus **the accessible name
  surviving the collapse**: collapsed, the label text is gone and `label` on the
  element is all that is left to announce. The handle is idempotent — two scrolls
  the same way report one collapse.
- **`FabMenu`** — the trigger's **own** name, defaulting to the first action's so
  a menu is never an unnameable trigger; `accessibilityState.expanded`; the
  optional `openIcon` swap; **select-then-dismiss**, so the host cannot forget to
  close it; and disabled actions that are both announced and unreachable. An
  empty action list renders no surface rather than a trigger that opens an empty
  box, while the trigger itself stays put so async-loaded actions do not shift
  the control.
- **`SplitButton`** — **two named controls** and two tab stops, because one
  element with two hit regions can be announced as neither; the **primary action
  never opens the menu**, which is the component's entire reason to exist;
  select-then-dismiss; the M3 1dp hairline divider that makes the two halves read
  as one pill rather than a button group; and `disabled` killing **both** halves,
  since a live overflow beside a dead primary is a trap.

**`Dialog` now declares `role="dialog"`.** It shipped `accessibilityRole="none"`,
but `accessibilityRole` is the *platform-trait* prop and its union has no
`dialog` member at all — "none" was the only way to say "no role I can express"
with that prop, so every screen reader treated a modal dialog as an unnamed
View. RN's ARIA-aligned `role` prop does have it, and Fabric resolves it to
`Role::Dialog`. `accessibilityRole="alert"` is retained as the repo's existing
dialog mapping. `AlertDialog` is deliberately left on its current mapping.

**These three carry no cross-renderer contract row yet.** `parity/contract.ts` has
no `extended-fab` / `fab-menu` / `split-button` row, and the suite pins each
renderer's behaviour on its own floor only. A row is only sound once both sides
are measured, and the web side of all three is unmeasured — notably `SplitButton`,
where web composes on the Base UI menu root and native uses a `Modal`, so
traversal/Escape/focus-return would be red on day one. The rows are owed by
P2b-4 behind web-side measurement; `docs/parity-contract.md` records the debt and
which row each would pin.

Verified: `check:parity` (330 rows, 53 shared / 22 native-only / 37 web-only),
`typecheck` (5/5), `test:all` (41 vitest + 129 jest, up from 64), `check:kern`
(45/45), `lint` (0 errors). Mutation-proven: the dialog role, the collapse name
survival, the empty-action gate and the primary/menu separation were each
reverted in isolation and the suite went red every time.