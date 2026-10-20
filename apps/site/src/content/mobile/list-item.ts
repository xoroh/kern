import type { ComponentDoc } from "../types";

export const listItem: ComponentDoc = {
  slug: "list-item",
  name: "List item",
  oneLiner:
    "List items are one row of a list — a required title, an optional supporting line, and a press.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ListItem",
    variants: [],
    // Material 3 places `list` at resting level 0, and level 0 is
    // `shadow: none` — which is exactly what a list row renders.
    elevation: 0,
  },
  parts: ["ListItem"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "selected"],
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Activates the focused actionable row. Static rows (no `onPress`) are not stops.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Rows announce title plus supporting as one label; actionable rows read as buttons and double-tap activates.",
    },
  ],
  customization: {
    supported: [
      "`title` is required and `supporting` is the second line.",
      "`contentStyle` and `titleStyle` style the content block and the title separately.",
      "`accessibilityRole` is overridable — the row is `Pressable`-based and you can set the role it plays.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `leading`/`trailing` slot in the type. Icons and trailing controls belong in the title row you compose around it.",
      "There is no `selected` prop. A selected row is a state you express through style.",
      "There is no `divider` prop. Separation is `Separator` or the list's own spacing.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      note: "REQUIRED. The row's name. A row with no name is a row nobody can act on.",
    },
    {
      name: "supporting",
      type: "string",
      note: "The second line — the detail that helps someone decide without opening the row.",
    },
    {
      name: "onPress",
      type: "PressableProps['onPress']",
      note: "Fires when the ROW is pressed, not a control inside it. The whole row is the target, which is the right idiom on a compact screen.",
    },
    {
      name: "accessibilityRole",
      type: "PressableProps['accessibilityRole']",
      note: "Overridable. The default suits a pressable row; set it when the row plays a different part.",
    },
    {
      name: "contentStyle / titleStyle",
      type: "StyleProp<ViewStyle> / StyleProp<TextStyle>",
      note: "Two style levels: the content block and the title text, so you can adjust one without the other.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the row itself.",
    },
  ],
  aria: [
    "`title` is required and is the row's name; the row is a real pressable, so the whole thing is operable.",
    "`supporting` is announced after the title, which is what makes the row self-explanatory.",
    "`accessibilityRole` being overridable means the announcement matches the part the row plays rather than always saying the same thing.",
  ],
};
