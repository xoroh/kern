import type { ComponentDoc } from "../types";

export const toggle: ComponentDoc = {
  slug: "toggle",
  name: "Toggle",
  oneLiner:
    "Toggles are buttons that stay pressed, for a setting you switch on and off.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Toggle",
    // No variant axis. Pressed and unpressed are states, not treatments.
    variants: [],
    elevation: "surface",
  },
  parts: ["Toggle"],
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Flips the toggle. It is a real button carrying `aria-pressed`, so the press is the browser's and the state is announced rather than implied by colour.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves focus into and out of the toggle. A disabled toggle is skipped in the tab order.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the toggle's own classes.",
      "Pressed state is exposed as `data-pressed`, so a stylesheet can restyle it without new props.",
      "The pressed colours come from the primary roles, so a theme moves every toggle at once.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop. One treatment, one height.",
      "There is no `label` prop. The toggle's text is its children; an icon-only toggle needs an `aria-label` of its own.",
      "There is no `color` or `tone` prop. The pressed look is the primary roles.",
    ],
  },
  api: [
    {
      name: "value",
      type: "Value",
      note: "The generic value this toggle contributes to a `ToggleGroup`'s selection. Inside a group, pass it — it is how the group knows which option this is. On its own it is unnecessary.",
    },
    {
      name: "pressed",
      type: "boolean",
      note: "Controlled pressed state. Omit for uncontrolled.",
    },
    {
      name: "defaultPressed",
      type: "boolean",
      note: "Initial state when uncontrolled.",
    },
    {
      name: "onPressedChange",
      type: "(pressed: boolean, eventDetails: object) => void",
      note: "Fires on every change, including keyboard activation.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Blocks interaction and dims the toggle.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the toggle's own classes.",
    },
    {
      name: "nativeButton",
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "render",
      type: "ReactElement<unknown, string | JSXElementConstructor<any>> | ComponentRenderFn<HTMLProps, ToggleState> | undefined",
      note: "Replaces the toggle element with another tag or composes it with another component — the render function receives the toggle's props and state. Set `nativeButton` when the replacement is a native `<button>`.",
    },
    {
      name: "style",
      type: "CSSProperties | ((state: ToggleState) => CSSProperties | undefined) | undefined",
      note: "Style for the toggle, or a function of its state (pressed, disabled) returning style.",
    },
  ],
  aria: [
    "The toggle is a real button with `aria-pressed`, so its state is announced as pressed or not pressed rather than implied by colour.",
    "Space and Enter toggle it.",
    "An icon-only toggle has no accessible name from its content, so it needs `aria-label` — the same trap as an icon-only button.",
  ],
};
