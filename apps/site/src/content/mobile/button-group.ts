import type { ComponentDoc } from "../types";

export const buttonGroup: ComponentDoc = {
  slug: "button-group",
  name: "Button group",
  oneLiner:
    "The button group lays out buttons as one joined row or column, so related actions read as a set.",
  features:
    "Reach for a button group when two or more actions belong together and should look joined: a pair of equal choices, a toolbar cluster, a step of related commands. It is pure LAYOUT — a `View` with a direction and a hairline gap — so the buttons inside keep their own treatments, states and press handling. The group itself announces nothing (`role` is `none` on purpose): a group of buttons is still just buttons to assistive technology, and inventing a container role would promise semantics the group does not carry.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ButtonGroup",
    variants: ["orientation: horizontal · vertical"],
    elevation: "surface",
  },
  parts: ["ButtonGroup"],
  customization: {
    supported: [
      "`orientation` is the only layout decision: a joined row or a joined column.",
      "`children` is a plain slot — any controls that make sense adjacent make sense here.",
      "`style` is a React Native `ViewStyle`, merged after the orientation layout.",
    ],
    notSupported: [
      "There is no selection or radio behaviour. A group that picks one option is a `SegmentedButton` or a `RadioGroup`, not this.",
      "The group does not style its children — each button keeps its own `variant` and `size`. Joining is spacing, not a shared treatment.",
      "There is no `disabled` for the group. Disable the buttons themselves, so each one reports its own state.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: "The controls. The group lays them out; it does not restyle or restate them.",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      note: "A joined row or a joined column. The gap between controls is the same either way.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles, merged after the orientation layout.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-button-group"',
      note: "Test hook for the group.",
    },
  ],
  aria: [
    "The group reports `none` role: it is layout, and each button inside remains the named control.",
    "Keyboard and screen-reader order is the children's order — put them in the order the actions should be encountered.",
  ],
};
