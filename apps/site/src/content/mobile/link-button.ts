import type { ComponentDoc } from "../types";

export const linkButton: ComponentDoc = {
  slug: "link-button",
  name: "LinkButton",
  oneLiner:
    "The button treatment on a navigation control: five Material 3 treatments, the link role, one press to a destination.",
  features:
    "Reach for a link button when the destination should wear the button treatment — opening docs, jumping to settings, going outward. It bridges onto the same Button style kernel, so every axis (`variant`, `color`, `size`, `shape`, `block`, `toggle`, `icon`) resolves through the one treatment map and the link can never drift from the button. What differs is the role and the press: `accessibilityRole` is `link`, and without an `onPress` the tap opens `href` via `Linking`, so routing composes by URL on both renderers. `href` is required — a link without one is a button wearing link paint, so use `Button` for that. Trailing icons are coerced to the inline start with a dev warning, matching the web rule.",
  meta: {
    specUrl: "https://m3.material.io/components/buttons",
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "LinkButton",
    variants: [
      "variant: elevated · primary · tonal · outlined · ghost",
      "color: primary · danger",
      "size: xs · default · sm · xl · icon",
      "shape: pill · rounded · square",
    ],
    elevation: 0,
  },
  parts: ["LinkButton"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the link when focused via an external keyboard or switch control.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through links in order; double-tap opens the destination. Disabled links are skipped.",
    },
  ],
  usage: {
    do: [
      "Give every LinkButton an `href` — the destination is the point of the control.",
      "Let the default press open the URL, and pass `onPress` only to add behaviour around navigation.",
      "Keep labels to a few words — the link resolves its height from the `kern.button.size` scale and truncates long text.",
    ],
    dont: [
      "Don't use a LinkButton for in-place actions — saving, sending and opening dialogs are `Button` jobs.",
      "Don't put the icon at the end — M3 link buttons cannot carry trailing icons.",
      "Don't stack multiple primary links — demote the rest to tonal, outlined, or ghost.",
    ],
  },
  tokens: [
    {
      element: "Filled container",
      state: "resting",
      token: "theme.color.primary",
      value: "primary",
    },
    {
      element: "Label",
      state: "resting",
      token: "theme.color.onPrimary",
      value: "onPrimary",
    },
  ],
  customization: {
    supported: [
      "`href` is required and opens via `Linking` unless `onPress` overrides the press.",
      "`variant`, `color`, `size`, `shape`, `block`, `toggle` and `icon` are Button's axes, unchanged.",
      "`style` is a React Native `ViewStyle`; `labelStyle` restyles the label `Text`.",
    ],
    notSupported: [
      "There is no anchor element on this renderer — `target`, `rel` and `download` do not exist here.",
      'There is no trailing-icon slot — `iconPosition="end"` warns and renders leading.',
      "There is no `asChild` takeover — compose routers by URL through `href`.",
    ],
  },
  api: [
    {
      name: "href",
      type: "string",
      required: true,
      note: "The destination. Opens via `Linking` unless `onPress` overrides the press.",
    },
    {
      name: "onPress",
      type: "(event: GestureResponderEvent) => void",
      note: "Overrides the default `Linking.openURL(href)` press.",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: "The label. Strings and numbers render as label text; any other node renders as-is.",
    },
    {
      name: "variant",
      type: 'NativeButtonVariant | NativeButtonM3Variant ("filled" | "text" aliases)',
      default: '"primary"',
      note: "The five M3 treatments, same names as Button — M3 `filled`/`text` resolve to `primary`/`ghost`.",
    },
    {
      name: "color",
      type: 'NativeButtonColor ("primary" | "danger")',
      default: '"primary"',
      note: "The error treatment, not a variant. `danger` re-paints the variant's structure in the error roles.",
    },
    {
      name: "size",
      type: 'NativeButtonSize ("xs" | "default" | "sm" | "xl" | "icon")',
      default: '"default"',
      note: "The box axis. Smaller sizes widen the hit slop so the touch target holds.",
    },
    {
      name: "shape",
      type: 'NativeButtonShape ("pill" | "rounded" | "square")',
      default: '"pill"',
      note: "The corner role: the M3 full pill, the stepped-down large corner, or none.",
    },
    {
      name: "block",
      type: "boolean",
      default: "false",
      note: "Full-width link via `alignSelf: stretch`.",
    },
    {
      name: "toggle",
      type: "boolean",
      default: "false",
      note: "M3 Expressive toggle mode, forwarded to the Button treatment.",
    },
    {
      name: "pressed",
      type: "boolean",
      note: "Controlled selected state. Only meaningful with `toggle`.",
    },
    {
      name: "defaultPressed",
      type: "boolean",
      default: "false",
      note: "Initial selected state for the uncontrolled toggle case.",
    },
    {
      name: "onPressedChange",
      type: "(pressed: boolean) => void",
      note: "Fires when the toggle selection flips.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: 'Renders leading beside the label. There is no trailing slot — `iconPosition="end"` warns and renders leading.',
    },
    {
      name: "iconPosition",
      type: '"start" | "end"',
      default: '"start"',
      note: "`end` is ignored with a dev warning: M3 link buttons cannot carry trailing icons.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Blocks the press and reports `disabled` state; the URL never opens.",
    },
    {
      name: "labelStyle",
      type: "StyleProp<TextStyle>",
      note: "Restyles the label text only when `children` is text.",
    },
    {
      name: "style",
      type: 'PressableProps["style"]',
      note: "Pressable style — function or value, merged after `buttonStyles`.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-link-button"',
      note: "Test hook for the pressable.",
    },
  ],
  aria: [
    "Every link is a `link` role pressable reporting `disabled` in its accessibility state — the state is announced, not just painted.",
    "The `href` is handed as the accessibility hint, so assistive tech can announce the destination.",
    "A glyph-only link is an unnamed control unless the pressable props give it an accessibility label.",
  ],
};
