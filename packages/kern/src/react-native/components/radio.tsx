import { createContext, useContext } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";
import { useControllableState } from "../utils/useControllableState";

const GroupContext = createContext<{
  value: string | undefined;
  select: (next: string) => void;
  disabled: boolean;
}>({ value: undefined, select: () => {}, disabled: false });

export function radioStyles(
  selected: boolean,
  disabled: boolean,
): {
  dot: ViewStyle;
  pip: ViewStyle;
  label: TextStyle;
} {
  return {
    dot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: selected
        ? tokens.base.black.srgb
        : tokens.palettes.neutral["500"].srgb,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      opacity: disabled ? 0.5 : 1,
    },
    pip: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: tokens.base.black.srgb,
    },
    label: { fontSize: 14, color: tokens.palettes.neutral["800"].srgb },
  };
}

export type NativeRadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  children,
  style,
  testID,
}: NativeRadioGroupProps) {
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  return (
    <GroupContext.Provider
      value={{ value: current, select: setCurrent, disabled }}
    >
      <View
        testID={testID ?? "kern-radio-group"}
        accessibilityRole="radiogroup"
        style={[{ flexDirection: "column", gap: 8 }, style]}
      >
        {children}
      </View>
    </GroupContext.Provider>
  );
}

export type NativeRadioItemProps = Omit<PressableProps, "children"> & {
  value: string;
  label: string;
};

export function RadioItem({
  value,
  label,
  testID,
  ...props
}: NativeRadioItemProps) {
  const group = useContext(GroupContext);
  const selected = group.value === value;
  const styles = radioStyles(selected, group.disabled);
  return (
    <Pressable
      testID={testID ?? `kern-radio-${value}`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: group.disabled }}
      disabled={group.disabled}
      onPress={() => group.select(value)}
      style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      {...props}
    >
      <View style={styles.dot}>
        {selected ? <View style={styles.pip} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
