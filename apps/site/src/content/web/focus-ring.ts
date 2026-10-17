import type { ComponentDoc } from "../types";

export const focusRing: ComponentDoc = {
  slug: "focus-ring",
  name: "Focus ring",
  oneLiner:
    "Focus rings paint the visible keyboard-focus treatment on host content.",
  features:
    "Reach for `FocusRing` when host content needs the kern focus treatment without becoming a kern component: a wrapper that paints the centralized ring and nothing else. `FOCUS_RING_CLASS` is the single source of that treatment — every kern component builds its focus style from the same constant, so the ring cannot drift one component at a time. The span owns the treatment, never the tab stop: the host gives the focus (a `tabIndex`), so the wrapper cannot steal keyboard order.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // A web-only styling wrapper — there is no focus ring on touch surfaces,
    // so there is no native counterpart to name.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["FocusRing"],
  anatomy: [
    {
      name: "FocusRing",
      role: "The wrapper. Paints the `3px` secondary ring on focus-visible around host children.",
    },
  ],
  usage: {
    do: [
      "Wrap host content that takes keyboard focus but is not a kern component.",
      "Give the focus to the host (`tabIndex` on your element) — the wrapper only paints.",
    ],
    dont: [
      "Don't wrap kern components — they already bake the same constant into their own classes, and a second ring doubles the treatment.",
      "Don't use it to fake focus on a mouse-only surface — the ring answers keyboards, not cursors.",
    ],
  },
  tokens: [
    {
      element: "Ring",
      state: "focus-visible",
      token: "sys.color.secondary",
      value: "3px secondary ring, no offset",
    },
  ],
  faq: [
    {
      q: "Wrapper or class?",
      a: "Host content that cannot import the constant's classes uses the wrapper; kern's own components use `FOCUS_RING_CLASS` directly. Same `3px` secondary treatment either way.",
    },
  ],
  customization: {
    supported: [
      "`className` is merged after the ring utilities, so host styling composes without hiding the treatment.",
      "`children` is the host content — the wrapper renders a `span` around whatever you give it.",
    ],
    notSupported: [
      "There is no `width`, `color` or `offset` prop. The ring is `3px` secondary with no offset per the M3 focus spec — recorded in `FOCUS_RING_WIDTH_PX`, `FOCUS_RING_COLOR_ROLE` and `FOCUS_RING_OFFSET_PX`.",
      "There is no tab-stop ownership. The host gives the focus; the wrapper never takes it.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      note: "The host content the ring paints around.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the ring utilities.",
    },
  ],
  aria: [
    "The wrapper is a plain `span` with no role — it paints, it does not announce.",
    "Keyboard order belongs to the host: whatever takes focus inside keeps its own tab stop and its own name.",
  ],
};
