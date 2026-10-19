import { useControllableState } from "@xoroh/axis";
import { cssLengthToDp, type ResolvedTheme } from "@xoroh/kern-tokens";
import {
  Pressable,
  type PressableProps,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernTheme } from "../theme";
import { DISABLED_CONTENT_OPACITY, StateLayer } from "./state-layer";

export function switchStyles(
  on: boolean,
  disabled: boolean,
  scheme: ResolvedTheme = defaultScheme(),
): { track: ViewStyle; thumb: ViewStyle } {
  return {
    track: {
      width: 52,
      height: 32,
      borderRadius: cssLengthToDp(
        scheme.comp?.["switch-track-shape"],
        Number.parseFloat(scheme.shape.full),
      ),
      borderWidth: 2,
      borderColor: on ? scheme.color.primary : scheme.color.outline,
      backgroundColor: on ? scheme.color.primary : scheme.color.surface,
      justifyContent: "center",
      overflow: "hidden",
      paddingHorizontal: 2,
      opacity: disabled ? DISABLED_CONTENT_OPACITY : 1,
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
  /**
   * Controlled checked state. Base UI name — there is no `value` prop here
   * (see api-consistency.md §0).
   */
  checked?: boolean;
  /** Initial checked state for the uncontrolled case. */
  defaultChecked?: boolean;
  /** Reports the next checked state. */
  onCheckedChange?: (next: boolean) => void;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  onPress,
  disabled = false,
  hitSlop,
  style,
  testID,
  ...props
}: NativeSwitchProps) {
  const { scheme } = useKernTheme();
  const [onValue, setOn] = useControllableState(
    checked,
    defaultChecked,
    onCheckedChange,
  );
  const on = onValue ?? false;
  const styles = switchStyles(on, disabled ?? false, scheme);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-switch"}
      role="switch"
      aria-checked={on}
      aria-disabled={disabled ?? undefined}
      disabled={disabled ?? undefined}
      hitSlop={hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={(event) => {
        onPress?.(event);
        if (!disabled && !event.isDefaultPrevented()) {
          setOn((previous) => !previous);
        }
      }}
      style={({ pressed: pressedNow }) => [
        styles.track,
        typeof style === "function" ? style({ pressed: pressedNow }) : style,
      ]}
    >
      {({ pressed: pressedNow }) => (
        <>
          <View style={styles.thumb} />
          <StateLayer
            ink={on ? scheme.color.onPrimary : scheme.color.onSurface}
            radius={cssLengthToDp(
              scheme.comp?.["switch-track-shape"],
              Number.parseFloat(scheme.shape.full),
            )}
            visible={pressedNow && !disabled}
          />
        </>
      )}
    </Pressable>
  );
}
