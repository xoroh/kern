import { NavigationRail, Text } from "@xoroh/kern-native";
import { useState } from "react";
import type { ExampleSpec } from "../example";

/**
 * The live demo: exactly one destination is current, and the rail REPORTS the
 * selection rather than storing it — so the host keeps one value and the
 * rail follows it.
 */
function NavigationRailDemo() {
  const [value, setValue] = useState("home");
  return (
    <NavigationRail
      value={value}
      onValueChange={setValue}
      destinations={[
        { key: "home", label: "Home", icon: <Text variant="label">H</Text> },
        {
          key: "search",
          label: "Search",
          icon: <Text variant="label">S</Text>,
        },
        {
          key: "library",
          label: "Library",
          icon: <Text variant="label">L</Text>,
        },
      ]}
    />
  );
}

/**
 * Navigation rail examples — the persistent vertical navigation surface.
 *
 * NATIVE-ONLY export: the native rail has no `@xoroh/kern` counterpart to
 * show, so the fence declares the package it imports from — without that, the
 * copyable export would resolve the fence's tags against the web barrel,
 * which exports no `NavigationRail`, and hand the reader a module that
 * cannot compile.
 *
 * The label is the accessible name in BOTH modes: collapsing the rail to icons
 * is a visual decision, never a semantic one.
 */
export const NAVIGATION_RAIL_EXAMPLES: ExampleSpec[] = [
  {
    id: "navigation-rail-vertical-destinations",
    title: "A vertical rail whose labels survive collapsing",
    description:
      "The destination is named in both modes — collapsed, the icon carries the name — so the rail stays usable with a screen reader whichever way the host lays it out.",
    render: () => <NavigationRailDemo />,
    code: `<NavigationRail
  value="home"
  onValueChange={() => {}}
  destinations={[
    { key: "home", label: "Home", icon: <Text variant="label">H</Text> },
    { key: "search", label: "Search", icon: <Text variant="label">S</Text> },
  ]}
/>`,
    package: "@xoroh/kern-native",
  },
];
