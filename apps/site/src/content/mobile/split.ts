import type { ComponentDoc } from "../types";

export const split: ComponentDoc = {
  slug: "split",
  name: "Split",
  oneLiner:
    "The split is an N-column layout: two or three equal columns divided by a hairline, the same way the web split draws them.",
  features:
    "Reach for a split when a region should be divided into equal columns and the division itself is the design: a compare view, a two-up form, a three-pane preview. The dividers are drawn as a hairline GAP over a divider-coloured container — the same trick the web `Split` uses — so there is no leading border before the first column and no trailing one after the last, at any column count. Each column is an equal share that may still shrink below its content (the native equivalent of `minmax(0, 1fr)`), so one long child cannot push its siblings off screen. `columns` is a hint: the split renders the children you actually passed, never padding or truncating to a declared number.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Split",
    variants: ["columns: 2 · 3"],
    elevation: "surface",
  },
  parts: ["Split"],
  customization: {
    supported: [
      "`columns` declares the intended shape (2 or 3) and `children` are the columns, in order.",
      "`accessibilityLabel` names the region; it defaults to the component name.",
      "`style` is a React Native `ViewStyle` for the row. `SPLIT_GAP` is exported — the divider width, matching web's hairline gap.",
    ],
    notSupported: [
      "There is no column sizing. Every column is an equal share — a sidebar-sized column is a `Pane` inside a column, not a different split.",
      "No padding or truncation to `columns`: passing four children renders four columns. The number is a hint for hosts and tests, not a contract the component enforces.",
      "There is no responsive collapse. At phone widths the arrangement you want is `ListDetail` or a `SupportingPane`, not a squeezed split.",
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
      note: "The columns, in order. Each is wrapped in its own addressed view (derived testID per column) and gets an equal share.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      default: '"Split"',
      note: "The region's name for assistive technology.",
    },
    {
      name: "style",
      type: "ViewStyle",
      note: "React Native styles for the row, merged after the divider treatment.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-split"',
      note: "Test hook for the row; each column derives `<testID>-column-<index>`, so column-level mutations are observable.",
    },
    {
      name: "SPLIT_GAP",
      type: "number",
      note: "Exported constant: the hairline width between columns, matching web's gap. The divider is the container background showing through this gap.",
    },
  ],
  aria: [
    "The split labels its row but adds no roles — the columns are layout, and the controls inside them are what assistive technology acts on.",
    "Reading order is the column order; put the children in the order the content should be encountered.",
  ],
};
