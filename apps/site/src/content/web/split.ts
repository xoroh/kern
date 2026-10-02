import type { ComponentDoc } from "../types";

export const split: ComponentDoc = {
  slug: "split",
  name: "Split",
  oneLiner:
    "The split is an N-column layout: two or three equal columns divided by a hairline, named as one region for assistive technology.",
  features:
    "Reach for a split when a region should be divided into equal columns and the division itself is the design: a compare view, a two-up form, a three-pane preview. The dividers are drawn as a hairline GAP over a divider-coloured container, so there is no leading border before the first column and no trailing one after the last, at any column count. Each column is an equal share that may still shrink below its content, so one long child cannot push its siblings off screen. The region is a labelled `group`, because a layout still needs a name — without one a screen-reader user has no way to announce the region before entering it. This is the PRIMITIVE: it wraps each child in its own column and takes any children. The equal-column grid built on `SplitPanel`, at the composition tier, is `SplitGrid` — a different component with a different name.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Exact native counterpart, checked in the mobile inventory.
    nativePeer: "Split",
    variants: ["columns: 2 · 3"],
    elevation: "surface",
  },
  parts: ["Split"],
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
