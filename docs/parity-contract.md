---
component: <kebab-case concept, matches packages/mcp/src/manifest.ts `name`>
behaviour: <what a user can perceive or do>
web_contract: <role / label / state, primitive-agnostic>
native_contract: <accessibilityRole / label / accessibilityState>
m3_source: <M3 spec tab or guideline>
test_pointer: <web test · native test · GAP>
---

# Parity contract manifest

**Status: draft — `kern-lead`, 2026-10-01 · for review by `review-m3` (ladder P2b-1).**
Task: `.team/plans/K-01-ladder.md` §Phase 2b → **P2b-1**.

This manifest is the **contract between the two renderer families**. It says what a
Kern component must do on both sides. It does **not** say how either side is
implemented, because that is the renderer's business.

---

## Why this file lives here, and what it deliberately does not do

**Placement (ladder requirement: "lives where neither package imports the other").**
This is a **doc**, at `docs/parity-contract.md`. It imports nothing, so it cannot
violate ADR 002's boundary. It is not code in `packages/kern` or
`packages/kern-native`, so neither package can reach the other through it.

**Schema (ladder requirement: "reuses the registry metadata schema").**
Every row is keyed on `name` from `packages/mcp/src/manifest.ts` — the repo's own
generated registry, whose entry type is already `{ name, export, platform, path,
status }`. So a component's identity here is the same identity the MCP server and
`docs/components.md` use, and a manifest row cannot silently disagree with the
package surface.

**Primitive-agnostic (ladder requirement, and D-026.1).**
Contracts are written as **`role` · label · state**. Never `data-pressed`,
never a Base UI part name, never a DOM attribute that only exists because a web
primitive emits it. Concretely, the assertions a test makes are things like
*"exactly one item reports selected"* or *"dismissal moves focus back to the
trigger"* — true of any correct implementation. If a future ruling swapped the web
primitive, every row here would survive unchanged. That is the test of this file:
**if a row had to be edited when the primitive changed, the row was written
wrong.**

---

## How the two sets were measured (and two corrections)

The ladder named **12 native-only** and **23 web-only** primitives. Both figures
are **file names**, not concepts, and the underlying doc said different numbers
again. Measured from the generated registry instead:

| Measure | Value |
|---|---|
| Registry rows | **379** (web 279, native 100) |
| **Shared** (already both sides) | **68** |
| **Native-only → needs a web version** | **20** in **11 files** |
| **Web-only → needs a native version** | **43** in **36** files |
| Stub rows | **0** |

<!-- gate:counts 68 20 43 0 -->

Machine-readable line above: `check:parity` (`scripts/check-parity.mjs`) re-derives
these from the registry and fails if they drift, so the prose above cannot quietly
become false. Update the four numbers when a component lands, in the same change.

## Web versions landed (P2b-2 navigation family)

Three of the 25 native-only rows now ship on web, so the table below is 22.
They are recorded here because a row moving between the two tables is the only
trace the contract keeps of the change — the `gate:counts` line is the machine
check, this is the reasoning.

| Concept | Web | Behaviour owned on web | Test pointer |
|---|---|---|---|
| `navigation-bar` | `NavigationBar` + `NavigationBarItem` (`src/components/navigation-bar.tsx`) | `role="navigation"` + `aria-current="page"`; roving tabindex, Arrow/Home/End traversal that wraps and skips disabled; controlled *or* uncontrolled selection; 80dp bar with the `secondaryContainer` active pill; `floating` slot | `navigation-family.test.tsx` |
| `navigation-drawer` | `NavigationDrawer` (`src/components/navigation-drawer.tsx`) | `role="dialog"` + `aria-modal`, scrim, Escape, focus returns to the trigger (composed on the Base UI dialog root, not re-implemented); **activating a destination reports the selection and then dismisses**; 360dp capped at 80vw | `navigation-family.test.tsx` |
| `secondary-tabs` | `SecondaryTabs` (`src/components/secondary-tabs.tsx`) | `role="tablist"` with `aria-selected`; roving tabindex, Arrow/Home/End, wrapping; disabled tabs skipped and inert; `aria-controls`/`aria-labelledby` bound through `useId`; inactive panels unmounted rather than hidden | `navigation-family.test.tsx` |

Two of these had to be **corrected against the contract as written**, which is
the point of writing it down first:

1. **Base UI's `Dialog.Popup` does not emit `aria-modal`.** It traps focus and
   inerts the rest of the page, which is the behaviour, but the attribute the
   contract names (and the one a screen reader needs) was absent. The drawer
   sets it explicitly.
2. **`navigation-bar` and `navigation-drawer` share one destination type.**
   `NavigationDrawer` renders `NavigationBarItem`, not its own row component —
   the same decomposition native uses, so the two renderers agree on which
   element carries the active pill.

The remaining 20 stay native-only. `navigation-bar`'s two siblings in
`/kern/start` (`Sidebar`, `NavigationRail`, `SectionDrawer`) keep their names per
**D11** — the counterpart rule forces *existence*, not renames.

---

**Correction 1 — "12 native-only" undercounts by more than half.** The ladder's 12
are the native-only **source files**; the same files contain **22 concepts**
(5 sheets, 3 menu surfaces, 3 pane/layout pieces, etc.). Working from file names
would have under-scoped P2b-2 by 11 components. Three of the concepts have since
landed on web (see the next section), which is what took the count from 25 to 22.

**Correction 2 — my own first measurement was wrong twice, and caught both.**
An early pass stripped `-button`/`-tab`/`-body` blindly, which turned
`segmented-button` into `segmented` and reported a **both-sides component as
web-only** — it would have been dispatched to P2b-3 as missing native. Removing
those suffixes then over-corrected and made `table-body`/`tabs-tab` false
web-only rows, since `table`/`tabs` are shared and only their *parts* are web-only
by name. The rule that holds: **a name is a sub-part when stripping a part suffix
yields a name already registered on the same platform.** `table-body` is a part of
a registered `table`; `segmented-button` is not a part of any registered
`segmented`, so it stands alone. Both false results are fixed and
`segmented-button` correctly appears in the 48 shared.

I report these because the same registry is the input to the phase gate; a wrong
set would have dispatched real work at phantom gaps.

---

