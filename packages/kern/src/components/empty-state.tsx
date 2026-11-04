import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../utils/cn";

export type EmptyStateVariant = "page" | "section" | "list-row" | "chat";

const VARIANT_CLASSES: Record<EmptyStateVariant, string> = {
  // Full-view zero-data state: generous padding, centered, wide measure.
  page: "px-6 py-12",
  // Card/section zero-data state: same centered composition, tighter.
  section: "px-6 py-8",
  // Inside a list: compact; the row above/below already gives rhythm.
  "list-row": "px-4 py-4",
  // Inside a thread: most compact; sits in the message flow.
  chat: "px-4 py-6",
};

export type EmptyStateProps = ComponentPropsWithRef<"div"> & {
  /** Visual slot: a KernIcon-registry icon or illustration. Never raw lucide. */
  visual?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Primary recovery action (usually a Button). */
  action?: ReactNode;
  /**
   * Primary recovery action — the `action` name stays as its alias.
   * Pair with `secondaryAction` for retry/contact-support compositions.
   */
  primaryAction?: ReactNode;
  /** Secondary action rendered beside the primary (usually a ghost LinkButton). */
  secondaryAction?: ReactNode;
  /**
   * Placement variant (KernEmpty, CL-011): `page` | `section` |
   * `list-row` | `chat`. Only metrics change — one component, not four.
   */
  variant?: EmptyStateVariant;
};

/**
 * KernEmpty — the ONE zero-data placeholder (CL-011): visual, title,
 * description, primary + secondary actions. Variants are placements, not
 * components: every list/detail/chat/auth empty in every app is this
 * component with a variant, never a local copy (the raw-hex desk-mobile
 * copies die in transfer — they live platform-side, out of Kern scope).
 *
 * Usage: `<EmptyState variant="section" title="No results" description="…"
 * primaryAction={<Button>Retry</Button>} />`.
 * Props table: `visual` (KernIcon node) · `title` · `description` ·
 * `primaryAction` (`action` alias) · `secondaryAction` ·
 * `variant` page|section|list-row|chat.
 */
export function EmptyState({
  visual,
  title,
  description,
  action,
  primaryAction,
  secondaryAction,
  variant = "page",
  className,
  ...props
}: EmptyStateProps) {
  const primary = primaryAction ?? action;
  return (
    <div
      data-slot="empty-state"
      data-variant={variant}
      className={cn(
        "kern-empty-state flex flex-col items-center gap-2 text-center",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {visual ? (
        <div
          data-slot="empty-state-visual"
          aria-hidden="true"
          className="kern-empty-state-visual mb-2 text-(--sys-color-on-surface-variant)"
        >
          {visual}
        </div>
      ) : null}
      <p
        data-slot="empty-state-title"
        className="kern-empty-state-title text-(length:--sys-typescale-title-large-font-size) font-medium text-(--sys-color-on-surface)"
      >
        {title}
      </p>
      {description ? (
        <p
          data-slot="empty-state-description"
          className="kern-empty-state-description max-w-sm text-sm text-(--sys-color-on-surface-variant)"
        >
          {description}
        </p>
      ) : null}
      {primary || secondaryAction ? (
        <div
          data-slot="empty-state-action"
          className="kern-empty-state-action mt-2 flex flex-wrap items-center justify-center gap-2"
        >
          {primary}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
