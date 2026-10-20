import type { ComponentDoc } from "../types";

export const blocks: ComponentDoc = {
  slug: "search-bar",
  name: "Blocks",
  oneLiner:
    "Blocks are the small shell pieces — a search bar, a settings row, a status bar, and the theme and contrast toggles.",
  meta: {
    // M4: the route slug and the content filename disagree here (blocks.ts
    // carries the search-bar page), so "Edit this page" cannot derive its
    // target. Point it at the real file explicitly.
    editUrl:
      "https://github.com/xoroh/kern/edit/main/apps/site/src/content/web/blocks.ts",
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier — web shell furniture, no native counterpart expected.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["SearchBar", "SettingsRow", "StatusBar", "ContrastToggle"],
  customization: {
    supported: [
      "Each is its own export, so a shell takes what it needs.",
      "`SettingsRow` pairs a label with a control, so a settings screen is a list of rows.",
      "`StatusBar` is the strip along the bottom of a shell.",
    ],
    notSupported: [
      "There is no shared variant axis across these — they are five different things, not five looks of one.",
      "`ThemeToggle` and `ContrastToggle` are kern inventions with no Material 3 spec row. There is no spec to conform to and none is claimed.",
    ],
  },
  api: [
    {
      name: "SearchBar",
      type: "component",
      note: "The search field for a shell header or filter row.",
    },
    {
      name: "SettingsRow",
      type: "component",
      note: "One label-plus-control row, so a settings screen is a list of rows.",
    },
    {
      name: "StatusBar",
      type: "component",
      note: "The strip along the bottom of a shell.",
    },
    {
      name: "ContrastToggle",
      type: "component",
      note: "Also a KERN INVENTION. It raises contrast for readability — an accessibility control kern adds, with no Material 3 source.",
    },
  ],
  aria: [
    "`SearchBar` is a search field and should announce as one, with its label attached.",
    "`SettingsRow`'s pairing of label and control is what makes a settings list navigable — the label names the control it sits beside.",
    "`ContrastToggle` is an accessibility control in itself: raising contrast is the feature it exists to provide, so its own state must be legible in both modes.",
    "Neither toggle is a Material 3 component. Nothing on these pages claims conformance for them.",
  ],
};
