import type { ComponentDoc } from "../types";

export const dockSheet: ComponentDoc = {
  slug: "dock-sheet",
  name: "Dock sheet",
  oneLiner:
    "The dock sheet is a persistent quick-action bar peeking from the bottom edge — a region, not a dialog.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "DockSheet",
    variants: [],
    // Deliberate: the dock sheet ships NO elevation token. It is a persistent,
    // non-modal surface — a docked panel at modal elevation misreads as an
    // overlay. M3's docked sheet row rests at 0 (`shadow: none`), which is
    // this treatment.
    elevation: "surface",
  },
  parts: ["DockSheet"],
  // The dock is a REGION, not a dialog: it takes no focus of its own, traps
  // nothing and binds no key. The tab stops are the controls the host put
  // inside it, in the order it put them — which is the whole difference
  // between a dock and a modal sheet.
  keyboard: [
    {
      key: "Tab / Shift+Tab",
      action:
        "Moves through the controls inside the dock in order. The dock itself takes no focus and traps nothing, so the page behind it stays reachable.",
    },
    {
      key: "Enter / Space",
      action:
        "Activates the focused control inside the dock. The dock binds no key of its own.",
    },
  ],
  customization: {
    supported: [
      "`label` names the region for assistive technology — the dock is navigable by name.",
      "`children` is the bar's content: actions, controls, whatever the strip carries.",
      "`className` is passed through and merged after the dock's own classes.",
    ],
    notSupported: [
      "There is no `open` state and no dismissal. A dock is PERSISTENT — a dismissible bottom surface is a `BottomSheet`.",
      "No scrim, no focus trap, no interaction lock. If the page must wait for the user, this is the wrong component.",
      "There is no elevation prop. The dock carries none on purpose — see the metadata strip.",
    ],
  },
  api: [
    {
      name: "label",
      type: "string",
      required: true,
      note: "The region's accessible name. The dock is a `region`, and an unnamed region is just a box.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The bar's content — laid out in a row with the dock's spacing.",
    },
    {
      name: "className",
      type: "string",
      note: "Passed through and merged after the dock's own classes.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-dock-sheet"',
      note: "Test hook for the dock.",
    },
  ],
  aria: [
    'The dock is `role="region"` labelled by `label` — a named landmark, not a dialog: no `aria-modal`, no focus trap, no interaction lock.',
    "Everything inside the dock is ordinary page content to assistive technology — the controls are named by their own labels.",
    "The absence of elevation is part of the contract: at modal elevation a persistent panel misreads as an overlay, and the semantics (a region) must match the paint (no shadow).",
  ],
};
