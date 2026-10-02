import type { ComponentDoc } from "../types";

export const supportingPane: ComponentDoc = {
  slug: "supporting-pane",
  name: "Supporting pane",
  oneLiner:
    "Supporting panes hold the secondary panel beside main content, and hide it entirely on a compact screen.",
  features:
    "Reach for a supporting pane when the main content has a companion that is useful but not essential: an inspector, a preview, a summary. `supporting` is the companion and `children` is the main content. The behaviour worth knowing is the compact rule: below `compactBreakpoint` the pane hides ENTIRELY rather than squeezing — Material 3's compact breakpoint is 600 — because a secondary panel that survives by stealing half a phone screen stops being secondary. `currentWidth` is supplied by the host, since the component cannot measure the window reliably on its own.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only layout composition. No web export to name.
    nativePeer: "none",
    variants: ["width: narrow · default · wide · full"],
    elevation: "surface",
  },
  parts: ["SupportingPane"],
  customization: {
    supported: [
      "`supporting` is the companion panel and `children` is the main content.",
      "`width` uses the same `PaneWidth` scale as `Pane`.",
      "`compactBreakpoint` sets where the pane hides.",
    ],
    notSupported: [
      "There is no `collapsible` or `toggleable` mode here. Below the breakpoint it HIDES — it does not become a drawer.",
      "The component does not measure the window itself; `currentWidth` comes from the host.",
      "There is no `side`. The supporting pane sits where the layout puts it.",
    ],
  },
  api: [
    {
      name: "supporting",
      type: "ReactNode",
      note: "Required. The companion panel — the reason the component exists.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "The main content.",
    },
    {
      name: "width",
      type: "PaneWidth",
      note: "The same `narrow` / `default` / `wide` / `full` measure scale `Pane` uses.",
    },
    {
      name: "compactBreakpoint",
      type: "number",
      default: "600",
      note: "Hide entirely below this width in dp — Material 3's compact breakpoint is 600. The pane HIDES rather than squeezing: a secondary panel that survives by stealing half a phone screen stops being secondary.",
    },
    {
      name: "currentWidth",
      type: "number",
      note: "Supplied by the host. The component does not measure the window itself.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "Two regions, and the main one is `children` — so the reading order is main content first, companion second.",
    "Below the breakpoint the pane hides ENTIRELY, so a compact screen does not announce a panel that is not usable there.",
    "`currentWidth` coming from the host means the breakpoint rule is applied against a number the app actually knows, rather than a guess.",
  ],
};
