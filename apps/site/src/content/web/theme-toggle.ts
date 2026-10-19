import type { ComponentDoc } from "../types";

export const themeToggle: ComponentDoc = {
  slug: "theme-toggle",
  name: "ThemeToggle",
  oneLiner: "One action that switches the color scheme between light and dark.",
  features:
    "Built on IconButton toggle form with M3 state layers, `48dp` minimum touch target, and destination-named accessible labels per M3 accessibility guidelines (“Switch to light” while dark, “Switch to dark” while light). Supports uncontrolled zero-config drop-in backed by useColorScheme or controlled host mode and onToggle.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ThemeToggle",
    variants: ["variant: IconButtonVariant"],
    elevation: 0,
  },
  parts: ["ThemeToggle"],
  customization: {
    supported: [
      "`mode` and `onToggle` for controlled host state; defaults to automatic theme switching via `useColorScheme()` when omitted.",
      "`variant` selects the M3 icon button visual emphasis (standard, filled, tonal, outlined).",
      "`label` and `selectedLabel` for custom accessible names; defaults to destination-based action labels.",
      "`sunIcon` and `moonIcon` slots for custom glyph overrides.",
      "`className` is passed through and merged after the button's own classes.",
    ],
    notSupported: [
      "There is no visible text label. An icon button with visible text is a regular Button.",
    ],
  },
  deviations: [
    {
      id: "K11",
      spec: 'M3\'s component elevation table names no toggle row. It tabulates "menu" and "rich tooltip" at level 2 and "dialogs (modal)" at level 3, but no row describes a toggle resting elevation.',
      kern: "The toggle rests at elevation level 0 — no shadow token; level 0 is shadow: none.",
      why: "A borderless round action has no container to lift — a shadow would invent elevation M3 never assigned. The level-0 claim is registered in the elevation inventory so it is asserted rather than assumed.",
    },
  ],
  api: [
    {
      name: "mode",
      type: "'light' | 'dark'",
      note: "Current mode when controlled by the host. Omit for zero-config uncontrolled theme switching.",
    },
    {
      name: "onToggle",
      type: "() => void",
      note: "Controlled change handler called when the toggle is activated.",
    },
    {
      name: "variant",
      type: "IconButtonVariant",
      note: "M3 icon button visual variant: 'standard' | 'filled' | 'tonal' | 'outlined'. Defaults to 'standard'.",
    },
    {
      name: "label",
      type: "string",
      note: "Accessible name override for the toggle action. Defaults to destination-based names.",
    },
    {
      name: "selectedLabel",
      type: "string",
      note: "Accessible name override when toggled.",
    },
    {
      name: "sunIcon",
      type: "ReactNode",
      note: "Custom icon to render for the light mode destination.",
    },
    {
      name: "moonIcon",
      type: "ReactNode",
      note: "Custom icon to render for the dark mode destination.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and dims the button.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the button's own classes.",
    },
  ],
  aria: [
    'The accessible label always names the destination ("Switch to light" while dark, "Switch to dark" while light) per M3 accessibility guidelines.',
    "`aria-pressed` reflects whether dark mode is currently active.",
    "Operable via keyboard (Enter/Space) and maintains a `48dp` minimum touch target.",
  ],
};
