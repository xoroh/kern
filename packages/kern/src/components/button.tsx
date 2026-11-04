import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { LoadingIndicatorStyle } from "@xoroh/kern-m3";
import type { VariantProps } from "class-variance-authority";
import {
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
  useState,
} from "react";
import { assignRef } from "../utils/assignRef";
import { cn } from "../utils/cn";
import {
  BUTTON_EXPRESSIVE_SIZE_LADDER,
  BUTTON_SIZE_TO_KERN_SIZE,
  BUTTON_SIZES_ORDERED,
  createButtonVariants,
} from "./button-shared";
import { CircularProgress } from "./circular-progress";

const buttonVariants = createButtonVariants({
  morphOnPress: true,
  morphOnToggle: true,
});

// Keep the `defaultVariants` AST node in `button.tsx` for `generate-props.mjs`.
const _buttonDefaultVariants = {
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
void _buttonDefaultVariants;

type ButtonCvaProps = VariantProps<typeof buttonVariants>;

export type ButtonVariant = NonNullable<ButtonCvaProps["variant"]>;

/** The color axis: M3 emphasis (`primary`) or the error treatment (`danger`). */
export type ButtonColor = NonNullable<ButtonCvaProps["color"]>;

/**
 * Kern button size keys, ordered by ascending container height (D1024 C2):
 * `xs` (28px compact) | `sm` (32px, M3 XS) | `default` (40px, M3 S) |
 * `md` (44px) | `xl` (48px) | `lg` (56px, M3 M) | `2xl` (96px, M3 L) |
 * `3xl` (136px, M3 XL) | `icon` (40×40px).
 */
export type ButtonSize =
  | "xs"
  | "sm"
  | "default"
  | "md"
  | "xl"
  | "lg"
  | "2xl"
  | "3xl"
  | "icon";

/**
 * The shape axis: M3 round (`pill`, the full default), stepped-down corner
 * (`rounded`, Kern extension), or M3 Expressive square (per-size 12–28dp —
 * not 0px). Toggle-selected morphs round↔square automatically.
 */
export type ButtonShape = NonNullable<ButtonCvaProps["shape"]>;

/** Which side of the label the `icon` slot renders on. */
export type ButtonIconPosition = "start" | "end";

export {
  BUTTON_EXPRESSIVE_SIZE_LADDER,
  BUTTON_SIZE_TO_KERN_SIZE,
  BUTTON_SIZES_ORDERED,
};

type ButtonDesignProps = {
  variant?: ButtonVariant;
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
   * text button — `toggle` on `text` warns in dev and renders unselected.
   * Keep selected/unselected labels a similar length so the layout holds.
   * (`value` stays the form value; toggle state uses `pressed`.)
   */
  toggle?: boolean;
  /** Controlled selected state. Only meaningful with `toggle`. */
  pressed?: boolean;
  /** Initial selected state for the uncontrolled toggle case. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Disabled treatment for either the button or anchor branch. */
  disabled?: boolean;
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
export type ButtonAnchorProps = Omit<
  ComponentPropsWithRef<"a">,
  "ref" | "size" | "color"
> &
  ButtonDesignProps & {
    /**
     * Navigation variant. Renders `<a href>` wearing the button treatment,
     * i.e. `role="link"` — for a dedicated link component see `LinkButton`.
     * A disabled link drops `href`, leaves the tab order and reports
     * `aria-disabled` (the ListItem convention) — links have no `disabled`
     * attribute, so there is nothing native to lean on.
     */
    href: string;
    /** Button submission attributes have no meaning on a link. */
    type?: undefined;
    value?: undefined;
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
export type ButtonButtonProps = Omit<
  ComponentPropsWithRef<"button">,
  "size" | "ref" | "color" | "disabled"
> &
  ButtonDesignProps & {
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

function anchorDOMProps({
  variant: _variant,
  size: _size,
  color: _color,
  shape: _shape,
  block: _block,
  loading: _loading,
  loadingValue: _loadingValue,
  loaderStyle: _loaderStyle,
  icon: _icon,
  iconPosition: _iconPosition,
  flipIcon: _flipIcon,
  softDisabled: _softDisabled,
  toggle: _toggle,
  pressed: _pressed,
  defaultPressed: _defaultPressed,
  onPressedChange: _onPressedChange,
  disabled: _disabled,
  testID: _testID,
  href: _href,
  type: _type,
  value: _value,
  target: _target,
  rel: _rel,
  download: _download,
  ref: _ref,
  onClick: _onClick,
  className: _className,
  children: _children,
  ...domProps
}: ButtonAnchorProps) {
  void [
    _variant,
    _size,
    _color,
    _shape,
    _block,
    _loading,
    _loadingValue,
    _loaderStyle,
    _icon,
    _iconPosition,
    _flipIcon,
    _softDisabled,
    _toggle,
    _pressed,
    _defaultPressed,
    _onPressedChange,
    _disabled,
    _testID,
    _href,
    _type,
    _value,
    _target,
    _rel,
    _download,
    _ref,
    _onClick,
    _className,
    _children,
  ];
  return domProps;
}

function buttonDOMProps({
  variant: _variant,
  size: _size,
  color: _color,
  shape: _shape,
  block: _block,
  loading: _loading,
  loadingValue: _loadingValue,
  loaderStyle: _loaderStyle,
  icon: _icon,
  iconPosition: _iconPosition,
  flipIcon: _flipIcon,
  softDisabled: _softDisabled,
  toggle: _toggle,
  pressed: _pressed,
  defaultPressed: _defaultPressed,
  onPressedChange: _onPressedChange,
  disabled: _disabled,
  testID: _testID,
  href: _href,
  target: _target,
  rel: _rel,
  download: _download,
  type: _type,
  value: _value,
  ref: _ref,
  onClick: _onClick,
  className: _className,
  children: _children,
  ...domProps
}: ButtonButtonProps) {
  void [
    _variant,
    _size,
    _color,
    _shape,
    _block,
    _loading,
    _loadingValue,
    _loaderStyle,
    _icon,
    _iconPosition,
    _flipIcon,
    _softDisabled,
    _toggle,
    _pressed,
    _defaultPressed,
    _onPressedChange,
    _disabled,
    _testID,
    _href,
    _target,
    _rel,
    _download,
    _type,
    _value,
    _ref,
    _onClick,
    _className,
    _children,
  ];
  return domProps;
}

/**
 * Primary action control. Five M3 configurations (`elevated`, `filled`,
 * `tonal`, `outlined`, `text`), with `color="danger"` for destructive actions
 * and `href` for navigation wearing the button treatment.
 */
export function Button(rawProps: ButtonProps) {
  const {
    className,
    variant = "filled",
    size = "default",
    color = "primary",
    shape = "pill",
    block = false,
    loading = false,
    loadingValue,
    loaderStyle,
    icon,
    iconPosition = "start",
    flipIcon = false,
    softDisabled = false,
    toggle = false,
    pressed,
    defaultPressed,
    disabled = false,
    testID,
    children,
  } = rawProps;

  const [uncontrolledPressed, setUncontrolledPressed] = useState(
    defaultPressed ?? false,
  );

  // M3 has no toggle text button — `toggle` on `text` warns in dev and
  // renders unselected so the text variant never picks up toggle paint.
  if (process.env.NODE_ENV !== "production" && toggle && variant === "text") {
    console.warn(
      'Button: `toggle` is not supported on `variant="text"` — M3 defines no toggle text button. Rendering unselected.',
    );
  }
  const isToggle = toggle && variant !== "text";
  const resolvedSelected = isToggle ? (pressed ?? uncontrolledPressed) : false;
  const blocked = disabled || loading || softDisabled;

  // Soft-disabled paints the same 12% container / 38% ink split as native
  // `disabled`, keyed on `aria-disabled` because the `disabled` attribute is
  // intentionally omitted so the control stays in the tab order.
  const softDisabledClasses = softDisabled
    ? variant === "outlined"
      ? "aria-disabled:border-(--sys-color-on-surface)/12 aria-disabled:bg-transparent aria-disabled:text-(--sys-color-on-surface)/38"
      : variant === "text"
        ? "aria-disabled:bg-transparent aria-disabled:text-(--sys-color-on-surface)/38"
        : "aria-disabled:bg-(--sys-color-on-surface)/12 aria-disabled:text-(--sys-color-on-surface)/38"
    : undefined;

  const classesFor = (isSelected: boolean) =>
    cn(
      buttonVariants({
        variant,
        size,
        color,
        shape,
        block,
        toggle: isToggle,
        selected: isToggle && isSelected,
      }),
      softDisabledClasses,
      className,
    );

  const iconNode = loading ? (
    <CircularProgress
      value={loadingValue}
      loaderStyle={loaderStyle}
      size="sm"
      label="Loading"
      aria-hidden="true"
    />
  ) : icon ? (
    <span
      data-slot="button-icon"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center",
        flipIcon && "rtl:scale-x-[-1]",
      )}
    >
      {icon}
    </span>
  ) : null;

  const content = (
    <>
      {iconPosition === "start" ? iconNode : null}
      {children}
      {iconPosition === "end" ? iconNode : null}
    </>
  );

  const handlePressedChange = (next: boolean) => {
    if (pressed === undefined) {
      setUncontrolledPressed(next);
    }
    rawProps.onPressedChange?.(next);
  };

  if (toggle) {
    if (rawProps.href !== undefined) {
      const anchorElProps = anchorDOMProps(rawProps);
      return (
        <TogglePrimitive
          nativeButton={false}
          render={
            <a
              // biome-ignore lint/a11y/noRedundantRoles: overrides the primitive's role="button"; without it anchors announce as buttons.
              role="link"
              href={blocked ? undefined : rawProps.href}
              target={rawProps.target}
              rel={rawProps.rel}
              download={rawProps.download}
              tabIndex={blocked ? -1 : undefined}
              {...anchorElProps}
            />
          }
          pressed={pressed}
          defaultPressed={defaultPressed}
          onPressedChange={handlePressedChange}
          disabled={disabled || loading || undefined}
          data-slot="button"
          data-testid={testID}
          data-loading={loading ? "" : undefined}
          data-selected={resolvedSelected ? "" : undefined}
          aria-busy={loading || undefined}
          aria-disabled={blocked || undefined}
          className={(state) => classesFor(state.pressed)}
          ref={(node) => {
            assignRef(
              rawProps.ref,
              node as unknown as HTMLAnchorElement | null,
            );
          }}
          onClick={(event) => {
            if (blocked || softDisabled) {
              event.preventDefault();
              return;
            }
            rawProps.onClick?.(
              event as unknown as React.MouseEvent<HTMLAnchorElement>,
            );
          }}
        >
          {content}
        </TogglePrimitive>
      );
    }
    const toggleButtonProps = buttonDOMProps(rawProps);
    return (
      <TogglePrimitive
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={handlePressedChange}
        disabled={disabled || loading || undefined}
        data-slot="button"
        data-testid={testID}
        data-loading={loading ? "" : undefined}
        data-selected={resolvedSelected ? "" : undefined}
        aria-busy={loading || undefined}
        aria-disabled={blocked || undefined}
        className={(state) => classesFor(state.pressed)}
        type={rawProps.type ?? "button"}
        ref={(node) => {
          assignRef(rawProps.ref, node);
        }}
        {...toggleButtonProps}
        onClick={(event) => {
          if (softDisabled) {
            event.preventDefault();
            return;
          }
          rawProps.onClick?.(event);
        }}
      >
        {content}
      </TogglePrimitive>
    );
  }

  if (rawProps.href !== undefined) {
    const anchorElProps = anchorDOMProps(rawProps);
    return (
      <ButtonPrimitive
        nativeButton={false}
        render={
          <a
            // biome-ignore lint/a11y/noRedundantRoles: overrides the primitive's role="button"; without it anchors announce as buttons.
            role="link"
            href={blocked ? undefined : rawProps.href}
            target={rawProps.target}
            rel={rawProps.rel}
            download={rawProps.download}
            tabIndex={blocked ? -1 : undefined}
            {...anchorElProps}
          />
        }
        disabled={disabled || loading || undefined}
        data-slot="button"
        data-testid={testID}
        data-loading={loading ? "" : undefined}
        aria-busy={loading || undefined}
        aria-disabled={blocked || undefined}
        className={classesFor(false)}
        ref={(node) => {
          assignRef(rawProps.ref, node as unknown as HTMLAnchorElement | null);
        }}
        onClick={(event) => {
          if (blocked) {
            event.preventDefault();
            return;
          }
          rawProps.onClick?.(
            event as unknown as React.MouseEvent<HTMLAnchorElement>,
          );
        }}
      >
        {content}
      </ButtonPrimitive>
    );
  }

  const buttonProps = buttonDOMProps(rawProps);
  return (
    <ButtonPrimitive
      data-slot="button"
      data-testid={testID}
      data-loading={loading ? "" : undefined}
      aria-busy={loading || undefined}
      aria-disabled={blocked || undefined}
      className={classesFor(false)}
      type={rawProps.type ?? "button"}
      value={rawProps.value}
      disabled={disabled || loading || undefined}
      ref={(node) => {
        assignRef(rawProps.ref, node as unknown as HTMLButtonElement | null);
      }}
      {...buttonProps}
      onClick={(event) => {
        if (softDisabled) {
          event.preventDefault();
          return;
        }
        rawProps.onClick?.(event);
      }}
    >
      {content}
    </ButtonPrimitive>
  );
}

export { buttonVariants };
