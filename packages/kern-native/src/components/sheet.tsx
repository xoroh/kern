import type { ResolvedTheme } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { overlayStyles } from "../utils/overlay-styles";
import { Text } from "./text";

export function sheetStyles(scheme: ResolvedTheme = defaultScheme): {
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
  /**
   * Controlled visibility. Controlled-only passthrough — no `defaultOpen`,
   * no state.
   */
  open?: boolean;
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  /**
   * R2 lexicon: state report — fired with `false` alongside `onDismiss`
   * on scrim press and hardware back.
   */
  onOpenChange?: (open: boolean) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Sheet({
  open,
  title,
  children,
  onDismiss,
  onOpenChange,
  style,
  testID,
}: NativeSheetProps) {
  const scheme = useKernScheme();
  const styles = sheetStyles(scheme);
  const notifyDismiss = () => {
    onDismiss?.();
    onOpenChange?.(false);
  };
  return (
    <Modal
      visible={open ?? false}
      transparent
      animationType="slide"
      accessibilityViewIsModal
      onRequestClose={notifyDismiss}
    >
      <View style={overlayStyles.bottomScrim}>
        <Pressable
          accessibilityLabel="Dismiss sheet"
          onPress={notifyDismiss}
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
