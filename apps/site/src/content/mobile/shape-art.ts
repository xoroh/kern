import type { ComponentDoc } from "../types";

export const shapeArt: ComponentDoc = {
  slug: "shape-art",
  name: "Shape art",
  oneLiner:
    "Shape art composes kern shapes into a decorative arrangement — scatter, stack or arch.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only kern brand surface. No web export to name.
    nativePeer: "none",
    variants: ["layout: scatter · stack · arch"],
    elevation: "surface",
  },
  parts: ["ShapeArt", "ExpressiveShape"],
  // Decoration BY CONSTRUCTION: the composition is hidden from the
  // accessibility tree and carries no product vocabulary. It takes no focus,
  // handles no key and exposes no state — so there is no keyboard contract to
  // write, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`layout` is the three arrangements — `scatter`, `stack`, `arch`.",
      "`size` scales the composition and `opacity` fades it.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `pieces` or custom composition prop. The arrangements are kern's, which is what makes the mark recognisable.",
      "There is no `color` prop here. Colour belongs to the `Shape` pieces and the classification hues they allow.",
      "There is no animation.",
    ],
  },
  api: [
    {
      name: "layout",
      type: '"scatter" | "stack" | "arch"',
      default: '"scatter"',
      note: "The three arrangements. Fixed compositions rather than a freeform list, so the mark stays kern's.",
    },
    {
      name: "size",
      type: "number",
      note: "Scales the whole composition.",
    },
    {
      name: "opacity",
      type: "number",
      note: "Fades the composition — useful when it sits behind content.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
    {
      name: "pieces",
      type: "internal",
      note: "Each piece is placed by FRACTION of the composition size (`edge`, `x`, `y`) with an optional rotation, not by pixels — which is why the arrangement holds at any size. Not exposed as a prop.",
    },
  ],
  aria: [
    "It is decoration and carries no content, so it should be hidden from assistive tech rather than announced as an empty region.",
    "If it stands for anything a reader needs, that meaning must be in text beside it — a composition of shapes says nothing on its own.",
    "Being fraction-based is what keeps the mark recognisable at every size, so it stays kern's mark rather than degrading into loose dots.",
  ],
};
