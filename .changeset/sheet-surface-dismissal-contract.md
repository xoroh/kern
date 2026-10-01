---
"@xoroh/kern": patch
"@xoroh/kern-native": patch
---

Extract the sheet-surface DISMISSAL contract, tested on both renderers (P2b-4
tranche 5) — one contract, two implementations, no shared component.

`SheetSurface` cannot move into `kern-primitives`: it is 144 lines of
`Modal`/`Pressable`/`ViewStyle`/`hitSlop`, and `check:primitives` forbids
`react-native`. Weakening the gate to admit it would cost the property that makes
the layer meaningful. So what is extracted is the BEHAVIOUR, not the file.

The new `sheet-surface` row uses the existing `named-surface` family and adds
three fields:

- `dismissalRequired: ["scrim", "close-control"]` — what BOTH renderers must do.
- `dismissalOnlyWeb: ["escape"]` / `dismissalOnlyNative: ["hardware-back"]` —
  paths a platform has and the other cannot, the same shape as `errorViaHint`.
  Asserting "native has Escape" would be asserting a platform detail as a Kern
  contract.

This is the contract that matters for a sheet: a modal surface that renders but
cannot be dismissed is a trap, worse for a screen-reader user than a pointer user.
`SheetSurface`'s own header records four sheets that shipped an `onDismiss` prop
they never used.

Every required path is asserted as BEHAVIOUR — each actually calls the dismissal
callback — because a scrim that renders but is not wired is the defect itself.

Mutation-proven, each reverted byte-identical:

- native scrim wired to a no-op → fails
- web `Backdrop` removed → "a sheet must render a scrim: expected null to be
  truthy"
- web `aria-modal` removed → fails

**One obligation is declared but not executed**, and it is recorded rather than
faked: `hardware-back`. RNTL 14 removed `UNSAFE_getByType`, so there is no
supported query for a host `Modal`'s props, and `SheetSurface` binds
`onRequestClose={onDismiss}` as a plain pass-through. Inventing an escape hatch to
assert one line would cost more than it proves. It is the only item in this row
that rests on reading the source.

Verified: web 273/273, native jest 163/163 across 14 suites, `check:parity`,
`check:primitives`, `check:layers` and `typecheck` all PASS.