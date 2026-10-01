import type { ComponentDoc } from "../types";

export const fab: ComponentDoc = {
  slug: "fab",
  name: "Floating action button",
  oneLiner:
    "The floating action button is the single most important action on a screen.",
  features:
    "Use one floating action button per screen, for the action a person comes to that screen to perform — composing a message, adding a record, starting a scan. It floats above the content and stays reachable while the screen scrolls. It is emphatic by construction, so it does not need an emphasis variant: if you find yourself wanting a quiet floating action button, the action is probably not the screen's primary one. The extended form carries a label beside the icon when the action would otherwise be ambiguous.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Fab",
    // M3's floating action button has three variants and they are all the same
    // axis: "Three variants: FAB, medium FAB, large FAB". That axis is size.
    variants: ["size: sm · default · medium · large · icon"],
    elevation: 3,
  },
  parts: ["Fab"],
  customization: {
    supported: [
      "`className` is passed through and merged after the size classes.",
      "`size` selects the M3 dimensions; each size is a fixed height and width.",
      "The container color is `--md-sys-color-primary-container`, so a theme retints every floating action button.",
    ],
    notSupported: [
      "There is no `variant` prop. M3 defines the floating action button's variants as a size axis, not an emphasis axis — the container is always the primary container.",
      "There is no `color` prop. A secondary emphasis belongs to the extended floating action button's tonal treatment, not to this component.",
      "There is no `position` prop. Placement is the layout's job, not the button's.",
    ],
  },
  api: [
    {
      name: "size",
      type: '"sm" | "default" | "medium" | "large" | "icon"',
      default: '"default"',
      note: "M3's size axis: small, default (56dp-class), medium and large. `icon` is the square form for a single glyph.",
    },
    {
      name: "aria-label",
      type: "string",
      note: "Required in practice for `medium`, `large` and `icon`, which render no text. A floating action button with no accessible name is unusable with a screen reader.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the size classes.",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: '"button"',
    },
    {
      name: "ref",
      type: "React.Ref<HTMLButtonElement>",
      note: "Forwarded to the underlying `<button>`.",
    },
  ],
};
