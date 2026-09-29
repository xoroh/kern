import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-theme";
import { useState } from "react";
import {
  Image,
  type ImageProps,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Text } from "./text";

export type NativeAvatarSize = "small" | "default" | "large";

export function avatarStyles(
  size: NativeAvatarSize,
  scheme: ResolvedTheme = resolveThemeDetails(),
): { container: ViewStyle; radius: number; dimension: number } {
  const dimension = size === "small" ? 32 : size === "large" ? 56 : 40;
  return {
    container: {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
      backgroundColor: scheme.color.primary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    radius: dimension / 2,
    dimension,
  };
}

export type NativeAvatarProps = Omit<ImageProps, "style" | "source"> & {
  source?: ImageProps["source"];
  /** Initials shown when no image loads. */
  fallback?: string;
  accessibilityLabel?: string;
  size?: NativeAvatarSize;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({
  source,
  fallback = "?",
  accessibilityLabel,
  size = "default",
  style,
  testID,
  ...props
}: NativeAvatarProps) {
  const scheme = useKernScheme();
  const [failed, setFailed] = useState(false);
  const styles = avatarStyles(size, scheme);
  const showImage = source !== undefined && !failed;
  return (
    <View
      testID={testID ?? "kern-avatar"}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? fallback}
      style={[styles.container, style]}
    >
      {showImage ? (
        <Image
          {...props}
          source={source}
          onError={() => setFailed(true)}
          style={{ width: styles.dimension, height: styles.dimension }}
        />
      ) : (
        <Text variant="label" style={{ color: scheme.color.onPrimary }}>
          {fallback}
        </Text>
      )}
    </View>
  );
}
