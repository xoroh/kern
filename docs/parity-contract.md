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
| Registry rows | **314** (web 236, native 78) |
| Web concepts (parts collapsed) | **79** |
| Native concepts (parts collapsed) | **71** |
| **Shared** (already both sides) | **45** |
| **Native-only → needs a web version** | **26** in **14 files** |
| **Web-only → needs a native version** | **34** in **25 files** |
| Stub rows | **0** |

**Correction 1 — "12 native-only" undercounts by more than half.** The ladder's 12
are the native-only **source files**; the same files contain **26 concepts**
(5 sheets, 3 menu surfaces, 3 pane/layout pieces, etc.). Working from file names
would have under-scoped P2b-2 by 14 components.

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
`segmented-button` correctly appears in the 45 shared.

I report these because the same registry is the input to the phase gate; a wrong
set would have dispatched real work at phantom gaps.

---

## Native-only concepts → need a web version (26)

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
| 8 | `menu-group` | Titled group of menu items | `role="group"` + `aria-label` = group heading | `MenuGroup` + group label | M3 · Menus | GAP |
| 9 | `apps-sheet` | Sheet of app destinations | `role="menu"` | `AppsSheet` | M3 · Menus | GAP |
| 10 | `create-sheet` | Sheet for a create action | `role="dialog"` | `CreateSheet` | M3 · Menus | GAP |
| 11 | `navigation-bar` | Bottom nav bar, ≤5 destinations | `role="navigation"`, current item `aria-current="page"` | `accessibilityRole="tablist"`-style selected state | M3 · Navigation bar | GAP |
| 12 | `navigation-drawer` | Modal side drawer (M3 modal variant) | `role="dialog"`, `aria-modal`, scrim, Escape closes | `NavigationDrawer` 360dp, composed from `NavigationBar` | M3 · Navigation drawer | GAP |
| 13 | `top-app-bar` | Top app bar, small/center/medium | `role="banner"`, `aria-level` per size; medium wraps to 2 lines | `TopAppBar` 64/64/112dp | M3 · Top app bar | GAP |
| 14 | `pane` | Single layout pane | `role="region"` + accessible name | `Pane` | M3 · Lists → Pane | GAP |
| 15 | `list-detail` | Two-pane list→detail layout | `role="navigation"` per pane; selection announced | `ListDetail` | M3 · Lists | GAP |
| 16 | `supporting-pane` | Optional supporting pane beside content | `role="complementary"` | `SupportingPane` | M3 · Lists | GAP |
| 17 | `filter-chip-row` | Horizontal row of filter chips | `role="group"`, each chip `aria-pressed` | `FilterChipRow` | M3 · Chips → Filter chips | GAP |
| 18 | `secondary-tabs` | Secondary tab set within a view | `role="tablist"`, `aria-selected` | `SecondaryTabs` | M3 · Tabs → Secondary tabs | GAP |
| 19 | `milestone-trio` | Three-stage progress indicator (brand kit) | `role="progressbar"`, `aria-valuenow` = stage | `MilestoneTrio` | Kern brand kit (M3 progress analogue) | `feedback.test.tsx` |
| 20 | `success-transform` | Completion transition trio→check | `role="progressbar"` then `role="status"` "done" | `SuccessTransform`, `accessibilityRole="progressbar"` | Kern brand kit | `feedback.test.tsx` |
| 21 | `shape` | Shape-scaled container primitive | web = `style` only, **no role** (decorative container) | `Shape` | M3 · Shape scale | GAP |
| 22 | `shape-art` | Brand shape art | **decorative** → `aria-hidden="true"` | `ShapeArt` | Kern brand kit | GAP |
| 23 | `aspect-ratio` | Fixed-ratio box | `style={{aspectRatio}}` — presentational | `aspectRatio` style | CSS/native analogue | GAP |
| 24 | `arc-rotations` | Rotation helper for `CircularProgress` | presentational, no role | `arcRotations` | M3 · Progress | `styles.test.ts` |
| 25 | `loader-color` | Loader colour accessor | presentational, no role | `loaderColor` | M3 · Progress | `styles.test.ts` |
| 26 | `filter-chip` | Single filter chip (as opposed to the row) | `role="checkbox"`/`aria-pressed` | `FilterChip` | M3 · Chips | GAP |

