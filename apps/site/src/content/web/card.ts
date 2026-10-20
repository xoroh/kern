import type { ComponentDoc } from "../types";

export const card: ComponentDoc = {
  slug: "card",
  name: "Card",
  oneLiner: "Cards group related content and actions into a single surface.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
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
  parts: ["Card", "CardHeader", "CardContent", "CardActions"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Reaches the card itself only when `as` renders it as a link — otherwise the tab stops are the interactive children, and the card is not one.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the card-as-link, or the focused child control. A plain `div` card takes no key.",
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
  aria: [
    'A plain card exposes no semantics of its own — content reads in order, and the actions row carries `role="group"` so the actions announce as a set.',
    "A card rendered as a link through `as` is the interactive element: it takes focus and activates like the link it is.",
  ],
};
