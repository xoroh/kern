import type { ComponentDoc } from "../types";

export const secondaryTabs: ComponentDoc = {
  slug: "secondary-tabs",
  name: "Secondary tabs",
  oneLiner:
    "Secondary tabs are the second row of tabs, for the subdivisions within one section.",
  features:
    "Reach for secondary tabs when a section has its own facets and a second level is clearer than a longer first one: the settings page of one feature, the views within one report. The data shape is identical to `Tabs` — `value`, `label`, optional `content` — so moving a tab between the two rows is a placement decision rather than a rewrite. The difference is the emphasis and where it sits: a secondary row belongs UNDER a primary one, marking subdivisions of the section the primary tab already chose. Two rows of tabs of equal weight is a hierarchy that says nothing.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "SecondaryTabs",
    variants: [],
    elevation: "surface",
  },
  parts: ["SecondaryTabs"],
  customization: {
    supported: [
      "`tabs` are data — `value`, `label`, optional `content` — the same shape `Tabs` takes.",
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `orientation`. It is a row.",
      "There is no `depth` or nesting. There is a primary row and a secondary row, and that is the hierarchy.",
      "There is no `variant` on `Tabs` to make it secondary — the second level is this component.",
    ],
  },
  api: [
    {
      name: "tabs",
      type: "SecondaryTab[]",
      note: "`{ value, label, content? }`. IDENTICAL to `Tabs`' shape, so a tab can move between the rows as a placement decision rather than a rewrite.",
    },
    {
      name: "value / defaultValue",
      type: "string",
      note: "The selected tab's `value`.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      note: "Reports the next selected `value`.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "As with `Tabs`, each tab is a real pressable with a `label` and the selected one reports its state.",
    'The secondary position is what carries the hierarchy — a row beneath a primary row says "these are subdivisions" in a way two equal rows do not.',
    "Keeping the shape identical to `Tabs` means the announcement is the same too; only the placement differs.",
  ],
};
