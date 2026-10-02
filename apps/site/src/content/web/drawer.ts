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
    // `shadow-(--md-sys-elevation-level2)`. M3's table names no drawer row, so
    // this level is a kern decision, registered as K6 — see Deviations.
    elevation: 2,
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
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "The top corners are `--md-sys-shape-corner-extra-large`; the panel is otherwise flush to the bottom edge.",
      "Height is capped so the drawer never covers the whole screen; override with `className` on `DrawerContent` when a taller panel is genuinely needed.",
    ],
    notSupported: [
      "There is no `side` or `anchor` prop. This component is bottom-anchored by construction; a side sheet is `Sheet`, not a drawer variant.",
      "There is no `size` prop. Width and height are capped constants.",
      "There is no `elevation` prop. Resting elevation is a registered decision — see Deviations.",
    ],
  },
  deviations: [
    {
      id: "K6",
      spec: "M3's component elevation table does not name a drawer. It tabulates bottom sheet (modal) and side sheet (modal) at level 1 and side sheet (docked) at level 0 — those rows belong to kern's Sheet.",
      kern: "Drawer rests at elevation level 2.",
      why: "There is no spec row to conform to, so the level is a kern decision rather than a claim. Level 2 places the drawer above the app bar and the navigation bar, which also rest at 2, and below a modal dialog at 3, which is where a transient panel belongs in the stack. The choice is registered as K6 in m3-elevation.ts so a future spec row lands on this entry instead of being missed.",
    },
  ],
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
