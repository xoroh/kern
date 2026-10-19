import type { ComponentDoc } from "../types";

export const stateLayer: ComponentDoc = {
  slug: "state-layer",
  name: "State layer",
  oneLiner:
    "The M3 pressed wash for native: an overlay in the content color at the pressed state-layer opacity, clipped to the container shape.",
  features:
    "Reach for this when a pressable needs pressed feedback and whole-control opacity would dim the label too — Material 3 never dims a control to signal press. The wash reads its opacity from the DTCG states token, so a token change moves every control at once. It is paint, not content: pointer-transparent and hidden from assistive tech. The host Pressable keeps overflow hidden plus the matching radius, or the wash escapes the container shape.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["StateLayer"],
  customization: {
    supported: [
      "`ink` sets the content color the wash is drawn in — usually the surface's on-color.",
      "`radius` must match the container's `borderRadius`; the container clips, the layer does not.",
      "`stateLayerStyle(ink, radius)` spreads the same treatment onto a `View` when a component is not enough; `stateLayerColor(ink)` returns the wash color alone.",
      "`DISABLED_CONTENT_OPACITY` is the shared disabled wash (38%) — use it instead of a per-component literal.",
    ],
    notSupported: [
      "There is no `opacity` prop. The pressed opacity is the token, not a knob.",
      "It reports nothing to assistive tech. A wash that announced itself would be content, not paint.",
    ],
  },
  api: [
    {
      name: "ink",
      type: "string",
      note: "Content (on-) color the wash is drawn in.",
    },
    {
      name: "radius",
      type: "number | undefined",
      note: "Must match the container's `borderRadius` (the container clips it).",
    },
    {
      name: "visible",
      type: "boolean",
      note: "The host `Pressable`'s pressed state — nothing else. Renders null when false.",
    },
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, opt-in only.",
    },
  ],
  aria: [
    "The layer is `pointerEvents='none'`, not accessible, and hidden from assistive tech — pressed state stays on the host control, where it belongs.",
  ],
};
