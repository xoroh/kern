import type { LoadingIndicatorStyle } from "@xoroh/kern-material-3";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactNode, Ref } from "react";
import { useState } from "react";
import { assignRef } from "../utils/assignRef";
import { cn } from "../utils/cn";
import { CircularProgress } from "./circular-progress";
import { FOCUS_RING_CLASS } from "./focus-ring";

const buttonVariants = cva(
  `kern-button relative inline-flex min-w-16 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[var(--comp-button-container-shape,var(--sys-shape-corner-full))] text-sm leading-5 font-medium tracking-[0.1px] whitespace-nowrap transition-[color,background-color,border-color,box-shadow,border-radius] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none ${FOCUS_RING_CLASS} disabled:pointer-events-none disabled:cursor-not-allowed disabled:shadow-none aria-disabled:cursor-not-allowed aria-disabled:shadow-none after:absolute after:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 aria-disabled:before:opacity-0 [&_svg]:size-5 [&_svg]:shrink-0`,
  {
    variants: {
      // M3's FIVE color configurations (m3.material.io/components/buttons/overview):
      // elevated, filled, tonal, outlined, text. The error treatment is NOT a
      // sixth variant — it is the `color` axis below (`danger`), which swaps
      // the roles while the variant keeps its structure. `ghost` maps to M3's
      // `text` button.
      //
      // Hover/focus/press are state LAYERS, not dims: the `before:` overlay
      // paints the layer color at the state opacity over the container while
      // the label stays full-strength. Whole-button opacity dims (which dim
      // the label too) are only for the disabled state per M3's 38%/12% rule.
      variant: {
        elevated:
          "bg-(--sys-color-surface-container-low) text-(--sys-color-primary) shadow-(--sys-elevation-level1) hover:shadow-(--sys-elevation-level2) before:bg-(--sys-color-primary) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
        primary:
          "bg-(--sys-color-primary) text-(--sys-color-on-primary) hover:shadow-(--sys-elevation-level1) before:bg-(--sys-color-on-primary) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
        tonal:
          "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) hover:shadow-(--sys-elevation-level1) before:bg-(--sys-color-on-secondary-container) disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38",
        outlined:
          "border border-(--sys-color-outline) text-(--sys-color-primary) before:bg-(--sys-color-primary) focus-visible:border-(--sys-color-primary) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38",
        ghost:
          "text-(--sys-color-primary) before:bg-(--sys-color-primary) disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38",
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
        // M3 Expressive sizes: XS, S (default 40dp), M, L, XL. Kern's `xs`
        // compacts below XS and `sm` sits at the XS band; `md`/`xl`/`lg`
        // step up through M/L. Touch targets stay at the 48dp minimum via
        // the `after:` inset, same as the stock sizes.
        xs: "h-7 gap-1.5 px-3 text-xs after:-inset-2.5 active:rounded-(--sys-shape-corner-small) [&_svg]:size-3.5",
        sm: "h-8 px-4 text-[13px] after:-inset-2 active:rounded-(--sys-shape-corner-small)",
        default:
          "h-10 px-4 after:-inset-1 active:rounded-(--sys-shape-corner-small)",
        md: "h-11 px-5 text-[15px] after:-inset-1 active:rounded-(--sys-shape-corner-medium) [&_svg]:size-5",
        xl: "h-12 px-6 text-base after:-inset-1 active:rounded-(--sys-shape-corner-medium) [&_svg]:size-5",
        lg: "h-14 px-7 text-lg after:-inset-0.5 active:rounded-(--sys-shape-corner-large) [&_svg]:size-6",
        icon: "h-10 w-10 px-0 after:-inset-1 active:rounded-(--sys-shape-corner-small)",
      },
      // Shape: `pill` is M3's round default (full). `rounded` steps down to
      // the large corner (Kern extension). `square` is M3 Expressive's square
      // (12/12/12/16/16/28dp per size) — set per size below since one class
      // cannot vary by size. Toggle-selected morphs round↔square (also per
      // size below).
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
    compoundVariants: [
      // Danger keeps the variant's structure and swaps its roles: fills
      // move to the error roles, treatments that have no fill keep their
      // surface and re-paint their ink. Disabled always wins back to the
      // on-surface washes regardless of danger.
      {
        variant: "primary",
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
        variant: "ghost",
        color: "danger",
        class:
          "text-(--sys-color-error) before:bg-(--sys-color-error) disabled:bg-transparent disabled:text-(--sys-color-on-surface)/38",
      },
      // M3 text buttons use tighter horizontal padding (12px) than the
      // contained treatments (24px). Kern's base sizes are already compact
      // (px-4/16px), so ghost steps one notch tighter per size.
      {
        variant: "ghost",
        size: "xs",
        class: "px-2",
      },
      {
        variant: "ghost",
        size: "sm",
        class: "px-2",
      },
      {
        variant: "ghost",
        size: "default",
        class: "px-3",
      },
      {
        variant: "ghost",
        size: "md",
        class: "px-3",
      },
      {
        variant: "ghost",
        size: "xl",
        class: "px-4",
      },
      {
        variant: "ghost",
        size: "lg",
        class: "px-4",
      },
      // M3 Expressive square shape per size (XS 12 / S 12 / M 16 / L 28 /
      // XL 28). Kern maps xs/sm/default→12, md/xl→16, lg→28.
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
      // M3 Expressive toggle colors (no toggle text button — ghost has no
      // selected treatment). Unselected filled drops to surface-container;
      // selected elevated/tonal/outlined swap to their emphasis pairs.
      {
        variant: "elevated",
        toggle: true,
        selected: true,
        class:
          "bg-(--sys-color-primary) text-(--sys-color-on-primary) before:bg-(--sys-color-on-primary)",
      },
      {
        variant: "primary",
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
        selected: true,
        class:
          "border-transparent bg-(--sys-color-inverse-surface) text-(--sys-color-inverse-on-surface) before:bg-(--sys-color-inverse-on-surface)",
      },
      // M3 Expressive toggle morph: selected round→square per size (and
      // square→round when the resting shape is square).
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
        shape: "square",
        class:
          "rounded-[var(--comp-button-container-shape,var(--sys-shape-corner-full))]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      color: "primary",
      size: "default",
      shape: "pill",
      block: false,
      toggle: false,
      selected: false,
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

export type ButtonSize = "xs" | "default" | "sm" | "md" | "xl" | "lg" | "icon";

/**
 * The shape axis: M3 round (`pill`, the full default), stepped-down corner
 * (`rounded`, Kern extension), or M3 Expressive square (per-size 12–28dp —
 * not 0px). Toggle-selected morphs round↔square automatically.
 */
export type ButtonShape = "pill" | "rounded" | "square";

/** Which side of the label the `icon` slot renders on. */
export type ButtonIconPosition = "start" | "end";

/**
 * R2 size foundation, re-homed (T1): Button sizes onto `KernSize`.
 * `default` renders at md metrics (= M3 S); `xs`/`sm` compact into the `sm`
 * band; `md`/`xl`/`lg` step up. `icon` is shape, not scale, and is
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

type ButtonSharedProps = Omit<
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
  /** Leading (or trailing, with `iconPosition`) icon. Hidden from assistive tech. */
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  /**
   * Mirrors the icon horizontally in RTL contexts (`rtl:scale-x-[-1]`).
   * Opt into it for directional glyphs (arrows, chevrons, back/open cues);
   * symmetric icons must not flip. Per M3's `flip-icon-in-rtl`.
   */
  flipIcon?: boolean;
  /**
   * Soft-disabled: paints the disabled treatment but stays focusable, so the
   * control remains discoverable (toolbar pattern per W3C APG disabled-controls
   * guidance). Unlike `disabled`, it keeps its tab stop and reports
   * `aria-disabled` instead of the `disabled` attribute.
   */
  softDisabled?: boolean;
  /**
   * Renders the button as an M3 Expressive toggle: binary selection with
   * round↔square morph and per-variant selected colors. There is no toggle
   * text button — `toggle` on `ghost` warns in dev and renders unselected.
   * Keep selected/unselected labels a similar length so the layout holds.
   * (`value` stays the form value; toggle state uses `pressed`.)
   */
  toggle?: boolean;
  /** Controlled selected state. Only meaningful with `toggle`. */
  pressed?: boolean;
  /** Initial selected state for the uncontrolled toggle case. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Test selector. Rendered as `data-testid` on the root node (both
   * branches); see `parity/testid-contract.md`. Opt-in only — no default.
   */
  testID?: string;
};

/**
 * Anchor branch — `href` set, `<a>` rendered. The ref accepts only anchors:
 * a button ref here was the lie the union exists to prevent.
 */
export type ButtonAnchorProps = ButtonSharedProps & {
  /**
   * Navigation variant. Renders `<a href>` wearing the button treatment,
   * i.e. `role="link"` — for a dedicated link component see `LinkButton`.
   * A disabled link drops `href`, leaves the tab order and reports
   * `aria-disabled` (the ListItem convention) — links have no `disabled`
   * attribute, so there is nothing native to lean on.
   */
  href: string;
  /** Anchor target. A button has no browsing context to open. */
  target?: ComponentPropsWithRef<"a">["target"];
  /** Anchor relationship list. */
  rel?: string;
  /** Download hint. */
  download?: ComponentPropsWithRef<"a">["download"];
  /** Ref to the rendered anchor. */
  ref?: Ref<HTMLAnchorElement>;
};

/**
 * Button branch — no `href`, `<button>` rendered. Anchor-only attributes
 * are absent by type, not just ignored at render.
 */
export type ButtonButtonProps = ButtonSharedProps & {
  /** No `href` renders the `<button>`. */
  href?: undefined;
  /** Ref to the rendered button. */
  ref?: Ref<HTMLButtonElement>;
  target?: undefined;
  rel?: undefined;
  download?: undefined;
};

/** Discriminated on `href`: the rendered element owns the ref type. */
export type ButtonProps = ButtonAnchorProps | ButtonButtonProps;

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
  flipIcon = false,
  toggle = false,
  pressed,
  defaultPressed = false,
  onPressedChange,
  type = "button",
  value,
  className,
  disabled,
  softDisabled = false,
  children,
  ref,
  testID,
  ...props
}: ButtonProps) {
  // M3 aliases normalize to Kern names once, here — the cva call below only
  // ever sees Kern names, so existing rendering cannot change.
  const variant: ButtonVariant =
    variantInput in BUTTON_VARIANT_ALIASES
      ? BUTTON_VARIANT_ALIASES[variantInput as ButtonM3Variant]
      : (variantInput as ButtonVariant);
  if (process.env.NODE_ENV !== "production" && toggle && variant === "ghost") {
    // There is no toggle text button in M3 — render unselected instead of a
    // selected state the spec never defines.
    console.warn(
      "Button: `toggle` on `ghost` (text) has no M3 selected treatment and renders unselected.",
    );
  }
  const [uncontrolledPressed, setUncontrolledPressed] =
    useState(defaultPressed);
  const isPressed =
    toggle && pressed !== undefined
      ? pressed
      : toggle
        ? uncontrolledPressed
        : false;
  const toggleState = () => {
    if (pressed === undefined) setUncontrolledPressed(!isPressed);
    onPressedChange?.(!isPressed);
  };
  const blocked = disabled || loading || softDisabled;
  const classes = cn(
    buttonVariants({
      variant,
      color,
      size,
      shape,
      block,
      toggle,
      selected: toggle ? isPressed : false,
    }),
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
        className={cn("flex items-center", flipIcon && "rtl:scale-x-[-1]")}
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
    // Toggle anchors keep aria-pressed so assistive tech announces selection
    // state identically to the button variant. `data-selected` mirrors it for
    // styling; the pressed state is never conveyed by visuals alone.
    return (
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: toggle anchor keeps aria-pressed for AT parity with the button variant.
      <a
        data-slot="button"
        data-testid={testID}
        data-loading={loading ? "" : undefined}
        data-selected={toggle && isPressed ? "" : undefined}
        aria-busy={loading || undefined}
        aria-disabled={blocked || undefined}
        aria-pressed={toggle ? isPressed : undefined}
        tabIndex={blocked ? -1 : undefined}
        href={blocked ? undefined : href}
        target={target}
        rel={rel}
        download={download}
        ref={(node) => {
          assignRef(ref, node);
        }}
        className={classes}
        // The cast only re-types the shared remainder (`aria-*`, `autoFocus`,
        // `onFocus`, …) — button-only keys were stripped above.
        {...(anchorProps as unknown as ComponentPropsWithRef<"a">)}
        onClick={(event) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          if (toggle) toggleState();
          anchorClick?.(event);
        }}
      >
        {content}
      </a>
    );
  }

  const { onClick: rawOnClick, ...restProps } = props;
  return (
    <button
      data-slot="button"
      data-testid={testID}
      data-loading={loading ? "" : undefined}
      data-selected={toggle && isPressed ? "" : undefined}
      aria-busy={loading || undefined}
      aria-disabled={blocked || undefined}
      aria-pressed={toggle ? isPressed : undefined}
      className={classes}
      type={type}
      value={value}
      disabled={disabled || loading || undefined}
      ref={(node) => {
        assignRef(ref, node);
      }}
      {...restProps}
      onClick={(event) => {
        // Soft-disabled keeps its tab stop but must not activate — the
        // native `disabled` attribute is deliberately absent, so guard here.
        if (softDisabled) {
          event.preventDefault();
          return;
        }
        if (toggle) toggleState();
        (rawOnClick as React.MouseEventHandler<HTMLButtonElement>)?.(event);
      }}
    >
      {content}
    </button>
  );
}

export { buttonVariants };
