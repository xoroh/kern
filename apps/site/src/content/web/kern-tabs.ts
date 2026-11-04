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
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
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
      key: "Arrow keys",
      action:
        "Moves selection and focus between tabs, skipping disabled ones. Vertical strips traverse with Up/Down and horizontal with Left/Right; all four arrows work either way.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first or last enabled tab.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "The tablist is one stop (roving tabindex); the panel is reachable by Tab.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused tab. Each tab is a real button carrying `aria-selected`, so the press is the browser's own.",
    },
  ],
  customization: {
    supported: [
      "`items` are data — `value`, `label`, optional `content`, `disabled`, `leadingIcon` and `badge` — so the strip and its panels come from one declaration.",
      "`variant` picks the M3 level: `primary` under the app bar, `secondary` inside content — never both in one bar.",
      "`orientation` vertical fills the active tab as a pill, which is the settings pattern.",
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
      type: "string | undefined",
      note: "Controlled active tab value.",
    },
    {
      name: "defaultValue",
      type: "string | undefined",
      note: "Initial active value for the uncontrolled case.",
    },
    {
      name: "onValueChange",
      type: "((value: string) => void) | undefined",
    },
    {
      name: "variant",
      type: '"primary" | "secondary"',
      note: "M3 level: `primary` under the app bar (`3px` primary indicator, primary active text) or `secondary` inside content (`2px` indicator, on-surface active text). Never mix both levels in one bar.",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      note: "`horizontal` underlines the active tab; `vertical` fills it as a pill (the settings pattern). The indicator geometry follows the axis.",
    },
    {
      name: "density",
      type: '"compact" | "medium" | "expanded"',
      note: "Row density: compact 40 / medium 48 / expanded 56.",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name for the tablist.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Caller-composed panel area. When given, per-item `content` is ignored and this is rendered as the tabpanel instead.",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "The strip is a tablist with tabs and tabpanels — the WAI-ARIA tabs pattern, not a styled button row.",
    "Each tab points at its panel and only the active panel mounts, so hidden panels are never in the tab order.",
    "`label` names the tablist; the default names it Sections.",
    "An empty item list, or one where every tab is disabled, renders no tablist at all rather than an empty one.",
  ],
};
