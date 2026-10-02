import type { ComponentDoc } from "../types";

export const secondaryTabs: ComponentDoc = {
  slug: "secondary-tabs",
  name: "Secondary tabs",
  oneLiner:
    "Secondary tabs switch between related views in the middle of a page, below the primary navigation.",
  features:
    "Reach for secondary tabs when a section of a screen has several views of one thing and they belong below, not at the top: a record's overview, activity and settings. They are the second level — primary navigation says where you are, secondary tabs say which part of it you are looking at. The tabs come as data, including their content, so the whole set is one declaration. If the panels are different places with their own URLs, they are navigation and not tabs.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "SecondaryTabs",
    variants: [],
    elevation: "surface",
  },
  parts: ["SecondaryTabs"],
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
      name: "disabled",
      type: "boolean",
      note: "On a tab: it cannot be selected and is announced as unavailable.",
    },
  ],
  aria: [
    "The set is a tablist with tabs and tabpanels, so the structure is announced rather than looked at.",
    "Left and Right arrows move between tabs and selection follows focus — the WAI-ARIA tabs pattern.",
    "`label` names the tablist, which is how two sets of tabs on one page stay distinguishable.",
    "Panels are only rendered for the active tab, so the hidden ones are not in the tab order.",
  ],
};
