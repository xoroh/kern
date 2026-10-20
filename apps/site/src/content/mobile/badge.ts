import type { ComponentDoc } from "../types";

export const badge: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  oneLiner:
    "Badges mark a count or a presence on something else — a dot, or a number.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Badge",
    variants: ["variant: dot · count"],
    elevation: "surface",
  },
  parts: ["Badge"],
  // M2: a badge MARKS something else. It is a text-role view — it takes no
  // focus and answers no key, so the ARIA contract below is the whole
  // story.
  nonInteractive: true,
  customization: {
    supported: [
      "`variant` is the two Material 3 badge forms, `dot` and `count`.",
      "`children` is the count for the `count` variant — a string or a number.",
      "`labelStyle` styles the count text separately from the container.",
    ],
    notSupported: [
      "There is no `max` or overflow behaviour. A very large count is whatever you pass in, so cap it yourself.",
      "There is no `color` or `tone` variant. A badge is one look; a status marker is a `Chip` or text.",
      "There is no `placement` prop. Where the badge sits is the thing it marks, composed by you.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"dot" | "count"',
      default: '"count"',
      note: "The two Material 3 badge forms. `dot` marks presence; `count` shows a quantity.",
    },
    {
      name: "children",
      type: "string | number",
      note: "The count, for the `count` variant. There is no `max`, so cap a large number yourself.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Names the badge. Matters most for `dot`, which otherwise announces as nothing — a change only sighted people would notice.",
    },
    {
      name: "style / labelStyle",
      type: "StyleProp<ViewStyle> / StyleProp<TextStyle>",
      note: "The container and the count text, styled separately.",
    },
    {
      name: "testID",
      type: "string",
      note: "The test hook.",
    },
  ],
  aria: [
    "`accessibilityLabel` is what makes the badge legible without seeing it. For `dot` it is the whole message.",
    "It marks something else and is not itself actionable — the control it sits on is the thing that responds.",
    'A count read bare ("3") means nothing without knowing what is counted, so name it for the thing it marks.',
  ],
};
