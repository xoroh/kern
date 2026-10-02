import type { ComponentDoc } from "../types";

export const pagination: ComponentDoc = {
  slug: "pagination",
  name: "Pagination",
  oneLiner:
    "Pagination moves through a long set of results one page at a time.",
  features:
    "Reach for pagination when the result set is too long to render at once and people move through it deliberately: search results, a records table, an archive. Show where in the set they are, because a page of results with no position is a page with no context. Pages are numbered from one, matching what the control shows and what people expect. If the set is meant to be scanned continuously, that is infinite scroll, and it is a different trade — it makes going back impossible without keeping your place.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Pagination",
    // No variant axis. Which page is showing is state.
    variants: [],
    elevation: "surface",
  },
  parts: ["Pagination"],
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
      name: "page",
      type: "number",
      note: "Controlled current page, 1-based. One is the first page, matching the number on the button.",
    },
    {
      name: "defaultPage",
      type: "number",
      note: "Initial page when uncontrolled.",
    },
    {
      name: "onPageChange",
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
    "Pages are 1-based throughout — the label on the button and the value passed to `onPageChange` are the same number.",
  ],
};
