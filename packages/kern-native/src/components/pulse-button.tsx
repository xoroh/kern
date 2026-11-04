import {
  Button as AxisButton,
  mergeSlotProps,
  type SlotProps,
} from "@xoroh/axis";
import type { ReactNode } from "react";
import { cloneElement, isValidElement, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  type GestureResponderEvent,
  I18nManager,
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { defaultScheme, useKernTheme } from "../theme";
import {
  BUTTON_SPRING_TOKENS,
  buttonSpringConfig,
  buttonStyles,
  type NativeButtonColor,
  type NativeButtonIconPosition,
  type NativeButtonShape,
  type NativeButtonSize,
  type NativeButtonStyleOptions,
  type NativeButtonToggleOptions,
  type NativeButtonVariant,
} from "./button-shared";
import { useKernPress } from "./presentation";
import { StateLayer } from "./state-layer";

export type NativePulseButtonVariant = NativeButtonVariant;
export type NativePulseButtonColor = NativeButtonColor;
export type NativePulseButtonSize = NativeButtonSize;
export type NativePulseButtonShape = NativeButtonShape;
export type NativePulseButtonIconPosition = NativeButtonIconPosition;

export type NativePulseButtonProps = Omit<PressableProps, "children"> & {
  variant?: NativePulseButtonVariant;
  color?: NativePulseButtonColor;
  size?: NativePulseButtonSize;
  shape?: NativePulseButtonShape;
  block?: boolean;
  /** Shape-stable toggle mode: binary selection while borderRadius stays locked. */
  toggle?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  softDisabled?: boolean;
  flipIcon?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: NativePulseButtonIconPosition;
  /** Optional haptic hook fired on pressIn / pressOut. */
  onHaptic?: (phase: "pressIn" | "pressOut") => void;
  /** Disables spring scale motion when reduced motion is preferred. */
  reducedMotion?: boolean;
  children?: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
};

/**
 * Shape-stable style resolver for `PulseButton`. Delegates to `buttonStyles`
 * from `button-shared.ts` (D1024 C1) with `morphCorners: false` so `borderRadius`
 * never mutates on press or toggle.
 */
export function pulseButtonStyles(
  variant: NativePulseButtonVariant,
  size: NativePulseButtonSize,
  disabled: boolean,
  theme = defaultScheme(),
  options: NativeButtonStyleOptions & NativeButtonToggleOptions = {},
): { container: ViewStyle; label: TextStyle } {
  return buttonStyles(variant, size, disabled, theme, {
    ...options,
    morphCorners: false,
  });
}

/**
 * Native `PulseButton` — Kern's shape-stable animated button.
 *
 * Shares all variant/color/size/shape token tables with `Button` via
 * `button-shared.ts` (D1024 C1) and drives press scale using
 * `buttonSpringConfig("pressIn" | "pressOut")` from `@xoroh/kern-tokens` (D1024 C4).
 */
export function PulseButton({
  variant = "filled",
  color = "primary",
  size = "default",
  shape = "pill",
  block = false,
  toggle = false,
  pressed,
  defaultPressed = false,
  onPressedChange,
  softDisabled = false,
  flipIcon = false,
  loading = false,
  icon,
  iconPosition = "start",
  onHaptic,
  reducedMotion = false,
  disabled,
  children,
  onPress,
  onPressIn,
  onPressOut,
  style,
  labelStyle,
  testID,
  ...props
}: NativePulseButtonProps) {
  const { scheme } = useKernTheme();
  const press = useKernPress();
  const blocked = Boolean(disabled) || loading || softDisabled;
  const [uncontrolledPressed, setUncontrolledPressed] =
    useState(defaultPressed);
  const isPressed =
    toggle && variant !== "text" ? (pressed ?? uncontrolledPressed) : false;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (process.env.NODE_ENV !== "production" && toggle && variant === "text") {
    console.warn(
      'PulseButton: M3 does not define a toggle text button (`variant="text"` with `toggle`). Use `filled`, `tonal`, `elevated`, or `outlined`.',
    );
  }

  const styles = pulseButtonStyles(variant, size, blocked, scheme, {
    color,
    shape,
    block,
    toggle,
    selected: isPressed,
  });

  const gestureEvent = useRef<GestureResponderEvent | null>(null);
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;
  const onPressedChangeRef = useRef(onPressedChange);
  onPressedChangeRef.current = onPressedChange;
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;

  const inkColor = String(styles.label.color ?? scheme.color.onPrimary);
  const lockedRadius = Number(
    styles.container.borderRadius ?? Number.parseFloat(scheme.shape.full),
  );

  const iconSlot = isValidElement<{ style?: StyleProp<TextStyle> }>(icon)
    ? cloneElement(
        icon,
        mergeSlotProps<SlotProps>(
          {
            style: {
              color: styles.label.color,
              opacity: styles.label.opacity,
              ...(flipIcon && I18nManager.isRTL
                ? { transform: [{ scaleX: -1 }] }
                : null),
            },
          },
          icon.props,
        ),
      )
    : (icon ?? null);

  const hitSlop =
    size === "xs"
      ? 10
      : size === "sm"
        ? 8
        : size === "md" ||
            size === "xl" ||
            size === "lg" ||
            size === "2xl" ||
            size === "3xl"
          ? 0
          : 4;

  const animatePress = (phase: "pressIn" | "pressOut") => {
    if (blockedRef.current) return;
    onHaptic?.(phase);
    if (reducedMotion) return;
    const spring = buttonSpringConfig(phase);
    Animated.spring(scaleAnim, {
      toValue: phase === "pressIn" ? 0.97 : 1,
      stiffness: spring.stiffness,
      damping: spring.damping,
      mass: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AxisButton
      testID={testID ?? "kern-pulse-button"}
      disabled={blocked}
      loading={loading}
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      onPress={() => {
        if (!blockedRef.current) {
          if (toggle && variant !== "text" && pressed === undefined)
            setUncontrolledPressed(!isPressed);
          if (toggle && variant !== "text")
            onPressedChangeRef.current?.(!isPressed);
          onPressRef.current?.(
            gestureEvent.current ?? ({} as GestureResponderEvent),
          );
        }
      }}
      render={(axisProps) => (
        <Animated.View
          style={[
            block ? { alignSelf: "stretch" as const } : undefined,
            !reducedMotion ? { transform: [{ scale: scaleAnim }] } : undefined,
          ]}
        >
          <Pressable
            {...props}
            {...axisProps}
            role="button"
            accessibilityRole="button"
            aria-disabled={blocked || undefined}
            aria-busy={loading || undefined}
            aria-pressed={toggle ? isPressed : undefined}
            disabled={Boolean(disabled) || loading}
            hitSlop={hitSlop}
            android_ripple={{
              color: `${inkColor}20`,
              borderless: size === "icon",
            }}
            onPressIn={(event: GestureResponderEvent) => {
              gestureEvent.current = event;
              animatePress("pressIn");
              press.onPressIn();
              onPressIn?.(event);
            }}
            onPressOut={(event: GestureResponderEvent) => {
              animatePress("pressOut");
              press.onPressOut();
              onPressOut?.(event);
            }}
            onPress={(event?: GestureResponderEvent) => {
              if (event) gestureEvent.current = event;
              if (!blockedRef.current) {
                press.onPress();
                if (!press.pressed) {
                  if (toggle && variant !== "text" && pressed === undefined)
                    setUncontrolledPressed(!isPressed);
                  if (toggle && variant !== "text")
                    onPressedChangeRef.current?.(!isPressed);
                  onPressRef.current?.(
                    event ??
                      gestureEvent.current ??
                      ({} as GestureResponderEvent),
                  );
                }
              }
            }}
            style={({ pressed: pressedNow }) => [
              styles.container,
              typeof style === "function"
                ? style({ pressed: pressedNow })
                : style,
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={inkColor} />
            ) : null}
            {iconPosition === "start" ? iconSlot : null}
            {typeof children === "string" || typeof children === "number" ? (
              <Text style={[styles.label, labelStyle]}>{children}</Text>
            ) : (
              children
            )}
            {iconPosition === "end" ? iconSlot : null}
            <StateLayer
              ink={inkColor}
              radius={lockedRadius}
              visible={press.pressed && !blocked}
            />
          </Pressable>
        </Animated.View>
      )}
    />
  );
}

export { BUTTON_SPRING_TOKENS, buttonSpringConfig };
