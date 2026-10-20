import type { ComponentDoc } from "../types";

export const kbd: ComponentDoc = {
  slug: "kbd",
  name: "Kbd",
  oneLiner:
    "Kbds show a keyboard key or shortcut as text, in the shape of a key.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native `Kbd` renders the same key-as-text treatment for shortcuts
    // shown on touch surfaces. Documented there.
    nativePeer: "Kbd",
    variants: [],
    elevation: "surface",
  },
  parts: ["Kbd"],
  // Static text BY CONSTRUCTION: the kbd renders a `<kbd>` element and binds
  // nothing. It takes no focus, handles no key, and has no state of its own —
  // the shortcut it names is the application's to wire. So there is no
  // keyboard contract to write, and saying so is a fact rather than a gap.
  nonInteractive: true,
  customization: {
    supported: [
      "`className` is passed through and merged after the kbd's own classes.",
      "It renders the `<kbd>` element, so its semantics are the element's rather than a styled `<span>`.",
      "Shape and colour come from the theme, so a key's look follows the rest of the interface.",
    ],
    notSupported: [
      "There is no `key` prop. The key is the content — it is text, and it is the caller's.",
      "There is no `size` or `variant` prop for small versus large keys.",
      "There is no `combo` or `sequence` helper that formats chords. How a chord is written is a notation decision for the product, not a component feature.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: 'The key or shortcut as text. It is rendered, not interpreted — the component does not parse `"Mod+K"` into glyphs.',
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the kbd's own classes.",
    },
    {
      name: "ref",
      type: "React.Ref<HTMLElement>",
      note: "Forwarded to the underlying `<kbd>`.",
    },
  ],
  aria: [
    "The `<kbd>` element marks text as user keyboard input, so a screen reader reads it as a key rather than as ordinary words.",
    "It is text, so it is selectable and copyable — which is what makes a shortcut written here usable as prose elsewhere.",
    "It binds nothing. The shortcut is the application's to wire; the kbd only shows what it is.",
  ],
};
