import type { ComponentDoc } from "../types";

export const pane: ComponentDoc = {
  slug: "pane",
  name: "Pane",
  oneLiner:
    "The pane is a tonal container that separates one region from another — the phone-width mirror of the web pane.",
  features:
    "Reach for a pane when a region must read as its own surface: a settings group on a canvas, a form section, the one card group on a screen. It follows the layered surface law — `canvas` sits on the container ladder behind, `surface` is the white card group on top — so the two variants are positions in the stack, not colours to choose between. The pane is a `View` with a shape radius and optional padding: what goes inside is entirely yours, and the pane's whole job is deciding what the region behind it is made of.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Pane",
    variants: ["variant: canvas · surface"],
    elevation: "surface",
  },
  parts: ["Pane"],
  customization: {
    supported: [
      "`variant` is the layer: `canvas` on the container ladder, `surface` as the card group.",
      "`padded` applies the standard inner spacing; off by default so composed panes control their own rhythm.",
      "`style` is a React Native `ViewStyle`, merged last. The `PaneWidth` scale and `PANE_WIDTHS` ladder are exported from this module and shared with `SupportingPane`.",
    ],
    notSupported: [
      "There is no width prop on the pane itself — it is as wide as its container. Sizing to the width ladder is `SupportingPane`'s job.",
      "There is no elevation or shadow variant. A pane separates by FILL, per the layered surface law; a raised region is a different component.",
      "There is no header, title or actions slot. Those are composition inside the pane, and the pane stays a surface.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"canvas" | "surface"',
      default: '"surface"',
      note: "The layer: `canvas` fills with the surface-container rung, `surface` with the plain surface — the stack position, not a colour pick.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The region's content. The pane is a `View` with the treatment applied; the composition is yours.",
    },
    {
      name: "padded",
      type: "boolean",
      default: "false",
      note: "Applies the standard inner spacing when true. Off by default so composed panes own their rhythm.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles, merged after the treatment.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-pane"',
      note: "Test hook for the pane.",
    },
    {
      name: "PANE_WIDTHS",
      type: "Record<PaneWidth, number | string>",
      note: "Exported width ladder (narrow, default, wide, full) — the scale `SupportingPane` sizes against, kept here so both panes share one ladder.",
    },
  ],
  aria: [
    "The pane reports no role of its own: it is a surface, and the structure inside it is what assistive technology navigates.",
    "Contrast is the pane's accessibility contract — text on a pane's fill must meet contrast against THAT fill, which is why the ink follows the theme rather than being set per pane.",
  ],
};
