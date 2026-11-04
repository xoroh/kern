import { cva, type VariantProps } from "class-variance-authority";
import {
  type ComponentPropsWithRef,
  type ReactNode,
  useId,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { CircularProgress } from "./circular-progress";
import { FOCUS_RING_CLASS } from "./focus-ring";

const iconButtonVariants = cva(
  `kern-icon-button group relative inline-flex shrink-0 items-center justify-center rounded-(--sys-shape-corner-full) outline-none transition-[color,background-color,border-color,border-radius] duration-200 ease-(--sys-motion-easing-standard) select-none ${FOCUS_RING_CLASS} disabled:pointer-events-none disabled:opacity-38 aria-disabled:pointer-events-none aria-disabled:opacity-38 after:absolute after:-inset-2 after:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 aria-disabled:before:opacity-0 [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0`,
  {
    variants: {
      variant: {
        standard:
          "text-(--sys-color-on-surface-variant) before:bg-(--sys-color-on-surface-variant)",
        filled:
          "bg-(--sys-color-primary) text-(--sys-color-on-primary) before:bg-(--sys-color-on-primary)",
        tonal:
          "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) before:bg-(--sys-color-on-secondary-container)",
        outlined:
          "border border-(--sys-color-outline) text-(--sys-color-on-surface-variant) before:bg-(--sys-color-on-surface-variant)",
      },
      size: {
        xs: "size-7 after:-inset-2.5 active:rounded-(--sys-shape-corner-small) [&_svg]:size-5",
        sm: "size-8 after:-inset-2.5 active:rounded-(--sys-shape-corner-small)",
        default: "size-10 active:rounded-(--sys-shape-corner-small)",
        md: "size-11 active:rounded-(--sys-shape-corner-medium) [&_svg]:size-6",
        lg: "size-12 after:-inset-1 active:rounded-(--sys-shape-corner-medium)",
        xl: "size-14 after:-inset-0.5 active:rounded-(--sys-shape-corner-large) [&_svg]:size-7",
        // M3 Expressive L: 96dp box.
        "2xl":
          "size-24 after:-inset-0 active:rounded-(--sys-shape-corner-extra-large) [&_svg]:size-8",
        // M3 Expressive XL: 136dp box.
        "3xl":
          "size-34 after:-inset-0 active:rounded-(--sys-shape-corner-extra-large) [&_svg]:size-10",
      },
      shape: {
        pill: "",
        square: "",
      },
      width: {
        narrow: "aspect-[3/4]",
        default: "",
        wide: "aspect-[4/3]",
      },
      selected: {
        true: "",
        false: "",
      },
      toggle: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "standard",
        selected: true,
        class: "text-(--sys-color-primary) before:bg-(--sys-color-primary)",
      },
      {
        variant: "filled",
        selected: true,
        class: "bg-(--sys-color-primary) text-(--sys-color-on-primary)",
      },
      {
        variant: "filled",
        toggle: true,
        selected: false,
        class:
          "bg-(--sys-color-surface-container-highest) text-(--sys-color-primary) before:bg-(--sys-color-primary)",
      },
      {
        variant: "tonal",
        selected: true,
        class:
          "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) before:bg-(--sys-color-on-secondary-container)",
      },
      {
        variant: "tonal",
        toggle: true,
        selected: false,
        class:
          "bg-(--sys-color-surface-container-highest) text-(--sys-color-on-surface-variant) before:bg-(--sys-color-on-surface-variant)",
      },
      {
        variant: "outlined",
        selected: true,
        class:
          "bg-(--sys-color-inverse-surface) text-(--sys-color-inverse-on-surface) border-transparent before:bg-(--sys-color-inverse-on-surface)",
      },
      {
        shape: "square",
        size: "xs",
        class: "rounded-(--sys-shape-corner-small)",
      },
      {
        shape: "square",
        size: "sm",
        class: "rounded-(--sys-shape-corner-small)",
      },
      {
        shape: "square",
        size: "default",
        class: "rounded-(--sys-shape-corner-medium)",
      },
      {
        shape: "square",
        size: "md",
        class: "rounded-(--sys-shape-corner-medium)",
      },
      {
        shape: "square",
        size: "lg",
        class: "rounded-(--sys-shape-corner-large)",
      },
      {
        shape: "square",
        size: "xl",
        class: "rounded-(--sys-shape-corner-large)",
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
        toggle: true,
        selected: true,
        shape: "pill",
        size: "xs",
        class: "rounded-(--sys-shape-corner-small)",
      },
      {
        toggle: true,
        selected: true,
        shape: "pill",
        size: "sm",
        class: "rounded-(--sys-shape-corner-small)",
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
        class: "rounded-(--sys-shape-corner-medium)",
      },
      {
        toggle: true,
        selected: true,
        shape: "pill",
        size: "lg",
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
        shape: "square",
        class: "rounded-(--sys-shape-corner-full)",
      },
    ],
    defaultVariants: {
      variant: "standard",
      size: "default",
      shape: "pill",
      width: "default",
      selected: false,
      toggle: false,
    },
  },
);

