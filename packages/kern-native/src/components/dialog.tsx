import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { overlayStyles } from "../utils/overlay-styles";
import { useKernPortalRegistration } from "./presentation";
import { Text } from "./text";

const staticStyles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 24,
  },
  action: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  body: {
    marginTop: 8,
  },
});

export function dialogStyles(scheme: ResolvedTheme = resolveThemeDetails()): {
  card: ViewStyle;
} {
  return {
    card: {
      width: "100%",
      maxWidth: 480,
      borderRadius: Number.parseFloat(scheme.shape.medium),
      backgroundColor: scheme.color.surface,
      padding: 24,
    },
  };
}

export type NativeDialogAction = {
  label: string;
  onPress?: () => void;
  primary?: boolean;
};

export type NativeDialogProps = {
  /**
   * Legacy visibility name. Optional now that `open` exists — at least one
   * of the two is required in practice (`open` wins when both are passed).
   */
  visible?: boolean;
  /**
   * R2 lexicon alias for `visible` (`open` wins when both are passed).
   * Dialogs are controlled-only passthroughs — no `defaultOpen`, no state.
   */
  open?: boolean;
  title: string;
  children?: ReactNode;
  actions?: NativeDialogAction[];
  onDismiss?: () => void;
  /**
   * R2 lexicon: state report — fired with `false` alongside `onDismiss`
   * when the hardware back button requests dismissal.
   */
  onOpenChange?: (open: boolean) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Dialog({
  visible,
  open,
  title,
  children,
  actions = [],
  onDismiss,
  onOpenChange,
  style,
  testID,
}: NativeDialogProps) {
  const scheme = useKernScheme();
  const styles = dialogStyles(scheme);
  const shown = open ?? visible ?? false;
  // DUAL-PATH (D12): `Modal` keeps presenting the dialog; the owned portal
  // registry ALSO tracks it while shown — the same observable the web side
  // reads off its own registry.
  useKernPortalRegistration(testID ?? "kern-dialog", shown);
  const notifyDismiss = () => {
    onDismiss?.();
    onOpenChange?.(false);
  };
  return (
    <Modal
      visible={shown}
      transparent
      animationType="fade"
      accessibilityViewIsModal
      onRequestClose={notifyDismiss}
    >
      <View style={overlayStyles.scrim}>
        <View
          // `role`, NOT `accessibilityRole`, carries the dialog role: the
          // platform-trait union (`AccessibilityRole`) has no `dialog` member,
          // while the ARIA-aligned `Role` union does — Fabric resolves it to
          // `Role::Dialog`. `accessibilityRole="alert"` is retained as the
          // repo's existing dialog mapping (cf. alert-dialog.tsx), the closest
          // real trait VoiceOver/TalkBack have for an interrupting container.
          role="dialog"
          accessibilityRole="alert"
          accessibilityLabel={title}
          testID={testID ?? "kern-dialog"}
          style={[styles.card, style]}
        >
          <Text variant="title">{title}</Text>
          {children ? <View style={staticStyles.body}>{children}</View> : null}
          {actions.length > 0 ? (
            <View style={staticStyles.actions}>
              {actions.map((action) => (
                <Pressable
                  key={action.label}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={[
                    staticStyles.action,
                    {
                      borderRadius: Number.parseFloat(scheme.shape.full),
                      backgroundColor: action.primary
                        ? scheme.color.primary
                        : "transparent",
                    },
                  ]}
                  onPress={() => {
                    action.onPress?.();
                    onDismiss?.();
                  }}
                >
                  <Text
                    variant="label"
                    style={
                      action.primary
                        ? { color: scheme.color.onPrimary }
                        : undefined
                    }
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
