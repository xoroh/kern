import {
  SwitchRoot as AxisSwitchRoot,
  SwitchThumb as AxisSwitchThumb,
  type SwitchRootProps,
  type SwitchThumbProps,
} from "@xoroh/axis";
import { cssLengthToDp, type ResolvedTheme } from "@xoroh/kern-tokens";
import { useState } from "react";
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
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
  "children" | "style" | "onPress"
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

export {
  AxisSwitchRoot as SwitchRoot,
  AxisSwitchThumb as SwitchThumb,
  type SwitchRootProps,
  type SwitchThumbProps,
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
  const [onRaw, setOnRaw] = useState(defaultChecked);
  const on = checked !== undefined ? checked : onRaw;
  const styles = switchStyles(on, disabled ?? false, scheme);

  const a11yLabel = props.accessibilityLabel ?? props["aria-label"];
  return (
    <AxisSwitchRoot
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(next) => {
        setOnRaw(next);
        onCheckedChange?.(next);
      }}
      disabled={disabled}
      testID={testID ?? "kern-switch"}
      aria-label={a11yLabel}
      aria-labelledby={props["aria-labelledby"]}
      style={styles.track}
      render={(rootProps) => (
        <Pressable
          {...props}
          {...rootProps}
          role="switch"
          accessibilityRole="switch"
          accessibilityLabel={a11yLabel}
          aria-checked={on}
          aria-disabled={disabled ?? undefined}
          disabled={disabled ?? undefined}
          hitSlop={hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={(event) => {
            onPress?.(event);
            if (!disabled && !event.isDefaultPrevented()) {
              setOnRaw(!on);
              onCheckedChange?.(!on);
              const rootOnPress = rootProps.onPress;
              if (typeof rootOnPress === "function") {
                (rootOnPress as (e: GestureResponderEvent) => void)(event);
              }
            }
          }}
          style={({ pressed: pressedNow }) => [
            styles.track,
            typeof style === "function"
              ? style({ pressed: pressedNow })
              : style,
          ]}
        >
          {({ pressed: pressedNow }) => (
            <>
              <AxisSwitchThumb style={styles.thumb} />
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
      )}
    />
  );
}

Switch.Root = AxisSwitchRoot;
Switch.Thumb = AxisSwitchThumb;
