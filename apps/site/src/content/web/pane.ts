import type { ComponentDoc } from "../types";

export const panes: ComponentDoc = {
  slug: "pane",
  name: "Pane",
  oneLiner:
    "Panes are content regions on a width scale, and the layout shapes built from them — a page, a split, a list-and-detail.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier — web shell layouts, no native counterpart expected.
    nativePeer: "none",
    variants: ["width: narrow · default · wide · full"],
    elevation: "surface",
  },
  parts: ["Pane", "Page", "SplitGrid", "SplitPanel", "ListDetail", "Inspector"],
  // Pure LAYOUT: the pane is a `<section>` with a measure applied. It takes
  // no focus, handles no key and exposes no state of its own — the controls
  // the host puts inside it are the tab stops. So there is no keyboard
  // contract to write, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`width` is the four-step measure scale, so content stays readable on a wide screen.",
      "Each layout is its own export, so a shell picks the shape rather than configuring one.",
      "`Pane` is a `<section>` and takes section props.",
    ],
    notSupported: [
      "There is no arbitrary width. The scale is four named steps and a pixel value is not one of them.",
      "There is no `columns` or grid prop. These are regions, not a layout engine.",
    ],
  },
  api: [
    {
      name: "width",
      type: '"narrow" | "default" | "wide" | "full"',
      default: '"default"',
      note: "The measure. Maps to the max-width scale rather than a number, which is what keeps screens on one rhythm.",
    },
    {
      name: "Pane",
      type: "component",
      note: "One content region. A `<section>` with the width scale applied.",
    },
    {
      name: "Page",
      type: "component",
      note: "The ordinary one-region page.",
    },
    {
      name: "SplitGrid / SplitPanel",
      type: "component",
      note: "Divides the space into two or three equal columns, with `SplitPanel` naming one column of it. The grid recipe for equal columns; `Split` is the primitive that takes any children.",
    },
    {
      name: "ListDetail",
      type: "component",
      note: "The master-detail pattern — list on one side, the selected record on the other.",
    },
    {
      name: "Inspector",
      type: "component",
      note: "The side panel for the record under the cursor.",
    },
  ],
  aria: [
    "`Pane` is a real `<section>`, so a region is a landmark rather than a styled `div`.",
    "The named measures mean content is not stretched past a readable line length, which matters for everyone who reads rather than scans.",
    "List and detail as one component is what keeps the selection relationship expressible, rather than two unrelated panels that happen to sit side by side.",
  ],
};
