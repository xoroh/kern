import { useControllableState } from "@xoroh/kern-primitives";
import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import { useState } from "react";
import {
  Pressable,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

export type NativeSliderSize = "default" | "xs" | "sm" | "md" | "lg" | "xl";

/**
 * M3 Expressive slider geometry: track height / handle bar per size.
 * `default` keeps the pre-expressive baseline (4dp track, 20dp round
 * thumb) so existing rendering cannot change.
 */
const SLIDER_GEOMETRY: Record<
  Exclude<NativeSliderSize, "default">,
  { track: number; handle: number }
> = {
  xs: { track: 16, handle: 44 },
  sm: { track: 24, handle: 44 },
  md: { track: 40, handle: 52 },
  lg: { track: 56, handle: 68 },
  xl: { track: 96, handle: 108 },
};

export function sliderStyles(
  ratio: number,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
  size: NativeSliderSize = "default",
): { track: ViewStyle; fill: ViewStyle; thumb: ViewStyle } {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  const geo = size === "default" ? null : SLIDER_GEOMETRY[size];
  const trackH = geo?.track ?? 4;
  const handleH = geo?.handle ?? 20;
  const handleW = geo ? 4 : 20;
  return {
    track: {
      height: trackH,
      borderRadius: trackH / 2,
      backgroundColor: scheme.color.surfaceTonal,
      opacity: disabled ? 0.38 : 1,
    },
    fill: {
      height: trackH,
      width: `${clamped * 100}%`,
      borderRadius: trackH / 2,
      backgroundColor: scheme.color.primary,
    },
    thumb: {
      width: handleW,
      height: handleH,
      borderRadius: handleW / 2,
      backgroundColor: scheme.color.primary,
      position: "absolute",
      left: `${clamped * 100}%`,
      marginLeft: -handleW / 2,
      top: -(handleH - trackH) / 2,
    },
  };
}

export type NativeSliderProps = Omit<ViewProps, "children" | "style"> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  /**
   * M3 Expressive size. `default` is the pre-expressive baseline;
   * `xs`–`xl` swap the token-driven expressive geometry.
   */
  size?: NativeSliderSize;
  style?: StyleProp<ViewStyle>;
};

export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  accessibilityLabel = "Value",
  size = "default",
  style,
  testID,
  ...props
}: NativeSliderProps) {
  const scheme = useKernScheme();
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [width, setWidth] = useState(0);
  const numeric = current ?? defaultValue;
  const ratio = (numeric - min) / Math.max(max - min, 1);
  const styles = sliderStyles(ratio, disabled, scheme, size);
  function commit(next: number) {
    const stepped = Math.round(next / step) * step;
    setCurrent(Math.min(Math.max(stepped, min), max));
  }
  return (
    <View
      {...props}
      testID={testID ?? "kern-slider"}
      style={[{ minHeight: 48, justifyContent: "center" }, style]}
    >
      <Pressable
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        accessibilityValue={{ now: numeric, min, max }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        disabled={disabled}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === "increment")
            commit(numeric + step);
          else commit(numeric - step);
        }}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !disabled}
        onResponderGrant={(event) => {
          if (width > 0)
            commit(min + (event.nativeEvent.locationX / width) * (max - min));
        }}
        onResponderMove={(event) => {
          if (width > 0)
            commit(min + (event.nativeEvent.locationX / width) * (max - min));
        }}
        style={{ minHeight: 48, justifyContent: "center" }}
      >
        <View style={styles.track}>
          <View style={styles.fill} />
          <View style={styles.thumb} />
        </View>
      </Pressable>
    </View>
  );
}
