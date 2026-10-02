import type { ReactNode } from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import type { NavigationDestination } from "./navigation-bar";
import { Text } from "./text";

/** Width of the collapsed (icon-only) rail. */
export const NAVIGATION_RAIL_WIDTH = 80;
/** Width of the expanded / persistent presentation — what a `sidebar` is. */
export const NAVIGATION_RAIL_EXPANDED_WIDTH = 240;

export type NavigationRailMode = "collapsed" | "expanded";

export type NativeNavigationRailProps = {
  destinations: readonly NavigationDestination[];
  /** The currently selected destination key. */
  value: string;
  onValueChange: (key: string) => void;
  /**
   * `collapsed` shows icons only; `expanded` also paints each label.
   *
   * This is ONE component with two modes rather than a rail and a separate
   * Sidebar: per the Expressive mapping a persistent sidebar IS the expanded
   * presentation of a navigation rail, and splitting them would have produced
   * two components that differ only in width.
   *
   * The label stays in the ACCESSIBLE NAME in both modes. An icon-only rail
   * whose buttons cannot be named is unusable with a screen reader, so
   * collapsing is a visual decision, never a semantic one.
   */
  mode?: NavigationRailMode;
  /** Rendered above the destination list — a workspace switcher, a heading. */
  header?: ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
  testID?: string;
};

/**
 * A vertical navigation rail: the persistent navigation surface.
 *
 * Genuinely absent on native before this. `NavigationBar` is horizontal (a
 * bottom bar) and `NavigationDrawer` is `open`-controlled — a drawer you must
 * open is not a sidebar, which is the whole reason this family exists.
 */
export function NavigationRail({
  destinations,
  value,
  onValueChange,
  mode = "collapsed",
  header,
  accessibilityLabel = "Navigation",
  style,
  testID,
}: NativeNavigationRailProps) {
  const scheme = useKernScheme();
  const expanded = mode === "expanded";

  return (
    <View
      testID={testID ?? "kern-navigation-rail"}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: expanded
            ? NAVIGATION_RAIL_EXPANDED_WIDTH
            : NAVIGATION_RAIL_WIDTH,
          flexDirection: "column",
          alignItems: expanded ? "stretch" : "center",
          gap: 4,
          paddingVertical: 12,
          backgroundColor: scheme.color.surface,
          borderRightWidth: expanded ? 0 : 1,
          borderRightColor: scheme.color.outlineVariant,
        },
        style,
      ]}
    >
      {header}
      {destinations.map((destination) => {
        const selected = destination.key === value;
        const disabled = destination.disabled === true;
        return (
          <Pressable
            key={destination.key}
            // `tab` rather than `link`/`button`: the rail switches a set of
            // sibling destinations, which is what a tab list means. This is the
            // same substitution `NavigationBar` already makes, so the two
            // navigations read the same way to a screen reader.
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            // The label is the accessible name in BOTH modes -- see the mode
            // doc. Collapsing is visual only.
            accessibilityLabel={destination.label}
            disabled={disabled}
            onPress={() => onValueChange(destination.key)}
            style={{
              minHeight: 48,
              minWidth: 48,
              flexDirection: expanded ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              paddingHorizontal: expanded ? 16 : 8,
              borderRadius: Number.parseFloat(scheme.shape.full),
              backgroundColor: selected
                ? scheme.color.secondaryContainer
                : "transparent",
            }}
          >
            {destination.icon}
            {/* Expanded paints the label. Collapsed still NAMES the destination
                above, so nothing is lost for assistive tech. */}
            {expanded ? (
              <Text
                variant="label"
                numberOfLines={1}
                style={{
                  color: selected
                    ? scheme.color.onSecondaryContainer
                    : scheme.color.onSurfaceVariant,
                }}
              >
                {destination.label}
              </Text>
            ) : null}
            {destination.badge}
          </Pressable>
        );
      })}
    </View>
  );
}
