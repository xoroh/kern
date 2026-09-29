# Plan — Native composition (Expo layer)

Status: planned (not started) · recorded 2026-09-29 · revise this file before executing

Everything between `kern-native` primitives and an Expo app: sheets, shell
(navigation bar/drawer, boot splash), menu screen system, layouts, panes,
paper bridge, haptics, fonts. Naming law: unprefixed, M3-canonical —
`NavigationBar`, `NavigationDrawer` are the M3 names.

## Why

`kern-native` today = primitives + feedback kit. Mobile apps need gorhom
sheets, `NavigationBar`, `NavigationDrawer`, `BootSplash`, the menu screen
system and pane layouts. Same composition model as [kern-start](kern-start.md):
components → blocks → scaffolds, tiers never point upward. This is the RN
**renderer family's** implementation of the same system language
(`kern-theme` is shared, written once).

## Decisions (locked 2026-09-29)

| Decision | Outcome |
| --- | --- |
| Placement | composition stays in `kern-native` until Expo-only deps force a split → then `@xoroh/kern-expo` (gorhom/reanimated/expo-* peers live there) — one ADR decides |
| Sheet engine | `@gorhom/bottom-sheet` re-exported through Kern wrappers: `BottomSheet`, `SnapSheet`, `DockSheet`, `BottomSheetPicker`, `EntitySheet` |
| expo-router coupling | seam like LinkProvider: `useNav()` injection; `RootIndex`/auth-redirect/screen-options stay **app-side** |
| Haptics | `expo-haptics` used directly in pressables — presentation, not domain |
| Brand-kit | `MilestoneTrio`, `SuccessTransform`, `ShapeArt` — done with [feedback](feedback.md) |
| Paper bridge | `paperTheme()` factory (interop, not a design surface) |

## Steps

1. Split checklist first: if gorhom/reanimated/expo-blur peers bloat
   `kern-native`, create `kern-expo` here; else keep flat. Decide in one ADR.
2. Sheets: gorhom wrappers + picker + entity sheet + snap + dock.
3. Shell: `NavigationBar` (M3), `NavigationDrawer` (M3), `BootSplash` (declare
   `expo-splash-screen` + `expo-status-bar` as **real** peers), `AppsSheet`/
   `CreateSheet` (slot-driven like web menus), `ListSidebar`, `ErrorBoundary`
   (router seam).
4. `menu/` screen system (7 files) + `layouts/` (top app bars ×3,
   `FilterChipRow`, `SecondaryTabs`) + `panes/` mirror.
5. `paperTheme`, `useThemedStyles`, drawer actions, feed row utils.
6. <a id="8-fonts"></a>**Fonts:** Inter via `expo-font` in the showcase app;
   document "host loads fonts, components only set weights".
7. Tests: RNTL render tests per composed block; `expo export` smoke in CI.

## Acceptance

- `apps/mobile` showcase mounts a `NavigationDrawer` + sheet flow with theme
  switcher.
- An app shell compiles against `kern-native` changing only seam props.
- All expo-* deps declared (no transitive `expo-splash-screen` leaks).
