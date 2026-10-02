import type { ComponentDoc } from "../types";

export const slider: ComponentDoc = {
  slug: "slider",
  name: "Slider",
  oneLiner: "Sliders pick a number along a range by moving a thumb.",
  features:
    "Reach for a slider when the answer is a number within bounds and the position of the answer matters more than its exact value: a price limit, a volume, a distance. It is controlled or uncontrolled with `min`, `max` and `step`, and it reports the value rather than the gesture. Prefer it when being in the right region is what counts and the exact figure can be read off; if the exact number is what matters, a `NumberField` is kinder. Name it — a slider's thumb is not its own label.",
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
