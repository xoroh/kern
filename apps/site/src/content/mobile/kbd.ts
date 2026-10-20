import type { ComponentDoc } from "../types";

export const kbd: ComponentDoc = {
  slug: "kbd",
  name: "Kbd",
  oneLiner:
    "Kbds show a keyboard shortcut or key as text, in the shape of a key.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // The same key-as-text treatment as web `Kbd` — one label, static text,
    // caller-composed chords. Documented there.
    nativePeer: "Kbd",
    variants: [],
    elevation: "surface",
  },
  parts: ["Kbd"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // Static text BY CONSTRUCTION: the kbd is exposed on the accessibility tree
  // as text and binds nothing. It never takes focus and never handles a key —
  // the shortcut it names is the application's to wire. So there is no
  // keyboard contract to write, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`children` is the key as text — a string, rendered, not interpreted.",
      "`accessibilityLabel` renames it where the glyphs would read wrongly; it falls back to the children.",
      "`style` is a React Native `TextStyle` merged after the key treatment.",
    ],
    notSupported: [
      "There is no `combo` or `sequence` helper. How a chord is written is a notation decision for the product.",
      "It never takes focus and never handles keys — static text, by design.",
    ],
  },
  api: [
    {
      name: "children",
      type: "string",
      required: true,
      note: "The key or shortcut as text. Rendered, not interpreted.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      note: "Falls back to the children. Rename where the glyphs would read wrongly.",
    },
    {
      name: "style",
      type: "StyleProp<TextStyle>",
      note: "Merged after the key treatment.",
    },
    {
      name: "testID",
      type: "string",
      note: "Test hook for the key.",
    },
  ],
  aria: [
    'Exposed as static text (`accessibilityRole="text"`) — announced as a key, never as a control.',
    "It binds nothing: a screen reader user hears the shortcut and finds it where the application wired it.",
  ],
};
