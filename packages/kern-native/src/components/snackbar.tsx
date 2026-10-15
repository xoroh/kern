import { type ResolvedTheme } from "@xoroh/kern-tokens";
import { Pressable, type StyleProp, View, type ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { Text } from "./text";

export function snackbarStyles(
  scheme: ResolvedTheme = defaultScheme,
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
    // K11: snackbar = level 3 = 6dp. Android reads `elevation` as dp (M3's scale
    // is 0/1/3/6/8/12, so level 3 is 6dp, NOT 3 — 3dp is level 2). This was
    // `elevation: 3`, which put native one level BELOW web's
    // `--sys-elevation-level3`: the same component at two heights on two
    // renderers, invisible until the gate mapped dp into level space.
    // The iOS quartet follows the other level-3 surfaces rather than inventing
    // a second shadow recipe.
    shadowColor: scheme.color.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
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
