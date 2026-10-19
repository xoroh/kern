import { useControllableState } from "@xoroh/axis";
import type { ResolvedTheme } from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { DISABLED_CONTENT_OPACITY, StateLayer } from "./state-layer";
import { Text } from "./text";

export function toggleStyles(
  pressed: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = defaultScheme(),
): ViewStyle {
  return {
    minHeight: 40,
    minWidth: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: Number.parseFloat(scheme.shape.full),
    overflow: "hidden",
    paddingHorizontal: 12,
    backgroundColor: pressed ? scheme.color.primary : "transparent",
    opacity: disabled ? DISABLED_CONTENT_OPACITY : 1,
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
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
};

export function Toggle({
  children,
  pressed,
  defaultPressed = false,
  onPressedChange,
  onPress,
  disabled = false,
  hitSlop,
  style,
  testID,
  ...props
}: NativeToggleProps) {
  const scheme = useKernScheme();
  const [isPressed, setPressed] = useControllableState(
    pressed,
    defaultPressed,
    (next) => {
      onPressedChange?.(next);
    },
  );
  const active = isPressed ?? false;
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-toggle"}
      role="button"
      aria-selected={active}
      aria-disabled={disabled ?? undefined}
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
        typeof style === "function" ? style({ pressed: pressedState }) : style,
      ]}
    >
      {({ pressed: pressedState }) => (
        <>
          <Text
            variant="label"
            style={active ? { color: scheme.color.onPrimary } : undefined}
          >
            {children}
          </Text>
          <StateLayer
            ink={active ? scheme.color.onPrimary : scheme.color.onSurface}
            radius={Number.parseFloat(scheme.shape.full)}
            visible={pressedState && !disabled}
          />
        </>
      )}
    </Pressable>
  );
}
