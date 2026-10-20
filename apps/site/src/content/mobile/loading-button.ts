import type { ComponentDoc } from "../types";

export const loadingButton: ComponentDoc = {
  slug: "loading-button",
  name: "Loading button",
  oneLiner:
    "Loading buttons keep their label and footprint while working, and show the wait in their leading slot.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "LoadingButton",
    variants: [],
    elevation: "surface",
  },
  parts: ["LoadingButton"],
  // The contract, read off the pressable: it is a real button, and while it
  // is loading it is blocked — which is what makes a double submit
  // impossible.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Presses the button when it is idle. While `loading` is set the pressable is blocked, so the action cannot be fired a second time.",
    },
    {
      key: "Swipe (TalkBack / VoiceOver)",
      action:
        "Reaches the button as an ordinary stop, and announces it as busy for as long as the action runs — the wait is state, not a change of label.",
    },
  ],
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
