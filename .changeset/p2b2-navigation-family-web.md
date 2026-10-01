---
"@xoroh/kern": minor
---

Web versions of the navigation family (ladder P2b-2, D11).

`navigation-bar`, `navigation-drawer` and `secondary-tabs` were native-only
concepts — components that existed in `@xoroh/kern-native` with no DOM
counterpart, so a web host had to re-implement destination selection, modal
dismissal and tab semantics by hand. D-026.3′ D11 ruled the web side REQUIRED:
the counterpart rule forces *existence*, not renames, so `Sidebar`,
`NavigationRail` and `SectionDrawer` in `@xoroh/kern/start` keep their kern
names and a real M3 `NavigationBar` is built beside them.

- **`NavigationBar`** + **`NavigationBarItem`** — the M3 bottom bar (80dp,
  `secondaryContainer` active pill) and the 56dp vertical row it reuses in every
  vertical container. One `NavigationDestination[]` — `key`, `label`, `icon`,
  `badge`, `disabled` — feeds the bar, the rail, and the drawer, so a host
  declares its destinations once. Selection is controlled (`value` +
  `onValueChange`) or uncontrolled (`defaultValue`). The bar is **one** tab
  stop: roving tabindex, Arrow/Home/End traversal that wraps and skips disabled
  destinations, focus following selection. Semantics are `role="navigation"`
  with `aria-current="page"` on the active destination, per the contract in
  `docs/parity-contract.md`.
- **`NavigationDrawer`** — the M3 **modal** drawer variant, composed on the
  Base UI dialog root so the focus trap, scrim, Escape, and focus-return-to-
  trigger are the primitive's rather than a re-implementation. It owns the
  drawer contract: a 360dp panel capped at 80vw so tablets and foldables keep
  the detail pane visible, a labelled `role="dialog"` + `aria-modal` surface, and
  **activating a destination reports the selection and then dismisses** — a
  modal drawer that stays open after the choice that opened it is a trap.
- **`SecondaryTabs`** — the M3 sub-section switcher, distinct from `Tabs` in
  weight and placement rather than behaviour. `role="tablist"` with
  `aria-selected`, roving tabindex, Arrow/Home/End with wrap, disabled tabs
  skipped and inert, and the panel bound to its tab through `useId` so two
  instances on a page cannot collide. Inactive panels are **unmounted**, not
  hidden: a hidden panel is still announced and reads as duplicate content. An
  empty tab set renders nothing rather than an empty `role="tablist"` for a
  screen reader to land in.

Two corrections against the contract as written, both found by the tests:

1. Base UI's `Dialog.Popup` traps focus and inerts the page but does **not**
   emit `aria-modal`. The behaviour was right and the attribute was missing;
   `NavigationDrawer` sets it explicitly.
2. The drawer renders `NavigationBarItem` rather than its own row component —
   the same decomposition native uses, so the two renderers agree on which
   element carries the active pill.

`check:parity` moves native-only 25 → 22 and shared 45 → 48 (registry 313 →
317 rows). 23 behaviour tests in
`packages/kern/src/components/navigation-family.test.tsx` cover selection in
both controlled and uncontrolled form, the one-tab-stop invariant, traversal
across disabled destinations, modal semantics, all three dismissal paths
(Escape, scrim, destination choice) with focus returning to the trigger, and
tab↔panel association. No new runtime dependency: `@base-ui/react` was already
a dependency of this package.
