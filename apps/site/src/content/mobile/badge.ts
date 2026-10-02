import type { ComponentDoc } from "../types";

export const badge: ComponentDoc = {
  slug: "badge",
  name: "Badge",
  oneLiner:
    "Badges mark a count or a presence on something else — a dot, or a number.",
  features:
    "Reach for a badge when something needs a marker on it: unread messages on an icon, pending items on a tab. It is the two Material 3 badge forms — `dot` for presence and `count` for a quantity — and `children` is the number when the variant is `count`. A badge is always attached to something, so it has no life of its own: the thing it marks is the real control, and the badge only reports. That is why the label matters, and why a bare dot with no label is a change only sighted people notice.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Badge",
    variants: ["variant: dot · count"],
    elevation: "surface",
  },
  parts: ["Badge"],
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
