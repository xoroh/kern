import { BUTTON_MOTION_CSS } from "@xoroh/kern-tokens";
import { cva } from "class-variance-authority";
import { FOCUS_RING_CLASS } from "./focus-ring";

/**
 * Shared M3 Expressive button style, size, colour, and shape system (D1024 C1/C2/C4).
 *
 * Single source of truth consumed by `Button`, `PulseButton`, `LoadingButton`,
 * and `LinkButton` on Web (`@xoroh/kern`).
 *
 * Primary M3 Sources:
 * - `androidx.compose.material3.tokens.Button{XSmall,Small,Medium,Large,XLarge}Tokens`
 * - `androidx.compose.material3.ButtonDefaults` & `ToggleButtonDefaults`
 * - `material-components/material-web` `button/internal/*.scss`
 * - `https://m3.material.io/components/buttons/specs`
 */

/**
 * Canonical M3 Expressive 5-tier size ladder + Kern density steps, ordered
 * strictly by ascending container height (D1024 C2):
 *
 * | Kern key  | Height | M3 Expressive tier | Icon | Square corner       | Pressed corner |
 * |-----------|--------|--------------------|------|---------------------|----------------|
 * | `xs`      | 28px   | Compact (< XS)     | 14px | `medium` (12px)     | `small` (8px)  |
 * | `sm`      | 32px   | **XS** (32dp)      | 20px | `medium` (12px)     | `small` (8px)  |
 * | `default` | 40px   | **S** (40dp base)  | 20px | `medium` (12px)     | `small` (8px)  |
 * | `md`      | 44px   | Stepped S+         | 20px | `large` (16px)      | `medium` (12px)|
 * | `xl`      | 48px   | Stepped M- (legacy)| 20px | `large` (16px)      | `medium` (12px)|
 * | `lg`      | 56px   | **M** (56dp)       | 24px | `extra-large` (28px)| `large` (16px) |
 * | `2xl`     | 96px   | **L** (96dp)       | 32px | `extra-large` (28px)| `large` (16px) |
 * | `3xl`     | 136px  | **XL** (136dp)     | 40px | `extra-large` (28px)| `large` (16px) |
 * | `icon`    | 40×40px| Icon-only S        | 20px | `medium` (12px)     | `small` (8px)  |
 */
export const BUTTON_EXPRESSIVE_SIZE_LADDER = {
  xs: {
    m3Tier: "compact",
    heightPx: 28,
    paddingInlinePx: 12,
    gapPx: 6,
    iconPx: 14,
    typographyRole: "label-medium",
    squareCorner: "medium",
    pressedCorner: "small",
    outlineWidthPx: 1,
  },
  sm: {
    m3Tier: "XS",
    heightPx: 32,
    paddingInlinePx: 16,
    gapPx: 8,
    iconPx: 20,
    typographyRole: "label-large",
    squareCorner: "medium",
    pressedCorner: "small",
    outlineWidthPx: 1,
  },
  default: {
    m3Tier: "S",
    heightPx: 40,
    paddingInlinePx: 16,
    gapPx: 8,
    iconPx: 20,
    typographyRole: "label-large",
    squareCorner: "medium",
    pressedCorner: "small",
    outlineWidthPx: 1,
  },
  md: {
    m3Tier: "S+",
    heightPx: 44,
    paddingInlinePx: 20,
    gapPx: 8,
    iconPx: 20,
    typographyRole: "label-large",
    squareCorner: "large",
    pressedCorner: "medium",
    outlineWidthPx: 1,
  },
  xl: {
    m3Tier: "M-",
    heightPx: 48,
    paddingInlinePx: 24,
    gapPx: 8,
    iconPx: 20,
    typographyRole: "title-medium",
    squareCorner: "large",
    pressedCorner: "medium",
    outlineWidthPx: 1,
  },
  lg: {
    m3Tier: "M",
    heightPx: 56,
    paddingInlinePx: 28,
    gapPx: 8,
    iconPx: 24,
    typographyRole: "title-medium",
    squareCorner: "extra-large",
    pressedCorner: "large",
    outlineWidthPx: 1,
  },
  "2xl": {
    m3Tier: "L",
    heightPx: 96,
    paddingInlinePx: 48,
    gapPx: 12,
    iconPx: 32,
    typographyRole: "headline-small",
    squareCorner: "extra-large",
    pressedCorner: "large",
    outlineWidthPx: 2,
  },
  "3xl": {
    m3Tier: "XL",
    heightPx: 136,
    paddingInlinePx: 64,
    gapPx: 16,
    iconPx: 40,
    typographyRole: "headline-large",
    squareCorner: "extra-large",
    pressedCorner: "large",
    outlineWidthPx: 3,
  },
  icon: {
    m3Tier: "icon",
    heightPx: 40,
    paddingInlinePx: 0,
    gapPx: 0,
    iconPx: 20,
    typographyRole: "label-large",
    squareCorner: "medium",
    pressedCorner: "small",
    outlineWidthPx: 1,
  },
} as const;

