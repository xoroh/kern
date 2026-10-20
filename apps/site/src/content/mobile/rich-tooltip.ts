import type { ComponentDoc } from "../types";

export const richTooltip: ComponentDoc = {
  slug: "rich-tooltip",
  name: "Rich tooltip",
  oneLiner:
    "A tooltip with a subhead, supporting text, and plain-text actions for explanations that need more than a label.",
  meta: {
    specUrl: "https://m3.material.io/components/tooltips",
    status: "real",
    package: "@xoroh/kern-native",
    nativePeer: "RichTooltip",
    variants: [],
    elevation: 2,
  },
  parts: ["RichTooltip"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // The contract, read off the component: FOCUS is the trigger on this
  // renderer — touch has no hover, and the hint is never hidden behind the
  // trigger because it also rides the accessibility hint.
  keyboard: [
    {
      key: "Focus (keyboard, switch, TV)",
      action:
        "Opens the surface. The title and the text ride the trigger's accessibility hint whether or not the surface is showing, so nothing is trapped behind the focus.",
    },
    {
      key: "Blur",
      action:
        "Closes the surface — the trigger closes it as soon as it loses focus.",
    },
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Activates one of the surface's actions. They are real buttons in the accessibility tree after the trigger.",
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
