import { type StatusTone, statusToneSolid } from "@xoroh/kern-tokens";
import { useState } from "react";
import {
  Image,
  type ImageProps,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";
import { Text } from "./text";

export type { StatusTone };

export type NativeAvatarSize = "small" | "default" | "large";

export function avatarStyles(
  size: NativeAvatarSize,
  scheme = defaultScheme(),
  tone: StatusTone = "primary",
): { container: ViewStyle; radius: number; dimension: number } {
  const dimension = size === "small" ? 32 : size === "large" ? 56 : 40;
  // Solid registry tone (KernStatus, CL-010) on the fallback disc.
  // Default `primary` preserves the existing look.
  const { bg } = statusToneSolid(scheme.color, tone);
  return {
    container: {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
      backgroundColor: bg,
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
  /**
   * Registry tone for the fallback disc (KernStatus, CL-010).
   * Deterministic per-user color comes from `avatarToneFor` in
   * `@xoroh/kern-tokens` mapped onto this prop by the host — replaces
   * per-app HSL-disc copies.
   */
  tone?: StatusTone;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({
  source,
  fallback = "?",
  accessibilityLabel,
  size = "default",
  tone = "primary",
  style,
  testID,
  ...props
}: NativeAvatarProps) {
  const scheme = useKernScheme();
  const [failed, setFailed] = useState(false);
  const styles = avatarStyles(size, scheme, tone);
  const { fg } = statusToneSolid(scheme.color, tone);
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
        <Text variant="label" style={{ color: fg }}>
          {fallback}
        </Text>
      )}
    </View>
  );
}
