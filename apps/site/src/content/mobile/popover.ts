import type { ComponentDoc } from "../types";

export const popover: ComponentDoc = {
  slug: "popover",
  name: "Popover",
  oneLiner:
    "Popovers are anchored panels for rich transient content — a composition of trigger and body.",
  features:
    "Reach for a popover when something needs to appear beside its trigger and hold more than a line: a small form, a preview, a set of details. It is a composition rather than a single component — `Root`, `Trigger`, `Content`, `Body` — so the trigger is yours and the panel is yours. The open state is the controllable pattern (`open`, `defaultOpen`, `onOpenChange`), matching `Drawer` and `Tooltip` and differing from the `visible`-based `Dialog`, `Snackbar` and `Sheet`. Keep the content short and leaveable; a popover that grows into a form wants a dialog or a sheet.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Popover",
    variants: [],
    elevation: 2,
  },
  parts: ["Popover"],
  deviations: [
    {
      id: "K6",
      spec: 'M3\'s component elevation table names no popover. It tabulates "menu" and "rich tooltip" at level 2, which kern maps to `navigation-menu` and `tooltip` respectively — neither row describes a popover.',
      kern: "The popover surface rests at elevation level 2.",
      why: "The panel floats above the page beside its trigger and needs the same lift the other anchored overlays at that height have, but borrowing the menu row would claim M3 said something about popovers it never said. Registered as K6 in the elevation inventory so the level is a recorded decision rather than a number sitting in a stylesheet.",
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
