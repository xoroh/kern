import type { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";

/**
 * M3 bottom app bar, native renderer (WP2a P0 NEW): the compact-screen
 * action bar (80dp, `surfaceContainer` fill). Leading action cluster +
 * trailing FAB dock. Same contract as web `BottomAppBar` — not a
 * navigation bar (fewer than 3 destinations, or actions + FAB alone).
 *
 * M3: https://m3.material.io/components/bottom-app-bar
 */

export const BOTTOM_APP_BAR_HEIGHT = 80;

export type NativeBottomAppBarProps = {
  /** Leading cluster: navigation + action icon buttons. */
  actions?: ReactNode;
  /** Trailing dock: a FAB (plain) or FAB menu. */
  fab?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children?: ReactNode;
};

/** M3 bottom app bar (native): actions leading, FAB trailing. */
export function BottomAppBar({
  actions,
  fab,
  accessibilityLabel = "Actions",
  style,
  testID,
  children,
}: NativeBottomAppBarProps) {
  const scheme = useKernScheme();
  return (
    <View
      testID={testID ?? "kern-bottom-app-bar"}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          height: BOTTOM_APP_BAR_HEIGHT,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 16,
          backgroundColor: scheme.color.surfaceContainer,
          borderTopWidth: 1,
          borderTopColor: scheme.color.outlineVariant,
        },
        style,
      ]}
    >
      {actions ? (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          {actions}
        </View>
      ) : null}
      {children}
      {fab}
    </View>
  );
}
