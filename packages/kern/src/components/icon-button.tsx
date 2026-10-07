import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";

/**
 * M3 icon button — the canonical square, icon-only action. Four container
 * variants (`standard` / `filled` / `tonal` / `outlined`) plus the toggle form,
 * which is the variant that actually carries state.
 *
 * Behaviour this component owns, rather than delegating to a primitive:
 *
 * - **Toggle state** — controlled (`pressed` + `onPressedChange`) or
 *   uncontrolled (`defaultPressed`), reported as `aria-pressed`. A toggle
 *   icon button with no `aria-pressed` is a plain button wearing a selected
 *   colour, which is exactly the state a screen reader cannot see.
 * - **Accessible name is mandatory** — M3 puts the label in a tooltip because
 *   the button has no visible text. Kern keeps the name on the element
 *   (`aria-label`) and renders the tooltip text alongside it, so a sighted
 *   hover and an announced name come from one prop and cannot drift. When
 *   neither is supplied the button is rendered `aria-hidden`-free but
 *   unnamed, which the dev-time warning below reports.
 * - **Disabled** — the native `disabled` attribute, which is what removes the
 *   button from the tab order and from the accessibility tree. (An earlier
 *   version of this comment claimed `disabled` PLUS `aria-disabled` "so the
 *   state survives any host that re-enables pointer events". No `aria-disabled`
 *   attribute is rendered — the `aria-disabled:` classes below exist for hosts
 *   that set the attribute themselves. The comment was wrong and
 *   `icon-button.test.tsx` now pins the real behaviour.)
 * - **Touch target** — the 40dp visual box keeps an `after:` inset out to
 *   48dp, per the M3 minimum.
 */

const iconButtonVariants = cva(
  "kern-icon-button group relative inline-flex shrink-0 items-center justify-center rounded-(--md-sys-shape-corner-full) outline-none transition-colors select-none " + FOCUS_RING_CLASS + " disabled:pointer-events-none disabled:opacity-38 aria-disabled:pointer-events-none aria-disabled:opacity-38 after:absolute after:-inset-2 after:content-[''] [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        standard:
          "text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-on-surface) hover:opacity-[var(--md-sys-state-hover)]",
        filled:
          "bg-(--md-sys-color-surface-container-highest) text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)",
        tonal:
          "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container) hover:opacity-[var(--md-sys-state-hover)]",
        outlined:
          "border border-(--md-sys-color-outline) text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-on-surface) hover:opacity-[var(--md-sys-state-hover)]",
      },
      size: {
        sm: "size-8 after:-inset-2.5",
        default: "size-10",
        lg: "size-12 after:-inset-1",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // The selected expression is per-variant, because the selected fill is
      // the variant's own container role — there is no single "selected token".
      {
        variant: "standard",
        selected: true,
        class:
          "text-(--md-sys-color-on-surface) bg-(--md-sys-color-on-surface)/12",
      },
      {
        variant: "filled",
        selected: true,
        class: "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary)",
      },
      {
        variant: "tonal",
        selected: true,
        class:
          "bg-(--md-sys-color-secondary) text-(--md-sys-color-on-secondary)",
      },
      {
        variant: "outlined",
        selected: true,
        class:
          "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) border-transparent",
      },
    ],
    defaultVariants: { variant: "standard", size: "default", selected: false },
  },
);

export type IconButtonVariant = NonNullable<
  VariantProps<typeof iconButtonVariants>["variant"]
>;

export type IconButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "children" | "value" | "defaultValue"
> &
  VariantProps<typeof iconButtonVariants> & {
    /** Icon content. Hidden from assistive tech; the name comes from `label`. */
    icon: ReactNode;
    /**
     * Accessible name, and the text of the M3 tooltip. Required in practice:
     * an icon-only button with no name is unusable with a screen reader.
     */
    label?: string;
    /** Renders this button as a toggle and reports its state. */
    toggle?: boolean;
    /** Controlled pressed state. Only meaningful with `toggle`. */
    pressed?: boolean;
    /** Initial pressed state for the uncontrolled toggle case. */
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    /**
     * R2 lexicon canonical names (`value` wins when both are passed; both
     * callbacks fire). `pressed`/`defaultPressed`/`onPressedChange` are
     * deprecated aliases onto the same state.
     */
    value?: boolean;
    defaultValue?: boolean;
    onValueChange?: (pressed: boolean) => void;
  };

export function IconButton({
  variant,
  size,
  selected,
  icon,
  label,
  toggle = false,
  pressed,
  defaultPressed = false,
  onPressedChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  type = "button",
  disabled,
  className,
  ...props
}: IconButtonProps) {
  const controlled = valueProp !== undefined || pressed !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? defaultPressed,
  );
  const isPressed = toggle
    ? controlled
      ? (valueProp ?? pressed ?? false)
      : uncontrolled
    : false;
  const tooltipId = useId();

  if (process.env.NODE_ENV !== "production" && !label) {
    // A named button is a contract, not a style preference: M3 supplies a
    // tooltip, Kern supplies the name. Shipping one without the other is how
    // an icon-only action becomes unusable in production.
    console.warn(
      "IconButton: `label` is missing. An icon-only button with no accessible name cannot be announced; pass the M3 tooltip text as `label`.",
    );
  }

  const toggleState = () => {
    if (!controlled) setUncontrolled(!isPressed);
    onValueChange?.(!isPressed);
    onPressedChange?.(!isPressed);
  };

  return (
    <button
      type={type}
      data-slot="icon-button"
      data-variant={variant}
      data-selected={isPressed || undefined}
      aria-label={label}
      aria-pressed={toggle ? isPressed : undefined}
      disabled={disabled}
      className={cn(
        iconButtonVariants({ variant, size, selected: isPressed }),
        className,
      )}
      // The spread comes FIRST. Spread last, it would overwrite the composed
      // onClick with the host's raw handler and the toggle would stop firing —
      // the kind of bug that only shows up once a consumer passes onClick.
      {...props}
      onClick={(event) => {
        if (toggle) toggleState();
        props.onClick?.(event);
      }}
    >
      <span aria-hidden="true" className="flex items-center justify-center">
        {icon}
      </span>
      {label ? (
        <span
          id={tooltipId}
          role="tooltip"
          data-slot="icon-button-tooltip"
          className="pointer-events-none absolute start-1/2 top-[calc(100%+6px)] z-10 -translate-x-1/2 scale-95 rounded-(--md-sys-shape-corner-extra-small) bg-(--md-sys-color-inverse-surface) px-2 py-1 text-xs whitespace-nowrap text-(--md-sys-color-inverse-on-surface) opacity-0 transition-opacity delay-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {label}
        </span>
      ) : null}
    </button>
  );
}

export { iconButtonVariants };
