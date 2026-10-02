import type { ComponentDoc } from "../types";

export const toggle: ComponentDoc = {
  slug: "toggle",
  name: "Toggle",
  oneLiner:
    "Toggles are buttons that stay pressed, for a setting you switch on and off.",
  features:
    "Reach for a toggle when the thing is a button first and a state second: bold in a toolbar, a pinned item, a starred row. It is pressed or it is not, and it looks like the button you pressed to get there. Inside a ToggleGroup it becomes one option in a set — pass it a `value` and it joins the group's selection. If the control applies a setting immediately and has no button identity, that is a switch; if it picks one of several, that is a segmented control or a radio group.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Toggle",
    // No variant axis. Pressed and unpressed are states, not treatments.
    variants: [],
    elevation: "surface",
  },
  parts: ["Toggle"],
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
  ],
  aria: [
    "The toggle is a real button with `aria-pressed`, so its state is announced as pressed or not pressed rather than implied by colour.",
    "Space and Enter toggle it.",
    "An icon-only toggle has no accessible name from its content, so it needs `aria-label` — the same trap as an icon-only button.",
  ],
};
