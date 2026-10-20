import type { ComponentDoc } from "../types";

export const split: ComponentDoc = {
  slug: "split",
  name: "Split",
  oneLiner:
    "The split is an N-column layout: two or three equal columns divided by a hairline, named as one region for assistive technology.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    // Exact native counterpart, checked in the mobile inventory.
    nativePeer: "Split",
    variants: ["columns: 2 · 3"],
    elevation: "surface",
  },
  parts: ["Split"],
  // The split is LAYOUT: it names a region for assistive tech and divides
  // the space, but it takes no focus and handles no keys. The controls
  // inside the columns own their own keyboard behaviour.
  nonInteractive: true,
  customization: {
    supported: [
      "`columns` declares the intended shape (2 or 3) and `children` are the columns, in order.",
      "`label` names the region for assistive technology; it defaults to `Split`.",
      "`className` is passed through and merged after the component's own classes.",
    ],
    notSupported: [
      "There is no column sizing. Every column is an equal share — a sidebar-sized column is a `Pane` inside a column, not a different split.",
      "No padding or truncation to `columns`: passing four children renders four columns. The number is a hint, not a contract the component enforces.",
      "There is no responsive collapse. At narrow widths the arrangement you want is `ListDetail` or a `SupportingPane`, not a squeezed split.",
    ],
  },
  api: [
    {
      name: "columns",
      type: "2 | 3",
      default: "2",
      note: "The intended column count — a HINT. The split renders whatever children are passed rather than padding or truncating to match.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: 'The columns, in order. Each is wrapped in its own addressed `div` (`data-slot="split-column"`) and gets an equal share.',
    },
    {
      name: "label",
      type: "string",
      default: '"Split"',
      note: 'The accessible name for the split region, set as `aria-label` on a `role="group"`. The columns are layout, so this is the only thing assistive technology announces about the region itself.',
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the component's own classes.",
    },
  ],
  aria: [
    'The split is a `role="group"` with an accessible name, so a reader can announce "Workspace, group" before entering it.',
    "No roles are set on the columns: they are layout, and the controls inside them are what assistive technology acts on.",
    "Reading order is the column order; put the children in the order the content should be encountered.",
  ],
};
