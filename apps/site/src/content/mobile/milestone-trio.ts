import type { ComponentDoc } from "../types";

export const milestoneTrio: ComponentDoc = {
  slug: "milestone-trio",
  name: "Milestone trio",
  oneLiner:
    "Milestone trios show where someone is in a short sequence — done, current, and what is left.",
  features:
    "Reach for a milestone trio when a flow has a few named stages and the person should see where they are: onboarding, a checkout, a setup. The steps are labels and `progress` is the completed COUNT, so the display is derived rather than each step being styled by hand. The three states are the point: a done step is full, the current one is a pulsing loader, and what is left is dim. That gives the row a readable shape — you can see what is finished, what is happening now, and what is still ahead without reading a word.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only feedback composition. No web export to name.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["MilestoneTrio"],
  customization: {
    supported: [
      "`steps` are labels — `['Auth', 'Organisation', 'Workspace']` — and `progress` is the completed count.",
      "`size` is the shared feedback size axis, and `color` overrides the fill.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no per-step state prop. States are DERIVED from `progress`, which is what keeps the row consistent.",
      "There is no `onStepPress`. It is a display of where you are, not a control for jumping — a clickable stepper is a different component.",
      "There is no `max` or arbitrary step count styling. It is built for a short sequence.",
    ],
  },
  api: [
    {
      name: "steps",
      type: "readonly string[]",
      note: "Step labels, e.g. `['Auth', 'Organisation', 'Workspace']`. Labels FOLLOW the step state in the rendering.",
    },
    {
      name: "progress",
      type: "number",
      note: "Completed step count, 0..steps.length. The three states are DERIVED from it: done = full, current = pulsing loader, todo = dim.",
    },
    {
      name: "size / color",
      type: "FeedbackSize / string",
      note: "The shared feedback size axis, and a fill override.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "milestoneStepStyles",
      type: "(…) => Styles",
      note: "Exported helper for one step of the trio, if you want the states without the component.",
    },
  ],
  aria: [
    "The labels are announced with their state, so where you are is SAID and not only shown by fill and dimming.",
    "The current step is a pulsing loader — motion that means \"in progress\", which is worth having described in the label rather than left to the animation.",
    "It is a display, not a control: there is no way to jump to a step, so nothing here promises navigation it cannot provide.",
  ],
};
