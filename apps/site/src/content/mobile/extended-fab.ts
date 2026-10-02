import type { ComponentDoc } from "../types";

export const extendedFab: ComponentDoc = {
  slug: "extended-fab",
  name: "Extended fab",
  oneLiner:
    "Extended fabs are floating action buttons that carry a label and can collapse to an icon on demand.",
  features:
    "Reach for an extended fab when the primary action needs saying as well as showing: create, compose, add. It is a floating button with a visible label, and the label doubles as the accessible name when it collapses — which is the detail that makes collapsing safe. The collapse is imperative rather than a prop: a handle exposes `collapse`, `expand` and `toggle`, so the HOST decides when it happens — typically when the screen scrolls and the button needs to get out of the way. That keeps the timing with whoever knows about the scroll rather than guessing at it inside the button.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "ExtendedFab",
    variants: [],
    elevation: 3,
  },
  parts: ["ExtendedFab"],
  customization: {
    supported: [
      "`label` is visible and doubles as the accessible name when collapsed.",
      "`ref` exposes an imperative handle with `collapse`, `expand` and `toggle`.",
      "`size` is the shared fab size axis.",
    ],
    notSupported: [
      "There is no `collapsed` prop for declarative control of the visual state — the collapse is imperative, via the handle.",
      "There is no `onScroll` integration. The host decides when to collapse, which is the point of the handle.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "Required. VISIBLE, and it doubles as the accessible name when collapsed — which is what makes collapsing safe.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "The glyph. What remains when the fab collapses.",
    },
    {
      name: "ref",
      type: "React.Ref<NativeExtendedFabHandle>",
      note: "The imperative handle: `collapse()` (to the icon-only fab), `expand()` (restore the labelled fab), `toggle()`. The HOST drives it — typically on scroll — so the timing lives with whoever knows about the scroll.",
    },
    {
      name: "…PressableProps",
      type: "Omit<PressableProps, 'children' | 'style' | 'onPress' | 'ref'>",
      note: "The usual pressable props, minus the four this component owns.",
    },
    {
      name: "style",
      type: "PressableProps['style']",
      note: "React Native pressable styles.",
    },
  ],
  aria: [
    "The label survives collapsing as the accessible name, so the button is never an unnamed glyph however it looks.",
    "The collapse being imperative and host-driven means the change happens at a moment that makes sense — a button that resized itself mid-scroll would move under the reader's attention.",
    "It is the primary action, floating above the content, so it should be reachable and named before the detail around it.",
  ],
};
