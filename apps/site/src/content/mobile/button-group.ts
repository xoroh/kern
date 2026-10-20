import type { ComponentDoc } from "../types";

export const buttonGroup: ComponentDoc = {
  slug: "button-group",
  name: "Button group",
  oneLiner:
    "The button group lays out buttons as one joined row or column, so related actions read as a set.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ButtonGroup",
    variants: [
      "variant: connected · standard",
      "orientation: horizontal · vertical",
    ],
    elevation: "surface",
  },
  parts: ["ButtonGroup"],
  // M2: the group reports the `none` role — it is layout. It takes no
  // focus and answers no key; the buttons inside it are what the screen
  // reader reaches.
  nonInteractive: true,
  customization: {
    supported: [
      "`orientation` is the only layout decision: a joined row or a joined column.",
      "`children` is a plain slot — any controls that make sense adjacent make sense here.",
      "`style` is a React Native `ViewStyle`, merged after the orientation layout.",
    ],
    notSupported: [
      "There is no selection or radio behaviour. A group that picks one option is a `SegmentedButton` or a `RadioGroup`, not this.",
      "The group does not style its children — each button keeps its own `variant` and `size`. `connected` joins by adjacency; `standard` spaces.",
      "There is no `disabled` for the group. Disable the buttons themselves, so each one reports its own state.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"connected" | "standard"',
      default: '"connected"',
      note: "M3 Expressive group variant. Connected joins into one control with no gap (the expressive successor to the segmented button); standard spaces the buttons as individuals.",
    },
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
