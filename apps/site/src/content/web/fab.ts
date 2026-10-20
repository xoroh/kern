import type { ComponentDoc } from "../types";

export const fab: ComponentDoc = {
  slug: "fab",
  name: "Floating action button",
  oneLiner:
    "The floating action button is the single most important action on a screen.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Fab",
    // M3's floating action button variants are a size axis. sm is the small,
    // md the expressive medium, `large` past the spec. One size, one name:
    // the pre-expressive `medium` is removed (no-compat rule).
    variants: [
      "size: sm · default · md · large · icon",
      "color: surface · primary · secondary · tertiary · primary-fill · secondary-fill · tertiary-fill",
    ],
    elevation: 3,
  },
  parts: ["Fab"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "hover"],
  keyboard: [
    {
      key: "Enter / Space",
      action: "Activates the focused fab — one press, the screen's one action.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Reaches the fab in page order. A fab that cannot be tabbed to is decoration, not an action.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the size classes.",
      "`size` selects the M3 dimensions; each size is a fixed height and width.",
      "The default container is the neutral surface treatment (a kern deviation — the spec default is the primary container); `color` selects any of the seven M3 expressive styles, so a theme retints every floating action button.",
    ],
    notSupported: [
      "There is no `variant` prop. M3 defines the floating action button's variants as a size axis, not an emphasis axis — color is the separate `color` axis.",
      "There is no `position` prop. Placement is the layout's job, not the button's.",
    ],
  },
  api: [
    {
      name: "size",
      type: '"sm" | "default" | "md" | "large" | "icon"',
      default: '"default"',
      note: "M3's size axis: small, default (the standard FAB size), md (expressive medium) and large (extension). `icon` is the square form for a single glyph.",
    },
    {
      name: "aria-label",
      type: "string",
      note: "Required in practice for `md`, `large` and `icon`, which render no text. A floating action button with no accessible name is unusable with a screen reader.",
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
    {
      name: "color",
      type: '"surface" | "primary" | "secondary" | "tertiary" | "primary-fill" | "secondary-fill" | "tertiary-fill" | null | undefined',
      note: "M3 container treatment: the three containers, the three fills, or surface. Kern default is `surface` — the neutral chrome — not the spec default `primary-container`. Each pairs its container with its on-color.",
    },
    {
      name: "lowered",
      type: "boolean | undefined",
      note: "Lowered elevation for FABs that should sit quieter in the layout. Per M3's `lowered` attribute.",
    },
  ],
  aria: [
    "A fab is a `<button>` with a visible focus ring — keyboard users reach it in page order and activate with Enter or Space.",
    "Textless sizes (`md`, `large`, `icon`) carry no name in the pixels, so `aria-label` is required in practice there.",
    "A disabled-looking fab is never rendered — hiding keeps the tab order and the accessibility tree honest at once.",
  ],
};
