import type { ComponentDoc } from "../types";

export const meter: ComponentDoc = {
  slug: "meter",
  name: "Meter",
  oneLiner:
    "Meters show a reading within bounds — storage used, a score, a level — and can announce it as something readable.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Meter",
    variants: [],
    elevation: "surface",
  },
  parts: ["Meter"],
  // M2: a meter REPORTS a reading; it does not collect one. The
  // `role="meter"` view takes no focus and answers no key, so the ARIA
  // contract below is the whole story.
  nonInteractive: true,
  customization: {
    supported: [
      "`value`, `min` and `max` set the reading and its bounds.",
      "`valueText` is the human-readable reading announced in place of the number.",
      "`label` and `showValue` render a visible label and value row above the bar.",
    ],
    notSupported: [
      "There is no `tone` or `intent` variant. A meter reports a reading; it does not judge it.",
      "There is no `segments` or `thresholds` prop. Bands are your own, drawn in the content around it.",
      "There is no `onChange`. It is a reading, not a control — setting a value is a `Slider`.",
    ],
  },
  api: [
    {
      name: "value",
      type: "number",
      note: "The reading. OMIT IT FOR AN INDETERMINATE METER — one with a known range but no current reading.",
    },
    {
      name: "min / max",
      type: "number",
      note: "The bounds the reading sits within.",
    },
    {
      name: "valueText",
      type: "string",
      note: 'The formatted reading, ANNOUNCED INSTEAD of the bare number — "3.2 GB of 8 GB". Falls back to the raw value, which is exactly the case where the announcement sounds like nonsense.',
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "The meter's name. Material 3 pairs a meter with a label, and this is it.",
    },
    {
      name: "label / showValue",
      type: "ReactNode / boolean",
      note: "An optional visible label and value row above the bar.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`valueText` is the important one: a bare number read aloud means nothing without its units and its bound. This is where you make the reading human.",
    "`accessibilityLabel` names it — Material 3 pairs a meter with a label, and an unnamed meter is a bar with a number in it.",
    "It is a READING, not a control. A meter reports what is; `Slider` is what you use to set something.",
  ],
};
