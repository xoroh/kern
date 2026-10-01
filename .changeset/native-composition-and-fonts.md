---
"@xoroh/kern-native": minor
---

Native composition layer (roadmap rows 6 + 8), plus native counterparts of the
K-02 web-extras set.

Composition (per `docs/plan/native-composition.md`):

- Shell: `NavigationBar` (+ `NavigationBarItem`), `NavigationDrawer` (M3
  modal variant, 360dp), `TopAppBar` (small/center/medium) + `TopAppBarAction`,
  `BootSplash`, `ErrorBoundary` (router seam).
- Sheets: `BottomSheet`, `SnapSheet`, `DockSheet`, `BottomSheetPicker`,
  `EntitySheet` — RN `Modal` based, so the package keeps its "no styling
  dependencies" contract. The gorhom/reanimated engine stays the `kern-expo`
  split this plan defers, and can slot in behind these APIs without a
  breaking change.
- Menus: `MenuScreen`, `MenuSheet`, `MenuGroupList`, `AppsSheet`,
  `CreateSheet`.
- Layouts and panes: `FilterChipRow`, `SecondaryTabs`, `Pane`, `ListDetail`,
  `SupportingPane` — the phone-width mirrors of the web `/kern/start` layouts.

Fonts: `kernFontFaces`, `useKernFonts`, `KernFontGate`. The host loads Inter
(via `expo-font` or any loader); components only set weights, so `kern-native`
gains no Expo peer dependency.

Web-parity counterparts: `Command`, `SegmentedButton`, `CountrySelect`,
`Banner`. `Sonner` deliberately has no native counterpart — M3 expresses
transient messaging as a `Snackbar`, which already ships; a second name for
one surface would break the naming law.

Breaking: none. All additions; `variants` meanings stay frozen per
`docs/platform-parity.md`.

Also fixes `test:jest`, which could not run at all: react-native >= 0.86 no
longer bundles a `jest-preset.js`, so the preset is now an explicit
devDependency (`@react-native/jest-preset`) with the react-native path pinned
per package.