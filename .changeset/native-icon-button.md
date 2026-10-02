---
"@xoroh/kern-native": minor
---

Add native `IconButton` — and export `pressIsCancelled`, a testable form of a
guard that is currently untested everywhere in `kern-native`.

Verified as a real gap first: 27 behaviour lines in the web contract, and no
native exported symbol. `form` was cut in the same pass (19 LOC, 0 behaviour
lines — presentational).

## Why this is not `Button` with no children

A toggle icon button is a different contract from a button. `Button` is "do
this"; `IconButton` in toggle form is "this is on/off". A toggle icon button
that does not report its state is "a plain button wearing a selected colour" —
exactly the state a screen reader cannot see. So `selected` is carried in
`accessibilityState` and is controllable.

`accessibilityState.selected`, not `checked`: on a `role="button"`, `selected`
is the axis RN exposes, mirroring `Toggle`. This is the same distinction
`CheckboxGroupItem` gets right by using `checked` for a checkbox.

## The name is mandatory

There is no visible text, so nothing names the button but what we are told, and
an unnamed icon button is announced as an unlabelled control — not an action
anyone can take. `label` is therefore required by the type and drives both the
announced name and any tooltip the host renders, so a sighted hover and an
announced name cannot drift.

40dp visual box, 48dp hit area via `hitSlop`, matching `Toggle`.

## `pressIsCancelled` — a guard that could not previously be tested

Writing the press-cancellation test surfaced a real limitation: **React Native's
Testing Library synthesises a press event that exposes both `preventDefault()`
and `isDefaultPrevented()`, but the latter is a no-op stub — it returns `false`
even after `preventDefault()` was called.** Verified by probe, not assumed.

That means `fireEvent.press` *cannot* exercise an `isDefaultPrevented()` guard
at all. Checkbox, Toggle and the menus all inline exactly this check and none
of them are covered by it. The guard is correct code that no test could have
caught a regression in.

So the check is extracted into an exported `pressIsCancelled(event)` predicate,
which is testable, and used by this component. An absent event is treated as
NOT cancelled — a press with no event object is a press with no reason to
suppress. **The same extraction applies to the other components and is not yet
done; until it is, those guards remain conventions rather than contracts.**

## What mutation-proving says is NOT covered

Of seven injected mutations, four were caught. Three survived, and none is a
missing assertion — each is unreachable through the test double. Recorded here
because "224/224 green" should not be read as "every path is covered":

- **"A cancelled press toggles anyway" survived.** The predicate is tested; the
  wiring from the press handler to the predicate is not, because RNTL's
  `isDefaultPrevented()` is a stub that never reports `true`, and the rendered
  host `View` does not expose `onPress` at all (nor does `UNSAFE_getByType`,
  which this RNTL version does not have).
- **"Disabled no longer blocks the toggle" survived** because React Native's
  `Pressable` never invokes `onPress` when `disabled` — verified by probe, 0
  calls. Our `!disabled` check is defence-in-depth behind a platform guarantee,
  so no test can distinguish it.
- **"An indeterminate state ships when no value is set" survived** because
  `defaultPressed` makes `useControllableState` return a boolean, so the
  `?? false` only matters for a controlled `pressed={undefined}` — which the
  type forbids.

All three are correct code that no test in this environment could regress. That
is a limitation of the harness, recorded rather than papered over.

Verified: native jest 224/224 across 19 suites (16 new), typecheck PASS.