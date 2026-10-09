import { type ResolvedTheme, resolveThemeDetails } from "@xoroh/kern-tokens";
import type { LoadingIndicatorStyle } from "@xoroh/kern-tokens";
import { mergeSlotProps, type SlotProps } from "@xoroh/kern-primitives";
import { cloneElement, isValidElement, useRef } from "react";
import type { ReactNode } from "react";
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useKernTheme } from "../theme";
import { CircularProgress } from "./circular-progress";
import { useKernPress } from "./presentation";

// M3: elevated, filled, tonal, outlined, text (m3.material.io/components/buttons/overview).
// Mirrors the web union exactly — the variant law requires one MEANING, not one name count.
export type NativeButtonVariant =
  | "elevated"
  | "primary"
  | "tonal"
  | "outlined"
  | "ghost";
export type NativeButtonSize = "xs" | "default" | "sm" | "xl" | "icon";

/** The color axis, mirroring web: M3 emphasis or the error treatment. */
export type NativeButtonColor = "primary" | "danger";

/** The shape axis, mirroring web: M3 pill, stepped-down corner, or none. */
export type NativeButtonShape = "pill" | "rounded" | "square";

/** Which side of the label the `icon` slot renders on. */
export type NativeButtonIconPosition = "start" | "end";

/**
 * R2 variant map, re-homed (T1): M3 names as aliases onto the Kern styles.
 * `filled`/`text` resolve to existing styles — no new visuals. `elevated`
 * already exists here, so it is not an alias. Exhaustive Record — new M3
 * names break typecheck here.
 */
export type NativeButtonM3Variant = "filled" | "text";
export const NATIVE_BUTTON_VARIANT_ALIASES: Record<
  NativeButtonM3Variant,
  NativeButtonVariant
> = {
  filled: "primary",
  text: "ghost",
};

/** Accepted variant prop: Kern names or M3 aliases (normalized internally). */
export type NativeButtonVariantInput =
  | NativeButtonVariant
  | NativeButtonM3Variant;

/**
 * R2 size foundation, re-homed (T1): Button sizes onto `KernSize`.
 * `default` renders at md metrics, `sm` is `sm`; `xs` compacts inside the
 * `sm` band and `xl` steps into `lg`. `icon` is shape, not scale, and is
 * intentionally absent — same rule as the platform source.
 */
export const NATIVE_BUTTON_SIZE_TO_KERN_SIZE = {
  xs: "sm",
  default: "md",
  sm: "sm",
  xl: "lg",
} as const;

const HEIGHTS: Record<NativeButtonSize, number> = {
  xs: 28,
  default: 40,
  sm: 32,
  xl: 48,
  icon: 40,
};

const PADDING_HORIZONTAL: Record<NativeButtonSize, number> = {
  xs: 12,
  default: 16,
  sm: 16,
  xl: 24,
  icon: 0,
};

const LABEL_FONT_SIZE: Record<NativeButtonSize, number> = {
  xs: 12,
  default: 14,
  sm: 13,
  xl: 16,
  icon: 14,
};

/** Static treatment options, so positional callers keep working. */
export type NativeButtonStyleOptions = {
  color?: NativeButtonColor;
  shape?: NativeButtonShape;
  block?: boolean;
};

export function buttonStyles(
  variant: NativeButtonVariant,
  size: NativeButtonSize,
  disabled: boolean,
  theme: ResolvedTheme = resolveThemeDetails(),
  options: NativeButtonStyleOptions = {},
): { container: ViewStyle; label: TextStyle } {
  const { color = "primary", shape = "pill", block = false } = options;
  const danger = color === "danger";
  const container: ViewStyle = {
    height: HEIGHTS[size],
    minWidth: size === "icon" ? HEIGHTS[size] : 64,
    borderRadius:
      shape === "pill"
        ? Number.parseFloat(theme.shape.full)
        : shape === "rounded"
          ? Number.parseFloat(theme.shape.large)
          : Number.parseFloat(theme.shape.none),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // The 8dp M3 icon spacing, always on: a lone label never feels it, and
    // an icon beside a label always gets it — same rule as web's flex gap.
    gap: 8,
    paddingHorizontal: PADDING_HORIZONTAL[size],
    backgroundColor: danger
      ? variant === "primary"
        ? theme.color.error
        : variant === "tonal"
          ? theme.color.errorContainer
          : variant === "elevated"
            ? theme.color.surfaceContainerLow
            : "transparent"
      : variant === "primary"
        ? theme.color.primary
        : variant === "tonal"
          ? theme.color.secondaryContainer
          : variant === "elevated"
            ? theme.color.surfaceContainerLow
            : "transparent",
    borderWidth: variant === "outlined" ? 1 : 0,
    borderColor:
      variant === "outlined"
        ? danger
          ? theme.color.error
          : theme.color.outline
        : "transparent",
    opacity: disabled ? 0.5 : 1,
    ...(block ? { alignSelf: "stretch" as const } : null),
  };
  const label: TextStyle = {
    fontSize: LABEL_FONT_SIZE[size],
    fontWeight: "500",
    color: danger
      ? variant === "primary"
        ? theme.color.onError
        : variant === "tonal"
          ? theme.color.onErrorContainer
          : theme.color.error
      : variant === "primary"
        ? theme.color.onPrimary
        : variant === "tonal"
          ? theme.color.onSecondaryContainer
          : variant === "elevated" ||
              variant === "outlined" ||
              variant === "ghost"
            ? theme.color.primary
            : theme.color.onSurface,
  };
  return { container, label };
}

