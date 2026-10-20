import { NavigationBar } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * NavigationBar examples — the compact-screen destination switcher.
 *
 * Destinations are DATA, so the same list can feed the bar, the rail and the
 * drawer without being declared three times. Material 3 floors the bar at
 * three destinations: fewer is a tab strip wearing a bar's name.
 */
export const NAVIGATION_BAR_EXAMPLES: ExampleSpec[] = [
  {
    id: "navigation-bar-destinations",
    title: "Three destinations, one active",
    description:
      "Exactly one destination is active, and it carries `aria-current`. The bar is a single tab stop: the arrow keys move along the destinations, so five of them do not cost five tab stops.",
    render: () => (
      <NavigationBar
        defaultValue="home"
        destinations={[
          { key: "home", label: "Home" },
          { key: "search", label: "Search" },
          { key: "library", label: "Library" },
        ]}
      />
    ),
    code: `<NavigationBar
  defaultValue="home"
  destinations={[
    { key: "home", label: "Home" },
    { key: "search", label: "Search" },
    { key: "library", label: "Library" },
  ]}
/>`,
  },
];
