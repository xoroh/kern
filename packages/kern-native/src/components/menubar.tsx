import type { ResolvedTheme } from "@xoroh/kern-tokens";
import { useState } from "react";
import {
  Modal,
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { scrimStyle } from "../utils/overlay-styles";
import { menuStyles, type NativeMenuItem } from "./menu";
import { Text } from "./text";

export type NativeMenubarMenu = {
  label: string;
  items: NativeMenuItem[];
};

export function menubarStyles(
  scheme: ResolvedTheme = defaultScheme(),
): ViewStyle {
  return {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 48,
    borderRadius: Number.parseFloat(scheme.shape.full),
    backgroundColor: scheme.color.surfaceTonal,
    paddingHorizontal: 8,
  };
}

export type NativeMenubarProps = Omit<ViewProps, "children" | "style"> & {
  menus: NativeMenubarMenu[];
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Menubar({
  menus,
  onDismiss,
  style,
  testID,
  ...props
}: NativeMenubarProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const active = menus.find((menu) => menu.label === openMenu);
  function dismiss() {
    setOpenMenu(null);
    onDismiss?.();
  }
  return (
    <View
      {...props}
      testID={testID ?? "kern-menubar"}
      accessibilityRole="menubar"
      style={[menubarStyles(scheme), style]}
    >
      {menus.map((menu) => (
        <Pressable
          key={menu.label}
          accessibilityRole="menuitem"
          accessibilityLabel={menu.label}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={() => setOpenMenu(menu.label)}
          style={{
            minHeight: 40,
            justifyContent: "center",
            paddingHorizontal: 16,
            borderRadius: Number.parseFloat(scheme.shape.full),
          }}
        >
          <Text variant="label">{menu.label}</Text>
        </Pressable>
      ))}
      <Modal
        visible={active !== undefined}
        transparent
        animationType="fade"
        onRequestClose={dismiss}
      >
        <View style={scrimStyle(scheme)}>
          <View accessibilityRole="menu" style={styles.card}>
            {(active?.items ?? []).map((item) => (
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
