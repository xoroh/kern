import type { ComponentDoc } from "../types";

export const avatar: ComponentDoc = {
  slug: "avatar",
  name: "Avatar",
  oneLiner:
    "Avatars show a person or thing — an image when one loads, initials when one does not.",
  features:
    "Reach for an avatar wherever a record has a face or a mark: a sender on a message, a member of a team, an account in a drawer. The useful behaviour is the fallback: `source` takes the image and `fallback` is the initials shown when no image loads, so a slow or missing image degrades to something recognisable rather than to an empty box. Pick the size from the three the family ships rather than setting one, so an avatar looks the same wherever it appears. And name it — an avatar next to a name is decoration, an avatar on its own is the identity and needs an accessible label.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Avatar",
    variants: [],
    elevation: "surface",
  },
  parts: ["Avatar"],
  customization: {
    supported: [
      "`source` takes an image, and `fallback` is the initials shown when no image loads.",
      "`size` is the three avatar sizes, `small`, `default` and `large`.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `shape` prop. The avatar is round.",
      "There is no `icon` fallback. When there is no image and no initials, the fallback is text or nothing — an icon is not offered.",
      "`source` is deliberately narrowed from `ImageProps`: the shape is this component's, not the image's.",
    ],
  },
  api: [
    {
      name: "source",
      type: "ImageProps['source']",
      note: "The image. Optional — omit it and the `fallback` shows.",
    },
    {
      name: "fallback",
      type: "string",
      note: "Initials shown when no image loads. This is what stops a missing image becoming an empty box.",
    },
    {
      name: "size",
      type: '"small" | "default" | "large"',
      default: '"default"',
      note: "Three fixed sizes, so an avatar looks the same wherever it appears. No custom value.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "The avatar's name. Set it when the avatar is the identity; skip it when a name is already beside it.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. `source` is omitted from the props it inherits and redeclared, so the shape is this component's.",
    },
  ],
  aria: [
    "`accessibilityLabel` matters exactly when the avatar carries the identity — an avatar beside a printed name is decoration and should not be announced twice.",
    "The `fallback` is visible text, so a failed image still identifies something rather than leaving a blank.",
    "It has no role of its own; it is an image of a person or mark, and the label is what makes it meaningful.",
  ],
};
