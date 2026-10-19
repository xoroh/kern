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
  usage: {
    do: [
      "Give a screen exactly one fab for its one primary action — compose, add, go.",
      "Name it with `aria-label` wherever it renders no text (`md`, `large`, `icon`) — a floating button with no name is unusable with a screen reader.",
      "`lowered` sits the fab quieter at level 1 where the standard level 3 would shout.",
    ],
    dont: [
      "Don't put two fabs on one screen — one primary action means one fab.",
      "Don't disable a fab — M3 defines no disabled FAB. Hide the action instead of disabling it.",
      "Don't use a fab for navigation between destinations — that is the navigation bar's job.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "comp.fab.container",
      value: "primary-container, large corners, level3",
    },
    {
      element: "Container",
      state: "hover",
      token: "sys.elevation.level4",
      value: "level4 (lifts from level3)",
    },
    {
      element: "Lowered container",
      state: "resting",
      token: "sys.elevation.level1",
      value: "level1 with the lowered fill swap",
    },
  ],
  faq: [
    {
      q: "Which size?",
      a: "Default is the standard fab; `sm` compact, `md` and `large` expressive emphasis, `icon` the square for a single glyph. Sizes change the box, never the emphasis.",
    },
    {
      q: "Why do the size names differ from native?",
      a: "They spell the same five steps differently — web `sm`/`md` vs native `small`/`medium` (`default`, `large`, `icon` match). Same boxes, different spellings; the page names both so the drift is visible, not silent.",
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
