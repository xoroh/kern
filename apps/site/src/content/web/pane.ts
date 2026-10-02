import type { ComponentDoc } from "../types";

export const panes: ComponentDoc = {
  slug: "pane",
  name: "Pane",
  oneLiner:
    "Panes are content regions on a width scale, and the layout shapes built from them — a page, a split, a list-and-detail.",
  features:
    "Reach for a pane when content needs a region of its own with a sensible measure. The width is a scale — `narrow`, `default`, `wide`, `full` — and not a pixel value, so a page stays readable instead of stretching across a wide screen. The family then composes: `Page` is the ordinary one-region page, `SplitGrid` and `SplitPanel` divide the space, `ListDetail` is the master-detail pattern, and `Inspector` is the side panel for the record under the cursor. Declaring the measure as a scale is the point — it keeps every screen on the same rhythm. The equal-column split at this tier is `SplitGrid`, not `Split`: `Split` is the primitive component and takes any children, while `SplitGrid` is the grid recipe that expects `SplitPanel` columns. They are two components with two names — see the split ruling.",
  meta: {
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier — web shell layouts, no native counterpart expected.
    nativePeer: "none",
    variants: ["width: narrow · default · wide · full"],
    elevation: "surface",
  },
  parts: ["Pane", "Page", "SplitGrid", "SplitPanel", "ListDetail", "Inspector"],
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
