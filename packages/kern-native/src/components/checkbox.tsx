import { Icon } from "@xoroh/kern-icons";
import { useControllableState } from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernTheme } from "../theme";

function withAlpha(color: string, alpha: number): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const byte = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${byte}`;
  }
  return color;
}

export function checkboxStyles(
  checked: boolean,
  indeterminate: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = defaultScheme(),
): { box: ViewStyle; glyph: TextStyle } {
  const marked = checked || indeterminate;
  return {
    box: {
      width: 18,
      height: 18,
      // M3 checkbox container-shape is 2px, not the extra-small 4px.
      borderRadius: 2,
      borderWidth: marked ? 0 : 2,
      borderColor: marked
        ? "transparent"
        : disabled
          ? withAlpha(scheme.color.onSurface, 0.38)
          : scheme.color.onSurfaceVariant,
      backgroundColor: marked
        ? disabled
          ? withAlpha(scheme.color.onSurface, 0.38)
          : scheme.color.primary
        : scheme.color.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    glyph: {
      fontSize: indeterminate ? 14 : 12,
      lineHeight: 14,
      color: disabled ? scheme.color.surface : scheme.color.onPrimary,
      fontWeight: "700",
    },
  };
}

export type NativeCheckboxProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState"
> & {
  /**
   * Controlled checked state. Base UI name — there is no `value` prop here
   * (see api-consistency.md §0).
   */
  checked?: boolean;
  /** Initial checked state for the uncontrolled case. */
  defaultChecked?: boolean;
  indeterminate?: boolean;
  /** Reports the next checked state. */
  onCheckedChange?: (next: boolean) => void;
  onPress?: PressableProps["onPress"];
  accessibilityState?: PressableProps["accessibilityState"];
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
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
    checked,
    defaultChecked,
    onCheckedChange,
  );
  const isChecked = checkedValue ?? false;
  const styles = checkboxStyles(
    isChecked,
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
        checked: indeterminate ? "mixed" : isChecked,
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
        ) : isChecked ? (
          <Icon name="check" size={12} color={styles.glyph.color} />
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
