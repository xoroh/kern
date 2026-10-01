import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import {
  ActivityIndicator,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";

export type NativeLoaderSize = "small" | "large";

export function loaderColor(
  scheme: ResolvedTheme = resolveThemeDetails(),
): string {
  return scheme.color.primary;
}

export type NativeLoaderProps = {
  size?: NativeLoaderSize;
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Loader({
  size = "large",
  label = "Loading",
  style,
  testID,
}: NativeLoaderProps) {
  const scheme = useKernScheme();
  return (
    <View testID={testID ?? "kern-loader"} style={style}>
      <ActivityIndicator
        size={size}
        color={loaderColor(scheme)}
        accessibilityLabel={label}
      />
    </View>
  );
}
