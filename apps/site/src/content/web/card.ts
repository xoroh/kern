import type { ComponentDoc } from "../types";

export const card: ComponentDoc = {
  slug: "card",
  name: "Card",
  oneLiner: "Cards group related content and actions into a single surface.",
  features:
    "Reach for a card when several pieces of information belong together and travel together: a product with its price and its action, a summary with its numbers, a person with their role. A card is a container, so it wants content that can stand alone — if the content only makes sense in context with what is around it, a divider or a heading is probably doing the job better. Cards are most legible in a grid, where their shared shape does the grouping for you.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/cards",
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
  usage: {
    do: [
      "Use one card per subject with scan-first hierarchy: headline, supporting text, actions.",
      "Pick the variant by style alone — all three share legibility and function.",
      "Group related cards in grids, lists, or carousels at shared resting elevation.",
    ],
    dont: [
      "Don't force non-card content into cards — spacing, headlines, or dividers may serve better.",
      "Don't nest interactivity — directly actionable or container-with-actions, never both.",
      "Don't scroll inside cards — expand to reveal instead.",
    ],
  },
  tokens: [
    {
      element: "Elevated container",
      state: "resting",
      token: "comp.card.elevated",
      value: "surface-container-low, level1, 12px",
    },
    {
      element: "Filled container",
      state: "resting",
      token: "comp.card.filled",
      value: "surface-container-highest, 12px",
    },
    {
      element: "Outlined container",
      state: "resting",
      token: "comp.card.outlined",
      value: "surface + outline-variant, 12px",
    },
  ],
  faq: [
    {
      q: "Which card variant?",
      a: "Style choice only: elevated for separation with shadow, filled for subtle separation, outlined for a visible boundary with the most emphasis.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes.",
      "`as` changes the rendered element, so a card that is really a link can render an `<a>` and keep its semantics.",
      "Colour comes from `--sys-color-surface` and the outline roles, so a theme moves every card at once.",
    ],
    notSupported: [
      "There is no `padding` or `spacing` prop. A card is a bare surface — the content inside it owns its padding, which is what lets a card hold an image flush to its edge.",
      "There is no `radius` or `shape` prop. The corner is `--sys-shape-corner-small`.",
      "Resting elevation is not a prop. `elevated` is the variant that lifts, to `--sys-elevation-level1`; `filled` and `outlined` carry no token and rest on the surface.",
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