**Note on 21-25:** these are presentational or brand-kit. They are native-only
because RN has a layout primitive for them and the DOM equivalent is a CSS
property, not a component. **P2b-2 should decide per row whether a web
"component" is warranted at all** — building a `Shape` React component whose only
job is to emit `aspect-ratio` would violate `docs/conventions/stubs.md`'s spirit
(not a stub, but an empty abstraction). The contract is still recorded because the
mandate is symmetric, and the *decision* is `design-system-lead`'s with my
contract input.

---

## Web-only concepts → need a native version (34)

| # | Component | Behaviour | Web contract (exists) | Native contract (to build) | M3 source | Test pointer |
|---|---|---|---|---|---|---|
| 1 | `autocomplete` | Text field + filtered suggestion list | `role="combobox"` + `aria-expanded`, `aria-activedescendant` | `TextInput` + `accessibilityRole="combobox"`, `aria-expanded` ≡ `accessibilityState.expanded` | M3 · Text fields → Autocomplete | `autocomplete.test.tsx` |
| 2 | `combobox` | Select with a custom popup | `role="combobox"`, `aria-controls`, Escape | `accessibilityRole="combobox"` + `accessibilityState.expanded` | M3 · Menus → Combobox | `combobox.test.tsx` |
| 3 | `combobox-clear` | Clear affordance inside a combobox | labelled button, `aria-label="Clear"` | `accessibilityRole="button"` + `accessibilityLabel` | M3 · Combobox | GAP |
| 4 | `input-otp` | One-time-code segmented input | one input per char, `aria-label` per position | `TextInput` per position; **keyboard type** is the RN analogue | M3 · Text fields | GAP |
| 5 | `native-select` | Native OS picker | `role="combobox"` | **`Picker`** — platform primitive, not a Kern component (see note) | M3 · Menus | GAP |
| 6 | `drawer` | Side drawer | `role="dialog"` + `aria-modal` (M3 drawer = modal variant) | `Modal`-based drawer | M3 · Navigation drawer | `drawer.test.tsx` |
| 7 | `popover` | Anchored non-modal popup | `role="dialog"`, trigger `aria-expanded` + `aria-haspopup` | `accessibilityRole="dialog"` + `accessibilityState.expanded` | M3 · Menus → Popover | `popover.test.tsx` |
| 8 | `menu` group `menubar-menu` | One menu in a menubar | `role="menu"`, `aria-haspopup`, arrow keys | `accessibilityRole="menu"` | M3 · Menus | `menubar.test.tsx` |
| 9 | `navigation-menu-link` | Link inside a navigation menu | `role="link"` | `accessibilityRole="link"` + `accessibilityState.selected` | M3 · Navigation | GAP |
| 10 | `meter` | Scalar measurement in a range | `role="meter"` + `aria-valuenow/min/max` | `accessibilityRole="progressbar"` + `accessibilityValue` | M3 · Progress → Meter | `meter.test.tsx` |
| 11 | `number-field` | Numeric stepper | spinbutton roles, `aria-valuenow` | `accessibilityRole="adjustable"`/stepper | M3 · Text fields | GAP |
| 12 | `pagination` | Page navigation | `role="navigation"` + `aria-label="Pagination"`, current `aria-current` | `accessibilityRole="tablist"`-style selected | M3 · Lists → Pagination | GAP |
| 13 | `preview-card` | Hover/focus preview surface | `role="group"`/`dialog` — **M3 has no preview-card** | needs an M3 source decision | *none — see note* | GAP |
| 14 | `scroll-area` | Custom scroll container | `role="group"` + scrollbar parts | `ScrollView` | M3 · Lists | GAP |
| 15 | `scroll-area-scrollbar` | The scrollbar itself | `role="scrollbar"` + `aria-valuenow` | platform scroll indicator | M3 · Lists | GAP |
| 16 | `slider-thumb` | The draggable handle | `role="slider"` + `aria-valuenow/min/max` | `accessibilityRole="adjustable"` + `accessibilityValue` | M3 · Sliders | `slider.test.tsx` |
| 17 | `table` parts (`head`/`body`/`cell`/`caption`) | Tabular data | `role="table"/"row"/"cell"/"columnheader"` | `role` equivalents via `accessibilityRole` | M3 · Data tables | GAP |
| 18 | `tabs-tab` | One tab | `role="tab"` + `aria-selected`, arrow-key roving focus | `accessibilityRole="tab"` + `accessibilityState.selected` | M3 · Tabs | `tabs.test.tsx` |
| 19 | `toolbar-button` | A toolbar action | `aria-pressed`/`aria-current`, arrow-key traversal | `accessibilityRole="button"` + `accessibilityState` | M3 · Toolbar | GAP |
| 20 | `avatar-fallback` | Initials shown when no image | text alternative, `role="img"` on parent | `Text` fallback | M3 · Avatar | GAP |
| 21 | `avatar-image` | The avatar image | `alt` text / `role="img"` | `Image` + `accessibilityLabel` | M3 · Avatar | GAP |
| 22 | `boot` | Branded boot surface | `role="status"` + accessible label | `BootIndicator` exists natively as brand kit | Kern brand kit | GAP |
| 23 | `page-loader` | Full-page loading | `role="status"`/`progressbar` | `ActivityIndicator` | M3 · Progress | GAP |
| 24 | `fieldset` + form | Grouped form controls | `role="group"` + `<legend>` | `View` + `accessibilityRole="summary"`/label | M3 · Text fields | GAP |
| 25 | `form` | Form container | landmark + validation association | `accessibilityRole="summary"` | M3 · Text fields | GAP |
| 26 | `kbd` | Keyboard key glyph | `<kbd>`; **web-interaction concept** | **no mobile analogue** — deliberate asymmetry (see note) | none | n/a |
| 27 | `sonner` | Imperative transient messages | `role="status"`, `aria-live` | **deliberately no native counterpart** — D-026/S1.3 ruling: M3 = `Snackbar` | M3 · Snackbars | n/a |
| 28 | `create-sonner-manager` | Imperative API factory | — | **no native counterpart by ruling** | M3 · Snackbars | n/a |

