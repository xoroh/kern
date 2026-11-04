import { BUTTON_SPRING_TOKENS } from "@xoroh/kern-tokens";
import type { VariantProps } from "class-variance-authority";
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ReactNode,
} from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import {
  BUTTON_EXPRESSIVE_SIZE_LADDER,
  BUTTON_SIZE_TO_KERN_SIZE,
  BUTTON_SIZES_ORDERED,
  createButtonVariants,
  pulseButtonMotionClass,
} from "./button-shared";

// Keep the `defaultVariants` AST node in `pulse-button.tsx` for `generate-props.mjs`.
const _pulseButtonDefaultVariants = {
  defaultVariants: {
    variant: "filled",
    color: "primary",
    size: "default",
    shape: "pill",
    block: false,
    toggle: false,
    selected: false,
  },
} as const;
void _pulseButtonDefaultVariants;

const pulseButtonVariants = createButtonVariants({
  morphOnPress: false,
  morphOnToggle: false,
});

export {
  BUTTON_EXPRESSIVE_SIZE_LADDER,
  BUTTON_SIZE_TO_KERN_SIZE,
  BUTTON_SIZES_ORDERED,
  BUTTON_SPRING_TOKENS,
  pulseButtonVariants,
};

type PulseButtonCvaProps = VariantProps<typeof pulseButtonVariants>;
export type PulseButtonVariant = NonNullable<PulseButtonCvaProps["variant"]>;
export type PulseButtonColor = NonNullable<PulseButtonCvaProps["color"]>;
export type PulseButtonSize = NonNullable<PulseButtonCvaProps["size"]>;
export type PulseButtonShape = NonNullable<PulseButtonCvaProps["shape"]>;
export type PulseButtonIconPosition = "start" | "end";

type PulseButtonSharedProps = VariantProps<typeof pulseButtonVariants> & {
  /**
   * M3 Expressive toggle mode on a shape-stable silhouette: binary selection
   * with per-variant selected colors and `aria-pressed`, while `border-radius`
   * remains locked to `shape`.
   */
  toggle?: boolean;
  /** Controlled selected state. Only meaningful with `toggle`. */
  pressed?: boolean;
  /** Initial selected state for the uncontrolled toggle case. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Soft-disabled: paints the disabled treatment but stays focusable, so
   * the control remains discoverable in toolbars.
   */
  softDisabled?: boolean;
  /** Mirrors the icon horizontally in RTL contexts (`rtl:scale-x-[-1]`). */
  flipIcon?: boolean;
  /**
   * Shows an inline M3 progress ring beside the label, marks `aria-busy`
   * and blocks interaction.
   */
  loading?: boolean;
  /** Icon rendered beside the label, separated by the M3 icon gap. */
  icon?: ReactNode;
  iconPosition?: PulseButtonIconPosition;
  /**
   * Optional haptic hook fired on press-in / press-out so hosts can wire
   * platform haptics alongside the spring scale pulse.
   */
  onHaptic?: (phase: "pressIn" | "pressOut") => void;
  /** Test selector, rendered as `data-testid` on the root element. */
  testID?: string;
};

type PulseButtonAsButton = Omit<
  ComponentPropsWithRef<"button">,
  keyof PulseButtonSharedProps
> &
  PulseButtonSharedProps & {
    href?: undefined;
  };

type PulseButtonAsAnchor = Omit<
  ComponentPropsWithoutRef<"a">,
  keyof PulseButtonSharedProps
> &
  PulseButtonSharedProps & {
    href: string;
    disabled?: boolean;
  };

export type PulseButtonProps = PulseButtonAsButton | PulseButtonAsAnchor;

function InlinePulseSpinner() {
  return (
    <svg
      data-slot="pulse-spinner"
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-4 shrink-0 animate-spin"
    >
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeDasharray="34 14"
      />
    </svg>
  );
}

/**
 * `PulseButton` — Kern's shape-stable animated button.
 *
 * Consumes the exact same variant/color/size/shape token tables as `Button`
 * via `button-shared.ts` (D1024 C1 & C4), locking `border-radius` across
 * rest, hover, press, and toggle while expressing tactile feedback through:
 * 1. Spring scale pulse (`--sys-motion-spring-fast-spatial`, 0.97 press / 1.015 hover),
 * 2. Radial state-layer bloom (`[data-slot="pulse-bloom"]`),
 * 3. Kinetic icon micro-nudge (1.5px shift / 1.08 scale on active).
 */
