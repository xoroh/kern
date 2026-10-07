import { useControllableState } from "@xoroh/kern-primitives";
import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export function toggleStyles(
  pressed: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): ViewStyle {
  return {
    minHeight: 40,
    minWidth: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: Number.parseFloat(scheme.shape.full),
    paddingHorizontal: 12,
    backgroundColor: pressed ? scheme.color.primary : "transparent",
    opacity: disabled ? 0.5 : 1,
  };
}

export type NativeToggleProps = Omit<
  PressableProps,
  "children" | "style" | "onPress" | "accessibilityState" | "accessibilityRole"
> & {
  children: ReactNode;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * R2 lexicon canonical names (`value` wins when both are passed; both
   * callbacks fire). `pressed`/`defaultPressed`/`onPressedChange` are
   * deprecated aliases onto the same state. `onPress` (the RN press event)
   * is the platform action and stays untouched.
   */
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (pressed: boolean) => void;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  accessibilityState?: PressableProps["accessibilityState"];
};

export function Toggle({
  children,
  pressed,
  defaultPressed = false,
  onPressedChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  onPress,
  disabled = false,
  accessibilityState,
  hitSlop,
  style,
  testID,
  ...props
}: NativeToggleProps) {
  const scheme = useKernScheme();
  const [isPressed, setPressed] = useControllableState(
    valueProp ?? pressed,
    defaultValue ?? defaultPressed,
    (next) => {
      onValueChange?.(next);
      onPressedChange?.(next);
    },
  );
  const active = isPressed ?? false;
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-toggle"}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        selected: active,
        disabled: disabled ?? undefined,
      }}
      disabled={disabled ?? undefined}
      hitSlop={hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={(event) => {
        onPress?.(event);
        if (!disabled && !event.isDefaultPrevented()) {
          setPressed((previous) => !previous);
        }
      }}
      style={({ pressed: pressedState }) => [
        toggleStyles(active, disabled ?? false, scheme),
        pressedState && !disabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed: pressedState }) : style,
      ]}
    >
      <Text
        variant="label"
        style={active ? { color: scheme.color.onPrimary } : undefined}
      >
        {children}
      </Text>
    </Pressable>
  );
}
