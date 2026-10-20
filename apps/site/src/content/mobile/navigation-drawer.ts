import type { ComponentDoc } from "../types";

export const navigationDrawer: ComponentDoc = {
  slug: "navigation-drawer",
  name: "Navigation drawer",
  oneLiner:
    "Navigation drawers hold the full destination list in a modal panel, for apps with more places than a bar can carry.",
  meta: {
    // Who owns this page's accuracy, and when it was last reviewed.
    // A real review event: the correctness pass and the one-standard
    // migration both read every page on this date.
    freshness: { owner: "kern-lead", reviewed: "2026-10-20" },
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "NavigationDrawer",
    variants: [],
    // NO row in kern's elevation table. Material 3's table places the modal
    // navigation drawer at resting level 1, but kern ships no elevation token
    // here and the table carries no row, so nothing asserts that level. That
    // is a gap against the spec, not a conformant state — see Customization.
    elevation: "surface",
  },
  parts: ["NavigationDrawer"],
  // The contract, read off the component: a modal with a scrim and a
  // request-close, both routed to the same dismissal.
  keyboard: [
    {
      key: "Android hardware back",
      action:
        "Closes the drawer and reports it through `onOpenChange(false)`, alongside `onDismiss` — the same path a scrim press takes.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        'The drawer is a modal, so the content behind it is not reachable. The scrim reads as a button named "Dismiss navigation drawer"; double-tap on it closes the drawer, and choosing a destination reports the choice and closes the drawer with it.',
    },
  ],
  customization: {
    supported: [
      "`destinations` are data, shared with `NavigationBar` and `NavigationBarItem` — one declaration of your places.",
      "`title` and `subtitle` sit above the list as headline and supporting line.",
      "`footer` is a slot under the list — an account row, an app switcher, sign-out.",
    ],
    notSupported: [
      "There is no `side` prop. The drawer is start-anchored, per Material 3's drawer anatomy.",
      "The width is not a prop. It follows Material 3's section-drawer width and is capped at a share of the viewport so a tablet or foldable keeps its detail pane visible.",
      "Resting elevation is not a prop. Material 3's table places the modal navigation drawer at level 1; kern ships no elevation token on this component and `kern-elevation.ts` carries no row for it, so nothing asserts that level. That is a gap against the spec, not a conformant state, and it is reported to the token owners rather than asserted here.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required — the drawer is always controlled.",
    },
    {
      name: "destinations",
      type: "NavigationDestination[]",
      note: "`{ key, label, icon?, badge?, disabled? }`, the same shape `NavigationBar` takes.",
    },
    {
      name: "value",
      type: "string",
      note: "The selected destination's `key`.",
    },
    {
      name: "onValueChange",
      type: "(key: string) => void",
      note: "Reports the chosen `key`. Picking a destination is expected to close the drawer, and that is the host's to wire.",
    },
    {
      name: "title",
      type: "string",
      note: "Headline above the destination list.",
    },
    {
      name: "subtitle",
      type: "string",
      note: "Supporting line under the headline.",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Slot under the list — an account row, an app switcher, sign-out.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the drawer goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "It is modal: a scrim and a dismissal path, so leaving is always possible.",
    "`title` names the panel, and the destination labels are what make the list readable.",
    "The active indicator marks the current place, and `disabled` destinations announce as disabled.",
    "The elevation gap is stated plainly on this page: Material 3 places the modal drawer at level 1 and nothing here asserts it. Reported rather than claimed.",
  ],
};
