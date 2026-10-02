import type { ComponentDoc } from "../types";

export const loadingButton: ComponentDoc = {
  slug: "loading-button",
  name: "Loading button",
  oneLiner:
    "Loading buttons keep their label and footprint while working, and show the wait in their leading slot.",
  features:
    "Reach for a loading button when the action itself is what is in progress: submitting a form, sending a message, saving. The rule it follows is Material 3's and it is the reason the component exists — never resize chrome for progress. The button keeps its label and its size while loading, so the page does not jump under the pointer that just pressed it, and the wait is shown by a `CircularProgress` in the leading slot. `loading` also blocks interaction, so a double submit is not possible. If the wait is not tied to the button — a background task, a page load — it is `Loader` or `LoadingIndicator`, not this.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "LoadingButton",
    variants: [],
    elevation: "surface",
  },
  parts: ["LoadingButton"],
  customization: {
    supported: [
      "Every `Button` prop — it IS a button with the wait added, so `variant` and `size` work as on `Button`.",
      "`value` in 0–1 makes the embedded indicator determinate; omit it for the loop.",
      "`loaderStyle` chooses the embedded indicator's look, defaulting to the Material 3 ring.",
    ],
    notSupported: [
      "There is no `label` prop replacing the children. The label stays visible while loading — that is the whole point.",
      "There is no `showLabel` toggle. The label is always shown; hiding it is what the component exists to avoid.",
      "It does not resize. Material 3's rule is never resize chrome for progress, and there is no prop that would let you break it.",
    ],
  },
  api: [
    {
      name: "loading",
      type: "boolean",
      note: "Shows the embedded progress indicator AND blocks interaction. One flag doing both is why a double submit is not possible.",
    },
    {
      name: "value",
      type: "number",
      note: "0–1 determinate progress while loading. Omit it for the loop.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle",
      note: "The embedded indicator's style. Defaults to the Material 3 ring (`spinner`).",
    },
    {
      name: "…Button props",
      type: "NativeButtonProps",
      note: "Everything `Button` takes. The variant and size axes are unchanged — this is a button with the wait added, not a different control.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The label stays visible and keeps naming the action while it runs, so the button is never an unnamed spinner.",
    "`loading` blocks interaction, which is an accessibility guarantee as much as a correctness one — the control says it is busy and refuses to act.",
    'The footprint never changes. A button that grows or shrinks mid-press moves out from under the pointer and under the focus ring; Material 3\'s "never resize chrome for progress" is about that.',
  ],
};