export type IconButtonVariant = NonNullable<
  VariantProps<typeof iconButtonVariants>["variant"]
>;
export type IconButtonSize = NonNullable<
  VariantProps<typeof iconButtonVariants>["size"]
>;
export type IconButtonShape = NonNullable<
  VariantProps<typeof iconButtonVariants>["shape"]
>;
export type IconButtonWidth = NonNullable<
  VariantProps<typeof iconButtonVariants>["width"]
>;

export type IconButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "children" | "value" | "defaultValue"
> &
  VariantProps<typeof iconButtonVariants> & {
    /** Icon rendered inside the 40dp target. */
    icon: ReactNode;
    /** Optional alternate icon swapped in when `toggle` is selected (M3 filled glyph). */
    selectedIcon?: ReactNode;
    /**
     * Accessible name AND tooltip text. Optional ONLY in the type so a missing
     * name is caught by the runtime warning rather than silenced by `""`.
     */
    label?: string;
    /**
     * Alternate accessible name and tooltip text when `toggle` is selected
     * (e.g. "Remove from favorites" vs "Add to favorites").
     */
    selectedLabel?: string;

    /** Enables two-state toggle behaviour (`aria-pressed`). */
    toggle?: boolean;
    /** Controlled pressed state (only when `toggle` is set). */
    pressed?: boolean;
    /** Uncontrolled initial pressed state (only when `toggle` is set). */
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    /** Shows the embedded progress indicator and blocks interaction. */
    loading?: boolean;
    /**
     * Soft-disabled: paints the disabled treatment but stays focusable, so the
     * control remains discoverable in toolbars.
     */
    softDisabled?: boolean;
    /** Mirrors the icon horizontally in RTL contexts (`rtl:scale-x-[-1]`). */
    flipIcon?: boolean;
  };

export function IconButton({
  variant,
  size,
  shape,
  width,
  selected,
  icon,
  selectedIcon,
  label,
  selectedLabel,
  toggle = false,
  pressed,
  defaultPressed = false,
  onPressedChange,
  loading = false,
  softDisabled = false,
  flipIcon = false,
  disabled = false,
  type = "button",
  className,
  ref,
  ...props
}: IconButtonProps) {
  const tooltipId = useId();
  const controlled = pressed !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultPressed);
  const isPressed = toggle ? (controlled ? pressed : uncontrolled) : false;

  if (
    process.env.NODE_ENV !== "production" &&
    !label &&
    !props["aria-label"] &&
    !props["aria-labelledby"]
  ) {
    console.warn(
      "IconButton: `label` is missing. An icon button has no visible text, so `label` is required for both the accessible name and the tooltip.",
    );
  }

  const toggleState = () => {
    if (!controlled) setUncontrolled(!isPressed);
    onPressedChange?.(!isPressed);
  };

  const blocked = disabled || loading || softDisabled;
  const activeIcon = toggle && isPressed && selectedIcon ? selectedIcon : icon;

  return (
    <button
      type={type}
      data-slot="icon-button"
      data-variant={variant}
      data-selected={isPressed || undefined}
      data-loading={loading || undefined}
      aria-label={isPressed && selectedLabel ? selectedLabel : label}
      aria-pressed={toggle ? isPressed : undefined}
      aria-disabled={blocked || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading || undefined}
      className={cn(
        iconButtonVariants({
          variant,
          size,
          shape,
          width,
          selected: isPressed,
          toggle,
        }),
        className,
      )}
      ref={ref}
      {...props}
      onClick={(event) => {
        if (softDisabled || loading) {
          event.preventDefault();
          return;
        }
        if (toggle) toggleState();
        props.onClick?.(event);
      }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center",
          flipIcon && "rtl:scale-x-[-1]",
        )}
      >
        {loading ? (
          <CircularProgress size="sm" label="Loading" aria-hidden="true" />
        ) : (
          activeIcon
        )}
      </span>
      {label ? (
        <span
          id={tooltipId}
          role="tooltip"
          data-slot="icon-button-tooltip"
          className="pointer-events-none absolute start-1/2 top-[calc(100%+6px)] z-10 -translate-x-1/2 scale-95 rounded-(--sys-shape-corner-extra-small) bg-(--sys-color-inverse-surface) px-2 py-1 text-xs whitespace-nowrap text-(--sys-color-inverse-on-surface) opacity-0 transition-opacity delay-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {isPressed && selectedLabel ? selectedLabel : label}
        </span>
      ) : null}
    </button>
  );
}

export { iconButtonVariants };
