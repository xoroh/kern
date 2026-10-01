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
  visible: boolean;
  title: string;
  children?: ReactNode;
  actions?: NativeDialogAction[];
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Dialog({
  visible,
  title,
  children,
  actions = [],
  onDismiss,
  style,
  testID,
}: NativeDialogProps) {
  const scheme = useKernScheme();
  const styles = dialogStyles(scheme);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      accessibilityViewIsModal
      onRequestClose={onDismiss}
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
