import type { ComponentDoc } from "../types";

export const shapeArt: ComponentDoc = {
  slug: "shape-art",
  name: "Shape art",
  oneLiner:
    "Shape art composes kern shapes into a decorative arrangement — scatter, stack or arch.",
  features:
    "Reach for shape art when an empty state, a boot screen or a hero wants a mark that is unmistakably kern without being a logo. It arranges `Shape` pieces in one of three layouts — `scatter`, `stack`, `arch` — and every piece is placed by FRACTION of the composition size rather than by pixels, so the arrangement holds together at any size. It is decoration through and through: no content, no meaning, no state. If something needs saying, say it in text beside it.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only kern brand surface. No web export to name.
    nativePeer: "none",
    variants: ["layout: scatter · stack · arch"],
    elevation: "surface",
  },
  parts: ["ShapeArt"],
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
