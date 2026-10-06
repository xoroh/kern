import type { ComponentDoc } from "../types";

export const navigationDrawer: ComponentDoc = {
  slug: "navigation-drawer",
  name: "Navigation drawer",
  oneLiner:
    "The navigation drawer is the modal panel that lists an app's top-level destinations on larger screens.",
  features:
    "Reach for a navigation drawer when the app has more destinations than a navigation bar can hold, or when a compact screen needs the full list rather than five icons. It shares one destination list with the bar and the rail, so you declare your places once. It is the modal variant: a scrim, a focus trap and Escape to dismiss, and picking a destination closes the drawer — a modal panel that stays open after you choose is a trap. M3 only forbids the bar and the modal drawer being visible at once, and that is the host's call to make, not the component's.",
  meta: {
    // Canonical M3 spec page — title identity-verified live; gate re-checks.
    specUrl: "https://m3.material.io/components/navigation-drawer",
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "NavigationDrawer",
    // No variant axis. The drawer is one treatment; the modal behaviour is
    // what distinguishes it from a docked navigation rail.
    variants: [],
    // M3's table places "navigation drawer (modal)" at resting level 1. kern
    // ships no elevation token on this component and `m3-elevation.ts` has no
    // row for it, so nothing asserts that level today — see Customization.
    elevation: "surface",
  },
  parts: ["NavigationDrawer"],
  customization: {
    supported: [
      "`className` on the drawer, merged after its own classes.",
      "The destination list is the same `NavigationDestination` data the bar and the rail take, so one declaration feeds every surface.",
      "`title`, `subtitle` and `footer` are slots — the footer is where an account row, an app switcher or sign-out belongs.",
    ],
    notSupported: [
      "There is no `modal` prop. This is the modal variant by construction; a docked, non-modal panel is the navigation rail.",
      "There is no `side` prop. The drawer is start-anchored, per M3's drawer anatomy.",
      "The width is not a prop. It is fixed at M3's section-drawer width and capped at a share of the viewport so a tablet or foldable keeps its detail pane visible.",
      "Resting elevation is not a prop. M3's table places the modal navigation drawer at level 1; kern ships no elevation token on this component and `m3-elevation.ts` carries no row for it, so nothing asserts that level. That is a gap against the spec, not a conformant state, and it is reported to the token owners rather than asserted here.",
    ],
  },
  api: [
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state. Required — this component is always controlled, so a host keeps one source of truth for whether the drawer is showing.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires on every open and close. Escape and scrim dismissal both land here, so a host needs only one state variable.",
    },
    {
      name: "destinations",
      type: "NavigationDestination[]",
      note: "The places, as data — the same shape the navigation bar and the rail take.",
    },
    {
      name: "value",
      type: "string",
      note: "Controlled active destination key.",
    },
    {
      name: "defaultValue",
      type: "string",
      note: "Initial active key.",
    },
    {
      name: "onValueChange",
      type: "(key: string) => void",
      note: "Fires when a destination is chosen. The drawer closes itself after reporting the choice — deliberately, so a modal drawer is never left open over the view it just navigated.",
    },
    {
      name: "title",
      type: "ReactNode",
      note: "Headline above the destination list. Doubles as the drawer's accessible name.",
    },
    {
      name: "subtitle",
      type: "ReactNode",
      note: "Supporting line under the headline.",
    },
    {
      name: "footer",
      type: "ReactNode",
      note: "Slot under the list — account row, app switcher, sign-out.",
    },
    {
      name: '"aria-label"',
      type: "string",
      note: "The accessible name when there is no visible `title`. Without either, the drawer is an unnamed dialog.",
    },
    {
      name: "className",
      type: "string",
      note: "Merged after the drawer's own classes.",
    },
  ],
  aria: [
    'The drawer sets `role="dialog"` and `aria-modal`, because a modal drawer inerts the page behind it and must say so.',
    "Its accessible name comes from `title`, falling back to `aria-label` — so one of the two is needed for it to announce anything.",
    "Focus is trapped inside while open and returns to the trigger on close.",
    "Choosing a destination closes the drawer, so focus is never left trapped over a view that has already changed underneath it.",
  ],
};
