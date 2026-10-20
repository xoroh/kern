import type { ComponentDoc } from "../types";

export const tabs: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  oneLiner:
    "Tabs switch between related views of the same subject without leaving the page.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/tabs",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Tabs",
    // No variant axis. Tabs are one treatment; emphasis comes from the
    // selected state rather than from a variant.
    variants: [],
    // M3 places Tabs at resting level 0, and level 0 is `shadow: none`. kern
    // ships no elevation token on Tabs, which is the conformant state.
    elevation: 0,
  },
  parts: ["Tabs", "TabsRoot", "TabsList", "TabsTab", "TabsPanel"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover"],
  keyboard: [
    {
      key: "Arrow keys",
      action: "Moves selection and focus between tabs, skipping disabled ones.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first or last enabled tab.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "The tablist is one stop (roving tabindex); panels are reachable by Tab.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused tab. The tab is a real button carrying `aria-selected`, so the press is the browser's own.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The selected indicator and label colour come from `--sys-color-primary`, so a theme retints every tab strip.",
      "Selected and disabled states are exposed as `data-selected` and `data-disabled`, so a stylesheet can restyle them without new props.",
    ],
    notSupported: [
      "There is no `variant` or `orientation` prop. This is the horizontal, underline-indicator treatment; a vertical or segmented form is a different component.",
      "There is no `size` prop. The strip height is fixed, which is what keeps a row of tabs level.",
      "There is no `indicator` prop. The indicator is the selected tab's own pseudo-element, so replacing it means styling `TabsTab`.",
    ],
  },
  api: [
    {
      name: "value",
      for: ["TabsRoot", "TabsTab", "TabsPanel"],
      type: "string | number",
      note: "Controlled selection on `TabsRoot`. Omit for uncontrolled. On a tab it is the tab’s value; on a panel it selects the tab that shows it.",
    },
    {
      name: "defaultValue",
      for: ["TabsRoot"],
      type: "string | number",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
      for: ["TabsRoot"],
      type: "(value: string | number) => void",
      note: "Fires on every selection change, including arrow-key navigation.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["TabsTab"],
      type: "boolean",
      note: "On `TabsTab`: removes it from the tab order and dims it.",
    },
    {
      name: "orientation",
      for: ["TabsRoot"],
      type: "Orientation | undefined",
      note: "Whether tabs lay out horizontally or vertically. Vertical tabs read top to bottom with the panel beside them.",
    },
    {
      name: "loopFocus",
      for: ["TabsList"],
      type: "boolean | undefined",
      note: "Whether arrow keys wrap from the last tab back to the first. Disabled stops at the ends.",
    },
    {
      name: "activateOnFocus",
      for: ["TabsList"],
      type: "boolean | undefined",
      note: "Whether moving focus with the arrow keys selects the tab immediately. Off means focus previews and Enter/Space selects — kinder when panels are expensive.",
    },
    {
      name: "nativeButton",
      for: ["TabsTab"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "keepMounted",
      for: ["TabsPanel"],
      type: "boolean | undefined",
      note: "Whether a hidden panel stays in the DOM. Keep it for panels whose state is expensive to rebuild; unmounted panels reset when revisited.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `TabsRootState` on the root, `TabsListState` on the row, `TabsTabState` (selected, disabled) on a tab, `TabsPanelState` on a panel.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on a tab when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The list is the tablist, each trigger a tab, and each panel a tabpanel — so the roles are the WAI-ARIA tabs pattern rather than a styled button row.",
    "Left and Right arrows move between tabs, Home and End jump to the ends. Focus moves with selection rather than staying behind.",
    "Each tab is associated with its panel, and the selected tab exposes `aria-selected`.",
  ],
};
