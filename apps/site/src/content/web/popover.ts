import type { ComponentDoc } from "../types";

export const popover: ComponentDoc = {
  slug: "popover",
  name: "Popover",
  oneLiner:
    "Popovers surface a small panel of content or controls next to whatever opened them.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
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
    // and `tooltip`. The popup ships `--sys-elevation-level2`. See
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
  // The states this component registers, carried from the token table
  // that now lives in docs/m3-guidance/<family>.md.
  states: ["resting"],
  keyboard: [
    {
      key: "Escape",
      action: "Closes the popover; focus returns to the trigger.",
    },
    {
      key: "Enter / Space",
      action:
        "Opens the panel from the trigger. The trigger is a real button, so the press is the browser's own.",
    },
    {
      key: "Tab",
      action:
        "Moves focus into the panel when it opens — onto the first focusable inside it — and then on through the page. A popover does not trap focus, because the content behind it stays operable.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The panel's surface, outline and lift come from the system roles and `--sys-elevation-level2`.",
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
      for: ["PopoverRoot"],
      type: "boolean",
      note: "Controlled open state on `PopoverRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      for: ["PopoverRoot"],
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and outside clicks.",
    },
    {
      name: "className",
      for: [
        "PopoverTrigger",
        "PopoverContent",
        "PopoverTitle",
        "PopoverDescription",
        "PopoverClose",
      ],
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      for: ["PopoverTrigger", "PopoverClose"],
      type: "boolean",
      note: "On the trigger: it will not open the panel and is announced as unavailable.",
    },
    {
      name: "defaultOpen",
      for: ["PopoverRoot"],
      type: "boolean | undefined",
      note: "Whether the popover starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["PopoverRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "actionsRef",
      for: ["PopoverRoot"],
      type: "RefObject<PopoverRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the popover; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "modal",
      for: ["PopoverRoot"],
      type: 'boolean | "trap-focus" | undefined',
      note: "Whether the open popover is modal: `true` locks scroll and blocks outside pointer input; `false` leaves the document usable; `trap-focus` traps focus only.",
    },
    {
      name: "triggerId",
      for: ["PopoverRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the popover answers to. For controlled popovers (`open` set); uncontrolled popovers need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["PopoverRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the popover answers to, for an initially open popover (`defaultOpen` set).",
    },
    {
      name: "handle",
      for: ["PopoverRoot", "PopoverTrigger"],
      type: "PopoverHandle<unknown> | undefined",
      note: "Associates the popover with a trigger: set on an external trigger to drive the open state, read on the root to accept it.",
    },
    {
      name: "children",
      for: ["PopoverRoot"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "The popover's content — or a render function receiving the active trigger's payload.",
    },
    {
      name: "nativeButton",
      for: ["PopoverTrigger", "PopoverClose"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "payload",
      for: ["PopoverTrigger"],
      type: "unknown",
      note: "Data handed to the popover when this trigger opens it, read by a payload render function in the root's children.",
    },
    {
      name: "id",
      for: ["PopoverTrigger"],
      type: "string | undefined",
      note: "Id of the trigger, forwarded to the rendered element and naming the active trigger for controlled popovers (with the root's `triggerId` prop).",
    },
    {
      name: "openOnHover",
      for: ["PopoverTrigger"],
      type: "boolean | undefined",
      note: "Whether hovering the trigger opens the popover as well as pressing it.",
    },
    {
      name: "delay",
      for: ["PopoverTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before a hovered trigger opens its popover. Needs `openOnHover`.",
    },
    {
      name: "closeDelay",
      for: ["PopoverTrigger"],
      type: "number | undefined",
      note: "Milliseconds to wait before closing a hover-opened popover. Needs `openOnHover`.",
    },
    {
      name: "initialFocus",
      for: ["PopoverContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the popover opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["PopoverContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the popover closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "style",
      for: [
        "PopoverTrigger",
        "PopoverContent",
        "PopoverTitle",
        "PopoverDescription",
        "PopoverClose",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `PopoverTriggerState` on the trigger, `PopoverPopupState` on the surface, `PopoverTitleState` on the title, `PopoverDescriptionState` on the description, `PopoverCloseState` on the close control.",
    },
    {
      name: "render",
      for: [
        "PopoverTrigger",
        "PopoverContent",
        "PopoverTitle",
        "PopoverDescription",
        "PopoverClose",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or close control when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    "The trigger carries `aria-expanded`, so whether the panel is open is announced before it is opened.",
    "The panel is a dialog-like surface associated with its trigger, and `PopoverTitle` gives it a name so it is not announced as an unnamed region.",
    "Escape closes the panel and focus returns to the trigger, so someone can back out without reaching for the mouse.",
    "The rest of the page is NOT inert while it is open. A popover is an overlay, not a modal — content behind it stays operable.",
  ],
};
