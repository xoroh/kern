import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
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
import { useControllableState } from "../utils/useControllableState";
import { menuStyles } from "./menu";
import { Text } from "./text";

export type NativeSelectOption = {
  value: string;
  label: string;
};

export function selectStyles(scheme: ResolvedTheme = resolveThemeDetails()): {
  trigger: ViewStyle;
} {
  return {
    trigger: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: scheme.color.outline,
      borderRadius: Number.parseFloat(scheme.shape.small),
      backgroundColor: scheme.color.surface,
      paddingHorizontal: 16,
    },
  };
}

export type NativeSelectProps = {
  options: NativeSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select",
  accessibilityLabel = "Select",
  disabled = false,
  onDismiss,
  style,
  testID,
}: NativeSelectProps) {
  const scheme = useKernScheme();
  const styles = menuStyles(scheme);
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === current);
  function dismiss() {
    setOpen(false);
    onDismiss?.();
  }
  return (
    <View testID={testID ?? "kern-select"}>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        onPress={() => setOpen(true)}
        style={[
          selectStyles(scheme).trigger,
          { opacity: disabled ? 0.5 : 1 },
          style,
        ]}
      >
        <Text
          style={
            selected ? undefined : { color: scheme.color.onSurfaceVariant }
          }
        >
          {selected ? selected.label : placeholder}
        </Text>
        <Text variant="body">▾</Text>
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={dismiss}
      >
        <View style={overlayStyles.scrim}>
          <View accessibilityRole="menu" style={styles.card}>
            {options.map((option) => {
              const isSelected = option.value === current;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="menuitem"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: isSelected }}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  onPress={() => {
                    setCurrent(option.value);
                    dismiss();
                  }}
                  style={{
                    minHeight: 48,
                    justifyContent: "center",
                    paddingHorizontal: 12,
                    borderRadius: Number.parseFloat(
                      scheme.shape["extra-small"],
                    ),
                    backgroundColor: isSelected
                      ? scheme.color.surfaceTonal
                      : "transparent",
                  }}
                >
                  <Text>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}