## Web versions of the P2-1 gap fill (M3 components that did not exist on web)

Phase 2 named seven M3 components as missing: Extended FAB, FAB menu, canonical
icon button, split button, time picker, carousel, loading indicator. All seven
now ship in `@xoroh/kern` as components that own behaviour rather than wrap a
primitive, so **web-only goes 34 → 42** and the registry 317 → 325. That is the
honest cost direction: these are web-first concepts whose native counterparts
are owed by P2b-3, and the count moving is the record of the debt.

| Concept | Web | Behaviour owned on web | Test pointer |
|---|---|---|---|
| `icon-button` | `IconButton` | Toggle state reported as `aria-pressed`, controlled **or** uncontrolled; a plain icon button never claims to be a toggle; the accessible name and the M3 tooltip come from one `label` prop so they cannot drift; 40dp visual box on a 48dp touch target | `m3-gaps.test.tsx` |
| `extended-fab` | `ExtendedFab` | Scroll-driven collapse through an imperative handle (M3 triggers it on scroll, which the component cannot see, so a gesture was **not** invented); the accessible name survives collapse, because collapsed the visible label is gone | `m3-gaps.test.tsx` |
| `fab-menu` | `FabMenu` | `aria-haspopup="menu"` + `aria-expanded` on the FAB; select-then-dismiss so the host never closes by hand; Escape returns focus to the trigger; a disabled action cannot be activated | `m3-gaps.test.tsx` |
| `split-button` | `SplitButton` | Two tab stops with two names — a single element with two hit regions cannot be announced as either control; the primary action does **not** open the menu; disabling disables both halves | `m3-gaps.test.tsx` |
| `time-picker` | `TimePicker` | One `TimePickerValue` normalised to 24-hour state whatever `format` renders; roving tabindex per field with Arrow/Home/End wrap and auto-selection; a step that cannot land on `:00` falls back to minute-accurate | `m3-gaps.test.tsx` |
| `carousel` | `Carousel` | `aria-roledescription="carousel"`/`"slide"` with `"n of m"` per slide; one tab stop, Arrow-key traversal; clamp-and-disable or wrap; inactive slides are `aria-hidden`, not read out | `m3-gaps.test.tsx` |
| `loading-indicator` | `LoadingIndicator` + `LoadingRegion` | `role="status"` so the label is announced when it appears; **no `aria-valuenow`** — there is no progress to report and a fabricated value is worse than none; `prefers-reduced-motion` stops the motion without removing the feedback | `m3-gaps.test.tsx` |

Two of these carry rulings rather than preferences, and both are recorded so a
later reader does not "fix" them back:

- **`loading-indicator` replaces the indeterminate circular-progress pattern, it
  does not sit beside it** (T4-M5, `.team/decisions/D-026-kern-council-forks.md`).
  `CircularProgress` remains for the *determinate* case, which is a different
  question. `Loader` is **not** retired in this change: that is a breaking export
  removal and is `kern-lead`'s call under T4-M5, not a side effect of a
  gap-fill batch.
- **`time-picker` ships the listbox presentation, not the clock face.** M3
  specifies a dial; the listbox is the form that is keyboard- and
  screen-reader-correct without a pointer, and a host that wants a dial renders
  one over the same value contract. This is a presentation deviation, recorded
  here rather than hidden.

### Two contract corrections this batch forced

1. **Base UI's menu root emits `aria-labelledby` pointing at the trigger**, so a
   popup that also carries `aria-label` has *two* competing names and the reader
   picks one arbitrarily. `FabMenu` therefore sets no `aria-label` on the popup,
   and `menuLabel` renames the **trigger** (the menu follows). Pinned by a test.
2. **A permanently-controlled prop silently kills the component.** Passing the
   component's own internal state back in as the root's `open` prop makes the
   root controlled, so `setOpen` writes a value nothing reads and the menu can
   never open. `FabMenu` passes `open` only when the host controls it. Caught by
   the behaviour test, not by typecheck or any gate.

---

## Native-only concepts → need a web version (20)

Grouped by surface. `M3 source` is the M3 spec tab that governs the behaviour.

