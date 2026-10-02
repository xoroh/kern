import type { ComponentDoc } from "../types";

export const navigationRail: ComponentDoc = {
  slug: "navigation-rail",
  name: "Navigation rail",
  oneLiner:
    "The navigation rail is the persistent vertical navigation surface — icon-only by default, a labelled sidebar when expanded.",
  features:
    "Reach for a navigation rail when the app's top-level destinations should stay visible while the body changes: a workspace, a tool with a fixed set of sections. It is ONE component with two modes, because the Expressive mapping says a persistent sidebar IS the expanded presentation of a rail — two components differing only in width would be a split without a difference. The destinations are the same `NavigationDestination` data the `NavigationBar` takes, so one destination list drives both surfaces. Collapsing is a VISUAL decision only: the label stays the accessible name in both modes, so an icon-only rail is never an unnamed rail.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NavigationRail",
    variants: ["mode: collapsed · expanded"],
    elevation: "surface",
  },
  parts: ["NavigationRail"],
  customization: {
    supported: [
      "`destinations` is the shared navigation destination data — key, label, icon, badge and disabled — the same shape `NavigationBar` accepts.",
      "`mode` is `collapsed` (icon-only, fixed rail width) or `expanded` (labels painted, sidebar width). The width constants are exported.",
      "`header` is a slot above the destinations — a workspace switcher, a heading. `style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no selection model beyond `value` / `onValueChange`: exactly one destination is current, and the rail reports it rather than storing it.",
      "No flyouts, groups or nested destinations. A destination tree is the `NavigationDrawer`'s job; the rail is one flat set.",
      "There is no resize or collapse gesture. `mode` is the host's responsive decision — the rail does not decide its own width.",
    ],
  },
  api: [
    {
      name: "destinations",
      type: "readonly NavigationDestination[]",
      required: true,
      note: "The shared destination data: `{ key, label, icon?, badge?, disabled? }`. The label is the accessible name in BOTH modes.",
    },
    {
      name: "value",
      type: "string",
      required: true,
      note: "The currently selected destination key. Exactly one destination reports `selected`.",
    },
    {
      name: "onValueChange",
      type: "(key: string) => void",
      required: true,
      note: "Fires with the pressed destination's key. Selection is the host's state; the rail only reports the request.",
    },
    {
      name: "mode",
      type: 'NavigationRailMode ("collapsed" | "expanded")',
      default: '"collapsed"',
      note: "Icon-only rail or labelled sidebar — one component, two widths. Collapsing hides the label PAINT, never the name.",
    },
    {
      name: "header",
      type: "ReactNode",
      note: "Rendered above the destination list — a workspace switcher or a heading.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      default: '"Navigation"',
      note: "The rail region's name for assistive technology.",
    },
    {
      name: "style",
      type: "ViewStyle",
      note: "React Native styles for the rail. `NAVIGATION_RAIL_WIDTH` and `NAVIGATION_RAIL_EXPANDED_WIDTH` are exported for the two mode widths.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-navigation-rail"',
      note: "Test hook for the rail.",
    },
  ],
  aria: [
    "Each destination reports `tab` role with `selected` and `disabled` state — the same substitution `NavigationBar` makes, so the two navigations read the same way to a screen reader.",
    "The destination's LABEL is its accessible name in both modes: an icon-only rail whose buttons cannot be named is unusable, so collapsing is visual only.",
    "The selected destination is announced as selected and painted with the active pill — the two signals never disagree because both come from `value`.",
  ],
};