/** Ordered ascending height list of label-bearing button sizes. */
export const BUTTON_SIZES_ORDERED = [
  "xs",
  "sm",
  "default",
  "md",
  "xl",
  "lg",
  "2xl",
  "3xl",
] as const;

/**
 * R2 size foundation, re-homed (T1): Button sizes onto `KernSize`.
 * Ordered by ascending height (D1024 C2). `icon` is shape, not scale, and is
 * intentionally absent — same rule as the platform source.
 */
export const BUTTON_SIZE_TO_KERN_SIZE = {
  xs: "sm",
  default: "md",
  sm: "sm",
  md: "md",
  xl: "lg",
  lg: "lg",
} as const;

export const buttonBaseClass = `kern-button relative inline-flex min-w-16 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[var(--comp-button-container-shape,var(--sys-shape-corner-full))] text-sm leading-5 font-medium tracking-[0.1px] whitespace-nowrap transition-[color,background-color,border-color,box-shadow,border-radius] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none ${FOCUS_RING_CLASS} disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none aria-disabled:cursor-not-allowed aria-disabled:shadow-none after:absolute after:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 aria-disabled:before:opacity-0 [&_svg]:size-5 [&_svg]:shrink-0`;

export const buttonVariantClasses = {
  elevated:
    "bg-(--sys-color-surface-container-low) text-(--sys-color-primary) shadow-(--sys-elevation-level1) hover:shadow-(--sys-elevation-level2) before:bg-(--sys-color-primary) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
  filled:
    "bg-(--sys-color-primary) text-(--sys-color-on-primary) hover:shadow-(--sys-elevation-level1) before:bg-(--sys-color-on-primary) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
  tonal:
    "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) hover:shadow-(--sys-elevation-level1) before:bg-(--sys-color-on-secondary-container) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
  outlined:
    "border border-(--sys-color-outline) text-(--sys-color-primary) before:bg-(--sys-color-primary) focus-visible:border-(--sys-color-primary) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38",
  text: "text-(--sys-color-primary) before:bg-(--sys-color-primary) disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38",
} as const;

/** Base geometry per size (ascending height order: xs -> sm -> default -> md -> xl -> lg -> 2xl -> 3xl -> icon). */
export const buttonSizeBaseClasses = {
  xs: "h-7 gap-1.5 px-3 text-xs after:-inset-2.5 [&_svg]:size-3.5",
  sm: "h-8 px-4 text-[13px] after:-inset-2",
  default: "h-10 px-4 after:-inset-1",
  md: "h-11 px-5 text-[15px] after:-inset-1 [&_svg]:size-5",
  xl: "h-12 px-6 text-base after:-inset-1 [&_svg]:size-5",
  lg: "h-14 px-7 text-lg after:-inset-0.5 [&_svg]:size-6",
  "2xl":
    "h-24 gap-3 px-12 text-2xl leading-8 font-normal after:-inset-0 [&_svg]:size-8",
  "3xl":
    "h-34 gap-4 px-16 text-[32px] leading-10 font-normal after:-inset-0 [&_svg]:size-10",
  icon: "h-10 w-10 px-0 after:-inset-1",
} as const;

/** M3 Expressive press corner-morph classes (`Button` enables; `PulseButton` omits to lock silhouette). */
export const buttonPressMorphClasses = {
  xs: "active:rounded-(--sys-shape-corner-small)",
  sm: "active:rounded-(--sys-shape-corner-small)",
  default: "active:rounded-(--sys-shape-corner-small)",
  md: "active:rounded-(--sys-shape-corner-medium)",
  xl: "active:rounded-(--sys-shape-corner-medium)",
  lg: "active:rounded-(--sys-shape-corner-large)",
  "2xl": "active:rounded-(--sys-shape-corner-large)",
  "3xl": "active:rounded-(--sys-shape-corner-large)",
  icon: "active:rounded-(--sys-shape-corner-small)",
} as const;

