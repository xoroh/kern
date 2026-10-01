import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";
import { Text } from "./text";

export type NativeToggleGroupOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function toggleGroupStyles(
  scheme: ResolvedTheme = resolveThemeDetails(),
): { container: ViewStyle } {
  return {
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: scheme.color.surfaceTonal,
      padding: 4,
    },
  };
}

export type NativeToggleGroupProps = Omit<ViewProps, "children" | "style"> & {
  options: NativeToggleGroupOption[];
  /** Selected values. Single string for exclusive groups. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ToggleGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  style,
  testID,
  ...props
}: NativeToggleGroupProps) {
  const scheme = useKernScheme();
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue ?? (multiple ? [] : undefined),
    onValueChange,
  );
  const selected = (
    multiple
      ? ((current as string[] | undefined) ?? [])
      : current !== undefined
        ? [current as string]
        : []
  ) as string[];
  function toggle(optionValue: string) {
    if (multiple) {
      const next = selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
      setCurrent(next);
    } else {
      setCurrent(selected[0] === optionValue ? "" : optionValue);
    }
  }
  return (
    <View
      {...props}
      testID={testID ?? "kern-toggle-group"}
      accessibilityRole="radiogroup"
      style={[toggleGroupStyles(scheme).container, style]}
    >
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active, disabled: option.disabled }}
            disabled={option.disabled}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            onPress={() => toggle(option.value)}
            style={{
              minHeight: 40,
              minWidth: 40,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 12,
              borderRadius: Number.parseFloat(scheme.shape.full),
              backgroundColor: active ? scheme.color.primary : "transparent",
              opacity: option.disabled ? 0.5 : 1,
            }}
          >
            <Text
              variant="label"
              style={active ? { color: scheme.color.onPrimary } : undefined}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
