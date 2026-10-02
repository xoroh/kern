import type { ComponentDoc } from "../types";

export const separator: ComponentDoc = {
  slug: "separator",
  name: "Separator",
  oneLiner: "Separators draw a line between things — horizontal or vertical.",
  features:
    "Reach for a separator when two things need dividing and the division is visual rather than semantic: a break in a toolbar, a rule between list groups. It is a `View` with an `orientation`, and that is the whole component. Note what it is not: a separator is decoration between content, not a heading. If the division names what follows, that is a heading or a group label, and a line alone will not tell anyone where one section ends and the next begins.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Separator",
    variants: ["orientation: horizontal · vertical"],
    elevation: "surface",
  },
  parts: ["Separator"],
  // M2: a divider is a presentational rule — it takes no focus and has no
  // state, so there is nothing to contract for.
  nonInteractive: true,
  customization: {
    supported: [
      "`orientation` is `horizontal` or `vertical`.",
      "`style` is a React Native `ViewStyle`, and `ViewProps` pass through.",
    ],
    notSupported: [
      "There is no `label` or `decorative` prop. A labelled division is a heading, not a separator.",
      "There is no `thickness` or `color` prop — it comes from the scheme.",
    ],
  },
  api: [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      note: "Which way the rule runs.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. `ViewProps` pass through.",
    },
    {
      name: "dividerStyles",
      type: "(…) => ViewStyle",
      note: "The styling helper is exported if you want the rule without the component.",
    },
  ],
  aria: [
    "A separator divides visually. It is decoration between content, and it names nothing.",
    "If a division needs to be understood — one section ending, another beginning — use a heading or a group label instead. A line alone tells a screen reader user nothing.",
    "That is why there is no `label` prop: a separator that had to be announced would not be a separator.",
  ],
};
