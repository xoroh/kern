import { mergeSlotProps, type SlotProps } from "@xoroh/axis";
import type { LoadingIndicatorStyle } from "@xoroh/kern-m3";
import { cloneElement, isValidElement, useState } from "react";
import {
  type GestureResponderEvent,
  I18nManager,
  Pressable,
  type StyleProp,
  Text,
  type TextStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { buttonStyles, type NativeButtonProps } from "./button";
import { CircularProgress } from "./circular-progress";
import { StateLayer } from "./state-layer";

export type LoadingButtonProps = NativeButtonProps & {
  /** Shows the embedded progress indicator and blocks interaction. */
  loading?: boolean;
  /** 0–1 determinate progress while loading. Omit for the loop. */
  value?: number;
  /** Style of the embedded indicator. Defaults to the M3 ring (`spinner`). */
  loaderStyle?: LoadingIndicatorStyle;
};

/**
 * LoadingButton — button with embedded progress. Keeps its label and
 * footprint while loading (M3: never resize chrome for progress) and
 * hands the wait to a CircularProgress in the leading slot.
 */
export function LoadingButton({
  loading = false,
  value,
  loaderStyle,
  variant = "filled",
  color = "primary",
  size = "default",
  shape = "pill",
  block = false,
  softDisabled = false,
  flipIcon = false,
  icon,
  iconPosition = "start",
  children,
  onPress,
  style,
  labelStyle,
  disabled,
  testID,
  ...props
}: LoadingButtonProps) {
  const scheme = useKernScheme();
  const [pressedNow, setPressedNow] = useState(false);
  const blocked = Boolean(disabled) || loading || softDisabled;
  const styles = buttonStyles(variant, size, blocked, scheme, {
    color,
    shape,
    block,
  });
  const inkColor = String(styles.label.color ?? scheme.color.onPrimary);
  const rtlFlipStyle =
    flipIcon && I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined;
  const iconSlot = isValidElement<{ style?: StyleProp<TextStyle> }>(icon)
    ? cloneElement(
        icon,
        mergeSlotProps<SlotProps>(
          {
            style: [
              {
                color: styles.label.color,
                opacity: styles.label.opacity,
              },
              rtlFlipStyle,
            ],
          },
          icon.props,
        ),
      )
    : (icon ?? null);

  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-loading-button"}
      role="button"
      accessibilityRole="button"
      aria-disabled={blocked || undefined}
      aria-busy={loading || undefined}
      disabled={Boolean(disabled) || loading}
      hitSlop={size === "xs" ? 10 : size === "sm" ? 8 : 4}
      onPressIn={() => {
        if (!blocked) setPressedNow(true);
      }}
      onPressOut={() => {
        setPressedNow(false);
      }}
      onPress={(event: GestureResponderEvent) => {
        if (!blocked) onPress?.(event);
      }}
      style={({ pressed }) => [
        (pressed || pressedNow) && !blocked
          ? buttonStyles(variant, size, blocked, scheme, {
              color,
              shape,
              block,
              pressed: true,
            }).container
          : styles.container,
        loading ? { gap: 8 } : undefined,
        typeof style === "function"
          ? style({ pressed: pressed || pressedNow })
          : style,
      ]}
    >
      {loading ? (
        <CircularProgress
          value={value}
          loaderStyle={loaderStyle}
          size="sm"
          label="Loading"
          color={inkColor}
        />
      ) : null}
      {!loading && iconPosition === "start" ? iconSlot : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : (
        children
      )}
      {!loading && iconPosition === "end" ? iconSlot : null}
      <StateLayer
        ink={inkColor}
        radius={Number(
          styles.container.borderRadius ?? Number.parseFloat(scheme.shape.full),
        )}
        visible={pressedNow && !blocked}
      />
    </Pressable>
  );
}
