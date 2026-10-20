import type { ComponentDoc } from "../types";

export const fab: ComponentDoc = {
  slug: "fab",
  name: "Fab",
  oneLiner:
    "The floating action button is the one primary action of a screen, raised and always within thumb reach.",
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
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
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
