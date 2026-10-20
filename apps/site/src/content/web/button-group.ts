import type { ComponentDoc } from "../types";

export const buttonGroup: ComponentDoc = {
  slug: "button-group",
  name: "Button group",
  oneLiner: "Button groups join buttons into one segmented control.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/button-groups",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ButtonGroup",
    variants: [
      "variant: connected · standard",
      "orientation: horizontal · vertical",
    ],
    elevation: "surface",
  },
  parts: ["ButtonGroup"],
  // M2: the group is a `role="group"` wrapper, not a control. It takes no
  // focus and answers no key — the buttons inside it are the tab stops, and
  // the join between them is visual, not behavioural.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the group's own classes.",
      "`orientation` lays the joined buttons along either axis.",
      "Children keep their own `variant`, so the group decides the join and the buttons decide the emphasis.",
    ],
    notSupported: [
      "There is no `size` prop on the group. Size belongs to the buttons inside it.",
      "There is no `attached` toggle. Joined is the whole point of `connected`; separate buttons are `standard`.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"connected" | "standard"',
      default: '"connected"',
      note: "M3 Expressive group variant. Connected joins into one control (the expressive successor to the segmented button — use toggle Button children so selection morphs read as the group's state); standard spaces the buttons as individuals.",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      note: "Layout direction of the joined buttons.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the group's own classes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The buttons. The group removes the inner radii and collapses doubled borders between them — that is what makes the join read as one control.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLDivElement>",
      note: "Forwarded to the underlying `<div>`.",
    },
  ],
  aria: [
    "The buttons stay buttons, so each keeps its own name and its own activation — the join is visual, not behavioural.",
    "When the group is one control with one meaning, give it a name so the set is announced as a unit.",
    "Keyboard order follows the buttons as laid out, so `orientation` should match how they actually run.",
  ],
};
