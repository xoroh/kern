---
"@xoroh/kern-primitives": patch
"@xoroh/kern-native": patch
---

Repoint the native selection consumers at the shared primitive, and fix a
selection bug on the way.

## A real bug, found by reading the code being replaced

`ToggleGroup`'s hand-rolled single-select branch did:

    setCurrent(selected[0] === optionValue ? "" : optionValue);

So re-activating the selected item set the value to the **empty string**. That is
neither a radio group (which does not deselect) nor a deselect (which would clear
it): it left a phantom `""` entry in the selection, which rendered as a selected
item for any option whose value was `""`, and reported a non-empty selection where
the user had selected nothing. The primitive's radio semantics replace it.

## A design error, found by a failing test

The first repoint applied `single` (radio) semantics to `Accordion`, and the
existing suite failed — because an accordion COLLAPSES on re-activation, and that
is the component's entire purpose. Radio and disclosure are different rules:

  single        radio: activating replaces, re-activating does nothing
  single-toggle accordion: activating replaces, re-activating COLLAPSES
  multiple      activating adds or removes

So `single-toggle` is now a third mode. Worth noting how it was found: not by
re-reading the M3 spec, but by a test that already encoded the behaviour. Had I
repointed Accordion without running the suite, I would have shipped a subtly
broken disclosure with a green build.

## Why the key is now generic

`ToggleGroup`/`SegmentedButton` select by string; `Accordion` selects by INDEX,
and `expanded: number[]` is public API. A string-only primitive would have left
Accordion out and made the "shared model" claim half true. Covered by tests,
including that the number `1` and the string `"1"` stay distinct — a Set-based
dedupe that stringified keys would merge them.

## Scope

Repointed: `ToggleGroup` (string keys), `Accordion` (numeric keys).

NOT repointed, deliberately: the web components. They delegate the axis to Base
UI's `multiple` prop, so there is no hand-rolled logic there to replace —
wrapping a primitive that already does nothing would be motion without
behaviour. Same reason `Select` is untouched: it is single-select with no mode
decision to share yet.

Verified: primitives 42/42, native jest 163/163 across 14 suites, `typecheck`,
`check:primitives`, `check:layers`, `check:parity` all PASS.