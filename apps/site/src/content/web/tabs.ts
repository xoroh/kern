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
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The selected indicator and label colour come from `--md-sys-color-primary`, so a theme retints every tab strip.",
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
      type: "string | number",
      note: "Controlled selection on `TabsRoot`. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      type: "string | number",
      note: "Initial selection when uncontrolled.",
    },
    {
      name: "onValueChange",
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
      type: "boolean",
      note: "On `TabsTab`: removes it from the tab order and dims it.",
    },
  ],
  aria: [
    "The list is the tablist, each trigger a tab, and each panel a tabpanel — so the roles are the WAI-ARIA tabs pattern rather than a styled button row.",
    "Left and Right arrows move between tabs, Home and End jump to the ends. Focus moves with selection rather than staying behind.",
    "Each tab is associated with its panel, and the selected tab exposes `aria-selected`.",
  ],
};
