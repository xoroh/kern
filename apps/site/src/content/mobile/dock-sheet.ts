import type { ComponentDoc } from "../types";

export const dockSheet: ComponentDoc = {
  slug: "dock-sheet",
  name: "Dock sheet",
  oneLiner:
    "Dock sheets are the minimal bottom panel — content in a sheet, with no title and no action row.",
  features:
    "Reach for a dock sheet when the thing to show is content rather than a decision: a keyboard accessory, a media dock, a small tool strip that belongs at the bottom edge. It is the smallest member of the sheet family and the only one with no title, because what it holds is self-explanatory or already labelled by whatever opened it. If the panel needs a name and a decision, that is a `BottomSheet`; if it needs to remember a height, that is a `SnapSheet`.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Web counterpart landed in the P2b-2 sheet family (6901013); checked in
    // the web inventory. (This row read `none` before that landed — stale on
    // arrival, caught while documenting the web side.)
    nativePeer: "DockSheet",
    variants: [],
    // The native dock sheet is NOT flat: `sheets.tsx` ships `elevation: 3`
    // with a designed shadow on the panel (measured from source). No registry
    // row is keyed under this slug, so check:docs reports the claim as
    // unasserted — a registry gap, not a page gap.
    elevation: 3,
  },
  parts: ["DockSheet"],
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
