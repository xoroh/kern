import { useSelection } from "@xoroh/kern-primitives";
import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
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
  // The selection model is the shared primitive: exclusive-vs-additive is a Kern
  // decision, and both renderers now implement it once.
  //
  // This replaces a hand-rolled version whose single-select branch did
  // `selected[0] === optionValue ? "" : optionValue`, so re-activating the
  // selected item set the value to the EMPTY STRING. That is neither a radio
  // group (which does not deselect) nor a deselect (which would clear it): it
  // left a phantom `""` entry in the selection, rendering as a selected item for
  // any option whose value was `""`, and reporting a non-empty selection where
  // the user had selected nothing.
  const [selected, toggle] = useSelection({
    value,
    defaultValue,
    onChange: onValueChange as (next: readonly string[]) => void,
    mode: multiple ? "multiple" : "single",
  });
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
