import type { ComponentDoc } from "../types";

export const kernOverlay: ComponentDoc = {
  slug: "kern-overlay",
  name: "Kern overlay",
  oneLiner:
    "Kern overlay is the one variant contract over modal, sheet, drawer, side-sheet, alert, tabbed dialog and dock.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: authored and source-checked on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-11-04" },
    status: "real",
    package: "@xoroh/kern",
    // Native twin, checked in the native inventory.
    nativePeer: "KernOverlay",
    variants: [
      "variant: modal · sheet · drawer · side-sheet · alert · tabbed-dialog · dock",
      "size: sm · md · lg · full",
    ],
    // Not tabulated in M3's component elevation table, and the component ships
    // no elevation token. Reported by check:docs as unasserted rather than as
    // conformant — see the gap note in that output.
    elevation: "surface",
  },
  parts: ["KernOverlay"],
  keyboard: [
    {
      key: "Escape",
      action:
        "Always dismisses, per M3 — scrim and outside-press dismissal are separately controlled by `dismissible`, but Escape is not negotiable.",
    },
    {
      key: "Tab / Shift+Tab",
      action:
        "Focus stays inside the surface while it is open; the composed primitives own the trap.",
    },
  ],
  customization: {
    supported: [
      "`variant` picks the surface and `size` picks the dialog width; `side` picks the edge for the side-sheet.",
      "`trigger` is an element rendered AS the trigger in the Base UI render model — composition, not a second button.",
      "`tabs`, `activeTab`/`defaultActiveTab`/`onActiveTabChange` scaffold the tabbed dialog without a second tab state.",
      "`snapPoints` with the snap index render the detented sheet; `footer` carries the footer actions.",
    ],
    notSupported: [
      "There is no true edge-to-edge immersive dialog. `size` full is the near-viewport form; the immersive form stays open pending the WP6 addendum.",
      "Popover, drawer, scroll-area and the menu and sheet families stay composed primitives — the overlay composes them, it never re-implements them.",
      "There is no second scaffold for the tabbed dialog. Step and tab bodies ride the tab items so every tab keeps a resolving panel target.",
    ],
  },
  api: [
    {
      name: "variant",
      type: '"modal" | "sheet" | "drawer" | "side-sheet" | "alert" | "tabbed-dialog" | "dock"',
    },
    {
      name: "open",
      type: "boolean | undefined",
    },
    {
      name: "defaultOpen",
      type: "boolean | undefined",
    },
    {
      name: "onOpenChange",
      type: "((open: boolean) => void) | undefined",
    },
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: "Heading. Required: every overlay surface must be nameable.",
    },
    {
      name: "description",
      type: "ReactNode",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "full"',
    },
    {
      name: "side",
      type: '"left" | "right"',
      note: "Edge for `side-sheet` — the `drawer` variant is bottom-anchored.",
    },
    {
      name: "dismissible",
      type: "boolean | undefined",
      note: "Scrim/outside-press dismissal. Default `true`. Escape ALWAYS dismisses (M3 back-dismissal); `false` only removes scrim dismissal and is honoured by the dialog-root variants (`modal`, `drawer`, `side-sheet`, `tabbed-dialog`). Bottom `sheet`/`dock` stay scrim-dismissible — M3 modal sheets have no non-dismissible form, so a blocking flow must use `modal`. `alert` is always dismissible (the primitive omits the knob).",
    },
    {
      name: "onClose",
      type: "(() => void) | undefined",
      note: "Close-button action (R2 lexicon: a DOMAIN action, not state). Renders the × control; fires when it activates. Omit it and no × renders.",
    },
    {
      name: "modal",
      type: "boolean | undefined",
      note: "Modal root for `side-sheet`. Default `true`; `false` leaves the page interactive.",
    },
    {
      name: "snapPoints",
      type: "readonly number[] | undefined",
    },
    {
      name: "snapIndex",
      type: "number | undefined",
    },
    {
      name: "defaultSnapIndex",
      type: "number | undefined",
    },
    {
      name: "onSnapIndexChange",
      type: "((index: number) => void) | undefined",
    },
    {
      name: "tabs",
      type: "readonly KernOverlayTab[] | undefined",
      note: "Tabbed-dialog scaffold: strip + panels. Only read by `tabbed-dialog`.",
    },
    {
      name: "activeTab",
      type: "string | undefined",
    },
    {
      name: "defaultActiveTab",
      type: "string | undefined",
    },
    {
      name: "onActiveTabChange",
      type: "((key: string) => void) | undefined",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer-actions slot: Cancel/Apply, confirm/dismiss.",
    },
    {
      name: "trigger",
      type: "ReactElement<unknown, string | JSXElementConstructor<any>> | undefined",
      note: "Trigger slot: the element rendered AS the trigger (Base UI `render` model — typically a `<button>`; never a bare string). The primitive merges open/focus behaviour onto it, so focus-return on dismiss is preserved. `sheet`/`dock` wrap it in an opener span instead (the sheet-family surfaces own no trigger part).",
    },
    {
      name: "children",
      type: "ReactNode",
    },
    {
      name: "label",
      type: "string | undefined",
      note: "Accessible name for sheet-family surfaces when `title` is a node. Defaults to the title text when `title` is a string.",
    },
    {
      name: "className",
      type: "string | undefined",
    },
    {
      name: "testID",
      type: "string | undefined",
    },
  ],
  aria: [
    "`title` is required because every floating surface must be nameable — it is the accessible name, defaulting from the title text.",
    "`description` carries the supporting line beneath the title.",
    "The alert variant keeps the M3 two-action law through the footer actions.",
    "The tabbed-dialog strip is a named tablist, so its tabs announce against the surface label.",
  ],
};
