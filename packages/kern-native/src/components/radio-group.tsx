import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import { createContext, type ReactNode, useContext } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";

type RadioGroupContextValue = {
  value: string | undefined;
  select: (value: string) => void;
  disabled: boolean;
  scheme: ResolvedTheme;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function radioStyles(
  selected: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
) {
  return {
    control: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: selected ? scheme.color.primary : scheme.color.outline,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      opacity: disabled ? 0.5 : 1,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: scheme.color.primary,
    },
  };
}

export type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  children,
  style,
  testID,
}: RadioGroupProps) {
  const { scheme } = useKernTheme();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  return (
    <RadioGroupContext.Provider
      value={{ value: selected, select: setSelected, disabled, scheme }}
    >
      <View
        testID={testID ?? "kern-radio-group"}
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
        style={[{ flexDirection: "column", gap: 0 }, style]}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState"
> & {
  value: string;
  children: ReactNode;
  accessibilityState?: PressableProps["accessibilityState"];
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
};

export function RadioGroupItem({
  value,
  children,
  onPress,
  style,
  disabled,
  accessibilityState,
  hitSlop,
  testID,
  ...props
}: RadioGroupItemProps) {
  const group = useContext(RadioGroupContext);
  if (!group) {
    throw new Error("RadioGroupItem must be rendered inside RadioGroup.");
  }
  const isDisabled = group.disabled || Boolean(disabled);
  const selected = group.value === value;
  const styles = radioStyles(selected, isDisabled, group.scheme);
  return (
    <Pressable
      {...props}
      testID={testID ?? `kern-radio-${value}`}
      accessibilityRole="radio"
      accessibilityState={{
        ...accessibilityState,
        checked: selected,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      hitSlop={hitSlop ?? { top: 12, bottom: 12, left: 12, right: 12 }}
      onPress={(event) => {
        onPress?.(event);
        if (!isDisabled && !event.isDefaultPrevented()) group.select(value);
      }}
      style={({ pressed }) => [
        {
          minHeight: 48,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        pressed && !isDisabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <View style={styles.control}>
        {selected ? <View style={styles.indicator} /> : null}
      </View>
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={{ fontSize: 14, color: group.scheme.color.onSurface }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
