---
"@xoroh/kern-native": minor
---

Add native `CheckboxGroup` — a web-only row that was a genuine gap.

Verified as a gap BEFORE building, by searching exported symbols rather than
filenames. The first pass checked for `<concept>.tsx` and reported `drawer`,
`popover` and `scroll-area` as missing; all three ship inside
`overlay-surfaces.tsx`, which holds several components per file. Checking
filenames would have had this rebuild shipped work. A second pass on exported
symbols also corrected `scroll-area`, which ships as `export { ScrollArea }` — a
form the first regex missed entirely.

## What it is

Several independent checkboxes sharing one value. The behavioural difference
from the existing `RadioGroup` is exactly one thing: a radio group is exclusive
(one selection, re-activating does nothing) while a checkbox group is additive
(any number may be checked, and activating a checked item unchecks it). Both are
the same selection model in two modes, so it is built on
`@xoroh/kern-primitives` `useSelection` in `multiple` mode — the fourth consumer
of that primitive and the first one that did not exist before it.

The value lives on the group, not the items: the host has one piece of state to
bind, and a partially-updated group (item A controlled here, item B there) is not
expressible. Items read the group's value and report through its toggle, so no
item holds selection state and they cannot disagree.

## Accessibility

Each item is `accessibilityRole="checkbox"` with `accessibilityState.checked` —
NOT `selected`. `RadioGroup` uses `selected` because that is RN's `radio`
mapping; using the wrong axis here would be silently ignored by the platform, the
same class of bug the drawer row documents. The group itself is `role="group"`.

Items derive their accessible name from string `children`, mirroring what
`Select` already does with `option.label`. `RadioGroup` leaves the name to the
nested `Text`, which a screen reader reaches but a query cannot.

## Two harness faults, both mine

- I asserted the missing-provider guard with
  `expect(() => render(...)).toThrow()`. `render` is ASYNC in RNTL v14, so the
  throw arrives as a rejected promise — that assertion **passes against an
  implementation that genuinely does throw**. Now asserts the rejection.
- Bare `fireEvent.press` after `await render` produced "overlapping act() calls"
  and read stale state: 8 of 10 tests failed while `onValueChange` had in fact
  received `["a"]` then `["a","b"]` correctly. The component was right
  throughout. Presses are now wrapped in `await act`, as this repo's own suites do.

Verified: native jest **173/173** across 15 suites (10 new), `typecheck` PASS,
`check:parity` PASS, `check:primitives` PASS.