# Mobile foundation

What native is built on: self-owned components on plain React Native plus
Kern tokens. `@xoroh/kern-native` imports **only** `react`, `react-native`,
and `@xoroh/kern-theme` — no third-party component library, no styling
library. Behavior and accessibility are ours; everything visible is Kern code.

That is a deliberate choice over pulling in `@rn-primitives/*` or React Native
Paper. It costs us the upstream maintenance burden and buys an unbreakable
dependency surface: nothing we ship can break under us.

## What that means in practice

- Dialogs are RN `Modal`. Sheets, selects, and popovers compose RN
  primitives directly.
- Styling is `StyleSheet.create` plus values resolved from the scheme via
  `useKernScheme()`. No NativeWind, no Tamagui, no Paper theme.
- Every color, radius, and elevation comes from `@xoroh/kern-theme`, the same
  tables the web renderer uses.

## Font loading is the host's job

Kern does not take an `expo-font` peer. `packages/kern-native/src/fonts.tsx`
exports `kernFontFaces` and `useKernFonts(loader)`, where `loader` is any
`loadAsync`-shaped function — `Font.loadAsync` satisfies it. The host loads
Inter however it likes; Kern components only ever set a weight.

## Composition lives in the same package

`@xoroh/kern-native` now also ships its composition tier: `NavigationBar`,
`NavigationDrawer`, `TopAppBar`, `BootSplash`, the sheet family
(`BottomSheet`, `SnapSheet`, `DockSheet`, `EntitySheet`,
`BottomSheetPicker`), menus (`MenuScreen`, `MenuSheet`, `AppsSheet`,
`CreateSheet`, `MenuGroupList`), and layouts (`Pane`, `ListDetail`,
`SupportingPane`, `FilterChipRow`, `SecondaryTabs`). On web the same tier is
`@xoroh/kern-start`, a separate package. The tier model and the names match;
only the package boundary differs.

The sheets are built on RN primitives, not on `@gorhom/bottom-sheet` — the
package still imports only `react`, `react-native`, and
`@xoroh/kern-theme`. If gesture handling forces the Expo-only peer set, the
plan is an `@xoroh/kern-expo` split, decided in one ADR per
`docs/plan/native-composition.md`.

## Re-evaluation triggers

Native composition is the open question, not the primitive layer. If
sheet/drawer work needs an Expo-only peer set (`@gorhom/bottom-sheet`,
`reanimated`, `expo-blur`) that bloats `kern-native`, the plan is to split an
`@xoroh/kern-expo` package — decided in one ADR, per
`docs/plan/native-composition.md` § Decisions.

If a primitive layer is ever needed rather than composition, revisit
`roninoss/rn-primitives` (MIT, actively maintained, a hard dependency of
React Native Reusables). Do not adopt it for single components: each one is
itself a dependency we would own.