import type { ComponentDoc } from "../types";

export const kernTabs: ComponentDoc = {
  slug: "kern-tabs",
  name: "Kern tabs",
  oneLiner:
    "Kern tabs is the one tab strip with primary and secondary levels over a data contract.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "KernTabs",
    variants: [
      "variant: primary · secondary",
      "orientation: horizontal · vertical",
      "density: compact · medium · expanded",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernTabs"],
  keyboard: [
    {
      key: "Press",
      action:
        "Selects the tab — each tab is its own focus stop on this renderer, and the panel follows the press rather than the traversal.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the tabs in order; each reads as a tab with its label, badge and selected state, and double-tap selects it.",
    },
  ],
  customization: {
    supported: [
      "`items` are data — `value`, string `label`, optional `content`, `disabled`, leading icon and badge — so the strip and its panels come from one declaration.",
      "`variant` picks the M3 level: `primary` under the app bar, `secondary` inside content — never both in one bar.",
      "`orientation` vertical stacks the tabs; the active tab fills as a pill, which is the settings pattern.",
      "`children` replaces the panel area with a caller-composed panel; per-item `content` is then ignored.",
    ],
    notSupported: [
      "There is no segmented treatment here. Fewer than three choices is a `SegmentedButton` — tabs own tabbed content with panels.",
      "There is no nesting. A second level is a second strip at `secondary`, not tabs inside tabs.",
      "There is no `lazy` prop. Panels mount only while active; keeping panel state across visits is the panel's own job.",
    ],
  },
  api: [
    {
      name: "items",
      type: "KernTabItem[]",
      required: true,
    },
    {
      name: "value",
      type: "string",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
    },
    {
      name: "variant",
      type: "KernTabsVariant",
    },
    {
      name: "orientation",
      type: "KernTabsOrientation",
    },
    {
      name: "density",
      type: "KernTabsDensity",
    },
    {
      name: "children",
      type: "ReactNode",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "Tabs render with tablist and tab roles and report selected state, so the strip announces the same structure as web without the roving tabindex.",
    "Each tab points at its panel and only the active panel shows, so hidden panels stay out of the way.",
    "`accessibilityLabel` names the tablist; labels and badges are string-typed on this renderer.",
    "An empty item list, or one where every tab is disabled, renders no tablist at all rather than an empty one.",
  ],
};