| # | Component | Behaviour | Web contract (to build) | Native contract (exists) | M3 source | Test pointer |
|---|---|---|---|---|---|---|
| 1 | `bottom-sheet` | Modal sheet anchored to bottom edge | `role="dialog"`, `aria-modal`, focus trapped in, Escape closes, focus returns to trigger | `Modal` + `accessibilityRole="alert"` on `EntitySheet`; RN `Modal` handles dismissal | M3 · Sheets → Bottom sheet | `composition.rntest.tsx` |
| 2 | `snap-sheet` | Bottom sheet with snap points | as above + `aria-valuenow`-equivalent detent announced | `Modal` + detent buttons | M3 · Sheets | GAP both sides |
| 3 | `dock-sheet` | Docked bottom panel (persistent, not modal) | `role="region"`, **not** `aria-modal` — docked ≠ dialog | `Modal` currently; web must be non-modal | M3 · Sheets → Docked | GAP |
| 4 | `entity-sheet` | Sheet presenting one entity + actions | `role="dialog"` + `aria-modal`, max 2 actions | `accessibilityRole="alert"`, `actionLabel` | M3 · Sheets | `composition.rntest.tsx` |
| 5 | `bottom-sheet-picker` | Sheet as a single/multi selector | `role="listbox"` + `aria-multiselectable`, Escape closes | `ScrollView` + choice rows | M3 · Sheets → Picker | GAP |
| 6 | `menu-screen` | Full-screen list of destinations | `role="list"`; web likely `NavigationMenu` for parity | `MenuScreen` rows | M3 · Menus | `composition.rntest.tsx` |
| 7 | `menu-sheet` | Sheet wrapping a menu | `role="menu"`, arrow-key traversal | `MenuSheet` | M3 · Menus | GAP |
| 8 | `menu-group-list` | Titled list of menu items | `role="group"` + `aria-label` = group heading | `MenuGroupList` + group label | M3 · Menus | GAP |
| 9 | `action-sheet` | Titled surface with a dismiss path and a body (app switcher tiles or an action list) | `role="dialog"` + `aria-modal`, Escape + a visible close control, focus returns to trigger | `SheetSurface`-hosted: `Modal` + scrim + hardware back + close affordance | M3 · Menus | `composition.rntest.tsx` |
| 10 | `top-app-bar` | Top app bar, small/center/medium | `role="banner"`, `aria-level` per size; medium wraps to 2 lines | `TopAppBar` 64/64/112dp | M3 · Top app bar | GAP |
| 11 | `pane` | Single layout pane | `role="region"` + accessible name | `Pane` | M3 · Lists → Pane | GAP |
| 12 | `list-detail` | Two-pane list→detail layout | `role="navigation"` per pane; selection announced | `ListDetail` | M3 · Lists | GAP |
| 13 | `supporting-pane` | Optional supporting pane beside content | `role="complementary"` | `SupportingPane` | M3 · Lists | GAP |
| 14 | `filter-chip-row` | Horizontal row of filter chips | `role="group"`, each chip `aria-pressed` | `FilterChipRow` | M3 · Chips → Filter chips | GAP |
| 15 | `milestone-trio` | Three-stage progress indicator (brand kit) | `role="progressbar"`, `aria-valuenow"` = stage | `MilestoneTrio` | Kern brand kit (M3 progress analogue) | `feedback.test.tsx` |
| 16 | `success-transform` | Completion transition trio→check | `role="progressbar"` then `role="status"` "done" | `SuccessTransform`, `accessibilityRole="progressbar"` | Kern brand kit | `feedback.test.tsx` |
| 17 | `shape` | Shape-scaled container primitive | web = `style` only, **no role** (decorative container) | `Shape` | M3 · Shape scale | GAP |
| 18 | `shape-art` | Brand shape art | **decorative** → `aria-hidden="true"` | `ShapeArt` | Kern brand kit | GAP |
| 19 | `aspect-ratio` | Fixed-ratio box | `style={{aspectRatio}}` — presentational | `aspectRatio` style | CSS/native analogue | GAP |
| 20 | `sheet-surface` | Shared `Modal` + scrim primitive every kern sheet hosts through | web = `Dialog` root + portal scrim — the one place a sheet gets a dismissal path | `SheetSurface`: scrim press, `onRequestClose` (Android back) and a 48×48 close affordance all bound to `onDismiss` | M3 · Sheets | GAP |
| 21 | `boot-splash` | Native launch surface (the browser has no pre-first-paint phase) | **not applicable** — deliberately asymmetric | `BootSplash` | Kern shell (native-only) | GAP |

### Resolved 2026-10-02 — three of these were never gaps (`pane`, `list-detail`, `top-app-bar`)

`generate-manifest.mjs` scanned only `packages/kern/src/components`. The web **composition tier**
lives in `packages/kern/src/start/`, published as the `@xoroh/kern/start` subpath of the same
package, so `Pane`, `ListDetail`, `TopAppBar`, `Split`, `SplitPanel`, `Sidebar`, `SearchBar` and the
scaffolds were **invisible to the registry and counted as native-only gaps while shipping on web**.
Confirmed against the built `dist/start/index.d.ts`, not by reading source.

Two independent defects had to be fixed for the registry to see them:

1. `AREAS` did not list `packages/kern/src/start`, and the barrel it read was hardcoded to
   `components/` rather than derived per-area.
2. `src/start/index.ts` re-exports with `export * from "./panes"`, but the generator's barrel regex
   only matched **named** re-exports. `exportNames` therefore came back empty and the
   `!exportNames.has(...)` filter discarded every candidate in those files. The generator still
   exited 0 and printed a clean "wrote 352 entries" — **determinism is not currency**: a
   byte-identical re-run passed on a file that was wrong the same way every time.

`check:parity`'s reachability check had the mirror-image blind spot: it read only
`dist/index.d.ts`, so once the rows appeared it reported 9 components "not exported from the public
entry" — a false positive against components that are demonstrably importable. It now follows the
package's own `exports` map, which is the actual contract, rather than a hardcoded path that can
drift from it.

**Native-only 27 → 20 with zero new components written.** The same generator change also raised
web-only 22 → 43, which is the other half of the same accounting error: those concepts were
shipping on web and unregistered, so the mirror-image gap was invisible too.

**Note on 17-19 and 21:** these are presentational or brand-kit. They are native-only
because RN has a layout primitive for them and the DOM equivalent is a CSS
property, not a component. **P2b-2 should decide per row whether a web
"component" is warranted at all** — building a `Shape` React component whose only
job is to emit `aspect-ratio` would violate `docs/conventions/stubs.md`'s spirit
(not a stub, but an empty abstraction). The contract is still recorded because the
mandate is symmetric, and the *decision* is `design-system-lead`'s with my
contract input.

---

## Native versions of the input family (P2b-3, tranche 1)

Three web-only rows shipped a native implementation in this tranche:
`autocomplete`, `input-otp`, `number-field`. Two more were **cut by the
behaviour test** and one is **deferred**, so the family moved 42 → 39 rather
than the full family.

| Concept | Native | Behaviour owned natively | Verdict |
|---|---|---|---|
| `autocomplete` | `Autocomplete` (`src/components/autocomplete.tsx`) | The query, the filtered set, the active suggestion, and both exits (commit / dismiss). RN has no combobox primitive, so unlike web — four pass-throughs over Base UI — this owns the behaviour outright. The popup opens on a **non-empty matching** query only, closes on commit and on blur, reports exactly one active suggestion, and **announces an empty result instead of opening an empty box** | shipped, **no contract row** (see below) |
| `input-otp` | `InputOTP` (`src/components/input-otp.tsx`) | The segmented value, advance-on-fill, retreat-from-empty, and **paste distribution that overwrites from the pasted position**. Every position names itself, including the first — web cannot | shipped, contract row |
| `number-field` | `NumberField` (`src/components/number-field.tsx`) | The stepper, the clamp, and the value the host is told. Both steppers announce themselves disabled at their bound, and a press that lands on the value already showing fires nothing | shipped, contract row |

### What the behaviour test cut, and why that is the point

**`combobox` — cut.** Measured on web: the web `Combobox` is a text input with a
filtered popup and a clear button, which is `autocomplete` plus an affordance.
Native already has `Select` (a trigger + modal chooser, single choice). What is
left for a third component is a clear button — and a clear button is a
**sub-part**, not a concept: the registry's own concept rule collapses
`combobox-clear` into `combobox`, and building `ComboboxClear` as its own
component would have created a row whose only behaviour is "empties the field
it lives inside". Building it was the CSS/shared-function/reject branch of the
test.

