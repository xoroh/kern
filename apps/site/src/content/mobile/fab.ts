import type { ComponentDoc } from "../types";

export const fab: ComponentDoc = {
  slug: "fab",
  name: "Fab",
  oneLiner:
    "The floating action button is the one primary action of a screen, raised and always within thumb reach.",
  features:
    "Reach for a fab when a screen has exactly one action that matters most — compose, add, navigate — and that action should be available without scrolling. Material 3's fab variants are a SIZE axis, not an emphasis axis, so `size` walks small 40, default 56, medium 80 and large 96 plus kern's compact `icon`; `color` walks the seven expressive styles with the container/ink pairing resolved per style. The fab rests at elevation level 3 — it is one of the few components that genuinely floats — and `fabStyles` is exported so the same raised surface can back a custom pressable.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Fab",
    variants: [
      "size: default · small · medium · large · icon",
      "color: surface · primary · secondary · tertiary · primary-fill · secondary-fill · tertiary-fill",
    ],
    // M3's "fab" row rests at level 3, and `fabStyles` ships it.
    elevation: 3,
  },
  parts: ["Fab"],
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action: "Activates the focused fab — one press, the screen's one action.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Announces as a button with its `label`; double-tap runs the action. Keep `label` in step with the visible content.",
    },
  ],
  usage: {
    do: [
      "Give a screen exactly one fab for its one primary action — compose, add, go.",
      "Pick the size by emphasis context: default 56 for the standard case, small 40 for compact, medium 80 / large 96 for expressive emphasis.",
      "`color` defaults to the primary treatment; the six other styles retint without changing the elevation.",
    ],
    dont: [
      "Don't put two fabs on one screen — one primary action means one fab.",
      "Don't use a fab for navigation between destinations — that is the navigation bar's job.",
      "Don't ship a fab with no `onPress` — a floating decoration in the wrong place.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "theme.color.primaryContainer",
      value: "primaryContainer (default `primary`), level 3",
    },
    {
      element: "Ink",
      state: "resting",
      token: "theme.color.onPrimaryContainer",
      value: "onPrimaryContainer label and glyph",
    },
    {
      element: "Container shape",
      state: "resting",
      token: "theme.shape.large",
      value: "large corners (lowered rests at level 1)",
    },
    {
      element: "Surface option",
      state: "resting",
      token: "theme.color.surfaceContainerHigh",
      value: "surfaceContainerHigh with primary ink for the `surface` style",
    },
  ],
  faq: [
    {
      q: "Which size?",
      a: "Default 56 is the standard fab. Small 40 is compact-only (deprecated for general use); medium 80 and large 96 are expressive emphasis; icon is the 56 square for rails.",
    },
    {
      q: "How does this differ from the web fab?",
      a: "Same size axis, same seven color styles, same level-3 resting elevation (Android elevation 3dp, iOS quartet to match). The `lowered` treatment rests at level 1 on both renderers.",
    },
  ],
  customization: {
    supported: [
      "`size` is the M3 size axis: `default`, `small`, `medium`, `large` — plus `icon` for the compact square treatment kern adds for rails.",
      "`children` is the fab's text content and `label` is its accessibility label; keep them in step.",
      "`style` is a pressable style function or view style. `fabStyles` is exported for the raised surface without the component.",
    ],
    notSupported: [
      "There is no `variant` axis. M3's fab variants are SIZES; color is the separate `color` axis with the seven expressive styles.",
      "There is no icon slot — content renders as text. A fab whose glyph is an icon is a composed pressable on `fabStyles`, or the `IconButton` in a raised treatment.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: "The fab's content, rendered as `label` text. Keep it to a word or a glyph character — the fab is one action, not a sentence.",
    },
    {
      name: "label",
      type: "string",
      note: "The accessibility label. Set it whenever `children` is a glyph character that would be announced wrongly.",
    },
    {
      name: "size",
      type: 'NativeFabSize ("default" | "small" | "medium" | "large" | "icon")',
      default: '"default"',
      note: "The M3 size axis, plus kern's compact `icon` square. Sizes change the box, never the emphasis.",
    },
    {
      name: "onPress",
      type: 'PressableProps["onPress"]',
      required: true,
      note: "The one action. A fab with no press is decoration in the wrong place.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Dims the fab to half opacity and swallows presses.",
    },
    {
      name: "hitSlop",
      type: "Insets",
      default: "8 on every edge",
      note: "The touch target is padded past the visual box on every edge by default — override only when neighbours are tight.",
    },
    {
      name: "style",
      type: 'PressableProps["style"]',
      note: "Pressable style — function or value, merged after `fabStyles`. `fabStyles` is exported for the surface alone.",
    },
  ],
  aria: [
    "The fab is a `button` role pressable labelled by `label` — a glyph-only fab without one is an unnamed control.",
    "Disabled state is real disabled state: the pressable stops accepting presses, not just the paint.",
    "A screen with more than one fab has more than one primary action, which is the thing the fab is for avoiding — use the `FabMenu` or a bar instead.",
  ],
};
