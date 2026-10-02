import type { ComponentDoc } from "../types";

export const appShell: ComponentDoc = {
  slug: "app-shell",
  name: "App shell",
  oneLiner:
    "The app shell is the application frame — header, side navigation, body, footer — with every region a named landmark.",
  features:
    "Reach for the app shell once and at the root: it is the frame the rest of the app composes inside, the native counterpart to the web `AppShell`. The four regions are slots — pass the ones you have and omit the rest — and the body renders always, because a shell whose content disappears is not a shell. Each supplied region is a NAMED landmark rather than a bare view: a frame that renders a header, a rail and a body but calls them all the same thing is three unlabelled boxes to a screen reader. The body and the navigation sit SIDE BY SIDE by construction, so the classic responsive failure — navigation stacked above content — cannot happen.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "AppShell",
    variants: [],
    elevation: "surface",
  },
  parts: ["AppShell"],
  customization: {
    supported: [
      "`header`, `navigation`, `body` and `footer` are plain slots; each supplied one becomes a named region.",
      "`navigation` is laid out BESIDE the body — a `NavigationRail` belongs there.",
      "`style` is a React Native `ViewStyle` for the frame. The region height constants are exported.",
    ],
    notSupported: [
      "There is no responsive behaviour. The shell always shows the regions you pass — collapse and breakpoints are the host's decisions.",
      "There is no scroll management. The body is a slot; whether it scrolls is what you put in it.",
      "There is no drawer, menu or skip-link wiring. Those are components you place in the regions — the shell is the frame, not the furniture.",
    ],
  },
  api: [
    {
      name: "header",
      type: "ReactNode",
      note: "The top region — a top app bar, or nothing. Laid out at the frame's minimum header height when present.",
    },
    {
      name: "navigation",
      type: "ReactNode",
      note: "The side region, laid out BESIDE the body. A `NavigationRail` belongs here.",
    },
    {
      name: "body",
      type: "ReactNode",
      note: "The main content — always rendered, in its own derived testID region, taking the remaining space.",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "The bottom region, or nothing.",
    },
    {
      name: "style",
      type: "ViewStyle",
      note: "React Native styles for the frame. `APP_SHELL_HEADER_HEIGHT` and `APP_SHELL_FOOTER_HEIGHT` are exported for the region heights.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-app-shell"',
      note: "Test hook for the frame; the body derives `<testID>-body` so the content region is addressable on its own.",
    },
  ],
  aria: [
    "Each supplied region is a named landmark — Header, Navigation, Footer — so a screen-reader user can jump between regions instead of walking the whole tree.",
    "The body and navigation are siblings in one row: reading order is header, navigation, body, footer, which is the order the regions are encountered.",
    "The shell adds no roles to the content inside the regions — whatever you place there keeps its own semantics.",
  ],
};
