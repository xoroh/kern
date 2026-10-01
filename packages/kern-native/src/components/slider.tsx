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
import { useControllableState } from "../utils/useControllableState";

export function sliderStyles(
  ratio: number,
  disabled: boolean,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { track: ViewStyle; fill: ViewStyle; thumb: ViewStyle } {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  return {
    track: {
      height: 4,
      borderRadius: 2,
      backgroundColor: scheme.color.surfaceTonal,
      opacity: disabled ? 0.5 : 1,
    },
    fill: {
      height: 4,
      width: `${clamped * 100}%`,
      borderRadius: 2,
      backgroundColor: scheme.color.primary,
    },
    thumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: scheme.color.primary,
      position: "absolute",
      left: `${clamped * 100}%`,
      marginLeft: -10,
      top: -8,
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
  const styles = sliderStyles(ratio, disabled, scheme);
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
