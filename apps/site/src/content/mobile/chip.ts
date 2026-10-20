import type { ComponentDoc } from "../types";

export const chip: ComponentDoc = {
  slug: "chip",
  name: "Chip",
  oneLiner:
    "Chips are compact labelled controls: assist and suggestion chips act, filter chips toggle.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Chip",
    variants: ["variant: assist · filter · suggestion"],
    // M3's "chips" row rests at level 0 — `shadow: none` is the conformant
    // state and the chip carries no elevation token. Asserted on the absence.
    elevation: 0,
  },
  parts: ["Chip"],
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting", "selected"],
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Activates the focused chip — filter chips toggle their selected state.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Chips read in order with their label and selected/disabled states; double-tap activates or toggles.",
    },
  ],
  customization: {
    supported: [
      "`variant` is the M3 chip kind; `filter` additionally takes the selection trio (`value`, `defaultValue`, `onValueChange`).",
      "`children` is the label — a string or number renders as label text; a node renders as-is, which is how a chip gets a leading glyph.",
      "`labelStyle` restyles the label text; `style` restyles the pressable. `chipStyles` is exported for the treatment without the component.",
    ],
    notSupported: [
      "There is no `input` chip on the component yet — the fourth M3 kind exists in `chipStyles` as a treatment, but `Chip` accepts assist, filter and suggestion. A removable input chip is a composed pressable until it lands.",
      "There is no `disabled` styling beyond the pressable contract: disabled dims nothing by itself — it stops presses and reports `disabled` state.",
      "There is no elevation variant. M3 states chips can be elevated for separation, and kern ships none: level 0 is the contract.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"assist" | "filter" | "suggestion"',
      default: '"assist"',
      note: "The chip kind. `filter` is the toggle; assist and suggestion are press-and-go. Selection props are typed `never` outside `filter`.",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: "The label. Strings and numbers render as label text; any other node renders as-is.",
    },
    {
      name: "value",
      type: "boolean",
      note: "Controlled selection — `filter` only. Reported in the accessibility state.",
    },
    {
      name: "defaultValue",
      type: "boolean",
      default: "false",
      note: "Uncontrolled starting selection — `filter` only.",
    },
    {
      name: "onValueChange",
      type: "(selected: boolean) => void",
      note: "Fires with the next selection — `filter` only. Fires alongside `onPress`, after it.",
    },
    {
      name: "onPress",
      type: 'PressableProps["onPress"]',
      note: "Fires first; a filter chip then toggles UNLESS the handler called `preventDefault()` on the event — the hook for selection you veto.",
    },
    {
      name: "labelStyle",
      type: "TextStyle",
      note: "Restyles the label text only when `children` is text.",
    },
    {
      name: "style",
      type: 'PressableProps["style"]',
      note: "Pressable style — function or value, merged after `chipStyles`. `chipStyles` is exported for the treatment alone.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Stops presses and reports `disabled` in the accessibility state.",
    },
  ],
  aria: [
    "Every chip is a `button` role pressable carrying `selected` and `disabled` in its accessibility state — a filter chip announces its selection, an assist chip announces none.",
    "The label is the control's name; a chip whose `children` is only a glyph needs an accessibility label from the pressable props.",
    "Chips rest at level 0 — no shadow. Separation comes from the fill and the full-round shape, which is the spec's contract, not a shortcut.",
  ],
};
