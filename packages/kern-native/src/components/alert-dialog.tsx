import {
  type AlertDialogBackdropProps,
  type AlertDialogCloseProps,
  type AlertDialogDescriptionProps,
  type AlertDialogPopupProps,
  type AlertDialogPortalProps,
  type AlertDialogRootProps,
  type AlertDialogTitleProps,
  type AlertDialogTriggerProps,
  AlertDialogBackdrop as AxisAlertDialogBackdrop,
  AlertDialogClose as AxisAlertDialogClose,
  AlertDialogDescription as AxisAlertDialogDescription,
  AlertDialogPopup as AxisAlertDialogPopup,
  AlertDialogPortal as AxisAlertDialogPortal,
  AlertDialogRoot as AxisAlertDialogRoot,
  AlertDialogTitle as AxisAlertDialogTitle,
  AlertDialogTrigger as AxisAlertDialogTrigger,
} from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import {
  Modal,
  Pressable,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { scrimStyle } from "../utils/overlay-styles";
import { useKernPortalRegistration } from "./presentation";
import { Text } from "./text";

export function alertDialogStyles(scheme: ResolvedTheme = defaultScheme()): {
  card: ViewStyle;
} {
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
   * Controlled visibility. Wins over `defaultOpen` when defined.
   */
  open?: boolean;
  defaultOpen?: boolean;
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

export {
  type AlertDialogBackdropProps,
  type AlertDialogCloseProps,
  type AlertDialogDescriptionProps,
  type AlertDialogPopupProps,
  type AlertDialogPortalProps,
  type AlertDialogRootProps,
  type AlertDialogTitleProps,
  type AlertDialogTriggerProps,
  AxisAlertDialogBackdrop as AlertDialogBackdrop,
  AxisAlertDialogClose as AlertDialogClose,
  AxisAlertDialogDescription as AlertDialogDescription,
  AxisAlertDialogPopup as AlertDialogPopup,
  AxisAlertDialogPortal as AlertDialogPortal,
  AxisAlertDialogRoot as AlertDialogRoot,
  AxisAlertDialogTitle as AlertDialogTitle,
  AxisAlertDialogTrigger as AlertDialogTrigger,
};

export function AlertDialog({
  open,
  defaultOpen = false,
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
  const shown = open ?? defaultOpen;
  useKernPortalRegistration(testID ?? "kern-alert-dialog", shown);

  const notifyClose = () => {
    onDismiss?.();
    onOpenChange?.(false);
  };

  return (
    <AxisAlertDialogRoot
      open={shown}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => {
        onOpenChange?.(next);
        if (!next) onDismiss?.();
      }}
    >
      <Modal
        visible={shown}
        transparent
        animationType="fade"
        accessibilityViewIsModal
        onRequestClose={() => {
          onCancel?.();
          notifyClose();
        }}
      >
        <View style={scrimStyle(scheme)}>
          <View
            role="alertdialog"
            accessibilityRole="alert"
            accessibilityLabel={title}
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
    </AxisAlertDialogRoot>
  );
}

AlertDialog.Root = AxisAlertDialogRoot;
AlertDialog.Trigger = AxisAlertDialogTrigger;
AlertDialog.Portal = AxisAlertDialogPortal;
AlertDialog.Backdrop = AxisAlertDialogBackdrop;
AlertDialog.Popup = AxisAlertDialogPopup;
AlertDialog.Title = AxisAlertDialogTitle;
AlertDialog.Description = AxisAlertDialogDescription;
AlertDialog.Close = AxisAlertDialogClose;
