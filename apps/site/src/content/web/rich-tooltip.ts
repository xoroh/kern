import type { ComponentDoc } from "../types";

export const richTooltip: ComponentDoc = {
  slug: "rich-tooltip",
  name: "Rich tooltip",
  oneLiner:
    "A tooltip with a subhead, supporting text, and plain-text actions for explanations that need more than a label.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    specUrl: "https://m3.material.io/components/tooltips",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "RichTooltip",
    variants: [],
    elevation: 2,
  },
  parts: [
    "RichTooltip",
    "RichTooltipContent",
    "RichTooltipTitle",
    "RichTooltipActions",
  ],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // The keyboard contract, read off the tooltip primitive the rich surface
  // is built on: the trigger is a real button, the surface opens on focus
  // as well as on hover, and Escape dismisses it.
  keyboard: [
    {
      key: "Focus (on the trigger)",
      action:
        "Opens the surface. The tooltip is triggered by focus as well as by hover, so the explanation reaches a keyboard user with no pointer at all.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused control — the trigger itself, or one of the actions in the surface, which are real buttons.",
    },
    {
      key: "Escape",
      action:
        "Dismisses the surface. The focus never left the trigger, so it is still there afterwards.",
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
