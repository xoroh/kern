import type { ComponentDoc } from "../types";

export const banner: ComponentDoc = {
  slug: "banner",
  name: "Banner",
  oneLiner:
    "Banners report something the whole screen needs to know, without blocking what people are doing.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Banner",
    variants: ["variant: info · success · warning · error"],
    // M3 lists "Banner" at resting level 1, and kern now ships
    // `--sys-elevation-level1` on it (ed3c3e1 fixed this — the component
    // previously shipped a border and no elevation, which was off-spec).
    elevation: 1,
  },
  parts: ["Banner", "BannerAction"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  // The banner is a LIVE REGION, not a dialog: it never takes focus and
  // never moves it. The controls it carries — the dismiss control and the
  // optional action — are the tab stops.
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves to the controls the banner carries — the dismiss control, and the action if the host put one in. The banner itself takes no focus and never steals it.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused control — the dismiss control, which closes the banner, or the banner's action.",
    },
  ],
  customization: {
    supported: [
      "`className` is passed through and merged after the variant classes.",
      "`icon` is a leading slot, so the glyph can match the intent without the component owning an icon set.",
      "The intent colours are the status roles, so a theme retints every banner at once.",
    ],
    notSupported: [
      "There is no `title` or `description` prop. A banner is one message; structure it with your own markup if you need more.",
      "There is no `position` or `placement` prop. A banner belongs to the content it describes, so placement is the layout's job.",
      "There is no `dismissible` boolean. Dismissal is expressed as `onDismiss` — if you do not pass it, no dismiss control is rendered.",
    ],
  },
  api: [
    {
      name: "variant",
      for: ["Banner"],
      type: '"info" | "success" | "warning" | "error"',
      default: '"info"',
      note: "The intent. Drives the status role pair the banner is coloured with — see Deviations.",
    },
    {
      name: "icon",
      for: ["Banner"],
      type: "ReactNode",
      note: "Leading slot. Usually an icon matching the intent.",
    },
    {
      name: "assertive",
      for: ["Banner"],
      type: "boolean",
      note: "Switches the live-region role from `status` to `alert`, so it interrupts rather than queues. Off by default — an assertive banner for routine state is a nuisance to screen-reader users.",
    },
    {
      name: "onDismiss",
      for: ["Banner"],
      type: "() => void",
      note: "Renders a dismiss control and calls back when pressed. Omit it and no dismiss control appears.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant classes.",
    },
    {
      name: "open",
      for: ["Banner"],
      type: "boolean | undefined",
      note: "Controlled visibility. `open` wins when passed; `open={false}` renders nothing. The dismiss button drives one close path — `onOpenChange(false)` plus `onDismiss()` — so both stay in sync.",
    },
    {
      name: "defaultOpen",
      for: ["Banner"],
      type: "boolean | undefined",
      note: "Initial visibility in the uncontrolled case. Defaults to open.",
    },
    {
      name: "onOpenChange",
      for: ["Banner"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires when the banner opens or closes. The controlled-`open` observer and the dismiss path's other half.",
    },
  ],
  aria: [
    'The banner is a live region: `role="status"` by default (polite), or `role="alert"` when `assertive` is set.',
    "That means the text is announced when it appears, without moving focus. Content that requires an immediate action should not rely on a banner alone.",
    "The dismiss control is a real button with an accessible name.",
  ],
};
