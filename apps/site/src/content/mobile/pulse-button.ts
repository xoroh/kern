import type { ComponentDoc } from "../types";

export const pulseButton: ComponentDoc = {
  slug: "pulse-button",
  name: "Pulse button",
  oneLiner:
    "Shape-stable native button that keeps its corner radius locked while animating press feedback with M3 Expressive spring scale physics.",
  meta: {
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern-native",
    nativePeer: "PulseButton",
    variants: [
      "variant: elevated · filled · tonal · outlined · text",
      "color: primary · danger",
      "size: xs · sm · default · md · xl · lg · 2xl · 3xl · icon",
      "shape: pill · rounded · square (locked across states)",
    ],
    elevation: "surface",
  },
  parts: ["PulseButton"],
  states: ["resting", "pressed"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the button when focused via an external keyboard or switch control.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through buttons in order; double-tap activates. Disabled buttons are skipped.",
    },
  ],
  customization: {
    supported: [
      "Shares all `variant`, `color`, `size`, `shape`, `toggle`, and `block` tokens with `Button` via `button-shared.ts` (`morphCorners: false`).",
      "Drives press-in (`0.97`) and press-out (`1.0`) scale via `buttonSpringConfig` from `@xoroh/kern-tokens`.",
      "`onHaptic` fires on `pressIn` and `pressOut`; `reducedMotion` disables the spring scale transform.",
    ],
    notSupported: [
      "Corner radius never morphs on press or toggle; use `Button` when you want M3 Expressive shape morphing.",
    ],
  },
  api: [
    {
      name: "variant",
      type: 'NativePulseButtonVariant ("elevated" | "filled" | "tonal" | "outlined" | "text")',
      default: '"filled"',
      note: "The M3 emphasis treatment, shared with `Button`.",
    },
    {
      name: "color",
      type: 'NativePulseButtonColor ("primary" | "danger")',
      default: '"primary"',
      note: "Primary or error role palette.",
    },
    {
      name: "size",
      type: 'NativePulseButtonSize ("xs" | "sm" | "default" | "md" | "xl" | "lg" | "2xl" | "3xl" | "icon")',
      default: '"default"',
      note: "M3 Expressive size step from XS to XL.",
    },
    {
      name: "shape",
      type: 'NativePulseButtonShape ("pill" | "rounded" | "square")',
      default: '"pill"',
      note: "Locked corner silhouette that does not morph on press or toggle.",
    },
    {
      name: "toggle",
      type: "boolean",
      default: "false",
      note: "Binary toggle mode with `aria-pressed` and locked corners.",
    },
    {
      name: "pressed",
      type: "boolean",
      note: "Controlled selected state when `toggle` is set.",
    },
    {
      name: "defaultPressed",
      type: "boolean",
      default: "false",
      note: "Initial uncontrolled selected state when `toggle` is set.",
    },
    {
      name: "onPressedChange",
      type: "(pressed: boolean) => void",
      note: "Called when toggle selection changes.",
    },
    {
      name: "onHaptic",
      type: '(phase: "pressIn" | "pressOut") => void',
      note: "Optional haptic callback triggered alongside the spring animation.",
    },
    {
      name: "reducedMotion",
      type: "boolean",
      default: "false",
      note: "Disables the spring scale animation when reduced motion is active.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      note: "Shows an inline activity indicator, reports `busy`, and blocks presses.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Optional icon beside the label.",
    },
    {
      name: "iconPosition",
      type: '"start" | "end"',
      default: '"start"',
      note: "Side of the label where `icon` renders.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Button label content.",
    },
    {
      name: "onPress",
      type: 'PressableProps["onPress"]',
      note: "Press handler.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Disables presses and applies the M3 12%/38% disabled treatment.",
    },
  ],
  aria: [
    'Exposes `accessibilityRole="button"` and reports `disabled`, `busy`, and `pressed` states.',
    "Respects `reducedMotion` so users who disable motion still receive state-layer and ripple feedback.",
  ],
};
