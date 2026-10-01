import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
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

export function sheetStyles(scheme: ResolvedTheme = resolveThemeDetails()): {
  card: ViewStyle;
} {
  return {
    card: {
      borderTopLeftRadius: Number.parseFloat(scheme.shape["extra-large"]),
      borderTopRightRadius: Number.parseFloat(scheme.shape["extra-large"]),
      backgroundColor: scheme.color.surface,
      padding: 24,
      paddingBottom: 40,
      maxHeight: "80%",
    },
  };
}

export type NativeSheetProps = {
  visible: boolean;
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Sheet({
  visible,
  title,
  children,
  onDismiss,
  style,
  testID,
}: NativeSheetProps) {
  const scheme = useKernScheme();
  const styles = sheetStyles(scheme);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      accessibilityViewIsModal
      onRequestClose={onDismiss}
    >
      <View style={overlayStyles.bottomScrim}>
        <Pressable
          accessibilityLabel="Dismiss sheet"
          onPress={onDismiss}
          style={{ flex: 1 }}
        />
        <View testID={testID ?? "kern-sheet"} style={[styles.card, style]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text variant="title">{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close sheet"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={onDismiss}
              style={{
                minHeight: 48,
                minWidth: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text variant="title">×</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
