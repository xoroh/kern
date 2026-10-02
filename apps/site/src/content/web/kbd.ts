import type { ComponentDoc } from "../types";

export const kbd: ComponentDoc = {
  slug: "kbd",
  name: "Kbd",
  oneLiner:
    "Kbds show a keyboard key or shortcut as text, in the shape of a key.",
  features:
    "Reach for kbd when a shortcut is worth showing beside the thing it does: a menu item's binding, a toolbar hint, an editor's chord. It renders a key as text, so it reads correctly in a screen reader and copies correctly as prose. It does not BIND anything — the shortcut is the application's to wire, and the kbd only shows it. Keep the notation consistent across the product, because a shortcut written one way in a menu and another way in a toolbar is two shortcuts to learn.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `Kbd`. There is no keyboard on a touch surface, so the
    // concept has no counterpart.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["Kbd"],
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
