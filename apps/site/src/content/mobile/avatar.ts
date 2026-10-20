import type { ComponentDoc } from "../types";

export const avatar: ComponentDoc = {
  slug: "avatar",
  name: "Avatar",
  oneLiner:
    "Avatars show a person or thing — an image when one loads, initials when one does not.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Avatar",
    variants: [],
    elevation: "surface",
  },
  parts: ["Avatar"],
  // Presentational BY CONSTRUCTION: the avatar is an image with an initials
  // fallback. It is exposed as an image, takes no focus, handles no key and
  // exposes no state of its own. A host that makes an avatar pressable owns
  // that control's contract — the avatar does not bring one with it. So there
  // is no keyboard contract to write, and saying so is a fact rather than a
  // gap.
  nonInteractive: true,
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
