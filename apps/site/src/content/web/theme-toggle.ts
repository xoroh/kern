import type { ComponentDoc } from "../types";

export const themeToggle: ComponentDoc = {
  slug: "theme-toggle",
  name: "ThemeToggle",
  oneLiner: "One action that switches the color scheme between light and dark.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ThemeToggle",
    variants: ["variant: IconButtonVariant"],
    elevation: 0,
  },
  parts: ["ThemeToggle"],
  // The keyboard contract, read off the icon button underneath: it is one
  // real button, and the toggle form is what carries the state.
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the button and switches the scheme. The accessible name names the DESTINATION, so the announcement is the same before and after the press.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the toggle — it is a single button, not a pair of controls.",
    },
  ],
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
    {
      name: "testID",
      type: "string | undefined",
      note: "Test selector, rendered as `data-testid` on the button. Opt-in only — no default.",
    },
  ],
  aria: [
    'The accessible label always names the destination ("Switch to light" while dark, "Switch to dark" while light) per M3 accessibility guidelines.',
    "`aria-pressed` reflects whether dark mode is currently active.",
    "Operable via keyboard (Enter/Space) and maintains a `48dp` minimum touch target.",
  ],
};
