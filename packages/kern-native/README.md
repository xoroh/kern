# `@xoroh/kern-native`

Status: current

The React Native renderer for Kern. The same components, the same accessible
names and the same behaviour as the web renderer — implemented against React
Native rather than Base UI, and held to a registry-backed parity contract so the
two cannot drift apart quietly.

## Install

```bash
bun add @xoroh/kern-native
```

Requires `react-native` and `react` as peers, and pulls in
`@xoroh/kern-primitives` and `@xoroh/kern-tokens`.

## What is in it

**104 components** (per the parity registry) across the families the parity
contract tracks: buttons, checkboxes and switches, selection, dialogs, sheets,
menus, tabs, lists, tables, carousels, navigation (including `NavigationRail`),
feedback (snackbar, tooltip, loading), and the overlay surfaces (drawer, popover,
scroll-area).

Two things are native-specific and are documented as such rather than emulated:

- **`KernPressable`** — a narrow accessibility-defaults wrap, not a new primitive
  family. It owns the 48dp minimum touch target, `role="button"` as a *default*,
  and always reports `disabled`. Everything else passes through untouched.
- **`OverlayModalityProvider`** — shares one overlay stack so only the topmost
  overlay is interactive. Optional; without it every overlay is interactive,
  which is correct for exactly one.

## The boundary

This package may not import `@xoroh/kern` (the web renderer). Renderers never
depend on each other — the parity contract exists to make that possible, and a
native import of a web component would collapse it.

`check:layers` enforces the graph. `check:parity` additionally verifies that every
component in the registry is publicly reachable from the built `dist/index.d.ts`,
so a component that exists but cannot be imported fails the gate.

## Accessibility is not optional

Every parity row carries the obligations both renderers must satisfy, and the
shared suites assert **role, accessible name and state** — never DOM structure or
Base UI internals — so a future primitive ruling cannot invalidate them.

Where the platforms genuinely differ, the substitution is recorded rather than
hidden. Examples in the tree:

- React Native's platform-trait union has no `dialog` member, so a dialog
  container carries `role="dialog"` (the ARIA-aligned union) alongside
  `accessibilityRole="alert"`, the closest real trait VoiceOver and TalkBack have.
- There is no anchor in React Native, so a link is a tappable `Pressable` that
  opens a URL. Documented as a platform asymmetry, not a missing component.

## Usage

```tsx
import { Button, KernPressable } from "@xoroh/kern-native";

export function SaveBar() {
  return (
    <KernPressable accessibilityLabel="Save" onPress={save}>
      <Button>Save</Button>
    </KernPressable>
  );
}
```

## Licence

MIT — see [LICENSE](./LICENSE).
