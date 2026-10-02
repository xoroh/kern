import type { ComponentDoc } from "../types";

export const drawer: ComponentDoc = {
  slug: "drawer",
  name: "Drawer",
  oneLiner:
    "Drawers slide a panel in from the side over the current screen, with a title and a real open state.",
  features:
    "Reach for a drawer when the content is secondary to what is on screen and should slide over it rather than replace it: filters, details, a short form. It is a modal panel with a title, and unlike most of this family it has a proper open STATE — `open`, `defaultOpen` and `onOpenChange` — so it works controlled or uncontrolled and reports every change. That is worth noticing, because `Dialog`, `Snackbar` and `Sheet` take `visible` and `onDismiss` instead. If you are moving code between these surfaces, that rename is the first thing you will hit.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Drawer",
    variants: [],
    elevation: 2,
  },
  parts: ["Drawer"],
  deviations: [
    {
      id: "K6",
      spec: "M3's component elevation table tabulates Navigation drawer (modal) at level 1, and side sheet (modal) at level 1 with side sheet (docked) at level 0 — those sheet rows belong to kern's Sheet.",
      kern: "Drawer rests at elevation level 2.",
      why: "Level 2 is one above the tabulated Navigation drawer (modal) at 1 — a real departure, not an absence of a row to conform to. It places the drawer above the app bar and the navigation bar, which also rest at 2, and below a modal dialog at 3, where a transient panel belongs in the stack. Registered in the elevation inventory under K6; note that the inventory records K6 for ten unassigned-elevation components and K6 is the TONES id, so the registration itself needs correcting to the elevation id — tracked with design-system-lead.",
    },
  ],
  customization: {
    supported: [
      "`title` is the panel's name and `children` is its body.",
      "`open`/`defaultOpen`/`onOpenChange` make it controlled OR uncontrolled, which is more than the `visible`-based surfaces offer.",
      "`style` is available through the underlying modal props it extends.",
    ],
    notSupported: [
      "There is no `side` prop. The panel is start-anchored.",
      "There is no `dismissible` flag. Scrim press and the close control both go through `onOpenChange`, so dismissal is one path.",
      "There is no `elevation` prop. Resting elevation is not adjustable.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state. Optional — omit it and `defaultOpen` plus `onOpenChange` give you the uncontrolled case. This is the `open`/`onOpenChange` family, NOT the `visible`/`onDismiss` one that `Dialog`, `Snackbar` and `Sheet` use.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      note: "Initial state for the uncontrolled case. The presence of this prop is exactly what the `visible`-based surfaces do not have.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Called with the REQUESTED open state, from both the scrim and the close control. One handler covers every way in and out.",
    },
    {
      name: "title",
      type: "string",
      note: "REQUIRED. The accessible name for the drawer surface.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The panel body.",
    },
    {
      name: "…ModalProps",
      type: "Omit<ModalProps, 'visible' | 'onRequestClose'>",
      note: "The modal props it extends, minus the two this component owns. That is why `visible` and `onRequestClose` are absent — `open`/`onOpenChange` replace them.",
    },
  ],
  aria: [
    "`title` is required and is the panel's accessible name — a panel with no name is an unlabelled region.",
    "`onOpenChange` receives the requested state from the scrim AND the close control, so there is always a way out and one handler to react to it.",
    "It is modal, so it traps focus and interrupts — appropriate for secondary content that must be finished or dismissed before returning.",
  ],
};
