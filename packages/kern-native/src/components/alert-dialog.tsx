import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import {
  Modal,
  Pressable,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { overlayStyles } from "../utils/overlay-styles";
import { Text } from "./text";

export function alertDialogStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): { card: ViewStyle } {
  return {
    card: {
      width: "100%",
      maxWidth: 400,
      borderRadius: Number.parseFloat(scheme.shape.medium),
      backgroundColor: scheme.color.surface,
      padding: 24,
    },
  };
}

export type NativeAlertDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function AlertDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  onDismiss,
  style,
  testID,
}: NativeAlertDialogProps) {
  const scheme = useKernScheme();
  const styles = alertDialogStyles(scheme);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      accessibilityViewIsModal
      onRequestClose={() => {
        onCancel?.();
        onDismiss?.();
      }}
    >
      <View style={overlayStyles.scrim}>
        <View
          accessibilityRole="alert"
          testID={testID ?? "kern-alert-dialog"}
          style={[styles.card, style]}
        >
          <Text variant="title">{title}</Text>
          {message ? <Text style={{ marginTop: 8 }}>{message}</Text> : null}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 24,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                minHeight: 48,
                justifyContent: "center",
                paddingHorizontal: 12,
              }}
              onPress={() => {
                onCancel?.();
                onDismiss?.();
              }}
            >
              <Text variant="label">{cancelLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{
                minHeight: 48,
                justifyContent: "center",
                paddingHorizontal: 16,
                borderRadius: Number.parseFloat(scheme.shape.full),
                backgroundColor: scheme.color.error,
              }}
              onPress={() => {
                onConfirm?.();
                onDismiss?.();
              }}
            >
              <Text variant="label" style={{ color: scheme.color.onError }}>
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
