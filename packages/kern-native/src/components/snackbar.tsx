import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export function snackbarStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  return {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
    backgroundColor: scheme.color.inverseSurface,
    paddingHorizontal: 16,
    paddingVertical: 12,
  };
}

export type NativeSnackbarProps = {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Snackbar({
  visible,
  message,
  actionLabel,
  onAction,
  onDismiss,
  style,
  testID,
}: NativeSnackbarProps) {
  const scheme = useKernScheme();
  if (!visible) return null;
  return (
    <View
      accessibilityRole="alert"
      testID={testID ?? "kern-snackbar"}
      style={[snackbarStyles(scheme), style]}
    >
      <Text style={{ flex: 1, color: scheme.color.inverseOnSurface }}>
        {message}
      </Text>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ minHeight: 48, justifyContent: "center" }}
          onPress={() => {
            onAction?.();
            onDismiss?.();
          }}
        >
          <Text variant="label" style={{ color: scheme.color.inversePrimary }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
