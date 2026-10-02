import type { ComponentDoc } from "../types";

export const loadingButton: ComponentDoc = {
  slug: "loading-button",
  name: "Loading button",
  oneLiner:
    "Loading buttons show that the action they trigger is still running, without changing size.",
  features:
    "Reach for a loading button when someone presses something and then waits: submitting a form, saving, sending. The rule it follows is the important part — it keeps its label and its footprint while loading, so nothing on the page moves when the wait starts. A button that shrinks to a spinner loses its meaning at exactly the moment the person is wondering what they pressed. It blocks interaction while loading, so the action cannot be fired twice. If the wait is long enough to leave the screen, the progress is not the button's problem.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "LoadingButton",
    // No variant axis. It is a `Button` plus a loading state.
    variants: [],
    // A `Button` at rest: no elevation token, matching the button family.
    elevation: "surface",
  },
  parts: ["LoadingButton"],
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
      type: '"elevated" | "primary" | "tonal" | "outlined" | "ghost"',
      default: '"primary"',
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
