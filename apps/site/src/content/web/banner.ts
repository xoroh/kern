import type { ComponentDoc } from "../types";

export const banner: ComponentDoc = {
  slug: "banner",
  name: "Banner",
  oneLiner:
    "Banners report something the whole screen needs to know, without blocking what people are doing.",
  features:
    "Reach for a banner when a condition applies to the entire view and someone can carry on regardless: a build is queued, a trial is ending, a connection dropped. It sits at the top of the content it refers to and stays until the condition clears — a banner that disappears on its own is a toast, not a banner. Pick the variant that matches the intent rather than the urgency you feel: info for neutral state, success for something that worked, warning for something to watch, error for something that needs attention.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Banner",
    variants: ["variant: info · success · warning · error"],
    // M3 lists "Banner" at resting level 1, and kern now ships
    // `--md-sys-elevation-level1` on it (ed3c3e1 fixed this — the component
    // previously shipped a border and no elevation, which was off-spec).
    elevation: 1,
  },
  parts: ["Banner", "BannerAction"],
  deviations: [
    {
      id: "K2",
      spec: "Material 3 defines one semantic feedback pair: error, on-error, error-container and on-error-container. It has no success, warning or info colour roles.",
      kern: "Banner takes four intent variants — info, success, warning and error — backed by kern's status roles, which add success, warning and info in container and on-container forms.",
      why: "A system that can only say 'error' cannot report the three outcomes people actually distinguish: it worked, watch out, and for your information. The twelve status roles are registered as K2 in m3-roles.ts, so the extension is a declared addition to the role space rather than a silent fork of it.",
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
      type: '"info" | "success" | "warning" | "error"',
      default: '"info"',
      note: "The intent. Drives the status role pair the banner is coloured with — see Deviations.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Leading slot. Usually an icon matching the intent.",
    },
    {
      name: "assertive",
      type: "boolean",
      note: "Switches the live-region role from `status` to `alert`, so it interrupts rather than queues. Off by default — an assertive banner for routine state is a nuisance to screen-reader users.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Renders a dismiss control and calls back when pressed. Omit it and no dismiss control appears.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the variant classes.",
    },
  ],
  aria: [
    'The banner is a live region: `role="status"` by default (polite), or `role="alert"` when `assertive` is set.',
    "That means the text is announced when it appears, without moving focus. Content that requires an immediate action should not rely on a banner alone.",
    "The dismiss control is a real button with an accessible name.",
  ],
};