**`combobox-clear` — cut**, as above. It is also already handled as a concept
sub-part by `check:parity`.

**`native-select` — deferred, and this is not new.** It is a **ruled deliberate
asymmetry** (see the asymmetry list below): the RN form is the platform
`Picker`, so there is no Kern component to build and the contract row is the
*behaviour*, not a shared name. It was in the 42 because the registry counts the
web wrapper; it is not 39 rows of work.

**`autocomplete` — shipped but carries NO cross-renderer contract row.** This is
the uncomfortable one and it is recorded rather than hidden. Measured on web:
with a query that matches nothing, Base UI keeps `aria-expanded="true"` and emits
**no empty node** — the popup is an expanded box containing zero options. So
there were only two ways to write the row:

- assert the **correct** behaviour (close, or announce "no matches") — which
  would land a **red** web suite on day one, or
- assert the **measured** behaviour — which would bless a defect as a contract
  and make every future reader inherit it.

Neither is acceptable, so the row is **not written**. The native side implements
the correct behaviour and asserts it in its own suite. The web fix is owed by
P2b-4 and is filed here rather than encoded as a shared contract. This is the
fourth time the "measure both sides first, or the contract row is a coin flip"
rule has paid for itself; the cost of getting it wrong is a permanent red gate
that people learn to ignore.

### Four defects this tranche found, three of them by measurement

None of these are contract rows — they are divergences, and each is documented
at its site rather than encoded as a rule both sides must satisfy:

1. **Web's `NumberField` Increase button is not disabled at its maximum, and
   pressing it there does not stay at the maximum.** Measured: `value=4, max=4`
   reports `aria-disabled="false"` on Increase, and one press yields **1**. A
   button that announces itself as available and then moves the value somewhere
   else is worse than either behaviour alone. Native reports `disabled` at the
   bound and clamps.
2. **Web's `NumberField` exposes no `aria-valuenow`/`min`/`max`.** Measured: all
   three are `null`. So a value-range contract row would be red on web; the row
   asserts the arithmetic instead. Native does announce the range — an
   improvement, recorded so nobody "reconciles" it away.
3. **Web's OTP field cannot label its first position.** Base UI *ignores*
   `aria-label` on the first `OTPField.Input` and logs a warning telling you to
   label the group. So "every position names itself" cannot be a shared row
   (false for web position 1). Native labels every position `Digit n of N`.
4. **Web's autocomplete has no working empty state** — item 1 of the cut
   discussion above.

### Two bugs the native behaviour test caught in native code

Recorded because both were invisible to typecheck, to lint, and to every gate —
only a behaviour test finds them:

- **The stepper snapped its own output to a `step` grid.** `clampToStep` did
  `round(next / step) * step`, so at `value=5, step=2` one increment produced
  **8** instead of 7. Web's measurement (5 − 2 = **3**, not a snapped 4) is what
  proved the snap was wrong; the shared contract row then pinned the arithmetic
  so it cannot come back. `clampToRange` now clamps and does not snap.
- **A mid-field paste APPENDED instead of overwriting, and reported a code the
  user never entered.** With "12" in positions 1-2, pasting "9876" at position 3
  produced `"129876"` — six digits handed to the host from a four-position
  field. The boxes rendered correctly, which is exactly why a screenshot review
  would not have caught it. Fixed by slicing the tail at the paste position and
  truncating the assembled value to `length`.

Mutation-proven: each of the two component behaviours above was reverted in
isolation and the suite went red (3 tests for the snap, 1 for the paste); the
autocomplete expansion rule was forced to `true` and 6 tests failed. All three
were restored from backup afterwards.

---

## Web-only concepts → need a native version (43)

The heading previously read **34** while the machine gate read **42** — the
`gate:counts` line was right and the sentence a human reads was stale, which is
how a document lies convincingly. Both are now checked: `check:parity` asserts
this heading's figure as well as the gate line's, and history sentences (the
ones marked *was* / *went* / *from*) are exempt so the doc can still record that
a count moved.

**Two of the 35 are phantom part-names, so the true web-only count is 33**
(`review-m3`). The registry carries `input-otp` **twice** — once `platform: "web"`,
once `platform: "native"` — which makes it *shared*, not web-only, and it was
already moved web-only → shared in P2b-3 tranche 1. Two sibling rows survive from
the same source file and are **not components at all**:

| Registry row | Reality |
|---|---|
| `input-otp` (web) | the real component; the native twin makes it shared |
| `input-otpinput` | **malformed part-name** — the generator's `camel→kebab` of `InputOTPInput` produces a missing hyphen, so the `-input` sub-part collapses into the concept name instead of stripping |
| `input-otproot` | same defect on `InputOTPRoot` |

They inflate this heading by exactly 2 — so a human reading this table should
subtract two to get the number of real components still owed a native version.
The gate's figure (**35**) counts every registry row and is therefore the
mechanical truth; the adjusted figure is analysis, not a count, and is stated
here in prose on purpose so the two can never be confused. The registry defect
is the same class `92b42e7` fixed for the `forwardRef` export — a generator
blind spot that quietly inflates a gated count rather than failing. Not fixed in
this commit: it needs a generator change plus a `gate:counts` correction, and a
count that moves under a gate edit is exactly what the two-line `gate:counts`
assertion exists to catch. Filed as follow-up below.

