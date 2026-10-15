import type { ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export type NativeButtonGroupProps = Omit<ViewProps, "style"> & {
  children: ReactNode;
  orientation?: "horizontal" | "vertical";
  /**
   * M3 Expressive group variant. `connected` (default) joins the buttons
   * into one control — the expressive successor to the segmented button:
   * use toggle `Button` children and their press/selected shape morph reads
   * as the group's selection. `standard` spaces the buttons as individuals.
   * (A View cannot restyle its children's radii; connected joins by
   * adjacency — square-ended children read as one control.)
   */
  variant?: "standard" | "connected";
  style?: StyleProp<ViewStyle>;
};

const staticStyles = StyleSheet.create({
  connectedHorizontal: {
    flexDirection: "row",
    gap: 0,
  },
  connectedVertical: {
    flexDirection: "column",
    gap: 0,
  },
  standardHorizontal: {
    flexDirection: "row",
    gap: 8,
  },
  standardVertical: {
    flexDirection: "column",
    gap: 8,
  },
});

/** Lays out Button children as one joined row or column. */
export function ButtonGroup({
  children,
  orientation = "horizontal",
  variant = "connected",
  style,
  testID,
  ...props
}: NativeButtonGroupProps) {
  const horizontal = orientation === "horizontal";
  const connected = variant === "connected";
  return (
    <View
      {...props}
      testID={testID ?? "kern-button-group"}
      accessibilityRole="none"
      style={[
        horizontal
          ? connected
            ? staticStyles.connectedHorizontal
            : staticStyles.standardHorizontal
          : connected
            ? staticStyles.connectedVertical
            : staticStyles.standardVertical,
        style,
      ]}
    >
      {children}
    </View>
  );
}
