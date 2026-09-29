import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";

export type EmptyStateProps = ComponentPropsWithRef<"div"> & {
  /** Visual slot: icon, illustration, or Loader. */
  visual?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Primary recovery action (usually a Button). */
  action?: ReactNode;
};

/** Zero-data placeholder: visual, title, description, and one action. */
export function EmptyState({
  visual,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "kern-empty-state flex flex-col items-center gap-2 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {visual ? (
        <div
          data-slot="empty-state-visual"
          aria-hidden="true"
          className="kern-empty-state-visual mb-2 text-(--md-sys-color-on-surface-variant)"
        >
          {visual}
        </div>
      ) : null}
      <p
        data-slot="empty-state-title"
        className="kern-empty-state-title text-(length:--md-sys-typescale-title-large-font-size) font-medium text-(--md-sys-color-on-surface)"
      >
        {title}
      </p>
      {description ? (
        <p
          data-slot="empty-state-description"
          className="kern-empty-state-description max-w-sm text-sm text-(--md-sys-color-on-surface-variant)"
        >
          {description}
        </p>
      ) : null}
      {action ? (
        <div
          data-slot="empty-state-action"
          className="kern-empty-state-action mt-2"
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}
