import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import {
  Pressable,
  type PressableProps,
  View,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { useControllableState } from "../utils/useControllableState";

export function switchStyles(
  on: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { track: ViewStyle; thumb: ViewStyle } {
  return {
    track: {
      width: 52,
      height: 32,
      borderRadius: Number.parseFloat(scheme.shape.full),
      borderWidth: 2,
      borderColor: on ? scheme.color.primary : scheme.color.outline,
      backgroundColor: on ? scheme.color.primary : scheme.color.surface,
      justifyContent: "center",
      paddingHorizontal: 2,
      opacity: disabled ? 0.5 : 1,
    },
    thumb: {
      width: on ? 24 : 16,
      height: on ? 24 : 16,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: on ? scheme.color.onPrimary : scheme.color.outline,
      alignSelf: on ? "flex-end" : "flex-start",
    },
  };
}

export type NativeSwitchProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState"
> & {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (next: boolean) => void;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  accessibilityState?: PressableProps["accessibilityState"];
};

export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  onPress,
  disabled = false,
  accessibilityState,
  hitSlop,
  style,
  testID,
  ...props
}: NativeSwitchProps) {
  const { scheme } = useKernTheme();
  const [onValue, setOn] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const on = onValue ?? false;
  const styles = switchStyles(on, disabled ?? false, scheme);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-switch"}
      accessibilityRole="switch"
      accessibilityState={{
        ...accessibilityState,
        checked: on,
        disabled: disabled ?? undefined,
      }}
      disabled={disabled ?? undefined}
      hitSlop={hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={(event) => {
        onPress?.(event);
        if (!disabled && !event.isDefaultPrevented()) {
          setOn((previous) => !previous);
        }
      }}
      style={({ pressed }) => [
        styles.track,
        pressed && !disabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      <View style={styles.thumb} />
    </Pressable>
  );
}
