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
  style?: StyleProp<ViewStyle>;
};

const staticStyles = StyleSheet.create({
  horizontal: {
    flexDirection: "row",
    gap: 2,
  },
  vertical: {
    flexDirection: "column",
    gap: 2,
  },
});

/** Lays out Button children as one joined row or column. */
export function ButtonGroup({
  children,
  orientation = "horizontal",
  style,
  testID,
  ...props
}: NativeButtonGroupProps) {
  return (
    <View
      {...props}
      testID={testID ?? "kern-button-group"}
      accessibilityRole="none"
      style={[
        orientation === "horizontal"
          ? staticStyles.horizontal
          : staticStyles.vertical,
        style,
      ]}
    >
      {children}
    </View>
  );
}
