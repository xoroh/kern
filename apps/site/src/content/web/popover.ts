import type { ComponentDoc } from "../types";

export const popover: ComponentDoc = {
  slug: "popover",
  name: "Popover",
  oneLiner:
    "Popovers surface a small panel of content or controls next to whatever opened them.",
  features:
    "Reach for a popover when a secondary control belongs beside its trigger but has no business taking the whole screen: a colour picker, a link's edit fields, a filter's options. It anchors to its trigger, so the connection between what you pressed and what appeared is obvious. It is not for information a person must read — a tooltip already covers a sentence, and anything longer is a panel or a dialog. It is not for navigation, which is a menu. If the panel has actions that commit something, keep them inside it and give it a title so the panel announces itself.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `Popover`. The nearest thing is `BottomSheetPicker` — a
    // picker in a bottom sheet — which is a different surface on a different
    // edge, not this component. Recorded in docs/parity-contract.md as a real
    // coverage asymmetry rather than disguised by pointing at it.
    nativePeer: "none",
    // No variant axis. The popover is one treatment; the state is open or
    // closed.
    variants: [],
    // kern's own decision. M3's component elevation table names no popover —
    // it has "menu" and "rich tooltip", which kern maps to `navigation-menu`
    // and `tooltip`. The popup ships `--md-sys-elevation-level2`. See
    // Deviations.
    elevation: 2,
  },
  parts: [
    "Popover",
    "PopoverRoot",
    "PopoverTrigger",
    "PopoverContent",
    "PopoverTitle",
    "PopoverDescription",
    "PopoverClose",
  ],
  deviations: [
    {
      id: "K6",
      m3: 'M3\'s component elevation table names no popover. It tabulates "menu" and "rich tooltip" at level 2, which kern maps to `navigation-menu` and `tooltip` respectively — neither row describes a popover.',
      kern: "The popover surface rests at elevation level 2.",
      why: "The panel floats above the page and needs the same lift the other overlays at that height have, but borrowing the menu row would claim M3 said something about popovers it never said. The level is registered as K6 in m3-elevation.ts so the choice is a recorded decision rather than a number sitting in a stylesheet.",
    },
  ],
  anatomy: [
    {
      name: "PopoverRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    { name: "PopoverTrigger", role: "The element the panel is anchored to." },
    {
      name: "PopoverContent",
      role: "The panel. Portals to the end of the document and positions itself against its trigger.",
    },
    {
      name: "PopoverTitle",
      role: "Names the panel, so it announces what appeared rather than just that something did.",
    },
    { name: "PopoverDescription", role: "Supporting line under the title." },
    { name: "PopoverClose", role: "Closes the panel from inside it." },
    { name: "Popover", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The panel's surface, outline and lift come from the system roles and `--md-sys-elevation-level2`.",
      "Width is a set value rather than a fixed one, so a wider control can override it with `className`.",
    ],
    notSupported: [
      "There is no `size` or `variant` prop. One treatment; the state is open or closed.",
      "There is no `placement` or `side` prop. The panel is positioned against its trigger and the offset is fixed.",
      "There is no `modal` prop. A popover does not inert the page — if you need the rest of the page blocked, that is a dialog.",
      "There is no `elevation` prop. The panel's resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `PopoverRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and outside clicks.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On the trigger: it will not open the panel and is announced as unavailable.",
    },
  ],
  aria: [
    "The trigger carries `aria-expanded`, so whether the panel is open is announced before it is opened.",
    "The panel is a dialog-like surface associated with its trigger, and `PopoverTitle` gives it a name so it is not announced as an unnamed region.",
    "Escape closes the panel and focus returns to the trigger, so someone can back out without reaching for the mouse.",
    "The rest of the page is NOT inert while it is open. A popover is an overlay, not a modal — content behind it stays operable.",
  ],
};
