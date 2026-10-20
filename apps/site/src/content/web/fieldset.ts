import type { ComponentDoc } from "../types";

export const fieldset: ComponentDoc = {
  slug: "fieldset",
  name: "Fieldset",
  oneLiner:
    "Fieldsets group related controls under one legend and give them a shared disabled state.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Fieldset",
    // No variant axis. A fieldset is a grouping and wiring concern.
    variants: [],
    elevation: "surface",
  },
  parts: ["Fieldset", "FieldsetRoot", "FieldsetLegend"],
  // M2: a fieldset is a GROUPING, not a control. It takes no focus and
  // answers no key of its own — the controls inside it are the tab stops,
  // and `disabled` on the root is what takes them out of the tab order.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` on the root and on the legend, merged after their own classes.",
      "The root is a bordered, rounded panel with its own padding — `--sys-shape-corner-small` and the outline-variant role.",
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
      for: ["FieldsetRoot"],
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
    {
      name: "style",
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `FieldsetRootState` on the set, `FieldsetLegendState` on the legend.",
    },
    {
      name: "render",
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state.",
    },
  ],
  aria: [
    "The root is a group with the legend as its accessible name, so the question is announced before its controls.",
    "That grouping is what makes a set of radios or checkboxes read as one question rather than as unrelated options.",
    "`disabled` on the root disables every control inside it, and the whole group dims — so a screen reader and a sighted reader see the same state.",
  ],
};
