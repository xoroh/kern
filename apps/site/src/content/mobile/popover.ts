import type { ComponentDoc } from "../types";

export const popover: ComponentDoc = {
  slug: "popover",
  name: "Popover",
  oneLiner:
    "Popovers are anchored panels for rich transient content — a composition of trigger and body.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Popover",
    variants: [],
    elevation: 2,
  },
  parts: ["Popover"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The trigger reads as a button and announces whether the panel is open; double-tap opens it, and double-tap on it again closes it.",
    },
    {
      key: "Swipe + double-tap on the panel (TalkBack / VoiceOver)",
      action:
        "The panel is announced as a dialog named by its label, and its body is a labelled dismiss control — double-tap on it dismisses the panel.",
    },
  ],
  customization: {
    supported: [
      "`Trigger` and `Content` are slots, so both the control and the panel are yours.",
      "`open`/`defaultOpen`/`onOpenChange` make it controlled or uncontrolled.",
      "`Body` is the part that lays the panel's content out.",
    ],
    notSupported: [
      "There is no `placement` or `side` prop here. Positioning beside the trigger is the platform's; `Tooltip` is the one that takes a `placement`.",
      "There is no `modal` toggle. A popover is non-modal by nature; an interrupting panel is a `Dialog`.",
      "There is no `actions` row. Actions belong in the content you give it.",
    ],
  },
  api: [
    {
      name: "open / defaultOpen",
      type: "boolean",
      note: "Controlled or uncontrolled open state — the `open` family, not `visible`. Omit `open` and `defaultOpen` gives you the uncontrolled case.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Reports every change of the open state.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "On `Root`: the trigger and content. The composition is `Root`, `Trigger`, `Content`, `Body` — both the control and the panel are yours.",
    },
    {
      name: "Popover parts",
      type: "{ Root, Trigger, Content, Body }",
      note: "A namespace object, not a single component. `Trigger` is the control, `Content` the panel, `Body` the panel's layout.",
    },
  ],
  aria: [
    "A popover is NON-modal: it does not trap and does not interrupt, so the reader can move past it.",
    "The trigger is yours, which means naming it is yours too — a trigger with no accessible name opens an unnamed panel.",
    "It is transient content, so it should be leaveable and its content should not require finishing.",
  ],
};
