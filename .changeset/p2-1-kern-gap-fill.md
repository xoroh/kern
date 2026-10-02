---
"@xoroh/kern": minor
---

Add the seven M3 components Phase 2 named as missing (ladder **P2-1**):
`ExtendedFab`, `FabMenu`, `IconButton`, `SplitButton`, `TimePicker`,
`Carousel`, `LoadingIndicator` (+ `LoadingRegion`). All seven own behaviour
rather than wrapping a primitive.

- **`IconButton`** — four containers plus the toggle, whose state is reported as
  `aria-pressed` (controlled or uncontrolled). A plain icon button never claims
  to be a toggle. The accessible name and the M3 tooltip come from one `label`
  prop, so the announced name and the visible one cannot drift; a missing label
  warns in development, because an icon-only button with no name is unusable.
- **`ExtendedFab`** — M3 collapses the extended FAB into a plain one. The
  trigger is an **imperative handle** (`collapse`/`expand`/`toggle`), not a
  gesture: M3 collapses on scroll, which the component cannot see, and shipping
  an invented gesture makes the behaviour a kern-specific thing consumers have
  to discover. The accessible name survives collapse.
- **`FabMenu`** — a FAB that opens a menu instead of firing one. `aria-haspopup`
  and `aria-expanded` on the trigger; select-then-dismiss so a host never closes
  the menu by hand; Escape returns focus to the FAB; a disabled action cannot be
  activated.
- **`SplitButton`** — one primary action plus an overflow menu, as **two named
  controls**. M3 forbids implementing this as one element with two hit regions:
  such a control cannot be announced as either half. The primary action does not
  open the menu, and disabling disables both halves.
- **`TimePicker`** — hour/minute(/period) as three `listbox`es with roving
  tabindex and Arrow/Home/End traversal that wraps and auto-selects. State is
  **24-hour whatever `format` renders**, so choosing "3 PM" reports `15` and a
  persisted value cannot drift. A `step` that cannot land on `:00` falls back to
  minute-accurate rather than offering unreachable minutes. Ships the listbox
  presentation rather than M3's clock face — recorded as a deviation in
  `docs/parity-contract.md`, since the listbox is the form that is
  keyboard-correct without a pointer.
- **`Carousel`** — `aria-roledescription="carousel"`/`"slide"` with `"n of m"` per
  slide, one tab stop with Arrow-key traversal, clamp-and-disable or wrap,
  inactive slides `aria-hidden` rather than announced. **No autoplay prop**:
  M3 does not specify auto-advance, and motion that moves content out from under
  a reader is a failure, not an enhancement.
- **`LoadingIndicator`** + **`LoadingRegion`** — implements ruling **T4-M5**: the
  M3 Loading indicator *replaces* the indeterminate circular-progress pattern
  rather than shipping beside it. `role="status"` so the label is announced when
  it appears, and deliberately **no `aria-valuenow`** — there is no progress to
  report and a fabricated value is worse than none (determinate progress stays
  in `LinearProgress`). `prefers-reduced-motion` stops the motion without
  removing the feedback. `LoadingRegion` puts `aria-busy` on the region being
  loaded, which is where it belongs.

**`Loader` is unchanged and still exported.** T4-M5 also contemplates retiring
the indeterminate circular-progress path, but that is a breaking export removal
and `kern-lead`'s call under the ruling — not a side effect of a gap-fill batch.
`LoadingIndicator` is additive alongside it for now.

Also: `menuPopupClass` / `menuItemClass` moved to `menu-classes.ts` so the two
new menu-composing components render the same menu surface instead of a second,
slightly different one. No behaviour change to `Menu`.

Verification: `typecheck` 5/5 exit 0 · `test:all` exit 0 (223 web incl. **66
new**, 39 theme, 76 icons, 15 start, 41 native) · `check:parity` green at **325
rows** (48 shared / 22 native-only / **42 web-only** / 0 stubs — web-only 34 → 42
and the registry 317 → 325 because these are web-first concepts whose native
counterparts are owed by P2b-3) · `check:kern` 45/45 · `check:contrast` 1,242
checks, 0 orphans.

Three defects were found by these tests rather than by a gate, and are fixed:
the menu root was permanently controlled by its own internal state (so it could
never open); the popup carried a second, competing accessible name; and a prop
spread placed after `onClick` silently clobbered the composed toggle handler.
Nine mutations were injected and each was caught.
