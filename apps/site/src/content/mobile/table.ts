import type { ComponentDoc } from "../types";

export const table: ComponentDoc = {
  slug: "table",
  name: "Table",
  oneLiner: "Tables lay out rows of string data under named columns.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Table",
    variants: [],
    elevation: "surface",
  },
  parts: ["Table"],
  // Pure LAYOUT: the native table is a block of text under named columns.
  // Its cells are plain strings with no renderers, so there is no control in
  // it to reach: the table takes no focus, binds no key and exposes no state
  // of its own. So there is no keyboard contract to write, and saying so is a
  // fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`columns` are data — `key` and `title` — and `rows` are records keyed by those columns.",
      "`accessibilityLabel` names the whole table.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There are no per-cell renderers. Cells are strings, which is what keeps the data declarative.",
      "There is no sorting, selection or pagination. Those are behaviours of a data grid, not of a table.",
      "There is no `variant` or `density` prop.",
    ],
  },
  api: [
    {
      name: "columns",
      type: "NativeTableColumn[]",
      note: "`{ key, title }`. `title` is the column heading and `key` is what rows index by.",
    },
    {
      name: "rows",
      type: "Array<Record<string, string>>",
      note: "Every row is a record of strings keyed by column `key`. Strings only — there are no per-cell renderers.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the table, so it is announced as one thing rather than as loose text.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`accessibilityLabel` names the whole table, which is what makes it read as a table rather than as rows of unrelated text.",
    "The column `title` is the heading each cell sits under, so a cell is understandable in context.",
    "Cells are plain strings and carry no role of their own — this is a layout of text, not a grid of controls.",
  ],
};