export function PulseButton(props: PulseButtonProps) {
  const {
    className,
    variant,
    color,
    size,
    shape,
    block,
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
    disabled,
    children,
    testID,
  } = props;
  const controlled = pressed !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultPressed);

  if (process.env.NODE_ENV !== "production" && toggle && variant === "text") {
    console.warn(
      'PulseButton: M3 does not define a toggle text button (`variant="text"` with `toggle`). Use `filled`, `tonal`, `elevated`, or `outlined`.',
    );
  }

  const isSelected =
    toggle && variant !== "text"
      ? controlled
        ? (pressed ?? false)
        : uncontrolled
      : false;

  const flipToggle = () => {
    if (!toggle || variant === "text") return;
    const next = !isSelected;
    if (!controlled) setUncontrolled(next);
    onPressedChange?.(next);
  };

  const blocked = Boolean(disabled) || loading || softDisabled;
  const classes = cn(
    pulseButtonVariants({
      variant,
      color,
      size,
      shape,
      block,
      toggle,
      selected: isSelected,
    }),
    pulseButtonMotionClass,
    className,
  );
  const iconNode = icon ? (
    <span
      data-slot="pulse-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 transition-transform [transition-timing-function:var(--sys-motion-spring-fast-spatial)] [transition-duration:var(--sys-motion-spring-fast-spatial-duration)] group-active/button:scale-[1.08] group-active/button:translate-x-[1.5px] motion-reduce:transition-none motion-reduce:group-active/button:scale-100 motion-reduce:group-active/button:translate-x-0",
        flipIcon && "rtl:scale-x-[-1]",
      )}
    >
      {icon}
    </span>
  ) : null;
  const bloomNode = (
    <span
      data-slot="pulse-bloom"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-current opacity-0 scale-75 transition-[transform,opacity] [transition-timing-function:var(--sys-motion-spring-fast-effects)] [transition-duration:var(--sys-motion-spring-fast-effects-duration)] group-hover/button:opacity-[var(--sys-state-hover-state-layer-opacity)] group-hover/button:scale-100 group-active/button:opacity-[var(--sys-state-pressed-state-layer-opacity)] group-active/button:scale-100 motion-reduce:transition-none"
    />
  );
  const content = (
    <>
      {bloomNode}
      {loading ? <InlinePulseSpinner /> : null}
      {iconPosition === "start" ? iconNode : null}
      {children}
      {iconPosition === "end" ? iconNode : null}
    </>
  );

  if (typeof props.href === "string") {
    const {
      className: _c,
      variant: _v,
      color: _co,
      size: _s,
      shape: _sh,
      block: _b,
      toggle: _t,
      pressed: _p,
      defaultPressed: _dp,
      onPressedChange: _opc,
      softDisabled: _sd,
      flipIcon: _fi,
      loading: _l,
      icon: _i,
      iconPosition: _ip,
      onHaptic: _oh,
      disabled: _d,
      children: _ch,
      testID: _tid,
      href,
      onClick,
      onPointerDown,
      onPointerUp,
      ...anchorProps
    } = props;
    return (
      <a
        data-slot="pulse-button"
        data-testid={testID}
        data-variant={variant ?? "filled"}
        data-color={color ?? "primary"}
        data-size={size ?? "default"}
        data-shape={shape ?? "pill"}
        data-shape-stable="true"
        data-selected={isSelected ? "" : undefined}
        role={blocked ? "link" : undefined}
        href={blocked ? undefined : href}
        aria-disabled={blocked || undefined}
        aria-busy={loading || undefined}
        tabIndex={disabled || loading ? -1 : undefined}
        className={classes}
        {...anchorProps}
        onPointerDown={(event) => {
          if (!blocked) onHaptic?.("pressIn");
          onPointerDown?.(event);
        }}
        onPointerUp={(event) => {
          if (!blocked) onHaptic?.("pressOut");
          onPointerUp?.(event);
        }}
        onClick={(event) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
          if (!event.defaultPrevented) flipToggle();
        }}
      >
        {content}
      </a>
    );
  }

  const {
    className: _c,
    variant: _v,
    color: _co,
    size: _s,
    shape: _sh,
    block: _b,
    toggle: _t,
    pressed: _p,
    defaultPressed: _dp,
    onPressedChange: _opc,
    softDisabled: _sd,
    flipIcon: _fi,
    loading: _l,
    icon: _i,
    iconPosition: _ip,
    onHaptic: _oh,
    disabled: _d,
    children: _ch,
    testID: _tid,
    href: _h,
    type = "button",
    onClick,
    onPointerDown,
    onPointerUp,
    ...buttonProps
  } = props;
  const hardBlocked = Boolean(disabled) || loading;
  return (
    <button
      type={type}
      data-slot="pulse-button"
      data-testid={testID}
      data-variant={variant ?? "filled"}
      data-color={color ?? "primary"}
      data-size={size ?? "default"}
      data-shape={shape ?? "pill"}
      data-shape-stable="true"
      data-selected={isSelected ? "" : undefined}
      disabled={hardBlocked}
      aria-disabled={blocked || undefined}
      aria-busy={loading || undefined}
      aria-pressed={toggle ? isSelected : undefined}
      className={classes}
      {...buttonProps}
      onPointerDown={(event) => {
        if (!blocked) onHaptic?.("pressIn");
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        if (!blocked) onHaptic?.("pressOut");
        onPointerUp?.(event);
      }}
      onClick={(event) => {
        if (blocked) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
        if (!event.defaultPrevented) flipToggle();
      }}
    >
      {content}
    </button>
  );
}