export const buttonSharedCompoundVariants = [
  // Danger color roles across all 5 M3 variants
  {
    variant: "filled",
    color: "danger",
    class:
      "bg-(--sys-color-error) text-(--sys-color-on-error) before:bg-(--sys-color-on-error) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
  },
  {
    variant: "tonal",
    color: "danger",
    class:
      "bg-(--sys-color-error-container) text-(--sys-color-on-error-container) before:bg-(--sys-color-on-error-container) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
  },
  {
    variant: "elevated",
    color: "danger",
    class:
      "text-(--sys-color-error) before:bg-(--sys-color-error) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
  },
  {
    variant: "outlined",
    color: "danger",
    class:
      "border-(--sys-color-error) text-(--sys-color-error) before:bg-(--sys-color-error) focus-visible:border-(--sys-color-error) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38",
  },
  {
    variant: "text",
    color: "danger",
    class:
      "text-(--sys-color-error) before:bg-(--sys-color-error) disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38",
  },
  // M3 text button tighter horizontal padding per size
  { variant: "text", size: "xs", class: "px-2" },
  { variant: "text", size: "sm", class: "px-2" },
  { variant: "text", size: "default", class: "px-3" },
  { variant: "text", size: "md", class: "px-3" },
  { variant: "text", size: "xl", class: "px-4" },
  { variant: "text", size: "lg", class: "px-4" },
  { variant: "text", size: "2xl", class: "px-6" },
  { variant: "text", size: "3xl", class: "px-8" },
  // M3 Expressive outlined border width scaling on L (2dp) and XL (3dp)
  { variant: "outlined", size: "2xl", class: "border-2" },
  { variant: "outlined", size: "3xl", class: "border-[3px]" },
  // M3 Expressive square shape per size (XS 12 / S 12 / M 16 / L 28 / XL 28)
  {
    shape: "square",
    size: "xs",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  {
    shape: "square",
    size: "sm",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  {
    shape: "square",
    size: "default",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  {
    shape: "square",
    size: "md",
    class: "rounded-(--sys-shape-corner-large)",
  },
  {
    shape: "square",
    size: "xl",
    class: "rounded-(--sys-shape-corner-large)",
  },
  {
    shape: "square",
    size: "lg",
    class: "rounded-(--sys-shape-corner-extra-large)",
  },
  {
    shape: "square",
    size: "2xl",
    class: "rounded-(--sys-shape-corner-extra-large)",
  },
  {
    shape: "square",
    size: "3xl",
    class: "rounded-(--sys-shape-corner-extra-large)",
  },
  {
    shape: "square",
    size: "icon",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  // M3 Expressive toggle colors (elevated, filled, tonal, outlined)
  {
    variant: "elevated",
    toggle: true,
    selected: true,
    class:
      "bg-(--sys-color-primary) text-(--sys-color-on-primary) before:bg-(--sys-color-on-primary)",
  },
  {
    variant: "filled",
    toggle: true,
    selected: false,
    class:
      "bg-(--sys-color-surface-container) text-(--sys-color-on-surface-variant) before:bg-(--sys-color-on-surface-variant)",
  },
  {
    variant: "tonal",
    toggle: true,
    selected: true,
    class:
      "bg-(--sys-color-secondary) text-(--sys-color-on-secondary) before:bg-(--sys-color-on-secondary)",
  },
  {
    variant: "outlined",
    toggle: true,
    selected: false,
    color: "primary",
    class: "text-(--sys-color-on-surface) before:bg-(--sys-color-on-surface)",
  },
  {
    variant: "outlined",
    toggle: true,
    selected: true,
    class:
      "border-transparent bg-(--sys-color-inverse-surface) text-(--sys-color-inverse-on-surface) before:bg-(--sys-color-inverse-on-surface)",
  },
] as const;

export const buttonToggleMorphCompoundVariants = [
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "xs",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "sm",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "default",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "md",
    class: "rounded-(--sys-shape-corner-large)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "xl",
    class: "rounded-(--sys-shape-corner-large)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "lg",
    class: "rounded-(--sys-shape-corner-extra-large)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "2xl",
    class: "rounded-(--sys-shape-corner-extra-large)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "3xl",
    class: "rounded-(--sys-shape-corner-extra-large)",
  },
  {
    toggle: true,
    selected: true,
    shape: "pill",
    size: "icon",
    class: "rounded-(--sys-shape-corner-medium)",
  },
  {
    toggle: true,
    selected: true,
    shape: "square",
    class:
      "rounded-[var(--comp-button-container-shape,var(--sys-shape-corner-full))]",
  },
] as const;

/**
 * Factory for the shared CVA button variants (D1024 C1).
 * - `Button` passes `{ morphOnPress: true, morphOnToggle: true }` (M3 Expressive shape morphing).
 * - `PulseButton` passes `{ morphOnPress: false, morphOnToggle: false }` (locked shape silhouette + spring kinetic layer).
 */
export function createButtonVariants(options: {
  morphOnPress: boolean;
  morphOnToggle: boolean;
  extraBaseClass?: string;
}) {
  const { morphOnPress, morphOnToggle, extraBaseClass } = options;
  const size = {
    xs: morphOnPress
      ? `${buttonSizeBaseClasses.xs} ${buttonPressMorphClasses.xs}`
      : buttonSizeBaseClasses.xs,
    sm: morphOnPress
      ? `${buttonSizeBaseClasses.sm} ${buttonPressMorphClasses.sm}`
      : buttonSizeBaseClasses.sm,
    default: morphOnPress
      ? `${buttonSizeBaseClasses.default} ${buttonPressMorphClasses.default}`
      : buttonSizeBaseClasses.default,
    md: morphOnPress
      ? `${buttonSizeBaseClasses.md} ${buttonPressMorphClasses.md}`
      : buttonSizeBaseClasses.md,
    xl: morphOnPress
      ? `${buttonSizeBaseClasses.xl} ${buttonPressMorphClasses.xl}`
      : buttonSizeBaseClasses.xl,
    lg: morphOnPress
      ? `${buttonSizeBaseClasses.lg} ${buttonPressMorphClasses.lg}`
      : buttonSizeBaseClasses.lg,
    "2xl": morphOnPress
      ? `${buttonSizeBaseClasses["2xl"]} ${buttonPressMorphClasses["2xl"]}`
      : buttonSizeBaseClasses["2xl"],
    "3xl": morphOnPress
      ? `${buttonSizeBaseClasses["3xl"]} ${buttonPressMorphClasses["3xl"]}`
      : buttonSizeBaseClasses["3xl"],
    icon: morphOnPress
      ? `${buttonSizeBaseClasses.icon} ${buttonPressMorphClasses.icon}`
      : buttonSizeBaseClasses.icon,
  };

  return cva(
    extraBaseClass ? `${buttonBaseClass} ${extraBaseClass}` : buttonBaseClass,
    {
      variants: {
        variant: buttonVariantClasses,
        color: {
          primary: "",
          danger: "",
        },
        size,
        shape: {
          pill: "",
          rounded: "rounded-(--sys-shape-corner-large)",
          square: "",
        },
        block: {
          true: "w-full",
          false: "",
        },
        toggle: {
          true: "",
          false: "",
        },
        selected: {
          true: "",
          false: "",
        },
      },
      compoundVariants: morphOnToggle
        ? [
            ...buttonSharedCompoundVariants,
            ...buttonToggleMorphCompoundVariants,
          ]
        : [...buttonSharedCompoundVariants],
      defaultVariants: {
        variant: "filled",
        color: "primary",
        size: "default",
        shape: "pill",
        block: false,
        toggle: false,
        selected: false,
      },
    },
  );
}

/**
 * PulseButton kinetic motion classes consuming `@xoroh/kern-tokens` spring
 * variables (`BUTTON_MOTION_CSS`, D1024 C4). Under `prefers-reduced-motion: reduce`,
 * `motion-reduce:transform-none` and `motion-reduce:transition-none` suppress
 * spatial scale and icon nudge while preserving state-layer opacity.
 */
export const pulseButtonMotionClass = `kern-pulse-button transition-[transform,color,background-color,border-color,box-shadow] duration-[var(--sys-motion-duration-medium2)] ease-[${BUTTON_MOTION_CSS.pressOutEasing}] active:scale-[0.97] active:duration-[var(--sys-motion-duration-short3)] active:ease-[${BUTTON_MOTION_CSS.pressInEasing}] motion-reduce:transform-none motion-reduce:active:scale-100`;
