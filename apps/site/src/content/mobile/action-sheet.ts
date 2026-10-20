import type { ComponentDoc } from "../types";

export const actionSheet: ComponentDoc = {
  slug: "action-sheet",
  name: "Action sheet",
  oneLiner:
    "Action sheets are the titled bottom surface with a dismiss path and a body — either your own content or a standard action list.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart. The web `Sheet` is a side panel and `Menu` is an
    // anchored list; neither is this surface. No export to name as a peer.
    nativePeer: "none",
    variants: [],
    // Level 0: the native modal sheets carry no elevation token (flat;
    // web rests at level 1). Whether flat-native is deliberate or missing
    // elevation is an open owner question — this claims the shipped value.
    elevation: 0,
  },
  parts: ["ActionSheet"],
  // The contract, read off the modal the sheet hosts through: the scrim
  // press and the hardware back button are the two ways out, and each
  // action is a real pressable with its own label.
  keyboard: [
    {
      key: "Hardware back (Android)",
      action:
        "Closes the sheet. The modal's request-close is wired to the same `onDismiss` path as a scrim press, so there is always a way out.",
    },
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Activates an action in the list. Each one is a real pressable with a label and an optional supporting line.",
    },
  ],
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
