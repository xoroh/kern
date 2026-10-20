import type { ComponentDoc } from "../types";

export const dockSheet: ComponentDoc = {
  slug: "dock-sheet",
  name: "Dock sheet",
  oneLiner:
    "Dock sheets are the minimal bottom panel — content in a sheet, with no title and no action row.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Web counterpart landed in the P2b-2 sheet family (6901013); checked in
    // the web inventory. (This row read `none` before that landed — stale on
    // arrival, caught while documenting the web side.)
    nativePeer: "DockSheet",
    variants: [],
    // Deliberate: the native dock sheet ships NO elevation token — a
    // persistent, non-modal panel at modal elevation misreads as an overlay
    // (`sheets.tsx` removed a previous `elevation: 3` plus iOS shadow block
    // for exactly this reason; separation is tonal fill, not shadow). The
    // old level-3 claim (flagged as likely inverted in review) described the
    // removed treatment, not the shipped one.
    elevation: "surface",
  },
  parts: ["DockSheet"],
  // The native dock sheet is a plain view, not a modal: it takes no focus of
  // its own, traps nothing and binds no key. The dismiss pressable, when the
  // host asks for one, is the only control the sheet contributes.
  keyboard: [
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "The docked content reads in order and double-tap runs whichever control is focused; the dismiss pressable, when there is one, reads as a button.",
    },
    {
      key: "Enter / Space via external keyboard or switch control",
      action:
        "Runs the focused control in the dock — the same press a touch makes.",
    },
  ],
  customization: {
    supported: [
      "`children` is the whole surface, so what docks is entirely the caller's.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `title` prop. This is the untitled member of the family — a named, decided surface is `BottomSheet`.",
      "There is no `actions` prop. There is no action row to fill.",
      "There is no `size` or `snapPoints` prop. It is one height; a panel that needs several is `SnapSheet`.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled visibility. Required.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The docked content. The whole surface is this — there is no title or action row around it.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      note: "Fires when the sheet goes away.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "With no title, the sheet has no name of its own — whatever it docks should be labelled by the content or by what opened it.",
    "That is the one real limitation of the untitled form: an unlabelled panel with unlabelled content is an unnamed region, so the content carries the naming.",
    "It is dismissible and reports it through `onDismiss`, so the host can keep its own state.",
  ],
};
