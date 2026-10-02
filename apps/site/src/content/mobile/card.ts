import type { ComponentDoc } from "../types";

export const card: ComponentDoc = {
  slug: "card",
  name: "Card",
  oneLiner:
    "Cards group related content on one surface, in three Material 3 treatments.",
  features:
    "Reach for a card when several things belong together and should read as one unit: an item and its actions, a summary and its detail. The three variants are Material 3's — `filled`, `outlined` and `elevated` — and the difference is how the card separates from what is behind it: a fill, a hairline, or a shadow. Choose the quietest one that works. `elevated` is the only one that raises, and it is also the one to use sparingly: a screen where every card is elevated is a screen with no hierarchy. The card is a `View`, so what goes inside is entirely yours.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Card",
    variants: ["variant: filled · outlined · elevated"],
    // Material 3 tabulates two rows: `card (elevated)` at level 1 and
    // `cards (filled, outlined)` at level 0. The family claims 0 — the base
    // treatment, `shadow: none` — and the `elevated` variant's level 1 is
    // documented in Customization, same as Button's two-row case.
    elevation: 0,
  },
  parts: ["Card"],
  customization: {
    supported: [
      "`variant` is the three Material 3 card treatments. Note the two elevation rows Material 3 tabulates: `cards (filled, outlined)` rest at level 0 (`shadow: none`) and `card (elevated)` at level 1. The page claims the base, 0; `elevated` is the one that raises.",
      "`children` is a plain slot — the card is a `View` and the content is yours.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There are no `title`/`media`/`actions` slots. Those are a card COMPOSITION you build inside this surface.",
      "There is no `interactive` or `onPress` prop. A pressable card is a `ListItem`, or a card you put a control in.",
      "There is no `size` or `density` prop. The card is as big as its content and its container.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"filled" | "outlined" | "elevated"',
      default: '"filled"',
      note: "The three Material 3 treatments. `filled` is a fill, `outlined` a hairline, `elevated` the only one that raises — and the one to use sparingly.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The content. The card is a `View` with the treatment applied; the composition is yours.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. `cardStyles` is exported if you want the treatment without the component.",
    },
  ],
  aria: [
    "A card groups content visually; whether that grouping is announced depends on how you label what is inside.",
    "`elevated` is the only variant that raises the surface, so it is the one that most changes the reading order's emphasis.",
    "There is no interactive role by default — a card is a container, not a control.",
  ],
};
