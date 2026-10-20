import type { ComponentDoc } from "../types";

export const secondaryTabs: ComponentDoc = {
  slug: "secondary-tabs",
  name: "Secondary tabs",
  oneLiner:
    "Secondary tabs switch between related views in the middle of a page, below the primary navigation.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SecondaryTabs",
    variants: [],
    elevation: "surface",
  },
  parts: ["SecondaryTabs"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Arrow keys",
      action: "Moves selection and focus between tabs, skipping disabled ones.",
    },
    {
      key: "Home / End",
      action: "Jumps to the first or last enabled tab.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the tabs' own classes.",
      "The tabs are data — `value`, `label`, optional `content`, optional `disabled` — so the whole set is one declaration rather than assembled markup.",
      "`label` names the tablist, so two sets on a page are distinguishable.",
    ],
    notSupported: [
      "There is no `variant` or `orientation` prop. This is the horizontal second-level treatment.",
      "There is no `lazy` prop for the panels. What is rendered when a tab is inactive is the component's, and `content` is only rendered while active.",
    ],
  },
  api: [
    {
      name: "tabs",
      type: "SecondaryTab[]",
      note: "The set, as data: `value`, `label`, optional `content`, optional `disabled`. The panels come from the same declaration as the headings.",
    },
    {
      name: "value",
      type: "string",
      note: "Controlled active tab. Omit for uncontrolled.",
    },
    {
      name: "defaultValue",
      type: "string",
      note: "Initial tab when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Fires when the active tab changes, with the tab's `value`.",
    },
    {
      name: "label",
      type: "string",
      note: "The accessible name of the tablist. With two sets of tabs on a page, this is what tells them apart.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the tabs' own classes.",
    },
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the tab list. Opt-in only — no default.",
    },
  ],
  aria: [
    "The set is a tablist with tabs and tabpanels, so the structure is announced rather than looked at.",
    "Left and Right arrows move between tabs and selection follows focus — the WAI-ARIA tabs pattern.",
    "`label` names the tablist, which is how two sets of tabs on one page stay distinguishable.",
    "Panels are only rendered for the active tab, so the hidden ones are not in the tab order.",
  ],
};
