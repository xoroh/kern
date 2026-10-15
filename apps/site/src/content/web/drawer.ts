import type { ComponentDoc } from "../types";

export const drawer: ComponentDoc = {
  slug: "drawer",
  name: "Drawer",
  oneLiner:
    "A drawer is a panel that slides up from the bottom edge for a short, self-contained step.",
  features:
    "Reach for a drawer when someone needs to pick, filter or confirm without losing their place: choosing a date, setting filters, confirming a payment method. It anchors to the bottom edge, so it works with one hand and does not fight the content above it. Keep the task to one decision — a drawer that grows into a form has outgrown itself and should become a route. It is not for navigation between places; that is the navigation drawer's job.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    // Native has no `Drawer`. Its bottom-anchored surface is `Sheet`
    // (`SheetSurface`, `SheetHandle`), and it has `NavigationDrawer` for the
    // navigation case — neither is this component. Recorded in
    // docs/parity-contract.md as a real coverage asymmetry, not disguised by
    // pointing at a near-neighbour.
    nativePeer: "none",
    variants: [],
    // Conformant: `shadow-(--sys-elevation-level1)`, matching M3's
    // `navigation drawer (modal)` row at level 1. It sits with kern's other
    // modal surfaces — Sheet, SnapSheet, EntitySheet and the picker sheet all
    // ship level 1 — because it is the same kind of surface: bottom-anchored,
    // top-rounded only, capped height, with a backdrop.
    elevation: 1,
  },
  parts: [
    "Drawer",
    "DrawerRoot",
    "DrawerTrigger",
    "DrawerContent",
    "DrawerTitle",
    "DrawerDescription",
    "DrawerClose",
  ],
  anatomy: [
    {
      name: "DrawerRoot",
      role: "Owns the open state. Accepts `open`/`onOpenChange` to control it.",
    },
    {
      name: "DrawerTrigger",
      role: "The element that opens the drawer.",
    },
    {
      name: "DrawerContent",
      role: "The panel. Portals to the end of the document, renders the backdrop and anchors to the bottom edge.",
    },
    { name: "DrawerTitle", role: "The accessible name of the drawer." },
    {
      name: "DrawerDescription",
      role: "The body text, wired to `aria-describedby`.",
    },
    { name: "DrawerClose", role: "Closes the drawer from inside it." },
  ],
  keyboard: [
    {
      key: "Escape",
      action: "Closes the surface; focus returns to the trigger.",
    },
    {
      key: "Tab / Shift+Tab",
      action: "Trapped inside while modal; the page behind is inert.",
    },
  ],
  usage: {
    do: [
      "Use modal sheets for tasks that need focus — the scrim marks the interruption.",
      "Let content scroll inside with titles pinned where applicable.",
    ],
    dont: [
      "Don't trap focus without announcing modality.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "comp.sheet.container",
      value: "surface-container-low, 28px leading edge, level3",
    },
    {
      element: "Scrim",
      state: "resting",
      token: "sys.color.scrim",
      value: "32%",
    },
  ],
  faq: [
    {
      q: "Bottom drawer or side sheet?",
      a: "Bottom drawers rise for compact flows; side sheets dock for persistent panels.",
    },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The top corners are `--sys-shape-corner-extra-large`; the panel is otherwise flush to the bottom edge.",
      "Height is capped so the drawer never covers the whole screen; override with `className` on `DrawerContent` when a taller panel is genuinely needed.",
    ],
    notSupported: [
      "There is no `side` or `anchor` prop. This component is bottom-anchored by construction; a side sheet is `Sheet`, not a drawer variant.",
      "There is no `size` prop. Width and height are capped constants.",
      "There is no `elevation` prop. Resting elevation is level 1, conformant with M3's navigation drawer (modal) row.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state on `DrawerRoot`. Omit for uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean, eventDetails: object) => void",
      note: "Fires on every open and close, including Escape and backdrop clicks.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
  ],
  aria: [
    'The panel sets `role="dialog"` and `aria-modal="true"`, because a modal drawer inerts the page behind it and must say so.',
    "`DrawerTitle` becomes the accessible name and `DrawerDescription` the description.",
    "Escape closes the drawer and focus returns to the element that opened it.",
  ],
};
