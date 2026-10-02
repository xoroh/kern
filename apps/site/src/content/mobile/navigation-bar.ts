import type { ComponentDoc } from "../types";

export const navigationBar: ComponentDoc = {
  slug: "navigation-bar",
  name: "Navigation bar",
  oneLiner:
    "Navigation bars hold an app's top-level destinations in a fixed-height bar at the bottom of a compact screen.",
  features:
    "Reach for a navigation bar when the app has three to five top-level places and someone will move between them often. It shares its destination data with the drawer and with `NavigationBarItem`, so you declare your places once and let the containers differ. The height is fixed and exported, so screens lay out against a known number and the bar never reflows when labels change. The active destination gets Material 3's active indicator — a pill behind the icon — so selection is legible in shape as well as colour. The `floating` slot sits under the bar, which is where Material 3 docks a FAB.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NavigationBar",
    variants: [],
    elevation: 2,
  },
  // `NavigationBarItem` is its own inventory export with its own page
  // (`navigation-bar-item`), so this page owns only the bar itself. The row is
  // referenced in prose above — "one component, one page" holds.
  parts: ["NavigationBar"],
  customization: {
    supported: [
      "`destinations` are data — `key`, `label`, optional `icon`, optional `badge`, optional `disabled`.",
      "`floating` is a slot rendered under the bar, where Material 3 docks a FAB.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `height` prop. `NAVIGATION_BAR_HEIGHT` is exported so screens can lay out against it; making it a prop would let the bar reflow when labels change.",
      "There is no `orientation` prop. The bar is horizontal; vertical containers use `NavigationBarItem` in a drawer, rail or sidebar.",
      "There is no `elevation` prop. See the note below — this renderer expresses the bar's level differently from web.",
    ],
  },
  api: [
    {
      name: "destinations",
      type: "NavigationDestination[]",
      note: "`{ key, label, icon?, badge?, disabled? }`. `key` is the identity used in `value`, and `label` is the announced name.",
    },
    {
      name: "value",
      type: "string",
      note: "The selected destination's `key`. Controlled — the bar reports and the host decides, so selection cannot disagree with the rest of the app.",
    },
    {
      name: "onValueChange",
      type: "(key: string) => void",
      note: "Reports the chosen `key`.",
    },
    {
      name: "floating",
      type: "ReactNode",
      note: "Rendered under the bar — where Material 3 docks a FAB.",
    },
    {
      name: "NAVIGATION_BAR_HEIGHT",
      type: "number",
      default: "80",
      note: "Exported so screens can lay out against a known number. Fixed deliberately: the bar must not reflow when labels change.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "Each destination is a real pressable with a `label`, so the bar is readable and operable without seeing the icons.",
    "The selected destination carries the active indicator and reports its selected state, so selection is not conveyed by colour alone.",
    "`disabled` destinations stay visible and announce as disabled — the action exists but is unavailable.",
    "PLATFORM SUBSTITUTION: this renderer does not draw a shadow for the bar's resting level. It conveys the same separation with the `surfaceContainer` tone and a hairline top border, because React Native shadows are platform-inconsistent. Web applies the elevation token; the LEVEL is the same either way, only its expression differs.",
  ],
};
