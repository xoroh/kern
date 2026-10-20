import { NavigationBarItem } from "@xoroh/kern-native";
import type { ExampleSpec } from "../example";

/**
 * Navigation bar item examples — one destination row for a vertical list.
 *
 * Same destination data as the horizontal `NavigationBar`; only the container
 * differs. The row is a `Pressable`, so it is reachable by switch control and
 * by touch, and `label` is REQUIRED — it is what the row is announced as.
 */
export const NAVIGATION_BAR_ITEM_EXAMPLES: ExampleSpec[] = [
  {
    id: "navigation-bar-item-row",
    title: "One destination row, selected or not",
    description:
      "`selected` draws the Material 3 active indicator — the `secondaryContainer` pill behind the icon. The label is required, because it is the row's accessible name.",
    package: "@xoroh/kern-native",
    render: () => (
      <NavigationBarItem label="Home" selected onPress={() => {}} />
    ),
    code: `<NavigationBarItem label="Home" selected onPress={() => {}} />`,
  },
];
