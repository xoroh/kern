import type { ComponentDoc } from "../types";

export const chip: ComponentDoc = {
  slug: "chip",
  name: "Chip",
  oneLiner:
    "Chips are compact labelled controls: assist and suggestion chips act, filter chips toggle.",
  features:
    "Reach for a chip when a short label needs to be a control: a tag to apply, a filter to toggle, a suggestion to accept. Material 3 defines four chip kinds and the component covers three of them — `assist`, `suggestion` and `filter` — as one discriminated `variant` axis. Only `filter` is a toggle: it owns `selected` state and reports changes, while assist and suggestion chips are press-and-go and the type system refuses selection props on them. A chip is a `Pressable`, so anything a pressable takes it takes, and non-text children (an icon, a leading avatar) render as-is.",
  meta: {
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
  customization: {
    supported: [
      "`variant` is the M3 chip kind; `filter` additionally takes the selection trio (`selected`, `defaultSelected`, `onSelectedChange`).",
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
      name: "selected",
      type: "boolean",
      note: "Controlled selection — `filter` only. Reported in the accessibility state.",
    },
    {
      name: "defaultSelected",
      type: "boolean",
      default: "false",
      note: "Uncontrolled starting selection — `filter` only.",
    },
    {
      name: "onSelectedChange",
      type: "(selected: boolean) => void",
      note: "Fires with the next selection — `filter` only. Fires alongside `onPress`, after it.",
    },
    {
      name: "onPress",
      type: "PressableProps[\"onPress\"]",
      note: "Fires first; a filter chip then toggles UNLESS the handler called `preventDefault()` on the event — the hook for selection you veto.",
    },
    {
      name: "labelStyle",
      type: "TextStyle",
      note: "Restyles the label text only when `children` is text.",
    },
    {
      name: "style",
      type: "PressableProps[\"style\"]",
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
