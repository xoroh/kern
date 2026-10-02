---
"@xoroh/kern-native": minor
"@xoroh/kern": patch
---

P2b-3 tranche 5 — native `Drawer`, `Popover` and `ScrollArea`.

Three web-only rows shipped a native implementation. Chosen as one family because
they share a parity risk rather than a look: each is a surface over content, each
is easy to implement with a plausible role and be subtly wrong, and the
difference between a modal and a non-modal surface is invisible until a screen
reader walks into it.

- **`Drawer`** — M3's MODAL drawer variant. Carries `role="dialog"` and
  `accessibilityViewIsModal`, so content behind it is announced inert. The scrim
  is a real labelled dismiss control, not a tappable void, and a press inside
  the drawer does not dismiss it.
- **`Popover`** — deliberately NOT modal; the content behind stays interactive.
- **`ScrollArea`** — labelled viewport plus an explicit `role="group"` on the
  scrolling host.

**Tests written before the implementation** (`overlay-surfaces.rntest.tsx`, 13
tests), per the P2b-4 discipline — a test written afterwards and then passed
proves nothing about whether the contract was honoured. Three contract rows went
into `parity/contract.ts` **before** the components existed, so the declaration is
the specification rather than a description.

**The trigger is deliberately not cross-renderer.** M3's popover trigger is
click-or-hover and touch has neither; the contract pins what both sides share
(the surface is a labelled, expandable, dismissible dialog) and the trigger is
asserted natively as kern's own decision — the same treatment `Tooltip`
(tranche 4) received.

**Mutation-proven, three ways.** Each mutation fails the specific test that
targets it, then the file is restored and re-verified green:

| Mutation | Caught by |
| --- | --- |
| Popover claims `accessibilityViewIsModal` | `is a dialog but NOT modal when open` (expected false, got true) |
| Drawer loses `accessibilityViewIsModal` | `carries role=dialog and modality when open` (expected true, got undefined) |
| Popover trigger loses `expanded` + `onPress` | 2 tests, incl. `opens from the trigger` |

**Two findings worth recording, both caught by the suite rather than by review:**

1. RN 0.86's platform-trait `AccessibilityRole` union has **no `dialog` member**,
   so the dialog role must ride the ARIA-aligned `role` prop — the reason
   `dialog.tsx:83-90` already documents. The suite walks the rendered a11y tree
   rather than using `getByRole`, which cannot see `role`; this follows the
   established `dialog.rntest.tsx` pattern instead of rediscovering it.
2. The same applies to scrollability: `ScrollViewProps` extends `ViewProps`, whose
   union has no scrollable member, so `role="group"` is the correct signal.

Verified on this tree: `typecheck` PASS (all 5 packages) · `check:kern` PASS ·
`check:parity` PASS (counts unchanged — no manifest regen, per the shared-tree
boundary) · `bun run --filter @xoroh/kern test` PASS (web + cross-renderer
parity) · `test:jest` PASS · native vitest PASS · biome clean on all three files
(this tranche).

**Cut deliberately** (not gaps, not silently skipped):

- **`combobox`** — deferred. Web's shape is `autocomplete` + a clear affordance,
  and the clear affordance is a sub-part, so a native `Combobox` would be a
  kern invention rather than a parity obligation. Ruling needed before it is
  built.
- **`scroll-area-scrollbar`** — cut as its own component. RN's `ScrollView`
  provides platform scrolling; a Kern wrapper would assert something the platform
  owns and cannot be honoured honestly on both OSes.
- **`native-select`** — already ruled: the RN form is the platform `Picker`, not
  a Kern component.
- **`preview-card`, `kbd`, `sonner`** — ruled deliberate asymmetries, untouched.

Three pre-existing lint errors remain (`jest.config.cjs:34`, `check-kern.mjs:230`,
`fab-menu.tsx:83`) in files this tranche does not touch. Not fixed here.
