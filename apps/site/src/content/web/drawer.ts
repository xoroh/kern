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
    dont: ["Don't trap focus without announcing modality."],
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
    {
      name: "defaultOpen",
      for: ["DrawerRoot"],
      type: "boolean | undefined",
      note: "Whether the drawer starts open in the uncontrolled case. Use `open` for controlled.",
    },
    {
      name: "modal",
      for: ["DrawerRoot"],
      type: 'boolean | "trap-focus" | undefined',
      note: "Whether the drawer is modal: `true` traps focus, locks scroll and blocks outside pointer input; `false` leaves the document usable; `trap-focus` traps focus only, leaving scroll and outside input alone.",
    },
    {
      name: "onOpenChangeComplete",
      for: ["DrawerRoot"],
      type: "((open: boolean) => void) | undefined",
      note: "Fires after the open/close animation finishes. Where exit side-effects belong, not in `onOpenChange`.",
    },
    {
      name: "disablePointerDismissal",
      for: ["DrawerRoot"],
      type: "boolean | undefined",
      note: "Whether outside presses stop dismissing the drawer. On a non-modal drawer it also keeps focus moving outside from closing it.",
    },
    {
      name: "actionsRef",
      for: ["DrawerRoot"],
      type: "RefObject<DrawerRootActions | null> | undefined",
      note: "Imperative handle: `close()` dismisses the drawer; `unmount()` ends an externally controlled closing animation (call `preventUnmountOnClose()` in `onOpenChange` first).",
    },
    {
      name: "handle",
      for: ["DrawerRoot", "DrawerTrigger"],
      type: "DrawerHandle<unknown> | undefined",
      note: "Associates the drawer with a trigger: create one with `Drawer.createHandle()`, set on a detached trigger to drive the open state, read on the root to accept it.",
    },
    {
      name: "triggerId",
      for: ["DrawerRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the drawer answers to. For controlled drawers (`open` set); uncontrolled drawers need no id.",
    },
    {
      name: "defaultTriggerId",
      for: ["DrawerRoot"],
      type: "string | null | undefined",
      note: "Id of the trigger the drawer answers to, for an initially open drawer (`defaultOpen` set).",
    },
    {
      name: "children",
      for: ["DrawerRoot"],
      type: "ReactNode | PayloadChildRenderFunction<unknown>",
      note: "The drawer's content — or a render function receiving the active trigger's payload.",
    },
    {
      name: "swipeDirection",
      for: ["DrawerRoot"],
      type: "SwipeDirection | undefined",
      note: "Which swipe direction dismisses the drawer. Set it from the edge the drawer attaches to.",
    },
    {
      name: "snapPoints",
      for: ["DrawerRoot"],
      type: "DrawerSnapPoint[] | undefined",
      note: "Positions the drawer can rest at while dragging. Fractions of the viewport height (0–1), larger numbers as pixels, or `px`/`rem` strings.",
    },
    {
      name: "snapToSequentialPoints",
      for: ["DrawerRoot"],
      type: "boolean | undefined",
      note: "Whether a drag moves through snap points in order instead of skipping by velocity. Distance decides, not flick speed.",
    },
    {
      name: "snapPoint",
      for: ["DrawerRoot"],
      type: "DrawerSnapPoint | null | undefined",
      note: "The active snap point, when controlled. Pair with `onSnapPointChange`; use `defaultSnapPoint` for uncontrolled.",
    },
    {
      name: "defaultSnapPoint",
      for: ["DrawerRoot"],
      type: "DrawerSnapPoint | null | undefined",
      note: "The initial snap point in the uncontrolled case.",
    },
    {
      name: "onSnapPointChange",
      for: ["DrawerRoot"],
      type: "((snapPoint: DrawerSnapPoint | null, eventDetails: DrawerRootSnapPointChangeEventDetails) => void) | undefined",
      note: "Fires when the active snap point changes. Where the controlled `snapPoint` state lives.",
    },
    {
      name: "payload",
      for: ["DrawerTrigger"],
      type: "unknown",
      note: "Data handed to the drawer when this trigger opens it, read by a payload render function in the root's children.",
    },
    {
      name: "id",
      for: ["DrawerTrigger"],
      type: "string | undefined",
      note: "Id of the trigger, forwarded to the rendered element and naming the active trigger for controlled drawers (with the root's `triggerId` prop).",
    },
    {
      name: "nativeButton",
      for: ["DrawerTrigger", "DrawerClose"],
      type: "boolean | undefined",
      note: "Declares whether the `render` replacement is a native `<button>`, so semantics and keyboard behavior stay correct.",
    },
    {
      name: "initialFocus",
      for: ["DrawerContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((openType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "What to focus when the drawer opens: `true` for the default (first tabbable or the popup), a ref for a specific element, a function of the interaction type, `false` to move nothing.",
    },
    {
      name: "finalFocus",
      for: ["DrawerContent"],
      type: "boolean | RefObject<HTMLElement | null> | ((closeType: InteractionType) => boolean | void | HTMLElement | null) | undefined",
      note: "Where focus returns when the drawer closes: the trigger (or previously focused element) by default; a ref, a function of the close type, or `false` to leave it.",
    },
    {
      name: "style",
      for: [
        "DrawerTrigger",
        "DrawerContent",
        "DrawerTitle",
        "DrawerDescription",
        "DrawerClose",
      ],
      type: "CSSProperties | ((state) => CSSProperties | undefined) | undefined",
      note: "Style for the part, or a function of the part's state returning style — `DrawerTriggerState` on the trigger, `DrawerPopupState` on the surface, `DrawerTitleState` on the title, `DrawerDescriptionState` on the description, `DrawerCloseState` on the close control.",
    },
    {
      name: "render",
      for: [
        "DrawerTrigger",
        "DrawerContent",
        "DrawerTitle",
        "DrawerDescription",
        "DrawerClose",
      ],
      type: "ReactElement | ((props, state) => ReactElement) | undefined",
      note: "Replaces the part's element with another tag or composes it with another component — the render function receives the part's props and state. Set `nativeButton` on the trigger or close control when the replacement is a native `<button>`.",
    },
  ],
  aria: [
    'The panel sets `role="dialog"` and `aria-modal="true"`, because a modal drawer inerts the page behind it and must say so.',
    "`DrawerTitle` becomes the accessible name and `DrawerDescription` the description.",
    "Escape closes the drawer and focus returns to the element that opened it.",
  ],
};
