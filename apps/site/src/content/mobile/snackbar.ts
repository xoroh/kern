import type { ComponentDoc } from "../types";

export const snackbar: ComponentDoc = {
  slug: "snackbar",
  name: "Snackbar",
  oneLiner:
    "Snackbars confirm something happened, briefly, with an optional action to undo it.",
  features:
    "Reach for a snackback when the result of an action needs confirming and nothing more: a message sent, a setting saved, an item removed. It appears over the content, it says one thing, and it goes away. The optional action is what makes it useful rather than decorative — undo, retry, view — but keep it to one, and keep the action reversible, because a snackbar that disappears is a poor place for a decision. It takes `visible` and `onDismiss` — the only surface in the family still on that contract (`Dialog` and `Sheet` share the `open`/`onOpenChange` contract, alongside `Drawer`, `Popover` and `Tooltip`).",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Snackbar",
    variants: [],
    elevation: 2,
  },
  parts: ["Snackbar"],
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Announces as an alert when it appears; the optional action reads as a button and double-tap runs it, then dismisses.",
    },
  ],
  usage: {
    do: [
      "Confirm exactly one thing — sent, saved, removed — then get out of the way.",
      "Offer at most one reversible action (undo, retry, view); the action fires `onAction` and dismisses in one press.",
      "Drive `visible` from the event that caused it and clear it in `onDismiss` — the host owns timing, not the component.",
    ],
    dont: [
      "Don't put decisions in a snackbar — a transient surface is a poor place for a choice; that is a dialog.",
      "Don't stack snackbars — one message at a time, or none of them reads.",
    ],
  },
  tokens: [
    {
      element: "Container",
      state: "resting",
      token: "theme.color.inverseSurface",
      value: "inverseSurface, level 3 (elevation 6, iOS quartet)",
    },
    {
      element: "Message",
      state: "resting",
      token: "theme.color.inverseOnSurface",
      value: "inverseOnSurface",
    },
    {
      element: "Action",
      state: "resting",
      token: "theme.color.inversePrimary",
      value: "inversePrimary label button, minHeight 48",
    },
  ],
  faq: [
    {
      q: "Snackbar or dialog?",
      a: "Low importance with an optional reversible action and auto-dismiss means snackbar; a required decision that blocks means dialog. Blocking never belongs in a transient.",
    },
    {
      q: "Why `visible` instead of `open`?",
      a: "The snackbar is the one surface still on the `visible`/`onDismiss` contract — it renders nothing while hidden and carries no open state to control. Everything else in the family moved to `open`.",
    },
  ],
  deviations: [
    {
      id: "K11",
      spec: "M3's component elevation table names no snackbar. It tabulates menus and tooltips at level 2 and dialogs at level 3, but no row describes a transient confirmation.",
      kern: "The snackbar rests at elevation level 2.",
      why: "A confirmation has to clear the content it sits over without competing with a dialog above it. Level 2 places it with the other transient overlays. Registered as K11 in the kern deviations registry — review-m3 ruled this resting elevation a kern choice, not a transcription of M3, so the citation is the registry rather than a spec row.",
    },
  ],
  customization: {
    supported: [
      "`message` is the confirmation, and `actionLabel`/`onAction` add one optional action.",
      "`onDismiss` handles it going away.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `intent` or `tone` variant. A snackback is neutral confirmation; a status with tone is `Sonner` or `Banner`.",
      "There is no `duration` prop. How long it stays is the platform's.",
      "There is one action at most. `actionLabel`/`onAction` are a single pair, not a list.",
    ],
  },
  api: [
    {
      name: "visible",
      type: "boolean",
      note: "Controlled visibility. Required. Note the name: `visible` here, where `Drawer`/`Popover`/`Tooltip` use `open`/`defaultOpen`/`onOpenChange`.",
    },
    {
      name: "message",
      type: "string",
      note: "Required. The confirmation — one sentence, since the surface is brief.",
    },
    {
      name: "actionLabel / onAction",
      type: "string / () => void",
      note: "One optional action. A PAIR, not a list — there is no second action, deliberately.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when it goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "`message` is required and is the whole announcement; the surface is brief and so is what it says.",
    "The action is a real pressable with a `label`, so undo is operable and not only visible.",
    "It appears over content and disappears, so anything it offers must be reversible or repeatable — a decision that vanishes is one some people will never get to make.",
  ],
};
