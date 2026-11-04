import {
  BUTTON_SPRING_TOKENS,
  buttonSpringConfig,
  cssLengthToDp,
  type ResolvedTheme,
} from "@xoroh/kern-tokens";
import type { TextStyle, ViewStyle } from "react-native";
import { defaultScheme } from "../theme";

// M3: elevated, filled, tonal, outlined, text (m3.material.io/components/buttons/overview).
// Mirrors the web union exactly — one name per variant on both renderers (014, hard cut per 020).
export type NativeButtonVariant =
  | "elevated"
  | "filled"
  | "tonal"
  | "outlined"
  | "text";

export type NativeButtonSize =
  | "xs"
  | "sm"
  | "default"
  | "md"
  | "xl"
  | "lg"
  | "2xl"
  | "3xl"
  | "icon";

/** The color axis, mirroring web: M3 emphasis or the error treatment. */
export type NativeButtonColor = "primary" | "danger";

/** The shape axis, mirroring web: M3 pill, stepped-down corner, or square. */
export type NativeButtonShape = "pill" | "rounded" | "square";

/** Which side of the label the `icon` slot renders on. */
export type NativeButtonIconPosition = "start" | "end";

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

/**
 * Canonical M3 Expressive 5-step size ladder (D1024 C2) mapped to NativeButtonSize keys.
 */
export const NATIVE_BUTTON_EXPRESSIVE_SIZE_LADDER = {
  XS: {
    heightDp: 32,
    squareCornerDp: 12,
    pressedCornerDp: 8,
    kernSizes: ["xs", "sm"] as const,
  },
  S: {
    heightDp: 40,
    squareCornerDp: 12,
    pressedCornerDp: 8,
    kernSizes: ["default"] as const,
  },
  M: {
    heightDp: 56,
    squareCornerDp: 16,
    pressedCornerDp: 12,
    kernSizes: ["md", "xl"] as const,
  },
  L: {
    heightDp: 96,
    squareCornerDp: 28,
    pressedCornerDp: 16,
    kernSizes: ["lg", "2xl"] as const,
  },
  XL: {
    heightDp: 136,
    squareCornerDp: 28,
    pressedCornerDp: 16,
    kernSizes: ["3xl"] as const,
  },
} as const;

export const NATIVE_BUTTON_HEIGHTS: Record<NativeButtonSize, number> = {
  xs: 28,
  sm: 32,
  default: 40,
  md: 56,
  xl: 48,
  lg: 64,
  "2xl": 96,
  "3xl": 136,
  icon: 40,
};

export const NATIVE_BUTTON_PADDING_HORIZONTAL: Record<
  NativeButtonSize,
  number
> = {
  xs: 12,
  sm: 16,
  default: 16,
  md: 24,
  xl: 24,
  lg: 32,
  "2xl": 48,
  "3xl": 64,
  icon: 0,
};

export const NATIVE_BUTTON_LABEL_FONT_SIZE: Record<NativeButtonSize, number> = {
  xs: 12,
  sm: 13,
  default: 14,
  md: 16,
  xl: 16,
  lg: 18,
  "2xl": 24,
  "3xl": 32,
  icon: 14,
};

export const NATIVE_BUTTON_SQUARE_RADIUS: Record<NativeButtonSize, number> = {
  xs: 12,
  sm: 12,
  default: 12,
  md: 16,
  xl: 16,
  lg: 16,
  "2xl": 28,
  "3xl": 28,
  icon: 12,
};

export const NATIVE_BUTTON_PRESSED_RADIUS: Record<NativeButtonSize, number> = {
  xs: 8,
  sm: 8,
  default: 8,
  md: 12,
  xl: 12,
  lg: 12,
  "2xl": 16,
  "3xl": 16,
  icon: 8,
};

/**
 * Shared spring token reader from `@xoroh/kern-tokens` (D1024 C4).
 * Both `Button` and `PulseButton` read their spring physics from here.
 */
export { BUTTON_SPRING_TOKENS, buttonSpringConfig };

/** Static treatment options, so positional callers keep working. */
export type NativeButtonStyleOptions = {
  color?: NativeButtonColor;
  shape?: NativeButtonShape;
  block?: boolean;
  /** Whether the button is actively pressed right now (for M3 Expressive press corner morph). */
  pressed?: boolean;
  /** When false (e.g. PulseButton), corner radius stays locked on press and toggle. */
  morphCorners?: boolean;
};

export type NativeButtonToggleOptions = {
  /** M3 Expressive toggle mode. No toggle text button — text renders unselected. */
  toggle?: boolean;
  /** Selected state. Only meaningful with `toggle`. */
  selected?: boolean;
};

