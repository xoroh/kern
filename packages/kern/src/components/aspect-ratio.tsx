import type { ReactNode } from "react";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export type NativeAspectRatioProps = Omit<ViewProps, "children" | "style"> & {
  children: ReactNode;
  /** Width divided by height (16/9 for widescreen). */
  ratio?: number;
  style?: StyleProp<ViewStyle>;
};

/** Box that keeps a fixed width-to-height ratio. */
export function AspectRatio({
  children,
  ratio = 1,
  style,
  testID,
  ...props
}: NativeAspectRatioProps) {
  return (
    <View
      {...props}
      testID={testID ?? "kern-aspect-ratio"}
      style={[{ aspectRatio: ratio }, style]}
    >
      {children}
    </View>
  );
}
