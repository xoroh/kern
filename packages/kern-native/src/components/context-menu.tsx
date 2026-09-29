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
import { menuStyles, type NativeMenuItem } from "./menu";
import { Text } from "./text";

export type NativeContextMenuProps = {
  children: ReactNode;
  triggerLabel: string;
  items: NativeMenuItem[];
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function ContextMenu({
  children,
  triggerLabel,
  items,
  onDismiss,
  style,
  testID,
}: NativeContextMenuProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  const [open, setOpen] = useState(false);
  function dismiss() {
    setOpen(false);
    onDismiss?.();
  }
  return (
    <View testID={testID ?? "kern-context-menu"}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={triggerLabel}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        onLongPress={() => setOpen(true)}
        style={{ minHeight: 48, justifyContent: "center" }}
      >
        {children}
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
