import type { ComponentDoc } from "../types";

export const kbd: ComponentDoc = {
  slug: "kbd",
  name: "Kbd",
  oneLiner:
    "Kbds show a keyboard shortcut or key as text, in the shape of a key.",
  features:
    "Reach for kbd when a shortcut is worth showing beside the thing it does: a menu item's binding, a settings hint, a chord in help text. It renders one non-wrapping label in a monospace face with an outline-variant border, exposed as static text — so it reads correctly in a screen reader and copies correctly as prose. It does not BIND anything. Chords are composed by the caller with a space between `Kbd` parts, the same contract as web.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The same key-as-text treatment as web `Kbd` — one label, static text,
    // caller-composed chords. Documented there.
    nativePeer: "Kbd",
    variants: [],
    elevation: "surface",
  },
  parts: ["Kbd"],
  usage: {
    do: [
      "Show the shortcut where its action lives — menus, hints, help.",
      "Compose chords with a space between parts, matching the web contract.",
      "Keep the label to the key itself; the surrounding text says what it does.",
    ],
    dont: [
      "Don't bind anything with it — the kbd only shows, the application wires.",
      "Don't restyle it past recognition — the key shape is what makes a shortcut scannable.",
    ],
  },
  tokens: [
    {
      element: "Key",
      state: "resting",
      token: "theme.color.surfaceContainerHigh",
      value:
        "surfaceContainerHigh fill, 1px outlineVariant border, 4px corners",
    },
    {
      element: "Glyph",
      state: "resting",
      token: "theme.color.onSurface",
      value: "onSurface monospace label, single line",
    },
  ],
  faq: [
    {
      q: "Why show keyboard shortcuts on a touch surface?",
      a: "External keyboards exist — and the kbd's job is showing the binding, not pressing it. The treatment is identical on both renderers so documentation can share the notation.",
    },
  ],
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
