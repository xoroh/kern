import type { ComponentDoc } from "../types";

export const tabs: ComponentDoc = {
  slug: "tabs",
  name: "Tabs",
  oneLiner:
    "Tabs switch between related views of the same subject without leaving the page.",
  features:
    "Reach for tabs when the content is genuinely parallel — the same thing seen from several angles, like a conversation's messages, details and files. Give each tab a short noun label and keep the number small enough that no label is hidden behind a scroll. Tabs are not navigation: if the panels are really different places with their own URLs, use links and let people bookmark them. Keep a panel's content independent of the others, so switching back does not lose what someone typed.",
  meta: {
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
  anatomy: [
    {
      name: "TabsRoot",
      role: "Owns which tab is selected. Accepts `value`/`onValueChange` to control it.",
    },
    {
      name: "TabsList",
      role: "The row of tab triggers. Handles the arrow-key roving focus between them.",
    },
    {
      name: "TabsTab",
      role: "One trigger. Carries the selected state and the indicator.",
    },
    {
      name: "TabsPanel",
      role: "The content for one tab, kept in the DOM only while selected.",
    },
  ],
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
  ],
  usage: {
    do: [
      "Use primary tabs under the top app bar for main destinations.",
      "Keep one tab active; every tab references its panel via aria-controls.",
      "Label icon-only tabs for assistive tech.",
    ],
    dont: [
      "Don't mix primary and secondary tabs in one bar.",
      "Don't use tabs for navigation away — tabs switch views, they never leave.",
      "Don't use fewer than three tabs — use segmented buttons or plain text.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "comp.primary-tab.container",
      value: "surface, 48px, no rounding",
    },
    {
      element: "Active indicator",
      state: "resting",
      token: "comp.primary-tab.active-indicator",
      value: "primary, 3px, (3px 3px 0 0)",
    },
    {
      element: "Active label",
      state: "resting",
      token: "comp.primary-tab.active-label",
      value: "primary, title-small",
    },
    {
      element: "Inactive label",
      state: "hover",
      token: "comp.primary-tab.inactive-hover",
      value: "on-surface + 8% layer",
    },
  ],
  faq: [
    {
      q: "Primary or secondary?",
      a: "Primary under the app bar for main destinations (3px indicator, primary active text). Secondary inside content for sub-sections (2px indicator, on-surface active text).",
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