export type NativeButtonProps = Omit<
  PressableProps,
  "onPress" | "accessibilityRole" | "accessibilityState"
> & {
  variant?: NativeButtonVariantInput;
  size?: NativeButtonSize;
  color?: NativeButtonColor;
  shape?: NativeButtonShape;
  /** Full-width block button. */
  block?: boolean;
  /** Shows the embedded progress indicator and blocks interaction. */
  loading?: boolean;
  /** 0–1 determinate progress while loading. Omit for the loop. */
  loadingValue?: number;
  /** Style of the embedded indicator. Defaults to the M3 ring (`spinner`). */
  loaderStyle?: LoadingIndicatorStyle;
  /** Leading (or trailing, with `iconPosition`) icon. */
  icon?: ReactNode;
  iconPosition?: NativeButtonIconPosition;
  children: ReactNode;
  onPress?: PressableProps["onPress"];
  style?: PressableProps["style"];
  labelStyle?: StyleProp<TextStyle>;
};

export function Button({
  variant: variantInput = "primary",
  size = "default",
  color = "primary",
  shape = "pill",
  block = false,
  loading = false,
  loadingValue,
  loaderStyle,
  icon,
  iconPosition = "start",
  children,
  onPress,
  style,
  labelStyle,
  disabled,
  testID,
  ...props
}: NativeButtonProps) {
  const { scheme } = useKernTheme();
  // M3 aliases normalize to Kern names once, here — buttonStyles and the
  // ripple below only ever see Kern names, so rendering cannot change.
  const variant: NativeButtonVariant =
    variantInput in NATIVE_BUTTON_VARIANT_ALIASES
      ? NATIVE_BUTTON_VARIANT_ALIASES[variantInput as NativeButtonM3Variant]
      : (variantInput as NativeButtonVariant);
  const blocked = Boolean(disabled) || loading;
  const styles = buttonStyles(variant, size, blocked, scheme, {
    color,
    shape,
    block,
  });
  // G8: press reporting routes through the kernel model. useKernPress binds
  // usePress to the gesture trio; the binder's onPress is wired INSTEAD of
  // the consumer's (the one rule). The consumer keeps its
  // GestureResponderEvent contract via the captured gesture event, and live
  // refs defeat the mount-once options capture (usePress reads options at
  // mount; the wrapper below always reads current values).
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const gestureEvent = useRef<GestureResponderEvent | null>(null);
  const press = useKernPress({
    disabled: blocked,
    onPress: () => {
      if (!blockedRef.current && gestureEvent.current)
        onPressRef.current?.(gestureEvent.current);
    },
  });
  // Icon order, not margin — `iconPosition` only chooses which side renders
  // first, so the pair flips automatically under RTL with no insets.
  // G8: the icon slot merges through the kernel (mergeSlotProps). Part props
  // contribute the label color; the consumer's own props win per key — a bare
  // icon tints with the label, an explicitly-colored icon is untouched.
  const iconSlot = isValidElement<{ style?: StyleProp<TextStyle> }>(icon)
    ? cloneElement(
        icon,
        mergeSlotProps<SlotProps>(
          { style: { color: styles.label.color } },
          icon.props,
        ),
      )
    : (icon ?? null);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-button"}
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading || undefined }}
      disabled={blocked}
      hitSlop={size === "xs" ? 10 : size === "sm" ? 8 : size === "xl" ? 0 : 4}
      android_ripple={{
        color: `${variant === "primary" ? scheme.color.onPrimary : scheme.color.onSurface}20`,
        borderless: size === "icon",
      }}
      onPressIn={(event: GestureResponderEvent) => {
        gestureEvent.current = event;
        press.onPressIn();
      }}
      onPressOut={press.onPressOut}
      onPress={press.onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && !blocked ? { opacity: 0.82 } : undefined,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {loading ? (
        <CircularProgress
          value={loadingValue}
          loaderStyle={loaderStyle}
          size="sm"
          label="Loading"
          color={
            color === "danger"
              ? variant === "primary"
                ? scheme.color.onError
                : scheme.color.error
              : variant === "primary"
                ? scheme.color.onPrimary
                : scheme.color.onSurface
          }
        />
      ) : null}
      {iconPosition === "start" ? iconSlot : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.label, labelStyle]}>{children}</Text>
      ) : (
        children
      )}
      {iconPosition === "end" ? iconSlot : null}
    </Pressable>
  );
}
