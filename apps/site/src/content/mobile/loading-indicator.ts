import type { ComponentDoc } from "../types";

export const loadingIndicator: ComponentDoc = {
  slug: "loading-indicator",
  name: "Loading indicator",
  oneLiner:
    "Loading indicators are the spinner that can say what it is doing, in three sizes.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "LoadingIndicator",
    variants: [],
    elevation: "surface",
  },
  parts: ["LoadingIndicator"],
  // M2: the native ring is a polite live region too — it measures nothing,
  // takes no focus and answers no key, so the ARIA contract below is the
  // whole story.
  nonInteractive: true,
  customization: {
    supported: [
      "`label` is the accessible name and, with `showLabel`, the visible text too.",
      "`showLabel` renders that label beside the ring.",
      "`size` is the three indicator sizes, `sm`, `default` and `lg`.",
    ],
    notSupported: [
      "There is no `color` prop. The ring is resolved from the scheme.",
      "There is no `value`/`max`. A measured amount is `Progress`.",
      "There is no `layout` or `position` prop — the label sits beside the ring.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "The accessible name AND, when `showLabel` is set, the visible text. One string doing both jobs is why setting it matters.",
    },
    {
      name: "showLabel",
      type: "boolean",
      note: "Renders `label` as visible text beside the ring. Without it the label is announced but not seen.",
    },
    {
      name: "size",
      type: '"sm" | "default" | "lg"',
      default: '"default"',
      note: "Three sizes. Note they are spelled differently from `Loader`'s (`small`/`large`) — the two components do not share a size axis.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`label` is the accessible name whether or not it is visible, so a screen reader user gets the explanation even when a sighted user sees only the ring.",
    '`showLabel` is what makes the wait legible to everyone else. A ring alone says "working"; a ring with "Loading your bookings" says what is working.',
    "It reports no progress amount — it describes the wait rather than measuring it.",
  ],
};
