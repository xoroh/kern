import type { ComponentDoc } from "../types";

export const slider: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  oneLiner: "Sliders pick a number along a range by moving a thumb.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Slider",
    variants: [],
    // Material 3 places `slider` at resting level 0, and level 0 is
    // `shadow: none` — which is what a slider track renders.
    elevation: 0,
  },
  parts: ["Slider"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "External keyboard / switch control",
      action:
        "Adjusts through the platform's increment/decrement actions on the `adjustable` role — the value, min and max ride `accessibilityValue`.",
    },
    {
      key: "Swipe + double-tap-and-hold (TalkBack / VoiceOver)",
      action:
        "Announces as adjustable with the current value; the adjust gesture (or volume-key style steppers where the host maps them) moves by `step`.",
    },
  ],
  customization: {
    supported: [
      "`value`/`defaultValue`/`onValueChange` make it controlled or uncontrolled.",
      "`min`, `max` and `step` set the range and the increment.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `range` or dual-thumb mode. It picks one number.",
      "There is no `marks` or `ticks` prop. The track is the track.",
      "There is no `orientation`. It is horizontal.",
    ],
  },
  api: [
    {
      name: "value / defaultValue",
      type: "number",
      note: "The current number. `onValueChange` reports the value, not the gesture.",
    },
    {
      name: "min / max",
      type: "number",
      note: "The range bounds.",
    },
    {
      name: "step",
      type: "number",
      note: "The increment. How the value snaps is this prop's job, not an effect of the drag.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the slider. The thumb is not its own label.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "Stops interaction and reports it.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`accessibilityLabel` names it; a moving thumb means nothing without knowing what it moves.",
    "It reports a NUMBER with bounds, so what is announced is a value in a range rather than a position on a track.",
    "It picks one number. A dual-thumb range is not this component and nothing here pretends otherwise.",
  ],
};