| # | Component | Behaviour | Web contract (exists) | Native contract (to build) | M3 source | Test pointer |
|---|---|---|---|---|---|---|
| 1 | `combobox` | Select with a custom popup | `role="combobox"`, `aria-controls`, Escape | `accessibilityRole="combobox"` + `accessibilityState.expanded` — **deferred**: web = `autocomplete` + a clear affordance, and the clear affordance is a sub-part (see the P2b-3 section) | **no M3 component** — kern extension (autocomplete + clear) | `combobox.test.tsx` |
| 2 | `native-select` | Native OS picker | `role="combobox"` | **`Picker`** — platform primitive, not a Kern component (see note) | M3 · Menus | GAP |
| 3 | `drawer` | Side drawer | `role="dialog"` + `aria-modal` (M3 drawer = modal variant) | **shipped, P2b-3 tranche 5** — `role="dialog"` + `accessibilityViewIsModal`; scrim is a labelled dismiss control | M3 · Navigation drawer | `overlay-surfaces.rntest.tsx` |
| 4 | `popover` | Anchored non-modal popup | `role="dialog"`, trigger `aria-expanded` + `aria-haspopup` | **shipped, P2b-3 tranche 5** — `role="dialog"`, deliberately **not** modal | M3 · Menus → Popover | `overlay-surfaces.rntest.tsx` |
| 5 | `menu` group `menubar-menu` | One menu in a menubar | `role="menu"`, `aria-haspopup`, arrow keys | `accessibilityRole="menu"` | M3 · Menus | `menubar.test.tsx` |
| 6 | `navigation-menu-link` | Link inside a navigation menu | `role="link"` | `accessibilityRole="link"` + `accessibilityState.selected` | M3 · Navigation | GAP |
| 7 | `meter` | Scalar measurement in a range | `role="meter"` + `aria-valuenow/min/max` | `accessibilityRole="progressbar"` + `accessibilityValue` | M3 · Progress → Meter | `meter.test.tsx` |
| 8 | `pagination` | Page navigation | `role="navigation"` + `aria-label="Pagination"`, current `aria-current` | `accessibilityRole="tablist"`-style selected | M3 · Lists → Pagination | GAP |
| 9 | `preview-card` | Hover/focus preview surface | `role="group"`/`dialog` — no M3-canonical name exists | **deliberate web-only asymmetry** — hover/focus preview has no touch analogue, same class as `kbd` | *none — K10 (kern extension, `ext:` band)* | n/a — ruled |
| 10 | `scroll-area` | Custom scroll container | `role="group"` + scrollbar parts | **shipped, P2b-3 tranche 5** — labelled viewport + `role="group"` on the scrolling host | M3 · Lists | `overlay-surfaces.rntest.tsx` |
| 11 | `scroll-area-scrollbar` | The scrollbar itself | `role="scrollbar"` + `aria-valuenow` | platform scroll indicator | M3 · Lists | GAP |
| 12 | `slider-thumb` | The draggable handle | `role="slider"` + `aria-valuenow/min/max` | `accessibilityRole="adjustable"` + `accessibilityValue` | M3 · Sliders | `slider.test.tsx` |
| 13 | `table` parts (`head`/`body`/`cell`/`caption`) | Tabular data | `role="table"/"row"/"cell"/"columnheader"` | `role` equivalents via `accessibilityRole` | M3 · Data tables | GAP |
| 14 | `tabs-tab` | One tab | `role="tab"` + `aria-selected`, arrow-key roving focus | `accessibilityRole="tab"` + `accessibilityState.selected` | M3 · Tabs | `tabs.test.tsx` |
| 15 | `toolbar-button` | A toolbar action | `aria-pressed`/`aria-current`, arrow-key traversal | `accessibilityRole="button"` + `accessibilityState` | M3 · Toolbar | GAP |
| 16 | `avatar-fallback` | Initials shown when no image | text alternative, `role="img"` on parent | `Text` fallback | M3 · Avatar | GAP |
| 17 | `avatar-image` | The avatar image | `alt` text / `role="img"` | `Image` + `accessibilityLabel` | M3 · Avatar | GAP |
| 18 | `boot-indicator` | Branded boot surface | `role="status"` + accessible label | `BootIndicator` exists natively as brand kit | Kern brand kit | GAP |
| 19 | `page-loader` | Full-page loading | `role="status"`/`progressbar` | `ActivityIndicator` | M3 · Progress | GAP |
| 20 | `fieldset` + form | Grouped form controls | `role="group"` + `<legend>` | `View` + `accessibilityRole="summary"`/label | M3 · Text fields | GAP |
| 21 | `form` | Form container | landmark + validation association | `accessibilityRole="summary"` | M3 · Text fields | GAP |
| 22 | `kbd` | Keyboard key glyph | `<kbd>`; **web-interaction concept** | **no mobile analogue** — deliberate asymmetry (see note) | none | n/a |
| 23 | `sonner` | Imperative transient messages | `role="status"`, `aria-live` | **deliberately no native counterpart** — D-026/S1.3 ruling: M3 = `Snackbar` | M3 · Snackbars | n/a |
| 25 | `icon-button` | Square icon-only action, 4 containers + toggle | `aria-pressed` on the toggle; name from one `label` prop | `Pressable` + `accessibilityRole="button"` + `accessibilityState.selected` | M3 · Buttons → Icon buttons | `m3-gaps.test.tsx` |
| 26 | `time-picker` | Hour / minute / period | three `role="listbox"`es, roving tabindex per field, 24-hour state | `accessibilityRole="adjustable"`-style pickers, or a platform time picker | M3 · Date & time → Time picker | `m3-gaps.test.tsx` |
| 30 | `carousel` | One item at a time with prev/next | `aria-roledescription="carousel"`/`"slide"`, `"n of m"` per slide | horizontal `ScrollView` + `accessibilityRole="adjustable"` paging | M3 · Carousel | `m3-gaps.test.tsx` |
| 31 | `loading-indicator` | Indeterminate activity feedback (**replaces** indeterminate circular progress, T4-M5) | `role="status"`, no `aria-valuenow`, reduced-motion aware | `ActivityIndicator` + `accessibilityLabel`; **no** indeterminate circular-progress component | M3 · Progress → Loading indicator | `m3-gaps.test.tsx` |
| 32 | `loading-region` | The region being loaded, with `aria-busy` | `aria-busy` on the region, `aria-live="polite"` | `accessibilityState.busy` on the container | M3 · Progress | `m3-gaps.test.tsx` |

Rows 22-24 are recorded so the set is complete and the **reasons are recorded**,
per the S2.3-style bar of "either renders or carries an explicit prose reason".

Rows 25-32 are the P2-1 gap fill: **web-only went 34 → 42**, registry 317 → 325.
They are web-first concepts, so the native column is a debt owed by P2b-3 rather
than a claim that the work is done. **The table above was renumbered in P2b-3
tranche 1**, when `autocomplete`, `input-otp` and `number-field` shipped on
native and the count fell 42 → 39, and again in **tranche 2**, when
`extended-fab`, `fab-menu` and `split-button` shipped and it fell 39 → 37.