/**
 * Append an alpha channel to a 6-digit hex color (`#RRGGBB` → `#RRGGBBAA`).
 * Non-hex colors pass through untouched. Used for the M3 disabled split
 * (container 12%, label 38%) without a container `opacity` that would also
 * dim the label.
 */
export function withAlpha(color: string, alpha: number): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const byte = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${byte}`;
  }
  return color;
}

export function buttonStyles(
  variant: NativeButtonVariant,
  size: NativeButtonSize,
  disabled: boolean,
  theme: ResolvedTheme = defaultScheme(),
  options: NativeButtonStyleOptions & NativeButtonToggleOptions = {},
): { container: ViewStyle; label: TextStyle } {
  const {
    color = "primary",
    shape = "pill",
    block = false,
    toggle = false,
    selected = false,
    pressed = false,
    morphCorners = true,
  } = options;
  const toggled = toggle && selected && variant !== "text";
  const toggleUnselected = toggle && !selected && variant !== "text";
  const danger = color === "danger";
  const hasFill =
    variant === "filled" || variant === "tonal" || variant === "elevated";
  const squareRadius = NATIVE_BUTTON_SQUARE_RADIUS[size];
  const pressedRadius = NATIVE_BUTTON_PRESSED_RADIUS[size];
  const pillRadius = cssLengthToDp(
    theme.comp?.["button-container-shape"],
    Number.parseFloat(theme.shape.full),
  );

  const restingRadius =
    shape === "pill"
      ? morphCorners && toggled
        ? squareRadius
        : pillRadius
      : shape === "rounded"
        ? Number.parseFloat(theme.shape.large)
        : morphCorners && toggled
          ? pillRadius
          : squareRadius;

  const activeRadius =
    morphCorners && pressed && !disabled ? pressedRadius : restingRadius;

  const gap = size === "2xl" ? 12 : size === "3xl" ? 16 : 8;

  const container: ViewStyle = {
    height: NATIVE_BUTTON_HEIGHTS[size],
    minWidth: size === "icon" ? NATIVE_BUTTON_HEIGHTS[size] : 64,
    borderRadius: activeRadius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap,
    paddingHorizontal: NATIVE_BUTTON_PADDING_HORIZONTAL[size],
    backgroundColor: disabled
      ? hasFill || toggled
        ? withAlpha(theme.color.onSurface, 0.12)
        : "transparent"
      : danger
        ? variant === "filled"
          ? theme.color.error
          : variant === "tonal"
            ? theme.color.errorContainer
            : variant === "elevated"
              ? theme.color.surfaceContainerLow
              : "transparent"
        : toggled
          ? variant === "elevated"
            ? theme.color.primary
            : variant === "filled"
              ? theme.color.primary
              : variant === "tonal"
                ? theme.color.secondary
                : theme.color.inverseSurface
          : toggleUnselected && variant === "filled"
            ? theme.color.surfaceContainer
            : variant === "filled"
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
            : toggleUnselected
              ? theme.color.outlineVariant
              : theme.color.outline
        : "transparent",
    ...(block ? { alignSelf: "stretch" as const } : null),
  };

  const labelFontSize = NATIVE_BUTTON_LABEL_FONT_SIZE[size];
  const label: TextStyle = {
    fontSize: labelFontSize,
    lineHeight: Math.round(labelFontSize * 1.43),
    letterSpacing: 0.1,
    fontWeight: "500",
    opacity: disabled ? 0.38 : 1,
    color: disabled
      ? theme.color.onSurface
      : danger
        ? variant === "filled"
          ? theme.color.onError
          : variant === "tonal"
            ? theme.color.onErrorContainer
            : theme.color.error
        : toggled
          ? variant === "elevated"
            ? theme.color.onPrimary
            : variant === "filled"
              ? theme.color.onPrimary
              : variant === "tonal"
                ? theme.color.onSecondary
                : theme.color.inverseOnSurface
          : toggleUnselected && variant === "filled"
            ? theme.color.onSurfaceVariant
            : toggleUnselected && variant === "outlined"
              ? theme.color.onSurfaceVariant
              : variant === "filled"
                ? theme.color.onPrimary
                : variant === "tonal"
                  ? theme.color.onSecondaryContainer
                  : variant === "elevated"
                    ? theme.color.primary
                    : variant === "outlined"
                      ? theme.color.onSurfaceVariant
                      : theme.color.primary,
  };
  return { container, label };
}
