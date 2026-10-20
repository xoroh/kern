import type { ComponentDoc } from "../types";

export const pagination: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  oneLiner:
    "Pagination moves through a long set of results one page at a time.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Pagination",
    // No variant axis. Which page is showing is state.
    variants: [],
    elevation: "surface",
  },
  parts: ["Pagination"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover"],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus between the page buttons. Each page is a real button, so the set is reachable from the keyboard alone.",
    },
    {
      key: "Enter / Space",
      action: "Navigates to the focused page.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the nav's own classes.",
      "`children` renders extra content after the page buttons — a page-size control or a total count.",
      "The current page is marked with `data-current`, so its look is restylable without new props.",
    ],
    notSupported: [
      "There is no `siblingCount` or `boundaryCount` prop. The window of pages shown is the component's own: all of them up to seven, then a window with gaps.",
      "There is no `variant` or `size` prop.",
      "There is no `showFirstButton`/`showLastButton` prop. The ends are reached from the window like any other page.",
    ],
  },
  api: [
    {
      name: "count",
      type: "number",
      note: "Total pages, at least 1. Required — a pagination with no count cannot draw itself.",
    },
    {
      name: "value",
      type: "number",
      note: "Controlled current page, 1-based. One is the first page, matching the number on the button.",
    },
    {
      name: "defaultValue",
      type: "number",
      note: "Initial page when uncontrolled.",
    },
    {
      name: "onValueChange",
      type: "(page: number) => void",
      note: "Called with the new page, 1-based — the same numbering the buttons show, so there is no off-by-one between what is displayed and what is reported.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Extra content rendered after the page buttons.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the nav's own classes.",
    },
  ],
  aria: [
    "The control is a `nav` landmark, so it is reachable from the landmark list and distinguishable from the page's other navigation when it is labelled.",
    "Each page is a real button, so moving through the set is possible from the keyboard alone.",
    "The current page carries `aria-current`, so which page is showing is announced rather than left to be seen.",
    "Pages are 1-based throughout — the label on the button and the value passed to `onValueChange` are the same number.",
  ],
};
