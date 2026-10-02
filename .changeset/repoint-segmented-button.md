---
"@xoroh/kern-native": patch
---

Repoint native SegmentedButton at the shared selection primitive, closing the
set of native selection consumers.

Same family as the ToggleGroup bug fixed in the previous commit. This one read:

    const selected = multiple ? (multi ?? []) : [single ?? ""].filter(Boolean);

`[single ?? ""].filter(Boolean)` papers over the empty-string case by FILTERING
rather than modelling "nothing selected" as an empty selection — and in doing so
it would also silently drop any option whose value was genuinely `""`. Same
defect family as `selected[0] === optionValue ? "" : optionValue`: an empty
string used as a stand-in for "no selection".

This also collapses two `useControllableState` calls and a hand-rolled merge into
one `useSelection`. Which axis the caller used IS the mode — a SegmentedButton
given plural props is a multi-select — so the two branches select a mode rather
than each carrying their own state machine.

**One API note worth recording.** The public prop is
`(values: string[]) => void` — a MUTABLE array — while `Selection` is readonly by
design. Widening the public prop to `readonly string[]` was the alternative and
it is contravariant: a consumer already typed `(v: string[]) => void` would stop
compiling. So the copy happens at the one boundary where the two meet, rather
than changing a published signature to suit an internal type.

Verified: native typecheck PASS, native jest 163/163 across 14 suites, primitives
42/42, `check:primitives` PASS, `check:parity` PASS.

That closes the native selection consumers: ToggleGroup, Accordion and
SegmentedButton all use the primitive. Web components remain delegated to Base
UI's `multiple` prop, where there is no hand-rolled logic to replace.