---

## Native versions of the FAB / overflow-action family (P2b-3, tranche 2)

Three web-only rows shipped a native implementation: `extended-fab`, `fab-menu`,
`split-button`. All three cleared the same bar — on RN there is **no Base UI to
compose on**, so each one owns its behaviour outright rather than passing four
props through a primitive, which is exactly what the web versions do.

| Concept | Native | Behaviour owned natively | Verdict |
|---|---|---|---|
| `extended-fab` | `ExtendedFab` (`src/components/extended-fab.tsx`) | M3's collapse when the label no longer fits, plus **the accessible name surviving the collapse**. The trigger is an **imperative handle** (`NativeExtendedFabHandle`), not a gesture — scroll position is host state the component cannot see, and the web version reaches the same conclusion for the same reason. The handle is idempotent: two scrolls the same way report one collapse | shipped, **no contract row yet** (see below) |
| `fab-menu` | `FabMenu` (`src/components/fab-menu.tsx`) | The trigger's **own name**, defaulting to the first action's; `accessibilityState.expanded`; the optional `openIcon` swap; **select-then-dismiss**; and disabled actions that are both announced and unreachable | shipped, **no contract row yet** (see below) |
| `split-button` | `SplitButton` (`src/components/split-button.tsx`) | **Two named controls**, two tab stops; the **primary never opens the menu**; select-then-dismiss; the hairline divider that makes the two halves read as one pill; and `disabled` killing **both** halves together | shipped, **no contract row yet** (see below) |

### These three carry NO cross-renderer contract row yet, and that is a debt

Recorded here rather than glossed, because tranche 1 shipped `input-otp` and
`number-field` **with** contract rows and it would be easy to read this table as
saying the same happened here. It did not: `parity/contract.ts` has **no**
`extended-fab`, `fab-menu` or `split-button` row, and
`fab-family.rntest.tsx` imports nothing from `@kern-parity/contract`. What the
suite pins is each renderer's behaviour **on its own floor**.

The debt is real rather than cosmetic. A contract row is only sound once both
sides have been **measured**, and the web side of all three is unmeasured: no
probe was run against `packages/kern/src/components/{extended-fab,fab-menu,split-button}.tsx`.
Writing a row from reading the web source would make it a coin flip — the exact
failure `autocomplete`'s "no contract row" note exists to prevent, and the
fourth time it has come up.

The honest state of each, for whoever picks this up:

- **`extended-fab`** — the strongest candidate. Both sides use the same
  imperative-handle collapse for the same documented reason, so the row would be
  about collapse/expand, idempotence and **the name surviving collapse**. Still
  needs web measured first.
- **`fab-menu`** — the closest match, and the strongest row after `extended-fab`.
  Both sides default the trigger's name to `actions[0].label`
  (`fab-menu.tsx:89` web, `fab-menu.tsx:96` native) with `menuLabel` overriding,
  and both fall back to `"Actions"` on an empty list. Still needs web measured
  before pinning.
- **`split-button`** — two named controls agree on both sides. But web composes
  on the Base UI menu root and native uses a `Modal`, so traversal/Escape/
  typeahead/focus-return are the primitive's on web and absent natively. A row
  asserting menu behaviour would be red on day one; a row asserting only the two
  names and the primary-does-not-open separation would be sound.

So: **tranche 2 shipped the native components and their behaviour tests; the
contract rows are owed by P2b-4**, behind web-side measurement.

### Two things the behaviour test forced, rather than the plan

**An empty action list renders no surface.** The first `FabMenu` implementation
opened a modal unconditionally, so `actions={[]}` produced a trigger that looked
live and opened an empty box. The test caught it; the component now gates on
`visible={isOpen && actions.length > 0}`. The trigger itself stays rendered so a
host loading actions asynchronously does not shift the control.

**`getByRole("menu")` does not work on this floor, and that is not a defect.**
The menu assertions read the rendered a11y tree directly instead. This was
verified rather than assumed: the **already-shipped** `Menu` component returns
`null` from `getByRole("menu")` identically, so it is an RNTL limitation. A test
that cannot see the surface it asserts on is worse than no test, and quietly
replacing a working query with `getByLabelText` everywhere would have hidden the
limitation instead of documenting it.

### What the behaviour test cut

**`icon-button` — cut, and it stays cut.** It was the closest call in the tranche,
because `Fab` with `size="icon"` and `Toggle` between them already cover its
substance: a 56dp square pressable (`fab`) and a pressed/selected control
(`toggle`). What is left is *container variant* — `standard` / `filled` / `tonal` /
`outlined` — which is four token fills over the same two behaviours. That is the
CSS/shared-function/reject branch: a `NativeIconButton` whose only job is
choosing `surfaceContainerHighest` vs `secondaryContainer` would be a new public
name for an existing component, and the registry's concept rule would then have
to defend it.

