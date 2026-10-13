import type { ComponentDoc } from "../types";

export const richTooltip: ComponentDoc = {
  slug: "rich-tooltip",
  name: "Rich tooltip",
  oneLiner:
    "A tooltip with a subhead, supporting text, and plain-text actions for explanations that need more than a label.",
  features:
    "Reach for a rich tooltip when a plain label cannot carry the explanation: a feature introduction, a settings hint with a next step, a definition with an action. It opens on hover and focus like the plain tooltip, but the surface is surface-container with room for a subhead, a few lines of supporting text, and text-button actions. If there are no actions and no subhead, that is a plain Tooltip, not a poor rich one.",
  meta: {
    specUrl: "https://m3.material.io/components/tooltips",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "RichTooltip",
    variants: [],
    elevation: 2,
  },
  parts: ["RichTooltipContent", "RichTooltipTitle", "RichTooltipActions"],
  anatomy: [
    {
      name: "RichTooltipContent",
      role: "The rich surface. Portals to the end of the document and positions itself against the trigger, padding resolved from the `kern.rich-tooltip.container` shape and spacing roles on `surface-container`.",
    },
    {
      name: "RichTooltipTitle",
      role: "The subhead. One short line naming what the tooltip explains.",
    },
    {
      name: "RichTooltipActions",
      role: "The action row. Plain-text buttons (ghost Buttons) the reader can act on without leaving the tooltip.",
    },
  ],
  usage: {
    do: [
      "Give the tooltip a subhead, supporting text, and at least the shape of a next step.",
      "Keep actions to plain text buttons — the surface is small and loud actions unbalance it.",
    ],
    dont: [
      "Don't put crucial information only in a tooltip — rich or plain, it must exist some other way too.",
      "Don't use a rich tooltip where a plain label suffices; size is emphasis.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "--md-sys-color-surface-container",
      value: "surface-container",
    },
  ],
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "Subhead, text, and actions composed with RichTooltipTitle and RichTooltipActions.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the rich surface classes.",
    },
  ],
  aria: [
    "The rich surface is a live region companion to its trigger — the trigger names the control, the surface carries the explanation.",
    "Actions inside the surface are real buttons in the tab order after the trigger.",
  ],
};
