import type { ComponentDoc } from "../types";

export const card: ComponentDoc = {
  slug: "card",
  name: "Card",
  oneLiner: "Cards group related content and actions into a single surface.",
  features:
    "Reach for a card when several pieces of information belong together and travel together: a product with its price and its action, a summary with its numbers, a person with their role. A card is a container, so it wants content that can stand alone — if the content only makes sense in context with what is around it, a divider or a heading is probably doing the job better. Cards are most legible in a grid, where their shared shape does the grouping for you.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Card",
    variants: ["variant: filled · outlined · elevated"],
    // M3's row "card (elevated)" rests at level 1, and `m3-elevation.ts` gates
    // the family against that row. Note that `filled` and `outlined` carry no
    // token and rest on the surface — see Customization.
    elevation: 1,
  },
  parts: ["Card"],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes.",
      "`as` changes the rendered element, so a card that is really a link can render an `<a>` and keep its semantics.",
      "Colour comes from `--md-sys-color-surface` and the outline roles, so a theme moves every card at once.",
    ],
    notSupported: [
      "There is no `padding` or `spacing` prop. A card is a bare surface — the content inside it owns its padding, which is what lets a card hold an image flush to its edge.",
      "There is no `radius` or `shape` prop. The corner is `--md-sys-shape-corner-small`.",
      "Resting elevation is not a prop. `elevated` is the variant that lifts, to `--md-sys-elevation-level1`; `filled` and `outlined` carry no token and rest on the surface.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"filled" | "outlined" | "elevated"',
      default: '"filled"',
      note: "M3's three card treatments. Only `elevated` carries an elevation token.",
    },
    {
      name: "as",
      type: "ElementType",
      default: '"div"',
      note: "Polymorphic: changes the element the card renders, and its props follow the element you pick.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant classes.",
    },
  ],
};