**`tooltip` — RULED A GAP, and now BUILT.** It was cut from tranche 2 as an
open question ("looks like a deliberate asymmetry alongside `kbd` and
`preview-card`, but it is not in the asymmetry register") and referred to
`review-m3`. The ruling came back the other way:
`.team/reports/reviews/m3/2026-10-01-tooltip-ruling.md` — **BUILD ITEM, tooltip
is a GAP, not a registerable deliberate asymmetry.** M3 *has* a tooltip concept
and specifies it for the touch platform (its own availability is
Compose-first), so the asymmetry premise fails at the M3 source; and the record
already said so (D-026.1′: "Absent native tooltip is MISSING, not divergent").

So the native `Tooltip` shipped in this change. What diverges is the
**trigger**, and only that:

| | Web | Native | Why |
|---|---|---|---|
| Trigger | hover **or** focus | **focus only** | Touch has no hover. Focus genuinely exists on RN (keyboard, switch, TV, screen readers), so focus-only is M3-conformant as written rather than a substitute |
| Hint delivery | the surface is linked to the trigger | folded into `accessibilityHint` on the trigger | RN has no `aria-describedby` |
| Long-press / inline hint | n/a | **not implemented** | The touch affordance is `design-system-lead`'s open ruling (D-026.1′ / SPECS-6). Shipping a gesture before that ruling would make the behaviour a kern invention consumers must discover |

**The hint is on the a11y tree whether or not the surface is showing.** That is
what makes the component correct on touch rather than merely present: a surface
that existed only while focused would put the text behind an interaction a touch
user may never have, which is M3's NC-3 negative ("a tooltip must not hide
crucial information"). The visible surface is a visual convenience on top of the
hint, never its only delivery.

`tooltip` is **not** in `DELIBERATE` and must not appear in
`K-01-deviations.md`: M3 covers it and kern now ships it.

Mutation-proven: the three component behaviours were reverted in isolation and
the suite went red each time — see **Verification note** at the end of this
section.

### Verification note (P2b-3 tranche 2)

Gates, all run on this change-set:

| Gate | Result |
|---|---|
| `bun run check:parity` | passes — 330 rows (web 248, native 82); 53 shared / 22 native-only / **37 web-only**; 5 deliberate asymmetries intact *(historical snapshot, superseded 2026-10-02)* |
| `bun run typecheck` | passes — 5/5 packages exit 0 |
| `bun run test:all` | passes — 41 vitest + **129 jest** in 11 suites (64 at tranche 1) |
| `bun run check:kern` | passes — 45/45 M3 roles, 13 kern deviations, typescale/spacing/elevation/shape/motion intact |
| `bun run lint` | 0 errors. The 1 remaining warning (`menus.tsx:46` unused param, `check-kern.mjs:222`) is **pre-existing at `c05da56`**, confirmed against a clean worktree of HEAD |

Mutation proofs — each behaviour reverted on its own, suite re-run, then restored:

| # | Mutation | Result |
|---|---|---|
| 1 | `dialog.tsx`: `role="dialog"` → `role="none"` (the shipped bug) | `dialog.rntest.tsx` **3 failed**, 2 passed |
| 2 | `extended-fab.tsx`: `accessibilityLabel` dropped when collapsed | `fab-family.rntest.tsx` **2 failed**, 16 passed |
| 3 | `fab-menu.tsx`: `visible={isOpen && actions.length > 0}` → `visible={isOpen}` | `fab-family.rntest.tsx` **1 failed**, 17 passed |
| 4 | `split-button.tsx`: primary `onPress` also calls `setOpen` | `fab-family.rntest.tsx` **1 failed**, 17 passed |

All four restored; the tree re-verified at 129/129 green afterwards.

---

## Native Tooltip (P2b-3 tranche 4) + a count-integrity defect in the generator

Two changes landed together because the second is what made the first's numbers
believable.

### The generator was blind to three components, not one

`packages/mcp/scripts/generate-manifest.mjs` collected candidates only from
`export function X` and `export const X = {`. Three barrel-exported components
matched neither and got **no registry row at all**:

| Component | Shape | Registry row before |
|---|---|---|
| `ExtendedFab` (native) | `export const ExtendedFab = forwardRef<…>` | **missing** |
| `ErrorBoundary` (native) | `export class ErrorBoundary extends Component` | **missing** |
| `FieldRoot` (native) | `export { Root as FieldRoot }` | **missing** |

All three are real, exported from `packages/kern-native/src/index.ts`, and
consumable. `ExtendedFab` shipped in tranche 2 and `ErrorBoundary`/`FieldRoot`
earlier; none had a row.

**How it stayed invisible.** The generator is deterministic, so "re-run and the
file is byte-identical" passed — that proves the generator is *stable*, not that
it is *complete*. Every gate was green because every gate read the same
incomplete registry. The tranche-2 commit message asserted the row had moved; it
had not.

**Fixed** by matching all five shapes, plus a hard failure when a barrel export
produces no candidate. That assertion is the part that matters: both lists are in
hand at that point, so "this component does not exist" and "this component exists
and the generator cannot see it" are distinguishable — and a registry must never
conflate them. Removing the `forwardRef` scanner now fails the generator loudly:

```
generate-manifest FAILED — 1 barrel export(s) no scanner recognises:
  - native extended-fab.tsx: ExtendedFab
```

Seven SCREAMING_SNAKE barrel exports (`NAVIGATION_BAR_HEIGHT`,
`SECTION_DRAWER_WIDTH`, `PANE_WIDTHS`, …) are measurement constants, not
components, and are excluded by a name rule rather than by a list — the rule is
stated where it is applied.

### What the fix did to the counts

Both sets of figures below are history — they record the registry at the moment
that fix landed, not the counts now. The acronym-slug fix and the `SheetSurface`
split have both moved them since.

Before that fix the registry was 330 rows / 53 shared / 22 native-only /
37 web-only. After it, the counts were 334 / 55 / 23 / 35. Both sets are
history: the acronym-slug fix and the `SheetSurface` split have since moved the
live figures, which are the ones at the top of this document and in the
`gate:counts` line.

`extended-fab`, `error-boundary` and `field-root` are native rows that were
missing, so each adds a row; `extended-fab` is also a web concept, so it moves
one concept web-only → shared. `error-boundary` is native-only (it has no web
counterpart). Then `tooltip` itself landed natively and moved web-only → shared.

**Every count quoted from `check:parity` before this change understated the
shared side by three.** The 53/22/37 figures were not wrong arithmetic — they
were the registry faithfully reporting a registry that was missing rows.

### The native Tooltip

M3's plain Tooltip, `packages/kern-native/src/components/tooltip.tsx`. The
ruling and the declared trigger divergence are recorded above, under
**What the behaviour test cut**. Contract row `tooltip`, family `hint-surface`,
in `parity/contract.ts`, with **both** suites written: the web suite
(`web-parity-tranche4.test.tsx`) was written from a measurement of the shipped
web component, not from reading it, and that measurement is what constrained the
row — the popup carries **no `role`** and the trigger carries **no
`aria-describedby`**, so neither is asserted. Both are filed as web-side debt;
asserting the missing link would be a red suite on day one and asserting its
absence would bless the gap as the design.

---

## Three asymmetries that are RULINGS, not gaps

The founder's mandate is "every primitive = web + native". Three rows will not be
symmetrised, and P2b-2/3 must not "fix" them:

1. **`kbd`** — a keyboard-key glyph. Touch devices have no keys. Ruled: web-only
   interaction concept, documented as such (consistent with the existing parity
   doc's treatment of `tooltip`).
2. **`sonner` + `create-sonner-manager`** — ruled in D-026/S1.3: M3 expresses
   transient messaging as **`Snackbar`**, which **ships on both sides** (`Snackbar`
   is in the 45 shared). Web `Sonner` is `Snackbar`'s *imperative API* over the
   same toast manager (`packages/kern/src/components/snackbar.tsx:137` exports
   `createSnackbarManager`). Shipping it natively under a second name would break
   the naming law and duplicate one surface. **The parity row is
   `sonner → Snackbar (native)`, marked deliberate.**
3. **`native-select`** — the RN form is the platform's `Picker`, not a Kern
   component. The contract is the *behaviour* (single-choice, opens a modal
   chooser, reports the selection), not a shared component name.

4. **`preview-card`** — **RULED, K10** (`review-m3`,
   `.team/reports/reviews/m3/2026-10-01-preview-card-ruling.md`, registered in
   `.team/programs/K-01-deviations.md`). M3's component taxonomy contains no
   preview-card, so no canonical name exists; the strict reading of the naming law
   would fail. `review-m3` ruled **INVENTION → DEVIATION, taken and accepted**:
   `preview-card` is a deliberate kern addition in the `ext:` extension band.
   Link preview is a real web affordance M3 does not cover, and it is token-clean.
   As a **web-only asymmetry** — hover/focus preview has no touch analogue, the
   same asymmetry class as `kbd`. The allow-list entry is scoped to the `ext:` band
   via T4-V2 rather than the naming law being silently broken.

---

## What the manifest deliberately does NOT settle

- **Whether the presentational native-only rows (the four marked *presentational*
  above — `shape`, `shape-art`, `aspect-ratio`, `bottom-sheet-surface`) deserve a
  web component at all.** A contract row is not a mandate to build an empty
  wrapper.
- **`preview-card`'s M3 source** — resolved by **K10**; see the asymmetry list above.
- **Variant/emphasis axes.** Recorded per component in
  `docs/platform-parity.md`; `variants` keeps its frozen per-component meaning
  (S1.2/S1.3) and is not restated here. Re-stating it would create a second
  source of truth that drifts.
- **`@xoroh/kern-tokens` peer range** — D-026.1b, separate task.

---

## Verification for this draft

- **Registry source:** all rows read from the generated
  `packages/mcp/src/manifest.ts` (`bun run generate:components` output, idempotent —
  re-run leaves it byte-identical).
- **Counts:** web 248 rows; native 86 rows; **55 shared; 23 native-only; 35 *(historical snapshot, superseded 2026-10-02 — now 379 rows / 68 shared / 20 native-only / 43 web-only)*; 35
  web-only**. Reproducible by the script noted below. The three navigation-family
  rows moved native-only → shared in P2b-2 (45/25 → 48/22), P2b-3 tranche 1
  moved `autocomplete`, `input-otp` and `number-field` web-only → shared
  (48/42 → 51/39), tranche 2 moved `extended-fab`, `fab-menu` and
  `split-button` (51/39 → 53/37), and tranche 4 corrected the registry itself
  (three components had no row at all) before moving `tooltip` (53/37 → 55/35).
- **ADR 002 boundary:** re-verified **0** imports of `@base-ui/react` across
  `packages/kern-native`, `packages/kern-tokens`, `packages/kern-icons`; and
  **0** imports of `@xoroh/kern-native` in `packages/kern/src`. This manifest is a
  markdown file in `docs/`, importing nothing.
- **No `kern/` file was written by this task.** P2b-1 is a draft for `review-m3`.

---

## Improvements

1. **"12 native-only" and "23 web-only" were file names wearing component
   clothing.** The ladder's 12 are source *files*; they hold **25 concepts**. Any
   estimate or gate phrased in file names will under-count work by more than half
   and will silently merge distinct components (`sheets.tsx` alone is 5 components
   — `BottomSheet`, `SnapSheet`, `DockSheet`, `EntitySheet`,
   `BottomSheetPicker`). **Recommend the ladder state counts in concepts, and
   name the measuring script** — otherwise the next person re-derives it, gets a
   different number, and nobody notices the discrepancy because both numbers look
   plausible.

2. **Two of my own measurement passes were wrong before the third was right, and
   the first would have dispatched phantom work.** Stripping `-button` blind made
   `segmented-button` look web-only — a component that ships on *both* sides —
   which would have sent P2b-3 to build something that already exists. The subtle
   trap is that **both wrong answers were self-consistent and plausible**: 38 then
   34 web-only rows, no error message, no red flag. Only cross-checking a single
   known-symmetric component (`segmented-button`, which I had already read in S1)
   caught it. **Recommend: whenever a derived set decides what gets built, spot-check
   2-3 known-correct members before dispatching.** Machine-derived lists are not
   self-validating; a plausible wrong list is the dangerous kind of wrong.

3. **The registry could have been the gate and wasn't.** `manifest.ts` already
   carries `platform` per row — a parity gate is ~20 lines over that file, and it
   would make this manifest's counts impossible to falsify by hand. P2b-4 should
   generate the gate from the registry, **not** from a curated table in this doc,
   or the two will diverge on the first component either gets built.

4. **A contract that records an asymmetry is more useful than one that hides it.**
   `kbd`, `sonner` and `native-select` will never symmetrise, and rows 26-28 exist
   precisely so a future reader does not re-litigate them as bugs. **Recommend every
   future parity gate distinguish "missing" from "deliberate asymmetry"**, with the
   ruling cited — otherwise the gate fires forever on three components that are
   correct, and a permanently-red gate is a gate people stop reading.

5. **D-028's "complete M3" cannot be counted until this manifest settles what a
   component *is*.** Two counting rules disagreed in one task (files vs concepts vs
   parts-collapsed). Under a broad mandate that is fatal: nobody can say when it is
   done if they disagree on what is being counted. **Recommend the concept rule be
   ratified into `docs/conventions/parity.md` before P2b-2/3 dispatch**, so the two
   build tasks and the gate all measure the same thing. This is the same
   "countable definition of done" gap I raised on D-028, now concrete: it is not
   hypothetical, it already produced three numbers for one set.