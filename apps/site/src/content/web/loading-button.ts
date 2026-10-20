import type { ComponentDoc } from "../types";

export const loadingButton: ComponentDoc = {
  slug: "loading-button",
  name: "Loading button",
  oneLiner:
    "Loading buttons show that the action they trigger is still running, without changing size.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "LoadingButton",
    // No variant axis. It is a `Button` plus a loading state.
    variants: [],
    // A `Button` at rest: no elevation token, matching the button family.
    elevation: "surface",
  },
  parts: ["LoadingButton"],
  // The contract, read off the button: it is a real button, and while it is
  // loading it is disabled — which is what makes a double submit impossible.
  keyboard: [
    {
      key: "Enter / Space",
      action:
        "Activates the button when it is idle. While `loading` is set the button is disabled, so the action cannot be fired a second time.",
    },
    {
      key: "Tab",
      action:
        "Reaches the button as an ordinary stop — unless it is loading, because a disabled button is out of the tab order entirely.",
    },
  ],
  customization: {
    supported: [
      "Everything `Button` supports — `variant`, `size`, `className` — because it takes `ButtonProps` and adds to them.",
      "`value` between 0 and 1 makes the wait determinate; omitting it gives the indeterminate loop.",
      "`loaderStyle` picks the indicator, defaulting to Material 3's ring.",
    ],
    notSupported: [
      "There is no `loadingText` prop. The label stays as it is — replacing it is what the no-resize rule exists to prevent.",
      "There is no `loadingPosition` prop. The indicator takes the leading slot.",
      "There is no `success` state. A completed action is the caller's to report, usually with a snackbar.",
    ],
  },
  api: [
    {
      name: "loading",
      type: "boolean",
      note: "Shows the embedded indicator and blocks interaction, so the action cannot be fired twice while it runs.",
    },
    {
      name: "value",
      type: "number",
      note: "Determinate progress between 0 and 1 while loading. Omit it for the indeterminate loop — the same choice `Progress` makes, expressed here as a prop because the button has one thing to report.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle",
      default: '"spinner"',
      note: "The indicator's look. Defaults to the Material 3 ring.",
    },
    {
      name: "variant",
      type: '"elevated" | "filled" | "tonal" | "outlined" | "text"',
      default: '"filled"',
      note: "Inherited from `Button` unchanged — this is the button family's five configurations.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the button's own classes.",
    },
  ],
  aria: [
    "It is a button, so it keeps its name throughout — the label does not change while loading, which is the whole point.",
    "While loading it is disabled, so a screen reader announces it as unavailable and a second activation is impossible.",
    "The indicator is decoration next to that state; the state is what gets announced.",
  ],
};
