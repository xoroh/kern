import type { ComponentDoc } from "../types";

export const buttonGroup: ComponentDoc = {
  slug: "button-group",
  name: "Button group",
  oneLiner: "Button groups join buttons into one segmented control.",
  features:
    "Reach for a button group when several buttons are really one control with several answers: a set of view modes, a run of related commands that belong together. The join is the value — the buttons stop reading as separate targets and start reading as one thing with options. Each button keeps its own variant, so the group changes the shape without deciding the emphasis. If only one option can be selected, `SegmentedButton` is the more precise tool; this one is for actions that happen to sit together.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/button-groups",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ButtonGroup",
    variants: ["orientation: horizontal · vertical"],
    elevation: "surface",
  },
  parts: ["ButtonGroup"],
  customization: {
    supported: [
      "`className` is passed through and merged after the group's own classes.",
      "`orientation` lays the joined buttons along either axis.",
      "Children keep their own `variant`, so the group decides the join and the buttons decide the emphasis.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop on the group. Those belong to the buttons inside it.",
      "There is no `attached` toggle. Joined is the whole point; separate buttons are separate buttons.",
    ],
  },
  api: [
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
