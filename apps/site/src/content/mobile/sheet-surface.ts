import type { ComponentDoc } from "../types";

export const sheetSurface: ComponentDoc = {
  slug: "sheet-surface",
  name: "Sheet surface",
  oneLiner:
    "Sheet surfaces are the shared bottom-sheet shell — scrim, dismissal, close affordance and body — that the sheets are built on.",
  features:
    "Reach for a sheet surface when you are building a bottom panel of your own and want the parts that are easy to get wrong for free: the scrim, the hardware-back path, a visible way out. It is the shell the sheet family shares, so building on it means your panel behaves like the rest rather than merely looking like it. The rule worth internalising is the dismissal default: if you supply `onDismiss`, the close affordance appears. A panel that declares a dismissal path always has a visible way out, and you opt out only when the sheet is deliberately scrim-and-back only.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart: the web `Sheet` is a composed component rather than
    // an exposed shell. No export to name as a peer.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["SheetSurface"],
  customization: {
    supported: [
      "`surface` takes the card's `ViewStyle`, and it is passed the resolved scheme so the body reads tokens rather than literal colours.",
      "`handle` is a slot for the drag affordance — hide it or replace it for sheets that are not dismissible by drag.",
      "`closeLabel` overrides the close button's accessible name.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop. The shell is one shape; the sheets built on it decide their heights.",
      "There is no `scrimColor` prop. The scrim is the system's.",
      "`dismissible` is a boolean with one meaning and one default — it is not a mode selector.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Drives the modal's visibility. Required.",
    },
    {
      name: "title",
      type: "string",
      note: "Required. Names the surface.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Wired to BOTH scrim press and hardware back. One handler covers every way of leaving.",
    },
    {
      name: "dismissible",
      type: "boolean",
      note: "Renders the Material 3 close affordance — a 48x48 icon button bound to `onDismiss`. Defaults to `true` WHENEVER `onDismiss` is supplied, so a sheet that declares a dismissal path always has a visible way out. Set `false` only for a sheet that is deliberately scrim/back-only.",
    },
    {
      name: "closeLabel",
      type: "string",
      note: "Overrides the close button's accessible name.",
    },
    {
      name: "handle",
      type: "ReactNode",
      note: "Slot for the drag affordance. Hide it for sheets that are not dismissible by drag, so the handle never promises a gesture the sheet will not honour.",
    },
    {
      name: "surface",
      type: "ViewStyle",
      note: "The card body's style. It receives the resolved scheme, so the body reads tokens rather than literal colours.",
    },
    {
      name: "testID",
      type: "string",
      note: "Required here — the shell is what tests hook onto, so it is not optional the way it is elsewhere.",
    },
  ],
  aria: [
    "The surface is named by `title`.",
    "Scrim press and hardware back both reach `onDismiss`, so leaving is always possible — the guarantee the whole family is built on.",
    "`dismissible` putting a close button on screen by default is an accessibility decision: a dismissal path with no visible control is a path only some people can find.",
    "`closeLabel` names that button, so it can be made specific rather than generic.",
  ],
};
