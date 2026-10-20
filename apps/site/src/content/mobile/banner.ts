import type { ComponentDoc } from "../types";

export const banner: ComponentDoc = {
  slug: "banner",
  name: "Banner",
  oneLiner:
    "The banner reports something the whole screen needs to know, in flow, without blocking the work beneath it.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Banner",
    variants: ["variant: info · success · warning · error"],
    // M3's "Banner" row rests at level 1 — the same claim the web peer's page
    // makes. The native surface separates by its status container fill; the
    // elevation row is what the family implements, per m3-elevation.ts.
    elevation: 1,
  },
  parts: ["Banner"],
  // The banner is a LIVE REGION, not a dialog: it never takes focus and never
  // moves it. The dismiss control is the one control the banner contributes;
  // the action slot is whatever the host put in it.
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The banner is announced as an alert when it appears, without moving focus; the dismiss control reads as a button and double-tap dismisses it.",
    },
    {
      key: "Enter / Space via external keyboard or switch control",
      action:
        "Runs the focused control — the dismiss control, or the action the host put in the slot.",
    },
  ],
  customization: {
    supported: [
      "`variant` is the intent axis, and the intent colours are the status roles, so a theme retints every banner at once.",
      "`children` is the body line under the title; `action` is a slot for AT MOST ONE action, placed at the end of the row.",
      "`onDismiss` is opt-in: pass it and a dismiss pressable is rendered; omit it and there is no dismiss control to hit by accident.",
      "`style` is a React Native `ViewStyle`. `bannerStyles` is exported for the treatment without the component.",
    ],
    notSupported: [
      "There is no icon slot and no leading glyph — the intent is carried by the container tint and the text, not by an icon set.",
      "There is no `position` prop. A banner belongs to the content it describes, so placement is the layout's job.",
      "It does not dismiss itself and there is no timeout. A message that disappears on its own is a snackbar.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "The headline. Also names the dismiss control — its accessibility label is built from this string.",
    },
    {
      name: "variant",
      type: 'BannerVariant ("info" | "success" | "warning" | "error")',
      default: '"info"',
      note: "The intent, mapped onto the kern status roles. Pick the intent, not the urgency.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The body line. Rendered as body text under the title; omit when the title says everything.",
    },
    {
      name: "action",
      type: "ReactNode",
      note: "One action slot, at the end of the row. At most one — a banner with a row of buttons is a dialog.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Renders the dismiss pressable when present; without it no dismiss control exists. The banner never hides itself — stop rendering it when the condition clears.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles, merged after `bannerStyles`. `bannerStyles` is exported for the treatment without the component.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-banner"',
      note: "Test hook for the banner.",
    },
  ],
  aria: [
    "The banner reports `alert` role — it is a status for the whole region, and assistive technology should treat it as one.",
    "The dismiss control is a `button` role pressable labelled from the title, so dismissal is never an unnamed glyph.",
    "A banner that reports a condition should stay until the condition clears; removing it is the dismissal, and the content beneath it should not depend on having read it.",
  ],
};
