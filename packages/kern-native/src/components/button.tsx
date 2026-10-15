import {
  type ResolvedTheme,
  resolveThemeDetails,
} from "@xoroh/kern-tokens";
import type { LoadingIndicatorStyle } from "@xoroh/kern-material-3";
import { mergeSlotProps, type SlotProps } from "@xoroh/kern-primitives";
import { cloneElement, isValidElement, useRef, useState } from "react";
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

/**
 * Append an alpha channel to a 6-digit hex color (`#RRGGBB` → `#RRGGBBAA`).
 * Non-hex colors pass through untouched. Used for the M3 disabled split
 * (container 12%, label 38%) without a container `opacity` that would also
 * dim the label — the wash lives in the color itself, matching
 * react-native-paper's overlay approach without restructuring the tree.
 */
function withAlpha(color: string, alpha: number): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const byte = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${byte}`;
  }
  return color;
}

export type NativeButtonToggleOptions = {
  /** M3 Expressive toggle mode. No toggle text button — ghost renders unselected. */
  toggle?: boolean;
  /** Selected state. Only meaningful with `toggle`. */
  selected?: boolean;
};

export function buttonStyles(
  variant: NativeButtonVariant,
  size: NativeButtonSize,
  disabled: boolean,
  theme: ResolvedTheme = resolveThemeDetails(),
  options: NativeButtonStyleOptions & NativeButtonToggleOptions = {},
): { container: ViewStyle; label: TextStyle } {
  const {
    color = "primary",
    shape = "pill",
    block = false,
    toggle = false,
    selected = false,
  } = options;
  const toggled = toggle && selected && variant !== "ghost";
  const toggleUnselected =
    toggle && !selected && variant !== "ghost";
  const danger = color === "danger";
  const hasFill =
    variant === "primary" || variant === "tonal" || variant === "elevated";
  // M3 Expressive square radii per size (12/12/12/16); selected toggles
  // morph pill to square, square back to pill.
  const squareRadius = size === "xl" ? 16 : 12;
  const container: ViewStyle = {
    height: HEIGHTS[size],
    minWidth: size === "icon" ? HEIGHTS[size] : 64,
    borderRadius:
      shape === "pill"
        ? toggled
          ? squareRadius
          : Number.parseFloat(theme.shape.full)
        : shape === "rounded"
          ? Number.parseFloat(theme.shape.large)
          : toggled
            ? Number.parseFloat(theme.shape.full)
            : squareRadius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // The 8dp M3 icon spacing, always on: a lone label never feels it, and
    // an icon beside a label always gets it — same rule as web's flex gap.
    gap: 8,
    paddingHorizontal: PADDING_HORIZONTAL[size],
    backgroundColor: disabled
      ? hasFill || toggled
        ? withAlpha(theme.color.onSurface, 0.12)
        : "transparent"
      : danger
        ? variant === "primary"
          ? theme.color.error
          : variant === "tonal"
            ? theme.color.errorContainer
            : variant === "elevated"
              ? theme.color.surfaceContainerLow
              : "transparent"
        : toggled
          ? variant === "elevated"
            ? theme.color.primary
            : variant === "primary"
              ? theme.color.primary
              : variant === "tonal"
                ? theme.color.secondary
                : theme.color.inverseSurface
          : toggleUnselected && variant === "primary"
            ? theme.color.surfaceContainer
            : variant === "primary"
              ? theme.color.primary
              : variant === "tonal"
                ? theme.color.secondaryContainer
                : variant === "elevated"
                  ? theme.color.surfaceContainerLow
                  : "transparent",
    borderWidth: variant === "outlined" && !toggled ? 1 : 0,
    borderColor:
      variant === "outlined" && !toggled
        ? disabled
          ? withAlpha(theme.color.onSurface, 0.12)
          : danger
            ? theme.color.error
            : theme.color.outline
        : "transparent",
    ...(block ? { alignSelf: "stretch" as const } : null),
  };
  // M3 label-large: 14px/20px, tracking 0.1px, weight 500. Line height
  // scales with size (1.43x); letter spacing holds at 0.1px. Disabled labels
  // dim to 38% on the text itself (the container carries no opacity, so the
  // two washes never compound).
  const labelFontSize = LABEL_FONT_SIZE[size];
  const label: TextStyle = {
    fontSize: labelFontSize,
    lineHeight: Math.round(labelFontSize * 1.43),
    letterSpacing: 0.1,
    fontWeight: "500",
    opacity: disabled ? 0.38 : 1,
    color: disabled
      ? theme.color.onSurface
      : danger
        ? variant === "primary"
          ? theme.color.onError
          : variant === "tonal"
            ? theme.color.onErrorContainer
            : theme.color.error
        : toggled
          ? variant === "elevated"
            ? theme.color.onPrimary
            : variant === "primary"
              ? theme.color.onPrimary
              : variant === "tonal"
                ? theme.color.onSecondary
                : theme.color.inverseOnSurface
          : toggleUnselected && variant === "primary"
            ? theme.color.onSurfaceVariant
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
  /**
   * Renders an M3 Expressive toggle: binary selection with round-to-square
   * morph and per-variant selected colors. No toggle text button — `ghost`
   * renders unselected.
   */
  toggle?: boolean;
  /** Controlled selected state. Only meaningful with `toggle`. */
  pressed?: boolean;
  /** Initial selected state for the uncontrolled toggle case. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
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
  toggle = false,
  pressed,
  defaultPressed = false,
  onPressedChange,
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
  const [uncontrolledPressed, setUncontrolledPressed] =
    useState(defaultPressed);
  const isPressed =
    toggle && pressed !== undefined
      ? pressed
      : toggle
        ? uncontrolledPressed
        : false;
  const styles = buttonStyles(variant, size, blocked, scheme, {
    color,
    shape,
    block,
    toggle,
    selected: isPressed,
  });
  // G8: press reporting routes through the kernel model. useKernPress binds
  // usePress to the gesture trio; the binder's onPress is wired INSTEAD of
  // the consumer's (the one rule). The consumer keeps its
  // GestureResponderEvent contract via the captured gesture event, and live
  // refs defeat the mount-once options capture (usePress reads options at
  // mount; the wrapper below always reads current values). A press dispatch
  // without a preceding pressIn (synthetic events, assistive tech) falls back
  // to the press event itself so the tap is never swallowed.
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;
  const onPressedChangeRef = useRef(onPressedChange);
  onPressedChangeRef.current = onPressedChange;
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const gestureEvent = useRef<GestureResponderEvent | null>(null);
  const press = useKernPress({
    disabled: blocked,
    onPress: () => {
      if (!blockedRef.current && gestureEvent.current) {
        if (toggle && pressed === undefined)
          setUncontrolledPressed(!isPressed);
        if (toggle) onPressedChangeRef.current?.(!isPressed);
        onPressRef.current?.(gestureEvent.current);
      }
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
          {
            style: {
              color: styles.label.color,
              opacity: styles.label.opacity,
            },
          },
          icon.props,
        ),
      )
    : (icon ?? null);
  return (
    <Pressable
      {...props}
      testID={testID ?? "kern-button"}
      accessibilityRole="button"
      accessibilityState={{
        disabled: blocked,
        busy: loading || undefined,
        selected: toggle ? isPressed : undefined,
      }}
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
      onPress={(event: GestureResponderEvent) => {
        if (!gestureEvent.current) gestureEvent.current = event;
        press.onPress();
      }}
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
