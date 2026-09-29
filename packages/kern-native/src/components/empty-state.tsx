import type { ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Text } from "./text";

export type NativeEmptyStateProps = Omit<ViewProps, "children" | "style"> & {
  visual?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const staticStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  description: {
    textAlign: "center",
  },
});

export function EmptyState({
  visual,
  title,
  description,
  action,
  style,
  testID,
  ...props
}: NativeEmptyStateProps) {
  return (
    <View
      {...props}
      testID={testID ?? "kern-empty-state"}
      style={[staticStyles.container, style]}
    >
      {visual}
      <Text variant="title">{title}</Text>
      {description ? (
        <Text style={staticStyles.description}>{description}</Text>
      ) : null}
      {action}
    </View>
  );
}
