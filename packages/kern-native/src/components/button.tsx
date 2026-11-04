import {
  Button as AxisButton,
  mergeSlotProps,
  type SlotProps,
} from "@xoroh/axis";
import type { LoadingIndicatorStyle } from "@xoroh/kern-m3";
import type { ReactNode } from "react";
import { cloneElement, isValidElement, useRef, useState } from "react";
import {
  type GestureResponderEvent,
  I18nManager,
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import {
  BUTTON_SPRING_TOKENS,
  buttonSpringConfig,
  buttonStyles,
  NATIVE_BUTTON_EXPRESSIVE_SIZE_LADDER,
  NATIVE_BUTTON_SIZE_TO_KERN_SIZE,
  type NativeButtonColor,
  type NativeButtonIconPosition,
  type NativeButtonShape,
  type NativeButtonSize,
  type NativeButtonStyleOptions,
  type NativeButtonToggleOptions,
  type NativeButtonVariant,
} from "./button-shared";
import { CircularProgress } from "./circular-progress";
import { useKernPress } from "./presentation";
import { StateLayer } from "./state-layer";

export {
  BUTTON_SPRING_TOKENS,
  buttonSpringConfig,
  buttonStyles,
  NATIVE_BUTTON_EXPRESSIVE_SIZE_LADDER,
  NATIVE_BUTTON_SIZE_TO_KERN_SIZE,
  type NativeButtonColor,
  type NativeButtonIconPosition,
  type NativeButtonShape,
  type NativeButtonSize,
  type NativeButtonStyleOptions,
  type NativeButtonToggleOptions,
  type NativeButtonVariant,
};

export type NativeButtonProps = Omit<PressableProps, "children"> & {
  variant?: NativeButtonVariant;
  color?: NativeButtonColor;
  size?: NativeButtonSize;
  shape?: NativeButtonShape;
  block?: boolean;
  /** M3 Expressive toggle mode. No toggle text button — `text` renders unselected. */
  toggle?: boolean;
  /** Controlled selected state. Only meaningful with `toggle`. */
  pressed?: boolean;
  /** Initial selected state for the uncontrolled toggle case. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Soft-disabled: paints the disabled treatment and reports `aria-disabled`,
   * while keeping focus/discoverability in toolbars.
   */
  softDisabled?: boolean;
  /** Mirrors the icon horizontally in RTL contexts (`scaleX: -1`). */
  flipIcon?: boolean;
  loading?: boolean;
  /** 0–1 determinate progress while loading. Omit for the loop. */
  loadingValue?: number;
  /** Style of the embedded indicator. Defaults to the M3 ring (`spinner`). */
  loaderStyle?: LoadingIndicatorStyle;
  /**
   * Icon rendered beside the label, separated by the 8dp M3 spacing.
   * For icon-only buttons, pass the icon as `children` with `size="icon"`
   * and an `aria-label`.
   */
  icon?: ReactNode;
  iconPosition?: NativeButtonIconPosition;
  children?: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
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
  loadingValue,
  loaderStyle,
  icon,
  iconPosition = "start",
  disabled,
  children,
  onPress,
  style,
  labelStyle,
  testID,
  ...props
}: NativeButtonProps) {
  const { scheme } = useKernTheme();
  const press = useKernPress();
  const blocked = Boolean(disabled) || loading || softDisabled;
  const [uncontrolledPressed, setUncontrolledPressed] =
    useState(defaultPressed);
  const isPressed =
    toggle && variant !== "text" ? (pressed ?? uncontrolledPressed) : false;

  if (process.env.NODE_ENV !== "production" && toggle && variant === "text") {
    console.warn(
      'Button: M3 does not define a toggle text button (`variant="text"` with `toggle`). Use `filled`, `tonal`, `elevated`, or `outlined`.',
    );
  }

  const styles = buttonStyles(variant, size, blocked, scheme, {
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

  return (
    <AxisButton
      testID={testID ?? "kern-button"}
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
            press.onPressIn();
          }}
          onPressOut={press.onPressOut}
          onPress={(event?: GestureResponderEvent) => {
            if (event) gestureEvent.current = event;
            if (!blockedRef.current) {
              press.onPress();
              // RNTL fireEvent.press triggers Pressable.onPress directly without onPressIn
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
          style={({ pressed: pressedNow }) => {
            const activeStyles =
              pressedNow && !blocked
                ? buttonStyles(variant, size, blocked, scheme, {
                    color,
                    shape,
                    block,
                    toggle,
                    selected: isPressed,
                    pressed: true,
                  })
                : styles;
            return [
              activeStyles.container,
              typeof style === "function"
                ? style({ pressed: pressedNow })
                : style,
            ];
          }}
        >
          {({ pressed: pressedNow }) => {
            const activeContainer =
              pressedNow && !blocked
                ? buttonStyles(variant, size, blocked, scheme, {
                    color,
                    shape,
                    block,
                    toggle,
                    selected: isPressed,
                    pressed: true,
                  }).container
                : styles.container;
            const currentRadius = Number(
              activeContainer.borderRadius ??
                Number.parseFloat(scheme.shape.full),
            );
            return (
              <>
                {loading ? (
                  <CircularProgress
                    value={loadingValue}
                    loaderStyle={loaderStyle}
                    size="sm"
                    label="Loading"
                    color={inkColor}
                  />
                ) : null}
                {iconPosition === "start" ? iconSlot : null}
                {typeof children === "string" ||
                typeof children === "number" ? (
                  <Text style={[styles.label, labelStyle]}>{children}</Text>
                ) : (
                  children
                )}
                {iconPosition === "end" ? iconSlot : null}
                <StateLayer
                  ink={inkColor}
                  radius={currentRadius}
                  visible={pressedNow && !blocked}
                />
              </>
            );
          }}
        </Pressable>
      )}
    />
  );
}
