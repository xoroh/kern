import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId, useState } from "react";
import { cn } from "../utils/cn";
import { CircularProgress } from "./circular-progress";
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
        xs: "size-7 after:-inset-2.5 [&_svg]:size-5",
        sm: "size-8 after:-inset-2.5",
        default: "size-10 active:rounded-(--sys-shape-corner-small)",
        md: "size-11 active:rounded-(--sys-shape-corner-medium) [&_svg]:size-6",
        lg: "size-12 after:-inset-1 active:rounded-(--sys-shape-corner-medium)",
        xl: "size-14 after:-inset-0.5 active:rounded-(--sys-shape-corner-large) [&_svg]:size-7",
        // M3 Expressive L: 96dp box. Already past the 48dp minimum, so no
        // target inset; square morph lands on the extra-large corner (28dp).
        "2xl":
          "size-24 after:-inset-0 active:rounded-(--sys-shape-corner-extra-large) [&_svg]:size-8",
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
      // Toggle form only: an unselected toggle is NOT the resting filled
      // treatment — M3 gives it the surface-container-highest container with
      // the primary icon, and selection lands on the primary fill.
      toggle: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Selected states per M3 icon-button spec (material-web v0.192):
      // standard toggle selected icon = primary (no fill); filled toggle
      // unselected = surface-container-highest + primary icon; tonal toggle
      // selected = secondary-container + on-secondary-container; outlined
      // toggle selected = inverse-surface + inverse-on-surface.
      {
        variant: "standard",
        selected: true,
        class:
          "text-(--sys-color-primary) before:bg-(--sys-color-primary)",
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
      // M3 Expressive square shape per size for the smaller icon-button
      // boxes (8/8/12/12/16/16). Selected toggles morph round to square.
      { shape: "square", size: "xs", class: "rounded-(--sys-shape-corner-small)" },
      { shape: "square", size: "sm", class: "rounded-(--sys-shape-corner-small)" },
      { shape: "square", size: "default", class: "rounded-(--sys-shape-corner-medium)" },
      { shape: "square", size: "md", class: "rounded-(--sys-shape-corner-medium)" },
      { shape: "square", size: "lg", class: "rounded-(--sys-shape-corner-large)" },
      { shape: "square", size: "xl", class: "rounded-(--sys-shape-corner-large)" },
      { shape: "square", size: "2xl", class: "rounded-(--sys-shape-corner-extra-large)" },
      { toggle: true, selected: true, shape: "pill", size: "xs", class: "rounded-(--sys-shape-corner-small)" },
      { toggle: true, selected: true, shape: "pill", size: "sm", class: "rounded-(--sys-shape-corner-small)" },
      { toggle: true, selected: true, shape: "pill", size: "default", class: "rounded-(--sys-shape-corner-medium)" },
      { toggle: true, selected: true, shape: "pill", size: "md", class: "rounded-(--sys-shape-corner-medium)" },
      { toggle: true, selected: true, shape: "pill", size: "lg", class: "rounded-(--sys-shape-corner-large)" },
      { toggle: true, selected: true, shape: "pill", size: "xl", class: "rounded-(--sys-shape-corner-large)" },
      { toggle: true, selected: true, shape: "pill", size: "2xl", class: "rounded-(--sys-shape-corner-extra-large)" },
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
    /**
     * Accessible name when the toggle is selected (`aria-label-selected`).
     * Only meaningful with `toggle` — a favorite button reads "Add to
     * favorites" unselected and "Remove from favorites" selected.
     */
    selectedLabel?: string;
    /**
     * Soft-disabled: paints the disabled treatment but stays focusable, so
     * the control remains discoverable (toolbar pattern per W3C APG
     * disabled-controls guidance).
     */
    softDisabled?: boolean;
    /** Shows a loading spinner in place of the icon and blocks interaction. */
    loading?: boolean;
    /**
     * Mirrors the icon horizontally in RTL contexts. Opt into it for
     * directional glyphs only; symmetric icons must not flip. Per M3's
     * `flip-icon-in-rtl`.
     */
    flipIcon?: boolean;
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
  shape,
  width,
  selected,
  icon,
  label,
  selectedLabel,
  toggle = false,
  pressed,
  defaultPressed = false,
  onPressedChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  type = "button",
  disabled,
  softDisabled = false,
  loading = false,
  flipIcon = false,
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

  const blocked = disabled || loading || softDisabled;
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
      // The spread comes FIRST. Spread last, it would overwrite the composed
      // onClick with the host's raw handler and the toggle would stop firing —
      // the kind of bug that only shows up once a consumer passes onClick.
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
          icon
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
