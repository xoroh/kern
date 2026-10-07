import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
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
  /**
   * Legacy visibility name. Optional now that `open` exists — at least one
   * of the two is required in practice (`open` wins when both are passed).
   */
  visible?: boolean;
  /**
   * R2 lexicon alias for `visible`. Controlled-only passthrough — no
   * `defaultOpen`, no state.
   */
  open?: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * R2 lexicon: DECISION actions, not state. Confirm/cancel say WHAT the
   * user chose; `onDismiss`/`onOpenChange(false)` say the surface closed.
   * All three fire on their paths — choosing is not closing.
   */
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  /**
   * R2 lexicon: state report — fired with `false` alongside `onDismiss`
   * on every close path.
   */
  onOpenChange?: (open: boolean) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function AlertDialog({
  visible,
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  onDismiss,
  onOpenChange,
  style,
  testID,
}: NativeAlertDialogProps) {
  const scheme = useKernScheme();
  const styles = alertDialogStyles(scheme);
  const notifyClose = () => {
    onDismiss?.();
    onOpenChange?.(false);
  };
  return (
    <Modal
      visible={open ?? visible ?? false}
      transparent
      animationType="fade"
      accessibilityViewIsModal
      onRequestClose={() => {
        onCancel?.();
        notifyClose();
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
                notifyClose();
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
                notifyClose();
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
