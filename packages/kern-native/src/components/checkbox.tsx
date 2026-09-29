import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";

export function checkboxStyles(
  checked: boolean,
  indeterminate: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { box: ViewStyle; glyph: TextStyle } {
  const marked = checked || indeterminate;
  return {
    box: {
      width: 18,
      height: 18,
      borderRadius: Number.parseFloat(scheme.shape["extra-small"]),
      borderWidth: 2,
      borderColor: marked ? scheme.color.primary : scheme.color.outline,
      backgroundColor: marked ? scheme.color.primary : scheme.color.surface,
      alignItems: "center",
      justifyContent: "center",
      opacity: disabled ? 0.5 : 1,
    },
    glyph: {
      fontSize: indeterminate ? 14 : 12,
      lineHeight: 14,
      color: scheme.color.onPrimary,
      fontWeight: "700",
    },
  };
}

export type NativeCheckboxProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState"
> & {
  value?: boolean;
  defaultValue?: boolean;
  indeterminate?: boolean;
  onValueChange?: (next: boolean) => void;
  onPress?: PressableProps["onPress"];
  accessibilityState?: PressableProps["accessibilityState"];
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Checkbox({
  value,
  defaultValue = false,
  indeterminate = false,
  onValueChange,
  onPress,
  label,
  accessibilityLabel,
  accessibilityState,
  disabled = false,
  hitSlop,
  style,
  labelStyle,
  testID,
  ...props
}: NativeCheckboxProps) {
  const { scheme } = useKernTheme();
  const [checkedValue, setChecked] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const checked = checkedValue ?? false;
  const styles = checkboxStyles(
    checked,
    indeterminate ?? false,
    disabled ?? false,
    scheme,
  );
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-checkbox"}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{
        ...accessibilityState,
        checked: indeterminate ? "mixed" : checked,
        disabled: disabled ?? undefined,
      }}
      disabled={disabled ?? undefined}
      hitSlop={hitSlop ?? { top: 15, bottom: 15, left: 15, right: 15 }}
      onPress={(event) => {
        onPress?.(event);
        if (!disabled && !event.isDefaultPrevented() && !indeterminate) {
          setChecked((previous) => !previous);
        }
      }}
      style={({ pressed }) => [
        { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 8 },
        pressed && !disabled ? { opacity: 0.82 } : undefined,
        style,
      ]}
    >
      <View style={styles.box}>
        {indeterminate ? (
          <Text style={styles.glyph}>−</Text>
        ) : checked ? (
          <Text style={styles.glyph}>✓</Text>
        ) : null}
      </View>
      {label ? (
        <Text style={[{ color: scheme.color.onSurface }, labelStyle]}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}
