import type { ComponentDoc } from "../types";

export const tooltip: ComponentDoc = {
  slug: "tooltip",
  name: "Tooltip",
  oneLiner:
    "Tooltips attach one line of supplementary text to a trigger, and never trap that text behind the trigger.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Tooltip",
    variants: [],
    elevation: 2,
  },
  parts: ["Tooltip"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "External keyboard (Tab)",
      action:
        "Focus opens the surface and blur closes it — the trigger's focus IS the open state for the plain tooltip.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The trigger announces its label plus the hint (merged, never replaced) with the expanded state; the plain surface itself is inert text, never a stop.",
    },
  ],
  customization: {
    supported: [
      "`label` is the trigger's name and `hint` is the supplementary text — two separate strings, on purpose.",
      "`placement` is `top` or `bottom`; Material 3's default is above.",
      "`open`/`defaultOpen`/`onOpenChange` control it, matching `Drawer` and `Popover`.",
    ],
    notSupported: [
      "There is no `multiline` or `rich` content. A tooltip is one line; rich content is a `Popover`.",
      "There is no `delay` prop. When it appears is the platform's.",
      "There is no `side`/`align` beyond `placement`. It sits above or below, not left or right.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      note: "REQUIRED. The TRIGGER's own accessible name — not the tooltip's text. Naming the control is this prop's job.",
    },
    {
      name: "hint",
      type: "string",
      note: "REQUIRED. The supplementary text. It is carried as `accessibilityHint` WHETHER OR NOT the surface is showing, so the information is never trapped behind the trigger.",
    },
    {
      name: "placement",
      type: '"top" | "bottom"',
      default: '"top"',
      note: "Which side of the trigger the surface sits on. Material 3's default is above.",
    },
    {
      name: "open / defaultOpen / onOpenChange",
      type: "boolean / (open: boolean) => void",
      note: "The controllable pattern — the `open` family, matching `Drawer` and `Popover`, not `Snackbar`'s `visible`.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The trigger's content. The tooltip attaches to it.",
    },
  ],
  aria: [
    "`label` names the TRIGGER and `hint` describes it. Keeping them separate is what lets an icon-only control be named and explained by two different strings.",
    "The hint rides along as `accessibilityHint` at all times. On touch there is no hover, so a tooltip that only existed while open would hold information nobody could reach — this way the text is never trapped behind the trigger.",
    "The surface itself is supplementary: nothing in it is required to operate the control, which is the rule for tooltips generally.",
  ],
};