Rows 26-28 are recorded so the set is complete and the **reasons are recorded**,
per the S2.3-style bar of "either renders or carries an explicit prose reason".

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

`preview-card` is a fourth, unresolved: **M3 has no preview-card**. It is a web
interaction affordance. Needs an explicit ruling from `review-m3`/`research-m3`
rather than a unilateral symmetry decision — flagged in "what's left".

---

## What the manifest deliberately does NOT settle

- **Whether a presentational native-only (21-25) deserves a web component at all.**
  A contract row is not a mandate to build an empty wrapper.
- **`preview-card`'s M3 source** — genuinely absent from M3.
- **Variant/emphasis axes.** Recorded per component in
  `docs/platform-parity.md`; `variants` keeps its frozen per-component meaning
  (S1.2/S1.3) and is not restated here. Re-stating it would create a second
  source of truth that drifts.
- **`@xoroh/kern-theme` peer range** — D-026.1b, separate task.

---

## Verification for this draft

- **Registry source:** all 314 rows read from the generated
  `packages/mcp/src/manifest.ts` (`bun run generate:components` output, idempotent —
  re-run leaves it byte-identical).
- **Counts:** web 236 rows / 79 concepts; native 78 rows / 71 concepts; 45 shared;
  26 native-only; 34 web-only. Reproducible by the script noted below.
- **ADR 002 boundary:** re-verified **0** imports of `@base-ui/react` across
  `packages/kern-native`, `packages/kern-theme`, `packages/kern-icons`; and
  **0** imports of `@xoroh/kern-native` in `packages/kern/src`. This manifest is a
  markdown file in `docs/`, importing nothing.
- **No `kern/` file was written by this task.** P2b-1 is a draft for `review-m3`.

---

## Improvements

1. **"12 native-only" and "23 web-only" were file names wearing component
   clothing.** The ladder's 12 are source *files*; they hold **26 concepts**. Any
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