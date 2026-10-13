import type { ComponentDoc } from "../types";

export const richTooltip: ComponentDoc = {
  slug: "rich-tooltip",
  name: "Rich tooltip",
  oneLiner:
    "A tooltip with a subhead, supporting text, and plain-text actions for explanations that need more than a label.",
  features:
    "Reach for a rich tooltip when a plain label cannot carry the explanation. It follows the plain tooltip's trigger contract — focus opens, the title and text ride the accessibility hint so touch users lose nothing — but the surface is surface-container with 12/8/16dp padding and the actions are real buttons. If there are no actions and no subhead, that is a plain Tooltip.",
  meta: {
    specUrl: "https://m3.material.io/components/tooltips",
    status: "real",
    package: "@xoroh/kern-native",
    nativePeer: "RichTooltip",
    variants: [],
    elevation: 2,
  },
  parts: ["RichTooltip"],
  usage: {
    do: [
      "Give the tooltip a title, supporting text, and actions that go somewhere.",
      "Keep actions to short labels — the surface is small.",
    ],
    dont: [
      "Don't put crucial information only in a tooltip — it must exist some other way too.",
      "Don't use a rich tooltip where a plain label suffices; size is emphasis.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "theme.color.surfaceContainer",
      value: "surfaceContainer",
    },
  ],
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "The subhead. Announced with the text through the trigger's accessibility hint.",
    },
    {
      name: "text",
      type: "string",
      required: true,
      note: "Supporting text under the subhead.",
    },
    {
      name: "actions",
      type: "RichTooltipAction[]",
      note: "Plain-text action buttons in a row under the text. Each carries label and onPress.",
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: "The trigger's own accessible name.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Trigger content.",
    },
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      note: "Initial open state for the uncontrolled case.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires when the surface opens or closes.",
    },
    {
      name: "placement",
      type: '"top" | "bottom"',
      default: '"top"',
      note: "Which side of the trigger the surface sits on.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-rich-tooltip-trigger"',
      note: "Test hook for the trigger; the surface is kern-rich-tooltip-content.",
    },
  ],
  aria: [
    "The trigger carries title and text as its accessibility hint at all times, so touch users lose nothing when the surface is closed.",
    "Actions are real buttons in the accessibility tree after the trigger.",
    "The surface itself carries no role — the explanation belongs to the trigger it supplements.",
  ],
};
