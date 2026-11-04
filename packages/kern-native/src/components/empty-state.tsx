import type { ReactNode } from "react";
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { Text } from "./text";

export type NativeEmptyStateVariant = "page" | "section" | "list-row" | "chat";

const VARIANT_PADDING: Record<
  NativeEmptyStateVariant,
  { paddingHorizontal: number; paddingVertical: number }
> = {
  page: { paddingHorizontal: 24, paddingVertical: 48 },
  section: { paddingHorizontal: 24, paddingVertical: 32 },
  "list-row": { paddingHorizontal: 16, paddingVertical: 16 },
  chat: { paddingHorizontal: 16, paddingVertical: 24 },
};

export type NativeEmptyStateProps = Omit<ViewProps, "children" | "style"> & {
  /** Visual slot: a KernIcon-registry icon or illustration. Never raw lucide. */
  visual?: ReactNode;
  title: string;
  description?: string;
  /** Primary recovery action. Kept as the `primaryAction` alias. */
  action?: ReactNode;
  /** Primary recovery action — pair with `secondaryAction`. */
  primaryAction?: ReactNode;
  /** Secondary action rendered beside the primary. */
  secondaryAction?: ReactNode;
  /**
   * Placement variant (KernEmpty, CL-011): `page` | `section` |
   * `list-row` | `chat`. Only metrics change — one component, not four.
   */
  variant?: NativeEmptyStateVariant;
  style?: StyleProp<ViewStyle>;
};

const staticStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  description: {
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
});

/**
 * KernEmpty — native twin of the web `EmptyState` (CL-011): visual,
 * title, description, primary + secondary actions, four placement
 * variants. Same contract as web; metrics in dp.
 */
export function EmptyState({
  visual,
  title,
  description,
  action,
  primaryAction,
  secondaryAction,
  variant = "page",
  style,
  testID,
  ...props
}: NativeEmptyStateProps) {
  const primary = primaryAction ?? action;
  const padding = VARIANT_PADDING[variant];
  return (
    <View
      {...props}
      testID={testID ?? "kern-empty-state"}
      style={[staticStyles.container, padding, style]}
    >
      {visual}
      <Text variant="title">{title}</Text>
      {description ? (
        <Text style={staticStyles.description}>{description}</Text>
      ) : null}
      {primary || secondaryAction ? (
        <View style={staticStyles.actions}>
          {primary}
          {secondaryAction}
        </View>
      ) : null}
    </View>
  );
}
