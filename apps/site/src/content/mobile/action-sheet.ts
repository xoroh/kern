import type { ComponentDoc } from "../types";

export const actionSheet: ComponentDoc = {
  slug: "action-sheet",
  name: "Action sheet",
  oneLiner:
    "Action sheets are the titled bottom surface with a dismiss path and a body — either your own content or a standard action list.",
  features:
    "Reach for an action sheet when a titled surface needs to come up from the bottom and be leavable: an app switcher, a create menu, a set of related actions. It is one component for what used to be two, and the merge is the point. `children` lets you own the body entirely — tiles, a custom layout — while `actions` gives the standard Material 3 action list. Supply `children` and `actions` is ignored, so decide which one you mean. Or supply neither and get a plain titled surface. What it guarantees is the dismissal contract: scrim press and hardware back both reach `onDismiss`.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart. The web `Sheet` is a side panel and `Menu` is an
    // anchored list; neither is this surface. No export to name as a peer.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["ActionSheet"],
  customization: {
    supported: [
      "`children` owns the body outright — the slot-driven case, for app switcher tiles and anything with its own layout.",
      "`actions` renders the standard Material 3 action list from data — `key`, `label`, optional `supporting`, optional `icon`, optional `onPress`.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `variant` or `size` prop.",
      "`actions` is IGNORED when `children` is supplied. The two are alternatives, not layers — supplying both silently drops the actions rather than composing them.",
      "There is no `dismissible` flag here. The dismissal contract is fixed: scrim press and hardware back both call `onDismiss`. The close affordance itself belongs to `SheetSurface`, which this hosts through.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required.",
    },
    {
      name: "title",
      type: "string",
      note: "Required. Names the surface, so what came up is announced rather than only that something did.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "Owns the body. When supplied, `actions` is IGNORED — the two are alternatives, not layers.",
    },
    {
      name: "actions",
      type: "CreateSheetAction[]",
      note: "The standard Material 3 action list: `key`, `label`, optional `supporting`, optional `icon`, optional `onPress`. Used only when `children` is absent.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Wired to BOTH scrim press and hardware back. This is the contract the component guarantees — an earlier pair of components accepted `onDismiss` and one of them silently ignored it.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "The surface is named by `title`, so the announcement says what has come up.",
    "The dismissal contract is real: scrim press and hardware back both work, so there is always a way out — which is the failure this component exists to fix.",
    "Each action is a real pressable with a `label` and an optional `supporting` line, so the list is readable without the icons.",
  ],
};
