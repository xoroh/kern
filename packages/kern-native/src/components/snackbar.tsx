import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
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
    // K11: snackbar = level 2 = 3dp. Android reads `elevation` as dp (M3's scale
    // is 0/1/3/6/8/12, so level 2 is 3dp, not 2); iOS reads the shadow quartet.
    // The iOS values follow PopoverContent, the other level-2 surface, rather
    // than inventing a second level-2 shadow.
    shadowColor: scheme.color.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
