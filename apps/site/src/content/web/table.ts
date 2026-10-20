import type { ComponentDoc } from "../types";

export const table: ComponentDoc = {
  slug: "table",
  name: "Table",
  oneLiner:
    "Tables lay out rows of related values so they can be compared down a column.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Table",
    // No variant axis. Density and emphasis come from the rows and cells,
    // which are plain elements the caller composes.
    variants: [],
    elevation: "surface",
  },
  parts: [
    "Table",
    "TableRoot",
    "TableHead",
    "TableHeader",
    "TableBody",
    "TableRow",
    "TableCell",
    "TableCaption",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // A semantic table is NOT a data grid: the component binds no key and takes
  // no focus. What the host puts inside the cells is what the tab order
  // reaches, and the table's own contribution is the row and column
  // relationship a screen reader reads out.
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through the interactive controls inside the cells, in reading order. The table itself takes no focus — the comparison is read, not operated.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused control inside a cell. The table binds no key of its own; there is no sorting or selection for one to move.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after that part's own classes. Every part forwards the props of the HTML element it renders.",
      "Row and cell styling is entirely the caller's - the components supply the semantic elements and a baseline, not a data-grid look.",
      "`TableCaption` is a real `<caption>`, so the table has an accessible name rather than relying on a heading above it.",
    ],
    notSupported: [
      "There is no sorting, pagination or selection. This is a semantic table, not a data grid - the behaviour is the page's.",
      "There is no `density` or `variant` prop. Row height and borders are `className`.",
      "There is no `stickyHeader` prop. A fixed header is the table's own CSS.",
    ],
  },
  api: [
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "colSpan",
      for: ["TableHeader", "TableCell"],
      type: "number",
      note: "On `TableCell` and `TableHeader`: how many columns the cell spans. A cell that spans a header row's columns is how a grouped header is built.",
    },
    {
      name: "scope",
      for: ["TableHeader", "TableCell"],
      type: '"row" | "col" | "rowgroup" | "colgroup"',
      note: "On `TableHeader`: what the header applies to. Setting it is what lets a screen reader announce the column name with each cell's value.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLTableElement>",
      note: "Forwarded to the underlying element. Each part forwards to its own element type.",
    },
  ],
  aria: [
    "Every part renders the HTML table element it names, so the table semantics come from real elements rather than from ARIA roles bolted onto divs.",
    "`TableCaption` gives the table an accessible name. A table with no caption has no name to announce.",
    "`scope` on `TableHeader` is what associates a cell's value with its column heading - without it, a screen reader reads numbers with no idea what they measure.",
    "On a narrow screen, keep the table scrollable rather than reflowing it into cards. The comparison is the reason the table exists.",
  ],
};
