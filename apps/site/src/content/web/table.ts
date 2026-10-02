import type { ComponentDoc } from "../types";

export const table: ComponentDoc = {
  slug: "table",
  name: "Table",
  oneLiner:
    "Tables lay out rows of related values so they can be compared down a column.",
  features:
    "Reach for a table when the data is genuinely tabular — several attributes per record, and the point is comparing them across rows. Give every column a header and keep the values in a column aligned, because the comparison is the whole reason the table exists. On a narrow screen a table that scrolls sideways is better than one that reflows into unrelated cards; a card list loses the comparison that made the table worth building. If each record stands alone and nothing is compared, that is a list, not a table.",
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
  anatomy: [
    {
      name: "TableRoot",
      role: "The `<table>` itself. The namespace `Table` also exposes all of the parts below.",
    },
    {
      name: "TableHead",
      role: "The `<thead>`. The header ROWS go here — see the warning below.",
    },
    {
      name: "TableHeader",
      role: "One `<th>`. A header CELL, not the header section. The names are one letter apart and they are not interchangeable.",
    },
    { name: "TableBody", role: "The `<tbody>`." },
    { name: "TableRow", role: "One `<tr>`." },
    { name: "TableCell", role: "One `<td>`." },
    {
      name: "TableCaption",
      role: "The `<caption>`. Names the table for assistive tech — the only place a table gets a title it can announce.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after that part's own classes. Every part forwards the props of the HTML element it renders.",
      "Row and cell styling is entirely the caller's — the components supply the semantic elements and a baseline, not a data-grid look.",
      "`TableCaption` is a real `<caption>`, so the table has an accessible name rather than relying on a heading above it.",
    ],
    notSupported: [
      "There is no sorting, pagination or selection. This is a semantic table, not a data grid — the behaviour is the page's.",
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
      type: "number",
      note: "On `TableCell` and `TableHeader`: how many columns the cell spans. A cell that spans a header row's columns is how a grouped header is built.",
    },
    {
      name: "scope",
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
    "`scope` on `TableHeader` is what associates a cell's value with its column heading — without it, a screen reader reads numbers with no idea what they measure.",
    "On a narrow screen, keep the table scrollable rather than reflowing it into cards. The comparison is the reason the table exists.",
  ],
};
