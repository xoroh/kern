import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import type { ReactNode } from "react";
import { useState } from "react";
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

export type NativeMenuItem = {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
};

export function menuStyles(scheme: ResolvedTheme = resolveThemeDetails()): {
  card: ViewStyle;
} {
  return {
    card: {
      minWidth: 192,
      borderRadius: Number.parseFloat(scheme.shape.small),
      backgroundColor: scheme.color.surface,
      padding: 8,
    },
  };
}

export type NativeMenuProps = {
  trigger: ReactNode;
  triggerLabel: string;
  items: NativeMenuItem[];
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Menu({
  trigger,
  triggerLabel,
  items,
  onDismiss,
  style,
  testID,
}: NativeMenuProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  const [open, setOpen] = useState(false);
  function dismiss() {
    setOpen(false);
    onDismiss?.();
  }
  return (
    <View testID={testID ?? "kern-menu"}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={triggerLabel}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        onPress={() => setOpen(true)}
        style={{ minHeight: 48, justifyContent: "center" }}
      >
        {trigger}
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={dismiss}
      >
        <View style={overlayStyles.scrim}>
          <View accessibilityRole="menu" style={[styles.card, style]}>
            {items.map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="menuitem"
                accessibilityLabel={item.label}
                accessibilityState={{ disabled: item.disabled }}
                disabled={item.disabled}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                onPress={() => {
                  item.onSelect?.();
                  dismiss();
                }}
                style={{
                  minHeight: 48,
                  justifyContent: "center",
                  paddingHorizontal: 12,
                  borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                <Text>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
