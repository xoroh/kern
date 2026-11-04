import {
  type StatusTone,
  statusTone,
  statusToneSolid,
} from "@xoroh/kern-tokens";
import type { ReactNode } from "react";
import {
  Text as RNText,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernScheme } from "../theme";

export type { StatusTone };

export type NativeStatusPillDensity = "compact" | "medium";

export function statusPillStyles(
  tone: StatusTone,
  emphasis: "soft" | "solid" = "soft",
  density: NativeStatusPillDensity = "medium",
  scheme = defaultScheme(),
): {
  container: ViewStyle;
  labelFontSize: number;
  labelColor: string;
  dotColor: string;
} {
  const { bg, fg, dot } =
    emphasis === "soft"
      ? statusTone(scheme.color, tone)
      : statusToneSolid(scheme.color, tone);
  return {
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      alignSelf: "flex-start",
      height: density === "compact" ? 24 : 32,
      paddingHorizontal: density === "compact" ? 10 : 14,
      borderRadius: Number.parseFloat(scheme.shape.full),
      backgroundColor: bg,
    },
    labelFontSize: density === "compact" ? 12 : 14,
    labelColor: fg,
    dotColor: dot,
  };
}

export type NativeStatusPillProps = Omit<ViewProps, "children" | "style"> & {
  tone?: StatusTone;
  emphasis?: "soft" | "solid";
  icon?: ReactNode;
  dot?: boolean;
  density?: NativeStatusPillDensity;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * StatusPill — native twin of the web `StatusPill` (D951 WP1b, CL-010):
 * dot (or icon), label, one registry tone. Same contract
 * (`tone/emphasis/icon/dot/density`), same 7 tones from `TONE_ROLES` /
 * `SOLID_TONE_ROLES` — the dot color, fill and ink resolve from the
 * scheme, so light/dark follow with no conditionals.
 */
export function StatusPill({
  tone = "neutral",
  emphasis = "soft",
  icon,
  dot,
  density = "medium",
  children,
  style,
  testID,
  ...props
}: NativeStatusPillProps) {
  const scheme = useKernScheme();
  const styles = statusPillStyles(tone, emphasis, density, scheme);
  const showDot = dot ?? icon === undefined;
  return (
    <View
      {...props}
      testID={testID ?? "kern-status-pill"}
      style={[styles.container, style]}
    >
      {showDot ? (
        <View
          testID={`${testID ?? "kern-status-pill"}-dot`}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: styles.dotColor,
          }}
        />
      ) : null}
      {icon}
      {typeof children === "string" || typeof children === "number" ? (
        <RNText
          numberOfLines={1}
          style={{
            fontSize: styles.labelFontSize,
            fontWeight: "500",
            color: styles.labelColor,
          }}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
}
