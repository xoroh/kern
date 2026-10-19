import type { ComponentDoc } from "../types";

export const linkButton: ComponentDoc = {
  slug: "link-button",
  name: "Link button",
  oneLiner:
    "Link buttons wear the button treatment on a navigation control — an anchor, not an action.",
  features:
    "Reach for a link button when the destination should wear the button treatment: a call to action that navigates rather than doing something here. It is a bridge onto `Button`, not a second implementation — every axis and the anchor attributes are Button's, and the render is Button's `href` branch, so the link and the button cannot drift into two treatments. `href` is required: a link without one is a button wearing link paint, and `Button` is the component for that. There is deliberately no `asChild` — element takeover is what the composition rule forbids, and `href` already composes with routers by URL.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // The native renderer ships the same bridge under the same name.
    nativePeer: "LinkButton",
    variants: [],
    // kern's own decision. M3's elevation table names no link-button row —
    // the treatment is the button's, and the base treatments rest flat. See
    // Deviations.
    elevation: 0,
  },
  parts: ["LinkButton"],
  deviations: [
    {
      id: "K11",
      spec: "M3's elevation table names no link-button row. It tabulates menus and tooltips at level 2 — neither row describes a navigation link wearing the button treatment.",
      kern: "The link button rests at elevation level 0.",
      why: "The base treatments carry no shadow by definition (`shadow: none`), and a navigation link must not float above the page it leaves. An elevated link button would borrow emphasis it has not earned.",
    },
  ],
  usage: {
    do: [
      "Navigate with it — the `href` goes somewhere, which is the whole difference from `Button`.",
      'Keep the label short and the icon at the inline start; M3 forbids trailing icons here (`iconPosition="end"` is ignored with a warning).',
      "Compose with routers by URL — pass the destination, never an element takeover.",
    ],
    dont: [
      "Don't use it for an action that stays on the page — that is `Button` with `onClick`.",
      "Don't render it without `href` — the prop is required because a link to nowhere is a lie.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "comp.link-button.container",
      value: "the button treatment, level 0 — navigation carries no elevation",
    },
  ],
  faq: [
    {
      q: "Button or link button?",
      a: "Doing something here means `Button`; going somewhere means `LinkButton`. The treatment is identical — only the element and the contract differ.",
    },
    {
      q: "Why is there no `asChild`?",
      a: "Element takeover lets a router link swallow the anchor, which is exactly what the composition rule forbids. `href` composes by URL instead.",
    },
  ],
  customization: {
    supported: [
      "Every `Button` axis (variant, color, size, shape, block, loading, icon) plus the anchor attributes (`target`, `rel`, `download`) — it is Button's `href` branch.",
      "`onClick` still fires — navigation and a side effect are not mutually exclusive.",
    ],
    notSupported: [
      "There is no `type`, `value` or form participation. A link submits nothing.",
      "There is no `asChild` prop. Compose by URL.",
      '`iconPosition="end"` is ignored with a dev warning — M3 link buttons cannot carry trailing icons.',
    ],
  },
  api: [
    {
      name: "href",
      type: "string",
      required: true,
      note: "The destination. Required — a link without an `href` is a button wearing link paint.",
    },
    {
      name: "onClick",
      type: "(event) => void",
      note: "Fires before navigation. For the side effect, not the navigation itself.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The label. Keep it short — a link button is a signpost, not a sentence.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the button treatment's own classes.",
    },
  ],
  aria: [
    "It renders an anchor, so it announces as a link and lives in the links list — never mistaken for an action.",
    "Keep the label naming the destination; the treatment says how it looks, the label says where it goes.",
  ],
};
