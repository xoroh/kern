import type { LoadingIndicatorStyle } from "@xoroh/kern-tokens";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactNode, Ref } from "react";
import { cn } from "../utils/cn";
import { CircularProgress } from "./circular-progress";
import { FOCUS_RING_CLASS } from "./focus-ring";

const buttonVariants = cva(
  `kern-button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-(--md-sys-shape-corner-full) text-sm font-medium whitespace-nowrap transition-colors outline-none select-none ${FOCUS_RING_CLASS} disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed active:opacity-[var(--md-sys-state-press)] after:absolute after:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 hover:before:opacity-[var(--md-sys-state-hover)] before:transition-opacity [&_svg]:size-4 [&_svg]:shrink-0`,
  {
    variants: {
      // M3's FIVE color configurations (m3.material.io/components/buttons/overview):
      // elevated, filled, tonal, outlined, text. The error treatment is NOT a
      // sixth variant — it is the `color` axis below (`danger`), which swaps
      // the roles while the variant keeps its structure. `ghost` maps to M3's
      // `text` button.
      //
      // Hover is a state LAYER, not a dim: the `before:` overlay paints the
      // layer color at the hover opacity over the container while the label
      // stays full-strength. Whole-button `hover:opacity` (which dims the
      // label too) is the bug this replaces.
      variant: {
        elevated:
          "bg-(--md-sys-color-surface-container-low) text-(--md-sys-color-primary) shadow-(--md-sys-elevation-level1) before:bg-(--md-sys-color-primary)",
        primary:
          "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) before:bg-(--md-sys-color-on-primary)",
        tonal:
          "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container) before:bg-(--md-sys-color-on-secondary-container)",
        outlined:
          "border border-(--md-sys-color-outline) text-(--md-sys-color-primary) before:bg-(--md-sys-color-primary)",
        ghost:
          "text-(--md-sys-color-primary) before:bg-(--md-sys-color-primary)",
      },
      // The color axis, not a variant axis: `danger` re-paints the five M3
      // configurations in the error roles instead of adding a sixth shape.
      // `primary` is the empty string — the default adds no classes, so
      // existing rendering cannot change.
      color: {
        primary: "",
        danger: "",
      },
      size: {
        // Kern extensions past M3's single 40dp height: `xs` compacts into
        // the `sm` metrics band, `xl` steps up into `lg` (see
        // `BUTTON_SIZE_TO_KERN_SIZE`). Touch targets stay at the 48dp
        // minimum via the `after:` inset, same as the stock sizes.
        xs: "h-7 gap-1.5 px-3 text-xs after:-inset-2.5 [&_svg]:size-3.5",
        default: "h-10 px-4 after:-inset-1",
        sm: "h-8 px-3 text-[13px] after:-inset-2",
        xl: "h-12 px-6 text-base after:-inset-1 [&_svg]:size-5",
        icon: "h-10 w-10 px-0 after:-inset-1",
      },
      // Kern extension: M3 buttons are always the full pill. `rounded`
      // steps down to the large corner, `square` removes the corner.
      // The theme still owns the radii — this axis only selects the role.
      shape: {
        pill: "",
        rounded: "rounded-(--md-sys-shape-corner-large)",
        square: "rounded-none",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Danger keeps the variant's structure and swaps its roles: fills
      // move to the error roles, treatments that have no fill keep their
      // surface and re-paint their ink.
      {
        variant: "primary",
        color: "danger",
        class:
          "bg-(--md-sys-color-error) text-(--md-sys-color-on-error) before:bg-(--md-sys-color-on-error)",
      },
      {
        variant: "tonal",
        color: "danger",
        class:
          "bg-(--md-sys-color-error-container) text-(--md-sys-color-on-error-container) before:bg-(--md-sys-color-on-error-container)",
      },
      {
        variant: "elevated",
        color: "danger",
        class: "text-(--md-sys-color-error) before:bg-(--md-sys-color-error)",
      },
      {
        variant: "outlined",
        color: "danger",
        class:
          "border-(--md-sys-color-error) text-(--md-sys-color-error) before:bg-(--md-sys-color-error)",
      },
      {
        variant: "ghost",
        color: "danger",
        class: "text-(--md-sys-color-error) before:bg-(--md-sys-color-error)",
      },
    ],
    defaultVariants: {
      variant: "primary",
      color: "primary",
      size: "default",
      shape: "pill",
      block: false,
    },
  },
);

export type ButtonVariant =
  | "elevated"
  | "primary"
  | "tonal"
  | "outlined"
  | "ghost";

/**
 * R2 variant map, re-homed (T1): M3 names as aliases onto the Kern styles.
 * `filled`/`text` resolve to existing styles — no new visuals. `elevated`
 * already exists here, so it is not an alias. `ghost`/`danger` are Kern
 * extensions (see docs/conventions/api-consistency.md). Exhaustive Record —
 * new M3 names break typecheck here.
 */
export type ButtonM3Variant = "filled" | "text";
export const BUTTON_VARIANT_ALIASES: Record<ButtonM3Variant, ButtonVariant> = {
  filled: "primary",
  text: "ghost",
};

/** Accepted variant prop: Kern names or M3 aliases (normalized internally). */
export type ButtonVariantInput = ButtonVariant | ButtonM3Variant;

/** The color axis: M3 emphasis (`primary`) or the error treatment (`danger`). */
export type ButtonColor = "primary" | "danger";

export type ButtonSize = "xs" | "default" | "sm" | "xl" | "icon";

/** The shape axis: M3 pill (`pill`), stepped-down corner (`rounded`), or none (`square`). */
export type ButtonShape = "pill" | "rounded" | "square";

/** Which side of the label the `icon` slot renders on. */
export type ButtonIconPosition = "start" | "end";

/**
 * R2 size foundation, re-homed (T1): Button sizes onto `KernSize`.
 * `default` renders at md metrics, `sm` is `sm`; `xs` compacts inside the
 * `sm` band and `xl` steps into `lg`. `icon` is shape, not scale, and is
 * intentionally absent — same rule as the platform source.
 */
export const BUTTON_SIZE_TO_KERN_SIZE = {
  xs: "sm",
  default: "md",
  sm: "sm",
  xl: "lg",
} as const;

export type ButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "size" | "ref"
> & {
  variant?: ButtonVariantInput;
  size?: ButtonSize;
  color?: ButtonColor;
  shape?: ButtonShape;
  /** Full-width block button. */
  block?: boolean;
  /** Shows the embedded progress indicator and blocks interaction. */
  loading?: boolean;
  /** 0–1 determinate progress while loading. Omit for the loop. */
  loadingValue?: number;
  /** Style of the embedded indicator. Defaults to the M3 ring (`spinner`). */
  loaderStyle?: LoadingIndicatorStyle;
  /**
   * Navigation variant. Renders `<a href>` wearing the button treatment,
   * i.e. `role="link"` — for a dedicated link component see `LinkButton`.
   * A disabled link drops `href`, leaves the tab order and reports
   * `aria-disabled` (the ListItem convention) — links have no `disabled`
   * attribute, so there is nothing native to lean on.
   */
  href?: string;
  /**
   * Anchor target. Only rendered when `href` is set — a button has no
   * browsing context to open.
   */
  target?: ComponentPropsWithRef<"a">["target"];
  /** Anchor relationship list. Only rendered when `href` is set. */
  rel?: string;
  /** Download hint. Only rendered when `href` is set. */
  download?: ComponentPropsWithRef<"a">["download"];
  /** Leading (or trailing, with `iconPosition`) icon. Hidden from assistive tech. */
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
};

export function Button({
  variant: variantInput = "primary",
  size,
  color = "primary",
  shape,
  block,
  loading = false,
  loadingValue,
  loaderStyle,
  href,
  target,
  rel,
  download,
  icon,
  iconPosition = "start",
  type = "button",
  value,
  className,
  disabled,
  children,
  ref,
  ...props
}: ButtonProps) {
  // M3 aliases normalize to Kern names once, here — the cva call below only
  // ever sees Kern names, so existing rendering cannot change.
  const variant: ButtonVariant =
    variantInput in BUTTON_VARIANT_ALIASES
      ? BUTTON_VARIANT_ALIASES[variantInput as ButtonM3Variant]
      : (variantInput as ButtonVariant);
  const blocked = disabled || loading;
  const classes = cn(
    buttonVariants({ variant, color, size, shape, block }),
    className,
  );
  // The icon slot is order, not margin: `iconPosition` only chooses which
  // side of the label renders first, and the 8px M3 icon spacing is the
  // flex `gap` — so the pair flips automatically under RTL with no
  // physical insets to mirror.
  const iconSlot =
    icon === undefined ? null : (
      <span
        data-slot="button-icon"
        aria-hidden="true"
        className="flex items-center"
      >
        {icon}
      </span>
    );
  const content = (
    <>
      {loading ? (
        <CircularProgress
          value={loadingValue}
          loaderStyle={loaderStyle}
          size="sm"
          label="Loading"
          aria-hidden="true"
        />
      ) : null}
      {iconPosition === "start" ? iconSlot : null}
      {children}
      {iconPosition === "end" ? iconSlot : null}
    </>
  );

  if (href !== undefined) {
    const anchorClick = props.onClick as unknown as
      | ComponentPropsWithRef<"a">["onClick"]
      | undefined;
    // Button-only attributes never reach the link: `type` and `value` are
    // destructured above; the `form*` submission attributes live in `props`
    // and are stripped here (an anchor submits nothing).
    const {
      form,
      formAction,
      formEncType,
      formMethod,
      formNoValidate,
      formTarget,
      name,
      ...anchorProps
    } = props;
    void form;
    void formAction;
    void formEncType;
    void formMethod;
    void formNoValidate;
    void formTarget;
    void name;
    return (
      <a
        data-slot="button"
        data-loading={loading ? "" : undefined}
        aria-busy={loading || undefined}
        aria-disabled={blocked || undefined}
        tabIndex={blocked ? -1 : undefined}
        href={blocked ? undefined : href}
        target={target}
        rel={rel}
        download={download}
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        // The cast only re-types the shared remainder (`aria-*`, `autoFocus`,
        // `onFocus`, …) — button-only keys were stripped above.
        {...(anchorProps as unknown as ComponentPropsWithRef<"a">)}
        onClick={(event) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          anchorClick?.(event);
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      data-slot="button"
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      className={classes}
      type={type}
      value={value}
      disabled={blocked}
      ref={ref as Ref<HTMLButtonElement>}
      {...props}
    >
      {content}
    </button>
  );
}

export { buttonVariants };
