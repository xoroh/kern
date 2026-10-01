# Plan — Native composition (Expo layer)

Status: done (2026-10-01) · recorded 2026-09-29 · shipped composition lives in
`packages/kern-native/src/components/{sheets,menus,layouts,shell,navigation-bar,navigation-drawer,top-app-bar}.tsx`; log below

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
| Placement | composition stays **flat in `kern-native`** — as shipped. No Expo-only peer was needed, so no `kern-expo` split happened; the question stays open only if gesture handling proves inadequate |
| Sheet engine | `@gorhom/bottom-sheet` was **not adopted**. `BottomSheet`, `SnapSheet`, `DockSheet`, `BottomSheetPicker`, `EntitySheet` are built on RN primitives, keeping `kern-native` at zero third-party runtime deps |
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
6. <a id="8-fonts"></a>**Fonts:** shipped as `kernFontFaces` +
   `useKernFonts(loader)` in `packages/kern-native/src/fonts.tsx`. The host
   injects any `loadAsync`-shaped loader (`expo-font`'s `Font.loadAsync`
   qualifies); `kern-native` takes no `expo-font` peer and components only
   set weights.
7. Tests: RNTL render tests per composed block; `expo export` smoke in CI.

## Acceptance

- `apps/mobile` showcase mounts a `NavigationDrawer` + sheet flow with theme
  switcher.
- An app shell compiles against `kern-native` changing only seam props.
- All expo-* deps declared (no transitive `expo-splash-screen` leaks).

## Log — shipped 2026-10-01

Everything in Steps 2-6 landed in `packages/kern-native/src/components/`:

| Step | Where |
| --- | --- |
| Sheets | `sheets.tsx` — `SheetHandle`, `BottomSheet`, `SnapSheet`, `DockSheet`, `BottomSheetPicker`, `EntitySheet` |
| Shell | `navigation-bar.tsx` (`NavigationBar`, `NavigationBarItem`), `navigation-drawer.tsx` (`NavigationDrawer`), `shell.tsx` (`BootSplash`), `top-app-bar.tsx` (`TopAppBar`, `TopAppBarAction`), `menus.tsx` (`MenuScreen`, `MenuSheet`, `AppsSheet`, `CreateSheet`, `MenuGroupList`) |
| Layouts + panes | `layouts.tsx` — `Pane`, `ListDetail`, `SupportingPane`, `FilterChipRow`, `SecondaryTabs` |
| Fonts | `packages/kern-native/src/fonts.tsx` — `kernFontFaces`, `useKernFonts`, `KernFontGate` |

Deviations from the plan above, both deliberate:

- **No `@gorhom/bottom-sheet`.** The sheets are hand-rolled on RN primitives.
  The package imports only `react`, `react-native`, and
  `@xoroh/kern-theme`, so no Expo-only peer entered the dependency surface.
  `NavigationDrawer` composes from `NavigationBar` rather than a separate
  gesture system.
- **No `paperTheme()` bridge** — nothing in the tree depends on React Native
  Paper, so there is nothing to bridge. Do not add one speculatively.

Router coupling stayed a seam: `NavigationDrawer` takes its destinations as
props and takes no router dependency.

Still open: render tests per composed block (roadmap row 10).
