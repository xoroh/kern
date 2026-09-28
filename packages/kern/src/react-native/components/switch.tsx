import {
  Pressable,
  type PressableProps,
  View,
  type ViewStyle,
} from "react-native";
import { tokens } from "../../theme/tokens";
import { useControllableState } from "../utils/useControllableState";

export function switchStyles(
  on: boolean,
  disabled: boolean,
): {
  track: ViewStyle;
  thumb: ViewStyle;
} {
  return {
    track: {
      width: 52,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: on
        ? tokens.base.black.srgb
        : tokens.palettes.neutral["500"].srgb,
      backgroundColor: on ? tokens.base.black.srgb : tokens.base.white.srgb,
      justifyContent: "center" as const,
      paddingHorizontal: 2,
      opacity: disabled ? 0.5 : 1,
    },
    thumb: {
      width: on ? 24 : 16,
      height: on ? 24 : 16,
      borderRadius: 12,
      backgroundColor: on
        ? tokens.base.white.srgb
        : tokens.palettes.neutral["500"].srgb,
      alignSelf: on ? ("flex-end" as const) : ("flex-start" as const),
    },
  };
}

export type NativeSwitchProps = Omit<PressableProps, "children" | "style"> & {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (next: boolean) => void;
};

export function Switch({
  value,
  defaultValue = false,
  onValueChange,
  testID,
  ...props
}: NativeSwitchProps) {
  const [onValue, setOn] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const on = onValue ?? false;
  const styles = switchStyles(on, Boolean(props.disabled));
  return (
    <Pressable
      testID={testID ?? "kern-switch"}
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled: Boolean(props.disabled) }}
      onPress={() => setOn(!on)}
      style={styles.track}
      {...props}
    >
      <View style={styles.thumb} />
    </Pressable>
  );
}
