import type { ComponentDoc } from "../types";

export const menuScreen: ComponentDoc = {
  slug: "menu-screen",
  name: "Menu screen",
  oneLiner:
    "Menu screens present grouped actions inline — the settings-style page of a menu.",
  features:
    "Reach for a menu screen when the grouped actions belong ON the screen rather than over it: a settings page, a per-item action list, anywhere the list is the page. It takes exactly the same `groups` data that `MenuSheet` does, so a host can move an action from a screen into a sheet without rewriting it — the two differ in presentation only, which is the whole reason the data shape is shared. The screen is a scrolling list over the surface colour, built from `MenuGroupList`, so it inherits that component's rules about headings and rows.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // No web counterpart: the web `Menu` is an anchored popup compound, not an
    // inline screen. No export to name as a peer.
    nativePeer: "none",
    variants: [],
    elevation: "surface",
  },
  parts: ["MenuScreen"],
  customization: {
    supported: [
      "`groups` are data, identical to `MenuSheet`'s, so moving content between the two is a hosting decision rather than a rewrite.",
      "`style` is a React Native `ViewStyle`.",
    ],
    notSupported: [
      "There is no `title`. This is the inline form and it sits in whatever screen already has a header — naming it again would be duplication.",
      "There is no `open`/`onDismiss`. It is inline, so there is nothing to dismiss; the sheet form is what has those.",
      "There is no `renderGroup` prop. The list is `MenuGroupList`'s, and it is uniform by design.",
    ],
  },
  api: [
    {
      name: "groups",
      type: "MenuGroup[]",
      note: "The same shape `MenuSheet` takes. Identical on purpose, so an action can move between them without being rewritten.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles. The screen fills available height (`flex: 1`) and scrolls.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-menu-screen"',
      note: "The test hook, defaulted so tests can find it without the caller naming it.",
    },
  ],
  aria: [
    "It is inline content, so it is announced as part of the screen rather than as something that came up over one.",
    "Group headings come from the data and are what make the actions readable as groups.",
    "Being inline rather than modal means no focus trap and no dismissal path — which is correct for content that is simply part of the page.",
  ],
};
