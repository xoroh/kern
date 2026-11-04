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
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
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
      key: "Scrim / back",
      action:
        "Dismisses the surface — dismissal is platform-owned on native, and `dismissible` only removes the explicit close control, never the dismissal itself.",
    },
    {
      key: "Press",
      action:
        "Confirms, cancels and closes through labelled controls; the tabbed dialog keeps the tab press model.",
    },
  ],
  customization: {
    supported: [
      "`variant` picks the surface and `size` picks the modal width; every modal variant renders centred and sheets anchor to the bottom edge.",
      "`trigger` is labelled by the title unless `triggerLabel` renames it.",
      "`tabs`, `activeTab`/`defaultActiveTab`/`onActiveTabChange` scaffold the tabbed dialog without a second tab state.",
      "`snapPoints` with the snap index drives real sheet detents; `footer` carries the footer actions.",
    ],
    notSupported: [
      "There is no edge-anchored sheet. Drawer and side-sheet variants converge onto the one bottom surface — a phone has no usable edge panel.",
      "There is no `side` prop. Edges are a desktop geometry; the bottom surface needs no edge choice.",
      "Popover, drawer and scroll primitives stay composed — the overlay composes them, it never re-implements them.",
    ],
  },
  api: [
    {
      name: "variant",
      type: "KernOverlayVariant",
    },
    {
      name: "open",
      type: "boolean",
    },
    {
      name: "defaultOpen",
      type: "boolean",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
    },
    {
      name: "title",
      type: "string",
      required: true,
      note: "Heading AND the Modal accessible name. Required, string on N.",
    },
    {
      name: "description",
      type: "string",
    },
    {
      name: "size",
      type: "KernOverlaySize",
    },
    {
      name: "dismissible",
      type: "boolean",
      note: "Visible × affordance. Default `true`. N scrim/back dismissal is * platform-owned and always available (see module doc); W additionally * drops scrim dismissal when `false`.",
    },
    {
      name: "onClose",
      type: "() => void",
      note: "Close-button action (DOMAIN action, not state). Renders the ×.",
    },
    {
      name: "snapPoints",
      type: "readonly number[]",
    },
    {
      name: "snapIndex",
      type: "number",
    },
    {
      name: "defaultSnapIndex",
      type: "number",
    },
    {
      name: "onSnapIndexChange",
      type: "(index: number) => void",
    },
    {
      name: "tabs",
      type: "readonly KernOverlayTab[]",
    },
    {
      name: "activeTab",
      type: "string",
    },
    {
      name: "defaultActiveTab",
      type: "string",
    },
    {
      name: "onActiveTabChange",
      type: "(key: string) => void",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Footer-actions slot: Cancel/Apply (`sheet`/`modal`/`tabbed-dialog`).",
    },
    {
      name: "trigger",
      type: "ReactNode",
      note: "Trigger content. Wrapped in the opener; default trigger via `triggerLabel`.",
    },
    {
      name: "triggerLabel",
      type: "string",
    },
    {
      name: "confirmLabel",
      type: "string",
      note: "Alert decision labels (the alert slot's N expression; W uses `footer`).",
    },
    {
      name: "cancelLabel",
      type: "string",
    },
    {
      name: "onConfirm",
      type: "() => void",
    },
    {
      name: "onCancel",
      type: "() => void",
    },
    {
      name: "children",
      type: "ReactNode",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
    },
    {
      name: "testID",
      type: "string",
    },
  ],
  aria: [
    "`title` is required because every floating surface must be nameable — it labels the trigger control and the surface alike.",
    "`description` carries the supporting line beneath the title.",
    "The alert variant keeps the two-action law through the confirm and cancel expressions.",
    "The tabbed-dialog strip is a named tablist, so its tabs announce against the surface label.",
  ],
};
