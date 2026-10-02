import type { ComponentDoc } from "../types";

export const appShell: ComponentDoc = {
  slug: "app-shell",
  name: "App shell",
  oneLiner:
    "The app shell is the frame around everything else — top bar, rail, drawer, status bar — with every region optional.",
  features:
    "Reach for the app shell when you are laying out an application rather than a page. Its rule is that every region is optional, and that is the whole design: `topBar`, `rail`, `drawer` and `statusBar` are slots, and omitting them yields every shell shape there is — a docs shell, a rail-only tool, a full multi-region app — from one component. Recipes for those shapes live in the README rather than in forked components, so there is exactly one shell to maintain and to learn. `Document` is the page-level counterpart for the document it wraps.",
  meta: {
    status: "real",
    package: "@xoroh/kern/start",
    // Composition tier — the web app frame, no native counterpart expected.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["AppShell", "Document"],
  customization: {
    supported: [
      "Every region is a slot: `topBar`, `rail`, `drawer`, `statusBar`. Omit what you do not have.",
      "`children` is the content region, and the shell takes ordinary `div` props.",
      "Region heights are exported as `APP_SHELL_HEIGHTS`, so content can lay out against known numbers.",
    ],
    notSupported: [
      "There is no `variant` or `layout` prop. The shape comes from which regions you pass — that is the mechanism, and adding named shapes to it would be the fork the design avoids.",
      "Regions are not resizable and there is no collapse behaviour here. That belongs to the region component you put in the slot.",
    ],
  },
  api: [
    {
      name: "topBar / rail / drawer / statusBar",
      type: "ReactNode",
      note: "The four optional regions. Omitting any of them yields a different shell SHAPE from the same component — a docs shell, a rail-only tool, a full app.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The content region.",
    },
    {
      name: "APP_SHELL_HEIGHTS",
      type: "{ topBar: 56; statusBar: 32 }",
      note: "Exported region heights, so content lays out against known numbers rather than guessing.",
    },
    {
      name: "Document",
      type: "component",
      note: "The page-level counterpart for the document being wrapped. COVERAGE CAVEAT: no direct test mention — stable, but not evidence of thorough testing.",
    },
    {
      name: "…div props",
      type: "ComponentPropsWithRef<'div'>",
      note: "The shell is a `div` underneath, so the usual props pass through.",
    },
  ],
  aria: [
    "Regions are what make the page navigable by landmark, so filling the slots you have is what gives a reader the shape of the app.",
    "Every region being optional means a minimal shell is still a shell — a reader gets the content without a pile of empty regions announced around it.",
    "COVERAGE CAVEAT: `Document` has no direct test mention. It is a thin wrapper, but these pages should not imply more coverage than exists.",
  ],
};
