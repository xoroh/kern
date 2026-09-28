import {
  Pressable,
  type PressableProps,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";
import { useControllableState } from "../utils/useControllableState";

export function checkboxStyles(
  checked: boolean,
  disabled: boolean,
): {
  box: ViewStyle;
  glyph: TextStyle;
} {
  return {
    box: {
      width: 18,
      height: 18,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: checked
        ? tokens.base.black.srgb
        : tokens.palettes.neutral["500"].srgb,
      backgroundColor: checked
        ? tokens.base.black.srgb
        : tokens.base.white.srgb,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      opacity: disabled ? 0.5 : 1,
    },
    glyph: {
      fontSize: 12,
      color: tokens.base.white.srgb,
      fontWeight: "700" as const,
    },
  };
}

export type NativeCheckboxProps = Omit<PressableProps, "children" | "style"> & {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (next: boolean) => void;
  label?: string;
};

export function Checkbox({
  value,
  defaultValue = false,
  onValueChange,
  label,
  testID,
  ...props
}: NativeCheckboxProps) {
  const [checkedValue, setChecked] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const checked = checkedValue ?? false;
  const styles = checkboxStyles(checked, Boolean(props.disabled));
  return (
    <Pressable
      testID={testID ?? "kern-checkbox"}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: Boolean(props.disabled) }}
      accessibilityLabel={label}
      onPress={() => setChecked(!checked)}
      style={styles.box}
      {...props}
    >
      {checked ? <Text style={styles.glyph}>✓</Text> : null}
    </Pressable>
  );
}
