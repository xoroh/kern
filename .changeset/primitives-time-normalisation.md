---
"@xoroh/kern-primitives": minor
---

Time-picker value normalisation — the pure half of the TimePicker contract.

The value is **always** 24-hour internally, whatever the picker renders.
Choosing "3 PM" reports `hours: 15`; re-opening in 24-hour mode shows `15`. A
picker that kept 12-hour state would drift the moment a consumer persisted it,
and the drift stays invisible until two records are compared — so the conversion
is a pure function both renderers call rather than state each one owns.

`minutesForStep` enforces a valid step is a **positive integer dividing 60**. The
integer requirement matters on its own: `60 / 1.5` is exactly 40, so a
divisibility test alone accepts `1.5` and yields fractional minutes (0, 1.5, 3.0…)
that no picker can display. Falls back to minute-accuracy, and says so in the
reported value rather than hiding it in the rendering.

`normalizeTimeValue` snaps minutes **down** onto the step grid: 3:50 with a
15-minute step becomes 3:45, not 4:00, because advancing the value the user did
not ask for is worse than dropping a remainder they could not have selected.

Landed as pure logic with 19 tests, before any UI. Streams were dropping, so the
substantive and highly testable part is banked first rather than risking it
uncommitted behind a component — the native TimePicker (three roving fields on
top of `useRovingModel`) follows.