import type { ComponentPropsWithRef, MouseEvent, ReactNode } from "react";
import { cn } from "../utils/cn";

export type ListItemProps = Omit<ComponentPropsWithRef<"li">, "children"> & {
  /** Primary line. */
  headline: ReactNode;
  /** Secondary line below the headline. */
  supporting?: ReactNode;
  /** Leading slot: Avatar, icon, or Checkbox. */
  leading?: ReactNode;
  /** Trailing slot: metadata, Switch, or action. */
  trailing?: ReactNode;
  /**
   * Interactive variant. Passing `onPress` (or `href`) makes the row a
   * CONTROL rather than a display row: it renders a real `<button>` or
   * `<a href>`, so it carries control semantics and is keyboard-operable
   * instead of being a bare `<li>` that merely looks clickable.
   *
   * `href` wins when both are passed (navigation is the stronger intent) and
   * the handler still runs. Matches the native renderer, where `onPress`
   * implies `accessibilityRole="button"` and a static row is `"none"` — see
   * `docs/parity-contract.md`.
   */
  onPress?: () => void;
  /** Navigation variant. Renders `<a href>`, i.e. `role="link"`. */
  href?: string;
  /** Disables the interactive row: a button is natively disabled; a link gets
   *  `aria-disabled`, leaves the tab order, and does not navigate. */
  disabled?: boolean;
  /** Extra props for the control element when interactive. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

const rowClass =
  "kern-list-item flex min-h-12 w-full items-center gap-3 px-4 py-2 text-left text-(--md-sys-color-on-surface)";

/** One list row: optional leading/trailing slots around headline text.
 *
 *  Static by default — a `<li>` with `role="listitem"`, stated rather than
 *  implicit so the role can be asserted and cannot silently regress. Pass
 *  `onPress` for an actionable row or `href` for a navigational one and the
 *  row becomes a control: `<button>` (`role="button"`) or `<a href>`
 *  (`role="link"`). The wrapper `<li>` is then `role="none"`, so assistive
 *  tech lands on the control rather than announcing "list item, button" —
 *  the same sentence twice. */
export function ListItem({
  headline,
  supporting,
  leading,
  trailing,
  className,
  onPress,
  href,
  disabled = false,
  onClick,
  ...props
}: ListItemProps) {
  const body = (
    <>
      {leading ? (
        <span
          data-slot="list-item-leading"
          aria-hidden="true"
          className="kern-list-item-leading flex shrink-0 items-center"
        >
          {leading}
        </span>
      ) : null}
      <span className="kern-list-item-text flex min-w-0 flex-1 flex-col">
        <span className="kern-list-item-headline truncate text-sm">
          {headline}
        </span>
        {supporting ? (
          <span className="kern-list-item-supporting truncate text-xs text-(--md-sys-color-on-surface-variant)">
            {supporting}
          </span>
        ) : null}
      </span>
      {trailing ? (
        <span
          data-slot="list-item-trailing"
          className="kern-list-item-trailing flex shrink-0 items-center gap-2 text-xs text-(--md-sys-color-on-surface-variant)"
        >
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (!href && !onPress) {
    return (
      <li
        data-slot="list-item"
        // biome-ignore lint/a11y/noRedundantRoles: the role is redundant on a bare `<li>` and that is exactly why it is stated. The static/interactive split is half of the list-item contract, and an inherited role cannot be asserted or regressed on — swapping this element for a `<div>` leaves a role query green. Stating it makes the mapping to native's `accessibilityRole="none"` checkable.
        role="listitem"
        className={cn(rowClass, className)}
        {...props}
      >
        {body}
      </li>
    );
  }

  // Interactive. A real control element, so activation, focus and the disabled
  // semantics are the platform's rather than re-implemented here.
  const interactiveClass = cn(
    rowClass,
    "cursor-pointer appearance-none border-0 bg-transparent outline-none transition-colors",
    "hover:bg-(--md-sys-color-surface-container-low)",
    "focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary)",
    disabled && "pointer-events-none cursor-default hover:bg-transparent",
    className,
  );

  if (href) {
    return (
      <li data-slot="list-item" role="none">
        <a
          data-slot="list-item-action"
          href={disabled ? undefined : href}
          aria-disabled={disabled ? "true" : undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault();
              return;
            }
            onPress?.();
            onClick?.(event);
          }}
          className={interactiveClass}
        >
          {body}
        </a>
      </li>
    );
  }

  return (
    <li data-slot="list-item" role="none">
      <button
        type="button"
        data-slot="list-item-action"
        disabled={disabled}
        onClick={(event) => {
          onPress?.();
          onClick?.(event);
        }}
        className={interactiveClass}
      >
        {body}
      </button>
    </li>
  );
}
