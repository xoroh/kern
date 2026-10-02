import type { ComponentDoc } from "../types";

export const fieldset: ComponentDoc = {
  slug: "fieldset",
  name: "Fieldset",
  oneLiner:
    "Fieldsets group related controls under one legend and give them a shared disabled state.",
  features:
    'Reach for a fieldset when several controls answer one question and belong to each other: a radio group\'s options, a filter\'s checkbox set, a schedule\'s day pickers. The legend is the question, so write it as one — a legend that says "Options" has grouped nothing. The value over plain markup is the shared disabled state: one flag dims and disables the whole group, which is what you want when the answer to the question is "not yet". Use it around any set where disabling one control alone would leave the set half-answered.',
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Fieldset",
    // No variant axis. A fieldset is a grouping and wiring concern.
    variants: [],
    elevation: "surface",
  },
  parts: ["Fieldset", "FieldsetRoot", "FieldsetLegend"],
  anatomy: [
    {
      name: "FieldsetRoot",
      role: "The group. Carries the shared disabled state down to everything inside it.",
    },
    {
      name: "FieldsetLegend",
      role: "The question the group answers. Becomes the group's accessible name.",
    },
    { name: "Fieldset", role: "The namespace object: Root and Legend." },
  ],
  customization: {
    supported: [
      "`className` on the root and on the legend, merged after their own classes.",
      "The root is a bordered, rounded panel with its own padding — `--md-sys-shape-corner-small` and the outline-variant role.",
      "`disabled` on the root dims the whole group, so one flag controls a whole answer.",
    ],
    notSupported: [
      "There is no `variant` or `tone` prop. The panel is one treatment.",
      "There is no `error` prop on the group. A group-level error belongs in the legend or in a message beside it, because the error is about the answer, not the box.",
      "There is no `columns` or `layout` prop. The root is a grid with a fixed gap; a two-column set is the root's `className`.",
    ],
  },
  api: [
    {
      name: "disabled",
      type: "boolean",
      note: "Disables the whole group at once. This is the reason to use a fieldset rather than a styled wrapper — one flag, one answer, all controls.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on the root and on the legend, merged after their own classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The controls. DOM order is reading order, so keep the legend first.",
    },
  ],
  aria: [
    "The root is a group with the legend as its accessible name, so the question is announced before its controls.",
    "That grouping is what makes a set of radios or checkboxes read as one question rather than as unrelated options.",
    "`disabled` on the root disables every control inside it, and the whole group dims — so a screen reader and a sighted reader see the same state.",
  ],
};
