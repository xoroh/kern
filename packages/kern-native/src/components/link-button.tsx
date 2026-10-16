import { type ReactNode, useState } from "react";
import {
  type GestureResponderEvent,
  Linking,
  Pressable,
  Text,
} from "react-native";
import { useKernScheme } from "../theme";
import {
  buttonStyles,
  NATIVE_BUTTON_VARIANT_ALIASES,
  type NativeButtonColor,
  type NativeButtonM3Variant,
  type NativeButtonShape,
  type NativeButtonSize,
  type NativeButtonVariant,
} from "./button";

export type LinkButtonProps = {
  /**
   * Destination. Required — a link without an `href` is a button wearing
   * link paint; use `Button` for that. Without an `onPress` the press opens
   * the URL via `Linking`, so routing composes by URL on both renderers.
   */
  href: string;
  /** Overrides the default `Linking.openURL(href)` press. */
  onPress?: (event: GestureResponderEvent) => void;
  children: ReactNode;
  variant?: NativeButtonVariant | NativeButtonM3Variant;
  size?: NativeButtonSize;
  color?: NativeButtonColor;
  shape?: NativeButtonShape;
  /** Full-width block link. */
  block?: boolean;
  /** M3 Expressive toggle mode (forwarded to the Button treatment). */
  toggle?: boolean;
  /** Controlled selected state. Only meaningful with `toggle`. */
  pressed?: boolean;
  /** Initial selected state for the uncontrolled toggle case. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Leading (or trailing, with `iconPosition`) icon. */
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  disabled?: boolean;
  style?: React.ComponentProps<typeof Pressable>["style"];
  labelStyle?: React.ComponentProps<typeof Text>["style"];
  testID?: string;
};

/**
 * LinkButton — the button treatment on a navigation control.
 *
 * The native bridge onto `buttonStyles` (the same style kernel `Button` and
 * `LoadingButton` share), not a second treatment: every axis (variant,
 * color, size, shape, block, toggle, icon) resolves through the one style
 * map, so the link and the button cannot drift apart. What differs is the
 * role and the press — `accessibilityRole="link"` and a default press that
 * opens `href` — because on this renderer navigation is `Linking`, not an
 * anchor element. Mirrors the web rule that trailing icons are coerced to
 * the inline start with a dev warning.
 */
export function LinkButton({
  href,
  onPress,
  children,
  variant: variantInput = "primary",
  size = "default",
  color = "primary",
  shape = "pill",
  block = false,
  toggle = false,
  pressed,
  defaultPressed,
  onPressedChange,
  icon,
  iconPosition = "start",
  disabled = false,
  style,
  labelStyle,
  testID,
}: LinkButtonProps) {
  const scheme = useKernScheme();
  const [uncontrolled, setUncontrolled] = useState(defaultPressed ?? false);
  const isSelected =
    toggle && pressed !== undefined ? pressed : toggle ? uncontrolled : false;
  // Same M3-alias normalization as Button — buttonStyles only sees Kern names.
  const variant: NativeButtonVariant =
    variantInput in NATIVE_BUTTON_VARIANT_ALIASES
      ? NATIVE_BUTTON_VARIANT_ALIASES[variantInput as NativeButtonM3Variant]
      : (variantInput as NativeButtonVariant);
  if (process.env.NODE_ENV !== "production" && iconPosition === "end") {
    // M3 forbids trailing icons on link buttons: the outbound cue lives at
    // the inline start, and a trailing icon reads as a second action.
    console.warn(
      'LinkButton: `iconPosition="end"` is ignored — M3 link buttons cannot carry trailing icons.',
    );
  }
  const styles = buttonStyles(variant, size, disabled, scheme, {
    color,
    shape,
    block,
    toggle,
    selected: toggle ? isSelected : false,
  });
  function handlePress(event: GestureResponderEvent) {
    if (toggle && pressed === undefined) setUncontrolled(!isSelected);
    if (toggle) onPressedChange?.(!isSelected);
    if (onPress) {
      onPress(event);
    } else {
      void Linking.openURL(href);
    }
  }
  return (
    <Pressable
      testID={testID ?? "kern-link-button"}
      accessibilityRole="link"
      accessibilityState={{ disabled }}
      accessibilityHint={href}
      disabled={disabled}
      hitSlop={size === "xs" ? 10 : size === "sm" ? 8 : size === "xl" ? 0 : 4}
      onPress={handlePress}
      style={({ pressed: isPressed }) => [
        styles.container,
        isPressed && !disabled ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed: isPressed }) : style,
      ]}
    >
      {/* `end` is coerced to `start` above — the icon always leads. */}
      {icon}
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
