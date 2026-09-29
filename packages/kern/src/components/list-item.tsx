import type { ComponentPropsWithRef, ReactNode } from "react";
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
};

/** One list row: optional leading/trailing slots around headline text. */
export function ListItem({
  headline,
  supporting,
  leading,
  trailing,
  className,
  ...props
}: ListItemProps) {
  return (
    <li
      data-slot="list-item"
      className={cn(
        "kern-list-item flex min-h-12 items-center gap-3 px-4 py-2 text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    >
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
    </li>
  );
}
