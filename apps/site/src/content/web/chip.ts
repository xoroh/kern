import type { ComponentDoc } from "../types";

export const chip: ComponentDoc = {
  slug: "chip",
  name: "Chip",
  oneLiner:
    "Chips are compact elements that represent an attribute, an action, or a filter.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/chips",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Chip",
    variants: ["variant: assist · filter · input · suggestion"],
    // M3 places Chips at resting level 0, and level 0 is `shadow: none`. kern
    // ships no elevation token on Chip, which is the conformant state — the
    // gate asserts the absence, so adding an unearned shadow later fails.
    elevation: 0,
  },
  parts: ["Chip"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of each chip. Disabled chips are skipped.",
    },
    {
      key: "Space / Enter",
      action: "Activates, selects, or deselects the focused chip.",
    },
    {
      key: "Backspace / Delete",
      action: "Removes the focused input chip.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes.",
      "`variant` selects one of M3's four chip kinds; the container and label colour come from the system roles.",
      "Selection state is exposed as `data-selected`, so a stylesheet can restyle a selected chip without touching the component.",
    ],
    notSupported: [
      "There is no `size` prop. Chips are one height, which is what makes a row of them line up.",
      "There is no `color` prop. The selected filter chip uses the primary roles; a different colour is a theme change.",
      'Selection is not available on every variant. `value`, `defaultValue` and `onValueChange` are accepted only when `variant` is `"filter"`.',
    ],
  },
  api: [
    {
      name: "variant",
      type: '"assist" | "filter" | "input" | "suggestion"',
      default: '"assist"',
      note: "M3's four chip kinds. The kind decides whether the chip can be selected at all.",
    },
    {
      name: "value",
      type: "boolean",
      note: 'Controlled selection. Only on `variant="filter"`.',
    },
    {
      name: "defaultValue",
      type: "boolean",
      note: "Initial selection when uncontrolled. Filter only.",
    },
    {
      name: "onValueChange",
      type: "(selected: boolean) => void",
      note: "Fires on selection change. Filter only.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and dims the chip.",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
    },
    {
      name: "elevated",
      type: "boolean | undefined",
      note: "M3 elevated treatment (assist + filter): level1 shadow on the surface-container-low fill. Ignored for input/suggestion chips, which have no elevated treatment.",
    },
  ],
  aria: [
    "The chip renders a real `<button>`, so it is reachable and activatable by keyboard without extra wiring.",
    "A filter chip reflects its state as `aria-pressed`, so a screen reader announces whether it is on.",
    "The accessible name comes from the chip's text. An icon-only chip needs a label of its own.",
  ],
};
